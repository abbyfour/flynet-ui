import { type Thinking } from "@data/uiSlice";
import { joinClasses } from "@util/componentUtil";
import { useEffect, useState } from "react";

import "./Thinking.scss";

export function Thinking({ thinking }: { thinking?: Thinking }) {
  const [displayedMessage, setDisplayedMessage] = useState<string | undefined>(
    thinking?.message,
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (thinking?.message) {
      setDisplayedMessage(thinking.message);
    } else {
      timeoutId = setTimeout(() => {
        setDisplayedMessage(undefined);
      }, 8000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [thinking]);

  return displayedMessage ? (
    <div
      className={joinClasses(
        "Thinking",
        !thinking && displayedMessage && "fade-out",
      )}
    >
      {displayedMessage}
      <span className="ellipses">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  ) : (
    <></>
  );
}
