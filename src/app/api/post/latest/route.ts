import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@config/Supabase/server';

export async function GET() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
                id,
                board_id,
                parent_id,
                writer_id,
                writer_name,
                title,
                content,
                attachments,
                is_notice,
                is_secret,
                is_anonymous,
                view_count,
                comment_count,
                like_count,
                dislike_count
            `
    )
    .eq('status', 'published') // 게시 상태
    .is('deleted_at', null) // 삭제 여부
    .order('id', { ascending: false })
    .range(0, 9);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
