'use client';

import LinkWithLoader from '@common/LinkWithLoader';

interface WriteButtonProps {
  link: string;
}

/**
 * 게시판 작성 버튼
 * @param link 게시판 링크
 * @param isVisible 버튼 보여줄지 여부
 */
export default function WriteButton({ link }: WriteButtonProps) {
  return (
    <div className="w-full flex justify-end mt-4">
      <LinkWithLoader
        href={link}
        className="h-9 px-5 py-2 bg-orange-500 rounded-lg inline-flex justify-center items-center"
      >
        <div className="text-center justify-center text-white text-sm font-bold leading-normal">
          작성하기
        </div>
      </LinkWithLoader>
    </div>
  );
}
