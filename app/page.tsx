"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Activity, AlertOctagon, ArrowDownToLine, BrainCircuit, CheckCircle2, ChevronRight, FileUp, Filter, Gauge, LoaderCircle, LockKeyhole, Network, RefreshCw, Search, Shield, ShieldAlert, Sparkles, UploadCloud, X } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Incident } from "@/lib/types";
import LogoutButton from "@/components/LogoutButton";

type Stats = { events:number; users:number; critical:number; high:number; medium:number; low:number };
const initialStats:Stats = {events:0,users:0,critical:0,high:0,medium:0,low:0};

function parseCsv(text:string):Record<string,unknown>[] {
  const lines=text.replace(/^\uFEFF/,"").split(/\r?\n/).filter(line=>line.trim());
  if(lines.length<2) throw new Error("CSV must contain a header row and at least one event.");
  const split=(line:string)=>{
    const cells:string[]=[];let value="",quoted=false;
    for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&line[i+1]==='"'&&quoted){value+='"';i++;}else if(c==='"')quoted=!quoted;else if(c===","&&!quoted){cells.push(value.trim());value="";}else value+=c;}
    cells.push(value.trim());return cells;
  };
  const headers=split(lines[0]);
  return lines.slice(1).map(line=>{const cells=split(line);return Object.fromEntries(headers.map((h,i)=>[h,cells[i]??""]));});
}
function fmtTime(s:string){const d=new Date(s);return Number.isNaN(d.getTime())?s:d.toLocaleString([],{month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"});}
function severityClass(s:string){return "severity severity-"+s.toLowerCase();}
function saveCsv(name:string, rows:string[][]){
  const csv=rows.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}

export default function Home(){
  const [incidents,setIncidents]=useState<Incident[]>([]);
  const [stats,setStats]=useState<Stats>(initialStats);
  const [selectedId,setSelectedId]=useState("");
  const [loading,setLoading]=useState(false);
  const [query,setQuery]=useState("");
  const [severityFilter,setSeverityFilter]=useState("All");
  const [error,setError]=useState("");
  const [copilot,setCopilot]=useState("");
  const [copilotLoading,setCopilotLoading]=useState(false);
  const [copilotMode,setCopilotMode]=useState("");
  const [sourceName,setSourceName]=useState("No data loaded");
  const selected=incidents.find(i=>i.id===selectedId)||incidents[0];
  const filtered=useMemo(()=>incidents.filter(i=>(severityFilter==="All"||i.severity===severityFilter)&&`${i.user} ${i.title} ${i.id}`.toLowerCase().includes(query.toLowerCase())),[incidents,severityFilter,query]);
  const chartData=useMemo(()=>incidents.slice(0,8).map(i=>({time:i.user,risk:i.score})),[incidents]);

  async function analyse(payload:unknown,label:string){
    setLoading(true);setError("");setCopilot("");setCopilotMode("");
    try{const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await res.json();if(!res.ok)throw new Error(data.error||"Analysis failed.");setIncidents(data.incidents);setStats(data.stats);setSelectedId(data.incidents[0]?.id||"");setSourceName(label);}
    catch(e){setError(e instanceof Error?e.message:"Unexpected error while analysing events.");}
    finally{setLoading(false);}
  }
  async function uploadFile(event:ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0];if(!file)return;
    if(!file.name.toLowerCase().endsWith(".csv")){setError("Please select a .csv file.");return;}
    try{await analyse({events:parseCsv(await file.text())},file.name);}catch(e){setError(e instanceof Error?e.message:"Could not parse CSV.");}
    event.target.value="";
  }
  async function askCopilot(){
    if(!selected)return;setCopilotLoading(true);setCopilot("");setError("");
    try{const res=await fetch("/api/copilot",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({incident:selected})});const data=await res.json();if(!res.ok)throw new Error(data.error||"Copilot request failed.");setCopilot(data.answer);setCopilotMode(data.mode);}
    catch(e){setError(e instanceof Error?e.message:"Copilot request failed.");}finally{setCopilotLoading(false);}
  }
  function exportReport(){
    saveCsv("breachlens-incident-report.csv",[["incident_id","user","severity","risk_score","status","event_count","summary"],...incidents.map(i=>[i.id,i.user,i.severity,String(i.score),i.status,String(i.eventCount),i.summary])]);
  }
  const chartScore=chartData.length?chartData:[{time:"No data",risk:0}];

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><Shield size={21}/></div><div><b>BreachLens<span> AI</span></b><small>SECURITY INTELLIGENCE</small></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="nav-item active"><Activity size={17}/> Overview <span className="nav-dot"/></button>
      <button className="nav-item" onClick={()=>document.getElementById("incidents")?.scrollIntoView({behavior:"smooth"})}><AlertOctagon size={17}/> Incidents <span className="nav-count">{incidents.length}</span></button>
      <button className="nav-item" onClick={()=>document.getElementById("events")?.scrollIntoView({behavior:"smooth"})}><Network size={17}/> Event timeline</button>
      <button className="nav-item" onClick={()=>document.getElementById("copilot")?.scrollIntoView({behavior:"smooth"})}><BrainCircuit size={17}/> AI Copilot</button>
      <div className="sidebar-bottom"><div className="status-light"/><div><b>Detection engine ready</b><small>Local analysis enabled</small></div></div>
      <div className="sidebar-foot">BREACHLENS BUILD 1.0.0<br/>DEFENSIVE SECURITY MVP</div>
    </aside>
    <section className="main">
      <header className="topbar"><div className="crumb">Workspace <ChevronRight size={14}/> <b>Security overview</b></div><div className="top-actions"><span className="live-pill"><span/> LOCAL ANALYSIS</span><div className="avatar">BL</div><LogoutButton/></div></header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow">SECURITY OPERATIONS / OVERVIEW</div><h1>Threat intelligence overview</h1><p>Correlate security events, investigate risk, and prioritise response.</p></div><div className="heading-actions"><button className="button secondary" onClick={()=>analyse({mode:"sample"},"Built-in demo dataset")} disabled={loading}><RefreshCw size={15}/> {loading?"Analysing…":"Load demo data"}</button><label className="button primary"><UploadCloud size={16}/> Upload CSV<input type="file" accept=".csv,text/csv" hidden onChange={uploadFile}/></label></div></div>
        {error&&<div className="error-banner"><AlertOctagon size={17}/><span>{error}</span><button onClick={()=>setError("")}><X size={15}/></button></div>}
        <div className="source-line"><span className="source-dot"/> SOURCE: <b>{sourceName}</b><span className="source-divider"/> ENGINE: <b>EXPLAINABLE RULES</b><span className="source-divider"/> <span className="muted">No live SIEM connected</span></div>
        <div className="metric-grid">
          <Metric icon={<Activity size={18}/>} label="Events analysed" value={stats.events.toLocaleString()} sub="In current analysis" tone="blue"/>
          <Metric icon={<AlertOctagon size={18}/>} label="Critical incidents" value={String(stats.critical)} sub="Immediate analyst review" tone="red"/>
          <Metric icon={<ShieldAlert size={18}/>} label="High risk" value={String(stats.high)} sub="Prioritise investigation" tone="orange"/>
          <Metric icon={<Gauge size={18}/>} label="Accounts observed" value={String(stats.users)} sub="Unique user identities" tone="purple"/>
        </div>
        <div className="overview-grid">
          <section className="panel chart-panel"><div className="panel-heading"><div><h2>Risk signal overview</h2><p>Ranked user risk scores from current event set</p></div><span className="panel-icon"><Activity size={17}/></span></div>
            <div className="chart-wrap">{incidents.length?<ResponsiveContainer width="100%" height="100%"><AreaChart data={chartScore} margin={{top:10,right:10,left:-20,bottom:0}}><defs><linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#41d6ad" stopOpacity={0.26}/><stop offset="100%" stopColor="#41d6ad" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid stroke="#202a39" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="time" tick={{fill:"#8491a5",fontSize:10}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{fill:"#8491a5",fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#111b29",border:"1px solid #293548",borderRadius:10,color:"#e9f0f8"}}/><Area type="monotone" dataKey="risk" name="Risk score" stroke="#41d6ad" strokeWidth={2.5} fill="url(#riskFill)"/></AreaChart></ResponsiveContainer>:<Empty text="Load demo data or upload a CSV to see risk signals."/>}</div><div className="chart-legend"><span><i className="legend-dot green"/>Risk score</span><span className="muted">0–99 heuristic triage score</span></div>
          </section>
          <section className="panel severity-panel"><div className="panel-heading"><div><h2>Severity distribution</h2><p>Incidents grouped by risk level</p></div><span className="panel-icon"><Gauge size={17}/></span></div>
            <div className="severity-bars">{(["Critical","High","Medium","Low"] as const).map(s=>{const n=stats[s.toLowerCase() as keyof Stats] as number;return <div className="severity-row" key={s}><div className="severity-label"><span className={"severity-dot "+s.toLowerCase()}/>{s}<b>{n}</b></div><div className="bar-track"><div className={"bar-fill "+s.toLowerCase()} style={{width:`${n/Math.max(1,incidents.length)*100}%`}}/></div></div>;})}</div>
            <div className="severity-note"><Shield size={16}/><span>Risk scores are heuristic indicators, not proof of compromise.</span></div>
          </section>
        </div>
        <section className="panel incidents-panel" id="incidents"><div className="panel-heading"><div><h2>Prioritised incidents <span className="sub-count">{incidents.length}</span></h2><p>Grouped by user identity to surface patterns across event types</p></div><button className="button small secondary" onClick={exportReport} disabled={!incidents.length}><ArrowDownToLine size={15}/> Export report</button></div>
          <div className="table-tools"><div className="searchbox"><Search size={15}/><input placeholder="Search users or incidents..." value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="filterbox"><Filter size={15}/><select value={severityFilter} onChange={e=>setSeverityFilter(e.target.value)}><option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div></div>
          <div className="table-scroll"><table><thead><tr><th>INCIDENT / USER</th><th>SEVERITY</th><th>RISK SCORE</th><th>EVENTS</th><th>LAST OBSERVED</th><th/></tr></thead><tbody>
            {filtered.map(i=><tr key={i.id} className={selected?.id===i.id?"selected-row":""} onClick={()=>{setSelectedId(i.id);setCopilot("");}}><td><div className="incident-name"><span className={"incident-symbol "+i.severity.toLowerCase()}><ShieldAlert size={16}/></span><div><b>{i.title}</b><small>{i.user} · {i.id}</small></div></div></td><td><span className={severityClass(i.severity)}>{i.severity}</span></td><td><div className="score-cell"><div className="mini-track"><div className={i.score>=85?"critical-fill":i.score>=65?"high-fill":i.score>=40?"medium-fill":"low-fill"} style={{width:`${i.score}%`}}/></div><b>{i.score}</b></div></td><td>{i.eventCount}</td><td className="muted">{fmtTime(i.lastSeen)}</td><td><ChevronRight size={16} className="row-chevron"/></td></tr>)}
            {!filtered.length&&<tr><td colSpan={6}><Empty text={incidents.length?"No incidents match these filters.":"No analysis yet. Load demo data to begin."}/></td></tr>}
          </tbody></table></div>
        </section>
        {selected&&<div className="detail-grid">
          <section className="panel detail-panel"><div className="panel-heading"><div><div className="eyebrow">INCIDENT INVESTIGATION</div><h2>{selected.title}</h2><p>{selected.id} <span className="bullet">·</span> User: <b>{selected.user}</b></p></div><span className={severityClass(selected.severity)}>{selected.severity}</span></div>
            <div className="risk-summary"><div className="risk-number">{selected.score}<small>/99</small></div><div className="risk-copy"><b>Risk score</b><p>{selected.summary}</p></div></div>
            <h3 className="section-label">Evidence and findings</h3><div className="findings">{selected.findings.map((f,idx)=><div className="finding" key={idx}><div className="finding-check"><AlertOctagon size={15}/></div><div><b>{f.title}</b><p>{f.detail}</p></div><span>+{f.points}</span></div>)}</div>
            <h3 className="section-label">Recommended next actions</h3><ol className="action-list">{selected.recommendedActions.map((a,i)=><li key={i}><span>{i+1}</span>{a}</li>)}</ol>
          </section>
          <section className="panel copilot-panel" id="copilot"><div className="copilot-title"><div className="ai-mark"><Sparkles size={18}/></div><div><h2>AI incident copilot</h2><p>Evidence-grounded investigation assistant</p></div><span className="ai-badge">AI</span></div>
            <div className="copilot-intro"><BrainCircuit size={22}/><div><b>Investigate this incident</b><p>Generate an analyst-ready assessment from the selected incident's evidence and recommended actions.</p></div></div>
            <button className="button ai-button" onClick={askCopilot} disabled={copilotLoading}>{copilotLoading?<LoaderCircle size={16} className="spin"/>:<Sparkles size={16}/>} {copilotLoading?"Analysing evidence...":"Generate investigation summary"}</button>
            {copilot&&<div className="copilot-answer"><div className="answer-head"><CheckCircle2 size={15}/> ASSESSMENT GENERATED <span>{copilotMode}</span></div><pre>{copilot}</pre></div>}
            {!copilot&&<div className="copilot-placeholder"><BrainCircuit size={17}/><span>Outputs include an assessment, supporting evidence, next steps, and caveats. Gemini is optional; a deterministic fallback is included.</span></div>}
            <div className="privacy-note"><LockKeyhole size={14}/> Only send approved log data to external AI services. The local rule engine works without an API key.</div>
          </section>
        </div>}
        {selected&&<section className="panel events-panel" id="events"><div className="panel-heading"><div><h2>Event timeline</h2><p>Events associated with the selected user · {selected.events.length} records</p></div><span className="timeline-badge"><Activity size={14}/> Correlated activity</span></div><div className="event-list">{selected.events.map((e,i)=><div className="event-row" key={e.id}><div className="event-rail"><span className={/failed|bypass|export|download|upload|role_assumption/i.test(e.action)?"event-dot risky":"event-dot"}/>{i<selected.events.length-1&&<i/>}</div><div className="event-time">{fmtTime(e.timestamp)}</div><div className="event-main"><b>{e.action.replace(/_/g," ")}</b><small>{e.event_type} · {e.resource}</small></div><div className="event-ip">{e.source_ip}</div><span className={"event-status "+(e.status==="failed"||e.status==="blocked"?"bad":"")}>{e.status||"unknown"}</span><span className="event-id">{e.id}</span></div>)}</div></section>}
        <footer>BREACHLENS AI <span>·</span> Explainable security triage <span>·</span> Demo data is synthetic. Not a replacement for a production SIEM or incident-response process.</footer>
      </div>
    </section>
  </main>;
}
function Metric({icon,label,value,sub,tone}:{icon:React.ReactNode;label:string;value:string;sub:string;tone:string}) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className={"metric-icon "+tone}>{icon}</span></div><div className="metric-value">{value}</div><div className="metric-sub"><span className="metric-status-dot"/> {sub}</div></div>;
}
function Empty({text}:{text:string}) {return <div className="empty-state"><Shield size={22}/><span>{text}</span></div>;}
