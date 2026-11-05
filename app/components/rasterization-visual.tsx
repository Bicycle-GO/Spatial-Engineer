"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { rasterCellRules, type RasterCellRuleId } from "../data/rasterization";
import { Icon } from "./icons";

const colors = {
  forest: "#c9dfb5",
  field: "#f3deb0",
  road: "#a8c6d9",
  boundary: "#53684c",
  focus: "#a26521",
  text: "#294932",
};

/** Exact area proportions within one 100 × 100 drawing unit teaching cell. */
function RasterCellDiagram({ selected }: { selected?: RasterCellRuleId }) {
  const id = useId().replaceAll(":", "");
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const focusRoad = selected === "presence" || selected === "percent";

  return <svg className="rasterization-diagram" viewBox="0 0 390 365" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
    <title id={titleId}>산림·밭·도로가 함께 있는 100제곱미터 셀</title>
    <desc id={descriptionId}>한 변이 10미터인 정사각형입니다. 산림은 55제곱미터, 밭은 35제곱미터, 도로는 10제곱미터입니다. 셀 중심점은 밭 안에 있습니다. 산림 코드는 10, 밭은 20, 도로는 30입니다.</desc>
    <rect x="8" y="5" width="374" height="355" rx="14" fill="#fafcf7"/>
    <text x="192" y="25" textAnchor="middle" fontSize="17" fill="#53684c">한 변 10m</text>
    <g transform="translate(52 38) scale(2.8)">
      <polygon points="0,0 100,0 100,25 40,25 40,100 0,100" fill={colors.forest} stroke={colors.boundary} strokeWidth=".55"/>
      <rect x="40" y="25" width="60" height="58.33333333333333" fill={colors.field} stroke={colors.boundary} strokeWidth=".55"/>
      <rect x="40" y="83.33333333333333" width="60" height="16.66666666666667" fill={colors.road} stroke={colors.boundary} strokeWidth=".55"/>
      {selected === "dominant" && <polygon points="0,0 100,0 100,25 40,25 40,100 0,100" fill="none" stroke={colors.focus} strokeWidth="1.5"/>}
      {focusRoad && <rect x="40" y="83.33333333333333" width="60" height="16.66666666666667" fill="none" stroke={colors.focus} strokeWidth="1.5"/>}
      <rect width="100" height="100" fill="none" stroke={colors.boundary} strokeWidth=".8"/>
    </g>
    <g fill={colors.text} textAnchor="middle">
      <text x="192" y="67" fontSize="19" fontWeight="650">산림 · 코드 10</text>
      <text x="192" y="92" fontSize="17">55m² · 55%</text>
      <text x="250" y="230" fontSize="19" fontWeight="650">밭 · 코드 20</text>
      <text x="250" y="255" fontSize="17">35m² · 35%</text>
      <text x="250" y="291" fontSize="17" fontWeight="650">도로 · 코드 30</text>
      <text x="250" y="312" fontSize="16">10m² · 10%</text>
    </g>
    <path d="M199 178L218 155H300" fill="none" stroke={colors.focus} strokeWidth="1.6"/>
    {selected === "center" && <circle cx="192" cy="178" r="13" fill="none" stroke={colors.focus} strokeWidth="2" strokeDasharray="4 3"/>}
    <circle cx="192" cy="178" r="5.5" fill="#294932" stroke="white" strokeWidth="2"/>
    <text x="255" y="147" textAnchor="middle" fontSize="17" fontWeight="650" fill="#6c461c">셀 중심점 · 밭</text>
    <text x="192" y="347" textAnchor="middle" fontSize="17" fill="#53684c">전체 면적 100m² · 서로 겹치지 않음</text>
  </svg>;
}

