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
      "bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30 group",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <div className={cn(
              "inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full",
              changeType === "positive" && "bg-green-500/10 text-green-500",
              changeType === "negative" && "bg-red-500/10 text-red-500",
              changeType === "neutral" && "bg-muted text-muted-foreground"
            )}>
              {changeType === "positive" && "↑"}
              {changeType === "negative" && "↓"}
              {change}
            </div>
          )}
        </div>
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          "bg-gradient-to-br from-primary/20 to-primary/5"
        )}>
          <Icon className={cn("w-7 h-7", iconColor)} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
