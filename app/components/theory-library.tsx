"use client";
import { useState } from "react";
import Link from "next/link";
import { getChapters, type Track } from "../data/tracks";
import { Icon } from "./icons";
import { CompletionMark, useProgress } from "./study-progress";

export function TheoryLibrary({ track }: { track: Track }) {
  const [search, setSearch] = useState("");
  const { completed } = useProgress(track.id);
  const chapters = getChapters(track);
  const next = chapters.find(chapter => !completed.includes(chapter.id)) ?? chapters[0];
  const query = search.trim().toLocaleLowerCase("ko");
  const parts = track.parts.map(part => ({ ...part, chapters: part.chapters.filter(chapter => [chapter.title, chapter.summary, chapter.definition, ...chapter.keywords, ...chapter.concepts.map(concept => `${concept.label} ${concept.text}`)].join(" ").toLocaleLowerCase("ko").includes(query)) })).filter(part => part.chapters.length);
  return <>
    <div className="page-heading"><span className="eyebrow">BUILD YOUR FOUNDATION</span><h1>기본이론</h1><p>한 번에 하나의 개념, 탄탄하게 쌓아가는 기초.</p></div>
    <div className="continue-card"><span className="continue-icon"><Icon name="book" size={28}/></span><div><span>{completed.length ? "나의 다음 학습" : "여기서 시작하세요"}</span><h2>{next.title}</h2></div><Link className="button primary" href={`/${track.id}/theory/${next.id}/`}>{completed.length ? "이어서 학습" : "학습 시작"}<Icon name="arrow" size={18}/></Link></div>
    <div className="library-toolbar"><h2>전체 커리큘럼 <span>{chapters.length}개 챕터</span></h2><label className="search-box"><Icon name="search" size={19}/><input type="search" aria-label="이론 검색" placeholder="개념이나 키워드 검색" value={search} onChange={event => setSearch(event.target.value)}/></label></div>
    {query && <p className="search-status" role="status">검색 결과 {parts.reduce((sum, part) => sum + part.chapters.length, 0)}개</p>}
    <div className="curriculum-list">{parts.map(part => <section className="curriculum-part" key={part.id}>
      <div className="part-heading"><span>{part.number}</span><h3>{part.title}</h3><span>{part.chapters.length}개 챕터</span></div>
      <ol>{part.chapters.map(chapter => <li key={chapter.id}><Link href={`/${track.id}/theory/${chapter.id}/`}><span className="chapter-number">{chapter.number}</span><div><h4>{chapter.title}</h4><p>{chapter.summary}</p></div><CompletionMark trackId={track.id} chapterId={chapter.id}/></Link></li>)}</ol>
    </section>)}</div>
    {parts.length === 0 && <div className="empty-state"><Icon name="search" size={32}/><h2>일치하는 개념이 없어요.</h2><p>‘좌표계’, ‘지도’처럼 다른 키워드로 검색해 보세요.</p><button className="button secondary" onClick={() => setSearch("")}>전체 챕터 보기</button></div>}
    {track.id === "technician" && <p className="content-note">기능사 트랙은 공통 기초 개념을 입문 순서로 구성한 보조 학습 과정입니다. 공식 출제기준 전체를 대체하지 않습니다.</p>}
  </>;
}
