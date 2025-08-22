'use client';

import CustomSelect, { SelectOption } from '@atoms/CustomSelect';
import { useAuth } from '@hooks/User/useAuth';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch } from '@hooks/common';
import { useGlobalPopup } from '@hooks/common/useGlobalPopup';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { useQueryClient } from '@tanstack/react-query';
import boardService from '@services/boardService';
import type { Board } from '@model/board';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface BoardMovePopupProps {
  postId: number;
  postTitle: string;
  currentBoardId: number;
  onSuccess?: () => void;
}

export default function BoardMovePopup({
  postId,
  postTitle,
  currentBoardId,
  onSuccess,
}: BoardMovePopupProps) {
  const { isAdmin } = useAuth();
  const { movePost } = usePostCommand();
  const { confirm, closeAll } = useGlobalPopup();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const adminStatus = isAdmin(); // isAdmin() 결과를 캐시

  // 게시판 목록 로드 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    if (!adminStatus) {
      setIsLoading(false);
      return;
    }
    
    let isCancelled = false;
    
    const loadBoards = async () => {
      try {
        const response = await boardService.getBoards();
        if (!isCancelled && response.successOrNot === 'Y' && response.data) {
          // 현재 게시판은 제외하고 보여주기
          const filteredBoards = response.data.filter(board => board.id !== currentBoardId);
          setBoards(filteredBoards);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('게시판 목록 로드 실패:', error);
          dispatch(
            showToast({
              title: '오류',
              content: '게시판 목록을 불러올 수 없습니다.',
              headerTextColor: 'text-red-500',
            })
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadBoards();

    return () => {
      isCancelled = true;
    };
  }, []); // 의존성 배열을 비워서 마운트 시 한 번만 실행

  // admin이 아닌 경우 아무것도 렌더링하지 않음
  if (!adminStatus) {
    return null;
  }

  const boardOptions = useMemo(() => 
    boards.map(board => ({
      id: board.id,
      label: board.name,
      value: board.id,
    })), [boards]
  );

  const selectedBoard = useMemo(() => 
    boards.find(board => board.id === selectedBoardId), 
    [boards, selectedBoardId]
  );

  const handleMove = async () => {
    if (!selectedBoard) {
      dispatch(
        showToast({
          title: '선택 필요',
          content: '이동할 게시판을 선택해주세요.',
          headerTextColor: 'text-orange-500',
        })
      );
      return;
    }

    const isConfirmed = await confirm(
      `"${postTitle}" 게시글을 "${selectedBoard.name}" 게시판으로 이동하시겠습니까?`,
      '게시글 이동'
    );

    if (isConfirmed) {
      try {
        const response = await movePost(postId, selectedBoard.id);
        if (response.successOrNot === 'Y') {
          dispatch(
            showToast({
              title: '이동 완료',
              content: `게시글이 "${selectedBoard.name}" 게시판으로 이동되었습니다.`,
              headerTextColor: 'text-green-500',
            })
          );
          // posts 쿼리 무효화하여 refetch
          queryClient.invalidateQueries({ queryKey: ['post'] });
          // 팝업 닫기
          closeAll();
          onSuccess?.();
        } else {
          dispatch(
            showToast({
              title: '이동 실패',
              content: response.message || '게시글 이동 중 오류가 발생했습니다.',
              headerTextColor: 'text-red-500',
            })
          );
        }
      } catch (error) {
        console.error('게시글 이동 실패:', error);
        dispatch(
          showToast({
            title: '이동 실패',
            content: '게시글 이동 중 오류가 발생했습니다.',
            headerTextColor: 'text-red-500',
          })
        );
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">게시글 이동</h3>
        <p className="text-sm text-gray-600 mb-4">
          "{postTitle}" 게시글을 다른 게시판으로 이동합니다.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이동할 게시판 선택
        </label>
        {isLoading ? (
          <div className="h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-sm text-gray-500">게시판 목록 로딩중...</span>
          </div>
        ) : (
          <CustomSelect
            options={boardOptions}
            value={selectedBoardId}
            onChange={(option) => setSelectedBoardId(option.value)}
            placeholder="게시판을 선택해주세요"
            className="w-full"
          />
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleMove}
          disabled={!selectedBoardId || isLoading}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          이동하기
        </button>
      </div>
    </div>
  );
}