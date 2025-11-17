import React from "react";
import { TimelineEvent } from "../lib/api";

type Props = {
  events: TimelineEvent[];
};

const categoryColor: Record<string, string> = {
  diagnosis: "bg-purple-500/20 text-purple-200 border-purple-500/40",
  medication: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  lab: "bg-sky-500/20 text-sky-200 border-sky-500/40",
  symptom: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  treatment: "bg-rose-500/20 text-rose-200 border-rose-500/40",
};

const Timeline: React.FC<Props> = ({ events }) => {
  if (!events.length) {
    return (
      <div className="border border-dashed border-slate-700 rounded-xl p-6 text-sm text-slate-400 text-center">
        No timeline events yet. Ingest a note in the Studio tab first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((e, idx) => {
        const catClass =
          categoryColor[e.category] ||
          "bg-slate-700/60 text-slate-200 border-slate-500/40";

        return (
          <div
            key={e.id}
            className="flex gap-3 items-start border border-slate-800 rounded-xl p-4 bg-slate-900/60"
          >
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              {idx < events.length - 1 && (
                <div className="flex-1 w-px bg-slate-700 mt-1" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-sm">{e.label}</div>
                <div className="text-xs text-slate-400">
                  {new Date(e.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full border ${catClass}`}
                >
                  {e.category}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-slate-700 text-slate-300">
                  Section: {e.section || "Unknown"}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-slate-700 text-slate-300">
                  Patient: {e.patientId}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
