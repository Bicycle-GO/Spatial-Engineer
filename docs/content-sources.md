# 공유 대화 기반 학습 콘텐츠

## 2026-11-05 · 실기 3개 Chapter와 보정 결과 검토

사용자 지정 목차인 Chapter 1 공간정보 분석 / Chapter 2 공간정보서비스 프로그래밍 / Chapter 3 공간정보 융합콘텐츠 개발을 실기 목차, 기본이론 모아보기, 문제풀이 Chapter 필터에 적용했습니다. `practical-curriculum.ts`의 매핑을 공유하며, 단원별 `chapter`와 위상 `rule` 링크를 유지한 채 주요 목차는 `section=analysis|programming|content`로 선택합니다. 기본이론·문제의 단원 식별자와 브라우저 답안 저장 키는 유지했습니다. 기존 기출의 ‘공간정보 기초’는 Chapter 1에 연결합니다.

새 예상문제의 질문은 사용자 문장을 유지합니다. ‘변환이 얼마나 잘 이루어졌는지’라는 전체 변환 적합도 문맥의 답안은 RMS 오차(RMSE, 평균제곱근오차)로 구성하고, 점별 잔차와 구분하는 조건을 덧붙였습니다. Esri Spatial Adjustment의 Understanding residual and root mean square와 ArcGIS Pro의 Interpret the root mean square error를 참고했습니다. 변환 전후의 이동량을 잔차로 혼동하지 않도록 설명했습니다.

`practical-adjustment-error` 기본이론과 자체 예상문제 3개를 추가했습니다. 좌표 A(100,100)→A′(103,104), B(200,200)→B′(200,200)는 이미 계산된 변환 결과의 잔차를 집계하는 가상 연습이며 변환식 추정은 생략합니다. 두 점만으로 상사변환을 추정한 실제 사례로 해석하지 않습니다. 한 점의 거리 잔차 5m와 두 점 평면 RMS √12.5≈3.54m를 구분하고 n은 점 개수로 정의합니다. 작은 기준점 RMS만으로 전체 정확도를 보장하지 않으며 독립 검사점·기준점 분포·단위·기준 자료 확인을 연결합니다. 공식 허용오차는 임의로 가정하지 않습니다.

