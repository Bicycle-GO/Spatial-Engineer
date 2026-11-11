"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./java-beginner-guides.module.css";

function Step({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <section className={styles.step}><div className={styles.stepHeading}><span>{number}</span><h4>{title}</h4></div>{children}</section>;
}

function Code({ label, children }: { label: string; children: string }) {
  return <figure className={styles.codeBlock}><figcaption>{label}</figcaption><pre><code>{children}</code></pre></figure>;
}

function QuickCheck({ question, options, answer, explanation }: { question: string; options: string[]; answer: number; explanation: string }) {
  const [choice, setChoice] = useState<number | null>(null);
  const id = useId();
  return <section className={styles.quickCheck} aria-labelledby={id}><h4 id={id}>직접 확인하기</h4><p>{question}</p><div className={styles.checkOptions}>{options.map((option, index) => <button key={option} type="button" aria-pressed={choice === index} onClick={() => setChoice(index)}>{option}</button>)}</div>{choice !== null && <p className={styles.checkResult} role="status"><strong>{choice === answer ? "맞게 이해했어요." : `이 문제의 답은 ‘${options[answer]}’입니다.`}</strong>{explanation}</p>}</section>;
}

const studentCode = `package school;

public class Student {
    public String name = "민지";
    int grade = 2;
    protected String goal = "지도 만들기";
    private int score = 90;

    public void introduce() {
        System.out.println(name);
    }
}`;

const accessMembers = [
  { keyword: "public", field: "name", meaning: "접근 가능한 곳에 공개하는 이름" },
  { keyword: "생략 → package-private", field: "grade", meaning: "같은 패키지에서 쓰는 학년" },
  { keyword: "protected", field: "goal", meaning: "같은 패키지와 상속 관계에 열어 둔 목표" },
  { keyword: "private", field: "score", meaning: "Student 클래스 내부에서 다루는 점수" },
];

const accessSituations = [
  {
    label: "자기 클래스", location: "school.Student 안", allowed: [true, true, true, true],
    explanation: "네 필드를 직접 선언한 Student 클래스의 코드입니다. 자기 클래스 내부에서는 private인 score도 사용할 수 있어요.",
    code: `// Student 클래스 안의 메서드
public void checkMine() {
    System.out.println(name);
    System.out.println(grade);
    System.out.println(goal);
    System.out.println(score);
}`,
  },
  {
    label: "같은 패키지의 다른 클래스", location: "school.Teacher 안", allowed: [true, true, true, false],
    explanation: "Teacher는 Student와 별개의 클래스이지만 두 파일의 package 선언은 school로 같습니다. 같은 패키지용 grade와 protected인 goal을 사용할 수 있어요. private인 score는 사용할 수 없습니다.",
    code: `package school;

public class Teacher {
    void check(Student student) {
        System.out.println(student.name);
        System.out.println(student.grade);
        System.out.println(student.goal);
        // student.score 접근은 불가
    }
}`,
  },
  {
    label: "다른 패키지의 자식 클래스", location: "school.club.Leader 안", allowed: [true, false, true, false],
    explanation: "Leader는 다른 패키지에 있지만 Student를 상속합니다. 이 예에서는 this.goal처럼 자신에게 상속된 protected 멤버를 사용할 수 있어요. 같은 패키지 전용 grade와 부모의 private인 score는 직접 사용할 수 없습니다.",
    code: `package school.club;
import school.Student;

public class Leader extends Student {
    void check() {
        System.out.println(this.name);
        System.out.println(this.goal);
        // this.grade 직접 접근은 불가
        // this.score 직접 접근은 불가
    }
}`,
  },
  {
    label: "다른 패키지의 무관한 클래스", location: "outside.Visitor 안", allowed: [true, false, false, false],
    explanation: "Visitor는 다른 패키지에 있고 Student를 상속하지도 않습니다. 이 네 필드 중 공개된 public name만 사용할 수 있어요.",
    code: `package outside;
import school.Student;

public class Visitor {
    void check(Student student) {
        System.out.println(student.name);
        // student.grade 접근은 불가
        // student.goal 접근은 불가
        // student.score 접근은 불가
    }
}`,
  },
];

export function JavaAccessGuide() {
  const [situation, setSituation] = useState(0);
  const active = accessSituations[situation];
  return <section className={styles.guide} aria-label="Java 접근제어 아주 쉬운 기초 설명">
    <header className={styles.intro}><span>2번을 이해하는 준비 학습</span><h3>‘패키지’부터 하나씩 알아봐요.</h3><p>접근제어는 <strong>“이 데이터나 기능을 어느 코드에서 사용할 수 있나요?”</strong>를 정하는 규칙이에요. 먼저 규칙에 등장하는 단어를 살펴봅시다.</p></header>

    <Step number="01" title="클래스는 설계도, 객체는 그 설계도로 만든 실물">
      <div className={styles.twoCards}><article><span className={styles.cardLabel}>클래스 · class</span><h5>학생을 표현하는 설계도</h5><p>“학생은 이름과 학년을 가지고, 자기소개를 할 수 있다”처럼 공통으로 담을 값과 행동을 정해요.</p><code>class Student {'{ … }'}</code></article><article><span className={styles.cardLabel}>객체 · object</span><h5>설계도로 만든 학생 하나</h5><p>Student라는 설계도로 민지와 준호라는 서로 다른 객체를 만들 수 있어요. 각 객체는 자기 값을 가질 수 있습니다.</p><code>Student minji = new Student();</code></article></div>
      <p className={styles.note}><code>new Student()</code>는 Student 객체를 새로 만드는 표현입니다. <code>minji</code>는 이 예에서 그 객체를 가리키는 변수 이름이에요.</p>
      <div className={styles.termRows}><div><strong>필드 = 객체가 가진 값</strong><p><code>name</code>은 이름, <code>grade</code>는 학년처럼 객체에 저장하는 정보예요.</p></div><div><strong>메서드 = 객체가 할 수 있는 행동</strong><p><code>introduce()</code>는 자기소개처럼 호출해서 실행하는 기능이에요. 이름 뒤의 <code>()</code>를 눈여겨보세요.</p></div></div>
    </Step>

    <Step number="02" title="패키지는 관련 클래스를 이름으로 묶는 단위">
      <p>학교 관련 코드를 정리한 상자에 <code>school</code>이라는 이름표를 붙였다고 생각해 보세요. Java에서는 파일 위의 <code>package school;</code> 선언으로 그 패키지에 속한다고 적습니다.</p>
      <div className={styles.packageMap}><div><strong>school 패키지</strong><span>Student 클래스</span><span>Teacher 클래스</span></div><div><strong>school.club 패키지</strong><span>Leader 클래스</span><small>school과는 다른 패키지</small></div></div>
      <p className={styles.note}>폴더는 정리를 돕는 비유예요. 접근 범위를 판단할 때는 <strong>package 선언의 이름이 같은지</strong> 확인합니다. <code>school</code>과 <code>school.club</code>는 이름이 이어져 보여도 서로 다른 패키지입니다.</p>
    </Step>

    <Step number="03" title="자식 클래스는 기본 설계도를 확장한 설계도">
      <p><code>Student</code>에 있는 기본 기능을 바탕으로 반장 기능을 더한 <code>Leader</code>를 만들 수 있어요. 이 관계를 <strong>상속</strong>이라고 부르고, 코드에서는 <code>extends</code>를 씁니다.</p>
      <div className={styles.inheritance}><span><strong>Student</strong><small>부모 클래스 · 기본 설계도</small></span><b aria-hidden="true">→</b><span><strong>Leader extends Student</strong><small>자식 클래스 · 확장한 설계도</small></span></div>
      <p>이름에 ‘자식’이 붙은 것은 코드의 상속 관계예요. 다른 클래스가 되더라도 부모의 모든 비공개 정보를 자유롭게 사용할 수 있다는 뜻은 아닙니다.</p>
    </Step>

    <Step number="04" title="접근제어는 값과 행동에 붙이는 사용 범위">
      <p>아래 Student 설계도에서 필드 앞의 단어를 보세요. <code>grade</code> 앞에는 접근제어자를 적지 않았습니다.</p>
      <Code label="Student.java · 네 필드의 접근 범위가 다른 예" >{studentCode}</Code>
      <details className={styles.details}><summary>예제 코드의 낯선 단어도 읽어볼까요?</summary><div><p><code>String</code>은 이름처럼 글자를 담는 종류이고, <code>int</code>는 학년처럼 정수를 담는 종류입니다. <code>name</code>이나 <code>grade</code>는 우리가 붙인 이름이에요.</p><p><code>void introduce()</code>는 실행하고 끝나는 자기소개 기능입니다. 이 예에서는 <code>System.out.println(name);</code>으로 이름을 콘솔이라는 글자 출력 창에 표시합니다.</p><p><code>{"//"}</code> 뒤의 글은 설명을 위한 주석입니다. 프로그램이 실행할 지시는 아니에요. 중괄호 <code>{'{ }'}</code>는 코드가 어디서 시작해 어디서 끝나는지 묶어 줍니다.</p></div></details>
      <div className={styles.accessDefinitions}><div><code>public</code><p>다른 코드에서도 사용할 수 있도록 공개합니다.</p></div><div><code>생략 · package-private</code><p>같은 패키지에서 사용할 수 있어요. 교재의 <strong>default 접근</strong>이 이것입니다.</p></div><div><code>protected</code><p>같은 패키지에서 사용하고, 다른 패키지의 자식 클래스에도 정해진 상속 접근을 허용합니다.</p></div><div><code>private</code><p>이 예에서는 값을 선언한 자기 클래스 안에서 직접 사용합니다.</p></div></div>
      <div className={styles.emphasis}><strong>default라고 코드에 쓰지 않아요.</strong><Code label="같은 패키지에서 쓰는 학년 필드">{"int grade = 2; // 접근제어자를 생략"}</Code><p>문제의 답안에는 ‘default’라고 적을 수 있지만, 뜻은 <strong>접근제어자 생략(package-private)</strong>입니다. <code>default int grade = 2;</code>처럼 접근제어자로 작성하면 안 됩니다.</p></div>
    </Step>

    <Step number="05" title="누가 접근하는지 바꾸어 보세요">
      <p>같은 필드라도 <strong>그 필드를 사용하려는 코드가 어디에 있는지</strong>에 따라 결과가 달라져요.</p>
      <div className={styles.situations} role="group" aria-label="접근하는 코드의 위치">{accessSituations.map((item, index) => <button key={item.label} type="button" aria-pressed={situation === index} onClick={() => setSituation(index)}><span>0{index + 1}</span>{item.label}</button>)}</div>
      <div className={styles.scenario} aria-live="polite"><h5>{active.location}</h5><p>{active.explanation}</p><ul className={styles.accessResults}>{accessMembers.map((member, index) => <li key={member.field}><div><code>{member.field}</code><span>{member.keyword}</span></div><strong data-allowed={active.allowed[index]}>{active.allowed[index] ? "사용 가능" : "직접 접근 불가"}</strong><small>{member.meaning}</small></li>)}</ul><Code label={`선택한 상황의 코드 · ${active.label}`}>{active.code}</Code></div>
      <details className={styles.details}><summary>네 상황을 표 하나로 다시 보기</summary><div className={styles.tableScroll} tabIndex={0} role="region" aria-label="일반 클래스 멤버의 접근 범위표"><table><caption>위 Student 예제에서 직접 접근할 수 있는 범위</caption><thead><tr><th scope="col">사용하는 코드</th><th scope="col">public</th><th scope="col">생략</th><th scope="col">protected</th><th scope="col">private</th></tr></thead><tbody>{accessSituations.map(item => <tr key={item.label}><th scope="row">{item.label}</th>{item.allowed.map((allowed, index) => <td key={index}>{allowed ? "가능" : "불가"}</td>)}</tr>)}</tbody></table></div></details>
      <details className={styles.details}><summary>protected가 헷갈릴 때 · ‘자식이면 전부 가능’일까요?</summary><div><p>다른 패키지의 자식 클래스에서도 <strong>아무 부모 객체의 protected 값에나 접근할 수 있는 것은 아닙니다.</strong> 아래의 <code>this</code>는 지금 코드를 실행하는 자식 객체 자신을 뜻해요.</p><Code label="school.club.Leader · 부모는 앞의 school.Student">{"package school.club;\nimport school.Student;\n\npublic class Leader extends Student {\n    void show(Student other) {\n        System.out.println(this.goal); // 가능\n        // System.out.println(other.goal);\n        // 위 줄은 불가: 임의의 Student 참조\n    }\n}"}</Code><p className={styles.note}>처음에는 ‘같은 패키지이거나, 다른 패키지의 상속 코드에서 정해진 방식으로 접근’이라고 이해하면 됩니다. 이 예제는 별개의 일반 클래스 멤버를 기준으로 설명합니다.</p></div></details>
    </Step>
    <QuickCheck question="Student와 Teacher는 모두 package school;입니다. Teacher가 Student의 grade를 읽으려면 grade 앞에 default를 써야 할까요?" options={["default를 써야 한다", "접근제어자를 생략하면 된다"]} answer={1} explanation="int grade = 2;처럼 선언하면 package-private 접근이 됩니다. 같은 school 패키지의 Teacher에서 접근할 수 있어요."/>
    <QuickCheck question="school.club.Leader가 Student를 상속하지 않는다면, 이름이 school로 시작하므로 Student의 package-private grade를 읽을 수 있을까요?" options={["가능하다", "불가능하다"]} answer={1} explanation="school과 school.club는 다른 패키지입니다. 이름이 비슷하다고 같은 패키지 접근 권한을 얻지 않아요."/>
    <details className={styles.details}><summary>공식 참고 자료</summary><ul className={styles.sources}><li><a href="https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html" target="_blank" rel="noreferrer">Oracle · 접근제어 범위 ↗</a></li><li><a href="https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.6.2" target="_blank" rel="noreferrer">Java 언어 명세 · protected 접근 조건 ↗</a></li><li><a href="https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.1" target="_blank" rel="noreferrer">Java 언어 명세 · 패키지의 의미 ↗</a></li></ul></details>
  </section>;
}

const operatorGroups = [
  { name: "저장과 비교", subtitle: "=와 ==는 다른 지시예요", items: [
    { symbol: "=", meaning: "오른쪽 값을 왼쪽 변수에 저장", code: "int apples = 3;\napples = 5; // apples의 값은 5", result: "변수는 값을 보관하는 이름표 붙은 칸이라고 생각하세요. =은 같다를 판정하는 기호가 아니라 저장하라는 지시입니다." },
    { symbol: "==", meaning: "두 값이 같은지 확인", code: "int apples = 5;\nboolean same = apples == 5; // true", result: "boolean은 true(참) 또는 false(거짓)를 담는 종류예요. 여기서는 apples와 5가 같으므로 true가 저장됩니다." },
  ] },
  { name: "산술 계산", subtitle: "숫자로 계산하는 기호", items: [
    { symbol: "+  −  *", meaning: "더하기 · 빼기 · 곱하기", code: "7 + 3  // 10\n7 - 3  // 4\n7 * 3  // 21", result: "Java 코드에서 곱하기는 × 대신 *를 씁니다. 이 예시의 +는 두 수를 더하는 이항 연산자예요." },
    { symbol: "/  %", meaning: "나누기 · 나머지", code: "7 / 3  // 정수끼리 계산하면 2\n7 % 3  // 나머지는 1", result: "정수 나눗셈은 소수 부분을 버립니다. 7개를 3개씩 묶으면 2묶음이 되고 1개가 남는다고 생각해 보세요." },
  ] },
  { name: "비교와 논리", subtitle: "조건이 맞는지 판단해요", items: [
    { symbol: ">  >=  <  <=  !=", meaning: "크다 · 이상 · 작다 · 이하 · 다르다", code: "5 > 3   // true\n5 <= 3  // false\n5 != 3  // true", result: "비교 결과는 true 또는 false입니다. !=는 두 값이 다르냐는 질문입니다." },
    { symbol: "&&  ||  !", meaning: "그리고 · 또는 · 반대로", code: "true && false  // false\ntrue || false  // true\n!true          // false", result: "&&는 두 조건이 모두 참일 때 참, ||는 하나 이상 참이면 참이에요. !는 참과 거짓을 뒤집습니다. ‘성인이고 표가 있음’과 ‘현금 또는 카드가 있음’을 떠올려 보세요." },
  ] },
  { name: "비트 연산", subtitle: "정수를 0과 1의 자리로 봐요", items: [
    { symbol: "&", meaning: "정수의 비트 AND", code: "6: 0110\n3: 0011\n&: 0010  → 2", result: "같은 자리의 두 비트가 모두 1인 자리만 1로 남깁니다. 따라서 정수 6 & 3의 결과는 2예요. Java에서 &는 boolean에도 쓸 수 있지만, 여기서는 정수 비트 연산을 배웁니다." },
    { symbol: ">>", meaning: "비트를 오른쪽으로 이동", code: "8:       1000\n8 >> 1:  0100  → 4\n9 >> 1:        → 4", result: "양의 정수에서 한 칸 오른쪽으로 옮기는 예입니다. 8은 4, 9도 4가 됩니다. 음수와 큰 이동 횟수의 규칙은 별도로 배우고, 우선 이 작은 양수 예시를 이해하세요." },
  ] },
  { name: "1씩 증감", subtitle: "++와 --는 앞뒤 위치도 봐요", items: [
    { symbol: "x++ / ++x", meaning: "1 증가 · 이전 값과 새 값 구분", code: "int x = 3;\nint y = x++; // y=3, 이후 x=4\n\n// 아래는 x=3에서 새로 시작한 예\nint a = 3;\nint b = ++a; // a=4, b=4", result: "후위 x++는 변경 전 값을 식의 값으로 사용해요. 전위 ++a는 먼저 증가한 새 값을 식의 값으로 사용합니다. 두 예제의 변수는 서로 독립적입니다." },
    { symbol: "x-- / --x", meaning: "1 감소 · 이전 값과 새 값 구분", code: "int x = 3;\nint y = x--; // y=3, 이후 x=2\n\nint a = 3;\nint b = --a; // a=2, b=2", result: "증가가 감소로 바뀌어도 앞뒤의 원리는 같아요. 식에 사용되는 값과 문장이 끝난 뒤의 변수 값을 따로 적으면 덜 헷갈립니다." },
  ] },
];

export function JavaOperatorsGuide() {
  const [group, setGroup] = useState(0);
  const [parentheses, setParentheses] = useState(false);
  const [calculation, setCalculation] = useState(0);
  const activeGroup = operatorGroups[group];
  const calculationLines = ["int result = 10 + 2 >> 1 & 3;", "int result = 12 >> 1 & 3;", "int result = 6 & 3;", "int result = 2;"];
  return <section className={styles.guide} aria-label="Java 연산자와 우선순위 아주 쉬운 설명">
    <header className={styles.intro}><span>5번을 이해하는 준비 학습</span><h3>기호는 컴퓨터에게 주는 짧은 지시예요.</h3><p>연산자는 값을 <strong>계산하거나, 비교하거나, 저장하는 방법</strong>을 나타내는 기호입니다. 뜻을 알고 나서 ‘어떤 것을 먼저 묶어 계산하는가’를 배우면 됩니다.</p></header>
    <Step number="01" title="짧은 문장 하나를 읽어볼까요?">
      <Code label="정수를 담을 total을 만들고 계산 결과 저장">{"int total = 2 + 3;"}</Code>
      <ol className={styles.readingSteps}><li><code>int total</code><span>정수를 담을 변수에 total이라는 이름을 붙여요.</span></li><li><code>2 + 3</code><span>두 수를 더하면 5가 됩니다.</span></li><li><code>=</code><span>그 결과 5를 total에 저장해요.</span></li><li><code>;</code><span>여기까지가 한 문장이라는 표시예요.</span></li></ol>
    </Step>
    <Step number="02" title="기호 종류를 골라 뜻과 예시를 보세요">
      <div className={styles.operatorTabs} role="group" aria-label="연산자 종류">{operatorGroups.map((item, index) => <button key={item.name} type="button" aria-pressed={group === index} onClick={() => setGroup(index)}>{item.name}</button>)}</div>
      <div className={styles.dictionary} aria-live="polite"><h5>{activeGroup.subtitle}</h5>{activeGroup.items.map(item => <article key={item.symbol}><div className={styles.symbolHeading}><code>{item.symbol}</code><strong>{item.meaning}</strong></div><Code label="기호를 읽는 작은 예시">{item.code}</Code><p>{item.result}</p></article>)}{group === 0 && <p className={styles.note}>여기의 <code>==</code> 예시는 정수 값을 비교합니다. 객체나 문자열의 내용 비교는 별도 규칙을 배우며 구분해야 해요.</p>}</div>
    </Step>
    <Step number="03" title="우선순위는 Java가 미리 정해 둔 묶음 규칙">
      <p>수학에서 <code>2 + 3 × 4</code>를 계산할 때 곱셈을 먼저 하는 것과 비슷해요. Java도 언어 문법에 <strong>연산자를 묶는 우선순위</strong>를 정해 두었습니다. 사용자가 실행 속도나 기호의 생김새를 보고 정하는 순서가 아닙니다.</p>
      <div className={styles.mathChoices} role="group" aria-label="괄호 유무 비교"><button type="button" aria-pressed={!parentheses} onClick={() => setParentheses(false)}>괄호 없이</button><button type="button" aria-pressed={parentheses} onClick={() => setParentheses(true)}>괄호로 묶기</button></div>
      <div className={styles.mathDemo} aria-live="polite"><div>{parentheses ? <><mark>(2 + 3)</mark> * 4</> : <>2 + <mark>3 * 4</mark></>}<strong>= {parentheses ? 20 : 14}</strong></div><ol>{parentheses ? <><li>괄호 안의 2 + 3을 계산하면 5</li><li>5 * 4를 계산하면 20</li></> : <><li>곱셈 3 * 4를 먼저 묶어 계산하면 12</li><li>2 + 12를 계산하면 14</li></>}</ol></div>
      <p className={styles.note}>괄호는 기본 순위가 낮은 계산도 먼저 묶을 수 있게 해 줍니다. 식이 복잡할 때는 괄호로 의도를 분명히 표시하세요.</p>
    </Step>
    <Step number="04" title="5번에 나온 다섯 기호의 상대적인 순서">
      <p>이 문제의 <code>+</code>는 두 값을 더하는 덧셈입니다. Java 전체 연산자 중 <strong>보기의 다섯 개만 골라</strong> 높은 순서대로 적으면 다음과 같아요.</p>
      <ol className={styles.precedence}><li><code>+</code><span>덧셈</span></li><li><code>&gt;&gt;</code><span>시프트</span></li><li><code>&amp;</code><span>비트 AND</span></li><li><code>||</code><span>논리 OR</span></li><li><code>=</code><span>대입</span></li></ol>
      <p className={styles.answerLine}>답안: <code>+ → &gt;&gt; → &amp; → || → =</code></p>
      <details className={styles.details}><summary>왜 대입 =이 맨 뒤인가요?</summary><div><p><code>int total = 2 + 3;</code>에서는 오른쪽의 계산 결과를 구한 뒤 왼쪽 변수에 저장해야 해요. 이 보기에서 대입 =은 덧셈·시프트·비트·논리 OR보다 우선순위가 낮습니다.</p><p>이것은 우선순위 목록을 이해하는 설명입니다. 모든 기호를 실제로 한 번씩 섞어야 하는 것은 아니고, 피연산자의 자료형에도 맞게 식을 써야 합니다.</p></div></details>
    </Step>
    <Step number="05" title="실제 식을 한 단계씩 계산해 보세요">
      <p>다음 식에서는 덧셈 → 시프트 → 비트 AND의 순서를 적용한 다음, 결과를 변수에 저장합니다.</p>
      <div className={styles.calculation} aria-live="polite"><Code label={`계산 과정 ${calculation + 1} / 4`}>{calculationLines[calculation]}</Code><p>{["10 + 2를 먼저 묶으면 12입니다.", "양의 정수 12를 오른쪽으로 1칸 이동하면 6입니다.", "6(0110) & 3(0011)은 2(0010)입니다.", "계산 결과인 2를 result에 저장했습니다."][calculation]}</p></div>
      <div className={styles.controls}><button type="button" disabled={calculation === 0} onClick={() => setCalculation(Math.max(0, calculation - 1))}>이전 단계</button><span>{calculation + 1} / 4</span><button type="button" disabled={calculation === 3} onClick={() => setCalculation(Math.min(3, calculation + 1))}>다음 단계</button><button type="button" onClick={() => setCalculation(0)}>처음부터</button></div>
      <Code label="논리 OR와 저장을 함께 읽는 별도 예">{"boolean pass = 3 > 1 || false;\n// 3 > 1은 true\n// true || false의 결과는 true\n// pass에 true를 저장"}</Code>
    </Step>
    <QuickCheck question="괄호 없는 Java 식 2 + 3 * 4의 계산 결과는 무엇일까요?" options={["20", "14", "24"]} answer={1} explanation="곱셈 3*4가 덧셈보다 먼저 묶입니다. 2+12가 되어 결과는 14예요."/>
    <QuickCheck question="정수의 비트 AND인 6 & 3의 결과는 무엇일까요?" options={["2", "6", "3"]} answer={0} explanation="0110과 0011에서 같은 자리가 모두 1인 비트만 남기면 0010입니다. 십진수로 2예요."/>
    <details className={styles.details}><summary>한 걸음 더 · 우선순위와 실제 평가 순서는 같을까요?</summary><div><p><strong>우선순위는 식을 어떻게 묶는지</strong>, <strong>평가 순서는 실행 중 어떤 값을 먼저 읽는지</strong>에 관한 규칙입니다. Java는 이항 연산의 왼쪽 피연산자를 먼저 평가하므로 ‘곱셈 기호가 보이면 무조건 제일 먼저 실행’이라고 단정하면 안 돼요.</p><Code label="Java의 평가 순서까지 고려해야 하는 예">{"int a = 1;\nint result = a++ + a * 10;\n// 왼쪽 a++의 식 값은 1, a는 2가 됨\n// 오른쪽 a * 10은 2 * 10 = 20\n// result는 1 + 20 = 21, 최종 a는 2"}</Code><p><code>+</code>의 오른쪽을 <code>a * 10</code>으로 묶는 것과, 왼쪽 <code>a++</code>를 먼저 평가하는 것을 함께 적용한 결과예요. 이런 식은 읽기 어려우므로 학습 초기에는 문장을 나눠 쓰는 편이 좋습니다.</p><Code label="조건에 따라 오른쪽을 아예 평가하지 않는 예">{"int count = 0;\nboolean check = false && (count++ > 0);\n// 왼쪽이 false이므로 오른쪽을 평가하지 않음\n// check=false, count=0"}</Code><p><code>&amp;&amp;</code>는 왼쪽이 false이면 오른쪽을 건너뜁니다. <code>||</code>는 왼쪽이 true이면 오른쪽을 건너뜁니다. 이런 규칙을 단락 평가라고 해요.</p></div></details>
    <details className={styles.details}><summary>공식 참고 자료</summary><ul className={styles.sources}><li><a href="https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html" target="_blank" rel="noreferrer">Oracle · 연산자 우선순위 표 ↗</a></li><li><a href="https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.7" target="_blank" rel="noreferrer">Java 언어 명세 · 평가 순서와 괄호·우선순위 ↗</a></li></ul></details>
  </section>;
}
