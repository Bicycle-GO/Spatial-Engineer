import type { TechnicianPastQuestion } from "./technician-past";

export const technicianSecondSourceNote = "사용자가 제공한 기능사 학습 이미지 20문항을 ‘2차 기출’ 세트로 재구성했습니다. ‘2차’는 이 사이트의 세트 이름이며 공식 시행 회차를 뜻하지 않습니다. 시행 연도·회차와 공식 원문은 미확인입니다. 수치·용어 오류를 바로잡았으며 자가점검 기준은 공식 채점 기준이 아닙니다.";

// 도형 컴포넌트와 풀이가 같은 입력을 사용하도록 원문 수치를 한곳에 둡니다.
export const technicianSecondMedianInput: number[][] = [
  [202, 210, 235], [201, 100, 196], [168, 200, 208],
];
export const technicianSecondBooleanA: number[][] = [
  [0, 1, 0], [1, 1, 0], [1, 0, 0],
];
export const technicianSecondBooleanB: number[][] = [
  [1, 0, 0], [1, 1, 0], [0, 0, 0],
];
export const technicianSecondMaxInput: number[][] = [
  [7, 3, 5, 7, 1], [7, 5, 5, 1, 7], [5, 4, 2, 5, 9],
  [9, 2, 3, 8, 3], [0, 7, 1, 4, 7],
];
export const technicianSecondMedianMeanInput: number[][] = [
  [60, 120, 90], [90, 100, 150], [80, 200, 100],
];
export const technicianSecondReclassInput: number[][] = [
  [1, 1, 2, 4, 5, 4, 6, 7],
  [3, 3, 2, 6, 6, 5, 7, 7],
  [9, 8, 8, 3, 4, 1, 1, 5],
  [9, 9, 12, 12, 18, 4, 5, 8],
  [10, 10, 11, 14, 15, 17, 12, 11],
  [14, 15, 12, 12, 18, 14, 18, 15],
  [14, 16, 18, 20, 20, 22, 21, 19],
  [18, 17, 15, 19, 19, 26, 22, 21],
];
export const technicianSecondReclassRules = [
  { lower: 1, upper: 5, label: "1~5", result: 3 },
  { lower: 6, upper: 9, label: "6~9", result: 2 },
  { lower: 10, upper: 13, label: "10~13", result: 1 },
  { lower: 14, upper: 20, label: "14~20", result: 4 },
  { lower: 21, upper: 25, label: "21~25", result: 5 },
  { lower: 26, upper: Infinity, label: "26 이상", result: 6 },
];
// 행·열은 1부터 시작하며 각 셀 중심 사이의 가로·세로 간격은 같습니다.
export const technicianSecondNearestSamples = [
  { row: 1, column: 5, value: 122 },
  { row: 2, column: 2, value: 120 },
  { row: 2, column: 6, value: 80 },
  { row: 4, column: 1, value: 106 },
  { row: 4, column: 5, value: 90 },
  { row: 7, column: 3, value: 40 },
  { row: 7, column: 7, value: 100 },
];
export const technicianSecondNearestTargets = [
  { label: "①", row: 1, column: 3 },
  { label: "②", row: 4, column: 4 },
  { label: "③", row: 7, column: 4 },
];

export function technicianSecondMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
export function technicianSecondMaximumWindows(input: number[][]): number[][] {
  return input.slice(1, -1).map((_, row) => input[0].slice(1, -1).map((__, column) =>
    Math.max(...input.slice(row, row + 3).flatMap(line => line.slice(column, column + 3)))));
}
export function technicianSecondReclassify(value: number): number {
  const rule = technicianSecondReclassRules.find(item => value >= item.lower && value <= item.upper);
  if (!rule) throw new Error(`재분류 범위에 없는 값: ${value}`);
  return rule.result;
}
export const technicianSecondBooleanOutputs = {
  and: technicianSecondBooleanA.map((row, r) => row.map((value, c) => Number(Boolean(value) && Boolean(technicianSecondBooleanB[r][c])))),
  or: technicianSecondBooleanA.map((row, r) => row.map((value, c) => Number(Boolean(value) || Boolean(technicianSecondBooleanB[r][c])))),
  xor: technicianSecondBooleanA.map((row, r) => row.map((value, c) => Number(Boolean(value) !== Boolean(technicianSecondBooleanB[r][c])))),
};
export const technicianSecondMaxOutput = technicianSecondMaximumWindows(technicianSecondMaxInput);
export const technicianSecondReclassOutput = technicianSecondReclassInput.map(row => row.map(technicianSecondReclassify));

