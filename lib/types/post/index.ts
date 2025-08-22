import type {
  BoardCategory,
  FeatureSettings,
  PermissionSettings,
  PointSettings,
} from '@model/board';
import { BoardType } from '@organisms/BoardTypes/boardtype.model';

export interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isNew: boolean;
}

export interface GalleryListItem {
  id: number;
  title: string;
  attachments: FileAttachment[];
  comment_count: number;
  like_count: number;
  created_at?: string;
  users?: {
    avatar_path: string;
    nickname: string;
    activity_level: number;
  };
  metadata?: {
    thumbnail?: string | null;
    recommendId?: string;
    siteUrl?: string;
    cast?: string;
    releaseDate?: string;
    notice_type?: 'event' | 'notice';
  };
}
export interface ListPost extends GalleryListItem {
  writer_id?: string;
  writer_nickname?: string;
  writer_avatar?: string;
  is_notice?: boolean;
  board_id?: number;
  view_count?: number;
  content?: string;
  dislike_count?: number;
}

export interface Post {
  items: ListPost[];
  totalCount: number;
  notices?: ListPost[];
}

export interface FileAttachment {
  fileName: string;
  fileSize: number;
  fileType: string;
  fullPath: string;
  uuid: string;
  url: string;
  thumbnailUrl?: string; // 비디오 파일의 썸네일 URL (옵션)
  // 새로운 업로드 진행도 관련 필드들
  status?: 'pending' | 'watermarking' | 'uploading' | 'failed' | 'uploaded';
  progress?: number; // 0-100
  error?: string;
  uploadedAt?: string;
}

export interface PostDetail {
  created_at: string;
  created_by: number;
  id: number;
  board_id: number;
  board: {
    name: string;
    id: number;
    link_url: string;
  };
  writer_id: number;
  nickname: string;
  avatar_path: string;
  writer_level: number;
  writer_ip: string;
  title: string;
  content: string;
  attachments: FileAttachment[];
  restrict_attachments: string[];
  is_notice: boolean;
  view_count: number;
  comment_count: number;
  status: 'NULL' | 'draft' | 'published' | 'blocked' | 'deleted';
  like_count: number;
  dislike_count: number;
  download_point: number;
  category_id?: number | null;
  metadata?: {
    thumbnail?: string | null;
    [key: string]: string | null | undefined;
  };
  feature_settings: FeatureSettings;
  point_settings: PointSettings;
  permission_settings: PermissionSettings;
  display_settings: DisplaySettings;
  categories: BoardCategory[];
}

export interface DisplaySettings {
  type: BoardType;
  hot_port_views: number;
  new_post_hours: number;
  posts_per_page: number;
}

// 컨텐츠 타입 정의
export enum ContentType {
  GENERAL = 'general',
  PARTNER = 'partner',
  MEDIA = 'media',
  BANNER = 'banner',
}

export interface PostBookmark {
  id: number;
  userId: number;
  postId: number;
}
