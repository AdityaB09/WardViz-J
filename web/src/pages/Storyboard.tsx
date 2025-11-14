import React, { useEffect, useMemo, useState } from 'react'
import { storyboard, counterfactual, explain, rewrite } from '../lib/api'
import Timeline from '../components/Timeline'
import EvidenceGraph from '../components/EvidenceGraph'
import CounterfactualPanel from '../components/CounterfactualPanel'
import AnatomyPanel from '../components/AnatomyPanel'
import PdfExportButton from '../components/PdfExportButton'
import VoiceoverButton from '../components/VoiceoverButton'

export default function Storyboard(){
  const [patientId,setPid]=useState('P001')
  const [data,setData]=useState<{events:any[], uncertainty:Record<string,number>, links:any[]}>({events:[],uncertainty:{},links:[]})
  const [selected,setSelected]=useState<any|null>(null)
  const [grade,setGrade]=useState(10)
  const [summary,setSummary]=useState('')
  const load = async ()=> setData(await storyboard(patientId))
  useEffect(()=>{ load() },[])

  const elements = useMemo(()=>[
    ...data.events.map(e=>({ data:{ id:e.id, label:e.label } })),
    ...data.links.map((l:any)=>({ data:{ id:`${l.srcEventId}->${l.dstEventId}`, source:l.srcEventId, target:l.dstEventId, relation:l.relation } }))
  ],[data])

  const onSelect = async (id:string)=>{
    const ex = await explain(id); setSelected(ex)
  }

  const onCounter = async (cutoff:string)=>{
    const r = await counterfactual(patientId, 'metformin', cutoff)
    setData({ events:r.updatedEvents, uncertainty:{}, links:[] })
  }

  useEffect(()=>{
    const text = data.events.slice(0,6).map(e=>`${e.type}: ${e.label} on ${new Date(e.startTs).toDateString()}.`).join(' ')
    rewrite(text, grade).then(r=>setSummary(r.text))
  },[data, grade])

  const organ = selected?.label?.toLowerCase().includes('hba1c') ? 'pancreas' :
                selected?.label?.toLowerCase().includes('lisinopril') ? 'heart' :
                selected?.label?.toLowerCase().includes('rash') ? 'skin' : undefined

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <input className="border rounded px-2 py-1 dark:bg-zinc-900 dark:border-zinc-700" value={patientId} onChange={e=>setPid(e.target.value)} />
        <button onClick={load} className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800">Refresh</button>
        <div className="ml-auto flex gap-2 items-center">
          <label className="text-sm opacity-70">Reading Grade</label>
          <input type="range" min={8} max={12} value={grade} onChange={e=>setGrade(+e.target.value)} />
          <PdfExportButton/>
          <VoiceoverButton text={summary}/>
        </div>
      </div>

      <CounterfactualPanel onApply={onCounter}/>
      <Timeline events={data.events} uncertainty={data.uncertainty} onSelect={onSelect}/>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <EvidenceGraph elements={elements} onClick={id=>onSelect(id)} />
          {selected && (
            <div className="mt-3 rounded-xl border dark:border-zinc-800 p-3">
              <div className="font-semibold">{selected.label}</div>
              <div className="text-sm opacity-70">confidence: {selected.confidence?.toFixed?.(2)}</div>
              <pre className="text-xs mt-2 whitespace-pre-wrap">{JSON.stringify(selected.spans,null,2)}</pre>
            </div>
          )}
        </div>
        <div>
          <AnatomyPanel highlight={organ as any}/>
          <div className="mt-3 text-sm opacity-80">{summary}</div>
        </div>
      </div>
    </div>
  )
}
