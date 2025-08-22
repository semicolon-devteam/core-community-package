'use client';
import CommentIcon from '@atoms/Icon/CommentIcon';
import EyeIcon from '@atoms/Icon/EyeIcon';
import ThumbsUpIcon from '@atoms/Icon/ThumbsUpIcon';
import TimeIcon from '@atoms/Icon/TimeIcon';
import UserProfileIcon from '@atoms/Icon/UserProfileIcon';
import { Viewer } from '@atoms/ToastEditor';
import VideoPlayer from '@atoms/VideoPlayer';
import LinkWithLoader from '@common/LinkWithLoader';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch } from '@hooks/common';
import { usePostDetail } from '@hooks/PostDetail/usePostDetail';
import type { BoardCategory, SearchType, SortBy } from '@model/board';
import type { Comment } from '@model/comment';
import type { FileAttachment, PostDetail } from '@model/post';
import Board from '@molecules/Board';
import PopOver, { MenuButton } from '@molecules/PopOver';
import type { BoardType } from '@organisms/BoardTypes/boardtype.model';
import ErrorHandler from '@organisms/ErrorHandler';
import CommentSection from '@organisms/PostDetail/CommentSection';
import { FileDownloadSection } from '@organisms/PostDetail/FileDownloadSection';
import ReportModal from '@organisms/ReportModal';
import { refreshMyInfo } from '@redux/Features/User/userSlice';
import BoardTemplate from '@templates/BoardTemplate';
import { timeAgo } from '@util/dateUtil';
import { IMAGE_SIZE, normalizeImageSrc, optimizeImageSrc, getImageProps } from '@util/imageUtil';
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';

