// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // 指定入口文件
    rollupOptions: {
      input: 'main.js', // 你想要压缩的文件
    },
    esbuild: {
      drop: ['console', 'debugger'], // 可选：移除 console 和 debugger
    },
  },
});