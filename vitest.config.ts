import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./test/coverage",
      include: [
        "src/component/**/*.{ts,tsx}",
        "src/app/**/*.{ts,tsx}",
        "src/util/**/*.{ts,tsx}",
      ],
      exclude: [
        "src/component/**/*.spec.{ts,tsx}",
        "src/component/**/*.test.{ts,tsx}",
        "src/app/**/*.spec.{ts,tsx}",
        "src/app/**/*.test.{ts,tsx}",
        "src/util/**/*.spec.{ts,tsx}",
        "src/util/**/*.test.{ts,tsx}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@atoms": resolve(__dirname, "./src/component/atoms"),
      "@atoms/*": resolve(__dirname, "./src/component/atoms/*"),
      "@molecules/*": resolve(__dirname, "./src/component/molecules/*"),
      "@molecules": resolve(__dirname, "./src/component/molecules"),
      "@organisms": resolve(__dirname, "./src/component/organisms"),
      "@organisms/*": resolve(__dirname, "./src/component/organisms/*"),
      "@templates/*": resolve(__dirname, "./src/templates/*"),
      "@templates": resolve(__dirname, "./src/templates"),
      "@constants/*": resolve(__dirname, "./src/constants/*"),
      "@constants": resolve(__dirname, "./src/constants"),
      "@hooks/*": resolve(__dirname, "./src/hooks/*"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@config/*": resolve(__dirname, "./src/config/*"),
      "@config": resolve(__dirname, "./src/config"),
      "@model/*": resolve(__dirname, "./src/model/*"),
      "@model": resolve(__dirname, "./src/model"),
      "@page/*": resolve(__dirname, "./src/page/*"),
      "@api/*": resolve(__dirname, "./src/api/*"),
      "@redux/*": resolve(__dirname, "./src/redux/*"),
      "@redux": resolve(__dirname, "./src/redux"),
      "@util/*": resolve(__dirname, "./src/util/*"),
      "@util": resolve(__dirname, "./src/util"),
      "@services/*": resolve(__dirname, "./src/services/*"),
      "@services": resolve(__dirname, "./src/services"),
      "@mocks/*": resolve(__dirname, "./src/mocks/*"),
    },
  },
});
