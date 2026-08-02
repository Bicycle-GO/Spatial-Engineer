import type { Metadata } from "next";

import SpatialEngineerPage from "../spatial-engineer-app";

export const metadata: Metadata = {
  title: "합격 전략 | 공간정보융합산업기사",
  description: "공간정보융합산업기사 시험 대비 전략과 학습 요령을 확인합니다.",
};

export default function StrategyPage() {
  return <SpatialEngineerPage />;
}
