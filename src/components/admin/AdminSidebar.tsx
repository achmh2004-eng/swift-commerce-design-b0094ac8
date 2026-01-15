import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LogOut,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  onLogout: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "الرئيسية", path: "/admin" },
  { icon: Package, label: "المنتجات", path: "/admin/products" },
  { icon: ShoppingCart, label: "الطلبات", path: "/admin/orders" },
  { icon: TrendingUp, label: "التحليلات", path: "/admin/analytics" },
  { icon: Users, label: "العملاء", path: "/admin/customers" },
  { icon: Settings, label: "الإعدادات", path: "/admin/settings" },
];

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed right-0 top-0 h-screen bg-card border-l border-border z-50 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-up">
              <h1 className="font-bold text-lg">لوحة التحكم</h1>
              <p className="text-xs text-muted-foreground">إدارة المتجر</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -left-4 top-8 w-8 h-8 rounded-full bg-card border border-border shadow-lg hover:bg-muted"
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === "/admin" && location.pathname === "/admin") ||
            (item.path !== "/admin" && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-gradient-to-l from-primary/20 to-transparent text-primary border-r-4 border-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200",
                isActive ? "text-primary" : "group-hover:scale-110"
              )} />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200",
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
