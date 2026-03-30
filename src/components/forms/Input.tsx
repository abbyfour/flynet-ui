import { PasswordInput, Textarea, TextInput } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { type Time } from "@util/types";
import { useCallback, useState } from "react";
import "./Input.scss";
import { InputLabel } from "./InputLabel";

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
  fingerprinted?: boolean;
}

type InputProps<T extends InputType> = BaseInputProps & {
  type: T;
  value?: InputValue<T>;

  onChange?(value: InputValue<T>): void;
};

export function Input<T extends InputType>({
  type,
  id,
  label,
  onChange,
  value,
  required = false,
  placeholder = "",
  icon: leftSection,

  disabled = false,
  fingerprinted = false,
}: InputProps<T>) {
  const [initialValue] = useState(value);

  const hasValueChanged = useCallback(() => {
    if (!fingerprinted) return false;

    if (
      type === "text" ||
      type === "longtext" ||
      type === "password" ||
      type === "time"
    ) {
      return (value ?? "") !== (initialValue ?? "");
    }

    if (type === "date") {
      return value instanceof Date && initialValue instanceof Date
        ? value.getTime() !== initialValue.getTime()
        : value !== initialValue;
    }

    return value !== initialValue;
  }, [fingerprinted, type, value, initialValue]);

  const sharedInputProps = {
    id,
    disabled,

    // aesthetics
    label: (
      <InputLabel
        label={label}
        changed={hasValueChanged()}
        required={required}
      />
    ),
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
          value={value as string | undefined}
          onChange={(e) => onChange?.(transformValue(type, e.target.value))}
        />
      );
    case "date":
      return (
        <div className="date-input">
          <InputLabel
            label={label}
            changed={hasValueChanged()}
            required={required}
          />

          <input
            type="date"
            {...sharedInputProps}
            value={value ? (value as Date).toISOString().split("T")[0] : ""}
            onChange={(e) => onChange?.(transformValue(type, e.target.value))}
          />
        </div>
      );
    // return (
    //   <DateInput
    //     {...sharedInputProps}
    //     clearable={!required}
    //     maxDate={dayjs().add(2, "year").format("YYYY-MM-DD")}
    //     value={value as Date | undefined}
    //     onChange={(date) =>
    //       onChange?.(transformValue(type, date ?? undefined))
    //     }
    //   />
    // );
    case "time":
      return (
        <TimeInput
          {...sharedInputProps}
          value={value as string | undefined}
          onChange={(e) =>
            onChange?.(transformValue(type, e.target.value ?? undefined))
          }
        />
      );
    case "password":
      return (
        <PasswordInput
          {...sharedInputProps}
          value={value as string | undefined}
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
          value={value as string | undefined}
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
