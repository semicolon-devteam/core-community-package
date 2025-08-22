// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// 전역 모킹 설정
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  useParams() {
    return {};
  },
  usePathname() {
    return "";
  },
}));

// Supabase 클라이언트 모킹
vi.mock("@config/Supabase/client", () => ({
  default: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          is: vi.fn(() => ({
            range: vi.fn(() => Promise.resolve({
              data: [],
              count: 0,
              error: null
            }))
          }))
        }))
      }))
    })),
    rpc: vi.fn(() => Promise.resolve({
      data: false,
      error: null
    }))
  }
}));

// 필요한 경우 환경 변수 설정
global.process.env = {
  ...process.env,
  NEXT_PUBLIC_API_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "https://mock-supabase-url.com",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "mock-anon-key"
};
