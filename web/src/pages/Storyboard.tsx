import React, { useState } from "react";
import { getStoryboard, StoryboardResponse } from "../lib/api";
import Timeline from "../components/Timeline";
import EvidenceGraph from "../components/EvidenceGraph";
import PdfExportButton from "../components/PdfExportButton";

const Storyboard: React.FC = () => {
  const [patientId, setPatientId] = useState("P001");
  const [data, setData] = useState<StoryboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStoryboard(patientId);
      setData(res);
    } catch (e: any) {
      setData(null);
      setError(e.message || "Failed to load storyboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Storyboard</div>
          <div className="text-xs text-slate-400">
            Visual summary of events inferred from notes for a single patient.
          </div>
        </div>
        <PdfExportButton />
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
          {loading ? "Loading…" : "Load storyboard"}
        </button>
      </div>

      {error && (
        <div className="text-xs text-rose-300 border border-rose-700/70 bg-rose-950/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <Timeline events={data?.events || []} />
        <div className="space-y-4">
          <EvidenceGraph events={data?.events || []} links={data?.links || []} />
          <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/60 text-xs">
            <div className="font-semibold mb-2 text-slate-100">
              Uncertainty summary
            </div>
            {data && Object.keys(data.uncertainty || {}).length ? (
              <ul className="space-y-1">
                {Object.entries(data.uncertainty).map(([k, v]) => (
                  <li key={k} className="flex justify-between">
                    <span className="text-slate-300">{k}</span>
                    <span className="font-mono text-emerald-300">
                      {v.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400">
                No uncertainty statistics yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storyboard;
