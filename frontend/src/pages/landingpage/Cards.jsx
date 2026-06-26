import { useState } from 'react'
import { Link } from 'react-router-dom'
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

const TrendingIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const CpuIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

const StarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FolderIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const UserPlusIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const LightbulbIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

function FloatingPill({ icon, label, style, delay }) {
  return (
    <span style={{
      position: 'absolute',
      fontSize: 11, fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      padding: '8px 16px', borderRadius: 9999,
      backdropFilter: 'blur(8px)',
      animation: `float 3.5s ease-in-out ${delay}s infinite`,
      fontFamily: '"DM Sans", sans-serif',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      ...style,
    }}>
      {icon}
      <span>{label}</span>
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
  const [bigHovered, setBigHovered] = useState(false)

  return (
    <section id="cards" style={{ padding: '0 20px 96px', maxWidth: 1200, margin: '0 auto' }} ref={ref}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>

        {/* ── Big Discover Card ── */}
        <Link to="/register" style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
          <div
            onMouseEnter={() => setBigHovered(true)}
            onMouseLeave={() => setBigHovered(false)}
            style={{
              borderRadius: 28, overflow: 'hidden',
              position: 'relative', minHeight: 340,
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              background: C.terra500,
              border: '2px solid #7A4854',
              cursor: 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              transform: bigHovered ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: bigHovered ? '0 20px 48px rgba(0,0,0,0.15)' : 'none',
            }}
          >
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
            {/* Icon bg */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFF8F0', opacity: 0.06, filter: 'blur(1px)',
              userSelect: 'none', pointerEvents: 'none',
            }}>
              {LightbulbIcon}
            </div>
          </div>

          {/* Pills */}
          <FloatingPill icon={TrendingIcon} label="Trending"   style={{ top: 28, right: 28, background: 'rgba(255,255,255,0.18)', color: 'white' }} delay={0} />
          <FloatingPill icon={CpuIcon} label="AI & Web3"  style={{ top: 72, right: 88, background: C.olive400, color: C.terra900 }} delay={0.7} />
          <FloatingPill icon={StarIcon} label="Open Collab" style={{ top: 120, right: 18, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }} delay={1.3} />

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
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 800,
              textTransform: 'uppercase',
              lineHeight: 1,
              color: C.sand200,
              marginBottom: 8,
              letterSpacing: '-0.02em',
            }}>
              Discover Projects
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
      </Link>

        {/* ── Small Cards Row ── */}
        <div className="cards-bottom-row" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
        }}>
          <SmallCard
            icon={FolderIcon}
            title={"CREATE\nPROJECT"}
            desc="Post your idea, set roles, and let the right people come to you. Your vision, your team."
          />
          <SmallCard
            icon={UserPlusIcon}
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