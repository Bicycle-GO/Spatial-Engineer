"use client";

import { useId, useState } from "react";
import styles from "./boolean-logic-guide.module.css";

type LogicRule = "or" | "and" | "xor" | "not-a" | "not-b";
type RegionId = "a-only" | "both" | "b-only" | "neither";

const rules: { id: LogicRule; label: string; formula: string; description: string; example: string }[] = [
  { id: "or", label: "OR", formula: "A ∪ B", description: "A 또는 B 중 하나 이상에 속하면 포함합니다. 두 영역에 모두 속하는 공통 부분도 포함해요.", example: "두 시설 A·B 중 적어도 한 곳의 서비스권역에 들어가는 지역을 찾습니다." },
  { id: "and", label: "AND", formula: "A ∩ B", description: "A와 B의 조건을 동시에 만족하는 공통 부분만 포함합니다.", example: "시설 A와 시설 B를 모두 이용할 수 있는 서비스권역의 공통 지역을 찾습니다." },
  { id: "xor", label: "XOR", formula: "(A \\ B) ∪ (B \\ A)", description: "A에만 속하거나 B에만 속하는 부분을 포함합니다. 두 곳에 모두 속하는 공통 부분은 제외해요.", example: "두 시설 중 정확히 한 곳의 서비스권역에만 들어가는 지역을 찾아 중복 서비스 지역과 구분합니다." },
  { id: "not-a", label: "NOT A", formula: "U \\ A", description: "전체 조사구역 U에서 A를 뺀 나머지입니다. B에 속하는지와 관계없이 A 바깥이면서 U 안인 곳을 포함합니다.", example: "U를 전체 조사구역, A를 홍수 위험권역으로 정하면 조사구역 안에서 그 위험권역을 제외한 곳을 찾습니다. 다른 위험까지 없다는 뜻은 아닙니다." },
  { id: "not-b", label: "NOT B", formula: "U \\ B", description: "전체 조사구역 U에서 B를 뺀 나머지입니다. A에 속하는지와 관계없이 B 바깥이면서 U 안인 곳을 포함합니다.", example: "U를 전체 사업 검토구역, B를 특정 규제권역으로 정하면 검토구역 안에서 그 규제권역을 제외한 곳을 찾습니다." },
];

const regions: { id: RegionId; label: string; a: boolean; b: boolean; point: [number, number] }[] = [
  { id: "a-only", label: "A에만 속함", a: true, b: false, point: [137, 150] },
  { id: "both", label: "A·B 공통", a: true, b: true, point: [260, 150] },
  { id: "b-only", label: "B에만 속함", a: false, b: true, point: [383, 150] },
  { id: "neither", label: "둘 다 아님", a: false, b: false, point: [92, 218] },
];

function included(rule: LogicRule, a: boolean, b: boolean): boolean {
  if (rule === "or") return a || b;
  if (rule === "and") return a && b;
  if (rule === "xor") return a !== b;
  if (rule === "not-a") return !a;
  return !b;
}

