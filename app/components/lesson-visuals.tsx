"use client";

import { useId, useState } from "react";
import type { VisualKind } from "../data/lesson-types";
import { Icon } from "./icons";

function Choices({ items, value, onChange, label }: { items: string[]; value: number; onChange: (index: number) => void; label: string }) {
  return <div className="visual-choices" aria-label={label}>{items.map((item, index) => <button type="button" key={item} aria-pressed={value === index} onClick={() => onChange(index)}>{item}</button>)}</div>;
}

export function FieldDiagram({ variant = "input" }: { variant?: "input" | "boundary" | "clip" | "erase" | "union" | "intersect" | "buffer" }) {
  const id = useId().replaceAll(":", "");
  const parcels = <><rect x="35" y="28" width="160" height="124" rx="2" fill="#c6dec1" stroke="#548563" strokeWidth="2"/><path d="M115 28v124M35 90h160" stroke="#fff" strokeWidth="3"/></>;
  return <svg viewBox="0 0 260 180" role="img" aria-label={{ input: "네 필지로 나뉜 입력 농지", boundary: "가상의 원형 관심 구역", clip: "원형 경계 안에 남은 농지 부분", erase: "원형 경계 바깥에 남은 농지 부분", union: "두 레이어 전체를 결합한 영역", intersect: "공통 영역에 양쪽 속성을 결합", buffer: "중심 객체에서 일정 거리의 영역" }[variant]}>
    <defs><clipPath id={`${id}-clip`}><circle cx="155" cy="90" r="65"/></clipPath><mask id={`${id}-erase`}><rect width="260" height="180" fill="white"/><circle cx="155" cy="90" r="65" fill="black"/></mask></defs>
    <path d="m20 160 105 12 112-18" stroke="#dce4d8" strokeWidth="3" fill="none"/>
    {variant === "input" && <>{parcels}<text x="75" y="66">A</text><text x="150" y="66">B</text><text x="75" y="129">C</text><text x="150" y="129">D</text></>}
    {variant === "boundary" && <><circle cx="155" cy="90" r="65" fill="#e4dcf3" stroke="#947bb9" strokeWidth="2" strokeDasharray="6 4"/><text x="155" y="96" textAnchor="middle">관심 구역</text></>}
    {(variant === "clip" || variant === "intersect") && <><g clipPath={`url(#${id}-clip)`}>{parcels}</g><circle cx="155" cy="90" r="65" stroke="#947bb9" strokeWidth="1.5" strokeDasharray="5 4" fill="none"/></>}
    {variant === "erase" && <><g mask={`url(#${id}-erase)`}>{parcels}</g><circle cx="155" cy="90" r="65" stroke="#947bb9" strokeDasharray="5 4" fill="none"/></>}
    {variant === "union" && <><circle cx="155" cy="90" r="65" fill="#e4dcf3" stroke="#947bb9" strokeWidth="2"/>{parcels}<circle cx="155" cy="90" r="65" fill="#a9bdd155" stroke="#947bb9" strokeWidth="2"/></>}
    {variant === "buffer" && <><circle cx="130" cy="90" r="64" fill="#e4dcf3" stroke="#947bb9" strokeWidth="2"/><path d="M130 90h64" stroke="#786494" strokeDasharray="4 4"/><circle cx="130" cy="90" r="7" fill="#235e48"/><text x="151" y="80">거리 r</text></>}
  </svg>;
}

export function ClipQuestionDiagram() {
  return <figure className="question-diagram"><div className="visual-flow"><div><FieldDiagram/><strong>입력 농지</strong></div><span aria-hidden="true">＋</span><div><FieldDiagram variant="boundary"/><strong>기준 경계</strong></div><span aria-hidden="true">→</span><div><FieldDiagram variant="clip"/><strong>산출 결과</strong></div></div><figcaption>대화의 문항을 재구성한 개념도 · 원형 경계는 가상 예시입니다.</figcaption></figure>;
}

