import type { Chapter } from "./course";
import type { PracticalQuestion } from "./practical";

export type TopologyRuleId =
  | "point-disjoint" | "point-on-line" | "point-on-endpoint" | "point-inside"
  | "line-no-overlap" | "line-no-dangles" | "line-no-self-intersect" | "line-no-pseudo-nodes"
  | "polygon-no-overlap" | "polygon-no-gaps" | "polygon-boundary-covered" | "polygon-one-point";
export type TopologyFamily = "point" | "line" | "polygon";
export type TopologyRule = {
  id: TopologyRuleId;
  family: TopologyFamily;
  title: string;
  english: string;
  condition: string;
  example: string;
  exception: string;
  repair: string;
  invalidLabel: string;
  validLabel: string;
};

// Representative rules, not an exhaustive list. Names follow Esri terminology;
// availability, labels, tolerance, and error reporting can differ by software.
export const topologyRules: TopologyRule[] = [
  {
    id: "point-disjoint", family: "point", title: "점 중복 금지", english: "Must Be Disjoint",
    condition: "같은 점 레이어 안에서 서로 다른 점 객체가 같은 위치에 중복되지 않아야 합니다.",
    example: "한 소화전을 두 번 입력해 같은 위치에 관리번호가 다른 점 두 개가 겹친 경우를 찾습니다.",
    exception: "층이 다른 시설이나 관측 시점이 다른 자료처럼 같은 평면 위치가 정당할 수 있습니다. 객체의 의미와 중복 판단 기준을 먼저 정합니다.",
    repair: "관리번호·시설대장·취득 이력을 대조해 중복 입력인지 확인하고, 보존할 속성을 정한 뒤 중복만 정리합니다.",
    invalidLabel: "같은 위치에 점 2개", validLabel: "중복 위치를 1개로 정리",
  },
  {
    id: "point-on-line", family: "point", title: "점은 선 위에 위치", english: "Point Must Be Covered By Line",
    condition: "검사할 점 레이어의 각 점이 참조 라인 레이어의 선 위에 놓여야 합니다. 선의 중간도 조건을 만족할 수 있습니다.",
    example: "하천 수질 측정 지점이 해당 하천 중심선 위에 있는지 확인합니다.",
    exception: "교량 위 센서나 실제 취수 위치처럼 기준 선과 다른 위치가 맞는 자료라면 업무 기준을 확인합니다. 단지 가깝다는 이유만으로 이동하지 않습니다.",
    repair: "원자료와 좌표계·허용오차를 확인해 잘못 입력된 점을 올바른 선에 맞추거나, 참조 선의 누락·오류를 수정합니다.",
    invalidLabel: "점이 기준 선에서 벗어남", validLabel: "점이 기준 선 위에 놓임",
  },
  {
    id: "point-on-endpoint", family: "point", title: "점은 선의 끝점과 일치", english: "Must Be Covered By Endpoint Of",
    condition: "점 레이어의 각 점이 참조 라인 레이어의 끝점과 일치해야 합니다. 선 중간에만 걸친 점은 이 규칙을 만족하지 않습니다.",
    example: "관로의 접속점으로 관리하는 밸브 점이 관로 선분의 끝점과 맞는지 확인합니다.",
    exception: "모든 관측점이 접속점일 필요는 없습니다. 선 중간 관측점을 관리하는 자료에는 '선 위에 위치' 규칙이 더 알맞을 수 있습니다.",
    repair: "실제 접속 위치를 확인해 점을 끝점에 맞추거나 해당 위치에서 선을 분할합니다. 분할 뒤 관로 ID·길이·연결 정보를 재검사합니다.",
    invalidLabel: "점이 선 중간에만 놓임", validLabel: "점과 선분 끝점이 일치",
  },
  {
    id: "point-inside", family: "point", title: "점은 폴리곤 내부에 위치", english: "Must Be Properly Inside Polygons",
    condition: "점 레이어의 각 점이 참조 폴리곤의 내부에 있어야 합니다. 이 엄격한 내부 규칙에서는 경계 위 점도 오류 후보입니다.",
    example: "학교 위치 점이 소속 행정구역의 내부에 기록되어 있는지 확인합니다.",
    exception: "학교가 실제 행정경계에 걸쳐 있거나 기준점의 정의가 다른 경우, 주소·현장 자료로 소속과 표현 위치를 확인합니다.",
    repair: "점과 구역의 출처·기준 시점을 대조하고 오류가 있는 자료를 수정합니다. 경계 포함이 업무 조건이라면 다른 공간 관계를 선택합니다.",
    invalidLabel: "점이 경계 위 또는 외부", validLabel: "점이 폴리곤 내부에 위치",
  },
  {
    id: "line-no-overlap", family: "line", title: "서로 다른 선의 겹침 금지", english: "Must Not Overlap",
    condition: "같은 라인 레이어의 서로 다른 선이 길이를 가진 구간을 중복 점유하지 않아야 합니다. 한 점에서의 교차와 구간 겹침은 구분합니다.",
    example: "한 도로 중심선 레이어에 같은 도로 구간이 두 번 입력되어 총연장이 중복 집계되는 경우를 점검합니다.",
    exception: "여러 버스 노선이 같은 도로를 공유하는 노선 자료에는 겹침이 정상일 수 있습니다. 서로 다른 레이어의 겹침은 별도 교차 레이어 규칙입니다.",
    repair: "도형·노선 ID·속성을 비교해 중복 입력을 확인하고, 필요한 객체를 보존하며 중복 구간을 정리한 뒤 길이 합계를 대조합니다.",
    invalidLabel: "두 선이 같은 구간을 점유", validLabel: "중복 구간을 정리한 선",
  },
  {
    id: "line-no-dangles", family: "line", title: "미연결 끝점 금지", english: "Must Not Have Dangles",
    condition: "선의 끝점이 같은 레이어의 다른 선 또는 자기 선의 일부와 이어져야 합니다. 연결되지 않은 끝점이 댕글 오류 후보입니다.",
    example: "상수도 관망의 연결 지점에서 관로 선 끝이 조금 못 미쳐 단수가 난 것처럼 계산되는 상황을 찾습니다.",
    exception: "막다른 도로, 관로의 실제 종단, 조사 범위 가장자리는 정상적인 끝점일 수 있습니다. 고가도로와 지상도로의 평면 교차도 자동으로 연결하지 않습니다.",
    repair: "실제 연결 여부를 확인해 짧게 끊긴 선은 연장·스냅하고, 지나친 선은 필요 시 잘라냅니다. 허용오차와 종단 예외를 기록하고 재검사합니다.",
    invalidLabel: "연결점에 못 미친 끝점", validLabel: "실제 접속점에 연결",
  },
  {
    id: "line-no-self-intersect", family: "line", title: "한 선의 자기 교차 금지", english: "Must Not Self-Intersect",
    condition: "하나의 선 객체가 자기 자신을 교차하거나 겹치는 구간을 만들지 않아야 합니다. 서로 다른 두 선의 교차를 검사하는 규칙과 다릅니다.",
    example: "등고선 하나를 편집하다가 선이 뒤로 꺾여 자기 자신을 가로지른 입력 실수를 찾습니다.",
    exception: "도로망의 서로 다른 객체가 교차하는 상황이나 지형의 특수 표현은 이 규칙 하나로 판단하지 않습니다. 실제 입체 구조와 자료 제작 기준을 확인합니다.",
    repair: "원래 경로와 표고·관측 자료를 확인해 잘못된 정점과 중복 구간을 수정하고, 단절·길이·속성 변화를 재검사합니다.",
    invalidLabel: "한 객체가 자기 경로와 교차", validLabel: "자기 교차 없는 경로",
  },
  {
    id: "line-no-pseudo-nodes", family: "line", title: "불필요한 분할 노드 금지", english: "Must Not Have Pseudo Nodes",
    condition: "두 선만 끝점끼리 만나 불필요하게 분할된 지점을 찾습니다. 이 규칙은 미연결 끝점을 찾는 댕글 검사와 구분합니다.",
    example: "속성이 같은 하천 구간이 분기점도 아닌 곳에서 두 선으로 나뉘어 관리되는 경우를 점검합니다.",
    exception: "관경·도로명·관리기관·속도 제한이 바뀌는 지점은 두 선만 연결되어도 필요한 분할일 수 있습니다. 객체 속성과 모델 기준을 확인합니다.",
    repair: "불필요한 분할로 확인된 선만 병합하고 보존할 ID·속성을 정합니다. 실제 분기점과 의미 있는 속성 경계는 유지합니다.",
    invalidLabel: "같은 속성의 선이 불필요하게 분할", validLabel: "의미 없는 분할을 병합",
  },
  {
    id: "polygon-no-overlap", family: "polygon", title: "폴리곤 면적 겹침 금지", english: "Must Not Overlap",
    condition: "같은 폴리곤 레이어에서 서로 다른 면의 내부 면적이 중복되지 않아야 합니다. 경계선이나 한 점을 공유하는 것은 허용될 수 있습니다.",
    example: "서로 배타적인 필지 분할 자료에서 이웃 필지가 일부 면적을 동시에 차지하는지 확인합니다.",
    exception: "재해 위험구역과 행정구역처럼 역할이 다른 레이어는 겹침이 정상일 수 있습니다. 규칙이 어느 레이어 사이에 적용되는지 먼저 확인합니다.",
    repair: "원래 경계와 근거 자료를 대조해 공통 경계를 수정하고, 두 필지의 ID·면적·이웃 관계를 다시 검사합니다.",
    invalidLabel: "이웃 면의 내부가 겹침", validLabel: "면적 중복 없이 경계 공유",
  },
  {
    id: "polygon-no-gaps", family: "polygon", title: "연속 면의 빈틈 금지", english: "Must Not Have Gaps",
    condition: "빈틈 없이 덮도록 정한 관리 범위 안에서 폴리곤 사이에 누락된 내부 공간이 없어야 합니다.",
    example: "동별 행정구역이 시 전체를 빠짐없이 나누어야 하는데 경계 편집 중 가느다란 빈틈이 생긴 경우를 찾습니다.",
    exception: "분석 범위 바깥과 의도적으로 제외한 수역·중정 등은 무조건 채우지 않습니다. 관리 범위, 허용된 빈 공간, 도구의 외곽 경계 오류 보고 방식을 확인합니다.",
    repair: "빈틈의 실제 소속을 확인한 뒤 인접 면의 경계를 조정하거나 누락 면을 추가합니다. 전체 범위 피복과 겹침·면적 합계를 함께 재검사합니다.",
    invalidLabel: "관리 범위 안에 빠진 공간", validLabel: "관리 범위를 빠짐없이 피복",
  },
  {
    id: "polygon-boundary-covered", family: "polygon", title: "면 경계는 기준 선으로 덮임", english: "Boundary Must Be Covered By",
    condition: "입력 폴리곤의 경계 전체가 참조 라인 레이어의 선과 일치해야 합니다. 면 경계를 기준 선으로 덮는 방향의 규칙입니다.",
    example: "별도로 관리하는 구역 폴리곤의 경계가 해당 경계선 레이어와 맞는지 검수합니다.",
    exception: "두 자료의 축척·일반화 수준·기준 시점·목적이 다르면 먼저 비교 기준을 정합니다. 모든 참조 선이 면 경계여야 한다는 역방향 조건은 아닙니다.",
    repair: "어느 자료를 기준으로 할지 정하고 빠진 경계선을 추가하거나 잘못된 면·선 위치를 수정합니다. 공유 경계와 속성 이력도 대조합니다.",
    invalidLabel: "면 경계 일부에 기준 선이 없음", validLabel: "면 경계 전체가 기준 선과 일치",
  },
  {
    id: "polygon-one-point", family: "polygon", title: "각 면에 대표점 정확히 1개", english: "Contains One Point",
    condition: "각 폴리곤은 대표점 레이어의 점을 내부에 정확히 한 개 가져야 하고, 각 대표점도 단일 폴리곤 안에 있어야 합니다.",
    example: "관리구역마다 대표 관리점 하나를 두기로 한 자료에서 대표점 누락 또는 중복을 검사합니다.",
    exception: "한 구역에 학교·건물·시설이 여러 개인 자료에는 이 규칙을 그대로 적용하지 않습니다. '정확히 한 개'와 '최소 한 개'는 다른 요구입니다.",
    repair: "대표점의 실제 소속과 선정 기준을 확인해 누락을 보완하거나 중복을 정리합니다. 경계 위 점·외부 점과 전체 일대일 대응을 재검사합니다.",
    invalidLabel: "한 면의 대표점이 0개 또는 2개", validLabel: "각 면 내부에 대표점 1개",
  },
];

