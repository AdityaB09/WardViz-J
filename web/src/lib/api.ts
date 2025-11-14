const API = (window as any).__API_BASE__ || import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export async function ingest(patientId: string, text: string, ts?: string){
  const r = await fetch(`${API}/api/ingest`, { method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({patientId,text, ts}) });
  return r.json();
}
export async function storyboard(patientId: string){
  const r = await fetch(`${API}/api/storyboard/${encodeURIComponent(patientId)}`); return r.json();
}
export async function counterfactual(patientId: string, medLabel: string, cutoff: string){
  const r = await fetch(`${API}/api/counterfactual`, { method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({patientId, medLabel, cutoff}) }); return r.json();
}
export async function explain(eventId: string){
  const r = await fetch(`${API}/api/explain/${eventId}`); return r.json();
}
export async function guidelines(patientId: string){
  const r = await fetch(`${API}/api/guidelines/${encodeURIComponent(patientId)}`); return r.json();
}
export async function rewrite(text: string, grade: number){
  const r = await fetch(`${API}/api/rewrite`, { method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({text, grade}) }); return r.json();
}
