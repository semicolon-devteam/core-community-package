import { getServerSupabase } from '@config/Supabase/server';
import type { CommonResponse } from '@model/common';
import { CommonStatus } from '@model/common';
import { NextRequest, NextResponse } from 'next/server';

interface DraftPostRequest {
  title: string;
  content: string;
  boardId: number;
  categoryId?: number;
  downloadPoint?: number;
  metadata?: {
    thumbnail: string | null;
    [key: string]: string | null;
  };
  attachments?: any[];
  isNotice?: boolean;
  hasFiles: boolean;
}

interface DraftPostResponse {
  id: number;
  title: string;
  content: string;
  status: 'DRAFT';
  createdAt: string;
}

// POST - Draft 게시글 생성
export async function POST(request: NextRequest) {
  try {
    const requestBody: DraftPostRequest = await request.json();

    // 클라이언트 IP 주소 가져오기
    let clientIp =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for') ||
      '127.0.0.1';

    // IPv6 로컬호스트를 IPv4로 변환
    if (clientIp === '::1') {
      clientIp = '127.0.0.1';
    }
    // x-forwarded-for 헤더에 여러 IP가 있을 경우 첫 번째 IP만 사용
    if (clientIp && clientIp.includes(',')) {
      clientIp = clientIp.split(',')[0].trim();
    }

    const supabase = await getServerSupabase();
    
    // 첨부파일이 있는 경우 DRAFT, 없는 경우 PUBLISHED로 설정
    const postStatus = requestBody.hasFiles ? 'draft' : 'published';
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          board_id: requestBody.boardId,
          parent_id: null,
          writer_ip: clientIp,
          title: requestBody.title,
          content: requestBody.content,
          attachments: requestBody.attachments || [],
          metadata: requestBody.metadata || {},
          restrict_attachments: [],
          password: null,
          is_notice: requestBody.isNotice || false,
          is_secret: false,
          is_anonymous: false,
          category_id: requestBody.categoryId,
          download_point: requestBody.downloadPoint || 0,
          status: postStatus,
        },
      ])
      .select('id, title, content, status, created_at')
      .single();

    if (error) {
      console.error('업로드중인 게시글 생성 중 오류:', error);
      return NextResponse.json(
        {
          data: null,
          message: error.message,
          successOrNot: 'N',
          statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
        } as CommonResponse<DraftPostResponse>,
        { status: 200 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          data: null,
          message: '업로드중인 게시글 생성에 실패했습니다.',
          successOrNot: 'N',
          statusCode: CommonStatus.FAIL,
        } as CommonResponse<DraftPostResponse>,
        { status: 200 }
      );
    }

    const responseData: DraftPostResponse = {
      id: data.id,
      title: data.title,
      content: data.content,
      status: 'DRAFT',
      createdAt: data.created_at,
    };

    return NextResponse.json({
      data: responseData,
      message: '업로드중인 게시글이 생성되었습니다.',
      successOrNot: 'Y',
      statusCode: CommonStatus.SUCCESS,
    } as CommonResponse<DraftPostResponse>);

  } catch (error) {
    console.error('업로드중인 게시글 생성 중 오류 발생:', error);
    return NextResponse.json(
      {
        data: null,
        message:
          error instanceof Error
            ? error.message
            : '업로드중인 게시글 생성 처리 중 오류가 발생했습니다.',
        successOrNot: 'N',
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
      } as CommonResponse<DraftPostResponse>,
      { status: 200 }
    );
  }
}