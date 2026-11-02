import { IconCircleFilled } from "@tabler/icons-react";
import "./InputLabel.scss";

interface InputLabelProps {
  label: string;
  changed?: boolean;
  required?: boolean;
  description?: string;
}

export function InputLabel({
  label,
  changed,
  required,
  description,
}: InputLabelProps) {
  return (
    <div className="InputLabel">
      <div className="tiny-header">
        {required && <span className="required">*</span>}
        {label}{" "}
        {changed && <IconCircleFilled size={6} color="rgb(72, 128, 207)" />}
      </div>

      {description && (
        <div className="description text-small">{description}</div>
      )}
    </div>
  );
}
