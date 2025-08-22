'use client';

import { Editor } from '@atoms/ToastEditor';
import CustomSelect, { SelectOption } from '@atoms/CustomSelect';
import { useBannerCommand } from '@hooks/commands/useBannerCommand';
import { usePostCommand } from '@hooks/commands/usePostCommand';
import { useAppDispatch, useRouterWithLoader } from '@hooks/common';
import { BoardType } from '@model/board/enum';
import { ContentType } from '@model/post';
import Board from '@molecules/Board';
import { showToast } from '@redux/Features/Toast/toastSlice';
import postService from '@services/postService';
import type { Editor as EditorType } from '@toast-ui/react-editor';
import { useEffect, useRef, useState } from 'react';

// 각 타입별 데이터 인터페이스
interface GeneralPostData {
  boardId: number;
  subCategory: string;
  title: string;
  content: string;
  files: File[];
}

interface PartnerPostData {
  siteName: string;
  siteLink: string;
  recommendCode: string;
  content: string;
  representativeImage: File | null;
}

interface MediaPostData {
  workTitle: string;
  cast: string;
  releaseDate: string;
  mediaFile: File | null;
}

interface BannerPostData {
  title: string;
  description: string;
  position: string;
  image: File | null;
  link_url: string;
  target_window: string;
  start_at: string;
  end_at: string;
  display_order: number;
  target_devices: string[];
  width: number;
  height: number;
  is_responsive: boolean;
  status: string;
}

type PostData =
  | GeneralPostData
  | PartnerPostData
  | MediaPostData
  | BannerPostData;

// 게시판 및 서브카테고리 임시 데이터 (실제로는 API에서 가져와야 함)
const BOARD_OPTIONS = [
  { id: 1, name: '자유게시판' },
  { id: 2, name: '공지사항' },
  { id: 3, name: 'Q&A' },
];

const SUB_CATEGORY_OPTIONS = {
  1: ['일반', '유머', '정보'],
  2: ['중요', '일반'],
  3: ['질문', '답변'],
};

// 배너 관련 옵션들
const BANNER_POSITION_OPTIONS = [
  { value: 'CENTER', label: '메인 배너' },
  { value: 'RIGHT_SIDE', label: '사이드바' },
];

const TARGET_WINDOW_OPTIONS = [
  { value: '_self', label: '현재 창' },
  { value: '_blank', label: '새 창' },
];

const DEVICE_TYPE_OPTIONS = [
  { value: 'PC', label: '데스크톱' },
  { value: 'MOBILE', label: '모바일' },
  { value: 'TABLET', label: '태블릿' },
];

const BANNER_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'DRAFT', label: '임시저장' },
  { value: 'PAUSED', label: '일시정지' },
  { value: 'DELETED', label: '삭제' },
];

