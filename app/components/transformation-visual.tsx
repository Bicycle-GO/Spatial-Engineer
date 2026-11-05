"use client";

import { useState } from "react";

type TransformationMode = "similarity" | "affine" | "projective";
type Point = [number, number];

const origin: Point[] = [[75, 40], [195, 40], [195, 160], [75, 160]];
const modes: {
  id: TransformationMode;
  title: string;
  english: string;
  result: string;
  analogy: string;
  example: string;
  property: string;
}[] = [
  {
    id: "similarity", title: "등각사상(상사) 변환", english: "SIMILARITY · 2D MODEL",
    result: "회전·균일 축척을 적용한 정사각형",
    analogy: "사진을 가로·세로 같은 비율로 확대하거나 줄이며 돌리는 모습이에요.",
    example: "상대적인 모양은 맞지만 전체 위치·방향·축척이 어긋난 시설 배치도를 기준점에 맞춥니다.",
    property: "각도와 길이비를 유지합니다. 축척이 바뀌면 실제 길이와 면적의 값은 달라질 수 있어요.",
  },
  {
    id: "affine", title: "부등각사상(아핀) 변환", english: "AFFINE · 2D MODEL",
    result: "축별 축척·전단이 가능한 평행사변형",
    analogy: "투명 필름을 가로·세로 다르게 늘리고 옆으로 기울이는 모습을 떠올려 보세요.",
    example: "스캔 과정에서 가로와 세로의 축척이 달라지거나 비뚤어진 평면도를 참조 자료에 맞춥니다.",
    property: "직선과 평행성을 유지합니다. 각도와 모양의 비율은 일반적으로 달라질 수 있어요.",
  },
  {
    id: "projective", title: "투영(사영) 변환", english: "PROJECTIVE · 2D MODEL",
    result: "원근 관계로 표현한 사다리꼴",
    analogy: "직사각형 카드를 비스듬히 보면 가까운 쪽과 먼 쪽의 폭이 달라지는 모습이에요.",
    example: "평평한 안내지도를 비스듬히 찍은 사진에서 대응하는 모서리 등을 이용해 평면의 원근 왜곡을 맞춥니다.",
    property: "직선은 직선으로 남습니다. 평행성·각도·길이비는 일반적으로 유지되지 않아요.",
  },
];

function pointsFor(mode: TransformationMode): Point[] {
  if (mode === "similarity") {
    const angle = 25 * Math.PI / 180;
    return origin.map(([x, y]): Point => {
      const dx = (x - 135) * .85;
      const dy = (y - 100) * .85;
      return [135 + dx * Math.cos(angle) - dy * Math.sin(angle), 100 + dx * Math.sin(angle) + dy * Math.cos(angle)];
    });
  }
  if (mode === "affine") return origin.map(([x, y]): Point => [x + .45 * y - 45, .8 * y + 20]);
  return [[115, 40], [175, 40], [225, 160], [65, 160]];
}

function ShapeDiagram({ mode, showOrigin = false }: { mode: TransformationMode | "origin"; showOrigin?: boolean }) {
  const points = mode === "origin" ? origin : pointsFor(mode);
  const polygonPoints = points.map(([x,y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const originPoints = origin.map(point => point.join(",")).join(" ");
  const text = mode === "origin" ? "원본 정사각형 A B C D" : modes.find(item => item.id === mode)!.result;
  return <svg className="transformation-diagram" viewBox="0 0 280 210" role="img" aria-label={`${text}${showOrigin ? ". 점선은 원본 정사각형입니다." : ""}`}>
    <rect x="5" y="5" width="270" height="200" rx="12" fill="#f7faf3"/>
    {[40,80,120,160].map(y => <path key={`h-${y}`} d={`M20 ${y}H260`} fill="none" stroke="#e5ecde"/>)}
    {[55,95,135,175,215].map(x => <path key={`v-${x}`} d={`M${x} 20V190`} fill="none" stroke="#e5ecde"/>)}
    {showOrigin && <polygon points={originPoints} fill="none" stroke="#98a491" strokeWidth="2" strokeDasharray="5 4"/>}
    <polygon points={polygonPoints} fill={mode === "origin" ? "#e4ebdc" : "#b9d6b0aa"} stroke={mode === "origin" ? "#7f9571" : "#4c7955"} strokeWidth="3" strokeLinejoin="round"/>
    {points.map(([x,y],index) => {
      const labelX = x + (x < 135 ? -12 : 12);
      const labelY = y + (y < 100 ? -10 : 21);
      return <g key={index}><circle cx={x} cy={y} r="4" fill={mode === "origin" ? "#7f9571" : "#3b6945"}/><text x={labelX} y={labelY} textAnchor="middle" fill="#355440" fontSize="16" fontWeight="650">{["A","B","C","D"][index]}</text></g>;
    })}
  </svg>;
}

export function TransformationVisual() {
  const [mode, setMode] = useState<TransformationMode>("similarity");
  const current = modes.find(item => item.id === mode)!;
  return <div className="transformation-explorer">
    <div className="transformation-options" aria-label="공간보정 변환 모형 선택">{modes.map(item => <button type="button" key={item.id} aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>{item.title}</button>)}</div>
    <div className="transformation-pair"><figure className="transformation-figure"><span className="transformation-state-label">원본</span><ShapeDiagram mode="origin"/><figcaption>같은 정사각형에서 시작해요.</figcaption></figure><span className="transformation-arrow" aria-hidden="true">→</span><figure className="transformation-figure"><span className="transformation-state-label result">변환 후</span><ShapeDiagram mode={mode}/><figcaption>{current.result}</figcaption></figure></div>
    <section className="transformation-detail" aria-live="polite"><span className="mini-kicker">{current.english}</span><h3>{current.title}</h3><p className="transformation-property">{current.property}</p><div className="transformation-cases"><section><h4>쉬운 비유</h4><p>{current.analogy}</p></section><section><h4>실생활 사례</h4><p>{current.example}</p></section></div></section>
    <p className="transformation-note">변형 성질을 비교하는 개념도이며 실제 자료의 보정값을 계산하는 기능은 아닙니다. 이 단원은 공간보정의 대표적인 2차원 모형을 다루며, 여기의 사영변환은 TM·UTM 같은 지구의 지도 투영과 구분합니다.</p>
  </div>;
}

export function TransformationSolution() {
  return <section className="transformation-summary" aria-label="변환 방식 세 가지의 도형 비교"><h3>세 가지 변환을 도형으로 비교하기</h3><p>같은 정사각형을 변환한 개념 예시입니다. 점선은 원본, 채운 도형은 변환 후 모습이에요.</p><div className="transformation-summary-grid">{modes.map(item => <article className="transformation-summary-card" key={item.id}><span className="mini-kicker">{item.english}</span><h4>{item.title}</h4><ShapeDiagram mode={item.id} showOrigin/><p>{item.property}</p></article>)}</div><p className="transformation-note">등각사상은 이 단원의 2차원 상사 모형으로, 부등각사상은 일반 아핀 모형으로 비교합니다. 아핀 변환도 설정에 따라 상사변환이 될 수 있어요. 사영변환은 지도 투영법 이름을 뜻하는 것이 아닙니다.</p></section>;
}
