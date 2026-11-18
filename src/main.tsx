import React from "react";
import { createRoot } from "react-dom/client";
import NeonCity from "./NeonCity";
import "../styles.css";
import "./neon-city.css";
import "./city-map.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NeonCity />
  </React.StrictMode>
);
