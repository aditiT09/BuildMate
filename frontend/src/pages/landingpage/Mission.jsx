import { useEffect, useRef, useState } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const C = {
  terra500: '#c4622d',
  terra900: '#2c1810',
  sand200:  '#f5ede0',
  sand300:  '#edd5b8',
}

const CodeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#f5ede0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const RocketIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#f5ede0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2s-8 7-9 8a5 5 0 1 0-7 7c1 1 8-9 8-9" />
    <path d="M17 17s-2.5 2.5-6 2.5a1 1 0 0 1-.7-.3l-3-3a1 1 0 0 1-.3-.7c0-3.5 2.5-6 2.5-6" />
    <path d="M2 22l4-4M19 5l-1 1M18 5l1 1" />
  </svg>
);

const FileTextIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4622d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const UsersIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4622d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ZapIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4622d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

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

function ExplainerCard({ icon, title, body, delay }) {
  const [r, v] = useScrollReveal(0.15)
  return (
    <div ref={r} style={{
      borderRadius: 20, padding: 28,
      background: C.sand300,
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      <span style={{ display: 'block', marginBottom: 16 }}>{icon}</span>
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
          <div style={{ color: C.sand200, marginBottom: 28, display: 'inline-block' }}>{CodeIcon}</div>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, lineHeight: 1.05, marginBottom: 16, fontSize: 'clamp(32px,3vw,44px)', color: C.sand200 }}>
            Devs &amp;<br />Designers
          </h3>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: 'rgba(245,237,224,0.6)', maxWidth: 340 }}>
            Your resume needs shipped projects, not just certification links. Find active student and open-source projects where you can contribute, learn side-by-side, and make your portfolio stand out.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
            {['Real work', 'Resume-ready', 'Ship fast'].map(t => <Pill key={t} label={t} />)}
          </div>
          <div ref={b1}><AnimBar visible={bar1Visible} pct={74} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: '"DM Sans", sans-serif' }}>
            <span>Talent pool growing</span><span>74%</span>
          </div>
        </MissionCard>
 
        <MissionCard bg={C.terra500} delay={150}>
          <span style={bigNumStyle}>02</span>
          <div style={{ color: C.sand200, marginBottom: 28, display: 'inline-block' }}>{RocketIcon}</div>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, lineHeight: 1.05, marginBottom: 16, fontSize: 'clamp(32px,3vw,44px)', color: C.sand200 }}>
            Builders &amp;<br />Founders
          </h3>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: 'rgba(245,237,224,0.65)', maxWidth: 340 }}>
            You have the ideas; we have the hands. Post your build, set your tech stack, and find dedicated teammates ready to contribute and help you ship from day one.
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
          { icon: FileTextIcon, title: 'Build your resume', body: 'Every project you contribute to becomes a portfolio piece with real commits and shipped features.', delay: 0   },
          { icon: UsersIcon, title: 'No cold DMs',   body: 'Apply through structured project pages. Get context before you commit. No cringe intros.',         delay: 100 },
          { icon: ZapIcon, title: 'Ship in weeks', body: 'Pre-vetted teammates, async-friendly workflows, and momentum from day one.',                        delay: 200 },
        ].map(p => <ExplainerCard key={p.title} {...p} />)}
      </div>

    </section>
  )
}