"use client";

import { useState } from "react";
import {
  technicianSecondBooleanA,
  technicianSecondBooleanB,
  technicianSecondMaxInput,
  technicianSecondMedianInput,
  technicianSecondMedianMeanInput,
  technicianSecondNearestSamples,
  technicianSecondNearestTargets,
  technicianSecondReclassInput,
  technicianSecondReclassRules,
} from "../data/technician-past-second";
import styles from "./technician-second-raster.module.css";

type CellPosition = { row: number; column: number };
type CellValue = number | string | null;
type CellMarks = { window?: boolean; maximum?: boolean; center?: boolean; source?: boolean; target?: boolean; category?: number };

function sameCell(a: CellPosition | undefined, row: number, column: number) {
  return a?.row === row && a.column === column;
}

function Grid({ rows, caption, selected, onSelect, marks, large = false, square = false, emptyLabel = "관측값이 주어지지 않음" }: {
  rows: CellValue[][];
  caption: string;
  selected?: CellPosition;
  onSelect?: (row: number, column: number) => void;
  marks?: (row: number, column: number) => CellMarks;
  large?: boolean;
  square?: boolean;
  emptyLabel?: string;
}) {
  return <div className={`${styles.gridScroll}${large ? ` ${styles.largeGrid}` : ""}${square ? ` ${styles.squareGrid}` : ""}`} tabIndex={0} role="region" aria-label={`${caption} 표. 가로로 넘겨 전체 열을 확인할 수 있습니다.`}>
    <table className={styles.grid}>
      <caption>{caption}</caption>
      <thead><tr><th scope="col" className={styles.corner}>행 / 열</th>{rows[0].map((_, column) => <th scope="col" key={column}>{column + 1}</th>)}</tr></thead>
      <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>
        <th scope="row">{rowIndex + 1}</th>
        {row.map((value, columnIndex) => {
          const mark = marks?.(rowIndex, columnIndex) ?? {};
          const selectedCell = sameCell(selected, rowIndex, columnIndex);
          const label = `${rowIndex + 1}행 ${columnIndex + 1}열: ${value === null ? emptyLabel : value}${mark.center ? ", 처리할 중앙 셀" : ""}${mark.window ? ", 선택한 3×3 창 안" : ""}${mark.maximum ? ", 창 안의 최댓값" : ""}${mark.source ? ", 가장 가까운 원자료" : ""}${mark.target ? ", 값을 구할 위치" : ""}`;
          return <td key={columnIndex} aria-label={onSelect ? undefined : label} data-selected={selectedCell || undefined} data-window={mark.window || undefined} data-maximum={mark.maximum || undefined} data-center={mark.center || undefined} data-source={mark.source || undefined} data-target={mark.target || undefined} data-category={mark.category}>
            {onSelect ? <button type="button" aria-label={label} aria-pressed={selectedCell} onClick={() => onSelect(rowIndex, columnIndex)}>{value ?? <span aria-hidden="true">·</span>}</button> : <span aria-hidden={value === null ? true : undefined}>{value ?? "·"}</span>}
          </td>;
        })}
      </tr>)}</tbody>
    </table>
  </div>;
}

function SortedValues({ values }: { values: number[] }) {
  return <div className={styles.sortedBlock}><h5>9개 값을 작은 순서대로 놓아요</h5><ol className={styles.sortedValues} aria-label="작은 순으로 정렬한 9개 값. 다섯 번째가 중앙값입니다.">{values.map((value, index) => <li key={index} data-middle={index === 4 || undefined}><small>{index + 1}번째</small><strong>{value}</strong>{index === 4 && <span>중앙값</span>}</li>)}</ol><p className={styles.note}>중앙값은 원래 가운데 칸의 숫자가 아니라, <strong>크기순으로 정렬한 뒤 가운데에 놓인 값</strong>입니다. 9개에서는 (9 + 1) ÷ 2 = 5번째를 고릅니다.</p></div>;
}

