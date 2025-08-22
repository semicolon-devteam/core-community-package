'use client';

import PopOver from '@molecules/PopOver';
import BoardMovePopup from '@molecules/BoardMovePopup';
import { useAuth } from '@hooks/User/useAuth';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch, useRouterWithLoader } from '@hooks/common';
import { useGlobalPopup } from '@hooks/common/useGlobalPopup';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { Column } from '@atoms/Column/column.model';

interface AdminMenuProps {
  column: Column;
  row: {
    id: number;
    title?: string;
    board_id?: number;
    [key: string]: any;
  };
}

export default function AdminMenu({ row }: AdminMenuProps) {
  const { isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouterWithLoader();
  const { deletePost } = usePostCommand();
  const { confirm, popup } = useGlobalPopup();
  const queryClient = useQueryClient();
  const [showPopOver, setShowPopOver] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Admin이 아닌 경우 아무것도 렌더링하지 않음
  if (!isAdmin()) {
    return <div className="w-full h-full" />;
  }

  const handleMove = () => {
    // 게시글 이동 팝업 표시
    popup({
      title: '게시글 이동',
      content: (
        <BoardMovePopup
          postId={row.id}
          postTitle={row.title || '제목 없음'}
          currentBoardId={row.board_id || 0}
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
      const response = await deletePost(row.id);
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

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
    
    setShowPopOver(!showPopOver);
  };

  return (
    <>
      <div className="w-full h-full flex items-center justify-center relative">
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="관리 메뉴"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="5" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="19" r="2" fill="currentColor" />
          </svg>
        </button>
      </div>
      
      {showPopOver && buttonRect && createPortal(
        <div 
          className="fixed z-[9999]"
          style={{
            top: buttonRect.bottom + 4,
            left: buttonRect.right - 150,
          }}
        >
          <PopOver
            menuRef={menuRef}
            buttons={menuButtons}
            setShowPopOver={setShowPopOver}
            headerLabel="게시글 관리"
          />
        </div>,
        document.body
      )}
    </>
  );
}