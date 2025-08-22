import SuspenseLoader from "@common/SuspenseLoader";
import { BoardType } from "@organisms/BoardTypes/boardtype.model";
import BoardServiceByServerSide from "@services/boardServiceByServerSide";
import BoardTemplate from "@templates/BoardTemplate";
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BoardPage({ params, searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  
  const { boardId = 3} = resolvedSearchParams;

  const board = await BoardServiceByServerSide.getBoard({
    boardId: Number(boardId),
  });

  // const canRead = hasBoardPermission(
  //   user, 
  //   permissionSettings?.read_level || 0, 
  //   isLoggedIn
  // );

  const allBoards = await BoardServiceByServerSide.getAllBoards();

  // 서버사이드에서는 기본적으로 접근 허용 
  // (클라이언트사이드에서 실시간 권한 체크 처리)
  return (
    <Suspense fallback={<SuspenseLoader text="게시판을 불러오는 중입니다..." />}>
      <BoardTemplate
        boardName={board.data?.name || ''}
        boardId={Number(boardId)}
        category={board.data?.categories || []}
        type={board.data?.displaySettings?.type as BoardType || 'list'}
        permissionSettings={board.data?.permissionSettings}
        allBoards={allBoards.data}
      />
    </Suspense>
  );
}
