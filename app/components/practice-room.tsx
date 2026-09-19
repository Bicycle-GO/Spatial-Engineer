"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { CheckQuestion } from "../data/course";
import type { TrackId } from "../data/tracks";
import { Icon } from "./icons";

type Question = CheckQuestion & { id: string; category: string };

export function PracticeRoom({ trackId, questions }: { trackId: TrackId; questions: Question[] }) {
  const [source, setSource] = useState("practice");
  const [category, setCategory] = useState("all");
  const filtered = category === "all" ? questions : questions.filter(question => question.category === category);
  return <>
    <div className="page-heading"><span className="eyebrow">PUT KNOWLEDGE INTO PRACTICE</span><h1>기출문제 풀이</h1><p>한 문제씩 풀고, 해설로 개념을 완성하세요.</p></div>
    <div className="practice-sources" aria-label="문제 유형"><button aria-pressed={source === "practice"} onClick={() => setSource("practice")}>예상문제 <span>{questions.length}</span></button><button aria-pressed={source === "past"} onClick={() => setSource("past")}>기출문제 <span>0</span></button></div>
    {source === "past" ? <div className="empty-state"><Icon name="quiz" size={38}/><h2>등록된 기출문제가 없어요.</h2><p>출처와 회차가 확인된 기출문제는 아직 등록되지 않았습니다.<br/>지금은 개념을 점검하는 예상문제로 연습해 보세요.</p><button className="button primary" onClick={() => setSource("practice")}>예상문제 풀기 <Icon name="arrow" size={18}/></button></div> : <>
      <p className="source-notice"><span>예상문제 안내</span>현재 문항은 학습용으로 구성한 예상문제이며, 실제 기출문제가 아닙니다.</p>
      <div className="practice-toolbar"><label htmlFor="question-category">학습 주제</label><select id="question-category" value={category} onChange={event => setCategory(event.target.value)}><option value="all">전체 주제 ({questions.length}문제)</option>{[...new Set(questions.map(question => question.category))].map(item => <option key={item} value={item}>{item}</option>)}</select></div>
      <QuizSession key={category} questions={filtered} trackId={trackId}/>
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
  return <section className="quiz-card" aria-label="예상문제 풀이">
    <div className="quiz-topline"><span>QUESTION <strong>{String(index + 1).padStart(2, "0")}</strong> / {String(activeQuestions.length).padStart(2, "0")}</span><span>{score}개 정답</span></div>
    <progress max={activeQuestions.length} value={Object.keys(answers).length} aria-label="문제풀이 진행률"/>
    <div className="quiz-body"><span className="question-category">{current.category}</span><h2 ref={heading} tabIndex={-1} id="question-heading">{current.prompt}</h2>
      <fieldset className="quiz-options" aria-labelledby="question-heading" disabled={submitted}>
        <legend className="sr-only">정답을 하나 선택하세요.</legend>
        {current.choices.map((text, option) => <label key={`${current.id}-${option}`} className={`quiz-option ${choice === option ? "selected" : ""} ${submitted && option === current.answer ? "correct" : ""} ${submitted && choice === option && option !== current.answer ? "wrong" : ""}`}>
          <input type="radio" name={`answer-${current.id}`} value={option} checked={choice === option} onChange={() => setChoice(option)}/><span className="option-number">{option + 1}</span><span>{text}</span>{submitted && option === current.answer && <strong className="option-feedback">정답 <Icon name="check" size={18}/></strong>}{submitted && choice === option && option !== current.answer && <strong className="option-feedback">내 답안</strong>}
        </label>)}
      </fieldset>
      {submitted && <div className={`quiz-explanation ${choice === current.answer ? "" : "incorrect"}`} role="status"><strong>{choice === current.answer ? "정답이에요!" : `정답은 ${current.answer + 1}번이에요.`}</strong><p>{current.explanation}</p></div>}
      <div className="quiz-footer"><span>{submitted ? "해설을 확인하고 다음으로 이동하세요." : "정답이라고 생각하는 보기를 선택해 주세요."}</span>{submitted ? <button className="button primary" onClick={advance}>{index === activeQuestions.length - 1 ? "결과 보기" : "다음 문제"}<Icon name="arrow" size={18}/></button> : <button className="button primary" disabled={choice === null} onClick={() => { if (choice !== null) setAnswers({ ...answers, [current.id]: choice }); }}>정답 확인 <Icon name="check" size={18}/></button>}</div>
    </div>
  </section>;
}
