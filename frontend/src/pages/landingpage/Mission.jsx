import { useEffect, useRef, useState } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const C = {
  terra500: '#c4622d',
  terra900: '#2c1810',
  sand200:  '#f5ede0',
  sand300:  '#edd5b8',
}

function AnimBar({ visible, pct }) {
  return (
    <div style={{ height: 4, borderRadius: 2, marginTop: 32, overflow: 'hidden', background: 'rgba(255,255,255,0.12)' }}>
      <div style={{
        height: '100%', borderRadius: 2,
        background: 'rgba(255,255,255,0.45)',
        width: visible ? `${pct}%` : '0%',
        transition: 'width 2.2s ease',
      }} />
    </div>
  )
}

function ExplainerCard({ emoji, title, body, delay }) {
  const [r, v] = useScrollReveal(0.15)
  return (
    <div ref={r} style={{
      borderRadius: 20, padding: 28,
      background: C.sand300,
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      <span style={{ fontSize: 32, display: 'block', marginBottom: 16 }}>{emoji}</span>
      <h4 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 8, color: C.terra900 }}>{title}</h4>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 14, lineHeight: 1.65, color: 'rgba(44,24,16,0.6)' }}>{body}</p>
    </div>
  )
}

function MissionCard({ delay, bg, children }) {
  const [ref, visible] = useScrollReveal(0.15)
  return (
    <div ref={ref} style={{
      position: 'relative', borderRadius: 24, padding: 48, overflow: 'hidden',
      background: bg,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(48px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

const Pill = ({ label, light }) => (
  <span style={{
    padding: '6px 16px', borderRadius: 9999,
    fontSize: 11, fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    fontFamily: '"DM Sans", sans-serif',
    background: light ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
    color: light ? 'white' : 'rgba(255,255,255,0.75)',
  }}>{label}</span>
)

export default function Mission() {
  const [labelRef, labelVisible] = useScrollReveal(0.1)
  const [bar1Visible, setBar1] = useState(false)
  const [bar2Visible, setBar2] = useState(false)
  const b1 = useRef()
  const b2 = useRef()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBar1(true) }, { threshold: 0.3 })
    if (b1.current) obs.observe(b1.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBar2(true) }, { threshold: 0.3 })
    if (b2.current) obs.observe(b2.current)
    return () => obs.disconnect()
  }, [])

  const bigNumStyle = {
    position: 'absolute', right: -10, top: -12,
    fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: 120,
    color: 'rgba(255,255,255,0.06)', lineHeight: 1,
    userSelect: 'none', pointerEvents: 'none',
  }

  return (
    <section id="mission" style={{ padding: '0 20px 112px', maxWidth: 1200, margin: '0 auto' }}>

      <div ref={labelRef} style={{
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
        textTransform: 'uppercase', color: C.terra500,
        fontFamily: '"DM Sans", sans-serif', marginBottom: 56,
        opacity: labelVisible ? 1 : 0,
        transform: labelVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        Why BuildMate exists
        <span style={{ flex: 1, height: 1, background: 'rgba(196,98,45,0.3)', display: 'block' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        <MissionCard bg={C.terra900} delay={0}>
          <span style={bigNumStyle}>01</span>
          <span style={{ fontSize: 44, display: 'block', marginBottom: 28 }}>👩‍💻</span>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, lineHeight: 1.05, marginBottom: 16, fontSize: 'clamp(32px,3vw,44px)', color: C.sand200 }}>
            Devs &amp;<br />Designers
          </h3>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: 'rgba(245,237,224,0.6)', maxWidth: 340 }}>
            You want real experience for your CV — not more tutorials. BuildMate connects you with live projects where your code ships and your name goes in the credits.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
            {['Real work', 'CV-ready', 'Ship fast'].map(t => <Pill key={t} label={t} />)}
          </div>
          <div ref={b1}><AnimBar visible={bar1Visible} pct={74} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: '"DM Sans", sans-serif' }}>
            <span>Talent pool growing</span><span>74%</span>
          </div>
        </MissionCard>

        <MissionCard bg={C.terra500} delay={150}>
          <span style={bigNumStyle}>02</span>
          <span style={{ fontSize: 44, display: 'block', marginBottom: 28 }}>🚀</span>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, lineHeight: 1.05, marginBottom: 16, fontSize: 'clamp(32px,3vw,44px)', color: C.sand200 }}>
            Builders &amp;<br />Founders
          </h3>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: 'rgba(245,237,224,0.65)', maxWidth: 340 }}>
            You have the vision but need the hands. Post your project and get matched with passionate contributors who are invested from day one — not just freelancers chasing invoices.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
            {['Find talent', 'Async-ready', 'Move fast'].map(t => <Pill key={t} label={t} light />)}
          </div>
          <div ref={b2}><AnimBar visible={bar2Visible} pct={88} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Sans", sans-serif' }}>
            <span>Projects matched</span><span>88%</span>
          </div>
        </MissionCard>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginTop: 18 }}>
        {[
          { emoji: '📄', title: 'Build your CV', body: 'Every project you contribute to becomes a portfolio piece with real commits and shipped features.', delay: 0   },
          { emoji: '🤝', title: 'No cold DMs',   body: 'Apply through structured project pages. Get context before you commit. No cringe intros.',         delay: 100 },
          { emoji: '⚡', title: 'Ship in weeks', body: 'Pre-vetted teammates, async-friendly workflows, and momentum from day one.',                        delay: 200 },
        ].map(p => <ExplainerCard key={p.title} {...p} />)}
      </div>

    </section>
  )
}