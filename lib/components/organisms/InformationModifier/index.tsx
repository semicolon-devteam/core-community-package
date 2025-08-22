"use client";

import LinkWithLoader from "@common/LinkWithLoader";
import { useAppDispatch, useAppSelector, useRouterWithLoader } from "@hooks/common";
import { useJoinForm } from "@hooks/User/useJoinForm";
import { showToast } from "@redux/Features/Toast/toastSlice";
import { selectUserInfo, update } from "@redux/Features/User/userSlice";
import { FormEvent, useEffect, useMemo } from "react";

export default function InformationModifier({ 
}) {

    const dispatch = useAppDispatch();
    const router = useRouterWithLoader();
    const { formData, setFormData, errors, handleChange, handleBlur } = useJoinForm();
    const { userInfo } = useAppSelector(selectUserInfo);
    
    // 정보 수정에 맞는 유효성 검사 (아이디 중복 검사와 캡차 제외)
    const isValidForUpdate = useMemo(() => {
        return (
            formData.password.trim().length >= 10 &&
            formData.password === formData.confirmPassword &&
            formData.nickname.trim().length >= 2 &&
            !errors.password &&
            !errors.confirmPassword &&
            !errors.nickname
        );
    }, [formData.password, formData.confirmPassword, formData.nickname, errors.password, errors.confirmPassword, errors.nickname]);
    
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault(); // 기본 폼 제출 방지
        
        // 유효성 검사 실패 시 요청 방지
        if (!isValidForUpdate) {
            dispatch(showToast({
                title: "입력 오류",
                content: "모든 필드를 올바르게 입력해주세요.",
                headerTextColor: "text-red-500",
                remainTime: "방금",
            }));
            return;
        }
        
        // 비밀번호와 닉네임만 전송 (URL 파라미터가 아닌 request body 사용)
        const updateData = {
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            nickname: formData.nickname
        };
        
        try {
            const resultAction = await dispatch(update(updateData));

            if (update.fulfilled.match(resultAction)) {
                dispatch(showToast({
                    title: "성공",
                    content: "정보가 성공적으로 수정되었습니다.",
                    headerTextColor: "text-green-500",
                    remainTime: "방금",
                }));
                
                // 성공 시에만 페이지 이동
                router.push("/me");
            } else {
                dispatch(showToast({
                    title: "에러 발생",
                    content: "정보 수정 중 오류가 발생했습니다.",
                    headerTextColor: "text-red-500",
                    remainTime: "방금",
                }));
            }
        } catch (error) {
            console.error("회원정보 수정 오류:", error);
            dispatch(showToast({
                title: "에러 발생",
                content: "정보 수정 중 오류가 발생했습니다.",
                headerTextColor: "text-red-500",
                remainTime: "방금",
            }));
        }
    };

    useEffect(() => {
        setFormData({
            userId: userInfo?.id || "",
            password: "",
            confirmPassword: "",
            nickname: userInfo?.nickname || ""
        });
    }, [userInfo, setFormData]);

    return (
        <div className="col-span-12 lg:col-span-7 lg:col-start-2 flex flex-col gap-4 p-5 bg-white rounded-2xl shadow-custom border border-border-default items-start overflow-hidden">
            <div className="self-stretch  flex-col justify-start items-start gap-5 inline-flex">
            <div className="text-center text-text-primary text-lg font-medium font-nexon leading-normal">
                내 정보 수정
            </div>
            </div>
            <div className="self-stretch  border-2 border-text-primary"></div>


            <form onSubmit={onSubmit} className="w-full self-stretch flex-col justify-start items-start gap-10 inline-flex">

            <div className="w-full flex-col justify-start items-start gap-10 flex">


                {/* 비밀번호 입력 */}
                <div className="w-full justify-start items-start gap-5 inline-flex ">
                    <div className="w-[120px] h-10">
                        <span className=" text-text-secondary text-sm font-normal font-nexon leading-normal">
                            비밀번호{" "}
                        </span>
                        <span className="text-primary text-sm font-normal font-nexon leading-normal">
                            *
                        </span>
                    </div>
                    <div className="w-full flex-col justify-start items-center gap-1 inline-flex">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="비밀번호를 입력해주세요."
                            className={`w-full px-3 py-2 rounded-lg border ${
                                errors.password ? "border-red-500" : "border-border-default"
                            } text-text-primary text-[13px] font-normal font-nexon leading-normal placeholder:text-text-placeholder focus:outline-none focus:border-primary`}
                        />
                        {errors.password ? (
                            <div className="w-full text-red-500 text-[13px] font-normal font-nexon mt-1">
                                {errors.password}
                            </div>
                        ) : (
                            <div className="w-full">
                                <span className="text-text-placeholder text-[13px] font-normal font-nexon leading-none">
                                    비밀번호는 최소{" "}
                                </span>
                                <span className="text-primary text-[13px] font-normal font-nexon leading-none">
                                    10자 이상
                                </span>
                                <span className="text-text-placeholder text-[13px] font-normal font-nexon leading-none">
                                    {" "}
                                    입력해주세요.
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 비밀번호 확인 */}
                <div className="w-full justify-start items-start gap-5 inline-flex ">
                    <div className="w-[120px] h-10">
                        <span className="text-text-secondary text-sm font-normal font-nexon leading-normal">
                            비밀번호 확인{" "}
                        </span>
                        <span className="text-primary text-sm font-normal font-nexon leading-normal">
                            *
                        </span>
                    </div>
                    <div className="w-full flex-col justify-start items-center gap-1 inline-flex">
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="비밀번호를 다시 입력해주세요."
                            className={`w-full px-3 py-2 rounded-lg border ${
                                errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-border-default"
                            } text-text-primary text-[13px] font-normal font-nexon leading-normal placeholder:text-text-placeholder focus:outline-none focus:border-primary`}
                        />
                        {errors.confirmPassword && (
                            <div className="w-full text-red-500 text-[13px] font-normal font-nexon mt-1">
                                {errors.confirmPassword}
                            </div>
                        )}
                        {!errors.confirmPassword &&
                            formData.confirmPassword &&
                            formData.password === formData.confirmPassword && (
                                <div className="w-full text-green-500 text-[13px] font-normal font-nexon mt-1">
                                    비밀번호가 일치합니다.
                                </div>
                            )}
                    </div>
                </div>

                {/* 닉네임 입력 */}
                <div className="w-full justify-start items-start gap-5 inline-flex ">
                    <div className="w-[120px] h-10">
                        <span className="text-text-secondary text-sm font-normal font-nexon leading-normal">
                            닉네임{" "}
                        </span>
                        <span className="text-primary text-sm font-normal font-nexon leading-normal">
                            *
                        </span>
                    </div>
                    <div className="w-full flex-col justify-start items-center gap-1 inline-flex">
                        <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="닉네임을 입력해주세요."
                            className={`w-full px-3 py-2 rounded-lg border ${
                                errors.nickname ? "border-red-500" : "border-border-default"
                            } text-text-primary text-[13px] font-normal font-nexon leading-normal placeholder:text-text-placeholder focus:outline-none focus:border-primary`}
                        />
                        {errors.nickname ? (
                            <div className="w-full text-red-500 text-[13px] font-normal font-nexon mt-1">
                                {errors.nickname}
                            </div>
                        ) : (
                            <div className="w-full text-text-placeholder text-[13px] font-normal font-nexon leading-none">
                                한글, 영문, 숫자만 입력 가능 (한글2자, 영문4자 이상)
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 버튼 영역 */}
            <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                <LinkWithLoader
                    href="/"
                    className="w-full  h-12 px-5 py-3 bg-text-tertiary rounded-lg shadow-custom flex justify-center items-center hover:bg-opacity-90 transition-colors"
                >
                    <div className="text-center text-white text-sm font-bold font-nexon leading-normal">
                        취소
                    </div>
                </LinkWithLoader>

                <button
                    type="submit"
                    disabled={!isValidForUpdate}
                    className={`w-full  h-12 px-5 py-3 rounded-lg shadow-custom flex justify-center items-center transition-colors ${
                        isValidForUpdate
                            ? "bg-primary hover:bg-opacity-90"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    <div className="text-center text-white text-sm font-bold font-nexon leading-normal">
                        정보수정
                    </div>
                </button>
            </div>
            </form>
        </div>
    );
}