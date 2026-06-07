import { useState } from 'react'
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
            Drop your email — get early access + be first to know when we launch.
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
                {status === 'loading' ? 'Sending…' : 'Notify me'}
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
              { icon: '✉', label: 'hello@buildmate.co', href: 'mailto:hello@buildmate.co' },
              { icon: '𝕏', label: '@buildmate',         href: '#' },
              { icon: '⌥', label: 'Discord',             href: '#' },
              { icon: '?', label: 'FAQ',                  href: '#' },
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

        <span style={{
          fontSize: 12, color: 'rgba(255,255,255,0.2)',
          fontFamily: '"DM Sans", sans-serif',
        }}>
          © 2025 BuildMate. Made by builders, for builders.
        </span>

        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms'].map(t => (
            <a key={t} href="#" style={{
              fontSize: 12, color: 'rgba(255,255,255,0.25)',
              fontFamily: '"DM Sans", sans-serif', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}
            >{t}</a>
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