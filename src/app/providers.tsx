"use client";
import type { User } from "@model/User";
import { makeStore } from "@redux/stores";
import { useMemo } from "react";
import { Provider } from "react-redux";
export function Providers({
  children,
  isLoggedIn,
  user,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
  user: User | null;
  isAdmin?: boolean;
}) {
  const store = useMemo(() => {
    return makeStore({
      userSlice: {
        isLoggedIn,
        userInfo: user, // 빈 객체 제거: user || ({} as User) → user
        isAdmin,
        error: null,
      },
    });
  }, [isLoggedIn, user, isAdmin]);
  return <Provider store={store}>{children}</Provider>;
}
