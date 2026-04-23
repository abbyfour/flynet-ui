import { AvatarCropper } from "./AvatarCropper";

type CropAvatarModalProps = {
  imageSrc: string;
  onConfirm: (croppedUrl: string) => void;
  onCancel: () => void;
};

export function CropAvatarModal({
  imageSrc,
  onConfirm,
  onCancel,
}: CropAvatarModalProps) {
  return (
    <AvatarCropper
      imageSrc={imageSrc}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
