interface CommentQueryParams {
    postId: number;
    page: number;
    pageSize?: number;
}
export declare const useCommentQuery: (params: CommentQueryParams, options?: {
    enabled?: boolean;
}) => import("@tanstack/react-query").UseQueryResult<{
    data: {
        items: any;
        totalCount: any;
    };
}, Error>;
export {};
