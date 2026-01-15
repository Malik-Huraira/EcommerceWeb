import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Layout } from '@/components/layout/Layout';
import { Product } from '@/context/StoreContext';
import api, { ProductDto, CategoryDto } from '@/services/api';
import { getImageUrl } from '@/lib/utils';

interface Category {
  id: number | string;
  name: string;
  count: number;
  image: string;
}

function mapProductDtoToProduct(dto: ProductDto): Product {
  return {
    id: dto.id, name: dto.name, price: dto.price, originalPrice: dto.originalPrice,
    image: getImageUrl(dto.image), images: dto.images?.map(getImageUrl), category: dto.category, description: dto.description,
    rating: dto.rating, reviews: dto.reviews, inStock: dto.inStock, stockCount: dto.stockCount,
    tags: dto.tags, featured: dto.featured, new: dto.isNew,
  };
}

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, newArrivals, cats] = await Promise.all([
          api.getFeaturedProducts(),
          api.getNewProducts(),
          api.getCategories(),
        ]);
        setFeaturedProducts(featured.map(mapProductDtoToProduct));
        setNewProducts(newArrivals.map(mapProductDtoToProduct));
        setCategories(cats.map((c: CategoryDto) => ({ id: c.id, name: c.name, count: c.count, image: getImageUrl(c.image) || '' })));
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
        setFeaturedProducts([]);
        setNewProducts([]);
        setCategories([]);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50/50" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-orange-300/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-amber-400/15 to-rose-300/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -60, 0],
              y: [0, 40, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-purple-300/10 to-pink-200/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 30, -30, 0],
              y: [0, -40, 20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="container py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-xl">
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-primary/10 to-orange-100 text-primary rounded-full mb-6 border border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(249, 115, 22, 0.3)" }}
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Authentic Iranian Sweets
              </motion.span>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Taste the finest{' '}
                <motion.span 
                  className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent inline-block pb-2"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Persian delights
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Discover authentic Iranian chocolates, biscuits, and traditional sweets. Premium quality treats imported directly from Iran to your doorstep.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/products">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="gap-2 shadow-lg bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 border-0 px-8">
                      Shop Now
                      <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/products?filter=new">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 px-8">View New Arrivals</Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div 
                className="flex items-center gap-6 mt-10 pt-10 border-t border-border/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9/5</span>
                </div>
                <div className="text-sm text-muted-foreground"><span className="font-medium text-foreground">10,000+</span> happy customers</div>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.3 }} 
              className="relative hidden lg:block"
            >
              <motion.div 
                className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&h=1000&fit=crop" alt="Iranian sweets and chocolates" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 }} className="absolute -left-8 bottom-20 p-4 bg-card rounded-xl shadow-card-hover max-w-[200px]">
                <p className="text-sm font-medium mb-1">Best Seller</p>
                <p className="text-xs text-muted-foreground">Gaz Persian Nougat</p>
                <p className="text-lg font-semibold text-primary mt-2">$12</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Categories */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="container">
          <motion.div 
            className="flex items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Selection</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-2">Shop by Category</h2>
              <p className="text-muted-foreground mt-3">Explore our delicious Iranian treats</p>
            </div>
            <Link to="/products" className="hidden sm:block">
              <Button variant="outline" className="gap-2 group border-2">
                View All 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <motion.div 
                key={category.id} 
                initial={{ opacity: 0, y: 30, scale: 0.95 }} 
                whileInView={{ opacity: 1, y: 0, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                whileHover={{ y: -8 }}
              >
                <Link to={`/products?category=${category.id}`} className="group block relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                  <motion.img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Shine effect on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <motion.h3 
                      className="text-xl font-bold text-white mb-1"
                      initial={{ y: 10, opacity: 0.8 }}
                      whileHover={{ y: 0, opacity: 1 }}
                    >
                      {category.name}
                    </motion.h3>
                    <p className="text-sm text-white/70 flex items-center gap-2">
                      <span>{category.count} items</span>
                      <motion.span
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-secondary/30 to-white">
        <div className="container">
          <motion.div 
            className="flex items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Most Popular</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-2">Featured Treats</h2>
              <p className="text-muted-foreground mt-3 max-w-md">Our customers' favorite Iranian sweets and snacks</p>
            </div>
            <Link to="/products" className="hidden sm:block">
              <Button variant="outline" className="gap-2 group border-2">
                View All 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.slice(0, 8).map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="relative rounded-3xl overflow-hidden shadow-2xl group"
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1400&h=500&fit=crop" 
              alt="Special offers on Iranian sweets" 
              className="w-full h-72 lg:h-96 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
            
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${10 + i * 10}%`,
                    top: `${20 + (i % 4) * 20}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            
            <div className="absolute inset-0 flex items-center">
              <div className="container">
                <motion.div 
                  className="max-w-lg"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <motion.span 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-orange-400 text-white text-sm font-semibold rounded-full mb-4 shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Special Offer
                  </motion.span>
                  <motion.h2 
                    className="text-3xl lg:text-5xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    Nowruz Collection{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">20% Off</span>
                  </motion.h2>
                  <motion.p 
                    className="text-white/80 mb-8 text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    Celebrate with our premium selection of traditional Persian sweets. Perfect for gifting and family gatherings.
                  </motion.p>
                  <Link to="/products?filter=sale">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button size="lg" className="gap-2 bg-white text-black hover:bg-white/90 px-8 shadow-xl">
                        Shop Now 
                        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* New Arrivals */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <motion.div 
            className="flex items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Fresh Stock</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-2">New Arrivals</h2>
              <p className="text-muted-foreground mt-3 max-w-md">Latest additions to our Iranian sweets collection</p>
            </div>
            <Link to="/products?filter=new" className="hidden sm:block">
              <Button variant="outline" className="gap-2 group border-2">
                View All 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {newProducts.slice(0, 4).map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-b from-white to-secondary/30 overflow-hidden">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2">Quality You Can Trust</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Fresh Products */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg overflow-hidden">
                <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-white/30" />
                <motion.span 
                  className="text-3xl relative z-10"
                  animate={{ x: [-40, 40, -40] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  🚚
                </motion.span>
                <motion.div
                  className="absolute bottom-4 left-2 w-2 h-2 bg-white/40 rounded-full"
                  animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.5, 0.5], x: [-10, -20, -30] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
              </div>
              <h4 className="font-bold text-lg mb-2">Fast Delivery</h4>
              <p className="text-sm text-muted-foreground">Fresh to your door</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            </motion.div>

            {/* 100% Authentic */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-lg">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotateY: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span className="text-3xl">🇮🇷</span>
                </motion.div>
                <motion.div
                  className="absolute -right-1 -top-1 text-xs text-white bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md font-bold"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ✓
                </motion.div>
              </div>
              <h4 className="font-bold text-lg mb-2">100% Authentic</h4>
              <p className="text-sm text-muted-foreground">Imported from Iran</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
            </motion.div>

            {/* Fresh & Quality */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
                <motion.span 
                  className="text-3xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.span>
                <motion.div
                  className="absolute inset-2 rounded-xl border-2 border-white/40"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute -right-1 -bottom-1 text-xs bg-white text-green-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md font-bold"
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  ✓
                </motion.span>
              </div>
              <h4 className="font-bold text-lg mb-2">Premium Quality</h4>
              <p className="text-sm text-muted-foreground">Always fresh & tasty</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all" />
            </motion.div>

            {/* 24/7 Support */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg">
                <span className="text-3xl">💬</span>
                <div className="absolute bottom-2 right-2 flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-white rounded-full"
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  !
                </motion.div>
              </div>
              <h4 className="font-bold text-lg mb-2">Friendly Support</h4>
              <p className="text-sm text-muted-foreground">We're here to help</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all" />
            </motion.div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
