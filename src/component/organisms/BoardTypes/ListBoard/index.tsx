import { useAppSelector } from '@hooks/common';
import { useAuth } from '@hooks/User/useAuth';
import Board from '@molecules/Board';
import type { ListBoardProps } from '@organisms/BoardTypes/boardtype.model';
import {
  desktopColumns,
  getDesktopColumnsWithAdmin,
  getMobileColumnsWithAdmin,
  mobileColumns,
  noticeColumns,
  getNoticeColumnsWithAdmin,
  noticeColumnsMobile,
  getNoticeColumnsMobileWithAdmin,
} from '@organisms/BoardTypes/ListBoard/listboard.model';
import NoticeSection from '@organisms/BoardTypes/ListBoard/NoticeSection';
import { selectUIState } from '@redux/Features/UI/uiSlice';
import { timeAgo } from '@util/dateUtil';
import { Skeleton } from '@atoms/Skeleton';
import { generateGridClasses } from '@atoms/Column/column.model';

export default function ListBoard({
  posts,
  totalCount = 0,
  currentPage = 1,
  pageSize = 15,
  highlightId,
  notices,
  isFetching = false,
}: ListBoardProps & { highlightId?: number }) {
  const { isMobile } = useAppSelector(selectUIState);
  const { isAdmin } = useAuth();

  // Admin 권한에 따라 동적으로 컬럼 선택
  const columns = isMobile
    ? isAdmin()
      ? getMobileColumnsWithAdmin()
      : mobileColumns
    : isAdmin()
    ? getDesktopColumnsWithAdmin()
    : desktopColumns;

  // 공지사항 컬럼도 Admin 권한에 따라 동적으로 선택
  const noticeColumnsToUse = isMobile
    ? isAdmin()
      ? getNoticeColumnsMobileWithAdmin()
      : noticeColumnsMobile
    : isAdmin()
    ? getNoticeColumnsWithAdmin()
    : noticeColumns;
  console.log('posts', posts);
  console.log('columns', columns);
  // 게시글에 순서 번호 및 하이라이트 여부 추가
  const postsWithSequence = posts.map((post, index) => ({
    ...post,
    created_at: timeAgo(post.created_at || new Date().toISOString()),
    page: currentPage,
    sequenceNumber: totalCount - (currentPage - 1) * pageSize - index,
    isHighlight: highlightId !== undefined && post.id === highlightId,
  }));

  const gridClasses =
    'w-full bg-white border-b border-border-default grid grid-cols-12 gap-0 overflow-hidden';
  const hasData = postsWithSequence.length > 0;
  const showSkeleton = isFetching && hasData;

  return (
    <Board.Wrapper>
      <Board.Table.Content>
        {!isMobile && <Board.Table.Header columns={columns} />}

        {/* 공지사항 섹션 */}
        {notices && notices.length > 0 && (
          <NoticeSection notices={notices} columns={noticeColumnsToUse} />
        )}

        {showSkeleton ? (
          Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={`skeleton-row-${i}`} className={gridClasses}>
                {columns.map((column, j) => (
                  <div
                    key={`skeleton-col-${j}`}
                    className={`${generateGridClasses(
                      column.gridLayout
                    )} h-8 sm:h-11 py-2 sm:py-2.5 flex items-center`}
                  >
                    <Skeleton className="h-4 w-full rounded-md bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            ))
        ) : (
          <Board.Table.Body item={postsWithSequence} columns={columns} />
        )}
      </Board.Table.Content>
    </Board.Wrapper>
  );
}
