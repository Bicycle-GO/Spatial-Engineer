import type { Metadata } from "next";

import SpatialEngineerPage from "../spatial-engineer-app";

export const metadata: Metadata = {
  title: "과목별 학습 | 공간정보융합산업기사",
  description: "공간정보융합산업기사 과목별 핵심 내용을 학습합니다.",
};

export default function CurriculumPage() {
  return <SpatialEngineerPage />;
}
