import { notFound } from "next/navigation";
import { getTrack, getQuestions } from "../../../data/tracks";
import { PracticeRoom } from "../../../components/practice-room";
import { PracticalRoom } from "../../../components/practical-room";

export const dynamicParams = false;
export function generateStaticParams() {
  // Emit complete paths: an empty child result would retain the parent track
  // without an exam parameter in Next.js static exports.
  return [{track:"engineer",exam:"written"},{track:"engineer",exam:"practical"}];
}
export async function generateMetadata({params}:{params:Promise<{track:string;exam:string}>}) {
  const {exam}=await params; return {title:`산업기사 ${exam==="practical"?"실기":"필기"} 기출·예상문제`};
}
export default async function ExamPage({params}:{params:Promise<{track:string;exam:string}>}) {
  const {track,exam}=await params;
  const course = getTrack(track);
  if(track!=="engineer" || !course || !["written","practical"].includes(exam))notFound();
  return exam==="practical" ? <PracticalRoom/> : <PracticeRoom trackId="engineer" questions={getQuestions(course)}/>;
}
