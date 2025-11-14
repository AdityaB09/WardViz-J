import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Studio from './pages/Studio'
import Storyboard from './pages/Storyboard'
import Guidelines from './pages/Guidelines'
import Compare from './pages/Compare'
import ThemeToggle from './components/ThemeToggle'

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
            <div className="font-semibold text-lg">WardViz-J</div>
            <nav className="flex gap-3">
              {[
                ['Studio','/studio'],
                ['Storyboard','/storyboard'],
                ['Guidelines','/guidelines'],
                ['Compare','/compare']
              ].map(([label,href])=>
                <NavLink key={href} to={href} className={({isActive})=>
                  `px-3 py-1 rounded-full ${isActive?'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900':'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`
                }>{label}</NavLink>
              )}
            </nav>
            <div className="ml-auto"><ThemeToggle/></div>
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          <Routes>
            <Route path="/" element={<Studio/>}/>
            <Route path="/studio" element={<Studio/>}/>
            <Route path="/storyboard" element={<Storyboard/>}/>
            <Route path="/guidelines" element={<Guidelines/>}/>
            <Route path="/compare" element={<Compare/>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
