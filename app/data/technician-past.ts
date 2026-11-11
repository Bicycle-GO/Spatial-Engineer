export type TechnicianPastQuestion = {
  id: string;
  number: number;
  category: string;
  title: string;
  format: "단답형" | "서술형" | "순서형" | "연결형" | "격자형" | "코드형" | "계산형" | "도형형";
  prompt: string;
  context?: string[];
  code?: string;
  hint: string;
  modelAnswer: string;
  explanation: string[];
  criteria: string[];
  mistakes: string[];
  theoryChapterId?: string;
  referenceUrls?: { label: string; url: string }[];
  trace?: { headers: string[]; rows: string[][] };
};

export const technicianPastSourceNote = "사용자가 제공한 기능사 기출 이미지의 문항입니다. 시행 연도·회차와 공식 원문은 미확인입니다. 도형·표는 학습용으로 재구성하고, 답안·해설의 기술적 오류는 바로잡았습니다. 자가점검은 공식 채점 기준이 아닙니다.";

const javaOperators = { label: "Oracle · Java 연산자 우선순위", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html" };
const javaUnary = { label: "Oracle · 전위·후위 증감 연산", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html" };

export const technicianPastQuestions: TechnicianPastQuestion[] = [
  {
    id: "technician-past-01", number: 1, category: "공간분석", title: "중첩 결과와 논리 연산자", format: "단답형",
    prompt: "다음은 공간적 특성에 대한 자료에 관하여 중첩분석한 그림이다. 연산자를 보기에서 골라 쓰시오.",
    context: ["[보기] AND, OR, XOR, NOT", "① 두 입력 자료를 중첩한 결과에 두 자료가 차지하는 전체 범위가 함께 나타난다.", "② 두 입력 자료를 중첩한 결과에 두 자료가 겹치는 공통 범위만 나타난다."],
    hint: "두 영역 중 하나라도 해당하면 포함하는지, 두 영역에 모두 해당해야 포함하는지 비교하세요.",
    modelAnswer: "① OR\n② AND",
    explanation: ["OR는 A 또는 B에 해당하는 곳을 모두 남깁니다. A에만 있는 곳, B에만 있는 곳, 둘 다 겹친 곳이 포함됩니다. 그래서 ①의 답은 OR입니다.", "AND는 A와 B에 동시에 해당하는 겹친 부분만 남깁니다. 그래서 ②의 답은 AND입니다.", "XOR는 '둘 중 정확히 하나만'이라는 뜻입니다. A만 해당하는 곳과 B만 해당하는 곳은 남기고, 두 영역이 겹친 곳은 뺍니다. 예를 들어 두 도서관의 배달 가능 구역 중 한 도서관에서만 배달받을 수 있는 지역을 찾는 상황입니다.", "NOT A는 'A가 아닌 곳'입니다. 먼저 전체 조사 범위 U를 정하고, 그 안에서 A를 제외합니다. 전체가 우리 시이고 A가 침수 위험 지역이라면, NOT A는 우리 시 안에서 그 위험 지역을 뺀 나머지입니다.", "NOT은 전체 범위를 어디까지 잡느냐에 따라 결과가 바뀝니다. NOT A는 B의 일부만을 뜻하지 않으며, U 안에서 A에도 B에도 속하지 않는 곳까지 포함할 수 있습니다. 아래 그림에서 OR·AND·XOR·NOT을 바꿔 보세요."],
    criteria: ["①에 OR를 썼다.", "②에 AND를 썼다.", "전체 범위와 공통 범위의 차이를 설명할 수 있다."],
    mistakes: ["OR는 겹친 부분을 포함하지만 XOR는 그 부분을 뺍니다.", "NOT A는 B에서 A를 뺀 영역에 한정되지 않습니다. 전체 범위 U에서 A를 제외합니다.", "Java의 boolean 값에서 XOR는 ^, NOT은 !로 표현합니다. 정수의 ^는 비트 XOR, ~는 비트 반전이므로 피연산자의 종류를 구분합니다."],
    theoryChapterId: "overlay-analysis",
    referenceUrls: [{ label: "Esri · 공간분석의 중첩 개념", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/an-overview-of-the-overlay-toolset.htm" }, { label: "Esri · 대칭차(XOR)의 영역", url: "https://pro.arcgis.com/en/pro-app/3.6/tool-reference/analysis/symmetrical-difference.htm" }, { label: "Oracle JLS · boolean XOR와 NOT", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.22" }],
  },
  {
    id: "technician-past-02", number: 2, category: "프로그래밍", title: "Java 접근제어와 접근 범위", format: "단답형",
    prompt: "아래 설명을 보고 알맞은 Java 접근제어자 명칭을 기입하시오.",
    context: ["① 같은 패키지 내에서만 접근 가능하다.", "② 같은 패키지 내에서, 그리고 다른 패키지의 자식 클래스에서 접근 가능하다.", "③ 어떤 클래스에서라도 접근 가능하며, 접근 제한이 전혀 없다.", "④ 같은 클래스 내에서만 접근 가능하다."],
    hint: "자기 클래스 → 같은 패키지 → 다른 패키지의 자식 클래스 → 전체 접근 범위를 나누어 보세요.",
    modelAnswer: "① default 접근 수준(package-private, 접근제어자 생략)\n② protected\n③ public\n④ private",
    explanation: ["접근제어는 '이 코드의 값이나 기능을 다른 어느 코드가 사용할 수 있나?'를 정하는 규칙입니다. 처음에는 출입 허용 범위라고 생각해 보세요. 파일 비밀번호나 사용자 로그인 권한과는 다른 코드 사이의 규칙입니다.", "클래스는 값과 기능을 모아 둔 설계도입니다. 예를 들어 Bicycle 클래스에 속도라는 값과 달린다는 기능을 정합니다. 그 설계도로 만든 내 자전거와 친구 자전거가 각각 객체입니다.", "패키지는 관련 클래스를 이름으로 묶는 단위입니다. 선언이 package school;인 서로 다른 클래스는 같은 패키지입니다. package school.club;은 이름이 비슷해도 별도 패키지입니다.", "자식 클래스는 기존 클래스의 설계에 자기 기능을 더하는 클래스입니다. 예를 들어 ElectricBicycle이 Bicycle을 extends하면 자전거의 기능을 바탕으로 전기 보조 기능을 더할 수 있습니다. 이런 관계를 상속이라고 합니다.", "private는 기본적으로 자기 클래스 안에서, 접근제어자를 생략한 default(package-private)는 같은 패키지에서, public은 다른 패키지에서도 접근할 수 있게 합니다. protected는 같은 패키지에 더해 다른 패키지의 자식 클래스에도 조건부 접근을 허용합니다.", "따라서 ① default 접근 수준, ② protected, ③ public, ④ private입니다. 아래에서 접근하는 사람의 위치를 바꾸며 어떤 기능을 사용할 수 있는지 확인해 보세요."],
    criteria: ["①을 default/package-private 또는 접근제어자 생략으로 설명했다.", "② protected, ③ public, ④ private을 순서대로 적었다.", "default 접근 수준과 코드에 작성하는 접근제어자를 구분했다."],
    mistakes: ["접근을 제한하려고 멤버 선언 앞에 default를 쓰는 것", "protected가 다른 패키지의 모든 클래스에 허용된다고 보는 것"],
    theoryChapterId: "operators",
    referenceUrls: [{ label: "Oracle · 클래스 멤버 접근제어", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html" }],
  },
  {
    id: "technician-past-03", number: 3, category: "공간분석", title: "일정 거리의 영향 범위", format: "단답형",
    prompt: "지리정보시스템(GIS)에서 특정 지점, 선 또는 영역을 중심으로 일정 거리 내의 공간을 분석하여 해당 범위 내의 위치를 포함하는 영역을 결정하는 공간분석기법을 쓰시오.",
    hint: "객체의 주변을 일정한 거리만큼 둘러싼 새 영역을 생각해 보세요.",
    modelAnswer: "버퍼분석(Buffer analysis)",
    explanation: ["버퍼분석은 점·선·면 객체로부터 정한 거리 이내의 영역을 만드는 분석입니다.", "버스 정류장에서 일정 거리 안의 생활권, 도로 주변 소음 영향 구역처럼 거리 조건을 표현할 때 사용할 수 있습니다.", "정확한 거리 계산을 위해 데이터와 도구의 좌표계·거리 단위·평면 또는 측지 계산 방식을 확인합니다."],
    criteria: ["버퍼분석 또는 Buffer analysis라고 썼다.", "객체 주변의 일정 거리 영역을 만든다는 뜻을 이해했다."],
    mistakes: ["경계 안의 도형을 자르는 Clip과 혼동하는 것", "경위도 좌표값을 그대로 m 단위로 취급하는 것"],
    theoryChapterId: "overlay-analysis",
    referenceUrls: [{ label: "Esri · Buffer", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/buffer.htm" }],
  },
  {
    id: "technician-past-04", number: 4, category: "래스터 처리", title: "5×5 격자의 속성값 재분류", format: "격자형",
    prompt: "격자구조의 속성값을 다음 조건에 따라 재분류하여 최종 성과물을 작성하시오.",
    context: ["입력 격자(위에서 아래로, 각 행은 왼쪽에서 오른쪽 순서)", "1행: 1, 3, 5, 1, 4", "2행: 7, 7, 4, 9, 8", "3행: 9, 10, 11, 11, 12", "4행: 15, 17, 18, 16, 18", "5행: 20, 21, 23, 21, 22", "재분류 조건: 1~4 → 3 / 5~9 → 2 / 10~13 → 1 / 14~18 → 6 / 19~22 → 5 / 23 이상 → 4", "입력은 정수이며 각 구간의 양 끝값을 포함한다."],
    hint: "각 셀의 원래 값이 어느 구간에 속하는지 찾은 뒤 그 구간의 새 코드로 바꾸세요. 9·10·18·19·22·23의 경계를 특히 확인합니다.",
    modelAnswer: "3  3  2  3  3\n2  2  3  2  2\n2  1  1  1  1\n6  6  6  6  6\n5  5  4  5  5",
    explanation: ["1~4는 새 코드 3이므로 첫 행의 1·3·1·4는 3으로 바뀌고, 5는 새 코드 2로 바뀝니다.", "셋째 행의 첫 값 9는 5~9 구간이므로 2입니다. 나머지 10·11·11·12는 10~13 구간이므로 1입니다.", "넷째 행은 모두 14~18 구간에 속하므로 6입니다. 마지막 행의 23만 '23 이상'에 해당하므로 4이고, 나머지는 5입니다.", "셀의 행·열 위치와 격자 크기는 유지하고 속성 코드만 바꿉니다."],
    criteria: ["5행×5열의 위치를 유지해 모든 셀을 채웠다.", "첫째~셋째 행의 구간을 정확히 적용했다.", "넷째 행을 모두 6으로 작성했다.", "마지막 행을 5, 5, 4, 5, 5로 작성했다."],
    mistakes: ["새 코드의 크기를 원래 속성값의 순서와 같다고 가정하는 것", "9와 10, 22와 23을 같은 구간에 넣는 것", "값을 정렬하여 원래 셀 위치를 바꾸는 것"],
    theoryChapterId: "processing",
    referenceUrls: [{ label: "QGIS · 값 구간에 따른 래스터 재분류", url: "https://docs.qgis.org/3.44/en/docs/user_manual/processing_algs/qgis/rasteranalysis.html" }],
  },
  {
    id: "technician-past-05", number: 5, category: "프로그래밍", title: "Java 연산자 우선순위 나열", format: "순서형",
    prompt: "다음 Java 연산자들을 우선순위 순서대로 나열하시오. 우선순위가 가장 높은 연산자부터 낮은 연산자 순으로 나열한다.",
    context: ["제시된 연산자: ||, &, >>, +, =", "+는 이 문항에서 두 값을 더하는 이항 덧셈 연산자를 뜻한다."],
    hint: "덧셈 → 시프트 → 비트 AND → 논리 OR → 대입의 순서를 확인하세요.",
    modelAnswer: "+ → >> → & → || → =",
    explanation: ["연산자는 값에 어떤 일을 할지 알려 주는 기호입니다. +는 더하기, =은 오른쪽 값을 왼쪽 이름의 변수에 저장하기입니다. 변수는 값을 넣어 두는 이름 붙은 칸이라고 생각해 보세요.", "우선순위는 Java 언어가 미리 정해 둔 식의 묶음 규칙입니다. 우리가 기호의 모양이나 컴퓨터 처리 속도를 보고 임의로 정하는 순서가 아닙니다. 수학에서 2 + 3 × 4를 2 + (3 × 4)로 읽는 것과 비슷합니다.", "이 문항의 다섯 기호 중에서는 더하기 +가 먼저 묶이고, 그다음 오른쪽 비트 이동 >>, 그다음 &, 그다음 논리 OR ||, 마지막으로 대입 =이 묶입니다. 따라서 + → >> → & → || → =입니다.", "예를 들어 int result = 8 + 4 >> 1;은 int result = (8 + 4) >> 1;입니다. 12를 양의 정수의 비트 이동 규칙으로 오른쪽 한 칸 옮겨 result에 6을 저장합니다.", "괄호로 묶음을 바꿀 수 있습니다. 2 + 3 * 4는 14, (2 + 3) * 4는 20입니다. 우선순위와 왼쪽·오른쪽 피연산자를 실제 평가하는 순서는 다른 개념이며, Java는 피연산자를 왼쪽부터 평가하는 규칙을 따릅니다. &&와 ||는 결과가 정해지면 오른쪽 평가를 생략할 수 있습니다."],
    criteria: ["+를 >>보다 앞에 배치했다.", ">> → & → || 순서를 지켰다.", "대입 =을 마지막에 배치했다."],
    mistakes: ["&와 &&를 같은 기호로 읽는 것", "논리 연산자라는 이유로 ||의 우선순위를 덧셈보다 높게 두는 것"],
    theoryChapterId: "operators", referenceUrls: [javaOperators],
  },
  {
    id: "technician-past-06", number: 6, category: "공간분석", title: "중첩 기능과 설명 연결", format: "연결형",
    prompt: "중첩기능에 관한 설명을 보고 바르게 연결하시오.",
    context: ["① 두 개의 피처 클래스가 겹치는 부분만 남겨 새로 생성하는 기능으로 공통 영역을 추출한다.", "② 한 피처 클래스의 경계를 따라 다른 피처 클래스의 일부를 제거하는 기능으로 필요 없는 부분을 잘라내어 필요한 부분만 남기고 싶을때 유용하다.", "③ 두 개의 피처 클래스를 결합하여 하나의 새 피처 클래스를 생성하는 기능으로 모든 속성과 지리정보가 결합된다.", "④ 하나의 피처 클래스에서 다른 피처 클래스와 겹치는 부분을 잘라내고 남은 부분만 남기는 기능으로, 겹치는 부분을 제외한 나머지 영역을 유지한다.", "연결할 기능: 결합(Union), 지우기(Erase), 교차(Intersection), 자르기(Clip)", "②의 설명은 기준 경계 안의 입력 부분을 남기는 뜻으로 읽는다."],
    hint: "공통 부분, 경계 안쪽 남김, 전체 영역 결합, 겹침 제거의 네 결과를 구분하세요.",
    modelAnswer: "① 교차(Intersection / Intersect)\n② 자르기(Clip)\n③ 결합(Union)\n④ 지우기(Erase)",
    explanation: ["교차는 입력들이 공유하는 부분을 구합니다. 여러 입력의 속성을 함께 연결할 수 있습니다.", "Clip은 자르기 기준 경계 안의 입력 도형 부분을 남깁니다. 원자료의 '일부 제거'라는 표현만 보고 경계 안쪽을 버리는 것으로 해석하지 마세요.", "Union은 두 폴리곤 입력의 전체 영역을 분할·결합해 양쪽의 속성을 연결합니다. 겹치는 곳뿐 아니라 각 입력에만 있는 영역도 남습니다.", "Erase는 제거 경계와 겹치는 입력 부분을 빼고 경계 바깥쪽 입력 부분을 남깁니다."],
    criteria: ["① Intersection, ② Clip을 연결했다.", "③ Union, ④ Erase를 연결했다.", "Clip의 경계 안쪽 남김과 Erase의 경계 안쪽 제거를 구분했다."],
    mistakes: ["Clip이 기준 경계 안쪽을 지운다고 설명하는 것", "Union과 Intersection이 같은 영역을 남긴다고 생각하는 것"],
    theoryChapterId: "overlay-analysis",
    referenceUrls: [{ label: "Esri · Clip의 입력·기준·결과", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/clip.htm" }, { label: "Esri · 중첩 분석 도구", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/an-overview-of-the-overlay-toolset.htm" }],
  },
  {
    id: "technician-past-07", number: 7, category: "자료 취득·제작", title: "항공사진 측량의 수치지형도 제작 순서", format: "순서형",
    prompt: "수치지형도 제작을 위한 항공사진 측량과정에서 아래 단계를 순서대로 나열하시오.",
    context: ["① 구조화 편집", "② 정위치 편집", "③ 수치 도화", "④ 항공사진 촬영", "⑤ 기준점 측량", "⑥ 지리 조사"],
    hint: "사진과 기준을 준비하고, 사진에서 지형을 도화한 뒤 현지 정보를 조사·보완하고 구조화하는 흐름을 따라가세요.",
    modelAnswer: "④ → ⑤ → ③ → ⑥ → ② → ①\n항공사진 촬영 → 기준점 측량 → 수치 도화 → 지리 조사 → 정위치 편집 → 구조화 편집",
    explanation: ["제공 문항의 공정 분류에서는 항공사진 촬영과 기준점 측량을 준비 단계로 배열합니다.", "수치 도화는 사진으로부터 지형·지물을 추출하고, 지리 조사는 판독하기 어려운 지물·명칭 등 현지 정보를 확인하는 단계입니다.", "정위치 편집에서 도화와 조사 결과를 반영해 도형·내용을 보완하고, 구조화 편집에서 자료를 정해진 구조와 속성·관계에 맞게 정리합니다.", "이 답안은 제시된 단계와 제공 자료의 순서에 따른 것입니다. 실제 사업에서는 기준점 측량 등의 일부 업무가 촬영 전 또는 병행될 수 있습니다."],
    criteria: ["④·⑤를 앞에 배치했다.", "③ 수치 도화 다음에 ⑥ 지리 조사를 배치했다.", "② 정위치 편집 다음에 ① 구조화 편집을 배치했다.", "전체 순서를 ④⑤③⑥②①로 작성했다."],
    mistakes: ["지리 조사 결과를 반영하기 전에 최종 편집을 끝내는 순서로 쓰는 것", "제공된 공정 순서를 모든 사업에서 동일하게 한 번씩만 진행하는 절대 규칙으로 일반화하는 것"],
    theoryChapterId: "data-collection",
    referenceUrls: [{ label: "법제처 · 수치지도 제작 공정의 연혁 규정(현행 출제기준 아님)", url: "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=65736" }, { label: "법제처 · 정위치·구조화 편집의 연혁 규정(역사적 참고)", url: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=43936" }],
  },
  {
    id: "technician-past-08", number: 8, category: "측지·좌표", title: "지오이드의 특징 두 가지", format: "서술형",
    prompt: "지오이드에 관한 특징을 2가지 쓰시오.",
    hint: "중력장의 등퍼텐셜면이라는 성질과 그 면에 대한 중력 방향을 생각해 보세요.",
    modelAnswer: "예시 1. 지오이드는 평균해수면에 대응하고 육지 아래로 연장해 생각하는 중력장의 등퍼텐셜면이다.\n예시 2. 지오이드의 각 점에서 중력 방향은 그 면에 수직이다.\n\n추가로, 지오이드는 중력장 분포에 따라 완만한 기복을 갖는 곡면이며 높이 기준을 정하는 데 사용된다고 설명할 수 있다.",
    explanation: ["등퍼텐셜면은 면 위에서 중력 퍼텐셜 값이 일정하다는 뜻입니다. 퍼텐셜 값이 반드시 0이라는 뜻은 아닙니다. 높이의 기준을 0으로 정하는 것과 퍼텐셜을 혼동하지 않습니다.", "중력 방향은 등퍼텐셜면의 법선 방향이므로 지오이드면에 수직입니다.", "지오이드와 기준타원체의 높이 차이는 위치에 따라 양수 또는 음수가 될 수 있습니다. 육지에서는 항상 위, 바다에서는 항상 아래라고 고정할 수 없습니다.", "지오이드는 실제 지표면의 산과 계곡 모양을 그대로 복사한 면이 아닙니다. 조석·해류·바람 등의 영향을 제거한 이상적인 평균해수면과 연결해 이해합니다."],
    criteria: ["등퍼텐셜면·중력 방향의 수직성·완만한 기복 등 유효한 특징을 구분했다.", "서로 다른 특징 두 가지를 정확히 적었다.", "퍼텐셜을 반드시 0으로 쓰거나 육지·바다에 따라 타원체와의 높낮이를 고정하지 않았다."],
    mistakes: ["등퍼텐셜을 '위치에너지가 0'이라는 뜻으로 외우는 것", "육지/해양 여부만으로 지오이드가 타원체 위/아래라고 단정하는 것", "지오이드와 실제 지표면 또는 매끈한 기준타원체를 같은 면으로 보는 것"],
    theoryChapterId: "coordinate-systems",
    referenceUrls: [{ label: "NOAA · 지오이드와 높이 기준", url: "https://oceanservice.noaa.gov/facts/geoid.html" }, { label: "NOAA NGS · 등퍼텐셜면과 일정한 W₀", url: "https://geodesy.noaa.gov/research/geopotential-datums/geopotential-surface.shtml" }, { label: "NOAA NGS · 지오이드·타원체·높이 관계", url: "https://geodesy.noaa.gov/PUBS_LIB/GeodeticBMs/" }],
  },
  {
    id: "technician-past-09", number: 9, category: "데이터베이스", title: "설명에 맞는 SQL 분류", format: "단답형",
    prompt: "다음 내용을 읽고 데이터베이스 관리에서 사용하는 SQL의 분류 명칭을 기입하시오.",
    context: ["① 데이터베이스에서 데이터를 조회, 삽입, 수정, 삭제하는 데 사용되는 명령어로, 사용자가 데이터에 직접 접근하고 조작할 수 있다.", "② 데이터베이스의 구조를 정의하고 수정하는 명령어로, 데이터베이스 내의 테이블, 인덱스, 뷰 등을 생성, 삭제 또는 수정하여 데이터베이스의 구조를 구성한다.", "③ 데이터베이스에서 사용자의 데이터 접근 권한을 부여하거나 회수하여 데이터 보안을 관리하는 명령어이다.", "이미지의 문제 문장에는 이들을 모두 '데이터 제어어'로 부르는 표현이 있으나, 여기서는 SQL의 여러 분류를 묻는 뜻으로 명확히 표기했다."],
    hint: "데이터 값의 조작, 구조의 정의, 접근 권한의 제어를 각각 구분합니다.",
    modelAnswer: "① 데이터 조작어(DML, Data Manipulation Language)\n② 데이터 정의어(DDL, Data Definition Language)\n③ 데이터 제어어(DCL, Data Control Language)",
    explanation: ["이 문항의 분류에서 ①은 SELECT·INSERT·UPDATE·DELETE 등 데이터 조회·조작에 해당하는 DML입니다. 조회를 DQL로 따로 구분하는 교재도 있으므로 문항의 분류 기준을 함께 확인합니다.", "②는 CREATE·ALTER·DROP처럼 구조를 생성·변경·삭제하는 DDL입니다.", "③은 GRANT·REVOKE처럼 권한을 부여·회수하는 DCL입니다.", "시설 관리대장으로 비유하면, 대장의 데이터 값을 조회·수정하는 것이 DML, 기록 항목의 틀을 만드는 것이 DDL, 누가 열람·수정할지 권한을 정하는 것이 DCL입니다.", "세 설명 모두가 DCL이라는 뜻은 아닙니다. SQL 명령의 기능을 구분하는 입문용 분류이며, 개별 DBMS의 문서에서는 명령을 다르게 묶기도 합니다."],
    criteria: ["① DML, ② DDL, ③ DCL을 순서대로 썼다.", "각 영문 약어와 데이터 조작·정의·제어라는 명칭을 연결했다.", "값·구조·권한이라는 기준을 구분했다."],
    mistakes: ["문장에 제어어라는 단어가 있다고 세 답을 모두 DCL로 쓰는 것", "DDL과 DML의 정의·조작을 뒤바꾸는 것"],
    theoryChapterId: "relational-database",
    referenceUrls: [{ label: "MySQL · SELECT를 포함하는 DML 분류", url: "https://dev.mysql.com/doc/refman/8.4/en/sql-data-manipulation-statements.html" }, { label: "Oracle · DBMS별 분류 차이(권한 명령도 DDL로 분류)", url: "https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/Types-of-SQL-Statements.html" }],
  },
  {
    id: "technician-past-10", number: 10, category: "프로그래밍", title: "Java 증감 연산 코드의 최종 변수값", format: "코드형",
    prompt: "다음 코드를 실행시킬 경우 x, y, z 변수가 갖게 되는 값을 차례대로 적으시오.",
    code: 'public class Main {\n    public static void main(String[] args) {\n        int x = 1;\n        int y = 2;\n        int z = 3;\n        x = z--;\n        y = --x;\n        z = y++;\n        System.out.println(x + "," + y + "," + z);\n    }\n}',
    hint: "후위 z--·y++는 변경 전 값을 식에 사용하고, 전위 --x는 먼저 바뀐 값을 사용합니다. 각 문장이 끝날 때의 상태를 적으세요.",
    modelAnswer: "x = 2, y = 3, z = 2\n출력: 2,3,2",
    explanation: ["초기 상태는 x=1, y=2, z=3입니다.", "x=z--는 기존 z 값 3을 x에 저장하고 z를 2로 감소시킵니다. 문장이 끝나면 x=3, y=2, z=2입니다.", "y=--x는 x를 먼저 2로 감소시킨 뒤 그 값 2를 y에 저장합니다. 문장이 끝나면 세 변수는 모두 2입니다.", "z=y++는 현재 y 값 2를 z에 저장한 뒤 y를 3으로 증가시킵니다. 따라서 최종 x=2, y=3, z=2입니다."],
    criteria: ["x=z-- 다음 상태를 x=3, y=2, z=2로 추적했다.", "y=--x 다음 상태를 x=2, y=2, z=2로 추적했다.", "최종 값과 출력 순서를 2, 3, 2로 적었다."],
    mistakes: ["후위 연산의 식 값을 변경 후 값으로 사용하는 것", "이전 문장의 x 값을 반영하지 않고 초기값 1에서 --x를 계산하는 것", "값은 맞지만 x·y·z의 출력 순서를 바꾸는 것"],
    theoryChapterId: "operators", referenceUrls: [javaUnary, javaOperators],
    trace: { headers: ["문장 실행 후", "x", "y", "z"], rows: [["초기값", "1", "2", "3"], ["x = z--;", "3", "2", "2"], ["y = --x;", "2", "2", "2"], ["z = y++;", "2", "3", "2"]] },
  },
  {
    id: "technician-past-11", number: 11, category: "공간 데이터", title: "벡터 데이터의 세 가지 기본 구성요소", format: "단답형",
    prompt: "위치와 형태를 나타내는 기본적인 벡터데이터의 구성요소 3가지를 쓰시오.",
    hint: "지도에서 정류장, 도로, 공원 구역을 각각 어떤 형태로 나타낼지 떠올려 보세요.",
    modelAnswer: "점(Point), 선(Line), 면(Polygon)",
    explanation: ["벡터는 좌표로 위치와 모양을 나타내는 방식입니다. 기본 형태를 묻는 이 문제의 답은 점·선·면입니다.", "점은 한 위치를 나타냅니다. 버스 정류장이나 소화전의 위치처럼 지도에서 한 점으로 표시할 대상에 씁니다.", "선은 점들을 순서대로 이어 길이와 경로를 나타냅니다. 도로 중심선이나 하천의 흐름을 표시할 수 있습니다.", "면은 닫힌 경계로 둘러싸인 구역을 나타냅니다. 공원이나 토지의 경계를 표시하고 넓이를 구할 수 있습니다.", "같은 대상도 지도의 목적과 축척에 따라 표현이 달라집니다. 전국 지도에서 학교는 점으로, 상세 지도에서 학교 부지는 면으로 표현할 수 있습니다."],
    criteria: ["점·선·면 세 가지를 모두 적었다.", "정류장·도로·공원 등의 예시를 알맞은 형태와 연결했다."],
    mistakes: ["격자 셀로 나타내는 래스터와 혼동하지 않습니다.", "닫힌 경계가 있다고 모두 자동으로 면 데이터가 되는 것은 아닙니다. 선 데이터로 저장한 폐곡선과 면 객체를 구분합니다."],
    theoryChapterId: "spatial-modeling",
    referenceUrls: [{ label: "QGIS · 벡터 데이터의 점·선·면", url: "https://docs.qgis.org/latest/en/docs/gentle_gis_introduction/vector_data.html" }],
  },
  {
    id: "technician-past-12", number: 12, category: "위치정보", title: "주소를 지도 위의 위치로 바꾸는 기술", format: "단답형",
    prompt: "주소나 장소 이름과 같은 텍스트데이터를 기반으로 실제 지도상의 좌표(위도와 경도)를 찾아내는 과정 또는 이를 통해 위치정보를 디지털 지도에 표시할 수 있도록 하는 GIS(지리정보시스템) 기술은 무엇이라고 하는지 쓰시오.",
    hint: "글자로 적힌 장소를 지도에서 찍을 수 있는 좌표로 바꾸는 과정입니다.",
    modelAnswer: "지오코딩(Geocoding)",
    explanation: ["지오코딩은 주소나 장소 이름을 기준 자료와 대조해 좌표 등의 위치정보를 찾는 과정입니다. '어디인지 글로 적은 것 → 지도 위 위치'라고 기억하세요.", "예를 들어 배달할 주소 목록을 지도 위의 점으로 바꾸면 배달 경로를 계획할 수 있습니다. 병원 주소 목록을 지도에 표시해 지역별 분포를 살피는 것도 활용 사례입니다.", "반대로 좌표를 넣어 주변 주소나 장소를 찾는 것은 역지오코딩입니다. 주소 → 좌표와 좌표 → 주소의 방향을 구분하세요.", "같은 이름의 장소가 여러 곳일 수 있고, 주소가 누락되거나 오래되면 결과가 없거나 잘못 연결될 수 있습니다. 일치 여부와 후보 주소·위치 정확도를 확인해야 하며, 지오코딩 결과가 GPS 실측값을 뜻하지는 않습니다."],
    criteria: ["지오코딩 또는 Geocoding이라고 적었다.", "텍스트 주소·장소 이름을 위치로 바꾸는 방향을 설명했다.", "좌표에서 주소를 찾는 역지오코딩과 구별했다."],
    mistakes: ["지오코딩과 역지오코딩을 반대로 쓰는 것", "주소를 좌표로 찾는 과정과 이미 있는 좌표를 다른 좌표계로 변환하는 과정을 혼동하는 것", "검색 결과가 한 개라는 이유로 실제 위치와 반드시 일치한다고 단정하는 것"],
    theoryChapterId: "data-collection",
    referenceUrls: [{ label: "Esri · 지오코딩의 정의와 활용", url: "https://pro.arcgis.com/en/pro-app/latest/help/data/geocoding/what-is-geocoding-.htm" }],
  },
  {
    id: "technician-past-13", number: 13, category: "측지·좌표", title: "60개 구역으로 나누는 국제 평면 좌표계", format: "단답형",
    prompt: "다음 특정 좌표계에 대한 설명에 가장 부합하는 좌표계를 쓰시오.",
    context: ["미국 육군이 1947년에 채택했으며, 각 구역의 중앙자오선과 적도를 기준으로 평면 좌표를 나타낸다.", "지구를 경도 방향의 60개 구역(zone)으로 나누어, 구역마다 별도의 평면 좌표계를 사용한다.", "구역은 일반적으로 경도 6° 간격이며, 각 구역 안에서 위치를 나타내는 데 사용한다.", "국가·군사·지역 규모의 지도 제작 등에서 널리 사용하는 좌표계이다."],
    hint: "핵심 단서는 경도 방향 60개 구역과 일반적인 6° 간격입니다.",
    modelAnswer: "UTM 좌표계(Universal Transverse Mercator, 범세계 횡메르카토르 좌표계)",
    explanation: ["UTM은 지구 전체를 한 평면에 한꺼번에 펴는 대신, 경도 방향의 좁은 구역으로 나누어 나타냅니다. 오렌지 껍질을 세로로 여러 조각 내어 펴는 모습에 비유할 수 있습니다.", "경도 한 바퀴 360°를 일반적인 구역 폭 6°로 나누면 60개입니다. 적도를 따라 60개로 잘라 쌓는 가로 띠가 아니라 남북으로 긴 구역입니다.", "각 구역의 중앙자오선은 그 구역 가운데를 지나는 남북 방향의 선입니다. 적도는 동서 방향의 기준입니다. 실제 UTM 좌표는 동쪽 거리(Easting)와 북쪽 거리(Northing)를 m로 나타내며, 음수 좌표를 줄이기 위한 가산값도 사용합니다.", "예를 들어 일반적인 31구역은 경도 0°~6°이고 중앙자오선은 3°E입니다. 같은 거리 숫자라도 구역과 반구가 다르면 다른 곳이므로, 위치를 전달할 때 구역·반구·측지 기준도 함께 확인합니다.", "일반 적용 범위는 남위 80°~북위 84°입니다. 극지에는 UPS를 사용하며 노르웨이·스발바르 일부 구역은 폭의 예외가 있습니다. 원문의 '1947년 개발'은 공식 자료의 '미 육군이 1947년 채택'에 맞춰 보완했습니다."],
    criteria: ["UTM 좌표계라고 정확히 적었다.", "60개 구역·일반적인 6°라는 단서를 연결했다.", "구역의 중앙자오선과 적도를 구분했다."],
    mistakes: ["각 구역의 모든 자오선을 좌표축으로 쓰는 것으로 외우지 않습니다. 기준은 구역의 중앙자오선입니다.", "6°는 경도 방향의 일반적인 폭이며 모든 구역이 예외 없이 같은 폭인 것은 아닙니다.", "UTM의 Easting·Northing 표기를 국내 측량의 X·Y축 관례와 무조건 같다고 보지 않습니다."],
    theoryChapterId: "coordinate-systems",
    referenceUrls: [{ label: "NGA · UTM 구역·예외·적용 범위", url: "https://earth-info.nga.mil/index.php?action=coordsys&dir=coordsys" }, { label: "USGS · Map Projections: A Working Manual(1947년 미 육군 채택)", url: "https://pubs.usgs.gov/pp/1395/report.pdf" }],
  },
  {
    id: "technician-past-14", number: 14, category: "데이터 관리", title: "데이터를 설명하는 데이터", format: "단답형",
    prompt: "데이터의 속성, 구조, 의미 등 데이터에 관한 정보를 설명하는 데이터로, 다른 데이터를 효율적으로 검색하고 관리하기 위해 사용되는 데이터의 데이터를 무엇이라고 하는지 쓰시오.",
    hint: "자료 자체를 열기 전에 붙어 있는 설명서·이름표를 떠올려 보세요.",
    modelAnswer: "메타데이터(Metadata)",
    explanation: ["메타데이터는 데이터가 무엇인지, 언제·누가·어떻게 만들었는지, 어떤 조건으로 쓸 수 있는지를 설명하는 정보입니다. '데이터에 붙인 설명서'라고 생각해 보세요.", "공간 데이터에서는 자료 제목, 제작기관, 갱신일, 좌표계, 공간 범위, 정확도, 이용 조건 등이 예입니다. 이런 정보를 읽으면 내 분석에 맞는 자료인지 판단할 수 있습니다.", "도서관에서 책의 본문과 책 검색카드를 구분해 보세요. 본문이 실제 데이터라면 제목·저자·발행일이 적힌 검색카드는 그 책의 메타데이터와 비슷합니다.", "예를 들어 버스 정류장 목록의 개별 정류장 위치는 실제 데이터이고, 그 목록의 제공기관·기준일·좌표계에 대한 설명은 메타데이터입니다. 메타데이터는 검색과 비교를 돕지만 실제 데이터가 정확한지까지 자동으로 보장하지는 않습니다."],
    criteria: ["메타데이터 또는 Metadata라고 적었다.", "자료 자체와 자료를 설명하는 정보를 구분했다.", "제작기관·갱신일·좌표계 등 예를 들 수 있다."],
    mistakes: ["메타데이터를 자료의 복사본이나 백업이라는 뜻으로 외우는 것", "제목과 갱신일만 보고 자료의 범위·좌표계·정확도·이용 조건을 확인하지 않는 것"],
    theoryChapterId: "spatial-basics",
    referenceUrls: [{ label: "USGS · 메타데이터의 정의와 역할", url: "https://www.usgs.gov/data-management/describe-metadatadocumentation" }],
  },
];
