import { useId, type ReactNode } from "react";
import styles from "./technician-extra-visuals.module.css";

function Diagram({ label, children, wide = false, zone = false }: { label: string; children: ReactNode; wide?: boolean; zone?: boolean }) {
  const id = useId();
  return <svg className={styles.diagram} viewBox={wide ? "0 0 720 280" : zone ? "0 0 320 260" : "0 0 260 180"} role="img" aria-labelledby={id}><title id={id}>{label}</title>{children}</svg>;
}

function VectorBasics() {
  const items = [
    { id: "point", title: "점 · Point", example: "한 시설의 대표 위치", detail: "위치를 좌표로 나타냅니다." },
    { id: "line", title: "선 · Line", example: "도로의 중심선", detail: "여러 정점을 연결해 경로를 나타냅니다." },
    { id: "polygon", title: "면 · Polygon", example: "공원의 경계와 내부", detail: "닫힌 경계로 영역을 나타냅니다." },
  ];
  return <section className={styles.guide} aria-label="문제 11의 점 선 면 풀이"><h4>벡터의 세 가지 기본 도형</h4><div className={styles.vectorGrid}>{items.map(item => <figure className={styles.card} key={item.id}>
    <Diagram label={`${item.title} 예시. ${item.example}. ${item.detail}`}>
      <rect x="8" y="8" width="244" height="164" rx="14" fill="#f3f7ec" />
      {item.id === "point" ? <><circle cx="130" cy="85" r="12" fill="#3c7385" /><circle cx="130" cy="85" r="27" fill="none" stroke="#96b9bd" strokeWidth="2" strokeDasharray="5 5" /><text x="153" y="75" fontSize="20" fontWeight="700" fill="#355c6b">P</text></> : item.id === "line" ? <><path d="M35 125L85 62L143 100L218 47" fill="none" stroke="#3c7385" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />{[[35,125],[85,62],[143,100],[218,47]].map(([x,y], index) => <circle key={index} cx={x} cy={y} r="5.5" fill="#fffef7" stroke="#3c7385" strokeWidth="2.5" />)}</> : <><polygon points="45,125 72,48 173,35 221,108 162,146" fill="#c4ddb1" stroke="#527b43" strokeWidth="3" />{[[45,125],[72,48],[173,35],[221,108],[162,146]].map(([x,y], index) => <circle key={index} cx={x} cy={y} r="4.5" fill="#527b43" />)}</>}
    </Diagram><figcaption><strong>{item.title}</strong><span>{item.example}</span><p>{item.detail}</p></figcaption>
  </figure>)}</div><p className={styles.note}>같은 공원도 작은 축척의 안내도에서는 점으로, 상세 지도에서는 면으로 표현할 수 있습니다. 도형 선택은 대상의 이름뿐 아니라 축척과 표현 목적을 함께 고려합니다.</p></section>;
}

function GeocodingExample() {
  return <section className={styles.guide} aria-label="문제 12의 지오코딩 풀이"><h4>주소를 지도 위의 위치와 연결하기</h4><div className={styles.geocodingFlow}>
    <section className={styles.card}><span className={styles.stageLabel}>입력 · 주소 텍스트</span><div className={styles.address}>가상 주소 A</div><p>실재하는 주소가 아닌 학습용 이름입니다.</p></section>
    <div className={styles.arrow} aria-hidden="true">→</div>
    <section className={styles.card}><span className={styles.stageLabel}>주소 대조 · 지오코딩</span><p>주소 데이터와 대조해 후보 위치를 찾고, 매칭 결과와 정확도를 확인합니다.</p></section>
    <div className={styles.arrow} aria-hidden="true">→</div>
    <section className={styles.card}><span className={styles.stageLabel}>출력 · 좌표 예시</span><dl className={styles.coordinates}><div><dt>경도 λ</dt><dd>127.0000°</dd></div><div><dt>위도 φ</dt><dd>37.0000°</dd></div></dl><span className={styles.fictional}>가상 매칭 결과</span></section>
  </div><div className={styles.geocodingMap}><Diagram label="실제 지도가 아닌 위치 표시 개념도. 주소에 대응한 좌표를 점 P로 표시합니다.">
    <rect x="12" y="12" width="236" height="156" rx="12" fill="#eff4e8" />
    {[45,85,125].map(y => <path key={y} d={`M30 ${y}H230`} fill="none" stroke="#d2dec5" />)}
    {[60,105,150,195].map(x => <path key={x} d={`M${x} 25V150`} fill="none" stroke="#d2dec5" />)}
    <circle cx="150" cy="85" r="9" fill="#3f7386" /><text x="166" y="78" fontSize="20" fontWeight="700" fill="#355e70">P</text>
  </Diagram><p><strong>가상 주소와 가상 매칭 결과입니다.</strong><br />실측 주소나 실제 서비스의 검색 결과와 연결되지 않습니다. 이 예시는 경도와 위도를 각각 표시했으며, 실제 작업에서는 결과 좌표계와 축 순서를 확인합니다.</p></div><p className={styles.note}>주소를 좌표로 찾는 것이 지오코딩입니다. 반대로 좌표에서 주소를 찾는 작업은 역지오코딩으로 구분합니다. 주소를 단순한 문자열 규칙만으로 좌표로 계산하는 것은 아닙니다.</p></section>;
}

