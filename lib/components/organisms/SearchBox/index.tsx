"use client";

import BoardSearchIcon from "@atoms/Icon/BoardSearchIcon";
import CustomSelect, { SelectOption } from '@atoms/CustomSelect';
import { useDebounce } from "@hooks/common";
import type { BoardCategory, Board as BoardModel } from '../../../types/board';
import { SearchType, SortBy } from '../../../types/board';

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface BoardSearchBoxProps {
  onSearchClick: (params: {
    sortBy: SortBy, 
    searchType: SearchType, 
    searchText: string,
    selectedBoardId?: string
  }) => void;
  category?: BoardCategory[];
  isGlobalSearch?: boolean;
  allBoards?: BoardModel[];
}

export default function BoardSearchBox({ onSearchClick, category, isGlobalSearch, allBoards }: BoardSearchBoxProps) {
  const searchParams = useSearchParams();
  
  const [sortBy, setSortBy] = useState<SortBy>(searchParams.get("sortBy") as SortBy || "latest");
  const [searchType, setSearchType] = useState<SearchType>(searchParams.get("searchType") as SearchType || "title_content");
  const [searchText, setSearchText] = useState(searchParams.get("searchText") || "");
  const [selectedBoardId, setSelectedBoardId] = useState(searchParams.get("boardId") || "0");

  const debouncedSearch = useDebounce((params: {
    sortBy: SortBy, 
    searchType: SearchType, 
    searchText: string,
    selectedBoardId?: string
  }) => {
    onSearchClick(params);
  });

  // URL 파라미터 변경 감지 및 초기화
  useEffect(() => {
    const currentSortBy = searchParams.get("sortBy");
    const currentSearchType = searchParams.get("searchType");
    const currentSearchText = searchParams.get("searchText");
    const currentBoardId = searchParams.get("boardId");

    if (!currentSortBy && !currentSearchType && !currentSearchText) {
      setSortBy("latest");
      setSearchType("title_content");
      setSearchText("");
      setSelectedBoardId("0");
    } else {
      setSortBy((currentSortBy as SortBy) || "latest");
      setSearchType((currentSearchType as SearchType) || "title_content");
      setSearchText(currentSearchText || "");
      setSelectedBoardId(currentBoardId || "0");
    }
  }, [searchParams]);

  // 초기 검색 실행
  useEffect(() => {
    const type = searchParams.get("type");
    if (type != "search" && searchText) {
      debouncedSearch({
        sortBy, 
        searchType, 
        searchText,
        selectedBoardId: isGlobalSearch ? selectedBoardId : undefined
      });
    }
  }, []);

  const onSortChange = (value: string) => {
    setSortBy(value as SortBy);
    debouncedSearch({
      sortBy: value as SortBy, 
      searchType: searchType as SearchType, 
      searchText,
      selectedBoardId: isGlobalSearch ? selectedBoardId : undefined
    });
  }

  const onSearchTypeChange = (value: string) => {
    setSearchType(value as SearchType);
    searchInputRef.current?.focus();
  }

  const onSearchTextChange = (value: string) => {
    if(value.length > 100) {
      alert("검색어는 100자 이하로 입력해주세요.");
      return;
    }
    setSearchText(value);
  }

  const onBoardChange = (value: string) => {
    setSelectedBoardId(value);
    debouncedSearch({
      sortBy: sortBy as SortBy, 
      searchType: searchType as SearchType, 
      searchText,
      selectedBoardId: value
    });
  }

  const handleSearchClick = () => {
    debouncedSearch({
      sortBy: sortBy as SortBy, 
      searchType: searchType as SearchType, 
      searchText,
      selectedBoardId: isGlobalSearch ? selectedBoardId : undefined
    });
  }

  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`w-full h-auto pb-3 sm:pb-5 ${isGlobalSearch ? 'flex flex-col gap-4' : 'justify-between items-center flex flex-col sm:flex-row gap-2 sm:gap-0'}`}>
      {isGlobalSearch ? (
        <>
          {/* 전체 검색 시 첫 번째 줄: 셀렉트 박스들 */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {category && (
              <div className="flex-1relative flex items-center w-full sm:w-40">
                <CustomSelect<string>
                  options={[
                    { id: '0', label: '전체 게시판', value: '0' },
                    ...(allBoards?.map((board) => ({
                      id: board.id.toString(),
                      label: board.name,
                      value: board.id.toString()
                    })) || [])
                  ]}
                  value={selectedBoardId}
                  onChange={(option) => onBoardChange(option.value)}
                  className="w-full"
                />
              </div>
            )}
            <div className="relative flex items-center w-full sm:w-28">
              <CustomSelect<string>
                options={[
                  { id: 'latest', label: '최신순', value: 'latest' },
                  { id: 'popular', label: '인기순', value: 'popular' },
                  { id: 'views', label: '조회순', value: 'views' }
                ]}
                value={sortBy}
                onChange={(option) => onSortChange(option.value)}
                className="w-full"
              />
            </div>
            <div className="relative flex items-center w-full sm:w-32">
              <CustomSelect<string>
                options={[
                  { id: 'title_content', label: '제목+내용', value: 'title_content' },
                  { id: 'title', label: '제목', value: 'title' },
                  { id: 'content', label: '내용', value: 'content' },
                  { id: 'writer', label: '작성자', value: 'writer' }
                ]}
                value={searchType}
                onChange={(option) => onSearchTypeChange(option.value)}
                className="w-full sm:w-32"
              />
            </div>
          </div>

          {/* 전체 검색 시 두 번째 줄: 검색 입력창과 버튼 */}
          <div className="w-full h-9 sm:h-10 px-3 sm:px-5 py-0 sm:py-0 bg-white rounded-lg border border-border-default justify-center items-center gap-2 flex">
            <input
              ref={searchInputRef}
              type="text"
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              placeholder="검색어를 입력해주세요."
              className="h-full grow shrink basis-0 text-text-primary placeholder:text-text-placeholder text-xs sm:text-[13px] font-normal font-nexon leading-normal outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
            />
            <button
              onClick={handleSearchClick}
              className="relative flex items-center"
              aria-label="검색"
            >
              <BoardSearchIcon />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 일반 검색 시 기존 레이아웃 */}
          <div className="w-full sm:w-28 relative flex items-center gap-2">
            <CustomSelect<string>
              options={[
                { id: 'latest', label: '최신순', value: 'latest' },
                { id: 'popular', label: '인기순', value: 'popular' },
                { id: 'views', label: '조회순', value: 'views' }
              ]}
              value={sortBy}
              onChange={(option) => onSortChange(option.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row justify-end items-center gap-2">
            <div className="w-full sm:w-32 relative flex items-center">
              <CustomSelect<string>
                options={[
                  { id: 'title_content', label: '제목+내용', value: 'title_content' },
                  { id: 'title', label: '제목', value: 'title' },
                  { id: 'content', label: '내용', value: 'content' },
                  { id: 'writer', label: '작성자', value: 'writer' }
                ]}
                value={searchType}
                onChange={(option) => onSearchTypeChange(option.value)}
                className="w-full sm:w-32"
              />
            </div>
            <div className="w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-5 py-0 sm:py-0 bg-white rounded-lg border border-border-default justify-center items-center gap-2 flex">
              <input
                ref={searchInputRef}
                type="text"
                value={searchText}
                onChange={(e) => onSearchTextChange(e.target.value)}
                placeholder="검색어를 입력해주세요."
                className="h-full grow shrink basis-0 text-text-primary placeholder:text-text-placeholder text-xs sm:text-[13px] font-normal font-nexon leading-normal outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
              />
              <button
                onClick={handleSearchClick}
                className="relative flex items-center"
                aria-label="검색"
              >
                <BoardSearchIcon />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
