"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { tracks } from "../data/tracks";
import { Icon } from "./icons";

export function SiteHeader() {
  const pathname = usePathname();
  return <>
    <a className="skip-link" href="#main-content">본문 바로가기</a>
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="공간정보 학습실 홈">
          <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/spatial-logo.svg`} width={44} height={44} alt="" priority />
          <span><strong>공간정보 학습실</strong><small>SPATIAL ENGINEER</small></span>
        </Link>
        <nav className="primary-nav" aria-label="학습 트랙">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>학습 홈</Link>
          {tracks.map((track) => <Link key={track.id} href={`/${track.id}/theory/`} aria-current={pathname.includes(`/${track.id}/`) ? "page" : undefined}>{track.shortTitle}<span className={`nav-dot ${track.id}`} /></Link>)}
        </nav>
        <Link className="header-note" href="/#learning-guide"><Icon name="book" size={18} />학습 가이드</Link>
      </div>
    </header>
  </>;
}

export function SiteFooter() {
  return <footer className="site-footer"><span>SPATIAL ENGINEER <i /> 공간을 이해하는 새로운 기준</span><span>하나의 목표, 나에게 맞는 학습 경로.</span></footer>;
}
