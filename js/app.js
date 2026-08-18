/* Pulse UI interactions: sidebar, theme persistence, Chart.js charts and table search. */
document.addEventListener("DOMContentLoaded",()=>{sidebar();theme();charts();userSearch()});

function sidebar(){
 const s=document.querySelector("#sidebar"),c=document.querySelector("#collapse"),m=document.querySelector("#mobileMenu"),shade=document.querySelector("#shade");
 c?.addEventListener("click",()=>s.classList.toggle("mini"));
 const toggle=()=>{s.classList.toggle("open");shade?.classList.toggle("open")};
 m?.addEventListener("click",toggle);shade?.addEventListener("click",toggle);
}

function theme(){
 const root=document.documentElement,b=document.querySelector("#theme"),saved=localStorage.getItem("pulse-theme");
 if(saved)root.dataset.theme=saved;
 const paint=()=>{if(b)b.textContent=root.dataset.theme==="dark"?"☀":"☾"};
 paint();
 b?.addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";localStorage.setItem("pulse-theme",root.dataset.theme);paint();window.pulseCharts?.forEach(c=>c.update())});
}

function charts(){
 const sales=document.querySelector("#salesChart"),traffic=document.querySelector("#trafficChart");
 if(!sales||!traffic||typeof Chart==="undefined")return;
 const grid=getComputedStyle(document.documentElement).getPropertyValue("--line").trim();
 const text=getComputedStyle(document.documentElement).getPropertyValue("--muted").trim();
 const sc=new Chart(sales,{type:"line",data:{labels:["01","05","10","15","20","25","30"],datasets:[{label:"Revenue",data:[18,24,21,35,31,48,55],borderColor:"#635bff",backgroundColor:"rgba(99,91,255,.08)",fill:true,tension:.38,pointRadius:3,pointBackgroundColor:"#635bff"}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:text,font:{size:9}}},y:{grid:{color:grid},ticks:{color:text,font:{size:9},callback:v=>"$"+v+"k"}}}}});
 const tc=new Chart(traffic,{type:"doughnut",data:{labels:["Organic","Direct","Social","Referral"],datasets:[{data:[42,28,18,12],backgroundColor:["#635bff","#3d8bfd","#16a57a","#e89a3d"],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:"72%",plugins:{legend:{display:false}}}});
 window.pulseCharts=[sc,tc];
}

function userSearch(){
 const input=document.querySelector("#userSearch"),table=document.querySelector("#usersTable");
 if(!input||!table)return;
 input.addEventListener("input",()=>{const q=input.value.toLowerCase().trim();table.querySelectorAll("tbody tr").forEach(row=>row.style.display=row.textContent.toLowerCase().includes(q)?"":"none")});
}
