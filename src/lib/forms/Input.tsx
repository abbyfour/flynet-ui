import "./Input.scss";
import { type Time } from "./types";

type InputType = "text" | "date" | "time" | "longtext";

type InputValue<T extends InputType> =
  | (T extends "text" ? string : never)
  | (T extends "date" ? Date : never)
  | (T extends "time" ? Time : never)
  | (T extends "longtext" ? string : never)
  | undefined;

type InputProps<T extends InputType> = {
  type: T;
  id: string;
  label: string;

  onChange?(value: InputValue<T>): void;
};

export function Input<T extends InputType>({
  type,
  id,
  label,
  onChange,
}: InputProps<T>) {
  return (
    <div className="Input">
      <label htmlFor={id}>{label}</label>

      {type === "longtext" ? (
        <textarea
          id={id}
          onChange={(e) => onChange?.(transformValue(type, e.target.value))}
        />
      ) : (
        <input
          type={getInputType(type)}
          id={id}
          onChange={(e) => onChange?.(transformValue(type, e.target.value))}
        />
      )}
    </div>
  );
}

function transformValue<T extends InputType>(
  type: T,
  value: string | undefined,
): InputValue<T> {
  switch (type) {
    case "text":
    case "longtext":
    case "time":
      return value as InputValue<T>;
    case "date":
      return parseDate(value) as InputValue<T>;

    default:
      return value as InputValue<T>;
  }
}

function parseDate(value: string | undefined): Date | undefined {
  if (value === undefined) {
    return undefined;
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }

  return date;
}

function getInputType(type: InputType): string {
  switch (type) {
    case "text":
      return "text";
    case "date":
      return "date";
    case "time":
      return "time";
    default:
      return "text";
  }
}