function MedianExample({ number, solution }: { number: 1 | 11; solution: boolean }) {
  const input = number === 1 ? technicianSecondMedianInput : technicianSecondMedianMeanInput;
  const values = input.flat().slice().sort((a, b) => a - b);
  const median = values[4];
  const sum = input.flat().reduce((total, value) => total + value, 0);
  return <section className={styles.block} aria-label={`${number}번의 3×3 필터 ${solution ? "풀이" : "입력"}`}>
    <div className={styles.inputAndTarget}>
      <Grid rows={input} caption="입력 영상 · 3×3" marks={(row, column) => ({ center: row === 1 && column === 1 })}/>
      <div className={styles.targetCard}><span className={styles.kicker}>계산할 위치</span><h4>2행 2열 · 중앙 셀</h4><p>테두리를 표시한 칸에 들어갈 새 값을 구합니다. <strong>중앙 셀을 포함한 3×3의 9개 값</strong>을 모두 사용하세요.</p>{solution && <div className={styles.resultNumbers}><p><span>중앙값 필터</span><strong>{median}</strong></p>{number === 11 && <p><span>평균 필터</span><strong>{sum / 9}</strong></p>}</div>}</div>
    </div>
    {solution && <>
      <SortedValues values={values}/>
      {number === 11 ? <section className={styles.meanBlock}><h5>평균은 아홉 값을 모두 더한 뒤 9로 나눠요</h5><div className={styles.rowSums}>{input.map((row, index) => <p key={index}><span>{index + 1}행</span><code>{row.join(" + ")} = {row.reduce((total, value) => total + value, 0)}</code></p>)}</div><p className={styles.equation}><span>270 + 340 + 380 = 990</span><strong>990 ÷ 9 = 110</strong></p><p className={styles.correction}>원문 평균 풀이에는 값 100 하나가 빠져 있습니다. 두 개의 100은 서로 다른 셀이므로 둘 다 더합니다. 일반적인 3×3 평균은 8개가 아니라 <strong>9개</strong>를 사용합니다.</p></section> : <p className={styles.correction}>이 입력의 중앙값은 <strong>201</strong>입니다. 원문의 답안에 제시된 100은 이 영상의 정렬 결과와 일치하지 않습니다.</p>}
      <p className={styles.note}>중앙값 필터는 밝기가 유난히 튀는 셀의 영향을 줄일 때 쓰입니다. 평균 필터는 주변 밝기를 고르게 하는 데 쓰이며, 두 계산의 기준을 구분해야 합니다.</p>
    </>}
  </section>;
}

const booleanOperations = [
  { id: "and", label: "AND", description: "A와 B가 모두 1일 때만 1", calculate: (a: number, b: number) => Number(a === 1 && b === 1) },
  { id: "or", label: "OR", description: "A와 B 중 하나 이상이 1이면 1", calculate: (a: number, b: number) => Number(a === 1 || b === 1) },
  { id: "xor", label: "XOR", description: "두 값이 서로 다를 때만 1", calculate: (a: number, b: number) => Number(a !== b) },
];

function BooleanExample({ solution }: { solution: boolean }) {
  const [selected, setSelected] = useState<CellPosition>({ row: 0, column: 0 });
  const a = technicianSecondBooleanA[selected.row][selected.column];
  const b = technicianSecondBooleanB[selected.row][selected.column];
  const selectCell = (row: number, column: number) => setSelected({ row, column });
  return <section className={styles.block} aria-label={`7번의 논리 연산 ${solution ? "풀이" : "입력 격자"}`}>
    <p className={styles.note}>같은 행·열에 있는 두 셀끼리 비교합니다. 이 문제에서는 1은 참, 0은 거짓이며 두 격자의 위치와 셀 크기가 같다고 봅니다.</p>
    <div className={styles.twoGrids}><Grid rows={technicianSecondBooleanA} caption="입력 격자 A" selected={solution ? selected : undefined} onSelect={solution ? selectCell : undefined}/><Grid rows={technicianSecondBooleanB} caption="입력 격자 B" selected={solution ? selected : undefined} onSelect={solution ? selectCell : undefined}/></div>
    {solution && <><h4>세 연산의 전체 결과</h4><div className={styles.threeGrids}>{booleanOperations.map(operation => <div className={styles.resultGridCard} key={operation.id}><Grid caption={`${operation.label} 결과`} selected={selected} rows={technicianSecondBooleanA.map((row, rowIndex) => row.map((value, columnIndex) => operation.calculate(value, technicianSecondBooleanB[rowIndex][columnIndex])))}/><p>{operation.description}</p></div>)}</div><div className={styles.cellComparison} aria-live="polite"><h5>{selected.row + 1}행 {selected.column + 1}열을 함께 보기</h5><p>입력 격자의 셀을 누르면 같은 위치가 함께 표시됩니다. 선택한 곳은 <strong>A={a}, B={b}</strong>입니다.</p><dl>{booleanOperations.map(operation => <div key={operation.id}><dt>{operation.label}</dt><dd>{operation.calculate(a, b)}</dd></div>)}</dl></div><p className={styles.note}>예를 들어 A를 침수 예상 구역, B를 대피소 이용권역으로 정하면 AND는 두 조건을 모두 만족하는 위치, XOR는 정확히 한 조건만 만족하는 위치를 나타낼 수 있습니다.</p></>}
  </section>;
}

