import AdminMenu from "@atoms/Column/BoardTableBody/AdminMenu";
import NoticeTag from "@atoms/Column/BoardTableBody/NoticeTag";
import TitleWithComment from "@atoms/Column/BoardTableBody/TitleWithComment";
import UserProfile from "@atoms/Column/BoardTableBody/UserProfile";
import type { Column } from "@atoms/Column/column.model";

// 데스크탑 컬럼 정의 (기본: 1 + 6 + 3 + 1 + 1 = 12)
export const desktopColumns: Column[] = [
  {
    id: "sequenceNumber",
    align: "center",
    justify: "center",
    title: "번호",
    gridLayout: 1,
  },
  {
    id: "title",
    align: "center",
    justify: "start",
    title: "제목",
    gridLayout: 6,
    render: TitleWithComment,
  },
  {
    id: "users",
    align: "center",
    justify: "center",
    title: "닉네임",
    gridLayout: 3,
    render: UserProfile,
  },
  {
    id: "created_at",
    align: "center",
    justify: "center",
    title: "날짜",
    gridLayout: 1,
  },
  {
    id: "view_count",
    align: "center",
    justify: "center",
    title: "조회",
    gridLayout: 1,
  },
];

// 공지사항 데스크탑 컬럼 정의 (기본: 1 + 6 + 3 + 1 + 1 = 12)
export const noticeColumns: Column[] = [
  {
    id: "sequenceNumber",
    align: "center",
    justify: "center",
    title: "번호",
    gridLayout: 1,
    render: NoticeTag,
  },
  {
    id: "title",
    align: "center",
    justify: "start",
    title: "제목",
    gridLayout: 6,
    render: TitleWithComment,
  },
  {
    id: "users",
    align: "center",
    justify: "center",
    title: "닉네임",
    gridLayout: 3,
    render: UserProfile,
  },
  {
    id: "created_at",
    align: "center",
    justify: "center",
    title: "날짜",
    gridLayout: 1,
  },
  {
    id: "view_count",
    align: "center",
    justify: "center",
    title: "조회",
    gridLayout: 1,
  },
];

// Admin용 공지사항 데스크탑 컬럼 정의 (Admin: 1 + 5 + 3 + 1 + 1 + 1 = 12)
export const getNoticeColumnsWithAdmin = (): Column[] => [
  {
    id: "sequenceNumber",
    align: "center",
    justify: "center",
    title: "번호",
    gridLayout: 1,
    render: NoticeTag,
  },
  {
    id: "title",
    align: "center",
    justify: "start",
    title: "제목",
    gridLayout: 5,
    render: TitleWithComment,
  },
  {
    id: "users",
    align: "center",
    justify: "center",
    title: "닉네임",
    gridLayout: 3,
    render: UserProfile,
  },
  {
    id: "created_at",
    align: "center",
    justify: "center",
    title: "날짜",
    gridLayout: 1,
  },
  {
    id: "view_count",
    align: "center",
    justify: "center",
    title: "조회",
    gridLayout: 1,
  },
  {
    id: "admin_menu",
    align: "center",
    justify: "center",
    title: "",
    gridLayout: 1,
    render: AdminMenu,
  },
];

// 공지사항 모바일 컬럼 정의 (기본: 12 [첫 번째 행], 4 + 2 + 6 = 12 [두 번째 행])
export const noticeColumnsMobile: Column[] = [
  {
    id: "title",
    align: "center",
    justify: "start",
    title: "제목",
    gridLayout: 12,
    render: TitleWithComment,
  },
  {
    id: "created_at",
    align: "center",
    justify: "start",
    title: "날짜",
    gridLayout: 4,
  },
  {
    id: "view_count",
    align: "center",
    justify: "start",
    title: "조회",
    gridLayout: 2,
  },
  {
    id: "writer_name",
    align: "center",
    justify: "end",
    title: "닉네임",
    gridLayout: 6,
    render: UserProfile,
  },
];

