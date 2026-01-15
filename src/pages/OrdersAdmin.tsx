import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Eye, Package, Search, Clock, MapPin, Mail, Phone, FileText } from 'lucide-react';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { cn } from '@/lib/utils';

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

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'قيد الانتظار', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  confirmed: { label: 'مؤكد', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  processing: { label: 'قيد المعالجة', className: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  shipped: { label: 'تم الشحن', className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  delivered: { label: 'تم التوصيل', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  cancelled: { label: 'ملغي', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

const OrdersAdmin = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <AdminSidebar onLogout={handleLogout} />

      <div className="mr-64 min-h-screen">
        <AdminHeader 
          email={user?.email} 
          title="إدارة الطلبات" 
          subtitle={`${orders.length} طلب في المتجر`}
        />

        <main className="p-8">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="بحث بالاسم أو البريد أو رقم الطلب..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 pr-10 bg-background"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="shipped">تم الشحن</SelectItem>
                    <SelectItem value="delivered">تم التوصيل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">لا توجد طلبات</h3>
                <p className="text-muted-foreground">لم يتم استلام أي طلبات بعد</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>المدينة</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead className="text-left">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="group">
                        <TableCell>
                          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {order.city}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-lg">${order.total_amount.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-36 border-0 bg-transparent p-0 h-auto">
                              <Badge variant="outline" className={cn("cursor-pointer", statusConfig[order.status]?.className)}>
                                {statusConfig[order.status]?.label || order.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">قيد الانتظار</SelectItem>
                              <SelectItem value="confirmed">مؤكد</SelectItem>
                              <SelectItem value="processing">قيد المعالجة</SelectItem>
                              <SelectItem value="shipped">تم الشحن</SelectItem>
                              <SelectItem value="delivered">تم التوصيل</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(order.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewOrder(order)}
                            className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-4 h-4" />
                            عرض
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              تفاصيل الطلب #{selectedOrder?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
            <DialogDescription>معلومات الطلب والمنتجات</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={cn("text-sm", statusConfig[selectedOrder.status]?.className)}>
                  {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                </Badge>
                <span className="text-sm text-muted-foreground">{formatDate(selectedOrder.created_at)}</span>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    معلومات العميل
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">الاسم:</span> {selectedOrder.customer_name}</p>
                    <p><span className="text-muted-foreground">البريد:</span> {selectedOrder.customer_email}</p>
                    {selectedOrder.customer_phone && (
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedOrder.customer_phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    عنوان الشحن
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>{selectedOrder.shipping_address}</p>
                    <p>{selectedOrder.city} {selectedOrder.postal_code && `- ${selectedOrder.postal_code}`}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <h4 className="font-semibold flex items-center gap-2 text-amber-600 mb-2">
                    <FileText className="w-4 h-4" />
                    ملاحظات
                  </h4>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-4">المنتجات ({orderItems.length})</h4>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          {item.size && (
                            <p className="text-sm text-muted-foreground">المقاس: {item.size}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">${item.product_price.toFixed(2)} × {item.quantity}</p>
                        <p className="text-primary font-bold">
                          ${(item.product_price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-6 bg-gradient-to-l from-primary/20 to-transparent rounded-xl border border-primary/20">
                <span className="text-lg font-semibold">المجموع الكلي</span>
                <span className="text-3xl font-bold text-primary">${selectedOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersAdmin;
