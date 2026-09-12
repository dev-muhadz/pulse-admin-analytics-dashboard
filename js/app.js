/* Pulse UI interactions: sidebar, theme persistence, Chart.js charts and table search. */
document.addEventListener("DOMContentLoaded",()=>{sidebar();theme();charts();userSearch()});

function sidebar(){
 const s=document.querySelector("#sidebar"),c=document.querySelector("#collapse"),m=document.querySelector("#mobileMenu"),shade=document.querySelector("#shade");
 if(!s)return;

 const isMobile=()=>window.matchMedia("(max-width: 760px)").matches;
 const focusable=()=>[...s.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
 let lastTrigger=null;

 c?.addEventListener("click",()=>{
   const mini=s.classList.toggle("mini");
   c.setAttribute("aria-expanded",String(!mini));
   c.setAttribute("aria-label",mini?"Expand sidebar":"Collapse sidebar");
 });

 const close=()=>{
   const wasOpen=s.classList.contains("open");
   s.classList.remove("open");
   shade?.classList.remove("open");
   m?.setAttribute("aria-expanded","false");
   if(wasOpen)lastTrigger?.focus();
 };

 const open=()=>{
   if(!isMobile())return;
   lastTrigger=m;
   s.classList.add("open");
   shade?.classList.add("open");
   m?.setAttribute("aria-expanded","true");
   requestAnimationFrame(()=>focusable()[0]?.focus());
 };

 m?.addEventListener("click",()=>s.classList.contains("open")?close():open());
 shade?.addEventListener("click",close);

 document.addEventListener("keydown",e=>{
   if(!isMobile()||!s.classList.contains("open"))return;
   if(e.key==="Escape"){e.preventDefault();close();return}
   if(e.key!=="Tab")return;
   const items=focusable();
   if(!items.length)return;
   const first=items[0],last=items[items.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 });

 window.addEventListener("resize",()=>{if(!isMobile())close()});
}

function theme(){
 const root=document.documentElement,b=document.querySelector("#theme"),saved=localStorage.getItem("pulse-theme");
 if(saved)root.dataset.theme=saved;
 const paint=()=>{if(b){const dark=root.dataset.theme==="dark";b.textContent=dark?"☀":"☾";b.setAttribute("aria-label",dark?"Switch to light theme":"Switch to dark theme")}};
 paint();
 b?.addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";localStorage.setItem("pulse-theme",root.dataset.theme);paint();window.pulseCharts?.forEach(c=>c.update())});
}

function charts(){
 const sales=document.querySelector("#salesChart"),traffic=document.querySelector("#trafficChart");
 if(!sales||!traffic||typeof Chart==="undefined")return;
 const grid=getComputedStyle(document.documentElement).getPropertyValue("--line").trim();
 const text=getComputedStyle(document.documentElement).getPropertyValue("--muted").trim();
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const sc=new Chart(sales,{type:"line",data:{labels:["01","05","10","15","20","25","30"],datasets:[{label:"Revenue",data:[18,24,21,35,31,48,55],borderColor:"#635bff",backgroundColor:"rgba(99,91,255,.08)",fill:true,tension:.38,pointRadius:3,pointBackgroundColor:"#635bff"}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:reduced?0:1000},plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:text,font:{size:9}}},y:{grid:{color:grid},ticks:{color:text,font:{size:9},callback:v=>"$"+v+"k"}}}}});
 const tc=new Chart(traffic,{type:"doughnut",data:{labels:["Organic","Direct","Social","Referral"],datasets:[{data:[42,28,18,12],backgroundColor:["#635bff","#3d8bfd","#16a57a","#e89a3d"],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:"72%",animation:{duration:reduced?0:1000},plugins:{legend:{display:false}}}});
 window.pulseCharts=[sc,tc];
}

function userSearch(){
 const input=document.querySelector("#userSearch"),table=document.querySelector("#usersTable");
 if(!input||!table)return;
 input.addEventListener("input",()=>{const q=input.value.toLowerCase().trim();table.querySelectorAll("tbody tr").forEach(row=>row.style.display=row.textContent.toLowerCase().includes(q)?"":"none")});
}