function UtmBasics() {
  const west = 64;
  const width = 620;
  const zoneWidth = width / 60;
  const top = 58;
  const height = 164;
  const equator = top + 84;
  const selectedZoneX = west + 30 * zoneWidth;
  return <section className={styles.guide} aria-label="문제 13의 UTM 구역과 좌표축 풀이"><h4>지구를 세로 구역으로 나누고 각 구역을 따로 투영해요</h4>
    <figure className={styles.worldFigure}><Diagram wide label="UTM 기본 구역의 경도 개요. 서경 180도에서 동경 180도까지 기본 폭 6도의 60개 구역이며 남위 80도에서 북위 84도에 적용합니다. 31번 구역은 동경 0도에서 6도이며 중앙자오선은 동경 3도입니다.">
      <rect x="10" y="8" width="700" height="263" rx="15" fill="#f4f7ef" />
      <rect x={west} y="32" width={width} height="26" fill="#e3eaf0" /><rect x={west} y="222" width={width} height="26" fill="#e3eaf0" />
      <rect x={west} y={top} width={width} height={height} fill="#edf3dc" stroke="#a4b58d" />
      <rect x={selectedZoneX} y={top} width={zoneWidth} height={height} fill="#719d62" />
      {Array.from({ length: 61 }, (_, index) => <path key={index} d={`M${west + index * zoneWidth} ${top}V${top + height}`} stroke="#a5b68d" strokeWidth="1" />)}
      <path d={`M${west} ${equator}H${west + width}`} stroke="#7195a5" strokeWidth="2" />
      <text x="56" y={top + 6} textAnchor="end" fill="#557048" fontSize="17">84°N</text><text x="56" y={equator + 6} textAnchor="end" fill="#526f7a" fontSize="17">0°</text><text x="56" y={top + height + 6} textAnchor="end" fill="#557048" fontSize="17">80°S</text>
      <text x={west} y="265" textAnchor="start" fill="#5b7250" fontSize="17">180°W</text><text x={west + width / 2} y="265" textAnchor="middle" fill="#5b7250" fontSize="17">0°</text><text x={west + width} y="265" textAnchor="end" fill="#5b7250" fontSize="17">180°E</text>
      <text x="370" y="24" textAnchor="middle" fill="#62788a" fontSize="17">극지방은 UPS 등 별도 체계</text>
      <text x="145" y="102" fill="#5b7250" fontSize="18" fontWeight="700">기본 60개 구역</text>
      <path d={`M${selectedZoneX + zoneWidth / 2} 95L456 87`} stroke="#496a3c" strokeWidth="2" /><rect x="451" y="69" width="135" height="34" rx="7" fill="#fffef8" /><text x="518" y="92" textAnchor="middle" fill="#456638" fontSize="17" fontWeight="700">31번 구역 예시</text>
    </Diagram><figcaption>위도·경도에 따른 구역의 개념도이며, 실제 UTM 평면 지도는 아닙니다.</figcaption></figure>
    <div className={styles.utmDetail}>
      <figure className={styles.zoneFigure}><Diagram zone label="31번 UTM 구역의 축 방향 개념도. 동경 0도에서 6도 사이의 중앙자오선 동경 3도는 세로, 위도 0도인 적도는 가로입니다. 이 교점을 평면 좌표 0,0으로 표시하지 않습니다.">
        <rect x="12" y="8" width="296" height="244" rx="14" fill="#f4f7ed" />
        <rect x="80" y="45" width="160" height="164" fill="#dcebc7" stroke="#8ea77b" strokeWidth="2" />
        <path d="M160 45V209" stroke="#8b6450" strokeWidth="3" strokeDasharray="7 5" />
        <path d="M45 129H275" stroke="#3c748e" strokeWidth="3" />
        <text x="80" y="31" textAnchor="middle" fill="#526f40" fontSize="18">0°E</text><text x="240" y="31" textAnchor="middle" fill="#526f40" fontSize="18">6°E</text>
        <text x="160" y="235" textAnchor="middle" fill="#805b48" fontSize="18" fontWeight="700">3°E · 중앙자오선</text>
        <text x="50" y="116" fill="#356c85" fontSize="18" fontWeight="700">적도 · 위도 0°</text>
      </Diagram><figcaption>중앙자오선은 세로, 적도는 가로</figcaption></figure>
      <div className={styles.utmNotes}><section><h5>기본 구역 폭은 경도 6°</h5><p>360° ÷ 60 = 6°입니다. 노르웨이·스발바르 등에는 구역 경계의 예외가 있으므로 모든 곳의 실제 구역 폭이 같다고 일반화하지 않습니다.</p></section><section><h5>UTM과 극지방을 구분해요</h5><p>UTM의 일반 적용 범위는 남위 80°~북위 84°입니다. 이 범위를 벗어나는 극지방은 UPS 같은 별도 체계를 사용합니다.</p></section><section><h5>축의 교점이 (0, 0)은 아니에요</h5><p>중앙자오선의 Easting은 500,000m입니다. 적도의 Northing은 북반구 체계에서 0m, 남반구 체계에서 10,000,000m로 정하므로 가산값과 반구를 함께 확인합니다.</p></section></div>
    </div>
  </section>;
}

