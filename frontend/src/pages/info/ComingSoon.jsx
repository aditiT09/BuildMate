import { useNavigate, useLocation } from "react-router-dom";

const C = {
  brand: "#E35336",
  brandDk: "#B8391F",
  bg: "#FFF8F0",
  surface: "#FDFBF7",
  dark: "#2B1B12",
  muted: "#8C776A",
};

const DocumentIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E35336" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ShieldIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E35336" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const PRIVACY_SECTIONS = [
  {
    title: "1. Information We Collect",
    intro: "When you use BuildMate, we may collect:",
    items: [
      "Account information: name, email address, password, and profile details.",
      "Profile information: bio, college, degree, skills, GitHub, LinkedIn, portfolio links, avatar, and availability.",
      "Project information: projects you create, roles, required skills, resources, and applications.",
      "Usage information: basic activity within the platform, such as applications, invitations, and profile updates."
    ]
  },
  {
    title: "2. How We Use Your Information",
    intro: "We use your information to:",
    items: [
      "Create and manage your account.",
      "Help users discover projects and teammates.",
      "Match builders with relevant projects and opportunities.",
      "Show profile completeness, activity, and reliability scores.",
      "Improve BuildMate’s features, safety, and user experience.",
      "Contact you about important updates or feedback if you choose to share your email."
    ]
  },
  {
    title: "3. Public Profile Information",
    text: "Some information you add to your profile may be visible to other logged-in users, including your name, bio, skills, project activity, and public links such as GitHub, LinkedIn, or portfolio URLs.",
    warning: "Do not add sensitive personal information to your profile."
  },
  {
    title: "4. Passwords and Security",
    text: "Passwords are stored in hashed form. We take reasonable steps to protect your account information, but no online service can guarantee complete security.",
    warning: "You are responsible for keeping your login details safe."
  },
  {
    title: "5. Sharing of Information",
    text: "We do not sell your personal information.",
    subtext: "We may share limited information only when:",
    items: [
      "Required to operate the platform.",
      "Required by law.",
      "Needed to protect BuildMate, users, or the public from abuse or security risks."
    ]
  },
  {
    title: "6. Third-Party Links",
    text: "BuildMate may contain links to GitHub, LinkedIn, portfolios, or other external websites. We are not responsible for the privacy practices or content of those websites."
  },
  {
    title: "7. Data Retention",
    text: "We keep your information as long as your account is active or as needed to provide the service. You may request account or data deletion by contacting us."
  },
  {
    title: "8. Your Choices",
    text: "You may update your profile information at any time. You may also request deletion of your account or personal data by contacting:",
    email: "adititiwari095@gmail.com"
  },
  {
    title: "9. Children’s Privacy",
    text: "BuildMate is not intended for children under 13. If we learn that we have collected data from a child under 13, we will delete it."
  },
  {
    title: "10. Changes to This Policy",
    text: "We may update this Privacy Policy as BuildMate evolves. Changes will be posted on this page with an updated date."
  },
  {
    title: "11. Contact",
    text: "If you have questions about this Privacy Policy, contact:",
    email: "adititiwari095@gmail.com"
  }
];

const TERMS_SECTIONS = [
  {
    title: "1. What BuildMate Does",
    text: "BuildMate helps users discover projects, create project listings, apply to roles, invite teammates, and build collaboration profiles.",
    warning: "BuildMate is currently an MVP and may change over time."
  },
  {
    title: "2. User Accounts",
    text: "To use certain features, you must create an account.",
    subtext: "You agree to:",
    items: [
      "Provide accurate information.",
      "Keep your login details secure.",
      "Use the platform responsibly.",
      "Not impersonate another person.",
      "Not create accounts for spam, abuse, or fraud."
    ]
  },
  {
    title: "3. User Content",
    text: "You may create or upload content such as profiles, project descriptions, skills, links, resources, and applications.",
    subtext: "You are responsible for the content you submit. You agree not to post:",
    items: [
      "False or misleading information.",
      "Offensive, harmful, or abusive content.",
      "Spam or irrelevant promotions.",
      "Content that violates someone else’s rights.",
      "Malicious links or unsafe files."
    ]
  },
  {
    title: "4. Projects and Collaborations",
    subtext: "BuildMate helps users connect, but we do not guarantee:",
    items: [
      "That a project will be completed.",
      "That a teammate will respond or contribute.",
      "That a collaboration will be successful.",
      "That profile scores or matching results are perfect."
    ],
    warning: "Users are responsible for deciding who they collaborate with."
  },
  {
    title: "5. Matching, Scores, and Recommendations",
    text: "BuildMate may show activity scores, reliability scores, skill matches, rankings, or recommendations.",
    warning: "These are only platform-generated indicators and should not be treated as absolute judgments of a person’s ability, character, or trustworthiness."
  },
  {
    title: "6. Acceptable Use",
    subtext: "You agree not to:",
    items: [
      "Attack, disrupt, or overload the platform.",
      "Try to access another user’s account.",
      "Scrape data without permission.",
      "Reverse-engineer protected parts of the service.",
      "Use BuildMate for illegal, harmful, or abusive activity."
    ]
  },
  {
    title: "7. External Links",
    text: "Users may share links to GitHub, LinkedIn, portfolios, or project resources. BuildMate is not responsible for external websites or their content.",
    warning: "Open external links at your own discretion."
  },
  {
    title: "8. Account Suspension or Removal",
    text: "We may suspend or remove accounts or content if we believe they violate these terms, harm other users, or create security risks."
  },
  {
    title: "9. Availability",
    text: "BuildMate is provided as-is. We may update, pause, or remove features at any time.",
    warning: "We do not guarantee that the platform will always be available, error-free, or secure."
  },
  {
    title: "10. Limitation of Liability",
    text: "To the maximum extent allowed by law, BuildMate and its creator are not responsible for indirect losses, failed collaborations, lost data, missed opportunities, or damages resulting from use of the platform."
  },
  {
    title: "11. Changes to These Terms",
    text: "We may update these Terms as BuildMate evolves. Changes will be posted on this page with an updated date."
  },
  {
    title: "12. Contact",
    text: "For questions about these Terms, contact:",
    email: "adititiwari095@gmail.com"
  }
];

