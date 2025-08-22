import { serverFetch } from "@config/fetch";
import { CommonStatus } from "@model/common";
import { timeAgo } from "@util/dateUtil";
interface CommentService {
  postId: number;
  page: number;
  pageSize?: number;
}

const CommentServiceByServerSide = {
  getCommentsByServerSide: async ({
    postId,
    page,
    pageSize = 10,
  }: CommentService) => {
    try {
      // URL 파라미터를 명시적으로 숫자로 변환
      const params = new URLSearchParams({
        postId: String(postId),
        page: String(page),
        pageSize: String(pageSize),
      });

      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/comments?${params.toString()}`;
      const res = await serverFetch(url);
      if (!res.ok) {
        console.error(`API 요청 실패: ${res.status}`);
        return {
          data: { items: [], totalCount: 0 },
          successOrNot: "Y",
          statusCode: "SUCCESS",
        };
      }

      const json = await res.json();

      // API 응답이 이미 올바른 형식인지 확인
      if (json.successOrNot === "Y" && json.data && json.data.items) {
        return {
          ...json,
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: json.data.items.map((item: any) => ({
              ...item,
              created_at: timeAgo(item.created_at),
            })),
            totalCount: json.data.totalCount || 0,
          },
        };
      }

      // 이전 API 형식 처리 (데이터가 배열로 오는 경우)
      if (Array.isArray(json)) {
        return {
          successOrNot: "Y",
          statusCode: "SUCCESS",
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: json.map((item: any) => ({
              ...item,
              created_at: timeAgo(item.created_at),
              writer_name: item.writer_name || item.user_name || "익명", // 이전 필드명도 지원
            })),
            totalCount: json.length,
          },
        };
      }

      // 기본 반환 형식
      return {
        successOrNot: "Y",
        statusCode: "SUCCESS",
        data: {
          items: [],
          totalCount: 0,
        },
      };
    } catch (error) {
      console.error("댓글 조회 오류:", error);
      // 오류 발생 시 기본값 반환
      return {
        data: { items: [], totalCount: 0 },
        successOrNot: "Y",
        statusCode: "SUCCESS",
      };
    }
  },

  getCommentById: async ({ id }: { id: string }) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`;
      const res = await serverFetch(url);

      if (!res.ok) {
        console.error(`API 요청 실패: ${res.status}`);
        return {
          data: null,
          successOrNot: "N",
          statusCode: CommonStatus.FAIL,
        };
      }

      const json = await res.json();

      // API 응답 형식에 따라 처리
      if (json.successOrNot === "Y" && json.data) {
        return {
          ...json,
          data: {
            ...json.data,
            // 서버 측 날짜 포맷 함수 사용
            created_at: timeAgo(json.data.created_at),
            writer_name: json.data.writer_name || json.data.user_name || "익명", // 이전 필드명도 지원
          },
        };
      }

      // 이전 API 형식 처리 (데이터가 직접 오는 경우)
      return {
        successOrNot: "Y",
        statusCode: "SUCCESS",
        data: {
          ...json,
          // 서버 측 날짜 포맷 함수 사용
          created_at: timeAgo(json.created_at),
          writer_name: json.writer_name || json.user_name || "익명", // 이전 필드명도 지원
        },
      };
    } catch (error) {
      console.error("댓글 조회 오류:", error);
      // 오류 발생 시 기본값 반환
      return {
        data: null,
        successOrNot: "N",
        statusCode: CommonStatus.FAIL,
      };
    }
  },
};

export default CommentServiceByServerSide;
