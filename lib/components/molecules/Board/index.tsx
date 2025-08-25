'use client';

import BoardContainer from './Container';
import BoardHeader from './Header';
import BoardPagination from './Pagination';
import BoardTable from './Table';
import BoardWrapper from './Wrapper';

// Export types
export type {
  BoardCategory,
  BoardContainerProps,
  BoardHeaderProps,
  BoardPaginationProps,
  BoardTableHeaderProps,
  BoardTableColumn,
  BoardTableRowProps,
  BoardWrapperProps,
  BoardSearchBoxProps,
  BoardPostItem,
  BoardListResponse,
  BoardFilters,
} from './types';

// Export individual components
export { default as BoardContainer } from './Container';
export { default as BoardHeader } from './Header';
export { default as BoardPagination } from './Pagination';
export { default as BoardTable } from './Table';
export { default as BoardWrapper } from './Wrapper';

/**
 * Board 컴포넌트 집합
 * 게시판 UI를 위한 모든 컴포넌트를 포함합니다.
 * 
 * @example
 * ```tsx
 * import { Board } from '@semicolon/community-core';
 * 
 * <Board.Wrapper>
 *   <Board.Container>
 *     <Board.Header 
 *       boardName="자유게시판" 
 *       category={categories} 
 *       totalCount={100} 
 *     />
 *     <Board.Table.Content>
 *       <Board.Table.Header columns={columns} />
 *       <Board.Table.Body data={posts} />
 *     </Board.Table.Content>
 *     <Board.Pagination 
 *       currentPage={1} 
 *       totalPages={10} 
 *       onPageChange={handlePageChange} 
 *     />
 *   </Board.Container>
 * </Board.Wrapper>
 * ```
 */
const Board = {
  Container: BoardContainer,
  Header: BoardHeader,
  Table: BoardTable,
  Pagination: BoardPagination,
  Wrapper: BoardWrapper,
};

export default Board;
