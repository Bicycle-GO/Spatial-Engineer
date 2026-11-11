import type { Chapter } from "./course";
import type { PracticalQuestion } from "./practical";

export const ndviQuestions: PracticalQuestion[] = [
  {
    id:"pr-ndvi-name",chapterId:"practical-ndvi",category:"식생지수·영상",title:"공간 영상 처리 · 식생지수의 명칭",format:"단답형",
    prompt:"원격탐사 영상에 나타난 식생의 분광특성을 이용하여 근적외선 밴드와 적색 밴드의 반사도 차이를 구하고, 이를 두 밴드 반사도의 합으로 정규화한 지수는?",
    hint:"영문 약자는 N으로 시작하며, 적외선은 이 문맥에서 근적외선(NIR)을 뜻합니다.",
    modelAnswer:"정규화 식생지수(NDVI, Normalized Difference Vegetation Index)",
    explanation:["식생의 잎은 일반적으로 적색광을 잘 흡수하고 근적외선을 상대적으로 많이 반사합니다.","NDVI = (NIR − Red) / (NIR + Red)로 두 밴드의 차이를 합으로 정규화합니다.","분자는 ‘근적외선 − 적색’ 순서입니다. 열적외선 밴드와 혼동하지 않습니다."],
    criteria:["정규화 식생지수 또는 NDVI라고 정확히 썼다.","근적외선·적색 반사도의 차이를 합으로 나누는 지수임을 이해했다."],
    mistakes:"NDWI 등 다른 정규화 지수를 쓰거나 열적외선 온도를 사용하는 지수로 설명하는 답안",referenceIds:["usgsNdvi","nasaNdvi"],
  },
  {
    id:"pr-ndvi-calculate",chapterId:"practical-ndvi",category:"식생지수·영상",title:"공간 영상 처리 · NDVI 계산",format:"계산형",
    context:"같은 화소에서 전처리가 끝난 근적외선 반사도는 0.60, 적색 반사도는 0.20이다. 두 값은 같은 무차원 반사도 기준이다.",
    prompt:"NDVI를 구하고 계산 과정을 쓰시오.",
    hint:"분자에서 차이를, 분모에서 합을 구합니다.",
    modelAnswer:"NDVI = (0.60 − 0.20) / (0.60 + 0.20) = 0.40 / 0.80 = 0.50 (무차원)",
    explanation:["분자는 근적외선에서 적색을 뺀 0.40입니다.","분모는 두 반사도의 합인 0.80입니다.","반사도 비율로 계산하므로 최종값에 m나 %를 붙이지 않습니다. NDVI 0.50을 식생 피복률 50%로 해석하지 않습니다."],
    criteria:["(NIR−Red)/(NIR+Red) 식에 올바른 순서로 대입했다.","최종값 0.50과 무차원 지수라는 의미를 썼다."],
    mistakes:"차이 0.40만 답하거나, 분자의 순서를 바꾸어 −0.50이라고 쓰거나 피복률 50%로 해석하는 답안",referenceIds:["usgsNdvi"],
  },
  {
    id:"pr-ndvi-interpret",chapterId:"practical-ndvi",category:"식생지수·영상",title:"공간 영상 처리 · NDVI의 해석과 결측",format:"서술형",
    prompt:"① 근적외선과 적색 반사도가 모두 0일 때 NDVI를 어떻게 처리해야 하는가? ② 같은 지역의 NDVI가 이전보다 높아졌다는 사실만으로 식물의 건강이 좋아졌다고 단정할 수 있는가? 이유를 쓰시오.",
    hint:"분모가 0인 경우와 관측 조건이 다른 경우를 구분합니다.",
    modelAnswer:"① 분모 NIR+Red가 0이므로 계산할 수 없다. 0이라는 유효 NDVI로 채우지 말고 결측·유효성 마스크 등 처리 규칙을 적용한다.\n② 단정할 수 없다. 계절·식생 종류·구름·대기·토양 배경과 관측 및 전처리 조건 등을 함께 확인해야 한다.",
    explanation:["0/0은 정의되지 않습니다. NDVI 0은 두 반사도가 같고 합은 0이 아닐 때도 나올 수 있는 유효값입니다.","일반적으로 높은 양의 NDVI는 식생의 활발한 반사 특성과 관련되지만 모든 식물·계절에 하나의 건강 판정 기준을 적용하지 않습니다.","센서별 밴드 번호와 제품의 스케일·오프셋·결측값을 확인한 뒤 물리 반사도를 사용합니다."],
    criteria:["분모 0을 계산 불가·결측 처리로 구분했다.","NDVI 변화 해석에 관측·식생·환경 조건 확인이 필요하다고 설명했다."],
    mistakes:"분모가 0이면 NDVI도 0이라고 하거나 NDVI만으로 건강·수확량을 확정하는 답안",referenceIds:["usgsNdvi","nasaNdvi"],
  },
];

