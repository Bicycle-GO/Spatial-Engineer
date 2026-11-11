import { useId, type ReactNode } from "react";
import { BooleanLogicGuide } from "./boolean-logic-guide";
import { TechnicianExtraVisual } from "./technician-extra-visuals";
import styles from "./technician-past-visuals.module.css";

type VisualProps = { number: number; solution?: boolean };
type OverlayKind = "clip" | "intersect" | "erase" | "union";

const markers = ["①", "②", "③", "④", "⑤", "⑥"];
const rasterInput = [
  [1, 3, 5, 1, 4],
  [7, 7, 4, 9, 8],
  [9, 10, 11, 11, 12],
  [15, 17, 18, 16, 18],
  [20, 21, 23, 21, 22],
];
const rasterRules = [
  { lower: 1, upper: 4, label: "1~4", result: 3 },
  { lower: 5, upper: 9, label: "5~9", result: 2 },
  { lower: 10, upper: 13, label: "10~13", result: 1 },
  { lower: 14, upper: 18, label: "14~18", result: 6 },
  { lower: 19, upper: 22, label: "19~22", result: 5 },
  { lower: 23, upper: Infinity, label: "23 이상", result: 4 },
];
const cellColors: Record<number, string> = { 1: "#eef0c8", 2: "#dcebbe", 3: "#cae1ce", 4: "#cce7ed", 5: "#d9ddf1", 6: "#ead7c6" };

function SvgFrame({ label, children, tall = false }: { label: string; children: ReactNode; tall?: boolean }) {
  const titleId = useId();
  return <svg className={styles.diagram} viewBox={tall ? "0 0 320 210" : "0 0 240 170"} role="img" aria-labelledby={titleId}>
    <title id={titleId}>{label}</title>
    {children}
  </svg>;
}

function BooleanInput({ shape }: { shape: "square" | "circle" }) {
  return <SvgFrame label={shape === "square" ? "입력 A: 정사각형 영역" : "입력 B: 원 영역"}>
    {shape === "square" ? <rect x="65" y="35" width="110" height="110" fill="#e1eacb" stroke="#47613c" strokeWidth="3" /> : <circle cx="120" cy="90" r="66" fill="#dbe8ec" stroke="#426774" strokeWidth="3" />}
  </SvgFrame>;
}

function BooleanResult({ first, solution }: { first: boolean; solution: boolean }) {
  const id = useId().replaceAll(":", "");
  const circleId = `boolean-circle-${id}`;
  const squareId = `boolean-square-${id}`;
  const label = solution ? first ? "① 결과: OR. 정사각형 또는 원에 속하는 전체 영역" : "② 결과: AND. 정사각형과 원이 공통으로 차지하는 영역" : `${first ? "①" : "②"} 결과 도형`;
  return <SvgFrame label={label}>
    <defs><clipPath id={circleId}><circle cx="120" cy="90" r="66" /></clipPath><clipPath id={squareId}><rect x="65" y="35" width="110" height="110" /></clipPath></defs>
    {first ? <g fill="#b9d09f" stroke="#3f6038" strokeWidth="2.5"><rect x="65" y="35" width="110" height="110" /><circle cx="120" cy="90" r="66" /></g> : <>
      <rect x="65" y="35" width="110" height="110" fill="#b9d09f" clipPath={`url(#${circleId})`} />
      <rect x="65" y="35" width="110" height="110" fill="none" stroke="#3f6038" strokeWidth="3" clipPath={`url(#${circleId})`} />
      <circle cx="120" cy="90" r="66" fill="none" stroke="#3f6038" strokeWidth="3" clipPath={`url(#${squareId})`} />
    </>}
  </SvgFrame>;
}

