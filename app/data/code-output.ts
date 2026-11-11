import type { Chapter } from "./course";
import type { PracticalQuestion } from "./practical";

export type CodeOutputTrace = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type CodeOutputQuestion = PracticalQuestion & {
  codeLanguage: "Python 3" | "Java";
  trace: CodeOutputTrace;
};

const pythonConditional = `values = [3, 8, 5, 10]
total = 0
for value in values:
    if value % 2 == 0:
        total += value
print(total)`;

const pythonNested = `for row in range(1, 4):
    subtotal = 0
    for column in range(1, row + 1):
        subtotal += row + column
    print(subtotal)`;

const pythonList = `counts = [2, 4, 6]
for index in range(len(counts)):
    counts[index] += index
print(counts[0], counts[1], counts[2])
print(sum(counts))`;

const pythonFunction = `def split(value):
    quotient = value // 3
    remainder = value % 3
    return quotient, remainder

for value in [8, -8]:
    q, r = split(value)
    print(q, r)`;

const javaIncrement = `public class IncrementTrace {
    public static void main(String[] args) {
        int value = 3;
        int first = value++;
        int second = ++value;
        System.out.println(first + " " + second + " " + value);
    }
}`;

const javaDivision = `public class DivisionTrace {
    public static void main(String[] args) {
        int a = 7;
        int b = 2;
        double first = a / b;
        double second = (double) a / b;
        System.out.println(first);
        System.out.println(second);
        System.out.println(-7 / 2);
    }
}`;

