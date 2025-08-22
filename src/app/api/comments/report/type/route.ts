import { getServerSupabase } from "@config/Supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('report_types')
    .select(`
        code,
        name,
        description
    `)
    .eq('is_active', true) // 활성화 여부
    .order('display_order', { ascending: true })
  if(error) {
    return NextResponse.json({
      successOrNot: "N",
      statusCode: "FAIL",
      error: "신고 사유 조회 실패",
    }, { status: 200 });
  }
  return NextResponse.json({
    successOrNot: "Y",
    statusCode: "SUCCESS",
    data: data,
  });
}

