import type { WithoutBoardNamePost } from "@model/board";
import PostCard from "@molecules/PostCard";

export default function HumorBoard({
  items,
}: {
  items: WithoutBoardNamePost[];
}) {
  return (
    <PostCard.Container>
      <div className="col-span-12">
        <PostCard.Wrapper.HeaderWrapper>
          <PostCard.Header title="유머게시판" align="start" link="/board/open-lounge/humor?boardId=52&type=list" isSelected={true} />
        </PostCard.Wrapper.HeaderWrapper>
      </div>
      <PostCard.Wrapper.ListWrapper colSpan={12}>
        <PostCard.List.WithoutBoardName
          postItem={items}
          boardName="humorBoardItem"
          isShowLike={true}
        />
      </PostCard.Wrapper.ListWrapper>
    </PostCard.Container>
  );
}
