"use client";

import { useAppDispatch, useAppSelector } from "@hooks/common";
import {
  hidePopup,
  removePopup,
  selectPopupState,
  type PopupConfig,
} from "@redux/Features/Popup/popupSlice";
import React, { useEffect, useState } from "react";

interface PopupItemProps {
  popup: PopupConfig;
  isVisible: boolean;
  onClose: (id: string) => void;
}

const PopupItem: React.FC<PopupItemProps> = ({ popup, isVisible, onClose }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  const getTypeStyles = () => {
    switch (popup.type) {
      case "error":
        return "border-red-500 text-red-600";
      case "warning":
        return "border-yellow-500 text-yellow-600";
      case "success":
        return "border-green-500 text-green-600";
      default:
        return "border-primary text-primary";
    }
  };
  const handleConfirm = async () => {
    if (popup.onConfirm) {
      await popup.onConfirm();
    }
    onClose(popup.id);
  };

  const handleCancel = () => {
    if (popup.onCancel) {
      popup.onCancel();
    }
    onClose(popup.id);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && popup.backdrop !== false) {
      if (popup.onClose) {
        popup.onClose();
      }
      onClose(popup.id);
    }
  };

  const handleCloseClick = () => {
    if (popup.onClose) {
      popup.onClose();
    }
    onClose(popup.id);
  };

  return (
    <div
      className={`
        fixed inset-0 z-[9998] flex items-center justify-center p-4
        bg-black backdrop-blur-sm transition-all duration-300 ease-out
        ${isAnimating ? "bg-opacity-50 opacity-100" : "bg-opacity-0 opacity-0"}
      `}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          relative bg-white rounded-lg shadow-xl border-2 ${getTypeStyles()}
          transition-all duration-300 ease-out transform  w-full
          ${
            isAnimating
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-90 opacity-0 translate-y-4"
          }
        `}
        style={{
          width: popup.width || "auto",
          height: popup.height || "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        {/* 닫기 버튼 */}
        {popup.closable !== false && (
          <button
            onClick={handleCloseClick}
            className="absolute top-3 right-3 text-text-secondary hover:text-text-default transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        {/* 팝업 헤더 */}
        {popup.title && (
          <div className="px-6 py-4 border-b border-border-default">
            <h3 className="text-lg font-semibold text-text-default font-nexon">
              {popup.title}
            </h3>
          </div>
        )}
        {/* 팝업 내용 */}
        <div className="px-6 py-4">
          {typeof popup.content === "string" ? (
            popup.content.includes('<') ? (
              <div 
                className="text-text-default font-nexon leading-relaxed"
                dangerouslySetInnerHTML={{ __html: popup.content }}
              />
            ) : (
              <p className="text-text-default font-nexon leading-relaxed">
                {popup.content}
              </p>
            )
          ) : (
            popup.content
          )}
        </div>
        {/* 팝업 버튼들 */}
        {(popup.showConfirm !== false || popup.showCancel !== false) && (
          <div className="px-6 py-4 border-t border-border-default flex justify-end gap-3">
            {popup.showCancel !== false && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-text-secondary border border-border-default rounded-lg hover:bg-gray-50 transition-colors font-nexon"
              >
                {popup.cancelText || "취소"}
              </button>
            )}
            {popup.showConfirm !== false && (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-opacity-90 transition-colors font-nexon"
              >
                {popup.confirmText || "확인"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const GlobalPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const { popups, isVisible } = useAppSelector(selectPopupState);

  const handleClose = (id: string) => {
    dispatch(hidePopup(id));

    // 애니메이션 완료 후 팝업 제거
    setTimeout(() => {
      dispatch(removePopup(id));
    }, 300);
  };

  return (
    <>
      {popups.map((popup: PopupConfig) => (
        <PopupItem
          key={popup.id}
          popup={popup}
          isVisible={isVisible[popup.id] || false}
          onClose={handleClose}
        />
      ))}
    </>
  );
};

export default GlobalPopup;
