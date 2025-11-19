import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, Trophy, Award, CheckCircle, ArrowRight, TrendingUp, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-primary/70 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                SIM Questões
              </h1>
            </div>
            <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
              Começar Agora
              <ArrowRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Banner Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 md:p-8 text-center animate-fade-in">
            <p className="text-primary-foreground text-lg md:text-xl font-semibold">
              🎯 Prepare-se para o ENEM e PAES UEMA com milhares de questões organizadas
            </p>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                <Trophy className="h-4 w-4" />
                Sua aprovação começa aqui
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Domine os vestibulares com
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                prática inteligente
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Treine com questões reais do ENEM e PAES UEMA, acompanhe seu desempenho e conquiste sua vaga nas principais universidades do país
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="gap-2 group text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                Começar a Praticar Grátis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 md:gap-12 pt-12 max-w-3xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Matérias</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">73</div>
                <div className="text-sm text-muted-foreground">Conteúdos</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">523</div>
                <div className="text-sm text-muted-foreground">Tópicos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Por que escolher o SIM Questões?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para sua preparação em um só lugar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="bg-gradient-to-br from-primary to-primary/70 w-14 h-14 rounded-2xl flex items-center justify-center">
                  <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Estudo Direcionado</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Foque nas matérias e conteúdos que você mais precisa. Filtre por dificuldade, ano e tópico específico.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="bg-gradient-to-br from-secondary to-secondary/70 w-14 h-14 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Acompanhe sua Evolução</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Veja seu desempenho em tempo real, identifique pontos fracos e celebre suas conquistas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="bg-gradient-to-br from-accent to-accent/70 w-14 h-14 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Questões Reais</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pratique com questões dos principais vestibulares organizadas por matéria e conteúdo programático.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Como funciona?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simples, rápido e eficiente. Comece a estudar em 3 passos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto border-4 border-primary/20">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Crie sua conta</h3>
              <p className="text-muted-foreground">
                Cadastre-se gratuitamente em menos de 1 minuto
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto border-4 border-primary/20">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Escolha sua trilha</h3>
              <p className="text-muted-foreground">
                Selecione matérias, conteúdos e tópicos específicos
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto border-4 border-primary/20">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Pratique e evolua</h3>
              <p className="text-muted-foreground">
                Resolva questões e acompanhe seu progresso
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                O que você vai conseguir
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: CheckCircle, title: "Preparação completa", desc: "Cobertura total do conteúdo de ENEM e PAES UEMA" },
                { icon: TrendingUp, title: "Melhore seus resultados", desc: "Acompanhe sua evolução e identifique pontos de melhoria" },
                { icon: Target, title: "Estudo eficiente", desc: "Foque no que realmente importa com filtros inteligentes" },
                { icon: Award, title: "Conquiste sua vaga", desc: "Aumente suas chances de aprovação nas melhores universidades" },
              ].map((benefit, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-6 flex gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="inline-flex p-3 bg-primary/20 rounded-2xl">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Sua aprovação está mais perto do que você imagina
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Junte-se a centenas de estudantes que estão transformando sua preparação com o SIM Questões
              </p>
              <div className="pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="gap-2 group text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  Começar Minha Preparação Agora
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                ✨ Grátis para sempre • Sem cartão de crédito
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-primary/70 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                SIM Questões
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Sua plataforma completa de preparação para ENEM e PAES UEMA. 
              Pratique, evolua e conquiste sua aprovação.
            </p>
            <div className="text-sm text-muted-foreground">
              © 2024 SIM Questões. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
