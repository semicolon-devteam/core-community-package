import { ReactNode } from "react";

import Header from "./Header";
import BoardTableList from "./List";

function Content({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex-col justify-start items-center flex overflow-x-auto">
      {children}
    </div>
  );
}

const BoardTable = {
  Header,
  Body: BoardTableList,
  Content,
};

export default BoardTable;
