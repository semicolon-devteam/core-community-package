import SuspenseLoader from "@common/SuspenseLoader";
import InformationModifier from "@organisms/InformationModifier";
import { Suspense } from "react";

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

export default async function MyPageInformation() {
    return (
        <Suspense fallback={<SuspenseLoader text="정보 수정 페이지를 불러오는 중입니다..." />}>
            <InformationModifier />
        </Suspense>
    )
}