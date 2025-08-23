import BaseService, { baseService } from './baseService';
import type { CommonResponse, Pagination } from '../types/common';
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
export class PostService extends BaseService<Post> {
  constructor(options?: PostServiceOptions) {
    super(options?.baseUrl || '/api/post', options?.defaultHeaders);
  }

  /**
   * Get post list with pagination and search options
   */
  async getPostList(options: PostListOptions): Promise<CommonResponse<Post>> {
    const params: Record<string, string> = {
      boardId: options.boardId.toString(),
      page: options.page.toString(),
      pageSize: (options.pageSize || 10).toString(),
      sortBy: options.sortBy || 'latest',
      searchType: options.searchType || 'title',
      searchText: options.searchText || '',
      needNotice: (options.needNotice !== false).toString(),
    };

    if (options.categoryId !== undefined && options.categoryId !== null && options.categoryId !== '') {
      params.categoryId = options.categoryId.toString();
    }

    if (options.status) {
      params.status = options.status;
    }

    if (options.writerId) {
      params.writerId = options.writerId.toString();
    }

    return this.getMini<Post>('/', '게시글 목록 로딩중...', { params });
  }

  /**
   * Get post by ID
   */
  async getPostById(postId: number): Promise<CommonResponse<PostDetail>> {
    return this.get<PostDetail>(`/${postId}`);
  }

  /**
   * Create new post (synchronous)
   */
  async createPost(data: PostCreateData): Promise<CommonResponse<PostDetail>> {
    const formData = new FormData();
    
    // Basic post data
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('boardId', data.boardId.toString());
    formData.append('isNotice', (data.isNotice || false).toString());
    formData.append('hasFiles', (data.hasFiles || false).toString());

    // Optional fields
    if (data.categoryId !== null && data.categoryId !== undefined) {
      formData.append('categoryId', data.categoryId.toString());
    }
    
    if (data.downloadPoint !== undefined && data.downloadPoint !== null) {
      formData.append('downloadPoint', data.downloadPoint.toString());
    }

    // Attachments and metadata
    if (data.attachments && data.attachments.length > 0) {
      formData.append('attachments', JSON.stringify(data.attachments));
    }

    if (data.metadata) {
      formData.append('metadata', JSON.stringify(data.metadata));
    }

    // Files
    if (data.files && data.files.length > 0) {
      data.files.forEach(file => {
        formData.append('files', file);
      });
    }

    return this.postMini<PostDetail, FormData>(
      `/${data.boardId}`,
      formData,
      '게시글 등록중...'
    );
  }

  /**
   * Update existing post
   */
  async updatePost(postId: number, data: PostUpdateData): Promise<CommonResponse<PostDetail>> {
    return this.putMini<PostDetail, PostUpdateData>(
      `/${postId}`,
      data,
      '게시글 수정중...'
    );
  }

  /**
   * Delete post
   */
  async deletePost(postId: number): Promise<CommonResponse<PostDetail>> {
    return this.deleteMini<PostDetail>(`/${postId}`, '게시글 삭제중...');
  }

  /**
   * React to post (like/dislike)
   */
  async reactToPost(
    postId: number,
    reactionType: 'like' | 'dislike'
  ): Promise<CommonResponse<PostDetail>> {
    const reactionText = reactionType === 'like' ? '추천 처리중...' : '비추천 처리중...';
    
    return this.postMini<PostDetail, { reactionType: string }>(
      `/${postId}/reaction`,
      { reactionType },
      reactionText
    );
  }

  /**
   * Purchase post files
   */
  async purchaseFiles(postId: number): Promise<CommonResponse<PostDownloadHistory>> {
    return this.postMini<PostDownloadHistory, object>(
      `/${postId}/purchase`,
      {},
      '파일 구매 처리중...'
    );
  }

  /**
   * Add post to bookmarks
   */
  async bookmarkPost(postId: number): Promise<CommonResponse<PostBookmark>> {
    return this.postMini<PostBookmark, object>(
      `/${postId}/bookmark`,
      {},
      '북마크 처리중...'
    );
  }

  /**
   * Remove post from bookmarks
   */
  async removeBookmark(postId: number): Promise<CommonResponse<boolean>> {
    return this.deleteMini<boolean>(`/${postId}/bookmark`, '북마크 삭제중...');
  }

