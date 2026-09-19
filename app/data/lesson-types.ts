export type VisualKind = "projections" | "coordinates" | "modeling" | "topology" | "overlay" | "interpolation" | "resolution" | "image-errors" | "relation" | "operators" | "requirements" | "testing";

export type LessonGuide = {
  visual: VisualKind;
  minutes: number;
  takeaway: string;
  comparison: { headers: string[]; rows: string[][] };
  example: { title: string; text: string };
  pitfalls: string[];
  advanced: { title: string; text: string }[];
  sourceIds: string[];
};

export type LearningQuestion = {
  id: string;
  category: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  kind: "shared" | "practice";
  chapterId?: string;
  sourceId?: string;
  sourceNote?: string;
  code?: string;
  diagram?: "clip-question";
  solutionSteps?: string[];
  choiceNotes?: string[];
};
