import BaseService, { baseService } from './baseService';
import type { CommonResponse, Pagination } from '../types/common';
import type { Board, BoardCategory, SearchType, SortBy } from '../types/board';

/**
 * Board service interfaces and types
 */
export interface BoardServiceOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

export interface BoardListOptions {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
  searchText?: string;
  searchType?: SearchType;
  isActive?: boolean;
  categoryId?: number;
}

export interface BoardCreateData {
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  allowAnonymous?: boolean;
  allowAttachment?: boolean;
  requirePoints?: number;
  categoryIds?: number[];
  metadata?: {
    icon?: string;
    color?: string;
    [key: string]: any;
  };
}

export interface BoardUpdateData {
  name?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  allowAnonymous?: boolean;
  allowAttachment?: boolean;
  requirePoints?: number;
  categoryIds?: number[];
  metadata?: {
    icon?: string;
    color?: string;
    [key: string]: any;
  };
}

export interface BoardCategoryCreateData {
  name: string;
  description?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface BoardStats {
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  activeUsers: number;
  lastActivity: string;
}

/**
 * Board Service Class
 * Handles all board-related API operations including board management,
 * categories, permissions, and statistics
 */
export class BoardService extends BaseService<Board> {
  constructor(options?: BoardServiceOptions) {
    super(options?.baseUrl || '/api/boards', options?.defaultHeaders);
  }

  /**
   * Get list of all boards
   */
  async getBoards(options: BoardListOptions = {}): Promise<CommonResponse<Board[]>> {
    const params: Record<string, string> = {};

    if (options.page) {
      params.page = options.page.toString();
    }
    if (options.pageSize) {
      params.pageSize = options.pageSize.toString();
    }
    if (options.sortBy) {
      params.sortBy = options.sortBy;
    }
    if (options.searchText) {
      params.searchText = options.searchText;
    }
    if (options.searchType) {
      params.searchType = options.searchType;
    }
    if (options.isActive !== undefined) {
      params.isActive = options.isActive.toString();
    }
    if (options.categoryId) {
      params.categoryId = options.categoryId.toString();
    }

    return this.getMini<Board[]>('/', '게시판 목록 로딩중...', { params });
  }

  /**
   * Get board by ID
   */
  async getBoard(boardId: number): Promise<CommonResponse<Board>> {
    return this.getMini<Board>(`/${boardId}`, '게시판 정보 로딩중...');
  }

  /**
   * Create new board (admin only)
   */
  async createBoard(data: BoardCreateData): Promise<CommonResponse<Board>> {
    return this.postMini<Board, BoardCreateData>('/', data, '게시판 생성중...');
  }

  /**
   * Update board (admin only)
   */
  async updateBoard(boardId: number, data: BoardUpdateData): Promise<CommonResponse<Board>> {
    return this.putMini<Board, BoardUpdateData>(`/${boardId}`, data, '게시판 수정중...');
  }

  /**
   * Delete board (admin only)
   */
  async deleteBoard(boardId: number): Promise<CommonResponse<void>> {
    return this.deleteMini<void>(`/${boardId}`, '게시판 삭제중...');
  }

  /**
   * Get board categories
   */
  async getBoardCategories(boardId: number): Promise<CommonResponse<BoardCategory[]>> {
    return this.getMini<BoardCategory[]>(`/${boardId}/categories`, '카테고리 로딩중...');
  }

  /**
   * Create board category (admin only)
   */
  async createBoardCategory(
    boardId: number, 
    data: BoardCategoryCreateData
  ): Promise<CommonResponse<BoardCategory>> {
    return this.postMini<BoardCategory, BoardCategoryCreateData>(
      `/${boardId}/categories`,
      data,
      '카테고리 생성중...'
    );
  }

  /**
   * Update board category (admin only)
   */
  async updateBoardCategory(
    boardId: number,
    categoryId: number,
    data: Partial<BoardCategoryCreateData>
  ): Promise<CommonResponse<BoardCategory>> {
    return this.putMini<BoardCategory, Partial<BoardCategoryCreateData>>(
      `/${boardId}/categories/${categoryId}`,
      data,
      '카테고리 수정중...'
    );
  }

  /**
   * Delete board category (admin only)
   */
  async deleteBoardCategory(boardId: number, categoryId: number): Promise<CommonResponse<void>> {
    return this.deleteMini<void>(`/${boardId}/categories/${categoryId}`, '카테고리 삭제중...');
  }

