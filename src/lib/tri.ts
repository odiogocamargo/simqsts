/**
 * Modelo TRI 3PL com estimação bayesiana EAP (Expected A Posteriori)
 * e cálculo de erro padrão (SE) da proficiência θ.
 *
 * P(θ) = c + (1 - c) / (1 + exp(-a * (θ - b)))
 *
 * Calibração simplificada baseada em `difficulty`:
 *   - facil   → b = -1.0, a = 1.1, c = 0.20
 *   - medio   → b =  0.0, a = 1.3, c = 0.20
 *   - dificil → b = +1.2, a = 1.5, c = 0.20
 *
 * EAP usa um prior N(0,1) → estabiliza θ quando há poucas respostas
 * ou padrões extremos (todos certos / todos errados).
 *
 * SE = sqrt(Var posterior) → entrega "nota ± erro" na escala ENEM (×100).
 */

export type Difficulty = "facil" | "medio" | "dificil" | string | null | undefined;

export interface TriItemParams {
  a: number;
  b: number;
  c: number;
}

export interface TriResponse {
  difficulty: Difficulty;
  isCorrect: boolean;
}

export interface TriEstimate {
  theta: number;
  se: number; // erro padrão na escala θ
}

const DIFFICULTY_PARAMS: Record<string, TriItemParams> = {
  facil: { a: 1.1, b: -1.0, c: 0.2 },
  medio: { a: 1.3, b: 0.0, c: 0.2 },
  dificil: { a: 1.5, b: 1.2, c: 0.2 },
};

const DEFAULT_PARAMS: TriItemParams = { a: 1.2, b: 0.0, c: 0.2 };

export function getItemParams(difficulty: Difficulty): TriItemParams {
  if (!difficulty) return DEFAULT_PARAMS;
  const key = String(difficulty).toLowerCase().trim();
  const normalized = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return DIFFICULTY_PARAMS[normalized] ?? DEFAULT_PARAMS;
}

/** Probabilidade 3PL de acerto dado θ */
export function probability3PL(theta: number, p: TriItemParams): number {
  const z = -p.a * (theta - p.b);
  return p.c + (1 - p.c) / (1 + Math.exp(z));
}

/** Verossimilhança L(θ) (não log) — necessária para integração EAP */
function likelihood(theta: number, responses: TriResponse[]): number {
  let ll = 0;
  for (const r of responses) {
    const p = probability3PL(theta, getItemParams(r.difficulty));
    const pClamped = Math.min(0.9999, Math.max(0.0001, p));
    ll += r.isCorrect ? Math.log(pClamped) : Math.log(1 - pClamped);
  }
  return Math.exp(ll);
}

/** Densidade do prior N(0,1) */
function priorPdf(theta: number): number {
  return Math.exp(-(theta * theta) / 2) / Math.sqrt(2 * Math.PI);
}

/**
 * Estima θ por EAP (média da distribuição posterior) com prior N(0,1).
 * Retorna também o erro padrão (sqrt(Var posterior)).
 *
 * Integração numérica por Simpson em [-4, +4], passo 0.05.
 */
export function estimateThetaEAP(responses: TriResponse[]): TriEstimate | null {
  if (responses.length < 3) return null;

  const step = 0.05;
  const min = -4;
  const max = 4;
  let normalizer = 0;
  let mean = 0;
  let m2 = 0;

  // primeiro passe: normalizador e média
  for (let theta = min; theta <= max; theta += step) {
    const w = likelihood(theta, responses) * priorPdf(theta) * step;
    normalizer += w;
    mean += theta * w;
  }
  if (normalizer === 0) return null;
  mean /= normalizer;

  // segundo passe: variância
  for (let theta = min; theta <= max; theta += step) {
    const w = (likelihood(theta, responses) * priorPdf(theta) * step) / normalizer;
    m2 += (theta - mean) * (theta - mean) * w;
  }
  const se = Math.sqrt(Math.max(m2, 1e-6));
  return { theta: mean, se };
}

/** Mantida para retrocompatibilidade — retorna apenas θ via EAP */
export function estimateTheta(responses: TriResponse[]): number | null {
  const est = estimateThetaEAP(responses);
  return est ? est.theta : null;
}

/** Converte θ (escala normal) para escala ENEM (média 500, dp 100). */
export function thetaToEnemScore(theta: number | null): number | null {
  if (theta === null) return null;
  const score = 500 + theta * 100;
  return Math.max(0, Math.min(1000, Math.round(score)));
}

/** Converte SE de θ para SE na escala ENEM (×100). */
export function seToEnemScore(se: number): number {
  return Math.round(se * 100);
}

/**
 * Coerência TRI: padrão de respostas vs curva esperada no θ estimado.
 * Retorna 0–100 (%).
 */
export function calculateCoherence(theta: number, responses: TriResponse[]): number {
  if (responses.length === 0) return 0;
  let totalMatch = 0;
  for (const r of responses) {
    const p = probability3PL(theta, getItemParams(r.difficulty));
    const match = r.isCorrect ? p : 1 - p;
    totalMatch += match;
  }
  return Math.round((totalMatch / responses.length) * 100);
}

/** Notas de corte aproximadas (SISU 2024, ampla concorrência) por curso. */
export const ENEM_CUTOFF_REFERENCES = [
  { course: "Medicina (USP/UFMG)", score: 780, color: "hsl(var(--destructive))" },
  { course: "Direito (USP/UFRJ)", score: 720, color: "hsl(var(--primary))" },
  { course: "Engenharia (UFRJ)", score: 700, color: "hsl(var(--primary))" },
  { course: "Administração (UFMG)", score: 650, color: "hsl(var(--muted-foreground))" },
  { course: "Pedagogia (média nacional)", score: 580, color: "hsl(var(--muted-foreground))" },
  { course: "Média ENEM nacional", score: 520, color: "hsl(var(--muted-foreground))" },
];
