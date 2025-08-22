// src/app/page.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

// MainPageContent 컴포넌트를 모킹
vi.mock("../component/organisms/PageContent", () => ({
  default: vi.fn(() => (
    <div data-testid="mocked-main-page-content">메인 페이지 콘텐츠</div>
  )),
}));

describe("Home 페이지", () => {
  beforeEach(() => {
    // 모킹 초기화
    vi.clearAllMocks();
  });

  it("MainPageContent 컴포넌트를 렌더링해야 함", () => {
    render(<Home />);

    // MainPageContent가 렌더링 되었는지 확인
    expect(screen.getByTestId("mocked-main-page-content")).toBeInTheDocument();
    expect(screen.getByText("메인 페이지 콘텐츠")).toBeInTheDocument();
  });
});
