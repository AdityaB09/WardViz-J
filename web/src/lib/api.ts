const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8080";

export type IngestResponse = {
  noteId: string;
  patientId: string;
  eventsCreated: number;
};

export type TimelineEvent = {
  id: string;
  patientId: string;
  label: string;
  category: string;
  section: string;
  timestamp: string;
};

export type EvidenceLink = {
  id: string;
  sourceEventId: string;
  targetEventId: string;
  relation: string;
};

export type StoryboardResponse = {
  events: TimelineEvent[];
  uncertainty: Record<string, number>;
  links: EvidenceLink[];
};

export type GuidelineCard = {
  id: string;
  title: string;
  status: "met" | "gap" | "consider" | string;
  rationale: string;
  severity: "high" | "medium" | "low" | string;
};

export type GuidelineResponse = {
  cards: GuidelineCard[];
};

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data.error || data.message || msg;
    } catch {
      // ignore parsing error
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function getHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  return handle<{ status: string; service: string }>(res);
}

export async function ingestNote(input: {
  patientId: string;
  text: string;
}): Promise<IngestResponse> {
  const res = await fetch(`${API_BASE}/api/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<IngestResponse>(res);
}

export async function getStoryboard(
  patientId: string
): Promise<StoryboardResponse> {
  const res = await fetch(`${API_BASE}/api/storyboard/${encodeURIComponent(patientId)}`);
  return handle<StoryboardResponse>(res);
}

export async function getGuidelines(
  patientId: string
): Promise<GuidelineResponse> {
  const res = await fetch(`${API_BASE}/api/guidelines/${encodeURIComponent(patientId)}`);
  return handle<GuidelineResponse>(res);
}
