import { Bell, Search, User } from "lucide-react";
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
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="بحث..." 
              className="w-64 pr-10 bg-card border-border rounded-xl"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground">
              3
            </span>
          </Button>

          {/* User */}
          <div className="flex items-center gap-3 pr-4 border-r border-border">
            <Avatar className="w-10 h-10 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="font-medium text-sm">المدير</p>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
