import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-5 h-5', text: 'text-lg', jewel: 'w-1 h-1' },
    md: { icon: 'w-7 h-7', text: 'text-xl lg:text-2xl', jewel: 'w-1.5 h-1.5' },
    lg: { icon: 'w-9 h-9', text: 'text-2xl lg:text-3xl', jewel: 'w-2 h-2' },
  };

  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, -5, 0] }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            y: [0, -2, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Crown className={`${sizes[size].icon} text-primary`} strokeWidth={2.5} />
        </motion.div>
        
        {/* Animated jewel/sparkle */}
        <motion.div 
          className={`absolute -top-0.5 left-1/2 -translate-x-1/2 ${sizes[size].jewel} bg-amber-400 rounded-full`}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Sparkle effects */}
        <motion.div
          className="absolute -top-1 -right-1 w-1 h-1 bg-amber-300 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-0 -left-1 w-0.5 h-0.5 bg-amber-200 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </motion.div>
      
      {showText && (
        <motion.span 
          className={`${sizes[size].text} font-bold tracking-tight`}
          whileHover={{ scale: 1.02 }}
        >
          <motion.span 
            className="text-primary inline-block"
            animate={{ 
              textShadow: [
                "0 0 0px rgba(var(--primary), 0)",
                "0 0 8px rgba(234, 179, 8, 0.3)",
                "0 0 0px rgba(var(--primary), 0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Royal
          </motion.span>
          <span className="text-foreground"> Mart</span>
        </motion.span>
      )}
    </Link>
  );
}
