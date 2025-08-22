import { getServerSupabase } from "@config/Supabase/server";
import type { Board } from "@model/board";
import type { CommonResponse } from "@model/common";
import { CommonStatus } from "@model/common";
import { keysToCamelCase } from "@util/stringUtil";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: any }) {
  const { id } = await context.params;

  const supabase = await getServerSupabase();

  const { data, error } = await supabase
    .from("boards")
    .select(
      `
      id, 
      name,
      description,
      permission_settings,
      point_settings,
      feature_settings,
      display_settings,
      board_categories (
        id,
        name,
        description,
        display_order
      )
    `
    )
    .eq("is_active", true)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("게시물 목록 로딩 오류:", error);
    return NextResponse.json(
      {
        data: null,
        successOrNot: "N",
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<Board>,
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      data: {
        id: data?.id,
        name: data?.name,
        description: data?.description,
        categories: data?.board_categories,
        permissionSettings: keysToCamelCase(data?.permission_settings || {}),
        pointSettings: keysToCamelCase(data?.point_settings || {}),
        featureSettings: keysToCamelCase(data?.feature_settings || {}),
        displaySettings: keysToCamelCase(data?.display_settings || {}),
      },
      successOrNot: "Y",
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<Board>,
    {
      status: 200,
    }
  );
}
