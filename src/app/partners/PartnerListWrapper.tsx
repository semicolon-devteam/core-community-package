"use client";

import SuspenseLoader from "@common/SuspenseLoader";
import { useRouterWithLoader } from "@hooks/common";
import { usePartnerQuery } from "@hooks/queries/usePartnerQuery";
import Board from "@molecules/Board";
import PartnerList from "@organisms/PartnerList";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PartnerListWrapper() {
  const router = useRouterWithLoader();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const refresh = searchParams.get("refresh") === "true";
  const pathname = usePathname();
  const { data: partnerData, isLoading, refetch } = usePartnerQuery({ page });

  useEffect(() => {
    if (refresh) {
      refetch();
      // URL에서 refresh 파라미터 제거
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('refresh');
      
      // 새로운 URL로 교체 (페이지 히스토리 변경 없이)
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl);
    }
  }, [refresh, refetch]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/partners?${params.toString()}`);
  };
  
  if (isLoading) {
    return <SuspenseLoader text="파트너 목록을 불러오는 중입니다..."/>
  }

  return (
    <>
      <PartnerList
        items={partnerData?.items || []}
        totalCount={partnerData?.totalCount || 0}
        totalPage={partnerData?.totalPage || 1}
      />
      <Board.Pagination
        totalPages={partnerData?.totalPage || 1}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    </>
  );
} 