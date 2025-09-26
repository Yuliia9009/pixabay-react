import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container);

(function initTheme(){
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");

  function apply(theme){
    if (theme === "light" || theme === "dark"){
      root.setAttribute("data-theme", theme);
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }

  apply(saved || "system");

  if (!saved || saved === "system"){
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener?.("change", () => apply("system"));
  }
})();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);