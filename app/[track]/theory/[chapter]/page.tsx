import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrack, getChapters } from "../../../data/tracks";
import { Icon } from "../../../components/icons";
import { ChapterActions } from "../../../components/chapter-actions";
import { LessonReader } from "../../../components/lesson-reader";

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
      <LessonReader key={chapter.id} chapter={chapter} trackId={track.id}/>
      <ChapterActions trackId={track.id} chapterId={chapter.id} nextId={chapters[index + 1]?.id}/>
      <div className="lesson-pagination">{index > 0 ? <Link href={`/${track.id}/theory/${chapters[index - 1].id}/`}>← 이전 챕터</Link> : <Link href={`/${track.id}/theory/`}>← 전체 챕터</Link>}<a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${track.id}/practice/?chapter=${chapter.id}`}>이 개념 문제 풀기 <Icon name="arrow" size={17}/></a></div>
    </article>
  </>;
}
