import { NoticeType, type Notice } from "./dispatchNotice";

export function narrowNotice<T extends Notice>(
  data: unknown,
  type: NoticeType,
): data is T {
  return (
    typeof data === "object" &&
    data !== null &&
    "noticeType" in data &&
    (data as { noticeType: unknown }).noticeType === type
  );
}
