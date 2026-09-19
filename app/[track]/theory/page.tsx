import { notFound } from "next/navigation";
import { getTrack } from "../../data/tracks";
import { TheoryLibrary } from "../../components/theory-library";

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  return { title: `${getTrack(track)?.shortTitle ?? "학습"} 기본이론` };
}
export default async function TheoryPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: id } = await params;
  const track = getTrack(id);
  if (!track) notFound();
  return <TheoryLibrary track={track}/>;
}
