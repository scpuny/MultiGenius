import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri 在构建时注入特殊环境变量；此处仅配置前端。
export default defineConfig({
  plugins: [react()],
  // Tauri 期望相对路径资源，且 devUrl 由 tauri.conf.json 指向
  base: "./",
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    // 仅允许 Tauri 窗口访问，避免暴露到局域网
    host: false,
    hmr: { protocol: "ws", host: "localhost", port: 5174 },
  },
  build: {
    target: "es2021",
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
