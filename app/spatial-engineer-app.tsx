"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { mockExamQuestions } from "./mock-exam-data";

type CheckQuestion = {
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
};

type Chapter = {
  id: string;
  number: string;
  title: string;
  summary: string;
  definition: string;
  keywords: string[];
  concepts: { label: string; text: string }[];
  steps?: string[];
  examPoint: string;
  question: CheckQuestion;
};

type CoursePart = {
  id: string;
  number: string;
  title: string;
  description: string;
  accent: string;
  chapters: Chapter[];
};

const courseParts: CoursePart[] = [
  {
    id: "part1",
    number: "PART 01",
    title: "공간정보 분석",
    description:
      "공간데이터의 구조를 이해하고 수집·가공·영상처리·분석까지 이어지는 기본 흐름을 익힙니다.",
    accent: "cyan",
    chapters: [
      {
        id: "spatial-basics",
        number: "01",
        title: "공간정보 기초",
        summary: "위치·속성·시간을 하나의 데이터로 읽는 법",
        definition:
          "공간정보는 ‘어디에 있는가’라는 위치정보에 ‘무엇인가’라는 속성정보와 ‘언제인가’라는 시간정보를 결합한 데이터입니다.",
        keywords: ["벡터", "래스터", "좌표계", "축척", "위상"],
        concepts: [
          {
            label: "표현 방식",
            text: "벡터는 점·선·면으로 개별 객체를, 래스터는 격자형 픽셀로 연속 현상을 표현합니다.",
          },
          {
            label: "좌표계",
            text: "지리좌표계는 경도·위도를, 투영좌표계는 평면상의 X·Y 좌표를 사용합니다.",
          },
          {
            label: "품질 언어",
            text: "축척·해상도·정확도·정밀도·메타데이터가 데이터의 사용 가능성을 설명합니다.",
          },
          {
            label: "위상관계",
            text: "인접·연결·포함 관계는 객체의 모양보다 객체 사이의 관계를 다룹니다.",
          },
        ],
        examPoint:
          "도로 중심선은 선, 건물 경계는 면, 위성영상은 래스터로 표현하는 식의 ‘자료–표현 방식’ 연결을 먼저 익히세요.",
        question: {
          prompt: "행정구역의 경계와 면적을 함께 관리하기에 가장 알맞은 자료 표현은?",
          choices: ["래스터 픽셀", "폴리곤 벡터", "문자열 속성", "시계열 표"],
          answer: 1,
          explanation:
            "행정구역은 닫힌 경계와 면적을 갖는 객체이므로 폴리곤 벡터가 적합합니다.",
        },
      },
      {
        id: "processing",
        number: "02",
        title: "공간정보 처리 및 가공",
        summary: "서로 다른 원시 데이터를 분석 가능한 상태로 정비",
        definition:
          "공간정보 처리·가공은 좌표, 형식, 도형, 속성이 제각각인 원시 데이터를 목적에 맞고 오류가 적은 데이터셋으로 만드는 과정입니다.",
        keywords: ["좌표변환", "Clip", "Dissolve", "리샘플링", "품질관리"],
        concepts: [
          {
            label: "좌표·형식 정비",
            text: "좌표계를 통일하고 벡터·래스터 또는 파일 형식을 사용 환경에 맞게 변환합니다.",
          },
          {
            label: "도형 편집",
            text: "Merge, Split, Clip, Dissolve로 객체를 합치고 나누며 필요한 범위만 추출합니다.",
          },
          {
            label: "래스터 가공",
            text: "셀 크기나 좌표계를 바꿀 때 최근린·이중선형·3차회선 등의 리샘플링을 적용합니다.",
          },
          {
            label: "품질 점검",
            text: "중복·누락·좌표 오차·도형 오류·속성 불일치를 확인하고 수정 이력을 남깁니다.",
          },
        ],
        steps: [
          "수집",
          "점검",
          "좌표변환",
          "형식변환",
          "오류수정",
          "속성정비",
          "데이터 구축",
        ],
        examPoint:
          "Clip은 경계로 잘라내고, Dissolve는 같은 속성의 경계를 없애 합칩니다. 도구 이름보다 입력–처리–결과를 연결하세요.",
        question: {
          prompt: "같은 행정구역 코드의 여러 폴리곤을 하나로 합칠 때 사용하는 연산은?",
          choices: ["Buffer", "Dissolve", "Geocoding", "Resampling"],
          answer: 1,
          explanation:
            "Dissolve는 지정한 공통 속성을 기준으로 내부 경계를 제거하고 객체를 합칩니다.",
        },
      },
      {
        id: "image-processing",
        number: "03",
        title: "공간 영상 처리",
        summary: "항공·위성·드론 영상을 분석 전에 보정하고 개선",
        definition:
          "공간 영상 처리는 센서가 기록한 항공사진·위성영상·드론영상을 위치가 맞고 해석하기 쉬운 영상으로 바꾸는 전처리 단계입니다.",
        keywords: ["기하보정", "방사보정", "정사보정", "영상강조", "밴드조합"],
        concepts: [
          {
            label: "영상의 종류",
            text: "항공사진은 넓은 지역을 정밀하게, 위성영상은 반복 관측을, 드론영상은 소지역 고해상도 촬영에 강점이 있습니다.",
          },
          {
            label: "전처리",
            text: "기하·방사·대기·정사 보정으로 위치 왜곡과 밝기 차이를 줄입니다.",
          },
          {
            label: "영상 개선",
            text: "대비 향상, 잡음 제거, 필터링으로 객체와 경계가 더 잘 보이도록 만듭니다.",
          },
          {
            label: "밴드 활용",
            text: "여러 파장대의 밴드를 조합하거나 지수를 계산해 식생·수체·도시 정보를 강조합니다.",
          },
        ],
        steps: ["원시영상", "보정", "영상강조", "밴드연산", "모자이크", "분석영상"],
        examPoint:
          "‘처리’는 영상을 분석 가능한 상태로 만드는 단계이고, ‘분석’은 처리된 영상에서 객체와 변화를 판독하는 단계입니다.",
        question: {
          prompt: "지형 높이 때문에 기울어져 보이는 영상의 위치 왜곡을 줄이는 처리는?",
          choices: ["정사보정", "디졸브", "공간조인", "지오코딩"],
          answer: 0,
          explanation:
            "정사보정은 센서 자세와 지형 기복으로 생긴 위치 왜곡을 보정해 지도처럼 사용할 수 있게 합니다.",
        },
      },
      {
        id: "spatial-analysis",
        number: "04",
        title: "공간정보 분석",
        summary: "위치 관계를 계산해 의사결정에 필요한 의미를 도출",
        definition:
          "공간정보 분석은 거리·방향·중첩·연결·분포 같은 공간 관계를 계산하여 ‘어디가 적합한가’와 ‘무엇이 영향을 받는가’를 답하는 과정입니다.",
        keywords: ["Buffer", "Overlay", "Network", "Interpolation", "Spatial Join"],
        concepts: [
          {
            label: "근접 분석",
            text: "Buffer와 거리 계산으로 시설 주변 영향권이나 접근 가능 범위를 찾습니다.",
          },
          {
            label: "중첩 분석",
            text: "Overlay와 Spatial Join으로 서로 다른 레이어의 공간·속성 관계를 결합합니다.",
          },
          {
            label: "네트워크 분석",
            text: "도로망의 연결성과 비용을 이용해 최단경로·서비스 권역·배분 문제를 풉니다.",
          },
          {
            label: "표면 분석",
            text: "관측 지점 값을 보간해 연속 표면을 만들고 경사·향·가시권 등을 분석합니다.",
          },
        ],
        steps: ["문제 정의", "데이터 준비", "분석기법 선택", "연산", "검증", "해석"],
        examPoint:
          "문제 문장에서 ‘주변·반경’은 Buffer, ‘겹치는 지역’은 Overlay, ‘길·이동’은 Network를 떠올리세요.",
        question: {
          prompt: "소방서에서 5분 안에 도달할 수 있는 도로 기반 권역을 구하는 분석은?",
          choices: ["단순 원형 Buffer", "네트워크 서비스 권역", "래스터 재분류", "영상 분류"],
          answer: 1,
          explanation:
            "실제 도로 연결과 통행 비용을 고려하므로 네트워크 서비스 권역 분석이 적합합니다.",
        },
      },
      {
        id: "image-analysis",
        number: "05",
        title: "공간 영상 분석",
        summary: "처리된 영상에서 토지피복·객체·변화를 판독",
        definition:
          "공간 영상 분석은 영상의 밝기, 색, 질감, 형태와 시계열 차이를 이용해 지표의 객체와 현상을 분류·탐지하는 단계입니다.",
        keywords: ["분류", "객체기반", "변화탐지", "특징추출", "정확도평가"],
        concepts: [
          {
            label: "분류",
            text: "감독분류는 학습자료를 사용하고, 무감독분류는 유사한 화소를 자동 군집화합니다.",
          },
          {
            label: "객체기반 분석",
            text: "인접 화소를 의미 있는 객체로 묶고 색·형태·질감·맥락을 함께 사용합니다.",
          },
          {
            label: "변화 탐지",
            text: "서로 다른 시기의 영상을 비교하여 건물 증가, 산림 훼손, 재난 피해 등을 찾습니다.",
          },
          {
            label: "정확도 평가",
            text: "참조자료와 분류 결과를 혼동행렬로 비교해 전체·사용자·생산자 정확도를 확인합니다.",
          },
        ],
        steps: ["분석목표", "학습·참조자료", "특징 선택", "분류·탐지", "정확도 평가"],
        examPoint:
          "좋은 분류 결과는 보기 좋은 색상보다 검증 가능한 참조자료와 정확도 평가가 있어야 완성됩니다.",
        question: {
          prompt: "이미 알고 있는 토지피복 표본을 학습자료로 사용하는 분류 방식은?",
          choices: ["무감독분류", "감독분류", "리샘플링", "공간보간"],
          answer: 1,
          explanation:
            "감독분류는 사용자가 제공한 클래스별 학습 표본을 기준으로 영상을 분류합니다.",
        },
      },
      {
        id: "data-collection",
        number: "06",
        title: "공간정보 자료수집",
        summary: "목적과 정확도에 맞는 수집 방법을 설계",
        definition:
          "공간정보 자료수집은 필요한 범위·시점·정확도·비용을 정한 뒤 현장측량, GNSS, 영상, 센서, 공공데이터 등에서 원천자료를 확보하는 과정입니다.",
        keywords: ["GNSS", "원격탐사", "드론", "현장조사", "공공데이터"],
        concepts: [
          {
            label: "직접 수집",
            text: "GNSS·측량기기·드론·모바일 조사로 현장에서 위치와 속성을 직접 기록합니다.",
          },
          {
            label: "간접 수집",
            text: "위성·항공영상, 수치지도, 통계, 공공데이터, 센서 스트림을 목적에 맞게 활용합니다.",
          },
          {
            label: "수집 계획",
            text: "대상, 범위, 주기, 좌표계, 허용오차, 장비, 인력과 품질검사 방법을 먼저 정의합니다.",
          },
          {
            label: "현장 품질",
            text: "누락과 중복을 즉시 점검하고 시간·장비·담당자·정확도 같은 메타데이터를 함께 남깁니다.",
          },
        ],
        steps: ["목적 정의", "방법·장비 선정", "현장 수집", "검수", "메타데이터", "저장"],
        examPoint:
          "가장 정밀한 방법이 항상 정답은 아닙니다. 범위·주기·정확도·비용 조건에 맞는 방법을 고르는 문제로 접근하세요.",
        question: {
          prompt: "넓은 지역의 토지피복 변화를 반복적으로 관측하기에 가장 적합한 자료는?",
          choices: ["단일 지점 GNSS", "위성영상", "종이 지적도", "수기 설문"],
          answer: 1,
          explanation:
            "위성영상은 넓은 지역을 일정 주기로 반복 촬영하므로 시계열 변화 관측에 유리합니다.",
        },
      },
      {
        id: "spatial-bigdata",
        number: "07",
        title: "공간 빅데이터 분석",
        summary: "대용량·실시간 위치데이터에서 패턴과 흐름을 발견",
        definition:
          "공간 빅데이터 분석은 이동 궤적, 센서, 로그, 영상처럼 규모와 생성 속도가 큰 공간데이터를 분산 처리하고 시공간 패턴으로 해석하는 과정입니다.",
        keywords: ["시공간", "분산처리", "Heatmap", "군집", "실시간"],
        concepts: [
          {
            label: "데이터 특성",
            text: "크기(Volume), 속도(Velocity), 다양성(Variety)에 위치와 시간이 더해집니다.",
          },
          {
            label: "전처리",
            text: "좌표·시간대를 통일하고 이상 위치, 중복 궤적, 누락값을 정리해 분석 단위를 만듭니다.",
          },
          {
            label: "분석 방법",
            text: "격자 집계, 밀도·군집·핫스팟, 이동경로, 시계열 예측으로 분포와 흐름을 찾습니다.",
          },
          {
            label: "활용",
            text: "교통 혼잡, 유동인구, 감염·재난 확산, 상권, 환경센서 이상 탐지에 적용합니다.",
          },
        ],
        steps: ["수집·적재", "정제", "시공간 결합", "분산 연산", "시각화", "의사결정"],
        examPoint:
          "데이터가 많다는 사실보다 좌표·시간 기준을 맞추고 공간 인덱스와 집계 단위를 설계하는 것이 핵심입니다.",
        question: {
          prompt: "수백만 건의 택시 승하차 지점이 밀집한 구역을 한눈에 보려면?",
          choices: ["히트맵", "단일 라벨", "원본 행 목록", "메타데이터 표"],
          answer: 0,
          explanation:
            "히트맵은 많은 점 자료를 밀도 값으로 집계해 공간적 집중 구역을 효과적으로 보여줍니다.",
        },
      },
    ],
  },
  {
    id: "part2",
    number: "PART 02",
    title: "공간정보서비스 프로그래밍",
    description:
      "지도 UI와 공간DB를 연결하고 웹·모바일 환경에서 안정적인 공간정보 서비스를 구현합니다.",
    accent: "violet",
    chapters: [
      {
        id: "ui-programming",
        number: "01",
        title: "공간정보 UI 프로그래밍",
        summary: "사용자가 지도를 쉽고 빠르게 탐색하는 화면 설계",
        definition:
          "공간정보 UI 프로그래밍은 지도와 속성정보를 사용자가 직관적으로 보고 검색하고 조작하도록 화면과 상호작용을 구현하는 영역입니다.",
        keywords: ["지도창", "레이어", "팝업", "이벤트", "UX"],
        concepts: [
          {
            label: "기본 요소",
            text: "지도창, 확대·축소, 이동, 레이어 제어, 검색, 팝업, 범례, 축척 표시를 구성합니다.",
          },
          {
            label: "이벤트",
            text: "클릭·드래그·휠·터치·위치변경 이벤트를 데이터 조회와 화면 갱신에 연결합니다.",
          },
          {
            label: "사용자 경험",
            text: "현재 위치와 선택 상태를 분명히 보여주고 중요한 기능을 적은 단계로 실행하게 합니다.",
          },
          {
            label: "접근성·반응형",
            text: "키보드, 색 대비, 대체 텍스트와 다양한 화면 크기를 고려해 동일한 정보를 제공합니다.",
          },
        ],
        steps: ["사용자 과업", "화면 구조", "지도 컴포넌트", "이벤트 연결", "사용성 점검"],
        examPoint:
          "기능 목록을 외우기보다 ‘사용자가 찾고 선택하고 결과를 확인하는 흐름’ 안에서 UI 요소의 역할을 이해하세요.",
        question: {
          prompt: "여러 주제 레이어의 표시 여부를 사용자가 바꾸도록 하는 UI 요소는?",
          choices: ["레이어 제어", "좌표 변환기", "공간 인덱스", "ETL 배치"],
          answer: 0,
          explanation:
            "레이어 제어는 지도에 표시할 주제 레이어를 켜고 끄거나 순서를 바꾸는 UI입니다.",
        },
      },
      {
        id: "db-programming",
        number: "02",
        title: "공간정보 DB 프로그래밍",
        summary: "Geometry와 속성을 안전하고 빠르게 저장·질의",
        definition:
          "공간정보 DB 프로그래밍은 점·선·면 Geometry와 일반 속성을 함께 저장하고 공간 관계를 SQL로 질의하도록 데이터 구조와 성능을 설계하는 영역입니다.",
        keywords: ["Geometry", "공간SQL", "공간인덱스", "무결성", "PostGIS"],
        concepts: [
          {
            label: "저장 구조",
            text: "POINT·LINESTRING·POLYGON Geometry와 명칭·분류·상태 같은 속성 컬럼을 한 레코드로 관리합니다.",
          },
          {
            label: "공간 질의",
            text: "교차·포함·인접·거리·면적 함수를 이용해 위치 관계를 SQL 조건으로 표현합니다.",
          },
          {
            label: "공간 인덱스",
            text: "후보 객체를 빠르게 줄여 대용량 공간검색의 비용을 낮춥니다.",
          },
          {
            label: "무결성",
            text: "좌표계, Geometry 유형, 유효 도형, 기본키·외래키 규칙을 통해 일관성을 지킵니다.",
          },
        ],
        steps: ["요구 분석", "스키마", "데이터 적재", "공간 인덱스", "질의", "성능 점검"],
        examPoint:
          "공간 인덱스는 결과를 바꾸는 분석기법이 아니라 검색 대상을 빠르게 좁혀 성능을 높이는 구조입니다.",
        question: {
          prompt: "공간DB에서 특정 영역 안에 포함된 시설물을 찾는 관계는?",
          choices: ["Within", "Resample", "Geocode", "Dissolve"],
          answer: 0,
          explanation:
            "Within은 한 Geometry가 다른 Geometry 내부에 포함되는지를 판정하는 공간 관계입니다.",
        },
      },
      {
        id: "web-programming",
        number: "03",
        title: "웹기반 공간정보서비스 프로그래밍",
        summary: "브라우저·서버·공간DB를 표준과 API로 연결",
        definition:
          "웹기반 공간정보서비스는 브라우저의 지도 화면, 서버의 업무 로직, 공간DB와 지도·피처 서비스를 네트워크로 연결해 공간정보를 제공합니다.",
        keywords: ["Map API", "GeoJSON", "WMS", "WFS", "타일지도"],
        concepts: [
          {
            label: "서비스 구조",
            text: "클라이언트가 요청하고 서버가 인증·업무처리 후 공간DB 또는 지도서버의 결과를 반환합니다.",
          },
          {
            label: "데이터 형식",
            text: "GeoJSON은 웹에서 피처를 교환하기 쉽고, 타일은 지도를 작은 조각으로 나눠 빠르게 전송합니다.",
          },
          {
            label: "표준 서비스",
            text: "WMS는 지도 이미지, WFS는 벡터 피처, WMTS는 미리 생성된 타일을 제공하는 데 초점이 있습니다.",
          },
          {
            label: "운영 품질",
            text: "캐시, 요청 범위 제한, 좌표 단순화, 오류 처리, 보안과 응답시간을 함께 고려합니다.",
          },
        ],
        steps: ["브라우저 요청", "API·서버", "공간 질의", "응답 변환", "지도 렌더링"],
        examPoint:
          "WMS·WFS·WMTS는 무엇을 전달하는지 비교하세요. 이미지, 피처, 타일이라는 차이가 핵심입니다.",
        question: {
          prompt: "객체별 속성과 Geometry를 웹에서 직접 활용해야 할 때 적합한 OGC 서비스는?",
          choices: ["WMS", "WFS", "WMTS", "FTP"],
          answer: 1,
          explanation:
            "WFS는 피처의 Geometry와 속성을 제공하므로 객체 단위 조회·편집에 적합합니다.",
        },
      },
      {
        id: "mobile-programming",
        number: "04",
        title: "모바일 공간정보서비스 프로그래밍",
        summary: "위치·카메라·센서를 활용하는 현장형 서비스 구현",
        definition:
          "모바일 공간정보서비스는 스마트폰의 GNSS, 방향·가속도 센서, 카메라와 통신 기능을 이용해 현재 위치 중심의 지도와 현장 업무를 제공합니다.",
        keywords: ["GNSS", "센서", "오프라인", "권한", "배터리"],
        concepts: [
          {
            label: "위치 기반",
            text: "현재 위치, 이동경로, 지오펜스와 주변 검색을 서비스 흐름에 연결합니다.",
          },
          {
            label: "현장 입력",
            text: "사진·메모·폼·위치 좌표를 한 기록으로 묶고 네트워크가 복구되면 서버와 동기화합니다.",
          },
          {
            label: "모바일 제약",
            text: "작은 화면, 터치 조작, 불안정한 통신, 저장공간과 배터리 사용량을 고려합니다.",
          },
          {
            label: "권한·개인정보",
            text: "위치와 카메라 권한은 필요한 시점에 목적을 설명하고 최소 범위로 요청합니다.",
          },
        ],
        steps: ["권한 확인", "위치·센서 수집", "현장 UI", "로컬 저장", "서버 동기화"],
        examPoint:
          "모바일 문제는 기능뿐 아니라 오프라인·배터리·권한·개인정보 조건이 함께 제시되는 경우가 많습니다.",
        question: {
          prompt: "통신이 끊기는 현장에서 조사 앱의 데이터 유실을 줄이는 설계는?",
          choices: ["매 입력 즉시 폐기", "로컬 저장 후 동기화", "위치 권한 항상 거부", "지도 타일 모두 삭제"],
          answer: 1,
          explanation:
            "기기에 먼저 안전하게 저장하고 네트워크가 복구될 때 서버와 동기화하는 방식이 적합합니다.",
        },
      },
    ],
  },
  {
    id: "part3",
    number: "PART 03",
    title: "공간정보 융합콘텐츠 개발",
    description:
      "공간정보를 관광·교통·안전·환경 등과 결합해 설득력 있는 콘텐츠와 3차원 서비스로 완성합니다.",
    accent: "lime",
    chapters: [
      {
        id: "content-production",
        number: "01",
        title: "공간정보 융합콘텐츠 제작",
        summary: "공간정보와 기술·주제를 결합해 새로운 가치 설계",
        definition:
          "공간정보 융합콘텐츠 제작은 위치데이터를 관광·교통·재난안전·부동산·환경·스마트시티 같은 주제와 결합해 사용자의 문제를 해결하는 콘텐츠로 만드는 과정입니다.",
        keywords: ["기획", "요구분석", "프로토타입", "융합", "검증"],
        concepts: [
          {
            label: "문제·사용자",
            text: "기술보다 먼저 누구의 어떤 상황을 개선할지 정의하고 핵심 사용자 여정을 만듭니다.",
          },
          {
            label: "데이터 설계",
            text: "필요한 공간·속성·시간 데이터와 갱신 주기, 정확도, 이용 조건을 정리합니다.",
          },
          {
            label: "융합 설계",
            text: "지도에 통계·센서·이미지·스토리·업무 규칙을 결합해 정보 흐름을 구성합니다.",
          },
          {
            label: "검증·운영",
            text: "프로토타입으로 사용성을 확인하고 오류·저작권·개인정보·유지보수 계획을 점검합니다.",
          },
        ],
        steps: ["문제 정의", "요구 분석", "데이터 확보", "설계", "개발", "테스트", "운영"],
        examPoint:
          "콘텐츠 제작 문제는 ‘기획–데이터–설계–개발–테스트–운영’의 선후관계와 각 단계 산출물을 연결해 보세요.",
        question: {
          prompt: "융합콘텐츠 제작의 가장 앞 단계에서 우선 확인할 것은?",
          choices: ["최종 서버 사양", "사용자와 해결할 문제", "아이콘 색상", "앱스토어 순위"],
          answer: 1,
          explanation:
            "사용자와 문제를 정의해야 필요한 데이터·기능·표현 방법을 올바르게 결정할 수 있습니다.",
        },
      },
      {
        id: "visualization",
        number: "02",
        title: "공간정보 융합콘텐츠 시각화",
        summary: "복잡한 공간패턴을 정확하고 빠르게 이해시키는 표현",
        definition:
          "공간정보 시각화는 위치·분포·관계·시간 변화를 지도, 그래프, 대시보드와 상호작용으로 표현해 사용자가 의미를 빠르게 발견하도록 돕는 과정입니다.",
        keywords: ["주제도", "시각변수", "대시보드", "인터랙션", "스토리맵"],
        concepts: [
          {
            label: "표현 선택",
            text: "점·선·면, 단계구분도, 비례기호, 히트맵, 흐름도 중 데이터와 질문에 맞는 방법을 고릅니다.",
          },
          {
            label: "시각 변수",
            text: "색상·명도·크기·형태·방향을 의미에 맞게 사용하고 범례와 단위를 분명히 표시합니다.",
          },
          {
            label: "상호작용",
            text: "필터·검색·선택·시간 재생·상세보기로 전체 패턴과 개별 정보를 오가게 합니다.",
          },
          {
            label: "정확한 전달",
            text: "과도한 3D와 색을 줄이고 분류 기준·결측치·자료 시점을 밝혀 왜곡을 방지합니다.",
          },
        ],
        steps: ["질문 정의", "데이터 유형", "표현법 선택", "시각계층", "상호작용", "사용성 검증"],
        examPoint:
          "시각화의 목적은 장식이 아니라 비교와 판단입니다. 데이터 유형에 맞는 표현과 오해를 줄이는 범례가 핵심입니다.",
        question: {
          prompt: "지역별 인구 ‘비율’을 색의 명도 단계로 비교하는 지도는?",
          choices: ["단계구분도", "등치선도", "흐름도", "위성영상"],
          answer: 0,
          explanation:
            "단계구분도는 행정구역 같은 면 단위의 표준화된 값을 색상 단계로 비교합니다.",
        },
      },
      {
        id: "three-dimensional",
        number: "03",
        title: "공간데이터 3차원 모델링",
        summary: "지형·건물·시설을 높이와 형태까지 포함해 구현",
        definition:
          "공간데이터 3차원 모델링은 평면 위치에 높이와 형상을 더해 지형·건물·시설을 입체적으로 구축하고 분석·시뮬레이션·시각화에 활용하는 과정입니다.",
        keywords: ["DEM", "점군", "LOD", "CityGML", "BIM"],
        concepts: [
          {
            label: "기초 자료",
            text: "DEM·DSM·DTM, 라이다 점군, 사진측량, 건물 외곽선과 높이, BIM 등을 목적에 맞게 결합합니다.",
          },
          {
            label: "모델 수준",
            text: "LOD는 단순 블록부터 지붕·외관·실내까지 필요한 세부 수준과 비용을 조절합니다.",
          },
          {
            label: "좌표·높이",
            text: "수평 좌표계와 수직 기준을 일치시키고 지형과 객체의 접합·중복·공중부양 오류를 점검합니다.",
          },
          {
            label: "서비스 최적화",
            text: "메시 단순화, 타일링, 텍스처 압축과 단계별 로딩으로 대용량 3D 모델을 빠르게 제공합니다.",
          },
        ],
        steps: ["자료수집", "점군·영상 전처리", "지형·객체 모델링", "텍스처", "품질검사", "서비스"],
        examPoint:
          "가장 상세한 모델이 항상 최선은 아닙니다. 활용 목적에 맞는 LOD와 정확도·용량·성능의 균형을 판단하세요.",
        question: {
          prompt: "건물 모양을 단순한 높이 블록으로 표현하고 지붕 형태는 생략한 모델은?",
          choices: ["낮은 수준의 LOD 모델", "완전한 실내 BIM", "원시 위성영상", "속성 테이블"],
          answer: 0,
          explanation:
            "단순 블록 모델은 낮은 세부 수준으로 도시 전체를 가볍게 표현할 때 사용합니다.",
        },
      },
    ],
  },
];

