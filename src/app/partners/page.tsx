import SuspenseLoader from "@common/SuspenseLoader";
import Board from "@molecules/Board";
import { Suspense } from "react";
import PartnerListWrapper from "./PartnerListWrapper";

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

export default function PartnersPage() {
  return (
    <Suspense fallback={<SuspenseLoader text="파트너 목록을 불러오는 중입니다..." />}>
      <Board.Container>
        <PartnerListWrapper />
      </Board.Container>
    </Suspense>
  );
}
