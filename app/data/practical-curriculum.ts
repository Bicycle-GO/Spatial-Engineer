export type PracticalSectionId = "analysis" | "programming" | "content";

export type PracticalSection = {
  id: PracticalSectionId;
  number: string;
  title: string;
  description: string;
  lessonIds: string[];
};

export const practicalSections: PracticalSection[] = [
  {
    id: "analysis",
    number: "01",
    title: "공간정보 분석",
    description: "좌표·오차·품질의 기초를 쌓고, 위상·중첩·래스터 분석을 연습합니다.",
    lessonIds: [
      "spatial-basics",
      "practical-crs",
      "practical-transformation",
      "practical-adjustment-error",
      "practical-quality",
      "practical-topology",
      "practical-overlay",
      "practical-raster",
      "practical-ndvi",
      "practical-aerial-photo",
      "practical-vectorization",
      "practical-rasterization",
    ],
  },
  {
    id: "programming",
    number: "02",
    title: "공간정보서비스 프로그래밍",
    description: "SQL과 코드를 읽고, 데이터 조회와 서비스의 처리 흐름을 설명합니다.",
    lessonIds: ["practical-sql", "practical-code", "practical-code-output", "practical-ogc"],
  },
  {
    id: "content",
    number: "03",
    title: "공간정보 융합콘텐츠 개발",
    description: "지도 표현을 익히고, 요구사항·테스트·성과물 검수까지 연결합니다.",
    lessonIds: ["practical-cartography", "practical-classification", "practical-validation"],
  },
];

export function getPracticalSection(chapterId: string): PracticalSection | undefined {
  return practicalSections.find(section => section.lessonIds.includes(chapterId));
}
