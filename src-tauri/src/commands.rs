// Tauri 桥接命令：所有 #[tauri::command] 集中于此，与前端 bridge.ts 一一对应。
// 数据存储：骨架阶段使用内存态 Mutex<AppState>；生产阶段替换为 SQLite（见 db.rs）。

use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;
use crate::models::*;

// ========== 应用状态（内存） ==========
pub struct AppState {
    pub children: Mutex<Vec<Child>>,
    pub progress: Mutex<std::collections::HashMap<String, Progress>>,
    pub wrong_questions: Mutex<std::collections::HashMap<String, Vec<WrongQuestion>>>,
    pub settings: Mutex<std::collections::HashMap<String, Settings>>,
    pub sessions: Mutex<std::collections::HashMap<String, SessionSummary>>,
    pub checkins: Mutex<std::collections::HashMap<String, CheckinInfo>>,
    pub current_child: Mutex<Option<String>>,
}

pub fn init_state() -> AppState {
    let mut children = Vec::new();
    let c1 = Child {
        id: "child-1".into(), name: "小明".into(), avatar: "🐱".into(),
        grade: 2, points: 335, accuracy: 83.0, created_at: 1700000000,
    };
    let c2 = Child {
        id: "child-2".into(), name: "小红".into(), avatar: "🐰".into(),
        grade: 1, points: 128, accuracy: 71.0, created_at: 1700000001,
    };
    children.push(c1.clone());
    children.push(c2);

    let mut progress = std::collections::HashMap::new();
    progress.insert("child-1".into(), Progress {
        child_id: "child-1".into(), mastered_formulas: 18, total_formulas: 45,
        streak_days: 7, today_questions: 18, today_minutes: 15, today_accuracy: 83.0,
    });
    progress.insert("child-2".into(), Progress {
        child_id: "child-2".into(), mastered_formulas: 8, total_formulas: 45,
        streak_days: 3, today_questions: 10, today_minutes: 8, today_accuracy: 71.0,
    });

    let mut settings = std::collections::HashMap::new();
    let default_settings = Settings {
        child_id: "child-1".into(), daily_limit_min: 30,
        module_limits: std::collections::HashMap::new(),
        rest_reminder: RestReminder { enabled: true, interval_min: 20, rest_min: 3 },
        disabled_periods: vec![DisabledPeriod {
            name: "夜间禁用".into(), start: "21:00".into(), end: "07:00".into(), days: None,
        }],
        eye_care: EyeCare { blue_light_filter: false, night_mode: true, color_temp: "natural".into(), brightness: 70 },
    };
    settings.insert("child-1".into(), default_settings.clone());
    settings.insert("child-2".into(), default_settings);

    let mut checkins = std::collections::HashMap::new();
    checkins.insert("child-1".into(), CheckinInfo {
        streak: 7, month_count: 15, total: 70, done_days: (1..16).collect(),
    });

    AppState {
        children: Mutex::new(children),
        progress: Mutex::new(progress),
        wrong_questions: Mutex::new(std::collections::HashMap::new()),
        settings: Mutex::new(settings),
        sessions: Mutex::new(std::collections::HashMap::new()),
        checkins: Mutex::new(checkins),
        current_child: Mutex::new(Some("child-1".into())),
    }
}

