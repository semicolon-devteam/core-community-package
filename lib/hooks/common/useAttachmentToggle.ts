//TODO: 추후 파일 관련 다른 훅과 병합 필요

import { useState } from 'react';

export const useAttachmentToggle = (initialState: boolean = false) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialState);

  const toggle = () => {
    setIsExpanded(prev => !prev);
  };

  const expand = () => {
    setIsExpanded(true);
  };

  const collapse = () => {
    setIsExpanded(false);
  };

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
    buttonText: isExpanded ? '접기' : '펼치기',
  };
};