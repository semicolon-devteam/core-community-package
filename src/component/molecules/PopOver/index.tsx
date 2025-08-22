
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";
import { RefObject, useEffect } from "react";

export interface MenuButton {
  label: string;
  onClick: () => void;
  className?: string;
  enabled?: boolean;
}

interface PopOverProps {
  menuRef: RefObject<HTMLDivElement>;
  buttons: MenuButton[];
  setShowPopOver: (show: boolean) => void;
  headerLabel?: string;
}

export default function PopOver({
  menuRef,
  buttons,
  setShowPopOver,
  headerLabel = "메뉴",
}: PopOverProps) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPopOver(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div
      ref={menuRef}
      className="bg-white border rounded shadow flex flex-col text-sm"
    >
      <div className="px-4 py-2  bg-slate-100  flex justify-between items-center border-b border-zinc-200 cursor-default min-w-20 max-w-48 gap-2">
        <span className="text-text-tertiary font-bold text-md font-nexon leading-normal overflow-hidden text-ellipsis text-nowrap">
          {headerLabel} 
        </span>
        <Image
          onClick={() => setShowPopOver(false)}
          className="cursor-pointer w-3 h-3"
                      src={normalizeImageSrc("/icons/x.svg")}
          alt="close"
          width={12}
          height={12}
        />
      </div>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          disabled={!button.enabled}
          className={`px-4 py-2 hover:bg-gray-200
            ${button.className || ''} 
            ${button.enabled ? '' : 'cursor-default opacity-50'}
          `}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
} 