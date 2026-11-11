"use client";

import { useState } from "react";
import Link from "next/link";
import {
  classificationGroups,
  classificationMethods,
  classificationOverlap,
  classificationScope,
  classificationSse,
  classificationValues,
  type ClassificationMethod,
  type ClassificationMethodId,
} from "../data/data-classification";

const colors = ["#9db786", "#608557", "#2e5742"];

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function intervalLabel(method: ClassificationMethod, index: number): string {
  const lower = index === 0 ? classificationValues[0] : method.breaks[index - 1];
  const upper = index === 2 ? classificationValues[classificationValues.length - 1] : method.breaks[index];
  return `${formatNumber(lower)}% ${index === 0 ? "이상" : "초과"} ~ ${formatNumber(upper)}% 이하`;
}

function ClassificationPlot({ method }: { method: ClassificationMethod }) {
  const minimum = classificationValues[0];
  const maximum = classificationValues[classificationValues.length - 1];
  const x = (value: number) => 56 + ((value - minimum) / (maximum - minimum)) * 528;
  const edges = [minimum, ...method.breaks, maximum];
  const groups = classificationGroups(method);
  const accessibleDescription = `${method.title}로 같은 가상 비율 12개를 3등급으로 나눈 점도표. 경계는 ${method.breaks.map(formatNumber).join("%, ")}%. 등급별 개수는 ${groups.map(group => group.length).join(", ")}개입니다. ${method.id === "natural" ? "분포 관찰로 고른 교육용 경계이며 Jenks 실행 결과는 아닙니다." : ""}`;

  return <figure className="classification-figure">
    <div className="classification-plot-scroll" tabIndex={0} role="region" aria-label="데이터 분류 점도표. 좁은 화면에서는 가로로 이동할 수 있습니다.">
      <svg className="classification-plot" viewBox="0 0 640 225" role="img" aria-label={accessibleDescription}>
        <rect x="8" y="8" width="624" height="209" rx="16" fill="#f7f9f2" />
        {edges.slice(0, -1).map((edge, index) => <g key={index}>
          <rect x={x(edge)} y="70" width={x(edges[index + 1]) - x(edge)} height="83" fill={colors[index]} opacity=".17" />
          <text x={(x(edge) + x(edges[index + 1])) / 2} y="93" textAnchor="middle" fill="#29452f" fontSize="15" fontWeight="700">{index + 1}등급</text>
        </g>)}
        {method.breaks.map((boundary, index) => <g key={index}>
          <path d={`M${x(boundary)} 49V157`} stroke="#a26636" strokeWidth="2" strokeDasharray="5 4" />
          <path d={`M${x(boundary) - 5} 45H${x(boundary) + 5}L${x(boundary)} 51Z`} fill="#a26636" />
          <text x={x(boundary)} y="35" textAnchor="middle" fill="#855027" fontSize="16" fontWeight="700">{formatNumber(boundary)}%</text>
        </g>)}
        {classificationValues.map(value => {
          const foundIndex = method.breaks.findIndex(boundary => value <= boundary);
          const groupIndex = foundIndex === -1 ? 2 : foundIndex;
          return <g key={value}>
            <circle cx={x(value)} cy="115" r="7" fill={colors[groupIndex]} stroke="#254730" strokeWidth="1.5" />
            <text x={x(value)} y="141" textAnchor="middle" fill="#29452f" fontSize="16" fontWeight="650">{value}</text>
          </g>;
        })}
        <path d="M56 175H584" stroke="#80917a" strokeWidth="1.5" />
        {[0, 5, 10, 15, 20].map(tick => <g key={tick}>
          <path d={`M${x(tick)} 170V181`} stroke="#80917a" strokeWidth="1.5" />
          <text x={x(tick)} y="202" textAnchor="middle" fill="#5a6d53" fontSize="15">{tick}</text>
        </g>)}
        <text x="614" y="202" textAnchor="end" fill="#5a6d53" fontSize="15">%</text>
      </svg>
    </div>
    <figcaption>점 하나는 가상 지역 한 곳입니다. 가로 위치는 실제 값의 간격이며, 주황 점선은 등급 경계예요. 좁은 화면에서는 도표를 좌우로 움직여 전체를 확인하세요.</figcaption>
  </figure>;
}

