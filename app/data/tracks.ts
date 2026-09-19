import { courseParts, practiceQuestions, type CoursePart } from "./course";

export type TrackId = "engineer" | "technician";
export type Track = {
  id: TrackId;
  title: string;
  shortTitle: string;
  english: string;
  label: string;
  description: string;
  topics: string[];
  parts: CoursePart[];
};

const chapters = courseParts.flatMap((part) => part.chapters);
function selectChapters(ids: string[]) {
  return ids.map((id, index) => ({
    ...chapters.find((chapter) => chapter.id === id)!,
    number: String(index + 1).padStart(2, "0"),
  }));
}

export const tracks: Track[] = [
  {
    id: "engineer",
    title: "공간정보융합산업기사",
    shortTitle: "산업기사",
    english: "INDUSTRIAL ENGINEER",
    label: "분석에서 서비스 구현까지",
    description: "공간정보를 분석하고, 서비스와 콘텐츠로 연결하는 심화 학습",
    topics: ["공간정보 분석", "서비스 프로그래밍", "융합콘텐츠 개발"],
    parts: courseParts,
  },
  {
    id: "technician",
    title: "공간정보융합기능사",
    shortTitle: "기능사",
    english: "CRAFTSMAN",
    label: "기초부터 차근차근",
    description: "공간정보의 개념부터 수집·가공·표현까지 익히는 기초 학습",
    topics: ["공간정보 기초", "자료수집과 가공", "지도 표현"],
    parts: [
      { id: "foundation", number: "PART 01", title: "공간정보의 첫걸음", description: "데이터의 종류와 수집 방법을 이해합니다.", accent: "violet", chapters: selectChapters(["spatial-basics", "data-collection"]) },
      { id: "processing", number: "PART 02", title: "데이터 수집 이후의 과정", description: "자료를 정비하고 기본 분석을 익힙니다.", accent: "violet", chapters: selectChapters(["processing", "image-processing", "spatial-analysis"]) },
      { id: "mapping", number: "PART 03", title: "공간정보를 지도로 표현하기", description: "지도 시각화와 콘텐츠의 기초를 배웁니다.", accent: "violet", chapters: selectChapters(["visualization", "content-production"]) },
    ],
  },
];

export function getTrack(id: string) {
  return tracks.find((track) => track.id === id);
}

export function getChapters(track: Track) {
  return track.parts.flatMap((part) => part.chapters);
}

export function getQuestions(track: Track) {
  // Source material contains original practice items, not verified past papers.
  return track.id === "engineer"
    ? [...practiceQuestions.map((question, index) => ({ ...question, id: `practice-${index}` })), ...getChapters(track).map((chapter) => ({ ...chapter.question, id: chapter.id, category: chapter.title }))]
    : getChapters(track).map((chapter) => ({ ...chapter.question, id: chapter.id, category: chapter.title }));
}
