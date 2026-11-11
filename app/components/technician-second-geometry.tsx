import { useId, type ReactNode } from "react";
import styles from "./technician-second-geometry.module.css";

type Props = { number: number; solution?: boolean };
type Point = [number, number];
type OverlayMode = "union" | "intersect" | "identity";

function Diagram({ label, children, viewBox = "0 0 320 220" }: { label: string; children: ReactNode; viewBox?: string }) {
  const titleId = useId();
  return <svg className={styles.diagram} viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{label}</title>{children}</svg>;
}

function DigitizingErrors() {
  return <section className={styles.guide} aria-label="문제 5의 디지타이징 오류 도형 풀이"><h4>목표 교차점에서 선이 어디까지 왔나요?</h4><div className={styles.twoColumns}>{(["overshoot", "undershoot"] as const).map(kind => <article className={styles.card} key={kind}><h5>{kind === "overshoot" ? "오버슈트 · Overshoot" : "언더슈트 · Undershoot"}</h5><Diagram label={kind === "overshoot" ? "오버슈트 오류와 수정 비교. 입력 선이 목표 교차점을 지나친 부분을 잘라 교차점에서 끝냅니다." : "언더슈트 오류와 수정 비교. 입력 선의 끝이 목표 교차점에 미치지 못한 간격을 연결합니다."} viewBox="0 0 360 225">
    <rect x="8" y="8" width="344" height="205" rx="13" fill="#f5f8ef" />
    <text x="90" y="38" textAnchor="middle" fill="#9a6149" fontSize="18" fontWeight="700">오류</text><text x="270" y="38" textAnchor="middle" fill="#52743f" fontSize="18" fontWeight="700">수정 후</text>
    {[0, 180].map(offset => <path key={offset} d={`M${offset + 28} 124H${offset + 152}`} stroke="#547f91" strokeWidth="4" />)}
    <path d={`M90 62V${kind === "overshoot" ? 124 : 101}`} stroke="#678950" strokeWidth="4" />
    {kind === "overshoot" ? <path d="M90 124V174" stroke="#b26b51" strokeWidth="5" /> : <path d="M90 101V124" stroke="#b26b51" strokeWidth="4" strokeDasharray="5 4" />}
    <path d="M270 62V124" stroke="#678950" strokeWidth="4" /><circle cx="90" cy="124" r="6" fill="#fffdf7" stroke="#547f91" strokeWidth="2" /><circle cx="270" cy="124" r="6" fill="#52723e" />
    <text x="180" y="130" textAnchor="middle" fill="#869773" fontSize="23">→</text>
  </Diagram><p>{kind === "overshoot" ? "연결하려던 교차점을 지나 선이 더 뻗어 있습니다. 남은 짧은 부분을 확인해 다듬습니다." : "연결하려던 교차점까지 선이 닿지 않아 틈이 남았습니다. 정확한 목표에 맞춰 끝점을 연결합니다."}</p></article>)}</div><p className={styles.note}>디지타이징은 도형을 좌표와 정점으로 입력하는 작업입니다. 모든 돌출선이나 열린 끝점이 오류인 것은 아니므로 실제 도로·관망의 연결 의도와 기준 자료를 함께 확인합니다.</p></section>;
}

// Q6 재구성: 원의 좌우 끝은 4분할 사각형의 좌우 변 중점과 일치합니다.
// 대각선은 중심 및 원·사각형의 서로 반대인 위/아래 교차점을 지납니다.
const radius = 104;
const halfHeight = 72;
const crossX = Math.sqrt(radius ** 2 - halfHeight ** 2);
const alpha = Math.asin(halfHeight / radius);
const tau = Math.PI * 2;
const angles = [...Array.from({ length: 360 }, (_, index) => index * tau / 360), alpha, Math.PI - alpha, Math.PI + alpha, tau - alpha, tau].sort((a, b) => a - b).filter((value, index, items) => index === 0 || value - items[index - 1] > 1e-10);
const circlePoints: Point[] = angles.filter(angle => angle < tau - 1e-10).map(angle => [radius * Math.cos(angle), radius * Math.sin(angle)]);

