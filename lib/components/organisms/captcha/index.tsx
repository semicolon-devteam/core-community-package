import { useEffect, useRef, useState } from 'react';
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
  LoadCanvasTemplateNoReload,
} from 'react-simple-captcha';

interface CaptchaProps {
  onVerify: (isVerified: boolean) => void;
}

export default function Captcha({ onVerify }: CaptchaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');

  const resetVerification = () => {
    setIsVerified(false);
    setVerificationMessage('');
    onVerify(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setCaptchaInput('');
  };

  const refreshCaptcha = () => {
    loadCaptchaEnginge(6); // 새로운 6자리 캡차 생성
    resetVerification();
  };

  useEffect(() => {
    loadCaptchaEnginge(6); // 6자리 캡차 생성
    resetVerification();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCaptchaInput(value);

    // 검증 상태 초기화 (새로운 입력 시)
    if (isVerified) {
      setIsVerified(false);
      setVerificationMessage('');
      onVerify(false);
    }
  };

  const handleVerifyCaptcha = () => {
    if (!captchaInput.trim()) {
      setVerificationMessage('캡차를 입력해주세요.');
      return;
    }

    if (validateCaptcha(captchaInput)) {
      setIsVerified(true);
      setVerificationMessage('캡차가 확인되었습니다.');
      onVerify(true);
    } else {
      setIsVerified(false);
      setVerificationMessage('캡차 검증에 실패했습니다. 다시 시도해주세요.');
      onVerify(false);
      setCaptchaInput('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-start gap-2">
      <div className="flex items-center gap-1">
        <LoadCanvasTemplateNoReload />
        <button
          type="button"
          onClick={refreshCaptcha}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="새로고침"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.65 2.35C12.18 0.88 10.21 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 w-full">
          <input
            ref={inputRef}
            id="user_captcha"
            type="text"
            placeholder="자동입력방지 문구를 입력하세요"
            onChange={handleInputChange}
            maxLength={6}
            className="w-full px-3 py-2 rounded-lg border border-border-default text-text-primary text-[13px] font-normal font-nexon leading-normal placeholder:text-text-placeholder focus:outline-none focus:border-primary"
          />
        </div>
        {verificationMessage && (
          <span
            className={`w-full text-[12px] font-nexon ${
              isVerified ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {verificationMessage}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={handleVerifyCaptcha}
          disabled={!captchaInput.trim() || isVerified}
          className={`px-3 py-2 text-[13px] font-nexon rounded-lg transition-colors ${
            !captchaInput.trim() || isVerified
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          검증
        </button>
      </div>
    </div>
  );
}
