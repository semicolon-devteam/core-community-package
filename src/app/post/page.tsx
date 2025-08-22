import SuspenseLoader from '@common/SuspenseLoader';
import { LoginGuard } from '@organisms/AuthGuard';
import ErrorHandler from '@organisms/ErrorHandler';
import BoardServiceByServerSide from '@services/boardServiceByServerSide';
import PostTemplate from '@templates/PostTemplate';
import { Suspense } from 'react';

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

// VR 게시판용 추가 입력 필드 (상수로 분리)
const VR_ADDITIONAL_INPUTS: Array<{ key: string; label: string }> = [
  {
    key: 'cast',
    label: '출연진',
  },
  {
    key: 'releaseDate',
    label: '개봉일',
  },
];

const EMPTY_ARRAY: never[] = [];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PostPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const boardId = Number(resolvedSearchParams?.boardId) || 0;

  const boardResponse = await BoardServiceByServerSide.getBoard({ boardId });
  

  if (boardResponse.successOrNot === 'N') {
    return <ErrorHandler message={boardResponse.data} routeUrl={'backward'} />;
  }

  const { data: board } = boardResponse;

  return (
    <Suspense
      fallback={
        <SuspenseLoader text="게시글 작성 페이지를 불러오는 중입니다..." />
      }
    >
      <LoginGuard>
        <PostTemplate
          boardId={boardId}
          categories={board?.categories || []}
          forbiddenWords={board?.featureSettings?.forbiddenWords || []}
          additionalInputs={board?.featureSettings?.additionalInputs || []}
          defaultDownloadPoint={board?.pointSettings?.downloadFile || 0}
        />
      </LoginGuard>
    </Suspense>
  );
}
