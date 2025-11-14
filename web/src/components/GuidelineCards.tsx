import React from 'react'
type Card = { id:string, ruleId:string, status:'met'|'at-risk'|'violated', explanation:string }
export default function GuidelineCards({cards}:{cards:Card[]}){
  const color = (s:string)=> s==='met'?'bg-emerald-500': s==='at-risk'?'bg-amber-500':'bg-rose-500'
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {cards.map(c=>(
        <div key={c.id} className="rounded-xl border dark:border-zinc-800 p-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs rounded-full text-white ${color(c.status)}`}>{c.status}</span>
            <div className="font-semibold">{c.ruleId}</div>
          </div>
          <p className="mt-2 text-sm opacity-80">{c.explanation}</p>
        </div>
      ))}
    </div>
  )
}