// ========== 5.1 账户管理 ==========
#[tauri::command]
#[allow(non_snake_case)]
pub fn get_children(state: State<AppState>) -> Result<Vec<Child>, String> {
    Ok(state.children.lock().unwrap().clone())
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn add_child(state: State<AppState>, name: String, avatar: String, grade: i32) -> Result<Child, String> {
    let mut children = state.children.lock().unwrap();
    if children.len() >= 4 {
        return Err("最多添加 4 个孩子账号".into());
    }
    let c = Child {
        id: Uuid::new_v4().to_string(),
        name, avatar, grade, points: 0, accuracy: 0.0, created_at: chrono::Utc::now().timestamp(),
    };
    children.push(c.clone());
    Ok(c)
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn update_child(state: State<AppState>, id: String, name: Option<String>, avatar: Option<String>, grade: Option<i32>) -> Result<Child, String> {
    let mut children = state.children.lock().unwrap();
    if let Some(c) = children.iter_mut().find(|c| c.id == id) {
        if let Some(n) = name { c.name = n; }
        if let Some(a) = avatar { c.avatar = a; }
        if let Some(g) = grade { c.grade = g; }
        Ok(c.clone())
    } else {
        Err("未找到该孩子账号".into())
    }
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn delete_child(state: State<AppState>, id: String) -> Result<(), String> {
    let mut children = state.children.lock().unwrap();
    children.retain(|c| c.id != id);
    Ok(())
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn switch_child(state: State<AppState>, id: String) -> Result<(), String> {
    *state.current_child.lock().unwrap() = Some(id);
    Ok(())
}

// ========== 5.2 进度 ==========
#[tauri::command]
#[allow(non_snake_case)]
pub fn get_progress(state: State<AppState>, childId: String) -> Result<Progress, String> {
    let p = state.progress.lock().unwrap();
    p.get(&childId).cloned().ok_or_else(|| "进度未找到".into())
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn update_progress(state: State<AppState>, childId: String, deltaQuestions: i32, deltaMinutes: i32, deltaCorrect: i32) -> Result<Progress, String> {
    let mut p = state.progress.lock().unwrap();
    if let Some(pr) = p.get_mut(&childId) {
        pr.today_questions += deltaQuestions;
        pr.today_minutes += deltaMinutes;
        pr.today_accuracy = (pr.today_accuracy + deltaCorrect as f64 * 5.0).min(100.0);
        Ok(pr.clone())
    } else {
        Err("进度未找到".into())
    }
}

// ========== 5.3 练习 / 答题 ==========
fn mock_questions(count: i32, difficulty: &str, module: &str, types: Option<Vec<&str>>) -> Vec<Question> {
    let pool = types.unwrap_or(vec!["basic", "reverse", "compare"]);
    let mut out = Vec::new();
    for i in 0..count {
        let a = (i as i32 + 2) % 9 + 1;
        let b = (i as i32 + 5) % 9 + 1;
        let t = pool[(i as usize) % pool.len()];
        let (expr, ans) = match t {
            "reverse" => (format!("? × {} = {}", b, a * b), a),
            "compare" => (format!("{} × {} ○", a, b), if a * b > (a + 1) * (b - 1) { 1 } else { -1 }),
            "word_problem" => (format!("图文应用题 #{}", i + 1), a * b),
            _ => (format!("{} × {}", a, b), a * b),
        };
        out.push(Question {
            id: Uuid::new_v4().to_string(),
            q_type: t.to_string(),
            expression: expr,
            answer: ans,
            options: if t == "reverse" { Some(vec![a - 1, a, a + 1, a + 2]) } else { Some(vec![ans - 2, ans - 1, ans, ans + 1]) },
            word_problem: if t == "word_problem" {
                Some(WordProblem {
                    text: format!("小明买了 {} 盒铅笔，每盒有 {} 支。一共多少支？", a, b),
                    image: None,
                    hint: Some(format!("先用 {} × {} 算总数量", a, b)),
                })
            } else { None },
            difficulty: difficulty.to_string(),
            module: module.to_string(),
        });
    }
    out
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn generate_questions(state: State<AppState>, module: String, difficulty: String, mode: String, count: i32, formulaRange: Option<Vec<i32>>) -> Result<Vec<Question>, String> {
    Ok(mock_questions(count, &difficulty, &module, None))
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn submit_session(state: State<AppState>, result: SessionResult) -> Result<SessionSummary, String> {
    let mut m = state.wrong_questions.lock().unwrap();
    let session_id = Uuid::new_v4().to_string();
    let summary = SessionSummary {
        correct_rate: if result.question_count > 0 { (result.correct_count as f64 / result.question_count as f64) * 100.0 } else { 0.0 },
        stars: if result.correct_count as f64 >= result.question_count as f64 * 0.9 { 3 } else if result.correct_count as f64 >= result.question_count as f64 * 0.7 { 2 } else { 1 },
        gained_points: result.correct_count * 3,
        new_wrong: Vec::new(),
    };
    state.sessions.lock().unwrap().insert(session_id, summary.clone());
    Ok(summary)
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn get_session_result(state: State<AppState>, sessionId: String) -> Result<SessionSummary, String> {
    state.sessions.lock().unwrap().get(&sessionId).cloned().ok_or_else(|| "会话未找到".into())
}

// ========== 5.4 错题攻克 ==========
#[tauri::command]
#[allow(non_snake_case)]
pub fn list_wrong_questions(state: State<AppState>, childId: String, filter: Option<String>) -> Result<Vec<WrongQuestion>, String> {
    let wq = state.wrong_questions.lock().unwrap();
    Ok(wq.get(&childId).cloned().unwrap_or_default())
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn review_wrong_question(state: State<AppState>, childId: String, wrongId: String, userAnswer: i32) -> Result<ReviewResult, String> {
    let mut wq = state.wrong_questions.lock().unwrap();
    if let Some(list) = wq.get_mut(&childId) {
        if let Some(w) = list.iter_mut().find(|w| w.id == wrongId) {
            w.review_count += 1;
            let correct = userAnswer == w.question.answer;
            if correct { w.status = "mastered".into(); }
            return Ok(ReviewResult {
                correct,
                tip: w.tip.clone(),
                status: w.status.clone(),
            });
        }
    }
    Err("错题未找到".into())
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn clear_wrong_question(state: State<AppState>, childId: String, wrongId: String) -> Result<(), String> {
    let mut wq = state.wrong_questions.lock().unwrap();
    if let Some(list) = wq.get_mut(&childId) {
        list.retain(|w| w.id != wrongId);
    }
    Ok(())
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn batch_review(state: State<AppState>, childId: String) -> Result<Vec<WrongQuestion>, String> {
    let wq = state.wrong_questions.lock().unwrap();
    Ok(wq.get(&childId).cloned().unwrap_or_default().into_iter().filter(|w| w.status == "pending").collect())
}

// ========== 5.5 报告 / 导出 ==========
#[tauri::command]
#[allow(non_snake_case)]
pub fn get_report(state: State<AppState>, childId: String, period: String, date: String) -> Result<Report, String> {
    Ok(Report {
        child_id: childId,
        period,
        date,
        duration_min: 15,
        question_count: 18,
        accuracy: 83.0,
        new_wrong: 3,
        score: 85,
        weak_points: vec![
            WeakPoint { name: "7的乘法口诀".into(), percent: 45.0 },
            WeakPoint { name: "8的乘法口诀".into(), percent: 60.0 },
            WeakPoint { name: "逆向求数题型".into(), percent: 55.0 },
        ],
        suggestions: vec![
            "重点练习 7 和 8 的乘法口诀，建议使用遮挡背诵模式加强记忆。".into(),
            "每天坚持 10 题打卡，保持学习节奏，逐步提升口算速度。".into(),
            "周末可尝试限时闯关模式，在趣味中提升答题速度。".into(),
        ],
    })
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn export_report(state: State<AppState>, childId: String, period: String, format: String) -> Result<ExportResult, String> {
    Ok(ExportResult { path: format!("{}-{}.{}", childId, period, format) })
}

// ========== 5.6 设置 ==========
#[tauri::command]
#[allow(non_snake_case)]
pub fn get_settings(state: State<AppState>, childId: String) -> Result<Settings, String> {
    state.settings.lock().unwrap().get(&childId).cloned().ok_or_else(|| "设置未找到".into())
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn update_settings(state: State<AppState>, settings: Settings) -> Result<Settings, String> {
    let mut s = state.settings.lock().unwrap();
    s.insert(settings.child_id.clone(), settings.clone());
    Ok(settings)
}

// ========== 5.7 应用题专项（V3） ==========
#[tauri::command]
#[allow(non_snake_case)]
pub fn generate_application(state: State<AppState>, dimensions: Vec<String>, difficulty: String, count: i32) -> Result<Vec<Question>, String> {
    Ok(mock_questions(count, &difficulty, "application", Some(vec!["word_problem"])))
}

// ========== 5.8 自定义出题（V3 家长） ==========
#[tauri::command]
#[allow(non_snake_case)]
pub fn generate_custom_quiz(state: State<AppState>, childId: String, formulaRange: Vec<i32>, count: i32, difficulty: String, types: Vec<String>) -> Result<Vec<Question>, String> {
    let t: Vec<&str> = types.iter().map(|s| s.as_str()).collect();
    Ok(mock_questions(count, &difficulty, "advanced", Some(t)))
}

// ========== 5.9 打卡 ==========
#[tauri::command]
#[allow(non_snake_case)]
pub fn get_checkin(state: State<AppState>, childId: String, month: String) -> Result<CheckinInfo, String> {
    state.checkins.lock().unwrap().get(&childId).cloned().ok_or_else(|| "打卡数据未找到".into())
}

#[tauri::command]
#[allow(non_snake_case)]
pub fn do_checkin(state: State<AppState>, childId: String) -> Result<(), String> {
    let mut c = state.checkins.lock().unwrap();
    if let Some(info) = c.get_mut(&childId) {
        info.streak += 1;
        info.month_count += 1;
        info.total += 1;
    }
    Ok(())
}
