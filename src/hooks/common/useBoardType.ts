import { useState, useEffect } from 'react';
import type { BoardType } from '@organisms/BoardTypes/boardtype.model';

const BOARD_TYPE_KEY = 'currentBoardType';

export function useBoardType() {
  const [boardType, setBoardTypeState] = useState<BoardType | null>(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 sessionStorage에서 boardType 읽기
    const storedType = sessionStorage.getItem(BOARD_TYPE_KEY);
    if (storedType) {
      setBoardTypeState(storedType as BoardType);
    }
  }, []);

  const setBoardType = (type: BoardType | null) => {
    setBoardTypeState(type);
    if (type) {
      sessionStorage.setItem(BOARD_TYPE_KEY, type);
    } else {
      sessionStorage.removeItem(BOARD_TYPE_KEY);
    }
  };

  return { boardType, setBoardType };
} 