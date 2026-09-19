import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "./components/site-header";

export const metadata: Metadata = {
  title: { default: "공간정보 학습실 | 산업기사 · 기능사", template: "%s | 공간정보 학습실" },
  description:
    "공간정보융합산업기사와 공간정보융합기능사를 위한 두 가지 학습 트랙. 기본이론과 문제풀이를 나누어 나만의 속도로 학습하세요.",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg` },
  keywords: [
    "공간정보융합산업기사",
    "공간정보융합기능사",
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
    <html lang="ko" data-scroll-behavior="smooth">
      <body><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