function arc(start: number, end: number): Point[] {
  const selected = angles.filter(angle => angle >= Math.min(start, end) - 1e-10 && angle <= Math.max(start, end) + 1e-10);
  if (end < start) selected.reverse();
  return selected.map(angle => [radius * Math.cos(angle), radius * Math.sin(angle)]);
}

function clipHalfPlane(polygon: Point[], nx: number, ny: number, limit: number): Point[] {
  const result: Point[] = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    const currentDistance = nx * current[0] + ny * current[1] - limit;
    const previousDistance = nx * previous[0] + ny * previous[1] - limit;
    const inside = currentDistance <= 1e-8;
    const previousInside = previousDistance <= 1e-8;
    if (inside !== previousInside) {
      const fraction = previousDistance / (previousDistance - currentDistance);
      result.push([previous[0] + (current[0] - previous[0]) * fraction, previous[1] + (current[1] - previous[1]) * fraction]);
    }
    if (inside) result.push(current);
  }
  return result;
}

function clipRectangle(polygon: Point[], left: number, top: number, right: number, bottom: number): Point[] {
  return clipHalfPlane(clipHalfPlane(clipHalfPlane(clipHalfPlane(polygon, 1, 0, right), -1, 0, -left), 0, 1, bottom), 0, -1, -top);
}

type OverlayPiece = { union: number; intersect?: number; identity?: number; polygon: Point[]; label: Point };
const upperHalf = clipHalfPlane(circlePoints, halfHeight, crossX, 0);
const lowerHalf = clipHalfPlane(circlePoints, -halfHeight, -crossX, 0);
const pieces: OverlayPiece[] = [
  { union: 2, polygon: clipHalfPlane(circlePoints, 0, 1, -halfHeight), label: [0, -91] },
  { union: 3, identity: 2, polygon: [[-radius, -halfHeight], ...arc(Math.PI + alpha, Math.PI)], label: [-94, -62] },
  { union: 4, intersect: 2, identity: 3, polygon: clipRectangle(circlePoints, -radius, -halfHeight, 0, 0), label: [-47, -31] },
  { union: 5, intersect: 3, identity: 4, polygon: clipRectangle(upperHalf, 0, -halfHeight, radius, 0), label: [18, -52] },
  { union: 6, intersect: 4, identity: 5, polygon: clipRectangle(lowerHalf, 0, -halfHeight, radius, 0), label: [64, -22] },
  { union: 7, identity: 6, polygon: [[radius, -halfHeight], ...arc(tau, tau - alpha)], label: [94, -62] },
  { union: 8, identity: 7, polygon: [[-radius, halfHeight], ...arc(Math.PI, Math.PI - alpha)], label: [-94, 62] },
  { union: 9, intersect: 5, identity: 8, polygon: clipRectangle(upperHalf, -radius, 0, 0, halfHeight), label: [-64, 22] },
  { union: 10, intersect: 6, identity: 9, polygon: clipRectangle(lowerHalf, -radius, 0, 0, halfHeight), label: [-18, 52] },
  { union: 11, intersect: 7, identity: 10, polygon: clipRectangle(circlePoints, 0, 0, radius, halfHeight), label: [47, 31] },
  { union: 12, identity: 11, polygon: [[radius, halfHeight], ...arc(alpha, 0)], label: [94, 62] },
  { union: 13, polygon: clipHalfPlane(circlePoints, 0, -1, -halfHeight), label: [0, 94] },
];
const pieceColors = ["#dceacd", "#d6e6ed", "#eee4cc", "#e5ddef", "#cce4d8", "#e9ddce"];
const overlayModes: { id: OverlayMode; label: string; description: string }[] = [
  { id: "union", label: "Union · 결합", description: "사각형 또는 원에 속하는 모든 부분을 남기고, 두 레이어의 경계로 나눕니다." },
  { id: "intersect", label: "Intersect · 교차", description: "사각형과 원이 겹치는 부분만 남깁니다. 원의 위·아래 돌출부는 잘려 나갑니다." },
  { id: "identity", label: "Identity · 기준 입력 유지", description: "첫 입력인 사각형 범위를 유지하고, 원과 겹친 부분에 상대 경계와 속성을 반영합니다." },
];

