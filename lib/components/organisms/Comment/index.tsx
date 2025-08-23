"use client";

import { useCommentCommand } from "@hooks/commands/useCommentCommand";
import { Comment } from '../../../types/comment';
import Board from "@molecules/Board";
import CommentItem from "@organisms/CommentItem";
import { useState } from "react";

interface CommentProps {
  postId: number;
  initialComments: Comment[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
}

const CommentComponent: React.FC<CommentProps> = ({
  postId,
  initialComments,
  user,
}) => {
  const { createComment } = useCommentCommand();
  const [comment, setComment] = useState<string>("");
  const [commentList, setCommentList] = useState<Comment[]>(initialComments);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  // 총 페이지 수 계산
  const totalPages = Math.ceil(commentList.length / commentsPerPage);

  const handleSubmit = () => {
    if (!comment.trim()) {
      alert("댓글을 작성해주세요.");
      return;
    }

    createComment(comment, postId);
    setComment("");

    // 실제로는 서버에서 새로운 댓글 목록을 가져와야 하지만
    // 여기서는 단순화를 위해 댓글 목록을 갱신하지 않습니다.
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      {/* 댓글 섹션 */}
      <div className="w-full bg-white rounded-2xl shadow-custom outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden p-4 sm:p-5">
        {/* 댓글 헤더 */}
        <div className="w-full flex flex-col gap-5 mb-4">
          <h2 className="text-center sm:text-left text-neutral-900 text-base sm:text-lg font-medium font-nexon">
            댓글
          </h2>
          <div className="w-full h-0 outline outline-2 outline-offset-[-1px] outline-neutral-900"></div>
        </div>

        {/* 댓글 목록 */}
        <div className="w-full flex flex-col gap-2">
          {commentList.length > 0 ? (
            commentList.map((comment: Comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReport={() => {}}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              아직 작성된 댓글이 없습니다.
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="w-full flex justify-center mt-6">
            <Board.Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* 댓글 작성 영역 */}
      <div className="w-full h-20 sm:h-24 mt-4 bg-white rounded-2xl shadow-custom outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden flex justify-center items-center">
        {user ? (
          <div className="flex gap-2 flex-row w-full h-full p-2 rounded-lg border border-zinc-200 p-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-full p-2 rounded-lg border border-zinc-200 text-neutral-900 text-xs sm:text-sm font-normal font-nexon leading-normal p-4"
              placeholder="댓글을 작성해주세요."
            />
            <button
              onClick={handleSubmit}
              className="w-40 h-full p-2 rounded-lg border border-zinc-200 text-neutral-900 text-xs sm:text-sm font-normal font-nexon leading-normal"
            >
              댓글 작성
            </button>
          </div>
        ) : (
          <p className="text-center text-neutral-900 text-xs sm:text-sm font-normal font-nexon leading-normal">
            로그인한 회원만 댓글 등록이 가능합니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentComponent;
