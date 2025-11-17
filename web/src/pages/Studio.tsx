import React, { useState } from "react";
import { ingestNote, IngestResponse, getHealth } from "../lib/api";
import AnatomyPanel from "../components/AnatomyPanel";

const diabetesNote = `Subjective: Patient with type 2 diabetes reports fatigue.
Objective: HbA1c 9.2; metformin 500 mg started two weeks ago.
Plan: uptitrate metformin.`;

const htnInfectionNote = `Patient with long-standing hypertension presents with cough and rash after starting antibiotics for chest infection.`;

const wellControlledNote = `Type 2 diabetes documented. Latest HbA1c 6.8 with diet and exercise alone.`;

const Studio: React.FC = () => {
  const [patientId, setPatientId] = useState("P001");
  const [text, setText] = useState(diabetesNote);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<string | null>(null);
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runHealthCheck = async () => {
    try {
      setError(null);
      const res = await getHealth();
      setHealth(`${res.service}: ${res.status}`);
    } catch (e: any) {
      setHealth(null);
      setError(e.message || "Health check failed");
    }
  };

  const handleIngest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ingestNote({ patientId, text });
      setResult(res);
    } catch (e: any) {
      setResult(null);
      setError(e.message || "Ingest failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Studio</div>
            <div className="text-xs text-slate-400">
              Paste a note, choose a patient ID, and ingest. Then open the{" "}
              <span className="font-semibold text-emerald-300">Storyboard</span>{" "}
              and{" "}
              <span className="font-semibold text-emerald-300">Guidelines</span>{" "}
              tabs to see the result.
            </div>
          </div>
          <button
            onClick={runHealthCheck}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800"
          >
            🔄 Check API health
          </button>
        </div>

        {health && (
          <div className="text-xs text-emerald-300">
            Backend health: <span className="font-mono">{health}</span>
          </div>
        )}

        {error && (
          <div className="text-xs text-rose-300 border border-rose-700/70 bg-rose-950/40 rounded-lg px-3 py-2">
            Error: {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => {
              setPatientId("P001");
              setText(diabetesNote);
            }}
            className="px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800"
          >
            Scenario 1: T2D + high HbA1c (P001)
          </button>
          <button
            onClick={() => {
              setPatientId("P001");
              setText(htnInfectionNote);
            }}
            className="px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800"
          >
            Scenario 2: HTN + infection + rash (P001)
          </button>
          <button
            onClick={() => {
              setPatientId("P002");
              setText(wellControlledNote);
            }}
            className="px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800"
          >
            Scenario 3: Well controlled T2D (P002)
          </button>
        </div>

        <div className="flex gap-3 items-center text-xs">
          <label className="text-slate-300">
            Patient ID:
            <input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="ml-2 px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-100 text-xs"
            />
          </label>
          <span className="text-slate-500">(e.g., P001, P002)</span>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-slate-300">Clinical note</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 p-3 font-mono resize-vertical"
          />
        </div>

        <button
          onClick={handleIngest}
          disabled={loading || !patientId.trim() || !text.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Ingesting…" : "Ingest note"}
        </button>

        {result && (
          <div className="mt-3 text-xs border border-emerald-700/70 bg-emerald-950/40 rounded-lg px-3 py-2 text-emerald-100 space-y-1">
            <div>
              <span className="font-semibold">Note ID:</span>{" "}
              <span className="font-mono break-all">{result.noteId}</span>
            </div>
            <div>
              <span className="font-semibold">Patient:</span> {result.patientId}
            </div>
            <div>
              <span className="font-semibold">Events (preview):</span>{" "}
              {result.eventsCreated}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <AnatomyPanel />
      </div>
    </div>
  );
};

export default Studio;
