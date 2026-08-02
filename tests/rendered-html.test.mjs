import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const descriptionMeta =
  /<meta(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']*공간정보융합산업기사[^"']*["'])[^>]*>/i;

function bodyText(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  return body
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Korean Spatial Engineer mock exam", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*\blang=["']ko["'][^>]*>/i);
  assert.match(
    html,
    /<title>[^<]*공간정보융합산업기사[^<]*<\/title>/i,
  );
  assert.match(html, descriptionMeta);
  const productCopy = bodyText(html);
  assert.match(productCopy, /제\s*1\s*회/);
  assert.match(productCopy, /실전\s*모의고사/);
  assert.match(productCopy, /41\s*(?:개(?:의)?\s*)?(?:문항|문제)/);
  assert.doesNotMatch(html, /codex-preview/i);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/i);
});

test("connects the complete 41-question mock exam data set", async () => {
  const [page, examData] = await Promise.all([
    readFile(new URL("../app/spatial-engineer-app.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/mock-exam-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(
    page,
    /import\s*\{[^}]*\bmockExamQuestions\b[^}]*\}\s*from\s*["'][^"']*mock-exam-data["']/s,
  );
  assert.match(
    examData,
    /export\s+const\s+mockExamQuestions\b[\s\S]*?=/,
  );

  const questionNumbers = [...examData.matchAll(/\bnumber:\s*(\d+)\b/g)].map(
    ([, number]) => Number(number),
  );
  assert.equal(questionNumbers.length, 41);
  assert.deepEqual(
    questionNumbers,
    Array.from({ length: 41 }, (_, index) => index + 1),
  );

  assert.match(examData, /\b(?:code|passage)\s*:\s*(?:`|["'])/);
  assert.match(examData, /\bcodeLanguage\s*:\s*["'][^"']+["']/);
});

test("provides separate menu pages and skip-friendly large-text CBT", async () => {
  const [app, css, ...routes] = await Promise.all([
    readFile(new URL("../app/spatial-engineer-app.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    ...["roadmap", "curriculum", "cbt", "strategy"].map((route) =>
      readFile(new URL(`../app/${route}/page.tsx`, import.meta.url), "utf8"),
    ),
  ]);

  for (const route of ["roadmap", "curriculum", "cbt", "strategy"]) {
    assert.match(app, new RegExp(`href=["']/${route}["']`));
  }
  for (const routePage of routes) {
    assert.match(routePage, /spatial-engineer-app/);
    assert.match(routePage, /export\s+const\s+metadata/);
  }

  assert.match(app, /미응답으로 건너뛰어도 괜찮아요/);
  assert.match(app, /문제 글자 크기/);
  assert.match(app, /더 크게/);
  assert.match(app, /className="mobile-nav"/);
  assert.match(css, /--exam-choice-size:\s*17px/);
  assert.match(css, /\.exam-question-card\.text-xlarge/);
});