// Original exercises; output is recorded separately from the explanatory trace.
export const codeOutputQuestions: CodeOutputQuestion[] = [
  {
    id: "pr-output-python-condition", chapterId: "practical-code-output", category: "코드 출력 추적",
    title: "Python 3 · 조건을 만족하는 값만 누적", format: "코드형", codeLanguage: "Python 3",
    context: "Python 3 코드이다. 입력과 외부 라이브러리는 사용하지 않는다.",
    prompt: "다음 코드의 표준 출력을 쓰고, 반복마다 total이 어떻게 바뀌는지 설명하시오.",
    code: pythonConditional,
    hint: "% 2의 결과가 0인 값만 누적됩니다. 조건이 거짓인 반복에서도 다음 값으로 진행합니다.",
    modelAnswer: "18",
    explanation: ["3과 5는 홀수이므로 total에 더하지 않습니다.", "8을 더해 8, 10을 더해 18이 됩니다.", "print는 반복문 밖에 있으므로 최종값 18을 한 번만 출력합니다."],
    trace: { caption: "반복별 조건과 누적값", headers: ["value", "짝수 조건", "처리 전 total", "처리 후 total"], rows: [["3", "거짓", "0", "0"], ["8", "참", "0", "8"], ["5", "거짓", "8", "8"], ["10", "참", "8", "18"]] },
    criteria: ["출력 18을 썼다.", "조건을 만족하는 8과 10만 누적하며 print가 한 번 실행됨을 설명했다."],
    mistakes: "모든 값을 더하거나, 반복 안에서 출력한다고 보고 중간값까지 출력하는 답안",
    referenceIds: ["pythonControl", "pythonNumbers"],
  },
  {
    id: "pr-output-python-nested", chapterId: "practical-code-output", category: "코드 출력 추적",
    title: "Python 3 · 중첩 반복과 초기화 위치", format: "코드형", codeLanguage: "Python 3",
    context: "Python 3 코드이다. range의 끝값은 반복에 포함되지 않는다.",
    prompt: "다음 코드가 출력하는 세 줄을 순서대로 쓰고, subtotal의 초기화 위치가 결과에 미치는 영향을 설명하시오.",
    code: pythonNested,
    hint: "row가 바뀔 때마다 subtotal은 0이 됩니다. print는 안쪽 반복이 끝난 뒤 실행됩니다.",
    modelAnswer: "2\n7\n15",
    explanation: ["row=1이면 column=1만 실행하여 1+1=2를 출력합니다.", "row=2에서는 subtotal을 다시 0으로 만들고 3과 4를 더해 7을 출력합니다.", "row=3에서는 4+5+6=15를 출력합니다. 세 행의 subtotal을 계속 누적하지 않습니다."],
    trace: { caption: "안쪽 반복이 끝났을 때의 상태", headers: ["row", "column의 값", "이번 행의 계산", "출력"], rows: [["1", "1", "0 + 2", "2"], ["2", "1, 2", "0 + 3 + 4", "7"], ["3", "1, 2, 3", "0 + 4 + 5 + 6", "15"]] },
    criteria: ["2, 7, 15를 각각 다른 줄에 썼다.", "바깥 반복마다 초기화하고 안쪽 반복 후 출력하는 흐름을 설명했다."],
    mistakes: "subtotal을 바깥 반복 전체에서 계속 누적하거나 range의 끝값까지 포함하는 답안",
    referenceIds: ["pythonControl"],
  },
  {
    id: "pr-output-python-list", chapterId: "practical-code-output", category: "코드 출력 추적",
    title: "Python 3 · 리스트 인덱스와 값 변경", format: "코드형", codeLanguage: "Python 3",
    context: "Python 3 코드이다. 리스트의 길이는 반복 중 변하지 않는다.",
    prompt: "다음 코드의 두 출력 줄을 공백과 줄바꿈에 맞게 쓰고, 변경된 리스트를 설명하시오.",
    code: pythonList,
    hint: "인덱스는 0, 1, 2입니다. 인덱스 자체를 해당 위치의 값에 더합니다.",
    modelAnswer: "2 5 8\n15",
    explanation: ["counts[0]에는 0을 더해 2, counts[1]에는 1을 더해 5, counts[2]에는 2를 더해 8이 됩니다.", "첫 print는 세 인수를 기본 구분자인 공백으로 나누어 출력합니다.", "둘째 print는 변경된 값 2+5+8의 합 15를 새 줄에 출력합니다."],
    trace: { caption: "인덱스별 변경 후 리스트", headers: ["index", "변경식", "변경 후 counts"], rows: [["0", "2 + 0", "[2, 4, 6]"], ["1", "4 + 1", "[2, 5, 6]"], ["2", "6 + 2", "[2, 5, 8]"]] },
    criteria: ["첫 줄에 2 5 8, 둘째 줄에 15를 썼다.", "0부터 시작하는 인덱스와 실제 리스트 값의 변경을 설명했다."],
    mistakes: "인덱스를 1부터 세거나 변경 전 리스트의 합 12를 출력하는 답안",
    referenceIds: ["pythonControl", "pythonNumbers", "pythonTypes"],
  },
  {
    id: "pr-output-python-function", chapterId: "practical-code-output", category: "코드 출력 추적",
    title: "Python 3 · 함수 반환과 음수의 몫", format: "코드형", codeLanguage: "Python 3",
    context: "Python 3 코드이다. //는 음의 무한대 방향으로 내림한 몫을 계산한다.",
    prompt: "다음 코드의 두 출력 줄을 쓰고, value=-8일 때 몫과 나머지가 그 값이 되는 이유를 설명하시오.",
    code: pythonFunction,
    hint: "value = 3 × quotient + remainder 관계를 확인하세요. Python의 //를 Java 정수 /와 구분합니다.",
    modelAnswer: "2 2\n-3 1",
    explanation: ["split은 몫과 나머지 두 값을 반환하고 q와 r이 순서대로 받습니다.", "8은 3×2+2이므로 2 2를 출력합니다.", "-8/3은 약 -2.67이므로 Python의 내림 몫은 -3입니다. -8=3×(-3)+1이어서 나머지는 1입니다."],
    trace: { caption: "함수에 전달한 값과 반환값", headers: ["value", "value // 3", "value % 3", "출력"], rows: [["8", "2", "2", "2 2"], ["-8", "-3", "1", "-3 1"]] },
    criteria: ["2 2와 -3 1을 순서대로 다른 줄에 썼다.", "음수의 몫도 음의 무한대 방향으로 내림함을 설명했다."],
    mistakes: "Python의 음수 몫을 0 방향으로 버려 -2라고 쓰거나, 함수 반환 자체를 출력문으로 취급하는 답안",
    referenceIds: ["pythonControl", "pythonTypes"],
  },
  {
    id: "pr-output-java-increment", chapterId: "practical-code-output", category: "코드 출력 추적",
    title: "Java · 후위 증가와 전위 증가", format: "코드형", codeLanguage: "Java",
    context: "Java 코드이다. int 범위 안에서 계산하며 main을 한 번 실행한다.",
    prompt: "다음 코드의 출력 한 줄을 쓰고, first와 second에 대입되는 값 및 최종 value를 설명하시오.",
    code: javaIncrement,
    hint: "value++가 식에 전달하는 값과, 증가 후 변수에 저장된 값은 다릅니다.",
    modelAnswer: "3 5 5",
    explanation: ["value++는 증가 전 값 3을 first에 전달한 뒤 value를 4로 만듭니다.", "++value는 value를 5로 증가시킨 뒤 그 값 5를 second에 전달합니다.", "마지막 println은 first, second, value를 공백으로 연결해 한 줄로 출력합니다."],
    trace: { caption: "증가식의 결과와 변수 상태", headers: ["실행문", "대입되는 값", "실행 후 value"], rows: [["int value = 3", "초기값 3", "3"], ["int first = value++", "first = 3", "4"], ["int second = ++value", "second = 5", "5"]] },
    criteria: ["3 5 5를 공백으로 구분한 한 줄로 썼다.", "후위는 이전 값, 전위는 증가 후 값을 식의 결과로 사용함을 설명했다."],
    mistakes: "후위 증가가 프로그램 끝까지 미뤄진다고 해석하거나 first도 증가 후 값 4라고 쓰는 답안",
    referenceIds: ["javaExpressions"],
  },
  {
    id: "pr-output-java-division", chapterId: "practical-code-output", category: "코드 출력 추적",
    title: "Java · 정수 나눗셈과 형변환 시점", format: "코드형", codeLanguage: "Java",
    context: "Java 코드이다. a와 b는 int이며, 나눗셈 결과를 대입할 변수의 자료형과 피연산자의 자료형을 구분한다.",
    prompt: "다음 코드의 세 출력 줄을 쓰고, first와 second가 다른 이유 및 -7 / 2의 계산 규칙을 설명하시오.",
    code: javaDivision,
    hint: "double 변수에 대입한다고 이미 수행한 정수 나눗셈의 소수 부분이 복구되지는 않습니다.",
    modelAnswer: "3.0\n3.5\n-3",
    explanation: ["a/b는 int끼리 먼저 계산하여 3이 되고, 그 뒤 double로 저장되어 3.0을 출력합니다.", "(double)a/b는 나눗셈 전에 a를 double로 바꾸므로 3.5를 얻습니다.", "Java 정수 나눗셈은 몫을 0 방향으로 버리므로 -7/2는 -3입니다. Python의 -7//2=-4와 다릅니다."],
    trace: { caption: "연산 시 자료형과 저장값", headers: ["계산식", "나눗셈 시 자료형", "계산·저장 결과", "출력"], rows: [["a / b → first", "int / int", "3 → double 3.0", "3.0"], ["(double) a / b → second", "double / double", "3.5", "3.5"], ["-7 / 2", "int / int", "-3", "-3"]] },
    criteria: ["3.0, 3.5, -3을 각각 다른 줄에 썼다.", "피연산자 자료형과 형변환 시점을 구분하고 음수 정수 몫의 0 방향 절삭을 설명했다."],
    mistakes: "first를 3.5로 쓰거나 Java의 음수 정수 나눗셈에 Python //의 내림 규칙을 적용하는 답안",
    referenceIds: ["javaExpressions", "pythonTypes"],
  },
];

