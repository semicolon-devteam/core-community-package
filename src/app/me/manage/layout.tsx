import AuthGuard from "@organisms/AuthGuard";

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  // AdminChecker를 AuthGuard의 adminOnly 옵션으로 대체
  return (
    <AuthGuard adminOnly={true}>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </AuthGuard>
  )
}