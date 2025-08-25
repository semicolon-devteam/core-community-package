/**
 * Board 컴포넌트의 타입 정의
 */

import { ReactNode } from 'react';

// Board 카테고리 타입
export interface BoardCategory {
  id: number;
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

// Container 컴포넌트 Props
export interface BoardContainerProps {
  children: ReactNode;
  className?: string;
}

// Header 컴포넌트 Props
export interface BoardHeaderProps {
  boardName?: string;
  category: BoardCategory[];
  totalCount: number;
  isGlobalSearch?: boolean;
  searchText?: string;
  boardCount?: number;
  totalPages?: number;
  currentPage?: number;
  selectedCategoryId?: string | null;
  onCategoryChange?: (categoryId: string | null) => void;
}

// Pagination 컴포넌트 Props
export interface BoardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// Table Header Props
export interface BoardTableHeaderProps {
  columns: BoardTableColumn[];
  className?: string;
}

// Table Column 정의
export interface BoardTableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  hideOnMobile?: boolean; // 모바일에서 숨김 여부
  mobileWidth?: string;   // 모바일 전용 너비 (hideOnMobile이 false일 때 사용)
}

// Table Row Props
export interface BoardTableRowProps {
  data: Record<string, any>;
  columns: BoardTableColumn[];
  onClick?: () => void;
  className?: string;
}

// Wrapper 컴포넌트 Props
export interface BoardWrapperProps {
  children: ReactNode;
  className?: string;
}

// Search Box Props
export interface BoardSearchBoxProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

// Board Post Item (Table Row Data)
export interface BoardPostItem {
  id: number;
  title: string;
  content?: string;
  author: string;
  authorId?: string;
  createdAt: string;
  updatedAt?: string;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  category?: BoardCategory;
  thumbnail?: string;
  isPinned?: boolean;
  isNotice?: boolean;
  status?: 'published' | 'draft' | 'deleted';
}

// Board 리스트 응답 타입
export interface BoardListResponse {
  posts: BoardPostItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Board 필터 타입
export interface BoardFilters {
  categoryId?: number;
  searchText?: string;
  searchType?: 'title' | 'content' | 'author' | 'all';
  sortBy?: 'latest' | 'popular' | 'comments';
  page?: number;
  pageSize?: number;
}