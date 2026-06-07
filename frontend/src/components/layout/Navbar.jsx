import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const C = {
  terra500: '#c4622d',
  terra700: '#8b3a1a',
  terra900: '#2c1810',
  sand200:  '#f5ede0',
  bg:       '#f5ede0',
}

export default function Navbar() {
  const [scrolled,    setScrolled]   = useState(false)
  const [mobileOpen,  setMobileOpen] = useState(false)
  const [loginHover,  setLoginHover] = useState(false)
  const [signupHover, setSignupHover]= useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    transition: 'all 0.3s ease',
    backgroundColor: scrolled ? 'rgba(245,237,224,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    boxShadow: scrolled ? '0 1px 0 rgba(196,98,45,0.1)' : 'none',
  }

  const links = [
    { label: 'Mission',   href: '/#mission' },
    { label: 'Explore',   href: '/#cards'   },
    { label: 'Community', href: '/#contact' },
  ]

  return (
    <nav style={navStyle}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 24, fontWeight: 700,
          color: C.terra700, letterSpacing: '0.02em',
          textDecoration: 'none', userSelect: 'none',
        }}>
          BuildMate
        </Link>

        {/* Center links */}
        <div style={{
          display: 'flex', gap: 36,
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        }}
          className="hidden-mobile"
        >
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, fontWeight: 500,
              color: 'rgba(44,24,16,0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = C.terra900}
              onMouseLeave={e => e.target.style.color = 'rgba(44,24,16,0.6)'}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="hidden-mobile">
          <Link to="/login">
            <button
              onMouseEnter={() => setLoginHover(true)}
              onMouseLeave={() => setLoginHover(false)}
              style={{
                border: `1.5px solid ${C.terra500}`,
                color: loginHover ? C.sand200 : C.terra500,
                background: loginHover ? C.terra500 : 'transparent',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 500, fontSize: 14,
                padding: '8px 20px', borderRadius: 9999,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >Log in</button>
          </Link>
          <Link to="/register">
            <button
              onMouseEnter={() => setSignupHover(true)}
              onMouseLeave={() => setSignupHover(false)}
              style={{
                background: signupHover ? C.terra700 : C.terra500,
                color: C.sand200, border: 'none',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 500, fontSize: 14,
                padding: '8px 20px', borderRadius: 9999,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >Sign up free</button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{ background: 'none', border: 'none', padding: 8, cursor: 'pointer', display: 'none' }}
          className="show-mobile"
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: 24, height: 2,
              background: C.terra700, borderRadius: 2,
              marginBottom: i < 2 ? 5 : 0,
              transition: 'all 0.25s',
              transform: mobileOpen
                ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                : i === 1 ? 'scaleX(0)'
                : 'rotate(-45deg) translate(5px,-5px)'
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
          padding: '20px 24px',
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
              <button style={{ width: '100%', border: `1.5px solid ${C.terra500}`, color: C.terra500, background: 'transparent', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, padding: '8px 0', borderRadius: 9999, cursor: 'pointer' }}>Log in</button>
            </Link>
            <Link to="/register" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
              <button style={{ width: '100%', background: C.terra500, color: C.sand200, border: 'none', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, padding: '8px 0', borderRadius: 9999, cursor: 'pointer' }}>Sign up</button>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
        }
      `}</style>
    </nav>
  )
}