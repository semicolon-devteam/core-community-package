import { LoginGuard } from "@organisms/AuthGuard";
import MyPageContainer from "@organisms/MyPageContainer";

export default async function MyPageLayout(
    { children }: { children: React.ReactNode }
) {
  // LoginGuard로 로그인 체크 통합
  return (
    <LoginGuard>
      <div className="flex flex-col gap-4">
        <MyPageContainer />
        {children}
      </div>
    </LoginGuard>
  )
}