'use client';

import LinkWithLoader from '@common/LinkWithLoader';
import { useAuth } from '@hooks/User/useAuth';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch } from '@hooks/common';
import { useGlobalPopup } from '@hooks/common/useGlobalPopup';
import BoardMovePopup from '@molecules/BoardMovePopup';
import PopOver from '@molecules/PopOver';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { useQueryClient } from '@tanstack/react-query';
import { optimizeImageSrc, getImageProps } from '@util/imageUtil';
import Image from "next/image";
import React, { useRef, useState } from 'react';

interface GalleryCardProps {
  id: number;
  title: string;
  commentCount?: number;
  likeCount?: number;
  thumbnailImage?: string;
  isHighlighted?: boolean;
  currentPage?: number;
  isBookmark?: boolean;
  boardId?: number;
  onDeleteBookmark?: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  id,
  title,
  likeCount = 0,
  commentCount = 0,
  thumbnailImage = '/images/main/gallery-thumbnail.png',
  isHighlighted = false,
  currentPage,
  isBookmark = false,
  boardId,
  onDeleteBookmark,
}) => {
  const { isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const { deleteBookmarkPost, deletePost } = usePostCommand();
  const { confirm, popup } = useGlobalPopup();
  const queryClient = useQueryClient();
  const [showPopOver, setShowPopOver] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleBookmarkDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = await confirm(
      '이 게시글을 북마크에서 삭제하시겠습니까?',
      '북마크 삭제'
    );
    
    if (!confirmed) {
      return;
    }
    
    const response = await deleteBookmarkPost(id);
    if (response.successOrNot === 'Y' && onDeleteBookmark) {
      onDeleteBookmark();
    }
  };

  const handleMove = () => {
    // 게시글 이동 팝업 표시
    popup({
      title: '게시글 이동',
      content: (
        <BoardMovePopup
          postId={id}
          postTitle={title}
          currentBoardId={boardId || 0}
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
    <div className="relative">
      <LinkWithLoader
        href={`/post/${id}?page=${currentPage || 1}`}
        className={`cursor-pointer hover:scale-105 transition-all duration-300 w-full pb-5 rounded-2xl shadow-custom border border-[#e5e5e8] flex-col justify-center items-center gap-2 inline-flex overflow-hidden ${
          isHighlighted ? 'bg-[#FFEDD5]' : 'bg-white'
        }`}
      >
      <div className="w-[306px] h-[174px] bg-gray-100 flex items-center justify-center overflow-hidden relative">
        <Image
          className="max-h-full w-auto object-contain"
          src={optimizeImageSrc(thumbnailImage, 'lg')}
          alt="thumbnail"
          fill
          sizes="306px"
          {...getImageProps(thumbnailImage)}
        />
        {isBookmark && (
          <button
            onClick={handleBookmarkDelete}
            className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
            aria-label="북마크 삭제"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                fill="#F37021"
                stroke="#F37021"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {isAdmin() && !isBookmark && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPopOver(!showPopOver);
            }}
            className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded transition-colors shadow-sm z-10"
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
      <div className="w-full px-2 py-1 flex-col justify-center items-center flex overflow-hidden">
        <div className="w-full justify-start items-center gap-1 inline-flex">
          <div className="text-[#545456] text-sm font-medium font-nexon leading-normal truncate">
            {title}
          </div>
          <div className="self-stretch justify-between items-center inline-flex">
            <div className="flex items-center gap-2">
              {commentCount > 0 && (
                <div className="shrink-0 justify-start items-center gap-0.5 flex">
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
              )}
              {likeCount > 0 && (
                <div className="shrink-0 justify-start items-center gap-0.5 flex">
                  <div data-svg-wrapper className="relative">
                    <Image
                      alt="recommend"
                      width={16}
                      height={16}
                      src={optimizeImageSrc("/icons/thumbs-up-primary.svg")}
                    />
                  </div>
                  <div className="text-primary text-[13px] font-medium font-nexon leading-normal">
                    {likeCount}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      </LinkWithLoader>
      
      {showPopOver && isAdmin() && (
        <div className="absolute top-2 right-2 z-50">
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

export default GalleryCard;
