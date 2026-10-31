import Link from "next/link";

export function ExamNavigation({ current }: { current: "written" | "practical" }) {
  return <nav className="exam-navigation" aria-label="필기·실기 선택"><Link href="/engineer/practice/written/" aria-current={current === "written" ? "page" : undefined}><span>01</span><strong>필기 문제풀이</strong><small>객관식 · 개념 확인</small></Link><Link href="/engineer/practice/practical/" aria-current={current === "practical" ? "page" : undefined}><span>02</span><strong>실기 문제풀이</strong><small>필답형 · 직접 답안 작성</small></Link></nav>;
}
