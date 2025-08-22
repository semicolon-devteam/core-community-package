'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import WriteButton from '@atoms/WriteButton/WriteButton';
import {
  useAppDispatch,
  useAppSelector,
  useRouterWithLoader,
} from '@hooks/common';
import { usePostQuery } from '@hooks/queries/usePostQuery';
import type { BoardCategory, Board as BoardModel } from '@model/board';
import { SearchType, SortBy } from '@model/board';
import { OpenLoungeType } from '@model/board/enum';
import type { ListPost } from '@model/post';
import Board from '@molecules/Board';
import ContentBoard from '@organisms/BoardTypes/ContentBoard';
import GalleryBoard from '@organisms/BoardTypes/Gallery';
import ListBoard from '@organisms/BoardTypes/ListBoard';
import MoneyBoard from '@organisms/BoardTypes/MoneyBoard';
import SearchBoard from '@organisms/BoardTypes/SearchBoard';
import type {
  BaseBoardProps,
  BoardType,
} from '@organisms/BoardTypes/boardtype.model';
import ErrorHandler from '@organisms/ErrorHandler';
import { setBoardType } from '@redux/Features/Board/boardSlice';
import { selectUserInfo } from '@redux/Features/User/userSlice';
import { hasBoardPermission } from '@util/authUtil';

interface BoardTemplateProps {
  boardName?: string;
  category?: BoardCategory[]; // 선택적으로 변경
  boardId?: number;
  pageSize?: number;
  type: BoardType;
  permissionSettings?: {
    write_level: number | 'free';
    comment_level: number;
    upload_level: number;
    read_level: number;
  };
  allBoards?: BoardModel[];
  // PostDetail에서 사용되는 특별 기능들 (옵셔널)
  highlightId?: number; // 하이라이트할 게시물 ID
  autoFindCurrentPost?: boolean; // 현재 게시물이 있는 페이지로 자동 이동
  initialSearchParams?: {
    sortBy?: string;
    searchType?: string;
    searchText?: string;
    page?: string;
  };
}

// 뷰 컴포넌트 매핑
const viewComponents: Record<BoardType, React.ComponentType<BaseBoardProps>> = {
  list: ListBoard,
  money: MoneyBoard,
  gallery: GalleryBoard,
  content: ContentBoard,
  search: SearchBoard,
};

