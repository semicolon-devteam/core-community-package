import { getServerSupabase } from "@config/Supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET으로 댓글 조회
export async function GET(
    request: NextRequest,
) {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");

    // 인증 없이 공개 클라이언트로 조회
    const supabase = await getServerSupabase();
    
    // 댓글 조회 - posts 테이블 사용
    
    let query = supabase
        .from("banners")
        .select(`
            id,
            title,
            description,
            position,
            image_url,
            link_url,
            target_window,
            start_at,
            end_at,
            display_order,
            target_devices,
            width,
            height,
            is_responsive,
            click_count
        `) // profiles 대신 posts 테이블 사용
        .order("display_order", { ascending: true })

    if (position) {
        query = query.eq("position", position);
    }

    const { data, error } = await query;


    if (error) {
        console.error("배너 조회 오류:", error);
        return NextResponse.json(
            { 
                successOrNot: "N", 
                statusCode: "FAIL", 
                error: error.message 
            }, 
            { status: 200 }
        );
    }

    // 성공 응답 반환
    return NextResponse.json({
        successOrNot: "Y",
        statusCode: "SUCCESS",
        data: data
    });

}

export async function POST(request: NextRequest) {
    const { 
      title, 
      description, 
      position, 
      image_url, 
      link_url, 
      target_window, 
      start_at, 
      end_at, 
      display_order, 
      target_devices, 
      width, 
      height, 
      is_responsive, 
      status 
    } = await request.json();
    
    const supabase = await getServerSupabase();

    // 배너 생성
    const { data, error } = await supabase
      .from("banners")
      .insert({
        title,
        description,
        position,
        image_url,
        link_url,
        target_window,
        start_at,
        end_at,
        display_order,
        target_devices,
        width,
        height,
        is_responsive,
        status,
        click_count: 0 // 초기 클릭 수는 0으로 설정
    })
      .select();
  
    if (error) {
      console.error("배너 생성 오류:", error);
      return NextResponse.json(
        {
          successOrNot: "N",
          statusCode: "FAIL",
          data: null,
          message: error.message,
        },
        { status: 200 }
      );
    }
  
    return NextResponse.json(
      {
        successOrNot: "Y",
        statusCode: "SUCCESS",
        data: data?.[0] || null,
      },
      { status: 200 }
    );
  }
  