import PostDetailTemplate from '@templates/PostDetailTemplate';

import SuspenseLoader from '@common/SuspenseLoader';
import ErrorHandler from '@organisms/ErrorHandler';
import PostServiceByServerSide from '@services/postServiceByServerSide';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // 서버사이드 서비스를 통해 게시글 데이터 조회
  const postDetailResponse = await PostServiceByServerSide.getPostByIdDirect({
    id: Number(id),
  });

  const postData = postDetailResponse.data;

  if (postDetailResponse.successOrNot === 'N' || !postData) {
    return (
      <ErrorHandler
        message={
          postDetailResponse.message || '게시글을 불러올 수 없습니다.'
        }
      />
    );
  }


  return (
    <Suspense
      fallback={<SuspenseLoader text="게시글을 불러오는 중입니다..." />}
    >
      <PostDetailTemplate
        post={postData}
        boardInfo={postData.board}
        comments={postData.comments || []}
        totalCommentCount={postData.totalComments || 0}
        downloadPoint={postData.download_point}
        forbiddenWords={postData.feature_settings?.forbiddenWords ?? []}
        fileDownloadExpiredTime={
          postData.postDownloadHistory?.expires_at
            ? new Date(postData.postDownloadHistory.expires_at)
            : null
        }
        initialCategories={postData.categories}
      />
    </Suspense>
  );
}
