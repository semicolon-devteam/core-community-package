import { getServerSupabase } from "@config/Supabase/server";
import type { BoardCategory } from "@model/board";
import type { CommonResponse } from "@model/common";
import { CommonStatus } from "@model/common";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;

  const supabase = await getServerSupabase();

  const { data, error } = await supabase
    .from("board_categories")
    .select(
      `
      id, 
      board_id,
      name,
      description,
      display_order
      `
    )
    .eq("board_id", id)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("카테고리 목록 로딩 오류:", error);
    return NextResponse.json(
      {
        data: null,
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<BoardCategory[]>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      data: data,
      successOrNot: "Y",
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<BoardCategory[]>,
    {
      status: 200,
    }
  );
}
