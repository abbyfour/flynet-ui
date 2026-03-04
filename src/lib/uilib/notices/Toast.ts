import type { NotificationData } from "@mantine/notifications";
import { NoticeType } from "./dispatchNotice";

interface ToastProps {
  message: string;
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
    position: "top-right",
    autoClose: autoClose || 3000,
    noticeType: NoticeType.Toast,
  };
}

export const Toasts = {
  success: (props: ToastProps) => Toast({ ...props, color: "green" }),
  error: (props: ToastProps) => Toast({ ...props, color: "red" }),
  warning: (props: ToastProps) => Toast({ ...props, color: "yellow" }),
};
