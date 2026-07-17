// 数据存储层 —— 骨架阶段使用内存态（commands.rs / AppState），
// 生产阶段应替换为 SQLite（rusqlite 已声明在 Cargo.toml 依赖但被注释）。

// 迁移步骤：
// 1. Cargo.toml 取消 rusqlite 注释；
// 2. 在本模块实现 sqlite::Connection 初始化（连接 + 建表 + 迁移）；
// 3. 在 lib.rs 中将 commands::AppState 替换为 commands::SqliteState；
// 4. commands.rs 中的 Mutex 操作替换为 rusqlite 查询。

// 表结构（规划）：
// - children: id, name, avatar, grade, points, accuracy, created_at
// - progress: child_id, mastered_formulas, streak_days, today_questions, ...
// - wrong_questions: id, child_id, question_json, user_answer, review_count, status, tip
// - settings: child_id, daily_limit_min, module_limits_json, ...
// - sessions: id, child_id, result_json, summary_json, created_at
// - checkins: child_id, date (YYYY-MM-DD), done (bool)

// 本骨架阶段 db.rs 仅作为设计参考，生产替换后删除此注释。
