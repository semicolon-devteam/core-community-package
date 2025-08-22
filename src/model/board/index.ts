interface PostMetadata {
  thumbnail?: string | null;
  downloadPoint?: string;
  cast?: string;
  releaseDate?: string;
  thumbnailUrl?: string;
}

export interface WithoutBoardNamePost {
  id: number;
  board_id: number;
  title: string;
  comment_count: number;
  like_count?: number;
  link?: string;
  created_at: string;
  view_count?: number;
  metadata?: PostMetadata;
}

export interface WithBoardNamePost extends WithoutBoardNamePost {
  rank?: number;
  name?: string;
}

export interface MediaItem {
  id: number;
  title: string;
  cast: string;
  releaseDate: string;
  thumbnailUrl: string;

}

export interface GalleryItem {
  id: number;
  title: string;
  image: string;
  comment_count: number;
  like_count: number;
  metadata?: {
    thumbnail: string;
  };
}

export interface MediaBoardProps {
  items: MediaItem[];
  onItemSelect?: (item: MediaItem) => void;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  board_id: number;
  board_name?: string;
  metadata?: PostMetadata;
  is_notice: boolean;
  writer_id: number;
  created_at: string;
  like_count: number;
  view_count: number;
  comment_count: number;
}

export interface TrendingItem {
  board_id: number;
  comment_count: number;
  like_count: number;
  created_at: string;
  name: string;
  popularity_score: number;
  post_id: number;
  title: string;
  rank: number;
}

export interface LatestItem {
  id: number;
  title: string;
  created_at: string;
  board?: {
    id: number;
    name: string;
  };
  like_count?: number;
  post_id?: number;
  comment_count?: number;
  view_count?: number;
}


export interface RequestedBoardItems {
  board_id: number;
  board_name: string;
  posts: Post[];
}

export interface HomeContents {
  trendingItems: TrendingItem[];
  latestItems: LatestItem[];
  requestedBoardItems: RequestedBoardItems[];
}
export interface TrendingItem {
  name: string;
  title: string;
  post_id: number;
  board_id: number;
  created_at: string;
  comment_count: number;
  popularity_score: number;
}

export interface Board {
  id: number;
  name: string;
  description: string;
  permissionSettings?: PermissionSettings;
  pointSettings?: PointSettings;
  featureSettings?: FeatureSettings;
  displaySettings?: DisplaySettings;
  uploadSettings?: UploadSettings;
  categories?: BoardCategory[];
}

// 검색 타입
export type SearchType = 'title_content' | 'title' | 'content' | 'writer';
// 정렬 타입
export type SortBy = 'latest' | 'popular' | 'views';

export interface PermissionSettings {
  listLevel: number;
  writeLevel: number;
  readLevel: number;
  uploadLevel: number;
  commentLevel: number;
}

export interface PointSettings {
  likePost: number;
  readPost: number;
  writePost: number;
  dislikePost: number;
  likeComment: number;
  downloadFile: number;
  writeComment: number;
  dislikeComment: number;
}

export interface FeatureSettings {
  useEditor: boolean;
  useSecret: boolean;
  useCategory: boolean;
  useComments: boolean;
  forbiddenWords: string[];
  useFileUpload: boolean;
}

export interface DisplaySettings {
  hotPostViews: number;
  newPostHours: number;
  postsPerPage: number;
  type: string;
}

export interface UploadSettings {
  maxFiles: number;
  allowedTypes: string[];
  maxFileSize: number;
}

export interface BoardCategory {
  id: number;
  board_id: number;
  name: string;
  description: string;
  display_order: number;
}

export interface BoardSettings {
  permissionSettings: PermissionSettings;
  pointSettings: PointSettings;
  featureSettings: FeatureSettings;
  displaySettings: DisplaySettings;
  uploadSettings: UploadSettings;
}
