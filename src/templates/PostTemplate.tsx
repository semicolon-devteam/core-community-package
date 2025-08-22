'use client';

import CustomSelect from '@atoms/CustomSelect';
import RadioButton from '@atoms/RadioButton/RadioButton';
import { Editor } from '@atoms/ToastEditor';
import { useAuth } from '@hooks/User/useAuth';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import {
  useAppDispatch,
  useAppSelector,
  useRouterWithLoader,
} from '@hooks/common';
import { useGlobalPopup } from '@hooks/common/useGlobalPopup';
import { usePermission } from '@hooks/common/usePermission';
import type { BoardCategory } from '@model/board';
import type { FileAttachment } from '@model/post';
import Board from '@molecules/Board';
import FileList from '@molecules/FileList';
import ErrorHandler from '@organisms/ErrorHandler';
import { clearEditMode } from '@redux/Features/Post/postSlice';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { refreshMyInfo } from '@redux/Features/User/userSlice';
import postService from '@services/postService';
import type { Editor as EditorType } from '@toast-ui/react-editor';
import { getPreviousUrlWithParams } from '@util/urlUtil';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// 게시글 생성 요청 인터페이스 확장
interface PostCreateRequest {
  boardId: number;
  title: string;
  content: string;
  files: File[];
  attachments?: FileAttachment[];
  downloadPoint?: number;
  metadata?: {
    thumbnail: string | null;
    [key: string]: string | null; // additionalData를 위한 인덱스 시그니처
  };
  categoryId?: number | null;
  isNotice?: boolean;
  hasFiles?: boolean;
}

