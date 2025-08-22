'use client';

import TimeIcon from '@atoms/Icon/TimeIcon';
import UserProfileIcon from '@atoms/Icon/UserProfileIcon';
import { Comment } from '@model/comment';
import ReportModal from '@organisms/ReportModal';
import { timeAgo } from '@util/dateUtil';
import Image from "next/image";

import { forwardRef, useState } from 'react';
interface CommentItemProps {
  comment: Comment;
  isHighlighted?: boolean;
  onReport: (
    targetId: number,
    reasonId: string,
    description: string,
    targetType: string
  ) => void;
}

const CommentItem = forwardRef<HTMLDivElement, CommentItemProps>(
  ({ comment, isHighlighted = false, onReport }, ref) => {
    // 신고 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div
        ref={ref}
        className={`w-full pb-5 border-b border-zinc-200 flex flex-col gap-4 transition-all duration-3000 ${
          isHighlighted ? 'bg-yellow-50' : ''
        }`}
      >
        {/* 댓글 상단: 작성자 및 시간 */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center">
            <UserProfileIcon profileImage={comment.writer_avatar} />
            <Image
              src={`/icons/level/${comment.writer_level || 1}.png`}
              alt="level"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <span className="text-neutral-900 text-sm sm:text-base font-medium font-nexon">
              {comment.writer_name}
            </span>
            <span className="text-neutral-600 text-xs font-normal font-nexon">
              님
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-5 h-5 sm:w-6 sm:h-6 relative overflow-hidden">
              <TimeIcon size={24} />
            </div>
            <span className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
              {timeAgo(comment.created_at)}
            </span>
          </div>
        </div>

        {/* 댓글 내용 */}
        <div className="w-full text-neutral-900 text-xs sm:text-sm font-normal font-nexon whitespace-pre-line">
          {comment.content}
        </div>

        {/* 신고 버튼 */}
        <div className="flex justify-end">
          <button
            className="p-1 bg-primary rounded flex items-center gap-0.5"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="w-4 h-4 relative overflow-hidden">
              <Image
                src="/icons/siren-white.svg"
                alt="신고하기"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </div>
            <span className="text-white text-xs font-medium font-nexon">
              신고
            </span>
          </button>
          <ReportModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={(commentId, reasonId, description, targetType) => {
              if (reasonId === '') {
                alert('신고 사유를 선택해주세요.');
              } else if (description === '') {
                alert('신고 상세내용을 입력해주세요.');
              } else {
                onReport(commentId, reasonId, description, 'comment');
                setIsModalOpen(false);
              }
            }}
            commentId={comment.id}
            writerId={comment.writer_id}
          />
        </div>
      </div>
    );
  }
);

CommentItem.displayName = 'CommentItem';

export default CommentItem;
