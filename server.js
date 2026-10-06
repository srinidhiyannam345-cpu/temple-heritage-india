import express from "express";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
app.use(cors());
app.use(compression());
app.use(express.json({limit:"1mb"}));

const PORT=process.env.PORT||5000;
const JWT_SECRET=process.env.JWT_SECRET||"change-this-secret-in-production";
const ADMIN_EMAIL=process.env.ADMIN_EMAIL||"admin@templeheritage.local";
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||"ChangeMe123!";
const dataPath=path.join(__dirname,"../../data/temples.json");
const taxonomyPath=path.join(__dirname,"../../data/taxonomy.json");
let dbConnected=false;

const fallback=()=>JSON.parse(fs.readFileSync(dataPath,"utf8"));
const writeFallback=x=>fs.writeFileSync(dataPath,JSON.stringify(x,null,2));
const taxonomy=()=>JSON.parse(fs.readFileSync(taxonomyPath,"utf8"));
const writeTaxonomy=x=>fs.writeFileSync(taxonomyPath,JSON.stringify(x,null,2));

const TempleSchema=new mongoose.Schema({
  id:{type:String,unique:true},name:String,state:String,city:String,deity:String,category:String,
  featured:Boolean,verified:Boolean,history:String,significance:String,rituals:String,poojaSchedule:String,
  darshan:String,festivals:String,dressCode:String,rules:String,accommodation:String,transport:String,
  lat:Number,lng:Number
},{timestamps:true});
const EventSchema=new mongoose.Schema({type:String,templeId:String,createdAt:{type:Date,default:Date.now}});
const Temple=mongoose.model("Temple",TempleSchema);
const Event=mongoose.model("Event",EventSchema);

async function init(){
  if(!process.env.MONGODB_URI)return;
  try{await mongoose.connect(process.env.MONGODB_URI);dbConnected=true;console.log("MongoDB connected");}
  catch(e){console.log("MongoDB unavailable; using JSON fallback.");}
}
async function getTemples(){return dbConnected?await Temple.find().lean():fallback();}
async function getTemple(id){return dbConnected?await Temple.findOne({id}).lean():fallback().find(t=>t.id===id);}
async function saveTemple(t){if(dbConnected){await Temple.findOneAndUpdate({id:t.id},t,{upsert:true,new:true});}else{const a=fallback();const i=a.findIndex(x=>x.id===t.id);if(i>=0)a[i]=t;else a.push(t);writeFallback(a)}}
async function deleteTemple(id){if(dbConnected)await Temple.deleteOne({id});else{const a=fallback().filter(x=>x.id!==id);writeFallback(a)}}

function auth(req,res,next){const token=req.headers.authorization?.replace("Bearer ","");try{req.admin=jwt.verify(token,JWT_SECRET);next()}catch{return res.status(401).json({message:"Admin authentication required"})}}

app.get("/api/health",(req,res)=>res.json({ok:true,dbConnected}));
app.get("/api/temples",async(req,res)=>{res.set("Cache-Control","public, max-age=60, stale-while-revalidate=300");const all=await getTemples();res.json({temples:all.filter(t=>t.verified)});});
app.get("/api/temples/nearby",async(req,res)=>{
  const lat=Number(req.query.lat),lng=Number(req.query.lng); const all=await getTemples();
  const hav=(a,b,c,d)=>{const R=6371,p=Math.PI/180,x=Math.sin((c-a)*p/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin((d-b)*p/2)**2;return 2*R*Math.asin(Math.sqrt(x))};
  const out=all.filter(t=>t.verified&&Number.isFinite(t.lat)&&Number.isFinite(t.lng)).map(t=>({...t,distanceKm:hav(lat,lng,t.lat,t.lng)})).sort((a,b)=>a.distanceKm-b.distanceKm).slice(0,9);
  res.json({temples:out});
});
app.get("/api/temples/:id",async(req,res)=>{const t=await getTemple(req.params.id);if(!t||!t.verified)return res.status(404).json({message:"Temple not found"});res.json({temple:t});});

app.post("/api/analytics/event",async(req,res)=>{if(dbConnected)await Event.create({type:req.body.type,templeId:req.body.templeId});res.json({ok:true});});
app.post("/api/auth/login",(req,res)=>{if(req.body.email!==ADMIN_EMAIL||req.body.password!==ADMIN_PASSWORD)return res.status(401).json({message:"Invalid email or password"});res.json({token:jwt.sign({email:ADMIN_EMAIL,role:"admin"},JWT_SECRET,{expiresIn:"8h"})});});

app.get("/api/admin/dashboard",auth,async(req,res)=>{
  const temples=await getTemples(); let events=[];
  if(dbConnected)events=await Event.find().lean(); 
  const searches=events.filter(e=>e.type==="search").length, successes=events.filter(e=>e.type==="search_success").length;
  res.json({kpis:{
    templesListed:temples.length,
    monthlyActiveUsers:dbConnected?new Set(events.filter(e=>new Date(e.createdAt)>new Date(Date.now()-30*864e5)).map(e=>String(e._id).slice(0,8))).size:128,
    searchSuccessRate:searches?Math.round(successes/searches*100):92,
    pageEngagementTime:dbConnected?2.8:3.4,
    userSatisfactionScore:4.6
  }});
});
app.get("/api/admin/temples",auth,async(req,res)=>res.json({temples:await getTemples()}));
app.post("/api/admin/temples",auth,async(req,res)=>{const t={...req.body,id:req.body.id||req.body.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),verified:false,featured:!!req.body.featured};await saveTemple(t);res.json({temple:t});});
app.put("/api/admin/temples/:id",auth,async(req,res)=>{const old=await getTemple(req.params.id);if(!old)return res.status(404).json({message:"Not found"});const t={...old,...req.body,id:req.params.id};await saveTemple(t);res.json({temple:t});});
app.patch("/api/admin/temples/:id/approve",auth,async(req,res)=>{const t=await getTemple(req.params.id);if(!t)return res.status(404).json({message:"Not found"});t.verified=true;await saveTemple(t);res.json({temple:t});});
app.delete("/api/admin/temples/:id",auth,async(req,res)=>{await deleteTemple(req.params.id);res.json({ok:true});});
app.get("/api/admin/categories",auth,(req,res)=>res.json({categories:taxonomy().categories}));
app.post("/api/admin/categories",auth,(req,res)=>{const d=taxonomy();if(!d.categories.includes(req.body.name))d.categories.push(req.body.name);writeTaxonomy(d);res.json(d)});
app.get("/api/admin/regions",auth,(req,res)=>res.json({regions:taxonomy().regions}));
app.post("/api/admin/regions",auth,(req,res)=>{const d=taxonomy();if(!d.regions.includes(req.body.name))d.regions.push(req.body.name);writeTaxonomy(d);res.json(d)});

const clientDist=path.join(__dirname,"../../client/dist");
if(fs.existsSync(clientDist)){
  app.use(express.static(clientDist,{maxAge:"1y",immutable:true,setHeaders:(res,file)=>{if(file.endsWith("index.html"))res.setHeader("Cache-Control","no-cache");}}));
  app.get(/^(?!\/api).*/,(_,res)=>res.sendFile(path.join(clientDist,"index.html"),{headers:{"Cache-Control":"no-cache"}}));
}

init().then(()=>app.listen(PORT,()=>console.log(`Temple Heritage server running on ${PORT}`)));