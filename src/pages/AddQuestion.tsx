import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AddQuestion = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Questão adicionada!",
      description: "A questão foi cadastrada com sucesso no banco.",
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Adicionar Questão</h2>
          <p className="text-muted-foreground">Cadastre uma nova questão no banco de dados</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dados da Questão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="statement">Enunciado da Questão</Label>
                <Textarea
                  id="statement"
                  placeholder="Digite o enunciado completo da questão..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subject">Matéria</Label>
                  <Select required>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Selecione a matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matematica">Matemática</SelectItem>
                      <SelectItem value="portugues">Português</SelectItem>
                      <SelectItem value="literatura">Literatura</SelectItem>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="quimica">Química</SelectItem>
                      <SelectItem value="biologia">Biologia</SelectItem>
                      <SelectItem value="historia">História</SelectItem>
                      <SelectItem value="geografia">Geografia</SelectItem>
                      <SelectItem value="filosofia">Filosofia</SelectItem>
                      <SelectItem value="sociologia">Sociologia</SelectItem>
                      <SelectItem value="ingles">Inglês</SelectItem>
                      <SelectItem value="espanhol">Espanhol</SelectItem>
                      <SelectItem value="redacao">Redação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Tópico Específico</Label>
                  <Input
                    id="topic"
                    placeholder="Ex: Integrais, Modernismo..."
                    required
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="exam">Vestibular</Label>
                  <Select required>
                    <SelectTrigger id="exam">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enem">ENEM</SelectItem>
                      <SelectItem value="fuvest">FUVEST</SelectItem>
                      <SelectItem value="unicamp">UNICAMP</SelectItem>
                      <SelectItem value="unesp">UNESP</SelectItem>
                      <SelectItem value="uerj">UERJ</SelectItem>
                      <SelectItem value="ufmg">UFMG</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2023"
                    min="1990"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select required>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Alternativas</Label>
                {["A", "B", "C", "D", "E"].map((letter) => (
                  <div key={letter} className="flex gap-3 items-start">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center font-semibold text-foreground shrink-0">
                      {letter}
                    </div>
                    <Textarea
                      placeholder={`Digite a alternativa ${letter}...`}
                      rows={2}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="correct">Alternativa Correta</Label>
                <Select required>
                  <SelectTrigger id="correct">
                    <SelectValue placeholder="Selecione a alternativa correta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                    <SelectItem value="e">E</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Resolução/Explicação (Opcional)</Label>
                <Textarea
                  id="explanation"
                  placeholder="Digite a resolução detalhada ou explicação da questão..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Adicionar Questão
                </Button>
                <Button type="button" variant="outline">
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default AddQuestion;
