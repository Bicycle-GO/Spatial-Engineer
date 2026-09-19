"use client";

import { useState } from "react";
import type { Chapter } from "../data/course";
import type { TrackId } from "../data/tracks";
import { sources } from "../data/sources";
import { LessonVisual } from "./lesson-visuals";
import { Icon } from "./icons";

export function LessonReader({ chapter, trackId }: { chapter: Chapter; trackId: TrackId }) {
  const guide = chapter.guide;
  const [view, setView] = useState(guide ? "visual" : "concepts");
  const views = [...(guide ? [{ id: "visual", label: "그림으로 이해" }] : []), { id: "concepts", label: "개념·비교" }, { id: "application", label: "사례·문제 포인트" }];

  return <div className="lesson-reader">
    <section className="definition-card"><span className="eyebrow">한 문장으로 이해하기</span><p>{chapter.definition}</p></section>
    <div className="reader-switch" aria-label="학습 내용 선택">{views.map((item, index) => <button key={item.id} aria-pressed={view === item.id} aria-controls="lesson-content" onClick={() => setView(item.id)}><span>0{index + 1}</span>{item.label}</button>)}</div>
    <div id="lesson-content" className="reader-content">
      {view === "visual" && guide && <section className="visual-lesson"><div className="reader-section-heading"><span className="mini-kicker">INTERACTIVE LESSON · 약 {guide.minutes}분</span><h2>핵심 개념을 그림으로</h2><p>{guide.takeaway}</p></div><div className="lesson-canvas"><LessonVisual kind={guide.visual}/></div><button className="reader-next" onClick={() => setView("concepts")}>개념과 비교표로 정리하기 <Icon name="arrow" size={18}/></button></section>}
      {view === "concepts" && <>
        <section className="concept-section"><h2>핵심 개념</h2><div className="concepts">{chapter.concepts.map((concept, i) => <div className="concept" key={concept.label}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{concept.label}</h3><p>{concept.text}</p></div></div>)}</div></section>
        {guide && <section className="comparison-section"><h2>한눈에 비교하기</h2><div className="table-scroll" tabIndex={0} role="region" aria-label="개념 비교표"><table className="comparison-table"><thead><tr>{guide.comparison.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{guide.comparison.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0 ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div></section>}
        {chapter.steps && <section className="process-section"><h2>흐름으로 정리하기</h2><ol className="process-steps">{chapter.steps.map((step, i) => <li key={step}><span>{i + 1}</span>{step}</li>)}</ol></section>}
        <button className="reader-next" onClick={() => setView("application")}>문제에서 어떻게 구분할까요? <Icon name="arrow" size={18}/></button>
      </>}
      {view === "application" && <>
        {guide && <section className="example-card"><span className="mini-kicker">생활 속 사례</span><h2>{guide.example.title}</h2><p>{guide.example.text}</p></section>}
        <section className="exam-point"><span className="point-icon">!</span><div><h2>문제에서 기억할 포인트</h2><p>{chapter.examPoint}</p></div></section>
        {guide && <section className="pitfall-section"><h2>헷갈리기 쉬운 부분</h2><ul>{guide.pitfalls.map(text => <li key={text}>{text}</li>)}</ul></section>}
        {guide && guide.advanced.length > 0 && <details className="lesson-details"><summary>{trackId === "engineer" ? "심화 개념 더 보기" : "한 걸음 더 알아보기"}</summary><div>{guide.advanced.map(item => <section key={item.title}><h3>{item.title}</h3><p>{item.text}</p></section>)}</div></details>}
        <a className="button primary related-practice" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${trackId}/practice/?chapter=${chapter.id}`}>이 개념 문제 풀기 <Icon name="arrow" size={18}/></a>
      </>}
    </div>
    {guide && <details className="lesson-details source-details"><summary>학습 자료와 참고 출처</summary><div><p>공유 대화의 주제를 학습용으로 재구성하고, 아래 참고 문서로 주요 개념을 보완했습니다.</p><ul>{guide.sourceIds.map(id => <li key={id}><span>{sources[id].kind === "conversation" ? "공유 대화" : "참고 문서"}</span><a href={sources[id].url} target="_blank" rel="noreferrer">{sources[id].title} ↗</a></li>)}</ul></div></details>}
  </div>;
}
