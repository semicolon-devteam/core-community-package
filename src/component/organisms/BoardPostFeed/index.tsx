import { useSportsQuery } from "@hooks/queries/useHomeQuery";
import PostCard from "@molecules/PostCard";
export default function BoardPostFeed({
  selectedItem,
  setSelectedItem,
}: {
  selectedItem: number;
  setSelectedItem: (item: number) => void;
}) {
  const boardPostFeedHeader = ["축구", "야구", "농구", "배구"];
  const currentSportsItemType = ['football', 'baseball', 'basketball', 'volleyball'][selectedItem] as 'football' | 'baseball' | 'basketball' | 'volleyball';
  const { data: items, isFetching } = useSportsQuery({ type: currentSportsItemType });

  return (
    <PostCard.Container>
      <div className="col-span-12">
        <PostCard.Wrapper.HeaderWrapper>
          {boardPostFeedHeader.map((e, i) => {
            return (
              <PostCard.Header
                key={`boardPostFeedHeader-${i}`}
                title={e}
                isSelected={i === selectedItem}
                onClick={() => setSelectedItem(i)}
                isClickable={true}
              />
            );
          })}
        </PostCard.Wrapper.HeaderWrapper>
      </div>
      <PostCard.Wrapper.ListWrapper colSpan={12}>
        <PostCard.List.WithoutBoardName
          postItem={items || []}
          boardName="게시판 이름"
          isShowLike={true}
          isLoading={isFetching}
        />
      </PostCard.Wrapper.ListWrapper>
    </PostCard.Container>
  );
}
