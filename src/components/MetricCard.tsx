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
      "transition-all hover:shadow-md",
      variant === "success" && "border-success/20",
      variant === "accent" && "border-accent/20"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                variant === "success" && "text-success",
                variant === "accent" && "text-accent",
                variant === "default" && "text-muted-foreground"
              )}>
                {trend}
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            variant === "success" && "bg-success/10",
            variant === "accent" && "bg-accent/10",
            variant === "default" && "bg-primary/10"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              variant === "success" && "text-success",
              variant === "accent" && "text-accent",
              variant === "default" && "text-primary"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
