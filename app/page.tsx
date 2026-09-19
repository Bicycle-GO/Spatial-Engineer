import Link from "next/link";
import { tracks, getChapters, getQuestions } from "./data/tracks";
import { Icon } from "./components/icons";
import { Terrain } from "./components/terrain";
import { TrackProgress } from "./components/study-progress";

export default function Home() {
  return <main id="main-content" className="home-page container">
    <section className="home-hero">
      <div className="hero-copy">
        <span className="eyebrow"><span className="live-dot" /> 나의 가능성을 넓히는 공간정보 공부</span>
        <h1>공간을 읽는 힘,<br /><em>나만의 합격 경로.</em></h1>
        <p>처음 만나는 개념부터 문제를 풀어내는 순간까지.<br className="desktop-break" /> 나에게 맞는 트랙에서, 한 걸음씩 시작하세요.</p>
        <a href="#tracks" className="button primary">나의 학습 트랙 선택하기 <Icon name="arrow" size={19}/></a>
        <div className="hero-caption"><span><Icon name="check" size={16}/> 두 가지 자격증 트랙</span><span><Icon name="check" size={16}/> 이론과 문제풀이를 한곳에서</span></div>
      </div>
      <Terrain />
    </section>
    <section id="tracks" className="tracks-section">
      <div className="section-heading"><div><span className="eyebrow">CHOOSE YOUR TRACK</span><h2>어떤 목표를 향해 가고 있나요?</h2></div><p>목표는 다르게, 학습은 체계적으로.</p></div>
      <div className="track-grid">
        {tracks.map((track, index) => <article className={`track-card ${track.id}`} key={track.id}>
          <div className="track-card-top"><span className="track-icon"><Icon name={track.id === "engineer" ? "layers" : "map"} size={30}/></span><span className="track-label">{track.label}</span><span className="track-number">0{index + 1}</span></div>
          <span className="track-english">{track.english}</span>
          <h3>{track.title}</h3>
          <p className="track-description">{track.description}</p>
          <div className="topic-tags">{track.topics.map(topic => <span key={topic}>{topic}</span>)}</div>
          <div className="track-metrics"><span><Icon name="book" size={17}/>{getChapters(track).length}개 이론 챕터</span><span><Icon name="quiz" size={17}/>{getQuestions(track).length}개 예상문제</span></div>
          <div className="track-actions"><Link className="button primary" href={`/${track.id}/theory/`}><Icon name="book" size={20}/>기본이론 <Icon name="arrow" size={18}/></Link><Link className="button secondary" href={`/${track.id}/practice/`}><Icon name="quiz" size={20}/>기출문제 풀이 <Icon name="arrow" size={18}/></Link></div>
          <TrackProgress trackId={track.id} chapterIds={getChapters(track).map(chapter => chapter.id)} />
        </article>)}
      </div>
    </section>
    <section id="learning-guide" className="learning-guide">
      <div className="guide-intro"><span className="eyebrow">HOW TO STUDY</span><h2>복잡한 공부를,<br />명확한 세 단계로.</h2></div>
      <ol className="guide-steps">
        <li><span>01</span><div><h3>개념 하나에 집중하기</h3><p>기본이론을 한 챕터씩 읽으며<br/>핵심을 차근차근 이해해요.</p></div></li>
        <li><span>02</span><div><h3>문제로 확인하기</h3><p>별도의 문제풀이 화면에서<br/>배운 내용을 바로 점검해요.</p></div></li>
        <li><span>03</span><div><h3>부족한 부분 채우기</h3><p>해설과 오답을 확인하고<br/>헷갈린 개념을 다시 살펴봐요.</p></div></li>
      </ol>
    </section>
    <div className="home-note"><Icon name="book" size={19}/><p>학습 진도는 이 브라우저에 자동으로 저장됩니다. 오늘의 한 챕터부터 시작해 보세요.</p></div>
  </main>;
}
