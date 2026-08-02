import type { Metadata } from "next";

import SpatialEngineerPage from "../spatial-engineer-app";

export const metadata: Metadata = {
  title: "CBT 모의고사 | 공간정보융합산업기사",
  description: "공간정보융합산업기사 과년도 문제를 CBT 형식으로 풉니다.",
};

export default function CbtPage() {
  return <SpatialEngineerPage />;
}
