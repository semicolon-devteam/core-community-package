"use client";

import { useAppDispatch } from "@hooks/common";
import { showToast } from "@redux/Features/Toast/toastSlice";
import { useState } from "react";

interface ClipboardButtonProps {
  text: string;
  className?: string;
  successMessage?: string;
  errorMessage?: string;
  disabled?: boolean;
}

export default function ClipboardButton({ 
  text, 
  className = "", 
  successMessage = "클립보드에 복사되었습니다.",
  errorMessage = "복사에 실패했습니다.",
  disabled = false
}: ClipboardButtonProps) {
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!text || disabled) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        dispatch(showToast({
          title: "성공",
          content: successMessage,
          show: true,
          headerTextColor: "text-green-500",
          remainTime: "방금"
        }));
      })
      .catch(err => {
        dispatch(showToast({
          title: "실패",
          content: errorMessage,
          show: true,
          headerTextColor: "text-red-500",
          remainTime: "방금"
        }));
      });
  };

  if (copied) {
    return (
      <span className={`text-xs text-green-500 font-medium ${className}`}>
        복사됨
      </span>
    );
  }

  return (
    <button
      onClick={copyToClipboard}
      disabled={disabled || !text}
      className={`hover:bg-gray-100 rounded-md transition-colors relative group disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="클립보드에 복사"
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
          className="fill-gray-500 group-hover:fill-primary transition-colors"
        />
      </svg>
    </button>
  );
} 