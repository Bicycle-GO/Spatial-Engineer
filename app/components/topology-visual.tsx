"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { topologyRules, type TopologyFamily, type TopologyRuleId } from "../data/topology-rules";
import { Icon } from "./icons";

const colors = { point: "#2c7159", line: "#39769c", polygon: "#dce9d5", boundary: "#66845a", reference: "#bc873c", error: "#b34e40", second: "#8672a7" };
const families: { id: TopologyFamily; label: string; description: string }[] = [
  { id: "point", label: "포인트 레이어", description: "중복 위치와 선·면에 대한 점의 배치를 확인해요." },
  { id: "line", label: "라인 레이어", description: "선의 중복, 연결, 자기 교차와 불필요한 노드를 확인해요." },
  { id: "polygon", label: "폴리곤 레이어", description: "면의 겹침·빈틈과 경계·내부 객체의 관계를 확인해요." },
];

function Point({ x, y, label, error = false }: { x: number; y: number; label?: string; error?: boolean }) {
  return <g>{error && <circle cx={x} cy={y} r="17" fill="none" stroke={colors.error} strokeWidth="2" strokeDasharray="4 3"/>}<circle cx={x} cy={y} r="7" fill={error ? colors.error : colors.point} stroke="white" strokeWidth="2"/>{label && <text x={x} y={y - 23} textAnchor="middle" fill="#355440" fontSize="17" fontWeight="650">{label}</text>}</g>;
}

function ErrorRing({ x, y, radius = 19 }: { x: number; y: number; radius?: number }) {
  return <circle cx={x} cy={y} r={radius} fill="none" stroke={colors.error} strokeWidth="2" strokeDasharray="4 3"/>;
}

