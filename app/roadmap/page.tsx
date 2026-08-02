import type { Metadata } from "next";

import SpatialEngineerPage from "../spatial-engineer-app";

export const metadata: Metadata = {
  title: "학습 로드맵 | 공간정보융합산업기사",
  description: "공간정보융합산업기사 학습 순서와 진행 단계를 확인합니다.",
};

export default function RoadmapPage() {
  return <SpatialEngineerPage />;
}
