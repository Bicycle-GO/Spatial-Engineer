"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TrackId } from "../data/tracks";
import { Icon } from "./icons";

export function TrackNavigation({ trackId }: { trackId: TrackId }) {
  const pathname = usePathname();
  return <nav className="study-nav" aria-label="학습 메뉴">
    <Link href={`/${trackId}/theory/`} aria-current={pathname.includes("/theory") ? "page" : undefined}><Icon name="book"/>기본이론<Icon name="chevron" size={16}/></Link>
    <Link href={`/${trackId}/practice/`} aria-current={pathname.includes("/practice") ? "page" : undefined}><Icon name="quiz"/>기출문제 풀이<Icon name="chevron" size={16}/></Link>
    <Link href="/"><Icon name="home"/>트랙 다시 선택</Link>
  </nav>;
}
