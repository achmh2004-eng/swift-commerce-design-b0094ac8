import { Bell, Search, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminHeaderProps {
  email?: string;
  title: string;
  subtitle?: string;
}

const AdminHeader = ({ email, title, subtitle }: AdminHeaderProps) => {
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
          <Button variant="ghost" size="icon" className="relative shrink-0">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground">
              3
            </span>
          </Button>

          {/* User */}
          <div className="flex items-center gap-2 lg:gap-3 pr-2 lg:pr-4 border-r border-border">
            <Avatar className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-primary/30 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                <User className="w-4 h-4 lg:w-5 lg:h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="font-medium text-sm">المدير</p>
              <p className="text-xs text-muted-foreground truncate max-w-[100px] lg:max-w-[150px]">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
