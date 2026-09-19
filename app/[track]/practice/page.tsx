import { notFound } from "next/navigation";
import { getTrack, getQuestions } from "../../data/tracks";
import { PracticeRoom } from "../../components/practice-room";

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  return { title: `${getTrack(track)?.shortTitle ?? "학습"} 기출문제 풀이` };
}
export default async function PracticePage({ params }: { params: Promise<{ track: string }> }) {
  const { track: id } = await params;
  const track = getTrack(id);
  if (!track) notFound();
  return <PracticeRoom key={track.id} trackId={track.id} questions={getQuestions(track)}/>;
}
