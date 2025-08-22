"use client";

import Toast from "@atoms/Toast";
import { useAppDispatch, useAppSelector } from "@hooks/common";
import { deleteToast, selectToast } from "@redux/Features/Toast/toastSlice";

export default function ToastContainer() {
  const { toastList, autoDelete, autoDeleteTime } = useAppSelector(selectToast);
  const dispatch = useAppDispatch();

  const handleClose = (id: string) => {
    dispatch(deleteToast(id));
  };

  return (
    <div className="toast-container fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {toastList.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          content={toast.content}
          remainTime={toast.remainTime ?? "방금"}
          headerTextColor={toast.headerTextColor}
          remainTimeColor={toast.remainTimeColor}
          buttonColor={toast.buttonColor}
          autoDelete={autoDelete}
          onClose={handleClose}
        />
      ))}
    </div>
  );
} 