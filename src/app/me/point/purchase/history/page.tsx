import { getServerSupabase } from "@config/Supabase/server";
import ErrorHandler from "@organisms/ErrorHandler";
import PurchaseHistory from "@organisms/PurchaseHistory";
import { Suspense } from "react";

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

export default async function MyPageInformation() {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        return <ErrorHandler message="포인트 내역 보기는 로그인 후 이용 가능합니다." routeUrl="/" />;
    }

    return (
        <Suspense fallback={<div className="text-center py-8">로딩중...</div>}>
            <PurchaseHistory />
        </Suspense>
    );
}