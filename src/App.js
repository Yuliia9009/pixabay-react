import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ImageDetails from "./pages/ImageDetails";
import Author from "./pages/Author";
import { useEffect, useState } from "react";

function ThemeSwitch(){
  const [mode, setMode] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "light" || mode === "dark"){
      root.setAttribute("data-theme", mode);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <div className="theme-switch" title="Theme">
      <button className={mode==="light" ? "active":""} onClick={()=>setMode("light")}>☀️</button>
      <button className={mode==="dark" ? "active":""} onClick={()=>setMode("dark")}>🌙</button>
      <button className={mode==="system" ? "active":""} onClick={()=>setMode("system")}>🖥️</button>
    </div>
  );
}

export default function App() {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="brand">
            <span className="brand-badge">Px</span>
            Yuliia's Pixabay on React :)
          </NavLink>
          <nav style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems:"center" }}>
            <NavLink to="/" style={{ textDecoration: "none", color: "var(--muted)" }}>
              Main
            </NavLink>
            <ThemeSwitch />
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image/:id" element={<ImageDetails />} />
          <Route path="/author/:userId" element={<Author />} />
        </Routes>
      </main>
    </>
  );
}