function BooleanVisual({ solution }: { solution: boolean }) {
  return <section className={styles.block} aria-label="문제 1의 도형 자료">
    <p className={styles.note}>두 입력 영역을 같은 위치에 겹친 뒤, 각 결과 도형에 맞는 연산자를 고르세요.</p>
    {[true, false].map((first, index) => <div className={styles.booleanExample} key={index}>
      <h4 className={styles.exampleTitle}>{markers[index]} {solution ? first ? "OR · 합집합" : "AND · 교집합" : "결과 도형"}</h4>
      <div className={styles.booleanRow}>
        <div className={styles.inputPair}><figure><BooleanInput shape="square" /><figcaption>입력 A</figcaption></figure><span className={styles.mathSign} aria-hidden="true">＋</span><figure><BooleanInput shape="circle" /><figcaption>입력 B</figcaption></figure></div>
        <span className={styles.mathSign} aria-hidden="true">＝</span>
        <figure className={styles.resultFigure}><BooleanResult first={first} solution={solution} /><figcaption>{markers[index]}의 결과</figcaption></figure>
      </div>
    </div>)}
    {!solution && <div className={styles.choiceBox}><strong>보기</strong><span>AND</span><span>OR</span><span>XOR</span><span>NOT</span></div>}
    {solution && <p className={styles.note}>채운 부분이 결과에 포함되는 영역입니다. OR는 어느 한쪽에 속해도 포함하고, AND는 두 영역에 동시에 속하는 부분만 포함합니다.</p>}
  </section>;
}

function AccessVisual({ solution }: { solution: boolean }) {
  const rows = [
    { description: "같은 패키지 내에서만 접근 가능하다.", answer: "default · 접근제어자 생략" },
    { description: "같은 패키지 내에서, 그리고 다른 패키지의 자식 클래스에서 접근 가능하다.", answer: "protected" },
    { description: "어떤 클래스에서라도 접근 가능하며, 접근 제한이 없다.", answer: "public" },
    { description: "같은 클래스 내에서만 접근 가능하다.", answer: "private" },
  ];
  return <section className={styles.block} aria-label="문제 2의 접근 범위 표"><div className={styles.tableWrap}><table className={styles.accessTable}>
    <caption>Java 접근 범위와 명칭 {solution ? "비교" : "빈칸"}</caption>
    <thead><tr><th scope="col">번호</th><th scope="col">문제의 설명</th><th scope="col">접근제어자</th></tr></thead>
    <tbody>{rows.map((row, index) => <tr key={row.answer}><th scope="row">{markers[index]}</th><td>{row.description}</td><td>{solution ? <strong>{row.answer}</strong> : <span className={styles.blank} aria-label={`${markers[index]} 답안 빈칸`}>빈칸</span>}</td></tr>)}</tbody>
  </table></div>{solution && <p className={styles.note}>default는 이 문맥에서 접근제어자를 생략한 패키지 접근을 뜻합니다. 다른 패키지에서 protected 인스턴스 멤버에 접근할 때에는 상속과 참조 형식 등에 추가 조건이 있습니다.</p>}</section>;
}

function BufferVisual() {
  const examples = [
    { id: "point", title: "점 주변", text: "한 시설에서 거리 d 이내의 영역" },
    { id: "line", title: "선 주변", text: "도로의 양쪽과 끝점을 둘러싼 영역" },
    { id: "polygon", title: "면 주변", text: "공원 경계의 바깥으로 확장한 영역" },
  ];
  return <section className={styles.block} aria-label="문제 3의 버퍼 풀이 도형"><h4 className={styles.sectionTitle}>일정 거리 이내를 영역으로 만들기</h4><div className={styles.threeCards}>{examples.map(example => <figure className={styles.diagramCard} key={example.id}>
    <SvgFrame label={`${example.title} 버퍼 개념도. ${example.text}. 파란색은 입력, 연두색은 주변 영역.`}>
      {example.id === "point" ? <><circle cx="120" cy="85" r="57" fill="#e0edc9" stroke="#6b8b4f" strokeWidth="2" /><path d="M120 85H177" stroke="#769552" strokeWidth="2" strokeDasharray="5 4" /><circle cx="120" cy="85" r="7" fill="#356a7c" /><text x="148" y="76" fill="#476537" fontSize="18">d</text></> : example.id === "line" ? <><path d="M40 108L102 66L190 104" fill="none" stroke="#dcebc5" strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" /><path d="M40 108L102 66L190 104" fill="none" stroke="#356a7c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></> : <><rect x="42" y="28" width="156" height="116" rx="24" fill="#e0edc9" stroke="#6b8b4f" strokeWidth="2" /><rect x="66" y="52" width="108" height="68" fill="#c7e1e7" stroke="#356a7c" strokeWidth="3" /></>}
    </SvgFrame><figcaption><strong>{example.title}</strong><span>{example.text}</span></figcaption>
  </figure>)}</div><p className={styles.note}>파랑은 원래 객체, 연두는 거리 조건을 적용한 주변 영역입니다. 평면 거리 개념도이며 실제 도구에서는 거리 단위·좌표계와 버퍼 옵션을 확인합니다.</p></section>;
}

function RasterGrid({ title, result = false, blank = false }: { title: string; result?: boolean; blank?: boolean }) {
  return <table className={styles.rasterGrid}><caption>{title}</caption><tbody>{rasterInput.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, columnIndex) => {
    const output = rasterRules.find(rule => value >= rule.lower && value <= rule.upper)!.result;
    const displayed = blank ? "" : result ? output : value;
    return <td key={columnIndex} style={result ? { backgroundColor: cellColors[output] } : undefined} aria-label={`${rowIndex + 1}행 ${columnIndex + 1}열: ${blank ? "답안 빈칸" : displayed}`}>{blank ? <span aria-hidden="true" className={styles.cellBlank}>·</span> : displayed}</td>;
  })}</tr>)}</tbody></table>;
}

