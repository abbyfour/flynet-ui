import { AppContext } from "./ui/AppContext";
import { Dock } from "./ui/desktop/Dock";
import { StatusBar } from "./ui/desktop/statusBar/StatusBar";
import { ThemeToggle } from "./ui/desktop/themeToggle/ThemeToggle";
import { LoginWindow } from "./ui/desktop/windows/login/LoginWindow";
import { SidepanelWindow } from "./ui/desktop/windows/SidepanelWindow";
import { Map } from "./ui/map/Map";

import "./styles.shim.ts";

function App() {
  return (
    <AppContext>
      {/* Desktop UI */}
      <StatusBar />
      <Dock />

      {/* Windows */}
      <LoginWindow />
      <SidepanelWindow />

      {/* UI controls — temporary */}
      <ThemeToggle />

      {/* Renders both base map and data layers */}
      <Map />
    </AppContext>
  );
}

export default App;
