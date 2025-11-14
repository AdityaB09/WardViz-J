import React from 'react'
export default function ThemeToggle(){
  return (
    <button
      onClick={()=>document.documentElement.classList.toggle('dark')}
      className="px-3 py-1 rounded-full border dark:border-zinc-700">🌓</button>
  )
}
