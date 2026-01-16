import { useState, useEffect } from "react";
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
  X,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "@/assets/logo.png";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar when resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-foreground flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="animate-fade-up">
              <h1 className="font-bold text-lg">لوحة التحكم</h1>
              <p className="text-xs text-muted-foreground">إدارة المتجر</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === "/admin" && location.pathname === "/admin") ||
            (item.path !== "/admin" && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-gradient-to-l from-primary/20 to-transparent text-primary border-r-4 border-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 shrink-0",
                isActive ? "text-primary" : "group-hover:scale-110"
              )} />
              {(!collapsed || isMobile) && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 lg:p-4 border-t border-border">
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 lg:px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200",
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(!collapsed || isMobile) && <span className="font-medium">تسجيل الخروج</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-card border border-border shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed right-0 top-0 h-screen bg-card border-l border-border z-50 transition-transform duration-300 flex flex-col w-72 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="absolute left-4 top-4"
        >
          <X className="w-5 h-5" />
        </Button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "fixed right-0 top-0 h-screen bg-card border-l border-border z-50 transition-all duration-300 flex-col hidden lg:flex",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -left-4 top-8 w-8 h-8 rounded-full bg-card border border-border shadow-lg hover:bg-muted"
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>

        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
