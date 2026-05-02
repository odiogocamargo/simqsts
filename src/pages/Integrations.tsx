import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Plus, Loader2, Plug, AlertTriangle, Send, ShieldCheck, ShieldX, CheckCircle2, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Consumer {
  id: string;
  name: string;
  api_key_prefix: string;
  webhook_url: string | null;
  active: boolean;
  last_ping_at: string | null;
  events_sent: number;
  events_failed: number;
  created_at: string;
}

interface OutboxRow {
  id: number;
  entity_type: string;
  operation: string;
  attempts: number;
  delivered_at: string | null;
  last_error: string | null;
  created_at: string;
}

export default function Integrations() {
  const { toast } = useToast();
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [outbox, setOutbox] = useState<OutboxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [newCredentials, setNewCredentials] = useState<{ api_key: string; webhook_secret: string } | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: c }, { data: o }] = await Promise.all([
      supabase.from("external_consumers").select("*").order("created_at", { ascending: false }),
      supabase.from("webhook_outbox").select("id,entity_type,operation,attempts,delivered_at,last_error,created_at").order("id", { ascending: false }).limit(20),
    ]);
    setConsumers((c as Consumer[]) ?? []);
    setOutbox((o as OutboxRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("create-external-consumer", {
      body: { name: name.trim(), webhook_url: webhookUrl.trim() || null },
    });
    setCreating(false);
    if (error || data?.error) {
      toast({ title: "Erro", description: error?.message ?? data?.error, variant: "destructive" });
      return;
    }
    setNewCredentials({ api_key: data.api_key, webhook_secret: data.webhook_secret });
    setName("");
    setWebhookUrl("");
    load();
  };

  const toggleActive = async (c: Consumer) => {
    const { error } = await supabase.from("external_consumers").update({ active: !c.active }).eq("id", c.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else load();
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copiado` });
  };

  const runTest = async (c: Consumer, mode: "valid" | "bad_signature") => {
    if (!c.webhook_url) {
      toast({ title: "Webhook URL não configurada", description: "Edite o consumidor e adicione a URL primeiro.", variant: "destructive" });
      return;
    }
    setTestingId(c.id + ":" + mode);
    setTestResult(null);
    const { data, error } = await supabase.functions.invoke("test-webhook", {
      body: { consumer_id: c.id, mode },
    });
    setTestingId(null);
    if (error) {
      toast({ title: "Erro ao testar", description: error.message, variant: "destructive" });
      return;
    }
    setTestResult(data);
  };

  const pendingOutbox = outbox.filter((o) => !o.delivered_at).length;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Plug className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Integrações externas</h1>
            <p className="text-sm text-muted-foreground">
              Espelhe questões e taxonomia em outras aplicações via webhook + endpoint de seed.
            </p>
          </div>
        </div>

        {/* Criar consumidor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adicionar nova aplicação consumidora</CardTitle>
            <CardDescription>
              Gere uma API key e configure a URL onde a outra app receberá eventos de mudança (POST com assinatura HMAC).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: App Banco de Questões v2" />
              </div>
              <div>
                <Label>Webhook URL (https)</Label>
                <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://outra-app.lovable.app/functions/v1/sim-questoes-webhook" />
              </div>
            </div>
            <Button onClick={handleCreate} disabled={creating} className="gap-2">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Criar consumidor
            </Button>

            {newCredentials && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Guarde estas credenciais agora — elas não serão mostradas novamente</AlertTitle>
                <AlertDescription className="space-y-3 mt-3">
                  <div>
                    <Label className="text-xs">API Key (header X-Api-Key)</Label>
                    <div className="flex gap-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-muted rounded text-xs break-all">{newCredentials.api_key}</code>
                      <Button size="sm" variant="outline" onClick={() => copy(newCredentials.api_key, "API key")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Webhook Secret (verificar header X-Signature-Sha256)</Label>
                    <div className="flex gap-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-muted rounded text-xs break-all">{newCredentials.webhook_secret}</code>
                      <Button size="sm" variant="outline" onClick={() => copy(newCredentials.webhook_secret, "Webhook secret")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setNewCredentials(null)}>Já guardei, fechar</Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Lista de consumidores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Consumidores cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : consumers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Nenhuma aplicação cadastrada ainda.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Webhook</TableHead>
                    <TableHead>Último ping</TableHead>
                    <TableHead className="text-right">Enviados / Falhas</TableHead>
                    <TableHead>Ativo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consumers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell><code className="text-xs">{c.api_key_prefix}…</code></TableCell>
                      <TableCell className="max-w-[280px] truncate text-xs text-muted-foreground">{c.webhook_url ?? "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.last_ping_at ? new Date(c.last_ping_at).toLocaleString("pt-BR") : "nunca"}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {c.events_sent} / <span className="text-destructive">{c.events_failed}</span>
                      </TableCell>
                      <TableCell>
                        <Switch checked={c.active} onCheckedChange={() => toggleActive(c)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Outbox */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Fila de eventos (últimos 20)</CardTitle>
              <CardDescription>Webhook é disparado a cada minuto. Pendentes: <Badge variant="secondary">{pendingOutbox}</Badge></CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={load}>Recarregar</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Op</TableHead>
                  <TableHead>Tentativas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quando</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outbox.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="text-xs">{o.id}</TableCell>
                    <TableCell className="text-xs">{o.entity_type}</TableCell>
                    <TableCell className="text-xs">{o.operation}</TableCell>
                    <TableCell className="text-xs">{o.attempts}</TableCell>
                    <TableCell>
                      {o.delivered_at ? <Badge variant="secondary">entregue</Badge> : <Badge>pendente</Badge>}
                      {o.last_error && <span className="block text-xs text-destructive mt-1">{o.last_error}</span>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Doc */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Como conectar a outra app (também Lovable)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><strong>1. Seed inicial</strong> — na app consumidora, faça GET paginado:</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">{`GET https://ovpvsysssqnvqwkqeybh.supabase.co/functions/v1/public-questions-feed?entity=questions&page=1&page_size=200
Headers: X-Api-Key: <a key gerada acima>

Entidades: questions, question_images, question_topics,
           subjects, contents, topics, areas, exams`}</pre>
            <p><strong>2. Webhook</strong> — crie uma edge function na outra app que recebe POST e faz upsert/delete localmente. Ela receberá:</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">{`POST <webhook_url>
Headers: X-Signature-Sha256: <hmac sha256 do body usando webhook_secret>
Body: {
  "event_id": 123,
  "entity_type": "question",
  "entity_id": "uuid",
  "operation": "insert" | "update" | "delete",
  "payload": { ...row inteira... },
  "created_at": "..."
}`}</pre>
            <p className="text-muted-foreground">As imagens permanecem no bucket público <code>question-images</code> daqui — basta a outra app guardar a URL.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
