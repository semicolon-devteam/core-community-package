import { CommonResponse, CommonStatus } from "@model/common";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // const supabase = await getServerSupabase();
    //   const { data, error } = await supabase.auth.getUser();
    
    // 1500~2500 사이의 랜덤 값 생성
    const randomUser = Math.floor(Math.random() * (2500 - 1500 + 1)) + 1500;
    const { data, error } = { data: { realtimeUser: randomUser.toString() }, error: null };

    if (error) {
        return NextResponse.json<CommonResponse<string>>(
        { 
            data: null,
            message: "실시간 사용자 수 조회에 실패했습니다.",
            successOrNot: "N",
            statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        },
        { status: 200 }
        );
    }

    return NextResponse.json({
        data: data.realtimeUser,
        successOrNot: "Y",
        statusCode: CommonStatus.SUCCESS,
        } as CommonResponse<String>,

        { status: 200 }
    )
}