function ClassificationLegend({ method }: { method: ClassificationMethod }) {
  const groups = classificationGroups(method);
  return <div className="classification-legend" aria-label={`${method.title} 범례`}>
    {groups.map((group, index) => <section className="classification-legend-item" key={index}>
      <div className="classification-legend-heading"><span className="classification-swatch" style={{ backgroundColor: colors[index] }} aria-hidden="true" /><strong>{index + 1}등급</strong><span className="classification-count">{group.length}개 지역</span></div>
      <p className="classification-range">{intervalLabel(method, index)}</p>
      <p className="classification-members">해당 값: {group.join(" · ")}%</p>
    </section>)}
    {method.id === "equal" && <p className="classification-rounding">경계 표시는 소수 둘째 자리로 반올림했습니다. 실제 계산은 20/3과 40/3을 사용하며, 반올림값으로 다시 분류하지 않습니다.</p>}
  </div>;
}

export function ClassificationVisual() {
  const [selected, setSelected] = useState<ClassificationMethodId>("equal");
  const current = classificationMethods.find(method => method.id === selected)!;
  const groups = classificationGroups(current);

  return <div className="classification-explorer">
    <div className="classification-scope"><strong>교재 명칭과 계산 기준부터 확인해요</strong><p>{classificationScope}</p></div>
    <div className="classification-options" aria-label="데이터 분류 방법 선택">{classificationMethods.map(method => <button type="button" key={method.id} onClick={() => setSelected(method.id)} aria-pressed={selected === method.id}>{method.title}</button>)}</div>
    <section className="classification-current" aria-live="polite" aria-atomic="false">
      <div className="classification-heading"><div><span className="mini-kicker">{current.english}</span><h3>{current.title}</h3></div><span className="classification-focus">{current.focus}</span></div>
      <p className="classification-intro">{current.description}</p>
      <p className="classification-dataset">같은 자료 · 가상 지역 12곳의 이용률(%) · 3등급 고정</p>
      {current.id === "natural" && <p className="classification-alert"><strong>관찰 경계의 예시입니다.</strong> 아래 경계는 하나의 학습 예시이며 GIS의 Natural Breaks(Jenks) 실행 결과가 아닙니다.</p>}
      <ClassificationPlot method={current} />
      <ClassificationLegend method={current} />
      <div className="classification-calculation"><strong>경계를 정한 이유</strong><p>{current.calculation}</p>{current.id === "optimal" && <p className="classification-score">이 예시의 SSE: <strong>{classificationSse(groups).toFixed(1)} (%p)²</strong><span>각 값과 소속 등급 평균의 차이를 제곱해 더한 값입니다.</span></p>}</div>
      <div className="classification-case-grid"><section className="classification-case"><h4>어디에 사용할까요?</h4><p>{current.example}</p></section><section className="classification-caution"><h4>이 점을 확인하세요</h4><p>{current.caution}</p></section></div>
      <details className="classification-steps"><summary>계산·판단 순서 보기</summary><ol>{current.steps.map(step => <li key={step}>{step}</li>)}</ol></details>
    </section>
    <p className="classification-overlap">{classificationOverlap}</p>
    <Link className="button primary classification-practice-link" href="/engineer/practice/practical/?chapter=practical-classification">실기 예상문제 풀기 <span aria-hidden="true">→</span></Link>
  </div>;
}

export function ClassificationSolution() {
  return <section className="classification-solution" aria-label="데이터 분류법 풀이 요약">
    <h3>어떤 기준으로 나누었는지 비교하세요</h3>
    <p>동일한 가상 이용률 12개를 3등급으로 나눈 결과입니다. 각 등급의 개수만으로 분류의 우열을 판단하지 않습니다.</p>
    <div className="table-scroll classification-summary-scroll"><table className="classification-summary-table"><caption>방법별 핵심 기준과 이 예시의 등급별 개수</caption><thead><tr><th scope="col">방법</th><th scope="col">핵심 기준</th><th scope="col">1·2·3등급 개수</th></tr></thead><tbody>{classificationMethods.map(method => <tr key={method.id}><th scope="row">{method.title}{method.id === "natural" && <span className="classification-table-note">분포 관찰 예시</span>}</th><td>{method.focus}</td><td>{classificationGroups(method).map(group => group.length).join(" · ")}개</td></tr>)}</tbody></table></div>
    <div className="classification-solution-points"><p><strong>등간격 ≠ 등개수</strong><br />같은 값의 폭과 같은 지역 수를 구분하세요. 범례의 경계 포함 조건도 답안에 적습니다.</p><p><strong>최대급간 ≠ SSE 최소</strong><br />이 표본의 최대급간 SSE는 82.5, SSE 최소 분할은 46.7(%p)²입니다. 같은 목표를 계산한 두 방법이 아닙니다.</p></div>
    <p className="classification-overlap">{classificationOverlap} 이 그림의 자연분류 관찰 예시는 최대급간과 같은 묶음이며, 이것이 모든 자료의 필연적인 관계라는 뜻은 아닙니다.</p>
    <p className="classification-scope-note">{classificationScope}</p>
  </section>;
}
