import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

export function AppContext({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <Notifications />

      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}
