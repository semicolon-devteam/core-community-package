// import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@config/Supabase/server";
import type { CommonResponse, LevelInfo } from "@model/common";
import { CommonStatus } from "@model/common";

export async function GET() {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
        .from("user_level_configs")
        .select("level, required_points")
        .order("level", { ascending: true });
    if (error) {
        return new Response(JSON.stringify({ 
            data: null, 
            message: error.message,
            successOrNot: "N", 
            statusCode: CommonStatus.INTERNAL_SERVER_ERROR 
        } as CommonResponse<LevelInfo[]>), { status: 200 });
    }
    return new Response(JSON.stringify({ 
        data, 
        successOrNot: "Y", 
        statusCode: CommonStatus.SUCCESS 
    } as CommonResponse<LevelInfo[]>), { status: 200 });
}
