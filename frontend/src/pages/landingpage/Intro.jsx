import { useEffect, useState } from 'react'

const LETTERS = ['B','u','i','l','d','M','a','t','e']

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState(1)   // 1=dark  2=cream  3=fading  4=gone
  const [shown, setShown] = useState([])

  useEffect(() => {
    // Reveal letters one by one
    LETTERS.forEach((_, i) => {
      setTimeout(() => setShown(prev => [...prev, i]), 420 + i * 110)
    })
    // Flip to cream bg
    setTimeout(() => setPhase(2), 1900)
    // Start fading out
    setTimeout(() => setPhase(3), 2800)
    // Fully gone + notify parent
    setTimeout(() => { setPhase(4); onDone?.() }, 3400)
  }, [])

  if (phase === 4) return null

  const bgColor = phase === 1 ? '#1a0c06' : '#f5ede0'
  const letterColor = phase === 1 ? '#c4622d' : '#8b3a1a'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        opacity: phase === 3 ? 0 : 1,
        transition: phase === 3
          ? 'opacity 0.55s ease'
          : 'background-color 0.75s ease',
        pointerEvents: phase === 3 ? 'none' : 'all',
      }}
    >
      <div style={{
        display: 'flex',
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: 'clamp(52px, 9vw, 118px)',
        fontWeight: 700,
        letterSpacing: '0.04em',
      }}>
        {LETTERS.map((l, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: letterColor,
              opacity: shown.includes(i) ? 1 : 0,
              transform: shown.includes(i)
                ? 'translateY(0) rotate(0deg)'
                : 'translateY(38px) rotate(4deg)',
              transition: 'opacity 0.35s ease, transform 0.38s ease, color 0.6s ease',
            }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}