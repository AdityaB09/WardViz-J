import React from 'react'
import { Group } from '@visx/group'
import { scaleTime, scaleBand } from '@visx/scale'
import { LinearGradient } from '@visx/gradient'

type Event = { id:string, type:string, label:string, startTs:string, confidence:number }
export default function Timeline({events, uncertainty, onSelect}:{events:Event[], uncertainty:Record<string,number>, onSelect:(id:string)=>void}){
  const width=1000, height=260, pad=40
  const x = scaleTime({
    domain: [new Date(Math.min(...events.map(e=>+new Date(e.startTs)))||Date.now()-864e5*30),
             new Date(Math.max(...events.map(e=>+new Date(e.startTs)))||Date.now())],
    range: [pad, width-pad]
  })
  const rows = ['CONDITION','MEDICATION','LAB','PROCEDURE','RISK_SIGNAL']
  const y = scaleBand({domain: rows, range:[pad,height-pad], padding:0.3})
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="rounded-xl shadow border dark:border-zinc-800">
      <LinearGradient id="ribbon" from="#94a3b8" to="#334155" />
      <Group>
        {events.map((e,i)=>{
          const cx = x(new Date(e.startTs))||pad; const cy=(y(e.type)||0)+ (y.bandwidth()/2)
          const sigma = (uncertainty[e.id]||0.1)*24
          return (
            <g key={e.id}>
              <circle cx={cx} cy={cy} r={sigma} fill="url(#ribbon)" opacity={0.2}/>
              <circle cx={cx} cy={cy} r={6} className="fill-blue-500 dark:fill-sky-400 cursor-pointer" onClick={()=>onSelect(e.id)}/>
              <text x={cx+10} y={cy+4} className="text-[11px] fill-zinc-700 dark:fill-zinc-200">{e.label}</text>
            </g>
          )
        })}
        {rows.map((r,i)=>(
          <text key={r} x={8} y={(y(r)||0)+y.bandwidth()/2+3} className="text-[11px] fill-zinc-500">{r}</text>
        ))}
      </Group>
    </svg>
  )
}