function pathFor(polygon: Point[]): string {
  return polygon.map(([x, y], index) => `${index === 0 ? "M" : "L"}${(160 + x).toFixed(3)},${(155 + y).toFixed(3)}`).join(" ") + " Z";
}

function DiagramNumber({ value, x, y }: { value: number; x: number; y: number }) {
  return <text x={x} y={y} dy=".35em" textAnchor="middle" fill="#354836" stroke="#fffef7" strokeWidth="3.5" paintOrder="stroke" fontSize="17" fontWeight="750">{value}</text>;
}

function OverlayInput({ kind }: { kind: "first" | "second" | "combined" }) {
  const id = useId().replaceAll(":", "");
  const circleId = `second-input-circle-${id}`;
  const label = kind === "first" ? "첫 입력 레이어. 사각형은 네 부분으로 나뉘며 바깥 도면 배경 번호는 1입니다." : kind === "second" ? "둘째 레이어. 원을 중심을 지나는 대각선으로 두 부분으로 나눕니다. 바깥 도면 배경 번호는 1입니다." : "두 레이어의 위치 비교. 원과 사각형의 중심이 같고 원의 위아래가 사각형 밖으로 나옵니다.";
  return <Diagram label={label} viewBox="0 0 320 310"><defs><clipPath id={circleId}><circle cx="160" cy="155" r={radius} /></clipPath></defs><rect x="12" y="25" width="296" height="260" fill="#f0f2ec" stroke="#a7b39c" />
    {kind !== "second" && <><rect x={160-radius} y={155-halfHeight} width={2*radius} height={2*halfHeight} fill={kind === "first" ? "#e3edda" : "none"} stroke="#526b45" strokeWidth="2" /><path d={`M160 ${155-halfHeight}V${155+halfHeight}M${160-radius} 155H${160+radius}`} fill="none" stroke="#526b45" strokeWidth="2" /></>}
    {kind !== "first" && <><circle cx="160" cy="155" r={radius} fill={kind === "second" ? "#dce9ee" : "none"} stroke="#547487" strokeWidth="2" /><path d={`M${160-crossX} ${155+halfHeight}L${160+crossX} ${155-halfHeight}`} stroke="#547487" strokeWidth="2" clipPath={`url(#${circleId})`} /></>}
    {kind === "first" ? <><DiagramNumber value={1} x={29} y={48} />{[[2,-47,-34],[3,47,-34],[4,-47,34],[5,47,34]].map(([value,x,y]) => <DiagramNumber key={value} value={value} x={160+x} y={155+y} />)}</> : kind === "second" ? <><DiagramNumber value={1} x={29} y={48} /><DiagramNumber value={2} x={130} y={119} /><DiagramNumber value={3} x={190} y={191} /></> : null}
    {kind !== "second" && [-1,0,1].flatMap(row => [-1,0,1].map(column => <circle key={`${row}-${column}`} cx={160+column*radius} cy={155+row*halfHeight} r="3.8" fill="#5b6797" />))}
  </Diagram>;
}

function OverlayResult({ mode }: { mode: OverlayMode }) {
  const selected = pieces.filter(piece => piece[mode] !== undefined);
  const nodes: Point[] = [[-radius,-halfHeight],[radius,-halfHeight],[-radius,halfHeight],[radius,halfHeight],[-radius,0],[radius,0],[0,-halfHeight],[0,halfHeight],[0,0],[-crossX,-halfHeight],[crossX,-halfHeight],[-crossX,halfHeight],[crossX,halfHeight]];
  const title = overlayModes.find(item => item.id === mode)!.label;
  return <Diagram label={`${title} 재구성 도면. 실제 포함 조각 ${selected.length}개와 도식 배경 1개를 구분합니다. 배경을 포함한 첨부 번호 기준은 ${selected.length+1}개입니다.`} viewBox="0 0 320 310"><rect x="12" y="25" width="296" height="260" fill="#eef0e9" stroke="#a7b39c" />
    {selected.map(piece => <path key={piece.union} d={pathFor(piece.polygon)} fill={pieceColors[(piece.union-2)%pieceColors.length]} stroke="#677a56" strokeWidth="1.5" strokeLinejoin="round" />)}
    <DiagramNumber value={1} x={29} y={48} />
    {selected.map(piece => <DiagramNumber key={piece.union} value={piece[mode]!} x={160+piece.label[0]} y={155+piece.label[1]} />)}
    {nodes.filter(([x,y]) => mode !== "intersect" || x*x+y*y <= radius*radius+1e-6).map(([x,y], index) => <circle key={index} cx={160+x} cy={155+y} r="3.5" fill="#5b6797" />)}
  </Diagram>;
}

