import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./reset.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <link
      href="https://unpkg.com/maplibre-gl@5.16.0/dist/maplibre-gl.css"
      rel="stylesheet"
    /> */}

    <App />
  </StrictMode>,
);
