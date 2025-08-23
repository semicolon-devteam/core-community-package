'use client';

import CommentIcon from '@atoms/Icon/CommentIcon';
import { Skeleton } from '@atoms/Skeleton';
import LinkWithLoader from '@common/LinkWithLoader';
import type { WithBoardNamePost } from '../../../../types/board';
import { normalizeImageSrc } from '@util/imageUtil';
import Image from 'next/image';

export default function WithBoardName({
  postItem,
  isShowDate = true,
  isShowComment = true,
  isShowRank = false,
  isShowLike = false,
  isLoading = false,
  skeletonCount = 5,
}: {
  postItem: WithBoardNamePost[];
  isShowDate?: boolean;
  isShowComment?: boolean;
  isShowLike?: boolean;
  isShowRank?: boolean;
  isLoading?: boolean;
  skeletonCount?: number;
}) {
  const hasData = Array.isArray(postItem) && postItem.length > 0;
  const showSkeleton = isLoading && hasData;
  const effectiveSkeletonCount = hasData ? postItem.length : skeletonCount;

  if (showSkeleton) {
    return Array(effectiveSkeletonCount)
      .fill(0)
      .map((_, i) => (
        <div
          key={`skeleton-withboardname-${i}`}
          className="inline-flex h-6 items-center justify-between gap-2 w-full "
        >
          <div className="flex h-6 grow gap-2 overflow-hidden items-center">
            {isShowRank && <Skeleton className="w-6 h-6 rounded-md" />}
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-8 h-4" />
          </div>
          <div className="hidden sm:flex flex-shrink-0">
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
      ));
  }

  if (!hasData) {
    return (
      <div className="w-full py-4 text-center font-nexon text-sm text-text-secondary">
        조회된 결과값이 없습니다
      </div>
    );
  }

  return postItem.map((e: WithBoardNamePost, i: number) => {
    return (
      <LinkWithLoader
        href={e.link ? e.link : `/post/${e.id}`}
        key={`${e.board_id}-${i}`}
        className="inline-flex h-6 items-center justify-between gap-2 w-full "
      >
        <div className="flex h-6 grow gap-2 overflow-hidden items-center">
          {isShowRank && e.rank && (
            <div
              className={`w-6 flex-shrink-0 font-nexon text-sm font-medium leading-normal px-1.5 py-0 rounded-md flex items-center justify-center
            ${
              e.rank <= 3
                ? 'bg-primary text-white'
                : 'bg-slate-200 text-text-secondary'
            }`}
            >
              {e.rank}
            </div>
          )}
          {e.name ? (
            <div className="flex-shrink-0 font-nexon text-sm font-medium leading-normal text-primary">
              [{e.name.replace('게시판', '')}]
            </div>
          ) : null}
          <div className="truncate font-nexon text-sm font-normal leading-normal text-text-tertiary whitespace-nowrap">
            {e.title}
          </div>
          {isShowComment && e.comment_count && e.comment_count > 0 ? (
            <div className="flex-shrink-0 flex items-center gap-0.5 bg-gray-100 rounded-lg p-1 ">
              <CommentIcon className="fill-primary" />
              <div className=" font-nexon text-[13px] font-medium leading-normal text-primary">
                {e.comment_count}
              </div>
            </div>
          ) : null}
          {isShowLike && e.like_count && e.like_count > 0 ? (
            <div className="flex-shrink-0 flex items-center gap-0.5 bg-gray-100 rounded-lg p-1">
              <Image src={normalizeImageSrc("/icons/thumbs-up-primary.svg")} alt="like" width={16} height={16} className="w-4 h-4" />
              <div className=" font-nexon text-[13px] font-medium leading-normal text-primary">
                {e.like_count}
              </div>
            </div>
          ) : null}
        </div>
        {isShowDate && (
          <div className="hidden sm:flex flex-shrink-0 font-nexon text-sm font-normal leading-normal text-text-secondary">
            {e.created_at}
          </div>
        )}
      </LinkWithLoader>
    );
  });
}
