"use client";

import { useGlobalLoader } from "@hooks/common/useGlobalLoader";
import { useEffect } from "react";

export default function SuspenseLoader({ text = "페이지를 불러오는 중입니다..." }: { text?: string }) {
  const { showLoader, hideLoader } = useGlobalLoader();

  useEffect(() => {
    showLoader(text);

    return () => {
      hideLoader();
    };
  }, [showLoader, hideLoader, text]);

  return null; // 이 컴포넌트는 UI를 직접 렌더링하지 않습니다.
} 