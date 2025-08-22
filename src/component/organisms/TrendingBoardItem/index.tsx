"use client";

import { useTrendingQuery } from "@hooks/queries/useHomeQuery";
import type { Board } from "@model/board";
import PostCard from "@molecules/PostCard";

export default function TrendingBoardItem({
  selectedItem,
  setSelectedItem,
}: {
  selectedItem: number;
  setSelectedItem: (item: number) => void;
  boards?: Board[];
}) {
  const trendingBoardHeader = ["일간 인기글", "주간 인기글", "월간 인기글"];
  const currentPeriod = ['daily', 'weekly', 'monthly'][selectedItem] as 'daily' | 'weekly' | 'monthly';
  const { data: items, isFetching } = useTrendingQuery({ period: currentPeriod });

  // 데이터를 두 그룹으로 분할
  const firstHalf = items ? items.slice(0, Math.ceil(items.length / 2)) : [];
  const secondHalf = items ? items.slice(Math.ceil(items.length / 2)) : [];
  
  return (
    <PostCard.Container>
      <div className="col-span-12">
        <PostCard.Wrapper.HeaderWrapper>
          {trendingBoardHeader.map((e, i) => {
            return (
              <PostCard.Header
                key={`trendingBoardHeader-${i}`}
                title={e}
                isSelected={i === selectedItem}
                onClick={() => setSelectedItem(i)}
                isClickable={true}
              />
            );
          })}
        </PostCard.Wrapper.HeaderWrapper>
      </div>
      <div className="col-span-12 md:col-span-6 flex flex-col justify-start items-start gap-2">
        <PostCard.List.WithBoardName
          postItem={firstHalf}
          isShowRank={true}
          isShowLike={true}
          isLoading={isFetching}
          skeletonCount={Math.ceil(10 / 2)}
        />
      </div>
      <div className="col-span-12 md:col-span-6 h-40 flex flex-col justify-start items-start gap-2">
        <PostCard.List.WithBoardName
          postItem={secondHalf}
          isShowRank={true}
          isShowLike={true}
          isLoading={isFetching}
          skeletonCount={Math.floor(10 / 2)}
        />
      </div>
    </PostCard.Container>
  );
}
