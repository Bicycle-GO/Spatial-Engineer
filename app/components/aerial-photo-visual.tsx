"use client";

import { useId, useState } from "react";

type CalculationId = "scale" | "distance" | "height" | "overlap" | "area";
type Calculation = { id: CalculationId; title: string; heading: string; steps: string[]; result: string; explanation: string; caseText: string };

const calculations: Calculation[] = [
  {id:"scale",title:"사진 축척",heading:"기준면 고도에서 지표고를 빼요",steps:["H−h = 1,700−200 = 1,500 m","f = 150 mm = 0.15 m","s = 0.15÷1,500 = 1/10,000"],result:"사진 축척 1:10,000",explanation:"사진과 지상의 길이 비율이 축척입니다. 높이와 초점거리를 같은 단위로 나누면 단위 없는 비율이 됩니다.",caseText:"해발 200 m의 평탄한 농경지를 촬영한다면, 기준면 고도 1,700 m보다 카메라와 지면 사이 1,500 m가 축척식에 들어갑니다."},
  {id:"distance",title:"지상 거리",heading:"사진 3 cm는 지상에서 얼마나 될까요?",steps:["D = 사진거리 d × 축척분모 N","= 3 cm×10,000 = 30,000 cm","= 300 m"],result:"지상 수평거리 300 m",explanation:"사진 1 cm가 지상 100 m를 뜻합니다. 사진의 두 교차로 사이가 3 cm라면 지상 수평거리는 300 m입니다.",caseText:"평탄한 들판에서 두 농로 교차로의 간격을 읽는 상황입니다. 산비탈을 따라 걷는 경사거리와 구분합니다."},
  {id:"height",title:"촬영 고도",heading:"원하는 축척으로 지상고를 거꾸로 구해요",steps:["H−h = 초점거리 f × 축척분모 N","= 0.15 m×10,000 = 1,500 m","H = 1,500+200 = 1,700 m"],result:"지상고 1,500 m · 기준면 고도 1,700 m",explanation:"초점거리와 축척으로 구한 높이는 지면 위 높이입니다. 같은 기준면의 촬영점 고도는 지표고를 더해 구합니다.",caseText:"같은 1:10,000 사진을 얻으려는 예시입니다. 지표고 200 m를 지상고 1,500 m에 더하면 같은 기준면의 촬영점 고도는 1,700 m입니다."},
  {id:"overlap",title:"종중복·기선",heading:"겹친 60%와 이동한 40%를 나눠 봐요",steps:["L = 23 cm×10,000 = 2,300 m","겹침 = 2,300×0.60 = 1,380 m","B = L(1−p) = 2,300×0.40 = 920 m"],result:"촬영기선 B = 920 m",explanation:"촬영기선은 인접 촬영점 사이의 수평거리입니다. 앞 사진의 60%가 뒤 사진과 겹치면 다음 촬영점으로 이동한 거리는 촬영길이의 40%입니다.",caseText:"같은 비행 코스에서 농경지를 연속 촬영하는 예시입니다. 종중복 60%는 이 계산의 주어진 조건이며 모든 업무의 고정 기준이 아닙니다."},
  {id:"area",title:"한 장의 면적",heading:"가로·세로를 각각 지상 길이로 바꿔요",steps:["한 변 = 23 cm×10,000 = 2,300 m","= 2.3 km","A = 2.3 km×2.3 km = 5.29 km²"],result:"사진 한 장의 지상 범위 5.29 km²",explanation:"길이를 먼저 km로 환산한 뒤 두 변을 곱하면 km²가 됩니다. 한 장 전체의 면적이므로 중복 비율을 빼지 않습니다.",caseText:"한 장에 담긴 농경지 범위를 구하는 예시입니다. 여러 장이 새로 덮는 면적이나 전체 사진 장수를 계산하는 문제와 구분합니다."},
];

function VerticalDimension({ x, top, bottom }: { x: number; top: number; bottom: number }) {
  return <g stroke="#64785d" strokeWidth="1.6"><line x1={x} y1={top} x2={x} y2={bottom}/><line x1={x - 5} y1={top} x2={x + 5} y2={top}/><line x1={x - 5} y1={bottom} x2={x + 5} y2={bottom}/></g>;
}

