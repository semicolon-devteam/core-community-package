import { ReactNode } from "react";

export default function BoardWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full h-auto p-3 sm:p-5 bg-white rounded-2xl shadow-custom border border-border-default flex-col justify-center items-center gap-3 sm:gap-5 flex overflow-hidden">
      {children}
    </div>
  );
}
