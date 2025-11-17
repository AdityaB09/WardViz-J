import React, { useState } from "react";
import { getGuidelines, GuidelineResponse } from "../lib/api";
import GuidelineCards from "../components/GuidelineCards";
import CounterfactualPanel from "../components/CounterfactualPanel";

const ComparePage: React.FC = () => {
  const [leftId, setLeftId] = useState("P001");
  const [rightId, setRightId] = useState("P002");
  const [leftData, setLeftData] = useState<GuidelineResponse | null>(null);
  const [rightData, setRightData] = useState<GuidelineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [l, r] = await Promise.all([
        getGuidelines(leftId),
        getGuidelines(rightId),
      ]);
      setLeftData(l);
      setRightData(r);
    } catch (e: any) {
      setLeftData(null);
      setRightData(null);
      setError(e.message || "Failed to load comparison");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold">Compare patients</div>
      <div className="text-xs text-slate-400">
        Show guideline differences between two patients (e.g., P001 vs P002).
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <label className="text-slate-300">
          Left patient:
          <input
            value={leftId}
            onChange={(e) => setLeftId(e.target.value)}
            className="ml-2 px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-100 text-xs"
          />
        </label>
        <label className="text-slate-300">
          Right patient:
          <input
            value={rightId}
            onChange={(e) => setRightId(e.target.value)}
            className="ml-2 px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-100 text-xs"
          />
        </label>
        <button
          onClick={load}
          disabled={loading || !leftId.trim() || !rightId.trim()}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-medium hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Loading…" : "Compare"}
        </button>
      </div>

      {error && (
        <div className="text-xs text-rose-300 border border-rose-700/70 bg-rose-950/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            {leftId || "Left"}
          </div>
          <GuidelineCards cards={leftData?.cards || []} />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            {rightId || "Right"}
          </div>
          <GuidelineCards cards={rightData?.cards || []} />
        </div>
      </div>

      <CounterfactualPanel />
    </div>
  );
};

export default ComparePage;
