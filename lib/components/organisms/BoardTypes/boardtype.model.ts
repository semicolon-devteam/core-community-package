import type { GalleryListItem, ListPost } from '../../../types/post';

export type BoardType = 'list' | 'gallery' | 'money' | 'content' | 'search';

export interface BaseBoardProps {
  posts: GalleryListItem[];
  currentPage?: number;
  pageSize?: number;
  highlightId?: number;
  totalCount?: number;
  notices?: ListPost[];
  isFetching?: boolean;
}

export interface ListBoardProps extends BaseBoardProps {
  totalCount?: number;
}

export interface GalleryBoardProps extends BaseBoardProps {
  totalCount?: number;
}

export interface ContentBoardProps extends BaseBoardProps {
  totalCount?: number;
}

export interface SearchBoardProps extends BaseBoardProps {
  totalCount?: number;
}
