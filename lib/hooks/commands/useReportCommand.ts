import reportService from "@services/reportService";
export const useReportCommand = () => {

    const getReportTypes = async () => {
        try {
          const response = await reportService.getReportTypes();
          return response;
        } catch (error) {
          console.error("신고 사유 조회 오류:", error);
          throw error;
        }
    };

    const reportComment = async (targetId: number, reasonId: string, description: string, targetType: string) => {
        try {
            const response = await reportService.reportComment(targetId, reasonId, description, targetType);
            return response;
        } catch (error) {
            console.error("신고 처리 오류:", error);
            throw error;
        }

    };

    return {
      getReportTypes,
      reportComment,
    };
}