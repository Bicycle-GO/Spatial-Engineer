import { technicianPastQuestions } from "./technician-past";
import { technicianSecondQuestions } from "./technician-past-second";

export const technicianPastPapers = [
  { id: "1", label: "1차 기출", questions: technicianPastQuestions },
  { id: "2", label: "2차 기출", questions: technicianSecondQuestions },
];

export const technicianPastQuestionCount = technicianPastPapers.reduce((count, paper) => count + paper.questions.length, 0);

export function getTechnicianPastPaper(id: string | null | undefined) {
  return technicianPastPapers.find(paper => paper.id === id) ?? technicianPastPapers[0];
}
