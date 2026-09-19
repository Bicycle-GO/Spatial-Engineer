"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { LearningQuestion } from "../data/lesson-types";
import type { TrackId } from "../data/tracks";
import { sources } from "../data/sources";
import { Icon } from "./icons";
import { ClipQuestionDiagram } from "./lesson-visuals";

type Question = LearningQuestion;
function subscribeLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}
const getSearch = () => window.location.search;
const getServerSearch = () => "";

export function PracticeRoom({ trackId, questions }: { trackId: TrackId; questions: Question[] }) {
  const search = useSyncExternalStore(subscribeLocation, getSearch, getServerSearch);
  const chapter = new URLSearchParams(search).get("chapter") ?? "";
  return <PracticeContent key={`${trackId}-${chapter}`} trackId={trackId} questions={questions} initialChapter={chapter}/>;
}

function PracticeContent({ trackId, questions, initialChapter }: { trackId: TrackId; questions: Question[]; initialChapter: string }) {
  const initialQuestion = questions.find(question => question.chapterId === initialChapter);
  const [source, setSource] = useState<string>(initialQuestion?.kind ?? "shared");
  const [category, setCategory] = useState(initialQuestion?.category ?? "all");
  const available = questions.filter(question => question.kind === source);
  const filtered = category === "all" ? available : available.filter(question => question.category === category);
  return <>
    <div className="page-heading"><span className="eyebrow">PUT KNOWLEDGE INTO PRACTICE</span><h1>기출문제 풀이</h1><p>한 문제씩 풀고, 해설로 개념을 완성하세요.</p></div>
    <div className="practice-sources" aria-label="문제 유형">{[{id:"shared",label:"대화 속 문제"},{id:"practice",label:"예상문제"},{id:"past",label:"기출문제"}].map(item => <button key={item.id} aria-pressed={source === item.id} onClick={() => { setSource(item.id); setCategory("all"); }}>{item.label}<span>{questions.filter(question => question.kind === item.id).length}</span></button>)}</div>
    {source === "past" ? <div className="empty-state"><Icon name="quiz" size={38}/><h2>등록된 기출문제가 없어요.</h2><p>출처와 회차가 확인된 기출문제는 아직 등록되지 않았습니다.<br/>대화 속 문제와 예상문제로 개념을 점검해 보세요.</p><button className="button primary" onClick={() => { setSource("shared"); setCategory("all"); }}>대화 속 문제 풀기 <Icon name="arrow" size={18}/></button></div> : <>
      <p className="source-notice"><span>{source === "shared" ? "대화 속 문제 안내" : "예상문제 안내"}</span>{source === "shared" ? "공유 대화의 문항을 학습용으로 재구성했습니다. 시행 연도·회차가 확인된 실제 기출문제가 아닙니다." : "현재 문항은 학습용으로 구성한 예상문제이며, 실제 기출문제가 아닙니다."}</p>
      <div className="practice-toolbar"><label htmlFor="question-category">학습 주제</label><select id="question-category" value={category} onChange={event => setCategory(event.target.value)}><option value="all">전체 주제 ({available.length}문제)</option>{[...new Set(available.map(question => question.category))].map(item => <option key={item} value={item}>{item}</option>)}</select></div>
      {filtered.length > 0 ? <QuizSession key={`${source}-${category}`} questions={filtered} trackId={trackId}/> : <div className="empty-state"><h2>이 주제의 문제를 준비 중이에요.</h2><button className="button secondary" onClick={() => setCategory("all")}>전체 문제 보기</button></div>}
    </>}
  </>;
}

