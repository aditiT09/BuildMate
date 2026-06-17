import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProfile, saveProfile } from "../../api/profile";
import { getMySkills, getSkills, addSkill, removeSkill } from "../../api/userSkills";
import { getMyProjects } from "../../api/projects";
import { getMyApplications } from "../../api/applications";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/layout/Layout";

const C = {
  brand:"#E35336",brandDk:"#B8391F",orange:"#F4A460",
  bg:"#FFF8F0",surface:"#FDFBF7",dark:"#2B1B12",
  dark2:"#4A372D",muted:"#8C776A",border:"#E9DDD0",
  sand:"#F5EDE0",sandDk:"#EDD5B8",cream:"#FBF5EE",
  success:"#2E7D32",warn:"#D48A2D",
};

const AVAIL_OPTS = [
  "Available now","Available weekends","Available part-time",
  "Available evenings","Not available","Open to discuss",
];

const SKILL_COLORS = [
  {bg:"#FEE8E3",text:"#B8391F"},{bg:"#FDF3E8",text:"#A0560D"},
  {bg:"#E8F5E9",text:"#1B5E20"},{bg:"#E8EAF6",text:"#283593"},
  {bg:"#FCE4EC",text:"#880E4F"},{bg:"#E0F7FA",text:"#006064"},
  {bg:"#F3E5F5",text:"#4A148C"},{bg:"#FFF8E1",text:"#F57F17"},
];

const STYLES = `
  @keyframes fadeUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer {0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes toastIn {from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}
  @keyframes skillPop{0%{opacity:0;transform:scale(0.7)}60%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}
  @keyframes spin    {to{transform:rotate(360deg)}}
  @keyframes ringPulse{0%,100%{box-shadow:0 0 0 0 rgba(227,83,54,0.35)}50%{box-shadow:0 0 0 10px rgba(227,83,54,0)}}

  .pi{width:100%;padding:11px 16px;border:1.5px solid #E9DDD0;border-radius:12px;background:#FFF8F0;font-size:14px;color:#2B1B12;font-family:"DM Sans",sans-serif;transition:border-color .2s,box-shadow .2s;box-sizing:border-box;}
  .pi:focus{outline:none;border-color:#E35336;box-shadow:0 0 0 3px rgba(227,83,54,0.12);}
  .pi::placeholder{color:#8C776A;opacity:.7;}
  .lc:hover{border-color:#E35336 !important;background:#FEE8E3 !important;}
  .skill-tag:hover .sx{opacity:1 !important;}
  .addbtn:hover{background:#FEE8E3 !important;border-color:#E35336 !important;color:#E35336 !important;}
  .proj-row:hover{border-color:#E35336 !important;background:#FEE8E3 !important;}
  .tab-b{transition:all .18s ease;}
  .tab-b:hover{opacity:.85;}
  @media(max-width:768px){
    .two-col{grid-template-columns:1fr !important;}
    .form-grid{grid-template-columns:1fr !important;}
  }
`;

// ── Inline SVG Icons (no deps) ───────────────────────────
const Icon = ({ d, size = 16, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ display:"inline-block", flexShrink:0, verticalAlign:"middle" }}>
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path}/>) : <path d={d}/>}
  </svg>
);