function OverlayVisual() {
  const [mode, setMode] = useState(0);
  const modes = ["clip", "erase", "intersect", "union", "buffer"] as const;
  const texts = ["기준 경계 안의 농지 부분만 남깁니다. 입력 속성을 유지합니다.", "경계 안의 농지를 빼고 바깥쪽 부분만 남깁니다.", "겹치는 부분을 구하고 두 입력의 속성을 함께 결합할 수 있습니다.", "두 입력의 전체 영역을 보존하면서 경계를 분할·결합합니다.", "선택한 객체에서 일정 거리의 새 영역을 만듭니다. 자르는 연산이 아닙니다."];
  return <><Choices items={["Clip", "Erase", "Intersect", "Union", "Buffer"]} value={mode} onChange={setMode} label="공간분석 도구 선택"/><div className="visual-flow"><div><FieldDiagram/><strong>입력 농지</strong></div><span aria-hidden="true">＋</span><div><FieldDiagram variant="boundary"/><strong>{mode === 4 ? "경계와 별개인 거리 연산" : "기준 레이어"}</strong></div><span aria-hidden="true">→</span><div><FieldDiagram variant={modes[mode]}/><strong>{["안쪽 남기기", "바깥쪽 남기기", "공통 부분 + 속성", "전체 영역", "거리 영역"][mode]}</strong></div></div><p className="visual-answer" aria-live="polite">{texts[mode]}</p><p className="diagram-note">원형은 원리를 보여 주는 가상 경계입니다. Buffer 예시는 별도의 중심점을 사용합니다.</p></>;
}

function ProjectionVisual() {
  const [mode, setMode] = useState(0);
  const labels = ["정형 · 각도", "정적 · 면적", "정거 · 거리", "방위 · 방향"];
  return <><Choices items={labels} value={mode} onChange={setMode} label="투영 성질 선택"/>
    <svg className="projection-visual" viewBox="0 0 520 240" role="img" aria-label={`${labels[mode]} 보존 성질을 보여 주는 개념도`}>
      <rect x="12" y="12" width="496" height="216" rx="15" fill="#f0f4eb"/>
      {[55,95,135,175].map(y => <path key={y} d={`M35 ${y}h450`} stroke="#dce5d7"/>)}
      {mode < 2 ? <>{[120,260,400].map((x, i) => <g key={x}>{mode === 0 ? <circle cx={x} cy="110" r={[23,34,45][i]} fill="#91b39466" stroke="#507d55" strokeWidth="2"/> : <ellipse cx={x} cy="110" rx={[24,36,48][i]} ry={[24,16,12][i]} fill="#91b39466" stroke="#507d55" strokeWidth="2"/>}<text x={x} y="191" textAnchor="middle">{mode === 0 ? ["국소 형태 유지", "면적 변화", "면적 변화"][i] : "같은 면적"}</text></g>)}</> : <>
        {[32,64,96].map(r => <circle key={r} cx="260" cy="115" r={r} stroke="#8aaa8a" fill="none" strokeDasharray={mode === 3 ? "4 4" : undefined}/>)}
        <path d="M260 115H356M260 115l-68-68M260 115l-68 68" stroke="#41724b" strokeWidth="2"/>
        {mode === 2 ? <><text x="305" y="106">d</text><text x="366" y="119">3d</text><text x="54" y="215">중심 O에서의 거리만 표현</text></> : <><path d="M260 74a41 41 0 0 1 41 41" fill="none" stroke="#ab8352" strokeWidth="3"/><path d="M260 115V18" stroke="#ab8352" strokeDasharray="4 4"/><text x="295" y="69">방위각 θ</text><text x="268" y="34">N</text><text x="54" y="215">중심 O에서 바라보는 방향</text></>}
        <circle cx="260" cy="115" r="5" fill="#235e48"/><text x="268" y="138">O</text>
      </>}
    </svg>
    <p className="visual-answer" aria-live="polite">{["작은 원의 모양은 유지되지만, 위치에 따라 크기가 달라질 수 있어요.", "원이나 타원으로 모양이 달라도 넓이의 비율을 유지해요.", "특정 중심점·기준선의 거리를 보존해요. 모든 두 점 사이가 같지는 않아요.", "중심점에서 향하는 방위를 보존해요. 정거 성질을 함께 가질 수도 있어요."][mode]}</p><p className="diagram-note">성질을 비교하기 위한 개념도이며 실제 세계지도의 투영 결과가 아닙니다.</p></>;
}