function RasterVisual({ solution }: { solution: boolean }) {
  return <section className={styles.block} aria-label="문제 4의 재분류 격자와 조건"><div className={styles.rasterLayout}>
    <div><RasterGrid title="입력 격자 · 5 × 5" /></div>
    <div><table className={styles.ruleTable}><caption>재분류 조건</caption><thead><tr><th scope="col">원래 값의 구간</th><th scope="col">새 값</th></tr></thead><tbody>{rasterRules.map(rule => <tr key={rule.result}><td>{rule.label}</td><td><strong>{rule.result}</strong></td></tr>)}</tbody></table><p className={styles.smallNote}>각 구간은 양 끝 값을 모두 포함합니다.</p></div>
    <div><RasterGrid title={solution ? "최종 성과물 · 재분류 결과" : "최종 성과물 · 답안 격자"} result={solution} blank={!solution} /></div>
  </div><p className={styles.note}>{solution ? "셀의 위치와 개수는 유지하고 값만 조건표에 따라 바꿉니다. 예: 1→3, 9→2, 23→4. 배경색은 새 코드의 구분을 돕기 위한 표시이며 수치의 크기를 뜻하지 않습니다." : "왼쪽 격자의 각 셀을 가운데 조건표로 바꾸어 오른쪽과 같은 5 × 5 형태의 답안을 작성하세요."}</p></section>;
}

function OperatorChoices() {
  return <section className={styles.block} aria-label="문제 5의 연산자 보기"><div className={styles.operatorChoices}>{["||", "&", ">>", "+", "="].map((operator, index) => <div key={operator}><span>{markers[index]}</span><code>{operator}</code></div>)}</div><p className={styles.note}>+는 이 문항에서 두 값을 더하는 이항 덧셈 연산자입니다.</p></section>;
}

const overlayItems: { kind: OverlayKind; title: string; english: string; result: string; attributes: string }[] = [
  { kind: "union", title: "결합", english: "Union", result: "A와 B의 모든 영역을 남기고 겹치는 경계로 나눕니다.", attributes: "A·B의 속성을 결합 · 겹치지 않은 부분의 상대 속성은 비어 있을 수 있음" },
  { kind: "erase", title: "지우기", english: "Erase", result: "입력 A에서 B와 겹치는 부분을 제거합니다.", attributes: "남은 A의 속성 유지" },
  { kind: "intersect", title: "교차", english: "Intersection", result: "A와 B의 공통 영역만 남깁니다.", attributes: "A·B의 속성을 함께 결합" },
  { kind: "clip", title: "자르기", english: "Clip", result: "B의 범위 안에 있는 입력 A의 부분을 남깁니다.", attributes: "입력 A의 속성 유지 · B는 자르는 경계" },
];

