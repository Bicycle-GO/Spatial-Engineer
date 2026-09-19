# Spatial Engineer

공간정보융합산업기사와 공간정보융합기능사를 위한 두 가지 학습 트랙입니다.
각 트랙은 기본이론, 개별 챕터, 기출·예상문제 풀이 페이지로 나뉩니다.

- 산업기사: 26개 이론 챕터, 대화 속 문제 7개, 예상·개념 확인 문제 41개
- 기능사: 19개 이론 챕터, 대화 속 문제 7개, 예상·개념 확인 문제 19개
- 두 트랙에서 투영법·공간분석·원격탐사·DB·코딩 등을 다룬 12개 인터랙티브 시각화 단원을 제공합니다.
- 이론은 그림, 개념·비교, 사례·문제 포인트로 나뉩니다. 문제는 단계별 해설과 관련 이론을 연결합니다.
- 이론 진도는 트랙별로 브라우저에 저장되며 기존 산업기사 진도도 이어집니다.
- 대화 속 문제는 제공된 공유 대화의 문항을 재구성했습니다. 시행 연도·회차가 확인된 실제 기출문제는 아직 등록되어 있지 않습니다.
- 기능사 과정은 입문용 보조 학습 과정이며 공식 출제기준 전체를 대체하지 않습니다.

## Local development

Node.js 22.13 이상에서 `npm ci`, `npm run dev`로 실행합니다.

- `npm run lint`: 코드 검사
- `npm run typecheck`: TypeScript 검사
- `npm test`: GitHub Pages 정적 빌드 및 페이지·링크 검사
- `npm run build:pages`: `/Spatial-Engineer` 경로를 적용한 정적 사이트 빌드
- `npm run dev:sites` / `npm run build:sites`: 기존 Sites/Vinext 환경

로고 원본은 `public/spatial-logo.svg`이며, 헤더와 파비콘에 적용되어 있습니다.

공유 대화의 반영 범위와 정정 사항은 [콘텐츠 출처 기록](docs/content-sources.md)에 정리했습니다.

## Web

[공간정보융합산업기사 학습실](https://bicycle-go.github.io/Spatial-Engineer/)

`main` 브랜치에 변경사항이 반영되면 GitHub Actions가 정적 사이트를
빌드하여 GitHub Pages에 배포합니다.
