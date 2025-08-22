
export type PartnerMetadata = {
    recommendId: string;
    thumbnail: string;
    siteUrl: string;
}

export interface ListPost {
    id: number;
    title: string;
    writer_id: string;
    writer_name: string;
    attachments: string[];
    is_notice: boolean;
    view_count: number;
    comment_count: number;
    // TODO: content 제거 후 수정 필요
    content: string;
    like_count: number;
    dislike_count: number;
    created_at: string;
    metadata?: PartnerMetadata;
}

export interface PartnerItem {
    id: number;
    siteName: string;
    recommendId: string;
    imageUrl: string;
    siteUrl: string;
}

export interface PartnerListResponse   {
    items: PartnerItem[];
    totalCount: number;
    totalPage: number;
}