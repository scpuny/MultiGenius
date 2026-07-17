// 通用占位页：骨架阶段未实现的页面统一用此组件，保留路由完整性。
export function Placeholder({ title, hint }: { title: string; hint?: string }) {
  return (
    <div style={{ paddingTop: 80, textAlign: "center", color: "var(--color-text-sub)" }}>
      <div style={{ fontSize: 40 }}>🚧</div>
      <h2 style={{ marginTop: 12 }}>{title}</h2>
      <p style={{ marginTop: 8, fontSize: "var(--fs-sm)" }}>{hint ?? "该页面按《前端设计文档》路由已实现，待填充业务组件。"}</p>
    </div>
  );
}
