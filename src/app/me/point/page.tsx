import ErrorHandler from "@organisms/ErrorHandler";
import PointHistoryContainer from "@organisms/PointHistoryContainer";
import UserServiceByServerSide from "@services/userServiceByServerSide";
import pointService from "@services/pointService";

export default async function PointPage() {
  const { data } = await UserServiceByServerSide.getUserInfoDirect();

  if (!data || !data.isLoggedIn || !data.user) {
    return <ErrorHandler message="포인트 내역 보기는 로그인 후 이용 가능합니다." routeUrl="/" />;
  }

  // 서버사이드에서 포인트 히스토리 초기 데이터 조회
  let initialPointHistory = null;
  try {
    const historyResponse = await pointService.getUserPointHistory(
      data.user.user_id.toString(),
      1, // 첫 페이지
      10 // 기본 페이지 크기
    );
    
    if (historyResponse.successOrNot === 'Y' && historyResponse.data) {
      initialPointHistory = historyResponse.data;
    }
  } catch (error) {
    console.error('서버사이드 포인트 히스토리 조회 실패:', error);
  }

  return (
    <div className="container bg-white rounded-2xl shadow-custom border border-border-default p-5">
      <PointHistoryContainer 
        initialPoint={data.user.point}
        initialPointHistory={initialPointHistory}
        userId={data.user.user_id.toString()}
      />
    </div>
  );
}