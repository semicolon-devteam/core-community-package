'use client';

import LinkWithLoader from '@common/LinkWithLoader';
import { useAuth } from '@hooks/User/useAuth';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch, useRouterWithLoader } from '@hooks/common';
import { useGlobalPopup } from '@hooks/common/useGlobalPopup';
import BoardMovePopup from '@molecules/BoardMovePopup';
import PopOver from '@molecules/PopOver';
import type { ContentBoardProps } from '@organisms/BoardTypes/boardtype.model';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { useQueryClient } from '@tanstack/react-query';
import { timeAgo } from '@util/dateUtil';
import { optimizeImageSrc } from '@util/imageUtil';
import { useRef, useState } from 'react';
import { Skeleton } from '@atoms/Skeleton';

export default function ContentBoard({
  posts,
  highlightId,
  currentPage,
  isFetching = false,
  pageSize = 6,
}: ContentBoardProps) {
  const hasData = posts && posts.length > 0;
  const showSkeleton = isFetching && hasData;
  const skeletonCount = hasData ? posts.length : pageSize;

  return (
    <div className="w-full flex-col justify-center items-center gap-3 sm:gap-5 flex">
      <div className="w-full flex-col justify-start items-start gap-2 inline-flex">
        {showSkeleton
          ? Array(skeletonCount)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={`content-skeleton-${idx}`}
                  className="w-full self-stretch p-5 rounded-2xl shadow-custom border border-[#e5e5e8] bg-white items-between gap-5 inline-flex"
                >
                  <div className="w-[226px] h-[152px] rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="h-[152px] flex-1 flex flex-col justify-between items-start">
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <div className="flex flex-col gap-1 mt-1">
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <Skeleton className="h-3 w-16" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
          : posts.map(item => (
              <ContentBoardItem
                key={item.id}
                {...item}
                commentCount={item.comment_count}
                image={item.metadata?.thumbnail || null}
                date={timeAgo(item.created_at || new Date().toISOString())}
                releaseDate={item.metadata?.releaseDate || ''}
                actors={item.metadata?.cast || ''}
                writer={item.users?.nickname || '익명'}
                isHighlighted={highlightId === item.id}
                currentPage={currentPage}
              />
            ))}
      </div>
    </div>
  );
}

interface ContentBoardItemProps {
  id: number;
  title: string;
  image: string | null;
  date: string;
  releaseDate: string;
  actors: string;
  writer: string;
  commentCount: number;
  isHighlighted: boolean;
  currentPage?: number;
  board_id?: number;
}

