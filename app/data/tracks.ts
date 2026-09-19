import { courseParts, practiceQuestions, type CoursePart } from "./course";
import { sharedLessons } from "./shared-lessons";
import { sharedQuestions } from "./shared-questions";
import type { LearningQuestion } from "./lesson-types";

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

const chapters = [...courseParts.flatMap((part) => part.chapters), ...sharedLessons];
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
    parts: courseParts.map((part, index) => ({ ...part, chapters: selectChapters([...part.chapters.map(chapter => chapter.id), ...(index === 0 ? sharedLessons.slice(0, 8).map(chapter => chapter.id) : index === 1 ? sharedLessons.slice(8).map(chapter => chapter.id) : [])]) })),
  },
  {
    id: "technician",
    title: "공간정보융합기능사",
    shortTitle: "기능사",
    english: "CRAFTSMAN",
    label: "기초부터 차근차근",
    description: "지도·공간분석부터 데이터베이스와 코딩까지, 그림으로 익히는 기초 학습",
    topics: ["지도·공간분석", "영상·해상도", "DB·프로그래밍"],
    parts: [
      { id: "foundation", number: "PART 01", title: "지도와 좌표의 기초", description: "현실을 지도와 객체로 표현합니다.", accent: "violet", chapters: selectChapters(["spatial-basics", "spatial-modeling", "map-projections", "coordinate-systems"]) },
      { id: "processing", number: "PART 02", title: "수집·위상·공간분석", description: "자료의 관계와 분석 도구를 이해합니다.", accent: "violet", chapters: selectChapters(["data-collection", "processing", "topology", "overlay-analysis", "spatial-interpolation"]) },
      { id: "remote", number: "PART 03", title: "영상과 원격탐사", description: "해상도와 영상오차를 구분합니다.", accent: "violet", chapters: selectChapters(["image-processing", "remote-resolution", "image-errors"]) },
      { id: "database", number: "PART 04", title: "데이터베이스와 코드", description: "표를 읽고 변수의 변화를 추적합니다.", accent: "violet", chapters: selectChapters(["relational-database", "operators"]) },
      { id: "software", number: "PART 05", title: "소프트웨어 개발 기초", description: "요구사항을 정하고 검증합니다.", accent: "violet", chapters: selectChapters(["requirements", "software-testing"]) },
      { id: "mapping", number: "PART 06", title: "분석 결과와 지도 표현", description: "분석을 시각화와 콘텐츠로 연결합니다.", accent: "violet", chapters: selectChapters(["spatial-analysis", "visualization", "content-production"]) },
    ],
  },
];

export function getTrack(id: string) {
  return tracks.find((track) => track.id === id);
}

export function getChapters(track: Track) {
  return track.parts.flatMap((part) => part.chapters);
}

export function getQuestions(track: Track): LearningQuestion[] {
  const practice: LearningQuestion[] = getChapters(track).map(chapter => ({ ...chapter.question, id: chapter.id, chapterId: chapter.id, category: chapter.title, kind: "practice" }));
  if (track.id === "engineer") practice.unshift(...practiceQuestions.map((question, index): LearningQuestion => ({ ...question, id: `practice-${index}`, kind: "practice" })));
  return [...sharedQuestions, ...practice];
}