function maximumWindow(row: number, column: number) {
  return technicianSecondMaxInput.slice(row, row + 3).flatMap(values => values.slice(column, column + 3));
}

const maximumOutput = Array.from({ length: 3 }, (_, row) => Array.from({ length: 3 }, (_, column) => Math.max(...maximumWindow(row, column))));

function MaximumExample({ solution }: { solution: boolean }) {
  const [step, setStep] = useState(0);
  const row = Math.floor(step / 3);
  const column = step % 3;
  const values = maximumWindow(row, column);
  const maximum = Math.max(...values);
  return <section className={styles.block} aria-label={`9번의 최대값 필터 ${solution ? "이동 과정" : "입력"}`}>
    <p className={styles.note}>3×3 창이 입력 안에 완전히 들어오는 위치만 계산합니다. 이 문항은 가장자리에 값을 덧붙이지 않는 방식이므로 5×5 입력에서 3×3 결과를 구합니다.</p>
    <div className={styles.windowLayout}>
      <Grid rows={technicianSecondMaxInput} caption="입력 래스터 · 5×5" marks={solution ? (r, c) => {
        const inWindow = r >= row && r < row + 3 && c >= column && c < column + 3;
        return { window: inWindow, maximum: inWindow && technicianSecondMaxInput[r][c] === maximum, center: r === row + 1 && c === column + 1 };
      } : undefined}/>
      {solution && <div><Grid rows={maximumOutput} caption="최댓값 결과 · 3×3" selected={{ row, column }} onSelect={(r, c) => setStep(r * 3 + c)}/><p className={styles.smallNote}>결과 셀을 누르면 그 값을 만든 입력 창을 볼 수 있어요.</p></div>}
    </div>
    {solution && <><div className={styles.legend}><span><i className={styles.windowSwatch} aria-hidden="true"/>지금 살펴보는 3×3 창</span><span><i className={styles.maxSwatch} aria-hidden="true"/>창 안의 최댓값</span></div><div className={styles.windowExplanation} aria-live="polite"><h4>{step + 1} / 9번째 창</h4><p>입력의 <strong>{row + 1}~{row + 3}행, {column + 1}~{column + 3}열</strong>에서 가장 큰 값을 찾습니다.</p><p className={styles.windowValues}>{values.join(", ")}</p><p className={styles.equation}><span>9개 값 중 최댓값</span><strong>{maximum}</strong></p><p>이 값은 결과의 <strong>{row + 1}행 {column + 1}열</strong>에 들어갑니다. 입력에서는 창 중앙인 {row + 2}행 {column + 2}열에 대응합니다.</p></div><div className={styles.controls}><button type="button" disabled={step === 0} onClick={() => setStep(previous => Math.max(0, previous - 1))}>이전 창</button><span>{step + 1} / 9</span><button type="button" disabled={step === 8} onClick={() => setStep(previous => Math.min(8, previous + 1))}>다음 창</button><button type="button" onClick={() => setStep(0)}>처음부터</button></div><p className={styles.note}>이웃 창은 일부 입력 셀을 함께 사용합니다. 실제 도구에서는 가장자리 처리 방식에 따라 출력 크기와 가장자리 값이 달라질 수 있습니다.</p></>}
  </section>;
}

