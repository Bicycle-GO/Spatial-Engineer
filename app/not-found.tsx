import Link from "next/link";
export default function NotFound() {
  return <main id="main-content" className="container empty-state not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>학습 페이지를 찾을 수 없어요.</h1><p>학습 홈에서 원하는 트랙을 다시 선택해 주세요.</p><Link className="button primary" href="/">학습 홈으로 돌아가기</Link></main>;
}
