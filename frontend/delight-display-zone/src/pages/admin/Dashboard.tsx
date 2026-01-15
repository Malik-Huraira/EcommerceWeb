import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown,
  ArrowRight, ArrowUpRight, Clock, Truck, CheckCircle, XCircle,
  Calendar, Sparkles, Crown, Star
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import api, { DashboardStatsDto, AnalyticsDto } from '@/services/api';

export default function AdminDashboard() {
  const { state } = useStore();
  const { user, isAuthenticated } = state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role !== 'ADMIN') {
      toast({ title: 'Access Denied', description: 'Admin privileges required.', variant: 'destructive' });
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate, toast]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchAnalytics();
    }
  }, [timeRange]);

  const fetchData = async () => {
    try {
      const [statsData, analyticsData] = await Promise.all([
        api.getAdminStats(),
        api.getAnalytics(parseInt(timeRange))
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch {
      setStats({ 
        totalUsers: 1250, totalProducts: 86, totalOrders: 3420, totalRevenue: 128450, 
        ordersToday: 28, ordersThisWeek: 156, ordersThisMonth: 580,
        revenueToday: 3250, revenueThisWeek: 18500, revenueThisMonth: 72000,
        pendingOrders: 12, shippedOrders: 34, deliveredOrders: 3350
      });
      setAnalytics({
        dailyStats: generateMockDailyStats(),
        categorySales: [
          { category: 'Gaz & Nougat', orders: 145, revenue: 8250 },
          { category: 'Sohan', orders: 98, revenue: 5900 },
          { category: 'Chocolates', orders: 182, revenue: 9600 },
          { category: 'Cookies', orders: 76, revenue: 3200 },
          { category: 'Dried Fruits', orders: 65, revenue: 4500 }
        ],
        topProducts: [
          { name: 'Gaz Persian Nougat', sold: 456 },
          { name: 'Sohan Qom Premium', sold: 324 },
          { name: 'Baklava Assorted Box', sold: 298 },
          { name: 'Saffron Cookies', sold: 187 },
          { name: 'Pistachio Delight', sold: 156 }
        ],
        orderStatusBreakdown: { pending: 12, confirmed: 22, shipped: 34, delivered: 3350, cancelled: 24 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await api.getAnalytics(parseInt(timeRange));
      setAnalytics(data);
    } catch { /* use existing data */ }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      gradient: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/20',
      change: '+18.2%',
      isUp: true
    },
    { 
      title: 'Total Orders', 
      value: (stats?.totalOrders || 0).toLocaleString(), 
      icon: ShoppingCart, 
      gradient: 'from-blue-500 to-indigo-600',
      bgGlow: 'bg-blue-500/20',
      change: '+12.5%',
      isUp: true
    },
    { 
      title: 'Products', 
      value: stats?.totalProducts || 0, 
      icon: Package, 
      gradient: 'from-purple-500 to-pink-600',
      bgGlow: 'bg-purple-500/20',
      change: '+8',
      isUp: true
    },
    { 
      title: 'Customers', 
      value: (stats?.totalUsers || 0).toLocaleString(), 
      icon: Users, 
      gradient: 'from-orange-500 to-red-500',
      bgGlow: 'bg-orange-500/20',
      change: '+156',
      isUp: true
    },
  ];

  const orderStatusData = analytics?.orderStatusBreakdown ? [
    { name: 'Pending', value: analytics.orderStatusBreakdown.pending, color: '#fbbf24', icon: Clock },
    { name: 'Confirmed', value: analytics.orderStatusBreakdown.confirmed, color: '#3b82f6', icon: CheckCircle },
    { name: 'Shipped', value: analytics.orderStatusBreakdown.shipped, color: '#8b5cf6', icon: Truck },
    { name: 'Delivered', value: analytics.orderStatusBreakdown.delivered, color: '#10b981', icon: CheckCircle },
    { name: 'Cancelled', value: analytics.orderStatusBreakdown.cancelled, color: '#ef4444', icon: XCircle },
  ] : [];

  const totalOrders = orderStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container py-8 lg:py-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  Royal Mart Dashboard
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                  <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map((stat, index) => (
                  <motion.div 
                    key={stat.title} 
                    initial={{ opacity: 0, y: 30, scale: 0.9 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  >
                    <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800/50 backdrop-blur">
                      <div className={`absolute inset-0 ${stat.bgGlow} blur-3xl opacity-50`} />
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-10 -mt-10`} />
                      <CardContent className="p-6 relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className={`flex items-center gap-1 text-sm font-medium ${stat.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                            {stat.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {stat.change}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Main Charts Row */}
              <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Chart - Takes 2 columns */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-2"
                >
                  <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/50 backdrop-blur overflow-hidden">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold">Revenue Analytics</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">Daily revenue for the selected period</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">${(stats?.revenueThisMonth || 0).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">This month</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analytics?.dailyStats || []}>
                            <defs>
                              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: 'none', 
                                borderRadius: '12px', 
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                              }}
                              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="revenue" 
                              stroke="#10b981" 
                              strokeWidth={3} 
                              fill="url(#revenueGradient)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Order Status */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/50 backdrop-blur h-full">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-700/50">
                      <CardTitle className="text-lg font-semibold">Order Status</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[180px] mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPie>
                            <Pie
                              data={orderStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {orderStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [value, 'Orders']} />
                          </RechartsPie>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2">
                        {orderStatusData.slice(0, 4).map((item) => (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="font-semibold">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Second Row */}
              <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Orders Chart */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }}
                  className="lg:col-span-2"
                >
                  <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/50 backdrop-blur">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold">Orders Overview</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">Daily orders trend</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-muted-foreground">Orders</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics?.dailyStats || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: 'none', 
                                borderRadius: '12px', 
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                              }}
                            />
                            <Bar dataKey="orders" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                            <defs>
                              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#6366f1" />
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Top Products */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6 }}
                >
                  <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/50 backdrop-blur h-full">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-700/50">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Top Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {(analytics?.topProducts || []).map((product, index) => {
                          const maxSold = analytics?.topProducts?.[0]?.sold || 1;
                          const percentage = (product.sold / maxSold) * 100;
                          const medals = ['🥇', '🥈', '🥉'];
                          
                          return (
                            <div key={product.name} className="group">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg">{medals[index] || `#${index + 1}`}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                    {product.name}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                  {product.sold}
                                </span>
                              </div>
                              <div className="ml-9 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                  className={`h-full rounded-full ${
                                    index === 0 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                                    index === 1 ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
                                    index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
                                    'bg-gradient-to-r from-blue-400 to-blue-500'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Category Sales & Quick Actions */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Category Sales */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.7 }}
                  className="lg:col-span-2"
                >
                  <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/50 backdrop-blur">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-700/50">
                      <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {(analytics?.categorySales || []).map((cat, index) => {
                          const colors = [
                            'from-violet-500 to-purple-600',
                            'from-cyan-500 to-blue-600',
                            'from-emerald-500 to-green-600',
                            'from-amber-500 to-orange-600',
                            'from-rose-500 to-pink-600'
                          ];
                          return (
                            <motion.div
                              key={cat.category}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              className="relative group"
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${colors[index]} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
                              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-transparent hover:shadow-lg transition-all">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[index]} flex items-center justify-center mb-3`}>
                                  <Package className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{cat.category}</p>
                                <p className="text-lg font-bold">${cat.revenue.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{cat.orders} orders</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.8 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white h-full">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { to: '/admin/products', label: 'Manage Products', icon: Package },
                        { to: '/admin/orders', label: 'View Orders', icon: ShoppingCart, badge: stats?.pendingOrders },
                        { to: '/admin/users', label: 'Manage Users', icon: Users },
                        { to: '/admin/categories', label: 'Categories', icon: Crown },
                      ].map((action) => (
                        <Link key={action.to} to={action.to}>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-between text-white hover:bg-white/10 border border-white/10 hover:border-white/20"
                          >
                            <span className="flex items-center gap-2">
                              <action.icon className="w-4 h-4" />
                              {action.label}
                            </span>
                            {action.badge ? (
                              <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                {action.badge}
                              </span>
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </Button>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
            <div className="w-28 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-pulse bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="h-[300px] bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
        <div className="animate-pulse bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="h-[300px] bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function generateMockDailyStats() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      orders: Math.floor(Math.random() * 30) + 10,
      revenue: Math.floor(Math.random() * 3000) + 1000
    });
  }
  return data;
}