  /**
   * Get user's bookmarked posts
   */
  async getBookmarkedPosts(): Promise<CommonResponse<GalleryListItem[]>> {
    return this.getMini<GalleryListItem[]>('/bookmarks', '북마크된 게시글 불러오는 중...');
  }

  /**
   * Move post to different board
   */
  async movePost(postId: number, boardId: number): Promise<CommonResponse<PostDetail>> {
    return this.patchMini<PostDetail, { board_id: number }>(
      `/${postId}`,
      { board_id: boardId },
      '게시글 이동중...'
    );
  }

  // Draft and Async Upload Methods

  /**
   * Create draft post
   */
  async createDraftPost(data: DraftPostRequest): Promise<CommonResponse<DraftPostResponse>> {
    return this.postMini<DraftPostResponse, DraftPostRequest>(
      '/draft',
      data,
      '게시글 초안 생성중...'
    );
  }

  /**
   * Publish draft post
   */
  async publishPost(postId: number): Promise<CommonResponse<void>> {
    return this.putMini<void, object>(`/${postId}/publish`, {}, '게시글 발행중...');
  }

  /**
   * Start async file upload for post
   */
  async startAsyncFileUpload(
    postId: number,
    files: File[],
    config?: AsyncUploadConfig
  ): Promise<CommonResponse<UploadStartResponse['data']>> {
    const formData = new FormData();

    // Upload configuration
    formData.append('postId', postId.toString());
    formData.append('needWatermark', (config?.needWatermark !== false).toString());
    formData.append('watermarkPosition', config?.watermarkPosition || 'bottom-right');
    formData.append('watermarkOpacity', (config?.watermarkOpacity || 0.7).toString());

    // Add files
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await this.postMini<UploadStartResponse, FormData>(
      '/upload-async',
      formData,
      '파일 업로드 시작중...'
    );

    if (response.data && !response.data.success) {
      throw new Error(response.data.message);
    }

    return {
      ...response,
      data: response.data?.data || null,
    };
  }

  /**
   * Get async upload progress
   */
  async getUploadProgress(postId: number): Promise<CommonResponse<UploadProgressResponse['data']>> {
    const response = await this.getSilent<UploadProgressResponse>(`/upload-progress/${postId}`);

    if (response.data && !response.data.success) {
      throw new Error(response.data.message || '진행도 조회에 실패했습니다');
    }

    return {
      ...response,
      data: response.data?.data || null,
    };
  }

  /**
   * Retry failed file uploads
   */
  async retryFailedFiles(postId: number, failedFileUuids: string[]): Promise<CommonResponse<void>> {
    return this.postMini<void, { failedFileUuids: string[] }>(
      `/retry-upload/${postId}`,
      { failedFileUuids },
      '실패한 파일 재업로드 중...'
    );
  }

  /**
   * Cancel async upload
   */
  async cancelUpload(postId: number): Promise<CommonResponse<void>> {
    return this.deleteMini<void>(`/cancel-upload/${postId}`, '업로드 취소중...');
  }

  /**
   * Create post with async file upload workflow
   */
  async createPostAsync(data: PostCreateData): Promise<CommonResponse<DraftPostResponse>> {
    // 1. Create draft post first
    const draftResponse = await this.createDraftPost({
      title: data.title,
      content: data.content,
      boardId: data.boardId,
      categoryId: data.categoryId || undefined,
    });

    if (draftResponse.successOrNot !== 'Y' || !draftResponse.data) {
      return draftResponse;
    }

    // 2. Start async upload if files exist
    if (data.files && data.files.length > 0) {
      await this.startAsyncFileUpload(draftResponse.data.id, data.files);
    } else {
      // Publish immediately if no files
      await this.publishPost(draftResponse.data.id);
    }

    return draftResponse;
  }

  /**
   * Get draft posts
   */
  async getDraftPosts(options: Partial<PostListOptions> = {}): Promise<CommonResponse<Post>> {
    const params: Record<string, string> = {
      status: 'draft',
      page: (options.page || 1).toString(),
      pageSize: (options.pageSize || 10).toString(),
      sortBy: options.sortBy || 'latest',
    };

    if (options.writerId) {
      params.writerId = options.writerId.toString();
    }

    return this.getSilent<Post>('/', { params });
  }

