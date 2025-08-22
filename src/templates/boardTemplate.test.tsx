import { render, screen, waitFor } from "@testing-library/react";
import { useAppSelector } from "@hooks/common";
import BoardTemplate from "./BoardTemplate";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";

/**
 * BoardTemplate 권한 테스트 슈도 코드
 * 
 * 테스트 목적: 게시판 권한 설정에 따라 글쓰기 버튼이 적절히 표시되고 동작하는지 검증
 * 
 * 필요한 props:
 * - boardId: number (게시판 ID)
 * - initialData: Array (게시글 초기 데이터)
 * - category: string (게시판 카테고리)
 * - totalCount: number (총 게시글 수)
 * - initialPage: number (초기 페이지)
 * - type: string (게시판 타입)
 * 
 * 모킹 필요항목:
 * - useAppSelector: Redux 상태
 */

// 최소한의 모킹
vi.mock("@hooks/common", () => ({
  useAppSelector: vi.fn((selector) => {
    if (selector.name === 'selectUserInfo') {
      return { userInfo: { level: 99 } };
    }
    return null;
  }),
  useDebounce: (fn: Function) => fn,
  useThrottle: (fn: Function) => fn,
  useImageUpload: () => ({ uploadPreviewImage: vi.fn() }),
  useAppDispatch: () => vi.fn()
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() })
}));

// usePostQuery를 완전히 모킹
vi.mock("@hooks/queries/usePostQuery", () => ({
  usePostQuery: () => ({
    data: {
      data: {
        items: [],
        totalCount: 0
      }
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn()
  })
}));

// Board 컴포넌트를 최소한으로 모킹
vi.mock("@molecules/Board", () => ({
  default: {
    Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SearchBox: () => null,
    Header: () => null,
    Pagination: () => null
  }
}));

vi.mock("@organisms/BoardTypes/ListBoard", () => ({
  default: () => null
}));

vi.mock("@organisms/BoardTypes/MoneyBoard", () => ({
  default: () => null
}));

vi.mock("@organisms/BoardTypes/Gallery", () => ({
  default: () => null
}));

vi.mock("@organisms/BoardTypes/ContentBoard", () => ({
  default: () => null
}));

vi.mock("@organisms/BoardTypes/SearchBoard", () => ({
  default: () => null
}));

// WriteButton 모킹을 콘솔 로그와 함께 수정
vi.mock("@atoms/WriteButton/WriteButton", () => ({
  default: ({ isVisible }: { isVisible: boolean }) => 
    isVisible ? <div>작성하기</div> : null
}));

// useEffect를 모킹하여 상태 업데이트 방지
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useEffect: vi.fn()
  };
});

describe("BoardTemplate 권한 테스트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("관리자(레벨 99)는 항상 글쓰기 버튼이 보인다", async () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.name === 'selectUserInfo') {
        return { userInfo: { level: 99 } };
      }
      return null;
    });

    render(
      <BoardTemplate 
        boardId={1}
        category={[]}
        totalCount={0}
        initialPage={1}
        type="list"
        initialData={[]}
        permissionSettings={{
          write_level: 100,
          comment_level: 1,
          upload_level: 1,
          read_level: 1
        }}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText("작성하기")).toBeInTheDocument();
    });
  });

  it("write_level이 -1이면 모든 로그인 사용자가 글쓰기 버튼을 볼 수 있다", async () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.name === 'selectUserInfo') {
        return { userInfo: { level: 1 } };
      }
      return null;
    });

    render(
      <BoardTemplate 
        boardId={1}
        category={[]}
        totalCount={0}
        initialPage={1}
        type="list"
        initialData={[]}
        permissionSettings={{
          write_level: -1,
          comment_level: 1,
          upload_level: 1,
          read_level: 1
        }}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText("작성하기")).toBeInTheDocument();
    });
  });

  it("write_level이 'free'면 모든 로그인 사용자가 글쓰기 버튼을 볼 수 있다", async () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.name === 'selectUserInfo') {
        return { userInfo: { level: 1 } };
      }
      return null;
    });

    render(
      <BoardTemplate 
        boardId={1}
        category={[]}
        totalCount={0}
        initialPage={1}
        type="list"
        initialData={[]}
        permissionSettings={{
          write_level: 'free' as any,
          comment_level: 1,
          upload_level: 1,
          read_level: 1
        }}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText("작성하기")).toBeInTheDocument();
    });
  });

  it("사용자 레벨이 write_level보다 높으면 글쓰기 버튼이 보인다", async () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.name === 'selectUserInfo') {
        return { userInfo: { level: 5 } };
      }
      return null;
    });

    render(
      <BoardTemplate 
        boardId={1}
        category={[]}
        totalCount={0}
        initialPage={1}
        type="list"
        initialData={[]}
        permissionSettings={{
          write_level: 3,
          comment_level: 1,
          upload_level: 1,
          read_level: 1
        }}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText("작성하기")).toBeInTheDocument();
    });
  });

  it("사용자 레벨이 write_level과 같으면 글쓰기 버튼이 보인다", async () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.name === 'selectUserInfo') {
        return { userInfo: { level: 3 } };
      }
      return null;
    });

    render(
      <BoardTemplate 
        boardId={1}
        category={[]}
        totalCount={0}
        initialPage={1}
        type="list"
        initialData={[]}
        permissionSettings={{
          write_level: 3,
          comment_level: 1,
          upload_level: 1,
          read_level: 1
        }}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText("작성하기")).toBeInTheDocument();
    });
  });

  it("사용자 레벨이 write_level보다 낮으면 글쓰기 버튼이 보이지 않는다", async () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.name === 'selectUserInfo') {
        return { userInfo: { level: 2 } };
      }
      return null;
    });

    render(
      <BoardTemplate 
        boardId={1}
        category={[]}
        totalCount={0}
        initialPage={1}
        type="list"
        initialData={[]}
        permissionSettings={{
          write_level: 3,
          comment_level: 1,
          upload_level: 1,
          read_level: 1
        }}
      />
    );
    
    await waitFor(() => {
      expect(screen.queryByText("작성하기")).not.toBeInTheDocument();
    });
  });

  it("비로그인 상태면 글쓰기 버튼이 보이지 않는다", async () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.name === 'selectUserInfo') {
        return { userInfo: undefined };
      }
      return null;
    });

    render(
      <BoardTemplate 
        boardId={1}
        category={[]}
        totalCount={0}
        initialPage={1}
        type="list"
        initialData={[]}
        permissionSettings={{
          write_level: 1,
          comment_level: 1,
          upload_level: 1,
          read_level: 1
        }}
      />
    );
    
    await waitFor(() => {
      expect(screen.queryByText("작성하기")).not.toBeInTheDocument();
    });
  });

  it("permissionSettings가 없으면 로그인한 사용자는 글쓰기 버튼이 보인다", async () => {
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.name === 'selectUserInfo') {
        return { userInfo: { level: 1 } };
      }
      return null;
    });

    render(
      <BoardTemplate 
        boardId={1}
        category={[]}
        totalCount={0}
        initialPage={1}
        type="list"
        initialData={[]}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText("작성하기")).toBeInTheDocument();
    });
  });
}); 