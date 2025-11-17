import React from "react";

const AnatomyPanel: React.FC = () => {
  return (
    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60 text-xs text-slate-300 space-y-2">
      <div className="font-semibold text-slate-100">
        How WardViz-J uses a note
      </div>
      <ul className="list-disc list-inside space-y-1">
        <li>
          Looks for keywords like <code>type 2 diabetes</code>,{" "}
          <code>hypertension</code>, <code>metformin</code>,{" "}
          <code>HbA1c 9.2</code>, <code>rash</code>, <code>infection</code>.
        </li>
        <li>
          Creates timeline events (diagnosis, meds, labs, symptoms, treatments).
        </li>
        <li>
          Builds simple guideline cards about control, therapy gaps, and risks.
        </li>
        <li>
          Different texts → different event sets and guideline cards, so you can
          demo multiple patients.
        </li>
      </ul>
    </div>
  );
};

export default AnatomyPanel;
