import { useEffect, useState } from "react";
import "./StatusBar.scss";

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="StatusBar">
      <p className="logo">FlyNet</p>

      <p>
        {now.toLocaleString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          second: "2-digit",
        })}
      </p>
    </div>
  );
}
