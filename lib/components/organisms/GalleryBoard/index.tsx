import type { GalleryItem } from '@model/board';
import PostCard from '@molecules/PostCard';
import { Skeleton } from '@atoms/Skeleton';

export default function GalleryBoard({
  items,
  selectedItem,
  setSelectedItem,
  currentPage = 1,
  isLoading = false,
}: {
  items: GalleryItem[];
  selectedItem: number;
  setSelectedItem: (item: number) => void;
  currentPage?: number;
  isLoading?: boolean;
}) {

  const galleryBoardHeader = ['도전', '소셜', '방송', '분석'];

  console.log(`items`, items);
  return (
    <PostCard.Container>
      <div className="col-span-12">
        <PostCard.Wrapper.HeaderWrapper>
          {galleryBoardHeader.map((e, i) => {
            return (
              <PostCard.Header
                key={`galleryBoardHeader-${i}`}
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
        {isLoading ? (
          <div className="w-full h-[156px] flex gap-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={`gallery-skeleton-${i}`} className="flex flex-col items-center w-[219px]">
                <Skeleton className="w-[219px] h-[124px] mb-2" />
                <Skeleton className="w-3/4 h-4 mb-1" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))}
          </div>
        ) : !items || items.length === 0 ? (
          <div className="w-full h-[156px] flex items-center justify-center font-nexon text-sm text-text-secondary">
            조회된 결과값이 없습니다
          </div>
        ) : (
          <div className="w-full h-[156px] justify-start items-start gap-2 flex">
            {items.map((item, index) => (
              <PostCard.List.Gallery
                key={`galleryBoardItem-${index}`}
                title={item.title}
                image={
                  item.metadata?.thumbnail || 'https://placehold.co/219x124'
                }
                comment_count={item.comment_count ?? 0}
                like_count={item.like_count ?? 0}
                id={item.id}
                currentPage={currentPage}
              />
            ))}
          </div>
        )}
      </PostCard.Wrapper.ListWrapper>
    </PostCard.Container>
  );
}
