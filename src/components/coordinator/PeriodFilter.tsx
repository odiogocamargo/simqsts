import { useState } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PeriodOption = "7d" | "30d" | "90d" | "all" | "custom";

export interface PeriodRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface PeriodFilterProps {
  period: PeriodOption;
  customRange: PeriodRange;
  onPeriodChange: (period: PeriodOption) => void;
  onCustomRangeChange: (range: PeriodRange) => void;
}

export function getPeriodDates(period: PeriodOption, customRange: PeriodRange): PeriodRange {
  const now = new Date();
  switch (period) {
    case "7d":
      return { from: startOfDay(subDays(now, 7)), to: now };
    case "30d":
      return { from: startOfDay(subDays(now, 30)), to: now };
    case "90d":
      return { from: startOfDay(subDays(now, 90)), to: now };
    case "custom":
      return customRange;
    case "all":
    default:
      return { from: undefined, to: undefined };
  }
}

export function filterByPeriod<T>(
  items: T[],
  dateAccessor: (item: T) => string,
  period: PeriodOption,
  customRange: PeriodRange
): T[] {
  const { from, to } = getPeriodDates(period, customRange);
  if (!from) return items;
  return items.filter((item) => {
    const d = new Date(dateAccessor(item));
    return d >= from && (!to || d <= to);
  });
}

export function PeriodFilter({ period, customRange, onPeriodChange, onCustomRangeChange }: PeriodFilterProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Select value={period} onValueChange={(v) => onPeriodChange(v as PeriodOption)}>
        <SelectTrigger className="w-[160px] h-9 text-sm">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Últimos 7 dias</SelectItem>
          <SelectItem value="30d">Últimos 30 dias</SelectItem>
          <SelectItem value="90d">Últimos 90 dias</SelectItem>
          <SelectItem value="all">Todo período</SelectItem>
          <SelectItem value="custom">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      {period === "custom" && (
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal text-sm h-9",
                !customRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
              {customRange.from ? (
                customRange.to ? (
                  `${format(customRange.from, "dd/MM", { locale: ptBR })} - ${format(customRange.to, "dd/MM", { locale: ptBR })}`
                ) : (
                  format(customRange.from, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                "Selecionar datas"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={{ from: customRange.from, to: customRange.to }}
              onSelect={(range) => {
                onCustomRangeChange({ from: range?.from, to: range?.to });
                if (range?.from && range?.to) setCalendarOpen(false);
              }}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
