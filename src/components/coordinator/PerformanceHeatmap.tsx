import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface HeatmapCell {
  id: string;
  name: string;
  parentName?: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface PerformanceHeatmapProps {
  contentData: HeatmapCell[];
  topicData: HeatmapCell[];
  title?: string;
}

function getColor(accuracy: number, total: number) {
  if (total === 0) return "bg-muted text-muted-foreground";
  if (accuracy >= 70) return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
  if (accuracy >= 50) return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
  return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
}

function HeatmapGrid({ data }: { data: HeatmapCell[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">Sem dados suficientes</p>;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5">
        {data.map((cell) => (
          <Tooltip key={cell.id}>
            <TooltipTrigger asChild>
              <div
                className={`rounded-md border p-1.5 text-center cursor-default transition-colors ${getColor(cell.accuracy, cell.total)}`}
              >
                <p className="text-xs font-bold leading-tight">{cell.total > 0 ? `${cell.accuracy}%` : "—"}</p>
                <p className="text-[9px] leading-tight truncate mt-0.5">
                  {cell.name.length > 12 ? cell.name.substring(0, 12) + "…" : cell.name}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[220px]">
              <p className="font-semibold text-sm">{cell.name}</p>
              {cell.parentName && (
                <p className="text-xs text-muted-foreground">{cell.parentName}</p>
              )}
              <p className="text-xs mt-1">
                {cell.correct}/{cell.total} acertos ({cell.total > 0 ? cell.accuracy : 0}%)
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
          <span>&lt;50%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30" />
          <span>50-69%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
          <span>≥70%</span>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function PerformanceHeatmap({ contentData, topicData, title = "Mapa de Calor de Desempenho" }: PerformanceHeatmapProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content">
          <TabsList className="mb-3">
            <TabsTrigger value="content">Por Conteúdo</TabsTrigger>
            <TabsTrigger value="topic">Por Tópico</TabsTrigger>
          </TabsList>
          <TabsContent value="content">
            <HeatmapGrid data={contentData} />
          </TabsContent>
          <TabsContent value="topic">
            <HeatmapGrid data={topicData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
