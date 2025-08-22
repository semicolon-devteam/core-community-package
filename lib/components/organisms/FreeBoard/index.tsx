import { useFreeBoardQuery } from "@hooks/queries/useHomeQuery";
import PostCard from "@molecules/PostCard";

export default function FreeBoard() {
  const { data: items, isFetching } = useFreeBoardQuery();

  return (
    <PostCard.Container>
      <div className="col-span-12">
        <PostCard.Wrapper.HeaderWrapper>
          <PostCard.Header title="자유게시판" align="start" link="/board/open-lounge/free?boardId=51&type=list" isSelected={true} />
        </PostCard.Wrapper.HeaderWrapper>
      </div>
      <PostCard.Wrapper.ListWrapper colSpan={12}>
        <PostCard.List.WithoutBoardName
          postItem={items || []}
          boardName="freeBoardItem"
          isShowLike={true}
          isLoading={isFetching}
        />
      </PostCard.Wrapper.ListWrapper>
    </PostCard.Container>
  );
}
