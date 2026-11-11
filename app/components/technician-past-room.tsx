"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { technicianPastSourceNote, type TechnicianPastQuestion } from "../data/technician-past";
import { getTechnicianPastPaper, technicianPastPapers } from "../data/technician-past-papers";
import { TechnicianPastVisual } from "./technician-past-visuals";
import { JavaAccessGuide, JavaOperatorsGuide } from "./java-beginner-guides";
import { TechnicianSecondRaster } from "./technician-second-raster";
import { TechnicianSecondGeometry } from "./technician-second-geometry";
import { TechnicianSecondConcepts } from "./technician-second-concepts";
import { Icon } from "./icons";
import styles from "./technician-past-room.module.css";

function subscribeDraft(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("technician-past-draft", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("technician-past-draft", callback);
  };
}

function WrittenAnswer({ questionId, grid, onReveal }: { questionId: string; grid: boolean; onReveal: () => void }) {
  const key = `spatial-technician-past-v1:${questionId}`;
  const [fallback, setFallback] = useState<string | null>(null);
  const stored = useSyncExternalStore(subscribeDraft, () => {
    try { return localStorage.getItem(key) ?? ""; } catch { return ""; }
  }, () => "");
  const value = fallback ?? stored;
  return <div className="answer-editor">
    <label htmlFor="technician-past-answer">나의 답안</label>
    <textarea id="technician-past-answer" rows={grid ? 8 : 4} value={value} className={grid ? styles.gridAnswer : undefined} placeholder={grid ? "격자 값을 원래 행·열 순서로 적어보세요.\n여러 결과가 있으면 AND, OR처럼 이름을 함께 적으세요." : "번호별 답안이나 풀이 과정을 직접 적어보세요."} onChange={event => {
      const next = event.target.value;
      setFallback(next);
      try { localStorage.setItem(key, next); window.dispatchEvent(new Event("technician-past-draft")); } catch { /* Keep the current answer in memory if storage is unavailable. */ }
    }}/>
    <div><span>답안은 저장 가능한 경우 이 브라우저에 보관돼요.</span><button className="button primary" disabled={!value.trim()} onClick={onReveal}>모범답안과 비교 <Icon name="check" size={17}/></button></div>
  </div>;
}

export function TechnicianPastRoom({ initialNumber = 1, initialPaper }: { initialNumber?: number; initialPaper?: string | null }) {
  const paper = getTechnicianPastPaper(initialPaper);
  return <>
    <nav className={styles.paperTabs} aria-label="기능사 기출 자료 선택">{technicianPastPapers.map(item => <Link key={item.id} href={`/technician/practice/?source=past&paper=${item.id}`} aria-current={paper.id === item.id ? "page" : undefined}><strong>{item.label}</strong><span>{item.questions.length}문항 · 이미지 기반</span></Link>)}</nav>
    <TechnicianPastSession key={paper.id} initialNumber={initialNumber} questions={paper.questions} paperId={paper.id} paperLabel={paper.label}/>
  </>;
}

function PaperVisual({ paperId, number, solution = false }: { paperId: string; number: number; solution?: boolean }) {
  if (paperId === "1") return <TechnicianPastVisual number={number} solution={solution}/>;
  return <><TechnicianSecondRaster number={number} solution={solution}/><TechnicianSecondGeometry number={number} solution={solution}/><TechnicianSecondConcepts number={number} solution={solution}/></>;
}

