'use client';

import LinkWithLoader from '@common/LinkWithLoader';
import PopOver from '@molecules/PopOver';
import BoardMovePopup from '@molecules/BoardMovePopup';
import { useAppSelector } from '@hooks/common';
import { useAuth } from '@hooks/User/useAuth';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch, useRouterWithLoader } from '@hooks/common';
import { useGlobalPopup } from '@hooks/common/useGlobalPopup';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { useQueryClient } from '@tanstack/react-query';
import type { ListPost } from '../../../../types/post';
import { useRef, useState } from 'react';

interface SearchPostItemProps {
  Post: ListPost;
  boardName?: string;
}

// HTML 태그를 제거하는 함수
const stripHtmlTags = (html: string) => {
  // 이미지 태그 제거
  const withoutImages = html.replace(/<img[^>]*>/g, '');
  // Markdown 이미지 문법 제거
  const withoutMarkdownImages = withoutImages.replace(/!\[.*?\]\(.*?\)/g, '');
  const tmp = document.createElement('DIV');
  tmp.innerHTML = withoutMarkdownImages;
  return tmp.textContent || tmp.innerText || '';
};

export default function SearchPostItem({ Post }: SearchPostItemProps) {
  const { isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouterWithLoader();
  const { deletePost } = usePostCommand();
  const { confirm, popup } = useGlobalPopup();
  const queryClient = useQueryClient();
  const [showPopOver, setShowPopOver] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const boards = useAppSelector(state => state.board.boards);
  const board = boards.find(board => board.id === (Post.board_id || 0));
  const boardName = board?.name || '게시판';

  const handleMove = () => {
    // 게시글 이동 팝업 표시
    popup({
      title: '게시글 이동',
      content: (
        <BoardMovePopup
          postId={Post.id}
          postTitle={Post.title}
          currentBoardId={Post.board_id || 0}
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
      const response = await deletePost(Post.id);
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
      <LinkWithLoader href={`/post/${Post.id}`} className="w-full">
        <div className="w-full py-4 border-b border-[#e5e5e8] flex gap-4">
          {Post.metadata?.thumbnail && (
            <div className="flex-shrink-0 relative">
              <img
                src={Post.metadata.thumbnail}
                alt="thumbnail"
                className="w-24 h-24 object-cover rounded"
              />
              {isAdmin() && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPopOver(!showPopOver);
                  }}
                  className="absolute top-1 right-1 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded transition-colors shadow-sm"
                  title="관리 메뉴"
                >
                  <svg
                    width="12"
                    height="12"
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
          )}
        <div className="flex-grow flex flex-col gap-3">
          <div className="w-full justify-between items-center inline-flex">
            <div className="w-full h-6 justify-between items-center flex">
              <div className="text-center text-default text-base font-medium font-nexon leading-normal truncate">
                {Post.title}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center text-tertiary text-sm font-normal font-nexon leading-normal whitespace-nowrap">
                  {boardName}
                </div>
                {isAdmin() && !Post.metadata?.thumbnail && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPopOver(!showPopOver);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
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
            </div>
          </div>
          <div className="w-full text-default text-sm font-normal font-nexon leading-normal line-clamp-2">
            {stripHtmlTags(Post.content || '')}
          </div>
          <div className="w-full justify-between items-center inline-flex">
            <div className="justify-start items-center gap-1 flex">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-border-default">
                <img
                  className="w-full h-full object-cover"
                  src={Post.writer_avatar ?? '/icons/user-profile.svg'}
                  alt={Post.writer_nickname || '익명'}
                />
              </div>

              <div className="text-center text-default text-sm font-medium font-nexon leading-normal">
                {Post.writer_nickname || '익명'}
              </div>
              <div className="text-center text-tertiary text-[13px] font-normal font-nexon leading-normal">
                님
              </div>
            </div>
            <div className="justify-start items-center gap-2 flex">
              <div className="justify-center items-center gap-0.5 flex">
                <div data-svg-wrapper className="relative">
                  <img
                    className="w-6 h-6"
                    src="/icons/created-time-icon.svg"
                    alt="created-time-icon"
                  />
                </div>
                <div className="text-center text-[#8f8f91] text-sm font-normal font-nexon leading-normal">
                  {Post.created_at || '날짜 없음'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LinkWithLoader>
      
      {showPopOver && isAdmin() && (
        <div className="absolute top-4 right-4 z-50">
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