  /**
   * Get board statistics
   */
  async getBoardStats(boardId: number): Promise<CommonResponse<BoardStats>> {
    return this.getSilent<BoardStats>(`/${boardId}/stats`);
  }

  /**
   * Search boards by keyword
   */
  async searchBoards(
    keyword: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<CommonResponse<{ boards: Board[]; totalCount: number }>> {
    return this.get<{ boards: Board[]; totalCount: number }>('/search', {
      params: { keyword, page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Get popular boards
   */
  async getPopularBoards(limit: number = 10): Promise<CommonResponse<Board[]>> {
    return this.getSilent<Board[]>('/popular', {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get recently active boards
   */
  async getRecentlyActiveBoards(limit: number = 10): Promise<CommonResponse<Board[]>> {
    return this.getSilent<Board[]>('/recent-activity', {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get user's favorite boards
   */
  async getFavoriteBoards(): Promise<CommonResponse<Board[]>> {
    return this.getMini<Board[]>('/favorites', '즐겨찾기 게시판 로딩중...');
  }

  /**
   * Add board to favorites
   */
  async addToFavorites(boardId: number): Promise<CommonResponse<void>> {
    return this.postMini<void, object>(`/${boardId}/favorite`, {}, '즐겨찾기 추가중...');
  }

  /**
   * Remove board from favorites
   */
  async removeFromFavorites(boardId: number): Promise<CommonResponse<void>> {
    return this.deleteMini<void>(`/${boardId}/favorite`, '즐겨찾기 제거중...');
  }

  /**
   * Get board permissions for current user
   */
  async getBoardPermissions(boardId: number): Promise<CommonResponse<{
    canRead: boolean;
    canWrite: boolean;
    canComment: boolean;
    canModerate: boolean;
    requiredLevel: number;
  }>> {
    return this.getSilent<any>(`/${boardId}/permissions`);
  }

  /**
   * Update board permissions (admin only)
   */
  async updateBoardPermissions(
    boardId: number,
    permissions: {
      readLevel?: number;
      writeLevel?: number;
      commentLevel?: number;
      allowAnonymous?: boolean;
    }
  ): Promise<CommonResponse<void>> {
    return this.patchMini<void, typeof permissions>(
      `/${boardId}/permissions`,
      permissions,
      '권한 설정 업데이트 중...'
    );
  }

  /**
   * Get board moderators
   */
  async getBoardModerators(boardId: number): Promise<CommonResponse<{
    id: string;
    nickname: string;
    profileImage?: string;
    level: number;
  }[]>> {
    return this.get<any>(`/${boardId}/moderators`);
  }

  /**
   * Add board moderator (admin only)
   */
  async addBoardModerator(boardId: number, userId: string): Promise<CommonResponse<void>> {
    return this.postMini<void, { userId: string }>(
      `/${boardId}/moderators`,
      { userId },
      '모더레이터 추가중...'
    );
  }

  /**
   * Remove board moderator (admin only)
   */
  async removeBoardModerator(boardId: number, userId: string): Promise<CommonResponse<void>> {
    return this.deleteMini<void>(`/${boardId}/moderators/${userId}`, '모더레이터 제거중...');
  }

  /**
   * Report board content or issue
   */
  async reportBoard(
    boardId: number,
    reason: string,
    description?: string
  ): Promise<CommonResponse<void>> {
    return this.postMini<void, { reason: string; description?: string }>(
      `/${boardId}/report`,
      { reason, description },
      '신고 접수중...'
    );
  }

  /**
   * Get board activity feed
   */
  async getBoardActivity(
    boardId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<CommonResponse<{
    activities: Array<{
      type: 'post' | 'comment' | 'like' | 'share';
      postId?: number;
      userId: string;
      userName: string;
      timestamp: string;
      title?: string;
      content?: string;
    }>;
    totalCount: number;
  }>> {
    return this.get<any>(`/${boardId}/activity`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }
}

// Legacy support - functional interface (deprecated, use BoardService class instead)
const boardService = {
  getBoards(): Promise<CommonResponse<Board[]>> {
    const service = new BoardService();
    return service.getBoards();
  },

  getBoard(boardId: number): Promise<CommonResponse<Board>> {
    const service = new BoardService();
    return service.getBoard(boardId);
  },

  getBoardCategories(boardId: number): Promise<CommonResponse<BoardCategory[]>> {
    const service = new BoardService();
    return service.getBoardCategories(boardId);
  },
};

export { boardService };
export default BoardService;
