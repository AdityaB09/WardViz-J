import React, { useEffect, useState } from 'react'
import { guidelines } from '../lib/api'
import GuidelineCards from '../components/GuidelineCards'

export default function Guidelines(){
  const [patientId,setPid]=useState('P001')
  const [cards,setCards]=useState<any[]>([])
  const load = async ()=> setCards((await guidelines(patientId)).cards || [])
  useEffect(()=>{ load() },[])
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <input className="border rounded px-2 py-1 dark:bg-zinc-900 dark:border-zinc-700" value={patientId} onChange={e=>setPid(e.target.value)} />
        <button onClick={load} className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800">Refresh</button>
      </div>
      <GuidelineCards cards={cards}/>
    </div>
  )
}
