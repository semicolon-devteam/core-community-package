'use client';

import '@toast-ui/editor/dist/toastui-editor.css';
import type { EditorProps } from '@toast-ui/react-editor';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

const EditorComponent = dynamic(
  () => import('@toast-ui/react-editor').then(mod => mod.Editor),
  { ssr: false }
);

const ViewerComponent = dynamic(
  () => import('@toast-ui/react-editor').then(mod => mod.Viewer),
  { ssr: false }
);

interface ToastEditorProps extends Omit<EditorProps, 'ref'> {
  onImageUpload?: (file: File) => Promise<string>;
}

const ToastEditor = ({ onImageUpload, ...props }: ToastEditorProps) => {
  const handleImageUpload = useCallback(
    async (blob: Blob, callback: (url: string, altText: string) => void) => {
      if (!onImageUpload) {
        return false;
      }

      try {
        const file = new File([blob], 'image.png', { type: blob.type });
        const url = await onImageUpload(file);
        callback(url, 'image');
        return true;
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        return false;
      }
    },
    [onImageUpload]
  );

  return (
    <EditorComponent
      {...props}
      hooks={{
        addImageBlobHook: handleImageUpload,
      }}
    />
  );
};

export { ToastEditor as Editor, ViewerComponent as Viewer };
