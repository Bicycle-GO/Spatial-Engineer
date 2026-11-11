import type { Chapter } from "./course";
import type { PracticalQuestion } from "./practical";

export type ClassificationMethodId = "equal" | "maximum" | "optimal" | "quantile" | "natural";

export type ClassificationMethod = {
  id: ClassificationMethodId;
  title: string;
  english: string;
  focus: string;
  description: string;
  breaks: number[];
  calculation: string;
  example: string;
  caution: string;
  steps: string[];
};

// 가상 지역 12곳의 비율(%). 실제 통계나 공개 기출 자료가 아닙니다.
export const classificationValues = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 20];

export const classificationScope = "이 단원에서 ‘최대 분류법’은 최대급간(Maximum Breaks), ‘최적 분류법’은 정해진 등급 수에서 등급 내 편차를 줄이는 최적화로 설명합니다. 교재·GIS 도구마다 용어의 범위가 다를 수 있으므로 영문명과 계산 기준을 함께 확인하세요.";

export const classificationOverlap = "자연분류는 자료의 묶음을 반영하려는 관점입니다. ArcGIS의 Natural Breaks(Jenks)처럼 최적화 알고리즘으로 구현되기도 하므로, 이 다섯 명칭이 언제나 서로 다른 다섯 알고리즘을 뜻하지는 않습니다.";

export function classificationSse(groups: readonly (readonly number[])[]): number {
  return groups.reduce((total, group) => {
    if (group.length === 0) return total;
    const mean = group.reduce((sum, value) => sum + value, 0) / group.length;
    return total + group.reduce((sum, value) => sum + (value - mean) ** 2, 0);
  }, 0);
}

function optimalExampleBreaks(): number[] {
  let bestScore = Number.POSITIVE_INFINITY;
  let bestBreaks: number[] = [];
  // 이 작은 표본의 연속된 비어 있지 않은 3등급 분할 55개를 모두 비교합니다.
  for (let first = 1; first < classificationValues.length - 1; first += 1) {
    for (let second = first + 1; second < classificationValues.length; second += 1) {
      const groups = [classificationValues.slice(0, first), classificationValues.slice(first, second), classificationValues.slice(second)];
      const score = classificationSse(groups);
      if (score < bestScore) {
        bestScore = score;
        bestBreaks = [(classificationValues[first - 1] + classificationValues[first]) / 2, (classificationValues[second - 1] + classificationValues[second]) / 2];
      }
    }
  }
  return bestBreaks;
}

