import type { Comment } from "@model/comment";
import type { CommonResponse } from "@model/common";
import { CommonStatus } from "@model/common";
import baseService from "@services/baseService";
import { serverFetch } from "@config/fetch";
// 서버 측에서 안전하게 날짜 포맷하는 함수

// Comment 인터페이스는 이제 model/comment에서 가져옴

interface CommentService {
  postId: number;
  page: number;
  pageSize?: number;
}

interface CommentDetailService {
  content: string;
  postId: number;
}

interface UpdateCommentService {
  id: number;
  content: string;
}

interface DeleteCommentService {
  id: number;
}

const commentService = {
  getComments({
    postId,
    page,
    pageSize = 10,
  }: CommentService): Promise<CommonResponse<Comment>> {
    return baseService.getMini<Comment>(
      `/api/comments?postId=${postId}&page=${page}&pageSize=${pageSize}`,
      '댓글 로딩중...'
    );
  },

  createComment({
    postId,
    content,
  }: CommentDetailService): Promise<CommonResponse<Comment>> {
    return baseService.postMini<Comment, CommentDetailService>(`/api/comments`, {
      postId,
      content,
    }, '댓글 등록중...');
  },

  updateComment({
    id,
    content,
  }: UpdateCommentService): Promise<CommonResponse<Comment>> {
    return baseService.putMini<Comment, UpdateCommentService>(
      `/api/comments/${id}`,
      {
        id,
        content,
      },
      '댓글 수정중...'
    );
  },

  deleteComment({
    id,
  }: DeleteCommentService): Promise<CommonResponse<Comment>> {
    return baseService.deleteMini<Comment>(`/api/comments/${id}`, '댓글 삭제중...');
  },
};

export default commentService;
