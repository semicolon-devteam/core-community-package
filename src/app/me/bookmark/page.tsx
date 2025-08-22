import SuspenseLoader from "@common/SuspenseLoader";
import BookmarkedPosts from "@organisms/BookmarkedPosts";
import { Suspense } from "react";

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

export default async function MyPageBookmark() {
    return (
        <Suspense fallback={<SuspenseLoader text="북마크 페이지를 불러오는 중입니다..." />}>
            <BookmarkedPosts />
        </Suspense>
    )
}