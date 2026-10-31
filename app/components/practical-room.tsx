"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { practicalQuestions, type PracticalQuestion } from "../data/practical";
import { sources } from "../data/sources";
import { Icon } from "./icons";
import { ExamNavigation } from "./exam-navigation";

function subscribeLocation(callback:()=>void) { window.addEventListener("popstate", callback); return ()=>window.removeEventListener("popstate",callback); }
const getSearch = () => window.location.search;
const getServerSearch = () => "";
function subscribeDraft(callback:()=>void) { window.addEventListener("storage",callback); window.addEventListener("practical-draft",callback); return ()=>{window.removeEventListener("storage",callback);window.removeEventListener("practical-draft",callback);}; }

function AnswerInput({ questionId, onReady }: { questionId:string; onReady:()=>void }) {
  const key = `spatial-practical-draft-v1:${questionId}`;
  const [fallback,setFallback] = useState<string | null>(null);
  const stored = useSyncExternalStore(subscribeDraft,()=>{try {return localStorage.getItem(key) ?? "";}catch{return "";}},()=>"");
  const value = fallback ?? stored;
  return <div className="answer-editor"><label htmlFor="practical-answer">나의 답안</label><textarea id="practical-answer" rows={7} value={value} placeholder="핵심 용어, 계산 과정, 단위 또는 코드를 직접 적어보세요." onChange={event=>{ const next = event.target.value; setFallback(next); try{localStorage.setItem(key,next);window.dispatchEvent(new Event("practical-draft"));}catch{/* The current answer remains available in memory. */} }}/><div><span>작성한 답안은 저장 가능한 경우 이 브라우저에 보관돼요.</span><button className="button primary" disabled={!value.trim()} onClick={onReady}>모범답안과 비교 <Icon name="check" size={17}/></button></div></div>;
}

export function PracticalRoom() {
  const search = useSyncExternalStore(subscribeLocation,getSearch,getServerSearch);
  const chapter = new URLSearchParams(search).get("chapter") ?? "";
  return <PracticalContent key={chapter} initialChapter={chapter}/>;
}

function PracticalContent({ initialChapter }: {initialChapter:string}) {
  const initialCategory = practicalQuestions.find(question=>question.chapterId===initialChapter)?.category;
  const [category,setCategory] = useState(initialCategory ?? "all");
  const [format,setFormat] = useState("all");
  const [source,setSource] = useState("practice");
  const [linked,setLinked] = useState(Boolean(initialCategory));
  const filtered = practicalQuestions.filter(question=>(category==="all" || question.category===category) && (format==="all" || question.format===format) && (!linked || question.chapterId===initialChapter));
  return <>
    <ExamNavigation current="practical"/>
    <div className="page-heading"><span className="eyebrow">WRITE IT. EXPLAIN IT.</span><h1>실기 기출·예상문제</h1><p>답안을 직접 쓰며, 알고 있는 개념을 설명하는 힘을 길러요.</p></div>
    <div className="practice-sources" aria-label="실기 문제 출처"><button aria-pressed={source==="practice"} onClick={()=>setSource("practice")}>실기 예상문제 <span>{practicalQuestions.length}</span></button><button aria-pressed={source==="past"} onClick={()=>setSource("past")}>실기 기출문제 <span>0</span></button></div>
    {source==="past" ? <div className="empty-state"><Icon name="book" size={35}/><h2>검증된 실기 기출문제를 준비 중이에요.</h2><p>시행 연도·회차·원문이 확인된 기출문제는 아직 등록되지 않았습니다.<br/>실기 예상문제로 답안 작성을 연습할 수 있어요.</p><button className="button primary" onClick={()=>setSource("practice")}>실기 예상문제 풀기</button><a className="text-link" href={sources.qnetEngineer.url} target="_blank" rel="noreferrer">Q-Net 공식 시험정보·출제기준 ↗</a></div> : <>
      <p className="source-notice"><span>실기 필답형 연습</span>직접 작성한 예상문제입니다. 모범답안·점검 기준은 학습용이며 공식 기출·채점 기준이 아닙니다.</p>
      <div className="practical-filters"><label>학습 주제<select value={category} onChange={event=>{setCategory(event.target.value);setLinked(false);}}><option value="all">전체 주제</option>{[...new Set(practicalQuestions.map(question=>question.category))].map(item=><option key={item}>{item}</option>)}</select></label><label>답안 유형<select value={format} onChange={event=>setFormat(event.target.value)}><option value="all">전체 유형</option>{["단답형","서술형","계산형","코드형"].map(item=><option key={item}>{item}</option>)}</select></label></div>
      {linked && <p className="linked-question-note">이론 단원에 연결된 문제 {filtered.length}개 <button onClick={()=>{setLinked(false);setCategory("all");setFormat("all");}}>전체 문제로 돌아가기</button></p>}
      {filtered.length ? <PracticalSession key={`${category}-${format}-${linked}`} questions={filtered}/> : <div className="empty-state"><h2>이 조건에 맞는 문제가 없어요.</h2><button className="button secondary" onClick={()=>{setCategory("all");setFormat("all");setLinked(false);}}>전체 문제 보기</button></div>}
    </>}
  </>;
}

