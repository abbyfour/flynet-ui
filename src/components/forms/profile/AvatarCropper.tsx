import { Button } from "@components/common/buttons/Button";
import { useCallback, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";

import "./AvatarCropper.scss";

const getCroppedImg = async (imageSrc: string, pixelCrop: Area) => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );
  return canvas.toDataURL("image/jpeg");
};

type AvatarCropperProps = {
  imageSrc: string;
  onConfirm: (croppedUrl: string) => void;
  onCancel: () => void;
};

export function AvatarCropper({
  imageSrc,
  onConfirm,
  onCancel,
}: AvatarCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const result = await getCroppedImg(imageSrc, croppedAreaPixels);

    onConfirm(result);
  };

  return (
    <div className="AvatarCropper">
      <div className="cropper-frame">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <label className="zoom-control">
        <span>Zoom</span>
        <input
          type="range"
          aria-label="Avatar zoom"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </label>

      <div className="actions">
        <Button fullWidth={false} onClick={onCancel}>
          Cancel
        </Button>
        <Button fullWidth={false} variant="filled" onClick={handleConfirm}>
          Use avatar
        </Button>
      </div>
    </div>
  );
}
