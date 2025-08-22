"use client";

import type { Banner } from "@model/banner";
import type { User } from "@model/User";
import { ReactNode } from "react";
import ClientSideApp from "./client";
import { Menu } from "@model/menu";
export default function ClientWrapper({
  children,
  isLoggedIn,
  user,
  isMobileInitial,
  mainBanners,
  sideBanners,
  menuData,
}: {
  children: ReactNode;
  isLoggedIn: boolean;
  user: User | null;
  isMobileInitial: boolean;
  mainBanners: Banner[];
  sideBanners: Banner[];
  menuData: Menu[];
}) {
  return (
    <ClientSideApp
      isLoggedIn={isLoggedIn}
      user={user}
      isMobileInitial={isMobileInitial}
      mainBanners={mainBanners}
      sideBanners={sideBanners}
      menuData={menuData}
    >
      {children}
    </ClientSideApp>
  );
}
