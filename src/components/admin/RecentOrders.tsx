import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  city: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "قيد الانتظار", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  processing: { label: "قيد المعالجة", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  shipped: { label: "تم الشحن", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  delivered: { label: "تم التسليم", className: "bg-green-500/10 text-green-500 border-green-500/20" },
  cancelled: { label: "ملغي", className: "bg-red-500/10 text-red-500 border-red-500/20" },
};

const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">آخر الطلبات</h3>
          <p className="text-sm text-muted-foreground">آخر 5 طلبات في المتجر</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} className="gap-2">
          عرض الكل
          <ArrowUpLeft className="w-4 h-4" />
        </Button>
      </div>

      <div className="divide-y divide-border">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            لا توجد طلبات حتى الآن
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{order.customer_name}</p>
                    <Badge variant="outline" className={cn("text-xs", statusConfig[order.status]?.className)}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{order.city}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">${order.total_amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">#{order.id.slice(0, 8)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
