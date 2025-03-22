import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from "path";

export default defineConfig({
  plugins: [
    uni(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@views": path.resolve(__dirname, "src/views"),
      "@comp": path.resolve(__dirname, "src/components"),
      "@router": path.resolve(__dirname, "src/router"),
      "@api": path.resolve(__dirname, "src/api"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: true,
    proxy: {
      "/minimax":{
        target: "https://api.minimax.chat",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/minimax/, ""),
      },
      "/cozechat": {
        target: "https://api.coze.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cozechat/, ""),
      },
    },
  },
})