export const classificationMethods: ClassificationMethod[] = [
  {
    id: "equal", title: "등간격 분류법", english: "Equal Interval", focus: "같은 값의 폭",
    description: "최댓값과 최솟값 사이를 같은 폭으로 나눕니다. 지역의 개수를 같게 만드는 방법은 아닙니다.",
    breaks: [20 / 3, 40 / 3], calculation: "등급 폭 = (20 − 0) ÷ 3 = 약 6.67%p. 경계는 약 6.67%, 13.33%입니다.",
    example: "이용률을 일정한 값의 폭으로 보여 주려는 지도에 쓸 수 있습니다. 여러 해를 비교한다면 모든 지도에 같은 전체 범위와 경계를 적용합니다.",
    caution: "값이 한쪽에 몰리면 특정 등급에 지역이 집중되거나 빈 등급이 생길 수 있습니다. ‘등간격’은 지역 수나 지도 면적이 같다는 뜻이 아닙니다.",
    steps: ["최소·최대와 등급 수를 정합니다.", "전체 값의 범위를 등급 수로 나눕니다.", "같은 폭의 경계와 등급별 지역 수를 확인합니다."],
  },
  {
    id: "maximum", title: "최대 분류법", english: "Maximum Breaks · 최대급간", focus: "가장 큰 인접 간격",
    description: "값을 정렬하고 이웃한 값 사이의 차이를 구합니다. 3등급이면 큰 간격 두 곳에 경계를 둡니다.",
    breaks: [2, 16.5], calculation: "13→20의 차이 7%p와 0→4의 차이 4%p가 가장 큽니다. 이 예시는 각 간격의 중간인 2%, 16.5%에 선을 그립니다.",
    example: "관측값 사이에 뚜렷한 빈 구간이 있는 자료에서, 떨어진 값들을 다른 등급으로 구분하려는 경우입니다.",
    caution: "큰 인접 간격을 고르는 기준과 등급 내 제곱편차합을 최소화하는 기준은 다릅니다. 같은 크기의 간격이 여러 개면 동률 처리 규칙도 필요합니다.",
    steps: ["값을 작은 순서로 정렬합니다.", "모든 이웃 값의 차이를 비교합니다.", "등급 수보다 하나 적은 수의 큰 간격을 골라 나눕니다."],
  },
  {
    id: "optimal", title: "최적 분류법", english: "Optimal Classification · SSE 예시", focus: "등급 안의 흩어짐 최소화",
    description: "이 비교에서는 3등급을 고정하고, 각 값과 해당 등급 평균의 차이를 제곱해 합한 값(SSE)이 가장 작은 연속 분할을 찾습니다.",
    breaks: optimalExampleBreaks(), calculation: "가능한 55개 분할을 비교하면 0·4·5·6·7 / 8·9·10·11·12·13 / 20입니다. SSE는 46.7(%p)²로, 최대급간 예시의 82.5(%p)²보다 작습니다.",
    example: "비슷한 비율을 가진 지역들을 같은 등급에 묶고 싶을 때, 등급 수와 평가 기준을 정해 수치로 분할을 비교합니다.",
    caution: "‘최적’은 정한 목표에 대한 표현입니다. 모든 지도 목적에 가장 좋은 분류라는 뜻이 아닙니다. 알고리즘과 목적함수에 따라 결과가 달라질 수 있습니다.",
    steps: ["등급 수와 최적화 기준을 먼저 명시합니다.", "후보 분할의 등급별 평균과 편차를 계산합니다.", "이 예시에서는 전체 SSE가 가장 작은 분할을 고릅니다."],
  },
  {
    id: "quantile", title: "등개수 분류법", english: "Quantile · Equal Count", focus: "비슷한 관측값 개수",
    description: "정렬한 지역들을 개수가 비슷하도록 나눕니다. 이 표본은 중복값 없이 12개이므로 3등급에 4개씩 배치할 수 있습니다.",
    breaks: [6.5, 10.5], calculation: "12 ÷ 3 = 4개씩. 0·4·5·6 / 7·8·9·10 / 11·12·13·20으로 나눕니다.",
    example: "지역별 이용률의 상대적인 순위를 하위·중간·상위 각 3분의 1로 보여 주려는 경우에 적합합니다.",
    caution: "값의 폭이나 지역의 면적은 같지 않습니다. 같은 값을 분리하지 않는다면 중복값이나 나누어떨어지지 않는 개수 때문에 정확히 같은 개수가 안 될 수 있습니다.",
    steps: ["지역을 값의 순서로 정렬합니다.", "전체 개수를 등급 수로 나눠 목표 개수를 구합니다.", "중복값 처리와 경계 양쪽의 값 차이를 확인합니다."],
  },
  {
    id: "natural", title: "자연분류법", english: "Natural Breaks · 분포 관찰 예시", focus: "자료에 나타나는 묶음",
    description: "값의 분포에서 모여 있는 구간과 떨어진 구간을 살펴 나눕니다. 여기서는 0, 4~13, 20의 세 묶음을 관찰해 고른 예시만 보여 줍니다.",
    breaks: [2, 16.5], calculation: "관찰로 고른 경계 2%, 16.5%를 적용하면 1·10·1개입니다. 이 표본에서는 최대급간 예시와 결과가 같으며, 자연분류의 유일한 정답 경계는 아닙니다.",
    example: "분포에 드러난 지역의 묶음을 탐색하며 등급을 정할 때 사용합니다. GIS 도구에서는 Natural Breaks(Jenks) 같은 최적화 방식으로 묶음을 찾기도 합니다.",
    caution: "이 그림은 ArcGIS의 Jenks 실행 결과가 아닙니다. 관찰 방식이나 알고리즘에 따라 경계가 달라질 수 있고, 서로 다른 자료에서 따로 정한 등급은 지도 간 직접 비교에 주의해야 합니다.",
    steps: ["점도표나 히스토그램에서 값이 모인 구간을 봅니다.", "묶음 사이의 빈 구간과 지도 목적을 함께 고려합니다.", "관찰 기준 또는 사용한 Jenks 등 알고리즘을 밝혀 둡니다."],
  },
];

