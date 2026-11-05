"use client";

import { useState } from "react";
import type { Chapter } from "../data/course";
import type { TrackId } from "../data/tracks";
import { getPracticePath } from "../data/tracks";
import { practicalPastQuestions, practicalQuestions } from "../data/practical";
import { sources } from "../data/sources";
import { LessonVisual } from "./lesson-visuals";
import { Icon } from "./icons";

export function LessonReader({ chapter, trackId }: { chapter: Chapter; trackId: TrackId }) {
  const guide = chapter.guide;
  const practicePath = getPracticePath(trackId,chapter.id);
  const sourceIds = guide?.sourceIds ?? chapter.practical?.sourceIds;
  const relatedQuestions = chapter.practical ? practicalQuestions.filter(question=>question.chapterId===chapter.id) : [];
  const providedPast = trackId === "engineer" ? practicalPastQuestions.filter(question=>question.chapterId===chapter.id) : [];
  const nextConcept = trackId === "engineer" && ["practical-transformation","practical-quality"].includes(chapter.id)
    ? {id:"practical-adjustment-error",title:"보정 결과는 어떻게 검토할까요?",text:"점별 잔차와 여러 점의 RMS 오차를 그림으로 비교해요"}
    : trackId === "engineer" && ["processing","practical-raster","practical-vectorization"].includes(chapter.id)
    ? {id:"practical-rasterization",title:"반대 방향도 이해하기 · 벡터에서 래스터로",text:"같은 셀도 결정 규칙에 따라 값이 달라져요"}
    : trackId === "engineer" && ["spatial-basics","coordinate-systems","practical-crs"].includes(chapter.id)
    ? {id:"practical-transformation",title:"공간위치 보정 · 세 가지 변환",text:"상사·아핀·사영변환을 같은 도형으로 비교해요"} : null;
  const [view, setView] = useState(guide ? "visual" : "concepts");
  const views = [...(guide ? [{ id: "visual", label: "그림으로 이해" }] : []), { id: "concepts", label: "개념·비교" }, { id: "application", label: "사례·문제 포인트" }];

  return <div className="lesson-reader">
    <section className="definition-card"><span className="eyebrow">한 문장으로 이해하기</span><p>{chapter.definition}</p></section>
    {nextConcept && <a className="past-paper-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/engineer/theory/${nextConcept.id}/`}><span className="mini-kicker">연결해서 공부하기</span><strong>{nextConcept.title}</strong><span>{nextConcept.text} <Icon name="arrow" size={17}/></span></a>}
    {trackId === "engineer" && ["processing", "image-processing", "practical-raster"].includes(chapter.id) && <a className="past-paper-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/engineer/theory/practical-vectorization/`}><span className="mini-kicker">도면 벡터화 과정 그림 학습</span><strong>전처리 → 세선화 → 벡터화 → 후처리</strong><span>단계별 도형과 빈칸 문제 풀어보기 <Icon name="arrow" size={17}/></span></a>}
    {trackId === "engineer" && ["topology", "practical-quality"].includes(chapter.id) && <a className="past-paper-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/engineer/theory/practical-topology/`}><span className="mini-kicker">실기 위상 규칙 그림 학습</span><strong>포인트·라인·폴리곤 규칙을 도형으로 비교하기</strong><span>실생활 사례와 실기 예상문제로 연결 <Icon name="arrow" size={17}/></span></a>}
    {providedPast.length > 0 && <a className="past-paper-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/engineer/practice/practical/?source=past&chapter=${chapter.id}`}><span className="mini-kicker">이 단원의 실기 기출 · 사용자 제공</span><strong>레이어·평면직각좌표계·좌표변환</strong><span>{providedPast.length}문제 풀기 <Icon name="arrow" size={17}/></span></a>}
    <div className="reader-switch" aria-label="학습 내용 선택">{views.map((item, index) => <button key={item.id} aria-pressed={view === item.id} aria-controls="lesson-content" onClick={() => setView(item.id)}><span>0{index + 1}</span>{item.label}</button>)}</div>
    <div id="lesson-content" className="reader-content">
      {view === "visual" && guide && <section className="visual-lesson"><div className="reader-section-heading"><span className="mini-kicker">INTERACTIVE LESSON · 약 {guide.minutes}분</span><h2>핵심 개념을 그림으로</h2><p>{guide.takeaway}</p></div><div className="lesson-canvas"><LessonVisual kind={guide.visual}/></div><button className="reader-next" onClick={() => setView("concepts")}>개념과 비교표로 정리하기 <Icon name="arrow" size={18}/></button></section>}
      {view === "concepts" && <>
        <section className="concept-section"><h2>핵심 개념</h2><div className="concepts">{chapter.concepts.map((concept, i) => <div className="concept" key={concept.label}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{concept.label}</h3><p>{concept.text}</p></div></div>)}</div></section>
        {guide && <section className="comparison-section"><h2>한눈에 비교하기</h2><div className="table-scroll" tabIndex={0} role="region" aria-label="개념 비교표"><table className="comparison-table"><thead><tr>{guide.comparison.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{guide.comparison.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0 ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div></section>}
        {chapter.steps && <section className="process-section"><h2>흐름으로 정리하기</h2><ol className="process-steps">{chapter.steps.map((step, i) => <li key={step}><span>{i + 1}</span>{step}</li>)}</ol></section>}
        {chapter.practical && <section className="answer-template"><span className="mini-kicker">ANSWER FRAMEWORK</span><h2>이렇게 답안으로 연결해요</h2><pre>{chapter.practical.answerTemplate}</pre><p>용어만 나열하지 말고 대상·조건·순서·검증을 함께 적어보세요.</p><a className="button primary" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${practicePath}`}>관련 실기 문제 {relatedQuestions.length}개 풀기 <Icon name="arrow" size={17}/></a></section>}
        <button className="reader-next" onClick={() => setView("application")}>문제에서 어떻게 구분할까요? <Icon name="arrow" size={18}/></button>
      </>}
      {view === "application" && <>
        {guide && <section className="example-card"><span className="mini-kicker">생활 속 사례</span><h2>{guide.example.title}</h2><p>{guide.example.text}</p></section>}
        <section className="exam-point"><span className="point-icon">!</span><div><h2>문제에서 기억할 포인트</h2><p>{chapter.examPoint}</p></div></section>
        {chapter.practical && <section className="practical-related"><h2>이 개념으로 풀 수 있는 문제</h2><ul>{relatedQuestions.map(question=><li key={question.id}><span>{question.format}</span><strong>{question.title}</strong><p>{question.prompt}</p></li>)}</ul><p className="diagram-note">답안과 해설은 실기 문제풀이 페이지에서 확인할 수 있어요.</p></section>}
        {guide && <section className="pitfall-section"><h2>헷갈리기 쉬운 부분</h2><ul>{guide.pitfalls.map(text => <li key={text}>{text}</li>)}</ul></section>}
        {guide && guide.advanced.length > 0 && <details className="lesson-details"><summary>{trackId === "engineer" ? "심화 개념 더 보기" : "한 걸음 더 알아보기"}</summary><div>{guide.advanced.map(item => <section key={item.title}><h3>{item.title}</h3><p>{item.text}</p></section>)}</div></details>}
        <a className="button primary related-practice" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${practicePath}`}>이 개념 문제 풀기 <Icon name="arrow" size={18}/></a>
      </>}
    </div>
    {sourceIds && <details className="lesson-details source-details"><summary>학습 자료와 참고 출처</summary><div><p>{chapter.practical ? "필답형 답안 작성을 돕는 자체 학습 자료입니다. 주요 기술 개념의 참고 문서를 확인할 수 있습니다." : "공유 대화의 주제를 학습용으로 재구성하고, 아래 참고 문서로 주요 개념을 보완했습니다."}</p><ul>{sourceIds.map(id => <li key={id}><span>{sources[id].kind === "conversation" ? "공유 대화" : "참고 문서"}</span><a href={sources[id].url} target="_blank" rel="noreferrer">{sources[id].title} ↗</a></li>)}</ul></div></details>}
  </div>;
}
