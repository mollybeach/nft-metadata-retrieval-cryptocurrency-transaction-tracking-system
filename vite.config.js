import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // connection entre le front (vite) et le back (express)
  server: {
    port: 3000, // or any other port you prefer for the dev server
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend server URL
        changeOrigin: true,
      },
    },
  },
});
