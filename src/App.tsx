import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useChildStore } from "./store/useChildStore";

export function App() {
  const loadChildren = useChildStore((s) => s.loadChildren);

  // 启动即加载账户列表（多账号），供全局 childId 使用
  useEffect(() => {
    loadChildren().catch(() => {/* 首次无账户时忽略，AccountSwitch 处理 */});
  }, [loadChildren]);

  return (
    <div className="app-shell">
      <RouterProvider router={router} />
    </div>
  );
}
