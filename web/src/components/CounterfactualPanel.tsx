import React, { useState } from 'react'
export default function CounterfactualPanel({onApply}:{onApply:(cutoff:string)=>void}){
  const [days,setDays]=useState(14)
  const cutoff = new Date(Date.now()-days*86400000).toISOString()
  return (
    <div className="rounded-xl border dark:border-zinc-800 p-3 flex items-center gap-3">
      <div className="font-semibold">Counterfactual: Stop Metformin earlier</div>
      <input type="range" min={1} max={120} value={days} onChange={e=>setDays(+e.target.value)} />
      <div className="text-sm">{days} days earlier</div>
      <button onClick={()=>onApply(cutoff)} className="ml-auto px-3 py-1 rounded-lg bg-blue-600 text-white">Apply</button>
    </div>
  )
}
