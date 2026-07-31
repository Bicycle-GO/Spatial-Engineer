import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "공간정보융합산업기사 학습실",
  description:
    "공간정보 분석, 공간정보서비스 프로그래밍, 공간정보 융합콘텐츠 개발을 14개 챕터로 배우는 인터랙티브 기본서",
  keywords: [
    "공간정보융합산업기사",
    "공간정보",
    "GIS",
    "자격증",
    "기본서",
    "예상문제",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
