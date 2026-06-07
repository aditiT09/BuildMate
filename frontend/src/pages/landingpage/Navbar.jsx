import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const C = {
  terra500: '#c4622d',
  terra700: '#8b3a1a',
  terra900: '#2c1810',
  sand200:  '#f5ede0',
}

export default function Navbar() {
  const [scrolled,    setScrolled]   = useState(false)
  const [mobileOpen,  setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'Mission',   href: '/#mission' },
    { label: 'Explore',   href: '/#cards'   },
    { label: 'Community', href: '/#contact' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      backgroundColor: scrolled ? 'rgba(245,237,224,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      boxShadow: scrolled ? '0 1px 0 rgba(196,98,45,0.1)' : 'none',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '18px 40px',
        maxWidth: '100%',
      }}>

        {/* LEFT — Logo */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 8 }}>
          <Link to="/" style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 22, fontWeight: 700,
            color: C.terra700, letterSpacing: '0.02em',
            textDecoration: 'none', userSelect: 'none',
          }}>
            BuildMate
          </Link>
        </div>

        {/* CENTER — Nav links (truly centered via grid) */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }} className="nav-links">
          {links.map(l => (
            <NavLink key={l.label} href={l.href}>{l.label}</NavLink>
          ))}
        </div>

        {/* RIGHT — Auth buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }} className="nav-links">
          <Link to="/login">
            <NavBtn variant="ghost">Log in</NavBtn>
          </Link>
          <Link to="/register">
            <NavBtn variant="solid">Sign up</NavBtn>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="nav-mobile-btn"
          style={{ background: 'none', border: 'none', padding: 8, cursor: 'pointer', display: 'none', gridColumn: 3, justifySelf: 'end' }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 2,
              background: C.terra700, borderRadius: 2,
              marginBottom: i < 2 ? 5 : 0,
              transition: 'all 0.25s',
              transform: mobileOpen
                ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                : i === 1 ? 'scaleX(0)'
                : 'rotate(-45deg) translate(5px, -5px)'
                : 'none',
              opacity: mobileOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(245,237,224,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(196,98,45,0.1)',
          padding: '20px 40px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href}
               onClick={() => setMobileOpen(false)}
               style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 500, color: 'rgba(44,24,16,0.7)', textDecoration: 'none' }}
            >{l.label}</a>
          ))}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
            <Link to="/login" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
              <button style={{ width: '100%', border: `1.5px solid ${C.terra500}`, color: C.terra500, background: 'transparent', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, padding: '10px 0', borderRadius: 9999, cursor: 'pointer' }}>Log in</button>
            </Link>
            <Link to="/register" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
              <button style={{ width: '100%', background: C.terra500, color: C.sand200, border: 'none', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, padding: '10px 0', borderRadius: 9999, cursor: 'pointer' }}>Sign up</button>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links      { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

function NavLink({ href, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 14, fontWeight: 500,
        color: hovered ? '#2c1810' : 'rgba(44,24,16,0.55)',
        textDecoration: 'none',
        transition: 'color 0.2s',
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </a>
  )
}

function NavBtn({ variant, children }) {
  const [hovered, setHovered] = useState(false)
  const isGhost = variant === 'ghost'

  const base = isGhost
    ? { background: 'transparent', color: '#c4622d', border: '1.5px solid #c4622d' }
    : { background: '#c4622d',     color: '#f5ede0', border: '1.5px solid #c4622d' }

  const hov = isGhost
    ? { background: '#c4622d', color: '#f5ede0' }
    : { background: '#8b3a1a', borderColor: '#8b3a1a' }

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 600, fontSize: 13,
        padding: '9px 22px',
        borderRadius: 9999,
        cursor: 'pointer',
        letterSpacing: '0.01em',
        transition: 'all 0.2s ease',
        ...(hovered ? { ...base, ...hov } : base),
      }}
    >
      {children}
    </button>
  )
}