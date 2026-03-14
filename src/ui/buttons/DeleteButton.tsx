import { Button, type ButtonProps } from "./Button";

import { icons } from "../../assets/text/icons";
import { joinClasses } from "../../util/componentUtil";

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
