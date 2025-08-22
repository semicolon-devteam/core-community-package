import { getServerSupabase } from '@config/Supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('comments')
    .select(`*`)
    .not('deleted_at', 'is', null) // 삭제 여부
    .order('id', { ascending: false })
    .range(0, 9);

  if (error) {
    return NextResponse.json(
      {
        successOrNot: 'N',
        statusCode: 'FAIL',
        error: error.message,
      },
      { status: 200 }
    );
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
