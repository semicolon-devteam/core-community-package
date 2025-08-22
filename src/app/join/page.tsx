import SuspenseLoader from "@common/SuspenseLoader";
import { Suspense } from "react";
import JoinForm from "./JoinForm";

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

export default function JoinPage() {
  return (
    <Suspense fallback={<SuspenseLoader text="회원가입 페이지를 불러오는 중입니다..." />}>
      <JoinForm />
    </Suspense>
  );
} 