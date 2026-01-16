import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  iconColor = "text-primary",
  className 
}: StatsCardProps) => {
  return (
    <div className={cn(
      "bg-card border border-border rounded-xl lg:rounded-2xl p-4 lg:p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30 group",
      className
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 lg:space-y-2 min-w-0">
          <p className="text-xs lg:text-sm text-muted-foreground truncate">{title}</p>
          <p className="text-xl lg:text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              changeType === "positive" && "bg-green-500/10 text-green-500",
              changeType === "negative" && "bg-red-500/10 text-red-500",
              changeType === "neutral" && "bg-muted text-muted-foreground"
            )}>
              {changeType === "positive" && "↑"}
              {changeType === "negative" && "↓"}
              <span className="hidden sm:inline">{change}</span>
              <span className="sm:hidden">{change.split(' ')[0]}</span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0",
          "bg-gradient-to-br from-primary/20 to-primary/5"
        )}>
          <Icon className={cn("w-5 h-5 lg:w-7 lg:h-7", iconColor)} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