export default function DetailPage({
  post,
  boardInfo,
  comments = [], // 기본값 추가
  totalCommentCount = 0,
  downloadPoint = 0,
  forbiddenWords = [],
  fileDownloadExpiredTime = null,
  initialCategories = [], // 초기 카테고리 추가
}: {
  post: PostDetail;
  boardInfo?: {
    name: string;
    id: number;
    link_url: string;
  };
  comments?: Comment[];
  totalCommentCount?: number;
  downloadPoint?: number;
  forbiddenWords?: string[];
  fileDownloadExpiredTime?: Date | null;
  initialCategories?: BoardCategory[]; // 초기 카테고리 타입 추가
}) {
  // UI 상태들을 컴포넌트에서 직접 관리
  const [showPopOver, setShowPopOver] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 날짜 포맷팅을 useMemo로 최적화
  const formattedDate = useMemo(() => {
    if (post.created_at) {
      return timeAgo(post.created_at);
    }
    return '';
  }, [post.created_at]);

  // 게시글 상세 페이지의 핵심 비즈니스 로직만 hook에서 가져오기
  const {
    likeCount,
    canRead,
    hasEnoughPoints,
    isLoggedIn,
    permission_settings,
    handleReaction,
    postPermissions,
    handleDelete,
    handleEdit,
  } = usePostDetail({
    post,
  });

  const { bookmarkPost } = usePostCommand();

  const menuButtons = useMemo(() => {
    return postPermissions?.canEdit || postPermissions?.canDelete
      ? [
          ...(postPermissions?.canEdit
            ? [
                {
                  label: '수정',
                  onClick: handleEdit,
                  enabled: true,
                },
              ]
            : []),
          ...(postPermissions?.canDelete
            ? [
                {
                  label: '삭제',
                  onClick: handleDelete,
                  className: 'text-red-500',
                  enabled: true,
                },
              ]
            : []),
        ]
      : [
          {
            label: '저장',
            onClick: () => {
              bookmarkPost(post.id);
              setShowPopOver(false);
            },
            enabled: true,
          },
          {
            label: '신고',
            onClick: () => {
              setShowPopOver(false);
              setIsReportModalOpen(true);
            },
            enabled: true,
          },
        ];
  }, [postPermissions, handleEdit, handleDelete, bookmarkPost]);

  // BoardTemplate에 필요한 상태들 (직접 관리)
  const searchParams = useSearchParams();
  const currentBoardType = post.display_settings?.type as BoardType;
  const boardListPage = Number(searchParams.get('page')) || 1;
  const sortBy = (searchParams.get('sortBy') as SortBy) || 'latest';
  const searchType =
    (searchParams.get('searchType') as SearchType) || 'title_content';
  const searchText = searchParams.get('searchText') || '';
  const BOARD_LIST_PAGE_SIZE = 15;

  // 첨부파일 필터링
  const imageAttachments = useMemo(() => {
    return post.attachments && post.attachments.length > 0
      ? post.attachments.filter(attachment =>
          attachment.fileType.startsWith('image/')
        )
      : [];
  }, [post.attachments]);

  const videoAttachments = useMemo(() => {
    return post.attachments && post.attachments.length > 0
      ? post.attachments.filter(attachment =>
          attachment.fileType.startsWith('video/')
        )
      : [];
  }, [post.attachments]);

  // Constants
  const dispatch = useAppDispatch();
  const attachments: FileAttachment[] = post.attachments;

  // early return
  if (!canRead || !hasEnoughPoints) {
    return (
      <ErrorHandler
        message={
          !isLoggedIn
            ? '로그인이 필요한 게시글입니다.'
            : `이 게시글을 읽으려면 레벨 ${permission_settings?.readLevel} 이상이 필요합니다.`
        }
        routeUrl="prevBoard"
      />
    );
  }

  return (
    <Board.Container>
      {boardInfo && (
        <LinkWithLoader
          href={boardInfo!.link_url}
          className="self-start flex items-center gap-1 group"
        >
          <b>{boardInfo!.name}</b>
          <span className="opacity-0 transition-all duration-300 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </span>
        </LinkWithLoader>
      )}
      {/* 게시판 상세 페이지 헤더 */}
      <div className="w-full bg-white rounded-2xl shadow-custom outline outline-1 outline-offset-[-1px] outline-zinc-200 p-5 sm:p-5">
        <div className="flex flex-col gap-5">
          {/* 게시글 제목 */}
          <div className="w-full">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-center sm:text-left text-neutral-900 text-base sm:text-lg font-medium font-nexon leading-normal">
                {post.title}
              </h1>
              <div className="relative flex items-center">
                <button
                  onClick={() => setShowPopOver((v: boolean) => !v)}
                  className="text-2xl px-2"
                  aria-label="더보기"
                >
                  ⋮
                </button>
                {showPopOver && (
                  <div className="absolute top-5 right-5 z-50">
                    <PopOver
                      menuRef={menuRef}
                      buttons={menuButtons as unknown as MenuButton[]}
                      setShowPopOver={setShowPopOver}
                      headerLabel="메뉴"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full h-0 mt-2 outline outline-2 outline-offset-[-1px] outline-neutral-900"></div>
          </div>
          <ReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            onSubmit={(_, reasonId, description) => {
              if (reasonId === '') {
                window.alert('신고 사유를 선택해주세요.');
                return;
              }
              if (description === '') {
                window.alert('신고 상세내용을 입력해주세요.');
                return;
              }
              // 신고 처리는 ReportModal 내부에서 처리됨
              setIsReportModalOpen(false);
            }}
            commentId={post.id} // commentId 대신 post.id 전달
            writerId={post.writer_id}
          />
          {/* 작성자 정보와 게시글 메타데이터 */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            {/* 작성자 */}
            <div className="flex items-center ">
              <UserProfileIcon profileImage={post.avatar_path} />
              <Image
                src={`/icons/level/${post.writer_level || 1}.png`}
                alt="level"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <span className="text-neutral-900 text-sm sm:text-base font-medium font-nexon">
                {post.nickname}
              </span>
              <span className="text-neutral-600 text-xs font-normal font-nexon">
                님
              </span>
            </div>

            {/* 메타데이터 (추천, 조회수, 날짜) */}
            <div className="flex items-center gap-2">
              {/* 댓글수 */}
              <div className="flex items-center gap-0.5">
                <div className="w-4 h-4 relative overflow-hidden">
                  <CommentIcon className="w-4 h-4" />
                </div>
                <span className="text-primary text-xs font-medium font-nexon leading-normal">
                  +{totalCommentCount}
                </span>
              </div>

              {/* 추천수 */}
              <div className="flex items-center gap-0.5">
                <div className="w-4 h-4 relative overflow-hidden">
                  <ThumbsUpIcon color="primary" className="w-4 h-4" />
                </div>
                <span className="text-primary text-xs font-medium font-nexon leading-normal">
                  +{likeCount}
                </span>
              </div>

              {/* 조회수 */}
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 relative overflow-hidden">
                  <EyeIcon size={24} />
                </div>
                <span className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  {post.view_count}
                </span>
              </div>

              {/* 날짜 */}
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 relative overflow-hidden">
                  <TimeIcon size={24} />
                </div>
                <span className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  {formattedDate || timeAgo(post.created_at)}
                </span>
              </div>
            </div>
          </div>

          {imageAttachments.length > 0 && (
            <div className="w-full flex flex-col gap-4 mb-6 items-center">
              {imageAttachments.map(
                (attachment: FileAttachment, index: number) => {
                  const { url, fileName } = attachment;
                  const imageSrc = optimizeImageSrc(url, IMAGE_SIZE.xl, 80);
                  return (
                    <Image
                      key={index}
                      src={imageSrc}
                      alt={fileName}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-auto h-auto"
                      {...getImageProps(url)}
                    />
                  );
                }
              )}
            </div>
          )}

          {videoAttachments.length > 0 && (
            <div className="w-full flex flex-col gap-4 mb-6 items-center">
              {videoAttachments.map(
                (attachment: FileAttachment, index: number) => {
                  return (
                    <VideoPlayer
                      key={index}
                      src={attachment.url}
                      width={800}
                      height={'50vh'}
                      controls={true}
                      options={{
                        fluid: true,
                        responsive: true,
                        preload: 'metadata',
                      }}
                    />
                  );
                }
              )}
            </div>
          )}

          {/* 게시글 내용 */}
          <div className="w-full mt-2 sm:mt-5">
            <Viewer initialValue={post.content} />

            {/* 첨부파일 섹션 */}
            <FileDownloadSection
              postId={post.id}
              attachments={attachments}
              downloadPoint={downloadPoint}
              fileDownloadExpiredTime={fileDownloadExpiredTime}
            />
          </div>

          {/* 추천/비추천 버튼 */}
          <div className="w-full py-5 flex justify-center items-center gap-2">
            <button
              onClick={() => handleReaction('like')}
              className="w-28 sm:w-32 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary flex justify-center items-center gap-2"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 relative overflow-hidden">
                <Image
                  src={normalizeImageSrc("/icons/thumbs-up-primary.svg")}
                  alt="recommend"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-primary text-xs sm:text-sm font-bold font-nexon">
                  추천
                </span>
                <span className="text-primary text-xs sm:text-sm font-bold font-nexon">
                  {likeCount}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <CommentSection
        postId={post.id}
        boardId={post.board_id}
        initialComments={comments}
        totalCommentCount={totalCommentCount}
        forbiddenWords={forbiddenWords}
        permissionSettings={permission_settings}
        onCommentUpdate={() => {
          dispatch(refreshMyInfo());
        }}
      />

      {/* 같은 게시판의 게시글 목록 - BoardTemplate 사용 */}
      <div className="w-full mt-8">
        <BoardTemplate
          boardId={post.board_id}
          type={currentBoardType}
          pageSize={BOARD_LIST_PAGE_SIZE}
          permissionSettings={permission_settings as any}
          highlightId={post.id}
          autoFindCurrentPost={true}
          category={initialCategories}
          initialSearchParams={{
            sortBy: sortBy,
            searchType: searchType,
            searchText: searchText,
            page: String(boardListPage),
          }}
        />
      </div>
    </Board.Container>
  );
}
