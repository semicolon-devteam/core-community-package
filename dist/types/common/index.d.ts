import { ReactNode } from 'react';
export interface OnlyChildrenProps {
    children: ReactNode;
}
export interface UserInfo {
    name: string;
    email?: string;
    profileImg?: string;
}
export declare enum CommonConstants {
    SESSION_NAME = "SESSION_NAME",// 성공
    YES_FLAG = "Y",// 예
    NO_FLAG = "N",// 아니오
    NA = "NA"
}
export declare enum CommonStatus {
    SUCCESS = 200,// 성공
    BAD_REQUEST = 400,// 잘못된 요청
    FAIL = 400,// 실패
    UNAUTHORIZED = 401,// 인증 오류
    FORBIDDEN = 403,// 권한 오류
    NOT_FOUND = 404,// 존재하지 않음
    INTERNAL_SERVER_ERROR = 500,// 서버 오류
    BAD_GATEWAY = 502,// 게이트웨이 오류
    SERVICE_UNAVAILABLE = 503,// 서비스 불가
    GATEWAY_TIMEOUT = 504
}
export interface CommonResponse<T> {
    successOrNot: string;
    statusCode: CommonStatus;
    status?: number;
    message?: string;
    data: T | null;
}
export interface LevelInfo {
    level: number;
    required_points: number;
}
export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
