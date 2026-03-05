import { modals } from "@mantine/modals";
import { dispatchNotice, NoticeType } from "./dispatchNotice";

type ConfirmProps = Parameters<typeof modals.openConfirmModal>[0] & {
  color?: string;
};

export type ConfirmModal = Parameters<typeof modals.openConfirmModal>[0] & {
  noticeType: NoticeType.Confirm;
};

export function ConfirmModal(props: ConfirmProps): ConfirmModal {
  return {
    title: "are you sure?",
    labels: { confirm: "Yes", cancel: "No" },
    centered: true,

    confirmProps: { color: props.color },
    ...props,
    noticeType: NoticeType.Confirm,
  };
}

export function confirm(modal: ConfirmProps): Promise<boolean> {
  return new Promise((resolve) => {
    dispatchNotice(
      ConfirmModal({
        ...modal,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      }),
    );
  });
}
