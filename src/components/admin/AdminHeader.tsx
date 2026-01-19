import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

interface Notification {
  id: string;
  type: "order";
  message: string;
  time: Date;
  read: boolean;
  orderId?: string;
}

const AdminHeader = ({ title, subtitle }: AdminHeaderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch recent orders as notifications
    const fetchNotifications = async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("id, customer_name, total_amount, created_at, status")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      const orderNotifications: Notification[] = orders.map((order) => ({
        id: order.id,
        type: "order",
        message: `طلب جديد من ${order.customer_name} - ${order.total_amount.toFixed(0)} د.ج`,
        time: new Date(order.created_at),
        read: order.status !== "pending",
        orderId: order.id,
      }));

      setNotifications(orderNotifications);
      setUnreadCount(orderNotifications.filter((n) => !n.read).length);
    };

    fetchNotifications();

    // Subscribe to new orders
    const channel = supabase
      .channel("orders-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const newOrder = payload.new as any;
          const newNotification: Notification = {
            id: newOrder.id,
            type: "order",
            message: `طلب جديد من ${newOrder.customer_name} - ${newOrder.total_amount.toFixed(0)} د.ج`,
            time: new Date(newOrder.created_at),
            read: false,
            orderId: newOrder.id,
          };
          setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.orderId) {
      navigate("/admin/orders");
    }
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Spacer for mobile menu button */}
        <div className="w-10 lg:hidden" />
        
        <div className="flex-1 min-w-0">
          <h1 className="text-lg lg:text-2xl font-bold truncate">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground truncate hidden sm:block">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden lg:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="بحث..." 
              className="w-48 xl:w-64 pr-10 bg-card border-border rounded-xl"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative shrink-0">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-80 bg-card border border-border shadow-lg z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold">الإشعارات</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    تحديد الكل كمقروء
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    لا توجد إشعارات
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`px-4 py-3 cursor-pointer ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? "font-semibold" : ""}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(notification.time, {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
