import React, { useState } from "react";
import Studio from "./pages/Studio";
import Storyboard from "./pages/Storyboard";
import GuidelinesPage from "./pages/Guidelines";
import ComparePage from "./pages/Compare";
import ThemeToggle from "./components/ThemeToggle";

type TabKey = "studio" | "storyboard" | "guidelines" | "compare";

const App: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("studio");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "studio", label: "📝 Studio" },
    { key: "storyboard", label: "📊 Storyboard" },
    { key: "guidelines", label: "📋 Guidelines" },
    { key: "compare", label: "⚖️ Compare" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xl">
              W
            </span>
            <div className="flex flex-col">
              <span className="font-semibold tracking-tight">WardViz-J</span>
              <span className="text-xs text-slate-400">
                Ward-level patient timeline and guideline cockpit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        <nav className="border-t border-slate-800 bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 flex gap-2 overflow-x-auto py-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition
                  ${
                    tab === t.key
                      ? "bg-emerald-500 text-slate-900 font-semibold"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {tab === "studio" && <Studio />}
          {tab === "storyboard" && <Storyboard />}
          {tab === "guidelines" && <GuidelinesPage />}
          {tab === "compare" && <ComparePage />}
        </div>
      </main>
    </div>
  );
};

export default App;
