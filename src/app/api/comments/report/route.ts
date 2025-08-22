import { getServerSupabase } from "@config/Supabase/server";
import { CommonResponse, CommonStatus } from "@model/common";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
        return NextResponse.json({
            successOrNot: "N",
            statusCode: CommonStatus.UNAUTHORIZED,
            data: null,
            message: "로그인이 필요합니다.",
        } as CommonResponse<any>, { status: 200 });
    }

    const { data: userData } = await supabase
        .from("users")
        .select(`id, activity_level`)
        .eq("auth_user_id", data?.user?.id);

    const body = await request.json();

    const { data: isReported } = await supabase
        .from('reports')
        .select()
        .eq('target_id', body.commentId)
        .eq('reporter_id', userData?.[0]?.id)
        .single();
    
    if(isReported) {
        return NextResponse.json({
            successOrNot: "N",
            statusCode: CommonStatus.FAIL,
            data: null,
            message: "이미 신고된 댓글입니다.",
        } as CommonResponse<any>, { status: 200 });
    }

    const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .insert({
            target_id: body.commentId,
            report_type_code: body.reasonId,
            content: body.description,
            target_type: body.targetType,
            reporter_id: userData?.[0]?.id,
        })
        .select()
        .single();
        
    if(reportError) {
        return NextResponse.json({
            successOrNot: "N",
            statusCode: CommonStatus.FAIL,
            data: null,
            message: reportError.message,
        } as CommonResponse<any>, { status: 200 });
    }
    return NextResponse.json({
        successOrNot: "Y",
        statusCode: CommonStatus.SUCCESS,
        data: null,
        message: "신고 처리가 완료되었습니다.",
    } as CommonResponse<any>, { status: 200 });
}