declare module 'react-simple-captcha' {
  export function loadCaptchaEnginge(length: number): void;
  export function LoadCanvasTemplate(): JSX.Element;
  export function validateCaptcha(user_captcha: string): boolean;
  export function LoadCanvasTemplateNoReload(): JSX.Element;
} 