export type CodeOutputValidationCase = {
  questionId: string;
  language: "python" | "java";
  filename: string;
  entrypoint?: string;
  source: string;
  expectedStdout: string;
};

/** Complete programs, with the final newline included for execution checks. */
export const codeOutputValidationCases: CodeOutputValidationCase[] = [
  { questionId: "pr-output-python-condition", language: "python", filename: "condition.py", source: pythonConditional, expectedStdout: "18\n" },
  { questionId: "pr-output-python-nested", language: "python", filename: "nested.py", source: pythonNested, expectedStdout: "2\n7\n15\n" },
  { questionId: "pr-output-python-list", language: "python", filename: "list_update.py", source: pythonList, expectedStdout: "2 5 8\n15\n" },
  { questionId: "pr-output-python-function", language: "python", filename: "function_division.py", source: pythonFunction, expectedStdout: "2 2\n-3 1\n" },
  { questionId: "pr-output-java-increment", language: "java", filename: "IncrementTrace.java", entrypoint: "IncrementTrace", source: javaIncrement, expectedStdout: "3 5 5\n" },
  { questionId: "pr-output-java-division", language: "java", filename: "DivisionTrace.java", entrypoint: "DivisionTrace", source: javaDivision, expectedStdout: "3.0\n3.5\n-3\n" },
];

