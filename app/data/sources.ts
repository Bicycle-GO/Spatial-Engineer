export const sources: Record<string, { title: string; url: string; kind: "conversation" | "reference" }> = {
  gemini1: { title: "공유 대화 ① · 투영법, DB, 프로그래밍, 위상", url: "https://share.gemini.google/p14uBOy5VzrA", kind: "conversation" },
  gemini2: { title: "공유 대화 ② · 공간분석, 보간, 원격탐사", url: "https://share.gemini.google/omMX7aoI5div", kind: "conversation" },
  qgisCrs: { title: "QGIS · 좌표 참조 체계", url: "https://docs.qgis.org/3.44/en/docs/gentle_gis_introduction/coordinate_reference_systems.html", kind: "reference" },
  esriProjection: { title: "Esri · 좌표계와 투영 특성", url: "https://pro.arcgis.com/en/pro-app/3.6/help/mapping/properties/specify-a-coordinate-system.htm", kind: "reference" },
  qgisInterpolation: { title: "QGIS · 공간보간", url: "https://docs.qgis.org/3.44/en/docs/gentle_gis_introduction/spatial_analysis_interpolation.html", kind: "reference" },
  esriClip: { title: "Esri · Clip의 입력·결과·속성", url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/analysis/clip.htm", kind: "reference" },
  java: { title: "Oracle · Java 연산자 우선순위", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html", kind: "reference" },
  javaUnary: { title: "Oracle · 전위·후위 증감 연산", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html", kind: "reference" },
  postgres: { title: "PostgreSQL · 관계형 테이블의 행과 열", url: "https://www.postgresql.org/docs/18/tutorial-concepts.html", kind: "reference" },
  nasa: { title: "NASA Earthdata · 네 가지 해상도", url: "https://www.earthdata.nasa.gov/learn/earth-observation-data-basics/remote-sensing-resolution", kind: "reference" },
  usgs: { title: "USGS · 영상의 기하·방사 보정", url: "https://pubs.usgs.gov/publication/fs20243039/full", kind: "reference" },
  istqb: { title: "ISTQB · 테스트 수준의 구분 (2018 v3.1.1)", url: "https://www.istqb.org/wp-content/uploads/2024/11/ISTQB-CTFL_Syllabus_2018_v3.1.1.pdf", kind: "reference" },
};
