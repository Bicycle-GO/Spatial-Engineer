import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const output = new URL("../out/", import.meta.url);
const html = (path = "") => readFile(new URL(`${path}index.html`, output), "utf8");

test("home links to independent theory and practice pages for both tracks", async () => {
  const page = await html();
  assert.match(page, /공간정보융합산업기사/);
  assert.match(page, /공간정보융합기능사/);
  for (const track of ["engineer", "technician"]) {
    for (const section of ["theory", "practice"]) {
      assert.ok(page.includes(`href="/Spatial-Engineer/${track}/${section}/"`));
    }
  }
  assert.ok(page.includes('/Spatial-Engineer/spatial-logo.svg'));
  assert.ok(page.includes('/Spatial-Engineer/favicon.svg'));
});

test("all chapter pages export, with readable theory separate from question controls", async () => {
  for (const [track, count] of [["engineer", 39], ["technician", 19]]) {
    const list = await html(`${track}/theory/`);
    const chapters = await readdir(new URL(`${track}/theory/`, output), { withFileTypes: true });
    const dirs = [];
    for (const entry of chapters.filter(entry => entry.isDirectory())) {
      try { await access(new URL(`${track}/theory/${entry.name}/index.html`, output)); dirs.push(entry); }
      catch { /* Next.js also emits RSC payload directories without a page. */ }
    }
    assert.equal(dirs.length, count);
    for (const directory of dirs) {
      const page = await html(`${track}/theory/${directory.name}/`);
      assert.match(page, /한 문장으로 이해하기/);
      assert.match(page, /핵심 개념/);
      assert.match(page, /학습 완료/);
      assert.match(page, /사례·문제 포인트/);
      const exam = track === "engineer" ? `${directory.name.startsWith("practical-") ? "practical" : "written"}/` : "";
      assert.ok(page.includes(`practice/${exam}?chapter=${directory.name}`));
      assert.doesNotMatch(page, /<input[^>]*type="radio"/);
    }
    assert.ok(list.replace(/<!--.*?-->/gs, "").includes(`그림으로 배우는 핵심 ${track === "engineer" ? 17 : 12}`));
    const featured = track === "engineer" ? "practical-crs" : "overlay-analysis";
    assert.ok(list.includes(`href="/Spatial-Engineer/${track}/theory/${featured}/"`));
  }
});

test("practice pages distinguish original practice items from actual past papers", async () => {
  for (const track of ["engineer", "technician"]) {
    const page = await html(`${track}/practice/${track === "engineer" ? "written/" : ""}`);
    assert.match(page, /실제 기출문제가 아닙니다/);
    assert.match(page, /<input[^>]*type="radio"/);
    assert.match(page, /정답 확인/);
    assert.match(page, /<fieldset/);
    assert.match(page, /기출문제/);
    assert.match(page, /대화 속 문제/);
    assert.match(page, /공유 대화 원문/);
    assert.match(page, /대화의 문항을 재구성한 개념도/);
  }
});

test("engineer exam hub separates written choices from practical answer writing", async () => {
  const hub = await html("engineer/practice/");
  for (const exam of ["written", "practical"]) {
    assert.ok(hub.includes(`href="/Spatial-Engineer/engineer/practice/${exam}/"`));
  }
  assert.match(hub, /실기 기본이론/);
  assert.match(hub, /사용자 제공 기출/);
  assert.ok(hub.includes("source=past&amp;chapter=spatial-basics"));
  const page = await html("engineer/practice/practical/");
  assert.match(page, /실기 필답형 연습/);
  assert.match(page, /<textarea/);
  assert.match(page, /모범답안과 비교/);
  assert.match(page, /공식 기출·채점 기준이 아닙니다/);
  assert.doesNotMatch(page, /<input[^>]*type="radio"/);
  for (const id of ["crs","quality","topology","overlay","raster","vectorization","rasterization","transformation","adjustment-error","sql","code","cartography","validation"]) {
    const lesson = await html(`engineer/theory/practical-${id}/`);
    assert.match(lesson, id === "adjustment-error" ? /class="residual-error-visual"/ : ["topology","vectorization","rasterization","transformation"].includes(id) ? new RegExp(`class="${id}-explorer"`) : /이렇게 답안으로 연결해요/);
    assert.ok(lesson.includes(`practice/practical/?chapter=practical-${id}`));
    assert.match(lesson, /학습 자료와 참고 출처/);
  }
});

