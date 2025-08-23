import BaseService from './baseService';
import type { CommonResponse } from '../types/common';
import type { SearchType, SortBy } from '../types/board';
import type { FileAttachment, GalleryListItem, Post, PostBookmark, PostDetail } from '../types/post';
/**
 * Post service interfaces and types
 */
export interface PostServiceOptions {
    baseUrl?: string;
    defaultHeaders?: Record<string, string>;
}
export interface PostListOptions {
    boardId: number;
    page: number;
    pageSize?: number;
    sortBy?: SortBy;
    searchType?: SearchType;
    searchText?: string;
    categoryId?: string | number | null;
    needNotice?: boolean;
    status?: 'published' | 'draft' | 'deleted';
    writerId?: number;
}
export interface PostCreateData {
    title: string;
    content: string;
    files?: File[];
    boardId: number;
    attachments?: FileAttachment[];
    downloadPoint?: number;
    metadata?: {
        thumbnail?: string | null;
        [key: string]: string | null;
    };
    categoryId?: number | null;
    isNotice?: boolean;
    hasFiles?: boolean;
}
export interface PostUpdateData {
    title?: string;
    content?: string;
    files?: File[];
    attachments?: FileAttachment[];
    downloadPoint?: number;
    metadata?: {
        thumbnail?: string | null;
        [key: string]: string | null;
    };
    categoryId?: number | null;
    isNotice?: boolean;
}
export interface PostDownloadHistory {
    expires_at: string;
    download_urls: FileAttachment[];
    message: string;
    point_deducted: number;
    success: boolean;
}
export interface DraftPostRequest {
    title: string;
    content: string;
    boardId: number;
    categoryId?: number;
}
export interface DraftPostResponse {
    id: number;
    title: string;
    content: string;
    status: 'DRAFT';
    createdAt: string;
}
export interface AsyncUploadConfig {
    needWatermark?: boolean;
    watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    watermarkOpacity?: number;
}
export interface UploadStartResponse {
    success: boolean;
    data: {
        uploadId: string;
        postId: number;
        totalFiles: number;
        estimatedDuration: number;
    };
    message: string;
}
export interface UploadProgressResponse {
    success: boolean;
    data: {
        postId: number;
        overallProgress: number;
        status: 'processing' | 'completed' | 'failed';
        totalFiles: number;
        completedFiles: number;
        files: FileAttachment[];
    };
    message: string;
}
/**
 * Post Service Class
 * Handles all post-related API operations including CRUD operations,
 * file uploads, async media processing, and bookmark management
 */
export declare class PostService extends BaseService<Post> {
    constructor(options?: PostServiceOptions);
    /**
     * Get post list with pagination and search options
     */
    getPostList(options: PostListOptions): Promise<CommonResponse<Post>>;
    /**
     * Get post by ID
     */
    getPostById(postId: number): Promise<CommonResponse<PostDetail>>;
    /**
     * Create new post (synchronous)
     */
    createPost(data: PostCreateData): Promise<CommonResponse<PostDetail>>;
    /**
     * Update existing post
     */
    updatePost(postId: number, data: PostUpdateData): Promise<CommonResponse<PostDetail>>;
    /**
     * Delete post
     */
    deletePost(postId: number): Promise<CommonResponse<PostDetail>>;
    /**
     * React to post (like/dislike)
     */
    reactToPost(postId: number, reactionType: 'like' | 'dislike'): Promise<CommonResponse<PostDetail>>;
    /**
     * Purchase post files
     */
    purchaseFiles(postId: number): Promise<CommonResponse<PostDownloadHistory>>;
    /**
     * Add post to bookmarks
     */
    bookmarkPost(postId: number): Promise<CommonResponse<PostBookmark>>;
    /**
     * Remove post from bookmarks
     */
    removeBookmark(postId: number): Promise<CommonResponse<boolean>>;
    /**
     * Get user's bookmarked posts
     */
    getBookmarkedPosts(): Promise<CommonResponse<GalleryListItem[]>>;
    /**
     * Move post to different board
     */
    movePost(postId: number, boardId: number): Promise<CommonResponse<PostDetail>>;
    /**
     * Create draft post
     */
    createDraftPost(data: DraftPostRequest): Promise<CommonResponse<DraftPostResponse>>;
    /**
     * Publish draft post
     */
    publishPost(postId: number): Promise<CommonResponse<void>>;
    /**
     * Start async file upload for post
     */
    startAsyncFileUpload(postId: number, files: File[], config?: AsyncUploadConfig): Promise<CommonResponse<UploadStartResponse['data']>>;
    /**
     * Get async upload progress
     */
    getUploadProgress(postId: number): Promise<CommonResponse<UploadProgressResponse['data']>>;
    /**
     * Retry failed file uploads
     */
    retryFailedFiles(postId: number, failedFileUuids: string[]): Promise<CommonResponse<void>>;
    /**
     * Cancel async upload
     */
    cancelUpload(postId: number): Promise<CommonResponse<void>>;
    /**
     * Create post with async file upload workflow
     */
    createPostAsync(data: PostCreateData): Promise<CommonResponse<DraftPostResponse>>;
    /**
     * Get draft posts
     */
    getDraftPosts(options?: Partial<PostListOptions>): Promise<CommonResponse<Post>>;
    /**
     * Search posts across multiple boards
     */
    searchPosts(keyword: string, page?: number, pageSize?: number, boardIds?: number[]): Promise<CommonResponse<{
        posts: Post[];
        totalCount: number;
    }>>;
    /**
     * Get post statistics (admin only)
     */
    getPostStats(boardId?: number): Promise<CommonResponse<{
        totalPosts: number;
        totalViews: number;
        totalComments: number;
        totalLikes: number;
    }>>;
}
declare const postService: {
    getPost(options: PostListOptions): Promise<CommonResponse<Post>>;
    createPost(data: PostCreateData): Promise<CommonResponse<PostDetail>>;
    reactionPost(postId: number, reactionType: "like" | "dislike"): Promise<CommonResponse<PostDetail>>;
    deletePost(postId: number): Promise<CommonResponse<PostDetail>>;
    updatePost(postId: number, data: PostUpdateData): Promise<CommonResponse<PostDetail>>;
    purchaseFiles(postId: number): Promise<CommonResponse<PostDownloadHistory>>;
    bookmarkPost(postId: number): Promise<CommonResponse<PostBookmark>>;
    deleteBookmarkPost(postId: number): Promise<CommonResponse<boolean>>;
    getBookmarkPosts(): Promise<CommonResponse<GalleryListItem[]>>;
    movePost(postId: number, boardId: number): Promise<CommonResponse<PostDetail>>;
    createDraftPost(data: DraftPostRequest): Promise<CommonResponse<DraftPostResponse>>;
    publishPost(postId: number): Promise<CommonResponse<void>>;
    getDraftPosts(options?: Partial<PostListOptions>): Promise<CommonResponse<Post>>;
    startAsyncFileUpload(postId: number, files: File[], config?: AsyncUploadConfig): Promise<CommonResponse<UploadStartResponse["data"]>>;
    getUploadProgress(postId: number): Promise<CommonResponse<UploadProgressResponse["data"]>>;
    retryFailedFiles(postId: number, failedFileUuids: string[]): Promise<CommonResponse<void>>;
    cancelUpload(postId: number): Promise<CommonResponse<void>>;
    createPostAsync(data: PostCreateData): Promise<CommonResponse<DraftPostResponse>>;
};
export { postService };
export default PostService;
