import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function TrackPage({ name, meta }: { name: string; meta?: string }) {
  const track = useAppStore((s) => s.track);
  useEffect(() => {
    track(name, typeof window !== "undefined" ? window.location.pathname : "/", meta);
  }, [name, meta, track]);
  return null;
}
