'use client';

import CommentIcon from '@atoms/Icon/CommentIcon';
import LinkWithLoader from '@common/LinkWithLoader';
import { useAuth } from '@hooks/User/useAuth';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch } from '@hooks/common';
import { useGlobalPopup } from '@hooks/common/useGlobalPopup';
import type { GalleryItem } from '@model/board';
import BoardMovePopup from '@molecules/BoardMovePopup';
import PopOver from '@molecules/PopOver';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { useQueryClient } from '@tanstack/react-query';
import { normalizeImageSrc, optimizeImageSrc } from '@util/imageUtil';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function Gallery({
  title,
  image,
  comment_count,
  like_count,
  id,
  currentPage,
  boardId,
}: GalleryItem & { currentPage: number; boardId?: number }) {
  const { isAdmin } = useAuth();

  const dispatch = useAppDispatch();
  const { deletePost } = usePostCommand();
  const { confirm, popup } = useGlobalPopup();
  const queryClient = useQueryClient();
  const [showPopOver, setShowPopOver] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const transformedImage = optimizeImageSrc(image, 'md');

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
    <div className="flex-1 min-w-0 flex-col justify-start items-center gap-2 inline-flex relative">
      <LinkWithLoader
        href={`/post/${id}?page=${currentPage}`}
        className="w-full cursor-pointer hover:underline"
      >
        <div className="w-full h-[124px] rounded overflow-hidden bg-gray-100 flex items-center justify-center relative">
          <img
            className="max-h-full w-auto object-contain"
            src={transformedImage}
            alt="갤러리 이미지"
            loading="lazy"
          />
          {isAdmin() && (
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setShowPopOver(!showPopOver);
              }}
              className="absolute top-1 right-1 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded transition-colors shadow-sm z-10"
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
      </LinkWithLoader>
      <div className="w-full justify-start items-center gap-1 inline-flex">
        <div className="grow shrink basis-0 text-[#545456] text-sm font-medium font-nexon leading-normal whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </div>
        {comment_count > 0 && (
          <div className="justify-start items-center gap-0.5 flex flex-shrink-0 bg-gray-100 rounded-lg p-1">
            <CommentIcon className="fill-primary" />
            <div className="text-primary text-[13px] font-medium font-nexon leading-normal no-underline">
              {comment_count}
            </div>
          </div>
        )}
        {like_count > 0 && (
          <div className="justify-start items-center gap-0.5 flex flex-shrink-0 bg-gray-100 rounded-lg p-1">
            <Image
              src={normalizeImageSrc("/icons/thumbs-up-primary.svg")}
              alt="like"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <div className="text-primary text-[13px] font-medium font-nexon leading-normal no-underline">
              {like_count}
            </div>
          </div>
        )}
      </div>

      {showPopOver && isAdmin() && (
        <div className="absolute top-0 right-0 mt-1 mr-1 z-50">
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
}
