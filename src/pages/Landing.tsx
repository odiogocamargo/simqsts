import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Target, 
  Zap,
  Database,
  BarChart3,
  Filter,
  LineChart,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              SIM Questões
            </h1>
            <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
              Começar Agora
              <ArrowRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      {/* DOBRA 01 — HERO IMEDIATO */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[1.1]">
              Você está estudando{" "}
              <span className="relative inline-block">
                <span className="text-destructive">errado</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 8 Q50 4, 100 8 T200 8" stroke="hsl(var(--destructive))" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
              {" "}— e isso está custando a sua aprovação.
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Se você continuar repetindo o mesmo método, vai repetir o mesmo resultado.
              <span className="block mt-3 text-foreground font-bold">
                A diferença é que este ano as vagas estarão ainda mais disputadas.
              </span>
            </p>

            {/* Pricing Box */}
            <div className="bg-card border-2 border-primary rounded-2xl p-8 max-w-2xl mx-auto mt-12 shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="text-left space-y-2">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">A ferramenta certa custa</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-primary">R$ 37,90</span>
                    <span className="text-xl text-muted-foreground">/mês</span>
                  </div>
                </div>
                <div className="text-left space-y-2">
                  <p className="text-sm text-destructive uppercase tracking-wide font-semibold">O preço de continuar errado</p>
                  <div className="text-3xl font-black text-destructive">
                    Mais um ano perdido
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="gap-2 group text-xl px-12 py-8 h-auto shadow-2xl hover:shadow-xl transition-all font-bold"
              >
                Quero mudar isso agora — R$ 37,90/mês
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DOBRA 02 — A DOR DIRETA */}
      <section className="py-20 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8 text-center">
              Você já sentiu isso:
            </h2>
            
            <div className="space-y-4">
              {[
                "Estudar horas e não evoluir.",
                "Ter a sensação de que \"está indo bem\", até ver o resultado.",
                "Errar questões simples por não entender o padrão da banca.",
                "Ficar travado, ansioso, inseguro.",
                "Sentir que nunca é suficiente."
              ].map((pain, index) => (
                <Card key={index} className="border-2 border-border hover:border-destructive/50 transition-all">
                  <CardContent className="p-6 flex gap-4 items-start">
                    <XCircle className="h-6 w-6 text-destructive shrink-0 mt-1" />
                    <p className="text-xl text-foreground font-medium">{pain}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center space-y-4">
              <p className="text-2xl font-bold text-foreground">
                Isso não é falta de esforço.
              </p>
              <p className="text-3xl font-black text-primary">
                É falta de dados, clareza e direcionamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DOBRA 03 — PROPOSTA CLARA COM PRICING CARD */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-12 text-center leading-tight">
            O SIM Questões entrega exatamente{" "}
            <span className="text-primary">o que você não tem hoje</span>
          </h2>
          
          {/* PRICING CARD - Estilo Aprovado */}
          <div className="max-w-xl mx-auto">
            <Card className="border-2 border-primary shadow-2xl bg-card overflow-hidden">
              <CardContent className="p-8 md:p-10 space-y-8">
                {/* Header com Preço */}
                <div className="text-center space-y-4">
                  <div className="inline-block px-6 py-2 bg-primary/10 rounded-full">
                    <p className="text-sm font-black text-primary uppercase tracking-wider">Aprovado</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-7xl md:text-8xl font-black text-primary leading-none">
                      R$37,90
                    </p>
                    <p className="text-lg text-muted-foreground font-medium">/mês</p>
                  </div>

                  <Button 
                    size="lg" 
                    onClick={() => navigate("/auth")}
                    className="w-full gap-2 text-xl py-6 font-black bg-gradient-to-r from-[hsl(24,100%,50%)] to-[hsl(24,100%,45%)] hover:from-[hsl(24,100%,55%)] hover:to-[hsl(24,100%,50%)] text-white shadow-lg"
                  >
                    EU QUERO
                  </Button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Database, label: "Banco De Questões" },
                    { icon: BarChart3, label: "Minhas Estatísticas" },
                    { icon: Target, label: "Cronograma de estudos" },
                    { icon: Zap, label: "Simulados" }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-primary/30 bg-background hover:border-primary transition-all"
                    >
                      <item.icon className="h-8 w-8 text-primary" />
                      <p className="text-xs text-center font-semibold text-foreground leading-tight">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Benefícios Lista */}
                <div className="space-y-3 pt-4">
                  {[
                    { icon: Database, text: "Banco de questões (+200 mil)" },
                    { icon: Zap, text: "Questões inéditas (+15 mil)" },
                    { icon: CheckCircle, text: "Provas atualizadas" },
                    { icon: Target, text: "Resolução de questões em texto e vídeo (+3 mil)" },
                    { icon: Filter, text: "Lista de exercícios" },
                    { icon: TrendingUp, text: "Pontos fortes e a melhorar" },
                    { icon: CheckCircle, text: "Questões que mais caem por instituição" },
                    { icon: Database, text: "Download e impressão de provas" },
                    { icon: CheckCircle, text: "Correção via cartão-resposta por foto" }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <benefit.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground font-medium">{benefit.text}</p>
                    </div>
                  ))}
                </div>

                {/* CTA Final Verde */}
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="w-full gap-2 text-xl py-6 font-black bg-[hsl(142,76%,36%)] hover:bg-[hsl(142,76%,40%)] text-white shadow-lg"
                >
                  COMEÇAR AGORA
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid abaixo do card */}
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            {[
              { icon: Database, text: "Mais de 150.000 questões reais dos principais vestibulares" },
              { icon: BarChart3, text: "Microdados completos para você analisar cada erro" },
              { icon: TrendingUp, text: "Indicadores diários mostrando onde focar" },
              { icon: Filter, text: "Filtros inteligentes por banca, matéria e tópico" },
              { icon: LineChart, text: "Evolução acelerada baseada em dados — não em esperança" },
              { icon: Clock, text: "Economia de tempo com estudo direcionado" }
            ].map((feature, index) => (
              <Card key={index} className="border-2 border-primary/30 bg-primary/5 hover:border-primary hover:shadow-lg transition-all">
                <CardContent className="p-6 flex gap-4 items-start">
                  <div className="bg-primary/20 p-3 rounded-xl shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg text-foreground font-semibold">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DOBRA 04 — A VERDADE QUE MACHUCA */}
      <section className="py-20 bg-gradient-to-br from-destructive/5 via-background to-destructive/5 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* SEM DADOS */}
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-destructive mb-6 flex items-center gap-3">
                  <XCircle className="h-8 w-8" />
                  Se você continuar estudando sem dados:
                </h3>
                <div className="space-y-3">
                  {[
                    "Vai repetir erros",
                    "Vai desperdiçar meses",
                    "Vai chegar inseguro",
                    "Vai travar novamente",
                    "Vai sentir a mesma dor da última vez"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                      <XCircle className="h-5 w-5 text-destructive shrink-0" />
                      <p className="text-lg font-medium text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* COM DADOS */}
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-success mb-6 flex items-center gap-3">
                  <CheckCircle className="h-8 w-8" />
                  Com dados, você descobre:
                </h3>
                <div className="space-y-3">
                  {[
                    "Exatamente onde está fraco",
                    "Exatamente o que precisa estudar",
                    "Exatamente como está evoluindo",
                    "Exatamente como a banca pensa",
                    "Exatamente como aumentar sua nota rápido"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-success/10 rounded-lg border border-success/30">
                      <CheckCircle className="h-5 w-5 text-success shrink-0" />
                      <p className="text-lg font-medium text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOBRA 05 — PROVA DE VALOR */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-12">
            Você terá acesso imediato a:
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              { icon: Database, title: "150.000+ questões reais", highlight: true },
              { icon: BarChart3, title: "Relatórios de microdados", highlight: true },
              { icon: Target, title: "Mapas de calor do seu desempenho", highlight: false },
              { icon: Zap, title: "Detectores dos seus pontos fracos", highlight: false },
              { icon: TrendingUp, title: "Evolução diária", highlight: false },
              { icon: CheckCircle, title: "Estudo direcionado", highlight: false }
            ].map((item, index) => (
              <Card key={index} className={`border-2 ${item.highlight ? 'border-primary bg-primary/5' : 'border-border'} hover:shadow-lg transition-all`}>
                <CardContent className="p-6 flex gap-4 items-center">
                  <div className={`${item.highlight ? 'bg-primary' : 'bg-muted'} p-3 rounded-xl shrink-0`}>
                    <item.icon className={`h-6 w-6 ${item.highlight ? 'text-primary-foreground' : 'text-foreground'}`} />
                  </div>
                  <p className="text-xl font-bold text-foreground">{item.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 space-y-4">
            <p className="text-2xl font-bold text-muted-foreground">Nada mais.</p>
            <p className="text-2xl font-bold text-muted-foreground">Nada menos.</p>
            <p className="text-3xl font-black text-primary">Só o que funciona.</p>
          </div>
        </div>
      </section>

      {/* DOBRA 06 — CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary shadow-2xl bg-card">
              <CardContent className="p-12 text-center space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
                  Você já sabe como é{" "}
                  <span className="text-destructive">estudar errado</span>.
                </h2>
                
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  Agora descubra como é estudar{" "}
                  <span className="text-primary">do jeito que aprova</span>.
                </p>

                <div className="pt-6">
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/auth")}
                    className="gap-3 group text-2xl px-12 py-8 h-auto shadow-2xl hover:shadow-xl transition-all font-black"
                  >
                    Quero evoluir agora — R$ 37,90/mês
                    <ArrowRight className="h-7 w-7 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground pt-4">
                  ✨ Acesso imediato • Cancele quando quiser
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <p className="text-xl font-bold text-foreground">
              SIM Questões
            </p>
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