function reclassify(value: number) {
  return technicianSecondReclassRules.find(rule => value >= rule.lower && value <= rule.upper)!;
}

function ReclassificationExample({ solution }: { solution: boolean }) {
  const [selected, setSelected] = useState<CellPosition>({ row: 0, column: 0 });
  const value = technicianSecondReclassInput[selected.row][selected.column];
  const rule = reclassify(value);
  const selectCell = (row: number, column: number) => setSelected({ row, column });
  return <section className={styles.block} aria-label={`17번의 8×8 재분류 ${solution ? "풀이" : "입력과 조건"}`}>
    <div className={styles.ruleBox}><table className={styles.ruleTable}><caption>재분류 조건 · 정수, 양 끝값 포함</caption><thead><tr><th scope="col">원래 값의 구간</th><th scope="col">바꿀 값</th></tr></thead><tbody>{technicianSecondReclassRules.map(item => <tr key={item.result} data-active={solution && item.result === rule.result || undefined}><td>{item.label}</td><td>{item.result}</td></tr>)}</tbody></table></div>
    <p className={styles.smallNote}>위에서 아래로 1~8행, 왼쪽에서 오른쪽으로 1~8열입니다. 작은 화면에서는 격자 안을 가로로 넘겨 전체 열을 확인하세요.</p>
    <div className={styles.reclassGrids}><Grid rows={technicianSecondReclassInput} caption="입력 격자 · 8×8" large selected={solution ? selected : undefined} onSelect={solution ? selectCell : undefined}/>{solution && <Grid rows={technicianSecondReclassInput.map(row => row.map(item => reclassify(item).result))} caption="최종 성과물 · 8×8" large selected={selected} onSelect={selectCell} marks={(row, column) => ({ category: reclassify(technicianSecondReclassInput[row][column]).result })}/>}</div>
    {solution && <><div className={styles.cellComparison} aria-live="polite"><h4>같은 위치에서 값만 바뀝니다</h4><p>선택 위치: <strong>{selected.row + 1}행 {selected.column + 1}열</strong></p><p className={styles.reclassEquation}><span>원래 값 <strong>{value}</strong></span><span aria-hidden="true">→</span><span>구간 <strong>{rule.label}</strong></span><span aria-hidden="true">→</span><span>새 값 <strong>{rule.result}</strong></span></p><p>입력 또는 결과 셀을 누르면 해당 값이 속하는 조건을 함께 확인할 수 있어요.</p></div><p className={styles.note}>경계값을 확인하세요. 5는 3, 6은 2로 바뀝니다. 20은 4, 21은 5, 26은 6입니다. 셀의 위치·개수는 그대로이며, 결과 배경색은 코드 구분용으로 값의 크기 순서를 뜻하지 않습니다.</p></>}
  </section>;
}

function nearestCandidates(row: number, column: number) {
  return technicianSecondNearestSamples.map(sample => ({ ...sample, squaredDistance: (sample.row - row) ** 2 + (sample.column - column) ** 2 })).sort((a, b) => a.squaredDistance - b.squaredDistance);
}