function QuizSession({ questions, trackId }: { questions: Question[]; trackId: TrackId }) {
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const current = activeQuestions[index];
  const submitted = answers[current.id] !== undefined;
  const score = activeQuestions.filter(question => answers[question.id] === question.answer).length;
  const wrong = activeQuestions.filter(question => answers[question.id] !== question.answer);

  function restart(items: Question[]) {
    setActiveQuestions(items);
    setIndex(0);
    setChoice(null);
    setAnswers({});
    setFinished(false);
  }
  function advance() {
    if (index === activeQuestions.length - 1) setFinished(true);
    else { setIndex(index + 1); setChoice(null); }
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: "nearest" }); });
  }
  if (finished) return <section className="quiz-result" aria-label="문제풀이 결과">
    <span className="result-icon"><Icon name="check" size={34}/></span><span className="eyebrow">PRACTICE COMPLETE</span><h2 ref={heading} tabIndex={-1}>오늘도 실력이 한 뼘 자랐어요.</h2>
    <div className="result-score"><strong>{score}</strong><span>/ {activeQuestions.length}문제 정답</span></div>
    <p>{wrong.length ? `헷갈렸던 ${wrong.length}문제를 다시 풀며 개념을 정리해 보세요.` : "모든 문제를 맞혔어요. 다음 이론 학습도 이어가 보세요."}</p>
    <div className="result-actions">{wrong.length > 0 && <button className="button primary" onClick={() => restart(wrong)}>틀린 문제만 다시 풀기 <Icon name="refresh" size={18}/></button>}<button className="button secondary" onClick={() => restart(questions)}>전체 다시 풀기</button><Link className="text-link" href={`/${trackId}/theory/`}>기본이론으로 돌아가기 <Icon name="arrow" size={17}/></Link></div>
  </section>;
  return <section className="quiz-card" aria-label="학습문제 풀이">
    <div className="quiz-topline"><span>QUESTION <strong>{String(index + 1).padStart(2, "0")}</strong> / {String(activeQuestions.length).padStart(2, "0")}</span><span>{score}개 정답</span></div>
    <progress max={activeQuestions.length} value={Object.keys(answers).length} aria-label="문제풀이 진행률"/>
    <div className="quiz-body"><span className="question-category">{current.category}</span><h2 ref={heading} tabIndex={-1} id="question-heading">{current.prompt}</h2>
      {current.diagram === "clip-question" && <ClipQuestionDiagram/>}
      {current.code && <pre className="question-code"><code>{current.code}</code></pre>}
      <fieldset className="quiz-options" aria-labelledby="question-heading" disabled={submitted}>
        <legend className="sr-only">정답을 하나 선택하세요.</legend>
        {current.choices.map((text, option) => <label key={`${current.id}-${option}`} className={`quiz-option ${choice === option ? "selected" : ""} ${submitted && option === current.answer ? "correct" : ""} ${submitted && choice === option && option !== current.answer ? "wrong" : ""}`}>
          <input type="radio" name={`answer-${current.id}`} value={option} checked={choice === option} onChange={() => setChoice(option)}/><span className="option-number">{option + 1}</span><span>{text}</span>{submitted && option === current.answer && <strong className="option-feedback">정답 <Icon name="check" size={18}/></strong>}{submitted && choice === option && option !== current.answer && <strong className="option-feedback">내 답안</strong>}
        </label>)}
      </fieldset>
      {submitted && <div className="solution-panel"><div className={`quiz-explanation ${choice === current.answer ? "" : "incorrect"}`} role="status"><strong>{choice === current.answer ? "정답이에요!" : `정답은 ${current.answer + 1}번이에요.`}</strong><p>{current.explanation}</p></div>
        {current.solutionSteps && <section className="solution-steps"><h3>이렇게 풀어요</h3><ol>{current.solutionSteps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol></section>}
        {current.choiceNotes && <details className="lesson-details"><summary>선택지별 해설 보기</summary><div className="choice-notes">{current.choiceNotes.map((note, index) => <p key={note}><strong>{index + 1}번{index === current.answer ? " · 정답" : ""}</strong>{note}</p>)}</div></details>}
        {current.chapterId && <Link className="theory-return" href={`/${trackId}/theory/${current.chapterId}/`}><Icon name="book" size={19}/>관련 이론을 그림과 함께 복습하기 <Icon name="arrow" size={17}/></Link>}
      </div>}
      <div className="quiz-footer"><span>{submitted ? "해설을 확인하고 다음으로 이동하세요." : "정답이라고 생각하는 보기를 선택해 주세요."}</span>{submitted ? <button className="button primary" onClick={advance}>{index === activeQuestions.length - 1 ? "결과 보기" : "다음 문제"}<Icon name="arrow" size={18}/></button> : <button className="button primary" disabled={choice === null} onClick={() => { if (choice !== null) setAnswers({ ...answers, [current.id]: choice }); }}>정답 확인 <Icon name="check" size={18}/></button>}</div>
      {current.sourceId && <p className="question-source"><a href={sources[current.sourceId].url} target="_blank" rel="noreferrer">공유 대화 원문 ↗</a><span>{current.sourceNote}</span></p>}
    </div>
  </section>;
}
