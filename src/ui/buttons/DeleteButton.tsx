import { IconTrash } from "@tabler/icons-react";
import { Button, type ButtonProps } from "./Button";

import { joinClasses } from "../../util/componentUtil";

export function DeleteButton(props: ButtonProps) {
  return (
    <Button
      variant="outline"
      color="red"
      {...props}
      className={joinClasses("DeleteButton", props.className)}
      icon={<IconTrash size={16} />}
    >
      {props.children || "Delete"}
    </Button>
  );
}
