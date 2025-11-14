import React from 'react'
export default function PdfExportButton(){
  return (
    <button
      onClick={()=>window.print()}
      className="px-3 py-1 rounded-lg border dark:border-zinc-700">
      Export PDF
    </button>
  )
}
