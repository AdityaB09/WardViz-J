import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AnatomyPanel({highlight}:{highlight?:'pancreas'|'heart'|'skin' }){
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const el = ref.current!; const w=260, h=180
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true})
    renderer.setSize(w,h); el.innerHTML=''; el.appendChild(renderer.domElement)
    const geo = new THREE.SphereGeometry(1,32,32)
    const color = highlight==='heart'?0xff5555:highlight==='pancreas'?0xffcc66: highlight==='skin'?0xffaa99: 0x8ab4f8
    const mat = new THREE.MeshStandardMaterial({color})
    const mesh = new THREE.Mesh(geo, mat); scene.add(mesh)
    const light = new THREE.PointLight(0xffffff, 1.2); light.position.set(2,2,3); scene.add(light)
    camera.position.z=3
    let f=0; const tick = ()=>{ f+=0.01; mesh.rotation.y=f; renderer.render(scene,camera); requestAnimationFrame(tick) }
    tick()
    return ()=>renderer.dispose()
  },[highlight])
  return <div className="w-[260px] h-[180px] rounded-xl border dark:border-zinc-800" ref={ref}/>
}
