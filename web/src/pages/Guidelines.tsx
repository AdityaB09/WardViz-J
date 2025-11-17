import React, { useState } from "react";
import { getGuidelines, GuidelineResponse } from "../lib/api";
import GuidelineCards from "../components/GuidelineCards";

const GuidelinesPage: React.FC = () => {
  const [patientId, setPatientId] = useState("P001");
  const [data, setData] = useState<GuidelineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getGuidelines(patientId);
      setData(res);
    } catch (e: any) {
      setData(null);
      setError(e.message || "Failed to load guidelines");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold">Guideline cockpit</div>
      <div className="text-xs text-slate-400">
        Rule-based guideline cards for the latest note of the selected patient.
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <label className="text-slate-300">
          Patient ID:
          <input
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="ml-2 px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-100 text-xs"
          />
        </label>
        <button
          onClick={load}
          disabled={loading || !patientId.trim()}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-medium hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Loading…" : "Load guidelines"}
        </button>
      </div>

      {error && (
        <div className="text-xs text-rose-300 border border-rose-700/70 bg-rose-950/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <GuidelineCards cards={data?.cards || []} />
    </div>
  );
};

export default GuidelinesPage;
