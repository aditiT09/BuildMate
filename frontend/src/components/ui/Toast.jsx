import { useEffect } from "react";

const C = {
  brand:   "#E35336",
  brandDk: "#B8391F",
  orange:  "#F4A460",
  dark:    "#2B1B12",
};

const ICONS = {
  checkCircle: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  x:           "M18 6L6 18 M6 6l12 12",
};

const STYLES = `
  @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 16px); } to { opacity: 1; transform: translate(-50%, 0); } }
`;

export default function Toast({ msg, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const path = ICONS[type === "success" ? "checkCircle" : "x"];

  return (
    <>
      <style>{STYLES}</style>
      <div
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          background: type === "success" ? C.dark : C.brandDk,
          color: type === "success" ? C.orange : "white",
          padding: "11px 26px",
          borderRadius: 9999,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: '"DM Sans", sans-serif',
          boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          animation: "toastIn 0.28s ease both",
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: "inline-block", flexShrink: 0, verticalAlign: "middle" }}
        >
          <path d={path} />
        </svg>
        <span>{msg}</span>
      </div>
    </>
  );
}
