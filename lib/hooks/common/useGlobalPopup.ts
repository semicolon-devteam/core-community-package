import { useAppDispatch } from "@hooks/common";
import { 
  hideAllPopups, 
  removeAllPopups, 
  showPopup, 
  type PopupConfig 
} from "@redux/Features/Popup/popupSlice";
import { useCallback } from "react";

export const useGlobalPopup = () => {
  const dispatch = useAppDispatch();

  const popup = useCallback((config: Omit<PopupConfig, 'id'> & { id?: string }) => {
    const popupConfig: PopupConfig = {
      id: config.id || `popup-${Date.now()}-${Math.random()}`,
      type: 'info',
      showConfirm: true,
      showCancel: true,
      closable: true,
      backdrop: true,
      ...config,
    };

    dispatch(showPopup(popupConfig));
    return popupConfig.id;
  }, [dispatch]);

  const alert = useCallback((
    content: string | React.ReactNode, 
    title?: string, 
    options?: Partial<PopupConfig>
  ) => {
    return popup({
      title,
      content,
      showCancel: false,
      confirmText: '확인',
      ...options,
    });
  }, [popup]);  const confirm = useCallback((
    content: string | React.ReactNode,
    title?: string,
    options?: Partial<PopupConfig>
  ) => {
    return new Promise<boolean>((resolve) => {
      popup({
        title,
        content,
        type: 'confirm',
        confirmText: '확인',
        cancelText: '취소',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
        onClose: () => resolve(false),
        ...options,
      });
    });
  }, [popup]);

  const success = useCallback((content: string | React.ReactNode, title?: string) => {
    return alert(content, title, { type: 'success' });
  }, [alert]);

  const error = useCallback((content: string | React.ReactNode, title?: string) => {
    return alert(content, title, { type: 'error' });
  }, [alert]);

  const warning = useCallback((content: string | React.ReactNode, title?: string) => {
    return alert(content, title, { type: 'warning' });
  }, [alert]);

  const closeAll = useCallback(() => {
    dispatch(hideAllPopups());
    setTimeout(() => {
      dispatch(removeAllPopups());
    }, 300);
  }, [dispatch]);

  return {
    popup,
    alert,
    confirm,
    success,
    error,
    warning,
    closeAll,
  };
};