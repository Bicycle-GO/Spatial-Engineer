import Link from "next/link";
import { getQuestions, getTrack } from "../data/tracks";
import { practicalPastQuestions, practicalQuestions, practicalLessons } from "../data/practical";
import { sources } from "../data/sources";
import { Icon } from "./icons";

export function PracticeHub() {
  const writtenCount = getQuestions(getTrack("engineer")!).length;
  return <>
    <div className="page-heading"><span className="eyebrow">CHOOSE YOUR EXAM</span><h1>기출·예상문제 풀이</h1><p>필기는 개념을 고르고, 실기는 답안을 완성하세요.</p></div>
    <div className="exam-cards">
      <Link className="exam-card" href="/engineer/practice/written/"><span className="mini-kicker">WRITTEN · 01</span><Icon name="quiz" size={32}/><h2>필기 문제풀이</h2><p>객관식 4지선다로 개념을 확인하고<br/>선택지별 해설로 오답을 정리해요.</p><div><span>{writtenCount}개 학습문제</span><strong>필기 시작 <Icon name="arrow" size={18}/></strong></div></Link>
      <Link className="exam-card practical-card" href="/engineer/practice/practical/"><span className="mini-kicker">PRACTICAL · 02</span><Icon name="book" size={32}/><h2>실기 문제풀이</h2><p>단답·서술·계산·코드 답안을 작성하고<br/>모범답안과 점검 기준으로 복습해요.</p><div><span>기출 {practicalPastQuestions.length}개 · 예상 {practicalQuestions.length}개</span><strong>실기 시작 <Icon name="arrow" size={18}/></strong></div></Link>
    </div>
    <Link className="past-paper-link" href="/engineer/practice/practical/?source=past&chapter=spatial-basics"><span className="mini-kicker">사용자 제공 기출 · {practicalPastQuestions.length}문제</span><strong>Chapter 1. 공간정보 분석 · 공간정보 기초</strong><span>세 문항 풀기 <Icon name="arrow" size={17}/></span></Link>
    <section className="practical-path"><span className="mini-kicker">THEORY TO ANSWER</span><h2>실기 기본이론, 답안까지 연결하기</h2><p>8개 단원에서 핵심 개념과 답안 작성 틀을 익힌 뒤, 연결된 문제를 풀어보세요.</p><ol>{practicalLessons.map((lesson,index) => <li key={lesson.id}><Link href={`/engineer/theory/${lesson.id}/`}><span>{String(index+1).padStart(2,"0")}</span><strong>{lesson.title.replace("실기 기초 · ","")}</strong><Icon name="arrow" size={16}/></Link></li>)}</ol></section>
    <aside className="exam-official"><Icon name="clock" size={23}/><div><h2>산업기사 실기는 필답형입니다.</h2><p>Q-Net 안내: 필기 60문항·1시간 30분, 실기 필답형·2시간 30분(2026년부터). 이 사이트는 검정형 시험의 학습을 돕는 보조 과정입니다.</p><a href={sources.qnetEngineer.url} target="_blank" rel="noreferrer">공식 시험정보·출제기준 확인 ↗</a><small>확인일 2026.11.01</small></div></aside>
    <p className="content-note">실기는 사용자 제공 기출 {practicalPastQuestions.length}개와 자체 예상문제 {practicalQuestions.length}개로 구분합니다. 사용자 제공 기출의 시행 연도·회차와 공식 원문은 미확인입니다.</p>
  </>;
}
