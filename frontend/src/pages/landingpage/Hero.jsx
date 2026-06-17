import { Link } from 'react-router-dom'

const C = {
  terra500: '#c4622d',
  terra800: '#6b2c12',
  terra900: '#2c1810',
  sand400:  '#d4a882',
  sand200:  '#f5ede0',
}

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '112px 24px 80px',
      overflow: 'hidden',
    }}>
      {/* Atmospheric blobs */}
      <div style={{
        position: 'absolute', top: -120, right: -180,
        width: 600, height: 600, borderRadius: '50%',
        background: 'rgba(217,107,58,0.18)',
        filter: 'blur(100px)',
        animation: 'pulse2 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -120,
        width: 420, height: 420, borderRadius: '50%',
        background: 'rgba(212,168,130,0.25)',
        filter: 'blur(90px)',
        animation: 'pulse2 4s ease-in-out infinite',
        animationDelay: '1.8s',
        pointerEvents: 'none',
      }} />

      {/* Eyebrow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 28,
        animation: 'fadeUp 0.8s ease 0.1s forwards',
        opacity: 0,
      }}>
        <span style={{ width: 32, height: 1, background: C.terra500, display: 'block' }} />
        <span style={{
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: C.terra500, fontFamily: '"DM Sans", sans-serif',
        }}>For builders, by builders</span>
        <span style={{ width: 32, height: 1, background: C.terra500, display: 'block' }} />
      </div>

      {/* Tagline */}
      <h1 style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: 'clamp(52px, 8.5vw, 128px)',
        fontWeight: 700,
        lineHeight: 0.93,
        textAlign: 'center',
        color: C.terra900,
        maxWidth: 860,
        marginBottom: 16,
        animation: 'fadeUp 0.8s ease 0.2s forwards',
        opacity: 0,
      }}>
        Find&nbsp;teammates<br />
        <em style={{ color: C.terra500, fontStyle: 'normal' }}>minus</em> the&nbsp;
        <span style={{ position: 'relative', display: 'inline-block', color: C.sand400 }}>
          awkward
          <span style={{
            position: 'absolute', left: 0, top: '54%',
            width: '100%', height: 5,
            background: C.terra800, borderRadius: 3,
          }} />
        </span>
        <br />networking
      </h1>

      {/* Subtitle */}
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        textAlign: 'center', fontSize: 17,
        color: 'rgba(44,24,16,0.55)', fontWeight: 300,
        maxWidth: 440, marginTop: 28, marginBottom: 40,
        lineHeight: 1.65,
        animation: 'fadeUp 0.8s ease 0.35s forwards',
        opacity: 0,
      }}>
        Match with devs, designers &amp; founders. Build projects that matter — together,
        without the cringe of cold DMs.
      </p>

      {/* CTAs */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center',
        animation: 'fadeUp 0.8s ease 0.5s forwards',
        opacity: 0,
      }}>
        <Link to="/register">
          <HoverBtn
            base={{ background: C.terra500, color: C.sand200, border: 'none' }}
            hover={{ background: C.terra800, transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(196,98,45,0.35)' }}
          >
            Start Building →
          </HoverBtn>
        </Link>
        <a href="#cards">
          <HoverBtn
            base={{ background: 'transparent', color: C.terra900, border: '1.5px solid rgba(44,24,16,0.25)' }}
            hover={{ borderColor: C.terra900, background: 'rgba(44,24,16,0.05)' }}
          >
            Browse Projects
          </HoverBtn>
        </a>
      </div>

      {/* Ticker */}
      <div style={{
        marginTop: 64, width: '100%', overflow: 'hidden',
        animation: 'fadeUp 0.8s ease 0.7s forwards', opacity: 0,
      }}>
        <div style={{
          display: 'flex', whiteSpace: 'nowrap', gap: 32,
          animation: 'ticker 25s linear infinite',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 14, fontWeight: 500,
          color: 'rgba(44,24,16,0.22)',
          userSelect: 'none',
        }}>
          {Array(2).fill([
            '✦ 2,400+ builders', '✦ 580+ live projects', '✦ 12 countries',
            '✦ React · Node · Python · Figma', '✦ Launch in weeks not months',
            '✦ Real CVs Real ships', '✦ No awkward networking',
          ]).flat().map((t, i) => (
            <span key={i} style={{ display: 'inline-block' }}>{t}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp  { from { opacity:0; transform:translateY(40px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse2  { 0%,100%{ opacity:.4; transform:scale(1) } 50%{ opacity:.7; transform:scale(1.05) } }
        @keyframes ticker  { from { transform:translateX(0) } to { transform:translateX(-50%) } }
      `}</style>
    </section>
  )
}

function HoverBtn({ base, hover, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 600, fontSize: 16,
        padding: '15px 36px', borderRadius: 9999,
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        ...(hovered ? { ...base, ...hover } : base),
      }}
    >
      {children}
    </button>
  )
}

// useState needed for HoverBtn
import { useState } from 'react'