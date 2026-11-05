import type { Chapter } from "./course";
import type { PracticalQuestion } from "./practical";

export type RasterCellRuleId = "presence" | "center" | "dominant" | "percent";
export const rasterCellRules: {id:RasterCellRuleId;name:string;english:string;question:string;description:string;result:string;reason:string;example:string}[] = [
  {id:"presence",name:"존재 유무법",english:"Presence / absence",question:"대상이 조금이라도 있나요?",description:"먼저 조사할 대상을 정하고, 셀 안에 있으면 1, 없으면 0으로 기록합니다.",result:"도로 있음 · 1",reason:"셀의 10%에 도로가 있으므로, 도로 존재 여부를 나타내는 값은 1입니다.",example:"폭이 좁은 도로·하천·관로가 어느 격자를 통과하는지 찾을 때 생각해 볼 수 있습니다. 면적의 크기보다 대상의 유무가 목적입니다."},
  {id:"center",name:"중심점법",english:"Cell center / centroid",question:"셀 한가운데에는 무엇이 있나요?",description:"셀 중심점이 들어 있는 구역의 속성값을 대표값으로 사용합니다. 가장 넓은 구역과 다를 수 있습니다.",result:"밭 · 코드 20",reason:"중심점은 밭 안에 있습니다. 산림 면적이 더 넓어도 중심점 기준 결과는 밭입니다.",example:"토지이용 구역을 격자로 바꿀 때 셀의 한가운데에 있는 구역 코드를 선택합니다. 경계 셀의 작은 대상은 표현되지 않을 수 있습니다."},
  {id:"dominant",name:"최대 점유 면적법",english:"Predominant / dominant type",question:"셀에서 가장 넓은 종류는 무엇인가요?",description:"셀 내부에서 차지하는 면적이 가장 큰 종류의 값을 사용합니다. 이 예시는 같은 종류의 면적을 합산하고 동률이 없는 경우입니다.",result:"산림 · 코드 10",reason:"산림 55%가 밭 35%와 도로 10%보다 넓으므로 산림을 선택합니다.",example:"큰 격자로 지역의 주된 토지피복을 표현할 때 유용합니다. 작은 도로나 물길은 주된 종류에 가려질 수 있습니다."},
  {id:"percent",name:"면적비율법",english:"Percent occurrence",question:"관심 대상이 셀의 몇 %인가요?",description:"선택한 종류의 면적을 셀 전체 면적으로 나누어 비율로 기록합니다. 종류를 나타내는 코드 대신 비율을 저장합니다.",result:"도로 비율 · 10%",reason:"도로 10m² ÷ 전체 100m² × 100 = 10%입니다. 숫자 10은 이 경우 산림 코드 10과 뜻이 다릅니다.",example:"격자별 녹지율·불투수면 비율처럼 혼합된 셀의 구성을 비교합니다. 종류별 비율은 별도 밴드나 레이어로 관리할 수 있습니다."},
];

