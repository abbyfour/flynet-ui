import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import type { ConfirmModal } from "./Confirm";
import { narrowNotice } from "./noticeUtil";
import type { Toast } from "./Toast";

export enum NoticeType {
  Toast,
  Confirm,
}

export interface Notice {
  noticeType: NoticeType;
}

export function dispatchNotice(notice: Notice) {
  if (narrowNotice<Toast>(notice, NoticeType.Toast)) {
    notifications.show(notice);
  } else if (narrowNotice<ConfirmModal>(notice, NoticeType.Confirm)) {
    modals.openConfirmModal(notice);
  }
}