export const ndviLesson: Chapter = {
  id:"practical-ndvi",number:"01",title:"실기 기초 · 식생의 분광특성과 NDVI",
  summary:"잎이 적색과 근적외선에 다르게 반응하는 이유를 지수로 연결",
  definition:"정규화 식생지수(NDVI)는 근적외선과 적색 반사도의 차이를 두 반사도의 합으로 나눈 값입니다. 식생의 분광특성을 이용해 식생 상태와 변화를 살펴보는 데 활용합니다.",
  keywords:["정규화 식생지수","NDVI","근적외선 NIR","적색 Red","반사도"],
  concepts:[
    {label:"식생의 분광특성",text:"잎은 광합성에 쓰는 적색광을 많이 흡수하고, 근적외선은 상대적으로 많이 반사하는 경향이 있습니다. 두 밴드의 반응 차이가 식생을 살펴보는 단서가 됩니다."},
    {label:"차이 ÷ 합",text:"NDVI = (NIR − Red) / (NIR + Red)입니다. 근적외선이 적색보다 크면 양수, 반대로 작으면 음수가 됩니다. 두 값이 같아도 합이 0이 아니어야 NDVI 0을 계산할 수 있습니다."},
    {label:"0.60과 0.20을 넣으면",text:"차이 0.40을 합 0.80으로 나누면 0.50입니다. NDVI는 무차원 지수이며 식생이 차지하는 면적 비율 50%와 같은 뜻이 아닙니다."},
    {label:"관측 조건과 함께 해석",text:"같은 조건에서 높은 양의 값은 대체로 식생과 관련되지만 계절·종류·토양·구름·대기의 영향도 받습니다. 건강·수확량을 한 값만으로 확정하지 않습니다."},
  ],
  steps:["센서와 근적외선·적색 밴드 확인","반사도·스케일·결측 조건 확인","차이를 합으로 나누기","관측 조건과 결과 해석"],
  examPoint:"정의형 단답 문제는 ‘정규화 식생지수(NDVI)’라고 답합니다. 적외선은 여기서 근적외선이며 분자의 순서는 NIR−Red입니다.",
  question:{prompt:"NIR=0.60, Red=0.20일 때 NDVI는?",choices:["0.50","0.40","−0.50","식생 면적 50%"],answer:0,explanation:"(0.60−0.20)/(0.60+0.20)=0.50입니다. NDVI는 면적 비율이 아닙니다."},
  guide:{visual:"ndvi",minutes:6,takeaway:"두 반사도 막대를 비교하고 ‘차이 ÷ 합’을 직접 바꿔 보세요.",
    comparison:{headers:["항목","뜻","예시"],rows:[["NIR","근적외선 반사도","0.60"],["Red","적색 반사도","0.20"],["NDVI","(NIR−Red)/(NIR+Red)","0.50 · 무차원"],["합이 0","나눗셈을 정의할 수 없음","결측·유효성 처리"]]},
    example:{title:"같은 밭의 계절별 식생 변화",text:"같은 밭을 관찰했을 때 잎이 무성한 시기의 반사도 차이가 더 크게 나타날 수 있습니다. NDVI 변화는 계절과 생육 상태를 살펴보는 단서가 되지만, 구름·관측 조건·작물 종류가 다른 영상을 그대로 비교하지 않도록 확인합니다."},
    pitfalls:["열적외선 온도를 NIR 자리에 넣지 않습니다.","센서마다 밴드 번호가 다릅니다. Landsat 8·9의 예시는 NIR=Band 5, Red=Band 4입니다.","저장 정수값에 스케일·오프셋이 있으면 제품 지침대로 반사도를 복원합니다. 분모 0과 유효 NDVI 0은 구분합니다."],
    advanced:[{title:"이론 범위와 실제 품질 관리",text:"음이 아닌 반사도에서 합이 양수이면 NDVI는 −1~1 범위입니다. 실제 영상은 결측·포화·구름과 전처리 오차를 점검해야 합니다. 화면의 예시 값은 원리를 위한 가상 값이며 보편적인 식생 판정 임계값이 아닙니다."}],
    sourceIds:["usgsNdvi","nasaNdvi"]},
  practical:{answerTemplate:"명칭: 정규화 식생지수(NDVI).\n식: (NIR−Red)/(NIR+Red).\n계산: 차이 → 합 → 나눗셈 → 무차원 결과.\n해석: 관측 조건·결측과 비교 범위를 함께 확인한다.",sourceIds:["usgsNdvi","nasaNdvi"]},
};