test("practical curriculum maps every lesson to one of three major chapters", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/data/practical-curriculum.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const { practicalSections: sections, getPracticalSection } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  assert.deepEqual(sections.map(section=>section.title), ["공간정보 분석","공간정보서비스 프로그래밍","공간정보 융합콘텐츠 개발"]);
  const ids = sections.flatMap(section=>section.lessonIds);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getPracticalSection("spatial-basics").id, "analysis");
  assert.equal(getPracticalSection("practical-adjustment-error").id, "analysis");
  assert.equal(getPracticalSection("unknown-lesson"), undefined);
  const entries = await readdir(new URL("engineer/theory/", output), {withFileTypes:true});
  for (const entry of entries.filter(entry=>entry.isDirectory() && entry.name.startsWith("practical-"))) {
    let lesson;
    try {lesson = await html(`engineer/theory/${entry.name}/`);} catch {continue;}
    const section = getPracticalSection(entry.name);
    assert.ok(section, `${entry.name} needs a practical chapter`);
    assert.ok(lesson.includes(`실기 Chapter ${Number(section.number)} · ${section.title}`));
  }
  const hub = await html("engineer/practice/");
  assert.equal((hub.match(/class="practical-chapter-card"/g) ?? []).length, 3);
  const library = await html("engineer/theory/");
  assert.equal((library.match(/href="\/Spatial-Engineer\/engineer\/theory\/spatial-basics\/"/g) ?? []).length, 1);
  for (const section of sections) assert.ok(hub.includes(`practice/practical/?section=${section.id}`));
  const room = await html("engineer/practice/practical/");
  assert.match(room, /aria-label="실기 주요 목차"/);
  for (const section of sections) assert.ok(room.includes(`data-section="${section.id}"`));
});

test("adjustment review distinguishes point residuals from an overall RMS measure", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/data/adjustment-error.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const { adjustmentErrorQuestions: questions, adjustmentErrorLesson: lesson } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  assert.equal(questions.length, 3);
  assert.ok(questions.every(question=>question.chapterId===lesson.id && !question.provenance));
  assert.match(questions[0].prompt, /기준 보정점과 변환된 보정점의 위치 사이/);
  assert.match(questions[0].modelAnswer, /RMS 오차/);
  assert.ok(questions[0].explanation.some(text=>text.includes("잔차")));
  assert.match(questions[1].context, /변환식을 추정하는 과정은 생략/);
  assert.match(questions[1].modelAnswer, /5m/);
  assert.match(questions[1].modelAnswer, /3\.54m/);
  assert.ok(questions[2].modelAnswer.includes("독립 검사점"));
  const page = await html(`engineer/theory/${lesson.id}/`);
  assert.match(page, /class="residual-error-visual"/);
  assert.match(page, /점 하나의 차이/);
  assert.match(page, /여러 점의 RMS/);
  assert.ok(page.includes(`practice/practical/?chapter=${lesson.id}`));
});

