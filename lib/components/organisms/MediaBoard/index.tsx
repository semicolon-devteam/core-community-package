'use client';

import LinkWithLoader from '@common/LinkWithLoader';
import type { MediaItem } from '../../../types/board';
import { BoardType } from '../../../types/board/enum';
import PostCard from '@molecules/PostCard';
import { optimizeImageSrc, getImageProps } from '@util/imageUtil';
import Image from 'next/image';

import { useState } from 'react';

export default function MediaBoard({ items }: { items: MediaItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);


  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  return (
    <PostCard.Container>
      <div className="col-span-12">
        <PostCard.Wrapper.HeaderWrapper>
          <PostCard.Header title="미디어 게시판" align="start" isSelected={true} link={`/board/open-lounge/media?boardId=${BoardType.VR}&type=content`} />
        </PostCard.Wrapper.HeaderWrapper>
      </div>


      {items.length > 0 ? (
      <>
        {(() => {
          const currentItem = items[currentIndex];
          const progressPercentage = ((currentIndex + 1) / items.length) * 100;
          
          return (
            <>
              <PostCard.Wrapper.ListWrapper colSpan={4} styleString="justify-center">
                <LinkWithLoader
                  href={`/post/${currentItem.id}`}
                  className="w-full relative pt-[100%] cursor-pointer"
                >
                  <Image
                    alt={currentItem.title}
                    className="rounded-lg object-cover"
                    src={optimizeImageSrc(
                      currentItem.thumbnailUrl || '/images/main/gallery-thumbnail.png'
                    )}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    {...getImageProps(currentItem.thumbnailUrl || '/images/main/gallery-thumbnail.png')}
                  />
                </LinkWithLoader>
              </PostCard.Wrapper.ListWrapper>

              <PostCard.Wrapper.ListWrapper colSpan={8}>
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-[#545456] text-sm font-normal font-nexon truncate overflow-hidden">
                      제목 : {currentItem.title}
                    </div>
                    <div className="text-[#545456] text-sm font-normal font-nexon truncate overflow-hidden">
                      출연진 : {currentItem.cast}
                    </div>
                    <div className="text-[#545456] text-sm font-normal font-nexon truncate overflow-hidden">
                      출시일 : {currentItem.releaseDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex-grow h-1 bg-[#e5e5e8] rounded overflow-hidden mr-2">
                      <div
                        className="h-1 bg-tertiary rounded transition-all duration-300 ease-in-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handlePrev}
                        className="focus:outline-none"
                        aria-label="이전 미디어"
                      >
                        <img
                          src="/icons/prev-icon.svg"
                          alt="이전"
                          className="w-6 h-6"
                        />
                      </button>

                      <button
                        onClick={handleNext}
                        className="focus:outline-none"
                        aria-label="다음 미디어"
                      >
                        <img
                          src="/icons/next-icon.svg"
                          alt="다음"
                          className="w-6 h-6"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </PostCard.Wrapper.ListWrapper>
            </>
          );
        })()}
      </>): (
        <div className="col-span-12 h-40 flex items-center justify-center font-nexon text-sm text-text-secondary">
          조회된 결과값이 없습니다
        </div>
      )}
    </PostCard.Container>
  );
}