function OverlayCounting({ solution }: { solution: boolean }) {
  return <section className={styles.guide} aria-label="문제 6의 중첩 도면 자료"><div className={styles.countCondition}><strong>이 복습 문항의 집계 조건</strong><p>첨부 도면처럼 바깥 배경도 1번 영역으로 세는 ‘도면 번호’ 기준으로 답합니다. 배경을 실제 피처로 보지 않는 GIS 출력 조각 수와 구분하세요.</p></div><div className={styles.inputGrid}>{[{kind:"first" as const,title:"첫 입력 · 네 부분 사각형"},{kind:"second" as const,title:"둘째 입력 · 두 부분 원"},{kind:"combined" as const,title:"두 도형의 위치 비교"}].map(item => <figure className={styles.card} key={item.kind}><OverlayInput kind={item.kind} /><figcaption>{item.title}</figcaption></figure>)}</div>
    {!solution ? <div className={styles.blankCounts}><span>Union: (　)개</span><span>Intersect: (　)개</span><span>Identity: (　)개</span></div> : <><div className={styles.resultGrid}>{overlayModes.map(item => { const count=pieces.filter(piece=>piece[item.id]!==undefined).length;return <article className={styles.card} key={item.id}><h5>{item.label}</h5><OverlayResult mode={item.id} /><p className={styles.countLine}>첨부 번호 기준 <strong>{count+1}개</strong><span>포함 조각 {count}개 + 도식 배경 1개</span></p><p>{item.description}</p></article>;})}</div><p className={styles.note}>회색 바깥의 1번은 첨부 번호를 재현하기 위한 배경 표시입니다. Intersect의 실제 출력은 원 전체가 아니라 사각형과 원의 공통 부분이므로, 원의 위·아래 둥근 돌출부가 없습니다.</p><div className={styles.tableWrap}><table className={styles.countTable}><caption>같은 그림도 무엇을 세는지 먼저 정하세요</caption><thead><tr><th scope="col">집계 조건</th><th scope="col">Union</th><th scope="col">Intersect</th><th scope="col">Identity</th></tr></thead><tbody><tr><th scope="row">첨부 도식 번호 · 배경 1 포함</th><td>13</td><td>7</td><td>11</td></tr><tr><th scope="row">배경 제외 · 연결 조각을 각각 셈</th><td>12</td><td>6</td><td>10</td></tr></tbody></table></div><p className={styles.smallNote}>둘째 행은 입력 A가 사각형 4개, 입력 B가 반원 2개이고 배경은 피처가 아니며, 떨어진 조각을 각각 단일 파트로 세는 이 재구성의 조건입니다. 실제 레코드 수는 입력 피처 구성·멀티파트·허용오차 등의 설정도 확인해야 합니다. 첨부 답안을 공식 정정한 수치로 제시하는 것이 아닙니다.</p><details className={styles.details}><summary>바깥 1도 실제 폴리곤이라고 가정하면?</summary><p>두 입력의 바깥 영역까지 각각 하나의 피처로 채우면 두 레이어가 도면 전체를 덮습니다. 이때 Intersect에서도 모든 위치가 양 레이어에 속하므로 공통 범위를 원·사각형 안으로만 줄일 수 없습니다. 따라서 그 가정으로 첨부의 7을 실제 출력 수라고 해석하면 맞지 않습니다.</p></details><details className={styles.details}><summary>분할선의 근거와 수학 검산</summary><p>이 도형은 네 부분 사각형, 원, 중심을 지나는 대각선의 경계만 사용합니다. 임의의 분할선을 추가하지 않았습니다. 연결된 평면 그래프에서 유계 영역 수는 E−V+1입니다. Union은 꼭짓점 13·변 24로 12영역, Intersect는 꼭짓점 9·변 14로 6영역, Identity는 꼭짓점 13·변 22로 10영역이며, 바깥 배경을 더하면 첨부 번호가 됩니다. 원은 화면에서 매끄럽게 보이도록 근사한 학습용 재구성입니다.</p></details><p className={styles.smallNote}>속성도 비교하세요. Union은 양쪽 속성, Intersect는 공통 부분의 양쪽 속성, Identity는 첫 입력을 유지하며 겹친 부분의 상대 속성을 반영합니다.</p></>}
  </section>;
}

