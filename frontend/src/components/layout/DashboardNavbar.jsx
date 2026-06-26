import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'


const C = {
  brand:    '#E35336',
  brandDk:  '#B8391F',
  orange:   '#F4A460',
  dark:     '#2B1B12',
  dark2:    '#4A372D',
  muted:    '#8C776A',
  border:   '#E9DDD0',
  bg:       '#FFF8F0',
  surface:  '#FDFBF7',
}

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const DiscoverIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ProjectsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
)

const ApplicationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const NAV_LINKS = [
  { label: 'Dashboard',    href: '/dashboard',    icon: <DashboardIcon /> },
  { label: 'Discover',     href: '/discover',     icon: <DiscoverIcon /> },
  { label: 'My Projects',  href: '/my-projects',  icon: <ProjectsIcon /> },
  { label: 'Applications', href: '/applications', icon: <ApplicationsIcon /> },
]

export default function DashboardNavbar() {
  const { user, logout }     = useAuth()
  const location             = useLocation()
  const navigate             = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [mobOpen,  setMobOpen]  = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const isActive = (href) => location.pathname === href

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(255,248,240,0.95)' : C.bg,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
        transition: 'all 0.25s ease',
        boxShadow: scrolled ? '0 2px 16px rgba(43,27,18,0.06)' : 'none',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '0 24px',
          height: 60,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 24,
        }}>

          {/* Logo */}
          <Link to="/dashboard" style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 22, fontWeight: 700,
            color: C.dark, letterSpacing: '0.02em',
            textDecoration: 'none', userSelect: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: C.brand,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </span>
            BuildMate
          </Link>

          {/* Center nav links */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="dash-nav-links">
            {NAV_LINKS.map(l => (
              <Link key={l.href} to={l.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '6px 14px', borderRadius: 9999,
                  background: isActive(l.href) ? C.dark : 'transparent',
                  color: isActive(l.href) ? C.orange : C.dark2,
                  fontSize: 13, fontWeight: 600,
                  fontFamily: '"DM Sans", sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  display: 'flex', alignItems: 'center', gap: 6,
                  letterSpacing: '0.01em',
                }}
                  onMouseEnter={e => { if (!isActive(l.href)) { e.currentTarget.style.background = 'rgba(43,27,18,0.07)'; e.currentTarget.style.color = C.dark } }}
                  onMouseLeave={e => { if (!isActive(l.href)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.dark2 } }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>{l.icon}</span>
                  {l.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Right — create + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="dash-nav-links">

            {/* Avatar dropdown */}
            <div style={{ position: 'relative' }} ref={dropRef}>
              <button
                onClick={() => setDropOpen(o => !o)}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: dropOpen ? C.dark : C.brand,
                  color: 'white', border: 'none',
                  fontFamily: '"Syne", sans-serif',
                  fontWeight: 800, fontSize: 13,
                  cursor: 'pointer', transition: 'all 0.18s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  letterSpacing: '0.05em',
                  boxShadow: dropOpen ? `0 0 0 3px ${C.brand}44` : 'none',
                }}
              >
                {initials}
              </button>

              {dropOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: 220, background: C.surface,
                  borderRadius: 16, border: `1px solid ${C.border}`,
                  boxShadow: '0 8px 32px rgba(43,27,18,0.12)',
                  overflow: 'hidden',
                  animation: 'dropIn 0.18s ease both',
                }}>
                  {/* User info */}
                  <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
                    <p style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark }}>{user?.name || 'Builder'}</p>
                    <p style={{ fontSize: 11, color: C.muted, fontFamily: '"DM Sans", sans-serif', marginTop: 2 }}>{user?.email || ''}</p>
                  </div>

                  {/* Menu items */}
                  {[
                    { icon: <UserIcon />, label: 'Profile',         href: '/profile'      },
                    { icon: <ProjectsIcon />, label: 'My Projects',     href: '/my-projects'  },
                    { icon: <ApplicationsIcon />, label: 'Applications',    href: '/applications' },
                    { icon: <DashboardIcon />, label: 'Dashboard',       href: '/dashboard'    },
                  ].map(item => (
                    <Link key={item.href} to={item.href} style={{ textDecoration: 'none' }} onClick={() => setDropOpen(false)}>
                      <div style={{
                        padding: '10px 16px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        fontSize: 13, fontWeight: 500, color: C.dark2,
                        fontFamily: '"DM Sans", sans-serif',
                        cursor: 'pointer', transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F5EDE0'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span> {item.label}
                      </div>
                    </Link>
                  ))}

                  {/* Logout */}
                  <div style={{ borderTop: `1px solid ${C.border}`, padding: '8px' }}>
                    <button onClick={handleLogout} style={{
                      width: '100%', background: 'none', border: 'none',
                      padding: '9px 8px', borderRadius: 10,
                      color: C.brand, fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                      display: 'flex', alignItems: 'center', gap: 8,
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FEE8E3'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobOpen(o => !o)}
            className="dash-mob-btn"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 6, gridColumn: 3, justifySelf: 'end' }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2,
                background: C.dark, borderRadius: 2, marginBottom: i < 2 ? 5 : 0,
                transition: 'all 0.22s',
                transform: mobOpen ? (i===0 ? 'rotate(45deg) translate(5px,5px)' : i===1 ? 'scaleX(0)' : 'rotate(-45deg) translate(5px,-5px)') : 'none',
                opacity: mobOpen && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {mobOpen && (
          <div style={{
            background: C.bg, borderTop: `1px solid ${C.border}`,
            padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} to={l.href} style={{ textDecoration: 'none' }} onClick={() => setMobOpen(false)}>
                <div style={{
                  padding: '10px 14px', borderRadius: 12,
                  background: isActive(l.href) ? C.dark : 'transparent',
                  color: isActive(l.href) ? C.orange : C.dark2,
                  fontSize: 14, fontWeight: 600,
                  fontFamily: '"DM Sans", sans-serif',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>{l.icon}</span> {l.label}
                </div>
              </Link>
            ))}
            <div style={{ paddingTop: 8, borderTop: `1px solid ${C.border}`, marginTop: 4 }}>
              <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', color: C.brand, border: `1.5px solid ${C.brand}`, borderRadius: 9999, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>Log out</button>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @media (max-width: 768px) {
          .dash-nav-links { display: none !important; }
          .dash-mob-btn   { display: block !important; }
        }
      `}</style>
    </>
  )
}