function OverlayDiagram({ kind, title }: { kind: OverlayKind; title: string }) {
  const id = useId().replaceAll(":", "");
  const circleId = `overlay-circle-${id}`;
  const squareId = `overlay-square-${id}`;
  const eraseId = `overlay-erase-${id}`;
  return <SvgFrame label={`${title}의 면 중첩 예시. 점선 사각형 A가 입력이고 원 B가 비교 영역이며, 채워진 부분이 결과입니다.`}>
    <defs><clipPath id={circleId}><circle cx="153" cy="88" r="58" /></clipPath><clipPath id={squareId}><rect x="35" y="38" width="125" height="100" /></clipPath><mask id={eraseId}><rect width="240" height="170" fill="white" /><circle cx="153" cy="88" r="58" fill="black" /></mask></defs>
    {kind === "union" ? <><rect x="35" y="38" width="125" height="100" fill="#c7e1e7" /><circle cx="153" cy="88" r="58" fill="#dceac6" /><rect x="35" y="38" width="125" height="100" fill="#8db9a0" clipPath={`url(#${circleId})`} /></> : kind === "erase" ? <rect x="35" y="38" width="125" height="100" fill="#a5c993" mask={`url(#${eraseId})`} /> : <rect x="35" y="38" width="125" height="100" fill="#a5c993" clipPath={`url(#${circleId})`} />}
    <rect x="35" y="38" width="125" height="100" fill="none" stroke="#416a79" strokeWidth="2" strokeDasharray={kind === "union" ? undefined : "5 4"} />
    <circle cx="153" cy="88" r="58" fill="none" stroke="#648247" strokeWidth="2" strokeDasharray={kind === "union" ? undefined : "5 4"} />
    {kind === "clip" || kind === "intersect" ? <><rect x="35" y="38" width="125" height="100" fill="none" stroke="#345d3d" strokeWidth="3" clipPath={`url(#${circleId})`} /><circle cx="153" cy="88" r="58" fill="none" stroke="#345d3d" strokeWidth="3" clipPath={`url(#${squareId})`} /></> : null}
    <text x="44" y="28" fill="#315c70" fontSize="17" fontWeight="700">A</text><text x="202" y="37" fill="#546e3b" fontSize="17" fontWeight="700">B</text>
  </SvgFrame>;
}

function OverlayVisual({ solution }: { solution: boolean }) {
  if (!solution) return <section className={styles.block} aria-label="문제 6의 중첩 기능 보기"><div className={styles.overlayChoices}>{overlayItems.map(item => <div key={item.kind}><strong>{item.title}</strong><span>{item.english}</span></div>)}</div></section>;
  return <section className={styles.block} aria-label="문제 6의 중첩 기능 비교"><h4 className={styles.sectionTitle}>남기는 영역과 속성을 함께 보세요</h4><div className={styles.overlayGrid}>{overlayItems.map(item => <article className={styles.overlayCard} key={item.kind}><h5>{item.title} <span>{item.english}</span></h5><OverlayDiagram kind={item.kind} title={`${item.title} ${item.english}`} /><p>{item.result}</p><p className={styles.attributeNote}>{item.attributes}</p></article>)}</div><p className={styles.note}>이 면 예시에서 Clip과 Intersection의 결과 모양은 같지만 속성 처리의 목적이 다릅니다. A는 입력, B는 비교 영역이며 점선은 원래 경계를 보여 줍니다. 개별 객체의 구조와 도구 설정에 따라 결과가 달라질 수 있는 개념도입니다.</p></section>;
}

function MappingFlow({ solution }: { solution: boolean }) {
  const choices = ["구조화 편집", "정위치 편집", "수치 도화", "항공사진 촬영", "기준점 측량", "지리 조사"];
  const order = [3, 4, 2, 5, 1, 0];
  return <section className={styles.block} aria-label={`문제 7의 ${solution ? "제작 순서 풀이" : "순서 선택 보기"}`}>
    {solution ? <><ol className={styles.flow}>{order.map(index => <li key={index}><span>{markers[index]}</span><strong>{choices[index]}</strong></li>)}</ol><p className={styles.note}>첨부 문제에서 제시한 항공사진 측량 기반 제작 흐름입니다. 보기 번호는 ④ → ⑤ → ③ → ⑥ → ② → ①입니다.</p></> : <><p className={styles.note}>아래는 보기 번호 순서이며, 제작 순서가 아닙니다.</p><div className={styles.stageChoices}>{choices.map((choice, index) => <div key={choice}><span>{markers[index]}</span><strong>{choice}</strong></div>)}</div></>}
  </section>;
}

