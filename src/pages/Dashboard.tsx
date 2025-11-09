import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Database, BookOpen, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  // Mock data - será substituído por dados reais do banco
  const metrics = [
    { title: "Total de Questões", value: "1.247", icon: Database, variant: "default" as const },
    { title: "Questões Esta Semana", value: "58", icon: TrendingUp, trend: "+12% vs semana anterior", variant: "success" as const },
    { title: "Matérias Cobertas", value: "24", icon: BookOpen, variant: "default" as const },
    { title: "Última Atualização", value: "Hoje", icon: Calendar, trend: "Há 2 horas", variant: "accent" as const },
  ];

  const subjectStats = [
    { subject: "Matemática", count: 245, percentage: 20 },
    { subject: "Português", count: 198, percentage: 16 },
    { subject: "Física", count: 187, percentage: 15 },
    { subject: "Química", count: 165, percentage: 13 },
    { subject: "Biologia", count: 156, percentage: 13 },
    { subject: "Outras", count: 296, percentage: 23 },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral da saúde do seu banco de questões</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Matéria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectStats.map((stat) => (
                  <div key={stat.subject} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{stat.subject}</span>
                      <span className="text-muted-foreground">{stat.count} questões</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Nova questão adicionada", subject: "Matemática", time: "2 horas atrás" },
                  { action: "Questão atualizada", subject: "Física", time: "4 horas atrás" },
                  { action: "Nova questão adicionada", subject: "Química", time: "6 horas atrás" },
                  { action: "Nova questão adicionada", subject: "Português", time: "1 dia atrás" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-2 w-2 rounded-full bg-success mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.subject} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
