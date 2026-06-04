import { modals } from "@mantine/modals";
import { CropAvatarModal } from "./CropAvatarModal";

type OpenCropAvatarModalOptions = {
  file?: File;
  imageSrc?: string;
  title?: string;
};

export function openCropAvatarModal({
  file,
  imageSrc,
  title = "Crop avatar",
}: OpenCropAvatarModalOptions): Promise<string | null> {
  if (!file && !imageSrc) {
    throw new Error("openCropAvatarModal requires a file or imageSrc");
  }

  const sourceUrl = imageSrc ?? URL.createObjectURL(file!);
  const ownsObjectUrl = !imageSrc;
  return new Promise((resolve) => {
    let isSettled = false;

    const settle = (value: string | null) => {
      if (isSettled) return;
      isSettled = true;

      if (ownsObjectUrl) {
        URL.revokeObjectURL(sourceUrl);
      }

      resolve(value);
    };

    const modalId = modals.open({
      title,
      centered: true,
      size: "lg",
      closeOnClickOutside: false,
      children: (
        <CropAvatarModal
          imageSrc={sourceUrl}
          onConfirm={(croppedUrl) => {
            settle(croppedUrl);
            modals.close(modalId);
          }}
          onCancel={() => {
            settle(null);
            modals.close(modalId);
          }}
        />
      ),
      onClose: () => settle(null),
    });
  });
}
