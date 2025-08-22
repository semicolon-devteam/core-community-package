'use client';

import { useAppSelector, useGlobalLoader } from '@hooks/common';
import { usePermission } from '@hooks/common/usePermission';
import { useRouterWithLoader } from '@hooks/common/useRouterWithLoader';
import { selectUIState } from '@redux/Features/UI/uiSlice';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { Menu } from '@model/menu';
import { partnerSites } from './menuItems';

export default function MobileNavigation({
  menuItems = [],
}: {
  menuItems: Menu[];
}) {
  const { isMobileMenuOpen } = useAppSelector(selectUIState);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { checkPermission, showAccessDeniedToast } = usePermission();
  const router = useRouterWithLoader();

  const { hideLoader } = useGlobalLoader();

  // pathname이 변경되면 로더를 숨김 (페이지 이동 완료)
  useEffect(() => {
    hideLoader();
  }, [pathname, hideLoader]);

  // 클릭 이외의 영역을 클릭했을 때 메뉴를 닫기 위한 이벤트 핸들러
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

  // 모바일 메뉴가 열리면 기존 메뉴 상태 초기화
  useEffect(() => {
    if (isMobileMenuOpen) {
      setActiveMenuIndex(null);
    }
  }, [isMobileMenuOpen]);

  // 모든 메뉴를 닫는 함수
  const closeAllMenus = () => {
    setActiveMenuIndex(null);
    setShowBackdrop(false);
  };

  // 메뉴 항목 클릭 처리 (모바일용)
  const handleMenuClick = (index: number) => {
    // 이미 활성화된 메뉴를 다시 클릭하면 닫기
    if (activeMenuIndex === index) {
      setActiveMenuIndex(null);
      setShowBackdrop(false);
    } else {
      setActiveMenuIndex(index);
      // 하위 메뉴가 있는 경우에만 백드롭 표시
      const displayItems = isMobileMenuOpen ? partnerSites : menuItems;
      const menuItem = displayItems[index];
      if (menuItem && menuItem.children && menuItem.children.length > 0) {
        setShowBackdrop(true);
      } else {
        setShowBackdrop(false);
      }
    }
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

  // 현재 표시할 메뉴 항목들 (모바일 메뉴 열림/닫힘에 따라 다름)
  const displayItems = isMobileMenuOpen ? partnerSites : menuItems;

  // 현재 경로에 해당하는 메뉴가 활성화되어 있는지 확인
  const isMenuActive = (index: number) => {
    const item = displayItems[index];
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
      >
        {/* 메인 메뉴 영역 */}
        <nav>
          {/* 상위 메뉴 영역 - 가로 스크롤 적용 */}
          <div
            className="w-full overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <ul
              className="flex flex-nowrap overflow-x-auto items-center gap-1 whitespace-nowrap px-2 py-0"
              style={{ minWidth: 'max-content' }}
            >
              {displayItems.map((item, index) => {
                const isActive = isMenuActive(index);
                const hasChildren = item.children && item.children.length > 0;
                return (
                  <li
                    key={`menuItems-${index}`}
                    className="flex flex-col flex-shrink-0"
                  >
                    <button
                      onClick={
                        hasChildren
                          ? () => handleMenuClick(index)
                          : () => router.push(item.link_url || '/')
                      }
                      className={`
                        flex py-0 px-2 h-[72px] items-center justify-center text-xs md:text-sm lg:text-base font-medium font-nexon leading-normal whitespace-nowrap 
                        ${
                          isActive
                            ? 'text-primary'
                            : activeMenuIndex === index
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

        {/* 하위 메뉴 영역 - 클릭 상태에서만 표시됨 */}
        <div
          className={`
            absolute left-0 right-0 bg-white overflow-hidden transition-all duration-300 ease-in-out z-20
            ${
              activeMenuIndex !== null &&
              displayItems[activeMenuIndex] &&
              displayItems[activeMenuIndex].children &&
              displayItems[activeMenuIndex].children.length > 0
                ? 'opacity-100 py-4 border-t border-t-gray-300 border-b-2 border-primary'
                : 'max-h-0 opacity-0 py-0 border-t-0 border-b-0'
            }
          `}
        >
          <div className="container mx-auto">
            {/* 클릭 상태에 따라 보여줄 하위 메뉴 */}
            {activeMenuIndex !== null &&
              displayItems[activeMenuIndex]?.children && (
                <div className="flex flex-col w-full px-4">
                  <ul className="flex flex-col w-full gap-2">
                    {displayItems[activeMenuIndex].children.map(
                      (subItem, subIndex) => (
                        <li
                          key={`click-subMenu-${activeMenuIndex}-${subIndex}`}
                          className="w-full"
                        >
                          <button
                            onClick={() => handleSubMenuClick(subItem)}
                            className={`
                              block py-2 px-4 rounded-lg text-center transition-colors w-full
                              ${
                                subItem.link_url === pathname
                                  ? 'text-primary font-bold'
                                  : 'text-black hover:bg-gray-100'
                              }
                            `}
                          >
                            {subItem.name}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
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