/** Schematic examples only; this component does not run a topology engine. */
export function TopologyDiagram({ ruleId, state }: { ruleId: TopologyRuleId; state: "invalid" | "valid" }) {
  const id = useId().replaceAll(":", "");
  const invalid = state === "invalid";
  const lineProps = { fill: "none", stroke: colors.line, strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const polygonProps = { fill: colors.polygon, stroke: colors.boundary, strokeWidth: 2.5, strokeLinejoin: "round" as const };
  let drawing: React.ReactNode;

  switch (ruleId) {
    case "point-disjoint":
      drawing = <><Point x={100} y={90} label={invalid ? "A · B" : "A"} error={invalid}/>{invalid && <circle cx="100" cy="90" r="11" fill="none" stroke={colors.point} strokeWidth="2"/>}<Point x={165} y={175} label="C"/></>;
      break;
    case "point-on-line":
      drawing = <><path d="M45 85H180L300 170" {...lineProps}/><Point x={100} y={85} label="A"/><Point x={240} y={invalid ? 90 : 127.5} label="B" error={invalid}/></>;
      break;
    case "point-on-endpoint":
      drawing = <><path d="M60 125H300" {...lineProps}/><path d="M300 116v18" stroke={colors.line} strokeWidth="3"/><Point x={60} y={125} label="A"/><Point x={invalid ? 180 : 300} y={125} label="B" error={invalid}/></>;
      break;
    case "point-inside":
      drawing = <><rect x="55" y="45" width="245" height="150" rx="3" {...polygonProps}/><Point x={140} y={85} label="A"/><Point x={invalid ? 55 : 100} y={150} label="B" error={invalid}/><Point x={245} y={145} label="C"/></>;
      break;
    case "line-no-overlap":
      drawing = <><path d="M45 105H235" {...lineProps}/><path d={invalid ? "M145 105H310" : "M235 105H310"} {...lineProps} stroke={colors.second} strokeDasharray="9 6"/>{invalid && <><path d="M145 105H235" stroke={colors.error} strokeWidth="18" opacity=".17"/><path d="M145 91v28M235 91v28" stroke={colors.error} strokeWidth="2"/></>}<text x="85" y="78" fontSize="17" fill={colors.line}>A</text><text x="285" y="78" fontSize="17" fill={colors.second}>B</text></>;
      break;
    case "line-no-dangles":
      drawing = <><path d="M70 50H290V190H70ZM70 125H290" {...lineProps}/><path d={invalid ? "M180 125V80" : "M180 125V50"} {...lineProps}/>{[[70,125],[290,125],[180,125]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="white" stroke={colors.line} strokeWidth="2"/>)}<Point x={180} y={invalid ? 80 : 50} error={invalid}/></>;
      break;
    case "line-no-self-intersect":
      drawing = <><path d={invalid ? "M65 65L295 185L295 65L65 185" : "M65 65H295V185H65"} {...lineProps}/><circle cx="65" cy="65" r="5" fill="white" stroke={colors.line} strokeWidth="2"/><circle cx="65" cy="185" r="5" fill="white" stroke={colors.line} strokeWidth="2"/>{invalid && <ErrorRing x={180} y={125} radius={22}/>}</>;
      break;
    case "line-no-pseudo-nodes":
      drawing = <><path d="M55 125H305" {...lineProps}/><circle cx="55" cy="125" r="5" fill="white" stroke={colors.line} strokeWidth="2"/><circle cx="305" cy="125" r="5" fill="white" stroke={colors.line} strokeWidth="2"/>{invalid ? <><circle cx="180" cy="125" r="7" fill="white" stroke={colors.error} strokeWidth="3"/><ErrorRing x={180} y={125}/><text x="115" y="95" fontSize="17" fill={colors.line}>A</text><text x="245" y="95" fontSize="17" fill={colors.line}>B</text></> : <text x="180" y="95" textAnchor="middle" fontSize="17" fill={colors.line}>A</text>}</>;
      break;
    case "polygon-no-overlap":
      drawing = invalid ? <><rect x="45" y="45" width="160" height="135" {...polygonProps}/><rect x="175" y="75" width="140" height="130" {...polygonProps} fill="#c8dfd6"/><rect x="175" y="75" width="30" height="105" fill={`url(#${id}-error)`} stroke={colors.error} strokeWidth="2"/><text x="100" y="120" fontSize="18" fill="#355440">A</text><text x="260" y="145" fontSize="18" fill="#355440">B</text></> : <><rect x="45" y="45" width="135" height="160" {...polygonProps}/><rect x="180" y="45" width="135" height="160" {...polygonProps} fill="#c8dfd6"/><text x="105" y="130" fontSize="18" fill="#355440">A</text><text x="250" y="130" fontSize="18" fill="#355440">B</text></>;
      break;
    case "polygon-no-gaps":
      drawing = <><rect x="37" y="37" width="286" height="176" rx="3" fill="none" stroke="#9eaa91" strokeDasharray="5 5"/>{invalid ? <><path d="M45 45H180V90H160V150H180V205H45Z" {...polygonProps}/><path d="M180 45H315V205H180V150H200V90H180Z" {...polygonProps} fill="#c8dfd6"/><rect x="160" y="90" width="40" height="60" fill={`url(#${id}-error)`} stroke={colors.error} strokeWidth="2" strokeDasharray="4 3"/></> : <><rect x="45" y="45" width="135" height="160" {...polygonProps}/><rect x="180" y="45" width="135" height="160" {...polygonProps} fill="#c8dfd6"/></>}<text x="98" y="130" fontSize="18" fill="#355440">A</text><text x="255" y="130" fontSize="18" fill="#355440">B</text></>;
      break;
    case "polygon-boundary-covered":
      drawing = <><rect x="70" y="45" width="220" height="155" fill={colors.polygon} stroke={colors.boundary} strokeWidth="9"/><path d={invalid ? "M70 45H145M215 45H290V200H70V45" : "M70 45H290V200H70Z"} fill="none" stroke={colors.reference} strokeWidth="4" strokeLinecap="round"/>{invalid && <path d="M145 45H215" stroke={colors.error} strokeWidth="4" strokeDasharray="6 5"/>}<text x="180" y="132" textAnchor="middle" fill="#355440" fontSize="18">A</text></>;
      break;
    case "polygon-one-point":
      drawing = <><rect x="45" y="45" width="135" height="160" {...polygonProps}/><rect x="180" y="45" width="135" height="160" {...polygonProps} fill="#c8dfd6"/><text x="60" y="72" fontSize="17" fill="#355440">A</text><text x="285" y="72" fontSize="17" fill="#355440">B</text>{invalid ? <><Point x={95} y={105} error/><Point x={132} y={157} error/><ErrorRing x={247} y={128} radius={27}/></> : <><Point x={112} y={125}/><Point x={247} y={125}/></>}</>;
      break;
  }

  return <svg className="topology-diagram" viewBox="0 0 360 240" role="img" aria-label={invalid ? "공간 객체 배치의 검사 대상 예시. 붉은 표시로 점검 위치를 강조했습니다." : "공간 객체 배치가 규칙을 충족하는 개념 예시."}>
    <defs><pattern id={`${id}-grid`} width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#edf1e8" strokeWidth="1"/></pattern><pattern id={`${id}-error`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#f6dfd8"/><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke={colors.error} strokeWidth="1.5"/></pattern></defs>
    <rect x="5" y="5" width="350" height="230" rx="13" fill="#fafcf7"/>
    <rect x="5" y="5" width="350" height="230" rx="13" fill={`url(#${id}-grid)`}/>
    {drawing}
  </svg>;
}

function DiagramLegend({ reference = false }: { reference?: boolean }) {
  return <div className="topology-legend" aria-label="개념도 범례"><span><i className="point"/>점 객체</span><span><i className="line"/>선 객체</span><span><i className="polygon"/>면 객체</span>{reference && <span><i className="reference"/>참조 라인</span>}<span><i className="error"/>검사 위치</span></div>;
}

export function TopologyQuestionDiagram({ ruleId }: { ruleId: TopologyRuleId }) {
  return <figure className="topology-question-figure"><TopologyDiagram ruleId={ruleId} state="invalid"/><DiagramLegend reference={ruleId === "polygon-boundary-covered"}/><figcaption>학습용 개념도 · 붉은 표시는 점검할 위치입니다. 적용할 규칙은 문제의 조건을 기준으로 판단하세요.</figcaption></figure>;
}

export function TopologySolutionDiagram({ ruleId }: { ruleId: TopologyRuleId }) {
  const rule = topologyRules.find(item => item.id === ruleId)!;
  return <section className="topology-solution" aria-label="위상 규칙의 도형 비교와 실생활 해설">
    <header className="topology-rule-summary"><span className="mini-kicker">RULE & EXAMPLE</span><h3>{rule.title}</h3><p>{rule.condition}</p><small>{rule.english}</small></header>
    <div className="topology-comparison"><figure className="topology-figure"><span className="topology-state-label invalid">규칙 위반 예시</span><TopologyDiagram ruleId={rule.id} state="invalid"/><figcaption className="topology-figure-caption">{rule.invalidLabel}</figcaption></figure><figure className="topology-figure"><span className="topology-state-label valid">규칙 충족 예시</span><TopologyDiagram ruleId={rule.id} state="valid"/><figcaption className="topology-figure-caption">{rule.validLabel}</figcaption></figure></div>
    <DiagramLegend reference={ruleId === "polygon-boundary-covered"}/>
    <div className="topology-case-grid"><section className="topology-case"><span className="mini-kicker">실생활 사례</span><p>{rule.example}</p></section><section className="topology-case exception"><span className="mini-kicker">예외와 적용 조건</span><p>{rule.exception}</p></section><section className="topology-case repair"><span className="mini-kicker">수정하고 다시 확인하기</span><p>{rule.repair}</p></section></div>
    <p className="topology-diagram-note">규칙을 설명하는 개념도입니다. 실제 오류 판정과 수정은 자료의 목적·원자료·허용오차를 함께 확인해 수행합니다.</p>
  </section>;
}

export function TopologyVisual() {
  const [family, setFamily] = useState<TopologyFamily>("point");
  const [selected, setSelected] = useState<TopologyRuleId>("point-disjoint");
  const selectId = useId();
  const currentFamily = families.find(item => item.id === family)!;
  const rules = topologyRules.filter(rule => rule.family === family);
  const current = rules.find(rule => rule.id === selected) ?? rules[0];
  function chooseFamily(next: TopologyFamily) {
    setFamily(next);
    setSelected(topologyRules.find(rule => rule.family === next)!.id);
  }
  return <div className="topology-explorer">
    <div className="topology-family-tabs" aria-label="위상 규칙의 레이어 종류">{families.map(item => <button type="button" key={item.id} aria-pressed={family === item.id} onClick={() => chooseFamily(item.id)}>{item.label}</button>)}</div>
    <p className="topology-family-description">{currentFamily.description}</p>
    <label className="topology-rule-select" htmlFor={selectId}>규칙 선택<select id={selectId} value={current.id} onChange={event => setSelected(event.target.value as TopologyRuleId)}>{rules.map(rule => <option key={rule.id} value={rule.id}>{rule.title}</option>)}</select></label>
    <TopologySolutionDiagram ruleId={current.id}/>
    <Link className="topology-practice-link button primary" href={`/engineer/practice/practical/?chapter=practical-topology&rule=${current.id}`}>이 규칙 실기 문제 풀기 <Icon name="arrow" size={18}/></Link>
  </div>;
}
