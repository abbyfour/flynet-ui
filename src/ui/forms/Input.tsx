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

export interface BaseInputProps {
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

type InputProps<T extends InputType> = BaseInputProps & {
  type: T;

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
  const sharedInputProps = {
    id,
    required,
    disabled,

    // aesthetics
    label,
    placeholder,
    leftSection,
    radius: "xs",
    className: "Input",
  } as const;

  switch (type) {
    case "text":
      return (
        <TextInput
          {...sharedInputProps}
          onChange={(e) => onChange?.(transformValue(type, e.target.value))}
        />
      );
    case "date":
      return (
        <DateInput
          {...sharedInputProps}
          clearable={!required}
          maxDate={dayjs().add(2, "year").format("YYYY-MM-DD")}
          onChange={(date) =>
            onChange?.(transformValue(type, date ?? undefined))
          }
        />
      );
    case "time":
      return (
        <TimeInput
          {...sharedInputProps}
          onChange={(e) =>
            onChange?.(transformValue(type, e.target.value ?? undefined))
          }
        />
      );
    case "password":
      return (
        <PasswordInput
          {...sharedInputProps}
          onChange={(e) => onChange?.(transformValue(type, e.target.value))}
        />
      );
    case "longtext":
      return (
        <Textarea
          {...sharedInputProps}
          autosize
          minRows={2}
          maxRows={4}
          onChange={(e) => onChange?.(transformValue(type, e.target.value))}
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