export const rasterizationPracticalQuestions: PracticalQuestion[] = [
  {
    id:"pr-rasterization-four", chapterId:"practical-rasterization", category:"래스터 셀 값", title:"래스터 변환 · 셀 값 결정 방식 네 가지", format:"단답형",
    context:"벡터를 래스터로 바꿀 때의 셀 값(화소 값) 결정 문제이다. Washington State Ecology 교육자료의 존재 여부·중심 위치·우세 면적·면적 비율 네 가지 코딩 규칙을 기준으로 하며, 한글 명칭은 학습용 번역이다.",
    prompt:"래스터 데이터로 변환 시 화소 값(셀 값)의 결정 방식 4가지를 쓰시오.",
    hint:"있나? 가운데는? 가장 넓은 것은? 몇 %인가? 순서로 떠올려 보세요.",
    modelAnswer:"① 존재 유무법(Presence / absence)\n② 중심점법(Cell center / centroid)\n③ 최대 점유 면적법(Predominant / dominant type, 우세형)\n④ 면적비율법(Percent occurrence)",
    explanation:["존재 유무는 특정 대상이 있는지를 1·0 등으로 기록합니다.","중심점법은 셀 중심이 포함된 구역의 값을 사용합니다.","최대 점유 면적법은 셀 내부 면적이 가장 큰 종류를 선택합니다.","면적비율법은 대상 면적이 전체 셀에서 차지하는 비율을 저장합니다.","이 문항의 ‘화소 값’은 셀에 저장할 값입니다. 여러 숫자 중 가장 작은 수를 고르는 최솟값(MIN) 집계와 구분합니다."],
    criteria:["이 문항에서 지정한 네 가지 규칙을 모두 썼다.","범주 코드·존재 여부·면적 비율이 서로 다른 출력 의미임을 이해했다."],
    mistakes:"최솟값 집계나 최근린·이중선형·3차회선 등 재표본화 목록을 네 가지 셀 코딩 규칙과 혼동하는 답안",referenceIds:["waGridCoding","ucgisConversion","gdalRasterize"],
  },
  {
    id:"pr-rasterization-compare", chapterId:"practical-rasterization", category:"래스터 셀 값", title:"래스터 변환 · 같은 셀, 다른 대표값", format:"서술형",
    context:"100m² 셀 안에 산림 55m²(코드 10), 밭 35m²(코드 20), 도로 10m²(코드 30)가 있고 서로 겹치지 않는다. 셀 중심은 밭 안이다.",
    prompt:"① 중심점법의 값 ② 최대 점유 면적법의 값 ③ 도로 존재 유무(있음=1, 없음=0) ④ 도로 면적 비율(%)을 각각 구하시오.",
    hint:"같은 숫자여도 코드인지 비율인지 단위와 의미를 함께 씁니다.",
    modelAnswer:"① 밭의 코드 20\n② 산림의 코드 10\n③ 도로 있음: 1\n④ 도로 비율: 10 / 100 × 100 = 10%",
    explanation:["중심은 밭이므로 코드 20을 선택합니다.","산림이 셀의 55%로 가장 넓으므로 최대 점유 면적법은 코드 10입니다.","도로의 면적이 작아도 존재하므로 1입니다.","도로 비율 10%와 산림 코드 10은 수치가 비슷해도 의미가 다릅니다."],
    criteria:["20·10·1·10%를 순서와 의미에 맞게 썼다.","셀 중심과 면적 우세를 구분하고 비율 계산에 %를 표시했다."],
    mistakes:"도로 비율의 답을 도로 코드 30으로 쓰거나 중심점법에서도 가장 넓은 산림을 선택하는 답안",referenceIds:["waGridCoding","ucgisConversion"],
  },
  {
    id:"pr-rasterization-road", chapterId:"practical-rasterization", category:"래스터 셀 값", title:"래스터 변환 · 작은 도로 보존 목적", format:"서술형",
    prompt:"도로 통과 여부를 조사하려 한다. 도로가 셀 가장자리만 지나 중심점을 통과하지 않고 산림이 가장 넓다. 존재 유무법·중심점법·최대 점유 면적법 중 목적에 맞는 방법을 고르고 이유를 쓰시오.",
    hint:"이 분석은 주된 토지피복보다 도로가 하나라도 있는지를 묻습니다.",
    modelAnswer:"도로를 대상으로 한 존재 유무법을 선택한다. 도로가 셀 일부만 지나도 있음으로 기록하므로 통과 여부를 나타낼 수 있다. 중심점법과 최대 점유 면적법은 이 조건에서 도로 대신 다른 종류를 선택할 수 있다.",
    explanation:["규칙을 고르는 기준은 보기 좋은 그림보다 분석 목적입니다.","도로 있음=1은 도로가 셀 전체를 덮거나 셀만큼 넓다는 의미가 아닙니다.","원래 도로의 폭·위치·연결을 정확히 복원하려면 원본 벡터와 셀 크기를 함께 확인합니다."],
    criteria:["대상을 도로로 정한 존재 유무법을 선택했다.","일부만 통과해도 있음으로 기록하는 목적과 다른 두 방식의 한계를 설명했다."],
    mistakes:"도로가 검출된 셀 전체가 실제 도로 면적이라고 해석하는 답안",referenceIds:["waGridCoding","gdalRasterize"],
  },
  {
    id:"pr-rasterization-percent", chapterId:"practical-rasterization", category:"래스터 셀 값", title:"래스터 변환 · 녹지 비율 계산", format:"계산형",
    prompt:"한 변이 20m인 정사각형 셀에 녹지가 120m² 있다. 면적비율법으로 저장할 녹지 비율(%)을 구하고, 녹지 분류 코드와의 차이를 설명하시오.",
    hint:"셀 전체 면적은 한 변의 길이를 제곱해 구합니다.",
    modelAnswer:"전체 면적 = 20 × 20 = 400m²\n녹지 비율 = 120 / 400 × 100 = 30%\n30%는 셀에서 녹지가 차지하는 비율이며, 녹지라는 종류를 가리키는 분류 코드와 다르다.",
    explanation:["셀 면적을 20m²로 잘못 계산하지 않습니다.","분자는 녹지 면적, 분모는 셀 전체 면적입니다.","0%는 관측한 셀에 녹지가 없다는 값이며 자료가 없는 NoData와 구분합니다."],
    criteria:["전체 셀 면적 400m²와 녹지 비율 30%를 계산했다.","비율과 분류 코드의 의미 차이를 설명했다."],
    mistakes:"120을 20으로 나누거나 비율을 녹지 코드와 같은 의미로 설명하는 답안",referenceIds:["waGridCoding","ucgisConversion"],
  },
];

