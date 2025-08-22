// src/component/atoms/PaginationItem/paginationitem.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginationItem from ".";

describe("PaginationItem 컴포넌트", () => {
  it("기본 렌더링이 올바르게 동작해야 함", () => {
    const onClick = vi.fn();
    render(
      <PaginationItem
        number={1}
        isActive={false}
        onClick={onClick}
        isVisible={true}
      />
    );

    const paginationItem = screen.getByLabelText("1 페이지로 이동");
    expect(paginationItem).toBeInTheDocument();
    expect(paginationItem).toHaveTextContent("1");
  });

  it("활성화 상태일 때 적절한 스타일이 적용되어야 함", () => {
    const onClick = vi.fn();
    render(
      <PaginationItem
        number={2}
        isActive={true}
        onClick={onClick}
        isVisible={true}
      />
    );

    const paginationItem = screen.getByLabelText("2 페이지로 이동");
    expect(paginationItem).toHaveClass("bg-primary");

    // 텍스트 색상 검증
    const textElement = paginationItem.firstChild;
    expect(textElement).toHaveClass("text-white");
  });

  it("비활성화 상태일 때 적절한 스타일이 적용되어야 함", () => {
    const onClick = vi.fn();
    render(
      <PaginationItem
        number={3}
        isActive={false}
        onClick={onClick}
        isVisible={true}
      />
    );

    const paginationItem = screen.getByLabelText("3 페이지로 이동");
    expect(paginationItem).not.toHaveClass("bg-primary");

    // 텍스트 색상 검증
    const textElement = paginationItem.firstChild;
    expect(textElement).toHaveClass("text-text-secondary");
  });

  it("isVisible이 false일 때 모바일에서 숨겨져야 함", () => {
    const onClick = vi.fn();
    render(
      <PaginationItem
        number={4}
        isActive={false}
        onClick={onClick}
        isVisible={false}
      />
    );

    const paginationItem = screen.getByLabelText("4 페이지로 이동");
    expect(paginationItem).toHaveClass("hidden");
    expect(paginationItem).toHaveClass("sm:flex");
  });

  it("클릭 시 onClick 함수가 호출되어야 함", () => {
    const onClick = vi.fn();
    render(
      <PaginationItem
        number={5}
        isActive={false}
        onClick={onClick}
        isVisible={true}
      />
    );

    const paginationItem = screen.getByLabelText("5 페이지로 이동");
    fireEvent.click(paginationItem);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
