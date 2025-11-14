import React, { useEffect, useRef } from 'react'
import cytoscape, { ElementDefinition } from 'cytoscape'

export default function EvidenceGraph({elements,onClick}:{elements:ElementDefinition[], onClick:(id:string)=>void}){
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!ref.current) return
    const cy = cytoscape({
      container: ref.current,
      elements,
      style: [
        { selector: 'node', style: { 'label':'data(label)', 'font-size':'10px','background-color':'#0ea5e9','color':'#111827' } },
        { selector: 'edge[relation="SUPPORTS"]', style: {'line-color':'#22c55e', 'target-arrow-shape':'triangle','target-arrow-color':'#22c55e'} },
        { selector: 'edge[relation="CONTRADICTS"]', style: {'line-color':'#ef4444', 'target-arrow-shape':'triangle','target-arrow-color':'#ef4444'} }
      ],
      layout: { name:'cose', animate:true }
    })
    cy.on('tap','node', (evt)=> onClick((evt.target as any).id()))
    return ()=> cy.destroy()
  },[elements])
  return <div className="w-full h-72 rounded-xl border dark:border-zinc-800" ref={ref}/>
}
