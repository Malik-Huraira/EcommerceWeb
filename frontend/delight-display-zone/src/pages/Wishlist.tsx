import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';

export default function Wishlist() {
  const { state, removeFromWishlist, addToCart } = useStore();
  const { wishlist } = state;
  const { toast } = useToast();

  const handleAddToCart = async (product: typeof wishlist[0]) => {
    await addToCart(product);
    toast({ title: 'Added to cart', description: `${product.name} added to your cart.` });
  };

  const handleRemove = async (productId: string, productName: string) => {
    await removeFromWishlist(productId);
    toast({ title: 'Removed from wishlist', description: `${productName} removed from your wishlist.` });
  };

  if (wishlist.length === 0) {
    return (
      <Layout>
        <div className="container py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">Save items you love by clicking the heart icon on any product.</p>
            <Link to="/products"><Button size="lg" className="gap-2">Browse Products<ArrowRight className="w-4 h-4" /></Button></Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-card rounded-xl border border-border overflow-hidden"
            >
              <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {product.originalPrice && (
                  <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
                {product.new && (
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-foreground text-background rounded-full">New</span>
                )}
              </Link>
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium mb-2 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-semibold">${product.price}</span>
                  {product.originalPrice && <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 gap-2" size="sm" onClick={() => handleAddToCart(product)} disabled={!product.inStock}>
                    <ShoppingCart className="w-4 h-4" />{product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button variant="outline" size="icon" className="shrink-0" onClick={() => handleRemove(product.id, product.name)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
