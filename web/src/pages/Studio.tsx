import React, { useState } from "react";
import { checkHealth, ingestNote } from "../lib/api";

type Scenario = {
  id: string;
  label: string;
  note: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "P001",
    label: "T2D + high HbA1c (P001)",
    note: `
Subjective: 55-year-old with type 2 diabetes reports fatigue and increased thirst.
Objective: HbA1c 9.2%, fasting glucose 190 mg/dL. On metformin 500 mg BID.
Plan: Uptitrate metformin to 1000 mg BID and schedule diabetes education visit.
`.trim(),
  },
  {
    id: "P002",
    label: "Well-controlled T2D (P002)",
    note: `
Subjective: 60-year-old with long-standing T2D feels well, no polyuria or polydipsia.
Objective: HbA1c 6.7%, BP 122/76. On metformin 1000 mg BID and lifestyle changes.
Plan: Continue current regimen, recheck labs in 6 months.
`.trim(),
  },
  {
    id: "P003",
    label: "HTN + obesity (P003)",
    note: `
Subjective: 48-year-old with hypertension and obesity complains of morning headaches.
Objective: BP 158/94, BMI 33. On amlodipine 5 mg daily, nonadherent to low-salt diet.
Plan: Increase amlodipine to 10 mg daily, reinforce diet and exercise counseling.
`.trim(),
  },
  {
    id: "P004",
    label: "HTN + CKD stage 3 (P004)",
    note: `
Subjective: 70-year-old with HTN and CKD denies chest pain or dyspnea.
Objective: BP 150/88, eGFR 45 mL/min, creatinine 1.6 mg/dL. On lisinopril 20 mg daily.
Plan: Add low-dose thiazide, monitor electrolytes and renal function in 2 weeks.
`.trim(),
  },
  {
    id: "P005",
    label: "T2D + HTN combo (P005)",
    note: `
Subjective: 62-year-old with T2D and HTN reports occasional dizziness when standing.
Objective: HbA1c 8.1%, BP 138/82 sitting and 112/70 standing. On metformin and losartan.
Plan: Evaluate for over-treatment of BP, consider adjusting losartan dose, advise slow position changes.
`.trim(),
  },
  {
    id: "P006",
    label: "Infection + rash (P006)",
    note: `
Subjective: 35-year-old treated for sinus infection with amoxicillin now has diffuse pruritic rash.
Objective: Maculopapular rash on trunk and arms, afebrile, lungs clear.
Plan: Discontinue amoxicillin, start antihistamines, consider alternative antibiotic if needed.
`.trim(),
  },
  {
    id: "P007",
    label: "COPD exacerbation (P007)",
    note: `
Subjective: 68-year-old with COPD reports increased dyspnea and productive cough for 3 days.
Objective: RR 24, SpO2 90% on room air, wheezes bilaterally. On tiotropium and albuterol PRN.
Plan: Start oral prednisone burst and short course of azithromycin, increase bronchodilator use, arrange close follow-up.
`.trim(),
  },
  {
    id: "P008",
    label: "Heart failure + HTN (P008)",
    note: `
Subjective: 72-year-old with HFrEF and HTN reports worsening leg swelling and orthopnea.
Objective: BP 146/86, bilateral pitting edema, JVD present. On ACE inhibitor and low-dose furosemide.
Plan: Increase furosemide dose, reinforce low-sodium diet, check BMP and NT-proBNP, consider cardiology follow-up.
`.trim(),
  },
  {
    id: "P009",
    label: "Asthma, poorly controlled (P009)",
    note: `
Subjective: 22-year-old with asthma uses rescue inhaler daily, nighttime wheeze 3x/week.
Objective: Expiratory wheezes, peak flow below personal best. On albuterol only.
Plan: Start low-dose inhaled corticosteroid controller, review inhaler technique, provide asthma action plan.
`.trim(),
  },
  {
    id: "P010",
    label: "Elderly polypharmacy (P010)",
    note: `
Subjective: 80-year-old with HTN, T2D, and osteoarthritis reports falls and confusion.
Objective: Orthostatic drop in BP, on five medications including benzodiazepine at night.
Plan: Review meds for deprescribing, taper benzodiazepine, address fall risk and arrange PT evaluation.
`.trim(),
  },
];