function PracticalSession({ questions }: {questions:PracticalQuestion[]}) {
  const [items,setItems] = useState(questions);
  const [index,setIndex] = useState(0);
  const [revealed,setRevealed] = useState(false);
  const [hint,setHint] = useState(false);
  const [checks,setChecks] = useState<Record<string,number[]>>({});
  const [reviews,setReviews] = useState<Record<string,"understood"|"review">>({});
  const [finished,setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const current = items[index];
  const selected = checks[current.id] ?? [];
  const needsReview = items.filter(item=>reviews[item.id]!=="understood");
  function focusHeading() { requestAnimationFrame(()=>{heading.current?.focus();heading.current?.scrollIntoView({block:"nearest"});}); }
  function advance() { if(index===items.length-1)setFinished(true);else setIndex(index+1);setRevealed(false);setHint(false);focusHeading(); }
  function restart(next:PracticalQuestion[]) {setItems(next);setIndex(0);setRevealed(false);setHint(false);setReviews({});setChecks({});setFinished(false);focusHeading();}
  if(finished) return <section className="quiz-result"><span className="result-icon"><Icon name="check" size={32}/></span><h2 ref={heading} tabIndex={-1}>답안 작성 연습을 마쳤어요.</h2><div className="result-score"><strong>{items.length-needsReview.length}</strong><span>/ {items.length}문제 이해 완료</span></div><p>자가점검 결과예요. {needsReview.length ? `${needsReview.length}문제를 다시 써보며 보완해 보세요.` : "모든 답안을 이해했다고 표시했어요."}</p><div className="result-actions">{needsReview.length>0 && <button className="button primary" onClick={()=>restart(needsReview)}>복습할 문제만 다시 풀기</button>}<button className="button secondary" onClick={()=>restart(questions)}>전체 다시 풀기</button><Link className="text-link" href="/engineer/theory/">실기 기본이론으로 돌아가기 <Icon name="arrow" size={16}/></Link></div></section>;
  return <section className="quiz-card practical-quiz" aria-label="실기 필답형 연습"><div className="quiz-topline"><span>PRACTICAL <strong>{String(index+1).padStart(2,"0")}</strong> / {items.length}</span><span>{Object.keys(reviews).length}개 점검 완료</span></div><progress max={items.length} value={Object.keys(reviews).length} aria-label="실기 학습 진행률"/><div className="quiz-body"><div className="practical-question-labels"><span className="question-category">{current.category}</span><span>{current.format}</span><span>예상문제</span></div><h2 ref={heading} tabIndex={-1}>{current.title}</h2>{current.context && <p className="question-context">{current.context}</p>}<p className="practical-prompt">{current.prompt}</p>{current.code && <pre className="question-code"><code>{current.code}</code></pre>}
    <button className="hint-toggle" aria-expanded={hint} onClick={()=>setHint(!hint)}>{hint ? "힌트 접기" : "풀이 힌트 보기"}</button>{hint && <p className="answer-hint">{current.hint}</p>}
    <AnswerInput key={current.id} questionId={current.id} onReady={()=>setRevealed(true)}/>
    {revealed && <section className="practical-solution" aria-label="모범답안과 자가점검"><span className="mini-kicker">MODEL ANSWER</span><h3>모범답안</h3><pre className="model-answer">{current.modelAnswer}</pre><div className="solution-steps"><h3>풀이 과정</h3><ol>{current.explanation.map((text,index)=><li key={text}><span>{index+1}</span><p>{text}</p></li>)}</ol></div><fieldset className="self-check"><legend>내 답안에 포함했나요?</legend><p>아래 항목은 학습용 자가점검입니다. 입력한 답안을 자동으로 채점하지 않습니다.</p>{current.criteria.map((criterion,criterionIndex)=><label key={criterion}><input type="checkbox" checked={selected.includes(criterionIndex)} onChange={()=>setChecks({...checks,[current.id]:selected.includes(criterionIndex)?selected.filter(value=>value!==criterionIndex):[...selected,criterionIndex]})}/><span>{criterion}</span></label>)}<strong aria-live="polite">{selected.length} / {current.criteria.length}개 확인</strong></fieldset><p className="answer-pitfall"><strong>자주 놓치는 부분</strong>{current.mistakes}</p><Link className="theory-return" href={`/engineer/theory/${current.chapterId}/`}><Icon name="book" size={18}/>관련 기본이론 복습 <Icon name="arrow" size={17}/></Link><div className="review-decision" aria-label="내 학습 상태"><button aria-pressed={reviews[current.id]==="understood"} onClick={()=>setReviews({...reviews,[current.id]:"understood"})}><Icon name="check" size={17}/>이해했어요</button><button aria-pressed={reviews[current.id]==="review"} onClick={()=>setReviews({...reviews,[current.id]:"review"})}><Icon name="refresh" size={17}/>다시 복습할게요</button></div></section>}
    <div className="quiz-footer"><span>{revealed ? "자가점검 후 학습 상태를 선택하세요." : "답안을 작성한 뒤 모범답안과 비교하세요."}</span>{revealed && <button className="button primary" disabled={!reviews[current.id]} onClick={advance}>{index===items.length-1?"학습 결과 보기":"다음 문제"}<Icon name="arrow" size={18}/></button>}</div>
  </div></section>;
}
