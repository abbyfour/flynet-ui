import { Button, type ButtonProps } from "./Button";

export function SubmitButton(props: ButtonProps) {
  return (
    <Button type="submit" {...props}>
      {props.children || "Submit"}
    </Button>
  );
}
