import BaseService from './baseService';
import type { CommonResponse } from '../types/common';
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
export declare class BoardService extends BaseService<Board> {
    constructor(options?: BoardServiceOptions);
    /**
     * Get list of all boards
     */
    getBoards(options?: BoardListOptions): Promise<CommonResponse<Board[]>>;
    /**
     * Get board by ID
     */
    getBoard(boardId: number): Promise<CommonResponse<Board>>;
    /**
     * Create new board (admin only)
     */
    createBoard(data: BoardCreateData): Promise<CommonResponse<Board>>;
    /**
     * Update board (admin only)
     */
    updateBoard(boardId: number, data: BoardUpdateData): Promise<CommonResponse<Board>>;
    /**
     * Delete board (admin only)
     */
    deleteBoard(boardId: number): Promise<CommonResponse<void>>;
    /**
     * Get board categories
     */
    getBoardCategories(boardId: number): Promise<CommonResponse<BoardCategory[]>>;
    /**
     * Create board category (admin only)
     */
    createBoardCategory(boardId: number, data: BoardCategoryCreateData): Promise<CommonResponse<BoardCategory>>;
    /**
     * Update board category (admin only)
     */
    updateBoardCategory(boardId: number, categoryId: number, data: Partial<BoardCategoryCreateData>): Promise<CommonResponse<BoardCategory>>;
    /**
     * Delete board category (admin only)
     */
    deleteBoardCategory(boardId: number, categoryId: number): Promise<CommonResponse<void>>;
    /**
     * Get board statistics
     */
    getBoardStats(boardId: number): Promise<CommonResponse<BoardStats>>;
    /**
     * Search boards by keyword
     */
    searchBoards(keyword: string, page?: number, pageSize?: number): Promise<CommonResponse<{
        boards: Board[];
        totalCount: number;
    }>>;
    /**
     * Get popular boards
     */
    getPopularBoards(limit?: number): Promise<CommonResponse<Board[]>>;
    /**
     * Get recently active boards
     */
    getRecentlyActiveBoards(limit?: number): Promise<CommonResponse<Board[]>>;
    /**
     * Get user's favorite boards
     */
    getFavoriteBoards(): Promise<CommonResponse<Board[]>>;
    /**
     * Add board to favorites
     */
    addToFavorites(boardId: number): Promise<CommonResponse<void>>;
    /**
     * Remove board from favorites
     */
    removeFromFavorites(boardId: number): Promise<CommonResponse<void>>;
    /**
     * Get board permissions for current user
     */
    getBoardPermissions(boardId: number): Promise<CommonResponse<{
        canRead: boolean;
        canWrite: boolean;
        canComment: boolean;
        canModerate: boolean;
        requiredLevel: number;
    }>>;
    /**
     * Update board permissions (admin only)
     */
    updateBoardPermissions(boardId: number, permissions: {
        readLevel?: number;
        writeLevel?: number;
        commentLevel?: number;
        allowAnonymous?: boolean;
    }): Promise<CommonResponse<void>>;
    /**
     * Get board moderators
     */
    getBoardModerators(boardId: number): Promise<CommonResponse<{
        id: string;
        nickname: string;
        profileImage?: string;
        level: number;
    }[]>>;
    /**
     * Add board moderator (admin only)
     */
    addBoardModerator(boardId: number, userId: string): Promise<CommonResponse<void>>;
    /**
     * Remove board moderator (admin only)
     */
    removeBoardModerator(boardId: number, userId: string): Promise<CommonResponse<void>>;
    /**
     * Report board content or issue
     */
    reportBoard(boardId: number, reason: string, description?: string): Promise<CommonResponse<void>>;
    /**
     * Get board activity feed
     */
    getBoardActivity(boardId: number, page?: number, pageSize?: number): Promise<CommonResponse<{
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
    }>>;
}
declare const boardService: {
    getBoards(): Promise<CommonResponse<Board[]>>;
    getBoard(boardId: number): Promise<CommonResponse<Board>>;
    getBoardCategories(boardId: number): Promise<CommonResponse<BoardCategory[]>>;
};
export { boardService };
export default BoardService;
