import type { NotificationData } from "@mantine/notifications";
import type React from "react";
import { NoticeType } from "./dispatchNotice";

interface ToastProps {
  message: React.ReactNode;
  title?: string;
  color?: string;
  autoClose?: number;
}

export type Toast = NotificationData & { noticeType: NoticeType.Toast };

export function Toast({ title, message, color, autoClose }: ToastProps): Toast {
  return {
    title,
    message,
    color,
    position: "top-center",
    autoClose: autoClose || 3000,
    noticeType: NoticeType.Toast,
  };
}

export const Toasts = {
  success: (props: ToastProps | string) =>
    Toast({
      ...(typeof props === "string" ? { message: props } : props),
      color: "green",
    }),

  error: (props: ToastProps | string) =>
    Toast({
      ...(typeof props === "string" ? { message: props } : props),
      color: "red",
    }),

  warning: (props: ToastProps | string) =>
    Toast({
      ...(typeof props === "string" ? { message: props } : props),
      color: "yellow",
    }),
};