export function classificationGroups(method: ClassificationMethod): number[][] {
  const groups: number[][] = [[], [], []];
  for (const value of classificationValues) {
    const index = method.breaks.findIndex(boundary => value <= boundary);
    groups[index === -1 ? 2 : index].push(value);
  }
  return groups;
}

const sources = ["gittaClassification", "ucgisClassification", "esriClassification", "pysalMaximumBreaks", "pysalFisherJenks"];

export const classificationQuestions: PracticalQuestion[] = [
  {
    id: "pr-classification-five", chapterId: "practical-classification", category: "공간정보 시각화", title: "데이터 분류 · 다섯 명칭과 기준", format: "서술형",
    context: "단계구분도 등 수치 속성의 등급화 문제이다. 이 단원에서 ‘최대’는 Maximum Breaks, ‘최적’은 등급 내 흩어짐을 줄이는 최적화의 의미로 사용한다. 교재의 영문 정의가 별도로 주어지면 그 정의를 따른다.",
    prompt: "등간격 분류법, 최대 분류법, 최적 분류법, 등개수 분류법, 자연분류법의 핵심 기준을 각각 쓰시오.",
    hint: "값의 폭 / 이웃 값의 큰 차이 / 정한 목표의 최적화 / 지역 수 / 분포의 묶음을 연결해 보세요.",
    modelAnswer: "① 등간격: 전체 값의 범위를 같은 폭으로 나눈다.\n② 최대: 정렬한 인접 값 사이의 큰 간격에 경계를 둔다.\n③ 최적: 정한 등급 수와 목적함수에 따라 등급 내 편차 등을 최소화한다.\n④ 등개수: 각 등급의 관측값 개수를 같거나 비슷하게 한다.\n⑤ 자연: 자료 분포에 나타난 묶음과 차이를 반영한다. 자연분류는 Jenks 같은 최적화로 구현되기도 한다.",
    explanation: ["이 문제는 수치 속성의 등급 경계를 정하는 기준을 묻습니다.", "다섯 명칭을 구분해 기억하되 자연분류와 최적화가 서로 겹칠 수 있는 범위도 설명합니다.", "‘최대’를 원격탐사 영상의 최대우도분류와 혼동하지 않습니다."],
    criteria: ["다섯 명칭에 맞는 핵심 기준을 썼다.", "최대급간과 최대우도분류를 구분했다.", "자연분류와 최적화의 용어 범위가 겹칠 수 있음을 이해했다."],
    mistakes: "등간격을 같은 개수로 설명하거나, 다섯 명칭이 언제나 독립된 알고리즘 다섯 개라고 단정하는 답안", referenceIds: sources,
  },
  {
    id: "pr-classification-equal", chapterId: "practical-classification", category: "공간정보 시각화", title: "데이터 분류 · 등간격 계산", format: "계산형",
    context: "가상 지역 이용률의 최소는 10%, 최대는 70%이다. 3등급을 사용하며 첫 등급은 하한·상한 포함, 이후 등급은 하한 제외·상한 포함으로 표시한다.",
    prompt: "등간격 분류의 등급 폭과 세 등급의 범위를 구하고, 30%와 50%가 속하는 등급을 쓰시오.",
    hint: "(최대 − 최소) ÷ 등급 수를 먼저 계산하세요. %로 표시한 비율의 차이는 %p로 씁니다.",
    modelAnswer: "등급 폭 = (70 − 10) ÷ 3 = 20%p.\n1등급: 10% 이상 30% 이하\n2등급: 30% 초과 50% 이하\n3등급: 50% 초과 70% 이하\n따라서 30%는 1등급, 50%는 2등급이다.",
    explanation: ["등간격의 ‘같음’은 수치 범위의 폭입니다.", "경계값을 양쪽 등급에 중복 배치하지 않도록 포함 조건을 명시합니다.", "이 정보만으로 각 등급에 몇 개 지역이 속하는지는 알 수 없습니다."],
    criteria: ["폭을 20%p로 계산했다.", "세 범위와 경계 포함 조건을 올바르게 썼다.", "30%와 50%를 지정한 규칙에 맞게 배치했다."],
    mistakes: "최댓값 70을 바로 3으로 나누거나, 경계값을 두 등급에 동시에 넣는 답안", referenceIds: ["gittaClassification", "esriClassification"],
  },
  {
    id: "pr-classification-maximum", chapterId: "practical-classification", category: "공간정보 시각화", title: "데이터 분류 · 최대급간 찾기", format: "계산형",
    context: "정렬값(%)은 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 20이다. Maximum Breaks로 3등급을 만들고, 선택한 간격의 중간값을 경계 표시 위치로 사용한다.",
    prompt: "경계를 둘 인접 값의 쌍 두 개와 그 차이, 경계 표시 값, 등급별 관측값 개수를 구하시오.",
    hint: "가장 큰 인접 차이 두 개를 선택합니다. 원자료의 큰 값 두 개를 선택하는 것이 아닙니다.",
    modelAnswer: "큰 인접 차이는 13→20의 7%p, 0→4의 4%p이다.\n경계 표시 값은 (0+4)÷2=2%, (13+20)÷2=16.5%이다.\n등급별 값은 [0] / [4,5,6,7,8,9,10,11,12,13] / [20]으로 개수는 1·10·1개이다.",
    explanation: ["3등급을 나누려면 경계는 두 개가 필요합니다.", "최대급간은 인접 차이를 기준으로 하므로 등급별 개수가 크게 다를 수 있습니다.", "빈 간격 안에서의 정확한 표시 경계는 구현에 따라 달라질 수 있습니다. 이 문제는 중간값을 사용하도록 조건을 주었습니다."],
    criteria: ["두 간격과 차이 7%p·4%p를 찾았다.", "문제의 중간값 조건에 따라 2%·16.5%를 구했다.", "개수 1·10·1개를 구했다."],
    mistakes: "값이 가장 큰 13과 20을 각각 경계로 적거나, 등급별 개수를 4개씩 맞추는 답안", referenceIds: ["gittaClassification", "pysalMaximumBreaks"],
  },
  {
    id: "pr-classification-quantile", chapterId: "practical-classification", category: "공간정보 시각화", title: "데이터 분류 · 등개수의 해석", format: "서술형",
    context: "중복값 없는 12개 지역의 값(%)은 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 20이다. 등개수로 3등급을 만든다.",
    prompt: "세 등급에 들어갈 값을 쓰고, ‘각 등급의 값 범위와 지역 면적도 같다’라는 해석의 타당성을 설명하시오. 중복값이 많은 자료의 주의점도 쓰시오.",
    hint: "등개수의 개수는 관측값 수입니다. 같은 값을 서로 다른 등급으로 나누면 어떤 문제가 생길까요?",
    modelAnswer: "12÷3=4개씩이므로 [0,4,5,6] / [7,8,9,10] / [11,12,13,20]이다. 관측값 수는 같지만 값의 폭과 지리적 면적은 같지 않다. 마지막 등급의 11%와 20%처럼 큰 차이의 값도 함께 묶인다. 중복값을 같은 등급에 유지한다면 등급별 개수가 정확히 같아지지 않을 수 있다.",
    explanation: ["등개수는 순위에 따라 지역을 비슷한 수로 배치하는 기준입니다.", "상대 순위 전달에는 편리하지만 가까운 값이 다른 등급으로, 먼 값이 같은 등급으로 나뉠 수 있습니다.", "소프트웨어의 중복값·분위수 처리 방식을 확인해야 합니다."],
    criteria: ["4개씩의 세 묶음을 정확히 썼다.", "관측값 개수·수치 폭·지리적 면적을 구분했다.", "중복값을 유지하면 등급별 개수가 달라질 수 있음을 썼다."],
    mistakes: "등개수이므로 등급별 수치 폭이나 지도상의 면적도 동일하다고 쓰는 답안", referenceIds: ["esriClassification", "ucgisClassification"],
  },
  {
    id: "pr-classification-optimal-natural", chapterId: "practical-classification", category: "공간정보 시각화", title: "데이터 분류 · 자연과 최적의 관계", format: "서술형",
    context: "A 교재는 자연분류를 분포의 묶음을 관찰하는 관점으로, 최적분류를 정한 기준을 수치로 최적화하는 관점으로 설명한다. B GIS의 메뉴에는 Natural Breaks(Jenks)가 있다.",
    prompt: "‘자연분류와 최적분류는 언제나 서로 다른 결과를 낸다’라는 주장에 대해 설명하시오. SSE 최소화를 최적 기준으로 사용할 때 먼저 정해야 할 조건도 쓰시오.",
    hint: "목적을 설명하는 용어와 실제 계산 알고리즘의 이름은 같은 범위일까요?",
    modelAnswer: "언제나 다르다고 단정할 수 없다. 자연분류는 자료의 묶음을 반영하려는 관점이고 Jenks 같은 최적화로 구현되기도 하므로 두 용어의 범위가 겹친다. SSE 최소화 예시에서는 사용할 자료, 등급 수, 연속 분할 등 제약과 목적함수를 먼저 정한다. 교재의 정의와 도구의 알고리즘을 확인한 뒤 결과를 비교한다.",
    explanation: ["같은 이름이 모든 교재·소프트웨어에서 완전히 같은 절차를 뜻하지는 않습니다.", "이 단원의 자연분류 그림은 관찰 경계의 예시이며, 실제 Jenks 계산 결과라고 제시한 것이 아닙니다.", "SSE 최소화는 각 값과 해당 등급 평균의 차이를 제곱해 합한 값을 줄이는 기준입니다."],
    criteria: ["결과가 반드시 다르다는 주장을 부정하고 용어의 겹침을 설명했다.", "등급 수와 목적함수 등의 조건을 명시했다.", "교재 정의와 도구 알고리즘 확인 필요성을 썼다."],
    mistakes: "자연분류는 무조건 수작업만 가능하다거나 최적은 모든 지도 목적에 가장 좋다고 쓰는 답안", referenceIds: ["gittaClassification", "ucgisClassification", "esriClassification", "pysalFisherJenks"],
  },
  {
    id: "pr-classification-purpose", chapterId: "practical-classification", category: "공간정보 시각화", title: "데이터 분류 · 지도 목적에 맞는 선택", format: "서술형",
    context: "① 서로 다른 두 해의 같은 지역 이용률을 동일한 색으로 직접 비교하려 한다. ② 한 해의 지역들을 하위·중간·상위 각 3분의 1로 보여 주려 한다.",
    prompt: "각 목적에 맞는 경계 설정 원칙 또는 분류 방법을 제안하고 이유를 설명하시오. 두 해의 자료를 자연분류로 각각 나눌 때의 주의점도 쓰시오.",
    hint: "같은 색이 같은 수치를 뜻해야 하는 경우와, 같은 상대 순위를 뜻하는 경우를 구분하세요.",
    modelAnswer: "① 두 해에 공통으로 적용할 수치 경계를 고정한다. 예를 들어 공통 전체 범위로 등간격을 정하거나 정책 기준을 같은 경계로 사용한다. ② 상대 순위를 비슷한 개수로 보여 주는 등개수 분류를 고려한다. 두 해를 자연분류로 각각 계산하면 경계가 달라져 같은 색이 서로 다른 이용률 범위를 뜻할 수 있으므로 범례를 확인하고 공통 경계 사용을 검토한다.",
    explanation: ["분류 선택에는 자료의 분포뿐 아니라 지도를 읽는 목적이 필요합니다.", "매년 따로 최소·최대로 등간격을 계산하는 것만으로는 공통 경계가 보장되지 않습니다.", "정책 기준을 쓰는 수동 경계도 목적에 따라 타당한 선택이므로 다섯 방법 중 하나만을 무조건 정답으로 강제하지 않습니다."],
    criteria: ["직접 비교를 위해 공통 수치 경계를 제안했다.", "상대 순위 표현에 등개수를 연결했다.", "연도별 독립 자연분류의 색과 수치 대응 문제를 설명했다."],
    mistakes: "서로 다른 범례인데 색이 같으므로 비율도 같다고 해석하는 답안", referenceIds: ["esriClassification", "ucgisClassification"],
  },
  {
    id: "pr-classification-optimal-score", chapterId: "practical-classification", category: "공간정보 시각화", title: "데이터 분류 · 최적의 판단 기준", format: "서술형",
    context: "같은 12개 비율(%)을 연속된 3등급으로 나눴다. A는 [0] / [4,5,6,7,8,9,10,11,12,13] / [20]이며 SSE=82.5(%p)²이다. B는 [0,4,5,6,7] / [8,9,10,11,12,13] / [20]이며 SSE=46.7(%p)²이다. SSE는 각 값과 소속 등급 평균의 차이를 제곱해 모두 더한 값이다.",
    prompt: "SSE 최소화 기준에서 A와 B 중 더 나은 분할을 고르고, 이것만으로 해당 분할이 모든 지도 목적에 가장 좋다고 말할 수 있는지 설명하시오.",
    hint: "목적함수 값의 비교와 실제 지도 목적에 대한 판단을 나눠 생각합니다.",
    modelAnswer: "46.7이 82.5보다 작으므로 SSE 기준에서는 B가 더 낫다. 그러나 이 비교만으로 모든 지도 목적에 가장 좋다고 말할 수 없다. 순위 표현이나 연도 간 비교, 정책 기준 전달 등 지도 목적이 다르면 다른 경계를 선택할 수 있다. 또한 일반적으로 두 후보만 비교해서 전체 후보 중 최적이라고 증명할 수는 없다.",
    explanation: ["이 단원의 작은 표본에서는 연속된 비어 있지 않은 3등급 분할 55개를 모두 비교해 B의 최솟값을 확인했습니다.", "문제에 주어진 두 점수만으로도 B가 A보다 SSE가 작다는 비교는 할 수 있습니다.", "‘최적’이라고 답할 때는 최적화 목표와 후보의 범위를 함께 설명합니다."],
    criteria: ["SSE가 작은 B를 골랐다.", "정한 목적함수와 모든 지도 목적의 적합성을 구분했다.", "후보 두 개 비교와 전체 최적의 증명을 구분했다."],
    mistakes: "가장 큰 두 인접 간격에 경계를 두었으므로 언제나 SSE도 최소라고 쓰는 답안", referenceIds: ["pysalFisherJenks", "ucgisClassification"],
  },
];

