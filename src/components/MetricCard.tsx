import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "accent";
}

export const MetricCard = ({ title, value, icon: Icon, trend, variant = "default" }: MetricCardProps) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] premium-shadow hover:premium-glow animate-fade-in",
      variant === "success" && "border-success/30 hover:border-success/50",
      variant === "accent" && "border-accent/30 hover:border-accent/50",
      variant === "default" && "border-primary/30 hover:border-primary/50"
    )}>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-4xl font-bold text-foreground tracking-tight">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs font-semibold tracking-wide",
                variant === "success" && "text-success",
                variant === "accent" && "text-accent",
                variant === "default" && "text-primary"
              )}>
                {trend}
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
            variant === "success" && "bg-gradient-to-br from-success/20 to-success/10 group-hover:from-success/30 group-hover:to-success/20",
            variant === "accent" && "bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20",
            variant === "default" && "bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20"
          )}>
            <Icon className={cn(
              "h-7 w-7 transition-colors",
              variant === "success" && "text-success",
              variant === "accent" && "text-accent",
              variant === "default" && "text-primary"
            )} />
          </div>
        </div>
      </CardContent>
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        variant === "success" && "bg-gradient-to-br from-success/5 to-transparent",
        variant === "accent" && "bg-gradient-to-br from-accent/5 to-transparent",
        variant === "default" && "bg-gradient-to-br from-primary/5 to-transparent"
      )} />
    </Card>
  );
};
