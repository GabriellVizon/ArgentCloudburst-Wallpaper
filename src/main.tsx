
import React from "react";
import { createRoot } from "react-dom/client";
import ArgentCloudburst from "./ArgentCloudburst";
import "../styles.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ArgentCloudburst />
  </React.StrictMode>
);