function TopologyRelations() {
  return <section className={styles.guide} aria-label="문제 8의 위상 관계 풀이"><h4>위상은 위치 사이의 관계를 설명해요</h4><p>정확한 길이나 각도보다 ‘연결되는가, 안에 있는가, 이웃하는가’를 보는 개념입니다.</p><div className={styles.inputGrid}>
    <figure className={styles.card}><Diagram label="연결성. 선 A와 B, C가 공통 노드에서 이어진 연결망 예시."><path d="M38 151L146 104L275 155M146 104L188 43" fill="none" stroke="#527e8c" strokeWidth="5" strokeLinejoin="round" />{[[38,151],[146,104],[275,155],[188,43]].map(([x,y],index)=><circle key={index} cx={x} cy={y} r="7" fill="#fffdf7" stroke="#527e8c" strokeWidth="3" />)}<text x="28" y="182" fill="#3d6573" fontSize="20">A</text><text x="276" y="182" fill="#3d6573" fontSize="20">B</text><text x="194" y="38" fill="#3d6573" fontSize="20">C</text></Diagram><figcaption><strong>연결성</strong><span>도로·관망에서 한 지점부터 다른 지점으로 이어지는 관계</span></figcaption></figure>
    <figure className={styles.card}><Diagram label="포함성. 공원 영역 A의 내부에 시설 점 P가 들어 있는 예시."><polygon points="45,164 62,52 217,37 279,151 158,184" fill="#d6e8bf" stroke="#64854e" strokeWidth="3" /><circle cx="150" cy="112" r="9" fill="#4c7790" /><text x="169" y="103" fill="#3c657b" fontSize="21" fontWeight="700">P</text><text x="82" y="91" fill="#557841" fontSize="21" fontWeight="700">A</text></Diagram><figcaption><strong>포함성 · 계급성</strong><span>시설 P가 공원 A의 안에 속하는 관계</span></figcaption></figure>
    <figure className={styles.card}><Diagram label="인접성. 면 A와 면 B가 공통 경계를 공유하는 예시."><rect x="44" y="49" width="116" height="128" fill="#d8e7c8" stroke="#64854e" strokeWidth="2" /><rect x="160" y="49" width="116" height="128" fill="#d5e5eb" stroke="#5b7c8b" strokeWidth="2" /><path d="M160 49V177" stroke="#af7955" strokeWidth="5" /><text x="102" y="122" textAnchor="middle" fill="#557841" fontSize="23">A</text><text x="218" y="122" textAnchor="middle" fill="#4a6d7e" fontSize="23">B</text></Diagram><figcaption><strong>인접성</strong><span>두 행정구역이 같은 경계의 일부를 공유하는 관계</span></figcaption></figure>
  </div><p className={styles.note}>화면에서 선이 교차해 보여도 실제 공통 노드가 없으면 연결로 처리되지 않을 수 있습니다. 포함의 경계점 처리, 점 접촉까지 인접으로 볼지는 적용하는 위상·분석 규칙을 확인합니다.</p></section>;
}