function HeightSurfaces() {
  return <section className={styles.block} aria-label="문제 8의 지오이드와 기준타원체 풀이"><h4 className={styles.sectionTitle}>물리적 기준면과 수학적 기준면</h4><div className={styles.surfaceLayout}>
    <figure className={styles.surfaceFigure}><SvgFrame tall label="일부 구간을 확대하고 높낮이를 과장한 개념도. 파란 실선 지오이드와 갈색 점선 기준타원체가 교차하며, 두 면의 위아래 관계는 고정되지 않습니다.">
      <rect x="12" y="16" width="296" height="176" rx="18" fill="#f5f7f0" />
      <path d="M25 125Q160 75 295 125" fill="none" stroke="#9b7148" strokeWidth="3" strokeDasharray="8 6" />
      <path d="M25 140C60 158 87 68 125 93S186 160 215 135S260 66 295 91" fill="none" stroke="#3f7e99" strokeWidth="4" />
    </SvgFrame><figcaption>높낮이를 과장한 기준면의 개념도</figcaption></figure>
    <div className={styles.surfaceDetails}><section><h5><span className={styles.geoidKey} aria-hidden="true" />지오이드</h5><p>평균해수면에 가까운 중력의 등퍼텐셜면입니다. 같은 면 위에서 퍼텐셜이 일정하다는 뜻이며, 그 값이 반드시 0이라는 뜻은 아닙니다.</p></section><section><h5><span className={styles.ellipsoidKey} aria-hidden="true" />기준타원체</h5><p>지구의 모양을 단순화한 수학적 곡면으로, 위치와 타원체고 등을 계산하는 기준으로 사용합니다.</p></section></div>
  </div><p className={styles.note}>지오이드가 기준타원체보다 항상 위나 아래에 있는 것은 아닙니다. 이 그림은 육지·바다의 위치나 실제 지형 고도를 나타내지 않습니다.</p></section>;
}

function SqlVisual() {
  return <section className={styles.block} aria-label="문제 9의 SQL 분류 풀이 비유"><h4 className={styles.sectionTitle}>시설 관리대장으로 세 역할을 나눠 보세요</h4><div className={styles.sqlGrid}>
    <article className={styles.sqlCard}><h5>① DML · 데이터 조작</h5><table><caption>대장에 담긴 값</caption><thead><tr><th scope="col">시설명</th><th scope="col">상태</th></tr></thead><tbody><tr><td>시설 A</td><td className={styles.sqlHighlight}>점검 완료</td></tr><tr><td>시설 B</td><td>점검 예정</td></tr></tbody></table><p>기록을 조회하고 추가·수정·삭제합니다.</p><code>SELECT · INSERT · UPDATE · DELETE</code></article>
    <article className={styles.sqlCard}><h5>② DDL · 구조 정의</h5><div className={styles.sqlFields}><span>시설명</span><span>상태</span><span className={styles.sqlNewField}>＋ 점검일</span></div><p>대장에 어떤 항목을 기록할지, 테이블의 틀을 만들고 바꿉니다.</p><code>CREATE · ALTER · DROP</code></article>
    <article className={styles.sqlCard}><h5>③ DCL · 권한 제어</h5><table><caption>누가 접근할 수 있나요?</caption><thead><tr><th scope="col">사용자</th><th scope="col">열람</th><th scope="col">수정</th></tr></thead><tbody><tr><td>담당자</td><td>허용</td><td>허용</td></tr><tr><td>방문자</td><td>허용</td><td>제한</td></tr></tbody></table><p>사용자의 접근 권한을 부여하거나 회수합니다.</p><code>GRANT · REVOKE</code></article>
  </div><p className={styles.note}>이 문항의 분류 기준에 따른 비유입니다. 조회를 DQL로 따로 구분하는 교재나 명령 분류가 다른 DBMS도 있으므로 제시된 기준을 확인합니다.</p></section>;
}

export function TechnicianPastVisual({ number, solution = false }: VisualProps) {
  if (number === 1) return <><BooleanVisual solution={solution} />{solution && <BooleanLogicGuide />}</>;
  if (number === 2) return <AccessVisual solution={solution} />;
  if (number === 3) return solution ? <BufferVisual /> : null;
  if (number === 4) return <RasterVisual solution={solution} />;
  if (number === 5) return <OperatorChoices />;
  if (number === 6) return <OverlayVisual solution={solution} />;
  if (number === 7) return <MappingFlow solution={solution} />;
  if (number === 8) return solution ? <HeightSurfaces /> : null;
  if (number === 9) return solution ? <SqlVisual /> : null;
  if (number >= 11 && number <= 14) return solution ? <TechnicianExtraVisual number={number} /> : null;
  return null;
}
