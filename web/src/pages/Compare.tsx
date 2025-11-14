import React, { useEffect, useState } from 'react'
import { storyboard } from '../lib/api'
import Timeline from '../components/Timeline'

export default function Compare(){
  const [pidA,setA]=useState('P001'), [pidB,setB]=useState('P002')
  const [a,setDa]=useState<any>({events:[],uncertainty:{}})
  const [b,setDb]=useState<any>({events:[],uncertainty:{}})
  const load = async ()=>{
    setDa(await storyboard(pidA)); setDb(await storyboard(pidB));
  }
  useEffect(()=>{ load() },[])
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <input className="border rounded px-2 py-1 dark:bg-zinc-900 dark:border-zinc-700" value={pidA} onChange={e=>setA(e.target.value)} />
        <input className="border rounded px-2 py-1 dark:bg-zinc-900 dark:border-zinc-700" value={pidB} onChange={e=>setB(e.target.value)} />
        <button onClick={load} className="ml-auto px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800">Compare</button>
      </div>
      <div>
        <div className="font-semibold mb-1">A</div>
        <Timeline events={a.events} uncertainty={a.uncertainty} onSelect={()=>{}}/>
      </div>
      <div>
        <div className="font-semibold mb-1">B</div>
        <Timeline events={b.events} uncertainty={b.uncertainty} onSelect={()=>{}}/>
      </div>
    </div>
  )
}