function BooleanFigure({ kind, index, solution }: { kind: "and" | "or" | "difference"; index: number; solution: boolean }) {
  const id=useId().replaceAll(":", "");const clipId=`second-logic-clip-${id}`;const maskId=`second-logic-mask-${id}`;
  const answer=kind==="and"?"A AND B":kind==="or"?"A OR B":"A AND NOT B";
  return <figure className={styles.card}><Diagram label={solution?`${index}번 결과는 ${answer}입니다. 채운 부분이 선택되는 영역입니다.`:`${index}번 음영 도형. 입력 영역 A와 B를 보고 음영에 해당하는 논리 연산을 쓰세요.`}>
    <defs><clipPath id={clipId}><circle cx="119" cy="113" r="68" /></clipPath><mask id={maskId}><rect width="320" height="220" fill="white" /><circle cx="201" cy="113" r="68" fill="black" /></mask></defs>
    {kind==="or"?<g fill="#b4cda0"><circle cx="119" cy="113" r="68" /><circle cx="201" cy="113" r="68" /></g>:kind==="and"?<circle cx="201" cy="113" r="68" fill="#b4cda0" clipPath={`url(#${clipId})`} />:<circle cx="119" cy="113" r="68" fill="#b4cda0" mask={`url(#${maskId})`} />}
    <circle cx="119" cy="113" r="68" fill="none" stroke="#52718a" strokeWidth="2.5" /><circle cx="201" cy="113" r="68" fill="none" stroke="#7b668b" strokeWidth="2.5" /><text x="101" y="35" fill="#44657c" fontSize="22" fontWeight="700">A</text><text x="206" y="35" fill="#705c80" fontSize="22" fontWeight="700">B</text>
  </Diagram><figcaption><strong>({index}) {solution?answer:"음영에 맞는 연산은?"}</strong></figcaption></figure>;
}

function BooleanShading({ solution }: { solution: boolean }) {
  return <section className={styles.guide} aria-label="문제 16의 논리 연산 음영 도형"><div className={styles.inputGrid}>{(["and","or","difference"] as const).map((kind,index)=><BooleanFigure key={kind} kind={kind} index={index+1} solution={solution} />)}</div>{solution&&<p className={styles.note}>첨부의 ‘A NOT B’는 A에서 B와 겹치는 부분을 제외하는 A AND NOT B, 즉 A∖B로 읽습니다. 단독 NOT B는 정한 전체 범위 U에서 B를 뺀 U∖B이므로 A 안쪽에 한정되지 않습니다.</p>}</section>;
}

const landBox={x:35,y:25,width:200,height:150};
const adminBox={x:75,y:55,width:120,height:90};
const landPoints:Point[]=Array.from({length:7},(_,row)=>Array.from({length:7-row},(_,column):Point=>[59+24*(column+row),160-18*row])).flat();
const retainedPoints=landPoints.filter(([x,y])=>x>=adminBox.x&&x<=adminBox.x+adminBox.width&&y>=adminBox.y&&y<=adminBox.y+adminBox.height);

function AdministrationLines() {
  return <g fill="none" stroke="#6c795d" strokeWidth="1.8"><rect {...adminBox} /><path d="M75 55L195 145" />{[1,2,3,4,5].flatMap(index=>[<path key={`h-${index}`} d={`M${75+index*20} ${55+index*15}H195`} />,<path key={`v-${index}`} d={`M${75+index*20} ${55+index*15}V145`} />])}</g>;
}

