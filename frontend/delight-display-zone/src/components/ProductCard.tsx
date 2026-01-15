import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '@/context/StoreContext';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { cn, getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, addToWishlist, state, removeFromWishlist } = useStore();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [flyingItem, setFlyingItem] = useState<{ x: number; y: number; targetX: number; targetY: number } | null>(null);
  
  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get positions for flying animation
    const button = e.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const cartIcon = document.querySelector('[data-cart-icon]');
    const cartRect = cartIcon?.getBoundingClientRect();
    
    if (cartRect) {
      setFlyingItem({
        x: buttonRect.left + buttonRect.width / 2 - 25,
        y: buttonRect.top - 50,
        targetX: cartRect.left + cartRect.width / 2 - 25,
        targetY: cartRect.top + cartRect.height / 2 - 25,
      });
      setTimeout(() => setFlyingItem(null), 700);
    }
    
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 600);
    
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist", description: `${product.name} removed.` });
    } else {
      addToWishlist(product);
      toast({ title: "Added to wishlist", description: `${product.name} added.` });
    }
  };

  return (
    <>
      {/* Flying item animation - rendered outside card */}
      <AnimatePresence>
        {flyingItem && (
          <motion.div
            className="fixed z-[9999] pointer-events-none"
            initial={{ 
              left: flyingItem.x, 
              top: flyingItem.y, 
              scale: 1, 
              opacity: 1 
            }}
            animate={{ 
              left: flyingItem.targetX, 
              top: flyingItem.targetY, 
              scale: 0.3, 
              opacity: 0.8 
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="w-[50px] h-[50px] rounded-full bg-primary shadow-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`} className="group block">
          <motion.div 
            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary mb-4 shadow-md"
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
            transition={{ duration: 0.3 }}
          >
            {/* Image with zoom effect */}
            <motion.img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            
            {/* Gradient overlay on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.new && (
                <motion.span 
                  className="px-2.5 py-1 text-xs font-medium bg-foreground text-background rounded-full"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08 + 0.2 }}
                >
                  New
                </motion.span>
              )}
              {discount > 0 && (
                <motion.span 
                  className="px-2.5 py-1 text-xs font-medium bg-red-500 text-white rounded-full"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08 + 0.3 }}
                >
                  -{discount}%
                </motion.span>
              )}
            </div>

            {/* Quick Actions */}
            <motion.div 
              className="absolute top-3 right-3 flex flex-col gap-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Wishlist Button */}
              <motion.div className="relative">
                <motion.button
                  className={cn(
                    "w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors",
                    isInWishlist ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
                  )}
                  onClick={handleWishlist}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={cn("w-5 h-5", isInWishlist && "fill-current")} />
                </motion.button>
                
                {/* Heart burst */}
                <AnimatePresence>
                  {isAnimating && !isInWishlist && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute top-1/2 left-1/2 pointer-events-none"
                          initial={{ scale: 0, x: '-50%', y: '-50%' }}
                          animate={{
                            scale: [0, 1, 0],
                            x: `calc(-50% + ${Math.cos(i * 60 * Math.PI / 180) * 25}px)`,
                            y: `calc(-50% + ${Math.sin(i * 60 * Math.PI / 180) * 25}px)`,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Quick View Button */}
              <motion.button
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  "w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg",
                  product.inStock 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
                whileHover={product.inStock ? { scale: 1.02 } : {}}
                whileTap={product.inStock ? { scale: 0.98 } : {}}
              >
                <motion.div
                  animate={isCartAnimating ? { rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                </motion.div>
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Product Info */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{product.rating}</span>
              <span>·</span>
              <span>{product.reviews} reviews</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
}