export default function BoardTemplate({
  boardName,
  category: initialCategory,
  boardId = OpenLoungeType.FREE,
  type = 'list',
  permissionSettings,
  pageSize = 15,
  allBoards,
  highlightId,
  autoFindCurrentPost = false,
  initialSearchParams,
}: BoardTemplateProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialPage =
    Number(searchParams.get('page')) || Number(initialSearchParams?.page) || 1;
  const router = useRouterWithLoader();
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [posts, setPosts] = useState<ListPost[]>([]);
  const [notices, setNotices] = useState<ListPost[]>([]);
  const [currentTotalCount, setCurrentTotalCount] = useState(0);

  const [searchParamsState, setSearchParamsState] = useState({
    sortBy:
      searchParams.get('sortBy') || initialSearchParams?.sortBy || 'latest',
    searchType:
      searchParams.get('searchType') ||
      initialSearchParams?.searchType ||
      'title_content',
    searchText:
      searchParams.get('searchText') || initialSearchParams?.searchText || '',
    selectedBoardId: searchParams.get('boardId') || '0',
    page: searchParams.get('page') || initialSearchParams?.page || '1',
    type: searchParams.get('type') || type,
    categoryId: searchParams.get('categoryId') || null,
  });

  // 사용자가 의도적으로 페이지를 변경했는지 구분 (autoFindCurrentPost용)
  const [isUserNavigating, setIsUserNavigating] = useState(false);

  // display_settings.type을 우선으로 하고, 없으면 URL 파라미터, 마지막으로 prop, 최종 기본값은 'list'
  const apiType = type as BoardType;
  const urlType = searchParams.get('type') as BoardType;
  const currentBoardType =
    apiType && viewComponents[apiType]
      ? apiType
      : urlType && viewComponents[urlType]
      ? urlType
      : viewComponents[type]
      ? type
      : 'list';

  // 카테고리 자동 로딩
  // useEffect(() => {
  //   // 초기 카테고리가 없거나 비어있을 때만 동적 로드
  //   if (!initialCategory || initialCategory.length === 0) {
  //     async function fetchCategories() {
  //       const res = await boardService.getBoardCategories(boardId);
  //       if (res.successOrNot === 'Y' && Array.isArray(res.data)) {
  //         setCategory(res.data);
  //       }
  //     }
  //     fetchCategories();
  //   }
  // }, [boardId, initialCategory]);

  const userInfo = useAppSelector(selectUserInfo);
  const user = userInfo?.userInfo;
  const { isLoggedIn } = userInfo;

  // 읽기 권한 체크 (클라이언트사이드)
  const canRead = hasBoardPermission(
    user,
    permissionSettings?.read_level || 0,
    isLoggedIn
  );

  // 권한 체크 - 통합 유틸리티 사용
  const canWrite =
    currentBoardType === 'search'
      ? false
      : hasBoardPermission(
          user,
          permissionSettings?.write_level || 0,
          isLoggedIn
        );

  const {
    data: queryData,
    refetch,
    isFetching,
  } = usePostQuery(
    currentBoardType === 'search'
      ? {
          boardId: searchParamsState.selectedBoardId
            ? Number(searchParamsState.selectedBoardId)
            : 0,
          page: currentPage,
          pageSize: pageSize,
          sortBy: searchParamsState.sortBy as SortBy,
          searchType: searchParamsState.searchType as SearchType,
          searchText: searchParamsState.searchText,
          categoryId: searchParamsState.categoryId,
        }
      : {
          boardId: boardId,
          page: currentPage,
          pageSize: pageSize,
          sortBy: searchParamsState.sortBy as SortBy,
          searchType: searchParamsState.searchType as SearchType,
          searchText: searchParamsState.searchText,
          categoryId: searchParamsState.categoryId,
        },
    {
      enabled: true,
    }
  );

  // 검색 결과 업데이트
  useEffect(() => {
    if (queryData?.data?.items) {
      // 순번을 포함한 posts 데이터 생성
      const postsWithSequence = queryData.data.items.map((post, index) => {
        const sequence =
          queryData.data.totalCount - (currentPage - 1) * pageSize - index;
        return {
          ...post,
          page: currentPage,
          sequence: sequence > 0 ? sequence : 0, // 음수 방지
        };
      });
      setPosts(postsWithSequence);
      setCurrentTotalCount(queryData.data.totalCount);

      setNotices(queryData.data.notices || []);

      console.log('notices', queryData.data.notices);
    }
  }, [queryData, currentPage, pageSize]);

  // 자동 페이지 찾기 기능 (autoFindCurrentPost가 true이고 highlightId가 있을 때)
  useEffect(() => {
    if (
      autoFindCurrentPost &&
      highlightId &&
      queryData?.data?.items &&
      queryData.data.items.length > 0 &&
      !isUserNavigating
    ) {
      // 현재 페이지에 하이라이트할 게시물이 있는지 확인
      const currentPostIndex = queryData.data.items.findIndex(
        item => item.id === highlightId
      );

      if (currentPostIndex === -1) {
        // 1페이지로 직접 이동
        setCurrentPage(1);
        setIsUserNavigating(false); // 자동 이동이므로 false 유지
      }
    }
  }, [
    autoFindCurrentPost,
    highlightId,
    queryData,
    isUserNavigating,
    currentPage,
  ]);

  // URL 파라미터 변경 감지 및 초기화
  useEffect(() => {
    const currentSortBy = searchParams.get('sortBy');
    const currentSearchType = searchParams.get('searchType');
    const currentSearchText = searchParams.get('searchText');
    const currentBoardId = searchParams.get('boardId');
    const currentPageParam = searchParams.get('page');
    const currentType = searchParams.get('type');
    const currentCategoryId = searchParams.get('categoryId');

    // page 파라미터 유효성 검사 및 기본값 설정
    const validPage = currentPageParam ? Number(currentPageParam) : 1;
    const finalPage = isNaN(validPage) || validPage < 1 ? 1 : validPage;

    // currentPage state 업데이트
    setCurrentPage(finalPage);

    setSearchParamsState({
      sortBy: currentSortBy || 'latest',
      searchType: currentSearchType || 'title_content',
      searchText: currentSearchText || '',
      selectedBoardId: currentBoardId || '0',
      page: String(finalPage),
      type: currentType || '',
      categoryId: currentCategoryId || null,
    });
  }, [searchParams]);

  // refresh 파라미터 처리 - useRef로 한 번만 실행되도록 보장
  const hasProcessedRefresh = useRef(false);

  useEffect(() => {
    const refreshParam = searchParams.get('refresh');

    if (refreshParam === 'true' && !hasProcessedRefresh.current) {
      hasProcessedRefresh.current = true;

      // refetch 실행
      refetch();

      // URL에서 refresh 파라미터 제거
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('refresh');

      // 새로운 URL로 교체 (페이지 히스토리 변경 없이)
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl);
    }
  }, [searchParams, refetch, router, pathname]);

  // 검색 버튼 클릭 시 검색 실행
  const handleSearch = (params: {
    sortBy: SortBy;
    searchType: SearchType;
    searchText: string;
    selectedBoardId?: string;
  }) => {
    setCurrentPage(1);
    setIsUserNavigating(false); // 검색 시에는 다시 자동 페이지 찾기 활성화
    setSearchParamsState({
      categoryId: searchParamsState.categoryId,
      sortBy: params.sortBy,
      searchType: params.searchType,
      searchText: params.searchText,
      selectedBoardId: params.selectedBoardId || '0',
      page: '1',
      type: searchParamsState.type, // 검색 시 type 유지
    });

    // URL 업데이트
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('sortBy', params.sortBy);
    newSearchParams.set('searchType', params.searchType);
    newSearchParams.set('searchText', params.searchText);
    newSearchParams.set('page', '1'); // 검색 시 항상 1페이지로
    if (params.selectedBoardId) {
      newSearchParams.set('boardId', params.selectedBoardId);
    }
    router.push(`?${newSearchParams.toString()}`);
  };

  // 초기 로딩 시 세션 스토리지 설정
  useEffect(() => {
    // 현재 URL을 pathname과 searchParams로 구성
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    sessionStorage.setItem('previousBoardPage', currentUrl);
  }, [pathname, searchParams]);

  // type 정보를 Redux에 저장
  useEffect(() => {
    dispatch(setBoardType(currentBoardType));
  }, [currentBoardType, dispatch]);

  const totalPages = Math.ceil(currentTotalCount / pageSize);
  const Component = viewComponents[currentBoardType] || viewComponents.list;

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsUserNavigating(true); // 사용자가 페이지를 변경했으므로 true로 설정

    // URL도 함께 업데이트
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', String(page));
    router.push(`?${newSearchParams.toString()}`);
  };

  return !canRead ? (
    <ErrorHandler
      message={
        !isLoggedIn
          ? '로그인이 필요한 게시판입니다.'
          : `이 게시판에 접근하려면 레벨 ${
              permissionSettings?.read_level || 0
            } 이상이 필요합니다.`
      }
    />
  ) : (
    <Board.Container>
      <Board.SearchBox
        onSearchClick={handleSearch}
        isGlobalSearch={currentBoardType === 'search'}
        category={initialCategory || []}
        allBoards={allBoards}
      />
      <Board.Header
        boardName={boardName}
        category={initialCategory || []}
        totalCount={currentTotalCount}
        isGlobalSearch={currentBoardType === 'search'}
        searchText={searchParamsState.searchText}
        totalPages={totalPages}
      />
      <Component
        posts={posts}
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={currentTotalCount}
        highlightId={highlightId}
        notices={notices}
        isFetching={isFetching}
      />
      {canWrite && <WriteButton link={`/post?boardId=${boardId}`} />}
      <Board.Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Board.Container>
  );
}
