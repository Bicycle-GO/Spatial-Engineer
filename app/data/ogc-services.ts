import type { Chapter } from "./course";
import type { PracticalQuestion } from "./practical";

export const ogcServices = [
  { id: "WMS", abbreviation: "WMS", name: "Web Map Service", focus: "지도 이미지", provides: "표현된 지도 이미지(PNG·JPEG 등)", operation: "GetMap", example: "토지이용 현황을 지도 위에 배경 레이어로 표시", caution: "이미지의 색을 원래 지형·속성의 수치로 취급하지 않습니다." },
  { id: "WFS", abbreviation: "WFS", name: "Web Feature Service", focus: "피처와 속성", provides: "필지·도로 같은 공간 객체와 속성", operation: "GetFeature", example: "필지 도형과 지번 속성을 가져와 조건별로 조회", caution: "모든 서버가 수정 기능을 제공하는 것은 아닙니다. 트랜잭션 지원과 권한을 확인합니다." },
  { id: "WCS", abbreviation: "WCS", name: "Web Coverage Service", focus: "커버리지 값", provides: "DEM·관측 격자 등의 커버리지 데이터", operation: "GetCoverage", example: "표고 값을 가진 DEM 범위를 받아 경사 분석에 사용", caution: "래스터만을 뜻하는 단어는 아닙니다. 여기서는 격자형 커버리지를 예로 듭니다." },
  { id: "WPS", abbreviation: "WPS", name: "Web Processing Service", focus: "처리 실행", provides: "서버에 공개된 처리의 실행 결과", operation: "Execute", example: "서버가 제공하는 버퍼·중첩 분석에 입력을 전달해 실행", caution: "서버가 어떤 처리를 제공하고 어떤 입력·출력을 지원하는지 먼저 확인합니다." },
];

