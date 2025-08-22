import { getServerSupabase } from "@config/Supabase/server";
import { CommonResponse, CommonStatus } from "@model/common";
import type { PointTransaction } from "@model/point";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: any }) {

  const { id } = await context.params;
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
  const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '10');

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize - 1;

  const supabase = await getServerSupabase();

  // 전체 개수 조회
  const { count } = await supabase
    .from('point_transactions')
    .select('*', { count: 'exact', head: true })
    .eq("user_id", id);

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 페이지네이션된 데이터 조회
  const { data, error } = await supabase
  .from('point_transactions')
  .select(`
    id,
    created_at,
    user_id,
    amount,
    balance_after,
    transaction_type,
    description
  `)
  .eq("user_id", id)
  .order('id', { ascending: false })
  .range(startRange, endRange);

  if (error) {

    return NextResponse.json({
      data: null,
      message: error.message,
      successOrNot: "N",
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
    } as CommonResponse<{
      items: PointTransaction[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
    }>,
      { status: 200 }
    );
  }

  return NextResponse.json<CommonResponse<{
    items: PointTransaction[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>>(
    {
      successOrNot: "Y",
      statusCode: CommonStatus.SUCCESS,
      data: {
        items: data ?? [],
        totalCount,
        currentPage: page,
        totalPages,
      },
    },
    { status: 200 }
  );
}
