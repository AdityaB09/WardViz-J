import React, { useState } from 'react'
import { ingest } from '../lib/api'

export default function Studio(){
  const [patientId,setPid]=useState('P001')
  const [text,setText]=useState('')
  const loadDemo = async (which:'t2d'|'htn'|'abx')=>{
    const f = await fetch(`/public/demo/${which}_episode.json`).then(r=>r.json())
    setText(f.text)
  }
  const submit = async ()=>{
    const r = await ingest(patientId, text)
    alert(`Saved note ${r.noteId}. Events: ${r.eventsCreated}`)
  }
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <input className="border rounded px-2 py-1 dark:bg-zinc-900 dark:border-zinc-700" value={patientId} onChange={e=>setPid(e.target.value)} />
        <button onClick={()=>loadDemo('t2d')} className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800">Load Demo T2D</button>
        <button onClick={()=>loadDemo('htn')} className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800">Load Demo HTN</button>
        <button onClick={()=>loadDemo('abx')} className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800">Load Demo ABX+Rash</button>
        <button onClick={submit} className="ml-auto px-3 py-1 rounded bg-blue-600 text-white">Parse & Save</button>
      </div>
      <textarea className="w-full h-[50vh] border rounded p-3 dark:bg-zinc-900 dark:border-zinc-700" value={text} onChange={e=>setText(e.target.value)}/>
    </div>
  )
}
