import { notFound } from "next/navigation";
import { getTrack, tracks, getChapters } from "../data/tracks";
import { TrackNavigation } from "../components/track-navigation";
import { TrackProgress } from "../components/study-progress";

export const dynamicParams = false;
export function generateStaticParams() { return tracks.map(track => ({ track: track.id })); }

export default async function TrackLayout({ children, params }: { children: React.ReactNode; params: Promise<{ track: string }> }) {
  const { track: id } = await params;
  const track = getTrack(id);
  if (!track) notFound();
  return <div className={`study-page ${track.id}`}>
    <div className="track-banner"><div className="container"><div><span className="eyebrow">{track.english}</span><strong>{track.title}</strong></div><span className="track-label">{track.label}</span></div></div>
    <div className="container study-layout">
      <aside className="study-sidebar">
        <span className="sidebar-caption">나의 학습 공간</span>
        <TrackNavigation trackId={track.id}/>
        <TrackProgress trackId={track.id} chapterIds={getChapters(track).map(chapter => chapter.id)}/>
        <p className="sidebar-tip">조금씩, 꾸준히.<br/>오늘의 공부가 내일의 실력이 됩니다.</p>
      </aside>
      <main id="main-content" className="study-main">{children}</main>
    </div>
  </div>;
}
