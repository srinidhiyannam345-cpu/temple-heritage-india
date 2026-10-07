import React, { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { api } from "./api";

const fallbackTemples = [
  {
    id:"badrinath", name:"Badrinath Temple", state:"Uttarakhand", city:"Badrinath",
    deity:"Lord Vishnu", category:"Char Dham", featured:true, verified:true,
    history:"One of the most revered Vaishnavite pilgrimage temples in India, located in the Garhwal Himalayas.",
    significance:"Dedicated to Lord Vishnu in the form of Badrinarayan.",
    rituals:"Morning and evening worship, special seasonal rituals and daily aarti.",
    poojaSchedule:"Mahabhog and daily puja schedules vary by season.",
    darshan:"4:30 AM – 9:00 PM (seasonal)",
    festivals:"Mata Murti Ka Mela, Badri-Kedar Festival",
    dressCode:"Modest traditional clothing recommended.",
    rules:"Follow queue instructions; photography may be restricted in sanctum areas.",
    accommodation:"Dharamshalas, guesthouses and hotels in Badrinath.",
    transport:"Road access via Rishikesh–Joshimath route; nearest major railhead is Rishikesh.",
    lat:30.7433, lng:79.4938
  },
  {
    id:"meenakshi", name:"Meenakshi Amman Temple", state:"Tamil Nadu", city:"Madurai",
    deity:"Meenakshi & Sundareswarar", category:"Shakti / Historic", featured:true, verified:true,
    history:"A major historic temple complex and landmark of Madurai known for its monumental gateways and sculpture.",
    significance:"A major Shaiva-Shakti pilgrimage centre.",
    rituals:"Daily abhishekam, aarti and traditional temple services.",
    poojaSchedule:"Multiple daily poojas; timings may change on festival days.",
    darshan:"5:00 AM – 10:00 PM (subject to temple schedule)",
    festivals:"Chithirai Festival, Navaratri",
    dressCode:"Respectful, modest attire.",
    rules:"Follow temple queue, footwear and photography rules.",
    accommodation:"Hotels, lodges and pilgrim accommodation across Madurai.",
    transport:"Well connected by Madurai airport, rail and road.",
    lat:9.9195, lng:78.1193
  },
  {
    id:"tirupati", name:"Sri Venkateswara Temple", state:"Andhra Pradesh", city:"Tirumala",
    deity:"Lord Venkateswara", category:"Vaishnavite", featured:true, verified:true,
    history:"A major pilgrimage centre dedicated to Lord Venkateswara on the Tirumala hills.",
    significance:"One of India's best-known Vaishnavite pilgrimage destinations.",
    rituals:"Suprabhatam, Thomala Seva, Archana and other temple services.",
    poojaSchedule:"Seva schedules are managed by the temple administration.",
    darshan:"Multiple darshan categories with scheduled timings.",
    festivals:"Brahmotsavam, Vaikunta Ekadasi",
    dressCode:"Traditional and modest dress is recommended.",
    rules:"Carry only permitted items and follow security instructions.",
    accommodation:"Tirumala and Tirupati offer pilgrim accommodation and hotels.",
    transport:"Road and rail links to Tirupati; bus services connect Tirumala.",
    lat:13.6833, lng:79.3472
  },
  {
    id:"konark", name:"Konark Sun Temple", state:"Odisha", city:"Konark",
    deity:"Surya", category:"Historic Monument", featured:false, verified:true,
    history:"13th-century temple complex celebrated for its monumental architecture and stone-carved chariot form.",
    significance:"A major heritage site dedicated to the Sun God.",
    rituals:"Heritage site visitation; active worship arrangements differ from living temples.",
    poojaSchedule:"Refer to local heritage and visitor authorities.",
    darshan:"Visitor hours vary by heritage-site rules.",
    festivals:"Konark Dance Festival, Chandrabhaga Mela",
    dressCode:"Comfortable and respectful clothing.",
    rules:"Do not climb or touch protected carvings.",
    accommodation:"Hotels and guesthouses in Konark and nearby Puri.",
    transport:"Road access from Puri and Bhubaneswar.",
    lat:19.8876, lng:86.0945
  }
];

function Navbar({ onSearch }) {
  return <nav className="navbar navbar-expand-lg navbar-dark sticky-top temple-nav">
    <div className="container">
      <Link className="navbar-brand fw-bold" to="/"><i className="bi bi-bank2 me-2"></i>Temple Heritage India</Link>
      <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon"></span></button>
      <div className="collapse navbar-collapse" id="nav">
        <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li className="nav-item"><Link className="nav-link" to="/">Explore</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/circuits">Pilgrimage Circuits</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/saved">Saved</Link></li>
          <li className="nav-item"><Link className="btn btn-light btn-sm px-3" to="/admin">Admin</Link></li>
        </ul>
      </div>
    </div>
  </nav>;
}

function Home() {
  const [temples, setTemples] = useState(fallbackTemples);
  const [filters, setFilters] = useState({q:"",state:"",city:"",deity:"",category:""});
  const [loading, setLoading] = useState(true);
  const [locationMsg, setLocationMsg] = useState("");

  useEffect(()=>{ api("/temples").then(d=>setTemples(d.temples)).catch(()=>{}).finally(()=>setLoading(false)); },[]);

  const states = [...new Set(temples.map(t=>t.state))].sort();
  const cities = [...new Set(temples.filter(t=>!filters.state || t.state===filters.state).map(t=>t.city))].sort();
  const deities = [...new Set(temples.map(t=>t.deity))].sort();
  const categories = [...new Set(temples.map(t=>t.category))].sort();

  const filtered = useMemo(()=>temples.filter(t=>{
    const hay=[t.name,t.city,t.state,t.deity,t.category].join(" ").toLowerCase();
    return (!filters.q || hay.includes(filters.q.toLowerCase()))
      && (!filters.state || t.state===filters.state)
      && (!filters.city || t.city===filters.city)
      && (!filters.deity || t.deity===filters.deity)
      && (!filters.category || t.category===filters.category);
  }),[temples,filters]);

  async function useLocation(){
    if(!navigator.geolocation){setLocationMsg("Location is not supported by this browser.");return;}
    setLocationMsg("Finding nearby temples...");
    navigator.geolocation.getCurrentPosition(async p=>{
      try {
        const d=await api(`/temples/nearby?lat=${p.coords.latitude}&lng=${p.coords.longitude}`);
        setTemples(d.temples);
        setLocationMsg(`Showing ${d.temples.length} nearby temples.`);
      } catch { setLocationMsg("Could not load nearby temples."); }
    },()=>setLocationMsg("Location permission was not granted."));
  }

  const featured=temples.filter(t=>t.featured).slice(0,3);

  return <>
    <section className="hero-section">
      <div className="container py-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="badge bg-warning text-dark mb-3">India Temple Heritage & Pilgrimage Information Portal</span>
            <h1 className="display-4 fw-bold">Discover India's sacred heritage.</h1>
            <p className="lead">Explore temple history, deities, rituals, festivals, darshan timings, visitor guidelines, nearby facilities and pilgrimage information in one trusted portal.</p>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-light btn-lg" onClick={()=>document.getElementById("explore").scrollIntoView({behavior:"smooth"})}><i className="bi bi-search me-2"></i>Explore Temples</button>
              <button className="btn btn-outline-light btn-lg" onClick={useLocation}><i className="bi bi-geo-alt me-2"></i>Near Me</button>
            </div>
            {locationMsg && <div className="small mt-3">{locationMsg}</div>}
          </div>
          <div className="col-lg-5"><div className="hero-card"><i className="bi bi-buildings"></i><h3>Heritage • Pilgrimage • Culture</h3><p className="mb-0">A responsive information-first platform for pilgrims, tourists and researchers.</p></div></div>
        </div>
      </div>
    </section>

    <main className="container py-5" id="explore">
      <div className="section-heading"><div><span className="eyebrow">SEARCH & DISCOVERY</span><h2>Find a temple</h2></div><span className="text-secondary">{filtered.length} result(s)</span></div>
      <div className="card shadow-sm border-0 filter-card mb-5">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-lg-4"><input className="form-control form-control-lg" placeholder="Search temple, city, state or deity..." value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})}/></div>
            <div className="col-md-6 col-lg-2"><select className="form-select" value={filters.state} onChange={e=>setFilters({...filters,state:e.target.value,city:""})}><option value="">All states</option>{states.map(x=><option key={x}>{x}</option>)}</select></div>
            <div className="col-md-6 col-lg-2"><select className="form-select" value={filters.city} onChange={e=>setFilters({...filters,city:e.target.value})}><option value="">All cities</option>{cities.map(x=><option key={x}>{x}</option>)}</select></div>
            <div className="col-md-6 col-lg-2"><select className="form-select" value={filters.deity} onChange={e=>setFilters({...filters,deity:e.target.value})}><option value="">All deities</option>{deities.map(x=><option key={x}>{x}</option>)}</select></div>
            <div className="col-md-6 col-lg-2"><select className="form-select" value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})}><option value="">All categories</option>{categories.map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
        </div>
      </div>

      <div className="section-heading"><div><span className="eyebrow">FEATURED</span><h2>Featured temples</h2></div></div>
      <div className="row g-4 mb-5">{featured.map(t=><TempleCard key={t.id} temple={t}/>)}</div>

      <div className="section-heading"><div><span className="eyebrow">DIRECTORY</span><h2>Temple listings</h2></div></div>
      {loading ? <div className="text-center py-5">Loading temple information...</div> :
      <div className="row g-4">{filtered.map(t=><TempleCard key={t.id} temple={t}/>)}</div>}
      {!filtered.length && <div className="alert alert-light border">No temples match these filters. Try another state, city, deity or keyword.</div>}
    </main>
    <footer className="footer"><div className="container d-flex flex-column flex-md-row justify-content-between gap-2"><span>Temple Heritage India • Phase 1 web portal</span><span>Content should be maintained from verified sources.</span></div></footer>
  </>;
}

