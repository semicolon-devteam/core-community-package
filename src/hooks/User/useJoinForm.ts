'use client';

import { useAppDispatch } from '@hooks/common';
import { showToast } from '@redux/Features/Toast/toastSlice';
import type {
  JoinFormData,
  JoinFormErrors,
} from '@redux/Features/User/userSlice';
import userService from '@services/userService';
import { useEffect, useState } from 'react';
export function useJoinForm() {
  const dispatch = useAppDispatch();
  // 폼 상태 관리
  const [formData, setFormData] = useState<JoinFormData>({
    userId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });

  // 에러 상태 관리
  const [errors, setErrors] = useState<JoinFormErrors>({
    userId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });

  // 유효성 검사 상태
  const [isValid, setIsValid] = useState(false);

  // 아이디 중복 검사 상태
  const [isCheckIdDuplication, setIsCheckIdDuplication] = useState(false);

  // 아이디 중복 유무
  const [isUserIdExist, setIsUserIdExist] = useState(false);

  // 닉네임 중복 검사 상태
  const [isCheckNicknameDuplication, setIsCheckNicknameDuplication] =
    useState(false);

  // 닉네임 중복 유무
  const [isNicknameExist, setIsNicknameExist] = useState(false);

  // 캡차 검사 상태
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // 캡차 입력값 상태
  const [captchaInput, setCaptchaInput] = useState('');

  // 아이디 중복 검사
  const duplicateUserId = async (userId: string) => {
    const response = await userService.checkUserIdExist(userId);

    if (response.successOrNot === 'Y') {
      setIsCheckIdDuplication(true);
      if (response.data === true) {
        dispatch(
          showToast({
            title: '이미 존재하는 아이디입니다.',
            content: '다른 아이디를 입력해주세요.',
            headerTextColor: 'text-red-500',
          })
        );
        setIsUserIdExist(true);
      } else {
        dispatch(
          showToast({
            title: '사용 가능한 아이디입니다.',
            content: '사용 가능한 아이디입니다.',
            headerTextColor: 'text-green-500',
          })
        );
        setIsUserIdExist(false);
      }
    } else {
      setIsCheckIdDuplication(false);
    }
  };

  const duplicateNickname = async (nickname: string) => {
    const response = await userService.checkNicknameExist(nickname);
    if (response.successOrNot === 'Y') {
      setIsCheckNicknameDuplication(true);
      if (response.data === true) {
        dispatch(
          showToast({
            title: '이미 존재하는 닉네임입니다.',
            content: '다른 닉네임을 입력해주세요.',
            headerTextColor: 'text-red-500',
          })
        );
        setIsNicknameExist(true);
      } else {
        dispatch(
          showToast({
            title: '사용 가능한 닉네임입니다.',
            content: '사용 가능한 닉네임입니다.',
            headerTextColor: 'text-green-500',
          })
        );
        setIsNicknameExist(false);
      }
    } else {
      setIsCheckNicknameDuplication(false);
    }
  };

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'userId') {
      setIsCheckIdDuplication(false);
      setIsUserIdExist(false);
    }
  };

  interface CheckValidResult {
    error: string;
    isValid: boolean;
  }

  const checkValid = (key: string, value: string): CheckValidResult => {
    if (key === 'userId') {
      // 아이디 검사
      const userIdRegex = /^[a-zA-Z0-9_-]+$/; // 영문자, 숫자, 언더스코어, 하이픈만 허용

      if (value.trim().length > 0) {
        if (value.trim().length < 4) {
          return {
            error: '아이디는 최소 4자 이상이어야 합니다.',
            isValid: false,
          };
        } else if (value.trim().length > 20) {
          return {
            error: '아이디는 최대 20자 이하이어야 합니다.',
            isValid: false,
          };
        } else if (!userIdRegex.test(value.trim())) {
          return {
            error:
              '아이디는 영문자, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다.',
            isValid: false,
          };
        } else if (!isCheckIdDuplication) {
          return {
            error: '아이디 중복검사를 진행하셔야 합니다.',
            isValid: false,
          };
        } else if (isUserIdExist) {
          return {
            error: '이미 존재하는 아이디입니다.',
            isValid: false,
          };
        }
      }

      return {
        error: '',
        isValid: true,
      };
    } else if (key === 'password') {
      if (value.trim().length === 0) {
        return {
          error: '',
          isValid: false,
        };
      }
      if (value.trim().length < 6) {
        return {
          error: '비밀번호는 최소 6자 이상이어야 합니다.',
          isValid: false,
        };
      }

      return {
        error: '',
        isValid: true,
      };
    } else if (key === 'confirmPassword') {
      if (value.trim() !== formData.password.trim()) {
        return {
          error: '비밀번호가 일치하지 않습니다.',
          isValid: false,
        };
      }

      return {
        error: '',
        isValid: true,
      };
    } else if (key === 'nickname') {
      if (value.trim().length === 0) {
        return {
          error: '',
          isValid: false,
        };
      }

      // 한글, 영문, 숫자만 허용하는 정규식
      const validCharsRegex = /^[a-zA-Z0-9가-힣]+$/;

      if (!validCharsRegex.test(value)) {
        return {
          error: '한글, 영문, 숫자만 입력 가능합니다.',
          isValid: false,
        };
      }

      const isKorean = /[가-힣]/.test(value);

      if (isKorean) {
        // 한글이 포함된 경우, 최소 2자 이상
        if (value.length < 2) {
          return {
            error: '한글 포함 닉네임은 2자 이상이어야 합니다.',
            isValid: false,
          };
        }
      } else {
        if (value.length < 4) {
          return {
            error: '영문/숫자만으로 구성된 닉네임은 4자 이상이어야 합니다.',
            isValid: false,
          };
        }
      }

      if (value.length > 10) {
        return {
          error: '닉네임은 최대 10자 이하이어야 합니다.',
          isValid: false,
        };
      }

      return {
        error: '',
        isValid: true,
      };
    } else {
      return {
        error: 'key가 존재하지 않습니다.',
        isValid: false,
      };
    }
  };

  // 폼 유효성 검사
  useEffect(() => {
    const newErrors = {
      userId: '',
      password: '',
      confirmPassword: '',
      nickname: '',
    };

    const userIdResult = checkValid('userId', formData.userId);
    if (!userIdResult.isValid) {
      newErrors.userId = userIdResult.error;
    }

    const passwordResult = checkValid('password', formData.password);
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.error;
    }

    const confirmPasswordResult = checkValid(
      'confirmPassword',
      formData.confirmPassword
    );
    if (!confirmPasswordResult.isValid) {
      newErrors.confirmPassword = confirmPasswordResult.error;
    }

    const nicknameResult = checkValid('nickname', formData.nickname);

    if (!nicknameResult.isValid) {
      newErrors.nickname = nicknameResult.error;
    }
    if (formData.nickname.trim().length > 0 && !nicknameResult.isValid) {
      if (!isCheckNicknameDuplication) {
        newErrors.nickname = '닉네임 중복검사를 진행하셔야 합니다.';
      } else if (isNicknameExist) {
        newErrors.nickname = '이미 존재하는 닉네임입니다.';
      }
    }

    setErrors(newErrors);

    // 전체 폼 유효성 검사
    const isFormValid =
      formData.userId.trim().length >= 4 &&
      formData.userId.trim().length <= 20 &&
      formData.password.trim().length >= 6 &&
      formData.password === formData.confirmPassword &&
      formData.nickname.trim().length >= 2 &&
      Object.values(newErrors).every(error => error === '') &&
      isCaptchaVerified;

    setIsValid(isFormValid);
  }, [
    formData,
    isCheckIdDuplication,
    isUserIdExist,
    isCheckNicknameDuplication,
    isNicknameExist,
    isCaptchaVerified,
  ]);

  // 포커스 아웃 시 유효성 검사 실행
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!value.trim()) {
      setErrors(prev => ({
        ...prev,
        [name]: `${
          name === 'userId'
            ? '아이디를'
            : name === 'password'
            ? '비밀번호를'
            : name === 'confirmPassword'
            ? '비밀번호 확인을'
            : '닉네임을'
        } 입력해주세요.`,
      }));
    }
  };

  // 회원가입 버튼 클릭 시 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      // 모든 필드 검사하여 첫 번째 오류 표시
      let firstErrorField: keyof typeof formData | null = null;

      if (!formData.userId.trim()) {
        setErrors(prev => ({ ...prev, userId: '아이디를 입력해주세요.' }));
        firstErrorField = 'userId';
      } else if (!formData.password.trim()) {
        setErrors(prev => ({
          ...prev,
          password: '비밀번호를 입력해주세요.',
        }));
        firstErrorField = 'password';
      } else if (!formData.confirmPassword.trim()) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: '비밀번호 확인을 입력해주세요.',
        }));
        firstErrorField = 'confirmPassword';
      } else if (!formData.nickname.trim()) {
        setErrors(prev => ({ ...prev, nickname: '닉네임을 입력해주세요.' }));
        firstErrorField = 'nickname';
      }

      if (firstErrorField) {
        const element = document.querySelector(
          `input[name="${firstErrorField}"]`
        );
        if (element) {
          (element as HTMLInputElement).focus();
        }
      }

      return false;
    }

    return true;
  };

  // 캡차 검증 함수
  const verifyCaptcha = async () => {
    try {
      // react-simple-captcha의 validateCaptcha 함수 import 필요
      const { validateCaptcha } = await import('react-simple-captcha');

      if (validateCaptcha(captchaInput)) {
        setIsCaptchaVerified(true);
        setCaptchaInput(''); // 검증 후 입력값 초기화
        return { success: true, message: '캡차 검증에 성공했습니다.' };
      } else {
        setIsCaptchaVerified(false);
        setCaptchaInput(''); // 실패 시에도 입력값 초기화
        return {
          success: false,
          message: '캡차 검증에 실패했습니다. 다시 시도해주세요.',
        };
      }
    } catch (error) {
      console.error('캡차 검증 중 오류 발생:', error);
      setIsCaptchaVerified(false);
      setCaptchaInput('');
      return { success: false, message: '캡차 검증 중 오류가 발생했습니다.' };
    }
  };

  // 캡차 새로고침 함수
  const refreshCaptcha = async () => {
    try {
      const { loadCaptchaEnginge } = await import('react-simple-captcha');
      loadCaptchaEnginge(6); // 6자리 캡차 생성
      setIsCaptchaVerified(false);
      setCaptchaInput('');
    } catch (error) {
      console.error('캡차 새로고침 중 오류 발생:', error);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isValid,
    setIsValid,
    checkValid,
    handleChange,
    handleBlur,
    handleSubmit,
    duplicateUserId,
    duplicateNickname,
    isUserIdExist,
    isNicknameExist,
    isCheckNicknameDuplication,
    isCaptchaVerified,
    setIsCaptchaVerified,
    captchaInput,
    setCaptchaInput,
    verifyCaptcha,
    refreshCaptcha,
  };
}

export default useJoinForm;
