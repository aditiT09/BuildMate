import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobeIcon, SmartphoneIcon, BotIcon, PaletteIcon, ZapIcon, LockOpenIcon, RocketIcon, TagIcon, MessageIcon, TimelineIcon, FolderIcon, TargetIcon, XIcon, SaveIcon } from "../../components/common/Icons";

import Layout from "../../components/layout/Layout";
import {
  createProject,
  getProjectById,
  updateProject,
} from "../../api/projects";
import { getSkills } from "../../api/userSkills";
import { addProjectSkill, getProjectSkills, removeProjectSkill } from "../../api/projectSkills";
import { getErrorMessage } from "../../utils/validation";
import { useToast } from "../../hooks/useToast";

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

const TYPE_PRESETS = [
  { label: "Web App", icon: <GlobeIcon size={14} /> },
  { label: "Mobile App", icon: <SmartphoneIcon size={14} /> },
  { label: "AI / ML", icon: <BotIcon size={14} /> },
  { label: "Design", icon: <PaletteIcon size={14} /> },
  { label: "Hackathon", icon: <ZapIcon size={14} /> },
  { label: "Open Source", icon: <LockOpenIcon size={14} /> },
];

const STYLES = `
  @keyframes floatIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
  @keyframes spin { to { transform: rotate(360deg) } }
  .cp-fade { animation: floatIn .35s ease both; }
  .cp-input {
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
  .cp-input:focus {
    outline: none;
    border-color: ${C.brand};
    background: white;
    box-shadow: 0 0 0 4px ${C.brand}1A;
  }
  .cp-input::placeholder { color: ${C.muted}; opacity: .7; }
  .cp-chip {
    cursor: pointer; border: 1.5px solid ${C.border};
    background: ${C.bg}; border-radius: 999px;
    padding: 8px 16px; font-family: "DM Sans", sans-serif;
    font-size: 13px; font-weight: 700; color: ${C.dark2};
    transition: all .15s ease; display: flex; align-items: center; gap: 6px;
  }
  .cp-chip:hover { border-color: ${C.brand}; transform: translateY(-1px); }
  .cp-chip.on { background: ${C.dark}; color: ${C.orange}; border-color: ${C.dark}; }
  .cp-submit:hover { background: ${C.brandDk}; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(227,83,54,0.28); }
  .cp-submit:disabled { opacity: .6; cursor: wait; transform: none; }
  .cp-skill-tag {
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
  .cp-skill-tag button {
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
  .cp-skill-tag button:hover {
    color: white;
  }
  .cp-suggest-box {
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
  .cp-suggest-item {
    padding: 10px 16px;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    color: ${C.dark};
    cursor: pointer;
    transition: all .1s ease;
  }
  .cp-suggest-item:hover {
    background: ${C.bg};
    color: ${C.brand};
  }
  .cp-suggest-create {
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
  .cp-suggest-create:hover {
    background: ${C.brand};
    color: white;
  }
`;

