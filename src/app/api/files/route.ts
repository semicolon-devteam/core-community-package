import { getServerSupabase } from "@config/Supabase/server";
import type { CommonResponse } from "@model/common";
import { CommonStatus } from "@model/common";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest
  ) {
    console.log('🚀 FILES API 호출됨! - 파일 업로드 시작');
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        console.log('📄 업로드된 파일 정보:', {
            name: file?.name,
            type: file?.type,
            size: file?.size,
            isVideoFile: file?.type.startsWith('video/')
        });

        if (!file) {
            return NextResponse.json(
                {
                    data: null,
                    successOrNot: "N",
                    statusCode: CommonStatus.FAIL,
                    message: "파일이 제공되지 않았습니다."
                } as CommonResponse<null>,
                { status: 200 }
            );
        }

        const supabase = await getServerSupabase();

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
            return NextResponse.json(
                {
                    data: null,
                    successOrNot: "N",
                    statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
                    message: "사용자 정보 조회 중 오류가 발생했습니다."
                } as CommonResponse<null>,
                { status: 200 }
            );
        }

        const uuid = crypto.randomUUID();

        // 파일 업로드
        const fileExtension = file.type.split('/')[1] || 'bin';
        const filePath = `${userData.user?.id}/${uuid}.${fileExtension}`;

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('public-bucket')
            .upload(filePath, file, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false,
                metadata: {
                    originalFileName: file.name,
                    originalFileType: file.type
                }
            });

        if (uploadError) {
            console.error("파일 업로드 오류:", uploadError);
            return NextResponse.json(
                {
                    data: null,
                    successOrNot: "N",
                    statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
                    message: "파일 업로드 중 오류가 발생했습니다."
                } as CommonResponse<null>,
                { status: 200 }
            );
        }

        // 파일 URL 생성
        const { data: urlData } = supabase.storage
            .from('public-bucket')
            .getPublicUrl(filePath);

        const fileUrl = urlData.publicUrl;

        console.log('✅ 파일 업로드 완료:', {
            uuid,
            fileName: file.name,
            fileSize: file.size,
            fileUrl: fileUrl
        });

        return NextResponse.json(
            {
                data: {
                    uuid,
                    url: fileUrl,
                    fullPath: filePath,
                    metadata: {
                        originalFileName: file.name,
                        originalFileType: file.type,
                        fileSize: file.size
                    }
                },
                successOrNot: "Y",
                statusCode: CommonStatus.SUCCESS,
                message: "파일 업로드 성공"
            } as CommonResponse<any>,
            { status: 200 }
        );

    } catch (error) {
        console.error('파일 업로드 API 오류:', error);
        return NextResponse.json(
            {
                data: null,
                successOrNot: "N",
                statusCode: CommonStatus.INTERNAL_SERVER_ERROR,
                message: "파일 업로드 중 오류가 발생했습니다."
            } as CommonResponse<null>,
            { status: 200 }
        );
    }
}
