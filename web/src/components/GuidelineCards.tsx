import React from "react";
import { GuidelineCard } from "../lib/api";

type Props = {
  cards: GuidelineCard[];
};

const statusStyles: Record<string, string> = {
  met: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
  gap: "bg-rose-500/15 text-rose-200 border-rose-500/40",
  consider: "bg-amber-500/15 text-amber-200 border-amber-500/40",
};

const severityDot: Record<string, string> = {
  high: "bg-rose-400",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

const GuidelineCards: React.FC<Props> = ({ cards }) => {
  if (!cards.length) {
    return (
      <div className="border border-dashed border-slate-700 rounded-xl p-6 text-sm text-slate-400 text-center">
        No guideline suggestions yet. Ingest a note and then refresh.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((c) => {
        const statusClass =
          statusStyles[c.status] ||
          "bg-slate-800/80 text-slate-100 border-slate-600/60";
        const sevDot =
          severityDot[c.severity] ||
          "bg-slate-400";

        return (
          <div
            key={c.id}
            className="border border-slate-800 rounded-xl p-4 bg-slate-900/70 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold text-sm text-slate-100">
                {c.title}
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${statusClass}`}
              >
                {c.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {c.rationale}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${sevDot}`}
                />
                <span>Severity: {c.severity}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GuidelineCards;