const focal = { label: "Esri · 이웃 영역의 중앙값·평균·최댓값 계산", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/spatial-analyst/how-focal-statistics-works.htm" };
const resample = { label: "Esri · 최근린·공일차·공삼차 재표본화", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/data-management/resample.htm" };
const topology = { label: "QGIS · 위상관계와 오버슈트·언더슈트", url: "https://docs.qgis.org/3.44/en/docs/gentle_gis_introduction/topology.html" };
const vector = { label: "QGIS · 점·선·면 벡터 자료", url: "https://docs.qgis.org/3.44/en/docs/gentle_gis_introduction/vector_data.html" };
const raster = { label: "QGIS · 셀과 영상소로 표현하는 래스터 자료", url: "https://docs.qgis.org/3.44/en/docs/gentle_gis_introduction/raster_data.html" };
const boolean = { label: "Esri · Boolean AND·OR·XOR·NOT", url: "https://doc.esri.com/en/arcgis-pro/latest/tool-reference/spatial-analyst/h-how-boolean-math-tools-work.html" };
const intersect = { label: "Esri · Intersect", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/intersect.htm" };
const union = { label: "Esri · Union", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/union.htm" };
const identity = { label: "Esri · Identity", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/identity.htm" };
const clip = { label: "Esri · Clip", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/clip.htm" };
const gridText = (grid: number[][]) => grid.map(row => row.join("  ")).join("\n");
const gridContext = (grid: number[][]) => grid.map((row, index) => `${index + 1}행: ${row.join(", ")}`);

export const technicianSecondQuestions: TechnicianPastQuestion[] = [
  {
    id: "technician-second-01", number: 1, category: "영상 필터", title: "3×3 영상의 중앙값 필터", format: "계산형",
    prompt: "다음 3×3 수치 영상에 중앙값 필터(median filter)를 적용할 때 중앙 셀에 할당할 값을 구하시오.",
    context: [...gridContext(technicianSecondMedianInput), "중앙 셀을 포함한 아홉 값을 모두 사용한다."],
    hint: "중앙에 놓인 기존 값과 중앙값은 다릅니다. 아홉 값을 작은 순서대로 정렬해 다섯 번째 값을 찾으세요.",
    modelAnswer: "201\n정렬: 100, 168, 196, 200, 201, 202, 208, 210, 235 → 다섯 번째 값 201",
    explanation: ["필터의 창 안에는 중앙의 100을 포함해 아홉 값이 들어 있습니다. 중앙 셀의 위치에 원래 적힌 100을 그대로 답하는 문제는 아닙니다.", "값을 오름차순으로 정렬하면 100, 168, 196, 200, 201, 202, 208, 210, 235입니다. 아홉 값의 가운데인 다섯 번째가 201이므로 출력 중앙값은 201입니다.", "중앙값 필터는 이웃의 순위를 이용하므로 매우 크거나 작은 값의 영향을 평균보다 덜 받습니다. 제공 이미지의 답안에 붙은 다른 숫자 목록과 100은 이 입력의 계산과 맞지 않아 바로잡았습니다."],
    criteria: ["입력 아홉 값을 빠짐없이 정렬했다.", "다섯 번째 값 201을 중앙 셀의 출력으로 적었다."],
    mistakes: ["중앙 셀에 원래 있던 100을 중앙값으로 고르는 것", "가장 큰 값과 작은 값의 평균을 중앙값으로 사용하는 것"],
    theoryChapterId: "image-processing", referenceUrls: [focal],
  },
  {
    id: "technician-second-02", number: 2, category: "영상 재표본화", title: "이웃 영상소 수로 보간법 구분", format: "연결형",
    prompt: "다음 영상 재배열(재표본화) 설명에 해당하는 보간법을 각각 쓰시오.",
    context: ["① 가까운 네 입력 영상소의 값을 가중해 출력값을 구한다.", "② 주위 4×4, 총 16개 입력 영상소로 곡면을 적합해 출력값을 구한다.", "③ 가장 가까운 한 입력 영상소의 값을 선택한다."],
    hint: "4개 → bilinear, 16개 → cubic, 가장 가까운 1개 → nearest neighbor를 연결합니다.",
    modelAnswer: "① 공일차 보간법(양선형 보간, bilinear interpolation)\n② 공삼차 보간법(cubic convolution/bicubic interpolation)\n③ 최근린 보간법(nearest neighbor)",
    explanation: ["공일차 보간은 가까운 네 셀 중심의 값을 가중해 새 값을 만듭니다. 지형 높이나 밝기처럼 연속적으로 변하는 자료를 부드럽게 표현할 때 사용합니다.", "공삼차 보간은 주위 16개 셀을 사용합니다. 입력에 없던 값이 생기거나 입력값 범위를 벗어날 수 있으므로, 토지이용 분류 코드에 그대로 적용하면 안 됩니다.", "최근린은 선택한 원래 셀 값을 복사하므로 새로운 중간 코드를 만들지 않습니다. 그러나 위치가 바뀌며 어떤 입력 셀이 생략되거나 여러 번 선택될 수 있어 전체 자료의 무손실을 보장하지는 않습니다.", "보간법의 속도 차이는 구현·자료 크기에 따라 달라집니다. 공삼차의 시간이 언제나 다른 방법의 2~3배라는 식으로 고정해서 외우지 않습니다."],
    criteria: ["① 공일차, ② 공삼차, ③ 최근린을 정확히 연결했다.", "네 셀·16셀·한 셀이라는 선택 원리를 구분했다."],
    mistakes: ["최근린이 새 값을 합성하지 않는다는 사실을 위치·배열까지 완전히 보존한다는 뜻으로 해석하는 것", "분류 코드에 공일차·공삼차를 사용해도 코드의 의미가 유지된다고 단정하는 것"],
    theoryChapterId: "image-processing", referenceUrls: [resample],
  },
  {
    id: "technician-second-03", number: 3, category: "영상 기하 보정", title: "직접법과 간접법의 사상 방향", format: "연결형",
    prompt: "디지털 영상의 기하학적 편위 수정에서 다음 두 처리 방향을 무엇이라고 하는지 쓰시오.",
    context: ["① 입력 영상 좌표 (x, y)에서 대응하는 출력 지도 좌표 (X, Y)를 계산한 뒤 출력 격자에 값을 배치한다.", "② 출력 격자의 위치 (X, Y)를 먼저 정하고 대응하는 입력 영상 위치 (x, y)를 역으로 찾은 뒤 재표본화한다.", "제공 교재의 직접법·간접법은 이 문항에서 전방 사상·역방향 사상의 의미로 사용한다."],
    hint: "입력에서 출력으로 보내는 방향과, 출력에서 입력을 찾아오는 방향을 비교하세요.",
    modelAnswer: "① 직접법(Direct Rectification, 전방 사상/forward mapping)\n② 간접법(Indirect Rectification, 역방향 사상/inverse mapping)",
    explanation: ["직접법은 입력 영상소를 출발점으로 삼아 출력 위치로 보냅니다. 최근린 방식으로 값을 배치하는 예에서는 원래 값을 쓸 수 있지만, 일부 출력 셀에는 값이 없거나 여러 입력 값이 겹칠 수 있습니다.", "간접법은 출력할 각 셀의 중심에서 출발해 입력 영상의 대응 위치를 찾습니다. 그 위치가 입력 셀 중심과 맞지 않으면 최근린·공일차·공삼차 등의 재표본화 규칙으로 값을 정합니다.", "따라서 ‘직접/간접’은 좌표를 찾아가는 방향이고, ‘최근린/공일차/공삼차’는 밝기값을 고르는 방법입니다. 서로 다른 기준의 분류를 섞지 않습니다.", "역방향 사상도 입력 영상 범위 밖이나 NoData 영역의 값까지 만들어 내지는 않습니다. 또한 직접법이라는 이유만으로 밝기값이나 자료 전체가 항상 보존되는 것은 아닙니다."],
    criteria: ["① 직접법, ② 간접법을 순서대로 적었다.", "입력→출력과 출력→입력의 방향 차이를 설명했다."],
    mistakes: ["직접법·간접법을 서로 다른 보간법의 이름으로 보는 것", "간접법이면 범위 밖을 포함한 모든 출력 셀에 유효한 관측값이 생긴다고 단정하는 것"],
    theoryChapterId: "image-errors",
    referenceUrls: [{ label: "MathWorks · 전방 사상의 빈 셀·중복 배치", url: "https://blogs.mathworks.com/steve/2006/04/28/spatial-transforms-forward-mapping/" }, { label: "MathWorks · 역방향 사상과 보간", url: "https://www.mathworks.com/help/images/ref/imwarp.html" }, { label: "GDAL · 출력 셀에서 입력 위치를 찾는 재투영", url: "https://gdal.org/en/stable/programs/gdalwarp.html" }],
  },
  {
    id: "technician-second-04", number: 4, category: "GIS 기초", title: "GIS의 주요 구성요소 세 가지", format: "단답형",
    prompt: "지형공간정보체계(GIS)의 기술적 주요 구성요소를 세 가지 쓰시오.",
    context: ["이 문항은 교재의 3요소 구분을 묻는다. 운영 체계까지 포함하는 5요소 구분과 구별한다."],
    hint: "작업할 장비, 작업에 쓰는 프로그램, 프로그램으로 관리할 자료를 생각해 보세요.",
    modelAnswer: "하드웨어, 소프트웨어, 데이터(데이터베이스)",
    explanation: ["하드웨어는 컴퓨터·서버·GNSS 수신기·스캐너처럼 수집과 처리를 수행하는 장비입니다.", "소프트웨어는 자료 입력·관리·분석·표현에 사용하는 GIS 프로그램과 관련 시스템입니다. 데이터는 지도상의 위치·모양과 대상의 속성 정보이며 데이터베이스에 체계적으로 저장할 수 있습니다.", "세 요소는 기술적 구성에 초점을 둔 교재식 구분입니다. 사람(조직·인력)과 방법(절차)을 더한 하드웨어·소프트웨어·데이터·사람·방법의 5요소도 널리 사용됩니다."],
    criteria: ["하드웨어·소프트웨어·데이터 세 요소를 썼다.", "데이터베이스를 GIS 소프트웨어 전체와 혼동하지 않았다."],
    mistakes: ["사람과 절차가 실제 GIS 운영에 필요하지 않다는 뜻으로 받아들이는 것", "GIS가 지도 그림을 보여 주는 프로그램 하나만을 뜻한다고 보는 것"],
    theoryChapterId: "spatial-basics",
    referenceUrls: [{ label: "Esri · 하드웨어·소프트웨어·데이터·방법·사람", url: "https://www.esri.com/about/newsroom/insider/fifth-part-of-gi" }],
  },
  {
    id: "technician-second-05", number: 5, category: "데이터 품질", title: "메타데이터와 두 가지 선 입력 오류", format: "단답형",
    prompt: "다음 설명에 해당하는 용어를 각각 쓰시오.",
    context: ["① 데이터의 내용·품질·생산자·좌표계·이력 등 데이터 자체를 설명하는 자료", "② 연결해야 할 교차점을 지나쳐 선이 끝난 디지타이징 오류", "③ 연결해야 할 교차점에 못 미친 채 선이 끝난 디지타이징 오류"],
    hint: "자료 설명서, 지나침, 미달이라는 세 단서를 구분하세요.",
    modelAnswer: "① 메타데이터(Metadata)\n② 오버슈트(Overshoot)\n③ 언더슈트(Undershoot)",
    explanation: ["메타데이터는 데이터를 이해하고 선택하도록 돕는 설명 자료입니다. 예를 들어 ‘2025년 조사, 좌표계 EPSG:5186, 생산 기관, 위치 정확도’와 같은 정보를 담을 수 있습니다.", "오버슈트는 원래 연결되어야 할 지점을 넘겨 그린 선 끝입니다. 실제 교차점 뒤로 짧은 꼬리가 남아 있는 모습으로 이해할 수 있습니다.", "언더슈트는 연결되어야 할 지점 앞에서 선이 끊긴 경우입니다. 눈에는 거의 맞닿아 보여도 좌표가 떨어져 있으면 경로 분석에서 연결되지 않을 수 있습니다.", "선 끝이 다른 선과 연결되지 않았다고 모두 오류인 것은 아닙니다. 막다른 길 등 실제로 끝나는 객체와 고가도로처럼 평면상 교차해도 연결되지 않는 객체는 자료의 목적에 맞춰 판단합니다."],
    criteria: ["① 메타데이터, ② 오버슈트, ③ 언더슈트를 순서대로 썼다.", "지나침과 미달의 차이를 연결 의도와 함께 설명했다."],
    mistakes: ["오버슈트와 언더슈트를 반대로 적는 것", "모든 선 교차점을 자동으로 연결해 고가도로의 상하 관계까지 없애는 것"],
    theoryChapterId: "topology", referenceUrls: [topology, { label: "OGC · 데이터를 설명하는 메타데이터의 검색", url: "https://www.ogc.org/standards/cat/" }],
  },
  {
    id: "technician-second-06", number: 6, category: "중첩분석", title: "Union·Intersect·Identity의 결과 범위", format: "도형형",
    prompt: "제시된 두 레이어에 Union, Intersect, Identity를 적용한 결과 범위를 그리시오. 이 그림 연습에서는 바깥 배경에도 영역 번호 1을 붙이는 제공 도면의 관례로 개수를 적고, 배경을 제외하는 학습용 조건과 구분하시오.",
    context: ["입력 A: 직사각형을 2×2로 나눈 네 면. 중첩 B: 원을 대각선으로 나눈 두 반원 면.", "제공 답안 도면은 데이터가 없는 바깥 배경에도 번호 1을 붙여 13·7·11개로 표시했다.", "실제 피처 수를 비교할 때는 바깥 배경을 피처로 보지 않고, 떨어진 조각을 각각의 단일부분(singlepart) 면으로 센다."],
    hint: "Union은 어느 쪽이든 있는 곳, Intersect는 양쪽에 모두 있는 곳, Identity는 입력 A 전체를 유지합니다. 종이 배경과 데이터 피처를 구분하세요.",
    modelAnswer: "[첨부 도면 답안 · 배경 1 포함]\nUnion 13개 / Intersect 7개 / Identity 11개\n\n[학습용 명시 조건 · 배경 제외, 네 사각 면과 두 반원 면을 입력하고 분리 조각을 각각 셈]\nUnion 12조각 / Intersect 6조각 / Identity 10조각\n\n결과 범위: Union=A∪B / Intersect=A∩B / Identity=A를 유지하고 B의 경계로 분할.",
    explanation: ["Union은 A 또는 B가 차지하는 범위를 남기며 양쪽 경계를 반영합니다. 원의 위·아래 돌출 부분도 남지만 두 자료 모두 없는 종이 바깥 배경은 자동으로 출력 피처가 되지 않습니다.", "Intersect는 A와 B가 겹치는 범위만 남깁니다. 따라서 직사각형 밖으로 나온 원의 위·아래 부분은 제외하고, 겹친 범위 안의 양쪽 경계로 조각을 나눕니다.", "Identity는 입력 A의 범위를 유지합니다. A 안에서 B와 겹친 부분은 B의 경계·속성을 반영하고, A에만 있는 부분도 남깁니다. 입력 레이어를 바꾸면 유지 범위도 달라집니다.", "제공 이미지의 13·7·11은 바깥 배경 1까지 센 도면 번호입니다. 네 사각 면과 두 반원 면만 피처로 정의하고 분리 조각을 세는 이 학습용 조건에서는 12·6·10입니다. 원문의 실제 작업 범위·속성·multipart 설정은 미확인이라 특정 GIS의 레코드 수에 대한 공식 정답으로 단정하지 않습니다."],
    criteria: ["세 연산의 결과 범위를 올바르게 구분했다.", "제공 도면의 영역 번호 13·7·11에 배경이 포함됐음을 명시했다.", "실제 피처 수를 쓸 때 배경 제외·단일부분 집계 조건을 밝혔다."],
    mistakes: ["Intersect 결과에 A 밖의 원 부분을 남기는 것", "데이터가 없는 바깥 배경을 일반적인 출력 면 피처로 세는 것", "Identity를 적용하며 입력과 중첩 레이어의 역할을 바꾸는 것"],
    theoryChapterId: "overlay-analysis", referenceUrls: [union, intersect, identity],
  },
  {
    id: "technician-second-07", number: 7, category: "래스터 논리", title: "두 격자의 AND·OR·XOR 결과", format: "격자형",
    prompt: "두 입력 격자의 같은 위치 셀에 AND, OR, XOR를 각각 적용한 3×3 결과를 작성하시오. 참은 1, 거짓은 0이다.",
    context: ["입력 A", ...gridContext(technicianSecondBooleanA), "입력 B", ...gridContext(technicianSecondBooleanB), "같은 행·열끼리 비교하며 NoData는 없다."],
    hint: "AND는 둘 다 1, OR는 하나 이상 1, XOR는 정확히 하나만 1일 때 결과가 1입니다.",
    modelAnswer: `AND\n${gridText(technicianSecondBooleanOutputs.and)}\n\nOR\n${gridText(technicianSecondBooleanOutputs.or)}\n\nXOR\n${gridText(technicianSecondBooleanOutputs.xor)}`,
    explanation: ["두 격자의 같은 위치를 한 쌍씩 비교합니다. 첫 행 첫 셀은 A=0, B=1이므로 AND=0, OR=1, XOR=1입니다.", "둘째 행 첫째·둘째 셀은 모두 A=1, B=1입니다. AND와 OR는 1이지만, XOR는 둘 다 참인 경우를 제외하므로 0입니다.", "OR와 XOR가 달라지는 핵심은 (1,1)인 셀입니다. XOR를 단순히 ‘둘 중 하나 이상’으로 외우면 이 두 셀을 잘못 채우게 됩니다.", "이 연산은 셀 위치를 이동시키지 않습니다. 실제 두 래스터를 결합할 때도 좌표계·해상도·격자 정렬이 맞는지 확인해야 합니다."],
    criteria: ["AND·OR·XOR의 세 결과를 3×3 위치를 유지해 작성했다.", "(1,1) 입력에서 XOR 결과를 0으로 처리했다."],
    mistakes: ["OR와 XOR의 결과를 같게 쓰는 것", "서로 다른 행·열의 값을 비교하는 것"],
    theoryChapterId: "overlay-analysis", referenceUrls: [boolean],
  },
  {
    id: "technician-second-08", number: 8, category: "위상관계", title: "점·선·면과 위상관계의 기본 용어", format: "단답형",
    prompt: "다음 위상관계 설명의 ①~⑥에 들어갈 용어를 쓰시오.",
    context: ["벡터의 기본 형태는 ①, ②, ③이다.", "④은 선형 객체를 따라 한 지점에서 다른 지점으로 이동할 수 있게 이어진 관계이다.", "⑤은 객체가 다른 면의 내부에 들어 있는 관계이다.", "⑥은 서로 이웃하는 폴리곤 사이의 관계이다.", "제공 교재는 ⑤을 포함성(계급성)이라고 표기한다."],
    hint: "정류장·도로·공원으로 기본 형태를 떠올리고, 이어짐·안에 있음·이웃함을 연결하세요.",
    modelAnswer: "① 점  ② 선  ③ 면\n④ 연결성(Connectivity)\n⑤ 포함성·포함관계(Containment, 교재 표기: 계급성)\n⑥ 인접성(Adjacency)",
    explanation: ["점·선·면은 위치와 모양을 표현하는 기본 벡터 형태입니다. 위상은 이 객체들이 어떻게 연결되고 포함되며 이웃하는지 다룹니다.", "연결성은 도로·관로가 어디에서 실제로 이어지는지를 설명합니다. 지도에서 선이 교차해 보여도 고가도로처럼 통행 연결이 없으면 연결 노드로 처리하면 안 됩니다.", "포함성은 학교 위치가 어느 행정구역 안에 있는지처럼 내부에 속하는 관계입니다. 인접성은 두 행정구역이 경계를 공유해 이웃하는 관계의 예로 이해할 수 있습니다.", "이 문항의 ‘계급성’은 제공 교재의 용어 표기입니다. 일반적인 조직의 등급·계층과 모든 공간 포함관계를 같은 개념으로 확장해 외우지 않습니다."],
    criteria: ["점·선·면을 모두 적었다.", "연결성·포함성·인접성을 해당 설명과 연결했다."],
    mistakes: ["가깝게 있는 것과 실제로 연결된 것을 같게 보는 것", "포함관계와 서로 맞닿은 인접관계를 혼동하는 것"],
    theoryChapterId: "topology", referenceUrls: [topology, vector],
  },
  {
    id: "technician-second-09", number: 9, category: "영상 필터", title: "5×5 래스터의 3×3 최댓값 창", format: "격자형",
    prompt: "아래 5×5 래스터에 3×3 최댓값 창(maximum kernel)을 이동시켜 적용한 결과를 작성하시오. 창 전체가 입력 안에 들어오는 위치만 계산하여 3×3 결과를 만든다.",
    context: [...gridContext(technicianSecondMaxInput), "경계 패딩 없이 계산한다. 출력 첫 셀은 입력의 1~3행·1~3열 창에 해당한다."],
    hint: "창마다 아홉 값의 합이나 평균이 아니라 가장 큰 값 하나를 고르세요. 창을 오른쪽으로 한 칸씩 옮깁니다.",
    modelAnswer: gridText(technicianSecondMaxOutput),
    explanation: ["첫 창의 값은 7,3,5 / 7,5,5 / 5,4,2입니다. 이 중 최댓값은 7이므로 결과의 첫 셀에 7을 씁니다.", "입력 1~3행의 창을 가로로 옮기면 7, 7, 9가 됩니다. 2~4행에서는 9, 8, 9, 3~5행에서도 9, 8, 9가 됩니다.", "패딩을 하지 않으므로 5×5 입력에 3×3 창을 놓을 수 있는 위치는 가로 세 곳·세로 세 곳입니다. 출력은 3×3이며 원래 5×5의 모든 바깥 셀을 따로 채우지 않습니다.", "최댓값 필터는 창 안의 큰 값을 주변으로 확장하는 성질이 있습니다. 밝은 작은 객체를 강조할 수 있지만 잡음도 커질 수 있어 처리 목적을 확인합니다."],
    criteria: ["출력 첫 행을 7,7,9로 작성했다.", "출력 둘째·셋째 행을 각각 9,8,9로 작성했다.", "패딩 없는 3×3 출력 크기를 지켰다."],
    mistakes: ["각 창에서 가운데 셀의 값만 복사하는 것", "입력 전체의 최댓값 9를 모든 출력 셀에 쓰는 것", "경계 처리 조건 없이 5×5 결과를 만드는 것"],
    theoryChapterId: "image-processing", referenceUrls: [focal],
  },
  {
    id: "technician-second-10", number: 10, category: "공간정보 서비스", title: "OGC 웹서비스 약어와 역할", format: "단답형",
    prompt: "OGC 표준인 ① WCS, ② WFS, ③ WMS, ④ WPS의 영문 명칭과 주요 기능을 설명하시오. 참고 용어 CSW와 GML의 차이도 확인하시오.",
    context: ["① WCS  ② WFS  ③ WMS  ④ WPS", "참고: CSW는 카탈로그 서비스, GML은 XML 기반 지리정보 표현·교환 표준이다.", "이들을 전부 ‘GML 웹서비스’라고 묶지 않는다."],
    hint: "Coverage=수치 자료, Feature=객체, Map=지도 이미지, Processing=처리를 연결하세요.",
    modelAnswer: "① WCS: Web Coverage Service — 커버리지 자료 제공\n② WFS: Web Feature Service — 지리 피처와 속성 접근\n③ WMS: Web Map Service — 지도 이미지 제공\n④ WPS: Web Processing Service — 공간정보 처리 실행\n참고: CSW=Catalogue Service for the Web(메타데이터 검색), GML=Geography Markup Language(XML 기반 지리정보 표현·교환 언어)",
    explanation: ["WCS는 표고·기온 등의 커버리지 자료에 접근하는 서비스입니다. WMS는 화면에 그릴 지도 이미지를 제공하므로, WMS 그림을 받는 것과 분석할 원래 수치 자료를 받는 것은 다릅니다.", "WFS는 도로·건물 같은 지리 객체와 그 속성에 접근합니다. WPS는 처리 과정의 입력·출력과 실행 요청을 표준화하며, 예를 들어 서버에 중첩 분석 실행을 요청하는 상황에 해당합니다.", "CSW는 데이터·서비스의 메타데이터를 등록하고 검색하는 카탈로그 계열 서비스입니다. 자료 그 자체의 모든 내용을 지도 이미지로 보내는 기능과 구별합니다.", "GML은 지리 객체를 XML로 표현하고 교환하는 인코딩 언어입니다. WCS·WFS·WMS·WPS·CSW는 서비스 인터페이스 표준이며, 모두가 같은 GML 문서를 반환해야 한다는 뜻은 아닙니다."],
    criteria: ["네 약어의 정확한 영문 명칭을 썼다.", "수치 커버리지·피처·지도 이미지·처리라는 기능을 구별했다.", "GML을 웹서비스 명칭으로 쓰지 않았다."],
    mistakes: ["WMS가 원래 벡터 객체와 모든 속성을 그대로 반환한다고 보는 것", "WCS와 WFS를 바꿔 쓰는 것", "GML과 CSW를 같은 종류의 파일 형식으로 보는 것"],
    theoryChapterId: "content-production",
    referenceUrls: [{ label: "OGC · WCS", url: "https://www.ogc.org/standards/wcs/" }, { label: "OGC · WFS", url: "https://www.ogc.org/standards/wfs/" }, { label: "OGC · WMS", url: "https://www.ogc.org/standards/wms/" }, { label: "OGC · WPS", url: "https://www.ogc.org/standards/wps/" }, { label: "OGC · Catalogue/CSW", url: "https://www.ogc.org/standards/cat/" }, { label: "OGC · GML", url: "https://www.ogc.org/standards/gml/" }],
  },
  {
    id: "technician-second-11", number: 11, category: "영상 필터", title: "중앙값과 평균 필터 비교 계산", format: "계산형",
    prompt: "다음 3×3 영상에 중앙값 필터와 산술평균 필터를 각각 적용할 때, 2행 2열의 출력값을 계산하시오. 두 필터 모두 중앙 셀을 포함한 아홉 값을 사용한다.",
    context: [...gridContext(technicianSecondMedianMeanInput), "평균은 3×3의 모든 셀에 동일한 가중치 1/9를 적용한다."],
    hint: "중앙값은 정렬 후 다섯 번째, 평균은 아홉 값의 합을 9로 나눈 값입니다.",
    modelAnswer: "중앙값: 100\n정렬: 60, 80, 90, 90, 100, 100, 120, 150, 200\n평균: (60+120+90+90+100+150+80+200+100)÷9 = 990÷9 = 110",
    explanation: ["정렬한 아홉 값의 다섯 번째가 100이므로 중앙값 필터의 출력은 100입니다. 같은 값이 두 번 있으면 두 셀을 모두 포함합니다.", "산술평균 필터는 중앙 100을 포함한 아홉 셀의 합 990을 9로 나눕니다. 출력은 정확히 110이며 별도의 반올림이 필요하지 않습니다.", "제공 이미지의 평균식은 100 한 개를 빠뜨리고 8로 나누어 111.3으로 제시했지만, 이 문항의 3×3 평균 필터 조건과 맞지 않아 수정했습니다.", "두 필터의 답이 다른 이유는 중앙값은 값의 순위, 평균은 모든 값의 합을 이용하기 때문입니다. 큰 값 200이 평균에 미치는 영향과 중앙값에 미치는 영향을 비교해 보세요."],
    criteria: ["중앙값을 100으로 계산했다.", "아홉 셀의 합 990과 분모 9를 사용해 평균 110을 구했다."],
    mistakes: ["중복된 100을 하나만 세어 여덟 값으로 계산하는 것", "중앙 셀을 제외하는 별도 8이웃 평균을 이 문항에 적용하는 것", "평균과 중앙값이 항상 같다고 보는 것"],
    theoryChapterId: "image-processing", referenceUrls: [focal],
  },
  {
    id: "technician-second-12", number: 12, category: "영상 재표본화", title: "보간법을 수식·거리 설명과 연결", format: "연결형",
    prompt: "다음 재표본화 설명에 해당하는 방법을 쓰시오.",
    context: ["① 인접한 16개 영상소로 곡면을 적합해 새 값을 계산한다.", "② 인접한 네 영상소의 거리 관련 가중치를 적용해 값을 계산한다.", "③ 입력에서 가장 가까운 셀의 값을 선택한다."],
    hint: "공삼차는 4×4, 공일차는 2×2, 최근린은 한 셀을 사용합니다.",
    modelAnswer: "① 공삼차 보간법(bicubic/cubic convolution)\n② 공일차 보간법(bilinear interpolation)\n③ 최근린 보간법(nearest neighbor)",
    explanation: ["공삼차는 주위 16개의 값을 이용하므로 ①과 연결합니다. 더 부드러운 연속 표면을 만들 수 있지만 원래 범위를 벗어난 값이 나올 수 있습니다.", "공일차는 가까운 네 셀 중심의 값에 가중치를 적용하므로 ②입니다. 단순히 네 값의 무조건적인 산술평균을 내는 방법은 아닙니다.", "최근린은 가장 가까운 입력 셀 하나를 선택하므로 ③입니다. 산림=1·시가지=2 같은 분류 코드의 중간값 1.5를 새로 만들지 않는다는 점이 중요합니다.", "이 문항은 2번과 같은 개념을 다른 순서로 확인합니다. 문제 번호가 아니라 16개·네 개·한 개라는 처리 원리를 보고 판단하세요."],
    criteria: ["① 공삼차, ② 공일차, ③ 최근린을 순서대로 썼다.", "공일차의 가중 계산과 최근린의 단일 값 선택을 구분했다."],
    mistakes: ["2번 문항의 답 순서를 그대로 외워 옮기는 것", "공일차에서 입력값의 위치와 거리를 무시하고 항상 같은 가중치를 주는 것"],
    theoryChapterId: "image-processing", referenceUrls: [resample],
  },
  {
    id: "technician-second-13", number: 13, category: "공간 데이터 표현", title: "교재에서 구분하는 도형정보 여섯 요소", format: "단답형",
    prompt: "제공 교재가 도형정보의 표현 요소로 나열한 여섯 가지를 쓰시오.",
    context: ["이 문항은 벡터·래스터·지도 표현을 함께 포함한 교재의 분류를 묻는다.", "‘벡터 데이터의 기본 형태 여섯 가지’를 묻는 것은 아니다."],
    hint: "벡터의 점·선·면, 래스터의 셀·영상소, 지도에 그리는 기호로 나누어 기억하세요.",
    modelAnswer: "점, 선, 면, 격자 셀, 영상소(픽셀), 기호",
    explanation: ["이 여섯 항목은 제공 교재의 도형정보 표현 분류입니다. 점은 정류장 위치, 선은 도로 중심선, 면은 공원 구역처럼 좌표로 표현하는 기본 벡터 형태입니다.", "격자 셀과 영상소는 래스터의 규칙적인 칸을 설명할 때 사용하는 용어입니다. 영상에서는 픽셀이라고 부르며 밝기나 밴드 값을 저장할 수 있습니다. 두 용어가 항상 별개의 독립 자료형인 것은 아닙니다.", "기호는 객체를 지도에 보이게 그리는 표현입니다. 예를 들어 같은 점 자료를 병원 십자나 원형 표식으로 그릴 수 있지만, 표시 기호를 바꿨다고 점 좌표 자체가 바뀌는 것은 아닙니다.", "따라서 이 답안을 국제적으로 고정된 여섯 벡터 형식이나 모든 GIS의 유일한 데이터 분류로 확대하지 않습니다. 벡터의 기본 형태를 따로 물으면 점·선·면을 답합니다."],
    criteria: ["제공 교재의 여섯 요소를 빠짐없이 적었다.", "벡터 형태·래스터 칸·지도 기호의 차이를 구분했다."],
    mistakes: ["픽셀과 격자 셀을 점·선·면과 함께 모두 벡터 형식이라고 부르는 것", "지도 기호와 저장된 객체의 실제 지오메트리를 동일시하는 것"],
    theoryChapterId: "spatial-modeling", referenceUrls: [vector, raster],
  },
  {
    id: "technician-second-14", number: 14, category: "데이터베이스", title: "데이터베이스 관리의 장점과 부담", format: "서술형",
    prompt: "데이터베이스를 이용해 자료를 관리할 때 기대되는 장점과 관리상 단점·부담을 각각 세 가지 쓰시오.",
    context: ["장점은 적절한 설계·운영을 전제로 설명한다. 모든 중복이나 보안 문제가 자동으로 사라진다고 표현하지 않는다."],
    hint: "공유·일관성·독립성을 장점으로, 구축비·관리 복잡성·장애 및 보안 대응을 부담으로 생각해 보세요.",
    modelAnswer: "장점 ① 자료 공유와 통합 관리 ② 중복을 줄이고 일관성·무결성을 관리하기 쉬움 ③ 응용 프로그램과 자료 저장 구조의 독립성 향상\n단점·부담 ① 구축·운영 비용과 자원 필요 ② 설계·권한·백업 등 전문 관리의 복잡성 ③ 장애·보안 사고의 영향에 대비한 복구·접근 통제 필요",
    explanation: ["같은 시설 자료를 부서별 파일로 각각 보관하면 한 부서만 수정해 서로 다른 값이 남을 수 있습니다. 공유 데이터베이스와 적절한 제약조건은 이런 중복·불일치를 줄이는 데 도움이 됩니다.", "데이터 독립성은 자료의 물리적 저장 방식 등이 바뀔 때 응용 프로그램에 미치는 영향을 줄이는 성질입니다. 모든 구조 변경이 모든 프로그램과 완전히 무관하다는 뜻은 아닙니다.", "서버·저장공간·소프트웨어·운영 인력이 필요하며, 설계·성능·접근권한·백업을 관리해야 합니다. 비용은 제품과 규모에 따라 다르므로 장비가 언제나 비싸다고 단정하지 않습니다.", "통합 자료에 장애나 무단 접근이 발생하면 영향이 커질 수 있어 복구 계획과 권한 관리가 필요합니다. 데이터베이스 자체가 본질적으로 항상 불안전하다는 뜻은 아니며, 복제·백업처럼 의도적인 중복도 활용합니다."],
    criteria: ["서로 다른 장점 세 가지를 적었다.", "비용·관리·장애/보안 대응 등 서로 다른 부담 세 가지를 적었다.", "중복·일관성·보안에 대한 무조건적 표현을 피했다."],
    mistakes: ["데이터베이스는 중복을 절대로 허용하지 않는다고 쓰는 것", "데이터베이스를 설치하면 백업·보안 관리가 필요 없다고 보는 것", "자료 독립성을 변경 영향이 전혀 없다는 뜻으로 쓰는 것"],
    theoryChapterId: "relational-database",
    referenceUrls: [{ label: "IBM · 데이터베이스의 공유·무결성·보안 관리", url: "https://www.ibm.com/think/topics/database" }, { label: "IBM · 자료 독립성과 필요한 정보의 접근", url: "https://www.ibm.com/docs/en/ims/15.4.0?topic=concepts-storing-processing-information-in-database" }, { label: "IBM · 의도적·비의도적 데이터 중복", url: "https://www.ibm.com/think/topics/data-redundancy" }],
  },
  {
    id: "technician-second-15", number: 15, category: "공간분석 기법", title: "거리·적지·경로·지형에 맞는 분석", format: "연결형",
    prompt: "다음 목적에 적합한 공간분석 방법을 각각 쓰시오.",
    context: ["① 시설에서 일정 거리 안의 주변 지역을 찾는다.", "② 경사·토지이용·접근성 등 여러 조건을 결합해 적지를 찾는다.", "③ 도로의 최단 경로나 상·하수도 관망의 연결을 분석한다.", "④ 표고를 이용해 경사도·경사방향과 입체 지형을 분석한다."],
    hint: "주변 거리 → 근접, 조건 결합 → 중첩, 연결망 → 망, 높이와 지형 표면 → 3차원 분석입니다.",
    modelAnswer: "① 근접분석(예: 버퍼분석)\n② 중첩분석(예: 조건 중첩·가중 중첩)\n③ 망분석(네트워크 분석)\n④ 지형 표면·3차원 분석",
    explanation: ["근접분석은 무엇이 무엇에 가까운지 다룹니다. 예를 들어 역에서 500m 안의 지역은 버퍼로 나타낼 수 있으며, 특정 지점과 가장 가까운 시설을 찾는 최근접 분석도 근접분석의 한 종류입니다.", "적지분석에서는 여러 기준을 같은 공간에서 결합합니다. 예를 들어 완만한 경사·개발 가능한 토지이용·도로 접근성이라는 자료를 재분류한 뒤 중첩해 후보지를 평가할 수 있습니다.", "망분석은 선의 연결·통행 방향·거리나 시간 비용을 고려합니다. 지도에서 직선거리가 가장 짧은 길과 실제 도로망에서 가장 빨리 갈 수 있는 길은 다를 수 있습니다.", "표고에 기반한 경사·경사방향은 지형 표면 분석이며 입체 지형 표현과 연결됩니다. 제공 이미지에서 인접지역과 적지분석에 대응한 답의 순서가 혼동되므로 목적에 맞게 수정했습니다."],
    criteria: ["① 근접·버퍼, ② 중첩, ③ 망, ④ 지형 표면·3차원을 연결했다.", "일정 거리의 주변과 여러 조건을 결합하는 적지분석을 구별했다."],
    mistakes: ["적지분석을 항상 가장 가까운 곳 하나를 찾는 최근린 분석이라고 보는 것", "도로의 실제 연결이나 통행 제한을 무시하고 직선거리만으로 최단 경로를 결정하는 것"],
    theoryChapterId: "spatial-analysis",
    referenceUrls: [{ label: "Esri · 근접분석과 버퍼", url: "https://enterprise.arcgis.com/en/portal/10.7/use/perform-analysis.htm" }, { label: "Esri · 적지 모델의 가중 중첩", url: "https://doc.esri.com/en/arcgis-pro/latest/tool-reference/spatial-analyst/how-weighted-overlay-works.html" }, { label: "Esri · 표고에서 경사·경사방향을 구하는 표면 분석", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/3d-analyst/an-overview-of-the-raster-surface-toolset.htm" }, topology],
  },
  {
    id: "technician-second-16", number: 16, category: "논리와 영역", title: "음영 영역을 Boolean 식으로 쓰기", format: "도형형",
    prompt: "두 영역 A·B의 그림에서 다음 음영 부분을 나타내는 논리식을 각각 쓰시오.",
    context: ["① A와 B가 겹치는 부분만 음영이다.", "② A 또는 B에 들어 있는 전체 부분이 음영이다.", "③ A에 들어 있으면서 B에는 없는 부분만 음영이다."],
    hint: "③은 단순한 NOT B가 아닙니다. 먼저 A에 속해야 한다는 조건을 함께 적으세요.",
    modelAnswer: "① A AND B = A∩B\n② A OR B = A∪B\n③ A AND NOT B = A−B",
    explanation: ["AND는 두 조건을 모두 만족하는 공통 영역이므로 ①입니다. 예를 들어 역세권 A이면서 개발 가능 지역 B인 곳을 찾는 상황입니다.", "OR는 어느 쪽이든 하나 이상에 속하는 영역이므로 ②입니다. 겹친 부분도 포함하며 XOR와 구별합니다.", "③은 A에 속하는 곳에서 B와 겹친 부분을 뺀 차집합입니다. ‘A NOT B’라는 교재식 축약 대신 A AND NOT B로 쓰면 두 조건이 분명해집니다.", "NOT B만 쓰면 정한 전체 조사 범위 안에서 B가 아닌 모든 곳이 포함되어 A 밖까지 선택될 수 있습니다. ‘A에서 B를 뺀 것’이라는 조건을 빠뜨리면 안 됩니다."],
    criteria: ["① AND, ② OR를 올바르게 썼다.", "③을 A AND NOT B 또는 A−B로 표현했다.", "단독 NOT B와 A−B의 범위 차이를 설명했다."],
    mistakes: ["③에 NOT B만 쓰는 것", "OR의 겹친 부분을 빼고 XOR처럼 표시하는 것"],
    theoryChapterId: "overlay-analysis", referenceUrls: [boolean, { label: "Esri · 입력에서 다른 영역을 제외하는 Erase", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/erase.htm" }],
  },
  {
    id: "technician-second-17", number: 17, category: "래스터 재분류", title: "8×8 격자의 구간별 코드 변경", format: "격자형",
    prompt: "다음 8×8 격자의 속성값을 제시한 조건에 따라 재분류하여 최종 성과물을 작성하시오.",
    context: ["재분류 조건(정수, 양 끝값 포함): 1~5→3 / 6~9→2 / 10~13→1 / 14~20→4 / 21~25→5 / 26 이상→6", ...gridContext(technicianSecondReclassInput)],
    hint: "셀 위치는 유지하고 값만 새 코드로 바꿉니다. 5/6, 9/10, 13/14, 20/21, 25/26 경계부터 확인하세요.",
    modelAnswer: gridText(technicianSecondReclassOutput),
    explanation: ["첫 행의 1,1,2,4,5,4는 1~5 구간이므로 모두 3이고, 6·7은 6~9 구간이므로 2입니다. 따라서 첫 행은 3,3,3,3,3,3,2,2입니다.", "10~13은 1로, 14~20은 4로 바꿉니다. 예를 들어 5행의 10,10,11,14,15,17,12,11은 1,1,1,4,4,4,1,1이 됩니다.", "마지막 행의 26만 새 코드 6이고, 22·21은 새 코드 5입니다. 19는 14~20 구간이므로 4입니다.", "재분류는 원래 값의 의미를 새 범주로 묶는 처리입니다. 값을 크기순으로 정렬하거나 행·열을 이동시키지 않으며, 새 코드가 클수록 원래 값도 항상 크다는 가정도 하지 않습니다."],
    criteria: ["8행×8열을 유지해 64셀을 채웠다.", "구간 양 끝값을 정확히 적용했다.", "26을 6으로, 21·22를 5로 재분류했다."],
    mistakes: ["5를 6~9 구간에 넣거나 20을 21~25 구간에 넣는 것", "원래 1인 셀에 새 코드 1을 그대로 유지하는 것", "행·열을 정렬해 공간 위치를 바꾸는 것"],
    theoryChapterId: "processing",
    referenceUrls: [{ label: "Esri · 래스터 값의 재분류", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/spatial-analyst/reclassify.htm" }],
  },
  {
    id: "technician-second-18", number: 18, category: "공간 보간", title: "가장 가까운 표고값 선택", format: "계산형",
    prompt: "다음 수치표고 격자의 ①~③ 위치에 최단 거리(최근린) 보간을 적용한 값을 구하시오. 가로·세로의 셀 중심 간격은 같다고 가정한다.",
    context: ["7×7 격자이며 행은 위에서 아래, 열은 왼쪽에서 오른쪽으로 1부터 센다.", "기지점: (1행5열)=122, (2행2열)=120, (2행6열)=80, (4행1열)=106, (4행5열)=90, (7행3열)=40, (7행7열)=100", "미지점: ①(1행3열), ②(4행4열), ③(7행4열)", "화면에 늘려 그린 표의 외관 대신 동일 간격의 셀 중심 좌표로 거리를 비교한다."],
    hint: "각 미지점에서 모든 기지점까지의 거리를 비교해 가장 가까운 한 점의 값을 복사합니다. 가까운 두 값의 평균을 내지 않습니다.",
    modelAnswer: "① 120\n② 90\n③ 40",
    explanation: ["①에서 120 지점까지는 행 차이 1·열 차이 1이므로 거리는 √2칸입니다. 122까지는 가로 2칸이므로 120 지점이 더 가깝습니다.", "② 바로 오른쪽 한 칸에 표고 90인 기지점이 있습니다. 다른 기지점보다 가까우므로 ②는 90입니다.", "③ 바로 왼쪽 한 칸에 표고 40인 기지점이 있으므로 ③은 40입니다. 가장 가까운 기지점의 값을 선택하므로 세 답에 새로운 중간 높이를 합성하지 않습니다.", "이 예에서는 최단 거리가 같은 기지점이 없어 답이 하나로 정해집니다. 실제 자료에서 동률이 생기면 도구의 선택 규칙을 확인해야 합니다."],
    criteria: ["① 120, ② 90, ③ 40을 순서대로 썼다.", "①에서 대각선 √2와 가로 2의 거리를 비교했다."],
    mistakes: ["①과 같은 행의 122를 무조건 가장 가깝다고 고르는 것", "주변 표고를 평균해 최근린 보간이라고 쓰는 것", "표의 가로·세로 출력 비율을 실제 거리로 해석하는 것"],
    theoryChapterId: "spatial-interpolation", referenceUrls: [resample],
  },
  {
    id: "technician-second-19", number: 19, category: "중첩분석", title: "Intersect와 Clip의 경계·속성 차이", format: "도형형",
    prompt: "토지이용과 원래 행정구역 레이어를 Intersect한 결과를 그리시오. 또 행정구역들을 결합(Dissolve)한 단일 외곽을 마스크로 사용해 토지이용을 Clip한 결과를 그리시오.",
    context: ["Intersect에는 행정구역의 원래 구분을 사용한다.", "Clip에서는 토지이용이 입력이다. 행정구역들을 내부 경계 없이 하나로 결합한 외곽이 Clip 마스크이다.", "두 레이어의 범위·내부 경계·무늬를 보고 공통 범위에 남는 부분을 표시한다.", "이 Clip 조건에서는 토지이용 속성을 유지하며 행정구역의 내부 경계·속성을 결합하지 않는다."],
    hint: "같은 공통 범위를 남기더라도 Intersect는 양쪽 정보를 결합하고, Clip은 입력을 경계로 잘라냅니다.",
    modelAnswer: "Intersect: 두 레이어가 겹치는 범위 안에서 토지이용 경계와 원래 행정구역 경계를 함께 반영해 분할한다. 양쪽 속성이 결합된다.\nClip: 행정구역들을 Dissolve한 외곽 안의 토지이용 부분만 남긴다. 토지이용의 경계·속성은 유지하고 행정구역 내부 경계·속성은 추가하지 않는다.",
    explanation: ["Intersect는 두 입력의 공통 범위를 구하면서 양쪽의 내부 경계를 반영합니다. 예를 들어 같은 논 구역도 서로 다른 행정구역에 걸쳐 있으면 행정 경계에 따라 나뉘고 양쪽 정보를 함께 가질 수 있습니다.", "이 문제의 Clip은 행정구역들을 먼저 Dissolve한 단일 외곽을 쿠키 틀처럼 사용합니다. 마스크의 내부 행정 경계를 없앤 조건이므로 그 경계를 토지이용에 새로 새기지 않습니다.", "그림을 그릴 때는 먼저 남길 외곽 범위를 결정하고, 그 안에 남아야 할 내부 경계와 토지이용 표시를 그립니다. 같은 영역을 남겨도 두 결과의 내부 선과 속성 구성이 달라질 수 있습니다.", "입력과 Clip 경계를 서로 바꾸면 남기는 객체와 속성의 역할도 달라집니다. 이 문항에서는 ‘토지이용을 결합된 행정 외곽으로 자르기’라는 방향과 마스크 조건을 고정하며, 여러 Clip 피처를 가진 모든 도구의 세부 출력을 일반화하지 않습니다."],
    criteria: ["두 결과 모두 공통 범위 밖의 입력을 제외했다.", "Intersect에는 양쪽 내부 경계를 반영했다.", "Clip에는 토지이용만 유지하고 행정구역의 내부 경계를 추가하지 않았다."],
    mistakes: ["Clip 결과에 행정구역 내부의 모든 선을 중첩해 그리는 것", "행정구역을 입력으로 바꾸고 토지이용을 마스크로 사용하는 것", "두 연산은 속성까지 완전히 같은 결과라고 보는 것"],
    theoryChapterId: "overlay-analysis", referenceUrls: [intersect, clip, { label: "Esri · 내부 구분을 결합하는 Dissolve", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/data-management/dissolve.htm" }],
  },
  {
    id: "technician-second-20", number: 20, category: "공간분석 기초", title: "같은 공간에서 여러 자료를 겹쳐 분석", format: "단답형",
    prompt: "각각의 자료 집단이 공통된 공간 기준을 갖도록 정리한 뒤, 둘 이상의 자료를 겹쳐 위치 관계와 조건을 분석하는 대표적인 공간분석 기법은 무엇인지 쓰시오.",
    context: ["레이어별 좌표계·측지 기준을 확인하고 필요한 좌표 변환을 수행한다. 래스터라면 해상도와 셀 정렬 등도 확인한다."],
    hint: "토지이용도 위에 침수 위험도와 행정구역도를 포개어 보는 상황입니다.",
    modelAnswer: "중첩분석(Overlay analysis)",
    explanation: ["중첩분석은 여러 레이어를 같은 공간에서 비교하고 결합해 공통 영역·전체 영역·제외할 영역 등의 관계를 분석하는 방법입니다.", "예를 들어 주거지역 레이어와 침수 위험 레이어를 중첩하면 위험 구역 안의 주거지역을 찾을 수 있습니다. 적지분석에서는 여러 조건의 평가값을 재분류하고 결합하기도 합니다.", "벡터의 Union·Intersect·Identity와 래스터의 셀별 논리·수치 결합 등이 사용될 수 있습니다. 중첩분석이 항상 하나의 특정 도구만을 뜻하는 것은 아닙니다.", "좌표계 이름만 맞추면 모든 오차가 사라지는 것은 아닙니다. 측지 기준·축척·시점·위치 정확도와 래스터 격자 정렬을 확인하고, 변환이 필요하면 적합한 방법을 적용합니다."],
    criteria: ["중첩분석 또는 Overlay analysis라고 썼다.", "같은 위치의 여러 레이어 사이 관계를 분석한다는 의미를 설명했다."],
    mistakes: ["단순히 화면에서 레이어를 켜 놓는 것만으로 모든 조건 분석이 끝났다고 보는 것", "좌표계 정의만 바꾸는 것과 좌표값을 실제 변환하는 것을 혼동하는 것"],
    theoryChapterId: "overlay-analysis",
    referenceUrls: [{ label: "Esri · 중첩 도구의 개요", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/an-overview-of-the-overlay-toolset.htm" }, { label: "Esri · 다중 기준의 가중 중첩", url: "https://doc.esri.com/en/arcgis-pro/latest/tool-reference/spatial-analyst/how-weighted-overlay-works.html" }],
  },
];
