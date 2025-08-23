"use client";

import CommentIcon from "@atoms/Icon/CommentIcon";
import LikeIcon from "@atoms/Icon/LikeIcon";
import { Skeleton } from "@atoms/Skeleton";
import LinkWithLoader from "@common/LinkWithLoader";
import { useSafeGlobalLoader } from "@hooks/common";
import type { WithoutBoardNamePost } from '../../../../types/board';

export default function WithoutBoardName({
  postItem,
  boardName,
  isShowDate = true,
  isShowComment = true,
  isShowLike = false,
  isLoading = false,
  skeletonCount = 5,
}: {
  postItem: WithoutBoardNamePost[];
  boardName: string;
  isShowDate?: boolean;
  isShowComment?: boolean;
  isShowLike?: boolean;
  isLoading?: boolean;
  skeletonCount?: number;
}) {
  const { showLoader } = useSafeGlobalLoader();

  const hasData = Array.isArray(postItem) && postItem.length > 0;
  const showSkeleton = isLoading && hasData;
  const effectiveSkeletonCount = hasData ? postItem.length : skeletonCount;

  if (showSkeleton) {
    return Array(effectiveSkeletonCount)
      .fill(0)
      .map((_, i) => (
        <div
          key={`skeleton-${boardName}-${i}`}
          className="inline-flex h-6 items-center justify-between gap-2 w-full"
        >
          <div className="flex h-6 grow gap-2 overflow-hidden items-center">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex h-6 shrink-0 items-center">
            <Skeleton className="h-4 w-16" />
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

  return postItem.map((e: WithoutBoardNamePost, i: number) => (
    <LinkWithLoader
      href={`/post/${e.id}`}
      key={`${boardName}-${i}`}
      className="inline-flex h-6 items-center justify-between gap-2 w-full"
    >
      <div className="flex h-6 grow gap-1 overflow-hidden items-center">
        <div className="truncate text-sm font-medium text-gray-800">{e.title}</div>
        {isShowComment && e.comment_count > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-lg p-1">
            <CommentIcon />
            <span>{e.comment_count}</span>
          </div>
        )}
        {isShowLike && e.like_count !== undefined && e.like_count !== null && e.like_count > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-lg p-1">
            <LikeIcon />
            <span>{e.like_count}</span>
          </div>
        )}
      </div>
      <div className="flex h-6 shrink-0 items-center gap-2 text-xs text-gray-500">
        {isShowDate && <div className="text-xs text-gray-500">{e.created_at}</div>}
      </div>
    </LinkWithLoader>
  ));
}
