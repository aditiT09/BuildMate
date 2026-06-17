# Site Audit Report
**Date:** June 17, 2026
**Project:** BuildMate
**Detected stack:** React 19.2.6, Vite 8.0.12, Tailwind CSS 4.3.0, FastAPI 0.136.1, SQLAlchemy 2.0.49, Alembic 1.18.4, PostgreSQL (NeonDB), Redis (Upstash)
**Detected audience/goal:** GenZ developers, designers, and founders matching up to build projects (squad-finding platform)
**Design system maturity:** Ad-hoc — colors and styles are duplicated as hardcoded hex constants in individual page files instead of centralized CSS variables or Tailwind tokens.

---

## Anti-Pattern Verdict
Does this look AI-generated? **Partially**

### Specific Tells:
1. **Emoji Overuse as Structural Icons:** The application heavily relies on emojis for navigation and dashboard statistics (e.g. `⚡ Dashboard`, `🔍 Discover`, `🏗️ My Projects`, `📬 Applications` in [DashboardNavbar.jsx](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/components/layout/DashboardNavbar.jsx#L18-L22) and `📁`, `📬`, `🌍` in [Dashboard.jsx](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/dashboard/Dashboard.jsx#L420-L422)) instead of standardized SVG icons or font icons.
2. **Fabricated Ticker Metrics:** The marketing ticker in [Hero.jsx](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/landingpage/Hero.jsx#L135-L140) advertises "2,400+ builders" and "580+ live projects", which are hardcoded strings clashing directly with real live metrics drawn from database counts on the dashboard.
3. **Card-Grid Overuse:** Almost all dashboard layout sections in [Dashboard.jsx](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/dashboard/Dashboard.jsx) are enclosed inside heavy shadow-bordered box cards (`.dash-card`), when simple dividers or negative space would create cleaner separation.
4. **Copy clichés:** Highly stylized, repetitive GenZ slang expressions ("bestie, let's fix that", "let's cook fr fr", "the audacity") are injected directly into system messages and empty states to force a branding style.

*Score: 2/4 (Partially AI-generated tells present, but the Brutalist layout, distinct typography, and custom warm sand/terracotta color scheme set it apart from standard blue/indigo AI template slop).*

---

## Audit Health Score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 1/4 | Systemic lack of programmatic label-input associations and focus indicators |
| 2 | Performance | 3/4 | Layout reflow triggers on width animations; unmemoized 364-cell grid |
| 3 | Security | 2/4 | Session JWT stored in localStorage; complete absence of API rate limiting |
| 4 | Theming & design system | 2/4 | Replicated hardcoded color palettes; clashing brand colors across pages |
| 5 | Responsive design | 2/4 | Missing viewport meta tag in index.html completely breaks mobile scale |
| 6 | Anti-patterns | 2/4 | Emoji icons, grid-card overuse, and mismatched landing ticker metrics |
| | **Total** | **12/24** | **Acceptable** |

**Legal & compliance flags:**
- Privacy Policy: **Orphaned** (landing page links point to `href="#"`; login page link points to `/privacy` which has no registered route).
- Terms & Conditions: **Orphaned** (landing page links point to `href="#"`; login page link points to `/terms` which has no registered route).
- Cookie consent: **Missing** (no consent banner or preference configuration exists).
- GDPR signals: **Missing** (no consent checkboxes during registration or account deletion options).
- COPPA: **n/a** (service is college/adult oriented, but missing age disclosures).

---

## Executive Summary
BuildMate features a unique, high-character Brutalist aesthetic that fits its target GenZ audience well. However, the application is not ready for launch due to critical user-experience blockers: the mobile layout is broken by a missing viewport meta tag, the main signup CTA on the landing page is broken, and there are severe accessibility gaps (e.g. keyboard traps, invisible focus states, and screen reader disconnects). Securing session tokens and adding basic API rate limits are also essential steps to protect the app before deployment.

Total findings by severity: P0 [2] · P1 [6] · P2 [4] · P3 [3]

---

## Quick Wins
1. **Fix Broken Signup Link:** Change `/signup` to `/register` in [Hero.jsx:104](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/landingpage/Hero.jsx#L104) to restore the landing page conversion flow. (P0)
2. **Add Viewport Meta Tag:** Add `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` to [index.html:4](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/index.html#L4) to enable mobile scaling. (P0)
3. **Muted Contrast Adjustment:** Change `#A89890` to `#6F5D53` on line 462 of [Login.jsx](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/auth/Login.jsx#L462) to satisfy WCAG AA contrast requirements. (P1)

---

## Findings

### P0 — Blocking

#### Broken "Start Building" Landing Page CTA
- **Category:** User Control and Freedom / Consistent Routing
- **Location:** [Hero.jsx:104](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/landingpage/Hero.jsx#L104)
- **Issue:** The main CTA button links to `/signup`, but the React Router configuration in [AppRoutes.jsx](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/routes/AppRoutes.jsx) only maps `/register` and does not provide a wildcard redirect.
- **User impact:** Users clicking the primary sign-up button on the landing page land on an empty, blank screen, blocking new user acquisition.
- **Fix:** Update the link in `Hero.jsx` from `/signup` to `/register`.

#### Missing Viewport Meta Tag
- **Category:** Responsive Design
- **Location:** [index.html:4](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/index.html#L4)
- **Issue:** The document `<head>` lacks a `meta name="viewport"` tag.
- **User impact:** Mobile devices render the page at desktop width (typically 980px) and scale it down. Text becomes microscopic, forcing mobile users to zoom and scroll horizontally to use the app.
- **Fix:** Insert `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` directly below `<meta charset="UTF-8" />` in `index.html`.

---

### P1 — Major

#### Systemic Programmatic Input-Label Disconnect
- **Category:** Accessibility
- **Location:** Multiple files, including:
  - [Login.jsx:250](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/auth/Login.jsx#L250) (Email field)
  - [CreateProject.jsx:345](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/projects/CreateProject.jsx#L345) (Project title field)
  - [CreateOpportunity.jsx:356](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/opportunities/CreateOpportunity.jsx#L356) (Role field)
- **Issue:** Form `<label>` tags are styled visually above input/textarea elements but do not carry a `htmlFor` attribute, and inputs lack matching `id` attributes.
- **User impact:** Screen readers cannot associate labels with form inputs, reading them simply as "edit text, blank." Visually impaired users are unable to fill out forms reliably.
- **Fix:** Assign a unique `id` to each input (e.g. `id="email"`) and reference it in the label using the `htmlFor` attribute (e.g. `htmlFor="email"`).

#### Missing Accessible Focus Indicators on Buttons
- **Category:** Accessibility
- **Location:** Systemic, e.g. [Login.jsx:385](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/auth/Login.jsx#L385), [CreateProject.jsx:513](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/projects/CreateProject.jsx#L513)
- **Issue:** Button inline styles utilize `border: none` and suppress outlines without declaring custom `:focus` or `:focus-visible` styles.
- **User impact:** Keyboard-only users tabbing through the site have no visual cue indicating which button is currently selected, causing navigation confusion.
- **Fix:** Add a global CSS focus outline style in `index.css` using `:focus-visible` to style outline borders consistently.

#### Non-Semantic Interactive Status Toggle Cards
- **Category:** Accessibility
- **Location:** [CreateOpportunity.jsx:423](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/opportunities/CreateOpportunity.jsx#L423), [CreateOpportunity.jsx:442](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/opportunities/CreateOpportunity.jsx#L442)
- **Issue:** "Open" and "Closed" status options are interactive `div` elements with `onClick` handlers but lack a tab index, keypress handlers, or semantic roles.
- **User impact:** Keyboard users cannot tab to or toggle these status cards, rendering them unable to change the status of an opportunity.
- **Fix:** Refactor these elements to use semantic `<button type="button">` wrappers, or assign `role="radio"`, `tabIndex={0}`, and an `onKeyDown` listener.

#### Low Contrast Muted Text
- **Category:** Accessibility
- **Location:** [Login.jsx:462](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/auth/Login.jsx#L462) (Terms statement)
- **Issue:** Gray text `#A89890` on a warm light-cream background `#FFF8F0` has a contrast ratio of only 2.55:1, failing WCAG AA's minimum requirement of 4.5:1.
- **User impact:** Low-vision users cannot read the terms and privacy policy sign-in notice.
- **Fix:** Darken the text color to `#6F5D53` to raise the contrast ratio above 4.5:1.

#### Low Contrast Dashboard Muted Text
- **Category:** Accessibility
- **Location:** [Dashboard.jsx:398](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/dashboard/Dashboard.jsx#L398) (Score hint paragraph)
- **Issue:** White text at `0.3` opacity on dark background `#2B1B12` yields a low contrast ratio of 2.61:1, failing WCAG AA guidelines.
- **User impact:** Visually impaired users cannot read the instructions for leveling up dashboard scores.
- **Fix:** Set the color to `#FFF8F0` or increase opacity to `rgba(255, 255, 255, 0.6)`.

#### Client-side Session Token Exposure (localStorage)
- **Category:** Security
- **Location:** [axios.js:8](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/api/axios.js#L8), [AuthContext.jsx:16](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/context/AuthContext.jsx#L16)
- **Issue:** User session JWT tokens are stored directly in `localStorage` and read synchronously.
- **User impact:** If the application ever becomes vulnerable to Cross-Site Scripting (XSS), attackers can extract the token directly via Javascript and hijack user accounts.
- **Fix:** Store tokens in memory and use secure, `HttpOnly`, `SameSite=Strict`, and `Secure` cookies managed by the backend authentication endpoints.

---

### P2 — Minor

#### Missing API Rate Limiting
- **Category:** Security
- **Location:** [auth.py:26](file:///C:/Users/Aditi%20Tiwari/BuildMate/backend/app/routes/auth.py#L26) (Login Endpoint)
- **Issue:** The FastAPI application lacks rate-limiting middleware or decorators on security-sensitive paths.
- **User impact:** Malicious bots can perform brute-force credential stuffing attacks or spam the signup endpoints unchecked.
- **Fix:** Integrate `slowapi` in FastAPI and decorate the login/register routes to throttle requests by IP.

#### Missing Security Headers
- **Category:** Security
- **Location:** [main.py:47](file:///C:/Users/Aditi%20Tiwari/BuildMate/backend/app/main.py#L47)
- **Issue:** The API does not write standard HTTP security headers (e.g. CSP, HSTS, X-Frame-Options, X-Content-Type-Options).
- **User impact:** The site is exposed to iframe clickjacking and content type sniffing exploits.
- **Fix:** Add a FastAPI middleware that appends standard security headers to all HTTP responses.

#### Missing ARIA Accessibility Labels on Toggles
- **Category:** Accessibility
- **Location:** [DashboardNavbar.jsx:139](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/components/layout/DashboardNavbar.jsx#L139) (Avatar menu button), [Navbar.jsx:115](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/components/layout/Navbar.jsx#L115) (Mobile toggle)
- **Issue:** Toggle buttons that display/hide menus do not declare `aria-expanded` or `aria-haspopup`.
- **User impact:** Screen reader users are not notified when clicking the button opens a menu.
- **Fix:** Append `aria-haspopup="true"` and `aria-expanded={dropOpen}` to toggle buttons.

#### Inconsistent Brand Identity Colors
- **Category:** Theming & Design System
- **Location:** Brand colors in [Navbar.jsx:5](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/components/layout/Navbar.jsx#L5) (`#c4622d`) vs [Dashboard.jsx:12](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/dashboard/Dashboard.jsx#L12) (`#E35336`)
- **Issue:** The landing page uses terracotta `#c4622d` as its primary color, whereas the dashboard and login routes use orange-red `#E35336`.
- **User impact:** Users transition from a warm, earthy landing page to a bright orange-red interface, creating visual inconsistency.
- **Fix:** Pick one dominant brand color and synchronize the themes using centralized design variables.

---

### P3 — Polish

#### Layout Reflow on Width Animations
- **Category:** Performance
- **Location:** [Dashboard.jsx:37](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/dashboard/Dashboard.jsx#L37) (`barFill` animation)
- **Issue:** The `@keyframes barFill` animates the CSS `width` property on render.
- **User impact:** Animating `width` triggers browser layout reflow calculations, causing minor micro-stutter/lag on low-powered mobile devices.
- **Fix:** Animate the GPU-accelerated `transform: scaleX()` instead of `width`.

#### Redundant StreakGrid Re-renders
- **Category:** Performance
- **Location:** [Dashboard.jsx:96](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/dashboard/Dashboard.jsx#L96)
- **Issue:** The 364-cell `StreakGrid` component recalculates complex date math and pseudo-random seeds on every dashboard state change.
- **User impact:** Minor unnecessary CPU overhead.
- **Fix:** Wrap the `StreakGrid` component in `React.memo` or memoize date arrays using `useMemo`.

#### Missing Lazy Loading on Profile Images
- **Category:** Performance
- **Location:** [PublicProfile.jsx:147](file:///C:/Users/Aditi%20Tiwari/BuildMate/frontend/src/pages/profile/PublicProfile.jsx#L147)
- **Issue:** Profile images do not specify lazy-loading behaviors.
- **User impact:** Increased bandwidth usage and slower page weight on pages with multiple builder lists.
- **Fix:** Add `loading="lazy"` to `<img />` tags.

---

## Systemic Patterns
1. **Ad-Hoc Styling (Lack of Tokens):** Page files duplicate a localized `C` color object (e.g. `DashboardNavbar.jsx`, `Dashboard.jsx`, `PublicProfile.jsx`, `CreateProject.jsx`). The variables are copied repeatedly rather than using Tailwind CSS configurations or CSS custom properties.
2. **Interactive Divs Lacking Keyboard/Aria Support:** Elements are repeatedly styled as clickable blocks (e.g., status selectors, streak cells, tags) using simple `onClick` attributes without focus indexes or ARIA role labels, making them inaccessible to keyboard/screen reader users.

---

## Strengths
1. **Distinct Design Aesthetic:** The application features a bold, Neobrutalist cozy palette (warm sand, Cormorant Garamond, Syne, JetBrains Mono) that feels intentional and highly appealing.
2. **Safe Database Operations:** The backend strictly uses SQLAlchemy parameterized queries, protecting the database from raw SQL injections.
3. **Robust Auth Flow:** The backend handles login normalization safely in [auth.py](file:///C:/Users/Aditi%20Tiwari/BuildMate/backend/app/routes/auth.py) using case-insensitive email matching and timing-safe credentials rejection.

---

## Recommended Priority Order

1. **Fix Landing Page CTA Link (Hero.jsx:104):** Fixes the broken user signup flow.
2. **Add Viewport Meta Tag (index.html:4):** Restores mobile layout scaling.
3. **Resolve Programmatic Label-Input Mismatches:** Makes the forms keyboard/screen-reader friendly across all pages.
4. **Increase Low Contrast Text (Login.jsx, Dashboard.jsx):** Solves core readability issues for visually impaired users.
5. **Secure Auth Session Storage (localStorage to HttpOnly Cookies):** Removes vulnerability to token theft via XSS.
6. **Implement API Rate Limiting (FastAPI backend):** Protects auth endpoints against brute-force attacks.
7. **Consolidate Brand Theme Colors:** Unifies landing page colors with dashboard colors into global CSS variables.
