import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Eye, Package, ArrowLeft, LogOut, ShoppingCart, Boxes } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  city: string;
  postal_code: string | null;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  size: string | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
};

const OrdersAdmin = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/admin/login');
      } else if (!isAdmin) {
        toast.error('ليس لديك صلاحية الوصول');
        navigate('/');
      } else {
        fetchOrders();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('خطأ في جلب الطلبات');
      console.error(error);
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      console.error(error);
    } else {
      setOrderItems(data || []);
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('خطأ في تحديث حالة الطلب');
      console.error(error);
    } else {
      toast.success('تم تحديث حالة الطلب');
      fetchOrders();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">إدارة الطلبات</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
              <Boxes className="w-4 h-4 ml-2" />
              المنتجات
            </Button>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>الطلبات</CardTitle>
            <CardDescription>عرض وإدارة جميع الطلبات</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                لا توجد طلبات بعد.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>المدينة</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">
                        {order.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.city}</TableCell>
                      <TableCell className="font-semibold">${order.total_amount}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge className={statusColors[order.status]}>
                                {statusLabels[order.status]}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">قيد الانتظار</SelectItem>
                            <SelectItem value="confirmed">مؤكد</SelectItem>
                            <SelectItem value="shipped">تم الشحن</SelectItem>
                            <SelectItem value="delivered">تم التوصيل</SelectItem>
                            <SelectItem value="cancelled">ملغي</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              تفاصيل الطلب #{selectedOrder?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
            <DialogDescription>معلومات الطلب والمنتجات</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">اسم العميل</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الهاتف</p>
                  <p className="font-medium">{selectedOrder.customer_phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المدينة</p>
                  <p className="font-medium">{selectedOrder.city}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">العنوان</p>
                  <p className="font-medium">{selectedOrder.shipping_address}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">ملاحظات</p>
                    <p className="font-medium">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-3">المنتجات</h4>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-card border border-border rounded-lg">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        {item.size && (
                          <p className="text-sm text-muted-foreground">المقاس: {item.size}</p>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">${item.product_price} × {item.quantity}</p>
                        <p className="text-sm text-muted-foreground">
                          ${(item.product_price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                <span className="text-lg font-semibold">المجموع</span>
                <span className="text-2xl font-bold text-primary">${selectedOrder.total_amount}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersAdmin;