export const classificationLesson: Chapter = {
  id: "practical-classification", number: "01", title: "실기 기초 · 데이터 분류법",
  summary: "같은 12개 값이 등급 경계에 따라 어떻게 달라지는지 비교",
  definition: "지도에서 이용률 같은 수치 속성을 몇 개 등급으로 묶으면 색의 밝기로 분포를 읽을 수 있습니다. 데이터 분류법은 이 등급의 경계를 정하는 기준입니다. 등간격·최대·최적·등개수·자연분류의 기준과 GIS 구현의 관계를 살펴봅니다.",
  keywords: ["등간격", "최대급간", "최적화", "등개수", "자연분류", "등급 경계"],
  concepts: [
    { label: "1. 무엇을 같게 나누나요?", text: "등간격은 수치 범위의 폭을, 등개수는 각 등급의 관측값 수를 같거나 비슷하게 합니다. 지역의 지리적 면적을 같게 나누는 뜻은 아닙니다." },
    { label: "2. 어디가 크게 떨어져 있나요?", text: "최대 분류법은 이 단원에서 Maximum Breaks(최대급간)로 해석합니다. 정렬한 이웃 값의 차이가 큰 곳부터 경계를 선택합니다. 3등급이면 경계는 두 개입니다." },
    { label: "3. 무엇을 최소로 만들까요?", text: "최적 분류법은 등급 수와 목적함수를 정해 분할을 비교하는 관점입니다. 이 예시에서는 등급 평균으로부터의 제곱편차합(SSE)을 최소화합니다. 모든 지도 목적에 가장 좋은 분류라는 뜻은 아닙니다." },
    { label: "4. 자료의 묶음은 어떻게 찾나요?", text: "자연분류는 분포에서 모인 값과 떨어진 값을 반영합니다. 관찰로 경계를 고를 수도 있고 Jenks 같은 알고리즘으로 계산할 수도 있습니다. 따라서 자연분류와 최적화는 용어의 범위가 겹칠 수 있습니다." },
    { label: "5. 이 단원의 용어 범위", text: classificationScope },
  ],
  steps: ["지도 목적·단위 확인", "자료 정렬·분포 관찰", "등급 수와 기준 선택", "경계·포함 조건 설정", "범례와 등급별 개수 검토"],
  examPoint: "명칭만 나열하지 말고 값의 폭·큰 간격·최적화 목표·개수·분포의 묶음이라는 기준을 연결합니다. 자연분류와 최적분류의 결과가 반드시 달라야 한다고 단정하지 않습니다.",
  question: { prompt: "서로 다른 두 해의 이용률 지도에서 같은 색이 같은 비율 범위를 뜻하게 하려면?", choices: ["두 해에 공통 수치 경계를 적용한다", "매년 별도로 자연분류하고 범례는 숨긴다", "등급별 지역 수만 같으면 된다", "가장 진한 색은 언제나 같은 비율이다"], answer: 0, explanation: "같은 색의 직접 비교에는 같은 수치 경계가 필요합니다. 자료별로 다시 분류하면 동일한 색의 범위가 달라질 수 있습니다." },
  guide: {
    visual: "classification", minutes: 12, takeaway: "같은 값을 고정하고 경계만 바꿔 보세요. 등급 수가 같아도 값의 폭과 각 등급의 개수는 달라집니다.",
    comparison: { headers: ["분류법 명칭", "이 단원의 핵심 기준", "먼저 확인할 것"], rows: [["등간격", "같은 값의 폭", "전체 범위와 등급 수"], ["최대", "큰 인접 간격", "정렬값의 차이와 동률"], ["최적", "목적함수의 최적화", "등급 수·제약·평가 기준"], ["등개수", "비슷한 관측값 개수", "중복값 처리"], ["자연", "자료의 묶음과 차이", "관찰 기준 또는 알고리즘"]] },
    example: { title: "같은 지역 12곳, 서로 다른 범례", text: "가상 이용률 0·4·5·6·7·8·9·10·11·12·13·20%를 3등급으로 나눕니다. 등간격은 4·7·1개, 등개수는 4·4·4개가 됩니다. 최대급간과 관찰 기반 자연분류 예시는 모두 1·10·1개이고, 이 표본의 SSE 최소 분할은 5·6·1개입니다. 원자료는 그대로이며 색으로 묶는 기준만 달라집니다." },
    pitfalls: [classificationOverlap, "예시의 최대급간·최적 분할은 빈 간격의 중간에 경계선을 표시합니다. 실제 소프트웨어의 경계 표기값과는 다를 수 있습니다.", "범례에서 하한·상한의 포함 조건을 분명히 합니다. 표시 반올림으로 분류 대상이 달라지지 않도록 실제 계산값과 구분합니다.", "비율(%)의 차이는 퍼센트포인트(%p)입니다. 원자료와 결측값 처리도 분류 전에 확인합니다."],
    advanced: [
      { title: "SSE 46.7은 어떻게 확인했나요?", text: "이 표본은 서로 다른 값 12개를 연속된 비어 있지 않은 3등급으로 나누는 55개 후보를 모두 비교했습니다. 각 등급에서 평균을 뺀 값을 제곱해 더하면 최소가 46.7(%p)²입니다. 이는 원리를 설명하는 작은 예시이며 실제 GIS의 모든 분류 알고리즘을 재현하는 기능은 아닙니다." },
      { title: "같은 값이 여러 번 나오면?", text: "등개수에서 12개를 4개씩 나누려 해도 같은 값이 경계 양쪽에 걸릴 수 있습니다. 동일 값을 한 등급으로 유지할지, 등급 수를 줄일지 등 도구의 처리 방식에 따라 개수가 달라집니다. 개수만 맞추기 위해 같은 값을 다른 색으로 나누면 해석에 주의해야 합니다." },
    ],
    sourceIds: sources,
  },
  practical: { answerTemplate: "① 방법의 명칭과 기준 → ② 등급 수·범위·정렬값 확인 → ③ 계산 또는 선택 이유 → ④ 경계 포함 조건과 범례 검토.\n자연·최적 비교에서는 교재 정의와 사용 알고리즘을 먼저 밝힌다.", sourceIds: sources },
};
