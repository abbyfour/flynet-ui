import { useAppSelector } from "@data/store";
import { selectThemeFallbackToSystem } from "@data/uiSlice";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";

export function AppContext({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector(selectThemeFallbackToSystem);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <MantineProvider>
      <Notifications />

      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}
