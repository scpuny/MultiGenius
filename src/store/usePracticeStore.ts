import { create } from "zustand";
import type { Question, SessionResult, Module, PracticeMode, Difficulty } from "../types/models";

interface PracticeState {
  questions: Question[];
  index: number;
  correctCount: number;
  startTs: number;
  wrongIds: string[];
  // 会话配置
  module: Module;
  mode: PracticeMode;
  difficulty: Difficulty;
  // actions
  start: (p: { questions: Question[]; module: Module; mode: PracticeMode; difficulty: Difficulty }) => void;
  answer: (q: Question, userAnswer: number, isCorrect: boolean) => void;
  next: () => boolean; // 返回是否还有下一题
  buildResult: (childId: string) => SessionResult;
  reset: () => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  questions: [],
  index: 0,
  correctCount: 0,
  startTs: 0,
  wrongIds: [],
  module: "advanced",
  mode: "free",
  difficulty: "L1",

  start: ({ questions, module, mode, difficulty }) =>
    set({ questions, index: 0, correctCount: 0, wrongIds: [], module, mode, difficulty, startTs: Date.now() }),

  answer: (q, _userAnswer, isCorrect) =>
    set((s) => ({
      correctCount: s.correctCount + (isCorrect ? 1 : 0),
      wrongIds: isCorrect ? s.wrongIds : [...s.wrongIds, q.id],
    })),

  next: () => {
    const { index, questions } = get();
    if (index + 1 >= questions.length) return false;
    set({ index: index + 1 });
    return true;
  },

  buildResult: (childId) => {
    const s = get();
    return {
      childId,
      module: s.module,
      mode: s.mode,
      difficulty: s.difficulty,
      questionCount: s.questions.length,
      correctCount: s.correctCount,
      durationSec: Math.round((Date.now() - s.startTs) / 1000),
      wrongQuestionIds: s.wrongIds,
    };
  },

  reset: () => set({ questions: [], index: 0, correctCount: 0, wrongIds: [], startTs: 0 }),
}));
