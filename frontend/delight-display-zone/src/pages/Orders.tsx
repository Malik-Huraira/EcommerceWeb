import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import api, { OrderDto } from '@/services/api';

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4" />,
  PROCESSING: <Package className="w-4 h-4" />,
  SHIPPED: <Truck className="w-4 h-4" />,
  DELIVERED: <CheckCircle className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const { state } = useStore();
  const { isAuthenticated } = state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data.content);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast({ title: 'Error', description: 'Could not load orders.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, navigate, toast]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.cancelOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      toast({ title: 'Order cancelled', description: 'Your order has been cancelled.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not cancel order.', variant: 'destructive' });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-6 bg-card rounded-xl border border-border">
                <div className="h-4 bg-secondary rounded w-1/4 mb-4" />
                <div className="h-4 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Link to="/products"><Button>Browse Products</Button></Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 bg-card rounded-xl border border-border"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={statusColors[order.status] || 'bg-gray-100'}>
                    {statusIcons[order.status]} <span className="ml-1">{order.status}</span>
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  {order.items.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.productImage && (
                        <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-muted-foreground self-center">+{order.items.length - 3} more</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <Button variant="destructive" size="sm" onClick={() => handleCancelOrder(order.id)}>Cancel</Button>
                    )}
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">View Details <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