const ContentBoardItem = ({
  id,
  title,
  image,
  date,
  releaseDate,
  actors,
  commentCount,
  writer,
  isHighlighted,
  currentPage,
  board_id,
}: ContentBoardItemProps) => {
  const { isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouterWithLoader();
  const { deletePost } = usePostCommand();
  const { confirm, popup } = useGlobalPopup();
  const queryClient = useQueryClient();
  const [showPopOver, setShowPopOver] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const transformedImage = optimizeImageSrc(
    image ?? 'https://placehold.co/226x152',
    'md'
  );

  const handleMove = () => {
    // 게시글 이동 팝업 표시
    popup({
      title: '게시글 이동',
      content: (
        <BoardMovePopup
          postId={id}
          postTitle={title}
          currentBoardId={board_id || 0}
          onSuccess={() => {
            setShowPopOver(false);
          }}
        />
      ),
      showCancel: false,
      showConfirm: false,
      closable: true,
    });
    setShowPopOver(false);
  };

  const handleDelete = async () => {
    // usePostDetail의 handleDelete 참고하여 구현
    const isConfirmed = await confirm('정말 삭제하시겠습니까?', '게시글 삭제');
    if (isConfirmed) {
      const response = await deletePost(id);
      if (response.successOrNot === 'Y') {
        dispatch(
          showToast({
            title: '게시글 삭제 성공',
            content: '게시글이 삭제되었습니다.',
            headerTextColor: 'text-green-500',
          })
        );
        // posts 쿼리 무효화하여 refetch
        queryClient.invalidateQueries({ queryKey: ['post'] });
      } else {
        dispatch(
          showToast({
            title: '게시글 삭제 실패',
            content: (response as any).error || '삭제 중 오류가 발생했습니다.',
            headerTextColor: 'text-red-500',
          })
        );
      }
    }
    setShowPopOver(false);
  };

  const menuButtons = [
    {
      label: '이동',
      onClick: handleMove,
      enabled: true,
    },
    {
      label: '삭제',
      onClick: handleDelete,
      enabled: true,
      className: 'text-red-500 hover:bg-red-50',
    },
  ];

  return (
    <div className="w-full relative">
      <LinkWithLoader
        href={`/post/${id}?page=${currentPage || 1}`}
        className={`cursor-pointer hover:scale-105 transition-all duration-300 w-full self-stretch p-5 rounded-2xl shadow-custom border border-[#e5e5e8] items-between gap-5 inline-flex ${
          isHighlighted ? 'bg-[#FFEDD5]' : 'bg-white'
        }`}
      >
        <div className="w-[226px] h-[152px] rounded-lg bg-gray-200 overflow-hidden relative">
          <img
            src={transformedImage}
            className="w-full h-full object-cover"
            alt="thumbnail"
          />
          {isAdmin() && (
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setShowPopOver(!showPopOver);
              }}
              className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded transition-colors shadow-sm"
              title="관리 메뉴"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="5" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="19" r="2" fill="currentColor" />
              </svg>
            </button>
          )}
        </div>

        <div className=" h-[152px] flex-col justify-between items-start inline-flex flex-1">
          <div className="self-stretch h-[108px] flex-col justify-start items-start gap-1 flex">
            <div className="self-stretch justify-start items-center gap-1 inline-flex">
              <div className="text-tertiary text-md font-bold font-nexon leading-normal">
                {title}
              </div>
              <div className="justify-start items-center gap-0.5 flex">
                <div data-svg-wrapper className="relative">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14H11C11.932 14 12.398 14 12.7653 13.848C13.0081 13.7475 13.2286 13.6001 13.4144 13.4144C13.6001 13.2286 13.7475 13.0081 13.848 12.7653C14 12.398 14 11.932 14 11V8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2ZM5.33333 7.33333C5.33333 7.15652 5.40357 6.98695 5.5286 6.86193C5.65362 6.7369 5.82319 6.66667 6 6.66667H10C10.1768 6.66667 10.3464 6.7369 10.4714 6.86193C10.5964 6.98695 10.6667 7.15652 10.6667 7.33333C10.6667 7.51014 10.5964 7.67971 10.4714 7.80474C10.3464 7.92976 10.1768 8 10 8H6C5.82319 8 5.65362 7.92976 5.5286 7.80474C5.40357 7.67971 5.33333 7.51014 5.33333 7.33333ZM7.33333 10C7.33333 9.82319 7.40357 9.65362 7.5286 9.5286C7.65362 9.40357 7.82319 9.33333 8 9.33333H10C10.1768 9.33333 10.3464 9.40357 10.4714 9.5286C10.5964 9.65362 10.6667 9.82319 10.6667 10C10.6667 10.1768 10.5964 10.3464 10.4714 10.4714C10.3464 10.5964 10.1768 10.6667 10 10.6667H8C7.82319 10.6667 7.65362 10.5964 7.5286 10.4714C7.40357 10.3464 7.33333 10.1768 7.33333 10Z"
                      fill="#F37021"
                    />
                  </svg>
                </div>
                <div className="text-primary text-[13px] font-medium font-nexon leading-normal">
                  {commentCount}
                </div>
              </div>
            </div>
            <div className="self-stretch h-20 flex-col justify-start items-start gap-1 flex">
              <div className="text-tertiary text-sm font-normal font-nexon leading-normal">
                출연진 : {actors}
              </div>
              <div className="text-tertiary text-sm font-normal font-nexon leading-normal">
                출시일 : {releaseDate}
              </div>
            </div>
          </div>
          <div className="self-stretch justify-between items-center inline-flex">
            <div className="text-[#8f8f91] text-sm font-normal font-nexon leading-normal">
              {date}
            </div>
            <div className="justify-center items-center gap-1 flex">
              <img
                className="w-6 h-6"
                src="https://placehold.co/24x24"
                alt="writer"
              />
              <div className="text-tertiary text-sm font-normal font-nexon leading-normal">
                {writer}
              </div>
            </div>
          </div>
        </div>
      </LinkWithLoader>

      {showPopOver && isAdmin() && (
        <div className="absolute top-5 right-5 mt-2 mr-2 z-50">
          <PopOver
            menuRef={menuRef}
            buttons={menuButtons}
            setShowPopOver={setShowPopOver}
            headerLabel="게시글 관리"
          />
        </div>
      )}
    </div>
  );
};
