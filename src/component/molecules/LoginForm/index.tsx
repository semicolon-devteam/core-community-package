"use client";
import LinkWithLoader from "@common/LinkWithLoader";
import { useDebounce } from "@hooks/common";
import { useCallback } from "react";

interface LoginFormProps {
  userId: string;
  passwrd: string;
  handleChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

export default function LoginForm({
  userId = "",
  passwrd = "",
  handleChange,
  handleSubmit,
}: LoginFormProps) {
  const debouncedHandleSubmit = useDebounce(handleSubmit);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      debouncedHandleSubmit();
    },
    [debouncedHandleSubmit]
  );

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col w-full gap-4 bg-white p-5 rounded-2xl border border-border-default shadow-custom"
    >
      {/* 입력 폼 영역 */}
      <div className="flex flex-col gap-3">
        <input
          id="userId"
          type="text"
          placeholder="아이디를 입력해주세요."
          value={userId}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border border-border-default font-nexon text-[13px] placeholder:text-text-placeholder focus:outline-none focus:border-primary"
        />
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={passwrd}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border border-border-default font-nexon text-[13px] placeholder:text-text-placeholder focus:outline-none focus:border-primary"
        />
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        className="w-full px-5 py-2.5 rounded-lg bg-primary"
        // onClick={useDebounce(handleSubmit)}
      >
        <span className="font-nexon text-sm font-bold text-white">로그인</span>
      </button>
      <LinkWithLoader
        href="/join"
        className="w-full px-5 py-2.5 rounded-lg bg-white text-center hover:bg-gray-100"
      >
        <span className="font-nexon text-sm font-bold text-text-secondary ">회원가입</span>
      </LinkWithLoader>

      {/* 계정 관련 링크 - 오른쪽 정렬 */}
      <div className="flex justify-end mt-2">
        <div className="flex items-center gap-2 font-nexon text-sm text-text-secondary">
        </div>
      </div>
    </form>
  );
}
