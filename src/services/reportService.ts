import { CommonResponse } from "@model/common";
import baseService from "./baseService";

interface ReportTypeService {
    code: string;
    name: string;
    display_order: number;
    error?: string;
}


const reportService = {
    getReportTypes(): Promise<CommonResponse<ReportTypeService>> {
        return baseService.get<ReportTypeService>(
          `/api/comments/report/type`
        );
    },
    reportComment(commentId: number, reasonId: string, description: string, targetType: string) {
        return baseService.post<ReportTypeService, { commentId: number; reasonId: string; description: string; targetType: string }>(
            `/api/comments/report`,
            { commentId, reasonId, description, targetType }
        );
    }
}

export default reportService;