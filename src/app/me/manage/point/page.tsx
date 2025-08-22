import PointManage from '@organisms/PointManage/index';
import UserServiceByServerSide from '@services/userServiceByServerSide';
import { Metadata } from 'next';

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: '포인트 관리',
};

export default async function PointManagePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const userId = resolvedSearchParams?.['user-id'];
  const finalUserId = typeof userId === 'string' ? parseInt(userId) : undefined;

  // user-id가 있을 경우 사용자 정보 조회
  let selectedUserInfo = null;
  if (finalUserId) {
    const userResponse = await UserServiceByServerSide.getInfoById(finalUserId);
    if (userResponse.successOrNot === 'Y' && userResponse.data) {
      selectedUserInfo = userResponse.data;
    }
  }

  return (
    <PointManage userId={finalUserId} userInfo={selectedUserInfo} />
  )
}
