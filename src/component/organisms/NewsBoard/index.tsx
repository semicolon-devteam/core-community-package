import type { WithoutBoardNamePost } from "@model/board";
import { BoardType } from "@model/board/enum";
import PostCard from "@molecules/PostCard";

export default function NewsBoard({
  items,
}: {
  items: WithoutBoardNamePost[];
}) {
  return (
    <PostCard.Container>
      <div className="col-span-12">
        <PostCard.Wrapper.HeaderWrapper>
          <PostCard.Header title="스포츠 소식" align="start" isSelected={true} link={`/board/open-lounge/news?boardId=${BoardType.SPORTS}&type=content`} />
        </PostCard.Wrapper.HeaderWrapper>
      </div>
      <PostCard.Wrapper.ListWrapper colSpan={12}>
        <PostCard.List.WithoutBoardName
          postItem={items}
          boardName="newsBoardItem"
          isShowLike={true}
        />
      </PostCard.Wrapper.ListWrapper>
    </PostCard.Container>
  );
}
