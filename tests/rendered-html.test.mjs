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
  for (const [track, count] of [["engineer", 34], ["technician", 19]]) {
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
    assert.match(list, /그림으로 배우는 핵심 12/);
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
  for (const id of ["crs","quality","overlay","raster","sql","code","cartography","validation"]) {
    const lesson = await html(`engineer/theory/practical-${id}/`);
    assert.match(lesson, /이렇게 답안으로 연결해요/);
    assert.ok(lesson.includes(`practice/practical/?chapter=practical-${id}`));
    assert.match(lesson, /학습 자료와 참고 출처/);
  }
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
  assert.match(questions[2].modelAnswer, /학습용 모범답안 예시/);
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
