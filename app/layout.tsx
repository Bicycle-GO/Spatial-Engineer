import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://spatial-engineer-exam-kr.hopesound.chatgpt.site"),
  title: "공간정보융합산업기사 실전 학습실",
  description:
    "14개 핵심 챕터를 학습하고 제1회 실전 모의고사 41문항을 답안지처럼 풀어보는 공간정보융합산업기사 학습실",
  keywords: [
    "공간정보융합산업기사",
    "공간정보",
    "GIS",
    "자격증",
    "기본서",
    "실전 모의고사",
    "문제풀이",
  ],
  openGraph: {
    title: "공간정보융합산업기사 제1회 실전 모의고사",
    description:
      "큰 글씨 CBT로 41문항을 자유롭게 이동하며 풀고, 답안과 진행 상태를 자동 저장하세요.",
    url: "/",
    siteName: "공간정보융합산업기사 학습실",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "공간정보융합산업기사 제1회 실전 모의고사 41문항",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "공간정보융합산업기사 제1회 실전 모의고사",
    description: "큰 글씨 CBT로 41문항을 자유롭게 풀어보세요.",
    images: ["/og.png"],
  },
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
