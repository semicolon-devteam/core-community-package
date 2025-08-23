'use client';

import { usePermission } from '@hooks/common/usePermission';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { Menu } from '../../../types/menu';
// import MobileNavigation from "./MobileNavigation";
import { useGlobalLoader, useThrottle } from '@hooks/common';
import { useRouterWithLoader } from '@hooks/common/useRouterWithLoader';

export default function PcNavigation({
  menuItems = [],
}: {
  menuItems: Menu[];
}) {
  const [hoverMenuIndex, setHoverMenuIndex] = useState<number | null>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { checkPermission, showAccessDeniedToast } = usePermission();
  const router = useRouterWithLoader();

  const { hideLoader } = useGlobalLoader();

  // PC 환경에서 외부 영역 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 모든 메뉴를 닫는 함수
  const closeAllMenus = () => {
    setHoverMenuIndex(null);
    setShowBackdrop(false);
  };

  // 메인 메뉴 클릭 처리
  const handleMainMenuClick = (item: Menu) => {
    if (!checkPermission(item.required_level)) {
      showAccessDeniedToast();
      hideLoader();
      return;
    }

    router.push(item.link_url || '/');
    closeAllMenus();
  };

  // 하위 메뉴 클릭 처리
  const handleSubMenuClick = (subItem: Menu) => {
    if (!checkPermission(subItem.required_level)) {
      showAccessDeniedToast();
      hideLoader();
      return;
    }

    router.push(subItem.link_url || '/');
    closeAllMenus();
  };

  // 호버 처리를 위한 타이머 참조
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 메뉴 항목에 마우스가 올라갔을 때 처리 (PC 전용)
  const handleMenuMouseEnter = (index: number) => {
    // 기존 타이머가 있으면 취소
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    // 호버 상태 설정
    if (hoverMenuIndex !== index) {
      setHoverMenuIndex(index);
    }

    // 하위 메뉴가 있는 경우에만 백드롭 표시
    const menuItem = menuItems[index];
    if (menuItem && menuItem.children && menuItem.children.length > 0) {
      setShowBackdrop(true);
    } else {
      setShowBackdrop(false);
    }
  };

  // 메뉴 전체 영역에서 마우스가 나갔을 때 처리
  const handleNavigationMouseLeave = () => {
    // 약간의 지연을 주어 하위 메뉴로 이동할 시간을 확보
    hoverTimerRef.current = setTimeout(() => {
      setHoverMenuIndex(null);
      setShowBackdrop(false);
    }, 100);
  };

  // 하위 메뉴로 마우스가 들어왔을 때 처리
  const handleSubMenuMouseEnter = () => {
    // 타이머 취소 (메뉴 닫힘 방지)
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  // 하위 메뉴에서 마우스가 나갔을 때 처리
  const handleSubMenuMouseLeave = () => {
    // 약간의 지연을 주어 다른 하위 메뉴 항목으로 이동할 시간을 확보
    hoverTimerRef.current = setTimeout(() => {
      setHoverMenuIndex(null);
      setShowBackdrop(false);
    }, 100);
  };

  // 현재 경로에 해당하는 메뉴가 활성화되어 있는지 확인
  const isMenuActive = (index: number) => {
    const item = menuItems[index];
    return (
      pathname === item.link_url ||
      (pathname !== '/' && pathname.startsWith(item.link_url + '/'))
    );
  };

  return (
    <>
      {/* 전체 네비게이션 영역 */}
      <div
        ref={navRef}
        className="relative w-full bg-white border-b-2 border-primary z-20"
        onMouseLeave={useThrottle(handleNavigationMouseLeave)}
      >
        {/* 메인 메뉴 영역 */}
        <nav>
          {/* 상위 메뉴 영역 */}
          <div className="w-full">
            <ul className="flex items-center justify-center gap-4 lg:gap-10 whitespace-nowrap px-2 py-0">
              {menuItems.map((item, index) => {
                const isActive = isMenuActive(index);

                return (
                  <li
                    key={`menuItems-${index}`}
                    className="flex flex-col"
                    onMouseEnter={() => {
                      handleMenuMouseEnter(index);
                    }}
                  >
                    <button
                      onClick={() => handleMainMenuClick(item)}
                      className={`
                        flex py-0 px-3 h-[72px] items-center justify-center text-base lg:text-lg font-medium font-nexon leading-normal whitespace-nowrap 
                        ${
                          isActive
                            ? 'text-primary'
                            : hoverMenuIndex === index
                            ? 'text-primary'
                            : 'text-text-primary'
                        } 
                        hover:text-primary transition-colors
                      `}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* 하위 메뉴 영역 - 호버 상태에서만 표시됨 */}
        <div
          className={`
            absolute left-0 right-0 bg-white overflow-hidden transition-all duration-300 ease-in-out z-20
            ${
              hoverMenuIndex !== null &&
              menuItems[hoverMenuIndex] &&
              menuItems[hoverMenuIndex].children &&
              menuItems[hoverMenuIndex].children.length > 0
                ? 'opacity-100 py-4 border-t border-t-gray-300 border-b-2 border-primary'
                : 'max-h-0 opacity-0 py-0 border-t-0 border-b-0'
            }
          `}
          onMouseEnter={useThrottle(handleSubMenuMouseEnter)}
          onMouseLeave={useThrottle(handleSubMenuMouseLeave)}
        >
          <div className="container mx-auto flex justify-center">
            {/* 호버 상태에 따라 보여줄 하위 메뉴 */}
            {hoverMenuIndex !== null &&
              menuItems[hoverMenuIndex] &&
              menuItems[hoverMenuIndex].children && (
                <div className="grid grid-cols-5 gap-4 w-full max-w-4xl">
                  {menuItems[hoverMenuIndex].children.map(
                    (subItem, subIndex) => {
                      return (
                        <button
                          key={`hover-subMenu-${hoverMenuIndex}-${subIndex}`}
                          onClick={() => handleSubMenuClick(subItem)}
                          className={`
                            py-2 px-4 rounded-lg text-center transition-colors
                            ${
                              subItem.link_url === pathname
                                ? 'text-primary font-bold'
                                : 'text-black hover:bg-gray-100'
                            }
                          `}
                        >
                          {subItem.name}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* 백드롭 - 클릭 시 메뉴 닫기 */}
      {showBackdrop && (
        <div
          className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-10 mt-[76px] transition-opacity duration-300"
          onClick={closeAllMenus}
        />
      )}
    </>
  );
}
