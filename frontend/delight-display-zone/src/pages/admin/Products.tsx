import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Package, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Layout } from '@/components/layout/Layout';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import api, { ProductDto, CategoryDto } from '@/services/api';

export default function AdminProducts() {
  const { state } = useStore();
  const { user, isAuthenticated } = state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', originalPrice: '', image: '',
    categoryId: '', stockCount: '', featured: false, isNew: false, inStock: true
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.getProducts({ size: 100 }),
        api.getCategories()
      ]);
      setProducts(productsRes.content);
      setCategories(categoriesRes);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData: Partial<ProductDto> = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: formData.image,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        stockCount: parseInt(formData.stockCount) || 0,
        featured: formData.featured,
        isNew: formData.isNew,
        inStock: formData.inStock
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        await api.createProduct(productData);
        toast({ title: 'Success', description: 'Product created successfully' });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save product', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      toast({ title: 'Success', description: 'Product deleted' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' });
    }
  };

  const openEditDialog = (product: ProductDto) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, description: product.description, price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '', image: product.image,
      categoryId: product.categoryId?.toString() || '', stockCount: product.stockCount?.toString() || '0',
      featured: product.featured || false, isNew: product.isNew || false, inStock: product.inStock
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', originalPrice: '', image: '', categoryId: '', stockCount: '', featured: false, isNew: false, inStock: true });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const result = await api.uploadFile(file, 'product');
      setFormData(p => ({ ...p, image: result.url }));
      toast({ title: 'Success', description: 'Image uploaded' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;


  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Products</h1>
            <p className="text-muted-foreground">{products.length} products total</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.categoryId} onValueChange={v => setFormData(p => ({ ...p, categoryId: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price ($)</Label>
                    <Input id="originalPrice" type="number" step="0.01" value={formData.originalPrice} onChange={e => setFormData(p => ({ ...p, originalPrice: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockCount">Stock</Label>
                    <Input id="stockCount" type="number" value={formData.stockCount} onChange={e => setFormData(p => ({ ...p, stockCount: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex gap-2">
                    <Input id="image" value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} placeholder="https://... or upload" className="flex-1" />
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      <Upload className="w-4 h-4 mr-2" />{isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  {formData.image && <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded mt-2" />}
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2"><Switch checked={formData.inStock} onCheckedChange={v => setFormData(p => ({ ...p, inStock: v }))} /><Label>In Stock</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={formData.featured} onCheckedChange={v => setFormData(p => ({ ...p, featured: v }))} /><Label>Featured</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={formData.isNew} onCheckedChange={v => setFormData(p => ({ ...p, isNew: v }))} /><Label>New Arrival</Label></div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">{editingProduct ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-secondary rounded-lg animate-pulse" />)}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}
                className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category} • ${product.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
