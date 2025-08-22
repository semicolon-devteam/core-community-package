import { useLatestQuery } from "@hooks/queries/useHomeQuery";
import PostCard from "@molecules/PostCard";

export default function LatestBoard({
  selectedItem, 
  setSelectedItem,
}: { 
  selectedItem: number, 
  setSelectedItem: (item: number) => void,
}) {
  const latestBoardHader = ["최신 게시글", "최신 댓글"];
  const currentLatestItemType = ['post', 'comment'][selectedItem] as 'post' | 'comment';
  const { data: items, isFetching } = useLatestQuery({ type: currentLatestItemType });

  return (
    <div className="grid grid-cols-12 h-60 px-3 bg-white rounded-2xl shadow-custom border border-[#e5e5e8]  overflow-hidden">
      <div className="col-span-12">
        <div className="flex w-full">
          {latestBoardHader.map((e, i) => {
            return (
              <PostCard.Header
                key={`latestBoardHader-${i}`}
                title={e}
                isSelected={i === selectedItem}
                onClick={() => setSelectedItem(i)}
                isClickable={true}
              />
            );
          })}
        </div>
      </div>
      <div className="col-span-12 h-[152px] flex flex-col justify-start items-start gap-2">
        <PostCard.List.WithBoardName
          postItem={items || []}
          isShowDate={true}
          isShowRank={false}
          isShowLike={true}
          isShowComment={selectedItem === 0}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
}
