'use client'

import Lenis from "@studio-freight/lenis"
import { useEffect } from "react";

const Home = () => {

    useEffect(() => {
  const lenis = new Lenis()

  lenis.scrollTo(0, { immediate: true })

  let rafId
  const raf = (time) => {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }

  rafId = requestAnimationFrame(raf)

  return () => {
    cancelAnimationFrame(rafId)
    lenis.destroy()
  }
}, [])

  return (
    <div className='container'>
      <div className='page-header'>
        <h1>Timeless Form</h1>
      </div>
    </div>
  )
}

export default Home
