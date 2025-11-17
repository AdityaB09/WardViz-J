import React from "react";

const CounterfactualPanel: React.FC = () => {
  return (
    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
      <div className="text-sm font-semibold mb-1">
        Counterfactual “what-if” explorer
      </div>
      <p className="text-xs text-slate-400">
        This panel will simulate alternate plans (e.g., different medications,
        dosing, or timing) and compare timelines. For now, it is a placeholder
        so the UI layout stays clean.
      </p>
    </div>
  );
};

export default CounterfactualPanel;
