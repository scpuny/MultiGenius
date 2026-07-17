pub mod commands;
pub mod models;
pub mod db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(commands::init_state())
        .invoke_handler(tauri::generate_handler![
            // 5.1 账户
            commands::get_children,
            commands::add_child,
            commands::update_child,
            commands::delete_child,
            commands::switch_child,
            // 5.2 进度
            commands::get_progress,
            commands::update_progress,
            // 5.3 练习
            commands::generate_questions,
            commands::submit_session,
            commands::get_session_result,
            // 5.4 错题
            commands::list_wrong_questions,
            commands::review_wrong_question,
            commands::clear_wrong_question,
            commands::batch_review,
            // 5.5 报告
            commands::get_report,
            commands::export_report,
            // 5.6 设置
            commands::get_settings,
            commands::update_settings,
            // 5.7 应用题
            commands::generate_application,
            // 5.8 自定义出题
            commands::generate_custom_quiz,
            // 5.9 打卡
            commands::get_checkin,
            commands::do_checkin,
        ])
        .run(tauri::generate_context!())
        .expect("启动失败");
}
