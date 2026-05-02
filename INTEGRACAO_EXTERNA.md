# Integração: espelhar Sim Questões em outra app Lovable

Este guia mostra como **a app consumidora** (também feita no Lovable, com Supabase próprio) sincroniza o banco de questões e taxonomia do Sim Questões em tempo quase real.

## Arquitetura

```
[Sim Questões DB] -- trigger --> [webhook_outbox]
                                       |
                            cron 1min  v
                              [dispatch-webhooks]  --POST assinado-->  [Outra app: edge function]
                                                                              |
                                                                              v
                                                                       [Supabase da outra app]

[Outra app] --GET X-Api-Key--> [public-questions-feed] (seed inicial / reconciliação)
```

- **Imagens**: ficam no bucket público `question-images` daqui. A outra app só guarda a URL.
- **Latência típica**: ≤ 1 minuto após uma mudança aqui.
- **Direção**: somente leitura. A outra app nunca escreve aqui.

## 1. Pegar a API key

Como admin no Sim Questões, vá em **Integrações** → **Adicionar nova aplicação consumidora**.

Você receberá (mostrado **uma única vez**):
- `api_key` — usada no header `X-Api-Key` para o seed
- `webhook_secret` — usada para verificar a assinatura `X-Signature-Sha256` dos webhooks

Guarde os dois como secrets na outra app (`SIM_QUESTOES_API_KEY` e `SIM_QUESTOES_WEBHOOK_SECRET`).

## 2. Tabelas espelho (na outra app)

Crie tabelas equivalentes via migration. As principais:

```sql
CREATE TABLE public.questions (
  id uuid PRIMARY KEY,
  exam_id text NOT NULL,
  subject_id text NOT NULL,
  content_id text NOT NULL,
  year int NOT NULL,
  question_number text,
  question_type text NOT NULL,
  statement text NOT NULL,
  option_a text, option_b text, option_c text, option_d text, option_e text,
  correct_answer text,
  explanation text,
  difficulty text,
  needs_review boolean DEFAULT false,
  review_reason text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.question_images (
  id uuid PRIMARY KEY,
  question_id uuid NOT NULL,
  image_url text NOT NULL,         -- aponta para o bucket do Sim Questões
  image_type text,
  display_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.question_topics (
  id uuid PRIMARY KEY,
  question_id uuid NOT NULL,
  topic_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Taxonomia
CREATE TABLE public.areas    (id text PRIMARY KEY, name text NOT NULL, created_at timestamptz, updated_at timestamptz);
CREATE TABLE public.exams    (id text PRIMARY KEY, name text NOT NULL, created_at timestamptz, updated_at timestamptz);
CREATE TABLE public.subjects (id text PRIMARY KEY, name text NOT NULL, area_id text, created_at timestamptz, updated_at timestamptz);
CREATE TABLE public.contents (id text PRIMARY KEY, name text NOT NULL, subject_id text NOT NULL, created_at timestamptz, updated_at timestamptz);
CREATE TABLE public.topics   (id text PRIMARY KEY, name text NOT NULL, content_id text NOT NULL, created_at timestamptz, updated_at timestamptz);
```

## 3. Edge function de seed inicial

```ts
// supabase/functions/sim-questoes-seed/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FEED = "https://ovpvsysssqnvqwkqeybh.supabase.co/functions/v1/public-questions-feed";
const ENTITIES = ["areas", "exams", "subjects", "contents", "topics", "questions", "question_images", "question_topics"];

Deno.serve(async () => {
  const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const apiKey = Deno.env.get("SIM_QUESTOES_API_KEY")!;
  let total = 0;

  for (const entity of ENTITIES) {
    let page = 1;
    while (true) {
      const res = await fetch(`${FEED}?entity=${entity}&page=${page}&page_size=500`, {
        headers: { "X-Api-Key": apiKey },
      });
      const json = await res.json();
      if (!json.data?.length) break;
      const { error } = await supa.from(entity).upsert(json.data);
      if (error) throw error;
      total += json.data.length;
      if (!json.has_more) break;
      page++;
    }
  }
  return new Response(JSON.stringify({ ok: true, total }), { headers: { "Content-Type": "application/json" } });
});
```

Rode uma vez (manualmente ou via curl) para popular o banco.

## 4. Edge function que recebe o webhook

```ts
// supabase/functions/sim-questoes-webhook/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

const ENTITY_TO_TABLE: Record<string, string> = {
  question: "questions",
  question_image: "question_images",
  question_topic: "question_topics",
  subject: "subjects",
  content: "contents",
  topic: "topics",
  area: "areas",
  exam: "exams",
};

async function hmac(secret: string, body: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return encodeHex(new Uint8Array(sig));
}

Deno.serve(async (req) => {
  const raw = await req.text();
  const expected = await hmac(Deno.env.get("SIM_QUESTOES_WEBHOOK_SECRET")!, raw);
  if (req.headers.get("X-Signature-Sha256") !== expected) {
    return new Response("invalid signature", { status: 401 });
  }

  const evt = JSON.parse(raw);
  const table = ENTITY_TO_TABLE[evt.entity_type];
  if (!table) return new Response("unknown entity", { status: 400 });

  const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  if (evt.operation === "delete") {
    await supa.from(table).delete().eq("id", evt.entity_id);
  } else {
    await supa.from(table).upsert(evt.payload);
  }
  return new Response("ok");
});
```

A `webhook_url` que você cola no Sim Questões é a URL pública dessa função.

## 5. Reconciliação periódica (opcional, recomendado)

Crie um cron na outra app que, 1x por dia, chama `public-questions-feed?since=<últimas 36h>` para garantir que nenhum evento ficou perdido.

## Observações

- A `api_key` deve ser tratada como secret. **Nunca** colocar no frontend da outra app.
- Os webhooks são reentregues com backoff exponencial até 8 tentativas (~2h totais).
- Se a outra app cair por muito tempo, rode o seed novamente com `since=<timestamp>`.
