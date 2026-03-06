import { PasswordInput, Textarea, TextInput } from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import { type Time } from "../../util/types";
import "./Input.scss";

type InputType = "text" | "date" | "time" | "longtext" | "password";

type InputValue<T extends InputType> =
  | (T extends "text" ? string : never)
  | (T extends "date" ? Date : never)
  | (T extends "time" ? Time : never)
  | (T extends "longtext" ? string : never)
  | (T extends "password" ? string : never)
  | undefined;

type InputProps<T extends InputType> = {
  type: T;
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;

  onChange?(value: InputValue<T>): void;
};

export function Input<T extends InputType>({
  type,
  id,
  label,
  onChange,
  required = false,
  placeholder = "",
  icon: leftSection,

  disabled = false,
}: InputProps<T>) {
  switch (type) {
    case "text":
      return (
        <TextInput
          radius={"xs"}
          label={label}
          className="Input"
          id={id}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          leftSection={leftSection}
          onChange={(e) => onChange?.(transformValue(type, e.target.value))}
        />
      );
    case "date":
      return (
        <DateInput
          label={label}
          className="Input"
          id={id}
          radius={"xs"}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          clearable={!required}
          leftSection={leftSection}
          maxDate={dayjs().add(2, "year").format("YYYY-MM-DD")}
          onChange={(date) =>
            onChange?.(transformValue(type, date ?? undefined))
          }
        />
      );
    case "time":
      return (
        <TimeInput
          label={label}
          className="Input"
          id={id}
          radius={"xs"}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          leftSection={leftSection}
          onChange={(e) =>
            onChange?.(transformValue(type, e.target.value ?? undefined))
          }
        />
      );
    case "password":
      return (
        <PasswordInput
          type={type}
          label={label}
          id={id}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          leftSection={leftSection}
          onChange={(e) => onChange?.(transformValue(type, e.target.value))}
        />
      );
    case "longtext":
      return (
        <Textarea
          className="Input"
          label={label}
          id={id}
          radius={"xs"}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          leftSection={leftSection}
          onChange={(e) => onChange?.(transformValue(type, e.target.value))}
          autosize
          minRows={2}
          maxRows={4}
        />
      );
    default:
      throw new Error(`Unsupported input type: ${type}`);
  }
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
    return undefined;
  }

  return date;
}
