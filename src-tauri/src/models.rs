// 数据模型：前端 TypeScript ↔ Rust 共享，serde camelCase 保持 JS 端一致。
// 前端见 src/types/models.ts，两处字段保持同步。

use serde::{Deserialize, Serialize};

/// 孩子账号（多账号，最多 4）
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Child {
    pub id: String,
    pub name: String,
    pub avatar: String,
    pub grade: i32,          // 1-4
    pub points: i32,
    pub accuracy: f64,       // 0-100
    pub created_at: i64,
}

/// 学习进度
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Progress {
    pub child_id: String,
    pub mastered_formulas: i32,
    pub total_formulas: i32,    // 45
    pub streak_days: i32,
    pub today_questions: i32,
    pub today_minutes: i32,
    pub today_accuracy: f64,
}

/// 题目类型
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Question {
    pub id: String,
    #[serde(rename = "type")]
    pub q_type: String,      // basic / fill_blank / judge / reverse / compare / word_problem
    pub expression: String,
    pub answer: i32,
    pub options: Option<Vec<i32>>,
    pub word_problem: Option<WordProblem>,
    pub difficulty: String,  // L1-L5
    pub module: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WordProblem {
    pub text: String,
    pub image: Option<String>,
    pub hint: Option<String>,
}

/// 会话结果（前端→后端）
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionResult {
    pub child_id: String,
    pub module: String,
    pub mode: String,
    pub difficulty: String,
    pub question_count: i32,
    pub correct_count: i32,
    pub duration_sec: i32,
    pub wrong_question_ids: Vec<String>,
}

/// 会话总结（后端→前端）
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionSummary {
    pub correct_rate: f64,
    pub stars: i32,
    pub gained_points: i32,
    pub new_wrong: Vec<WrongSummary>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WrongSummary {
    pub expression: String,
    pub user_answer: i32,
    pub correct_answer: i32,
}

/// 错题
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WrongQuestion {
    pub id: String,
    pub child_id: String,
    pub question: Question,
    pub user_answer: i32,
    pub review_count: i32,
    pub status: String,          // pending / mastered
    pub tip: String,
}

/// 报告
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Report {
    pub child_id: String,
    pub period: String,
    pub date: String,
    pub duration_min: i32,
    pub question_count: i32,
    pub accuracy: f64,
    pub new_wrong: i32,
    pub score: i32,
    pub weak_points: Vec<WeakPoint>,
    pub suggestions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeakPoint {
    pub name: String,
    pub percent: f64,
}

/// 设置（护眼 + 时长）
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub child_id: String,
    pub daily_limit_min: i32,
    pub module_limits: std::collections::HashMap<String, i32>,
    pub rest_reminder: RestReminder,
    pub disabled_periods: Vec<DisabledPeriod>,
    pub eye_care: EyeCare,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RestReminder {
    pub enabled: bool,
    pub interval_min: i32,
    pub rest_min: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DisabledPeriod {
    pub name: String,
    pub start: String,
    pub end: String,
    pub days: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EyeCare {
    pub blue_light_filter: bool,
    pub night_mode: bool,
    pub color_temp: String,    // warm / natural / cool
    pub brightness: i32,        // 0-100
}

/// 打卡
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CheckinInfo {
    pub streak: i32,
    pub month_count: i32,
    pub total: i32,
    pub done_days: Vec<i32>,
}

/// 错题重做反馈
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReviewResult {
    pub correct: bool,
    pub tip: String,
    pub status: String,
}

/// 导出结果
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportResult {
    pub path: String,
}

/// 生成题目参��
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateQuestionsArgs {
    pub module: String,
    pub difficulty: String,
    pub mode: String,
    pub count: i32,
    pub formula_range: Option<Vec<i32>>,
    pub child_id: Option<String>,
}
