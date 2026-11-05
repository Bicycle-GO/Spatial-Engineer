"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { vectorizationStages, type VectorizationStageId } from "../data/vectorization";
import { Icon } from "./icons";

type DiagramStage = VectorizationStageId | "original";
type Cell = { column: number; row: number };

const CELL = 15;
const ORIGIN = { x: 30, y: 20 };
const stageOrder: VectorizationStageId[] = ["preprocess", "thinning", "vectorize", "postprocess"];
const skeleton: Cell[] = [];
for (let column = 2; column <= 8; column++) skeleton.push({ column, row: 10 });
for (let row = 4; row < 10; row++) skeleton.push({ column: 8, row });
for (let column = 9; column <= 16; column++) skeleton.push({ column, row: 4 });
for (let row = 5; row <= 9; row++) skeleton.push({ column: 12, row });

const thickCells = [...new Set(skeleton.flatMap(({ column, row }) => [-1, 0, 1].flatMap(dx => [-1, 0, 1].map(dy => `${column + dx},${row + dy}`))))]
  .map(value => { const [column, row] = value.split(",").map(Number); return { column, row }; });
const noise: Cell[] = [{ column: 2, row: 2 }, { column: 3, row: 3 }, { column: 4, row: 6 }, { column: 17, row: 10 }, { column: 16, row: 12 }];

function center(column: number, row: number) {
  return { x: ORIGIN.x + column * CELL + CELL / 2, y: ORIGIN.y + row * CELL + CELL / 2 };
}

function RasterCells({ cells, color = "#3d6450", opacity = 1 }: { cells: Cell[]; color?: string; opacity?: number }) {
  return <g opacity={opacity}>{cells.map(({ column, row }) => <rect key={`${column}-${row}`} x={ORIGIN.x + column * CELL} y={ORIGIN.y + row * CELL} width={CELL} height={CELL} fill={color}/>)}</g>;
}

