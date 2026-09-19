import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrack, getChapters } from "../../../data/tracks";
import { Icon } from "../../../components/icons";
import { ChapterActions } from "../../../components/chapter-actions";

export function generateStaticParams({ params }: { params: { track: string } }) {
  const track = getTrack(params.track);
  return track ? getChapters(track).map(chapter => ({ chapter: chapter.id })) : [];
}
export async function generateMetadata({ params }: { params: Promise<{ track: string; chapter: string }> }) {
  const values = await params;
  const track = getTrack(values.track);
  return { title: track ? `${getChapters(track).find(chapter => chapter.id === values.chapter)?.title ?? "기본이론"} · ${track.shortTitle}` : "기본이론" };
}
export default async function ChapterPage({ params }: { params: Promise<{ track: string; chapter: string }> }) {
  const values = await params;
  const track = getTrack(values.track);
  if (!track) notFound();
  const chapters = getChapters(track);
  const index = chapters.findIndex(chapter => chapter.id === values.chapter);
  const chapter = chapters[index];
  if (!chapter) notFound();
  const part = track.parts.find(part => part.chapters.some(item => item.id === chapter.id))!;
  return <>
    <nav className="breadcrumbs" aria-label="현재 위치"><Link href={`/${track.id}/theory/`}>기본이론</Link><Icon name="chevron" size={14}/><span>{part.title}</span></nav>
    <article className="lesson">
      <header className="lesson-heading"><span className="eyebrow">CHAPTER {String(index + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span><h1>{chapter.title}</h1><p>{chapter.summary}</p><div className="topic-tags">{chapter.keywords.map(keyword => <span key={keyword}>{keyword}</span>)}</div></header>
      <section className="definition-card"><span className="eyebrow">한 문장으로 이해하기</span><p>{chapter.definition}</p></section>
      <section className="concept-section"><h2>핵심 개념</h2><div className="concepts">{chapter.concepts.map((concept, i) => <div className="concept" key={concept.label}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{concept.label}</h3><p>{concept.text}</p></div></div>)}</div></section>
      {chapter.steps && <section className="process-section"><h2>흐름으로 정리하기</h2><ol className="process-steps">{chapter.steps.map((step, i) => <li key={step}><span>{i + 1}</span>{step}{i < chapter.steps!.length - 1 && <Icon name="chevron" size={15}/>}</li>)}</ol></section>}
      <section className="exam-point"><span className="point-icon">!</span><div><h2>문제에서 기억할 포인트</h2><p>{chapter.examPoint}</p></div></section>
      <ChapterActions trackId={track.id} chapterId={chapter.id} nextId={chapters[index + 1]?.id}/>
      <div className="lesson-pagination">{index > 0 ? <Link href={`/${track.id}/theory/${chapters[index - 1].id}/`}>← 이전 챕터</Link> : <Link href={`/${track.id}/theory/`}>← 전체 챕터</Link>}<Link href={`/${track.id}/practice/`}>문제로 실력 확인하기 <Icon name="arrow" size={17}/></Link></div>
    </article>
  </>;
}
