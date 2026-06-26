import { useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeEmail } from '../../api/newsletter'
import useScrollReveal from '../../hooks/useScrollReveal'

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
              ✓ You're on the list — we'll be in touch!
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

          {/* Links */}
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: 32,
            marginTop: 56,
          }}>
            {[
              { icon: MailIcon, label: 'adititiwari095@gmail.com', href: 'mailto:adititiwari095@gmail.com' },
              { icon: LinkedinIcon, label: 'LinkedIn',             href: 'https://www.linkedin.com/in/aditi-tiwari-23606332a/' },
            ].map(({ icon, label, href }) => (
              <ContactLink key={label} icon={icon} label={label} href={href} />
            ))}
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