/** A fixed teaching example, not the output of a thinning or tracing engine. */
export function VectorizationDiagram({ stage }: { stage: DiagramStage }) {
  const patternId = useId().replaceAll(":", "");
  const raster = ["original", "preprocess", "thinning"].includes(stage);
  const main = [[2, 10], [8, 10], [8, 4], [12, 4], [16, 4]].map(([column, row]) => center(column, row));
  const branch = [[12, 4], [12, 9]].map(([column, row]) => center(column, row));
  const postNodes = [...main, ...branch].filter((point, index, points) => points.findIndex(candidate => candidate.x === point.x && candidate.y === point.y) === index);
  const nodes = stage === "vectorize" ? skeleton.map(({ column, row }) => center(column, row)) : postNodes;
  const descriptions: Record<DiagramStage, string> = {
    original: "잡음과 문자·메모가 섞인 굵은 픽셀 농수로 선 도면",
    preprocess: "잡음과 문자·메모를 분리한 굵은 이진 래스터 선",
    thinning: "연결을 유지한 한 셀 폭의 래스터 중심선",
    vectorize: "같은 중심선을 좌표 정점과 연결선으로 표현한 벡터",
    postprocess: "연결과 형상을 확인하고 불필요한 정점을 정리해 속성을 붙인 벡터",
  };
  return <svg className="vectorization-diagram" viewBox="0 0 360 250" role="img" aria-label={descriptions[stage]}>
    <defs><pattern id={`${patternId}-grid`} width={CELL} height={CELL} patternUnits="userSpaceOnUse" x={ORIGIN.x} y={ORIGIN.y}><path d={`M${CELL} 0H0V${CELL}`} fill="none" stroke="#c8d3c1" strokeWidth=".7"/></pattern></defs>
    <rect x="5" y="5" width="350" height="240" rx="13" fill={stage === "original" ? "#f3eedf" : "#f9fcf6"}/>
    {stage === "original" && <><path d="M25 33L329 21M24 217L334 226" stroke="#c9bd9b" strokeWidth="1"/><text x="46" y="58" fontSize="18" fill="#8e846b" transform="rotate(-4 46 58)">수로</text></>}
    {raster && <RasterCells cells={stage === "thinning" ? skeleton : thickCells} color={stage === "original" ? "#69655b" : stage === "thinning" ? "#23614c" : "#3d6450"}/>}
    {stage === "original" && <RasterCells cells={noise} color="#8b8370" opacity={.75}/>}
    {!raster && <>
      <RasterCells cells={skeleton} color="#b8cdb3" opacity={.38}/>
      <polyline points={main.map(point => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#3278a0" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
      <polyline points={branch.map(point => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#3278a0" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
      {nodes.map((point, index) => <circle key={`${point.x}-${point.y}-${index}`} cx={point.x} cy={point.y} r={stage === "vectorize" ? 3.2 : 5} fill="white" stroke="#3278a0" strokeWidth="1.8"/>)}
      {stage === "postprocess" && <><rect x="236" y="151" width="92" height="49" rx="6" fill="white" stroke="#a8c49c"/><text x="247" y="173" fontSize="15" fill="#345c3d">ID: R-01</text><text x="247" y="191" fontSize="13" fill="#52764d">농수로</text></>}
    </>}
    <rect x={ORIGIN.x} y={ORIGIN.y} width="300" height="195" fill={`url(#${patternId}-grid)`} opacity={raster ? .65 : .3}/>
    <text x="30" y="236" fontSize="15" fill={raster ? "#476342" : "#3278a0"}>{raster ? stage === "thinning" ? "1셀 폭 · 래스터" : "여러 셀 폭 · 래스터" : "좌표 정점 + 선 객체 · 벡터"}</text>
  </svg>;
}

function StageFlow({ blank = false }: { blank?: boolean }) {
  return <ol className={`vectorization-flow${blank ? " vectorization-flow-question" : ""}`} aria-label={blank ? "전처리, 빈칸, 벡터화, 후처리 순서" : "도면의 선형 벡터 변환 순서"}>{vectorizationStages.map((stage, index) => <li key={stage.id} className={blank && index === 1 ? "blank" : ""}><span>0{index + 1}</span><strong>{blank && index === 1 ? "(     )" : `${stage.title} 단계`}</strong>{index < vectorizationStages.length - 1 && <Icon name="arrow" size={17}/>}</li>)}</ol>;
}

export function VectorizationQuestionDiagram() {
  return <figure className="vectorization-question-figure"><StageFlow blank/><figcaption>스캔한 선 도면을 중심선 벡터로 바꾸는 학습용 단계 보기입니다.</figcaption></figure>;
}

export function VectorizationSolution() {
  const thinning = vectorizationStages.find(stage => stage.id === "thinning")!;
  const vectorize = vectorizationStages.find(stage => stage.id === "vectorize")!;
  return <section className="vectorization-solution" aria-label="벡터 변환 과정의 그림 해설"><h3>단계 순서와 자료 형태 비교</h3><StageFlow/><div className="vectorization-comparison">{[thinning, vectorize].map(stage => <figure className="vectorization-figure" key={stage.id}><span className="vectorization-figure-label">{stage.title}</span><VectorizationDiagram stage={stage.id}/><figcaption><strong>{stage.output}</strong><p>{stage.summary}</p></figcaption></figure>)}</div><p className="vectorization-key-point">세선화 뒤에도 자료는 래스터입니다. 그 중심선을 좌표와 선 객체로 표현하는 단계가 벡터화입니다.</p><p className="vectorization-diagram-note">동일한 농수로의 연결 모양을 단순화한 개념도입니다. 벡터 도형 뒤의 옅은 픽셀은 원본 경로 대조용입니다. 셀과 정점의 수·좌표는 실제 처리 결과가 아닙니다.</p></section>;
}

export function VectorizationVisual() {
  const [selected, setSelected] = useState<VectorizationStageId>("preprocess");
  const active = vectorizationStages.find(stage => stage.id === selected)!;
  const index = stageOrder.indexOf(selected);
  const previous: DiagramStage = index === 0 ? "original" : stageOrder[index - 1];
  const inputTitle = index === 0 ? "스캔한 종이 도면" : `${vectorizationStages[index - 1].title} 후`;
  return <div className="vectorization-explorer">
    <div className="vectorization-stage-tabs" aria-label="벡터 변환 단계 선택">{vectorizationStages.map((stage, position) => <button type="button" key={stage.id} aria-pressed={selected === stage.id} onClick={() => setSelected(stage.id)}><span>0{position + 1}</span><strong>{stage.title}</strong></button>)}</div>
    <section className="vectorization-stage-detail"><span className="mini-kicker">STEP 0{index + 1}</span><h3>{active.title}</h3><p>{active.description}</p></section>
    {(active.analogy || active.beforeAfter) && <div className="vectorization-explanation-cards">
      {active.analogy && <section className="vectorization-analogy"><span className="mini-kicker">쉽게 생각하면</span><h4>{active.analogy.title}</h4><p>{active.analogy.text}</p></section>}
      {active.beforeAfter && <section className="vectorization-change" aria-label={`${active.title} 전후 상태`}><h4>무엇이 달라지나요?</h4><div className="vectorization-change-state"><span>처리 전</span><p>{active.beforeAfter.before}</p></div><div className="vectorization-change-state"><span>처리 후</span><p>{active.beforeAfter.after}</p></div></section>}
    </div>}
    <div className="vectorization-comparison"><figure className="vectorization-figure"><span className="vectorization-figure-label input">입력 · {inputTitle}</span><VectorizationDiagram stage={previous}/><figcaption>{index === 0 ? "글자·잡음과 여러 셀 폭의 선이 함께 있어요." : vectorizationStages[index - 1].output}</figcaption></figure><figure className="vectorization-figure"><span className="vectorization-figure-label">출력 · {active.title} 후</span><VectorizationDiagram stage={active.id}/><figcaption><strong>{active.output}</strong><p>{active.summary}</p></figcaption></figure></div>
    <section className="vectorization-scenarios" aria-label={`${active.title} 활용 예시`}>
      <div className="vectorization-scenario vectorization-case"><span className="mini-kicker">그림 속 사례</span><h4>오래된 농수로 도면</h4><p>{active.example}</p></div>
      {active.scenarios?.map(scenario => <div className="vectorization-scenario" key={scenario.title}><span className="mini-kicker">다른 도면에서는</span><h4>{scenario.title}</h4><p>{scenario.text}</p></div>)}
    </section>
    <section className="vectorization-checks"><h4>이 단계에서 확인할 것</h4><ul>{active.checks.map(check => <li key={check}>{check}</li>)}</ul></section>
    {selected === "thinning" && <p className="vectorization-key-point">선이 가늘어져도 셀로 저장된 래스터입니다. 선의 실제 폭 정보를 별도 보존해야 하는지도 확인하세요.</p>}
    {selected === "postprocess" && <p className="vectorization-key-point">모양이 정리됐다고 위치 정확도가 자동으로 확보되는 것은 아닙니다. 원도·좌표 기준·실제 연결과 속성을 검수하세요.</p>}
    {(selected === "vectorize" || selected === "postprocess") && <p className="vectorization-diagram-note">파란 선과 정점이 벡터 객체이며, 뒤의 옅은 픽셀은 원본 경로 대조용입니다.</p>}
    <p className="vectorization-diagram-note">스캔한 선 도면의 중심선을 추출하는 과정을 설명한 개념도입니다. 실제 알고리즘을 실행하거나 모든 래스터 변환에 이 순서를 강제하는 도구가 아닙니다.</p>
    <Link className="vectorization-practice-link button primary" href="/engineer/practice/practical/?chapter=practical-vectorization">빈칸·순서·실무 예상문제 풀기 <Icon name="arrow" size={17}/></Link>
  </div>;
}