  /**
   * Search posts across multiple boards
   */
  async searchPosts(
    keyword: string,
    page: number = 1,
    pageSize: number = 10,
    boardIds?: number[]
  ): Promise<CommonResponse<{ posts: Post[]; totalCount: number }>> {
    const params: Record<string, string> = {
      keyword,
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (boardIds && boardIds.length > 0) {
      params.boardIds = boardIds.join(',');
    }

    return this.get<{ posts: Post[]; totalCount: number }>('/search', { params });
  }

  /**
   * Get post statistics (admin only)
   */
  async getPostStats(boardId?: number): Promise<CommonResponse<{
    totalPosts: number;
    totalViews: number;
    totalComments: number;
    totalLikes: number;
  }>> {
    const params = boardId ? { boardId: boardId.toString() } : {};
    return this.get<any>('/stats', { params });
  }
}

// Legacy support - functional interface (deprecated, use PostService class instead)
const postService = {
  getPost(options: PostListOptions): Promise<CommonResponse<Post>> {
    const service = new PostService();
    return service.getPostList(options);
  },

  createPost(data: PostCreateData): Promise<CommonResponse<PostDetail>> {
    const service = new PostService();
    return service.createPost(data);
  },

  reactionPost(postId: number, reactionType: 'like' | 'dislike'): Promise<CommonResponse<PostDetail>> {
    const service = new PostService();
    return service.reactToPost(postId, reactionType);
  },

  deletePost(postId: number): Promise<CommonResponse<PostDetail>> {
    const service = new PostService();
    return service.deletePost(postId);
  },

  updatePost(postId: number, data: PostUpdateData): Promise<CommonResponse<PostDetail>> {
    const service = new PostService();
    return service.updatePost(postId, data);
  },

  purchaseFiles(postId: number): Promise<CommonResponse<PostDownloadHistory>> {
    const service = new PostService();
    return service.purchaseFiles(postId);
  },

  bookmarkPost(postId: number): Promise<CommonResponse<PostBookmark>> {
    const service = new PostService();
    return service.bookmarkPost(postId);
  },

  deleteBookmarkPost(postId: number): Promise<CommonResponse<boolean>> {
    const service = new PostService();
    return service.removeBookmark(postId);
  },

  getBookmarkPosts(): Promise<CommonResponse<GalleryListItem[]>> {
    const service = new PostService();
    return service.getBookmarkedPosts();
  },

  movePost(postId: number, boardId: number): Promise<CommonResponse<PostDetail>> {
    const service = new PostService();
    return service.movePost(postId, boardId);
  },

  // Draft methods
  createDraftPost(data: DraftPostRequest): Promise<CommonResponse<DraftPostResponse>> {
    const service = new PostService();
    return service.createDraftPost(data);
  },

  publishPost(postId: number): Promise<CommonResponse<void>> {
    const service = new PostService();
    return service.publishPost(postId);
  },

  getDraftPosts(options: Partial<PostListOptions> = {}): Promise<CommonResponse<Post>> {
    const service = new PostService();
    return service.getDraftPosts(options);
  },

  // Async upload methods
  startAsyncFileUpload(
    postId: number,
    files: File[],
    config?: AsyncUploadConfig
  ): Promise<CommonResponse<UploadStartResponse['data']>> {
    const service = new PostService();
    return service.startAsyncFileUpload(postId, files, config);
  },

  getUploadProgress(postId: number): Promise<CommonResponse<UploadProgressResponse['data']>> {
    const service = new PostService();
    return service.getUploadProgress(postId);
  },

  retryFailedFiles(postId: number, failedFileUuids: string[]): Promise<CommonResponse<void>> {
    const service = new PostService();
    return service.retryFailedFiles(postId, failedFileUuids);
  },

  cancelUpload(postId: number): Promise<CommonResponse<void>> {
    const service = new PostService();
    return service.cancelUpload(postId);
  },

  createPostAsync(data: PostCreateData): Promise<CommonResponse<DraftPostResponse>> {
    const service = new PostService();
    return service.createPostAsync(data);
  },
};

export { postService };
export default PostService;
