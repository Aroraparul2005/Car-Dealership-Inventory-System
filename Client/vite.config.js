import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_API_PROXY_TARGET || "http://localhost:5000";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      // During dev, /api is proxied to your Express backend so there are no CORS issues.
      proxy: {
        "/api": { target, changeOrigin: true, secure: false },
      },
    },
  };
});
