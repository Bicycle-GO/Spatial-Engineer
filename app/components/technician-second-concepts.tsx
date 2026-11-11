"use client";

import { useState } from "react";
import styles from "./technician-second-concepts.module.css";

function ResamplingGuide() {
  const [method, setMethod] = useState(0);
  const names = ["최근린 · 1개", "공일차 · 4개", "공삼차 · 16개"];
  const values = [[0, 5, 15, 25], [5, 10, 20, 30], [15, 30, 40, 50], [25, 40, 50, 60]];
  return <section className={styles.guide} aria-label="영상 재배열 보간법 비교"><h4>새 셀의 값을 어디서 가져올까요?</h4><p>새 격자의 중심이 원래 셀 중심 사이에 놓이면 값을 정해야 합니다. 아래는 세 방법이 참고하는 이웃 개수의 비교예요.</p>
    <div className={styles.options} aria-label="보간 방법">{names.map((name, index) => <button type="button" key={name} aria-pressed={method === index} onClick={() => setMethod(index)}>{name}</button>)}</div>
    <div className={styles.resample}><table className={styles.samples}><caption>이웃 값의 학습용 예시 · 색칠한 값 사용</caption><tbody>{values.map((row, r) => <tr key={r}>{row.map((value, c) => <td key={c} data-selected={method === 2 || (method === 1 && [1, 2].includes(r) && [1, 2].includes(c)) || (method === 0 && r === 1 && c === 1)}>{value}</td>)}</tr>)}</tbody></table>
      <div aria-live="polite"><h5>{names[method]}</h5>{method === 0 ? <><p>가장 가까운 원래 셀의 값 하나를 복사합니다. 이 예시에서는 값이 10인 점에 가장 가까운 새 위치를 가정해 <strong>10</strong>을 선택해요.</p><p>토지이용 코드처럼 숫자가 범주를 뜻하는 자료에 흔히 씁니다. 새 숫자를 만들지 않지만 위치 이동·셀 누락까지 없는 무손실 처리는 아닙니다.</p></> : method === 1 ? <><p>주변 네 값의 가중 평균을 구합니다. 가중치는 가로·세로 상대 위치를 이용합니다.</p><p>네 값 10·20·30·40 사이에서 가로·세로 모두 왼쪽 위 점에서 1/4 이동한 위치라면, 가중치는 9/16·3/16·3/16·1/16이고 결과는 <strong>17.5</strong>입니다.</p></> : <><p>주변 4×4, 즉 16개 값을 이용해 3차 보간을 합니다. 연속 영상에 쓰며 원래 값의 범위를 벗어나는 결과가 나올 수도 있어요.</p><p>그냥 16개를 더해 16으로 나누는 평균 필터와 구별합니다. 정확한 계산 결과는 보간 커널과 위치 조건에 따라 달라집니다.</p></>}</div>
    </div><p className={styles.note}>세 방법은 재배열할 때 새 위치의 값을 정합니다. 중앙값·평균·최댓값 필터처럼 주변 창의 통계량을 구하는 작업과 목적을 구분하세요. 첨부 자료의 ‘공일차’는 bilinear, ‘공삼차’는 bicubic에 대응합니다.</p>
  </section>;
}

function RectificationGuide() {
  return <section className={styles.guide} aria-label="직접법과 간접법의 방향 비교"><h4>어느 격자에서 출발하느냐가 달라요</h4><div className={styles.cards}>
    <article><h5>① 직접법 · 전방 사상</h5><div className={styles.flow}><span>입력 영상의 셀 (x, y)</span><b>↓ 위치 변환</b><span>출력 지도의 위치 (X, Y)</span></div><p>원래 영상의 셀을 지도 쪽으로 보냅니다. 여러 입력이 같은 출력에 도착하거나, 도착하는 입력이 없어 비는 셀이 생길 수 있어요.</p></article>
    <article><h5>② 간접법 · 역방향 사상</h5><div className={styles.flow}><span>출력 지도의 셀 (X, Y)</span><b>↓ 원래 위치 찾기</b><span>입력 영상의 위치 (x, y)</span><b>↓ 보간해서 값 선택</b><span>출력 셀의 밝기 값</span></div><p>완성할 지도 격자를 먼저 정한 뒤 원래 영상을 찾아갑니다. 최근린·공일차·공삼차 같은 방법으로 값을 정합니다.</p></article>
    </div><p className={styles.note}>입력 영상의 유효 범위 밖이거나 원자료가 NoData이면 간접법도 값이 없을 수 있습니다. 모든 셀에 유효한 값이 생긴다는 보장은 아닙니다. 플랫폼이 위성인지 항공기인지보다 사상의 방향으로 구분하세요.</p></section>;
}