export default function CreateProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    timeline: "",
    project_type: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(!!id);

  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [initialSkills, setInitialSkills] = useState([]);
  const [skillQ, setSkillQ] = useState("");

  const loadSkills = useCallback(async () => {
    try {
      const list = await getSkills();
      setAllSkills(list);
    } catch (error) {
      console.error("Failed to load skills list:", error);
    }
  }, []);

  const loadProject = useCallback(async () => {
    try {
      const project = await getProjectById(id);
      setForm({
        title: project.title,
        description: project.description,
        timeline: project.timeline,
        project_type: project.project_type,
      });
      const currentSkills = await getProjectSkills(id);
      setSelectedSkills(currentSkills);
      setInitialSkills(currentSkills);
    } catch (error) {
      console.error(error);
      toast(error?.response?.data?.detail || "Failed to load project.", "error");
    } finally {
      setLoadingProject(false);
    }
  }, [id, toast]);

  useEffect(() => {
    const init = async () => {
      await loadSkills();
      if (id) {
        await loadProject();
      }
    };
    init();
  }, [id, loadSkills, loadProject]);

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        timeline: form.timeline.trim(),
        project_type: form.project_type.trim(),
      };

      if (payload.title.length < 3) {
        toast("Project title must be at least 3 characters.", "error");
        return;
      }

      if (payload.description.length < 20) {
        toast("Project description must be at least 20 characters.", "error");
        return;
      }

      if (payload.timeline.length < 2) {
        toast("Timeline must be at least 2 characters.", "error");
        return;
      }

      if (payload.project_type.length < 2) {
        toast("Please choose or enter a project type.", "error");
        return;
      }

      let project;
      if (id) {
        project = await updateProject(id, payload);
        
        const initialIds = initialSkills.map(s => s.id);
        const selectedIds = selectedSkills.map(s => s.id);
        
        const toAdd = selectedSkills.filter(s => !initialIds.includes(s.id));
        const toRemove = initialSkills.filter(s => !selectedIds.includes(s.id));
        
        await Promise.all([
          ...toAdd.map(s => addProjectSkill(id, s.id)),
          ...toRemove.map(s => removeProjectSkill(id, s.id))
        ]);
        
        toast("Project updated successfully!", "success");
      } else {
        project = await createProject(payload);

        const validSelectedSkills = selectedSkills.filter((skill) => (
          Number.isFinite(Number(skill.id))
        ));

        await Promise.all(
          validSelectedSkills.map(s => addProjectSkill(project.id, s.id))
        );
        
        toast("Project created successfully!", "success");
      }

      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error(error);
      toast(getErrorMessage(error?.response?.data?.detail) || `Failed to ${id ? "update" : "create"} project`, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProject) {
    return (
      <Layout>
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            fontFamily: '"Syne", sans-serif', fontSize: 14, fontWeight: 700,
            color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{
              width: 16, height: 16, borderRadius: "50%",
              border: `2px solid ${C.border}`, borderTopColor: C.brand,
              animation: "spin 0.8s linear infinite",
            }} />
            pulling up your draft...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
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
            {"\u2190"} back
          </button>

          {/* HERO */}
          <div className="cp-fade" style={{
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
              {id ? "editing" : "new drop"}
            </div>

            <h1 style={{
              fontFamily: '"Syne", sans-serif', fontWeight: 800,
              fontSize: "clamp(28px, 5.5vw, 46px)", lineHeight: 1.08,
              letterSpacing: "-0.02em", margin: 0,
            }}>
              {id ? "tweak your project" : "put your idea out there"}
            </h1>

            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 14,
              color: "rgba(255,248,240,0.7)", marginTop: 14, maxWidth: 480, lineHeight: 1.6,
            }}>
              {id
                ? "update the details — your team will see the latest version instantly."
                : "give it a name, a vibe, and a rough plan. teammates will find their way in"} <RocketIcon size={14} color="rgba(255,248,240,0.7)" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="cp-fade" style={{
              background: C.surface, border: `1.5px solid ${C.border}`,
              borderRadius: 22, padding: "30px 30px", marginBottom: 28,
              transform: "rotate(0.6deg)",
            }}>

              {/* Title */}
              <div style={{ marginBottom: 22 }}>
                <label htmlFor="title" style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  what's it called? <TagIcon size={14} color={C.brand} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. campus carpool app"
                  value={form.title}
                  onChange={handleChange}
                  className="cp-input"
                  required
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: 22 }}>
                <label htmlFor="description" style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  what's the pitch? <MessageIcon size={14} color={C.brand} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="what are you building, why does it matter, and what kind of help are you after?"
                  value={form.description}
                  onChange={handleChange}
                  className="cp-input"
                  style={{ minHeight: 160, resize: "vertical", fontFamily: '"DM Sans", sans-serif', lineHeight: 1.6 }}
                  required
                />
              </div>

              {/* Timeline */}
              <div style={{ marginBottom: 22 }}>
                <label htmlFor="timeline" style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  how long's the grind? <TimelineIcon size={14} color={C.brand} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
                </label>
                <input
                  id="timeline"
                  type="text"
                  name="timeline"
                  placeholder="e.g. 6-8 weeks"
                  value={form.timeline}
                  onChange={handleChange}
                  className="cp-input"
                  required
                />
              </div>

              {/* Project Type */}
              <div style={{ marginBottom: 22 }}>
                <label htmlFor="project_type" style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  what kind of project? <FolderIcon size={14} color={C.brand} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
                </label>

                {/* preset chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  {TYPE_PRESETS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      className={`cp-chip ${form.project_type === t.label ? "on" : ""}`}
                      onClick={() => setForm({ ...form, project_type: t.label })}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center" }}>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>

                <input
                  id="project_type"
                  type="text"
                  name="project_type"
                  placeholder="...or type your own"
                  value={form.project_type}
                  onChange={handleChange}
                  className="cp-input"
                  required
                />
              </div>

              {/* Skills Required */}
              <div>
                <label htmlFor="skills_search" style={{
                  display: "block", marginBottom: 8,
                  fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 14, color: C.dark,
                }}>
                  skills required <TargetIcon size={14} color={C.brand} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }} />
                </label>

                {/* selected skills */}
                {selectedSkills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {selectedSkills.map((skill) => (
                      <span key={skill.id} className="cp-skill-tag">
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
                    className="cp-input"
                  />
                  {skillQ.trim().length > 0 && (
                    <div className="cp-suggest-box">
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
                              className="cp-suggest-item"
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
              className="cp-submit"
              style={{
                background: C.brand, color: "white", border: "none",
                borderRadius: 999, padding: "16px 32px",
                fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 16,
                cursor: loading ? "wait" : "pointer", transition: "all .18s ease",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              {loading
                ? (id ? "saving..." : "publishing...")
                : (id ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <SaveIcon size={14} color="currentColor" /> save changes
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <RocketIcon size={14} color="currentColor" /> publish it
                    </span>
                  ))}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
