import type { Column } from '@atoms/Column/column.model';
import { generateGridClasses } from '@atoms/Column/column.model';
import { useRouterWithLoader } from '@hooks/common';
import PopOver from '@molecules/PopOver';
import Image from "next/image";

import { useMemo, useRef, useState } from 'react';

export default function UserProfile({
  column,
  row,
}: {
  column: Column;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
}) {
  const [showPopover, setShowPopover] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouterWithLoader();
  const gridClasses = generateGridClasses(column.gridLayout);

  const postButtons = useMemo(() => {
    return [
      {
        label: '블랙리스트 추가',
        onClick: () => {
          console.log('블랙리스트 추가');
        },
        enabled: false,
      },
      {
        label: '차단하기',
        onClick: () => {
          console.log('차단하기');
        },
        enabled: false,
      },
      {
        //TODO: 사용자명 검색이 아닌 사용자 아이디로 검색하도록 개선
        label: '전체 게시물',
        onClick: () => {
          router.push(
            `/board/open-lounge/free?type=search&searchText=${row.users.nickname}&sortBy=latest&searchType=writer`
          );
        },
        enabled: true,
      },
    ];
  }, [router, row.users.nickname]);
  return (
    <div
      onClick={() => setShowPopover(!showPopover)}
      className={`${gridClasses} h-8 sm:h-11 cursor-pointer py-2 sm:py-2.5 justify-${column.justify} items-${column.align} gap-1 flex`}
    >
      <Image
        className="w-9 h-9"
        src={`/icons/level/${row.users.activity_level || 1}.png`}
        alt="user"
        width={36}
        height={36}
      />
      <div className="text-center text-text-tertiary text-xs sm:text-sm font-normal font-nexon leading-normal overflow-hidden text-ellipsis text-nowrap">
        {row.users.nickname}
      </div>
      {showPopover && (
        <PopOver
          menuRef={menuRef}
          buttons={postButtons}
          setShowPopOver={setShowPopover}
          headerLabel={`[유저] ${row.writer_name}`}
          // headerLabel={"asdfsdafdsfaasdfsdafdsfaasdfsdafdsfaasdfsdafdsfaasdfsdafdsfaasdfsdafdsfaasdfsdafdsfa"}
        />
      )}
    </div>
  );
}
