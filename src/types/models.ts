// 共享数据模型：前端 TypeScript 与后端 Rust 结构体字段保持一致（camelCase 经 serde rename）。
// 多账号隔离：所有读写命令携带 childId。

export const MAX_CHILDREN = 4;
export const TOTAL_FORMULAS = 45; // 九九乘法总口诀数

/* ============ 多账号 ============ */
export interface Child {
  id: string; // child_id (UUID)
  name: string;
  avatar: string; // emoji 或色值
  grade: 1 | 2 | 3 | 4;
  points: number;
  accuracy: number; // 正确率 %
  createdAt: number;
}

/* ============ 进度 ============ */
export interface Progress {
  childId: string;
  masteredFormulas: number;
  totalFormulas: number;
  streakDays: number;
  todayQuestions: number;
  todayMinutes: number;
  todayAccuracy: number;
}

/* ============ 题型 / 难度 ============ */
export type QuestionType =
  | "basic" // 基础口算 7×8=?
  | "fill_blank" // 口诀填空 六八__？
  | "judge" // 判断对错
  | "reverse" // 逆向求数 ?×6=48
  | "compare" // 比大小 7×6 ○ 5×9
  | "word_problem"; // 图文应用题

export type Difficulty = "L1" | "L2" | "L3" | "L4" | "L5";
export type Module = "enlightenment" | "advanced" | "wrong_review" | "application";
export type PracticeMode = "free" | "timed" | "quantitative" | "daily";

export interface WordProblem {
  text: string;
  image?: string;
  hint?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  expression: string; // "7×8"
  answer: number; // 56
  options?: number[]; // 选择题选项
  wordProblem?: WordProblem;
  difficulty: Difficulty;
  module: Module;
}

/* ============ 答题会话 ============ */
export interface SessionResult {
  childId: string;
  module: Module;
  mode: PracticeMode;
  difficulty: Difficulty;
  questionCount: number;
  correctCount: number;
  durationSec: number;
  wrongQuestionIds: string[];
}

export interface SessionSummary {
  correctRate: number; // %
  stars: 1 | 2 | 3;
  gainedPoints: number;
  newWrong: { expression: string; userAnswer: number; correctAnswer: number }[];
}

/* ============ 错题 ============ */
export interface WrongQuestion {
  id: string;
  childId: string;
  question: Question;
  userAnswer: number;
  reviewCount: number;
  status: "pending" | "mastered";
  tip: string; // 生活化记忆提示
}

/* ============ 报告 ============ */
export type ReportPeriod = "day" | "week" | "month";
export interface WeakPoint {
  name: string;
  percent: number;
}
export interface Report {
  childId: string;
  period: ReportPeriod;
  date: string; // 2025-01-08
  durationMin: number;
  questionCount: number;
  accuracy: number;
  newWrong: number;
  score: number; // 综合表现分
  weakPoints: WeakPoint[];
  suggestions: string[];
}

/* ============ 设置（护眼 + 时长） ============ */
export interface RestReminder {
  enabled: boolean;
  intervalMin: number;
  restMin: number;
}
export interface DisabledPeriod {
  name: string;
  start: string; // "21:00"
  end: string; // "07:00"
  days?: string; // "周一至周五" / 留空=每天
}
export interface EyeCare {
  blueLightFilter: boolean;
  nightMode: boolean;
  colorTemp: "warm" | "natural" | "cool";
  brightness: number; // 0-100
}
export interface Settings {
  childId: string;
  dailyLimitMin: number;
  moduleLimits: Record<string, number>; // 0 = 不限
  restReminder: RestReminder;
  disabledPeriods: DisabledPeriod[];
  eyeCare: EyeCare;
}

/* ============ 打卡 ============ */
export interface CheckinInfo {
  streak: number;
  monthCount: number;
  total: number;
  doneDays: number[]; // 当月已打卡日(1-31)
}
