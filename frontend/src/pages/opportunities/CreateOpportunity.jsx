import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import { createOpportunity } from "../../api/opportunities";

const C = {
  brand:   "#E35336",
  brandDk: "#B8391F",
  orange:  "#F4A460",
  dark:    "#2B1B12",
  dark2:   "#4A372D",
  muted:   "#8C776A",
  border:  "#E9DDD0",
  bg:      "#FFF8F0",
  surface: "#FDFBF7",
  sand:    "#F5EDE0",
};

const ROLE_PRESETS = [
  { label: "Frontend Dev", emoji: "🖥️" },
  { label: "Backend Dev", emoji: "🛠️" },
  { label: "UI/UX Designer", emoji: "🎨" },
  { label: "ML Engineer", emoji: "🤖" },
  { label: "Project Manager", emoji: "🧭" },
  { label: "Content Writer", emoji: "✍️" },
];

const STYLES = `
  @keyframes floatIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
  .co-fade { animation: floatIn .35s ease both; }
  .co-input {
    width: 100%;
    border: 1.5px solid ${C.border};
    border-radius: 14px;
    padding: 14px 16px;
    font-family: "DM Sans", sans-serif;
    font-size: 15px;
    color: ${C.dark};
    background: ${C.bg};
    transition: all .15s ease;
    box-sizing: border-box;
  }
  .co-input:focus {
    outline: none;
    border-color: ${C.brand};
    background: white;
    box-shadow: 0 0 0 4px ${C.brand}1A;
  }
  .co-input::placeholder { color: ${C.muted}; opacity: .7; }
  .co-chip {
    cursor: pointer; border: 1.5px solid ${C.border};
    background: ${C.bg}; border-radius: 999px;
    padding: 8px 16px; font-family: "DM Sans", sans-serif;
    font-size: 13px; font-weight: 700; color: ${C.dark2};
    transition: all .15s ease; display: flex; align-items: center; gap: 6px;
  }
  .co-chip:hover { border-color: ${C.brand}; transform: translateY(-1px); }
  .co-chip.on { background: ${C.dark}; color: ${C.orange}; border-color: ${C.dark}; }
  .co-stepper-btn {
    width: 40px; height: 40px; border-radius: 12px;
    border: 1.5px solid ${C.border}; background: ${C.bg};
    font-family: "Syne", sans-serif; font-weight: 800; font-size: 18px;
    color: ${C.dark}; cursor: pointer; transition: all .15s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .co-stepper-btn:hover { border-color: ${C.brand}; color: ${C.brand}; }
  .co-status-card {
    flex: 1; border: 1.5px solid ${C.border}; border-radius: 14px;
    padding: 14px 16px; cursor: pointer; transition: all .15s ease;
    background: ${C.bg};
    display: flex; align-items: center; gap: 10px;
  }
  .co-status-card.on { border-color: ${C.brand}; background: white; box-shadow: 0 0 0 4px ${C.brand}1A; }
  .co-submit:hover { background: ${C.brandDk}; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(227,83,54,0.28); }
  .co-submit:disabled { opacity: .6; cursor: wait; transform: none; }
`;

export default function CreateOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "",
    seats: 1,
    status: "open",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "seats"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const adjustSeats = (delta) => {
    setForm((f) => ({ ...f, seats: Math.max(1, f.seats + delta) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createOpportunity({
        ...form,
        project_id: Number(id),
      });

      alert("Opportunity created!");

      navigate(`/projects/${id}`);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.detail ||
        "Failed to create opportunity"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <style>{STYLES}</style>
      <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 80 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 20px 0" }}>

          {/* back */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700,
              color: C.muted, marginBottom: 18, padding: 0,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ← back
          </button>

          {/* HERO */}
          <div className="co-fade" style={{
            position: "relative",
            background: C.dark, color: C.bg,
            borderRadius: 28, padding: "40px 36px",
            marginBottom: 28,
            boxShadow: "0 14px 40px rgba(43,27,18,0.18)",
            transform: "rotate(-1deg)",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: C.orange, color: C.dark,
              padding: "4px 12px", borderRadius: 999,
              fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800,
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 18,
            }}>
              new role
            </div>

            <h1 style={{
              fontFamily: '"Syne", sans-serif', fontWeight: 800,
              fontSize: "clamp(28px, 5.5vw, 46px)", lineHeight: 1.08,
              letterSpacing: "-0.02em", margin: 0,
            }}>
              open up a spot 🪧
            </h1>

            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 14,
              color: "rgba(255,248,240,0.7)", marginTop: 14, maxWidth: 480, lineHeight: 1.6,
            }}>
              tell people what role you're hunting for, how many spots are open, and whether you're still taking applications.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="co-fade" style={{
              background: C.surface, border: `1.5px solid ${C.border}`,
              borderRadius: 22, padding: "30px 30px", marginBottom: 28,
              transform: "rotate(0.6deg)",
            }}>

              {/* Role */}
              <div style={{ marginBottom: 22 }}>
                <label style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  what role are you after? 🎯
                </label>

                {/* preset chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  {ROLE_PRESETS.map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      className={`co-chip ${form.role === r.label ? "on" : ""}`}
                      onClick={() => setForm({ ...form, role: r.label })}
                    >
                      <span>{r.emoji}</span> {r.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  name="role"
                  placeholder="...or type your own role"
                  value={form.role}
                  onChange={handleChange}
                  className="co-input"
                  required
                />
              </div>

              {/* Seats */}
              <div style={{ marginBottom: 22 }}>
                <label style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  how many spots? 🪑
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button type="button" className="co-stepper-btn" onClick={() => adjustSeats(-1)}>
                    −
                  </button>
                  <div style={{
                    flex: 1, textAlign: "center",
                    fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 22, color: C.dark,
                    border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "10px 0",
                    background: C.bg,
                  }}>
                    {form.seats} seat{form.seats !== 1 ? "s" : ""}
                  </div>
                  <button type="button" className="co-stepper-btn" onClick={() => adjustSeats(1)}>
                    +
                  </button>
                </div>
              </div>

              {/* Status */}
              <div>
                <label style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  taking applications? 📥
                </label>
                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    className={`co-status-card ${form.status === "open" ? "on" : ""}`}
                    onClick={() => setForm({ ...form, status: "open" })}
                  >
                    <span style={{ fontSize: 20 }}>✅</span>
                    <div>
                      <p style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 14, color: C.dark, margin: 0,
                      }}>
                        open
                      </p>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: C.muted, margin: 0,
                      }}>
                        people can apply now
                      </p>
                    </div>
                  </div>

                  <div
                    className={`co-status-card ${form.status === "closed" ? "on" : ""}`}
                    onClick={() => setForm({ ...form, status: "closed" })}
                  >
                    <span style={{ fontSize: 20 }}>🔒</span>
                    <div>
                      <p style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 14, color: C.dark, margin: 0,
                      }}>
                        closed
                      </p>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: C.muted, margin: 0,
                      }}>
                        not accepting rn
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="co-submit"
              style={{
                background: C.brand, color: "white", border: "none",
                borderRadius: 999, padding: "16px 32px",
                fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 16,
                cursor: loading ? "wait" : "pointer", transition: "all .18s ease",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              {loading ? "posting..." : "📬 post this role"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}