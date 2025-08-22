import React from "react";

interface RadioButtonProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
  className?: string;
  children?: React.ReactNode;
}

export default function RadioButton({
  checked,
  onChange,
  name,
  value,
  className = "",
  children,
}: RadioButtonProps) {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`
          flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center
          border-2 transition-colors duration-200
          ${checked ? "border-orange-500" : "border-gray-500"}
        `}
      >
        <span className={`w-2.5 h-2.5 rounded-full transition-opacity duration-200 ${checked ? "bg-orange-500 opacity-100" : "opacity-0"}`}></span>
      </span>
      {children && (
        <span className="ml-2 text-text-primary text-xs sm:text-sm font-normal font-nexon whitespace-nowrap">{children}</span>
      )}
    </label>
  );
}
