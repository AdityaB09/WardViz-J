import React, { useState } from 'react'
export default function VoiceoverButton({text}:{text:string}){
  const [speaking,setSpeaking]=useState(false)
  const speak = ()=>{
    const u = new SpeechSynthesisUtterance(text)
    u.onend=()=>setSpeaking(false); setSpeaking(true)
    speechSynthesis.speak(u)
  }
  return <button disabled={speaking} onClick={speak} className="px-3 py-1 rounded-lg border">{speaking?'Speaking…':'Voiceover'}</button>
}
