import { icons } from "@assets/icons/icons";
import { joinClasses } from "@util/componentUtil";
import { Button, type ButtonProps } from "./Button";

export function DeleteButton(props: ButtonProps) {
  return (
    <Button
      variant="outline"
      color="red"
      {...props}
      className={joinClasses("DeleteButton", props.className)}
      icon={icons.actions.delete_()}
    >
      {props.children || "Delete"}
    </Button>
  );
}
