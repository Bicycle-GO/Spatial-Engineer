"use client";

import { useId, useState } from "react";

type ExampleMode = "point" | "rms";

function ResidualDiagram() {
  const diagramId = useId().replaceAll(":", "");
  const ticks = [99, 100, 101, 102, 103, 104, 105];
  const x = (coordinate: number) => 54 + (coordinate - 99) * 44;
  const y = (coordinate: number) => 314 - (coordinate - 99) * 44;

  return <svg className="residual-error-diagram" viewBox="0 0 460 380" role="img" aria-labelledby={`${diagramId}-title ${diagramId}-description`}>
    <title id={`${diagramId}-title`}>A점의 잔차: 가로 3 m, 세로 4 m, 거리 5 m</title>
    <desc id={`${diagramId}-description`}>한 칸이 1 m인 A점 주변 확대도입니다. 원형 기준점 A의 좌표는 100, 100이고 마름모 변환 결과 A 프라임은 103, 104입니다. 두 점을 잇는 선과 가로·세로 차이가 직각삼각형을 이룹니다.</desc>
    <rect x="4" y="4" width="452" height="372" rx="14" fill="#f7faf4"/>
    <text x="54" y="29" fontSize="16" fill="#405840">A점 주변 확대도 · 1칸 = 1 m</text>
    {ticks.map(tick => <g key={tick}>
      <line x1={x(tick)} y1="50" x2={x(tick)} y2="314" stroke="#d0dbca" strokeWidth="1"/>
      <line x1="54" y1={y(tick)} x2="318" y2={y(tick)} stroke="#d0dbca" strokeWidth="1"/>
      <text x={x(tick)} y="334" textAnchor="middle" fontSize="13" fill="#586351">{tick}</text>
      <text x="41" y={y(tick) + 5} textAnchor="end" fontSize="13" fill="#586351">{tick}</text>
    </g>)}
    <text x="350" y="334" fontSize="14" fill="#586351">x (m)</text>
    <text x="15" y="29" fontSize="13" fill="#586351">y (m)</text>
    <path d="M98 270H230V94" fill="none" stroke="#6c7568" strokeWidth="2" strokeDasharray="6 4"/>
    <path d="M218 270V258H230" fill="none" stroke="#6c7568" strokeWidth="1.5"/>
    <line x1="98" y1="270" x2="230" y2="94" stroke="#246755" strokeWidth="4"/>
    <circle cx="98" cy="270" r="7" fill="#246755" stroke="white" strokeWidth="2"/>
    <polygon points="230,84 240,94 230,104 220,94" fill="#a85128" stroke="white" strokeWidth="2"/>
    <text x="77" y="266" textAnchor="end" fontSize="17" fontWeight="700" fill="#246755">A</text>
    <text x="248" y="89" fontSize="17" fontWeight="700" fill="#a85128">A′</text>
    <rect x="112" y="166" width="51" height="25" rx="5" fill="#f7faf4"/>
    <text x="137" y="184" textAnchor="middle" fontSize="18" fontWeight="700" fill="#246755">5 m</text>
    <text x="164" y="295" textAnchor="middle" fontSize="17" fill="#47533f">Δx = 3 m</text>
    <text x="246" y="188" fontSize="17" fill="#47533f">Δy = 4 m</text>
    <circle cx="61" cy="358" r="6" fill="#246755"/>
    <text x="75" y="363" fontSize="15" fill="#405840">기준 좌표</text>
    <polygon points="230,350 238,358 230,366 222,358" fill="#a85128"/>
    <text x="245" y="363" fontSize="15" fill="#405840">변환 결과</text>
  </svg>;
}

function PointCalculation() {
  return <div className="residual-error-calculation">
    <span className="mini-kicker">한 점의 평면 잔차</span>
    <h3>A점의 차이는 5 m</h3>
    <p>기준 A(100, 100) → 변환 결과 A′(103, 104)<br/>좌표 단위: m</p>
    <p className="residual-error-formula">Δx = 103 − 100 = 3 m<br/>Δy = 104 − 100 = 4 m</p>
    <p className="residual-error-formula" aria-label="A점의 평면 잔차는 3의 제곱 더하기 4의 제곱의 제곱근, 5 미터입니다.">거리 = √(3² + 4²) = <strong>5 m</strong></p>
    <p>가로·세로 차이를 직각삼각형의 두 변으로 보면, 두 점 사이의 거리는 빗변입니다.</p>
    <p>여러 기준점의 RMS를 구하려면 다른 점의 잔차도 함께 집계해야 합니다.</p>
  </div>;
}

