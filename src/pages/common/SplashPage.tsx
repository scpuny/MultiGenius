import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 启动闪屏页：加载完成后跳首页
export function SplashPage() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav("/home", { replace: true }), 1500);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "var(--color-bg)",
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 24,
          background: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          color: "#fff",
          boxShadow: "var(--shadow-float)",
        }}
      >
        ×
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>乘法小天才</h1>
      <p style={{ color: "var(--color-text-sub)" }}>轻松学乘法，快乐做口算</p>
      <p style={{ fontSize: "var(--fs-sm)", color: "var(--color-text-sub)", marginTop: 24 }}>
        纯学习工具 · 无广告 · 护眼设计
      </p>
    </div>
  );
}
