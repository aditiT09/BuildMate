import AnimCount from "./AnimCount";


export default function ScoreRing({ score = 50, label, color, size = 88 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(score, 100) / 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EDD5B8" strokeWidth={7} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.5s ease" }}
        />
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fill="#F4A460"
              style={{ fontSize: 18, fontWeight: 700, transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px`, fontFamily: '"Melody by W.", "Melody", sans-serif' }}>
          <AnimCount target={score} />
        </text>
      </svg>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#8C776A", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"DM Sans", sans-serif' }}>{label}</span>
    </div>
  );
}
