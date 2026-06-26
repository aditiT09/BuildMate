import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MonitorIcon, WrenchIcon, PaletteIcon, BotIcon, CompassIcon, PenIcon, BoardIcon, TargetIcon, ChairIcon, InboxIcon, CheckIcon, LockIcon, XIcon, SaveIcon, MailIcon } from "../../components/common/Icons";

import Layout from "../../components/layout/Layout";
import { createOpportunity, getOpportunity, updateOpportunity } from "../../api/opportunities";
import { getSkills } from "../../api/userSkills";
import LoadingState from "../../components/ui/LoadingState";



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
  { label: "Frontend Dev", icon: <MonitorIcon size={14} /> },
  { label: "Backend Dev", icon: <WrenchIcon size={14} /> },
  { label: "UI/UX Designer", icon: <PaletteIcon size={14} /> },
  { label: "ML Engineer", icon: <BotIcon size={14} /> },
  { label: "Project Manager", icon: <CompassIcon size={14} /> },
  { label: "Content Writer", icon: <PenIcon size={14} /> },
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
    text-align: left; font-family: inherit;
  }
  .co-status-card.on { border-color: ${C.brand}; background: white; box-shadow: 0 0 0 4px ${C.brand}1A; }
  .co-submit:hover { background: ${C.brandDk}; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(227,83,54,0.28); }
  .co-submit:disabled { opacity: .6; cursor: wait; transform: none; }
  .co-skill-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: ${C.dark};
    color: ${C.orange};
    border-radius: 999px;
    padding: 6px 12px;
    font-family: "DM Sans", sans-serif;
    font-size: 13px;
    font-weight: 700;
    transition: all .12s ease;
  }
  .co-skill-tag button {
    background: none;
    border: none;
    color: ${C.orange};
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    padding: 0 2px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .co-skill-tag button:hover {
    color: white;
  }
  .co-suggest-box {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1.5px solid ${C.border};
    border-radius: 14px;
    margin-top: 6px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }
  .co-suggest-item {
    padding: 10px 16px;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    color: ${C.dark};
    cursor: pointer;
    transition: all .1s ease;
  }
  .co-suggest-item:hover {
    background: ${C.bg};
    color: ${C.brand};
  }
  .co-suggest-create {
    padding: 10px 16px;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: ${C.brand};
    cursor: pointer;
    background: ${C.bg};
    border-top: 1.5px solid ${C.border};
    transition: all .1s ease;
  }
  .co-suggest-create:hover {
    background: ${C.brand};
    color: white;
  }
`;

export default function CreateOpportunity() {
  const { id, opportunityId } = useParams();
  const navigate = useNavigate();

  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillQ, setSkillQ] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingOpportunity, setLoadingOpportunity] = useState(!!opportunityId);

  const [form, setForm] = useState({
    role: "",
    seats: 1,
    status: "open",
    project_id: id ? Number(id) : null,
  });


  const loadSkills = useCallback(async () => {
    try {
      const list = await getSkills();
      setAllSkills(list);
    } catch {
      // Suppressed console.error in production
    }
  }, []);

  const loadOpportunity = useCallback(async () => {
    try {
      const opp = await getOpportunity(opportunityId);
      setForm({
        role: opp.role,
        seats: opp.seats,
        status: opp.status,
        project_id: opp.project_id,
      });
      if (opp.skills) {
        setSelectedSkills(opp.skills.map((s) => ({
          id: s.skill.id,
          name: s.skill.name,
        })));
      }
    } catch {
      alert("Failed to load role details.");
    } finally {
      setLoadingOpportunity(false);
    }
  }, [opportunityId]);

  useEffect(() => {
    const init = async () => {
      await loadSkills();
      if (opportunityId) {
        await loadOpportunity();
      }
    };
    init();
  }, [opportunityId, loadSkills, loadOpportunity]);


  const handleSelectSkill = (skill) => {
    if (!selectedSkills.find((s) => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillQ("");
  };

  const handleRemoveSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
  };





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

      const payload = {
        role: form.role,
        seats: form.seats,
        status: form.status,
        project_id: Number(form.project_id),
        required_skills: selectedSkills.map(s => s.id),
      };

      if (opportunityId) {
        await updateOpportunity(opportunityId, payload);
        alert("Role updated successfully!");
        navigate(`/projects/${form.project_id}`);
      } else {
        await createOpportunity(payload);
        alert("Role created successfully!");
        navigate(`/projects/${id}`);
      }
    } catch (error) {
      alert(
        error?.response?.data?.detail ||
        `Failed to ${opportunityId ? "update" : "create"} opportunity`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingOpportunity) {
    return (
      <Layout>
        <LoadingState message="loading role details..." />
      </Layout>
    );
  }


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
              {opportunityId ? "edit role" : "new role"}
            </div>

            <h1 style={{
              fontFamily: '"Syne", sans-serif', fontWeight: 800,
              fontSize: "clamp(28px, 5.5vw, 46px)", lineHeight: 1.08,
              letterSpacing: "-0.02em", margin: 0,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}>
              {opportunityId ? "tweak the role" : "open up a spot"} <BoardIcon size={32} color="currentColor" />
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
                <label htmlFor="role" style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  what role are you after? <TargetIcon size={14} color={C.brand} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
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
                      <span style={{ display: "inline-flex", alignItems: "center" }}>{r.icon}</span> {r.label}
                    </button>
                  ))}
                </div>

                <input
                  id="role"
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
                  how many spots? <ChairIcon size={14} color={C.brand} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
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
              <div style={{ marginBottom: 22 }}>
                <label style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  taking applications? <InboxIcon size={14} color={C.brand} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
                </label>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    className={`co-status-card ${form.status === "open" ? "on" : ""}`}
                    onClick={() => setForm({ ...form, status: "open" })}
                  >
                    <CheckIcon size={20} color={C.green} />
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
                  </button>

                  <button
                    type="button"
                    className={`co-status-card ${form.status === "closed" ? "on" : ""}`}
                    onClick={() => setForm({ ...form, status: "closed" })}
                  >
                    <LockIcon size={20} color={C.brandDk} />
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
                  </button>
                </div>
              </div>

              {/* Skills Required */}
              <div>
                <label htmlFor="skills_search" style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  required tech stack <WrenchIcon size={14} color={C.brand} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
                </label>

                {/* selected skills */}
                {selectedSkills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {selectedSkills.map((skill) => (
                      <span key={skill.id} className="co-skill-tag">
                        {skill.name}
                        <button type="button" onClick={() => handleRemoveSkill(skill.id)}>
                          <XIcon size={10} color="currentColor" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ position: "relative" }}>
                  <input
                    id="skills_search"
                    type="text"
                    placeholder="search required skill..."
                    value={skillQ}
                    onChange={(e) => setSkillQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const matches = allSkills.filter(
                          (s) =>
                            s.name.toLowerCase().includes(skillQ.toLowerCase()) &&
                            !selectedSkills.some((sel) => sel.id === s.id)
                        );
                        if (matches.length > 0) {
                          handleSelectSkill(matches[0]);
                        }
                      }
                    }}
                    className="co-input"
                  />
                  {skillQ.trim().length > 0 && (
                    <div className="co-suggest-box">
                      {allSkills.filter(
                        (s) =>
                          s.name.toLowerCase().includes(skillQ.toLowerCase()) &&
                          !selectedSkills.some((sel) => sel.id === s.id)
                      ).length === 0 ? (
                        <div style={{ padding: "12px 16px", color: C.muted, fontSize: 13, fontFamily: "DM Sans" }}>
                          No matching skills found
                        </div>
                      ) : (
                        allSkills
                          .filter(
                            (s) =>
                              s.name.toLowerCase().includes(skillQ.toLowerCase()) &&
                              !selectedSkills.some((sel) => sel.id === s.id)
                          )
                          .slice(0, 5)
                          .map((skill) => (
                            <div
                              key={skill.id}
                              className="co-suggest-item"
                              onClick={() => handleSelectSkill(skill)}
                            >
                              {skill.name}
                            </div>
                          ))
                      )}
                    </div>
                  )}
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
              {loading 
                ? (opportunityId ? "saving..." : "posting...") 
                : (opportunityId ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <SaveIcon size={14} color="currentColor" /> save changes
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <MailIcon size={14} color="currentColor" /> post this role
                    </span>
                  ))}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
} 