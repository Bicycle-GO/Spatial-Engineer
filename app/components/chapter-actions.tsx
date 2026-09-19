"use client";
import { useState } from "react";
import Link from "next/link";
import type { TrackId } from "../data/tracks";
import { useProgress } from "./study-progress";
import { Icon } from "./icons";

export function ChapterActions({ trackId, chapterId, nextId }: { trackId: TrackId; chapterId: string; nextId?: string }) {
  const { completed, toggle } = useProgress(trackId);
  const [error, setError] = useState(false);
  const done = completed.includes(chapterId);
  return <div className="lesson-completion"><div><h2>{done ? "한 걸음 더 나아갔어요." : "이번 챕터, 이해하셨나요?"}</h2><p>{done ? "학습 완료가 저장되었습니다." : "완료 표시를 남기고 다음 학습으로 넘어가세요."}</p></div><div className="completion-buttons"><button className={`button ${done ? "secondary" : "primary"}`} aria-pressed={done} onClick={() => setError(!toggle(chapterId))}><Icon name="check" size={18}/>{done ? "학습 완료 취소" : "학습 완료"}</button>{done && <Link className="button primary" href={nextId ? `/${trackId}/theory/${nextId}/` : `/${trackId}/practice/`}>{nextId ? "다음 챕터" : "문제 풀기"}<Icon name="arrow" size={18}/></Link>}</div>{error && <p className="storage-error" role="alert">진도를 저장하지 못했어요. 브라우저의 사이트 저장공간 설정을 확인해 주세요.</p>}</div>;
}
