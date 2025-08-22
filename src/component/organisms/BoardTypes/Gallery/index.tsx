import type { GalleryListItem, ListPost } from '@model/post';
import GalleryCard from '@molecules/GalleryCard';
import { Skeleton } from '@atoms/Skeleton';
import NoticeSection from '@organisms/BoardTypes/ListBoard/NoticeSection';
import { useAppSelector } from '@hooks/common';
import { useAuth } from '@hooks/User/useAuth';
import { selectUIState } from '@redux/Features/UI/uiSlice';
import {
  noticeColumns,
  getNoticeColumnsWithAdmin,
  noticeColumnsMobile,
  getNoticeColumnsMobileWithAdmin,
} from '@organisms/BoardTypes/ListBoard/listboard.model';

export default function GalleryBoard({
  posts,
  highlightId,
  currentPage,
  pageSize = 12,
  isFetching = false,
  isBookmark = false,
  onDeleteBookmark,
  notices,
}: {
  posts: GalleryListItem[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  highlightId?: number;
  isFetching?: boolean;
  isBookmark?: boolean;
  onDeleteBookmark?: () => void;
  notices?: ListPost[];
}) {
  const { isMobile } = useAppSelector(selectUIState);
  const { isAdmin } = useAuth();

  // 공지사항 컬럼도 Admin 권한에 따라 동적으로 선택
  const noticeColumnsToUse = isMobile
    ? isAdmin()
      ? getNoticeColumnsMobileWithAdmin()
      : noticeColumnsMobile
    : isAdmin()
    ? getNoticeColumnsWithAdmin()
    : noticeColumns;
  const hasData = posts && posts.length > 0;
  const showSkeleton = isFetching && hasData;
  const skeletonCount = hasData ? posts.length : pageSize;

  console.log('notices', notices);
  return (
    <div className="flex-col justify-center items-center gap-3 sm:gap-5 flex">
      {/* 공지사항 섹션 */}
      {notices && notices.length > 0 && (
        <div className="w-full bg-white border-b border-border-default">
          <NoticeSection notices={notices} columns={noticeColumnsToUse} />
        </div>
      )}

      <div className="w-full  flex-col justify-start items-start gap-2 inline-flex">
        <div className="grid xs:grid-cols-1 xl:grid-cols-3 grid-cols-2  gap-2 self-stretch justify-start items-center ">
          {showSkeleton
            ? Array(skeletonCount)
                .fill(0)
                .map((_, i) => (
                  <div key={`gallery-skel-${i}`} className="relative w-full">
                    <div className="w-full pb-5 rounded-2xl shadow-custom border border-[#e5e5e8] flex-col justify-center items-center gap-2 inline-flex overflow-hidden bg-white">
                      <div className="w-[306px] h-[174px] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                        <Skeleton className="w-full h-full" />
                      </div>
                      <div className="w-full px-4 flex flex-col gap-2">
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-10" />
                          <Skeleton className="h-3 w-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            : posts.map(data => (
                <GalleryCard
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  commentCount={data.comment_count}
                  likeCount={data.like_count}
                  thumbnailImage={data.metadata?.thumbnail || undefined}
                  isHighlighted={highlightId === data.id}
                  currentPage={currentPage}
                  isBookmark={isBookmark}
                  onDeleteBookmark={onDeleteBookmark}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