function GisComponents() {
  return <section className={styles.guide} aria-label="GIS 세 구성요소 예시"><h4>공원 지도를 만드는 작업에 대입해 보세요</h4><div className={styles.cards}>
    <article><h5>하드웨어 · 작업할 장비</h5><p>컴퓨터, 저장장치, 자료를 수집할 GNSS 수신기 등입니다.</p></article><article><h5>소프트웨어 · 작업할 도구</h5><p>지도를 표시하고, 도형을 편집하고, 분석할 프로그램입니다.</p></article><article><h5>데이터베이스 · 모아 둔 자료</h5><p>공원 경계, 시설 위치, 이름·면적 등 정리해 둔 공간·속성 자료입니다.</p></article>
  </div><p className={styles.note}>문항의 세 요소 분류에 맞춘 설명입니다. GIS를 운영하는 사람·조직과 방법까지 포함하는 다섯 요소 분류도 쓰입니다.</p></section>;
}

const services = [
  ["WCS", "Web Coverage Service", "웹 커버리지 서비스", "표고·기온 같은 값이 있는 커버리지 자료를 받기"],
  ["WFS", "Web Feature Service", "웹 피처 서비스", "도로·건물 등의 도형과 속성 자료를 조회하기"],
  ["WMS", "Web Map Service", "웹 맵 서비스", "서버가 그린 지도 이미지를 보기"],
  ["WPS", "Web Processing Service", "웹 처리 서비스", "서버가 공개한 분석·처리 기능 실행하기"],
  ["CSW", "Catalogue Service for the Web", "웹 카탈로그 서비스", "메타데이터에서 필요한 자료와 서비스를 검색하기"],
];

function OgcNames() {
  return <section className={styles.guide} aria-label="OGC 서비스 이름과 역할"><h4>약어를 이름과 역할로 연결해요</h4><div className={styles.cards}>{services.map(([id, name, korean, example]) => <article key={id}><h5>{id} · {korean}</h5><strong className={styles.english}>{name}</strong><p>{example}</p></article>)}</div><p className={styles.note}>GML은 공간정보를 표현하는 XML 기반 인코딩 언어이고, 위 서비스들은 통신·요청 기능을 정한 표준입니다. 모두를 ‘GML 웹서비스’로 묶어 같은 형식의 자료만 전송한다고 이해하지 마세요.</p></section>;
}

function GraphicElements() {
  const items = [["점", "한 위치", "●"], ["선", "경로·중심선", "╱"], ["면", "경계와 내부", "⬟"], ["격자 셀", "래스터의 격자 단위", "▦"], ["영상소", "디지털 영상의 픽셀", "▣"], ["기호", "뜻을 정해 둔 지도 표시", "★"]];
  return <section className={styles.guide} aria-label="교재의 여섯 도형요소"><h4>문항에서 구분한 여섯 표현 단위</h4><div className={styles.cards}>{items.map(([name, text, symbol]) => <article key={name}><span className={styles.symbol} aria-hidden="true">{symbol}</span><h5>{name}</h5><p>{text}</p></article>)}</div><p className={styles.note}>교재의 표현 요소 분류입니다. 격자 셀과 영상소는 래스터·영상 맥락의 표현이며, 벡터 기하 유형을 여섯 가지로 분류한 뜻은 아닙니다.</p></section>;
}