현재 산업기사 39개 이론 단원 중 실기 기본이론은 13개, 실기 예상문제는 43개와 사용자 제공 기출 3개입니다. [Esri 공간보정](https://desktop.arcgis.com/en/arcmap/latest/manage-data/editing-existing-features/about-spatial-adjustment-transformations.htm), [Esri 지리참조 오차 해석](https://doc.esri.com/en/arcgis-pro/latest/help/data/imagery/overview-of-georeferencing.html).

## 2026-11-05 · 쉬운 단계 설명과 셀 값·공간보정

벡터화 네 단계에 쉬운 비유, 짧은 처리 전후 상태, 농수로·도로 중심선·등고선 사례를 보강했습니다. 선택한 단계의 사례만 보여주며 기존 예상문제 5개를 유지합니다.

사용자는 최초 요청의 ‘최소 값’이 **화소 값(셀 값)**을 뜻한다고 확인했습니다. 문제에는 ‘래스터 데이터로 변환 시 화소 값(셀 값)의 결정 방식 4가지를 쓰시오’로 반영했습니다. 교재의 네 가지 정답 명칭은 별도로 제공되지 않았으므로, `practical-rasterization`의 첫 문제는 Washington State Ecology 교육자료(95-e01, 인쇄 25쪽)의 **Presence/absence, Centroid, Predominant type, Percent**라는 분류를 문항 조건으로 명시합니다. 존재 유무법·중심점법·최대 점유 면적법·면적비율법은 학습용 한글 번역이며, 유일한 보편 분류 또는 해당 교재의 확정 정답이라고 주장하지 않습니다. 소프트웨어의 priority field, MIN 집계, 래스터 재표본화와 구분합니다.

`practical-transformation`은 사용자 교재의 등각사상·부등각사상·투영변환을 공간보정의 2D 상사·아핀·사영 모형과 연결합니다. Esri Spatial Adjustment와 QGIS Georeferencer 문서로 성질을 대조했으며, 사영변환을 TM·UTM 같은 지도투영과 구분합니다. 기존 기출 3번의 ‘세 가지 중 서로 다른 두 가지’ 조건을 유지하고, 새 문항에서는 세 가지 모두를 요구합니다.

새 두 단원과 자체 예상문제 7개(셀 값 4개·공간보정 3개)를 추가했습니다. 현재 산업기사 38개 이론 단원 중 실기 기본이론 12개, 실기 예상문제 40개와 사용자 제공 기출 3개입니다. 동일한 100m² 셀의 산림55·밭35·도로10 면적 예시는 가상이며 중심점은 밭 안에 있습니다. 20m×20m 셀의 녹지30% 계산 문항에는 이 100m² 예제 풀이 도형을 붙이지 않아 사례가 섞이지 않도록 했습니다.

참고: [WA Ecology GRID 교육자료](https://apps.ecology.wa.gov/publications/documents/95e01.pdf), [UCGIS 변환 설명](https://gistbok-ltb.ucgis.org/current/print/concept/DM-06-086), [Esri 셀 할당](https://pro.arcgis.com/en/pro-app/latest/tool-reference/conversion/how-polygon-to-raster-works.htm), [GDAL Rasterize](https://gdal.org/en/stable/programs/gdal_rasterize.html), [Esri 공간보정](https://desktop.arcgis.com/en/arcmap/latest/manage-data/editing-existing-features/about-spatial-adjustment-transformations.htm), [QGIS 지리참조](https://docs.qgis.org/3.44/en/docs/user_manual/managing_data_source/georeferencer.html).

## 도면 벡터화 단계 학습 확장

사용자가 제시한 `전처리 단계 - ( ) - 벡터화 단계 - 후처리 단계` 보기를 실기 예상문제로 수록하고, 빈칸을 세선화(Thinning, 골격화)로 설명했습니다. `practical-vectorization` 단원과 자체 예상문제 5개를 추가하여 산업기사는 실기 기본이론 10개, 예상문제 33개를 제공합니다. 사용자가 실제 기출의 연도·회차를 제공한 문항이 아니므로 예상문제로 분류합니다.

GRASS r.thin·r.to.vect와 Esri Thin 공식 문서를 참고하여 스캔한 **선형 도면에서 중심선 벡터를 추출하는 흐름**으로 범위를 명시했습니다. 전처리와 세선화의 결과는 래스터이며, 벡터화에서 좌표·정점·선 객체로 바뀝니다. 모든 래스터 변환에 세선화를 요구하지 않으며 GDAL Polygonize의 같은 값 영역→폴리곤 변환과 구분합니다. 농수로 도면은 가상 학습용 도형이며, 스캔 등고선은 Esri Thin 문서에 제시된 활용 사례로 소개했습니다.

`vectorization-visual.tsx`는 동일한 농수로 연결 모양을 굵은 셀·한 셀 골격·좌표 선·속성 검수 결과로 비교합니다. 실제 세선화·벡터 추적 알고리즘을 실행한 결과나 위치 정확도의 보증은 아닙니다. 문제 전의 두 번째 단계는 이름을 숨기고, 풀이 후에는 4단계와 래스터/벡터 차이를 도형으로 설명합니다.

## 2026-11-03 위상관계 규칙 시각화·실기 연습

산업기사에 `practical-topology` 단원과 위상관계 규칙 예상문제 12개를 추가했습니다. 실기 기본이론은 9개, 자체 예상문제는 28개이며 사용자 제공 기출 3개는 별도로 유지합니다. 포인트·라인·폴리곤별 4개 대표 규칙을 Esri 공식 Add Rule To Topology 문서와 QGIS Topology Checker 문서로 확인했습니다. 전체 규칙을 망라하는 목록이나 모든 프로그램에서 동일한 메뉴명을 보장하는 자료는 아닙니다.

- 포인트: 중복 금지, 선 피복, 선 끝점 피복, 폴리곤의 엄격한 내부.
- 라인: 겹침 금지, 댕글 금지, 자기 교차 금지, 의사 노드 금지.
- 폴리곤: 겹침 금지, 빈틈 금지, 경계의 선 피복, 대표점 정확히 한 개.

SVG 개념도는 규칙 위반과 충족 상태를 비교하며 실제 GIS 엔진의 검사 결과나 실제 경계 수정 자료가 아닙니다. 오류를 자동으로 수정하지 않고 원자료·기준 시점·CRS 단위·허용오차·업무 목적과 함께 판단하도록 설명합니다. 막다른길·실제 종단·입체교차·의도된 빈 공간·속성 변경 경계의 예외를 다룹니다. 문제 전에는 규칙 이름 없이 검사 대상 도형을 보여 주고, 답안 비교 후에는 규칙·도형 비교·사례·예외·수정법을 보여 줍니다.

규칙별 링크는 `/engineer/practice/practical/?chapter=practical-topology&rule=규칙ID`이며 단원 전체 문제로 돌아갈 수 있습니다. 기존 위상 및 데이터 품질 이론에서도 새 단원을 연결했습니다. 데이터는 `topology-rules.ts`, 도형은 `topology-visual.tsx`에서 관리합니다.

## 2026-11-03 사용자 제공 실기 기출 3개

사용자가 제공한 세 문항을 `practical-past.ts`에 원문·문제 번호 순서로 수록했습니다. 실기 기출 탭의 분류는 `Chapter 1. 공간정보 분석 → 공간정보 기초`이며 관련 이론 ID는 `spatial-basics`입니다. 문항 출처는 사용자 제공으로 표시하고 연도·회차·공식 원문은 미확인임을 명시합니다. 예상문제 16개와 별도 집계하고 `?source=past&chapter=spatial-basics`에서 바로 학습할 수 있습니다.

모범답안은 ① 레이어 ② 평면직각좌표계입니다. ③은 사용자의 추가 설명을 반영하여 교재의 분류인 **등각사상 변환·부등각사상 변환·투영변환 중 서로 다른 두 가지**를 쓰도록 수정했습니다. 가능한 세 조합을 모두 표시하고, 자가점검은 두 가지를 정확히 썼는지 확인하도록 구성했습니다. 앞선 헬머트·아핀 예시로 답안 범위를 좁힌 설명은 제거했습니다. 이 답안 범위는 사용자 제공 교재 분류를 반영한 것이며 공식 원문·채점 기준의 검증을 뜻하지 않습니다. QGIS 공식 Georeferencer 문서는 관련 기술 모형의 보조 참고 자료입니다. 레이어와 물리 파일의 일대일 대응을 일반화하지 않고, 국내 측량의 X·Y축 표기와 소프트웨어 축 관례를 구분하는 설명은 유지합니다.

## 2026-11-01 실기 학습 확장

Q-Net 공간정보융합산업기사 종목 페이지의 취득방법 iframe에서 검정형 필기는 객관식 60문항·1시간 30분, 실기는 필답형·2시간 30분(2026.01.01부터 변경)임을 확인했습니다. 출제기준은 2026.1.1~2028.12.31 자료가 안내되어 있습니다. 사이트는 공식 출제기준 전체를 재현하거나 완전한 대비를 보장하는 과정이 아닌 학습 보조 과정입니다.

산업기사 기본이론에 좌표·품질·중첩·래스터·SQL·코드/API·지도 표현·요구/검증의 8개 단원을 추가했습니다. 각 단원은 처리 순서, 계산식 또는 답안 작성 틀을 제공하고 실기 문항 2개씩 연결합니다. 기존 48개 필기용 학습문제는 별도 필기 페이지에서 제공합니다.

실기 16개 문항은 자체 작성한 예상문제로, 실제 기출문제의 연도·회차를 부여하지 않았습니다. 모범답안과 체크리스트는 학습용 기준이며 공식 채점 기준이 아닙니다. 서술형 답안은 자동 정오 판정 없이 사용자가 비교·점검합니다. 새로운 기술 참고문서로 PostGIS ST_Covers, Python 제어 흐름, MDN Fetch, QGIS 래스터 재투영 자료를 확인했습니다. 경계 포함/제외, IDW 정규화, 도형 분할 후 면적 재계산, RMSE의 정의를 문항 조건에 명시했습니다.

새 경로: `/engineer/practice/written/`, `/engineer/practice/practical/`. 이론의 관련 문제 링크는 해당 필기/실기 경로와 단원 필터로 연결됩니다. 실기 답안 초안은 `spatial-practical-draft-v1:문항ID` 키로 브라우저에 저장하고, 학습 상태는 세션 내에서 관리합니다.

2026-09-19 기준으로 사용자가 제공한 공개 공유 대화 두 개를 읽고 학습 내용을 재구성했습니다.

- [대화 ①](https://share.gemini.google/p14uBOy5VzrA): 투영, 좌표계, 위상, 데이터베이스, 연산자, 요구사항, 테스트
- [대화 ②](https://share.gemini.google/omMX7aoI5div): 공간 모델링, 일반화, 농지 Clip, 보간, 해상도, 영상오차

## 반영 범위

두 트랙에 공통으로 12개 단원을 추가했습니다. 각 단원은 조작 가능한 개념도, 비교표, 생활 사례, 혼동하기 쉬운 설명, 확장 학습, 출처로 구성됩니다. 원문에서 반복된 문장이나 앞선 질문에 잘못 이어진 답변은 제외하고 내용을 새로 작성했습니다. 원문 이미지를 복제하지 않고 SVG와 CSS로 개념도를 재구성했습니다.

| 대화 | 추가 단원 ID |
| --- | --- |
| ① | map-projections, coordinate-systems, topology, relational-database, operators, requirements, software-testing |
| ② | spatial-modeling, overlay-analysis, spatial-interpolation, remote-resolution, image-errors |

대화에 제시된 문제 7개를 별도 분류했습니다: Clip, 추상화, 일반화, 분광 해상도, 연산자 우선순위, 카디널리티, Java 증감 연산. 원문에 선택지가 없는 문항에는 학습용 선택지를 추가했으며, 문항별로 재구성 범위를 표시합니다. 연도·회차·공식 원문이 확인되지 않아 기출문제 탭에는 등록하지 않습니다.

## 주요 정정·보완

- 정각은 국소 각도 보존이며 모든 위치의 방위나 대륙 전체의 모양을 보존한다는 뜻이 아닙니다. 정거는 기준점·기준선 범위의 성질이며 방위도법 분류와 겹칠 수 있습니다.
- TM 전체에 단일 축척계수를 적용하지 않습니다. CRS 지정과 재투영, 화면상 재투영을 구분합니다.
- Clip은 입력 속성을 유지하며, 잘린 면적 속성은 재계산이 필요할 수 있습니다. 예시의 원형 경계는 가상이므로 실제 농업진흥지구 지정 경계와 구분합니다.
- 일반화는 Dissolve보다 넓은 개념입니다. Kriging이 모든 데이터에서 최선이라고 단정하지 않습니다.
- 분광 해상도는 밴드 수뿐 아니라 파장 대역폭과 구별 능력을 함께 봅니다.
- 전위·후위 연산의 반환값과 변경 후 변수값을 구분합니다. `x=1; y=x++; z=--x;`의 최종 값은 `1,1,1`입니다. `age=19; age++ + 1 == 21`은 false이며 이후 age는 20입니다.
- 출제 빈도, 합격 통계, 최근 시험 제도 등 검증되지 않은 주장은 옮기지 않았습니다. 단원 구성은 보조 학습 과정이며 공식 출제기준 전체의 검증을 의미하지 않습니다.

## 참고 문서

단원별 외부 링크는 `app/data/sources.ts`에서 관리합니다. Oracle의 Java 연산자 문서, QGIS의 좌표계·보간 문서, Esri의 Clip·투영 문서, PostgreSQL의 테이블 개념, NASA의 해상도 문서, USGS의 영상 보정 자료, ISTQB의 기초 테스트 교재를 참고했습니다. 공유 대화와 참고 문서는 화면에서 구분합니다.

## 유지보수

- `shared-lessons.ts`: 새 이론 12개와 시각화 종류·비교표·출처 ID
- `shared-questions.ts`: 재구성 문항 7개와 단계별·선택지별 해설
- `lesson-visuals.tsx`: 외부 이미지 의존성이 없는 SVG/CSS 시연
- `lesson-reader.tsx`: 단계별 읽기 화면
- `practice-room.tsx`: 출처 유형별 필터, 채점, 오답 재도전, 관련 이론 연결

`?chapter=단원ID`로 문제풀이에 진입하면 관련 문항을 우선 선택합니다. 학습 진도는 기존 단원 ID를 유지하여 보존합니다.
