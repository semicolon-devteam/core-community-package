import { getServerSupabase } from "@config/Supabase/server";
import { CommonResponse, CommonStatus } from "@model/common";
import { NextRequest, NextResponse } from "next/server";

// @info: Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: { params: any }) {
   const { id } = await context.params;
  const supabase = await getServerSupabase();

  // publicUrl을 가져옵니다
  const { data } = await supabase.storage
    .from("public-bucket")
    .getPublicUrl(`public/img/${id}`);

  // 실제 이미지 URL로 리다이렉트
  if (!data) {
    return NextResponse.json(
      {
        data: null,
        successOrNot: "N",
        message: `파일을 찾을 수 없습니다.`,
        statusCode: CommonStatus.FAIL,
      } as CommonResponse<null>,
      { status: 200 }
    );
  } else {
    
    return new Response(data.publicUrl, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
}