function InterpolationVisual() {
  const [position, setPosition] = useState(50);
  const [power, setPower] = useState(2);
  const a = 1 / position ** power;
  const b = 1 / (100 - position) ** power;
  const value = (20 * a + 30 * b) / (a + b);
  return <><div className="interpolation-stage"><div className="station"><span>A 관측소</span><strong>20°C</strong></div><div className="temperature-track"><div className="estimate-pin" style={{ left: `${position}%` }}><span>추정 위치</span><strong>{value.toFixed(2)}°C</strong><i/></div></div><div className="station"><span>B 관측소</span><strong>30°C</strong></div></div><label className="range-label" htmlFor="idw-position">추정할 위치 <strong>A에서 {position}%</strong></label><input id="idw-position" type="range" min="5" max="95" value={position} onChange={event => setPosition(Number(event.target.value))}/><Choices label="IDW 거리 지수" items={["거리 지수 p = 1", "거리 지수 p = 2"]} value={power - 1} onChange={index => setPower(index + 1)}/><p className="visual-answer" aria-live="polite">A의 영향 {(a / (a + b) * 100).toFixed(1)}% · B의 영향 {(b / (a + b) * 100).toFixed(1)}% → 추정 {value.toFixed(2)}°C</p><p className="diagram-note">두 관측점과 동일 직선 위의 위치를 가정한 IDW 학습 모형입니다. 실제 기온 자료가 아닙니다.</p></>;
}

function RelationVisual() {
  const [rows, setRows] = useState(3);
  const [extra, setExtra] = useState(false);
  return <><div className="relation-counts"><div><span>카디널리티 · 데이터 행</span><strong>{rows}</strong></div><div><span>차수 · 속성 열</span><strong>{extra ? 5 : 4}</strong></div></div><div className="table-scroll"><table className="relation-table"><caption className="sr-only">가상 필지 관리대장</caption><thead><tr>{["지번", "지목", "면적(m²)", "소유구분", ...(extra ? ["비고"] : [])].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{Array.from({ length: rows }, (_, index) => <tr key={index}><td>{101 + index}-1</td><td>{["전", "답", "과수원", "전", "답"][index]}</td><td>{[240, 380, 510, 420, 320][index]}</td><td>개인</td>{extra && <td>조사 대상</td>}</tr>)}</tbody></table></div><div className="visual-controls"><button onClick={() => setRows(Math.min(5, rows + 1))} disabled={rows === 5}>필지 한 행 추가</button><button onClick={() => setExtra(!extra)}>{extra ? "비고 열 제거" : "비고 열 추가"}</button><button onClick={() => { setRows(3); setExtra(false); }}><Icon name="refresh" size={16}/>초기화</button></div><p className="visual-answer" aria-live="polite">현재 {rows}개 필지 × {extra ? 5 : 4}개 항목. 헤더는 카디널리티에 포함하지 않아요.</p></>;
}

function OperatorVisual() {
  const [step, setStep] = useState(0);
  const state = [[1, 0, 0], [2, 1, 0], [1, 1, 1], [1, 1, 1]][step];
  const lines = ["int x = 1, y = 0, z = 0;", "y = x++;", "z = --x;", 'System.out.println(x + "," + y + "," + z);'];
  return <><div className="code-lab"><div className="code-lines" aria-label="Java 코드 실행 단계">{lines.map((line, index) => <div key={line} className={index === step ? "active-line" : ""}><span>{index + 1}</span><code>{line}</code></div>)}</div><div className="variable-boxes">{state.map((value, index) => <div key={index}><span>{["x", "y", "z"][index]}</span><strong>{value}</strong></div>)}</div></div><div className="visual-controls"><button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← 이전 줄</button><strong>{step + 1} / 4</strong><button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3}>다음 줄 실행 →</button><button onClick={() => setStep(0)} aria-label="코드 실행 초기화"><Icon name="refresh" size={16}/></button></div><p className="visual-answer" aria-live="polite">{["초기 상태: 세 변수의 값을 준비했어요.", "x++가 돌려준 1을 y에 저장해요. 이 문장이 끝나면 x는 2예요.", "--x가 x를 1로 줄인 뒤, 그 값 1을 z에 저장해요.", "출력 결과는 1,1,1입니다."][step]}</p></>;
}

