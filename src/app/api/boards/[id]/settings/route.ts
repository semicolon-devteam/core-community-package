import { getServerSupabase } from "@config/Supabase/server";
import type { BoardSettings } from "@model/board";
import type { CommonResponse } from "@model/common";
import { CommonStatus } from "@model/common";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;

  const supabase = await getServerSupabase();

  const { data, error } = await supabase
    .from("boards")
    .select(
      `
      permission_settings,
      feature_settings,
      point_settings,
      display_settings,
      upload_settings
      `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("카테고리 목록 로딩 오류:", error);
    return NextResponse.json(
      {
        data: null,
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<BoardSettings>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      data: data as unknown as BoardSettings,
      successOrNot: "Y",
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<BoardSettings>,
    {
      status: 200,
    }
  );
}
