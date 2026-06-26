import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { subscribeEmail } from '../../api/newsletter'
import useScrollReveal from '../../hooks/useScrollReveal'
import { CheckIcon, UserIcon, RocketIcon, UsersIcon, TargetIcon } from '../../components/common/Icons'
import { getAuthorProfile } from '../../api/profile'
import { getOverview } from '../../api/analytics'
import AnimCount from '../../components/ui/AnimCount'

const C = {
  terra300:  '#e8845a',
  terra500:  '#c4622d',
  terra700:  '#8b3a1a',
  terra900:  '#2c1810',
  terra950:  '#1a0c06',
  sand200:   '#f5ede0',
  sand400:   '#d4a882',
  olive400:  '#a3b576',
}

const MailIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LinkedinIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export default function Contact() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState('idle')
  const [ref, visible]      = useScrollReveal(0.1)
  const [inputFocus, setInputFocus] = useState(false)
  const [btnHover,   setBtnHover]   = useState(false)
  const [authorProfile, setAuthorProfile] = useState(null)
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    Promise.all([
      getAuthorProfile().catch(() => null),
      getOverview().catch(() => null)
    ]).then(([authData, overviewData]) => {
      setAuthorProfile(authData)
      setOverview(overviewData)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await subscribeEmail(email)
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('success') // graceful fallback for demo
    }
  }

  return (
    <>
      {/* ── Contact section ── */}
      <section id="contact" style={{
        background: C.terra900,
        position: 'relative', overflow: 'hidden',
        padding: '112px 24px',
        textAlign: 'center',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 110%, rgba(196,98,45,0.32) 0%, transparent 65%)',
        }} />

        <div
          ref={ref}
          style={{
            position: 'relative', zIndex: 1,
            maxWidth: 680, margin: '0 auto',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {/* BuildMate Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1.5px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 24,
            padding: '32px 36px',
            color: C.sand200,
            width: '100%',
            boxSizing: 'border-box',
            marginBottom: 56,
            textAlign: 'left',
          }}>
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', color: C.terra300 }}>
                <RocketIcon size={18} color="currentColor" />
              </span>
              <h3 style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: C.sand200,
                margin: 0,
              }}>
                BuildMate Stats
              </h3>
              <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 10 }}>
              <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 16, border: '1.5px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 6, color: C.terra300 }}>
                  <RocketIcon color="currentColor" size={24} />
                </div>
                <h4 style={{ fontFamily: '"Melody by W.", "Melody", sans-serif', fontWeight: 800, fontSize: 32, color: C.sand200, margin: '6px 0 2px' }}>
                  <AnimCount target={overview?.total_projects ?? 0} />
                </h4>
                <p style={{ fontSize: 11, color: 'rgba(245,237,224,0.4)', textTransform: 'uppercase', fontWeight: 700, margin: 0, fontFamily: '"DM Sans", sans-serif' }}>Projects</p>
              </div>
              <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 16, border: '1.5px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 6, color: C.sand400 }}>
                  <UsersIcon color="currentColor" size={24} />
                </div>
                <h4 style={{ fontFamily: '"Melody by W.", "Melody", sans-serif', fontWeight: 800, fontSize: 32, color: C.sand200, margin: '6px 0 2px' }}>
                  <AnimCount target={overview?.total_users ?? 0} />
                </h4>
                <p style={{ fontSize: 11, color: 'rgba(245,237,224,0.4)', textTransform: 'uppercase', fontWeight: 700, margin: 0, fontFamily: '"DM Sans", sans-serif' }}>Builders</p>
              </div>
              <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 16, border: '1.5px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 6, color: C.terra300 }}>
                  <TargetIcon color="currentColor" size={24} />
                </div>
                <h4 style={{ fontFamily: '"Melody by W.", "Melody", sans-serif', fontWeight: 800, fontSize: 32, color: C.sand200, margin: '6px 0 2px' }}>
                  <AnimCount target={overview?.total_opportunities ?? 0} />
                </h4>
                <p style={{ fontSize: 11, color: 'rgba(245,237,224,0.4)', textTransform: 'uppercase', fontWeight: 700, margin: 0, fontFamily: '"DM Sans", sans-serif' }}>Openings</p>
              </div>
            </div>
          </div>

          <span style={{
            display: 'block',
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: C.terra300, marginBottom: 24,
            fontFamily: '"DM Sans", sans-serif',
          }}>
            ✦ Get in touch
          </span>

          <h2 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 700, lineHeight: 1.05,
            fontSize: 'clamp(42px, 6vw, 82px)',
            color: C.sand200, marginBottom: 20,
          }}>
            Ready to build<br /><em>something real?</em>
          </h2>

          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 300, fontSize: 16,
            color: 'rgba(245,237,224,0.5)',
            marginBottom: 48, lineHeight: 1.65,
          }}>
            Drop your email and we'll connect with you for the feedback.
          </p>

          {status === 'success' ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(163,181,118,0.15)',
              border: '1.5px solid rgba(163,181,118,0.4)',
              color: C.olive400,
              padding: '16px 32px', borderRadius: 9999,
              fontSize: 16, fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
            }}>
              <CheckIcon size={18} color={C.olive400} />
              <span>You're on the list — we'll be in touch!</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex', gap: 10,
                justifyContent: 'center',
                maxWidth: 500, margin: '0 auto',
                flexWrap: 'wrap',
              }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                style={{
                  flex: 1, minWidth: 200,
                  background: 'rgba(255,255,255,0.08)',
                  border: `1.5px solid ${inputFocus ? C.terra300 : 'rgba(255,255,255,0.12)'}`,
                  color: C.sand200,
                  borderRadius: 9999,
                  padding: '15px 24px',
                  fontSize: 15,
                  fontFamily: '"DM Sans", sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  background: btnHover ? C.terra300 : C.terra500,
                  color: 'white', border: 'none',
                  borderRadius: 9999,
                  padding: '15px 28px',
                  fontSize: 15, fontWeight: 600,
                  fontFamily: '"DM Sans", sans-serif',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s',
                }}
              >
                {status === 'loading' ? 'Sending…' : 'Share'}
              </button>
            </form>
          )}

          {/* Built by Aditi Tiwari card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1.5px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 24,
            padding: '32px 36px',
            marginTop: 56,
            textAlign: 'left',
            boxSizing: 'border-box',
            width: '100%',
            position: 'relative',
          }}>
            {/* Header / Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', color: C.terra300 }}>
                <UserIcon size={18} color="currentColor" />
              </span>
              <h3 style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: C.sand200,
                margin: 0,
              }}>
                Built by Aditi Tiwari
              </h3>
              <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
              {/* Left Column */}
              <div style={{ flex: 1, minWidth: 280 }}>
                <p style={{
                  fontSize: 22,
                  color: C.sand200,
                  lineHeight: 1.5,
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  margin: '0 0 24px 0',
                  fontWeight: 600,
                }}>
                  To every builder out there<br />
                  —thanks for being part of BuildMate.<br />
                  We can't wait to see what you'll create<br />
                  together.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(245,237,224,0.4)', fontFamily: '"DM Sans", sans-serif' }}>
                    Connect with us:
                  </span>
                  <a
                    href="https://www.linkedin.com/in/aditi-tiwari-23606332a/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.terra300,
                      textDecoration: 'none',
                      fontFamily: '"DM Sans", sans-serif',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                  >
                    LinkedIn ↗
                  </a>
                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                  <a
                    href="https://instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.terra300,
                      textDecoration: 'none',
                      fontFamily: '"DM Sans", sans-serif',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                  >
                    Instagram ↗
                  </a>
                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                  <a
                    href="mailto:adititiwari095@gmail.com"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.terra300,
                      textDecoration: 'none',
                      fontFamily: '"DM Sans", sans-serif',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                  >
                    adititiwari095@gmail.com
                  </a>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ flexShrink: 0 }}>
                {authorProfile?.avatar ? (
                  <img
                    src={authorProfile.avatar}
                    alt="Aditi Tiwari"
                    style={{
                      width: 90,
                      height: 120,
                      borderRadius: 12,
                      border: `2px solid ${C.terra300}`,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    width: 90,
                    height: 120,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${C.terra300}, ${C.terra500})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Syne", sans-serif',
                    fontWeight: 800,
                    fontSize: 28,
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    AT
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: C.terra950,
        padding: '28px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 20, fontWeight: 700,
          color: C.sand400,
        }}>BuildMate</span>



        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Privacy', path: '/privacy' },
            { label: 'Terms',   path: '/terms' }
          ].map(({ label, path }) => (
            <Link key={label} to={path} style={{
              fontSize: 14, color: 'rgba(255,255,255,0.25)',
              fontFamily: '"Melody by W.", "Melody", sans-serif', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}
            >{label}</Link>
          ))}
        </div>
      </footer>
    </>
  )
}

function ContactLink({ icon, label, href }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 14,
        color: hovered ? C.sand200 : 'rgba(245,237,224,0.4)',
        textDecoration: 'none',
        fontFamily: '"DM Sans", sans-serif',
        transition: 'color 0.2s',
      }}
    >
      <span>{icon}</span>{label}
    </a>
  )
}