function NearestExample({ solution }: { solution: boolean }) {
  const [targetIndex, setTargetIndex] = useState(0);
  const target = technicianSecondNearestTargets[targetIndex];
  const candidates = nearestCandidates(target.row, target.column);
  const nearest = candidates[0];
  const rows: CellValue[][] = Array.from({ length: 7 }, () => Array<CellValue>(7).fill(null));
  technicianSecondNearestSamples.forEach(sample => { rows[sample.row - 1][sample.column - 1] = sample.value; });
  technicianSecondNearestTargets.forEach(item => { rows[item.row - 1][item.column - 1] = item.label; });
  const describeDistance = (squaredDistance: number) => Number.isInteger(Math.sqrt(squaredDistance)) ? String(Math.sqrt(squaredDistance)) : `√${squaredDistance}`;
  return <section className={styles.block} aria-label={`18번의 최근접 보간 ${solution ? "거리 비교 풀이" : "관측값과 계산 위치"}`}>
    <p className={styles.note}>숫자가 적힌 칸은 알려진 원자료이고, ①~③은 값을 구할 위치입니다. 빈칸에 관측값 0이 있다는 뜻은 아닙니다. 정사각 격자의 가로·세로 한 칸 간격을 같게 봅니다.</p>
    <Grid rows={rows} caption="원자료와 값을 구할 위치 · 7×7" large square marks={(row, column) => ({ target: technicianSecondNearestTargets.some(item => item.row === row + 1 && item.column === column + 1), source: solution && nearest.row === row + 1 && nearest.column === column + 1 })} selected={solution ? { row: target.row - 1, column: target.column - 1 } : undefined}/>
    {solution && <><div className={styles.targetChoices} role="group" aria-label="최근접 보간 풀이 위치 선택">{technicianSecondNearestTargets.map((item, index) => <button key={item.label} type="button" aria-pressed={targetIndex === index} onClick={() => setTargetIndex(index)}>{item.label} · {item.row}행 {item.column}열</button>)}</div><div className={styles.nearestExplanation} aria-live="polite"><h4>{target.label}에서 가장 가까운 원자료를 찾아요</h4><p>목표는 <strong>{target.row}행 {target.column}열</strong>입니다. 거리의 크기는 <code>행 차이² + 열 차이²</code>로 먼저 비교해도 됩니다.</p><div className={styles.distanceCards}>{candidates.slice(0, 2).map((item, index) => <article key={`${item.row}-${item.column}`} data-nearest={index === 0 || undefined}><span>{index === 0 ? "가장 가까운 원자료" : "거리 비교용 원자료"}</span><h5>값 {item.value}</h5><p>{item.row}행 {item.column}열</p><p>거리² = {Math.abs(item.row - target.row)}² + {Math.abs(item.column - target.column)}² = <strong>{item.squaredDistance}</strong></p><p>거리 = <strong>{describeDistance(item.squaredDistance)}칸</strong></p></article>)}</div><p className={styles.equation}><span>가장 가까운 곳의 값을 그대로 사용</span><strong>{target.label} = {nearest.value}</strong></p></div><div className={styles.answerSummary}><h5>세 위치의 보간 결과</h5><dl>{technicianSecondNearestTargets.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{nearestCandidates(item.row, item.column)[0].value}</dd></div>)}</dl></div><details className={styles.details}><summary>선택한 위치에서 모든 원자료까지의 거리 비교</summary><div className={styles.gridScroll} tabIndex={0} role="region" aria-label={`${target.label}의 거리 비교표`}><table className={styles.distanceTable}><caption>{target.label}에서 원자료까지 · 가까운 순서</caption><thead><tr><th scope="col">원자료 위치</th><th scope="col">값</th><th scope="col">거리²</th><th scope="col">거리</th></tr></thead><tbody>{candidates.map(item => <tr key={`${item.row}-${item.column}`}><th scope="row">{item.row}행 {item.column}열</th><td>{item.value}</td><td>{item.squaredDistance}</td><td>{describeDistance(item.squaredDistance)}</td></tr>)}</tbody></table></div></details><p className={styles.note}>거리 동률이 생기면 문제나 도구에서 정한 선택 기준을 확인해야 합니다. 이 세 위치는 각각 가장 가까운 원자료가 하나로 정해집니다. 새로 채운 값을 관측값처럼 추가하지 않고, 처음 주어진 원자료를 기준으로 계산합니다.</p></>}
  </section>;
}

export function TechnicianSecondRaster({ number, solution = false }: { number: number; solution?: boolean }) {
  if (number === 1 || number === 11) return <MedianExample key={number} number={number} solution={solution}/>;
  if (number === 7) return <BooleanExample solution={solution}/>;
  if (number === 9) return <MaximumExample solution={solution}/>;
  if (number === 17) return <ReclassificationExample solution={solution}/>;
  if (number === 18) return <NearestExample solution={solution}/>;
  return null;
}

