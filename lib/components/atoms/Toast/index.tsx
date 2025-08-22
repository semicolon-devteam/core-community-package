"use client";

import { useEffect } from 'react';

// import React, { ReactElement, useEffect } from 'react';
// import * as Feather from 'react-feather';
// import { AppUseIconType } from '@model/icon';

// Base toast properties
interface BaseToastProps {
  title: string;
  content: string;
  show?: boolean;
  headerTextColor?: string;
  remainTime?: string;
  remainTimeColor?: string;
  buttonColor?: string;
  autoDelete?: boolean;
}

// Component props (includes id and onClose)
export interface ToastProps extends BaseToastProps {
  id: string;
  onClose?: (id: string) => void;
}

// Action payload (excludes id and onClose)
export type ToastActionPayload = BaseToastProps;

// export default function Toast({
//   id,
//   show = true,
//   icon = 'Bell',
//   title,
//   remainTime,
//   content,
//   onClose,
//   autoDelete,
//   headerTextColor,
//   remainTimeColor = 'text-white-50',
//   buttonColor,
// }: ToastProps): ReactElement {
//   const Icon = icon ? Feather[icon] : null;
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (autoDelete) {
//         typeof onClose === 'function' && onClose(id);
//       }
//     }, 3000);
//     return () => {
//       clearInterval(interval);
//     };
//   }, []);
//   return (
//     <div className={`toast fade${show ? ' show' : ' hide'}`} role="alert" aria-live="assertive">
//       <div className={`toast-header${headerTextColor ? ` ${headerTextColor}` : ''}`}>
//         {Icon && <Icon className="feather mr-2" />}
//         <strong className="mr-auto">{title}</strong>
//         <small className={`${remainTimeColor} ml-2`}>{remainTime}</small>
//         <button
//           className={`ml-2 mb-1 close${buttonColor ? ` ${buttonColor}` : ''}`}
//           type="button"
//           data-dismiss="toast"
//           aria-label="Close"
//           onClick={() => {
//             typeof onClose === 'function' && onClose(id);
//           }}
//         >
//           <span aria-hidden="true">×</span>
//         </button>
//       </div>
//       <div className="toast-body">{content}</div>
//     </div>
//   );
// }

export default function Toast({
  id,
  show = true,
  title,
  remainTime,
  content,
  onClose,
  autoDelete,
  headerTextColor = 'text-primary',
  remainTimeColor = 'text-text-secondary',
  buttonColor = 'text-text-primary',
}: ToastProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoDelete) {
        typeof onClose === 'function' && onClose(id);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [autoDelete, id, onClose]);
  


  return (
    <div 
      className={`shadow-lg bg-white rounded-lg overflow-hidden w-80 transition-opacity duration-300  ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} 
      role="alert" 
      aria-live="assertive"
    >
      <div className={`p-3 flex justify-between items-center border-b ${headerTextColor}`}>
        <strong className="font-nexon font-medium">{title}</strong>
        <div className="flex items-center">
          <small className={`${remainTimeColor} text-xs mr-2 font-nexon`}>{remainTime}</small>
          <button
            className={`${buttonColor} focus:outline-none`}
            type="button"
            aria-label="닫기"
            onClick={() => {
              typeof onClose === 'function' && onClose(id);
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
      <div className="p-3 text-sm font-nexon text-text-primary">{content}</div>
    </div>
  );
}