export const topologyPracticalQuestions: PracticalQuestion[] = [
  {
    id: "pr-topology-point-disjoint", chapterId: "practical-topology", category: "위상관계 규칙", title: "포인트 1 · 같은 위치의 중복 시설", format: "서술형",
    prompt: "하나의 소화전 레이어에서 같은 위치에 관리번호가 다른 점 두 개가 발견되었다. 적용할 대표 위상 규칙, 오류 후보인 이유, 수정 전 확인 사항을 쓰시오.",
    context: "시설대장상 같은 소화전이 중복 입력되었을 가능성이 있다. 도형은 단순화한 학습용 예시이다.",
    diagram: { kind: "topology", ruleId: "point-disjoint" },
    hint: "겹친 점을 바로 삭제하기 전에 같은 실제 시설인지 확인합니다.",
    modelAnswer: "점 중복 금지(Must Be Disjoint) 규칙을 적용한다. 같은 레이어의 점이 동일 위치를 중복 점유하기 때문이다. 시설대장·관리번호·취득 이력을 비교해 실제 중복인지 확인하고, 필요한 속성을 보존해 중복을 정리한 후 재검사한다.",
    explanation: ["점의 위치 중복과 속성 ID 중복은 서로 다른 검사입니다.", "같은 좌표라고 같은 실제 객체라고 단정할 수 없으므로 원자료를 대조합니다.", "삭제·병합 뒤 객체 수와 남은 속성을 확인합니다."],
    criteria: ["점 중복 금지 규칙을 제시했다.", "시설대장과 속성 대조를 포함했다.", "필요한 속성 보존과 재검사를 설명했다."],
    mistakes: "관리번호가 다르다는 이유만으로 도형 중복을 무시하거나, 원자료 확인 없이 한 점을 지우는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-point-line", chapterId: "practical-topology", category: "위상관계 규칙", title: "포인트 2 · 하천 측정점의 위치", format: "서술형",
    prompt: "하천 중심선 위에 있어야 하는 수질 측정점이 선에서 벗어나 있다. 적용할 규칙과 수정·검증 절차를 쓰시오. 측정점은 선 중간에도 놓일 수 있다.",
    diagram: { kind: "topology", ruleId: "point-on-line" },
    hint: "선 위에 있는 것과 선분의 끝점에 있는 것은 다른 조건입니다.",
    modelAnswer: "점이 선으로 덮여야 하는 규칙(Point Must Be Covered By Line)을 적용한다. 측정점과 하천선의 원본 위치·CRS·허용오차를 확인하고 오류가 있는 점 또는 선을 수정한다. 수정 후 점이 선 위에 있는지와 측정점 ID·속성이 보존되었는지 재검사한다.",
    explanation: ["이 문항은 선 위에 존재하면 되므로 선 중간의 점도 조건을 만족합니다.", "참조 선과 검사할 점의 역할을 구분합니다.", "가까운 선으로 무조건 옮기면 실제 다른 하천에 붙을 수 있습니다."],
    criteria: ["점은 선 위에 있어야 한다는 규칙을 썼다.", "끝점 일치를 필수로 요구하지 않았다.", "원자료·CRS·허용오차 확인과 재검사를 포함했다."],
    mistakes: "모든 측정점을 하천 선분의 끝점으로 이동시키는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-point-endpoint", chapterId: "practical-topology", category: "위상관계 규칙", title: "포인트 3 · 관로 접속점과 선분 끝점", format: "서술형",
    prompt: "관로의 접속점으로 관리하는 밸브 점이 관로 선의 중간에만 놓여 있고 선분 끝점과 일치하지 않는다. 필요한 위상 규칙과 가능한 수정 방법을 쓰시오.",
    diagram: { kind: "topology", ruleId: "point-on-endpoint" },
    hint: "점이 선 위에 있어도 접속용 끝점 규칙은 만족하지 않을 수 있습니다.",
    modelAnswer: "점은 선 끝점으로 덮여야 한다(Must Be Covered By Endpoint Of). 실제 밸브 접속 위치를 확인해 점을 올바른 끝점에 맞추거나 그 위치에서 관로 선을 분할하여 끝점을 만든다. 관로 ID·길이·접속 정보와 끝점 일치를 재검사한다.",
    explanation: ["입력 점이 참조 선의 끝점과 일치하는지를 검사합니다.", "이미 선 중간에 있다는 사실만으로 끝점 일치가 보장되지는 않습니다.", "분할·이동은 실제 설비 위치와 관리 기준을 확인한 뒤 수행합니다."],
    criteria: ["점과 선 끝점 일치 규칙을 제시했다.", "끝점 이동 또는 실제 접속 위치의 선 분할을 설명했다.", "수정 후 연결·속성을 다시 확인했다."],
    mistakes: "점이 선 위에 있으므로 조건을 만족한다고 끝내거나 실제 위치 확인 없이 선을 분할하는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-point-inside", chapterId: "practical-topology", category: "위상관계 규칙", title: "포인트 4 · 구역 경계 위의 학교", format: "서술형",
    prompt: "학교 점은 소속 행정구역의 엄격한 내부에 있어야 한다는 규칙을 적용했다. 학교 점이 구역 경계 위에 있을 때의 판정과 확인·처리 방법을 쓰시오.",
    diagram: { kind: "topology", ruleId: "point-inside" },
    hint: "문제는 경계 포함이 아니라 '엄격한 내부'를 요구합니다.",
    modelAnswer: "엄격한 내부 규칙(Must Be Properly Inside Polygons)에서는 경계 위 점도 오류 후보이다. 학교의 실제 위치·주소·소속과 구역 기준 시점을 확인해 잘못된 자료를 수정하고 재검사한다. 업무가 경계를 포함하도록 요구한다면 공간 관계와 검사 기준 자체를 다시 정한다.",
    explanation: ["내부와 경계를 함께 포함하는 조건은 엄격한 내부 조건과 다릅니다.", "도형 검사 결과만으로 행정 소속을 임의 변경하지 않습니다.", "자료 오류인지 규칙이 목적에 맞지 않는지 구분해야 합니다."],
    criteria: ["경계 위 점을 엄격한 내부 조건의 오류 후보로 판단했다.", "학교 위치·주소와 구역 기준 시점 확인을 포함했다.", "수정 또는 검사 기준 검토 후 재검사를 설명했다."],
    mistakes: "경계 위 점이 언제나 내부 규칙을 통과한다고 쓰거나 소속을 임의로 정하는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-line-overlap", chapterId: "practical-topology", category: "위상관계 규칙", title: "라인 1 · 도로 구간의 중복 입력", format: "서술형",
    prompt: "도로 중심선을 중복 없이 관리하는 한 레이어에서 서로 다른 두 선이 일정 구간을 공유한다. 적용할 규칙을 쓰고, 한 점의 교차와 차이 및 정리 후 검증 항목을 설명하시오.",
    diagram: { kind: "topology", ruleId: "line-no-overlap" },
    hint: "겹침은 공통 길이가 있는 구간이고, 교차는 한 점일 수 있습니다.",
    modelAnswer: "선 겹침 금지(Must Not Overlap)를 적용한다. 일정 길이의 구간 중복이 검사 대상이며 한 점에서의 교차와 구분한다. 원자료·객체 ID를 대조해 중복만 정리하고 연결 관계·속성·도로 총연장을 다시 확인한다.",
    explanation: ["같은 레이어의 서로 다른 객체 사이에서 중복 구간을 찾습니다.", "여러 버스 노선이 도로를 공유하는 자료처럼 겹침이 정당한 모델도 있습니다.", "삭제 후 도로가 끊기거나 속성이 유실되지 않았는지 확인합니다."],
    criteria: ["선 겹침 금지 규칙을 제시했다.", "구간 겹침과 점 교차를 구별했다.", "중복 확인 후 연결·속성·길이를 재검사했다."],
    mistakes: "겹침과 교차를 같은 뜻으로 쓰거나 실제로 다른 노선까지 무조건 삭제하는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-line-dangle", chapterId: "practical-topology", category: "위상관계 규칙", title: "라인 2 · 관망의 틈과 정상 종단", format: "서술형",
    context: "관로 접속 지점에서는 선이 짧게 끊겼고, 별도의 실제 관로 종단도 미연결 끝점으로 표시되었다.",
    prompt: "적용한 위상 규칙과 두 위치의 처리 차이를 설명하시오. 접속 지점의 수정 방법과 재검사 항목도 쓰시오.",
    diagram: { kind: "topology", ruleId: "line-no-dangles" },
    hint: "동일한 경고 표시라도 실제 연결점의 틈과 의도된 종단은 다르게 처리합니다.",
    modelAnswer: "미연결 끝점 금지(Must Not Have Dangles) 규칙이다. 실제 접속 지점의 틈은 원자료·허용오차를 확인해 연장 또는 스냅한다. 실제 관로 종단은 관리 기준상 정상인지 확인해 예외로 기록한다. 수정 후 연결 관계와 길이·속성 및 남은 오류를 재검사한다.",
    explanation: ["이 규칙은 다른 선이나 자기 선과 이어지지 않은 끝점을 찾습니다.", "막다른 길과 실제 관로 종단을 무조건 다른 선에 붙이면 가짜 연결이 생깁니다.", "고가도로와 지상도로도 평면상 교차만으로 접속시키지 않습니다."],
    criteria: ["댕글 규칙을 제시했다.", "접속부 오류와 정상 종단 예외를 구분했다.", "허용오차 확인 후 연결 수정과 재검사를 설명했다."],
    mistakes: "모든 미연결 끝점을 가장 가까운 선으로 일괄 스냅하는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-line-self", chapterId: "practical-topology", category: "위상관계 규칙", title: "라인 3 · 한 객체의 자기 교차", format: "서술형",
    prompt: "등고선 한 객체가 편집 실수로 자기 자신을 가로지른다. 적합한 규칙과 원인 확인·수정 절차를 쓰고, 서로 다른 도로 두 개의 교차와 구분하시오.",
    diagram: { kind: "topology", ruleId: "line-no-self-intersect" },
    hint: "검사 대상이 한 객체 내부의 경로인지, 서로 다른 두 객체의 관계인지 보세요.",
    modelAnswer: "자기 교차 금지(Must Not Self-Intersect) 규칙을 적용한다. 원래 경로와 표고·관측 자료를 확인해 잘못된 정점과 경로를 수정하고 재검사한다. 서로 다른 도로 객체의 교차는 자기 교차가 아니므로 실제 입체 구조와 연결 모델에 맞는 별도 규칙으로 판단한다.",
    explanation: ["하나의 객체가 자기 경로와 교차·겹치는 현상입니다.", "서로 다른 선 객체의 교차와 검사 범위가 다릅니다.", "현장·제작 기준을 확인하고 수정 뒤 단절이나 표고 속성 변화를 점검합니다."],
    criteria: ["자기 교차 금지 규칙을 제시했다.", "한 객체 내부의 오류와 객체 사이 교차를 구분했다.", "원자료 확인과 경로 수정 후 재검사를 포함했다."],
    mistakes: "지도에서 보이는 모든 선 교차를 자기 교차라고 부르는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-line-pseudo", chapterId: "practical-topology", category: "위상관계 규칙", title: "라인 4 · 불필요한 중간 분할", format: "서술형",
    context: "하천의 같은 속성을 가진 두 선이 분기점이 아닌 한 끝점에서만 이어진다. 다른 위치에서는 관경 값이 바뀌는 두 관로가 같은 방식으로 이어진다.",
    prompt: "불필요한 중간 분할을 찾는 규칙을 쓰고, 두 경우를 모두 병합해도 되는지 설명하시오.",
    diagram: { kind: "topology", ruleId: "line-no-pseudo-nodes" },
    hint: "두 선만 연결되어도 속성 경계를 보존해야 하는 경우가 있습니다.",
    modelAnswer: "의사 노드 금지(Must Not Have Pseudo Nodes) 규칙이다. 분할 목적과 속성을 확인해 불필요한 하천 분할만 병합한다. 관경이 바뀌는 지점은 의미 있는 속성 경계일 수 있으므로 관리 기준에 따라 유지·예외 처리한다. 병합 후 ID·속성과 연결 관계를 재검사한다.",
    explanation: ["연결이 없는 끝점을 찾는 댕글 규칙과 다릅니다.", "두 선만 끝점으로 이어진 지점이 규칙의 오류 후보입니다.", "객체를 줄이는 것보다 분석과 관리에 필요한 의미를 보존하는 것이 우선입니다."],
    criteria: ["의사 노드 규칙을 썼다.", "불필요한 분할과 속성 변경 경계를 구분했다.", "선별 병합·예외 기록과 속성 재검사를 설명했다."],
    mistakes: "두 선만 연결된 모든 노드를 속성 확인 없이 병합하는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-polygon-overlap", chapterId: "practical-topology", category: "위상관계 규칙", title: "폴리곤 1 · 이웃 필지의 중복 면적", format: "서술형",
    prompt: "중복 없는 필지 분할 레이어에서 이웃한 두 필지의 내부가 겹친다. 필요한 규칙과 수정 기준을 쓰고, 경계 공유 및 서로 다른 목적의 레이어 중첩과 구분하시오.",
    diagram: { kind: "topology", ruleId: "polygon-no-overlap" },
    hint: "공통 면적이 있는지, 경계만 공유하는지 구분합니다.",
    modelAnswer: "폴리곤 겹침 금지(Must Not Overlap) 규칙을 적용한다. 근거 경계와 원자료를 확인해 이웃 면의 공통 경계를 수정하고 면적·ID·인접 관계를 재검사한다. 경계선 공유는 면적 겹침과 다르며, 역할이 다른 레이어의 중첩은 목적에 따라 정상일 수 있다.",
    explanation: ["같은 필지 분할 레이어 안의 내부 면적 중복을 검사합니다.", "필지가 경계선으로 맞닿는 것은 연속 분할에서 정상입니다.", "재해 위험구역과 행정구역처럼 다른 레이어의 겹침까지 일괄 제거하지 않습니다."],
    criteria: ["폴리곤 겹침 금지 규칙을 제시했다.", "면적 겹침·경계 공유·다른 레이어 중첩을 구별했다.", "근거 경계 확인과 면적·관계 재검사를 포함했다."],
    mistakes: "경계만 공유하는 면도 삭제하거나 모든 레이어의 중첩을 오류로 취급하는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-polygon-gaps", chapterId: "practical-topology", category: "위상관계 규칙", title: "폴리곤 2 · 행정구역 사이 빈틈", format: "서술형",
    context: "동별 행정구역이 시 관리 범위를 빈틈없이 분할해야 한다. 경계 편집 후 내부에 가느다란 미분류 영역이 생겼다.",
    prompt: "필요한 규칙과 오류 처리 순서를 쓰시오. 분석 범위 바깥이나 사전에 제외한 공간도 같은 방법으로 채워야 하는지 설명하시오.",
    diagram: { kind: "topology", ruleId: "polygon-no-gaps" },
    hint: "전체 관리 범위를 먼저 정하고 빈틈의 실제 소속을 확인하세요.",
    modelAnswer: "빈틈 금지(Must Not Have Gaps) 규칙을 적용한다. 관리 범위와 허용된 빈 공간을 확인하고 내부 누락 영역의 소속을 근거 자료로 판정한다. 경계를 조정하거나 누락 면을 추가한 뒤 피복·겹침·면적을 재검사한다. 범위 바깥과 의도된 제외 공간은 무조건 채우지 않고 기준에 맞춰 예외를 관리한다.",
    explanation: ["빈틈은 연속 피복이 요구되는 범위에서 누락된 공간입니다.", "겹침 금지와 빈틈 금지는 별도 규칙이므로 함께 점검합니다.", "도구가 외곽 경계도 보고한다면 검사 범위에 맞춰 결과를 해석합니다."],
    criteria: ["빈틈 금지 규칙을 제시했다.", "관리 범위와 의도된 제외 공간을 구분했다.", "소속 확인 후 수정·피복 및 겹침 재검사를 설명했다."],
    mistakes: "빈 공간의 소속과 범위를 확인하지 않고 가장 큰 이웃 면에 모두 병합하는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-polygon-boundary", chapterId: "practical-topology", category: "위상관계 규칙", title: "폴리곤 3 · 면 경계와 기준선 대조", format: "서술형",
    prompt: "구역 폴리곤의 경계 전체가 기준 경계선 레이어로 덮여야 한다. 일부 구간에 기준 선이 없다. 적용할 규칙과 가능한 수정 방법을 쓰고 검사 방향을 명시하시오.",
    diagram: { kind: "topology", ruleId: "polygon-boundary-covered" },
    hint: "어느 레이어가 검사 대상이고 어느 레이어가 덮는 기준인지 분명히 쓰세요.",
    modelAnswer: "면 경계는 선으로 덮여야 한다(Boundary Must Be Covered By) 규칙이다. 검사 대상은 구역 면의 경계, 참조 대상은 경계선 레이어다. 출처·시점·정확도와 기준 자료를 정한 뒤 누락 선을 보완하거나 잘못된 경계를 수정하고 전체 경계 일치를 재검사한다.",
    explanation: ["검사는 폴리곤 경계가 참조 선으로 덮이는지를 확인하는 방향입니다.", "참조 선 전체가 폴리곤 경계여야 한다는 역방향 요구와는 다릅니다.", "폴리곤 경계에 맞춰 선을 만들기 전에 어느 자료가 올바른지 확인합니다."],
    criteria: ["면 경계의 선 피복 규칙을 제시했다.", "입력 면 경계와 참조 선의 역할을 구분했다.", "기준 자료 확인 후 누락·위치 수정과 재검사를 설명했다."],
    mistakes: "선은 면 안에만 있으면 된다고 쓰거나 두 레이어의 검사 방향을 뒤바꾸는 답안", referenceIds: ["esriTopology"],
  },
  {
    id: "pr-topology-polygon-point", chapterId: "practical-topology", category: "위상관계 규칙", title: "폴리곤 4 · 대표점의 개수 조건", format: "서술형",
    context: "각 관리구역 내부에 대표 관리점을 정확히 하나씩 둔다. 어떤 구역에는 점이 없고 다른 구역에는 두 점이 있다.",
    prompt: "적용할 규칙을 쓰고 두 구역의 판정, 점과 면의 대응 조건, 수정·재검사 방법을 설명하시오.",
    diagram: { kind: "topology", ruleId: "polygon-one-point" },
    hint: "'최소 한 개'와 '정확히 한 개'를 구분합니다.",
    modelAnswer: "Contains One Point 규칙을 적용한다. 대표점이 0개인 면과 2개인 면 모두 조건 위반이다. 각 면 내부에 정확히 한 점이 있고 각 점도 단일 면 안에 있어야 한다. 대표점 선정 기준과 소속을 확인해 누락·중복을 정리하고 경계 위·외부 점과 전체 일대일 대응을 재검사한다.",
    explanation: ["한 면당 하나라는 개수 조건이 핵심입니다.", "대표점이라는 자료 모델에 맞춰 적용하며, 모든 시설점 자료에 같은 조건을 강요하지 않습니다.", "좌표가 내부에 있는지와 개수가 맞는지를 함께 확인합니다."],
    criteria: ["정확히 한 점 조건과 0개·2개의 위반을 설명했다.", "각 점도 단일 면 내부에 있어야 함을 언급했다.", "선정 기준 확인 후 누락·중복 수정과 재검사를 포함했다."],
    mistakes: "두 점이 있어도 최소 한 점은 있으므로 통과한다고 판단하는 답안", referenceIds: ["esriTopology"],
  },
];

