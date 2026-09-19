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
  for (const [track, count] of [["engineer", 14], ["technician", 7]]) {
    const list = await html(`${track}/theory/`);
    const chapters = await readdir(new URL(`${track}/theory/`, output), { withFileTypes: true });
    const dirs = [];
    for (const entry of chapters.filter(entry => entry.isDirectory())) {
      try { await access(new URL(`${track}/theory/${entry.name}/index.html`, output)); dirs.push(entry); }
      catch { /* Next.js also emits RSC payload directories without a page. */ }
    }
    assert.equal(dirs.length, count);
    for (const directory of dirs) {
      assert.ok(list.includes(`href="/Spatial-Engineer/${track}/theory/${directory.name}/"`));
      const page = await html(`${track}/theory/${directory.name}/`);
      assert.match(page, /한 문장으로 이해하기/);
      assert.match(page, /핵심 개념/);
      assert.match(page, /학습 완료/);
      assert.doesNotMatch(page, /<input[^>]*type="radio"/);
    }
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
