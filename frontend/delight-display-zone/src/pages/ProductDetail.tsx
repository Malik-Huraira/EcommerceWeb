import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, Star, Truck, RefreshCw, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';
import { Layout } from '@/components/layout/Layout';
import { useStore, Product } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import api, { ProductDto, ReviewDto } from '@/services/api';
import { cn, getImageUrl } from '@/lib/utils';
import { ReviewForm } from '@/components/ReviewForm';

function mapProductDtoToProduct(dto: ProductDto): Product {
  return {
    id: dto.id, name: dto.name, price: dto.price, originalPrice: dto.originalPrice,
    image: getImageUrl(dto.image), images: dto.images?.map(getImageUrl), category: dto.category, description: dto.description,
    rating: dto.rating, reviews: dto.reviews, inStock: dto.inStock, stockCount: dto.stockCount,
    tags: dto.tags, featured: dto.featured, new: dto.isNew,
  };
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const { addToCart, addToWishlist, state, removeFromWishlist } = useStore();
  const { toast } = useToast();

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const reviewsData = await api.getProductReviews(id);
      setReviews(reviewsData.content);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const productData = await api.getProductById(id);
        const mappedProduct = mapProductDtoToProduct(productData);
        setProduct(mappedProduct);
        // Fetch related products
        const allProducts = await api.getProducts({ category: productData.category, size: 5 });
        setRelatedProducts(allProducts.content.filter(p => p.id !== id).slice(0, 4).map(mapProductDtoToProduct));
        // Fetch reviews
        await fetchReviews();
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    setSelectedImage(0);
    setQuantity(1);
    setImageError(false);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="animate-pulse"><div className="bg-secondary aspect-[3/4] rounded-2xl" /></div>
            <div className="animate-pulse space-y-4 lg:py-4">
              <div className="h-4 bg-secondary rounded w-1/4" />
              <div className="h-8 bg-secondary rounded w-3/4" />
              <div className="h-4 bg-secondary rounded w-1/2" />
              <div className="h-6 bg-secondary rounded w-1/4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products"><Button>Back to Products</Button></Link>
        </div>
      </Layout>
    );
  }

  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) { await addToCart(product); }
    toast({ title: "Added to cart", description: `${quantity}x ${product.name} added to your cart.` });
  };

  const handleWishlist = async () => {
    if (isInWishlist) {
      await removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist", description: `${product.name} removed from your wishlist.` });
    } else {
      await addToWishlist(product);
      toast({ title: "Added to wishlist", description: `${product.name} added to your wishlist.` });
    }
  };


  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground transition-colors">{product.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary">
              <img 
                src={imageError ? '/placeholder.svg' : images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              {product.new && <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded-full">New</span>}
              {product.originalPrice && <span className="absolute top-4 right-4 px-3 py-1.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={cn("w-20 h-24 rounded-lg overflow-hidden border-2 transition-all", selectedImage === idx ? "border-primary" : "border-transparent hover:border-border")}>
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:py-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating) ? "fill-warning text-warning" : "fill-muted text-muted")} />)}
              </div>
              <span className="text-sm">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.originalPrice && <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
            <div className="mb-8">
              {product.inStock ? (
                <p className="text-success flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-success" />In Stock ({product.stockCount} available)</p>
              ) : (
                <p className="text-destructive flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-destructive" />Out of Stock</p>
              )}
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="w-4 h-4" /></Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.stockCount || 10, quantity + 1))} disabled={quantity >= (product.stockCount || 10)}><Plus className="w-4 h-4" /></Button>
              </div>
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>Add to Cart - ${(product.price * quantity).toFixed(2)}</Button>
              <Button variant="outline" size="lg" onClick={handleWishlist}><Heart className={cn("w-5 h-5", isInWishlist && "fill-primary text-primary")} /></Button>
            </div>
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border">
              {[{ icon: Truck, title: 'Free Shipping', desc: 'Orders over $100' }, { icon: RefreshCw, title: 'Easy Returns', desc: '30-day returns' }, { icon: Shield, title: 'Secure', desc: 'SSL encrypted' }].map((item) => (
                <div key={item.title} className="text-center"><item.icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" /><p className="text-xs font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
              ))}
            </div>
            {product.tags && <div className="mt-6 flex flex-wrap gap-2">{product.tags.map(tag => <span key={tag} className="px-3 py-1 text-xs bg-secondary rounded-full">{tag}</span>)}</div>}
          </motion.div>
        </div>


        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4">Reviews ({product.reviews})</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none text-muted-foreground">
                <p>{product.description}</p>
                <p className="mt-4">Our products are crafted with the utmost care and attention to detail. Each piece is designed to bring both functionality and style to your everyday life.</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-secondary/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{product.rating}</p>
                    <div className="flex items-center gap-0.5 mt-1">{[...Array(5)].map((_, i) => <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating) ? "fill-warning text-warning" : "fill-muted text-muted")} />)}</div>
                    <p className="text-sm text-muted-foreground mt-1">{product.reviews} reviews</p>
                  </div>
                </div>
                
                <ReviewForm productId={product.id} onReviewSubmitted={fetchReviews} />
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.userName}</span>
                          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-warning text-warning" : "fill-muted text-muted")} />)}</div>
                          <span className="text-xs text-muted-foreground ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="prose max-w-none text-muted-foreground space-y-4">
                <div><h4 className="font-semibold text-foreground">Shipping</h4><p>Free standard shipping on orders over $100. Delivery within 5-7 business days.</p></div>
                <div><h4 className="font-semibold text-foreground">Returns</h4><p>We offer a 30-day return policy for unused items in original packaging. Return shipping is free for defective items.</p></div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p, index) => <ProductCard key={p.id} product={p} index={index} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
