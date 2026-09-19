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
  for (const [track, count] of [["engineer", 26], ["technician", 19]]) {
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
      assert.ok(page.includes(`practice/?chapter=${directory.name}`));
      assert.doesNotMatch(page, /<input[^>]*type="radio"/);
    }
    assert.match(list, /그림으로 배우는 핵심 12/);
    assert.ok(list.includes(`href="/Spatial-Engineer/${track}/theory/overlay-analysis/"`));
  }
});

test("practice pages distinguish original practice items from actual past papers", async () => {
  for (const track of ["engineer", "technician"]) {
    const page = await html(`${track}/practice/`);
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