export function RasterizationSolution() {
  return <section className="rasterization-solution" aria-label="래스터 셀 값 결정 방식의 그림 해설">
    <h3>같은 셀에서 네 가지 결과 비교</h3>
    <p>셀 중심은 밭 안에 있고, 존재 유무와 면적비율을 조사할 대상은 도로입니다.</p>
    <div className="rasterization-solution-grid">
      <figure className="rasterization-figure">
        <span className="rasterization-figure-label">입력 · 100m² 예제 셀</span>
        <RasterCellDiagram/>
        <figcaption>산림 55m² · 밭 35m² · 도로 10m²</figcaption>
      </figure>
      <div className="rasterization-result-table-wrap">
        <table className="rasterization-result-table">
          <caption>각 규칙으로 셀에 기록할 값</caption>
          <thead><tr><th scope="col">결정 방식</th><th scope="col">결과</th></tr></thead>
          <tbody>{rasterCellRules.map(rule => <tr key={rule.id}><th scope="row">{rule.name}</th><td>{rule.result}</td></tr>)}</tbody>
        </table>
        <p className="rasterization-key-point">도로 비율 10%와 산림 코드 10은 서로 다른 값입니다. 답안에는 대상과 코드·비율의 의미를 함께 적으세요.</p>
      </div>
    </div>
    <p className="rasterization-diagram-note">겹침·동률이 없는 학습용 도형입니다. 실제 변환에서는 셀 크기와 경계·동률·NoData 처리 규칙을 확인합니다.</p>
  </section>;
}

export function RasterizationVisual() {
  const [selected, setSelected] = useState<RasterCellRuleId>("presence");
  const titleId = useId();
  const active = rasterCellRules.find(rule => rule.id === selected) ?? rasterCellRules[0];

  return <div className="rasterization-explorer">
    <p className="rasterization-lead">같은 셀을 보며 규칙을 하나씩 바꿔 보세요. 무엇을 기록하려는지에 따라 결과가 달라집니다.</p>
    <div className="rasterization-rule-tabs" role="group" aria-label="셀 값 결정 규칙 선택">
      {rasterCellRules.map((rule, index) => <button type="button" key={rule.id} aria-pressed={selected === rule.id} onClick={() => setSelected(rule.id)}>
        <span>0{index + 1}</span><strong>{rule.name}</strong><small>{rule.english}</small>
      </button>)}
    </div>
    <section className="rasterization-rule-detail" aria-labelledby={titleId}>
      <span className="mini-kicker">판단 기준</span>
      <h3 id={titleId}>{active.question}</h3>
      <p>{active.description}</p>
    </section>
    <div className="rasterization-comparison">
      <figure className="rasterization-figure">
        <span className="rasterization-figure-label">입력 · 모든 규칙에서 같은 셀</span>
        <RasterCellDiagram selected={selected}/>
        <figcaption>대상의 면적과 위치를 그대로 두고 기록할 값을 바꿉니다.</figcaption>
      </figure>
      <section className="rasterization-result" aria-live="polite" aria-atomic="true">
        <span className="mini-kicker">{active.name}의 결과</span>
        <h4 className="rasterization-result-value">{active.result}</h4>
        <p>{active.reason}</p>
        {(selected === "presence" || selected === "percent") && <p className="rasterization-result-target">이 예시의 조사 대상은 도로입니다.</p>}
      </section>
    </div>
    <section className="rasterization-case">
      <span className="mini-kicker">실생활에서 쓰는 이유</span>
      <h4>{active.name}의 활용</h4>
      <p>{active.example}</p>
    </section>
    <p className="rasterization-key-point">코드는 종류를, 1·0은 정한 대상의 존재 유무를, %는 차지하는 비율을 나타냅니다. 숫자뿐 아니라 의미까지 비교해 보세요.</p>
    <p className="rasterization-diagram-note">겹침·동률이 없는 학습용 도형입니다. 네 가지 기본 코딩 규칙과 소프트웨어별 변환 옵션은 구분해 학습합니다.</p>
    <Link className="rasterization-practice-link button primary" href="/engineer/practice/practical/?chapter=practical-rasterization">네 가지 방식 실기 예상문제 풀기 <Icon name="arrow" size={17}/></Link>
  </div>;
}
