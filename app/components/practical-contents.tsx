import Link from "next/link";
import { courseParts } from "../data/course";
import { practicalLessons, practicalPastQuestions, practicalQuestions } from "../data/practical";
import { practicalSections } from "../data/practical-curriculum";
import { Icon } from "./icons";

export function PracticalContents() {
  const lessonById = new Map(
    [...courseParts.flatMap(part => part.chapters), ...practicalLessons]
      .map(lesson => [lesson.id, lesson]),
  );

  return <section className="practical-contents" aria-labelledby="practical-contents-title">
    <div className="practical-contents-heading">
      <span className="mini-kicker">실기 학습 목차</span>
      <h2 id="practical-contents-title">3개 Chapter로 준비하는 실기</h2>
      <p>실기 기본이론으로 개념을 익힌 뒤, 같은 Chapter의 문제를 풀며 답안을 완성하세요.</p>
    </div>
    <ol className="practical-chapter-list">
      {practicalSections.map(section => {
        const lessons = section.lessonIds.flatMap(id => {
          const lesson = lessonById.get(id);
          return lesson ? [lesson] : [];
        });
        const predictedCount = practicalQuestions.filter(question => section.lessonIds.includes(question.chapterId)).length;
        const pastCount = practicalPastQuestions.filter(question => section.lessonIds.includes(question.chapterId)).length;
        const practiceHref = `/engineer/practice/practical/?section=${section.id}`;

        return <li key={section.id}>
          <article className="practical-chapter-card" aria-labelledby={`practical-chapter-${section.id}`}>
            <header className="practical-chapter-heading">
              <span className="practical-chapter-number">Chapter {Number(section.number)}</span>
              <h3 id={`practical-chapter-${section.id}`}>{section.title}</h3>
              <p>{section.description}</p>
            </header>
            <dl className="practical-chapter-counts">
              <div><dt>기본이론</dt><dd>{lessons.length}<span>단원</span></dd></div>
              <div><dt>예상문제</dt><dd>{predictedCount}<span>문제</span></dd></div>
              <div><dt>제공 기출</dt><dd>{pastCount}<span>문제</span></dd></div>
            </dl>
            <section className="practical-chapter-study" aria-labelledby={`practical-study-${section.id}`}>
              <h4 id={`practical-study-${section.id}`}><span>01</span>기본이론 공부하기</h4>
              <ul className="practical-chapter-lessons">
                {lessons.map(lesson => <li key={lesson.id}>
                  <Link href={`/engineer/theory/${lesson.id}/`}>
                    <span>{lesson.title.replace(/^실기 기초\s*·\s*/, "")}</span>
                    <Icon name="arrow" size={16}/>
                  </Link>
                </li>)}
              </ul>
            </section>
            <section className="practical-chapter-practice" aria-labelledby={`practical-practice-${section.id}`}>
              <h4 id={`practical-practice-${section.id}`}><span>02</span>문제로 답안 완성하기</h4>
              <Link className="practical-chapter-start button primary" href={practiceHref}>
                이 Chapter 문제 풀기 <Icon name="arrow" size={17}/>
              </Link>
              <div className="practical-chapter-source-links">
                <Link href={`${practiceHref}&source=practice`}>예상 {predictedCount}문제</Link>
                {pastCount > 0
                  ? <Link href={`${practiceHref}&source=past`}>사용자 제공 기출 {pastCount}문제</Link>
                  : <span>등록된 기출 없음</span>}
              </div>
            </section>
          </article>
        </li>;
      })}
    </ol>
  </section>;
}