export default function NewPostTemplate({
  defaultContentType,
}: {
  defaultContentType?: ContentType;
}) {
  const dispatch = useAppDispatch();
  const router = useRouterWithLoader();

  // 공통 상태
  const [contentType, setContentType] = useState<ContentType>(
    defaultContentType || ContentType.GENERAL
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 일반 게시글 상태
  const [boardId, setBoardId] = useState<number>(1);
  const [subCategory, setSubCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  // 파트너 상태
  const [siteName, setSiteName] = useState<string>('');
  const [siteLink, setSiteLink] = useState<string>('');
  const [recommendCode, setRecommendCode] = useState<string>('');
  const [representativeImage, setRepresentativeImage] = useState<File | null>(
    null
  );

  // 미디어 상태
  const [workTitle, setWorkTitle] = useState<string>('');
  const [cast, setCast] = useState<string>('');
  const [releaseDate, setReleaseDate] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // 배너 상태
  const [bannerTitle, setBannerTitle] = useState<string>('');
  const [bannerDescription, setBannerDescription] = useState<string>('');
  const [bannerPosition, setBannerPosition] = useState<string>('CENTER');
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerLinkUrl, setBannerLinkUrl] = useState<string>('');
  const [bannerTargetWindow, setBannerTargetWindow] = useState<string>('_self');
  const [bannerStartAt, setBannerStartAt] = useState<string>('');
  const [bannerEndAt, setBannerEndAt] = useState<string>('');
  const [bannerDisplayOrder, setBannerDisplayOrder] = useState<number>(1);
  const [bannerTargetDevices, setBannerTargetDevices] = useState<string[]>([
    'PC',
    'TABLET',
    'MOBILE',
  ]);
  const [bannerWidth, setBannerWidth] = useState<number>(0);
  const [bannerHeight, setBannerHeight] = useState<number>(0);
  const [bannerIsResponsive, setBannerIsResponsive] = useState<boolean>(true);
  const [bannerStatus, setBannerStatus] = useState<string>('ACTIVE');

  const {
    files,
    filePreviews,
    fileAttachments,
    uploadFile,
    handleRemoveFile,
    cleanupFilePreviews,
    extractThumbnailUrlFromWysiwig,
  } = usePostCommand();

  const { createBanner } = useBannerCommand();

  const editorRef = useRef<EditorType>(null);

  // 컴포넌트 언마운트 시 URL 객체 해제
  useEffect(() => {
    return () => {
      cleanupFilePreviews();
    };
  }, [cleanupFilePreviews]);

  // 컨텐츠 타입 변경 시 상태 초기화
  useEffect(() => {
    // 기본값으로 초기화
    setBoardId(1);
    setSubCategory('');
    setTitle('');
    setSiteName('');
    setSiteLink('');
    setRecommendCode('');
    setRepresentativeImage(null);
    setWorkTitle('');
    setCast('');
    setReleaseDate('');
    setMediaFile(null);
    setBannerTitle('');
    setBannerDescription('');
    setBannerPosition('CENTER');
    setBannerImage(null);
    setBannerLinkUrl('');
    setBannerTargetWindow('_self');
    setBannerStartAt('');
    setBannerEndAt('');
    setBannerDisplayOrder(1);
    setBannerTargetDevices(['PC', 'TABLET', 'MOBILE']);
    setBannerWidth(0);
    setBannerHeight(0);
    setBannerIsResponsive(true);
    setBannerStatus('ACTIVE');

    // 에디터 초기화
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown('');
    }
  }, [contentType]);

  // 위지윅 이미지 업로드 핸들러
  const handleImageUpload = async (file: File) => {
    const response = (await uploadFile(file, {
      skipStateUpdate: true,
      doWaterMark: false,
    })) as {
      previewUrl: string;
      uuid: string;
    } | null;
    return response?.previewUrl || '';
  };

  // 단일 파일 업로드 핸들러 (대표 이미지, 미디어 파일, 배너 이미지용)
  const handleSingleFileUpload = async (
    type: 'representative' | 'media' | 'banner'
  ) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';

      if (type === 'representative' || type === 'banner') {
        input.accept = 'image/*';
      } else if (type === 'media') {
        input.accept = 'video/*,audio/*';
      }

      input.onchange = e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          if (type === 'representative') {
            setRepresentativeImage(file);
          } else if (type === 'media') {
            setMediaFile(file);
          } else if (type === 'banner') {
            setBannerImage(file);
          }
        }
      };

      input.click();
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      dispatch(
        showToast({
          title: '파일 업로드 실패',
          content:
            error instanceof Error
              ? error.message
              : '파일 업로드에 실패했습니다.',
          headerTextColor: 'text-red-500',
          remainTime: 'now',
        })
      );
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    switch (contentType) {
      case ContentType.GENERAL:
        if (!title.trim()) {
          alert('제목을 입력해주세요.');
          return false;
        }
        if (!editorRef.current?.getInstance().getMarkdown().trim()) {
          alert('내용을 입력해주세요.');
          return false;
        }
        break;

      case ContentType.PARTNER:
        if (!siteName.trim()) {
          alert('사이트명을 입력해주세요.');
          return false;
        }
        if (!siteLink.trim()) {
          alert('사이트 링크를 입력해주세요.');
          return false;
        }
        if (!editorRef.current?.getInstance().getMarkdown().trim()) {
          alert('내용을 입력해주세요.');
          return false;
        }
        break;

      case ContentType.MEDIA:
        if (!workTitle.trim()) {
          alert('작품명을 입력해주세요.');
          return false;
        }
        if (!cast.trim()) {
          alert('출연진을 입력해주세요.');
          return false;
        }
        if (!releaseDate) {
          alert('출시일을 선택해주세요.');
          return false;
        }

        break;

      case ContentType.BANNER:
        if (!bannerTitle.trim()) {
          alert('배너 제목을 입력해주세요.');
          return false;
        }
        if (!bannerImage) {
          alert('배너 이미지를 첨부해주세요.');
          return false;
        }
        if (!bannerLinkUrl.trim()) {
          alert('링크를 입력해주세요.');
          return false;
        }
        if (!bannerStartAt) {
          alert('노출 시작일시를 선택해주세요.');
          return false;
        }
        if (!bannerEndAt) {
          alert('노출 종료일시를 선택해주세요.');
          return false;
        }
        if (bannerTargetDevices.length === 0) {
          alert('노출할 디바이스를 선택해주세요.');
          return false;
        }
        break;
    }
    return true;
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let postData: any = {
        contentType,
      };

      switch (contentType) {
        case ContentType.GENERAL:
          postData = {
            ...postData,
            boardId,
            subCategory,
            title,
            content: editorRef.current?.getInstance().getMarkdown(),
            files,
            metadata: {
              thumbnail: extractThumbnailUrlFromWysiwig(
                editorRef.current?.getInstance().getMarkdown()
              ),
            },
          };
          break;

        case ContentType.PARTNER:
          const attachment = representativeImage
            ? await uploadFile(representativeImage)
            : null;
          postData = {
            ...postData,
            boardId: BoardType.PARTNER,
            title: siteName,
            content: editorRef.current?.getInstance().getMarkdown(),
            metadata: {
              siteUrl: siteLink,
              recommendId: recommendCode,
              thumbnail:
                attachment &&
                typeof attachment === 'object' &&
                attachment !== null &&
                'previewUrl' in attachment
                  ? (attachment as any).previewUrl
                  : null,
            },
            attachments:
              attachment &&
              typeof attachment === 'object' &&
              attachment !== null &&
              'fileAttachment' in attachment
                ? [(attachment as any).fileAttachment]
                : [],
          };

          const postRes = await postService.createPost(postData);
          if (postRes.successOrNot === 'Y') {
            router.replace('/partners?refresh=true');
          } else {
            alert(postRes?.data);
          }
          break;

        case ContentType.MEDIA:
          postData = {
            ...postData,
            workTitle,
            cast,
            releaseDate,
            mediaFile,
          };
          break;

        case ContentType.BANNER:
          postData = {
            ...postData,
            title: bannerTitle,
            description: bannerDescription,
            position: bannerPosition,
            image: bannerImage,
            link_url: bannerLinkUrl,
            target_window: bannerTargetWindow,
            start_at: bannerStartAt,
            end_at: bannerEndAt,
            display_order: bannerDisplayOrder,
            target_devices: bannerTargetDevices,
            width: bannerWidth,
            height: bannerHeight,
            is_responsive: bannerIsResponsive,
            status: bannerStatus,
          };
          const bannerRes = await createBanner(postData);
          if (bannerRes.successOrNot === 'Y') {
            dispatch(
              showToast({
                title: '배너 등록',
                content: '배너가 등록되었습니다.',
                headerTextColor: 'text-green-500',
              })
            );
            router.replace('/');
          } else {
            dispatch(
              showToast({
                title: '배너 등록 실패',
                content: (bannerRes as any)?.message || '배너 등록 중 오류가 발생했습니다.',
                headerTextColor: 'text-red-500',
              })
            );
          }
          break;
      }

      // TODO: 실제 API 호출 로직 구현
      console.log('제출할 데이터:', postData);

      // 임시로 성공 처리
      dispatch(
        showToast({
          title: '컨텐츠 등록',
          content: '컨텐츠가 등록되었습니다.',
          headerTextColor: 'text-green-500',
        })
      );

    } catch (error) {
      console.error('컨텐츠 등록 오류:', error);
      alert('컨텐츠 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?')) {
      router.replace(sessionStorage.getItem('previousBoardPage') || '/');
    }
  };

  // 파일 첨부 핸들러 (일반 게시글용)
  const handleAddFile = async () => {
    try {
      await uploadFile();
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      dispatch(
        showToast({
          title: '파일 업로드 실패',
          content:
            error instanceof Error
              ? error.message
              : '파일 업로드에 실패했습니다.',
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
            신규 컨텐츠 등록
          </h2>
          <div className="w-full h-0 outline outline-2 outline-offset-[-1px] outline-neutral-900"></div>
        </div>

        {/* 폼 영역 */}
        <div className="w-full flex flex-col gap-8">
          {/* 컨텐츠 타입 선택 */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
              컨텐츠 타입 <span className="text-primary">*</span>
            </label>
            <CustomSelect<ContentType>
              options={[
                { id: ContentType.GENERAL, label: '일반 게시글', value: ContentType.GENERAL },
                { id: ContentType.PARTNER, label: '파트너', value: ContentType.PARTNER },
                { id: ContentType.MEDIA, label: '미디어', value: ContentType.MEDIA },
                { id: ContentType.BANNER, label: '배너', value: ContentType.BANNER },
              ]}
              value={contentType}
              onChange={(option) => setContentType(option.value)}
              className="w-full"
            />
          </div>

          {/* 동적 폼 필드 */}
          {contentType === ContentType.GENERAL && (
            <>
              {/* 게시판 선택 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  게시판 <span className="text-primary">*</span>
                </label>
                <CustomSelect<number>
                  options={BOARD_OPTIONS.map(board => ({
                    id: board.id,
                    label: board.name,
                    value: board.id
                  }))}
                  value={boardId}
                  onChange={(option) => {
                    setBoardId(option.value);
                    setSubCategory(''); // 게시판 변경 시 서브카테고리 초기화
                  }}
                  className="w-full"
                />
              </div>

              {/* 서브 카테고리 선택 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  서브 카테고리
                </label>
                <CustomSelect<string>
                  options={[
                    { id: '', label: '선택해주세요', value: '' },
                    ...(SUB_CATEGORY_OPTIONS[
                      boardId as keyof typeof SUB_CATEGORY_OPTIONS
                    ]?.map(category => ({
                      id: category,
                      label: category,
                      value: category
                    })) || [])
                  ]}
                  value={subCategory}
                  onChange={(option) => setSubCategory(option.value)}
                  className="w-full"
                />
              </div>

              {/* 제목 */}
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

              {/* 내용 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  내용 <span className="text-primary">*</span>
                </label>
                <div className="w-full">
                  <Editor
                    initialValue=""
                    previewStyle="vertical"
                    height="400px"
                    initialEditType="wysiwyg"
                    useCommandShortcut={true}
                    ref={editorRef}
                    onImageUpload={handleImageUpload}
                  />
                </div>
              </div>

              {/* 파일 첨부 */}
              <div className="w-full flex flex-col gap-4">
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

                {files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {files.map((file, index) => (
                      <div
                        key={file.name + index}
                        className="rounded-lg border border-border-default overflow-hidden flex flex-col"
                      >
                        <div
                          className={`w-full ${
                            file.type.startsWith('image/') ? 'h-32' : 'h-16'
                          } bg-[#f8f8fb] flex justify-center items-center p-2`}
                        >
                          <img
                            src={filePreviews[index] || '/icons/file-icon.svg'}
                            alt={file.name}
                            className={`${
                              file.type.startsWith('image/')
                                ? 'h-full max-h-28 max-w-full object-contain'
                                : 'h-12 w-12 object-contain'
                            }`}
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                '/icons/file-icon.svg';
                            }}
                          />
                        </div>
                        <div className="p-3 bg-white flex flex-col">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-neutral-900 text-xs sm:text-sm font-medium font-nexon truncate mb-1">
                                {file.name}
                              </p>
                              <p className="text-text-secondary text-xs font-normal font-nexon">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="ml-2 p-1 bg-[#f8f8fb] flex justify-center items-center rounded-full h-6 w-6"
                              aria-label="제거"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                  fill="#545456"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {contentType === ContentType.PARTNER && (
            <>
              {/* 사이트명 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  사이트명 <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  placeholder="사이트명을 입력해주세요."
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 사이트 링크 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  사이트 링크 <span className="text-primary">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={siteLink}
                  onChange={e => setSiteLink(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 추천코드 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  추천코드
                </label>
                <input
                  type="text"
                  placeholder="추천코드를 입력해주세요."
                  value={recommendCode}
                  onChange={e => setRecommendCode(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 내용 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  내용 <span className="text-primary">*</span>
                </label>
                <div className="w-full">
                  <Editor
                    initialValue=""
                    previewStyle="vertical"
                    height="400px"
                    initialEditType="wysiwyg"
                    useCommandShortcut={true}
                    ref={editorRef}
                    onImageUpload={handleImageUpload}
                  />
                </div>
              </div>

              {/* 대표 이미지 */}
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 mb-2">
                  <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon w-20 sm:w-auto">
                    대표 이미지
                  </label>
                  <button
                    onClick={() => handleSingleFileUpload('representative')}
                    className="px-4 sm:px-5 py-2 bg-white rounded-lg border border-border-default text-text-primary text-xs sm:text-sm font-bold font-nexon"
                  >
                    이미지 선택
                  </button>
                </div>

                {representativeImage && (
                  <div className="w-full max-w-sm">
                    <div className="rounded-lg border border-border-default overflow-hidden">
                      <div className="w-full h-32 bg-[#f8f8fb] flex justify-center items-center p-2">
                        <img
                          src={URL.createObjectURL(representativeImage)}
                          alt="대표 이미지"
                          className="h-full max-h-28 max-w-full object-contain"
                        />
                      </div>
                      <div className="p-3 bg-white flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-neutral-900 text-xs sm:text-sm font-medium font-nexon truncate mb-1">
                            {representativeImage.name}
                          </p>
                          <p className="text-text-secondary text-xs font-normal font-nexon">
                            {(representativeImage.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => setRepresentativeImage(null)}
                          className="ml-2 p-1 bg-[#f8f8fb] flex justify-center items-center rounded-full h-6 w-6"
                          aria-label="제거"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                              fill="#545456"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {contentType === ContentType.MEDIA && (
            <>
              {/* 작품명 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  작품명 <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  placeholder="작품명을 입력해주세요."
                  value={workTitle}
                  onChange={e => setWorkTitle(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 출연진 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  출연진 <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  placeholder="출연진을 입력해주세요."
                  value={cast}
                  onChange={e => setCast(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 출시일 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  출시일 <span className="text-primary">*</span>
                </label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={e => setReleaseDate(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 미디어 파일 */}
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 mb-2">
                  <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon w-20 sm:w-auto">
                    미디어 파일
                  </label>
                  <button
                    onClick={() => handleSingleFileUpload('media')}
                    className="px-4 sm:px-5 py-2 bg-white rounded-lg border border-border-default text-text-primary text-xs sm:text-sm font-bold font-nexon"
                  >
                    파일 선택
                  </button>
                </div>

                {mediaFile && (
                  <div className="w-full max-w-sm">
                    <div className="rounded-lg border border-border-default overflow-hidden">
                      <div className="w-full h-16 bg-[#f8f8fb] flex justify-center items-center p-2">
                        <img
                          src="/icons/file-icon.svg"
                          alt="미디어 파일"
                          className="h-12 w-12 object-contain"
                        />
                      </div>
                      <div className="p-3 bg-white flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-neutral-900 text-xs sm:text-sm font-medium font-nexon truncate mb-1">
                            {mediaFile.name}
                          </p>
                          <p className="text-text-secondary text-xs font-normal font-nexon">
                            {(mediaFile.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => setMediaFile(null)}
                          className="ml-2 p-1 bg-[#f8f8fb] flex justify-center items-center rounded-full h-6 w-6"
                          aria-label="제거"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                              fill="#545456"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {contentType === ContentType.BANNER && (
            <>
              {/* 배너 제목 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  배너 제목 <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  placeholder="배너 제목을 입력해주세요."
                  value={bannerTitle}
                  onChange={e => setBannerTitle(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 배너 설명 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  배너 설명
                </label>
                <textarea
                  placeholder="배너에 대한 설명을 입력해주세요."
                  value={bannerDescription}
                  onChange={e => setBannerDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* 배너 위치 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  배너 위치 <span className="text-primary">*</span>
                </label>
                <CustomSelect<string>
                  options={BANNER_POSITION_OPTIONS.map(option => ({
                    id: option.value,
                    label: option.label,
                    value: option.value
                  }))}
                  value={bannerPosition}
                  onChange={(option) => setBannerPosition(option.value)}
                  className="w-full"
                />
              </div>

              {/* 배너 이미지 */}
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 mb-2">
                  <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon w-20 sm:w-auto">
                    배너 이미지 <span className="text-primary">*</span>
                  </label>
                  <button
                    onClick={() => handleSingleFileUpload('banner')}
                    className="px-4 sm:px-5 py-2 bg-white rounded-lg border border-border-default text-text-primary text-xs sm:text-sm font-bold font-nexon"
                  >
                    이미지 선택
                  </button>
                </div>

                {bannerImage && (
                  <div className="w-full max-w-sm">
                    <div className="rounded-lg border border-border-default overflow-hidden">
                      <div className="w-full h-32 bg-[#f8f8fb] flex justify-center items-center p-2">
                        <img
                          src={URL.createObjectURL(bannerImage)}
                          alt="배너 이미지"
                          className="h-full max-h-28 max-w-full object-contain"
                        />
                      </div>
                      <div className="p-3 bg-white flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-neutral-900 text-xs sm:text-sm font-medium font-nexon truncate mb-1">
                            {bannerImage.name}
                          </p>
                          <p className="text-text-secondary text-xs font-normal font-nexon">
                            {(bannerImage.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => setBannerImage(null)}
                          className="ml-2 p-1 bg-[#f8f8fb] flex justify-center items-center rounded-full h-6 w-6"
                          aria-label="제거"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                              fill="#545456"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 링크 URL */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  링크 URL <span className="text-primary">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={bannerLinkUrl}
                  onChange={e => setBannerLinkUrl(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 링크 타겟 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  링크 타겟
                </label>
                <CustomSelect<string>
                  options={TARGET_WINDOW_OPTIONS.map(option => ({
                    id: option.value,
                    label: option.label,
                    value: option.value
                  }))}
                  value={bannerTargetWindow}
                  onChange={(option) => setBannerTargetWindow(option.value)}
                  className="w-full"
                />
              </div>

              {/* 노출 시작일시 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  노출 시작일시 <span className="text-primary">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={bannerStartAt}
                  onChange={e => setBannerStartAt(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 노출 종료일시 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  노출 종료일시 <span className="text-primary">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={bannerEndAt}
                  onChange={e => setBannerEndAt(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 노출 순서 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  노출 순서
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={bannerDisplayOrder}
                  onChange={e => setBannerDisplayOrder(Number(e.target.value))}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* 노출할 디바이스 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  노출할 디바이스 <span className="text-primary">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {DEVICE_TYPE_OPTIONS.map(device => (
                    <label
                      key={device.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={bannerTargetDevices.includes(device.value)}
                        onChange={e => {
                          if (e.target.checked) {
                            setBannerTargetDevices([
                              ...bannerTargetDevices,
                              device.value,
                            ]);
                          } else {
                            setBannerTargetDevices(
                              bannerTargetDevices.filter(
                                d => d !== device.value
                              )
                            );
                          }
                        }}
                        className="rounded border-border-default text-primary focus:ring-primary focus:ring-1"
                      />
                      <span className="text-text-primary text-xs sm:text-sm font-normal font-nexon">
                        {device.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 배너 크기 */}
              <div className="w-full grid grid-cols-2 gap-4">
                {/* 너비 */}
                <div className="flex flex-col gap-2">
                  <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                    너비 (px)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={bannerWidth}
                    onChange={e => setBannerWidth(Number(e.target.value))}
                    className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* 높이 */}
                <div className="flex flex-col gap-2">
                  <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                    높이 (px)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={bannerHeight}
                    onChange={e => setBannerHeight(Number(e.target.value))}
                    className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* 반응형 여부 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  반응형 설정
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bannerIsResponsive}
                    onChange={e => setBannerIsResponsive(e.target.checked)}
                    className="rounded border-border-default text-primary focus:ring-primary focus:ring-1"
                  />
                  <span className="text-text-primary text-xs sm:text-sm font-normal font-nexon">
                    반응형 배너로 설정
                  </span>
                </label>
              </div>

              {/* 배너 상태 */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
                  배너 상태
                </label>
                <CustomSelect<string>
                  options={BANNER_STATUS_OPTIONS.map(option => ({
                    id: option.value,
                    label: option.label,
                    value: option.value
                  }))}
                  value={bannerStatus}
                  onChange={(option) => setBannerStatus(option.value)}
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* 구분선 */}
          <div className="w-full h-0 border border-border-default"></div>

          {/* 작성 버튼 영역 */}
          <div className="w-full flex justify-center sm:justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-5 py-2 bg-text-secondary rounded-lg text-white text-sm font-bold font-nexon disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-white text-sm font-bold font-nexon bg-primary hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </div>
      </div>
    </Board.Container>
  );
}
