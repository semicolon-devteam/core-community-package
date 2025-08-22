import type { Config } from "tailwindcss";
import { BREAKPOINTS } from "./src/constants/breakpoints";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: [
    // Width 관련 클래스들 (동적으로 생성되는 경우만)
    { pattern: /^w-\d+/ },
    // Grid 관련 클래스들
    { pattern: /^col-span-\d+/ },
    { pattern: /^row-span-\d+/ },
    { pattern: /^col-start-\d+/ },
    { pattern: /^row-start-\d+/ },
    // Flex alignment 관련 클래스들
    { pattern: /^justify-/ },
    { pattern: /^items-/ },
    // Height 관련 클래스들
    { pattern: /^h-\d+/ },
  ],
  theme: {
    screens: {
      sm: `${BREAKPOINTS.sm}px`,
      md: `${BREAKPOINTS.md}px`,
      lg: `${BREAKPOINTS.lg}px`,
      xl: `${BREAKPOINTS.xl}px`,
      '2xl': `${BREAKPOINTS['2xl']}px`,
    },
    extend: {
      maxWidth: {
        'global-container': '1280px', // 글로벌 레이아웃 컨테이너 width
        'global-content': '1024px',   // 콘텐츠 영역 width (필요시)
      },
      width: {
        'global-container': '1280px', // w-container로 사용 가능
      },
      colors: {
        background: "#F7F8FA",
        foreground: "var(--foreground)",
        footer: "#161618",
        primary: "#f37021",
        default: "#161618",
        secondary: "#8f8f91",
        tertiary: "#545456",
        placeholder: "#afafb2",
        text: {
          default: "#161618",
          secondary: "#8f8f91",
          tertiary: "#545456",
          placeholder: "#afafb2",
        },
        border: {
          default: "#e5e5e8",
          primary: "#f37021",
        },
        button: {
          default: "#afafb2",
        },
      },
      fontFamily: {
        nexon: ["NEXON Lv2 Gothic", "sans-serif"],
      },
      boxShadow: {
        custom: "0px 8px 16px 0px rgba(112,144,176,0.16)",
      },
    },
  },
  plugins: [],
} satisfies Config;
