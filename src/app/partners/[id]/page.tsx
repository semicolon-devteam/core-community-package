import { BoardType } from "@model/board/enum";
import ErrorHandler from "@organisms/ErrorHandler";
import PostServiceByServerSide from "@services/postServiceByServerSide";
import PostDetailTemplate from "@templates/PostDetailTemplate";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PartnerDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id: partnerId } = resolvedParams;
  
  const response = await PostServiceByServerSide.getPostById({ id: Number(partnerId) });

  // 게시글이 존재하지 않는 경우 404 페이지 표시
  if (!response || !response.data || response.successOrNot === "N") {
    return (
      <ErrorHandler
        message={"게시글이 존재하지 않습니다."}
        routeUrl={"/partners"}
      />
    );
  }

  const post = response.data;

  const comments = post.comments;
  const isPartnerLink = post.board_id === BoardType.PARTNER;

  return isPartnerLink ? (
    <PostDetailTemplate
      post={post}
      comments={comments || []}
      totalCommentCount={comments?.length || 0}
    />
  ) : (
    <ErrorHandler message={"파트너 링크가 아닙니다."} routeUrl={"/partners"} />
  );
}