export default function PostTemplate({
  boardId,
  categories,
  forbiddenWords,
  additionalInputs,
  defaultDownloadPoint,
}: {
  boardId: number;
  categories: BoardCategory[];
  forbiddenWords: string[];
  additionalInputs?: Array<{ key: string; label: string }>;
  defaultDownloadPoint: number;
}) {
  // Props 메모이제이션 (서버 컴포넌트에서 매번 새로운 참조로 전달되는 것을 방지)
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedForbiddenWords = useMemo(
    () => forbiddenWords,
    [forbiddenWords]
  );
  const memoizedAdditionalInputs = useMemo(
    () => additionalInputs,
    [additionalInputs]
  );

  const dispatch = useAppDispatch();
  const { error } = useGlobalPopup();
  const { isAdmin } = usePermission();
  const editPost = useAppSelector(state => state.postSlice.editPost);
  const isEditMode = useAppSelector(state => state.postSlice.isEditMode);
  const router = useRouterWithLoader();
  const [title, setTitle] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(memoizedCategories[0]?.id || null);
  const [downloadPoint, setDownloadPoint] =
    useState<number>(defaultDownloadPoint);
  const [postType, setPostType] = useState<'normal' | 'notice' | 'event'>(
    'normal'
  );

  // additionalInputs에 대한 상태 관리
  const [additionalData, setAdditionalData] = useState<Record<string, string>>(
    {}
  );

  const {
    files,
    fileAttachments,
    uploadFile,
    handleRemoveFile,
    cleanupFilePreviews,
    extractThumbnailUrlFromWysiwig,
    setExistingAttachments,
    handleRemoveAttachment,
    uploadAllFiles,
    localFilePreviews,
    addFile,
    // 파일 통계 정보
    totalFileSize,
    totalFileSizeMB,
    totalFileCount,
    isFileSizeOverLimit,
    isFileCountOverLimit,
    fileSizePercentage,
  } = usePostCommand();

  // Toast UI Editor 인스턴스에 접근하기 위한 ref
  const editorRef = useRef<EditorType>(null);

  // 컴포넌트 언마운트 시 URL 객체 해제
  useEffect(() => {
    return () => {
      cleanupFilePreviews();
    };
  }, []);

  useEffect(() => {
    if (isEditMode && editPost) {
      setTitle(editPost?.title || '');
      editorRef.current?.getInstance().setMarkdown(editPost?.content || '');
      setSelectedCategory(editPost?.category_id || null);
      // 기존 데이터에서 postType 복원
      if (editPost?.is_notice) {
        const noticeType = editPost.metadata?.notice_type;
        if (noticeType === 'event') {
          setPostType('event');
        } else {
          setPostType('notice');
        }
      } else {
        setPostType('normal');
      }

      // 기존 metadata에서 additionalData 복원
      if (editPost.metadata && memoizedAdditionalInputs) {
        const restoredAdditionalData: Record<string, string> = {};
        memoizedAdditionalInputs.forEach(inputConfig => {
          const value = editPost.metadata?.[inputConfig.key];
          if (typeof value === 'string') {
            restoredAdditionalData[inputConfig.key] = value;
          }
        });
        setAdditionalData(restoredAdditionalData);
      }

      if (editPost.attachments && editPost.attachments.length > 0) {
        setExistingAttachments(editPost.attachments);
      }
    }
  }, [isEditMode, editPost, memoizedAdditionalInputs, setExistingAttachments]);

  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <ErrorHandler message="로그인이 필요합니다." />;
  }

  // 위지윅 이미지 업로드 핸들러
  const handleImageUpload = useCallback(
    async (file: File) => {
      const response = (await uploadFile(file, { skipStateUpdate: true })) as {
        previewUrl: string;
        uuid: string;
      } | null;
      return response?.previewUrl || '';
    },
    [uploadFile]
  );

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!title.trim()) {
      dispatch(
        showToast({
          title: '게시물 작성 실패.',
          content: '제목을 입력해주세요.',
          headerTextColor: 'text-red-500',
          remainTime: '방금',
        })
      );
      return;
    }

    const content = editorRef.current?.getInstance().getMarkdown();

    // 금지 단어 체크
    const titleForbiddenWordsCheck = memoizedForbiddenWords.filter(word =>
      title.includes(word)
    );
    const contentForbiddenWordsCheck = memoizedForbiddenWords.filter(word =>
      content.includes(word)
    );

    if (
      titleForbiddenWordsCheck.length > 0 ||
      contentForbiddenWordsCheck.length > 0
    ) {
      const forbiddenWordsList = [
        ...titleForbiddenWordsCheck,
        ...contentForbiddenWordsCheck,
      ]
        .map(word => `"${word}"`)
        .join(', ');
      error(
        `제목 또는 내용에 다음 금지 단어가 포함되어 있습니다:\n\n${forbiddenWordsList}\n\n해당 단어를 제거한 후 다시 시도해주세요.`,
        '금지 단어 감지'
      );
      return;
    }

    if (
      (!content || content.trim().length < 5) &&
      !files.length &&
      !fileAttachments.length
    ) {
      dispatch(
        showToast({
          title: '내용 입력 필요',
          content: '내용을 5자 이상 입력하거나 파일을 추가해주세요.',
          headerTextColor: 'text-red-500',
          remainTime: 'now',
        })
      );
      return;
    }

    try {
      // 편집 모드인 경우 기존 로직 유지
      if (isEditMode && editPost) {
        // 파일 일괄 업로드 (편집 시에는 동기 방식 사용)
        let uploadedAttachments: FileAttachment[] = [];
        if (files.length > 0) {
          try {
            // 편집 모드에서는 새로운 파일들을 위한 UUID 생성
            const editFileUuids = files.map(() => crypto.randomUUID());
            
            // 위지윅에 이미지가 존재하는지 확인
            const wysiwygImageExists = !!extractThumbnailUrlFromWysiwig(content);
            
            // 편집 모드에서는 uploadAllFiles 사용
            const uploadResult = await uploadAllFiles({
              postId: editPost.id,
              fileUuids: editFileUuids, // 새로 생성한 UUID들 전달
              needWatermark: true,
              watermarkPosition: 'bottom-right',
              watermarkOpacity: 0.7,
              wysiwygImageExists: wysiwygImageExists // 위지윅 이미지 존재 여부 전달
            });
            
            if (uploadResult.successOrNot === 'N') {
              dispatch(
                showToast({
                  title: '파일 업로드 실패',
                  content: uploadResult.message || '파일 업로드 중 오류가 발생했습니다.',
                  headerTextColor: 'text-red-500',
                  remainTime: 'now',
                })
              );
              return;
            }
            uploadedAttachments = uploadResult.data as FileAttachment[];
          } catch (error) {
            dispatch(
              showToast({
                title: '파일 업로드 실패',
                content: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.',
                headerTextColor: 'text-red-500',
                remainTime: 'now',
              })
            );
            return;
          }
        }

        const thumbnailFromWysiwig = extractThumbnailUrlFromWysiwig(content);
        const thumbnailFromFiles = uploadedAttachments.find(file =>
          file.fileType?.startsWith('image/')
        )?.url;

        const videoThumbnail = [
          ...fileAttachments,
          ...uploadedAttachments,
        ].find(
          file => file.fileType?.startsWith('video/') && file.thumbnailUrl
        )?.thumbnailUrl;

        const thumbnailUrl =
          thumbnailFromWysiwig || thumbnailFromFiles || videoThumbnail || null;

        const postData: PostCreateRequest = {
          title,
          content,
          boardId,
          files: [],
          downloadPoint: downloadPoint,
          metadata: {
            thumbnail: thumbnailUrl,
            ...(postType !== 'normal' && { notice_type: postType }),
            ...additionalData,
          },
          attachments: [...fileAttachments, ...uploadedAttachments],
          categoryId: selectedCategory,
          isNotice: isAdmin && postType !== 'normal',
        };

        const response = await postService.updatePost(editPost.id, postData);
        if (response.successOrNot === 'Y') {
          dispatch(refreshMyInfo());
          dispatch(clearEditMode());
          dispatch(
            showToast({
              title: '게시글 수정',
              content: '게시글이 수정되었습니다.',
              headerTextColor: 'text-green-500',
            })
          );
          const redirectUrl = getPreviousUrlWithParams(
            'previousBoardPage',
            { refresh: 'true', page: '1' },
            '/'
          );
          router.replace(redirectUrl);
        } else {
          alert(response.data || '게시글 수정에 실패했습니다.');
        }
        return;
      }

      // 새 게시글 작성 - 기존 방식 사용
      const hasFiles = files.length > 0;

      // 선택한 파일들을 기본 정보로 attachments 초기화
      const initialAttachments = files.map((file) => ({
        url: '',
        uuid: crypto.randomUUID(), // 실제 UUID 생성
        status: 'pending' as const,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        progress: 0,
        fullPath: '',
      }));

      // 게시글을 먼저 생성한 후 postId를 획득
      const postData: PostCreateRequest = {
        title,
        content,
        boardId,
        files: [],
        downloadPoint: downloadPoint,
        metadata: {
          thumbnail: extractThumbnailUrlFromWysiwig(content),
          ...(postType !== 'normal' && { notice_type: postType }),
          ...additionalData,
        },
        attachments: hasFiles ? [...fileAttachments, ...initialAttachments] : fileAttachments,
        categoryId: selectedCategory,
        isNotice: isAdmin && postType !== 'normal',
        hasFiles, // 파일 첨부 여부 추가
      };

      // 게시글 생성 (파일 첨부 여부에 따라 DRAFT 또는 PUBLISHED 상태로 생성)
      const response = await postService.createPost(postData);

      if (response.successOrNot !== 'Y') {
        dispatch(
          showToast({
            title: '게시글 등록 실패',
            content: response.message || '게시글 등록에 실패했습니다.',
            headerTextColor: 'text-red-500',
            remainTime: 'now',
          })
        );
        return;
      }

      const createdPost = response.data;

      // 파일이 있는 경우 외부 미디어 프로세서에 비동기 업로드 요청
      if (hasFiles && createdPost?.id) {
        // DB에 저장된 UUID들 추출
        const savedUuids = initialAttachments.map(attachment => attachment.uuid);
        
        // 위지윅에 이미지가 존재하는지 확인
        const wysiwygImageExists = !!extractThumbnailUrlFromWysiwig(content);
        
        // 비동기 업로드 시작 (대기하지 않음)
        uploadAllFiles({
          postId: createdPost.id,
          fileUuids: savedUuids, // DB에 저장된 UUID들 전달
          onProgress: (progress) => {
            console.log(`파일 업로드 진행률: ${progress}%`);
          },
          maxRetries: 3,
          needWatermark: true,
          watermarkPosition: 'bottom-right',
          watermarkOpacity: 0.7,
          wysiwygImageExists: wysiwygImageExists // 위지윅 이미지 존재 여부 전달
        }).then(uploadResult => {
          if (uploadResult.successOrNot === 'N') {
            // 업로드 실패 시에도 계속 진행 (토스트만 표시)
            dispatch(
              showToast({
                title: '파일 업로드 실패',
                content: uploadResult.message || '파일 업로드 중 오류가 발생했습니다.',
                headerTextColor: 'text-red-500',
                remainTime: 'now',
              })
            );
            return
          } else {
            // 업로드 시작 성공
            console.log('미디어 프로세서 업로드 시작:', uploadResult);
          }
        }).catch(error => {
          // 네트워크 오류 등으로 업로드 요청 자체가 실패한 경우에도 계속 진행
          console.error('미디어 프로세서 업로드 요청 실패:', error);
          dispatch(
            showToast({
              title: '파일 업로드 실패',
              content: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.',
              headerTextColor: 'text-red-500',
              remainTime: 'now',
            })
          );

          return
        });
      }

      // 응답 처리
      dispatch(refreshMyInfo());
      dispatch(clearEditMode());

      // 파일이 있는 경우 draft 페이지로 리다이렉트
      if (hasFiles) {
        dispatch(
          showToast({
            title: '게시글 등록',
            content: '게시글이 등록되었으며, 파일 업로드가 백그라운드에서 진행됩니다.',
            headerTextColor: 'text-green-500',
            remainTime: 'now',
          })
        );
        // Draft 페이지로 리다이렉트
        router.replace('/me/post/draft');
      } else {
        // 파일이 없어서 즉시 PUBLISHED된 경우 게시판 목록으로 이동
        dispatch(
          showToast({
            title: '게시글 등록',
            content: '게시글이 등록되었습니다.',
            headerTextColor: 'text-green-500',
            remainTime: 'now',
          })
        );
        const redirectUrl = getPreviousUrlWithParams(
          'previousBoardPage',
          { refresh: 'true', page: '1' },
          '/'
        );
        router.replace(redirectUrl);
      }
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      dispatch(
        showToast({
          title: '게시글 등록 실패',
          content:
            error instanceof Error
              ? error.message
              : '게시글 등록 중 오류가 발생했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: 'now',
        })
      );
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?')) {
      router.replace(sessionStorage.getItem('previousBoardPage') || '/');
    }
  };

  // 파일 첨부 핸들러
  const handleAddFile = async () => {
    // 현재 파일 개수 체크
    if (totalFileCount >= 15) {
      dispatch(
        showToast({
          title: '파일 개수 초과',
          content: '최대 15개의 파일만 업로드할 수 있습니다.',
          headerTextColor: 'text-red-500',
          remainTime: 'now',
        })
      );
      return;
    }

    try {
      const file = await addFile();

      // 파일이 선택되었다면 용량 체크 (addFile 후의 상태는 다음 렌더링에서 업데이트되므로 직접 계산)
      if (file) {
        const newTotalSizeMB = (totalFileSize + file.file.size) / (1024 * 1024);

        if (newTotalSizeMB > 200) {
          dispatch(
            showToast({
              title: '용량 초과',
              content: '총 업로드 용량이 200MB를 초과할 수 없습니다.',
              headerTextColor: 'text-red-500',
              remainTime: 'now',
            })
          );
          // 마지막에 추가된 파일 제거
          handleRemoveFile(files.length - 1);
          return;
        }
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      dispatch(
        showToast({
          title: '파일 업로드 실패',
          content:
            error instanceof Error
              ? error.message
              : '알 수 없는 오류가 발생했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: 'now',
        })
      );
    }
  };

  return (
    <Board.Container>
      <div className="w-full bg-white rounded-2xl shadow-custom outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden p-4 sm:p-5">
        {/* 타이틀 섹션 */}
        <div className="w-full flex flex-col gap-5 mb-8">
          <h2 className="text-center sm:text-left text-neutral-900 text-base sm:text-lg font-medium font-nexon">
            글쓰기
          </h2>
          <div className="w-full h-0 outline outline-2 outline-offset-[-1px] outline-neutral-900"></div>
        </div>

        {/* 폼 영역 */}
        <div className="w-full flex flex-col gap-8">
          {/* 카테고리 선택 */}
          {memoizedCategories && memoizedCategories.length > 0 && (
            <div className="w-full flex flex-col gap-2">
              <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                카테고리
              </label>
              <CustomSelect<number | null>
                options={[

                  ...memoizedCategories.map(category => ({
                    id: category.id,
                    label: category.name,
                    value: category.id,
                  })),
                ]}
                value={selectedCategory}
                onChange={option => setSelectedCategory(option.value)}
                className="w-full"
                
              />
            </div>
          )}

          {/* 제목 필드 */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
              제목 <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 어드민 전용 게시글 타입 선택 */}
          {isAdmin && (
            <div className="w-full flex flex-col gap-2">
              <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                게시글 타입
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <RadioButton
                  checked={postType === 'normal'}
                  onChange={() => setPostType('normal')}
                  name="postType"
                  value="normal"
                  className="text-text-tertiary"
                >
                  일반 게시글
                </RadioButton>
                <RadioButton
                  checked={postType === 'notice'}
                  onChange={() => setPostType('notice')}
                  name="postType"
                  value="notice"
                  className="text-text-tertiary"
                >
                  공지
                </RadioButton>
                <RadioButton
                  checked={postType === 'event'}
                  onChange={() => setPostType('event')}
                  name="postType"
                  value="event"
                  className="text-text-tertiary"
                >
                  이벤트
                </RadioButton>
              </div>
            </div>
          )}

          {/* 내용 필드 */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                내용 <span className="text-primary">*</span>
              </label>
              <p className="text-primary text-[11px] sm:text-[13px] font-medium font-nexon">
                ※ 무분별한 도배, 광고성 게시글 작성 시 이용이 제한됩니다.
              </p>
            </div>
            <div className="w-full">
              <Editor
                language="ko-KR"
                initialValue=""
                previewStyle="vertical"
                height="400px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                ref={editorRef}
                onImageUpload={handleImageUpload}
                hideModeSwitch={true} // 마크다운 모드 전환 버튼 숨기기
                viewer={false} // 뷰어 모드 비활성화
                toolbarItems={[
                  ['heading', 'bold', 'italic', 'strike'],
                  ['hr', 'quote'],
                  ['ul', 'ol', 'task', 'indent', 'outdent'],
                  ['table', 'image', 'link'],
                  ['code', 'codeblock'],
                ]} // WYSIWYG에서 사용할 툴바만 포함
              />
            </div>
          </div>

          {/* additionalInputs가 있는 경우 동적 input 필드들 생성 */}
          {memoizedAdditionalInputs && memoizedAdditionalInputs.length > 0 && (
            <>
              {memoizedAdditionalInputs.map(inputConfig => (
                <div
                  key={inputConfig.key}
                  className="w-full flex flex-col gap-2"
                >
                  <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                    {inputConfig.label}
                  </label>
                  <input
                    type="text"
                    placeholder={`${inputConfig.label}을(를) 입력해주세요.`}
                    value={additionalData[inputConfig.key] || ''}
                    onChange={e => {
                      setAdditionalData(prev => ({
                        ...prev,
                        [inputConfig.key]: e.target.value,
                      }));
                    }}
                    className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
            </>
          )}

          {/* 구분선 */}
          <div className="w-full h-0 border border-border-default"></div>

          {/* 파일 첨부 */}
          <div className="w-full flex flex-col gap-4">
            {/* 다운로드 포인트 */}
            <div className="w-full flex flex-col gap-2">
              <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                다운로드 포인트{!isAdmin ? '(수정불가)' : ''}
              </label>
              <input
                type="text"
                placeholder="다운로드에 필요한 포인트를 입력해주세요."
                value={downloadPoint.toLocaleString() || ''}
                onChange={e => {
                  const value =
                    e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setDownloadPoint(isNaN(value) ? 0 : value);
                }}
                min="0"
                className={`w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary 
                  ${!isAdmin ? 'bg-gray-200' : 'bg-white'}`}
                disabled={!isAdmin}
              />
            </div>
            {/* 파일 업로드 제한 정보 */}
            <div className="flex flex-col gap-4 p-4 bg-[#f8f8fb] rounded-lg border border-border-default">
              {/* 용량 프로그레스 바 */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-end">
                  <span className="text-text-primary text-md font-medium font-nexon">
                    파일 용량
                  </span>
                  <span
                    className={`text-sm font-bold font-nexon ${
                      isFileSizeOverLimit ? 'text-red-500' : 'text-slate-400'
                    }`}
                  >
                    {totalFileSizeMB.toFixed(1)}/200MB
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isFileSizeOverLimit
                        ? 'bg-red-500'
                        : fileSizePercentage > 80
                        ? 'bg-orange-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${fileSizePercentage}%` }}
                  />
                </div>
              </div>

              {/* 파일 개수 프로그레스 바 */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-end">
                  <span className="text-text-primary text-md font-medium font-nexon">
                    파일 개수
                  </span>
                  <span
                    className={`text-sm font-bold font-nexon ${
                      isFileCountOverLimit ? 'text-red-500' : 'text-slate-400'
                    }`}
                  >
                    {totalFileCount}/15개
                  </span>
                </div>

                {/* 파일 개수 박스 표시 */}
                <div className="flex justify-between gap-1">
                  {Array.from({ length: 15 }, (_, index) => {
                    const isUsed = index < totalFileCount;

                    return (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded border transition-all duration-200 ${
                          isUsed
                            ? isFileCountOverLimit
                              ? 'bg-red-500 border-red-600'
                              : 'bg-emerald-500 border-emerald-600'
                            : 'bg-slate-200 border-slate-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 경고 메시지 */}
              {(isFileCountOverLimit || isFileSizeOverLimit) && (
                <div className="flex items-center justify-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L22 20H2L12 2Z" fill="#EF4444" />
                    <path
                      d="M12 8V13M12 16H12.01"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-red-600 text-xs font-medium font-nexon">
                    {isFileCountOverLimit && '파일 개수 초과'}
                    {isFileCountOverLimit && isFileSizeOverLimit && ' • '}
                    {isFileSizeOverLimit && '용량 초과'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 mb-2">
              <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon w-20 sm:w-auto">
                파일첨부
              </label>
              <button
                onClick={handleAddFile}
                className="px-4 sm:px-5 py-2 bg-white rounded-lg border border-border-default text-text-primary text-xs sm:text-sm font-bold font-nexon"
              >
                파일추가
              </button>
            </div>

            <FileList
              files={files}
              fileAttachments={fileAttachments}
              localFilePreviews={localFilePreviews}
              onRemoveFile={handleRemoveFile}
              onRemoveAttachment={handleRemoveAttachment}
              showThumbnail={false}
              columns={1}
            />
          </div>

          {/* 구분선 */}
          <div className="w-full h-0 border border-border-default"></div>

          {/* 작성 버튼 영역 */}
          <div className="w-full flex justify-center sm:justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-5 py-2 bg-text-secondary rounded-lg text-white text-sm font-bold font-nexon"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg text-white text-sm font-bold font-nexon bg-primary hover:bg-opacity-90"
            >
              {isEditMode ? '수정' : '등록'}
            </button>
          </div>
        </div>
      </div>
    </Board.Container>
  );
}