test("line drawing vectorization explains thinning without conflating it with vector output", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/data/vectorization.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const { vectorizationStages: stages, vectorizationPracticalQuestions: questions, vectorizationLesson: lesson } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  assert.deepEqual(stages.map(stage=>stage.id), ["preprocess","thinning","vectorize","postprocess"]);
  assert.match(stages[1].output, /래스터/);
  assert.match(stages[2].output, /벡터/);
  assert.equal(questions.length, 5);
  assert.equal(new Set(questions.map(question=>question.id)).size, questions.length);
  for (const question of questions) {
    assert.equal(question.chapterId, lesson.id);
    assert.equal(question.provenance, undefined);
    assert.ok(question.modelAnswer && question.explanation.length && question.criteria.length);
  }
  assert.match(questions[0].prompt, /전처리 단계 - \(     \) - 벡터화 단계 - 후처리 단계/);
  assert.match(questions[0].modelAnswer, /전처리 단계 → 세선화 단계 → 벡터화 단계 → 후처리 단계/);
  assert.equal(questions[0].diagram.kind, "vectorization");
  assert.ok(lesson.guide.pitfalls.some(text=>text.includes("모든 변환")));
  const page = await html("engineer/theory/practical-vectorization/");
  assert.match(page, /class="vectorization-explorer"/);
  const textPage = page.replace(/<!--.*?-->/gs, "");
  assert.match(textPage, /입력 · 스캔한 종이 도면/);
  assert.match(textPage, /출력 · 전처리 후/);
  assert.match(page, /농수로/);
  assert.ok(page.includes("practice/practical/?chapter=practical-vectorization"));
  assert.match(page, /쉽게 생각하면/);
  assert.ok(stages.every(stage=>stage.analogy && stage.beforeAfter && stage.scenarios.length >= 2));
});

test("raster cell coding distinguishes category, presence and percentage in the same example", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/data/rasterization.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const { rasterCellRules: rules, rasterizationPracticalQuestions: questions, rasterizationLesson: lesson } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  assert.deepEqual(rules.map(rule=>rule.id), ["presence","center","dominant","percent"]);
  assert.deepEqual(rules.map(rule=>rule.result), ["도로 있음 · 1","밭 · 코드 20","산림 · 코드 10","도로 비율 · 10%"]);
  assert.equal(questions.length, 4);
  assert.ok(questions.every(question=>question.chapterId===lesson.id && !question.provenance));
  assert.match(questions[0].context, /Washington State Ecology/);
  assert.match(questions[0].prompt, /화소 값\(셀 값\)/);
  assert.match(questions[3].modelAnswer, /30%/);
  const page = await html(`engineer/theory/${lesson.id}/`);
  assert.match(page, /class="rasterization-explorer"/);
  assert.match(page, /셀 중심점 · 밭/);
  assert.ok(page.includes(`practice/practical/?chapter=${lesson.id}`));
});

test("spatial adjustment asks for all three models and keeps map projection distinct", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/data/transformation.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const { transformationPracticalQuestions: questions, transformationLesson: lesson } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  assert.equal(questions.length, 3);
  assert.ok(questions.every(question=>question.chapterId===lesson.id && !question.provenance));
  for (const term of ["등각사상", "부등각사상", "투영변환"]) assert.ok(questions[0].modelAnswer.includes(term));
  assert.match(questions[0].prompt, /3가지를/);
  assert.ok(questions[0].explanation.some(text=>text.includes("지도투영")));
  assert.ok(questions[2].modelAnswer.includes("독립 검사점"));
  const page = await html(`engineer/theory/${lesson.id}/`);
  assert.match(page, /class="transformation-explorer"/);
  assert.match(page, /등각사상\(상사\) 변환/);
  assert.ok(page.includes(`practice/practical/?chapter=${lesson.id}`));
});

test("topology learning covers all three geometry families with matching practical diagrams", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/data/topology-rules.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const { topologyRules: rules, topologyPracticalQuestions: questions, topologyLesson: lesson } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  assert.equal(rules.length, 12);
  assert.equal(questions.length, rules.length);
  assert.equal(new Set(rules.map(rule=>rule.id)).size, rules.length);
  assert.equal(new Set(questions.map(question=>question.id)).size, questions.length);
  for (const family of ["point", "line", "polygon"]) assert.equal(rules.filter(rule=>rule.family===family).length, 4);
  for (const rule of rules) {
    const matching = questions.filter(question=>question.diagram?.ruleId===rule.id);
    assert.equal(matching.length, 1);
    const question = matching[0];
    assert.equal(question.chapterId, lesson.id);
    assert.equal(question.diagram.kind, "topology");
    assert.equal(question.provenance, undefined);
    assert.ok(rule.example && rule.exception && rule.repair && rule.invalidLabel && rule.validLabel);
    assert.ok(question.modelAnswer && question.explanation.length && question.criteria.length);
  }
  assert.match(rules.find(rule=>rule.id==="polygon-one-point").condition, /정확히 한 개/);
  assert.match(rules.find(rule=>rule.id==="point-inside").condition, /경계 위/);
  assert.match(rules.find(rule=>rule.id==="line-no-dangles").exception, /막다른 도로/);
  const page = await html("engineer/theory/practical-topology/");
  assert.match(page, /포인트 레이어/);
  assert.match(page, /라인 레이어/);
  assert.match(page, /폴리곤 레이어/);
  assert.match(page, /규칙 위반 예시/);
  assert.match(page, /규칙 충족 예시/);
  assert.match(page, /예외와 적용 조건/);
  assert.ok(page.includes("rule=point-disjoint"));
});

