import { getServerSupabase } from "@config/Supabase/server";
import { CommonResponse, CommonStatus, Pagination } from "@model/common";
import type { ProcessPurchaseRequest, Purchase, PurchaseListResponse, PurchaseRequest } from "@model/purchase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await getServerSupabase();

  const {data: authData } = await supabase.auth.getUser();

  const {data: userData} = await supabase.from('users').select('id, activity_level, permission_type').eq('auth_user_id', authData.user?.id).single();

  const isAdmin = userData?.permission_type === 'admin' || userData?.permission_type === 'super_admin' || userData?.activity_level === 99;


  const status = request.nextUrl.searchParams.get('status');
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

  const startRange = (page - 1) * limit;
  const endRange = startRange + limit - 1;

  let query = supabase
    .from('coin_point_purchase_requests')
    .select(`
      id,
      user_id,
      coin_code,
      deposit_amount,
      payment_method,
      wallet_address,
      transaction_id,
      exchange_name,
      status,
      created_at,
      processed_at,
      rejection_reason
    `, { count: 'exact' })

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(startRange, endRange);

  if (error) {
    return new Response(JSON.stringify({ 
        data: null, 
        message: error.message,
        successOrNot: "N", 
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR 
    } as CommonResponse<any>), { status: 200 });
  }

  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const pagination: Pagination = {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };

  // 관리자인 경우 nickname 정보 추가
  let items = data || [];
  
  if (isAdmin && items.length > 0) {
    const userIds = items.map(item => item.user_id);
    const { data: usersData } = await supabase
      .from('users')
      .select('id, nickname')
      .in('id', userIds);
    
    const userMap = new Map(usersData?.map(user => [user.id, user.nickname]) || []);
    
    items = items.map(item => ({
      ...item,
      users: userMap.has(item.user_id) ? { nickname: userMap.get(item.user_id)! } : undefined
    }));
  }

  const response: PurchaseListResponse = {
    items: items as Purchase[],
    pagination
  };

  return new Response(JSON.stringify({
    data: response,
    successOrNot: "Y",
    statusCode: CommonStatus.SUCCESS
  } as CommonResponse<PurchaseListResponse>), { status: 200 });
}

export async function POST(request: NextRequest) {
  const body: PurchaseRequest = await request.json();
  
  
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.rpc('coin_point_purchase_requests_create', {
    p_coin_code: body.coin_id,
    p_payment_method: body.payment_method,
    p_deposit_amount: body.purchase_amount,
    p_wallet_address: body.wallet_address,
    p_transaction_id: body.transaction_id,
    p_coin_name_custom: body.exchange_name,
    p_exchange_name: body.exchange_name
  });

  if (error) {
    return new Response(JSON.stringify({ 
        data: null, 
        message: error.message,
        successOrNot: "N", 
        statusCode: CommonStatus.INTERNAL_SERVER_ERROR 
    } as CommonResponse<string>), { status: 200 });
  }

  return new Response(JSON.stringify({ 
    data, 
    successOrNot: "Y", 
    statusCode: CommonStatus.SUCCESS 
} as CommonResponse<string>), { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const body: ProcessPurchaseRequest = await request.json();
  
  const supabase = await getServerSupabase();

  const { data: existingData } = await supabase
    .from('coin_point_purchase_requests')
    .select('id, status, deposit_amount')
    .eq('id', body.id)
    .single();

  if (!existingData) {
    return new Response(JSON.stringify({ 
      data: null, 
      message: '해당 요청건을 찾을 수 없습니다.', 
      successOrNot: "N", 
      statusCode: CommonStatus.NOT_FOUND 
    } as CommonResponse<string>), { status: 200 });
  }

  const { data, error } = await supabase.rpc('coin_purchase_request_admin_process', {
    p_request_id: body.id,
    p_action: body.status,
    p_issued_point_amount: existingData.deposit_amount * 0.5,
    p_rejection_reason: body.status === 'reject' ? body.rejection_reason : null,
    p_admin_notes: body?.admin_notes || null
  });

  if (error) {
    return new Response(JSON.stringify({ 
      data: null, 
      message: error.message, 
      successOrNot: "N", 
      statusCode: CommonStatus.INTERNAL_SERVER_ERROR 
    } as CommonResponse<string>), { status: 200 });
  }

  return new Response(JSON.stringify({ 
    data, 
    successOrNot: "Y", 
    statusCode: CommonStatus.SUCCESS 
} as CommonResponse<string>), { status: 200 });
}
