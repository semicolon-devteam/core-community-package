// import PostTemplate from "@templates/PostTemplate";
import SuspenseLoader from "@common/SuspenseLoader";
import { ContentType } from "@model/post";
import NewPostTemplate from "@templates/NewPostTemplate";
import { Suspense } from "react";

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

export default function BannerAddPage() {
    return (
        <Suspense fallback={<SuspenseLoader text="배너 생성 페이지를 불러오는 중입니다..." />}>
            <NewPostTemplate defaultContentType={ContentType.BANNER} />
        </Suspense>
    )
}