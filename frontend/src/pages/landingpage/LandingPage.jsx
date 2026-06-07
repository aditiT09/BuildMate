import { useState } from 'react'
import Navbar  from './Navbar'
import Intro   from './Intro'
import Hero    from './Hero'
import Mission from './Mission'
import Cards   from './Cards'
import Contact from './Contact'

export default function LandingPage() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <>
      {/* Intro plays first; calls onDone when finished */}
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}

      {/* Main page fades in once intro is done */}
      <div style={{ opacity: introDone ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <Navbar />
        <Hero />
        <Cards />
        <Mission />
        <Contact />
      </div>
    </>
  )
}