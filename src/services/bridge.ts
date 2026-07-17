// 桥接层：所有前端↔后端通信统一经此处封装。
// 后端为 Tauri Rust 命令；每个函数对应 design doc 第 5 节的命令。
// 多账号隔离：命令自动注入当前 childId（由 useChildStore 提供）。
import { invoke } from "@tauri-apps/api/core";
import { getCurrentChildId } from "../store/useChildStore";
import type {
  Child, Progress, Question, SessionResult, SessionSummary,
  WrongQuestion, Report, ReportPeriod, Settings, CheckinInfo,
  Module, PracticeMode, Difficulty, QuestionType,
} from "../types/models";

function cid(): string {
  const id = getCurrentChildId();
  if (!id) throw new Error("未选择孩子账号");
  return id;
}

/* ============ 5.1 账户管理 ============ */
export const getChildren = () => invoke<Child[]>("get_children");
export const addChild = (p: { name: string; avatar: string; grade: number }) =>
  invoke<Child>("add_child", { name: p.name, avatar: p.avatar, grade: p.grade });
export const updateChild = (p: { id: string; name?: string; avatar?: string; grade?: number }) =>
  invoke<Child>("update_child", p);
export const deleteChild = (id: string) => invoke<void>("delete_child", { id });
export const switchChild = (id: string) => invoke<void>("switch_child", { id });

/* ============ 5.2 进度 ============ */
export const getProgress = (childId = cid()) => invoke<Progress>("get_progress", { childId });
export const updateProgress = (p: {
  childId?: string; deltaQuestions: number; deltaMinutes: number; deltaCorrect: number;
}) => invoke<Progress>("update_progress", { childId: p.childId ?? cid(), ...p });

/* ============ 5.3 练习 / 答题 ============ */
export const generateQuestions = (p: {
  module: Module; difficulty: Difficulty; mode: PracticeMode; count: number; formulaRange?: number[];
}) => invoke<Question[]>("generate_questions", { ...p, childId: cid() });
export const submitSession = (r: SessionResult) => invoke<SessionSummary>("submit_session", { result: r });
export const getSessionResult = (sessionId: string) =>
  invoke<SessionSummary>("get_session_result", { sessionId });

/* ============ 5.4 错题攻克 ============ */
export const listWrongQuestions = (childId = cid(), filter?: string) =>
  invoke<WrongQuestion[]>("list_wrong_questions", { childId, filter });
export const reviewWrongQuestion = (p: { wrongId: string; userAnswer: number }) =>
  invoke<{ correct: boolean; tip: string; status: string }>("review_wrong_question", {
    childId: cid(), wrongId: p.wrongId, userAnswer: p.userAnswer,
  });
export const clearWrongQuestion = (wrongId: string) =>
  invoke<void>("clear_wrong_question", { childId: cid(), wrongId });
export const batchReview = (childId = cid()) => invoke<WrongQuestion[]>("batch_review", { childId });

/* ============ 5.5 报告 / 导出 ============ */
export const getReport = (period: ReportPeriod, date: string, childId = cid()) =>
  invoke<Report>("get_report", { childId, period, date });
export const exportReport = (period: ReportPeriod, format: "png" | "pdf", childId = cid()) =>
  invoke<{ path: string }>("export_report", { childId, period, format });

/* ============ 5.6 设置 ============ */
export const getSettings = (childId = cid()) => invoke<Settings>("get_settings", { childId });
export const updateSettings = (s: Settings) => invoke<Settings>("update_settings", { settings: s });

/* ============ 5.7 应用题专项（V3） ============ */
export const generateApplication = (p: {
  dimensions: QuestionType[]; difficulty: Difficulty; count: number;
}) => invoke<Question[]>("generate_application", { ...p, childId: cid() });

/* ============ 5.8 自定义出题（V3 家长） ============ */
export const generateCustomQuiz = (p: {
  formulaRange: number[]; count: number; difficulty: Difficulty; types: QuestionType[];
}) => invoke<Question[]>("generate_custom_quiz", { ...p, childId: cid() });

/* ============ 5.9 打卡 ============ */
export const getCheckin = (month: string, childId = cid()) =>
  invoke<CheckinInfo>("get_checkin", { childId, month });
export const doCheckin = (childId = cid()) => invoke<void>("do_checkin", { childId });
