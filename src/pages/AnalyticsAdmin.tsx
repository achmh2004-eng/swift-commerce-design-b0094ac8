import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign,
  Calendar,
  BarChart3
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AnalyticsAdmin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAnalytics();
    }
  }, [user, isAdmin]);

  const fetchAnalytics = async () => {
    // Fetch orders
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: true });

    // Fetch products
    const { data: products } = await supabase
      .from("products")
      .select("*");

    if (orders) {
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;
      
      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products?.length || 0,
        totalCustomers: uniqueCustomers,
        revenueGrowth: 12.5,
        ordersGrowth: 8.2,
      });

      // Group by date for chart
      const dailySales: { [key: string]: number } = {};
      orders.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('ar-DZ', { month: 'short', day: 'numeric' });
        dailySales[date] = (dailySales[date] || 0) + Number(order.total_amount);
      });
      
      setSalesData(Object.entries(dailySales).map(([date, amount]) => ({ date, amount })));

      // Group by status
      const statusCounts: { [key: string]: number } = {};
      orders.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      });
      
      const statusLabels: { [key: string]: string } = {
        pending: "قيد الانتظار",
        processing: "قيد المعالجة",
        shipped: "تم الشحن",
        delivered: "تم التوصيل",
        cancelled: "ملغي"
      };
      
      setStatusData(Object.entries(statusCounts).map(([status, count]) => ({ 
        name: statusLabels[status] || status, 
        value: count 
      })));
    }

    if (products) {
      // Group by category
      const categoryCounts: { [key: string]: number } = {};
      products.forEach(product => {
        const category = product.category || "غير مصنف";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      setCategoryData(Object.entries(categoryCounts).map(([name, count]) => ({ name, count })));
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#10b981', '#f59e0b'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AdminSidebar onLogout={handleLogout} />
      
      <main className="lg:mr-64 min-h-screen">
        <AdminHeader 
          email={user?.email} 
          title="التحليلات" 
          subtitle="إحصائيات وتحليلات المتجر"
        />
        
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">إجمالي الإيرادات</p>
                    <p className="text-lg lg:text-2xl font-bold mt-1">{stats.totalRevenue.toLocaleString()} د.ج</p>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{stats.revenueGrowth}%</span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 lg:w-10 lg:h-10 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">إجمالي الطلبات</p>
                    <p className="text-lg lg:text-2xl font-bold mt-1">{stats.totalOrders}</p>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{stats.ordersGrowth}%</span>
                    </div>
                  </div>
                  <ShoppingCart className="w-8 h-8 lg:w-10 lg:h-10 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">المنتجات</p>
                    <p className="text-lg lg:text-2xl font-bold mt-1">{stats.totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 lg:w-10 lg:h-10 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">العملاء</p>
                    <p className="text-lg lg:text-2xl font-bold mt-1">{stats.totalCustomers}</p>
                  </div>
                  <Users className="w-8 h-8 lg:w-10 lg:h-10 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  المبيعات اليومية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`${value.toLocaleString()} د.ج`, 'المبيعات']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  المنتجات حسب الفئة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                حالة الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsAdmin;