function ResolutionVisual() {
  const [mode, setMode] = useState(0);
  return <><Choices items={["공간", "분광", "방사", "시간"]} value={mode} onChange={setMode} label="해상도 종류 선택"/><div className="resolution-demo">
    {mode === 0 && <div className="resolution-pair">{[4, 10].map(size => <div key={size}><div className="pixel-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>{Array.from({ length: size * size }, (_, i) => <i key={i} style={{ background: (i % size + Math.floor(i / size)) % 4 < 2 ? "#a8c59b" : "#547d59" }}/>)}</div><strong>{size === 4 ? "큰 픽셀 · 덜 세밀" : "작은 픽셀 · 더 세밀"}</strong></div>)}</div>}
    {mode === 1 && <div className="spectral-bars">{[3, 12].map(count => <div key={count}><div>{Array.from({ length: count }, (_, i) => <i key={i} style={{ background: `hsl(${250 - i * 240 / count} 45% 62%)` }}/>)}</div><strong>{count === 3 ? "넓은 파장 구간" : "좁게 나눈 파장 구간"}</strong></div>)}</div>}
    {mode === 2 && <div className="radiometric-bars">{[4, 16].map(count => <div key={count}><div>{Array.from({ length: count }, (_, i) => <i key={i} style={{ background: `hsl(100 8% ${14 + i * 82 / (count - 1)}%)` }}/>)}</div><strong>{count === 4 ? "2-bit = 4단계" : "4-bit = 16단계"}</strong></div>)}</div>}
    {mode === 3 && <div className="timeline-demo">{["1일 간격", "4일 간격"].map((label, row) => <div key={label}><strong>{label}</strong><div>{Array.from({ length: 8 }, (_, i) => <span key={i} className={row === 0 || i % 4 === 0 ? "observed" : ""}>{i + 1}</span>)}</div></div>)}</div>}
  </div><p className="visual-answer" aria-live="polite">{["같은 범위를 더 작은 픽셀로 나누면 작은 대상을 더 세밀하게 표현할 수 있어요.", "서로 가까운 파장대를 구별하는 능력이 분광 해상도예요.", "비트가 늘어나면 기록할 수 있는 신호 단계 수는 2ⁿ으로 늘어나요.", "같은 장소를 더 짧은 간격으로 관측할수록 변화 추적에 유리해요."][mode]}</p><p className="diagram-note">크기와 색은 차이를 설명하기 위한 개념 표현입니다.</p></>;
}

function ImageErrorVisual() {
  const [mode, setMode] = useState(0);
  const [corrected, setCorrected] = useState(false);
  return <><Choices items={["기하오차 · 위치", "방사오차 · 신호"]} value={mode} onChange={index => { setMode(index); setCorrected(false); }} label="영상오차 선택"/><div className="error-panels"><div><div className="image-grid"><div className="grid-features"/></div><strong>기준 영상</strong></div><Icon name="arrow"/><div><div className="image-grid"><div className={`grid-features ${!corrected ? mode === 0 ? "geometric-shift" : "radiometric-haze" : ""}`}/></div><strong>{corrected ? "보정 후 (개념)" : mode === 0 ? "위치와 모양의 변화" : "같은 위치, 다른 밝기"}</strong></div></div><div className="visual-controls"><button aria-pressed={corrected} onClick={() => setCorrected(!corrected)}>{corrected ? "오차 다시 보기" : "보정 전후 비교"}</button></div><p className="visual-answer" aria-live="polite">{mode === 0 ? "촬영 자세·지형 기복·센서 기하 → 위치가 어긋나요." : "대기·조명 조건·센서 응답 차이 → 신호 값이 달라져요."}</p><p className="diagram-note">위치와 밝기를 구분하는 개념 시연입니다. 실제 보정은 자료와 모델에 따라 달라집니다.</p></>;
}

function ModelingVisual() {
  const [generalized, setGeneralized] = useState(false);
  return <><div className="modeling-cards"><div><span className="mini-kicker">REAL WORLD</span><div className="field-tiles"><i>논</i><i>밭</i><i>과수원</i></div><strong>현실의 지형지물</strong></div><Icon name="arrow"/><div><span className="mini-kicker">GIS OBJECT</span><div className={`field-tiles ${generalized ? "generalized" : ""}`}>{generalized ? <i>농경지</i> : <><i>면 A</i><i>면 B</i><i>면 C</i></>}</div><strong>{generalized ? "상위 분류로 일반화" : "도형 + 속성으로 추상화"}</strong></div></div><div className="visual-controls"><button aria-pressed={generalized} onClick={() => setGeneralized(!generalized)}>{generalized ? "세부 객체로 돌아가기" : "상위 클래스로 묶어 보기"}</button></div><p className="visual-answer" aria-live="polite">{generalized ? "농지 대분류로 묶어 상세한 차이를 줄였어요. 일반화의 예입니다." : "현실에서 필요한 특징을 골라 도형과 속성으로 만들었어요."}</p></>;
}

function TopologyVisual() {
  const [simple, setSimple] = useState(false);
  return <><svg className="topology-demo" viewBox="0 0 500 225" role="img" aria-label="모양이 변해도 A B C의 연결을 유지하는 노선"><rect x="10" y="10" width="480" height="205" rx="16" fill="#eef3ea"/><path d={simple ? "M65 145H250L435 70" : "M65 145C90 160 105 50 150 91S210 170 250 115S365 38 435 70"} fill="none" stroke="#628d66" strokeWidth="7"/>{[[65,145],[250,simple ? 145 : 115],[435,70]].map(([x,y], index) => <g key={index}><circle cx={x} cy={y} r="13" fill="white" stroke="#477a52" strokeWidth="4"/><text x={x} y={y - 25} textAnchor="middle">{["A역", "B역", "C역"][index]}</text></g>)}</svg><div className="visual-controls"><button aria-pressed={simple} onClick={() => setSimple(!simple)}>{simple ? "굽은 노선으로 보기" : "노선 모양 단순화하기"}</button></div><p className="visual-answer">A → B → C. 모양과 거리는 바뀌어도 연결 순서는 같아요.</p></>;
}

function CoordinateVisual() {
  const [mode, setMode] = useState(0);
  return <><Choices items={["CRS 지정", "재투영", "화면상 재투영"]} value={mode} onChange={setMode} label="좌표 처리 방식 선택"/><div className="coordinate-demo"><div><span>원본 데이터</span><Icon name="map" size={43}/><strong>숫자 + 기준 A</strong></div><Icon name="arrow"/><div><span>{["이름표 확인", "좌표 계산", "표시할 때만 변환"][mode]}</span><Icon name="layers" size={43}/><strong>{["같은 숫자, 기준 지정", "새 숫자 + 기준 B", "원본은 그대로"][mode]}</strong></div></div><p className="visual-answer" aria-live="polite">{["원본 좌표계가 무엇인지 이미 알고 있을 때 올바른 이름표를 붙여요.", "위치는 유지하고, 다른 기준에서의 좌표값을 새로 계산해요.", "함께 보이도록 화면 좌표를 맞추지만 저장된 원본값은 바뀌지 않아요."][mode]}</p></>;
}

function ProcessVisual({ testing = false }: { testing?: boolean }) {
  const [step, setStep] = useState(0);
  const names = testing ? ["단위", "통합", "시스템", "인수"] : ["도출", "분석", "명세", "확인"];
  const titles = testing ? ["함수가 맞게 계산하나요?", "연결해도 잘 동작하나요?", "전체 서비스가 요구를 만족하나요?", "실제 업무에 사용할 수 있나요?"] : ["사용자의 이야기를 들어요", "요구를 정리하고 충돌을 풀어요", "검증 가능한 문장으로 써요", "목적에 맞게 썼는지 검토해요"];
  const examples = testing ? ["필지 면적 계산 함수의 결과 확인", "검색 API와 공간DB의 데이터 전달 확인", "주소 입력 → 검색 → 지도 표시의 전체 흐름 확인", "업무 담당자가 합의된 수용 기준 확인"] : ["담당자 인터뷰: 주소로 농지를 찾고 싶어요", "검색 범위·데이터·중복 요구·우선순위 확인", "주소 입력 시 해당 필지를 지도에 표시한다", "누락된 요구와 모호한 표현이 없는지 함께 검토"];
  return <><div className="process-selector" aria-label={testing ? "테스트 수준" : "요구사항 개발 단계"}>{names.map((name, index) => <button key={name} aria-pressed={step === index} onClick={() => setStep(index)}><span>0{index + 1}</span><strong>{name}</strong><Icon name={testing ? "check" : "quiz"} size={23}/></button>)}</div><div className="process-detail" aria-live="polite"><span>0{step + 1} / {names[step]}</span><h3>{titles[step]}</h3><p>{examples[step]}</p></div><p className="diagram-note">기초 개념을 이해하기 위한 순서입니다. 실제 프로젝트에서는 반복·병행할 수 있습니다.</p></>;
}

export function LessonVisual({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "projections": return <ProjectionVisual/>;
    case "coordinates": return <CoordinateVisual/>;
    case "modeling": return <ModelingVisual/>;
    case "topology": return <TopologyVisual/>;
    case "overlay": return <OverlayVisual/>;
    case "interpolation": return <InterpolationVisual/>;
    case "resolution": return <ResolutionVisual/>;
    case "image-errors": return <ImageErrorVisual/>;
    case "relation": return <RelationVisual/>;
    case "operators": return <OperatorVisual/>;
    case "requirements": return <ProcessVisual/>;
    case "testing": return <ProcessVisual testing/>;
  }
}