function TempleCard({temple:t}) {
  return <div className="col-md-6 col-xl-4"><div className="card temple-card h-100 shadow-sm border-0">
    <div className="temple-image"><i className="bi bi-bank2"></i>{t.verified && <span className="verified-badge"><i className="bi bi-patch-check-fill"></i> Verified</span>}</div>
    <div className="card-body d-flex flex-column"><div className="small text-secondary">{t.city}, {t.state}</div><h3 className="h5 mt-1">{t.name}</h3><p className="text-secondary small flex-grow-1">{t.history}</p><div className="d-flex justify-content-between align-items-center"><span className="badge category-badge">{t.category}</span><Link className="btn btn-sm btn-outline-dark" to={`/temple/${t.id}`}>View details</Link></div></div>
  </div></div>;
}

function TempleDetail() {
  const {id}=useParams(); const [t,setT]=useState(null); const [loading,setLoading]=useState(true); const [saved,setSaved]=useState(false);
  useEffect(()=>{api(`/temples/${id}`).then(d=>{setT(d.temple); api(`/analytics/event`,{method:"POST",body:JSON.stringify({type:"page_view",templeId:id})}).catch(()=>{})}).catch(()=>{}).finally(()=>setLoading(false)); setSaved(JSON.parse(localStorage.getItem("saved_temples")||"[]").includes(id));},[id]);
  if(loading) return <div className="container py-5">Loading...</div>;
  if(!t) return <div className="container py-5"><div className="alert alert-warning">Temple not found.</div></div>;
  const toggleSave=()=>{let a=JSON.parse(localStorage.getItem("saved_temples")||"[]"); if(a.includes(id))a=a.filter(x=>x!==id);else a.push(id);localStorage.setItem("saved_temples",JSON.stringify(a));setSaved(!saved);};
  const share=async()=>{const data={title:t.name,text:`Explore ${t.name} on Temple Heritage India`,url:location.href}; if(navigator.share) await navigator.share(data); else {await navigator.clipboard?.writeText(location.href);alert("Link copied.");}};
  return <main className="container py-5">
    <Link to="/" className="text-decoration-none"><i className="bi bi-arrow-left me-2"></i>Back to directory</Link>
    <div className="detail-hero mt-3"><div><span className="badge bg-warning text-dark">{t.category}</span><h1 className="display-5 fw-bold mt-3">{t.name}</h1><p className="lead mb-1">{t.city}, {t.state} • {t.deity}</p>{t.verified && <span className="text-success"><i className="bi bi-patch-check-fill me-1"></i>Verified content</span>}</div><div className="d-flex gap-2"><button className="btn btn-light" onClick={toggleSave}><i className={`bi ${saved?"bi-bookmark-fill":"bi-bookmark"} me-1`}></i>{saved?"Saved":"Save"}</button><button className="btn btn-light" onClick={share}><i className="bi bi-share me-1"></i>Share</button></div></div>
    <div className="row g-4 mt-1">
      <Info title="Historical Background" text={t.history}/>
      <Info title="Deity & Significance" text={t.significance}/>
      <Info title="Rituals & Daily Pooja" text={t.rituals}/>
      <Info title="Pooja Schedule" text={t.poojaSchedule}/>
      <Info title="Darshan Timings" text={t.darshan}/>
      <Info title="Festivals" text={t.festivals}/>
      <Info title="Dress Code & Rules" text={`${t.dressCode} ${t.rules}`}/>
      <Info title="Nearby Facilities" text={`Accommodation: ${t.accommodation}\n\nTransport: ${t.transport}`}/>
    </div>
    <div className="card border-0 shadow-sm mt-4"><div className="card-body"><h2 className="h5">Location</h2><p className="text-secondary">{t.city}, {t.state}</p>{t.lat&&t.lng&&<a className="btn btn-outline-dark" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${t.lat},${t.lng}`}><i className="bi bi-map me-2"></i>Open in Google Maps</a>}</div></div>
  </main>;
}
function Info({title,text}){return <div className="col-md-6"><div className="info-card h-100"><h2 className="h5">{title}</h2><p className="mb-0 text-secondary" style={{whiteSpace:"pre-line"}}>{text}</p></div></div>}

function Circuits(){const circuits=[["Char Dham","Badrinath • Dwarka • Puri • Rameswaram"],["Jyotirlinga Trail","Somnath • Mahakaleshwar • Kashi Vishwanath • Kedarnath"],["South India Heritage","Madurai • Thanjavur • Tirumala • Kanchipuram"]]; return <main className="container py-5"><span className="eyebrow">PILGRIMAGE</span><h1 className="mb-4">Popular pilgrimage circuits</h1><div className="row g-4">{circuits.map(([n,d])=><div className="col-md-4" key={n}><div className="circuit-card h-100"><i className="bi bi-signpost-2"></i><h2 className="h5 mt-3">{n}</h2><p>{d}</p><small className="text-secondary">Use the temple directory to research each stop and plan your visit.</small></div></div>)}</div></main>}

function Saved(){const [ids,setIds]=useState(JSON.parse(localStorage.getItem("saved_temples")||"[]")); const [ts,setTs]=useState([]); useEffect(()=>{api("/temples").then(d=>setTs(d.temples.filter(t=>ids.includes(t.id)))).catch(()=>setTs(fallbackTemples.filter(t=>ids.includes(t.id))))},[ids.join(",")]); return <main className="container py-5"><span className="eyebrow">YOUR LIST</span><h1>Saved temples</h1>{!ts.length?<div className="alert alert-light border mt-4">You have not saved any temples yet. Open a temple and tap Save.</div>:<div className="row g-4 mt-2">{ts.map(t=><TempleCard key={t.id} temple={t}/>)}</div>}</main>}

function Admin(){const [token,setToken]=useState(localStorage.getItem("temple_admin_token")); if(!token)return <AdminLogin onLogin={t=>{localStorage.setItem("temple_admin_token",t);setToken(t)}}/>; return <AdminDashboard onLogout={()=>{localStorage.removeItem("temple_admin_token");setToken(null)}}/>}
function AdminLogin({onLogin}){const [email,setEmail]=useState("admin@templeheritage.local"),[password,setPassword]=useState("ChangeMe123!"),[err,setErr]=useState(""); const submit=async e=>{e.preventDefault();try{const d=await api("/auth/login",{method:"POST",body:JSON.stringify({email,password})});onLogin(d.token)}catch(x){setErr(x.message)}}; return <main className="container py-5" style={{maxWidth:520}}><div className="card shadow-sm border-0"><div className="card-body p-4"><span className="eyebrow">SECURE CMS</span><h1 className="h3">Admin sign in</h1><p className="text-secondary">Manage content, approvals, categories, regions and KPI data.</p>{err&&<div className="alert alert-danger">{err}</div>}<form onSubmit={submit}><label className="form-label">Email</label><input className="form-control mb-3" value={email} onChange={e=>setEmail(e.target.value)}/><label className="form-label">Password</label><input type="password" className="form-control mb-3" value={password} onChange={e=>setPassword(e.target.value)}/><button className="btn btn-dark w-100">Sign in</button></form><small className="text-secondary d-block mt-3">Demo: admin@templeheritage.local / ChangeMe123!</small></div></div></main>}

function AdminDashboard({onLogout}){const [tab,setTab]=useState("overview"),[data,setData]=useState(null),[editing,setEditing]=useState(null),[msg,setMsg]=useState("");
  const load=()=>Promise.all([api("/admin/dashboard"),api("/admin/temples"),api("/admin/categories"),api("/admin/regions")]).then(([dashboard,temples,categories,regions])=>setData({...dashboard,...temples,...categories,...regions})).catch(e=>{if(e.message.toLowerCase().includes("token"))onLogout()});
  useEffect(load,[]);
  if(!data)return <div className="container py-5">Loading admin dashboard...</div>;
  const saveTemple=async form=>{try{await api(editing?`/admin/temples/${editing.id}`:"/admin/temples",{method:editing?"PUT":"POST",body:JSON.stringify(form)});setEditing(null);setMsg("Temple saved.");load()}catch(e){setMsg(e.message)}};
  const action=async(path,method="PATCH")=>{try{await api(path,{method});setMsg("Updated.");load()}catch(e){setMsg(e.message)}};
  return <main className="container-fluid py-4 admin-bg"><div className="container"><div className="d-flex flex-wrap justify-content-between align-items-center mb-4"><div><span className="eyebrow">CONTENT MANAGEMENT SYSTEM</span><h1 className="h2 mb-0">Temple Heritage Admin</h1></div><button className="btn btn-outline-dark" onClick={onLogout}>Logout</button></div>{msg&&<div className="alert alert-info">{msg}</div>}
    <ul className="nav nav-pills mb-4 gap-2">{["overview","temples","categories","regions"].map(x=><li className="nav-item" key={x}><button className={`nav-link ${tab===x?"active":""}`} onClick={()=>setTab(x)}>{x[0].toUpperCase()+x.slice(1)}</button></li>)}</ul>
    {tab==="overview"&&<><div className="row g-3">{[["Temples listed",data.kpis.templesListed,"bi-bank"],["Monthly active users",data.kpis.monthlyActiveUsers,"bi-people"],["Search success rate",data.kpis.searchSuccessRate+"%","bi-search"],["Page engagement",data.kpis.pageEngagementTime+" min","bi-clock"],["User satisfaction",data.kpis.userSatisfactionScore+"/5","bi-star"]].map(([a,b,c])=><div className="col-md-6 col-xl"><div className="kpi-card"><i className={`bi ${c}`}></i><small>{a}</small><strong>{b}</strong></div></div>)}</div><div className="card border-0 shadow-sm mt-4"><div className="card-body"><h2 className="h5">Portal readiness</h2><div className="row g-2"><Status label="Temple information" ok/><Status label="Pilgrimage & visitor information" ok/><Status label="Search & discovery" ok/><Status label="Admin approval workflow" ok/><Status label="Category & region management" ok/><Status label="Save & share" ok/><Status label="Responsive UI" ok/></div></div></div></>}
    {tab==="temples"&&<><div className="d-flex justify-content-end mb-3"><button className="btn btn-dark" onClick={()=>setEditing({})}>+ Add temple</button></div>{editing!==null&&<TempleForm temple={editing} categories={data.categories} onCancel={()=>setEditing(null)} onSave={saveTemple}/>}<div className="table-responsive bg-white shadow-sm rounded"><table className="table align-middle mb-0"><thead><tr><th>Name</th><th>Location</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{data.temples.map(t=><tr key={t.id}><td>{t.name}</td><td>{t.city}, {t.state}</td><td><span className={`badge ${t.verified?"text-bg-success":"text-bg-warning"}`}>{t.verified?"Approved":"Pending"}</span></td><td>{t.featured?"Yes":"No"}</td><td className="d-flex gap-1"><button className="btn btn-sm btn-outline-primary" onClick={()=>setEditing(t)}>Edit</button>{!t.verified&&<button className="btn btn-sm btn-outline-success" onClick={()=>action(`/admin/temples/${t.id}/approve`)}>Approve</button>}<button className="btn btn-sm btn-outline-danger" onClick={()=>action(`/admin/temples/${t.id}`,"DELETE")}>Delete</button></td></tr>)}</tbody></table></div></>}
    {tab==="categories"&&<Taxonomy title="Categories" items={data.categories} endpoint="/admin/categories" onChange={load}/>}
    {tab==="regions"&&<Taxonomy title="Regions / States" items={data.regions} endpoint="/admin/regions" onChange={load}/>}
  </div></main>
}
function Status({label,ok}){return <div className="col-md-6"><div className="status-line"><i className={`bi ${ok?"bi-check-circle-fill text-success":"bi-exclamation-circle text-warning"}`}></i>{label}</div></div>}
function Taxonomy({title,items,endpoint,onChange}){const [value,setValue]=useState(""); const add=async()=>{if(!value.trim())return;try{await api(endpoint,{method:"POST",body:JSON.stringify({name:value.trim()})});setValue("");onChange()}catch(e){alert(e.message)}}; return <div className="card border-0 shadow-sm"><div className="card-body"><h2 className="h5">{title}</h2><div className="input-group mb-3"><input className="form-control" value={value} onChange={e=>setValue(e.target.value)} placeholder={`Add ${title.toLowerCase()}`}/><button className="btn btn-dark" onClick={add}>Add</button></div><div className="d-flex flex-wrap gap-2">{items.map(x=><span className="badge rounded-pill text-bg-light border p-2" key={x}>{x}</span>)}</div></div></div>}
function TempleForm({temple,categories,onCancel,onSave}){const [f,setF]=useState({name:"",state:"",city:"",deity:"",category:categories[0]||"",history:"",significance:"",rituals:"",poojaSchedule:"",darshan:"",festivals:"",dressCode:"",rules:"",accommodation:"",transport:"",featured:false,verified:false,...temple}); const set=(k,v)=>setF({...f,[k]:v}); return <div className="card border-0 shadow-sm mb-3"><div className="card-body"><h2 className="h5">{temple.id?"Edit temple":"Add temple"}</h2><div className="row g-2">{["name","state","city","deity","history","significance","rituals","poojaSchedule","darshan","festivals","dressCode","rules","accommodation","transport"].map(k=><div className={["history","significance","rituals","poojaSchedule","rules","accommodation","transport"].includes(k)?"col-md-6":"col-md-4"} key={k}><label className="form-label text-capitalize">{k.replace(/([A-Z])/g," $1")}</label><textarea className="form-control" rows={["history","significance","rituals","poojaSchedule","rules","accommodation","transport"].includes(k)?3:1} value={f[k]||""} onChange={e=>set(k,e.target.value)}/></div>)}<div className="col-md-4"><label className="form-label">Category</label><select className="form-select" value={f.category} onChange={e=>set("category",e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></div><div className="col-md-4 form-check ms-2 mt-4"><input className="form-check-input" type="checkbox" checked={!!f.featured} onChange={e=>set("featured",e.target.checked)}/><label className="form-check-label">Featured temple</label></div><div className="col-md-4 form-check ms-2 mt-4"><input className="form-check-input" type="checkbox" checked={!!f.verified} onChange={e=>set("verified",e.target.checked)}/><label className="form-check-label">Verified / approved</label></div></div><div className="mt-3 d-flex gap-2"><button className="btn btn-dark" onClick={()=>onSave(f)}>Save</button><button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button></div></div></div>}

function App(){return <><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/temple/:id" element={<TempleDetail/>}/><Route path="/circuits" element={<Circuits/>}/><Route path="/saved" element={<Saved/>}/><Route path="/admin" element={<Admin/>}/></Routes></>}
export default App;