export type CwvLab = {
  lcpMs: number;
  inpMs: number;
  cls: number;
  fcpMs: number;
  ttfbMs: number;
  device: "mobile";
  method: "lab";
  passed: boolean;
};

const LCP_GOOD = 2500;
const INP_GOOD = 200;
const CLS_GOOD = 0.1;

export function labFromScore(seed: number, cwvScore: number): CwvLab {
  const penalty = Math.max(0, 92 - cwvScore);
  const lcpMs = Math.round(1400 + penalty * 48 + (seed % 220));
  const inpMs = Math.round(70 + penalty * 3.1 + (seed % 40));
  const cls = Math.round((0.02 + penalty * 0.0038 + (seed % 17) / 1000) * 1000) / 1000;
  const fcpMs = Math.round(lcpMs * 0.62);
  const ttfbMs = Math.round(180 + penalty * 8 + (seed % 90));
  return {
    lcpMs,
    inpMs,
    cls,
    fcpMs,
    ttfbMs,
    device: "mobile",
    method: "lab",
    passed: lcpMs <= LCP_GOOD && inpMs <= INP_GOOD && cls <= CLS_GOOD,
  };
}

export function cwvRating(metric: "lcp" | "inp" | "cls", value: number): "good" | "needs" | "poor" {
  if (metric === "lcp") return value <= 2500 ? "good" : value <= 4000 ? "needs" : "poor";
  if (metric === "inp") return value <= 200 ? "good" : value <= 500 ? "needs" : "poor";
  return value <= 0.1 ? "good" : value <= 0.25 ? "needs" : "poor";
}

export const CWV_THRESHOLDS = {
  lcp: "≤ 2.5s",
  inp: "≤ 200ms",
  cls: "≤ 0.1",
} as const;
