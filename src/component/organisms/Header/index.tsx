"use client";
import LinkWithLoader from "@common/LinkWithLoader";
import {
    getRealtimeUser,
    useAppDispatch,
    useAppSelector,
    useDebounce,
    useRouterWithLoader,
} from "@hooks/common";
import {
    selectUIState,
    toggleMobileMenu,
    toggleSearchExpand,
} from "@redux/Features/UI/uiSlice";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

import { ReactElement, useEffect, useState } from "react";

import SearchBar from "@molecules/SearchBar";
import { formatNumberWithComma } from "@util/numberUtil";
import { usePathname } from "next/navigation";

export default function Header(): ReactElement {
  const { isMobile, isMobileMenuOpen, isSearchExpanded } =
    useAppSelector(selectUIState);
  const dispatch = useAppDispatch();
  const [realTimeUser, setRealTimeUser] = useState<string>("");
  const pathname = usePathname();
  useEffect(() => {
    const fetchRealTimeUser = async () => {
      try {
        const result = await getRealtimeUser();
        setRealTimeUser(result);
      } catch (error) {
        console.error("실시간 사용자 수 조회 실패:", error);
      }
    };
    fetchRealTimeUser();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      dispatch(toggleMobileMenu());
    }
  }, [pathname]);

  const debouncedToggleMenu = useDebounce(() => dispatch(toggleMobileMenu()));
  const debouncedToggleSearch = useDebounce(() =>
    dispatch(toggleSearchExpand())
  );
  const [searchText, setSearchText] = useState("");
  const router = useRouterWithLoader();
  const debouncedGlobalSearch = useDebounce((text: string) => {
    if (searchText) {
      const params = new URLSearchParams();
      params.set("type", "search");
      params.set("searchText", searchText);
      params.set("sortBy", "latest");
      params.set("searchType", "title_content");
      router.push(`/board/open-lounge/free?${params.toString()}`);
      setSearchText("");
    }
  });

  const partnerSites = ["제휴 1", "제휴 2", "제휴 3", "제휴 4"];

  return (
    <div className="max-w-global-container mx-auto h-[76px] bg-white w-full flex justify-between items-center overflow-hidden px-4 md:px-8">
      {/* 모바일에서 검색창 확장 시에는 로고 영역에 검색박스 표시 */}
      {!isMobile || (isMobile && !isSearchExpanded) ? (
        <LinkWithLoader
          href="/"
          className="py-[13px] rounded justify-center items-center inline-flex overflow-hidden"
        >
          <Image
            src={normalizeImageSrc("/images/main/logo.png")}
            alt="logo"
            width={88}
            height={44}
            className="w-[88px] h-[44px]"
          />
        </LinkWithLoader>
      ) : (
        <SearchBar
          className="w-full"
          autoFocus
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          onSearchClick={debouncedGlobalSearch}
          onKeyDown={(e) => e.key === "Enter" && debouncedGlobalSearch()}
        />
      )}

      {/* 데스크톱에서는 검색바 표시 */}
      {!isMobile && (
        <SearchBar
          onSearchClick={debouncedGlobalSearch}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          onKeyDown={(e) => e.key === "Enter" && debouncedGlobalSearch()}
        />
      )}

      {/* 파트너 사이트 목록 - 모바일에서는 숨김 */}
      {/* {!isMobile && (
        <div className="justify-start items-center gap-1.5 inline-flex">
          {partnerSites.map((e, i) => {
            const isLastItem = i === partnerSites.length - 1;
            return (
              <div
                key={`partnerSites-${i}`}
                className=" h-6 justify-center items-center flex gap-1.5"
              >
                <div className=" text-center text-text-secondary text-sm font-medium leading-normal">
                  {e}
                </div>
                {!isLastItem && (
                  <div className="w-0.25 h-4 origin-top-left  border border-border-default"></div>
                )}
              </div>
            );
          })}
        </div>
      )} */}

      {/* 실시간 접속자 - 모바일에서는 숨김 */}
      {!isMobile && (
        <div className="justify-center items-center gap-1 inline-flex">
          <div className="text-center text-text-primary text-sm font-normal leading-normal text-nowrap">
            실시간 접속자
          </div>
          <div className="text-primary text-sm font-medium leading-normal">
            ({formatNumberWithComma(realTimeUser)})
          </div>
        </div>
      )}

      {/* 모바일에서 검색 버튼과 햄버거 메뉴 버튼은 오른쪽에 배치 */}
      {isMobile && (
        <div className="flex items-center gap-2">
          {/* 모바일 검색 버튼 혹은 실시간 접속자 - 메뉴 혹은 검색 확장 시 숨김 */}
          {!isSearchExpanded && !isMobileMenuOpen ? (
            <button
              onClick={debouncedToggleSearch}
              className="p-2 rounded-md flex items-center justify-center hover:opacity-80"
              aria-label="검색창 열기"
            >
              <Image
                src={normalizeImageSrc("/icons/search.svg")}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          ) : isMobileMenuOpen && !isSearchExpanded ? (
            <div className="justify-center items-center gap-1 inline-flex">
              <div className="text-center text-text-primary text-sm font-normal leading-normal">
                실시간 접속자
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                ({realTimeUser})
              </div>
            </div>
          ) : null}

          {/* 모바일 햄버거 메뉴 버튼 또는 X 버튼 */}
          <button
            onClick={
              isSearchExpanded
                ? debouncedToggleSearch
                : isMobileMenuOpen
                ? debouncedToggleMenu
                : debouncedToggleMenu
            }
            className="p-2 rounded-md focus:outline-none flex items-center justify-center"
            aria-label={
              isSearchExpanded
                ? "검색창 닫기"
                : isMobileMenuOpen
                ? "메뉴 닫기"
                : "메뉴 열기"
            }
          >
            {!isSearchExpanded && !isMobileMenuOpen ? (
              <div className="flex flex-col justify-center items-center w-6 h-6">
                <div className="w-6 h-0.5 bg-primary mb-1.5"></div>
                <div className="w-6 h-0.5 bg-primary mb-1.5"></div>
                <div className="w-6 h-0.5 bg-primary"></div>
              </div>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="#f37021"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="#f37021"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