// Path data for each icon needed
const ICONS = {
  user:       "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  edit:       "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  wrench:     "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  github:     "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  linkedin:   ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z", "M2 9h4v12H2z", "M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  globe:      ["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  arrowUpRight:"M7 17L17 7 M7 7h10v10",
  check:      "M20 6L9 17l-5-5",
  checkCircle:"M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  plus:       "M12 5v14 M5 12h14",
  x:          "M18 6L6 18 M6 6l12 12",
  search:     ["M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z", "M21 21l-4.35-4.35"],
  briefcase:  ["M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z", "M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"],
  send:       ["M22 2L11 13", "M22 2L15 22l-4-9-9-4 20-7z"],
  trendingUp: "M23 6l-9.5 9.5-5-5L1 18",
  chevronRight:"M9 18l6-6-6-6",
  layers:     ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  book:       ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
  award:      ["M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M8.21 13.89L7 23l5-3 5 3-1.21-9.12"],
  zap:        "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  star:       "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

const Ic = ({ name, size=15, color="currentColor", sw=2 }) =>
  ICONS[name] ? <Icon d={ICONS[name]} size={size} color={color} strokeWidth={sw}/> : null;

// ────────────────────────────────────────────────────────
function Skel({w="100%",h=20,r=8}){
  return <div style={{width:w,height:h,borderRadius:r,background:"linear-gradient(90deg,#f0e6da 25%,#faf5ef 50%,#f0e6da 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite"}} />;
}

function Toast({msg,type,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3000);return()=>clearTimeout(t);},[]);
  return(
    <div style={{position:"fixed",bottom:28,left:"50%",zIndex:9999,background:type==="success"?C.dark:"#B8391F",color:type==="success"?C.orange:"white",padding:"11px 26px",borderRadius:9999,fontSize:13,fontWeight:700,fontFamily:'"DM Sans",sans-serif',boxShadow:"0 8px 32px rgba(0,0,0,0.22)",display:"flex",alignItems:"center",gap:8,animation:"toastIn .28s ease both"}}>
      <Ic name={type==="success"?"checkCircle":"x"} size={14}/> {msg}
    </div>
  );
}

function ScoreRing({score=50,label,color,size=88}){
  const r=size/2-9,circ=2*Math.PI*r,pct=Math.min(score,100)/100;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.sandDk} strokeWidth={8}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
          style={{transition:"stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)"}}/>
        <text x={size/2} y={size/2+6} textAnchor="middle"
          style={{fontSize:19,fontWeight:800,fontFamily:'"Syne",sans-serif',transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`,fill:C.dark}}>
          {score}
        </text>
      </svg>
      <p style={{fontSize:10,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:C.muted,fontFamily:'"DM Sans",sans-serif'}}>{label}</p>
    </div>
  );
}

function Card({children,delay=0,style={}}){
  return(
    <div style={{background:C.surface,borderRadius:24,border:`1px solid ${C.border}`,padding:28,animation:`fadeUp .5s ease ${delay}s both`,...style}}>
      {children}
    </div>
  );
}

function STitle({children,action}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <h2 style={{fontFamily:'"Syne",sans-serif',fontWeight:800,fontSize:16,color:C.dark,display:"flex",alignItems:"center",gap:8,margin:0}}>{children}</h2>
      {action}
    </div>
  );
}

function FLabel({children,req,htmlFor}){
  return(
    <label htmlFor={htmlFor} style={{display:"block",fontSize:11,fontWeight:700,letterSpacing:".13em",textTransform:"uppercase",color:C.muted,fontFamily:'"DM Sans",sans-serif',marginBottom:6}}>
      {children}{req&&<span style={{color:C.brand}}> *</span>}
    </label>
  );
}

function LinkRow({icon,label,value}){
  if(!value)return null;
  const url=value.startsWith("http")?value:`https://${value}`;
  return(
    <a href={url} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
      <div className="lc" style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,background:C.cream,cursor:"pointer",transition:"all .18s"}}>
        <span style={{color:C.brand,flexShrink:0,display:"flex"}}>{icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:C.muted,fontFamily:'"DM Sans",sans-serif',margin:0}}>{label}</p>
          <p style={{fontSize:12,fontWeight:600,color:C.dark,fontFamily:'"DM Sans",sans-serif',overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{value}</p>
        </div>
        <Ic name="arrowUpRight" size={14} color={C.brand}/>
      </div>
    </a>
  );
}

function AvatarDisplay({src,name="",size=96}){
  const init=(name||"BM").split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase();
  return src?(
    <img src={src} alt={name} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`3px solid ${C.brand}`,animation:"ringPulse 3s ease-in-out infinite",flexShrink:0}}/>
  ):(
    <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${C.brand},${C.brandDk})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:'"Syne",sans-serif',fontWeight:800,fontSize:size*.34,color:"white",border:`3px solid ${C.sandDk}`,animation:"ringPulse 3s ease-in-out infinite",userSelect:"none",flexShrink:0}}>
      {init}
    </div>
  );
}

