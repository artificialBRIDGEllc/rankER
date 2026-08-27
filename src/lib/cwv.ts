export type CwvLab = {
  ttfbMs: number | null;
  htmlBytes: number;
  scripts: number;
  images: number;
  imagesMissingDims: number;
  method: "html-model" | "heuristic";
};

/** Google field thresholds — shown as reference, not as our measurement. */
export const CWV_THRESHOLDS = {
  lcp: "≤ 2.5s",
  inp: "≤ 200ms",
  cls: "≤ 0.1",
} as const;

export function htmlModelFromSignals(s: {
  ttfbMs: number | null;
  htmlBytes: number;
  scripts: number;
  images: number;
  imagesMissingDims: number;
}): CwvLab {
  return {
    ttfbMs: s.ttfbMs,
    htmlBytes: s.htmlBytes,
    scripts: s.scripts,
    images: s.images,
    imagesMissingDims: s.imagesMissingDims,
    method: "html-model",
  };
}
