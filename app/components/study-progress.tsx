"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { TrackId } from "../data/tracks";
import { Icon } from "./icons";

const eventName = "spatial-progress-changed";
const empty: string[] = [];
function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(eventName, callback); window.removeEventListener("storage", callback); };
}
function read(trackId: TrackId) {
  try {
    return localStorage.getItem(`spatial-progress-v2:${trackId}`)
      ?? (trackId === "engineer" ? localStorage.getItem("spatial-course-progress") : null)
      ?? "[]";
  } catch { return "[]"; }
}
export function useProgress(trackId: TrackId) {
  const stored = useSyncExternalStore(subscribe, () => read(trackId), () => "[]");
  const completed = useMemo(() => {
    try {
      const value: unknown = JSON.parse(stored);
      return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string"))] : empty;
    } catch { return empty; }
  }, [stored]);
  function toggle(id: string) {
    const next = completed.includes(id) ? completed.filter(item => item !== id) : [...completed, id];
    try {
      localStorage.setItem(`spatial-progress-v2:${trackId}`, JSON.stringify(next));
      window.dispatchEvent(new Event(eventName));
      return true;
    } catch { return false; }
  }
  return { completed, toggle };
}
export function TrackProgress({ trackId, chapterIds }: { trackId: TrackId; chapterIds: string[] }) {
  const { completed } = useProgress(trackId);
  const count = chapterIds.filter(id => completed.includes(id)).length;
  const percent = Math.round(count / chapterIds.length * 100);
  return <div className="track-progress"><div><span>{count ? "차곡차곡 쌓이는 나의 진도" : "첫 챕터부터 시작해 볼까요?"}</span><strong>{count} / {chapterIds.length}</strong></div><progress value={percent} max="100" aria-label={`기본이론 학습 진도 ${percent}%`}/></div>;
}
export function CompletionMark({ trackId, chapterId }: { trackId: TrackId; chapterId: string }) {
  const { completed } = useProgress(trackId);
  return completed.includes(chapterId) ? <span className="chapter-complete"><Icon name="check" size={17}/>학습 완료</span> : <Icon name="chevron" size={18}/>;
}