function CompletenessBar({profile,skills}){
  const checks=[
    {l:"Full name",d:!!profile?.full_name},{l:"Bio",d:!!profile?.bio},
    {l:"College",d:!!profile?.college},{l:"GitHub",d:!!profile?.github},
    {l:"LinkedIn",d:!!profile?.linkedin},{l:"Portfolio",d:!!profile?.portfolio},
    {l:"Availability",d:!!profile?.availability},{l:"Skills",d:skills.length>0},
  ];
  const done=checks.filter(c=>c.d).length;
  const pct=Math.round((done/checks.length)*100);
  const color=pct===100?C.success:pct>=60?C.warn:C.brand;
  return(
    <div style={{background:C.cream,borderRadius:16,padding:"16px 20px",border:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <p style={{fontFamily:'"Syne",sans-serif',fontWeight:700,fontSize:13,color:C.dark,margin:0}}>Profile completeness</p>
        <span style={{fontFamily:'"Syne",sans-serif',fontWeight:800,fontSize:22,color}}>{pct}%</span>
      </div>
      <div style={{height:8,borderRadius:4,background:C.sandDk,overflow:"hidden",marginBottom:12}}>
        <div style={{height:"100%",borderRadius:4,background:color,width:`${pct}%`,transition:"width 1.4s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 8px ${color}55`}}/>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {checks.map(c=>(
          <span key={c.l} style={{padding:"3px 10px",borderRadius:9999,fontSize:11,fontWeight:600,fontFamily:'"DM Sans",sans-serif',background:c.d?"#E8F5E9":C.sand,color:c.d?C.success:C.muted,border:`1px solid ${c.d?"#C8E6C9":C.border}`,display:"flex",alignItems:"center",gap:4}}>
            {c.d ? <Ic name="check" size={10} color={C.success} sw={3}/> : <span style={{width:10,height:10,borderRadius:"50%",border:`1.5px solid ${C.muted}`,display:"inline-block"}}/>}
            {c.l}
          </span>
        ))}
      </div>
    </div>
  );
}

function Empty({icon,msg,cta,href,onClick}){
  return(
    <div style={{textAlign:"center",padding:"24px 16px"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:10,color:C.sandDk}}>
        <Ic name={icon} size={32} color={C.sandDk} sw={1.5}/>
      </div>
      <p style={{fontSize:13,color:C.muted,fontFamily:'"DM Sans",sans-serif',marginBottom:cta?14:0,lineHeight:1.6}}>{msg}</p>
      {cta&&(href?(
        <Link to={href} style={{textDecoration:"none"}}>
          <button style={{background:C.brand,color:"white",border:"none",borderRadius:9999,padding:"8px 22px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:'"DM Sans",sans-serif'}}>{cta}</button>
        </Link>
      ):(
        <button onClick={onClick} style={{background:C.brand,color:"white",border:"none",borderRadius:9999,padding:"8px 22px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:'"DM Sans",sans-serif'}}>{cta}</button>
      ))}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────
export default function Profile(){
  const {user}=useAuth();
  const [profile,setProfile]=useState(null);
  const [skills,setSkills]=useState([]);
  const [allSkills,setAllSkills]=useState([]);
  const [projects,setProjects]=useState([]);
  const [apps,setApps]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [tab,setTab]=useState("overview");
  const [toast,setToast]=useState(null);
  const [skillQ,setSkillQ]=useState("");
  const [form,setForm]=useState({full_name:"",bio:"",college:"",degree:"",github:"",linkedin:"",portfolio:"",avatar:"",availability:""});

  useEffect(()=>{loadAll();},[]);

  const loadAll=async()=>{
    try{
      setLoading(true);
      const [prof,mySk,allSk,projs,myApps]=await Promise.all([
        getMyProfile().catch(()=>null),
        getMySkills().catch(()=>[]),
        getSkills().catch(()=>[]),
        getMyProjects().catch(()=>[]),
        getMyApplications().catch(()=>[]),
      ]);
      if(prof){
        setProfile(prof);
        setForm({full_name:prof.full_name||"",bio:prof.bio||"",college:prof.college||"",degree:prof.degree||"",github:prof.github||"",linkedin:prof.linkedin||"",portfolio:prof.portfolio||"",avatar:prof.avatar||"",availability:prof.availability||""});
      }
      setSkills(mySk);setAllSkills(allSk);setProjects(projs);setApps(myApps);
    }catch(e){fire("Failed to load profile","error");}
    finally{setLoading(false);}
  };

  const handleSave=async()=>{
    setSaving(true);
    try{
      const updated=await saveProfile(form);
      setProfile(updated);
      fire("Profile saved","success");
      setTab("overview");
    }catch(e){fire(e?.response?.data?.detail||"Save failed","error");}
    finally{setSaving(false);}
  };

  const handleAddSkill=async(id)=>{
    try{
      await addSkill(Number(id));
      const u=await getMySkills();setSkills(u);
      fire("Skill added","success");
    }catch(e){fire(e?.response?.data?.detail||"Couldn't add skill","error");}
  };

  const handleRemove=async(id)=>{
    try{
      await removeSkill(id);setSkills(s=>s.filter(sk=>sk.id!==id));
      fire("Skill removed","success");
    }catch{fire("Couldn't remove","error");}
  };

  const fire=(msg,type)=>setToast({msg,type});

  const mySkillIds=new Set(skills.map(s=>s.skill_id||s.id));
  const filteredAll=allSkills.filter(s=>!mySkillIds.has(s.id)&&(!skillQ||s.name.toLowerCase().includes(skillQ.toLowerCase())));
  const displayName=profile?.full_name||user?.name||"Builder";
  const acceptedApps=apps.filter(a=>a.status==="accepted").length;
  const successRate=apps.length?Math.round((acceptedApps/apps.length)*100):0;

  const TABS=[
    {id:"overview",l:"Overview",icon:"user"},
    {id:"edit",    l:"Edit",    icon:"edit"},
    {id:"skills",  l:"Skills",  icon:"wrench"},
  ];

  if(loading) return(
    <Layout>
      <div style={{maxWidth:1040,margin:"0 auto",padding:"32px 24px"}}>
        <div className="two-col" style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>{[300,140,160].map((h,i)=><Skel key={i} h={h} r={24}/>)}</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>{[60,200,180,160].map((h,i)=><Skel key={i} h={h} r={24}/>)}</div>
        </div>
      </div>
    </Layout>
  );

  return(
    <Layout>
      <style>{STYLES}</style>
      <div style={{minHeight:"100vh",background:C.bg}}>
        <div style={{maxWidth:1040,margin:"0 auto",padding:"28px 24px 60px"}}>

          {/* Header */}
          <div style={{marginBottom:24,animation:"fadeUp .5s ease both"}}>
            <p style={{fontSize:10,fontWeight:800,letterSpacing:".22em",textTransform:"uppercase",color:C.brand,marginBottom:6,fontFamily:'"DM Sans",sans-serif',display:"flex",alignItems:"center",gap:6}}>
              <Ic name="star" size={11} color={C.brand}/> Your Profile
            </p>
            <h1 style={{fontFamily:'"Cormorant Garamond",serif',fontWeight:700,lineHeight:.9,color:C.dark,margin:0}}>
              <span style={{fontSize:"clamp(26px,3.5vw,46px)",display:"block"}}>build something</span>
              <span style={{fontSize:"clamp(30px,4.5vw,58px)",color:C.brand,display:"block"}}>worth remembering.</span>
            </h1>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:5,marginBottom:24,background:C.surface,padding:5,borderRadius:14,border:`1px solid ${C.border}`,width:"fit-content",animation:"fadeUp .5s ease .08s both"}}>
            {TABS.map(t=>(
              <button key={t.id} className="tab-b" onClick={()=>setTab(t.id)} style={{padding:"8px 20px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:'"DM Sans",sans-serif',fontSize:13,fontWeight:700,background:tab===t.id?C.dark:"transparent",color:tab===t.id?C.orange:C.dark2,display:"flex",alignItems:"center",gap:6}}>
                <Ic name={t.icon} size={14} color={tab===t.id?C.orange:C.dark2}/> {t.l}
              </button>
            ))}
          </div>

          {/* 2-col layout */}
          <div className="two-col" style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:20,alignItems:"start"}}>

            {/* LEFT sidebar */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>

              {/* Avatar card */}
              <Card delay={0.1} style={{textAlign:"center",padding:"32px 20px"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                  <AvatarDisplay src={tab==="edit"?form.avatar:profile?.avatar} name={displayName} size={96}/>
                </div>
                <h2 style={{fontFamily:'"Syne",sans-serif',fontWeight:800,fontSize:20,color:C.dark,marginBottom:4,lineHeight:1.2}}>{displayName}</h2>
                {user?.email&&<p style={{fontSize:12,color:C.muted,fontFamily:'"DM Sans",sans-serif',marginBottom:10}}>{user.email}</p>}
                {profile?.availability&&(
                  <span style={{display:"inline-flex",alignItems:"center",gap:6,background:"#E8F5E9",color:C.success,border:"1px solid #C8E6C9",padding:"4px 14px",borderRadius:9999,fontSize:11,fontWeight:700,fontFamily:'"DM Sans",sans-serif',letterSpacing:".06em"}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:C.success,display:"inline-block"}}/>
                    {profile.availability}
                  </span>
                )}
                {profile?.college&&(
                  <p style={{fontSize:12,color:C.muted,marginTop:10,fontFamily:'"DM Sans",sans-serif',lineHeight:1.5,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    <Ic name="book" size={12} color={C.muted}/> {profile.college}{profile.degree&&` · ${profile.degree}`}
                  </p>
                )}
                <button onClick={()=>setTab(tab==="edit"?"overview":"edit")} style={{marginTop:16,width:"100%",background:tab==="edit"?C.sandDk:C.dark,color:tab==="edit"?C.dark:C.orange,border:"none",borderRadius:12,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:'"DM Sans",sans-serif',transition:"all .18s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  {tab==="edit"
                    ? <><Ic name="chevronRight" size={14} color={C.dark} sw={2.5}/> Back</>
                    : <><Ic name="edit" size={14} color={C.orange}/> Edit profile</>
                  }
                </button>
              </Card>

              {/* Scores */}
              <Card delay={0.15} style={{padding:"20px 24px"}}>
                <p style={{fontSize:10,fontWeight:800,letterSpacing:".18em",textTransform:"uppercase",color:C.muted,fontFamily:'"DM Sans",sans-serif',marginBottom:16,textAlign:"center"}}>Your scores</p>
                <div style={{display:"flex",justifyContent:"center",gap:20}}>
                  <ScoreRing score={user?.activity_score??50}    label="Activity"    color={C.brand}  size={86}/>
                  <ScoreRing score={user?.reliability_score??50} label="Reliability" color={C.orange} size={86}/>
                </div>
                <p style={{fontSize:11,color:C.muted,textAlign:"center",marginTop:12,fontFamily:'"DM Sans",sans-serif',fontStyle:"italic",lineHeight:1.5,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  <Ic name="zap" size={11} color={C.muted}/> Ship more to level up
                </p>
              </Card>

              {/* Stats */}
              <Card delay={0.2} style={{padding:"20px 24px"}}>
                <p style={{fontSize:10,fontWeight:800,letterSpacing:".18em",textTransform:"uppercase",color:C.muted,fontFamily:'"DM Sans",sans-serif',marginBottom:14}}>Stats</p>
                {[
                  {icon:"layers",      label:"Projects",     val:projects.length},
                  {icon:"send",        label:"Applications", val:apps.length},
                  {icon:"checkCircle", label:"Accepted",     val:acceptedApps},
                  {icon:"trendingUp",  label:"Success rate", val:`${successRate}%`},
                  {icon:"wrench",      label:"Skills",       val:skills.length},
                ].map(s=>(
                  <div key={s.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:13,color:C.dark2,fontFamily:'"DM Sans",sans-serif',display:"flex",alignItems:"center",gap:7}}>
                      <Ic name={s.icon} size={14} color={C.muted}/> {s.label}
                    </span>
                    <span style={{fontFamily:'"Syne",sans-serif',fontWeight:800,fontSize:16,color:C.dark}}>{s.val}</span>
                  </div>
                ))}
              </Card>

              {/* Links */}
              {(profile?.github||profile?.linkedin||profile?.portfolio)&&(
                <Card delay={0.25} style={{padding:"20px 24px"}}>
                  <p style={{fontSize:10,fontWeight:800,letterSpacing:".18em",textTransform:"uppercase",color:C.muted,fontFamily:'"DM Sans",sans-serif',marginBottom:12}}>Links</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <LinkRow icon={<Ic name="github"   size={18} color={C.brand}/>} label="GitHub"    value={profile.github}/>
                    <LinkRow icon={<Ic name="linkedin" size={18} color={C.brand}/>} label="LinkedIn"  value={profile.linkedin}/>
                    <LinkRow icon={<Ic name="globe"    size={18} color={C.brand}/>} label="Portfolio" value={profile.portfolio}/>
                  </div>
                </Card>
              )}
            </div>

            {/* RIGHT main */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>

              {/* OVERVIEW */}
              {tab==="overview"&&(
                <>
                  <div style={{animation:"fadeUp .5s ease .1s both"}}><CompletenessBar profile={profile} skills={skills}/></div>

                  <Card delay={0.15}>
                    <STitle action={<button onClick={()=>setTab("edit")} style={{background:"none",border:"none",color:C.brand,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:'"DM Sans",sans-serif',display:"flex",alignItems:"center",gap:4}}>Edit <Ic name="chevronRight" size={12} color={C.brand}/></button>}>
                      <Ic name="book" size={16} color={C.brand}/> About me
                    </STitle>
                    {profile?.bio?(
                      <p style={{fontSize:15,color:C.dark2,lineHeight:1.8,fontFamily:'"DM Sans",sans-serif',fontStyle:"italic",borderLeft:`3px solid ${C.brand}`,paddingLeft:16,margin:0}}>"{profile.bio}"</p>
                    ):(
                      <Empty icon="book" msg="No bio yet — tell the world what you're building" cta="Add bio" onClick={()=>setTab("edit")}/>
                    )}
                  </Card>

                  <Card delay={0.2}>
                    <STitle action={<button onClick={()=>setTab("skills")} style={{background:"none",border:"none",color:C.brand,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:'"DM Sans",sans-serif',display:"flex",alignItems:"center",gap:4}}>Manage <Ic name="chevronRight" size={12} color={C.brand}/></button>}>
                      <Ic name="wrench" size={16} color={C.brand}/> Skills
                    </STitle>
                    {skills.length===0?(
                      <Empty icon="wrench" msg="No skills added — recruiters can't match you without them" cta="Add skills" onClick={()=>setTab("skills")}/>
                    ):(
                      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                        {skills.map((s,i)=>{
                          const col=SKILL_COLORS[i%SKILL_COLORS.length];
                          return <span key={s.id} style={{background:col.bg,color:col.text,padding:"6px 16px",borderRadius:9999,fontSize:13,fontWeight:700,fontFamily:'"DM Sans",sans-serif',animation:`skillPop .4s ease ${i*.05}s both`}}>{s.name}</span>;
                        })}
                      </div>
                    )}
                  </Card>

                  <Card delay={0.25}>
                    <STitle action={<Link to="/my-projects" style={{textDecoration:"none"}}><button style={{background:"none",border:"none",color:C.brand,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:'"DM Sans",sans-serif',display:"flex",alignItems:"center",gap:4}}>View all <Ic name="chevronRight" size={12} color={C.brand}/></button></Link>}>
                      <Ic name="briefcase" size={16} color={C.brand}/> My Projects ({projects.length})
                    </STitle>
                    {projects.length===0?(
                      <Empty icon="layers" msg="No projects yet — every great thing starts somewhere" cta="Create project" href="/create-project"/>
                    ):(
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {projects.slice(0,4).map((p,i)=>(
                          <Link key={p.id} to={`/projects/${p.id}`} style={{textDecoration:"none"}}>
                            <div className="proj-row" style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:C.cream,border:`1px solid ${C.border}`,cursor:"pointer",transition:"all .18s",animation:`fadeUp .4s ease ${i*.06}s both`}}>
                              <div style={{width:38,height:38,borderRadius:10,background:C.sandDk,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                <Ic name="layers" size={18} color={C.dark2}/>
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <p style={{fontFamily:'"Syne",sans-serif',fontWeight:700,fontSize:14,color:C.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{p.title}</p>
                                {p.project_type&&<p style={{fontSize:11,color:C.muted,fontFamily:'"DM Sans",sans-serif',margin:0}}>{p.project_type}</p>}
                              </div>
                              <Ic name="chevronRight" size={14} color={C.muted}/>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Card>
                </>
              )}

              {/* EDIT */}
              {tab==="edit"&&(
                <Card delay={0.1}>
                  <STitle><Ic name="edit" size={16} color={C.brand}/> Edit Profile</STitle>

                  <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:22,padding:16,background:C.cream,borderRadius:16,border:`1px solid ${C.border}`}}>
                    <AvatarDisplay src={form.avatar} name={form.full_name||displayName} size={68}/>
                    <div style={{flex:1}}>
                      <FLabel htmlFor="avatar">Avatar URL</FLabel>
                      <input id="avatar" className="pi" value={form.avatar} onChange={e=>setForm(f=>({...f,avatar:e.target.value}))} placeholder="https://example.com/photo.jpg"/>
                      <p style={{fontSize:11,color:C.muted,marginTop:5,fontFamily:'"DM Sans",sans-serif'}}>Paste an image URL — GitHub avatar, Gravatar, etc.</p>
                    </div>
                  </div>

                  <div className="form-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                    {[
                      {key:"full_name",label:"Full name",ph:"Ada Lovelace",req:true},
                      {key:"college",label:"College",ph:"MIT / IIT Delhi…"},
                      {key:"degree",label:"Degree",ph:"B.Tech CSE / BSc…"},
                      {key:"github",label:"GitHub",ph:"github.com/you"},
                      {key:"linkedin",label:"LinkedIn",ph:"linkedin.com/in/you"},
                      {key:"portfolio",label:"Portfolio",ph:"yoursite.dev"},
                    ].map(({key,label,ph,req})=>(
                      <div key={key}>
                        <FLabel htmlFor={key} req={req}>{label}</FLabel>
                        <input id={key} className="pi" value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph}/>
                      </div>
                    ))}
                  </div>

                  <div style={{marginBottom:14}}>
                    <FLabel>Availability</FLabel>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                      {AVAIL_OPTS.map(opt=>(
                        <button key={opt} onClick={()=>setForm(f=>({...f,availability:opt}))} style={{padding:"7px 15px",borderRadius:9999,border:`1.5px solid ${form.availability===opt?C.brand:C.border}`,background:form.availability===opt?"#FEE8E3":C.cream,color:form.availability===opt?C.brand:C.dark2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:'"DM Sans",sans-serif',transition:"all .16s",display:"flex",alignItems:"center",gap:5}}>
                          {form.availability===opt&&<Ic name="check" size={11} color={C.brand} sw={3}/>} {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{marginBottom:22}}>
                    <FLabel htmlFor="bio">Bio</FLabel>
                    <textarea id="bio" className="pi" value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="I'm a developer who loves building things that actually ship…" rows={4} style={{resize:"vertical",lineHeight:1.65}}/>
                    <p style={{fontSize:11,color:C.muted,marginTop:5,fontFamily:'"DM Sans",sans-serif'}}>{form.bio.length}/500 characters</p>
                  </div>

                  <div style={{display:"flex",gap:10}}>
                    <button onClick={handleSave} disabled={saving} style={{background:saving?C.muted:C.brand,color:"white",border:"none",borderRadius:12,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:'"DM Sans",sans-serif',transition:"all .18s",display:"flex",alignItems:"center",gap:8}}
                      onMouseEnter={e=>{if(!saving)e.currentTarget.style.background=C.brandDk;}}
                      onMouseLeave={e=>{if(!saving)e.currentTarget.style.background=C.brand;}}>
                      {saving
                        ? <><span style={{display:"inline-block",width:13,height:13,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"white",animation:"spin .7s linear infinite"}}/> Saving…</>
                        : <><Ic name="award" size={14} color="white"/> Save changes</>
                      }
                    </button>
                    <button onClick={()=>setTab("overview")} style={{background:"transparent",color:C.dark2,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"12px 20px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:'"DM Sans",sans-serif',transition:"all .18s"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=C.dark}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      Cancel
                    </button>
                  </div>
                </Card>
              )}

              {/* SKILLS */}
              {tab==="skills"&&(
                <>
                  <Card delay={0.1}>
                    <STitle><Ic name="wrench" size={16} color={C.brand}/> My Skills ({skills.length})</STitle>
                    {skills.length===0?(
                      <Empty icon="wrench" msg="No skills yet — add some below to get matched with projects"/>
                    ):(
                      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                        {skills.map((s,i)=>{
                          const col=SKILL_COLORS[i%SKILL_COLORS.length];
                          return(
                            <span key={s.id} className="skill-tag" style={{display:"inline-flex",alignItems:"center",gap:6,background:col.bg,color:col.text,padding:"7px 14px 7px 16px",borderRadius:9999,fontSize:13,fontWeight:700,fontFamily:'"DM Sans",sans-serif',border:`1.5px solid ${col.bg}`,animation:`skillPop .4s ease ${i*.04}s both`,position:"relative"}}>
                              {s.name}
                              <button className="sx" onClick={()=>handleRemove(s.id)} style={{background:"rgba(0,0,0,0.15)",border:"none",color:"inherit",width:18,height:18,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .18s",padding:0}}>
                                <Ic name="x" size={9} color="currentColor" sw={3}/>
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </Card>

                  <Card delay={0.15}>
                    <STitle><Ic name="plus" size={16} color={C.brand}/> Add Skills</STitle>
                    <div style={{position:"relative",marginBottom:14}}>
                      <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",display:"flex",pointerEvents:"none"}}>
                        <Ic name="search" size={14} color={C.muted}/>
                      </span>
                      <input className="pi" value={skillQ} onChange={e=>setSkillQ(e.target.value)} placeholder="Search skills…" style={{paddingLeft:36}}/>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8,maxHeight:280,overflowY:"auto"}}>
                      {filteredAll.length===0?(
                        <p style={{fontSize:13,color:C.muted,fontStyle:"italic",fontFamily:'"DM Sans",sans-serif'}}>{skillQ?"No matches":"You've added all available skills!"}</p>
                      ):filteredAll.map((s,i)=>(
                        <button key={s.id} className="addbtn" onClick={()=>handleAddSkill(s.id)} style={{background:C.cream,color:C.dark2,border:`1.5px solid ${C.border}`,padding:"7px 16px",borderRadius:9999,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:'"DM Sans",sans-serif',transition:"all .16s",animation:`fadeUp .3s ease ${i*.03}s both`,display:"flex",alignItems:"center",gap:5}}>
                          <Ic name="plus" size={12} color="currentColor" sw={2.5}/> {s.name}
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </Layout>
  );
}