function LandMap({ kind }: { kind:"land"|"admin"|"union"|"intersect"|"clip" }) {
  const id=useId().replaceAll(":", "");const clipId=`second-land-clip-${id}`;
  const clipped=kind==="intersect"||kind==="clip";
  const label=kind==="land"?"토지이용 입력. 사각형의 남서-북동 대각선과 그 아래쪽 점 기호 28개를 갖는 학습용 재구성입니다.":kind==="admin"?"행정구역 입력. 작은 사각형 안에 북서-남동 대각선과 가로 세로 구역 경계가 있습니다.":kind==="union"?"문제에서 제공한 Union 결과의 학습용 재구성. 전체 토지이용 범위 안에 행정구역의 경계와 원래 점 위치가 함께 나타납니다.":kind==="intersect"?`Intersect 풀이. 행정구역 외곽 안의 토지이용 부분과 행정구역의 내부 경계, 유지된 점 기호 ${retainedPoints.length}개를 표시합니다.`:`Clip 풀이. 행정구역 외곽 안의 토지이용 대각선과 점 기호 ${retainedPoints.length}개를 남기며 행정구역 내부 분할선은 옮기지 않습니다.`;
  return <Diagram label={label} viewBox={clipped?"55 38 160 125":"10 8 250 190"}><defs><clipPath id={clipId}><rect {...adminBox} /></clipPath></defs>
    {kind!=="admin"&&<g clipPath={clipped?`url(#${clipId})`:undefined}><rect {...landBox} fill="#f8faf3" stroke="#61734d" strokeWidth="1.8" /><path d="M35 175L235 25" stroke="#54718a" strokeWidth="1.8" />{(clipped?retainedPoints:landPoints).map(([x,y],index)=><circle key={index} cx={x} cy={y} r="2" fill="#526698" />)}</g>}
    {kind==="admin"||kind==="union"||kind==="intersect"?<AdministrationLines />:null}
    {kind==="clip"&&<rect {...adminBox} fill="none" stroke="#61734d" strokeWidth="1.8" />}
  </Diagram>;
}

function LandOverlay({ solution }: { solution: boolean }) {
  return <section className={styles.guide} aria-label="문제 19의 토지이용과 행정구역 도면"><p className={styles.reconstruction}>첨부의 배치 관계를 살린 학습용 재구성입니다. 점·분할선의 수와 좌표는 이 도면의 예시 조건이며 원본을 실측 복원한 값이 아닙니다. 같은 점 좌표를 입력과 결과에 일관되게 사용합니다. Clip은 행정구역 내부 경계를 Dissolve로 합친 단일 외곽을 자르는 마스크로 사용합니다.</p><div className={styles.inputGrid}>{[{kind:"land" as const,title:"토지이용 입력"},{kind:"admin" as const,title:"행정구역 입력"},{kind:"union" as const,title:"문제에서 제공한 Union 결과"}].map(item=><figure className={styles.card} key={item.kind}><LandMap kind={item.kind} /><figcaption>{item.title}</figcaption></figure>)}</div>{solution&&<><div className={styles.twoColumns}>{[{kind:"intersect" as const,title:"Intersect · 공통 범위와 양쪽 경계",text:"토지이용과 행정구역이 겹치는 범위에서 두 레이어의 구역 경계와 속성을 함께 반영합니다."},{kind:"clip" as const,title:"Clip · 외곽으로 자르기",text:"Dissolve로 합친 행정구역 단일 외곽을 자르는 마스크로 사용합니다. 토지이용의 원래 경계와 속성을 유지하고 행정구역의 내부 경계·속성은 새로 결합하지 않습니다."}].map(item=><article className={styles.card} key={item.kind}><h5>{item.title}</h5><LandMap kind={item.kind} /><p>{item.text}</p><span className={styles.retainedCount}>이 재구성에서 남은 점 기호: {retainedPoints.length}개</span></article>)}</div><p className={styles.note}>두 결과는 같은 작은 행정구역 외곽을 확대해 보여 줍니다. Intersect는 내부 행정 경계를 유지하고, Clip은 그 외곽으로 입력 토지이용을 자르는 차이에 집중하세요. 원래 점 기호는 위치를 옮기거나 새로 채우지 않습니다.</p><p className={styles.smallNote}>이 예시의 점은 위치 유지 확인용 기호입니다. 별도의 실제 점 피처 레이어나 공식 기출의 점 개수로 단정하지 않습니다. 여러 행정구역을 자르는 범위로 사용할 때는 외곽을 합쳐 쓸지와 도구의 입력·출력 구성을 먼저 확인합니다.</p></>}</section>;
}

export function TechnicianSecondGeometry({ number, solution = false }: Props) {
  if(number===5)return solution?<DigitizingErrors />:null;
  if(number===6)return <OverlayCounting solution={solution} />;
  if(number===8)return solution?<TopologyRelations />:null;
  if(number===16)return <BooleanShading solution={solution} />;
  if(number===19)return <LandOverlay solution={solution} />;
  return null;
}
