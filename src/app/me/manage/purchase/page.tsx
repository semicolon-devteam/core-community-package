import PurchaseManage from '@organisms/PurchaseManage';

// 동적 렌더링 강제 (cookies 사용으로 인해)
export const dynamic = 'force-dynamic';

export default async function PurchaseManagePage() {

  return (
    <PurchaseManage />
  )
}
