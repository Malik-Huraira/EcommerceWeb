package com.delightdisplay.service;

import com.delightdisplay.dto.auth.*;
import com.delightdisplay.entity.Cart;
import com.delightdisplay.entity.PasswordResetToken;
import com.delightdisplay.entity.User;
import com.delightdisplay.entity.Wishlist;
import com.delightdisplay.exception.BadRequestException;
import com.delightdisplay.repository.CartRepository;
import com.delightdisplay.repository.PasswordResetTokenRepository;
import com.delightdisplay.repository.UserRepository;
import com.delightdisplay.repository.WishlistRepository;
import com.delightdisplay.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
        private final UserRepository userRepository;
        private final CartRepository cartRepository;
        private final WishlistRepository wishlistRepository;
        private final PasswordResetTokenRepository passwordResetTokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final UserDetailsService userDetailsService;
        private final EmailService emailService;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BadRequestException("Email already registered");
                }

                User user = User.builder()
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .name(request.getName())
                                .phone(request.getPhone())
                                .address(request.getAddress())
                                .role(User.Role.CUSTOMER)
                                .enabled(true)
                                .build();

                user = userRepository.save(user);

                // Create cart for user
                Cart cart = Cart.builder().user(user).build();
                cartRepository.save(cart);

                // Create wishlist for user
                Wishlist wishlist = Wishlist.builder().user(user).build();
                wishlistRepository.save(wishlist);

                // Send welcome email
                emailService.sendWelcomeEmail(user);

                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                String token = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                                .token(token)
                                .type("Bearer")
                                .id(String.valueOf(user.getId()))
                                .email(user.getEmail())
                                .name(user.getName())
                                .avatar(user.getAvatar())
                                .role(user.getRole().name())
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new BadRequestException("User not found"));

                if (!user.isEnabled()) {
                        throw new BadRequestException("Account is disabled");
                }

                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                String token = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                                .token(token)
                                .type("Bearer")
                                .id(String.valueOf(user.getId()))
                                .email(user.getEmail())
                                .name(user.getName())
                                .avatar(user.getAvatar())
                                .role(user.getRole().name())
                                .build();
        }

        @Transactional
        public void forgotPassword(ForgotPasswordRequest request) {
                User user = userRepository.findByEmail(request.getEmail()).orElse(null);

                // Always return success to prevent email enumeration
                if (user == null) {
                        return;
                }

                // Delete any existing tokens for this user
                passwordResetTokenRepository.deleteByUserId(user.getId());

                // Create new token
                String token = UUID.randomUUID().toString();
                PasswordResetToken resetToken = PasswordResetToken.builder()
                                .token(token)
                                .user(user)
                                .expiresAt(LocalDateTime.now().plusHours(1))
                                .build();
                passwordResetTokenRepository.save(resetToken);

                // Send email
                emailService.sendPasswordResetEmail(user, token);
        }

        @Transactional
        public void resetPassword(ResetPasswordRequest request) {
                PasswordResetToken resetToken = passwordResetTokenRepository
                                .findByTokenAndUsedFalse(request.getToken())
                                .orElseThrow(() -> new BadRequestException("Invalid or expired token"));

                if (resetToken.isExpired()) {
                        throw new BadRequestException("Token has expired");
                }

                User user = resetToken.getUser();
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(user);

                resetToken.setUsed(true);
                passwordResetTokenRepository.save(resetToken);
        }
}
