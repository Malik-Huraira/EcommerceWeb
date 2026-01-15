import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Save, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import api, { UserDto } from '@/services/api';

export default function Profile() {
  const { state, logout } = useStore();
  const { user, isAuthenticated } = state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const data = await api.getCurrentUser();
        setProfile(data);
        setFormData({ name: data.name, phone: data.phone || '', address: data.address || '' });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updated = await api.updateCurrentUser(formData);
      setProfile(updated);
      setIsEditing(false);
      toast({ title: 'Profile updated', description: 'Your profile has been updated successfully.' });
    } catch (error) {
      toast({ title: 'Update failed', description: 'Could not update profile.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({ title: 'Logged out', description: 'You have been logged out successfully.' });
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </motion.div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4 mr-2" />Edit</Button>
                  ) : (
                    <Button size="sm" onClick={handleSave} disabled={isLoading}><Save className="w-4 h-4 mr-2" />{isLoading ? 'Saving...' : 'Save'}</Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{profile?.name || user?.name}</p>
                      <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="email" value={profile?.email || ''} disabled className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} className="pl-10" placeholder="Add phone number" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="address" value={formData.address} onChange={handleChange} disabled={!isEditing} className="pl-10" placeholder="Add address" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <Button variant="destructive" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Log Out</Button>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="p-6 bg-card rounded-xl border border-border text-center">
                <p className="text-muted-foreground mb-4">View your order history</p>
                <Link to="/orders"><Button>View All Orders</Button></Link>
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              <div className="p-6 bg-card rounded-xl border border-border text-center">
                <p className="text-muted-foreground mb-4">View your saved items</p>
                <Link to="/wishlist"><Button>View Wishlist</Button></Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
