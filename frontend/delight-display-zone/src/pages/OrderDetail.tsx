import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import api, { OrderDto } from '@/services/api';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const { isAuthenticated } = state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const data = await api.getOrderById(id);
        setOrder(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Could not load order details.', variant: 'destructive' });
        navigate('/orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, isAuthenticated, navigate, toast]);

  if (!isAuthenticated || isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/4" />
            <div className="h-64 bg-secondary rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="w-4 h-4" />Back to Orders
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
              <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge className="text-sm">{order.status}</Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-card rounded-xl border border-border">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><Package className="w-5 h-5" />Order Items</h2>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      {item.productImage && (
                        <img src={item.productImage} alt={item.productName} className="w-20 h-24 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <Link to={`/product/${item.productId}`} className="font-medium hover:text-primary">{item.productName}</Link>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium mt-1">${item.price.toFixed(2)} each</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-card rounded-xl border border-border">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5" />Shipping Address</h2>
                <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
              </div>

              <div className="p-6 bg-card rounded-xl border border-border">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" />Payment</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{order.paymentStatus}</span></div>
                  {order.paymentId && <div className="flex justify-between"><span className="text-muted-foreground">Payment ID</span><span className="truncate max-w-[150px]">{order.paymentId}</span></div>}
                </div>
              </div>

              <div className="p-6 bg-card rounded-xl border border-border">
                <h2 className="font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${order.totalAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Free</span></div>
                  <div className="flex justify-between pt-2 border-t border-border text-base font-semibold"><span>Total</span><span>${order.totalAmount.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