const practiceQuestions: (CheckQuestion & { category: string })[] = [
  {
    category: "융합콘텐츠 개발 · 지도 구성요소",
    prompt:
      "지도 구성요소 중 다음 〈보기〉의 설명에 해당하는 것은? 〈보기〉 지도상의 특정 위치, 도시, 표식 등을 설명하는 텍스트",
    choices: ["기호와 범례", "주석과 레이블", "인덱스 맵", "축척과 방위"],
    answer: 1,
    explanation:
      "정답은 ② 주석과 레이블입니다. 레이블은 지명·도시명·시설명처럼 지도 객체에 연결된 텍스트이고, 주석은 특정 위치의 설명을 보충하는 텍스트입니다. ①은 기호의 의미, ③은 전체 영역 속 현재 위치, ④는 거리 비율과 방향을 알려 줍니다.",
  },
  {
    category: "융합콘텐츠 개발 · 지도 시각화",
    prompt:
      "전국 시·군·구의 인구 분포를 단계구분도로 공정하게 비교할 때 가장 적절한 자료는?",
    choices: [
      "행정구역별 총인구",
      "시·군·구청의 위치",
      "행정구역 면적 1㎢당 인구",
      "행정구역별 주요 도로의 총길이",
    ],
    answer: 2,
    explanation:
      "정답은 ③ 인구밀도입니다. 단계구분도는 크기가 다른 면 지역을 비교하므로 총량보다 면적이나 인구로 표준화한 비율 자료를 사용해야 왜곡을 줄일 수 있습니다.",
  },
  {
    category: "융합콘텐츠 개발 · 3차원 모델링",
    prompt:
      "단순한 건물 3차원 모델의 표면에 벽돌·유리 등의 실제 재질 이미지를 입히는 작업은?",
    choices: ["돌출", "텍스처 매핑", "버퍼 분석", "지오코딩"],
    answer: 1,
    explanation:
      "정답은 ② 텍스처 매핑입니다. 2차원 이미지나 재질 정보를 3차원 표면에 적용해 현실감과 식별성을 높입니다. 돌출은 평면 객체에 높이를 부여하는 작업입니다.",
  },
  {
    category: "융합콘텐츠 개발 · 서비스 최적화",
    prompt:
      "모바일 3차원 지도에서 가까운 랜드마크는 상세하게, 멀리 있는 건물은 단순하게 표현하는 방식은?",
    choices: [
      "모든 객체에 최고 해상도 적용",
      "거리에 따른 세부 수준 적용",
      "모든 객체를 2차원 기호로 변환",
      "화면의 객체를 무작위로 삭제",
    ],
    answer: 1,
    explanation:
      "정답은 ② 거리에 따른 세부 수준(LOD) 적용입니다. 가까운 객체의 품질을 유지하면서 먼 객체의 데이터 전송량과 렌더링 부하를 줄일 수 있습니다.",
  },
  {
    category: "융합콘텐츠 개발 · 데이터 융합",
    prompt:
      "드론 영상, 지적도, 건물 속성자료를 하나의 콘텐츠로 결합할 때 위치 불일치를 막기 위해 우선 확인할 사항은?",
    choices: [
      "모든 자료의 글꼴 통일",
      "좌표계와 공간 기준의 확인·변환",
      "파일 이름 단축",
      "지도 범례 제거",
    ],
    answer: 1,
    explanation:
      "정답은 ② 좌표계와 공간 기준의 확인·변환입니다. 서로 다른 좌표계를 그대로 결합하면 같은 장소가 어긋나 보일 수 있으므로 공통 기준으로 맞춰야 합니다.",
  },
  {
    category: "공간정보 기초",
    prompt: "다음 중 래스터 자료에 가장 적합한 대상은?",
    choices: ["건물 필지 경계", "도로 중심선", "연속적인 지표 온도", "버스 정류장 위치"],
    answer: 2,
    explanation:
      "온도처럼 공간에서 연속적으로 변하는 현상은 격자 셀 값을 사용하는 래스터가 적합합니다.",
  },
  {
    category: "처리 및 가공",
    prompt: "분석 대상 구역 밖의 데이터를 경계에 맞춰 제거하는 연산은?",
    choices: ["Clip", "Dissolve", "Buffer", "Join"],
    answer: 0,
    explanation:
      "Clip은 기준 경계를 이용해 입력 데이터에서 필요한 범위만 잘라냅니다.",
  },
  {
    category: "공간 영상",
    prompt: "분류 결과의 신뢰성을 참조자료와 비교하는 표는?",
    choices: ["속성 도메인", "혼동행렬", "공간 인덱스", "범례"],
    answer: 1,
    explanation:
      "혼동행렬은 예측 클래스와 실제 참조 클래스를 교차 비교해 분류 정확도를 계산합니다.",
  },
  {
    category: "공간 분석",
    prompt: "학교 후보지 중 경사 5도 이하이면서 도로 500m 이내인 곳을 찾는 핵심 분석은?",
    choices: ["조건 재분류와 중첩", "문자열 정렬", "영상 압축", "좌표 삭제"],
    answer: 0,
    explanation:
      "여러 공간 조건을 각각 만들고 중첩해 모두 만족하는 위치를 찾는 적합지 분석입니다.",
  },
  {
    category: "자료수집",
    prompt: "현장 수집 데이터의 재사용 가능성을 높이는 가장 중요한 부가정보는?",
    choices: ["화면 테마", "메타데이터", "아이콘 크기", "파일 미리보기"],
    answer: 1,
    explanation:
      "수집 시점·방법·좌표계·정확도·담당자 등을 기록한 메타데이터가 해석과 재사용을 돕습니다.",
  },
  {
    category: "공간DB",
    prompt: "대용량 Geometry 검색의 후보 범위를 빠르게 줄이는 구조는?",
    choices: ["공간 인덱스", "범례", "텍스처", "히스토그램"],
    answer: 0,
    explanation:
      "공간 인덱스는 객체의 범위를 이용해 전체 도형을 하나씩 비교하는 비용을 줄입니다.",
  },
  {
    category: "웹 서비스",
    prompt: "미리 만든 지도 타일을 표준 방식으로 빠르게 제공하는 서비스는?",
    choices: ["WFS", "WMTS", "CSV", "GNSS"],
    answer: 1,
    explanation:
      "WMTS는 정해진 축척과 격자의 지도 타일을 제공해 빠른 지도 표시가 가능합니다.",
  },
  {
    category: "모바일",
    prompt: "위치정보를 사용하는 앱의 바람직한 권한 요청 방식은?",
    choices: ["설명 없이 항상 허용 요구", "필요 시 목적과 범위를 설명", "모든 센서 권한 동시 요구", "권한 상태 무시"],
    answer: 1,
    explanation:
      "필요한 기능을 실행할 때 이유와 이용 범위를 설명하고 최소 권한을 요청해야 합니다.",
  },
  {
    category: "시각화",
    prompt: "행정구역별 ‘총 인구 수’를 원의 크기로 표현하는 방법은?",
    choices: ["비례기호도", "등치선도", "래스터 필터", "네트워크 분석"],
    answer: 0,
    explanation:
      "비례기호도는 절대량에 비례해 기호 크기를 조절하므로 총량 비교에 적합합니다.",
  },
  {
    category: "3차원 모델링",
    prompt: "라이다가 직접 제공하는 대표적인 원시 3차원 자료는?",
    choices: ["점군", "관계형 키", "문자 코드", "WMS 이미지"],
    answer: 0,
    explanation:
      "라이다는 지표와 객체에서 반사된 수많은 3차원 좌표점을 점군 형태로 제공합니다.",
  },
];

