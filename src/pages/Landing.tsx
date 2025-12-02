import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart3,
  Target,
  Zap,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground tracking-tight">
                SIM Questões
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate("/auth?mode=login")} 
                variant="ghost"
                size="sm"
              >
                Entrar
              </Button>
              <Button 
                onClick={() => navigate("/auth?mode=signup")} 
                size="sm"
              >
                Começar grátis
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma de estudos inteligente
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1]">
              Estude com dados,{" "}
              <span className="text-primary">não com achismos</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A plataforma que transforma sua preparação para vestibulares com análise inteligente de desempenho e questões dos principais exames do Brasil.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth?mode=signup")}
                className="gap-2 group"
              >
                Começar agora
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                onClick={() => navigate("/auth?mode=login")}
                variant="outline"
              >
                Já tenho conta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "150k+", label: "Questões" },
              { value: "15+", label: "Vestibulares" },
              { value: "12", label: "Disciplinas" },
              { value: "523", label: "Tópicos" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa para evoluir
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ferramentas pensadas para quem quer resultados reais na preparação para vestibulares.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Banco de Questões",
                description: "Questões reais de ENEM, FUVEST, UECE, PAES UEMA e mais 10 vestibulares organizadas por tema."
              },
              {
                icon: BarChart3,
                title: "Análise de Desempenho",
                description: "Acompanhe sua evolução com métricas detalhadas por disciplina, conteúdo e tópico."
              },
              {
                icon: Target,
                title: "Pontos Fracos",
                description: "Identifique automaticamente onde você precisa melhorar com nosso detector inteligente."
              },
              {
                icon: TrendingUp,
                title: "Evolução Diária",
                description: "Visualize seu progresso ao longo do tempo com gráficos e indicadores claros."
              },
              {
                icon: Zap,
                title: "Tempo de Resposta",
                description: "Monitore quanto tempo você leva em cada questão e otimize seu ritmo de prova."
              },
              {
                icon: BarChart3,
                title: "Mapa de Calor",
                description: "Veja visualmente suas áreas de domínio e dificuldade em cada disciplina."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-muted-foreground text-lg">
              Três passos simples para começar a estudar melhor.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Crie sua conta",
                description: "Cadastro rápido e gratuito. Em segundos você já pode começar."
              },
              {
                step: "02",
                title: "Resolva questões",
                description: "Escolha o vestibular, disciplina ou tópico que deseja praticar."
              },
              {
                step: "03",
                title: "Acompanhe sua evolução",
                description: "Veja seus indicadores de desempenho e saiba exatamente onde focar."
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="text-4xl font-bold text-primary/20 shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simples e acessível
            </h2>
            <p className="text-muted-foreground text-lg">
              Um plano completo por menos de R$ 1,30 por dia.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="rounded-2xl border-2 border-primary bg-card p-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Acesso completo
              </div>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">R$ 37,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>

              <ul className="space-y-3 text-left mb-8">
                {[
                  "Acesso a todas as questões",
                  "Todos os indicadores de desempenho",
                  "Detector de pontos fracos",
                  "Histórico completo de evolução",
                  "Filtros por banca e disciplina",
                  "Cancele quando quiser"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Button 
                size="lg" 
                onClick={() => navigate("/auth?mode=signup")}
                className="w-full gap-2 group"
              >
                Começar agora
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 bg-primary/5 border-t border-border/50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para estudar de forma inteligente?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Junte-se a milhares de estudantes que estão transformando sua preparação.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth?mode=signup")}
              className="gap-2 group"
            >
              Criar conta gratuita
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth?mode=login")}
              variant="outline"
            >
              Entrar na minha conta
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">
                SIM Questões
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SIM Questões. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
