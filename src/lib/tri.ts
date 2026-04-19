/**
 * Modelo TRI 3PL (3 Parâmetros) simplificado para estimativa de proficiência ENEM.
 *
 * P(θ) = c + (1 - c) / (1 + exp(-a * (θ - b)))
 *
 *  a = discriminação (quanto o item separa quem sabe de quem não sabe)
 *  b = dificuldade (em escala θ, ~ -3 a +3)
 *  c = chute (probabilidade de acerto casual)
 *
 * Como não temos os parâmetros calibrados pelo INEP por questão, usamos
 * estimativas baseadas no campo `difficulty` cadastrado:
 *   - facil  → b = -1.0,  a = 1.1, c = 0.20
 *   - medio  → b =  0.0,  a = 1.3, c = 0.20
 *   - dificil → b = +1.2, a = 1.5, c = 0.20
 *
 * A proficiência θ é estimada por máxima verossimilhança via busca em grade.
 * Depois convertemos para a escala ENEM (média 500, dp 100, clamp 0–1000).
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

const DIFFICULTY_PARAMS: Record<string, TriItemParams> = {
  facil: { a: 1.1, b: -1.0, c: 0.2 },
  medio: { a: 1.3, b: 0.0, c: 0.2 },
  dificil: { a: 1.5, b: 1.2, c: 0.2 },
};

const DEFAULT_PARAMS: TriItemParams = { a: 1.2, b: 0.0, c: 0.2 };

export function getItemParams(difficulty: Difficulty): TriItemParams {
  if (!difficulty) return DEFAULT_PARAMS;
  const key = String(difficulty).toLowerCase().trim();
  // normalizar acentos
  const normalized = key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return DIFFICULTY_PARAMS[normalized] ?? DEFAULT_PARAMS;
}

/** Probabilidade 3PL de acerto dado θ */
export function probability3PL(theta: number, p: TriItemParams): number {
  const z = -p.a * (theta - p.b);
  return p.c + (1 - p.c) / (1 + Math.exp(z));
}

/** Log-verossimilhança da amostra dado θ */
function logLikelihood(theta: number, responses: TriResponse[]): number {
  let ll = 0;
  for (const r of responses) {
    const p = probability3PL(theta, getItemParams(r.difficulty));
    const pClamped = Math.min(0.9999, Math.max(0.0001, p));
    ll += r.isCorrect ? Math.log(pClamped) : Math.log(1 - pClamped);
  }
  return ll;
}

/**
 * Estima θ por busca em grade ([-3, +3], passo 0.05).
 * Retorna null se não houver respostas suficientes.
 */
export function estimateTheta(responses: TriResponse[]): number | null {
  if (responses.length < 3) return null;
  let bestTheta = 0;
  let bestLL = -Infinity;
  for (let theta = -3; theta <= 3; theta += 0.05) {
    const ll = logLikelihood(theta, responses);
    if (ll > bestLL) {
      bestLL = ll;
      bestTheta = theta;
    }
  }
  return bestTheta;
}

/** Converte θ (escala normal ~ -3..+3) para escala ENEM (média 500, dp 100). */
export function thetaToEnemScore(theta: number | null): number | null {
  if (theta === null) return null;
  const score = 500 + theta * 100;
  return Math.max(0, Math.min(1000, Math.round(score)));
}

/**
 * Coerência TRI: mede o quanto o padrão de respostas bate com a curva esperada.
 * Para cada resposta, comparamos o resultado real com a probabilidade prevista
 * pelo modelo no θ estimado. Coerência alta = padrão consistente (acerta fáceis,
 * erra difíceis). Coerência baixa = padrão errático (sugere chute ou desatenção).
 *
 * Retorna 0–100 (%).
 */
export function calculateCoherence(theta: number, responses: TriResponse[]): number {
  if (responses.length === 0) return 0;
  let totalMatch = 0;
  for (const r of responses) {
    const p = probability3PL(theta, getItemParams(r.difficulty));
    // quanto mais próximo a previsão estiver do resultado real, maior a coerência
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
