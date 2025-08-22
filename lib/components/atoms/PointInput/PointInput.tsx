import React from "react";

interface PointInputProps {
  value: string;
  onChange: (value: string) => void;
  currentPoint?: number;
  pointType: "ADD" | "SUBTRACT";
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function PointInput({
  value,
  onChange,
  currentPoint = 0,
  pointType,
  label = "포인트 금액",
  placeholder = "포인트 금액을 입력해주세요.",
  className = "",
}: PointInputProps) {
  const inputAmount = parseInt(value) || 0;
  const showPreview = value && inputAmount > 0;
  const resultPoint = Math.max(0, currentPoint + (pointType === "ADD" ? inputAmount : -inputAmount));

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
        {label} <span className="text-primary">*</span>
      </label>
      
      {showPreview && (
        <div className="text-sm text-orange-500 font-medium font-nexon">
          {pointType === "ADD" ? "지급 후" : "차감 후"} 포인트:
          <span className="font-bold ml-1">{resultPoint}</span>
        </div>
      )}
      
      <input
        type="number"
        min="1"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
} 