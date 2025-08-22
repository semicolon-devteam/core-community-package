'use client';

import type { Column } from '@atoms/Column/column.model';
import { generateGridClasses } from '@atoms/Column/column.model';
import CommentIcon from '@atoms/Icon/CommentIcon';
import ImageIcon from '@atoms/Icon/ImageIcon';
import LikeIcon from '@atoms/Icon/LikeIcon';
import LinkWithLoader from '@common/LinkWithLoader';

export default function TitleWithComment({
  column,
  row,
}: {
  column: Column;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
}) {
  const gridClasses = generateGridClasses(column.gridLayout);
  const calculatedLikeCount = row.like_count - row.dislike_count;
  return (
    <div
      className={`${gridClasses} h-8 sm:h-11 py-2 sm:py-2.5 justify-${column.justify} items-${column.align} flex relative overflow-hidden`}
    >
      <div className="flex items-center gap-1 w-full overflow-hidden">
        <LinkWithLoader
          href={`/post/${row.id}?page=${row?.page}`}
          className={`flex items-center w-full truncate text-xs justify-between md:justify-start sm:text-sm font-medium font-nexon leading-normal mr-1 hover:text-primary hover:underline transition-colors ${
            row.highlightText ? 'text-black' : 'text-text-tertiary'
          }`}
        >
          <div className="sm:flex-initial truncate">{row.title}</div>
          <div className="flex-shrink-0 flex items-center gap-0.5">
            {row.hasImage && (
              <span className="inline-flex items-center ml-1">
                <ImageIcon className="fill-current text-primary" size={14} />
              </span>
            )}
            {row.comment_count > 0 && (
              <div className="inline-flex items-center ml-1 text-primary text-xs sm:text-[13px] font-medium font-nexon leading-normal gap-0.5">
                <CommentIcon className="fill-current text-primary" size={14} />
                <span>{row.comment_count}</span>
              </div>
            )}
            {calculatedLikeCount > 0 && (
              <div className="inline-flex items-center ml-1 text-primary text-xs sm:text-[13px] font-medium font-nexon leading-normal gap-0.5">
                <LikeIcon className="fill-current text-primary" size={14} />
                <span>{calculatedLikeCount}</span>
              </div>
            )}
          </div>
        </LinkWithLoader>
        {row.comments && (
          <div className="flex-shrink-0 flex items-center gap-0.5">
            <div data-svg-wrapper className="relative">
              <CommentIcon className="fill-primary" />
            </div>
            <div className="text-primary text-xs sm:text-[13px] font-medium font-nexon leading-normal">
              {row.comments}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
