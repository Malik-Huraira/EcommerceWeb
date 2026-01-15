import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, FolderOpen, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Layout } from '@/components/layout/Layout';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import api, { CategoryDto } from '@/services/api';

export default function AdminCategories() {
  const { state } = useStore();
  const { user, isAuthenticated } = state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') { navigate('/login'); return; }
    fetchCategories();
  }, [isAuthenticated, user, navigate]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load categories', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        toast({ title: 'Success', description: 'Category updated' });
      } else {
        await api.createCategory(formData);
        toast({ title: 'Success', description: 'Category created' });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in this category will be affected.')) return;
    try {
      await api.deleteCategory(id);
      toast({ title: 'Success', description: 'Category deleted' });
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
    }
  };

  const openEditDialog = (category: CategoryDto) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '', image: category.image || '' });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const result = await api.uploadFile(file, 'category');
      setFormData(p => ({ ...p, image: result.url }));
      toast({ title: 'Success', description: 'Image uploaded' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Categories</h1>
            <p className="text-muted-foreground">{categories.length} categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex gap-2">
                    <Input id="image" value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} placeholder="https://... or upload" className="flex-1" />
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      <Upload className="w-4 h-4 mr-2" />{isUploading ? '...' : 'Upload'}
                    </Button>
                  </div>
                  {formData.image && <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded mt-2" />}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">{editingCategory ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-secondary rounded-xl animate-pulse" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No categories yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div key={category.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className="relative group bg-card rounded-xl border border-border overflow-hidden">
                {category.image && <img src={category.image} alt={category.name} className="w-full h-32 object-cover" />}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{category.description || 'No description'}</p>
                  <p className="text-sm text-muted-foreground mt-2">{category.count} products</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEditDialog(category)}><Edit2 className="w-3 h-3" /></Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleDelete(category.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
