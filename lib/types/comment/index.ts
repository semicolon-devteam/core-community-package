export interface Comment {
  id: number;
  content: string;
  post_id: number;
  created_at: string;
  updated_at: string;
  writer_name: string;
  writer_id: number;
  writer_avatar: string;
  writer_level: number;
  error?: string;
  isMyComment?: boolean;
}

// CommentSection 컴포넌트 Props 인터페이스
export interface CommentSectionProps {
  postId: number;
  boardId: number;
  initialComments?: Comment[];
  totalCommentCount?: number;
  forbiddenWords?: string[];
  highlightedCommentId?: number | null;
  isLoggedIn: boolean;
  canComment: boolean;
  onCommentUpdate?: () => void;
}

// 댓글 작성 폼 Props 인터페이스
export interface CommentFormProps {
  isLoggedIn: boolean;
  canComment: boolean;
  comment: string;
  setComment: (value: string) => void;
  onSubmit: () => void;
}

// 댓글 섹션 관련 상태 타입
export interface CommentSectionState {
  commentList: Comment[];
  commentListPage: number;
  totalCommentPages: number;
  comment: string;
  isLoading: boolean;
}

// 댓글 액션 타입
export interface CommentActions {
  handleSubmitComment: () => Promise<void>;
  handleReport: (
    targetId: number,
    reasonId: string,
    description: string,
    targetType?: string
  ) => Promise<void>;
  setComment: (value: string) => void;
  setCommentListPage: (page: number) => void;
  refetchComments: () => void;
}