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
  Sparkles,
  School,
  Users,
  BarChart,
  Shield,
  MessageCircle,
  Brain,
  FileText,
  AlertCircle,
  LineChart
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
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "150k+", label: "Questões" },
              { value: "15+", label: "Vestibulares" },
              { value: "12", label: "Disciplinas" },
              { value: "523", label: "Tópicos" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
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
      <section className="py-24 px-6 bg-muted/50 border-y border-border">
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

      {/* Novas Features - Inteligência Pedagógica */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Brain className="h-3.5 w-3.5" />
              Novidades da plataforma
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Inteligência pedagógica de verdade
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ferramentas avançadas para você simular o ENEM, entender seus erros e projetar sua nota com base em ciência.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Análise TRI */}
            <div className="p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                    <Sparkles className="h-3 w-3" />
                    Novo
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Análise TRI com IA
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Estime sua nota do ENEM com base no modelo TRI bayesiano (EAP). Veja sua proficiência com margem de erro e receba diagnóstico inteligente em linguagem natural.
              </p>
              <ul className="space-y-2">
                {[
                  "Estimativa de nota com intervalo de confiança (±SE)",
                  "Diagnóstico personalizado gerado por IA",
                  "Análise por área de conhecimento"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Simulados */}
            <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Simulados Personalizados
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Monte simulados sob medida escolhendo banca, disciplina, conteúdo e nível de dificuldade. Tempo cronometrado e feedback completo ao final.
              </p>
              <ul className="space-y-2">
                {[
                  "Filtros por banca, ano, matéria e dificuldade",
                  "Cronômetro e controle de tempo por questão",
                  "Relatório detalhado de desempenho"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Análise de Erros */}
            <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Análise de Erros
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Revise tudo o que você errou organizado por tópico e disciplina. Aprenda com seus erros de forma sistemática para não repeti-los.
              </p>
              <ul className="space-y-2">
                {[
                  "Histórico completo de questões erradas",
                  "Agrupamento por tópico crítico",
                  "Resoluções e explicações detalhadas"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Evolução & Indicadores */}
            <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Evolução em Tempo Real
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Acompanhe sua jornada com gráficos diários, mapas de calor por disciplina e indicadores de consistência ao longo do tempo.
              </p>
              <ul className="space-y-2">
                {[
                  "Gráficos de evolução diária",
                  "Mapa de calor por área de conhecimento",
                  "Métricas de consistência e ritmo"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simples e acessível
            </h2>
            <p className="text-muted-foreground text-lg">
              Um plano completo por menos de R$ 1,70 por dia.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative rounded-2xl border border-primary/30 bg-card overflow-hidden shadow-lg shadow-primary/5">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-primary" />
              
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  Acesso completo
                </div>
                
                <div className="mb-2">
                  <span className="text-6xl font-extrabold text-foreground tracking-tight">R$ 19</span>
                  <span className="text-2xl font-bold text-foreground">,99</span>
                  <span className="text-muted-foreground ml-1">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">Cancele quando quiser, sem compromisso</p>

                <div className="bg-muted/50 rounded-xl p-5 text-left mb-8 border border-border/50">
                  <ul className="space-y-3">
                    {[
                      "Acesso a todas as questões",
                      "Todos os indicadores de desempenho",
                      "Detector de pontos fracos",
                      "Histórico completo de evolução",
                      "Filtros por banca e disciplina",
                      "Simulados personalizados"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-foreground">
                        <div className="h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth?mode=signup")}
                  className="w-full gap-2 group text-base h-12"
                >
                  Começar agora
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escolas e Instituições */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              <School className="h-3.5 w-3.5" />
              Para Instituições
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Leve o SIM Questões para sua escola
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Escolas, cursinhos e instituições de ensino podem oferecer acesso completo aos seus alunos com condições exclusivas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Users,
                title: "Acesso para todos os alunos",
                description: "Seus estudantes praticam com questões reais sem precisar de assinatura individual."
              },
              {
                icon: BarChart,
                title: "Relatórios de desempenho",
                description: "Acompanhe a evolução dos alunos por disciplina, conteúdo e tópico em tempo real."
              },
              {
                icon: Target,
                title: "Diagnóstico de turma",
                description: "Identifique os pontos fracos coletivos e direcione suas aulas com precisão."
              },
              {
                icon: Shield,
                title: "Ambiente seguro",
                description: "Plataforma confiável com dados protegidos e gestão centralizada pela instituição."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 text-center"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => window.open("https://wa.me/5599999999999?text=Olá! Tenho interesse em ser parceiro do SIM Questões.", "_blank")}
              className="gap-2 group text-base h-12"
            >
              <MessageCircle className="h-5 w-5" />
              Falar com um especialista
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <p className="text-sm text-white/40 mt-3">
              Planos especiais para escolas, cursinhos e redes de ensino
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 border-t border-border">
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
