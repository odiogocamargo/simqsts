import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, Zap, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">SIM Questões</h1>
          </div>
          <Button onClick={() => navigate("/auth")} variant="outline">
            Entrar
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Banco de Questões para
              <span className="text-gradient block mt-2">Vestibulares</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Organize, gerencie e compartilhe questões de vestibulares de forma simples e eficiente
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="gap-2 group"
            >
              Começar Agora
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Banco Completo</h3>
              <p className="text-muted-foreground text-sm">
                Cadastre questões de diversos vestibulares com editor rico em recursos
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
              <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Organização Inteligente</h3>
              <p className="text-muted-foreground text-sm">
                Filtre por matéria, vestibular, ano e nível de dificuldade
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Rápido e Eficiente</h3>
              <p className="text-muted-foreground text-sm">
                Interface moderna e intuitiva para máxima produtividade
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-border">
        <p className="text-center text-muted-foreground text-sm">
          © 2024 SIM Questões. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
