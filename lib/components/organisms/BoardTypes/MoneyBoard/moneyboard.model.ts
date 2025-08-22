import TitleWithComment from "@atoms/Column/BoardTableBody/TitleWithComment";
import UserProfile from "@atoms/Column/BoardTableBody/UserProfile";
import type { Column } from "@atoms/Column/column.model";

export const columns: Column[] = [
  {
    id: "id",
    align: "center",
    justify: "center",
    gridLayout: 2,
    title: "번호",
  },
  {
    id: "title",
    align: "center",
    justify: "start",
    gridLayout: 6,
    title: "제목",
    render: TitleWithComment,
  },
  {
    id: "companyName",
    align: "center",
    justify: "center",  
    gridLayout: 4,
    title: "업체명",
  },
  {
    id: "address",
    align: "center",
    justify: "center",
    gridLayout: 4,
    title: "주소",
  },
  {
    id: "bid",
    align: "center",
    justify: "center",
    gridLayout: 4,
    title: "입찰견적",
    textColor: "text-primary",
  },
  {
    id: "writer_name",
    align: "center",
    justify: "center",
    gridLayout: 4,
    title: "이름",
    render: UserProfile,
  },
  {
    id: "created_at",
    align: "center",
    justify: "center",
    gridLayout: 2,
    title: "날짜",
  },
  {
    id: "view_count",
    align: "center",
    justify: "center",
    gridLayout: 2,
    title: "조회",
  },
];
