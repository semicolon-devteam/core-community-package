import { SearchType, SortBy } from "../../types/board";
import type { GalleryListItem } from "../../types/post";
interface PostService {
    boardId: number;
    page: number;
    pageSize?: number;
    sortBy?: SortBy;
    searchType?: SearchType;
    searchText?: string;
    categoryId?: string | number | null;
}
export declare const usePostQuery: (params: PostService, options: {
    enabled: boolean;
}) => import("@tanstack/react-query").UseQueryResult<{
    data: {
        items: {
            created_at: any;
            writer_id?: string;
            writer_nickname?: string;
            writer_avatar?: string;
            is_notice?: boolean;
            board_id?: number;
            view_count?: number;
            content?: string;
            dislike_count?: number;
            id: number;
            title: string;
            attachments: import("../../types/post").FileAttachment[];
            comment_count: number;
            like_count: number;
            users?: {
                avatar_path: string;
                nickname: string;
                activity_level: number;
            };
            metadata?: {
                thumbnail?: string | null;
                recommendId?: string;
                siteUrl?: string;
                cast?: string;
                releaseDate?: string;
                notice_type?: "event" | "notice";
            };
        }[];
        totalCount: number;
        notices: import("../../types/post").ListPost[];
    };
}, Error>;
export declare const usePostBookmarkQuery: () => import("@tanstack/react-query").UseQueryResult<GalleryListItem[] | {
    data: any[];
}, Error>;
export declare const useDraftPostQuery: (params?: {
    page?: number;
    pageSize?: number;
    sortBy?: SortBy;
    writerId?: number;
}, options?: {
    enabled: boolean;
    enablePolling?: boolean;
}) => import("@tanstack/react-query").UseQueryResult<{
    data: {
        items: {
            created_at: any;
            writer_id?: string;
            writer_nickname?: string;
            writer_avatar?: string;
            is_notice?: boolean;
            board_id?: number;
            view_count?: number;
            content?: string;
            dislike_count?: number;
            id: number;
            title: string;
            attachments: import("../../types/post").FileAttachment[];
            comment_count: number;
            like_count: number;
            users?: {
                avatar_path: string;
                nickname: string;
                activity_level: number;
            };
            metadata?: {
                thumbnail?: string | null;
                recommendId?: string;
                siteUrl?: string;
                cast?: string;
                releaseDate?: string;
                notice_type?: "event" | "notice";
            };
        }[];
        totalCount: number;
        notices: import("../../types/post").ListPost[];
    };
}, Error>;
export {};
