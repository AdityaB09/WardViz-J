import React from "react";
import { EvidenceLink, TimelineEvent } from "../lib/api";

type Props = {
  events: TimelineEvent[];
  links: EvidenceLink[];
};

const EvidenceGraph: React.FC<Props> = ({ events, links }) => {
  if (!links.length) {
    return (
      <div className="border border-dashed border-slate-700 rounded-xl p-4 text-xs text-slate-400 text-center">
        No evidence links inferred yet.
      </div>
    );
  }

  const eventById = new Map(events.map((e) => [e.id, e]));

  return (
    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
      <div className="text-sm font-semibold mb-3">Evidence graph</div>
      <div className="space-y-2 text-xs">
        {links.map((l) => {
          const source = eventById.get(l.sourceEventId);
          const target = eventById.get(l.targetEventId);
          return (
            <div
              key={l.id}
              className="flex items-center justify-between gap-2 border border-slate-800 rounded-lg px-3 py-2 bg-slate-950/60"
            >
              <div className="flex-1 truncate">
                <span className="text-slate-400">From: </span>
                <span className="text-slate-100">
                  {source?.label || l.sourceEventId}
                </span>
              </div>
              <div className="text-emerald-300 text-[11px] font-mono">
                {l.relation.toUpperCase()}
              </div>
              <div className="flex-1 truncate text-right">
                <span className="text-slate-400">To: </span>
                <span className="text-slate-100">
                  {target?.label || l.targetEventId}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvidenceGraph;
