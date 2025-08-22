'use client';

import LinkWithLoader from '@common/LinkWithLoader';
import useJoinForm from '@hooks/User/useJoinForm';
import { useAppDispatch, useRouterWithLoader } from '@hooks/common';
import Captcha from '@organisms/captcha';
import { join } from '@redux/Features/User/userSlice';
import { FormEvent } from 'react';

export default function JoinPage() {
  const dispatch = useAppDispatch();
  const router = useRouterWithLoader();
  const {
    formData,
    errors,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    duplicateUserId,
    duplicateNickname,
    setIsCaptchaVerified,
    isNicknameExist,
    isCheckNicknameDuplication,
    isCaptchaVerified,
    checkValid,
  } = useJoinForm();

  const onSubmit = async (e: FormEvent) => {
    const isFormValid = handleSubmit(e);

    if (isFormValid) {
      const resultAction = await dispatch(join(formData));
      if (join.fulfilled.match(resultAction)) {
        router.push('/');
      } else {
      }
    }
  };

  return (
    <div className="col-span-12 lg:col-span-7 lg:col-start-2 flex flex-col p-5 bg-white rounded-2xl shadow-custom border border-border-default items-start gap-5 overflow-hidden">
      <div className="self-stretch h-11 flex-col justify-start items-start gap-5 inline-flex">
        <div className="text-center text-text-primary text-lg font-medium font-nexon leading-normal">
          회원가입
        </div>
        <div className="self-stretch h-[0px] border-2 border-text-primary"></div>
      </div>

      <form onSubmit={onSubmit} className="w-full">
        <div className="self-stretch flex-col justify-start items-start gap-10 inline-flex">
          <div className="w-full flex-col justify-start items-start gap-10 flex">
            {/* 아이디 입력 */}
            <div className="w-full justify-start items-start gap-5 inline-flex flex-wrap">
              <div className="w-[100px] h-10">
                <span className="text-text-secondary text-sm font-normal font-nexon leading-normal">
                  아이디{' '}
                </span>
                <span className="text-primary text-sm font-normal font-nexon leading-normal">
                  *
                </span>
              </div>
              <div className="w-full sm:w-[500px] flex-col justify-start items-center gap-1 inline-flex">
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="아이디를 입력해주세요."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.userId ? 'border-red-500' : 'border-border-default'
                  } text-text-primary text-[13px] font-normal font-nexon leading-normal placeholder:text-text-placeholder focus:outline-none focus:border-primary`}
                />
                {errors.userId && (
                  <div className="w-full text-red-500 text-[13px] font-normal font-nexon mt-1">
                    {errors.userId}
                  </div>
                )}
                {!errors.userId && formData.userId.trim().length >= 4 && (
                  <div className="w-full text-green-500 text-[13px] font-normal font-nexon mt-1">
                    사용 가능한 아이디입니다.
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => duplicateUserId(formData.userId)}
                disabled={formData.userId.trim().length < 4}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-nexon hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
              >
                중복검사
              </button>
            </div>

            {/* 비밀번호 입력 */}
            <div className="w-full justify-start items-start gap-5 inline-flex flex-wrap">
              <div className="w-[100px] h-10">
                <span className="text-text-secondary text-sm font-normal font-nexon leading-normal">
                  비밀번호{' '}
                </span>
                <span className="text-primary text-sm font-normal font-nexon leading-normal">
                  *
                </span>
              </div>
              <div className="w-full sm:w-[500px] flex-col justify-start items-center gap-1 inline-flex">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="비밀번호를 입력해주세요."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-border-default'
                  } text-text-primary text-[13px] font-normal font-nexon leading-normal placeholder:text-text-placeholder focus:outline-none focus:border-primary`}
                />
                {errors.password ? (
                  <div className="w-full text-red-500 text-[13px] font-normal font-nexon mt-1">
                    {errors.password}
                  </div>
                ) : (
                  <div className="w-full">
                    <span className="text-text-placeholder text-[13px] font-normal font-nexon leading-none">
                      비밀번호는 최소{' '}
                    </span>
                    <span className="text-primary text-[13px] font-normal font-nexon leading-none">
                      6자 이상
                    </span>
                    <span className="text-text-placeholder text-[13px] font-normal font-nexon leading-none">
                      {' '}
                      입력해주세요.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className="w-full justify-start items-start gap-5 inline-flex flex-wrap">
              <div className="w-[100px] h-10">
                <span className="text-text-secondary text-sm font-normal font-nexon leading-normal">
                  비밀번호 확인{' '}
                </span>
                <span className="text-primary text-sm font-normal font-nexon leading-normal">
                  *
                </span>
              </div>
              <div className="w-full sm:w-[500px] flex-col justify-start items-center gap-1 inline-flex">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="비밀번호를 다시 입력해주세요."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-border-default'
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
            <div className="w-full justify-start items-start gap-5 inline-flex flex-wrap">
              <div className="w-[100px] h-10">
                <span className="text-text-secondary text-sm font-normal font-nexon leading-normal">
                  닉네임{' '}
                </span>
                <span className="text-primary text-sm font-normal font-nexon leading-normal">
                  *
                </span>
              </div>
              <div className="w-full sm:w-[500px] flex-col justify-start items-center gap-1 inline-flex">
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="닉네임을 입력해주세요."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.nickname ? 'border-red-500' : 'border-border-default'
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
                {!errors.nickname &&
                  !isNicknameExist &&
                  isCheckNicknameDuplication && (
                    <div className="w-full text-green-500 text-[13px] font-normal font-nexon mt-1">
                      사용 가능한 닉네임입니다.
                    </div>
                  )}
              </div>
              <button
                type="button"
                onClick={() => duplicateNickname(formData.nickname)}
                disabled={!checkValid('nickname', formData.nickname).isValid}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-nexon hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
              >
                중복검사
              </button>
            </div>
          </div>
          {/* 캡차 검사 */}
          <div className="w-full justify-start items-start gap-5 inline-flex flex-wrap">
            <div className="w-[100px] h-10">
              <span className="text-text-secondary text-sm font-normal font-nexon leading-normal">
                자동입력방지{' '}
              </span>
              <span className="text-primary text-sm font-normal font-nexon leading-normal">
                *
              </span>
            </div>
            <div className="w-full sm:w-[500px] flex-col justify-center items-start gap-1 inline-flex">
              <Captcha onVerify={setIsCaptchaVerified} />
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mt-16">
          <LinkWithLoader
            href="/"
            className="w-full h-12 px-5 py-3 bg-text-tertiary rounded-lg shadow-custom flex justify-center items-center hover:bg-opacity-90 transition-colors"
          >
            <div className="text-center text-white text-sm font-bold font-nexon leading-normal">
              취소
            </div>
          </LinkWithLoader>

          <button
            type="submit"
            disabled={!isValid || !isCaptchaVerified}
            className={`w-full h-12 px-5 py-3 rounded-lg shadow-custom flex justify-center items-center transition-colors ${
              isValid && isCaptchaVerified
                ? 'bg-primary hover:bg-opacity-90'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="text-center text-white text-sm font-bold font-nexon leading-normal">
              회원가입
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

//test
