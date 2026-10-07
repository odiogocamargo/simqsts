import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download } from "lucide-react";

const BASE = "https://ovpvsysssqnvqwkqeybh.supabase.co/functions/v1";

const endpoints = [
  {
    name: "Feed de questões",
    method: "GET",
    desc: "Lista paginada de questões e taxonomia. Exige X-Api-Key (gerada em Integrações).",
    http: `### Feed de questões
GET ${BASE}/public-questions-feed?entity=questions&page=1&page_size=50
X-Api-Key: {{apiKey}}`,
  },
  {
    name: "Feed incremental (since)",
    method: "GET",
    desc: "Apenas registros alterados desde uma data. Entities: questions, subjects, contents, topics, areas, exams, question_images, question_topics.",
    http: `### Feed incremental
GET ${BASE}/public-questions-feed?entity=questions&since=2026-01-01T00:00:00Z
X-Api-Key: {{apiKey}}`,
  },
  {
    name: "Taxonomia pública",
    method: "GET",
    desc: "Matérias, conteúdos e tópicos. Sem autenticação.",
    http: `### Taxonomia
GET ${BASE}/public-taxonomy?tree=1`,
  },
  {
    name: "Ingest de questões",
    method: "POST",
    desc: "Recebe questões assinadas por HMAC-SHA256 (header x-signature-sha256 do corpo, com o webhook secret).",
    http: `### Ingest
POST ${BASE}/sim-questoes-ingest
Content-Type: application/json
x-signature-sha256: {{signature}}

{
  "event_id": "teste-1",
  "entity_type": "question",
  "operation": "upsert",
  "payload": { "id": "00000000-0000-0000-0000-000000000000" }
}`,
  },
];

const fullFile = `# Sim Questões — abra no VS Code com a extensão "REST Client"
@apiKey = COLE_SUA_API_KEY_AQUI
@signature = HMAC_DO_CORPO

${endpoints.map((e) => e.http).join("\n\n")}
`;

export default function Apis() {
  const { toast } = useToast();
  const copy = (t: string) => {
    navigator.clipboard.writeText(t);
    toast({ title: "Copiado!" });
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([fullFile], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "sim-questoes.http";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">APIs</h1>
            <p className="text-muted-foreground text-sm">
              Use no VS Code com a extensão <strong>REST Client</strong>: baixe o arquivo, cole sua API key e clique em "Send Request".
            </p>
          </div>
          <Button onClick={download}><Download className="h-4 w-4 mr-2" />Baixar arquivo .http</Button>
        </div>
        {endpoints.map((e) => (
          <Card key={e.name}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Badge variant={e.method === "GET" ? "secondary" : "default"}>{e.method}</Badge>
                  {e.name}
                </CardTitle>
                <CardDescription>{e.desc}</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => copy(e.http)}><Copy className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto whitespace-pre-wrap">{e.http}</pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
