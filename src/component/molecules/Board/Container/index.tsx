import { ReactNode } from "react";

export default function BoardContainer({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-12 lg:col-span-7 lg:col-start-2 flex flex-col gap-2 justify-center items-center">
      {children}
    </div>
  );
}