const Studio: React.FC = () => {
  const [patientId, setPatientId] = useState<string>("P001");
  const [noteText, setNoteText] = useState<string>(SCENARIOS[0].note);
  const [apiStatus, setApiStatus] = useState<"idle" | "ok" | "error">("idle");
  const [apiError, setApiError] = useState<string | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [lastResult, setLastResult] = useState<{
    noteId?: string;
    eventsCreated?: number;
  } | null>(null);

  const onCheckApiHealth = async () => {
    try {
      setApiError(null);
      const res = await checkHealth();
      if (res.status === "ok") {
        setApiStatus("ok");
      } else {
        setApiStatus("error");
        setApiError(`Unexpected response: ${JSON.stringify(res)}`);
      }
    } catch (e: any) {
      setApiStatus("error");
      setApiError(e?.message ?? "Failed to reach API");
    }
  };

  const onIngest = async () => {
    setIsIngesting(true);
    setApiError(null);
    try {
      const res = await ingestNote({
        patientId: patientId.trim(),
        text: noteText.trim(),
      });
      setLastResult(res);
    } catch (e: any) {
      setApiError(e?.message ?? "Failed to ingest note");
    } finally {
      setIsIngesting(false);
    }
  };

  const applyScenario = (scenario: Scenario) => {
    setPatientId(scenario.id);
    setNoteText(scenario.note);
    setLastResult(null);
    setApiError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Studio</h1>
          <p className="text-sm text-slate-300">
            Paste a note, choose a patient ID, and ingest. Then open the{" "}
            <span className="font-semibold text-emerald-300">Storyboard</span>{" "}
            and{" "}
            <span className="font-semibold text-emerald-300">Guidelines</span>{" "}
            tabs to see the result.
          </p>
        </div>
        <button
          onClick={onCheckApiHealth}
          className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-900 shadow-md hover:bg-sky-400 transition"
        >
          🩺 Check API health
        </button>
      </div>

      {apiStatus === "error" && (
        <div className="rounded-md border border-red-500 bg-red-950/60 px-4 py-3 text-sm text-red-100">
          <span className="font-semibold">Error:</span>{" "}
          {apiError ?? "API not reachable"}
        </div>
      )}

      {apiStatus === "ok" && (
        <div className="rounded-md border border-emerald-500 bg-emerald-950/60 px-4 py-3 text-sm text-emerald-100">
          API is healthy and reachable.
        </div>
      )}

      {/* Scenario chips */}
      <div className="flex flex-wrap gap-3">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => applyScenario(sc)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              patientId === sc.id
                ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                : "border-slate-600 bg-slate-800/60 text-slate-100 hover:border-emerald-400"
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid gap-4 md:grid-cols-[200px,minmax(0,1fr)]">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Patient ID
          </label>
          <input
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-50 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={onIngest}
            disabled={isIngesting || !noteText.trim()}
            className="mt-3 w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isIngesting ? "Ingesting..." : "Ingest note"}
          </button>

          {lastResult && (
            <div className="mt-4 rounded-md border border-slate-600 bg-slate-900/80 px-3 py-2 text-xs text-slate-200">
              <div>
                <span className="font-semibold text-slate-100">Note ID:</span>{" "}
                {lastResult.noteId}
              </div>
              <div>
                <span className="font-semibold text-slate-100">
                  Events created:
                </span>{" "}
                {lastResult.eventsCreated ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Now switch to <span className="font-semibold">Storyboard</span>{" "}
                and <span className="font-semibold">Guidelines</span> tabs for
                this patient ID.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Clinical note
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={16}
            className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-50 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Studio;