export const codeOutputLesson: Chapter = {
  id: "practical-code-output", number: "01", title: "실기 기초 · 언어별 코드 출력 추적",
  summary: "조건·반복·리스트·함수와 연산자를 상태표로 따라갑니다.",
  definition: "코드 출력 문제는 실행 순서대로 변수의 상태를 기록하고, 실제 출력문이 실행될 때의 값만 답안에 옮기는 연습입니다. 언어와 자료형을 먼저 확인해야 같은 기호를 올바르게 해석할 수 있습니다.",
  keywords: ["Python 3", "Java", "조건·중첩 반복", "리스트·함수", "전위·후위", "정수 나눗셈"],
  concepts: [
    { label: "출력과 중간 계산을 구분", text: "변수가 바뀔 때마다 화면에 출력되는 것은 아닙니다. print 또는 println이 실행되는 위치와 횟수를 찾고 공백·줄바꿈까지 기록합니다." },
    { label: "조건·반복과 초기화 위치", text: "조건이 참인 경로만 실행하고 반복별 값을 한 줄씩 기록합니다. 중첩 반복에서는 바깥 반복마다 초기화되는 변수와 계속 누적되는 변수를 구분합니다." },
    { label: "Python 리스트와 함수", text: "리스트 인덱스는 0부터 시작합니다. 함수의 return은 호출한 곳으로 값을 돌려주며, 반환값만으로 화면에 출력되지는 않습니다." },
    { label: "Python 3의 //와 %", text: "정수의 //는 음의 무한대 방향으로 내림한 몫입니다. -8//3=-3이고 -8%3=1이므로 -8=3×(-3)+1이 됩니다." },
    { label: "Java의 전위·후위 증가", text: "value++의 식 값은 증가 전 값이고 ++value의 식 값은 증가 후 값입니다. 두 경우 모두 해당 증가식을 처리하면서 변수는 1 증가합니다." },
    { label: "Java의 자료형과 나눗셈", text: "int끼리 나누면 0 방향으로 버린 정수 몫을 얻습니다. double 변수에 나중에 대입해도 잃은 소수 부분은 돌아오지 않으므로 나누기 전에 변환하는지 확인합니다." },
  ],
  steps: ["언어·자료형 확인", "초기값과 반복 범위 기록", "실행문마다 상태 갱신", "출력문 위치와 횟수 확인", "출력 공백·줄바꿈 대조"],
  examPoint: "Python 3과 Java의 음수 나눗셈 규칙을 혼용하지 마세요. 답안의 출력 부분에는 실제 출력되는 값만 쓰고 상태 추적과 이유는 별도로 설명합니다.",
  question: { prompt: "Python 3에서 -8 // 3의 결과는?", choices: ["-2", "-3", "2", "문법 오류"], answer: 1, explanation: "//는 음의 무한대 방향으로 내림합니다. 약 -2.67보다 작거나 같은 정수는 -3입니다." },
  practical: {
    answerTemplate: "언어·자료형 → 초기값 → 반복 번호·조건 → 변경 후 변수 → 출력 여부 순서로 표를 만든다.\n마지막에는 print/println이 만든 출력만 공백과 줄바꿈에 맞게 적는다.\n언어 차이: Python 정수 //는 내림, Java 정수 /는 0 방향 절삭이다.",
    sourceIds: ["pythonControl", "pythonNumbers", "pythonTypes", "javaExpressions"],
  },
};
