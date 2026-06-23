'use client'
import { useState, useEffect, Suspense, Fragment } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'

interface Engine {
  n: string; s: number; desc?: string; color: string
  sentiment?: string; citations?: string[]; status?: string
}
interface Comp   { n: string; s: number; isYou?: boolean; gap?: string }
interface Fix    { priority: string; title: string; desc: string }
interface QueryProbe { engine: string; query: string; response: string; cited: boolean }
interface TrendPoint { week: string; score: number }
interface Result {
  score: number; mentions: number; sentiment: string; engines_citing: string
  engines: Engine[]; comps: Comp[]; fixes: Fix[]
  eeat: { experience:number; expertise:number; authority:number; trust:number }
  schema: { label:string; status:string }[]
  llms_txt: { exists: boolean; valid: boolean; content: string }
  bluf: { score: number; headline: string; issues: string[] }
  weekly_trend: TrendPoint[]
  query_probes: QueryProbe[]
}

function scolor(s: number) { return s>=85?'#52e38e':s>=65?'#caff45':'#ff7474' }
function slabel(s: number) { return s>=85?'Excellent':s>=65?'Good':'Needs work' }

function normalize(d: any): Result {
  const engineColors = ['#10a37f','#ff7a45','#4285f4','#927cff','#f472b6','#22d3ee']
  return {
    score: d.score||0,
    mentions: d.mentions||0,
    sentiment: d.sentiment||'neutral',
    engines_citing: d.engines_citing||'0/6',
    engines: (d.engines||[]).map((e: any, i: number) => ({
      ...e,
      color: engineColors[i]||'#927cff',
      sentiment: e.sentiment||'neutral',
      citations: e.citations||[],
      status: e.status||(e.s>=65?'CITED':'LOW'),
    })),
    comps: (d.comps||[]).map((c: any) => ({...c, gap: c.gap||''})),
    fixes: d.fixes||[],
    eeat: d.eeat||{experience:0,expertise:0,authority:0,trust:0},
    schema: d.schema||[],
    llms_txt: d.llms_txt||{exists:false,valid:false,content:''},
    bluf: d.bluf||{score:0,headline:'',issues:[]},
    weekly_trend: d.weekly_trend||[],
    query_probes: d.query_probes||[],
  }
}

function pStyle(p: string) {
  if(p==='HIGH') return {bg:'rgba(255,116,116,.08)',bc:'rgba(255,116,116,.2)',tc:'#ff7474'}
  if(p==='MED')  return {bg:'rgba(202,255,69,.08)', bc:'rgba(202,255,69,.2)', tc:'#caff45'}
  return               {bg:'rgba(146,124,255,.08)',bc:'rgba(146,124,255,.2)',tc:'#927cff'}
}

