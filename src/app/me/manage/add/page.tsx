// import PostTemplate from "@templates/PostTemplate";
import { ContentType } from "@model/post";
import NewPostTemplate from "@templates/NewPostTemplate";

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

export default function PartnerAddPage() {
    return (
        <NewPostTemplate defaultContentType={ContentType.PARTNER} />
    )
}