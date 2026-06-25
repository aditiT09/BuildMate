import { useState } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const C = {
  terra300:  '#e8845a',
  terra500:  '#c4622d',
  terra700:  '#8b3a1a',
  terra800:  '#6b2c12',
  terra900:  '#2c1810',
  sand200:   '#f5ede0',
  sand300:   '#edd5b8',
  olive400:  '#a3b576',
}

function FloatingPill({ label, style, delay }) {
  return (
    <span style={{
      position: 'absolute',
      fontSize: 11, fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      padding: '8px 16px', borderRadius: 9999,
      backdropFilter: 'blur(8px)',
      animation: `float 3.5s ease-in-out ${delay}s infinite`,
      fontFamily: '"DM Sans", sans-serif',
      ...style,
    }}>
      {label}
    </span>
  )
}

function SmallCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false)
  const isDark = title.includes('CREATE')
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        borderRadius: 24,
        padding: '32px 28px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: isDark ? C.terra900 : C.sand300,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.15)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(196,98,45,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, marginBottom: 18,
      }}>
        {icon}
      </div>

      <h3 style={{
        fontFamily: '"Melody by W.", "Melody", sans-serif',
        fontSize: 26, fontWeight: 800,
        textTransform: 'uppercase', lineHeight: 1,
        marginBottom: 10,
        color: isDark ? C.sand200 : C.terra900,
      }}>
        {title}
      </h3>

      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 14, fontWeight: 300, lineHeight: 1.65,
        color: isDark ? 'rgba(245,237,224,0.55)' : 'rgba(44,24,16,0.65)',
        flex: 1,
      }}>
        {desc}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <span style={{
          width: 38, height: 38, borderRadius: '50%',
          background: C.terra500,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 18, cursor: 'pointer',
          transition: 'background 0.2s',
        }}>→</span>
      </div>
    </div>
  )
}

export default function Cards() {
  const [ref, visible] = useScrollReveal(0.1)

  return (
    <section id="cards" style={{ padding: '0 20px 96px', maxWidth: 1200, margin: '0 auto' }} ref={ref}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.65fr 1fr',
        gap: 18,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>

        {/* ── Big Discover Card ── */}
        <div style={{
          borderRadius: 28, overflow: 'hidden',
          position: 'relative', minHeight: 520,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          background: C.terra500,
          border: '4px solid #7A4854',
        }}>
          {/* Gradient bg */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${C.terra800} 0%, ${C.terra500} 50%, ${C.terra300} 100%)`,
          }}>
            {/* Dot grid */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />
            {/* Emoji bg */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 140, opacity: 0.1, filter: 'blur(2px)',
              userSelect: 'none', letterSpacing: -10,
            }}>
              💡
            </div>
          </div>

          {/* Pills */}
          <FloatingPill label="🔥 Trending"   style={{ top: 28, right: 28, background: 'rgba(255,255,255,0.18)', color: 'white' }} delay={0} />
          <FloatingPill label="💡 AI & Web3"  style={{ top: 72, right: 88, background: C.olive400, color: C.terra900 }} delay={0.7} />
          <FloatingPill label="✦ Open Collab" style={{ top: 120, right: 18, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }} delay={1.3} />

          {/* Content overlay */}
          <div style={{
            position: 'relative', zIndex: 2,
            padding: '0 36px 40px',
            background: 'linear-gradient(0deg, rgba(28,10,4,0.88) 0%, transparent 100%)',
          }}>
            <span style={{
              display: 'inline-block',
              padding: '5px 14px', marginBottom: 14,
              borderRadius: 9999,
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.75)',
              background: 'rgba(255,255,255,0.15)',
              fontFamily: '"DM Sans", sans-serif',
            }}>✦ Explore</span>

            <h2 style={{
              fontFamily: '"Melody by W.", "Melody", sans-serif',
              fontSize: 'clamp(40px, 4.5vw, 66px)',
              fontWeight: 800,
              textTransform: 'uppercase',
              lineHeight: 0.95,
              color: C.sand200,
              marginBottom: 12,
              letterSpacing: '-0.02em',
            }}>
              Discover<br />Projects
            </h2>

            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 15, fontWeight: 300,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 550, lineHeight: 1.65,
            }}>
              Explore a curated feed of live projects seeking developers, designers, and creators. Apply to open roles in one tap, join a collaborative workspace, and start shipping today.
            </p>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <SmallCard
            icon="📁"
            title={"CREATE\nPROJECT"}
            desc="Post your idea, set roles, and let the right people come to you. Your vision, your team."
          />
          <SmallCard
            icon="🙋‍♂️"
            title={"COUNT ME\nIN!"}
            desc="Look through open projects where teams are excited to welcome new contributors."
          />
        </div>

      </div>

      <style>{`
        @keyframes float { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }
      `}</style>
    </section>
  )
}