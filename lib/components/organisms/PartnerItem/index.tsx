"use client";

import LinkWithLoader from "@common/LinkWithLoader";
import { useAppDispatch } from "@hooks/common";
import type { PartnerItem as PartnerItemType } from '../../../types/partner';
import { showToast } from "@redux/Features/Toast/toastSlice";
import { useState } from "react";

export default function PartnerItem({ partner }: { partner: PartnerItemType }) {
  const { siteName, recommendId, imageUrl, siteUrl } = partner;
  const dispatch = useAppDispatch();

  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    if (!recommendId) return;
    navigator.clipboard.writeText(recommendId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        dispatch(showToast({

          title: "성공",
          content: "추천 ID가 복사되었습니다.",
          headerTextColor: "text-green-500",
          remainTime: "방금",
        }));
      })
      .catch(err => {
        dispatch(showToast({

          title: "실패",
          content: "추천 ID 복사 실패",
          headerTextColor: "text-red-500",
          remainTime: "방금",
        }));
      });
  };

  return (
    <div className="flex flex-col w-auto  relative bg-white rounded-2xl shadow-custom border border-[#e5e5e8] overflow-hidden p-5">
      {/* 사이트 이미지 */}
      <div className="w-full h-[200px] overflow-hidden flex align-center">
        <img
          className="w-full ounded-lg object-cover mb-2"
          src={(imageUrl && imageUrl !== "") ? imageUrl : 'https://placehold.co/400x200'}
          alt={siteName}
        />
      </div>
      {/* 사이트 설명 */}
      <div className="w-full bg-[#f8f8fb] rounded-lg border border-[#e5e5e8] flex-col justify-start items-start inline-flex overflow-hidden mb-5">
        <div className="w-full border-b border-[#e5e5e8] justify-start items-center inline-flex overflow-hidden">
          <div className="w-[80px] min-w-[80px] p-2.5 bg-tertiary justify-center items-center gap-2.5 flex text-nowrap">
            <div className="text-white text-sm font-medium font-nexon leading-normal">
              사이트명
            </div>
          </div>
          <div className="w-full px-2 py-2.5 overflow-hidden">
            <div className="text-sm font-medium font-nexon leading-normal truncate">
              {siteName}
            </div>
          </div>
        </div>
        <div className="w-full justify-start items-center inline-flex overflow-hidden">
          <div className="w-[80px] min-w-[80px] p-2.5 bg-tertiary justify-center items-center gap-2.5 flex">
            <div className="text-white text-sm font-medium font-nexon leading-normal">
              추천ID
            </div>
          </div>
          <div className="w-full px-2 py-2.5 overflow-hidden flex items-center">
            <div className="text-primary text-sm font-bold font-nexon leading-normal truncate flex-grow">
              {recommendId}
            </div>
            {copied ? (
              <span className="text-xs ml-2  hover:bg-gray-100 rounded-md transition-colors relative">
                복사됨
              </span>
            ) : (
              <button
                onClick={copyToClipboard}
                className="ml-2 hover:bg-gray-100 rounded-md transition-colors relative group"
                aria-label="추천ID 복사"
                title="클립보드에 복사"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"
                    className="fill-tertiary group-hover:fill-primary transition-colors"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* 버튼 그룹 */}
      <div className="flex gap-2">
        <LinkWithLoader
          href={`/partners/${partner.id}`}
          className="w-full py-2.5 rounded-lg border border-tertiary justify-center items-center gap-2 inline-flex cursor-pointer"
        >
          <div data-svg-wrapper className="relative">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_42_2387)">
                <path
                  d="M17.1429 12.8571H12.8571V17.1429C12.8571 17.6143 12.4714 18 12 18C11.5286 18 11.1429 17.6143 11.1429 17.1429V12.8571H6.85714C6.38571 12.8571 6 12.4714 6 12C6 11.5286 6.38571 11.1429 6.85714 11.1429H11.1429V6.85714C11.1429 6.38571 11.5286 6 12 6C12.4714 6 12.8571 6.38571 12.8571 6.85714V11.1429H17.1429C17.6143 11.1429 18 11.5286 18 12C18 12.4714 17.6143 12.8571 17.1429 12.8571Z"
                  fill="#545456"
                />
              </g>
              <defs>
                <clipPath id="clip0_42_2387">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="text-center text-nowrap text-tertiary text-sm font-bold font-nexon leading-normal">
            상세보기
          </div>
        </LinkWithLoader>
        <a 
          href={siteUrl ?? "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-2.5 rounded-lg border border-primary justify-center items-center gap-2 inline-flex cursor-pointer"
        >
          <div data-svg-wrapper className="relative">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_42_2392)">
                <path
                  d="M16 16.6667H8C7.63333 16.6667 7.33333 16.3667 7.33333 16V8C7.33333 7.63333 7.63333 7.33333 8 7.33333H11.3333C11.7 7.33333 12 7.03333 12 6.66667C12 6.3 11.7 6 11.3333 6H7.33333C6.59333 6 6 6.6 6 7.33333V16.6667C6 17.4 6.6 18 7.33333 18H16.6667C17.4 18 18 17.4 18 16.6667V12.6667C18 12.3 17.7 12 17.3333 12C16.9667 12 16.6667 12.3 16.6667 12.6667V16C16.6667 16.3667 16.3667 16.6667 16 16.6667ZM13.3333 6.66667C13.3333 7.03333 13.6333 7.33333 14 7.33333H15.7267L12 11.06C11.74 11.32 11.74 11.74 12 12C12.26 12.26 12.68 12.26 12.94 12L16.6667 8.27333V10C16.6667 10.3667 16.9667 10.6667 17.3333 10.6667C17.7 10.6667 18 10.3667 18 10V6.66667C18 6.3 17.7 6 17.3333 6H14C13.6333 6 13.3333 6.3 13.3333 6.66667Z"
                  fill="#F37021"
                />
              </g>
              <defs>
                <clipPath id="clip0_42_2392">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="text-center text-nowrap text-primary text-sm font-bold font-nexon leading-normal">
            바로가기
          </div>
        </a>
      </div>
      
    </div>
  );
} 