function RmsCalculation() {
  return <div className="residual-error-calculation">
    <span className="mini-kicker">두 점의 평면 RMS오차(RMSE)</span>
    <h3>5 m와 0 m를 함께 집계하면 3.54 m</h3>
    <p>각 점의 거리 제곱을 더하고, 점 개수로 나눈 뒤 제곱근을 구합니다.</p>
    <p className="residual-error-formula" aria-label="평면 RMS는 3의 제곱 더하기 4의 제곱, 그리고 0의 제곱 더하기 0의 제곱을 모두 더하고, 전체를 2로 나눈 값의 제곱근입니다.">RMS = √&#123;[(3² + 4²) + (0² + 0²)] ÷ 2&#125;</p>
    <p className="residual-error-formula">= √[(5² + 0²) ÷ 2]<br/>= √12.5 ≈ <strong>3.54 m</strong></p>
    <p>A점 하나의 5 m가 여러 기준점 전체의 RMS오차가 되지는 않습니다.</p>
  </div>;
}

function PointList() {
  return <div className="residual-error-point-list" aria-label="RMS 계산에 사용한 두 기준점">
    <section className="residual-error-point-card"><h4>A점 · 잔차 5 m</h4><p>기준 (100, 100)<br/>변환 결과 (103, 104)</p><p>Δx = 3 m · Δy = 4 m</p></section>
    <section className="residual-error-point-card"><h4>B점 · 잔차 0 m</h4><p>기준 (200, 200)<br/>변환 결과 (200, 200)</p><p>Δx = 0 m · Δy = 0 m</p></section>
  </div>;
}

function ExampleScope() {
  return <p className="residual-error-note">이미 계산된 변환 결과의 잔차를 집계하는 가상 예시입니다. 변환식 추정은 생략했습니다. 기준점의 RMS가 작아도 독립 검사점에서의 위치 정확도까지 보장되지는 않습니다.</p>;
}

export function ResidualErrorVisual() {
  const [mode, setMode] = useState<ExampleMode>("point");
  return <div className="residual-error-visual">
    <div className="residual-error-tabs" aria-label="잔차와 RMS 학습 예시 선택">
      <button type="button" aria-pressed={mode === "point"} onClick={() => setMode("point")}>점 하나의 차이</button>
      <button type="button" aria-pressed={mode === "rms"} onClick={() => setMode("rms")}>여러 점의 RMS</button>
    </div>
    <div className="residual-error-panel"><ResidualDiagram/>{mode === "point" ? <PointCalculation/> : <RmsCalculation/>}</div>
    {mode === "rms" && <PointList/>}
    <section className="residual-error-case"><span className="mini-kicker">도로 교차로에 적용하면</span><p>{mode === "point" ? "도면의 교차로를 기준 좌표와 맞춰 보니 동쪽으로 3 m, 북쪽으로 4 m 차이가 납니다. 이 교차로 한 점의 평면 잔차는 5 m입니다." : "교차로 A는 5 m 차이, 교차로 B는 차이가 없다면 두 점의 평면 RMS는 약 3.54 m입니다. 다른 교차로의 잔차도 집계에 포함하면 값이 달라질 수 있습니다."}</p></section>
    <ExampleScope/>
  </div>;
}

export function ResidualErrorSolution() {
  return <section className="residual-error-solution" aria-label="한 점의 잔차와 RMS오차 그림 해설">
    <h3>한 점의 잔차와 전체 RMS를 구분하세요</h3>
    <div className="residual-error-panel"><ResidualDiagram/><PointCalculation/></div>
    <RmsCalculation/>
    <PointList/>
    <ExampleScope/>
  </section>;
}