// Admin용 공지사항 모바일 컬럼 정의 (Admin: 11 + 1 = 12 [첫 번째 행], 4 + 2 + 6 = 12 [두 번째 행])
export const getNoticeColumnsMobileWithAdmin = (): Column[] => [
  {
    id: "title",
    align: "center",
    justify: "start",
    title: "제목",
    gridLayout: 11,
    render: TitleWithComment,
  },
  {
    id: "admin_menu",
    align: "center",
    justify: "center",
    title: "",
    gridLayout: 1,
    render: AdminMenu,
  },
  {
    id: "created_at",
    align: "center",
    justify: "start",
    title: "날짜",
    gridLayout: 4,
  },
  {
    id: "view_count",
    align: "center",
    justify: "start",
    title: "조회",
    gridLayout: 2,
  },
  {
    id: "writer_name",
    align: "center",
    justify: "end",
    title: "닉네임",
    gridLayout: 6,
    render: UserProfile,
  },
];

// Admin용 데스크탑 컬럼 정의 (Admin: 1 + 5 + 3 + 1 + 1 + 1 = 12)
export const getDesktopColumnsWithAdmin = (): Column[] => [
  {
    id: "sequenceNumber",
    align: "center",
    justify: "center",
    title: "번호",
    gridLayout: 1,
  },
  {
    id: "title",
    align: "center",
    justify: "start",
    title: "제목",
    gridLayout: 5,
    render: TitleWithComment,
  },
  {
    id: "users",
    align: "center",
    justify: "center",
    title: "닉네임",
    gridLayout: 3,
    render: UserProfile,
  },
  {
    id: "created_at",
    align: "center",
    justify: "center",
    title: "날짜",
    gridLayout: 1,
  },
  {
    id: "view_count",
    align: "center",
    justify: "center",
    title: "조회",
    gridLayout: 1,
  },
  {
    id: "admin_menu",
    align: "center",
    justify: "center",
    title: "",
    gridLayout: 1,
    render: AdminMenu,
  },
];

// 모바일 컬럼 정의 (기본: 12 [첫 번째 행], 4 + 2 + 6 = 12 [두 번째 행])
export const mobileColumns: Column[] = [
  // {
  //   id: "sequenceNumber",
  //   align: "center",
  //   justify: "center",
  //   title: "번호",
  //   gridLayout: 2,
  // },
  {
    id: "title",
    align: "center",
    justify: "start",
    title: "제목",
    gridLayout: 12,
    render: TitleWithComment,
  },
  {
    id: "created_at",
    align: "center",
    justify: "start",
    title: "날짜",
    gridLayout: 4,
  },
  {
    id: "view_count",
    align: "center",
    justify: "start",
    title: "조회",
    gridLayout: 2,
  },

  {
    id: "writer_name",
    align: "center",
    justify: "end",
    title: "닉네임",
    gridLayout: 6,
    render: UserProfile,
  },
];

// Admin용 모바일 컬럼 정의 (Admin: 11 + 1 = 12 [첫 번째 행], 4 + 2 + 6 = 12 [두 번째 행])
export const getMobileColumnsWithAdmin = (): Column[] => [
  // {
  //   id: "sequenceNumber",
  //   align: "center",
  //   justify: "center",
  //   title: "번호",
  //   gridLayout: 2,
  // },
  {
    id: "title",
    align: "center",
    justify: "start",
    title: "제목",
    gridLayout: 11,
    render: TitleWithComment,
  },
  {
    id: "admin_menu",
    align: "center",
    justify: "center",
    title: "",
    gridLayout: 1,
    render: AdminMenu,
  },
  {
    id: "created_at",
    align: "center",
    justify: "start",
    title: "날짜",
    gridLayout: 4,
  },
  {
    id: "view_count",
    align: "center",
    justify: "start",
    title: "조회",
    gridLayout: 2,
  },

  {
    id: "writer_name",
    align: "center",
    justify: "end",
    title: "닉네임",
    gridLayout: 6,
    render: UserProfile,
  },
];