function MetadataExample() {
  return <section className={styles.guide} aria-label="문제 14의 메타데이터와 실제 자료 풀이"><h4>자료 자체와 ‘그 자료에 대한 설명’을 구분하세요</h4><div className={styles.metadataPair}>
    <article className={styles.metadataCard}><span className={styles.stageLabel}>실제 데이터에 해당하는 부분</span><h5>공원의 도형과 속성</h5><Diagram label="가상 공원 A의 폴리곤 도형과 속성 자료를 나타낸 예시. 이 도형 자체는 메타데이터가 아닙니다."><rect x="10" y="10" width="240" height="160" rx="12" fill="#eef5e3" /><polygon points="45,128 69,42 171,33 218,109 157,146" fill="#bad69f" stroke="#537d40" strokeWidth="3" /><text x="130" y="96" textAnchor="middle" fill="#476c38" fontSize="20" fontWeight="700">공원 A</text></Diagram><dl><div><dt>객체 ID</dt><dd>A</dd></div><div><dt>시설 유형</dt><dd>공원</dd></div></dl></article>
    <article className={styles.metadataCard}><span className={styles.stageLabel}>메타데이터에 해당하는 부분</span><h5>자료의 설명 카드</h5><dl className={styles.metadataFields}><div><dt>자료명</dt><dd>학습용 공원 경계</dd></div><div><dt>제작·관리 주체</dt><dd>가상 자료 관리기관</dd></div><div><dt>좌표 기준</dt><dd>사용한 CRS의 이름과 식별자</dd></div><div><dt>작성·갱신 시점</dt><dd>자료를 만들고 갱신한 날짜</dd></div><div><dt>범위·품질</dt><dd>대상 지역, 제작 방법, 정확도 등의 정보</dd></div><div><dt>이용 조건</dt><dd>사용 권한과 배포·활용 조건</dd></div></dl></article>
  </div><p className={styles.note}>메타데이터는 자료를 찾고 이해하며 목적에 맞게 사용할 수 있는지 판단하도록 돕습니다. 객체 A의 위치·모양·시설 유형 같은 실제 데이터와, 그 데이터셋의 제작 시점·좌표계·품질 설명은 역할이 다릅니다. 위 내용은 학습용 구성 예시입니다.</p></section>;
}

export function TechnicianExtraVisual({ number }: { number: number }) {
  if (number === 11) return <VectorBasics />;
  if (number === 12) return <GeocodingExample />;
  if (number === 13) return <UtmBasics />;
  if (number === 14) return <MetadataExample />;
  return null;
}