export const ogcQuestions: PracticalQuestion[] = [
  {
    id: "pr-ogc-four-services", chapterId: "practical-ogc", category: "OGC 서비스", title: "OGC 서비스 · 네 가지 역할과 약어", format: "단답형",
    context: "이 문항은 전통적인 OGC 웹서비스 가운데 지도 이미지·피처·커버리지·처리의 네 역할을 담당하는 대표 서비스를 대상으로 한다. OGC의 모든 표준이 네 개뿐이라는 뜻은 아니다.",
    prompt: "OGC에서 지정한 대표적인 웹 GIS 서비스 4가지를 나열하시오. 각 서비스의 영문 명칭도 쓰시오.",
    hint: "Map · Feature · Coverage · Processing이 약어 가운데에 들어갑니다.",
    modelAnswer: "① WMS: Web Map Service\n② WFS: Web Feature Service\n③ WCS: Web Coverage Service\n④ WPS: Web Processing Service",
    explanation: ["WMS는 서버가 표현한 지도 이미지를 지도 화면에 표시하는 역할입니다.", "WFS는 개별 피처와 속성에 접근하는 역할입니다.", "WCS는 값이 있는 커버리지에 접근하며, DEM 격자의 표고 값이 한 사례입니다.", "WPS는 서버가 공개한 처리에 입력을 주고 실행 결과를 받는 인터페이스입니다."],
    criteria: ["WMS·WFS·WCS·WPS 네 약어와 영문 명칭을 모두 썼다.", "이미지·객체·커버리지·처리의 차이를 구분했다."],
    mistakes: "WMS와 WFS를 바꾸거나 모든 OGC 표준이 네 개뿐이라고 설명하는 답안",
    referenceIds: ["ogcWms", "ogcWfs", "ogcWcs", "ogcWps"],
  },
  {
    id: "pr-ogc-service-workflow", chapterId: "practical-ogc", category: "OGC 서비스", title: "OGC 서비스 · 침수 분석 서비스 구성", format: "서술형",
    context: "침수 분석 화면을 만든다. 필요한 서버는 해당 데이터를 공개하고 있으며, 분석 서버는 요청할 중첩 처리를 WPS로 제공한다고 가정한다. 이 문항의 선택 범위는 WMS·WFS·WCS·WPS이다.",
    prompt: "① 완성된 배경지도 이미지를 표시 ② 필지 도형·속성을 조회 ③ DEM의 표고 값을 받아 분석 ④ 서버의 중첩 처리를 실행하려 한다. 각 단계에 맞는 서비스를 고르고, DEM 분석을 WMS 이미지로 대신하기 어려운 이유를 설명하시오.",
    hint: "화면에 보이는 결과와 계산에 필요한 원래 수치 자료를 구분합니다.",
    modelAnswer: "① WMS ② WFS ③ WCS ④ WPS.\nWMS 지도 이미지는 표현 결과이므로 그 색을 원래 DEM 표고 값으로 간주할 수 없다. 표고 값을 이용한 분석에는 필요한 커버리지 데이터와 단위·NoData 등을 확인해 사용한다.",
    explanation: ["같은 화면에서 네 서비스를 목적에 따라 함께 사용할 수 있습니다.", "필지의 도형과 속성이 필요하면 이미지가 아니라 피처를 조회합니다.", "DEM의 수치와 좌표 기준·단위·결측값을 확인한 뒤 분석해야 합니다.", "WPS가 모든 분석을 자동 제공하는 것은 아니며 공개된 프로세스와 입력·출력 조건을 확인해야 합니다."],
    criteria: ["WMS·WFS·WCS·WPS를 네 단계에 올바르게 연결했다.", "지도 이미지와 분석용 수치 데이터의 차이를 설명했다.", "좌표·단위 또는 처리 지원 조건 확인을 포함했다."],
    mistakes: "DEM 그림의 픽셀 색을 그대로 표고로 계산하거나 WPS 서버에 없는 처리를 실행할 수 있다고 쓰는 답안",
    referenceIds: ["ogcWms", "ogcWfs", "ogcWcs", "ogcWps"],
  },
  {
    id: "pr-ogc-capabilities", chapterId: "practical-ogc", category: "OGC 서비스", title: "OGC 서비스 · 지원 기능과 표준 범위 확인", format: "서술형",
    prompt: "‘OGC 서비스는 WMS·WFS·WCS·WPS 네 개뿐이며, WFS이면 누구나 데이터를 수정할 수 있다’는 설명을 고치시오. 실제 연계 전에 확인할 정보도 세 가지 이상 쓰시오.",
    hint: "WMTS 같은 다른 표준, 서버가 제공하는 기능, 접근 권한과 버전을 나누어 생각합니다.",
    modelAnswer: "네 가지는 이 단원에서 비교하는 서비스이며, 미리 정한 지도 타일을 제공하는 WMTS 등 다른 OGC 표준도 있다. WFS의 수정은 서버의 트랜잭션 지원과 권한에 달려 있으므로 항상 가능하지 않다.\nGetCapabilities 등 서비스 설명에서 버전, 제공 레이어·피처·커버리지·프로세스, 지원 연산, CRS, 출력 형식과 접근 권한 등을 확인한다. OGC API – Features·Processes는 현대적인 별도 인터페이스이므로 기존 요청을 그대로 바꾸어 쓰지 않는다.",
    explanation: ["WMTS는 미리 정한 이미지 타일로 지도를 제공하는 표준입니다.", "WFS로 피처를 읽는 기능과 서버 자료를 바꾸는 권한은 구분합니다.", "표준 이름만으로 서버의 모든 데이터와 기능을 알 수 없으므로 서비스가 공개한 설명을 확인합니다.", "OGC API – Processes는 WPS의 개념을 활용하지만 WPS 구현 자체를 요구하지 않는 별도 인터페이스입니다."],
    criteria: ["네 개만 존재한다는 설명을 바로잡았다.", "WFS 트랜잭션 지원 여부와 권한을 구분했다.", "연계 전 확인 정보를 세 가지 이상 제시했다."],
    mistakes: "서비스 이름만 보고 버전·지원 기능·권한 확인 없이 요청을 보내도 된다고 설명하는 답안",
    referenceIds: ["ogcWfs", "ogcWmts", "ogcApiFeatures", "ogcApiProcesses"],
  },
];

