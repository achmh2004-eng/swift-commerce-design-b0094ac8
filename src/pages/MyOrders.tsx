import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  size?: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_address: string;
  city: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "قيد الانتظار", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
  processing: { label: "جاري التحضير", icon: Package, color: "bg-blue-100 text-blue-700" },
  shipped: { label: "تم الشحن", icon: Truck, color: "bg-purple-100 text-purple-700" },
  delivered: { label: "تم التوصيل", icon: CheckCircle, color: "bg-green-100 text-green-700" },
  cancelled: { label: "ملغي", icon: XCircle, color: "bg-red-100 text-red-700" },
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            العودة للرئيسية
          </button>

          <h1 className="text-3xl font-bold mb-8">طلباتي</h1>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">لا توجد طلبات</h2>
              <p className="text-muted-foreground mb-6">
                لم تقم بأي طلبات بعد
              </p>
              <button
                onClick={() => navigate("/")}
                className="btn-primary"
              >
                تسوق الآن
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={order.id}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-4 sm:p-6 border-b border-border bg-muted/30">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            رقم الطلب
                          </p>
                          <p className="font-mono font-semibold">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right sm:text-left">
                          <p className="text-sm text-muted-foreground mb-1">
                            تاريخ الطلب
                          </p>
                          <p className="font-medium">
                            {format(new Date(order.created_at), "dd MMMM yyyy", {
                              locale: ar,
                            })}
                          </p>
                        </div>
                        <Badge
                          className={`${status.color} flex items-center gap-2 px-4 py-2`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 sm:p-6">
                      <div className="space-y-4">
                        {order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-muted-foreground">
                                الكمية: {item.quantity}
                                {item.size && ` | المقاس: ${item.size}`}
                              </p>
                            </div>
                            <p className="font-semibold">
                              {(item.product_price * item.quantity).toFixed(2)} د.ج
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-border">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              عنوان التوصيل
                            </p>
                            <p className="font-medium">
                              {order.shipping_address}، {order.city}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="text-sm text-muted-foreground">
                              المجموع
                            </p>
                            <p className="text-xl font-bold text-primary">
                              {order.total_amount.toFixed(2)} د.ج
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
