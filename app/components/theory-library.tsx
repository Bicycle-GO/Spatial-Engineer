"use client";
import { useState } from "react";
import Link from "next/link";
import { getChapters, type Track } from "../data/tracks";
import { Icon } from "./icons";
import { CompletionMark, useProgress } from "./study-progress";
import { practicalSections } from "../data/practical-curriculum";

export function TheoryLibrary({ track }: { track: Track }) {
  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState(track.id === "engineer" ? "practical-foundation" : "visual");
  const { completed } = useProgress(track.id);
  const chapters = getChapters(track);
  const practicalCount = chapters.filter(chapter=>chapter.practical).length;
  const visualCount = chapters.filter(chapter=>chapter.guide).length;
  const nextCandidates = track.id === "engineer" ? [...chapters.filter(chapter=>chapter.practical),...chapters.filter(chapter=>!chapter.practical)] : chapters;
  const next = nextCandidates.find(chapter => !completed.includes(chapter.id)) ?? chapters[0];
  const query = search.trim().toLocaleLowerCase("ko");
  const includeSharedBasics = !query && (collection === "practical-foundation" || collection === "practical-analysis");
  const libraryParts = track.id === "engineer" ? [...track.parts.filter(part=>part.id!=="practical-foundation"), ...practicalSections.map(section=>({id:`practical-${section.id}`,number:`CHAPTER ${Number(section.number)}`,title:section.title,chapters:chapters.filter(chapter=>(chapter.practical || includeSharedBasics) && section.lessonIds.includes(chapter.id))}))] : track.parts;
  const parts = libraryParts.map(part => ({ ...part, chapters: part.chapters.filter(chapter => (query || collection === "all" || collection === part.id || (collection === "practical-foundation" && part.id.startsWith("practical-")) || (collection === "visual" && chapter.guide)) && [chapter.title, chapter.summary, chapter.definition, ...chapter.keywords, ...chapter.concepts.map(concept => `${concept.label} ${concept.text}`)].join(" ").toLocaleLowerCase("ko").includes(query)) })).filter(part => part.chapters.length);
  return <>
    <div className="page-heading"><span className="eyebrow">BUILD YOUR FOUNDATION</span><h1>기본이론</h1><p>한 번에 하나의 개념, 탄탄하게 쌓아가는 기초.</p></div>
    <div className="continue-card"><span className="continue-icon"><Icon name="book" size={28}/></span><div><span>{completed.length ? "나의 다음 학습" : "여기서 시작하세요"}</span><h2>{next.title}</h2></div><Link className="button primary" href={`/${track.id}/theory/${next.id}/`}>{completed.length ? "이어서 학습" : "학습 시작"}<Icon name="arrow" size={18}/></Link></div>
    <section className="visual-course-intro"><span className="mini-kicker">{track.id === "engineer" ? "THEORY TO PRACTICAL ANSWER" : "SEE IT. UNDERSTAND IT."}</span><h2>{track.id === "engineer" ? "개념을 답안으로 연결하세요." : "읽고, 비교하고, 직접 바꿔 보세요."}</h2><p>{track.id === "engineer" ? `실기 기본이론 ${practicalCount}개 단원에서 계산식·처리 순서·SQL과 답안 작성 틀을 익혀요. 기존 이론과 ${visualCount}개 그림 학습도 모아보기에서 선택할 수 있어요.` : "투영법부터 코드 실행까지, 궁금했던 개념을 12개의 그림 학습으로 정리했어요."}</p><div><span><Icon name="map" size={17}/>개념 이해</span><span><Icon name="layers" size={17}/>비교·처리 순서</span><span><Icon name="quiz" size={17}/>답안 작성</span></div>{track.id === "engineer" && <Link className="button primary" href="/engineer/practice/practical/">실기 필답형 연습 <Icon name="arrow" size={17}/></Link>}</section>
    <div className="library-toolbar"><h2>학습 단원 <span>총 {chapters.length}개</span></h2><label className="search-box"><Icon name="search" size={19}/><input type="search" aria-label="이론 검색" placeholder="개념이나 키워드 검색" value={search} onChange={event => setSearch(event.target.value)}/></label></div>
    <div className="collection-toolbar"><label htmlFor="theory-collection">단원 모아보기</label><select id="theory-collection" value={collection} onChange={event => { setCollection(event.target.value); setSearch(""); }}><option value="visual">그림으로 배우는 핵심 {visualCount}</option><option value="all">전체 커리큘럼</option>{track.id === "engineer" && <option value="practical-foundation">실기 기본이론 전체</option>}{libraryParts.map(part => <option key={part.id} value={part.id}>{part.id.startsWith("practical-") ? `${part.number} · ` : ""}{part.title}</option>)}</select></div>
    {query && <p className="search-status" role="status">검색 결과 {parts.reduce((sum, part) => sum + part.chapters.length, 0)}개</p>}
    <div className="curriculum-list">{parts.map(part => <section className="curriculum-part" key={part.id}>
      <div className="part-heading"><span>{part.number}</span><h3>{part.title}</h3><span>{part.chapters.length}개 단원</span></div>
      <ol>{part.chapters.map((chapter, index) => <li key={chapter.id}><Link href={`/${track.id}/theory/${chapter.id}/`}><span className="chapter-number">{part.id.startsWith("practical-") ? String(index+1).padStart(2,"0") : chapter.number}</span><div><h4>{chapter.title}</h4><p>{chapter.summary}</p>{chapter.guide && <span className="visual-lesson-badge">그림 학습 · 약 {chapter.guide.minutes}분</span>}{chapter.practical && <span className="visual-lesson-badge">실기 기본이론 · 답안 작성 틀</span>}</div><CompletionMark trackId={track.id} chapterId={chapter.id}/></Link></li>)}</ol>
    </section>)}</div>
    {parts.length === 0 && <div className="empty-state"><Icon name="search" size={32}/><h2>일치하는 개념이 없어요.</h2><p>‘좌표계’, ‘지도’처럼 다른 키워드로 검색해 보세요.</p><button className="button secondary" onClick={() => { setSearch(""); setCollection("all"); }}>전체 챕터 보기</button></div>}
    {track.id === "technician" && <p className="content-note">기능사 트랙은 공통 기초 개념을 입문 순서로 구성한 보조 학습 과정입니다. 공식 출제기준 전체를 대체하지 않습니다.</p>}
  </>;
}
