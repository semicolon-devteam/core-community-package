import { clientSupabase } from "@config/Supabase/client";
import commentService from "@services/commentService";

export const useCommentCommand = () => {

  const createComment = async (content: string, postId: number) => {

      
      const response = await commentService.createComment({
        postId,
        content,
      });
      
      return response;
  };

  const updateComment = async (id: number, content: string) => {
    try {
      // 인증 상태 먼저 확인
      const { data: authData, error: authError } = await clientSupabase.auth.getSession();
      if (authError || !authData.session) {
        throw new Error("인증 세션이 만료되었습니다.");
      }
      
      const response = await commentService.updateComment({
        id,
        content,
      });
      
      return response;
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      throw error;
    }
  };

  const deleteComment = async (id: number) => {
    try {
      // 인증 상태 먼저 확인
      const { data: authData, error: authError } = await clientSupabase.auth.getSession();
      if (authError || !authData.session) {
        throw new Error("인증 세션이 만료되었습니다.");
      }
      
      const response = await commentService.deleteComment({
        id,
      });
      
      return response;
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      throw error;
    }
  };

  return {
    createComment,
    updateComment,
    deleteComment,
  };
};