export default function ComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPrivacy = location.pathname.includes("privacy");

  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const icon = isPrivacy ? ShieldIcon : DocumentIcon;
  const introText = isPrivacy
    ? "BuildMate is a platform that helps builders, students, and creators find teammates, projects, and collaboration opportunities."
    : "Welcome to BuildMate. By using BuildMate, you agree to these Terms of Service.";
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  return (
    <div
      style={{
        backgroundColor: C.bg,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        boxSizing: "border-box",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        className="comingsoon-card"
        style={{
          backgroundColor: C.surface,
          border: `2px solid ${C.dark}`,
          borderRadius: "32px",
          padding: "40px 48px",
          maxWidth: "720px",
          width: "100%",
          textAlign: "left",
          boxShadow: `8px 8px 0px ${C.dark}`,
          animation: "floatUp 0.5s ease both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div style={{ display: "inline-block", color: C.brand }}>{icon}</div>
          <h1
            style={{
              fontFamily: '"Melody by W.", "Melody", sans-serif',
              fontSize: "clamp(32px, 6vw, 44px)",
              fontWeight: 800,
              color: C.dark,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
        </div>

        <div>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
            Last updated: June 26, 2026
          </p>
          <p style={{ fontSize: 15, color: C.dark, lineHeight: 1.6, marginBottom: 28, fontFamily: '"DM Sans", sans-serif' }}>
            {introText}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 36 }}>
            {sections.map((sec, i) => (
              <div key={i} style={{ borderBottom: i < sections.length - 1 ? `1px solid rgba(43,27,18,0.06)` : "none", paddingBottom: i < sections.length - 1 ? 20 : 0 }}>
                <h3 style={{
                  fontFamily: '"Syne", sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  color: C.dark,
                  marginBottom: 10,
                }}>
                  {sec.title}
                </h3>
                
                {sec.intro && (
                  <p style={{ fontSize: 14, color: "rgba(43,27,18,0.8)", lineHeight: 1.6, marginBottom: 8 }}>{sec.intro}</p>
                )}
                
                {sec.text && (
                  <p style={{ fontSize: 14, color: "rgba(43,27,18,0.8)", lineHeight: 1.6, marginBottom: sec.warning || sec.subtext || sec.email ? 8 : 0 }}>{sec.text}</p>
                )}

                {sec.subtext && (
                  <p style={{ fontSize: 14, color: "rgba(43,27,18,0.8)", lineHeight: 1.6, marginBottom: 8, fontWeight: 500 }}>{sec.subtext}</p>
                )}

                {sec.items && (
                  <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    {sec.items.map((item, idx) => (
                      <li key={idx} style={{ fontSize: 13.5, color: "rgba(43,27,18,0.7)", lineHeight: 1.6 }}>{item}</li>
                    ))}
                  </ul>
                )}

                {sec.warning && (
                  <div style={{
                    marginTop: 8,
                    padding: "8px 14px",
                    background: "rgba(227, 83, 54, 0.08)",
                    borderLeft: `3px solid ${C.brand}`,
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.brandDk,
                  }}>
                    ⚠️ {sec.warning}
                  </div>
                )}

                {sec.email && (
                  <a href={`mailto:${sec.email}`} style={{ fontSize: 14, color: C.brand, fontWeight: 600, textDecoration: "none" }}>
                    {sec.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: C.brand,
              color: "white",
              border: "none",
              borderRadius: "9999px",
              padding: "14px 36px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: `0 4px 12px ${C.brand}33`,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = C.brandDk)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = C.brand)}
          >
            ← Go Back
          </button>
        </div>
      </div>
      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