void practiceQuestions;

const totalMockExamQuestions = mockExamQuestions.length;

type ExamFilter = "all" | "unanswered" | "flagged";
type ExamTextSize = "large" | "xlarge";

const MOCK_EXAM_STORAGE_KEY = "spatial-mock-exam-v1";

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

const totalChapters = courseParts.reduce(
  (sum, part) => sum + part.chapters.length,
  0,
);

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const currentRoute = pathname.split("/").filter(Boolean).pop();
  const activeView =
    currentRoute === "roadmap" ||
    currentRoute === "curriculum" ||
    currentRoute === "cbt" ||
    currentRoute === "strategy"
      ? currentRoute
      : "overview";
  const [selectedPart, setSelectedPart] = useState("part1");
  const [openChapter, setOpenChapter] = useState("spatial-basics");
  const [completed, setCompleted] = useState<string[]>([]);
  const [courseHydrated, setCourseHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [chapterAnswers, setChapterAnswers] = useState<
    Record<string, number>
  >({});
  const [revealed, setRevealed] = useState<string[]>([]);
  const [examIndex, setExamIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [examStartedAt, setExamStartedAt] = useState<number | null>(null);
  const [examSubmittedAt, setExamSubmittedAt] = useState<number | null>(null);
  const [examNow, setExamNow] = useState(0);
  const [examFilter, setExamFilter] = useState<ExamFilter>("all");
  const [examTextSize, setExamTextSize] = useState<ExamTextSize>("large");
  const [examHydrated, setExamHydrated] = useState(false);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("spatial-course-progress");
      if (saved) {
        try {
          setCompleted(JSON.parse(saved));
        } catch {
          window.localStorage.removeItem("spatial-course-progress");
        }
      }
      setCourseHydrated(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!courseHydrated) return;

    window.localStorage.setItem(
      "spatial-course-progress",
      JSON.stringify(completed),
    );
  }, [completed, courseHydrated]);

  useEffect(() => {
    if (activeView !== "curriculum") return;

    const hashTimer = window.setTimeout(() => {
      const partId = window.location.hash.replace("#", "");
      const part = courseParts.find((item) => item.id === partId);
      if (!part) return;

      setSelectedPart(part.id);
      setOpenChapter(part.chapters[0].id);
      setSearch("");
    }, 0);

    return () => window.clearTimeout(hashTimer);
  }, [activeView]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(MOCK_EXAM_STORAGE_KEY);

      if (saved) {
        try {
          const parsed = JSON.parse(saved) as {
            answers?: Record<number, number>;
            flagged?: number[];
            index?: number;
            startedAt?: number | null;
            submittedAt?: number | null;
            textSize?: ExamTextSize;
          };

          if (parsed.answers && typeof parsed.answers === "object") {
            setExamAnswers(parsed.answers);
          }
          if (Array.isArray(parsed.flagged)) {
            setFlaggedQuestions(parsed.flagged);
          }
          if (typeof parsed.index === "number") {
            setExamIndex(
              Math.max(0, Math.min(parsed.index, totalMockExamQuestions - 1)),
            );
          }
          if (typeof parsed.startedAt === "number") {
            setExamStartedAt(parsed.startedAt);
          }
          if (typeof parsed.submittedAt === "number") {
            setExamSubmittedAt(parsed.submittedAt);
          }
          if (parsed.textSize === "large" || parsed.textSize === "xlarge") {
            setExamTextSize(parsed.textSize);
          }
        } catch {
          window.localStorage.removeItem(MOCK_EXAM_STORAGE_KEY);
        }
      }

      setExamNow(Date.now());
      setExamHydrated(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!examHydrated) return;

    window.localStorage.setItem(
      MOCK_EXAM_STORAGE_KEY,
      JSON.stringify({
        answers: examAnswers,
        flagged: flaggedQuestions,
        index: examIndex,
        startedAt: examStartedAt,
        submittedAt: examSubmittedAt,
        textSize: examTextSize,
      }),
    );
  }, [
    examAnswers,
    examFilter,
    examHydrated,
    examIndex,
    examStartedAt,
    examSubmittedAt,
    examTextSize,
    flaggedQuestions,
  ]);

  useEffect(() => {
    if (!examStartedAt || examSubmittedAt) return;

    const timer = window.setInterval(() => setExamNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [examStartedAt, examSubmittedAt]);

  const filteredParts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ko");
    if (!query) {
      return courseParts.filter((part) => part.id === selectedPart);
    }

    return courseParts
      .map((part) => ({
        ...part,
        chapters: part.chapters.filter((chapter) =>
          [
            chapter.title,
            chapter.summary,
            chapter.definition,
            ...chapter.keywords,
            ...chapter.concepts.flatMap((concept) => [
              concept.label,
              concept.text,
            ]),
          ]
            .join(" ")
            .toLocaleLowerCase("ko")
            .includes(query),
        ),
      }))
      .filter((part) => part.chapters.length > 0);
  }, [search, selectedPart]);

  const progress = Math.round((completed.length / totalChapters) * 100);
  const currentExamQuestion = mockExamQuestions[examIndex];
  const answeredCount = mockExamQuestions.filter(
    (question) => examAnswers[question.number] !== undefined,
  ).length;
  const unansweredCount = totalMockExamQuestions - answeredCount;
  const elapsedSeconds = examStartedAt
    ? Math.max(
        0,
        Math.floor(
          ((examSubmittedAt ?? examNow) - examStartedAt) / 1000,
        ),
      )
    : 0;
  const visibleExamQuestions = mockExamQuestions.filter((question) => {
    if (examFilter === "unanswered") {
      return examAnswers[question.number] === undefined;
    }
    if (examFilter === "flagged") {
      return flaggedQuestions.includes(question.number);
    }
    return true;
  });

  function toggleComplete(chapterId: string) {
    setCompleted((current) =>
      current.includes(chapterId)
        ? current.filter((id) => id !== chapterId)
        : [...current, chapterId],
    );
  }

  function revealChapterAnswer(chapter: Chapter) {
    if (chapterAnswers[chapter.id] === undefined) return;
    setRevealed((current) =>
      current.includes(chapter.id) ? current : [...current, chapter.id],
    );
  }

  function startMockExam() {
    const startedAt = Date.now();
    setExamStartedAt(startedAt);
    setExamNow(startedAt);
    setExamSubmittedAt(null);
  }

  function goToExamQuestion(questionNumber: number) {
    const nextIndex = mockExamQuestions.findIndex(
      (question) => question.number === questionNumber,
    );
    if (nextIndex >= 0) setExamIndex(nextIndex);
  }

  function toggleExamFlag(questionNumber: number) {
    setFlaggedQuestions((current) =>
      current.includes(questionNumber)
        ? current.filter((number) => number !== questionNumber)
        : [...current, questionNumber],
    );
  }

  function submitMockExam() {
    if (!examStartedAt || examSubmittedAt) return;

    const message = unansweredCount
      ? `아직 ${unansweredCount}문항이 비어 있습니다. 현재 답안으로 기록을 완료할까요?`
      : "41문항의 답안 기록을 완료할까요?";

    if (!window.confirm(message)) return;

    const submittedAt = Date.now();
    setExamNow(submittedAt);
    setExamSubmittedAt(submittedAt);
    setExamFilter("all");
  }

  function reopenMockExam() {
    const resumedAt = Date.now();
    if (examSubmittedAt && examStartedAt) {
      setExamStartedAt(examStartedAt + (resumedAt - examSubmittedAt));
    }
    setExamSubmittedAt(null);
    setExamNow(resumedAt);
  }

  function resetMockExam() {
    if (
      !window.confirm(
        "선택한 답안과 보류 표시, 풀이 시간이 모두 삭제됩니다. 처음부터 다시 시작할까요?",
      )
    ) {
      return;
    }

    setExamIndex(0);
    setExamAnswers({});
    setFlaggedQuestions([]);
    setExamStartedAt(null);
    setExamSubmittedAt(null);
    setExamNow(0);
    setExamFilter("all");
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        본문 바로가기
      </a>

      <aside className="side-rail" aria-label="주요 메뉴">
        <Link className="rail-brand" href="/" aria-label="처음으로">
          <span className="brand-mark" aria-hidden="true">
            SE
          </span>
          <span>
            <strong>SPATIAL</strong>
            <small>ENGINEER LAB</small>
          </span>
        </Link>

        <nav className="rail-nav">
          <Link
            href="/"
            className={activeView === "overview" ? "active" : ""}
            aria-current={activeView === "overview" ? "page" : undefined}
          >
            <span>01</span>개요
          </Link>
          <Link
            href="/roadmap"
            className={activeView === "roadmap" ? "active" : ""}
            aria-current={activeView === "roadmap" ? "page" : undefined}
          >
            <span>02</span>로드맵
          </Link>
          <Link
            href="/curriculum"
            className={activeView === "curriculum" ? "active" : ""}
            aria-current={activeView === "curriculum" ? "page" : undefined}
          >
            <span>03</span>기본서
          </Link>
          <Link
            href="/cbt"
            className={activeView === "cbt" ? "active" : ""}
            aria-current={activeView === "cbt" ? "page" : undefined}
          >
            <span>04</span>CBT 문제
          </Link>
          <Link
            href="/strategy"
            className={activeView === "strategy" ? "active" : ""}
            aria-current={activeView === "strategy" ? "page" : undefined}
          >
            <span>05</span>학습전략
          </Link>
        </nav>

        <div className="rail-progress">
          <div
            className="progress-ring"
            style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}
          >
            <span>{progress}%</span>
          </div>
          <div>
            <strong>나의 진도</strong>
            <small>
              {completed.length}/{totalChapters} 챕터
            </small>
          </div>
        </div>

        <Link className="source-link" href="/cbt">
          제1회 41문항 풀기 ↘
        </Link>
      </aside>

      <div className="site-frame">
        <header className="mobile-bar">
          <Link href="/" className="mobile-brand">
            <span className="brand-mark">SE</span>
            공간정보 학습실
          </Link>
          <span className="mobile-progress">{progress}% 완료</span>
        </header>

        <nav className="mobile-nav" aria-label="모바일 주요 메뉴">
          <Link
            href="/"
            className={activeView === "overview" ? "active" : ""}
            aria-current={activeView === "overview" ? "page" : undefined}
          >
            개요
          </Link>
          <Link
            href="/roadmap"
            className={activeView === "roadmap" ? "active" : ""}
            aria-current={activeView === "roadmap" ? "page" : undefined}
          >
            로드맵
          </Link>
          <Link
            href="/curriculum"
            className={activeView === "curriculum" ? "active" : ""}
            aria-current={activeView === "curriculum" ? "page" : undefined}
          >
            기본서
          </Link>
          <Link
            href="/cbt"
            className={activeView === "cbt" ? "active" : ""}
            aria-current={activeView === "cbt" ? "page" : undefined}
          >
            CBT 문제
          </Link>
          <Link
            href="/strategy"
            className={activeView === "strategy" ? "active" : ""}
            aria-current={activeView === "strategy" ? "page" : undefined}
          >
            학습전략
          </Link>
        </nav>

        <main id="main-content">
          {activeView === "overview" && (
            <section className="hero" id="overview">
            <div className="hero-copy">
              <div className="eyebrow">
                <span>국가기술자격 대비</span>
                <i aria-hidden="true" />
                41-QUESTION PRACTICE
              </div>
              <h1>
                공간을 읽는 기술,
                <br />
                <em>합격으로 연결하다.</em>
              </h1>
              <p>
                14개 핵심 챕터로 개념을 익히고, 첨부된 제1회 실전
                모의고사 41문항을 실제 답안지처럼 풀어보세요. 선택한 답은
                이 기기에 자동으로 저장됩니다.
              </p>
              <div className="hero-actions">
                <Link className="primary-button" href="/cbt">
                  41문항 시작하기 <span>→</span>
                </Link>
                <Link className="text-button" href="/curriculum">
                  개념 먼저 복습하기
                </Link>
              </div>
              <dl className="hero-stats">
                <div>
                  <dt>03</dt>
                  <dd>핵심 PART</dd>
                </div>
                <div>
                  <dt>14</dt>
                  <dd>기초 챕터</dd>
                </div>
                <div>
                  <dt>{totalMockExamQuestions}</dt>
                  <dd>실전문항</dd>
                </div>
              </dl>
            </div>

            <div className="spatial-stage" aria-label="공간정보 개념 미리보기">
              <div className="stage-orbit orbit-one" />
              <div className="stage-orbit orbit-two" />
              <div className="floating-label label-vector">
                <span>V</span>
                <div>
                  <small>VECTOR</small>
                  <strong>점 · 선 · 면</strong>
                </div>
              </div>
              <div className="floating-label label-raster">
                <span>R</span>
                <div>
                  <small>RASTER</small>
                  <strong>격자 · 픽셀</strong>
                </div>
              </div>
              <div className="map-platform">
                <div className="map-face">
                  <span className="road road-a" />
                  <span className="road road-b" />
                  <span className="road road-c" />
                  <span className="water" />
                  <span className="zone zone-a" />
                  <span className="zone zone-b" />
                  <span className="map-pin pin-a">
                    <i />
                  </span>
                  <span className="map-pin pin-b">
                    <i />
                  </span>
                  <span className="building building-a" />
                  <span className="building building-b" />
                  <span className="building building-c" />
                </div>
              </div>
              <div className="coordinate-card">
                <span>37.5665° N</span>
                <span>126.9780° E</span>
                <i />
              </div>
              <div className="stage-caption">
                <span className="live-dot" />
                POSITION + ATTRIBUTE + TIME
              </div>
            </div>
            </section>
          )}

          {activeView === "roadmap" && (
            <section className="roadmap-section" id="roadmap">
            <div className="section-heading">
              <div>
                <span className="section-index">01 / ROADMAP</span>
                <h2>흐름을 알면 개념이 연결됩니다.</h2>
              </div>
              <p>
                분석의 언어를 익히고, 서비스로 연결한 뒤, 콘텐츠로
                완성하는 순서입니다.
              </p>
            </div>

            <div className="part-grid">
              {courseParts.map((part, partIndex) => {
                const partCompleted = part.chapters.filter((chapter) =>
                  completed.includes(chapter.id),
                ).length;
                return (
                  <article
                    className={`part-card part-${part.accent}`}
                    key={part.id}
                  >
                    <div className="part-card-top">
                      <span>{part.number}</span>
                      <strong>
                        {part.chapters.length.toString().padStart(2, "0")} CH
                      </strong>
                    </div>
                    <h3>{part.title}</h3>
                    <p>{part.description}</p>
                    <ol>
                      {part.chapters.map((chapter) => (
                        <li key={chapter.id}>
                          <span>{chapter.number}</span>
                          {chapter.title}
                          {completed.includes(chapter.id) && (
                            <i aria-label="완료">✓</i>
                          )}
                        </li>
                      ))}
                    </ol>
                    <div className="part-card-progress">
                      <span
                        style={{
                          width: `${(partCompleted / part.chapters.length) * 100}%`,
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(`/curriculum#${part.id}`);
                      }}
                    >
                      PART {partIndex + 1} 학습하기 <span>↗</span>
                    </button>
                  </article>
                );
              })}
            </div>
            </section>
          )}

          {activeView === "curriculum" && (
            <section className="curriculum-section" id="curriculum">
            <div className="curriculum-header">
              <div>
                <span className="section-index">02 / FOUNDATION</span>
                <h2>개념 기본서</h2>
                <p>
                  제목을 펼쳐 핵심 개념을 읽고, 확인문제까지 풀면 완료
                  표시를 남겨보세요.
                </p>
              </div>
              <label className="search-box">
                <span aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="좌표계, WFS, LOD 검색"
                  aria-label="학습 내용 검색"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="검색어 지우기"
                  >
                    ×
                  </button>
                )}
              </label>
            </div>

            <div className="part-tabs" role="tablist" aria-label="학습 PART">
              {courseParts.map((part) => {
                const done = part.chapters.filter((chapter) =>
                  completed.includes(chapter.id),
                ).length;
                return (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selectedPart === part.id && !search}
                    className={
                      selectedPart === part.id && !search ? "active" : ""
                    }
                    key={part.id}
                    onClick={() => {
                      setSearch("");
                      setSelectedPart(part.id);
                      setOpenChapter(part.chapters[0].id);
                    }}
                  >
                    <span>{part.number}</span>
                    <strong>{part.title}</strong>
                    <small>
                      {done}/{part.chapters.length}
                    </small>
                  </button>
                );
              })}
            </div>

            <div className="chapter-list">
              {filteredParts.length === 0 && (
                <div className="empty-state">
                  <strong>검색 결과가 없습니다.</strong>
                  <p>다른 개념어나 도구 이름으로 검색해 보세요.</p>
                  <button type="button" onClick={() => setSearch("")}>
                    전체 보기
                  </button>
                </div>
              )}

              {filteredParts.map((part) => (
                <div className="part-course-block" key={part.id}>
                  {search && (
                    <div className="search-part-label">
                      {part.number} · {part.title}
                    </div>
                  )}
                  {part.chapters.map((chapter) => {
                    const isOpen = openChapter === chapter.id;
                    const isDone = completed.includes(chapter.id);
                    const selectedAnswer = chapterAnswers[chapter.id];
                    const isRevealed = revealed.includes(chapter.id);

                    return (
                      <article
                        className={`chapter-card ${isOpen ? "open" : ""} ${
                          isDone ? "done" : ""
                        }`}
                        key={chapter.id}
                      >
                        <div className="chapter-summary">
                          <button
                            type="button"
                            className="chapter-toggle"
                            aria-expanded={isOpen}
                            aria-controls={`content-${chapter.id}`}
                            onClick={() =>
                              setOpenChapter(isOpen ? "" : chapter.id)
                            }
                          >
                            <span className="chapter-number">
                              {chapter.number}
                            </span>
                            <span className="chapter-title">
                              <strong>{chapter.title}</strong>
                              <small>{chapter.summary}</small>
                            </span>
                            <span className="chapter-keywords">
                              {chapter.keywords.slice(0, 3).map((keyword) => (
                                <i key={keyword}>{keyword}</i>
                              ))}
                            </span>
                            <span className="expand-icon" aria-hidden="true">
                              {isOpen ? "−" : "+"}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="complete-button"
                            aria-pressed={isDone}
                            onClick={() => toggleComplete(chapter.id)}
                          >
                            <span>{isDone ? "✓" : ""}</span>
                            {isDone ? "완료" : "완료 표시"}
                          </button>
                        </div>

                        {isOpen && (
                          <div
                            className="chapter-content"
                            id={`content-${chapter.id}`}
                          >
                            <div className="definition-block">
                              <span>한 문장 이해</span>
                              <p>{chapter.definition}</p>
                            </div>

                            <div className="concept-grid">
                              {chapter.concepts.map((concept, index) => (
                                <div className="concept-card" key={concept.label}>
                                  <span>
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                  <h4>{concept.label}</h4>
                                  <p>{concept.text}</p>
                                </div>
                              ))}
                            </div>

                            {chapter.steps && (
                              <div className="process-block">
                                <span className="mini-label">PROCESS</span>
                                <div className="process-flow">
                                  {chapter.steps.map((step, index) => (
                                    <div key={step}>
                                      <span>{step}</span>
                                      {index < chapter.steps!.length - 1 && (
                                        <i>→</i>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <aside className="exam-point">
                              <div>
                                <span>EXAM</span>
                                <strong>시험 연결 포인트</strong>
                              </div>
                              <p>{chapter.examPoint}</p>
                            </aside>

                            <div className="quick-check">
                              <div className="quick-check-head">
                                <div>
                                  <span>QUICK CHECK</span>
                                  <strong>{chapter.question.prompt}</strong>
                                </div>
                                <small>1문제 · 개념 확인</small>
                              </div>
                              <div
                                className="answer-options"
                                role="radiogroup"
                                aria-label={chapter.question.prompt}
                              >
                                {chapter.question.choices.map(
                                  (choice, choiceIndex) => {
                                    const isSelected =
                                      selectedAnswer === choiceIndex;
                                    const isCorrect =
                                      isRevealed &&
                                      choiceIndex === chapter.question.answer;
                                    const isWrong =
                                      isRevealed &&
                                      isSelected &&
                                      choiceIndex !== chapter.question.answer;
                                    return (
                                      <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        disabled={isRevealed}
                                        className={`${isSelected ? "selected" : ""} ${
                                          isCorrect ? "correct" : ""
                                        } ${isWrong ? "wrong" : ""}`}
                                        key={choice}
                                        onClick={() =>
                                          setChapterAnswers((current) => ({
                                            ...current,
                                            [chapter.id]: choiceIndex,
                                          }))
                                        }
                                      >
                                        <span>
                                          {String.fromCharCode(65 + choiceIndex)}
                                        </span>
                                        {choice}
                                      </button>
                                    );
                                  },
                                )}
                              </div>
                              {!isRevealed ? (
                                <button
                                  type="button"
                                  className="answer-button"
                                  disabled={selectedAnswer === undefined}
                                  onClick={() => revealChapterAnswer(chapter)}
                                >
                                  정답 확인
                                </button>
                              ) : (
                                <div className="answer-explanation">
                                  <span>
                                    {selectedAnswer === chapter.question.answer
                                      ? "정답입니다"
                                      : "한 번 더 확인해 보세요"}
                                  </span>
                                  <p>{chapter.question.explanation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
            </section>
          )}

          {activeView === "cbt" && (
            <section
              className="mock-exam-section"
              id="mock-exam"
              aria-busy={!examHydrated}
            >
            <div className="mock-exam-header">
              <div>
                <span className="section-index">03 / MOCK EXAM</span>
                <h2>제1회 실전 모의고사</h2>
                <p>
                  첨부된 문제편의 41문항과 보기를 그대로 옮겼습니다. 답을
                  고르고, 헷갈리는 문항은 보류한 뒤 답안지를 완성해 보세요.
                </p>
              </div>
              <div className="exam-overview-stats" aria-label="모의고사 구성">
                <div>
                  <strong>41</strong>
                  <span>전체 문항</span>
                </div>
                <div>
                  <strong>03</strong>
                  <span>과목 영역</span>
                </div>
                <div>
                  <strong>{answeredCount}</strong>
                  <span>답안 선택</span>
                </div>
              </div>
            </div>

            <div className="exam-source-notice" role="note">
              <span aria-hidden="true">i</span>
              <p>
                원본 파일에는 정답·해설이 없습니다. 따라서 임의 채점 없이
                풀이와 답안 기록 기능만 제공하며, 선택한 답안은 현재 기기에
                자동 저장됩니다.
              </p>
            </div>

            {!examStartedAt ? (
              <div className="exam-launch-card">
                <div className="exam-launch-copy">
                  <span>READY WHEN YOU ARE</span>
                  <h3>문제지를 넘기듯, 한 문항씩 집중해서 풀어보세요.</h3>
                  <p>
                    답을 선택하지 않아도 이전·다음 버튼이나 번호표로
                    자유롭게 이동할 수 있습니다. 페이지를 닫아도 답안과
                    현재 문항이 남습니다.
                  </p>
                  <button type="button" onClick={startMockExam}>
                    모의고사 시작 <span>→</span>
                  </button>
                </div>
                <div className="exam-category-list">
                  <div>
                    <span>01</span>
                    <p>
                      <strong>공간정보 분석</strong>
                      <small>1–20번 · 20문항</small>
                    </p>
                  </div>
                  <div>
                    <span>02</span>
                    <p>
                      <strong>공간정보서비스 프로그래밍</strong>
                      <small>21–40번 · 20문항</small>
                    </p>
                  </div>
                  <div>
                    <span>03</span>
                    <p>
                      <strong>공간정보 융합콘텐츠 개발</strong>
                      <small>41번 · 1문항</small>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="exam-workspace">
                <article
                  className={`exam-question-card text-${examTextSize}`}
                >
                  {examSubmittedAt && (
                    <div className="exam-complete-banner" role="status">
                      <span>답안 기록 완료</span>
                      <strong>
                        {answeredCount}문항 답변 · {unansweredCount}문항 미응답
                      </strong>
                      <p>
                        정답표가 없어 점수는 표시하지 않습니다. 문항별 선택
                        답안을 확인하거나 다시 수정할 수 있습니다.
                      </p>
                    </div>
                  )}

                  <div className="exam-question-top">
                    <div>
                      <span>{currentExamQuestion.category}</span>
                      <small>
                        {String(currentExamQuestion.number).padStart(2, "0")} /{" "}
                        {totalMockExamQuestions}
                      </small>
                    </div>
                    <button
                      type="button"
                      className={
                        flaggedQuestions.includes(currentExamQuestion.number)
                          ? "flagged"
                          : ""
                      }
                      aria-pressed={flaggedQuestions.includes(
                        currentExamQuestion.number,
                      )}
                      onClick={() =>
                        toggleExamFlag(currentExamQuestion.number)
                      }
                    >
                      <span aria-hidden="true">⚑</span>
                      {flaggedQuestions.includes(currentExamQuestion.number)
                        ? "보류됨"
                        : "보류 표시"}
                    </button>
                  </div>

                  <div className="exam-question-body">
                    <span className="exam-question-label">
                      QUESTION {String(currentExamQuestion.number).padStart(2, "0")}
                    </span>
                    <h3>{currentExamQuestion.prompt}</h3>

                    {currentExamQuestion.passage && (
                      <blockquote>{currentExamQuestion.passage}</blockquote>
                    )}

                    {currentExamQuestion.code && (
                      <div className="exam-code-block">
                        <span>
                          {currentExamQuestion.codeLanguage?.toUpperCase()}
                        </span>
                        <pre>
                          <code>{currentExamQuestion.code}</code>
                        </pre>
                      </div>
                    )}

                    <div
                      className="exam-choices"
                      role="radiogroup"
                      aria-label={`${currentExamQuestion.number}번 답안`}
                    >
                      {currentExamQuestion.choices.map((choice, choiceIndex) => {
                        const isSelected =
                          examAnswers[currentExamQuestion.number] === choiceIndex;
                        return (
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            disabled={Boolean(examSubmittedAt)}
                            className={isSelected ? "selected" : ""}
                            onClick={() =>
                              setExamAnswers((current) => ({
                                ...current,
                                [currentExamQuestion.number]: choiceIndex,
                              }))
                            }
                            key={`${currentExamQuestion.number}-${choiceIndex}`}
                          >
                            <span>{choiceIndex + 1}</span>
                            <strong>{choice}</strong>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="exam-question-footer">
                    <button
                      type="button"
                      disabled={examIndex === 0}
                      onClick={() => setExamIndex((index) => index - 1)}
                    >
                      ← 이전 문항
                    </button>
                    <span>
                      {examAnswers[currentExamQuestion.number] === undefined
                        ? "미응답으로 건너뛰어도 괜찮아요"
                        : `${examAnswers[currentExamQuestion.number] + 1}번 선택됨`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (examIndex < totalMockExamQuestions - 1) {
                          setExamIndex((index) => index + 1);
                          return;
                        }
                        setExamFilter(unansweredCount ? "unanswered" : "all");
                        document.getElementById("answer-sheet")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                    >
                      {examIndex === totalMockExamQuestions - 1
                        ? "답안지 보기"
                        : "다음 문항 →"}
                    </button>
                  </div>
                </article>

                <aside className="exam-sidebar" id="answer-sheet">
                  <div className="exam-session-card">
                    <div className="exam-session-head">
                      <span>{examSubmittedAt ? "풀이 시간" : "경과 시간"}</span>
                      <strong aria-live="off">{formatElapsed(elapsedSeconds)}</strong>
                    </div>
                    <div className="exam-answer-progress">
                      <span
                        style={{
                          width: `${(answeredCount / totalMockExamQuestions) * 100}%`,
                        }}
                      />
                    </div>
                    <p aria-live="polite">
                      <strong>{answeredCount}</strong> / {totalMockExamQuestions} 답변
                      완료
                    </p>
                    <div className="exam-font-control">
                      <span>문제 글자 크기</span>
                      <div>
                        <button
                          type="button"
                          className={examTextSize === "large" ? "active" : ""}
                          aria-pressed={examTextSize === "large"}
                          onClick={() => setExamTextSize("large")}
                        >
                          크게
                        </button>
                        <button
                          type="button"
                          className={examTextSize === "xlarge" ? "active" : ""}
                          aria-pressed={examTextSize === "xlarge"}
                          onClick={() => setExamTextSize("xlarge")}
                        >
                          더 크게
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="exam-answer-sheet">
                    <div className="exam-answer-sheet-head">
                      <div>
                        <span>ANSWER SHEET</span>
                        <strong>문항 바로가기</strong>
                      </div>
                      <small>{flaggedQuestions.length}개 보류</small>
                    </div>

                    <div className="exam-filter-tabs" aria-label="문항 필터">
                      {(
                        [
                          ["all", "전체"],
                          ["unanswered", "미응답"],
                          ["flagged", "보류"],
                        ] as const
                      ).map(([filter, label]) => (
                        <button
                          type="button"
                          aria-pressed={examFilter === filter}
                          className={examFilter === filter ? "active" : ""}
                          onClick={() => setExamFilter(filter)}
                          key={filter}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {visibleExamQuestions.length ? (
                      <div className="exam-number-grid">
                        {visibleExamQuestions.map((question) => {
                          const isCurrent = question.number === currentExamQuestion.number;
                          const isAnswered = examAnswers[question.number] !== undefined;
                          const isFlagged = flaggedQuestions.includes(question.number);
                          return (
                            <button
                              type="button"
                              className={`${isCurrent ? "current" : ""} ${
                                isAnswered ? "answered" : ""
                              } ${isFlagged ? "flagged" : ""}`}
                              aria-current={isCurrent ? "step" : undefined}
                              aria-label={`${question.number}번${
                                isAnswered ? ", 답변 완료" : ", 미응답"
                              }${isFlagged ? ", 보류" : ""}`}
                              onClick={() => goToExamQuestion(question.number)}
                              key={question.number}
                            >
                              {question.number}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="exam-filter-empty">
                        이 조건에 해당하는 문항이 없습니다.
                      </p>
                    )}

                    <div className="exam-answer-legend" aria-hidden="true">
                      <span><i className="answered" />답변</span>
                      <span><i className="flagged" />보류</span>
                      <span><i className="current" />현재</span>
                    </div>
                  </div>

                  {examSubmittedAt ? (
                    <div className="exam-result-actions">
                      <span>REVIEW MODE</span>
                      <strong>선택 답안을 확인 중입니다.</strong>
                      <button type="button" onClick={reopenMockExam}>
                        답안 수정하기
                      </button>
                      <button type="button" className="secondary" onClick={resetMockExam}>
                        처음부터 다시 풀기
                      </button>
                    </div>
                  ) : (
                    <div className="exam-submit-actions">
                      <button type="button" onClick={submitMockExam}>
                        답안 기록 완료
                        <span>{unansweredCount}문항 미응답</span>
                      </button>
                      <button type="button" onClick={resetMockExam}>
                        풀이 초기화
                      </button>
                    </div>
                  )}
                </aside>
              </div>
            )}
            </section>
          )}

          {activeView === "strategy" && (
            <section className="strategy-section" id="strategy">
            <div className="section-heading light-heading">
              <div>
                <span className="section-index">04 / STUDY STRATEGY</span>
                <h2>합격 공부는 세 번 다르게 봅니다.</h2>
              </div>
              <p>
                같은 내용을 이해, 연결, 적용의 관점으로 반복하면 암기
                부담이 줄어듭니다.
              </p>
            </div>

            <div className="strategy-grid">
              <article>
                <span>1st PASS</span>
                <strong>개념의 차이 이해</strong>
                <p>
                  벡터와 래스터, 처리와 분석, WMS와 WFS처럼 자주 비교되는
                  개념을 짝으로 정리합니다.
                </p>
                <small>키워드 → 한 문장 설명</small>
              </article>
              <article>
                <span>2nd PASS</span>
                <strong>흐름과 순서 연결</strong>
                <p>
                  수집에서 구축, 요청에서 응답, 기획에서 운영까지 각
                  단계의 입력과 결과를 화살표로 그립니다.
                </p>
                <small>입력 → 처리 → 결과</small>
              </article>
              <article>
                <span>3rd PASS</span>
                <strong>조건을 보고 도구 선택</strong>
                <p>
                  문제의 ‘반경·중첩·경로·포함·타일’ 같은 단서가 어떤
                  기법과 연결되는지 반복해서 풀어봅니다.
                </p>
                <small>상황 → 판단 → 근거</small>
              </article>
            </div>

            <div className="study-order">
              <span>RECOMMENDED ORDER</span>
              <div>
                <strong>기초</strong>
                <i>→</i>
                <strong>처리·영상</strong>
                <i>→</i>
                <strong>분석·수집</strong>
                <i>→</i>
                <strong>UI·DB</strong>
                <i>→</i>
                <strong>웹·모바일</strong>
                <i>→</i>
                <strong>콘텐츠·3D</strong>
              </div>
            </div>
            </section>
          )}
        </main>

        <footer>
          <div className="footer-brand">
            <span className="brand-mark">SE</span>
            <div>
              <strong>공간정보융합산업기사 학습실</strong>
              <small>Spatial Engineer Foundation Course</small>
            </div>
          </div>
          <p>
            기본 개념 자료와 첨부된 제1회 실전 모의고사 문제편을 웹용으로
            재구성했습니다. 문제편에는 정답·해설이 포함되어 있지 않으며,
            시험 일정과 출제기준은 Q-Net 최신 공고를 확인하세요.
          </p>
          <div className="footer-links">
            <a
              href="https://chatgpt.com/share/6a6bf597-2658-83ee-a02b-bc8a65d3fc0a"
              target="_blank"
              rel="noreferrer"
            >
              정리 원문
            </a>
            <a
              href="https://www.q-net.or.kr/"
              target="_blank"
              rel="noreferrer"
            >
              Q-Net 공식 사이트
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
