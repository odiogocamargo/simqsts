## Objetivo
Transformar o Sim Questões em uma plataforma **interna de banco de questões**, voltada apenas para:
- Cadastro e curadoria de questões
- Gestão de taxonomia (áreas, matérias, conteúdos, tópicos, exames)
- Gestão de usuários internos (Admin / Professor) e seus acessos
- Integrações externas (consumidores via API, webhooks)

Sem alunos, sem paywall, sem landing comercial.

---

## O que será REMOVIDO

### Frontend (páginas e componentes)
- `src/pages/Landing.tsx` (página de venda)
- `src/pages/Subscribe.tsx`, `src/pages/Subscriptions.tsx`, `src/pages/PaymentSuccess.tsx`
- `src/pages/Dashboard.tsx` (dashboard do aluno) — substituído por dashboard administrativo
- `src/pages/StudentPractice.tsx`, `StudentQuestions.tsx`, `StudentSimulations.tsx`, `StudentErrorAnalysis.tsx`, `StudentTriAnalysis.tsx`, `SubjectReport.tsx`
- `src/components/Paywall.tsx`, `AsaasCheckoutForm.tsx`, `PaymentHistory.tsx`
- `src/components/simulation/*`, `src/components/student/*`
- `src/hooks/useSimulations.tsx`
- `src/lib/tri.ts`

### Edge functions
- `create-asaas-subscription`, `cancel-asaas-subscription`, `check-asaas-subscription`, `asaas-webhook`, `sync-asaas-payments`
- `send-welcome-email` (e-mail comercial pós-cadastro)
- `tri-diagnosis`

### Banco de dados (migration)
- Drop: `simulations`, `simulation_questions`, `user_answers`, `user_performance`, `study_sessions`, `subscriptions`, `payment_history`
- Remover role `aluno` do enum `app_role` (recriar enum só com `admin`, `professor`)
- Atualizar trigger `handle_new_user`: não atribuir mais role automática (novos usuários ficam sem role até admin liberar) e não exigir campos de aluno (cpf/endereco/whatsapp continuam opcionais no profile)
- Remover secrets de Asaas (`ASAAS_API_KEY`, `ASAAS_WEBHOOK_TOKEN`) e Stripe — opcional, posso deixar configurados sem uso

### Rotas / navegação
- Rota raiz `/` passa a ser a tela de login (ou redirect para `/admin` se logado)
- Remover todas as rotas `/student/*`, `/assinar`, `/landing`, `/payment-success`, `/minhas-assinaturas`
- Sidebar simplificada: **Questões**, **Taxonomia**, **Usuários**, **Integrações**, **Minha Conta**

---

## O que será MANTIDO / AJUSTADO

### Páginas finais do app
- `Auth.tsx` — login (sem fluxo de signup público; cadastro de novos usuários só via admin em `Users`)
- `Questions.tsx`, `AddQuestion.tsx`, `QuestionEditModal`, `QuestionViewModal`, `QuestionImportModal`, `AIQuestionImageImport`
- `Users.tsx` — gestão de Admin/Professor (criar via `create-employee`, redefinir senha via `update-user-password`, excluir via `delete-user`)
- `Integrations.tsx` — gestão de consumidores externos e webhooks
- `TaxonomyMigration.tsx` + edge functions `export-taxonomy`, `import-taxonomy-v3`, `public-questions-feed`, `dispatch-webhooks`, `test-webhook`, `classify-question`, `analyze-question-image`, `create-external-consumer`
- `MyAccount.tsx` — perfil do usuário interno

### Novo Dashboard (Admin)
Substitui o antigo dashboard de aluno em `/`:
- Total de questões, questões por matéria/área
- Adições por mês, ranking de usuários que adicionaram
- Status de integrações ativas (consumidores externos, webhooks recentes)

### Hooks/contexto
- `useAuth`: remover toda lógica de `subscription`, `trial`, `hasAccess`
- `useUserRole`: enum só com `admin` | `professor`; helper `isAdmin`, `isProfessor`
- `RoleBasedRoute`: simplificar — só protege admin vs professor

---

## Estrutura final de rotas

```text
/                  → redirect: logado → /dashboard, deslogado → /auth
/auth              → login (sem signup público)
/dashboard         → métricas e ranking de adição de questões (admin/professor)
/questoes          → lista/edição de questões
/questoes/nova     → adicionar questão
/taxonomia         → gestão de áreas/matérias/conteúdos/tópicos/exames
/usuarios          → admin: criar/editar/remover Admin e Professor
/integracoes       → consumidores externos, API keys, webhooks
/minha-conta       → perfil do usuário logado
```

---

## Considerações importantes

1. **Dados existentes de alunos**: ao remover tabelas (`user_answers`, `study_sessions`, `simulations`, etc.) e a role `aluno`, perderemos histórico de prática. Os usuários `aluno` em `auth.users` continuarão existindo mas sem acesso (sem role e sem páginas). Se quiser, posso adicionar passo para **deletar em massa todos os usuários com role `aluno`** — confirme se deseja.
2. **Branding**: manter "Sim Questões" e o estilo atual (Poppins, #0061FF)? Ou renomear para algo como "Sim Questões Bank" / "Painel Sim Questões"?
3. **Signup público**: vai sumir. Novos usuários internos só por convite do admin. OK?
4. **Stripe/Asaas**: posso só remover o código que usa, deixando as secrets no Supabase sem efeito. OK?

---

## Plano de execução (ordem)

1. Migration: drop tabelas de aluno/pagamento, ajustar enum `app_role` e trigger `handle_new_user`
2. Deletar edge functions de pagamento/aluno
3. Deletar páginas/componentes/hooks descontinuados
4. Refatorar `App.tsx` (novas rotas), `AppSidebar.tsx`, `useAuth.tsx`, `useUserRole.tsx`, `RoleBasedRoute.tsx`, `Auth.tsx` (remover signup)
5. Criar novo `Dashboard.tsx` administrativo (métricas + ranking de adições)
6. Atualizar memória do projeto (`mem://index.md`) refletindo o pivot

Confirme os pontos 1–4 das "Considerações importantes" antes que eu execute.