export const ogcLesson: Chapter = {
  id: "practical-ogc", number: "01", title: "실기 기초 · OGC 웹서비스의 역할",
  summary: "WMS·WFS·WCS·WPS를 반환되는 자료와 실행 목적에 따라 구분합니다.",
  definition: "OGC 웹서비스 표준은 서로 다른 시스템이 공간정보를 주고받거나 처리를 요청하는 공통 인터페이스를 정합니다. 서비스를 고를 때는 지도 이미지·피처·커버리지·처리 중 무엇이 필요한지 먼저 판단합니다.",
  keywords: ["OGC", "WMS·지도 이미지", "WFS·피처", "WCS·커버리지", "WPS·처리", "WMTS·OGC API"],
  concepts: [
    ...ogcServices.map(service => ({ label: `${service.abbreviation} · ${service.focus}`, text: `${service.name}. ${service.provides}를 ${service.operation} 요청으로 이용하는 것이 대표 예입니다. 사례: ${service.example}. ${service.caution}` })),
    { label: "연계 전 서비스 설명 확인", text: "GetCapabilities 등으로 제공 데이터·프로세스, 버전과 연산을 확인합니다. CRS·출력 형식·접근 권한도 실제 서버가 지원하는 조건과 맞춰야 합니다." },
    { label: "네 개의 범위와 OGC API", text: "이 단원은 네 역할을 비교하며 WMTS 같은 다른 OGC 표준도 있습니다. OGC API – Features·Processes는 별도의 현대적인 웹 API 규격입니다. 연계할 때 각 규격의 요청 방식과 지원 범위를 확인합니다." },
  ],
  steps: ["필요한 결과의 형태 확인", "목적에 맞는 서비스 선택", "버전·데이터·연산·권한 확인", "CRS·형식·입출력 조건 대조", "응답·실패 상황 검증"],
  examPoint: "WMS는 지도 이미지, WFS는 피처와 속성, WCS는 커버리지, WPS는 처리 실행으로 연결하세요. 답안에 약어뿐 아니라 필요한 결과와 선택 이유를 함께 적습니다.",
  question: { prompt: "DEM의 표고 값을 가진 커버리지 데이터를 받아 분석할 때, 이 단원의 네 서비스 중 적합한 것은?", choices: ["WMS", "WFS", "WCS", "WPS"], answer: 2, explanation: "WCS는 DEM 같은 커버리지 데이터에 접근합니다. 화면 표시용 지도 이미지와 분석에 필요한 수치를 구분합니다." },
  guide: {
    visual: "ogc-services", minutes: 7,
    takeaway: "필요한 것이 그림인지, 객체인지, 값인지, 처리 실행인지 먼저 고르면 서비스의 역할이 보입니다.",
    comparison: { headers: ["서비스", "주로 받는 것", "대표 요청"], rows: ogcServices.map(service => [service.abbreviation, service.provides, service.operation]) },
    example: { title: "침수 분석 화면을 만든다면", text: "배경지도는 WMS 이미지로 표시하고, 필지 도형·속성은 WFS로 조회합니다. 계산에 필요한 DEM 값은 WCS로 받고, 서버가 WPS로 제공하는 중첩 처리를 실행할 수 있습니다. 실제 구현에서는 각 서버의 제공 데이터와 프로세스·좌표계·형식·권한을 먼저 확인합니다." },
    pitfalls: ["WMS 지도 이미지의 색을 원래 표고 값으로 간주하지 않습니다.", "WFS로 읽을 수 있다는 사실만으로 원격 데이터를 수정할 수 있는 것은 아닙니다.", "네 서비스는 이 단원의 비교 대상입니다. WMTS 등 다른 표준과 별도의 OGC API 계열도 있습니다."],
    advanced: [{ title: "전통적인 웹서비스와 OGC API", text: "WMS·WFS·WCS·WPS는 기존 OWS 계열의 서비스 인터페이스를 학습하는 이름입니다. OGC API – Features와 Processes는 현대적인 웹 API 규격이며 각 규격의 요청·응답을 확인해 연계합니다. 예를 들어 OGC API – Processes는 WPS 개념을 활용하지만 WPS 구현을 필수로 요구하지 않습니다." }],
    sourceIds: ["ogcWms", "ogcWfs", "ogcWcs", "ogcWps", "ogcWmts", "ogcApiFeatures", "ogcApiProcesses"],
  },
  practical: {
    answerTemplate: "지도 이미지 → WMS(Web Map Service)\n피처·속성 → WFS(Web Feature Service)\n커버리지 값 → WCS(Web Coverage Service)\n공개된 처리 실행 → WPS(Web Processing Service)\n사례 답안: 필요한 결과 → 선택한 서비스 → 선택 이유 → 서버 지원·버전·CRS·권한 확인.",
    sourceIds: ["ogcWms", "ogcWfs", "ogcWcs", "ogcWps", "ogcWmts", "ogcApiFeatures", "ogcApiProcesses"],
  },
};
