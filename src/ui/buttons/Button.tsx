import { Button as MantineButton } from "@mantine/core";

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

  onClick?: () => void;
};

export function Button({
  children,
  fullWidth = true,
  variant = "outline",
  color = "dark",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <MantineButton
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      {...props}
    >
      {children}
    </MantineButton>
  );
}
