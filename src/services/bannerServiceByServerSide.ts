import { CommonStatus } from "@model/common";

const BannerServiceByServerSide = {
  getBanner: async (position?: "CENTER" | "RIGHT_SIDE") => {
    try {
      // position이 없는 경우 기본값 제공
      const url = `${
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      }/api/banners${position ? `?position=${position}` : ''}`;
      
      // 정적 렌더링을 위해 cache: 'force-cache' 사용
      const res = await fetch(url, {
        cache: 'force-cache',
        next: { 
          revalidate: 60, // 60초마다 재검증
          tags: ['banners'] // 태그 기반 재검증 지원
        }
      }).catch(() => null); // fetch 실패 시 null 반환

      // 응답이 없거나 실패한 경우 기본값 반환
      if (!res || !res.ok) {
        if (res) {
          console.error(`배너 정보 API 요청 실패: ${res.status}`);
          console.error(`요청 실패상세:`, res.statusText);
        }
        return {
          data: [],
          successOrNot: "Y", // 기본값 제공으로 성공 처리
          statusCode: CommonStatus.SUCCESS,
        };
      }

      const json = await res.json().catch(() => null);
      
      // JSON 파싱 실패 시 기본값 반환
      if (!json) {
        return {
          data: [],
          successOrNot: "Y",
          statusCode: CommonStatus.SUCCESS,
        };
      }

      return {
        ...json,
        data: json.data || [], // 데이터가 없는 경우 빈 배열 제공
        successOrNot: "Y",
        statusCode: CommonStatus.SUCCESS,
      };
    } catch (error) {
      console.error("배너 조회 오류:", error);
      // 에러 발생 시에도 기본값 제공
      return {
        data: [],
        successOrNot: "Y",
        statusCode: CommonStatus.SUCCESS,
      };
    }
  },
};

export default BannerServiceByServerSide;