function DatabaseCases() {
  return <section className={styles.guide} aria-label="데이터베이스 장단점의 쉬운 사례"><h4>여러 부서가 시설 대장을 함께 쓴다면?</h4><div className={styles.cards}>
    <article><h5>장점 · 중복·불일치 줄이기</h5><p>부서마다 다른 연락처를 복사해 두기보다 공통 자료를 관리하면 수정 기준을 통일하기 쉬워요.</p></article><article><h5>장점 · 함께 사용·권한 관리</h5><p>누가 조회하고 수정할지 정하고, 여러 사용자의 작업을 조정할 수 있어요.</p></article><article><h5>장점 · 자료와 프로그램 분리</h5><p>정해진 인터페이스와 구조를 이용해 자료를 관리하므로 프로그램마다 파일 처리 코드를 따로 만들 부담을 줄입니다.</p></article>
    <article><h5>단점 · 비용과 관리 필요</h5><p>구축, 운영, 백업, 교육에 비용과 전문성이 필요합니다. 구성에 따라 규모는 달라요.</p></article><article><h5>단점 · 장애 영향 집중</h5><p>공유 서버가 멈추면 여러 부서가 동시에 영향을 받을 수 있어 복구·복제 대책이 필요해요.</p></article><article><h5>단점 · 잘못된 권한의 영향</h5><p>권한 설정이나 보안 관리가 부실하면 많은 자료가 함께 노출될 수 있어요.</p></article>
  </div><p className={styles.note}>DB를 사용하기만 하면 중복이 완전히 없어지거나 보안이 자동으로 보장되는 것은 아닙니다. 설계와 운영이 함께 필요합니다.</p></section>;
}

function AnalysisCases() {
  return <section className={styles.guide} aria-label="공간분석 기법과 활용 사례"><h4>무엇을 묻는지 먼저 읽어요</h4><div className={styles.cards}>
    <article><h5>① 근접 분석 · 가까운가?</h5><p>학교에서 300m 이내의 시설을 찾는 버퍼·거리 분석처럼 주변 관계를 봅니다.</p></article><article><h5>② 중첩 분석 · 조건이 함께 맞는가?</h5><p>경사가 완만한 곳, 도로에 가까운 곳, 개발 가능한 곳을 겹쳐 적지를 검토합니다.</p></article><article><h5>③ 망 분석 · 연결 경로는?</h5><p>도로의 이동 시간과 연결 관계를 이용해 최단·최적 경로를 구합니다. 일방통행이나 통행 제한도 반영할 수 있어요.</p></article><article><h5>④ 지형·3차원 분석 · 높이는?</h5><p>수치표고모형에서 경사·경사방향을 구하고 지형을 입체로 살펴봅니다.</p></article>
  </div><p className={styles.note}>적지 분석은 여러 분석을 결합할 수 있습니다. 이 문항은 대표적인 활용으로 연결하며, 첨부 답안의 ① 중첩·② 최근린은 문맥에 맞게 보완했습니다. ‘인접성’이라는 위상 용어와 거리 기반 근접 분석도 구분하세요.</p></section>;
}

function OverlayConcept() {
  return <section className={styles.guide} aria-label="중첩분석의 처리 흐름"><h4>같은 위치를 기준으로 여러 자료를 포개요</h4><div className={styles.flow}><span>토지이용 · 경사 · 도로 등 서로 다른 자료</span><b>↓ 좌표계·범위·해상도·속성 의미 확인</b><span>위치가 맞도록 자료를 정렬하고 중첩</span><b>↓ 교차·결합 등 목적에 맞는 연산</b><span>조건을 만족하는 영역과 속성 분석</span></div><p>투명 지도 여러 장을 같은 기준에 맞춰 올려 놓는 모습에 비유할 수 있어요. 위치가 어긋나면 같은 곳을 비교한 결과가 아니게 됩니다.</p></section>;
}

export function TechnicianSecondConcepts({ number, solution = false }: { number: number; solution?: boolean }) {
  if (!solution) return null;
  if (number === 2 || number === 12) return <ResamplingGuide/>;
  if (number === 3) return <RectificationGuide/>;
  if (number === 4) return <GisComponents/>;
  if (number === 10) return <OgcNames/>;
  if (number === 13) return <GraphicElements/>;
  if (number === 14) return <DatabaseCases/>;
  if (number === 15) return <AnalysisCases/>;
  if (number === 20) return <OverlayConcept/>;
  return null;
}
