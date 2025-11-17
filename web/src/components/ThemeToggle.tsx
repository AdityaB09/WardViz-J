import React, { useState } from "react";

const ThemeToggle: React.FC = () => {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  return (
    <button
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 text-xs text-slate-200 hover:bg-slate-800"
    >
      <span className="text-lg">{mode === "dark" ? "🌙" : "☀️"}</span>
      <span>{mode === "dark" ? "Dark mode" : "Light mode (dummy)"}</span>
    </button>
  );
};

export default ThemeToggle;
