"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { BoardType } from '@organisms/BoardTypes/boardtype.model';

interface BoardTypeContextType {
  boardType: BoardType | null;
  setBoardType: (type: BoardType | null) => void;
}

const BoardTypeContext = createContext<BoardTypeContextType | undefined>(undefined);

export function BoardTypeProvider({ children }: { children: ReactNode }) {
  const [boardType, setBoardType] = useState<BoardType | null>(null);

  return (
    <BoardTypeContext.Provider value={{ boardType, setBoardType }}>
      {children}
    </BoardTypeContext.Provider>
  );
}

export function useBoardType() {
  const context = useContext(BoardTypeContext);
  if (context === undefined) {
    throw new Error('useBoardType must be used within a BoardTypeProvider');
  }
  return context;
} 