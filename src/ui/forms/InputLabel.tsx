import { IconCircleFilled } from "@tabler/icons-react";
import "./InputLabel.scss";

interface InputLabelProps {
  label: string;
  changed?: boolean;
  required?: boolean;
}

export function InputLabel({ label, changed, required }: InputLabelProps) {
  return (
    <div className="InputLabel">
      {required && <span className="required">*</span>}
      {label}{" "}
      {changed && <IconCircleFilled size={6} color="rgb(72, 128, 207)" />}
    </div>
  );
}
