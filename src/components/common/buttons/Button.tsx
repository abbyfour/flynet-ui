import { Button as MantineButton } from "@mantine/core";
import { joinClasses } from "@util/componentUtil";

export type ButtonProps = {
  id?: string;
  className?: string;

  children?: React.ReactNode;

  /** @default "button" */
  type?: "button" | "submit";

  /** @default "outline" */
  variant?: "filled" | "outline";

  /** @default "dark" */
  color?: string;

  /** @default true */
  fullWidth?: boolean;

  loading?: boolean;
  disabled?: boolean;

  icon?: React.ReactNode;

  onClick?: () => void;
};

export function Button({
  children,
  fullWidth = true,
  variant = "outline",
  color = "dark",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <MantineButton
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      leftSection={props.icon}
      {...props}
      className={joinClasses("Button", className)}
    >
      {children}
    </MantineButton>
  );
}