function HorizontalDimension({ left, right, y }: { left: number; right: number; y: number }) {
  return <g stroke="#64785d" strokeWidth="1.6"><line x1={left} y1={y} x2={right} y2={y}/><line x1={left} y1={y - 5} x2={left} y2={y + 5}/><line x1={right} y1={y - 5} x2={right} y2={y + 5}/></g>;
}

function Airplane({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`} fill="#355c6c"><path d="M-30-3H-8L8-19H15L7-3H29L37 0L29 3H7L15 19H8L-8 3H-30L-36 11H-41L-37 0L-41-11H-36Z"/></g>;
}

/** Ideal teaching geometry: the photo plane and focal length are enlarged for legibility. */
function AerialGeometryDiagram({ mode }: { mode: "scale" | "distance" | "height" }) {
  const id = useId().replaceAll(":", "");
  return <svg className="aerial-photo-diagram" viewBox="0 0 580 410" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>수직 항공사진의 초점거리와 지상 촬영고도</title>
    <desc id={`${id}-description`}>사진면에서 렌즈 중심까지 초점거리 150 mm, 기준면 촬영점 고도 1,700 m, 지표고 200 m, 카메라에서 지면까지 높이 1,500 m입니다. 수직인 광축과 사진·지상 삼각형을 나타낸 개념도로 실제 축척으로 그리지 않았습니다.</desc>
    <rect x="4" y="4" width="572" height="402" rx="14" fill="#f6faf2"/>
    <Airplane x={245} y={31}/>
    <text x="300" y="36" fontSize="15" fill="#365b65">수직촬영</text>
    <path d="M180 80L410 310M310 80L80 310" fill="none" stroke="#7a9680" strokeWidth="1.8"/>
    <path d="M80 310L245 145L410 310Z" fill="#cfe3c5" opacity=".3"/>
    <line x1="245" y1="65" x2="245" y2="365" stroke="#87937f" strokeDasharray="5 5"/>
    <line x1="180" y1="80" x2="310" y2="80" stroke="#a26435" strokeWidth="6" strokeLinecap="round"/>
    <text x="245" y="62" textAnchor="middle" fontSize="16" fill="#8a562e">{mode === "distance" ? "사진거리 d = 3 cm" : "사진면"}</text>
    <circle cx="245" cy="145" r="8" fill="#355c6c" stroke="white" strokeWidth="2"/>
    <text x="257" y="164" fontSize="15" fill="#355c6c">렌즈 중심</text>
    <VerticalDimension x={337} top={80} bottom={145}/>
    <text x="351" y="106" fontSize="16" fill="#8a562e">f = 150 mm</text>
    <text x="351" y="127" fontSize="14" fill="#8a562e">= 0.15 m</text>
    <rect x="70" y="310" width="350" height="15" fill="#d7c9a7"/>
    <line x1="70" y1="310" x2="420" y2="310" stroke="#52714b" strokeWidth="3"/>
    <text x="245" y="348" textAnchor="middle" fontSize="17" fill="#45683f">{mode === "distance" ? "지상거리 D = 300 m" : "평탄한 지면 · 지표고 200 m"}</text>
    <VerticalDimension x={52} top={145} bottom={365}/>
    <text x="66" y="223" fontSize="15" fill="#45683f">H</text>
    <text x="66" y="245" fontSize="15" fill="#45683f">1,700 m</text>
    <VerticalDimension x={438} top={145} bottom={310}/>
    <text x="451" y="222" fontSize="17" fontWeight="700" fill="#2d6351">H−h</text>
    <text x="451" y="245" fontSize="17" fontWeight="700" fill="#2d6351">1,500 m</text>
    <VerticalDimension x={495} top={310} bottom={365}/>
    <text x="507" y="330" fontSize="14" fill="#45683f">h</text>
    <text x="507" y="350" fontSize="14" fill="#45683f">200 m</text>
    <line x1="40" y1="365" x2="550" y2="365" stroke="#9a9c8c" strokeDasharray="6 4"/>
    <text x="290" y="390" textAnchor="middle" fontSize="15" fill="#74796b">같은 높이 기준면 · 고도 0 m</text>
  </svg>;
}

function OverlapDiagram() {
  const id = useId().replaceAll(":", "");
  return <svg className="aerial-photo-diagram" viewBox="0 0 580 410" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>종중복 60%에서 촬영기선은 지상 촬영길이의 40%</title>
    <desc id={`${id}-description`}>평면에서 본 연속 수직사진의 촬영범위입니다. 두 직사각형은 각각 비행방향으로 2,300 m를 포함하고 1,380 m가 겹칩니다. 원과 마름모로 구분한 촬영점의 지상 투영 위치는 920 m 떨어져 있습니다.</desc>
    <defs><pattern id={`${id}-hatch`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-2 2L2-2M0 10L10 0M8 12L12 8" stroke="#739b6c" strokeWidth="1.2"/></pattern></defs>
    <rect x="4" y="4" width="572" height="402" rx="14" fill="#f6faf2"/>
    <text x="60" y="35" fontSize="17" fill="#345c49">비행 방향 →</text>
    <text x="60" y="67" fontSize="15" fill="#53674a">사진 비행방향 길이 23 cm · 축척 1:10,000</text>
    <rect x="60" y="100" width="300" height="150" fill="#edf2d9" stroke="#526d37" strokeWidth="2.5"/>
    <rect x="180" y="100" width="300" height="150" fill="#dbeafa" fillOpacity=".55" stroke="#3e6f99" strokeWidth="2.5" strokeDasharray="8 5"/>
    <rect x="180" y="100" width="180" height="150" fill={`url(#${id}-hatch)`}/>
    <text x="73" y="125" fontSize="15" fill="#526d37">사진 1</text>
    <text x="405" y="125" fontSize="15" fill="#3e6f99">사진 2</text>
    <circle cx="210" cy="175" r="7" fill="#526d37" stroke="white" strokeWidth="2"/>
    <polygon points="330,165 340,175 330,185 320,175" fill="#3e6f99" stroke="white" strokeWidth="2"/>
    <text x="270" y="220" textAnchor="middle" fontSize="18" fontWeight="700" fill="#345c49">겹침 60%</text>
    <line x1="210" y1="185" x2="210" y2="280" stroke="#8b9c83" strokeDasharray="4 4"/>
    <line x1="330" y1="185" x2="330" y2="280" stroke="#8b9c83" strokeDasharray="4 4"/>
    <HorizontalDimension left={210} right={330} y={280}/>
    <text x="270" y="274" textAnchor="middle" fontSize="17" fontWeight="700" fill="#345c49">B = 920 m</text>
    <HorizontalDimension left={180} right={360} y={316}/>
    <text x="270" y="309" textAnchor="middle" fontSize="16" fill="#53674a">겹침 1,380 m</text>
    <HorizontalDimension left={60} right={360} y={352}/>
    <text x="210" y="345" textAnchor="middle" fontSize="16" fill="#53674a">L = 2,300 m</text>
    <text x="270" y="388" textAnchor="middle" fontSize="14" fill="#64775c">○ · ◇는 촬영점의 지상 투영 위치</text>
  </svg>;
}

function AreaDiagram() {
  const id = useId().replaceAll(":", "");
  return <svg className="aerial-photo-diagram" viewBox="0 0 580 410" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>23 cm 정사각 사진의 지상 촬영범위는 2.3 km 정사각형</title>
    <desc id={`${id}-description`}>축척 1:10,000에서 사진 한 변 23 cm는 지상 2.3 km입니다. 평탄한 지면의 지상 촬영범위는 가로 2.3 km, 세로 2.3 km이며 전체 면적은 5.29 제곱킬로미터입니다.</desc>
    <rect x="4" y="4" width="572" height="402" rx="14" fill="#f6faf2"/>
    <text x="260" y="42" textAnchor="middle" fontSize="17" fill="#345c49">사진 23 cm×23 cm · 축척 1:10,000</text>
    <rect x="140" y="72" width="240" height="240" fill="#dbe8c7" stroke="#527143" strokeWidth="2.5"/>
    <path d="M140 152H380M140 232H380M220 72V312M300 72V312" stroke="#a8c18d" strokeWidth="1.5"/>
    <rect x="171" y="156" width="178" height="64" rx="8" fill="#f6faf2"/>
    <text x="260" y="185" textAnchor="middle" fontSize="25" fontWeight="700" fill="#345c49">5.29 km²</text>
    <text x="260" y="207" textAnchor="middle" fontSize="14" fill="#53674a">사진 한 장의 전체 지상 범위</text>
    <HorizontalDimension left={140} right={380} y={340}/>
    <text x="260" y="365" textAnchor="middle" fontSize="18" fill="#345c49">2.3 km</text>
    <VerticalDimension x={405} top={72} bottom={312}/>
    <text x="420" y="196" fontSize="18" fill="#345c49">2.3 km</text>
    <text x="260" y="394" textAnchor="middle" fontSize="14" fill="#64775c">겹침·잘라내기를 적용하기 전의 면적</text>
  </svg>;
}

function CalculationDiagram({ selected }: { selected: CalculationId }) {
  return selected === "overlap" ? <OverlapDiagram/> : selected === "area" ? <AreaDiagram/> : <AerialGeometryDiagram mode={selected}/>;
}

function DiagramFrame({selected}:{selected:CalculationId}) {
  return <figure className="aerial-photo-figure"><div className="aerial-photo-diagram-scroll" tabIndex={0} role="region" aria-label="항공사진 계산 도형. 좁은 화면에서는 좌우로 이동할 수 있습니다."><CalculationDiagram selected={selected}/></div><figcaption>좁은 화면에서는 도형을 좌우로 움직여 전체를 확인하세요.</figcaption></figure>;
}

function CalculationCard({ calculation }: { calculation: Calculation }) {
  return <section className="aerial-photo-calculation"><span className="mini-kicker">계산 예시 · {calculation.title}</span><h3>{calculation.heading}</h3><ol className="aerial-photo-formula">{calculation.steps.map(step => <li key={step}>{step}</li>)}</ol><p className="aerial-photo-result">{calculation.result}</p><p>{calculation.explanation}</p></section>;
}

function ConditionsNote({ cameraGeometry = true }: { cameraGeometry?: boolean }) {
  return <p className="aerial-photo-note">평탄지의 수직 원사진을 가정하고 기복·기울기·렌즈 왜곡을 무시한 창작 계산 예시입니다. 도형은 실제 축척이 아닙니다.{cameraGeometry && " 사진면·초점거리는 크게 표현했습니다."}</p>;
}

export function AerialPhotoVisual() {
  const [selected, setSelected] = useState<CalculationId>("scale");
  const active = calculations.find(calculation => calculation.id === selected)!;
  return <div className="aerial-photo-visual">
    <div className="aerial-photo-tabs" aria-label="항공사진 계산 예시 선택">{calculations.map(calculation => <button type="button" key={calculation.id} aria-pressed={selected === calculation.id} onClick={() => setSelected(calculation.id)}>{calculation.title}</button>)}</div>
    <div className="aerial-photo-panel"><DiagramFrame selected={selected}/><CalculationCard calculation={active}/></div>
    <section className="aerial-photo-case"><span className="mini-kicker">상황에 적용하면</span><p>{active.caseText}</p></section>
    <ConditionsNote cameraGeometry={selected !== "overlap" && selected !== "area"}/>
  </div>;
}

export function AerialPhotoSolution({questionId}:{questionId?:string}) {
  const active = calculations.find(calculation=>questionId===`pr-aerial-photo-${calculation.id}`) ?? calculations[0];
  return <section className="aerial-photo-solution" aria-label="항공사진 계산 그림 해설">
    <h3>이 문제의 그림 해설 · {active.title}</h3>
    <div className="aerial-photo-panel"><DiagramFrame selected={active.id}/><CalculationCard calculation={active}/></div>
    <ConditionsNote cameraGeometry={active.id!=="overlap" && active.id!=="area"}/>
  </section>;
}
