import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Loader2, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  ArrowUpLeft
} from 'lucide-react';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCard from '@/components/admin/StatsCard';
import SalesChart from '@/components/admin/SalesChart';
import RecentOrders from '@/components/admin/RecentOrders';
import TopProducts from '@/components/admin/TopProducts';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  category: string | null;
}

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  city: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/admin/login');
      } else if (!isAdmin) {
        toast.error('ليس لديك صلاحية الوصول');
        navigate('/');
      } else {
        fetchData();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Fetch orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    setProducts(productsData || []);
    setOrders(ordersData || []);

    // Calculate stats
    const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const pendingOrders = ordersData?.filter(order => order.status === 'pending').length || 0;

    setStats({
      totalRevenue,
      totalOrders: ordersData?.length || 0,
      totalProducts: productsData?.length || 0,
      pendingOrders,
    });

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Generate chart data (last 7 days simulation)
  const chartData = [
    { name: 'السبت', sales: 1200, orders: 12 },
    { name: 'الأحد', sales: 1900, orders: 19 },
    { name: 'الإثنين', sales: 800, orders: 8 },
    { name: 'الثلاثاء', sales: 1500, orders: 15 },
    { name: 'الأربعاء', sales: 2100, orders: 21 },
    { name: 'الخميس', sales: 1800, orders: 18 },
    { name: 'الجمعة', sales: 2400, orders: 24 },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="lg:mr-64 min-h-screen">
        <AdminHeader 
          title="مرحباً بك! 👋" 
          subtitle="إليك نظرة عامة على أداء متجرك اليوم"
        />

        <main className="p-4 lg:p-8 space-y-6 lg:space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            <StatsCard
              title="إجمالي الإيرادات"
              value={`$${stats.totalRevenue.toFixed(2)}`}
              change="+12.5% من الشهر الماضي"
              changeType="positive"
              icon={DollarSign}
            />
            <StatsCard
              title="إجمالي الطلبات"
              value={stats.totalOrders}
              change="+8.2% من الشهر الماضي"
              changeType="positive"
              icon={ShoppingCart}
            />
            <StatsCard
              title="المنتجات"
              value={stats.totalProducts}
              change="مخزون نشط"
              changeType="neutral"
              icon={Package}
            />
            <StatsCard
              title="طلبات معلقة"
              value={stats.pendingOrders}
              change="تحتاج للمراجعة"
              changeType={stats.pendingOrders > 0 ? "negative" : "positive"}
              icon={TrendingUp}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 lg:gap-4">
            <Button onClick={() => navigate('/admin/products')} className="gap-2 text-sm lg:text-base">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">إدارة</span> المنتجات
            </Button>
            <Button onClick={() => navigate('/admin/orders')} variant="secondary" className="gap-2 text-sm lg:text-base">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">عرض</span> الطلبات
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="gap-2 text-sm lg:text-base">
              <ArrowUpLeft className="w-4 h-4" />
              <span className="hidden sm:inline">زيارة</span> المتجر
            </Button>
          </div>

          {/* Charts & Tables */}
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2">
              <SalesChart data={chartData} />
            </div>
            <div>
              <TopProducts products={products} />
            </div>
          </div>

          {/* Recent Orders */}
          <RecentOrders orders={orders.slice(0, 5)} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