test("the three user-provided practical questions retain scope and provenance", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/data/practical-past.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const { practicalPastQuestions: questions } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  assert.equal(questions.length, 3);
  assert.equal(new Set(questions.map(question => question.id)).size, 3);
  for (const [index, question] of questions.entries()) {
    assert.equal(question.chapterId, "spatial-basics");
    assert.equal(question.provenance.number, index + 1);
    assert.match(question.provenance.section, /Chapter 1\. 공간정보 분석 → 공간정보 기초/);
    assert.match(question.provenance.note, /시행 연도·회차와 공식 원문은 미확인/);
    assert.ok(question.modelAnswer && question.explanation.length && question.criteria.length);
  }
  assert.match(questions[0].prompt, /객체의 종류별로 구분하여 하나의 파일 단위로 입력한 후/);
  assert.equal(questions[0].modelAnswer, "레이어(Layer)");
  assert.match(questions[1].prompt, /자오선을 X축, 동서 방향을 Y축/);
  assert.match(questions[1].modelAnswer, /평면직각좌표계/);
  assert.equal(questions[2].prompt, "하나의 좌표계에서 다른 좌표계로의 변환을 의미하는 좌표 변환 방법 2가지를 쓰시오.");
  assert.match(questions[2].modelAnswer, /서로 다른 2가지/);
  for (const pair of ["등각사상 변환 + 부등각사상 변환", "등각사상 변환 + 투영변환", "부등각사상 변환 + 투영변환"]) {
    assert.ok(questions[2].modelAnswer.includes(pair));
  }
  assert.match(questions[2].criteria[0], /서로 다른 두 방법/);
  assert.doesNotMatch(questions[2].modelAnswer, /헬머트|아핀/);
  const lesson = await html("engineer/theory/spatial-basics/");
  assert.ok(lesson.includes("source=past&amp;chapter=spatial-basics"));
});

test("the twelve visual lessons render controls and source attribution in both tracks", async () => {
  const ids = ["map-projections", "coordinate-systems", "spatial-modeling", "topology", "overlay-analysis", "spatial-interpolation", "remote-resolution", "image-errors", "relational-database", "operators", "requirements", "software-testing"];
  for (const track of ["engineer", "technician"]) {
    for (const id of ids) {
      const page = await html(`${track}/theory/${id}/`);
      assert.match(page, /class="lesson-canvas"/);
      assert.match(page, /학습 자료와 참고 출처/);
      assert.match(page, /https:\/\/share\.gemini\.google\//);
      assert.match(page, /class="visual-(choices|controls)"|class="process-selector"/);
    }
  }
});

test("every generated internal navigation link resolves under the GitHub Pages base path", async () => {
  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.name.endsWith(".html")) {
        const page = await readFile(path, "utf8");
        for (const match of page.matchAll(/href="(\/Spatial-Engineer\/[^"?#]*)[^"]*"/g)) {
          const target = match[1].replace("/Spatial-Engineer/", "");
          await access(new URL(target.endsWith("/") || !target ? `${target}index.html` : target, output));
        }
      }
    }
  }
  await visit(fileURLToPath(output));
});
