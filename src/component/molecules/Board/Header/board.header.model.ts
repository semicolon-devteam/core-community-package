import type { BoardCategory } from '@model/board';

export interface BoardHeaderProps {
  boardName?: string;
  category: BoardCategory[];
  totalCount: number;
  isGlobalSearch?: boolean;
  searchText?: string;
  boardCount?: number;
  totalPages?: number;
}
