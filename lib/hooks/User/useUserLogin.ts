"use client";

import { useAppDispatch } from "@hooks/common";
import { onRequest, onResponse } from "@redux/Features/Modal/modalSlice";
import { showToast } from "@redux/Features/Toast/toastSlice";
import { LoginFormData, checkAttendance, dotAttendance, login, refreshMyInfo } from "@redux/Features/User/userSlice";
import { useState } from "react";

export const useUserLogin = (): {
  loginInfo: LoginFormData;
  setLoginInfo: React.Dispatch<React.SetStateAction<LoginFormData>>;
  handleSubmit: () => Promise<void>;
} => {
  const dispatch = useAppDispatch();
  // const { history } = useReactRouter();
  const [loginInfo, setLoginInfo] = useState<LoginFormData>({
    userId: "",
    password: "",
  });

  const handleSubmit = async () => {
    // 필수 입력값 확인
    if (!loginInfo.userId || !loginInfo.password) {
      dispatch(
        showToast({

          title: "입력 오류",
          content: "아이디와 비밀번호를 모두 입력해주세요.",
          headerTextColor: "text-green-500",
          remainTime: "방금",
        })
      );
      return;
    }

    dispatch(onRequest());
    const resultAction = await dispatch(login(loginInfo)).finally(() => {
      dispatch(onResponse());
    });
    if (login.fulfilled.match(resultAction)) {
      const isAttendance: any = await dispatch(checkAttendance());
      if(isAttendance.payload?.successOrNot === "N") {
        const dotAttendanceResult: any = await dispatch(dotAttendance());
        if(dotAttendanceResult.payload?.successOrNot === "Y") {
          await dispatch(refreshMyInfo());
          dispatch(
            showToast({

              title: "출석 체크",
              content: "출석 체크 포인트가 지급되었습니다!",
              headerTextColor: "text-green-500",
              remainTime: "방금",
            })
          );
        }
      }
      dispatch(
        showToast({

          title: "로그인 성공",
          content: "환영합니다!",
          headerTextColor: "text-green-500",
          remainTime: "방금",
        })
      );
      // history.push("/vendor");
    } else {

      dispatch(
        showToast({

          title: "로그인 실패",
          content: resultAction.payload
            ? String(resultAction.payload.result)
            : "아이디 또는 비밀번호가 일치하지 않습니다.",
          headerTextColor: "text-green-500",
          remainTime: "방금",
        })
      );
    }
  };
  return { loginInfo, setLoginInfo, handleSubmit };
};