export const rasterizationLesson: Chapter = {
  id:"practical-rasterization",number:"01",title:"실기 기초 · 래스터 셀 값 결정",
  summary:"한 칸에 여러 대상이 들어오면 무엇을 저장할까요?",
  definition:"래스터는 격자 한 칸마다 값을 저장합니다. 같은 셀도 존재 여부·중심점·우세 면적·면적 비율 중 어떤 규칙을 쓰느냐에 따라 값의 의미와 결과가 달라집니다.",
  keywords:["화소 값·셀 값","존재 유무","중심점","최대 점유 면적","면적비율"],
  concepts:rasterCellRules.map(rule=>({label:`${rule.name} · ${rule.question}`,text:rule.description})),
  steps:["대상·속성 정의","셀 크기·격자 기준 설정","셀 값 결정 규칙 선택","코드·단위·NoData와 결과 확인"],
  examPoint:"이 단원의 네 가지 코딩 규칙은 존재 유무법·중심점법·최대 점유 면적법·면적비율법입니다. 화소 값은 셀의 값이라는 뜻이며 ‘가장 작은 숫자’라는 뜻이 아닙니다.",
  question:{prompt:"가장 넓은 종류와 달라도 셀 한가운데에 있는 구역의 코드를 쓰는 규칙은?",choices:["중심점법","최솟값 집계","면적비율법","세선화"],answer:0,explanation:"중심점법은 셀 중심점이 속한 구역을 기준으로 합니다. 면적 우세나 숫자의 최솟값과 다릅니다."},
  guide:{visual:"rasterization",minutes:7,takeaway:"같은 셀에서 규칙만 바꿔 보세요. ‘무엇을 기록하려는가?’가 결과를 결정합니다.",
    comparison:{headers:["규칙","판단 기준","이 예시의 결과"],rows:rasterCellRules.map(rule=>[rule.name,rule.question,rule.result])},
    example:{title:"산림·밭·도로가 함께 있는 100m² 셀",text:"산림 55m², 밭 35m², 도로 10m²인 셀의 중심이 밭 안에 있다면 중심점법은 밭 코드 20, 최대 점유 면적법은 산림 코드 10입니다. 도로 존재 여부는 1, 도로 면적비율은 10%입니다. 모두 같은 셀을 서로 다른 목적으로 요약한 결과입니다."},
    pitfalls:["네 가지는 이 단원에서 사용하는 기본 코딩 규칙의 분류입니다. 소프트웨어의 변환 옵션 개수와 동일하다는 뜻은 아닙니다.","중심점법과 기존 래스터를 다시 채우는 최근린 재표본화를 같은 용어로 외우지 않습니다.","분류 코드의 숫자 크기는 면적·중요도·비율을 뜻하지 않습니다. 0과 NoData도 구분합니다."],
    advanced:[{title:"실제 도구의 옵션은 왜 다른가요?",text:"ArcGIS Polygon to Raster는 셀 중심·최대 면적·최대 합산 면적과 우선순위 필드 등을 제공합니다. GDAL Rasterize는 중심 포함과 ALL_TOUCHED 등의 규칙을 사용합니다. 입력이 점·선·면인지, 겹침·동률·우선순위를 어떻게 처리하는지 도구 문서를 확인해야 합니다."}],
    sourceIds:["waGridCoding","ucgisConversion","esriRasterAssignment","gdalRasterize"]},
  practical:{answerTemplate:"존재 유무법 · 중심점법 · 최대 점유 면적법 · 면적비율법.\n사례 설명: 조사 대상 → 판단 기준 → 저장할 값 → 코드·비율의 의미를 적는다.",sourceIds:["waGridCoding","ucgisConversion","gdalRasterize"]},
};
