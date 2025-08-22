import { serverFetch } from "@config/fetch";
import { CommonStatus } from "@model/common";

const levelServiceByServerSide = {
  getLevelInfo: async () => {
    try {
      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/levels`;
      const res = await serverFetch(url);

      if (!res.ok) {
        console.error(`레벨 정보 API 요청 실패: ${res.status}`);
        console.error(`요청 실패상세:`, res.statusText);
        return {
          data: null,
          message: "레벨 정보 조회 실패",
          successOrNot: "N",
          statusCode: CommonStatus.FAIL,
        };
      }

      const json = await res.json();
      return {
        data: json.data,
        successOrNot: "Y",
        statusCode: CommonStatus.SUCCESS,
      };
    } catch (error) {
      return {
        data: null,
        message: "레벨 정보 조회 실패",
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      };
    }
  },
};

export default levelServiceByServerSide;