export const topologyLesson: Chapter = {
  id: "practical-topology", number: "09", title: "실기 기초 · 위상관계 규칙",
  summary: "포인트·라인·폴리곤의 조건을 도형과 생활 사례로 읽고 실기 답안으로 설명합니다.",
  definition: "위상 규칙은 자료의 목적에 맞게 점·선·면의 관계를 점검하는 약속입니다. 같은 모양도 적용한 규칙과 업무 조건에 따라 오류 여부가 달라집니다.",
  keywords: ["포인트", "라인", "폴리곤", "댕글", "겹침·빈틈", "예외 관리"],
  concepts: [
    { label: "포인트 · 어디에 놓여야 하나요?", text: "같은 위치의 중복, 선 위의 위치, 선분 끝점과의 일치, 폴리곤 내부 여부를 구분합니다. 선 중간에 있는 점은 선 피복 조건을 만족해도 끝점 일치 조건은 만족하지 않을 수 있습니다." },
    { label: "라인 · 어떻게 이어져야 하나요?", text: "서로 다른 선의 구간 겹침, 미연결 끝점, 한 선의 자기 교차, 불필요한 중간 분할을 나누어 검사합니다. 화면상 교차와 실제 네트워크 연결도 구별합니다." },
    { label: "폴리곤 · 면을 어떻게 나누나요?", text: "면적 겹침과 빈틈은 별도 조건입니다. 면 경계와 기준 선의 일치, 각 면에 대표점이 정확히 한 개 있는지도 목적에 따라 검사합니다." },
    { label: "오류 표시 뒤에 필요한 판단", text: "막다른 도로, 의도된 제외 공간, 속성 변경점은 정당한 예외가 될 수 있습니다. 원자료·기준 시점·허용오차·검사 범위를 확인하고, 수정 뒤 동일 규칙으로 다시 검사합니다." },
  ],
  steps: ["자료 목적·검사 범위 확인", "객체·참조 레이어와 규칙 설정", "오류 위치·원자료 대조", "수정 또는 예외 기록", "같은 규칙으로 재검사"],
  examPoint: "실기 답안에는 규칙 이름만 적지 말고 '어느 객체가 어떤 조건을 위반했는지 → 확인할 근거 → 수정·예외 → 재검사'를 함께 쓰세요.",
  question: { prompt: "관로의 실제 종단이 미연결 끝점으로 표시되었다. 가장 적절한 처리는?", choices: ["가장 가까운 관로에 무조건 연결", "원자료와 관리 기준을 확인해 정상 종단이면 예외로 기록", "전체 선을 폴리곤으로 변환", "표시된 끝점을 모두 삭제"], answer: 1, explanation: "위상 검사의 오류 표시는 업무 조건과 함께 해석해야 합니다. 실제 종단은 정상일 수 있으므로 근거를 확인해 예외로 기록합니다." },
  guide: {
    visual: "topology-rules", minutes: 10,
    takeaway: "점을 놓는 조건, 선을 잇는 조건, 면을 나누는 조건을 구분하세요. 그림의 오류 후보를 보고 이유와 처리 방법까지 설명해 보세요.",
    comparison: {
      headers: ["레이어", "대표 검사", "실생활 예 / 핵심 구분"],
      rows: [
        ["포인트", "중복·선 위·끝점·면 내부", "소화전·수질 측정점 / 선 위와 끝점은 다름"],
        ["라인", "겹침·댕글·자기 교차·의사 노드", "관로·도로·하천 / 실제 종단과 불필요 분할 구분"],
        ["폴리곤", "겹침·빈틈·경계 피복·대표점 개수", "필지·행정구역 / 정확히 한 개와 최소 한 개 구분"],
      ],
    },
    example: { title: "마을 시설·관로·관리구역을 함께 점검한다면", text: "시설점이 중복되었는지, 관로가 실제 접속 위치에서 이어지는지, 관리구역이 누락 없이 분할되는지 나누어 확인합니다. 실제 관로 종단은 예외로, 실수로 생긴 틈은 수정 대상으로 처리합니다. 도형만 보고 일괄 스냅하거나 빈 공간을 모두 채우면 실제 관계를 훼손할 수 있습니다." },
    pitfalls: [
      "이 단원의 12개 규칙은 대표적인 학습 목록입니다. 모든 소프트웨어의 전체 규칙 목록이나 동일한 메뉴명을 뜻하지 않습니다.",
      "댕글 금지와 의사 노드 금지는 서로 다른 규칙입니다. 끝점이 안 이어진 것과 불필요하게 두 선으로 나뉜 것을 구분하세요.",
      "같은 레이어의 겹침과 다른 목적의 두 레이어가 중첩되는 상황을 구분하세요.",
      "내부 규칙의 경계 포함 여부와 정확히 한 점이라는 개수 조건을 확인하세요.",
    ],
    advanced: [
      { title: "위상 검사와 네트워크 모델", text: "평면상 선이 교차하거나 접촉해도 실제 도로·관로가 연결된다는 보장은 없습니다. 입체교차와 층·높이, 접속 노드 및 네트워크 모델의 연결 정책을 확인해야 합니다." },
      { title: "허용오차와 수정의 영향", text: "스냅 거리나 클러스터 허용오차를 크게 설정하면 정상 객체가 이동하거나 짧은 구간이 사라질 수 있습니다. 원자료의 정확도·CRS 단위에 맞게 정하고 수정 전후 객체 수·길이·면적·속성을 비교합니다." },
      { title: "기하 유효성과 레이어 관계", text: "자기 교차 같은 도형 검사와 여러 객체·레이어 사이의 겹침·피복 규칙은 범위가 다릅니다. 오류 이름만 외우기보다 검사 대상, 참조 레이어, 경계·개수 조건을 먼저 파악하세요." },
    ],
    sourceIds: ["esriTopology", "qgisTopology"],
  },
  practical: {
    answerTemplate: "① 검사 대상·참조 레이어와 업무 조건을 쓴다.\n② 규칙 이름과 위반 위치·이유를 설명한다.\n③ 원자료·시점·허용오차를 확인한다.\n④ 필요한 수정 또는 근거 있는 예외 처리를 한다.\n⑤ 같은 규칙과 길이·면적·속성으로 결과를 재검사한다.",
    sourceIds: ["esriTopology", "qgisTopology"],
  },
};
