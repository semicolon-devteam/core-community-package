// Grid 레이아웃 인터페이스

export interface Column {
  id: string;
  align: "center" | "left" | "right";
  justify: "start" | "center" | "end";
  title: string;
  textColor?: string;
  gridLayout: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (column: any, row: any) => React.ReactNode;
}

// Grid 클래스 생성 유틸리티 함수
export function generateGridClasses(gridLayout: number): string {
  return `col-span-${gridLayout}`;
}