function TechnicianPastSession({ initialNumber, questions, paperId, paperLabel }: { initialNumber: number; questions: TechnicianPastQuestion[]; paperId: string; paperLabel: string }) {
  const [items, setItems] = useState(questions);
  const [index, setIndex] = useState(Math.max(0, questions.findIndex(question => question.number === initialNumber)));
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState(false);
  const [reviews, setReviews] = useState<Record<string, "understood" | "review">>({});
  const [checks, setChecks] = useState<Record<string, number[]>>({});
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const solution = useRef<HTMLElement>(null);
  const current = items[index];
  const total = questions.length;
  const selected = checks[current.id] ?? [];
  const needsReview = items.filter(question => reviews[question.id] !== "understood");

  function focusHeading() {
    requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "nearest", behavior: "instant" }); });
  }
  function selectQuestion(next: number) {
    setIndex(next); setRevealed(false); setHint(false); focusHeading();
  }
  function restart(reviewOnly: boolean) {
    setItems(reviewOnly ? needsReview : questions);
    setIndex(0); setRevealed(false); setHint(false); setReviews({}); setChecks({}); setFinished(false); focusHeading();
  }
  function revealSolution() {
    setRevealed(true);
    requestAnimationFrame(() => {
      solution.current?.focus({ preventScroll: true });
      solution.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  return <div className={styles.room}>
    <p className="source-notice"><span>{paperLabel} · 사용자 제공 이미지 {total}문제</span>{technicianPastSourceNote} 1차·2차는 첨부 자료를 나누는 학습용 이름입니다.</p>
    {finished ? <section className="quiz-result" aria-label="기능사 기출 학습 결과">
      <span className="result-icon"><Icon name="check" size={32}/></span><h2 ref={heading} tabIndex={-1}>이미지 기출 답안 연습을 마쳤어요.</h2>
      <div className="result-score"><strong>{items.length - needsReview.length}</strong><span>/ {items.length}문제 이해 완료</span></div>
      <p>직접 표시한 학습 상태입니다. {needsReview.length ? `미점검 문항을 포함해 ${needsReview.length}문제를 더 복습해 보세요.` : "답안을 다시 써보며 기억을 다져보세요."}</p>
      <div className="result-actions">{needsReview.length > 0 && <button className="button primary" onClick={() => restart(true)}>복습할 문제만 다시 풀기</button>}<button className="button secondary" onClick={() => restart(false)}>{total}문제 전체 다시 풀기</button><Link className="text-link" href="/technician/theory/">기능사 기본이론 보기 <Icon name="arrow" size={17}/></Link></div>
    </section> : <>
      <nav className={styles.navigator} aria-label="이미지 기출 문항 선택">
        <div><strong>{paperLabel} 01–{String(total).padStart(2, "0")}</strong><span>문제를 선택해서 풀 수 있어요.</span></div>
        <div className={styles.numbers}>{items.map((question, questionIndex) => <button key={question.id} type="button" aria-label={`${question.number}번 ${question.title}${reviews[question.id] === "understood" ? " · 이해 완료" : reviews[question.id] === "review" ? " · 복습 필요" : ""}`} aria-current={index === questionIndex ? "step" : undefined} data-review={reviews[question.id]} onClick={() => selectQuestion(questionIndex)}>{String(question.number).padStart(2, "0")}<span aria-hidden="true">{reviews[question.id] === "understood" ? "✓" : reviews[question.id] === "review" ? "↻" : ""}</span></button>)}</div>
      </nav>
      <section className="quiz-card practical-quiz" aria-label="기능사 이미지 기출 답안 작성">
        <div className="quiz-topline"><span>QUESTION <strong>{String(current.number).padStart(2, "0")}</strong> / {total}</span><span>{Object.keys(reviews).length} / {items.length}개 점검</span></div>
        <progress max={items.length} value={Object.keys(reviews).length} aria-label="기능사 기출 학습 진행률"/>
        <div className="quiz-body">
          <div className="practical-question-labels"><span className="question-category">{current.category}</span><span>{current.format}</span><span>이미지 {String(current.number).padStart(2, "0")}번</span></div>
          <h2 ref={heading} tabIndex={-1}>{current.title}</h2>
          <p className="practical-prompt">{current.prompt}</p>
          {current.context && !(paperId === "1" ? [1, 2, 4, 5, 7] : [1, 6, 7, 9, 11, 16, 17, 18, 19]).includes(current.number) && <div className={styles.context}>{current.context.map(line => <p key={line}>{line}</p>)}</div>}
          <PaperVisual paperId={paperId} number={current.number}/>
          {current.code && <div className="question-code-block"><span className="code-language">Java</span><pre className="question-code"><code>{current.code}</code></pre></div>}
          <button className="hint-toggle" aria-expanded={hint} onClick={() => setHint(!hint)}>{hint ? "힌트 접기" : "풀이 힌트 보기"}</button>
          {hint && <p className="answer-hint">{current.hint}</p>}
          {current.format === "도형형" && <p className="question-context">도형은 종이에 먼저 그린 뒤, 여기에는 남긴 영역·경계와 폴리곤 수를 적어도 좋아요. 해설의 도형과 함께 비교해 보세요.</p>}
          <WrittenAnswer key={current.id} questionId={current.id} grid={current.format === "격자형"} onReveal={revealSolution}/>
          {!revealed && <div className={styles.learnFirst}><p>아직 답을 모르겠다면 설명부터 차근차근 읽어도 좋아요.</p><button className="button secondary" onClick={revealSolution}>답안 없이 해설로 배우기 <Icon name="book" size={17}/></button></div>}
          {revealed && <section ref={solution} tabIndex={-1} className="practical-solution" aria-label="모범답안과 쉬운 해설">
            <span className="mini-kicker">MODEL ANSWER</span><h3>모범답안</h3><pre className="model-answer">{current.modelAnswer}</pre>
            {paperId === "1" && current.number === 2 ? <JavaAccessGuide/> : paperId === "1" && current.number === 5 ? <JavaOperatorsGuide/> : <PaperVisual paperId={paperId} number={current.number} solution/>}
            {current.trace && <div className="code-trace"><h3>한 줄씩 실행해 보기</h3><div className="code-trace-scroll" tabIndex={0} role="region" aria-label="Java 변수 상태 추적표"><table><caption>각 문장 실행 직후의 변수 값</caption><thead><tr>{current.trace.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{current.trace.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, column) => column === 0 ? <th scope="row" key={column}>{value}</th> : <td key={column}>{value}</td>)}</tr>)}</tbody></table></div></div>}
            <div className="solution-steps"><h3>쉽게 이해하는 풀이</h3><ol>{current.explanation.map((text, step) => <li key={text}><span>{step + 1}</span><p>{text}</p></li>)}</ol></div>
            <fieldset className="self-check"><legend>내 답안과 비교해 보세요</legend><p>자동 채점 없이 핵심 내용을 직접 점검합니다. 공식 채점 기준은 아닙니다.</p>{current.criteria.map((criterion, criterionIndex) => <label key={criterion}><input type="checkbox" checked={selected.includes(criterionIndex)} onChange={() => setChecks({ ...checks, [current.id]: selected.includes(criterionIndex) ? selected.filter(item => item !== criterionIndex) : [...selected, criterionIndex] })}/><span>{criterion}</span></label>)}<strong aria-live="polite">{selected.length} / {current.criteria.length}개 확인</strong></fieldset>
            <div className={styles.cautions}><strong>헷갈리기 쉬운 점 · 원문 보완</strong>{current.mistakes.map(text => <p key={text}>{text}</p>)}</div>
            {current.theoryChapterId && <Link className="theory-return" href={`/technician/theory/${current.theoryChapterId}/`}><Icon name="book" size={18}/>관련 기본이론 복습 <Icon name="arrow" size={17}/></Link>}
            {current.referenceUrls && <details className="lesson-details source-details"><summary>해설 확인에 사용한 공식 자료</summary><ul>{current.referenceUrls.map(reference => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer">{reference.label} ↗</a></li>)}</ul></details>}
            <div className="review-decision" aria-label="내 학습 상태"><button aria-pressed={reviews[current.id] === "understood"} onClick={() => setReviews({ ...reviews, [current.id]: "understood" })}><Icon name="check" size={17}/>이해했어요</button><button aria-pressed={reviews[current.id] === "review"} onClick={() => setReviews({ ...reviews, [current.id]: "review" })}><Icon name="refresh" size={17}/>다시 복습할게요</button></div>
          </section>}
          <div className="quiz-footer"><span>{revealed ? "학습 상태를 표시하고 다음 문항으로 이동하세요." : "답안을 적으면 모범답안과 쉬운 해설을 볼 수 있어요."}</span><div className={styles.actions}>{index > 0 && <button className="button secondary" onClick={() => selectQuestion(index - 1)}>이전 문제</button>}{index < items.length - 1 ? <button className="button primary" onClick={() => selectQuestion(index + 1)}>다음 문제 <Icon name="arrow" size={17}/></button> : <button className="button primary" onClick={() => { setFinished(true); focusHeading(); }}>학습 결과 보기</button>}</div></div>
          <p className="question-source"><strong>문항 출처 · 사용자 제공 이미지</strong><span>{paperLabel} 문항 번호 {String(current.number).padStart(2, "0")} · 표·도형·코드는 웹 학습용으로 재구성했습니다.</span></p>
        </div>
      </section>
    </>}
  </div>;
}
