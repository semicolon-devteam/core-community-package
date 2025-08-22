'use client';

import LinkWithLoader from '@common/LinkWithLoader';
import { useAppSelector } from '@hooks/common';
import UserAvatar from '@molecules/UserAvatar';
import { selectUserInfo } from '@redux/Features/User/userSlice';
import { isAdmin } from '@util/authUtil';
import Image from "next/image";
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// 실제 컨텐츠 컴포넌트
function MyPageContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useAppSelector(selectUserInfo);
  const adminStatus = isAdmin(userInfo);

  // URL pathname과 link를 비교하여 활성 상태를 확인하는 함수
  const isActiveLink = (link: string) => {
    // 쿼리 파라미터가 있는 경우 (예: /post?boardId=40)
    if (link.includes('?')) {
      const currentUrl = `${pathname}${
        searchParams ? `?${searchParams.toString()}` : ''
      }`;
      return currentUrl.includes(link);
    }
    // 일반적인 경로 비교
    return pathname === link;
  };

  // 로그인 체크 로직 제거 - 상위 LoginGuard에서 처리

  return (
    <div>
      <div className="w-full bg-white rounded-2xl shadow-custom border border-border-default overflow-hidden p-5 whitespace-nowrap">
        {/* 상단 프로필 정보 */}
        <div className="flex items-start mb-6">
          {/* 프로필 이미지 */}
          <UserAvatar
            profileImage={userInfo?.profileImage}
            size={60}
            className="mr-5"
            isChangeButton={true}
          />
          {/* 사용자 정보 컨테이너 */}
          <div className="flex flex-col flex-grow">
            {/* 닉네임 */}
            <div className="flex items-center mb-2">
              <Image
                src={`/icons/level/${userInfo?.level}.png`}
                alt="유저 프로필"
                width={24}
                height={24}
                className="mr-1 w-6 h-6"
              />
              <div className="text-text-primary text-base font-medium font-nexon">
                {userInfo?.nickname || '사용자'}
              </div>
              <div className="text-text-tertiary text-sm font-normal font-nexon ml-1">
                님
              </div>
            </div>

            {/* 포인트 정보 */}
            <div className="flex justify-between items-center w-full">
              <div className="text-text-secondary text-sm font-normal font-nexon">
                보유 포인트 :
              </div>
              <div className="flex items-center gap-1">
                <div className="text-primary text-sm font-medium font-nexon">
                  {userInfo?.point?.toLocaleString() || '0'}
                </div>
                <div className="text-primary text-sm font-medium font-nexon">
                  P
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 경험치 바 */}
        <div className="flex items-center gap-2 mb-6">
          <div className="text-text-tertiary text-sm font-normal font-nexon">
            경험치
          </div>
          <div className="h-3 bg-[#f8f8fb] rounded-lg flex-grow overflow-hidden relative">
            <div
              className="h-full bg-primary rounded-lg absolute left-0 top-0"
              style={{ width: `${userInfo?.level || 0}%` }}
            />
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-border-default mb-5"></div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {myPageList.map(item => {
            const isActive = isActiveLink(item.link);

            return item.isEnable ? (
              <LinkWithLoader
                key={item.id}
                href={item.link}
                className={`
                  w-full text-text-primary rounded-lg shadow-custom border border-border-default overflow-hidden py-3 px-4 flex justify-center items-center transition-colors
                  ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-white hover:text-white hover:bg-gray-900'
                  } 
                `}
              >
                <div className="text-sm font-medium font-nexon">
                  {item.title}
                </div>
              </LinkWithLoader>
            ) : (
              <div
                key={item.id}
                className="w-full text-text-primary bg-gray-200 text-text-secondary rounded-lg shadow-custom border border-border-default overflow-hidden py-3 px-4 flex justify-center items-center transition-colors cursor-not-allowed"
              >
                <div className="text-sm font-medium font-nexon">
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>

        {adminStatus && (
          <div>
            <div className="border-t border-border-default mb-5"></div>
            <h2 className="text-text-primary text-lg font-medium font-nexon mb-2">
              관리자 메뉴
            </h2>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {adminPageList.map(item => {
                const isActive = isActiveLink(item.link);

                return (
                  <LinkWithLoader
                    key={item.id}
                    href={item.link}
                    className={`
                      w-full text-text-primary rounded-lg shadow-custom border border-border-default overflow-hidden py-3 px-4 flex justify-center items-center transition-colors cursor-pointer
                      ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'bg-white hover:bg-gray-900 hover:text-white'
                      }
                    `}
                  >
                    <div className="text-sm font-medium font-nexon">
                      {item.title}
                    </div>
                  </LinkWithLoader>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const myPageList = [
  {
    id: 1,
    title: '정보 수정',
    link: '/me/information',
    isEnable: false,
  },
  {
    id: 2,
    title: '포인트 내역',
    link: '/me/point',
    isEnable: true,
  },
  {
    id: 3,
    title: '포인트 구매',
    link: '/me/point/purchase',
    isEnable: true,
  },
  {
    id: 4,
    title: '블랙리스트',
    link: '/me/blacklists',
    isEnable: false,
  },
  {
    id: 5,
    title: '북마크',
    link: '/me/bookmark',
    isEnable: true,
  },
  {
    id: 6,
    title: '내 게시글',
    link: '/me/post/draft',
    isEnable: true,
  },
  {
    id: 7,
    title: '내 글 반응',
    link: '/me/post-reactions',
    isEnable: false,
  },
  {
    id: 8,
    title: '회원탈퇴',
    link: '/me/withdrawal',
    isEnable: false,
  },
];

const adminPageList = [
  {
    id: 1,
    title: '컨텐츠 등록',
    link: '/me/manage/add',
  },
  {
    id: 2,
    title: '포인트 지급/회수',
    link: '/me/manage/point',
  },
  {
    id: 3,
    title: '포인트 구매관리',
    link: '/me/manage/purchase',
  },
];

// 메인 컨테이너 컴포넌트
export default function MyPageContainer() {
  return (
    <Suspense fallback={<div className="text-center py-8">로딩중...</div>}>
      <MyPageContent />
    </Suspense>
  );
}