export function BooleanLogicGuide() {
  const [ruleId, setRuleId] = useState<LogicRule>("xor");
  const [regionId, setRegionId] = useState<RegionId>("both");
  const [largeUniverse, setLargeUniverse] = useState(true);
  const id = useId().replaceAll(":", "");
  const titleId = `boolean-guide-title-${id}`;
  const aClipId = `boolean-guide-a-${id}`;
  const universeClipId = `boolean-guide-u-${id}`;
  const resultMaskId = `boolean-guide-mask-${id}`;
  const rule = rules.find(item => item.id === ruleId)!;
  const region = regions.find(item => item.id === regionId)!;
  const isIncluded = included(ruleId, region.a, region.b);
  const diagramDescription = `${rule.label} 도형. ${rule.description} 점 P는 ${region.label}인 위치이며 이 연산의 결과에 ${isIncluded ? "포함됩니다" : "포함되지 않습니다"}. U 바깥은 계산 대상이 아닙니다.`;
  const universe = largeUniverse ? { x: 20, y: 30, width: 480, height: 240 } : { x: 70, y: 55, width: 380, height: 190 };
  const aCircle = <circle cx="200" cy="150" r="95" />;

  return <section className={styles.guide} aria-label="논리 연산과 전체 범위의 상세 도형 풀이">
    <header className={styles.header}><span className={styles.kicker}>OR · AND · XOR · NOT</span><h4>공통 부분과 ‘전체 범위’를 함께 보세요</h4><p>연두색이 결과에 포함되는 곳입니다. 테두리 A·B는 입력 영역이고, 사각형 U는 계산 대상으로 정한 전체 조사구역이에요.</p></header>
    <div className={styles.ruleOptions} aria-label="논리 연산 선택">{rules.map(item => <button type="button" key={item.id} aria-pressed={ruleId === item.id} onClick={() => setRuleId(item.id)}>{item.label}</button>)}</div>
    <div className={styles.ruleIntro} aria-live="polite"><h5>{rule.label} <code>{rule.formula}</code></h5><p>{rule.description}</p></div>
    <div className={styles.workspace}>
      <div className={styles.figurePanel}>
        <figure className={styles.figure}><svg viewBox="0 0 520 305" className={styles.diagram} role="img" aria-labelledby={titleId}>
          <title id={titleId}>{diagramDescription}</title>
          <defs>
            <clipPath id={aClipId}>{aCircle}</clipPath>
            <clipPath id={universeClipId}><rect {...universe} rx="10" /></clipPath>
            <mask id={resultMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width="520" height="305">
              <rect width="520" height="305" fill="black" />
              {ruleId === "not-a" || ruleId === "not-b" ? <><rect {...universe} fill="white" />{ruleId === "not-a" ? <circle cx="200" cy="150" r="95" fill="black" /> : <circle cx="320" cy="150" r="95" fill="black" />}</> : ruleId === "and" ? <circle cx="320" cy="150" r="95" fill="white" clipPath={`url(#${aClipId})`} /> : <><circle cx="200" cy="150" r="95" fill="white" /><circle cx="320" cy="150" r="95" fill="white" />{ruleId === "xor" && <circle cx="320" cy="150" r="95" fill="black" clipPath={`url(#${aClipId})`} />}</>}
            </mask>
          </defs>
          <rect x="5" y="8" width="510" height="285" rx="16" fill="#edf0e8" />
          {!largeUniverse && <rect x="20" y="30" width="480" height="240" rx="10" fill="none" stroke="#b6c0ad" strokeDasharray="5 5" />}
          <rect {...universe} rx="10" fill="#fffef9" />
          <rect {...universe} fill="#b9d69f" mask={`url(#${resultMaskId})`} clipPath={`url(#${universeClipId})`} />
          <g clipPath={`url(#${universeClipId})`}><circle cx="200" cy="150" r="95" fill="none" stroke="#3c718b" strokeWidth="3" /><circle cx="320" cy="150" r="95" fill="none" stroke="#81638f" strokeWidth="3" /></g>
          <rect {...universe} rx="10" fill="none" stroke="#526447" strokeWidth="2.5" />
          <text x={universe.x + 13} y={universe.y + 24} fontSize="20" fontWeight="700" fill="#405536">U</text>
          <text x="170" y="138" fontSize="22" fontWeight="700" fill="#2e627a">A</text><text x="347" y="138" fontSize="22" fontWeight="700" fill="#725282">B</text>
          <circle cx={region.point[0]} cy={region.point[1]} r="7" fill="#fffef9" stroke={isIncluded ? "#315738" : "#a76746"} strokeWidth="3" /><text x={region.point[0] + 12} y={region.point[1] - 9} fontSize="19" fontWeight="750" fill="#354a35">P</text>
        </svg><figcaption>U 바깥은 연산 결과에 포함하지 않습니다.</figcaption></figure>
        <div className={styles.legend}><span><i className={styles.includedSwatch} aria-hidden="true" />결과에 포함</span><span><i className={styles.excludedSwatch} aria-hidden="true" />U 안에서 제외</span></div>
        <div className={styles.universeControl}><strong>전체 조사구역 U 바꾸기</strong><div><button type="button" aria-pressed={largeUniverse} onClick={() => setLargeUniverse(true)}>넓은 U</button><button type="button" aria-pressed={!largeUniverse} onClick={() => setLargeUniverse(false)}>좁은 U</button></div><p>A와 B의 위치는 그대로입니다. NOT에서는 U를 넓힐 때 새로 들어온 바깥 부분도 결과에 더해져요.</p></div>
      </div>
      <div className={styles.tablePanel}><table className={styles.truthTable}><caption>U 안의 위치를 선택해 점 P를 옮겨 보세요</caption><thead><tr><th scope="col">위치</th><th scope="col">A</th><th scope="col">B</th><th scope="col">{rule.label} 결과</th></tr></thead><tbody>{regions.map(item => <tr key={item.id} className={regionId === item.id ? styles.activeRow : undefined}><th scope="row"><button type="button" aria-pressed={regionId === item.id} onClick={() => setRegionId(item.id)}>{item.label}</button></th><td>{item.a ? "참" : "거짓"}</td><td>{item.b ? "참" : "거짓"}</td><td className={included(ruleId, item.a, item.b) ? styles.includedText : styles.excludedText}>{included(ruleId, item.a, item.b) ? "포함" : "제외"}</td></tr>)}</tbody></table><p className={styles.selection} aria-live="polite">점 P: <strong>{region.label}</strong> → <strong>{isIncluded ? "결과에 포함" : "결과에서 제외"}</strong></p><p className={styles.tableNote}>‘둘 다 아님’도 U 안의 위치입니다. NOT A와 NOT B에서는 이 부분이 포함됩니다.</p></div>
    </div>
    <section className={styles.case}><h5>GIS에서는 이렇게 읽어요</h5><p>{rule.example}</p></section>
    <div className={styles.takeaways}><p><strong>XOR의 핵심</strong><br />한쪽에만 해당하는 두 부분을 합칩니다. 공통 부분과 두 조건 모두 아닌 부분은 제외합니다.</p><p><strong>NOT의 핵심</strong><br />무엇을 뺄지와 함께 전체 U를 정해야 합니다. NOT A는 B 안쪽에 한정되지 않으며, U가 달라지면 결과도 달라질 수 있습니다.</p></div>
  </section>;
}
