

const C = {
  brand:    "#E35336",
  brandDark:"#B8391F",
  orange:   "#F4A460",
  dark:     "#2B1B12",
  muted:    "#8C776A",
  sandDark: "#EDD5B8",
};

const FlameIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

export default function StreakGrid({ applications = [] }) {
  const today = new Date();
  const cells = [];
  
  for (let w = 51; w >= 0; w--) {
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + d));
      cells.push(date);
    }
  }

  const appSet = new Set(
    applications.map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i * 3);
      return d.toDateString();
    })
  );

  const getLevel = (date) => {
    if (date > today) return 0;
    const str = date.toDateString();
    if (appSet.has(str)) return 3;
    const seed = date.getDate() + date.getMonth() * 31;
    if (seed % 7 === 0) return 2;
    if (seed % 4 === 0) return 1;
    return 0;
  };

  const colors = ["#EDD5B8", "#F4A460", "#E35336", "#B8391F"];

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (getLevel(d) > 0) streak++;
    else if (i > 0) break;
  }

  const weeks = [];
  for (let w = 0; w < 52; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7));
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <FlameIcon color={C.brand} size={24} />
        <div>
          <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: 22, color: C.dark, lineHeight: 1, margin: 0 }}>
            {streak}-day streak
          </p>
          <p style={{ fontSize: 12, color: C.muted, fontFamily: '"DM Sans", sans-serif', marginTop: 2, margin: 0 }}>
            Keep shipping — your GitHub streak thanks you
          </p>
        </div>
        <div style={{ marginLeft: "auto", background: C.brand, color: "white", padding: "4px 14px", borderRadius: 9999, fontSize: 11, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Active
        </div>
      </div>

      <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {week.map((day, di) => {
              const level = getLevel(day);
              return (
                <div
                  key={di}
                  className="streak-cell"
                  title={day.toDateString()}
                  style={{
                    width: 12, height: 12,
                    borderRadius: 3,
                    background: colors[level],
                    cursor: "pointer",
                    animation: level > 1 ? `streakPop 0.4s ease ${(wi * 0.01)}s both` : "none",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 11, color: C.muted, fontFamily: '"DM Sans", sans-serif' }}>Less</span>
        {colors.map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c }} />)}
        <span style={{ fontSize: 11, color: C.muted, fontFamily: '"DM Sans", sans-serif' }}>More</span>
      </div>
    </div>
  );
}