function EEATRadar({ scores }: { scores: Result['eeat'] }) {
  const cx=120,cy=120,max=95
  const vals=[scores.experience,scores.authority,scores.trust,scores.expertise]
  const angles=[0,90,180,270]
  function pt(angle: number, val: number) {
    const r=(val/100)*max, a=(angle-90)*Math.PI/180
    return {x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)}
  }
  const pts=angles.map((a,i)=>pt(a,vals[i]))
  const poly=pts.map(p=>`${p.x},${p.y}`).join(' ')
  const lpts=angles.map(a=>pt(a,118))
  const labels=['Experience','Authority','Trust','Expertise']
  return (
    <svg viewBox="0 0 240 240" style={{width:'200px',height:'200px'}}>
      {[25,50,75,95].map(r=>(
        <polygon key={r} points={angles.map(a=>{const p=pt(a,r);return`${p.x},${p.y}`}).join(' ')} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      ))}
      {angles.map((a,i)=>{const p=pt(a,95);return<line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>})}
      <polygon points={poly} fill="rgba(146,124,255,0.2)" stroke="#927cff" strokeWidth="1.5" strokeOpacity="0.7"/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="4" fill="#caff45"/>)}
      {lpts.map((p,i)=><text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(237,233,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">{labels[i]} {vals[i]}</text>)}
    </svg>
  )
}

function TrendChart({ points }: { points: TrendPoint[] }) {
  if (!points.length) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'80px',color:'rgba(230,239,255,.3)',fontFamily:'"JetBrains Mono"',fontSize:'9px',textAlign:'center',lineHeight:1.6}}>
      No history yet<br/>Run weekly scans to build trend
    </div>
  )
  const w=440, h=80, pad=12
  const scores=points.map(p=>p.score)
  const min=Math.max(0,Math.min(...scores)-10)
  const max=Math.min(100,Math.max(...scores)+10)
  const xStep=(w-pad*2)/(points.length-1||1)
  function y(s:number){return h-pad-((s-min)/(max-min||1))*(h-pad*2)}
  const path=points.map((p,i)=>`${i===0?'M':'L'}${pad+i*xStep},${y(p.score)}`).join(' ')
  const area=`${path} L${pad+(points.length-1)*xStep},${h} L${pad},${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'80px'}}>
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#caff45" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#caff45" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#tg)"/>
      <path d={path} fill="none" stroke="#caff45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {points.map((p,i)=>(
        <g key={i}>
          <circle cx={pad+i*xStep} cy={y(p.score)} r="3" fill="#caff45"/>
          <text x={pad+i*xStep} y={h-1} textAnchor="middle" fill="rgba(230,239,255,.3)" fontSize="7" fontFamily="JetBrains Mono">{p.week}</text>
          <text x={pad+i*xStep} y={y(p.score)-6} textAnchor="middle" fill="rgba(202,255,69,.7)" fontSize="8" fontFamily="JetBrains Mono">{p.score}</text>
        </g>
      ))}
    </svg>
  )
}

function DashboardInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [view, setView] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result|null>(null)
  const [resultUrl, setResultUrl] = useState('')
  const [recentScans, setRecentScans] = useState([
    {url:'stripe.com',score:81,time:'2h ago'},
    {url:'linear.app',score:78,time:'5h ago'},
    {url:'vercel.com',score:88,time:'1d ago'},
  ])
  const [toast, setToast] = useState('')
  const [openProbe, setOpenProbe] = useState<number|null>(null)
  const [openComp, setOpenComp] = useState<number|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false) // ← NEW

  function showToast(msg: string) { setToast(msg); setTimeout(()=>setToast(''),2400) }

  useEffect(()=>{ const p=searchParams.get('url'); if(p){setUrl(p);runAnalysis(p)} },[])

  // ← NEW: close sidebar on nav change (mobile UX)
  function handleNavChange(id: string) {
    setView(id)
    setSidebarOpen(false)
  }

  async function runAnalysis(inputUrl?: string) {
    const target=(inputUrl||url).trim().replace(/^https?:\/\//,'')
    if(!target) return
    setLoading(true); setView('overview')
    setSidebarOpen(false) // ← NEW: close sidebar when scan starts
    try {
      const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:target})})
      const data=await res.json()
      const r=normalize(data.error?{}:data)
      setResult(r); setResultUrl(target)
      setRecentScans(prev=>[{url:target,score:r.score,time:'just now'},...prev.filter(s=>s.url!==target)].slice(0,5))
    } catch { setResult(normalize({})); setResultUrl(target) }
    finally { setLoading(false) }
  }

  const circ=2*Math.PI*36
  const dash=result?(result.score/100)*circ:0

  const NAVS=[
    {id:'overview',   icon:'⬚', label:'Overview'},
    {id:'citations',  icon:'◎', label:'Citations'},
    {id:'probes',     icon:'⌕', label:'Query Probing'},
    {id:'competitors',icon:'◈', label:'Competitors'},
    {id:'gaps',       icon:'◇', label:'Content Gaps'},
    {id:'technical',  icon:'⚙', label:'Technical AEO'},
    {id:'reports',    icon:'≡', label:'Reports'},
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Epilogue:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#03060c;--panel:#09111c;--panel2:#0d1725;
          --line:rgba(220,235,255,.1);--line2:rgba(220,235,255,.22);
          --text:#f5f8ff;--muted:rgba(230,239,255,.65);--muted2:rgba(220,233,255,.4);
          --lime:#caff45;--cyan:#45e4ff;--violet:#927cff;--rose:#ff7cb7;
          --red:#ff7474;--green:#52e38e;--amber:#ffc45c;
        }
        html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:Epilogue,sans-serif;font-weight:300;overflow-x:hidden}
        body{background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:48px 48px}
        button,input{font:inherit;cursor:pointer}
        input:focus,button:focus{outline:none}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes spinR{to{transform:rotateX(70deg) rotateZ(360deg)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes toastIn{from{transform:translateY(60px);opacity:0}to{transform:none;opacity:1}}
        @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        .spin{animation:spin .8s linear infinite}
        .shimmer{background:linear-gradient(90deg,rgba(255,255,255,.02) 25%,rgba(255,255,255,.07) 50%,rgba(255,255,255,.02) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        .pulse{animation:pulse 2s infinite}
        .fadeIn{animation:fadeUp .35s both}
        .tilt{transform-style:preserve-3d;transition:transform .25s,border-color .25s,box-shadow .25s}
        .tilt:hover{transform:translateY(-3px);border-color:rgba(202,255,69,.22)!important;box-shadow:0 20px 50px rgba(0,0,0,.3)!important}
        .nav-btn:hover{background:rgba(255,255,255,.04)!important;color:var(--text)!important}
        .scan-item:hover{background:rgba(255,255,255,.04)!important;border-color:var(--line2)!important}
        .engine-row:hover{background:rgba(255,255,255,.02)!important}
        .probe-row:hover{background:rgba(255,255,255,.02)!important;cursor:pointer}
        .comp-row:hover{background:rgba(255,255,255,.02)!important;cursor:pointer}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
        .toast-show{animation:toastIn .3s ease both}
        .pill{display:inline-flex;padding:3px 7px;border-radius:4px;font-family:"JetBrains Mono";font-size:9px;white-space:nowrap;line-height:1.4}

        /* ── SIDEBAR OVERLAY BACKDROP ── */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.75);
          z-index: 9998;
        }
        .sidebar-overlay.open { display: block; }

        /* ── MOBILE SIDEBAR DRAWER ── */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: #060d18;
          border-right: 1px solid var(--line2);
          z-index: 9999;
          overflow-y: auto;
          padding: 72px 14px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: slideIn .22s ease both;
          box-shadow: 4px 0 40px rgba(0,0,0,.8);
        }

        /* hamburger button — hidden on desktop */
        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,.035);
          border-radius: 6px;
          color: var(--text);
          font-size: 18px;
          flex-shrink: 0;
          line-height: 1;
        }

        /* ── CONTENT LAYOUT GRID CLASSES ── */
        .grid-kpi   { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:12px; }
        .grid-2col  { display:grid; grid-template-columns:1.2fr .8fr; gap:12px; }
        .grid-3col  { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
        .grid-2eq   { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
        .grid-tech  { display:grid; grid-template-columns:1fr 320px; gap:12px; }
        .content-pad{ padding:22px; overflow:auto; }
        .topbar-inner{ display:flex; align-items:center; gap:14px; padding:0 22px; width:100%; }

        /* ── MOBILE BREAKPOINT ── */
        @media (max-width: 768px) {
          .dashboard-grid        { grid-template-columns: 1fr !important; }
          .desktop-sidebar       { display: none !important; }
          .hamburger-btn         { display: flex !important; }

          /* content grids → single column */
          .grid-kpi              { grid-template-columns: 1fr 1fr !important; }
          .grid-2col             { grid-template-columns: 1fr !important; }
          .grid-3col             { grid-template-columns: 1fr !important; }
          .grid-2eq              { grid-template-columns: 1fr !important; }
          .grid-tech             { grid-template-columns: 1fr !important; }

          /* tighten up content padding */
          .content-pad           { padding: 14px 12px !important; }

          /* topbar: shrink gap and padding */
          .topbar-inner          { gap: 8px !important; padding: 0 12px !important; }

          /* hide the domain pill in topbar (too wide) */
          .topbar-domain-pill    { display: none !important; }

          /* table horizontal scroll */
          .table-scroll          { overflow-x: auto; -webkit-overflow-scrolling: touch; }

          /* KPI score card: stack vertically on very small */
          .kpi-score-card        { flex-direction: column; align-items: flex-start; gap:8px; }

          /* topbar scan input: smaller */
          .topbar-search         { max-width: none !important; }
        }

        @media (max-width: 480px) {
          .grid-kpi              { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── SHARED HEADER sits above everything ── */}
      <SharedHeader />

      {/* ── MOBILE SIDEBAR BACKDROP ── ← NEW */}
      {sidebarOpen && (
        <div className={`sidebar-overlay open`} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {sidebarOpen && (
        <aside className="mobile-sidebar">
          {/* Close button row */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px',paddingBottom:'12px',borderBottom:'1px solid var(--line)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',fontFamily:'"Familjen Grotesk"',fontSize:'13px',fontWeight:700,cursor:'pointer'}} onClick={()=>{router.push('/');setSidebarOpen(false)}}>
              <div style={{width:'28px',height:'28px',display:'grid',placeItems:'center',background:'var(--lime)',color:'#07100b',borderRadius:'6px',fontSize:'13px',fontWeight:800,flexShrink:0}}>A</div>
              Dashboard
            </div>
            <button onClick={()=>setSidebarOpen(false)} style={{border:'1px solid var(--line)',background:'rgba(255,255,255,.04)',color:'var(--muted)',borderRadius:'5px',width:'28px',height:'28px',display:'grid',placeItems:'center',fontSize:'14px',flexShrink:0}}>✕</button>
          </div>

          {/* Active domain mini card */}
          <div style={{margin:'2px 4px 10px',padding:'11px',border:'1px solid var(--line)',borderRadius:'7px',background:'rgba(255,255,255,.025)'}}>
            <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'7px'}}>Active domain</div>
            <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom: result?'8px':'0'}}>
              <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--green)',boxShadow:'0 0 10px var(--green)',display:'inline-block',flexShrink:0}} />
              <span style={{fontFamily:'"JetBrains Mono"',fontSize:'11px',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{resultUrl||'—'}</span>
            </div>
            {result && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                <div style={{padding:'6px',borderRadius:'5px',background:'rgba(255,255,255,.03)',textAlign:'center'}}>
                  <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'16px',fontWeight:700,color:scolor(result.score)}}>{result.score}</div>
                  <div style={{fontFamily:'"JetBrains Mono"',fontSize:'8px',color:'var(--muted2)'}}>AEO</div>
                </div>
                <div style={{padding:'6px',borderRadius:'5px',background:'rgba(255,255,255,.03)',textAlign:'center'}}>
                  <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'16px',fontWeight:700,color:'var(--cyan)'}}>{result.engines_citing}</div>
                  <div style={{fontFamily:'"JetBrains Mono"',fontSize:'8px',color:'var(--muted2)'}}>engines</div>
                </div>
              </div>
            )}
          </div>

          <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)',padding:'0 6px',marginBottom:'4px'}}>Navigation</div>
          {NAVS.map(n=>(
            <button key={n.id} onClick={()=>handleNavChange(n.id)} className="nav-btn"
              style={{border:0,background:view===n.id?'linear-gradient(90deg,rgba(202,255,69,.13),rgba(69,228,255,.04))':'transparent',color:view===n.id?'var(--lime)':'var(--muted)',padding:'10px 11px',borderRadius:'6px',textAlign:'left',display:'flex',gap:'10px',alignItems:'center',fontSize:'12px',transition:'.2s',boxShadow:view===n.id?'inset 2px 0 var(--lime)':'none'}}>
              <span style={{width:'17px',textAlign:'center',fontFamily:'"JetBrains Mono"',fontSize:'12px'}}>{n.icon}</span>{n.label}
            </button>
          ))}

          <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)',padding:'0 6px',marginTop:'12px',marginBottom:'4px'}}>Recent scans</div>
          {recentScans.map(s=>(
            <div key={s.url} onClick={()=>{setUrl(s.url);runAnalysis(s.url)}} className="scan-item"
              style={{padding:'10px 11px',border:'1px solid var(--line)',borderRadius:'6px',background:'rgba(255,255,255,.02)',cursor:'pointer',transition:'.2s'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                <span style={{fontFamily:'"JetBrains Mono"',fontSize:'11px',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'130px'}}>{s.url}</span>
                <span style={{fontFamily:'"Familjen Grotesk"',fontSize:'12px',fontWeight:700,color:scolor(s.score),flexShrink:0}}>{s.score}</span>
              </div>
              <span style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--muted2)'}}>{s.time}</span>
            </div>
          ))}

          <div style={{marginTop:'auto',padding:'12px',border:'1px solid rgba(202,255,69,.19)',background:'rgba(202,255,69,.045)',borderRadius:'7px'}}>
            <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--lime)',letterSpacing:'.1em',marginBottom:'10px'}}>FREE TIER USAGE</div>
            {[{label:'API calls',val:'847 / 2000',pct:'42%',color:'var(--violet)'},{label:'DB rows',val:'1,203 / 50k',pct:'3%',color:'var(--green)'}].map(u=>(
              <div key={u.label} style={{marginBottom:'8px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                  <span style={{fontSize:'10px',color:'var(--muted)'}}>{u.label}</span>
                  <span style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--text)'}}>{u.val}</span>
                </div>
                <div style={{height:'3px',background:'rgba(255,255,255,.07)',borderRadius:'9px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:u.pct,background:u.color,borderRadius:'9px'}} />
                </div>
              </div>
            ))}
            <button onClick={()=>{router.push('/#pricing');setSidebarOpen(false)}} style={{marginTop:'8px',width:'100%',border:0,background:'var(--lime)',color:'#07100b',padding:'8px',borderRadius:'5px',fontSize:'10px',fontWeight:700,fontFamily:'"Familjen Grotesk"'}}>Upgrade to Pro</button>
          </div>
        </aside>
      )}

      {/* ── SIDEBAR + MAIN grid — pushed down by SharedHeader's 65px spacer ── */}
      <div className="dashboard-grid" style={{display:'grid',gridTemplateColumns:'236px 1fr',minHeight:'calc(100vh - 65px)',background:'var(--bg)'}}>

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="desktop-sidebar" style={{background:'rgba(5,10,17,.94)',borderRight:'1px solid var(--line)',backdropFilter:'blur(24px)',padding:'18px 14px',display:'flex',flexDirection:'column',gap:'8px',position:'sticky',top:'65px',height:'calc(100vh - 65px)',overflowY:'auto'}}>
          {/* Logo / home link */}
          <div style={{height:'46px',display:'flex',alignItems:'center',gap:'10px',padding:'0 10px',fontFamily:'"Familjen Grotesk"',fontSize:'15px',fontWeight:700,cursor:'pointer',borderBottom:'1px solid var(--line)',marginBottom:'4px',paddingBottom:'12px'}} onClick={()=>router.push('/')}>
            <div style={{width:'28px',height:'28px',display:'grid',placeItems:'center',background:'var(--lime)',color:'#07100b',borderRadius:'6px',boxShadow:'0 0 24px rgba(202,255,69,.18)',fontSize:'13px',fontWeight:800,flexShrink:0}}>A</div>
            <span style={{fontSize:'13px'}}>Dashboard</span>
          </div>

          {/* Active domain mini card */}
          <div style={{margin:'2px 4px 10px',padding:'11px',border:'1px solid var(--line)',borderRadius:'7px',background:'rgba(255,255,255,.025)'}}>
            <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'7px'}}>Active domain</div>
            <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom: result?'8px':'0'}}>
              <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--green)',boxShadow:'0 0 10px var(--green)',display:'inline-block',flexShrink:0}} />
              <span style={{fontFamily:'"JetBrains Mono"',fontSize:'11px',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{resultUrl||'—'}</span>
            </div>
            {result && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                <div style={{padding:'6px',borderRadius:'5px',background:'rgba(255,255,255,.03)',textAlign:'center'}}>
                  <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'16px',fontWeight:700,color:scolor(result.score)}}>{result.score}</div>
                  <div style={{fontFamily:'"JetBrains Mono"',fontSize:'8px',color:'var(--muted2)'}}>AEO</div>
                </div>
                <div style={{padding:'6px',borderRadius:'5px',background:'rgba(255,255,255,.03)',textAlign:'center'}}>
                  <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'16px',fontWeight:700,color:'var(--cyan)'}}>{result.engines_citing}</div>
                  <div style={{fontFamily:'"JetBrains Mono"',fontSize:'8px',color:'var(--muted2)'}}>engines</div>
                </div>
              </div>
            )}
          </div>

          <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)',padding:'0 6px',marginBottom:'4px'}}>Navigation</div>
          {NAVS.map(n=>(
            <button key={n.id} onClick={()=>setView(n.id)} className="nav-btn"
              style={{border:0,background:view===n.id?'linear-gradient(90deg,rgba(202,255,69,.13),rgba(69,228,255,.04))':'transparent',color:view===n.id?'var(--lime)':'var(--muted)',padding:'10px 11px',borderRadius:'6px',textAlign:'left',display:'flex',gap:'10px',alignItems:'center',fontSize:'12px',transition:'.2s',boxShadow:view===n.id?'inset 2px 0 var(--lime)':'none'}}>
              <span style={{width:'17px',textAlign:'center',fontFamily:'"JetBrains Mono"',fontSize:'12px'}}>{n.icon}</span>{n.label}
            </button>
          ))}

          <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)',padding:'0 6px',marginTop:'12px',marginBottom:'4px'}}>Recent scans</div>
          {recentScans.map(s=>(
            <div key={s.url} onClick={()=>{setUrl(s.url);runAnalysis(s.url)}} className="scan-item"
              style={{padding:'10px 11px',border:'1px solid var(--line)',borderRadius:'6px',background:'rgba(255,255,255,.02)',cursor:'pointer',transition:'.2s'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                <span style={{fontFamily:'"JetBrains Mono"',fontSize:'11px',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'130px'}}>{s.url}</span>
                <span style={{fontFamily:'"Familjen Grotesk"',fontSize:'12px',fontWeight:700,color:scolor(s.score),flexShrink:0}}>{s.score}</span>
              </div>
              <span style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--muted2)'}}>{s.time}</span>
            </div>
          ))}

          <div style={{marginTop:'auto',padding:'12px',border:'1px solid rgba(202,255,69,.19)',background:'rgba(202,255,69,.045)',borderRadius:'7px'}}>
            <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--lime)',letterSpacing:'.1em',marginBottom:'10px'}}>FREE TIER USAGE</div>
            {[{label:'API calls',val:'847 / 2000',pct:'42%',color:'var(--violet)'},{label:'DB rows',val:'1,203 / 50k',pct:'3%',color:'var(--green)'}].map(u=>(
              <div key={u.label} style={{marginBottom:'8px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                  <span style={{fontSize:'10px',color:'var(--muted)'}}>{u.label}</span>
                  <span style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--text)'}}>{u.val}</span>
                </div>
                <div style={{height:'3px',background:'rgba(255,255,255,.07)',borderRadius:'9px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:u.pct,background:u.color,borderRadius:'9px'}} />
                </div>
              </div>
            ))}
            <button onClick={()=>router.push('/#pricing')} style={{marginTop:'8px',width:'100%',border:0,background:'var(--lime)',color:'#07100b',padding:'8px',borderRadius:'5px',fontSize:'10px',fontWeight:700,fontFamily:'"Familjen Grotesk"'}}>Upgrade to Pro</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{display:'grid',gridTemplateRows:'64px 1fr auto',minWidth:0}}>
          {/* Topbar — sticky at 65px (below SharedHeader) */}
          <div style={{borderBottom:'1px solid var(--line)',background:'rgba(3,7,13,.8)',backdropFilter:'blur(20px)',position:'sticky',top:'65px',zIndex:10}}><div className="topbar-inner">

            {/* ← NEW: Hamburger button — only visible on mobile */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>

            <div className="topbar-domain-pill" style={{display:'flex',alignItems:'center',gap:'9px',padding:'0 12px',border:'1px solid var(--line)',background:'rgba(255,255,255,.025)',borderRadius:'6px',height:'36px',fontSize:'11px',fontFamily:'"JetBrains Mono"',flexShrink:0}}>
              <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--green)',boxShadow:'0 0 14px var(--green)',display:'inline-block'}} />
              {resultUrl||'No domain scanned'}
            </div>
            <div className="topbar-search" style={{display:'flex',flex:1,alignItems:'center',gap:'9px',maxWidth:'440px',border:'1px solid var(--line)',background:'rgba(255,255,255,.025)',borderRadius:'6px',padding:'0 12px',height:'36px',minWidth:0}}>
              <span style={{color:'var(--muted2)',fontSize:'13px'}}>⌕</span>
              <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runAnalysis()}
                placeholder="Enter domain..." style={{background:'transparent',border:'none',color:'var(--text)',fontSize:'11px',flex:1,minWidth:0}} />
            </div>
            <button onClick={()=>runAnalysis()} style={{height:'36px',background:'var(--lime)',color:'#07100b',border:'none',padding:'0 12px',borderRadius:'6px',fontSize:'11px',fontWeight:700,fontFamily:'"Familjen Grotesk"',flexShrink:0,whiteSpace:'nowrap'}}>Scan</button>
          </div></div>

          {/* Content area */}
          <div className="content-pad">

            {/* ── Loading ── */}
            {loading && (
              <div style={{display:'flex',flexDirection:'column',gap:'20px',maxWidth:'900px',margin:'40px auto',alignItems:'center',textAlign:'center'}}>
                <div style={{width:'140px',height:'140px',position:'relative',perspective:'600px',display:'flex',alignItems:'center',justifyContent:'center',animation:'floatY 3s ease-in-out infinite'}}>
                  {[{s:'100%',c:'rgba(69,228,255,.3)',d:'8s'},{s:'72%',c:'rgba(202,255,69,.4)',d:'6s',r:'reverse'},{s:'50%',c:'rgba(146,124,255,.5)',d:'4s'}].map((r,i)=>(
                    <div key={i} style={{position:'absolute',width:r.s,height:r.s,borderRadius:'50%',border:`1px solid ${r.c}`,transform:'rotateX(70deg)',animation:`spinR ${r.d} linear infinite`,animationDirection:(r.r||'normal') as any}} />
                  ))}
                  <div style={{position:'relative',zIndex:2,width:'44px',height:'44px',background:'rgba(202,255,69,.1)',border:'1px solid rgba(202,255,69,.4)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div className="spin" style={{width:'18px',height:'18px',border:'2px solid rgba(202,255,69,.2)',borderTopColor:'var(--lime)',borderRadius:'50%'}} />
                  </div>
                </div>
                <div>
                  <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'16px',fontWeight:600,marginBottom:'6px'}}>Querying AI engines...</div>
                  <div className="pulse" style={{fontFamily:'"JetBrains Mono"',fontSize:'10px',color:'var(--muted2)',letterSpacing:'.1em'}}>ANALYSING {url.toUpperCase()}</div>
                </div>
                <div style={{width:'100%',maxWidth:'400px',display:'flex',flexDirection:'column',gap:'8px'}}>
                  {['ChatGPT','Perplexity','Gemini','Claude','Grok','Copilot'].map(e=>(
                    <div key={e} style={{display:'flex',alignItems:'center',gap:'12px',padding:'8px 14px',border:'1px solid var(--line)',borderRadius:'6px',background:'rgba(255,255,255,.02)'}}>
                      <span style={{fontFamily:'"JetBrains Mono"',fontSize:'10px',color:'var(--muted)',width:'80px'}}>{e}</span>
                      <div style={{flex:1,height:'3px',background:'rgba(255,255,255,.06)',borderRadius:'9px',overflow:'hidden'}}>
                        <div className="shimmer" style={{height:'100%',width:'60%',borderRadius:'9px'}} />
                      </div>
                      <div className="spin" style={{width:'10px',height:'10px',border:'1.5px solid rgba(202,255,69,.2)',borderTopColor:'var(--lime)',borderRadius:'50%',flexShrink:0}} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Empty state ── */}
            {!loading && !result && (
              <div style={{maxWidth:'600px',margin:'60px auto',textAlign:'center'}}>
                <div style={{width:'80px',height:'80px',margin:'0 auto 20px',position:'relative',perspective:'600px',display:'flex',alignItems:'center',justifyContent:'center',animation:'floatY 5s ease-in-out infinite'}}>
                  {[{s:'100%',c:'rgba(69,228,255,.2)',d:'10s'},{s:'65%',c:'rgba(202,255,69,.3)',d:'7s',r:'reverse'}].map((r,i)=>(
                    <div key={i} style={{position:'absolute',width:r.s,height:r.s,borderRadius:'50%',border:`1px solid ${r.c}`,transform:'rotateX(70deg)',animation:`spinR ${r.d} linear infinite`,animationDirection:(r.r||'normal') as any}} />
                  ))}
                  <span style={{position:'relative',zIndex:2,fontFamily:'"Familjen Grotesk"',fontSize:'22px',fontWeight:700,color:'var(--lime)'}}>A</span>
                </div>
                <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'22px',fontWeight:700,marginBottom:'8px'}}>Enter a domain to begin</div>
                <div style={{fontSize:'13px',color:'var(--muted)',lineHeight:1.6,marginBottom:'20px'}}>Type any domain in the search bar above and press Enter to get your full AI visibility report — covering 6 engines, citation tracking, BLUF scoring, and weekly trends.</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px',justifyContent:'center'}}>
                  {['stripe.com','linear.app','vercel.com','notion.so'].map(d=>(
                    <button key={d} onClick={()=>{setUrl(d);runAnalysis(d)}} style={{border:'1px solid var(--line)',background:'rgba(255,255,255,.03)',color:'var(--muted)',borderRadius:'5px',padding:'7px 12px',fontSize:'10px',fontFamily:'"JetBrains Mono"',transition:'.2s'}}>{d}</button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Results ── */}
            {!loading && result && (
              <div className="fadeIn" style={{maxWidth:'1400px',margin:'0 auto'}}>

                {/* Header row */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'20px',marginBottom:'18px',flexWrap:'wrap'}}>
                  <div>
                    <h1 style={{fontFamily:'"Familjen Grotesk"',fontSize:'26px',fontWeight:700,marginBottom:'5px'}}>{NAVS.find(n=>n.id===view)?.label||'Overview'}</h1>
                    <p style={{fontSize:'11px',color:'var(--muted)'}}>AI visibility report for <strong style={{color:'var(--text)'}}>{resultUrl}</strong></p>
                  </div>
                  <div style={{display:'flex',gap:'8px'}}>
                    <button onClick={()=>showToast('Report exported!')} style={{border:'1px solid var(--line)',background:'rgba(255,255,255,.035)',color:'var(--text)',borderRadius:'6px',padding:'9px 12px',fontSize:'10px',fontWeight:600}}>Export PDF</button>
                    <button onClick={()=>runAnalysis()} style={{background:'var(--lime)',border:'none',color:'#07100b',borderRadius:'6px',padding:'9px 12px',fontSize:'10px',fontWeight:700,fontFamily:'"Familjen Grotesk"'}}>Re-run scan</button>
                  </div>
                </div>

                {/* KPI row */}
                <div className="grid-kpi">
                  <div className="tilt kpi-score-card" style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'16px',display:'flex',alignItems:'center',gap:'14px',boxShadow:'inset 0 1px rgba(255,255,255,.045)'}}>
                    <div style={{position:'relative',width:'80px',height:'80px',flexShrink:0}}>
                      <svg width="80" height="80" style={{transform:'rotate(-90deg)'}}>
                        <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6"/>
                        <circle cx="40" cy="40" r="36" fill="none" stroke={scolor(result.score)} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} style={{transition:'stroke-dasharray 1s'}}/>
                      </svg>
                      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <span style={{fontFamily:'"Familjen Grotesk"',fontSize:'20px',fontWeight:700,color:scolor(result.score),lineHeight:1}}>{result.score}</span>
                        <span style={{fontFamily:'"JetBrains Mono"',fontSize:'7px',color:'var(--muted2)',letterSpacing:'.1em'}}>AEO</span>
                      </div>
                    </div>
                    <div>
                      <div style={{fontFamily:'"JetBrains Mono"',fontSize:'8px',color:'var(--muted2)',letterSpacing:'.08em',marginBottom:'4px'}}>VISIBILITY SCORE</div>
                      <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'13px',fontWeight:600,marginBottom:'3px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'110px'}}>{resultUrl}</div>
                      <div style={{fontFamily:'"JetBrains Mono"',fontSize:'10px',color:scolor(result.score)}}>{slabel(result.score)}</div>
                    </div>
                  </div>
                  {[
                    {label:'AI MENTIONS',    val:result.mentions,       sub:'past 30 days',  color:'var(--cyan)'},
                    {label:'SENTIMENT',      val:result.sentiment,      sub:'overall tone',  color:'var(--green)'},
                    {label:'ENGINES CITING', val:result.engines_citing, sub:'of 6 tracked',  color:'var(--lime)'},
                  ].map(k=>(
                    <div key={k.label} className="tilt" style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'16px',boxShadow:'inset 0 1px rgba(255,255,255,.045)'}}>
                      <div style={{fontFamily:'"JetBrains Mono"',fontSize:'8px',color:'var(--muted2)',letterSpacing:'.08em',marginBottom:'14px',textTransform:'uppercase'}}>{k.label}</div>
                      <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'28px',fontWeight:700,color:k.color,lineHeight:1,marginBottom:'4px'}}>{k.val}</div>
                      <div style={{fontSize:'10px',color:'var(--muted)'}}>{k.sub}</div>
                    </div>
                  ))}
                </div>

                {/* ══ OVERVIEW ══ */}
                {view==='overview' && (
                  <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                    <div className="grid-2col">
                      <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',overflow:'hidden'}}>
                        <div style={{padding:'14px 16px 10px',borderBottom:'1px solid var(--line)'}}>
                          <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'14px',fontWeight:600}}>Engine performance</div>
                          <div style={{fontSize:'10px',color:'var(--muted2)',marginTop:'3px'}}>Citations across 6 AI engines</div>
                        </div>
                        <div className="table-scroll"><table style={{width:'100%',borderCollapse:'collapse',minWidth:'360px'}}>
                          <thead><tr>
                            {['Engine','Score','Sentiment','Status'].map(h=>(
                              <th key={h} style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)',padding:'10px 14px',textAlign:'left',borderBottom:'1px solid var(--line)',fontWeight:400}}>{h}</th>
                            ))}
                          </tr></thead>
                          <tbody>
                            {result.engines.map(e=>(
                              <tr key={e.n} className="engine-row" style={{transition:'.15s'}}>
                                <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                                  <span style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'11px'}}>
                                    <span style={{width:'8px',height:'8px',borderRadius:'50%',background:e.color,boxShadow:`0 0 10px ${e.color}`,display:'inline-block',flexShrink:0}} />{e.n}
                                  </span>
                                </td>
                                <td style={{padding:'11px 14px',fontFamily:'"Familjen Grotesk"',fontSize:'14px',fontWeight:700,color:scolor(e.s),borderBottom:'1px solid rgba(255,255,255,.05)'}}>{e.s}</td>
                                <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                                  <span className="pill" style={{border:`1px solid ${e.sentiment==='negative'?'rgba(255,116,116,.2)':'rgba(82,227,142,.2)'}`,background:e.sentiment==='negative'?'rgba(255,116,116,.07)':'rgba(82,227,142,.07)',color:e.sentiment==='negative'?'var(--red)':'var(--green)'}}>{e.sentiment||'positive'}</span>
                                </td>
                                <td style={{padding:'11px 14px',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                                  <span className="pill" style={{border:`1px solid ${e.s>=65?'rgba(82,227,142,.2)':'rgba(255,196,92,.2)'}`,background:e.s>=65?'rgba(82,227,142,.07)':'rgba(255,196,92,.07)',color:e.s>=65?'var(--green)':'var(--amber)'}}>{e.status||(e.s>=65?'CITED':'LOW')}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table></div>
                      </div>
                      <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'16px'}}>
                        <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'14px',fontWeight:600,marginBottom:'4px'}}>Priority actions</div>
                        <div style={{fontSize:'10px',color:'var(--muted2)',marginBottom:'14px'}}>Highest citation impact</div>
                        {result.fixes.slice(0,3).map((f,i)=>{
                          const ps=pStyle(f.priority)
                          return (
                            <div key={i} style={{display:'grid',gridTemplateColumns:'28px 1fr auto',gap:'9px',alignItems:'start',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                              <span style={{width:'25px',height:'25px',display:'grid',placeItems:'center',borderRadius:'5px',background:'rgba(202,255,69,.08)',color:'var(--lime)',fontFamily:'"JetBrains Mono"',fontSize:'10px'}}>0{i+1}</span>
                              <div>
                                <strong style={{fontFamily:'"Familjen Grotesk"',fontWeight:500,fontSize:'11px',display:'block',marginBottom:'3px'}}>{f.title}</strong>
                                <p style={{fontSize:'9px',color:'var(--muted)',lineHeight:1.5}}>{f.desc.slice(0,80)}...</p>
                              </div>
                              <span className="pill" style={{border:`1px solid ${ps.bc}`,background:ps.bg,color:ps.tc,marginTop:'1px'}}>{f.priority}</span>
                            </div>
                          )
                        })}
                        <button onClick={()=>setView('gaps')} style={{marginTop:'10px',background:'none',border:'none',fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--cyan)',letterSpacing:'.04em',padding:0}}>View all gaps →</button>
                      </div>
                    </div>
                    <div className="grid-3col">
                      <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'16px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                          <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'13px',fontWeight:600}}>BLUF content score</div>
                          <span style={{fontFamily:'"Familjen Grotesk"',fontSize:'20px',fontWeight:700,color:scolor(result.bluf.score)}}>{result.bluf.score}<span style={{fontSize:'10px',color:'var(--muted2)',fontWeight:400}}>/100</span></span>
                        </div>
                        {result.bluf.headline&&(<div style={{padding:'8px 10px',background:'rgba(255,255,255,.03)',borderRadius:'5px',fontSize:'10px',color:'var(--muted)',lineHeight:1.6,marginBottom:'10px',border:'1px solid var(--line)',fontStyle:'italic'}}>"{result.bluf.headline}"</div>)}
                        {result.bluf.issues.length>0?(<div style={{display:'flex',flexDirection:'column',gap:'5px',marginBottom:'10px'}}>{result.bluf.issues.slice(0,3).map((issue,i)=>(<div key={i} style={{display:'flex',gap:'6px',alignItems:'flex-start',fontSize:'9px',color:'var(--muted)'}}><span style={{color:'var(--amber)',flexShrink:0,marginTop:'1px'}}>!</span>{issue}</div>))}</div>):(<div style={{fontSize:'9px',color:'var(--green)',display:'flex',alignItems:'center',gap:'5px',marginBottom:'10px'}}><span>✓</span>Homepage passes BLUF check</div>)}
                        <div style={{height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'9px',overflow:'hidden'}}><div style={{height:'100%',width:`${result.bluf.score}%`,background:scolor(result.bluf.score),borderRadius:'9px',transition:'width 1s'}} /></div>
                      </div>
                      <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'16px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                          <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'13px',fontWeight:600}}>llms.txt check</div>
                          <span className="pill" style={{border:`1px solid ${result.llms_txt.exists?'rgba(82,227,142,.25)':'rgba(255,116,116,.25)'}`,background:result.llms_txt.exists?'rgba(82,227,142,.08)':'rgba(255,116,116,.08)',color:result.llms_txt.exists?'var(--green)':'var(--red)'}}>{result.llms_txt.exists?'FOUND':'MISSING'}</span>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:'7px',marginBottom:'12px'}}>
                          {[{label:'File exists at /llms.txt',pass:result.llms_txt.exists},{label:'Valid format',pass:result.llms_txt.valid},{label:'Crawlers correctly configured',pass:result.llms_txt.exists&&result.llms_txt.valid}].map((chk,i)=>(
                            <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'10px',color:chk.pass?'var(--green)':'var(--muted)'}}>
                              <span style={{width:'16px',height:'16px',borderRadius:'3px',background:chk.pass?'rgba(82,227,142,.1)':'rgba(255,255,255,.04)',border:`1px solid ${chk.pass?'rgba(82,227,142,.25)':'rgba(255,255,255,.08)'}`,display:'grid',placeItems:'center',fontSize:'9px',color:chk.pass?'var(--green)':'var(--muted2)',flexShrink:0}}>{chk.pass?'✓':'×'}</span>{chk.label}
                            </div>
                          ))}
                        </div>
                        <button onClick={()=>setView('technical')} style={{background:'none',border:'none',fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--cyan)',padding:0}}>{result.llms_txt.exists?'View full file →':'Generate llms.txt →'}</button>
                      </div>
                      <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'16px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                          <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'13px',fontWeight:600}}>Weekly trend</div>
                          {result.weekly_trend.length>1&&(<span style={{fontFamily:'"JetBrains Mono"',fontSize:'10px',color:result.weekly_trend[result.weekly_trend.length-1].score>=result.weekly_trend[0].score?'var(--green)':'var(--red)'}}>{result.weekly_trend[result.weekly_trend.length-1].score>=result.weekly_trend[0].score?'▲':'▼'} {Math.abs(result.weekly_trend[result.weekly_trend.length-1].score-result.weekly_trend[0].score)} pts</span>)}
                        </div>
                        <TrendChart points={result.weekly_trend} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ CITATIONS ══ */}
                {view==='citations' && (
                  <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                    <div style={{padding:'12px 16px',border:'1px solid rgba(69,228,255,.15)',background:'rgba(69,228,255,.04)',borderRadius:'7px',fontSize:'10px',color:'var(--muted)',lineHeight:1.6}}>
                      <strong style={{color:'var(--cyan)',fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.08em'}}>CITATION TRACKING — </strong>
                      Per-engine mention analysis with sentiment and sample snippets.
                    </div>
                    {result.engines.map((e,i)=>(
                      <div key={i} style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',overflow:'hidden'}}>
                        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                            <span style={{width:'10px',height:'10px',borderRadius:'50%',background:e.color,boxShadow:`0 0 12px ${e.color}`,display:'inline-block',flexShrink:0}} />
                            <span style={{fontFamily:'"Familjen Grotesk"',fontSize:'14px',fontWeight:600}}>{e.n}</span>
                            <span className="pill" style={{border:`1px solid ${e.s>=65?'rgba(82,227,142,.2)':'rgba(255,196,92,.2)'}`,background:e.s>=65?'rgba(82,227,142,.07)':'rgba(255,196,92,.07)',color:e.s>=65?'var(--green)':'var(--amber)'}}>{e.status||(e.s>=65?'CITED':'LOW')}</span>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                            <span className="pill" style={{border:`1px solid ${e.sentiment==='negative'?'rgba(255,116,116,.2)':'rgba(82,227,142,.2)'}`,background:e.sentiment==='negative'?'rgba(255,116,116,.07)':'rgba(82,227,142,.07)',color:e.sentiment==='negative'?'var(--red)':'var(--green)'}}>{e.sentiment||'positive'} sentiment</span>
                            <span style={{fontFamily:'"Familjen Grotesk"',fontSize:'18px',fontWeight:700,color:scolor(e.s)}}>{e.s}</span>
                          </div>
                        </div>
                        <div style={{padding:'14px 16px'}}>
                          {e.desc&&(<p style={{fontSize:'11px',color:'var(--muted)',lineHeight:1.7,marginBottom:'12px',paddingBottom:'12px',borderBottom:'1px solid rgba(255,255,255,.06)'}}>{e.desc}</p>)}
                          {e.citations&&e.citations.length>0?(<div style={{display:'flex',flexDirection:'column',gap:'8px'}}><div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--muted2)',letterSpacing:'.08em',marginBottom:'4px'}}>CITATION SNIPPETS</div>{e.citations.map((c,j)=>(<div key={j} style={{padding:'10px 12px',background:'rgba(255,255,255,.025)',border:'1px solid var(--line)',borderLeft:`2px solid ${e.color}`,borderRadius:'6px',fontSize:'10px',color:'var(--muted)',lineHeight:1.7}}>"{c}"</div>))}</div>):(<div style={{padding:'12px',background:'rgba(255,255,255,.02)',borderRadius:'6px',fontSize:'10px',color:'var(--muted2)',fontFamily:'"JetBrains Mono"',textAlign:'center'}}>No citation snippets yet</div>)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ══ QUERY PROBING ══ */}
                {view==='probes' && (
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    <div style={{padding:'12px 16px',border:'1px solid rgba(202,255,69,.15)',background:'rgba(202,255,69,.04)',borderRadius:'7px',fontSize:'10px',color:'var(--muted)',lineHeight:1.6,marginBottom:'4px'}}>
                      <strong style={{color:'var(--lime)',fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.08em'}}>REAL-TIME QUERY PROBING — </strong>
                      Actual prompts submitted to each AI engine during this scan. Click a row to expand.
                    </div>
                    {result.query_probes.length>0?result.query_probes.map((p,i)=>(
                      <div key={i} onClick={()=>setOpenProbe(openProbe===i?null:i)} className="probe-row" style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',overflow:'hidden',transition:'.15s'}}>
                        <div style={{padding:'12px 16px',display:'flex',alignItems:'center',gap:'12px'}}>
                          <span style={{width:'8px',height:'8px',borderRadius:'50%',background:result.engines.find(e=>e.n===p.engine)?.color||'var(--muted)',display:'inline-block',flexShrink:0}} />
                          <span style={{fontFamily:'"JetBrains Mono"',fontSize:'10px',color:'var(--muted)',width:'80px',flexShrink:0}}>{p.engine}</span>
                          <span style={{flex:1,fontSize:'11px',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.query}</span>
                          <span className="pill" style={{border:`1px solid ${p.cited?'rgba(82,227,142,.2)':'rgba(255,196,92,.2)'}`,background:p.cited?'rgba(82,227,142,.07)':'rgba(255,196,92,.07)',color:p.cited?'var(--green)':'var(--amber)',flexShrink:0}}>{p.cited?'CITED':'NOT CITED'}</span>
                          <span style={{color:'var(--muted2)',fontSize:'10px',marginLeft:'4px'}}>{openProbe===i?'▲':'▼'}</span>
                        </div>
                        {openProbe===i&&(<div style={{borderTop:'1px solid var(--line)',padding:'14px 16px',background:'rgba(0,0,0,.15)'}}>
                          <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--muted2)',marginBottom:'6px',letterSpacing:'.08em'}}>PROMPT SENT</div>
                          <div style={{padding:'10px 12px',background:'rgba(255,255,255,.025)',border:'1px solid var(--line)',borderRadius:'6px',fontSize:'10px',color:'var(--cyan)',fontFamily:'"JetBrains Mono"',marginBottom:'14px',lineHeight:1.6}}>{p.query}</div>
                          <div style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--muted2)',marginBottom:'6px',letterSpacing:'.08em'}}>AI RESPONSE EXCERPT</div>
                          <div style={{padding:'10px 12px',background:'rgba(255,255,255,.025)',border:'1px solid var(--line)',borderLeft:`2px solid ${result.engines.find(e=>e.n===p.engine)?.color||'var(--line)'}`,borderRadius:'6px',fontSize:'10px',color:'var(--muted)',lineHeight:1.7}}>{p.response}</div>
                        </div>)}
                      </div>
                    )):(
                      <div style={{padding:'40px',textAlign:'center',border:'1px solid var(--line)',borderRadius:'7px',color:'var(--muted2)',fontFamily:'"JetBrains Mono"',fontSize:'10px',lineHeight:1.9}}>No query probes in this scan.<br/><span style={{color:'var(--lime)'}}>query_probes</span> array needed in API response.</div>
                    )}
                  </div>
                )}

                {/* ══ COMPETITORS ══ */}
                {view==='competitors' && (
                  <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                    <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',overflow:'hidden'}}>
                      <div style={{padding:'14px 16px 10px',borderBottom:'1px solid var(--line)'}}>
                        <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'14px',fontWeight:600}}>Competitor comparison</div>
                        <div style={{fontSize:'10px',color:'var(--muted2)',marginTop:'3px'}}>Click a competitor row to reveal the content gap</div>
                      </div>
                      <div className="table-scroll"><table style={{width:'100%',borderCollapse:'collapse',minWidth:'380px'}}>
                        <thead><tr style={{borderBottom:'1px solid var(--line)'}}>
                          {['Domain','Score','vs You','Bar',''].map(h=>(<th key={h} style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)',padding:'10px 14px',textAlign:'left',fontWeight:400}}>{h}</th>))}
                        </tr></thead>
                       <tbody>
  {[{n:resultUrl,s:result.score,isYou:true,gap:''},...result.comps].map((c: any, i) => (
    <Fragment key={`comp-block-${c.n || i}`}>
      <tr
        onClick={() => !c.isYou && setOpenComp(openComp === i ? null : i)}
        className="comp-row"
        style={{ borderBottom: '1px solid rgba(255,255,255,.04)', transition: '.15s', cursor: c.isYou ? 'default' : 'pointer' }}
      >
        <td style={{ padding: '10px 14px', fontFamily: '"JetBrains Mono", analytics, monospace', fontSize: '11px', color: c.isYou ? 'var(--lime)' : 'var(--text)' }}>
          {c.n}{c.isYou && <span style={{ marginLeft: '6px', fontSize: '9px', color: 'var(--lime)', background: 'rgba(202,255,69,.1)', padding: '2px 5px', borderRadius: '3px' }}>YOU</span>}
        </td>
        <td style={{ padding: '10px 14px', fontFamily: '"Familjen Grotesk"', fontSize: '14px', fontWeight: 700, color: scolor(c.s) }}>{c.s}</td>
        <td style={{ padding: '10px 14px', fontFamily: '"JetBrains Mono"', fontSize: '11px', color: c.isYou ? 'var(--muted2)' : c.s > result.score ? 'var(--red)' : 'var(--green)' }}>{c.isYou ? '—' : (c.s > result.score ? '+' : '') + (c.s - result.score)}</td>
        <td style={{ padding: '10px 14px', width: '30%' }}><div style={{ height: '5px', background: 'rgba(255,255,255,.06)', borderRadius: '9px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${c.s}%`, background: c.isYou ? 'var(--lime)' : scolor(c.s), borderRadius: '9px', transition: 'width 1s' }} /></div></td>
        <td style={{ padding: '10px 14px', fontSize: '10px', color: 'var(--muted2)', fontFamily: '"JetBrains Mono"' }}>{!c.isYou && (c.gap ? <span style={{ color: 'var(--amber)' }}>{openComp === i ? '▲ hide' : '▼ gap'}</span> : '—')}</td>
      </tr>
      {openComp === i && c.gap && (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
          <td colSpan={5} style={{ padding: '0 14px 14px 50px' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255,196,92,.04)', border: '1px solid rgba(255,196,92,.15)', borderLeft: '2px solid var(--amber)', borderRadius: '6px', fontSize: '10px', color: 'var(--muted)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--amber)', fontFamily: '"JetBrains Mono"', fontSize: '9px', letterSpacing: '.06em' }}>CONTENT GAP — </strong>{c.gap}
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  ))}
</tbody>
                      </table></div>
                    </div>
                  </div>
                )}

                {/* ══ CONTENT GAPS ══ */}
                {view==='gaps' && (
                  <div className="grid-2eq">
                    {result.fixes.map((f,i)=>{
                      const ps=pStyle(f.priority)
                      return (
                        <div key={i} className="tilt" style={{border:`1px solid ${ps.bc}`,background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'16px',boxShadow:'inset 0 1px rgba(255,255,255,.045)'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px',gap:'8px'}}>
                            <div style={{fontFamily:'"Familjen Grotesk"',fontWeight:600,fontSize:'13px'}}>{f.title}</div>
                            <span className="pill" style={{border:`1px solid ${ps.bc}`,background:ps.bg,color:ps.tc,flexShrink:0}}>{f.priority}</span>
                          </div>
                          <p style={{fontSize:'10px',color:'var(--muted)',lineHeight:1.65,marginBottom:'12px'}}>{f.desc}</p>
                          <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
                            {['High intent','BLUF needed','Schema gap','Competitor edge'].slice(0,f.priority==='HIGH'?3:2).map(t=>(<span key={t} style={{fontFamily:'"JetBrains Mono"',fontSize:'8px',padding:'4px 7px',border:'1px solid var(--line)',borderRadius:'3px',color:'var(--muted)'}}>{t}</span>))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* ══ TECHNICAL AEO ══ */}
                {view==='technical' && (
                  <div className="grid-tech">
                    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                      <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',overflow:'hidden'}}>
                        <div style={{padding:'14px 16px 10px',borderBottom:'1px solid var(--line)'}}><div style={{fontFamily:'"Familjen Grotesk"',fontSize:'14px',fontWeight:600}}>Schema + crawlability audit</div></div>
                        <div style={{padding:'4px 14px 14px'}}>
                          {result.schema.length>0?result.schema.map((s,i)=>(
                            <div key={i} style={{display:'grid',gridTemplateColumns:'28px 1fr auto',gap:'10px',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,.065)',alignItems:'center'}}>
                              <span style={{width:'26px',height:'26px',display:'grid',placeItems:'center',borderRadius:'5px',background:s.status==='pass'?'rgba(82,227,142,.08)':s.status==='fail'?'rgba(255,116,116,.08)':'rgba(255,196,92,.08)',color:s.status==='pass'?'var(--green)':s.status==='fail'?'var(--red)':'var(--amber)',fontSize:'11px'}}>{s.status==='pass'?'✓':s.status==='fail'?'×':'!'}</span>
                              <strong style={{fontFamily:'"Familjen Grotesk"',fontWeight:500,fontSize:'11px'}}>{s.label}</strong>
                              <button onClick={()=>showToast(s.status==='pass'?'All good!':'Fix workflow opened')} style={{border:'1px solid var(--line)',background:'rgba(255,255,255,.035)',color:'var(--text)',borderRadius:'5px',padding:'6px 10px',fontSize:'9px',fontWeight:600}}>{s.status==='pass'?'View':'Fix'}</button>
                            </div>
                          )):(<div style={{padding:'20px',textAlign:'center',color:'var(--muted2)',fontFamily:'"JetBrains Mono"',fontSize:'10px'}}>Add <span style={{color:'var(--lime)'}}>schema[]</span> to API response</div>)}
                        </div>
                      </div>
                      <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'16px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                          <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'13px',fontWeight:600}}>llms.txt</div>
                          <div style={{display:'flex',gap:'6px'}}>
                            <span className="pill" style={{border:`1px solid ${result.llms_txt.exists?'rgba(82,227,142,.25)':'rgba(255,116,116,.25)'}`,background:result.llms_txt.exists?'rgba(82,227,142,.08)':'rgba(255,116,116,.08)',color:result.llms_txt.exists?'var(--green)':'var(--red)'}}>{result.llms_txt.exists?'FOUND':'MISSING'}</span>
                            <span className="pill" style={{border:`1px solid ${result.llms_txt.valid?'rgba(82,227,142,.25)':'rgba(255,196,92,.25)'}`,background:result.llms_txt.valid?'rgba(82,227,142,.08)':'rgba(255,196,92,.08)',color:result.llms_txt.valid?'var(--green)':'var(--amber)'}}>{result.llms_txt.valid?'VALID':'INVALID'}</span>
                          </div>
                        </div>
                        {result.llms_txt.content?(<div style={{padding:'12px',background:'rgba(255,255,255,.025)',border:'1px solid var(--line)',borderRadius:'6px',fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--muted)',lineHeight:1.8,whiteSpace:'pre-wrap',maxHeight:'160px',overflowY:'auto'}}>{result.llms_txt.content}</div>):(<div style={{padding:'14px',background:'rgba(202,255,69,.04)',border:'1px solid rgba(202,255,69,.15)',borderRadius:'6px',fontSize:'10px',color:'var(--muted)',lineHeight:1.6}}>No llms.txt found at <span style={{color:'var(--lime)',fontFamily:'"JetBrains Mono"'}}>{resultUrl}/llms.txt</span></div>)}
                        <button onClick={()=>showToast('llms.txt copied!')} style={{marginTop:'10px',width:'100%',border:0,background:'var(--lime)',color:'#07100b',padding:'10px',borderRadius:'5px',fontSize:'11px',fontWeight:700,fontFamily:'"Familjen Grotesk"'}}>{result.llms_txt.exists?'Copy llms.txt':'Generate + copy llms.txt'}</button>
                      </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                      <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'15px'}}>
                        <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'13px',fontWeight:600,marginBottom:'12px'}}>E-E-A-T signals</div>
                        <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}><EEATRadar scores={result.eeat} /></div>
                        {[{l:'Experience',v:result.eeat.experience,c:'var(--lime)'},{l:'Expertise',v:result.eeat.expertise,c:'var(--violet)'},{l:'Authority',v:result.eeat.authority,c:'var(--cyan)'},{l:'Trust',v:result.eeat.trust,c:'var(--rose)'}].map(b=>(
                          <div key={b.l} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                            <span style={{fontSize:'10px',color:'var(--muted)',width:'75px',flexShrink:0}}>{b.l}</span>
                            <div style={{flex:1,height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'9px',overflow:'hidden'}}><div style={{height:'100%',width:`${b.v}%`,background:b.c,borderRadius:'9px',transition:'width 1s'}} /></div>
                            <span style={{fontFamily:'"JetBrains Mono"',fontSize:'9px',color:'var(--muted2)',width:'20px',textAlign:'right'}}>{b.v}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'15px'}}>
                        <div style={{fontFamily:'"Familjen Grotesk"',fontSize:'13px',fontWeight:600,marginBottom:'10px'}}>BLUF analysis</div>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}><span style={{fontSize:'10px',color:'var(--muted)'}}>Content score</span><span style={{fontFamily:'"Familjen Grotesk"',fontSize:'18px',fontWeight:700,color:scolor(result.bluf.score)}}>{result.bluf.score}</span></div>
                        <div style={{height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'9px',overflow:'hidden',marginBottom:'12px'}}><div style={{height:'100%',width:`${result.bluf.score}%`,background:scolor(result.bluf.score),borderRadius:'9px',transition:'width 1s'}} /></div>
                        {result.bluf.headline&&(<div style={{padding:'8px 10px',background:'rgba(255,255,255,.03)',borderRadius:'5px',fontSize:'9px',color:'var(--muted)',lineHeight:1.6,marginBottom:'10px',fontStyle:'italic',border:'1px solid var(--line)'}}>"{result.bluf.headline}"</div>)}
                        {result.bluf.issues.map((issue,i)=>(<div key={i} style={{display:'flex',gap:'6px',fontSize:'9px',color:'var(--muted)',marginBottom:'5px',lineHeight:1.5}}><span style={{color:'var(--amber)',flexShrink:0}}>!</span>{issue}</div>))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ REPORTS ══ */}
                {view==='reports' && (
                  <div className="grid-2eq">
                    {[
                      {title:'Weekly visibility digest',  badge:'Scheduled', desc:'AEO score, citation changes, competitor movements, and top three actions.'},
                      {title:'Competitor benchmark',      badge:'Monthly',   desc:'Share of voice and query ownership across your tracked competitors.'},
                      {title:'Technical AEO audit',       badge:'Ready',     desc:'Full crawlability, schema, llms.txt, BLUF, and E-E-A-T assessment.'},
                      {title:'White-label client report', badge:'Agency',    desc:'Custom branding, executive summary, and prioritised action plan.'},
                    ].map((r,i)=>(
                      <div key={i} className="tilt" style={{border:'1px solid var(--line)',background:'linear-gradient(145deg,rgba(14,25,40,.94),rgba(7,13,23,.92))',borderRadius:'7px',padding:'16px',boxShadow:'inset 0 1px rgba(255,255,255,.045)'}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',gap:'8px'}}>
                          <h3 style={{fontFamily:'"Familjen Grotesk"',fontSize:'13px',fontWeight:600}}>{r.title}</h3>
                          <span className="pill" style={{border:'1px solid rgba(82,227,142,.2)',background:'rgba(82,227,142,.07)',color:'var(--green)',height:'fit-content'}}>{r.badge}</span>
                        </div>
                        <p style={{fontSize:'9px',color:'var(--muted)',lineHeight:1.6,marginBottom:'14px'}}>{r.desc}</p>
                        <button onClick={()=>showToast('Report prepared!')} style={{border:'1px solid var(--line)',background:'rgba(255,255,255,.035)',color:'var(--text)',borderRadius:'5px',padding:'8px 12px',fontSize:'10px',fontWeight:600}}>Download PDF</button>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* ── SHARED FOOTER sits at the bottom of the main column ── */}
          <SharedFooter />
        </main>
      </div>

      {toast && (
        <div className="toast-show" style={{position:'fixed',right:'20px',bottom:'20px',padding:'11px 14px',background:'var(--panel2)',border:'1px solid var(--line2)',borderRadius:'6px',color:'var(--text)',fontSize:'10px',zIndex:30,fontFamily:'"JetBrains Mono"'}}>{toast}</div>
      )}
    </>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div style={{background:'#03060c',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(245,248,255,.4)',fontFamily:'JetBrains Mono,monospace',fontSize:'.8rem',letterSpacing:'.1em'}}>LOADING...</div>}>
      <DashboardInner />
    </Suspense>
  )
}