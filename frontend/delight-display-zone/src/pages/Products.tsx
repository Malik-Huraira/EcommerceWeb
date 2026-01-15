import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X, Grid3X3, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/ProductCard';
import { Layout } from '@/components/layout/Layout';
import { Product } from '@/context/StoreContext';
import api, { ProductDto, CategoryDto } from '@/services/api';
import { getImageUrl } from '@/lib/utils';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

function mapProductDtoToProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    originalPrice: dto.originalPrice,
    image: getImageUrl(dto.image),
    images: dto.images?.map(getImageUrl),
    category: dto.category,
    description: dto.description,
    rating: dto.rating,
    reviews: dto.reviews,
    inStock: dto.inStock,
    stockCount: dto.stockCount,
    tags: dto.tags,
    featured: dto.featured,
    new: dto.isNew,
  };
}


export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; count: number; image?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filterType = searchParams.get('filter');
  const categoryParam = searchParams.get('category');

  const fetchProducts = async (pageNum: number, append = false) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);
    
    try {
      const productsRes = await api.getProducts({ size: 12, page: pageNum });
      const newProducts = productsRes.content.map(mapProductDtoToProduct);
      
      if (append) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        // Don't fall back to static data - only show real products from API
        setProducts(newProducts);
      }
      setTotalPages(productsRes.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // On error, show empty instead of fallback
      if (!append) setProducts([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts({ size: 12, page: 0 }),
          api.getCategories(),
        ]);
        // Only use API data - don't fall back to static products
        setProducts(productsRes.content.map(mapProductDtoToProduct));
        setTotalPages(productsRes.totalPages);
        if (categoriesRes.length > 0) {
          setCategories(categoriesRes.map((c: CategoryDto) => ({
            id: c.id, name: c.name, count: c.count, image: c.image,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filterType === 'new') result = result.filter(p => p.new);
    else if (filterType === 'sale') result = result.filter(p => p.originalPrice);
    if (categoryParam) result = result.filter(p => p.category.toLowerCase() === categoryParam.toLowerCase());
    else if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.some(cat => cat.toLowerCase() === p.category.toLowerCase()));
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'newest': result = result.filter(p => p.new).concat(result.filter(p => !p.new)); break;
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [products, filterType, categoryParam, selectedCategories, priceRange, sortBy]);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]);
    if (categoryParam) { searchParams.delete('category'); setSearchParams(searchParams); }
  };

  const clearFilters = () => {
    setSelectedCategories([]); setPriceRange([0, 200]); setSortBy('featured'); setSearchParams({});
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 200 || filterType || categoryParam;


  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h4 className="font-semibold mb-4">Categories</h4>
        <div className="space-y-3">
          {categories.map(category => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox checked={selectedCategories.includes(category.name) || categoryParam === category.id} onCheckedChange={() => toggleCategory(category.name)} />
              <span className="text-sm group-hover:text-primary transition-colors">{category.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">({category.count})</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Price Range</h4>
        <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={200} step={10} className="mb-4" />
        <div className="flex items-center justify-between text-sm"><span>${priceRange[0]}</span><span>${priceRange[1]}</span></div>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Availability</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer"><Checkbox defaultChecked /><span className="text-sm">In Stock</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><Checkbox /><span className="text-sm">Out of Stock</span></label>
        </div>
      </div>
      {hasActiveFilters && <Button variant="outline" onClick={clearFilters} className="w-full">Clear All Filters</Button>}
    </div>
  );

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            {filterType === 'new' ? 'New Arrivals' : filterType === 'sale' ? 'Sale Items' : categoryParam ? categories.find(c => c.id === categoryParam)?.name : 'All Products'}
          </h1>
          <p className="text-muted-foreground">{isLoading ? 'Loading...' : `${filteredProducts.length} products found`}</p>
        </div>
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6"><Filter className="w-5 h-5" /><h3 className="font-semibold">Filters</h3></div>
              <FilterContent />
            </div>
          </aside>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2">
                    <SlidersHorizontal className="w-4 h-4" />Filters
                    {hasActiveFilters && <span className="w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full flex items-center justify-center">!</span>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left"><SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader><div className="mt-6"><FilterContent /></div></SheetContent>
              </Sheet>
              <div className="hidden lg:flex items-center gap-2 flex-wrap">
                {categoryParam && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full">
                    {categories.find(c => c.id === categoryParam)?.name}
                    <button onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }} className="hover:text-primary"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filterType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full">
                    {filterType === 'new' ? 'New Arrivals' : 'On Sale'}
                    <button onClick={() => { searchParams.delete('filter'); setSearchParams(searchParams); }} className="hover:text-primary"><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <div className="hidden sm:flex items-center gap-1 p-1 bg-secondary rounded-lg">
                  <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="w-8 h-8" onClick={() => setViewMode('grid')}><Grid3X3 className="w-4 h-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" className="w-8 h-8" onClick={() => setViewMode('list')}><LayoutList className="w-4 h-4" /></Button>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44"><SelectValue placeholder="Sort by" /></SelectTrigger>
                  <SelectContent>{sortOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-secondary aspect-[3/4] rounded-xl mb-3" />
                    <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                    <div className="h-4 bg-secondary rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6' : 'flex flex-col gap-4'}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
            {filteredProducts.length > 0 && page < totalPages - 1 && (
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg" onClick={() => fetchProducts(page + 1, true)} disabled={isLoadingMore}>
                  {isLoadingMore ? 'Loading...' : 'Load More Products'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
