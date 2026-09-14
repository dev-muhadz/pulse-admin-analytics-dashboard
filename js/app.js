/* Pulse UI interactions: sidebar, theme, dashboard date/greeting, charts, table search/filter and user dialog. */
document.addEventListener("DOMContentLoaded",()=>{sidebar();theme();charts();dashboardDate();userSearch();addUserDialog()});

function sidebar(){
 const s=document.querySelector("#sidebar"),c=document.querySelector("#collapse"),m=document.querySelector("#mobileMenu"),shade=document.querySelector("#shade");
 if(!s)return;
 const isMobile=()=>window.matchMedia("(max-width: 760px)").matches;
 const focusable=()=>[...s.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
 let lastTrigger=null;
 c?.addEventListener("click",()=>{const mini=s.classList.toggle("mini");c.setAttribute("aria-expanded",String(!mini));c.setAttribute("aria-label",mini?"Expand sidebar":"Collapse sidebar")});
 const close=(restoreFocus=false)=>{const wasOpen=s.classList.contains("open");s.classList.remove("open");shade?.classList.remove("open");m?.setAttribute("aria-expanded","false");if(wasOpen&&restoreFocus)lastTrigger?.focus({preventScroll:true})};
 const open=()=>{if(!isMobile())return;lastTrigger=m;s.classList.add("open");shade?.classList.add("open");m?.setAttribute("aria-expanded","true");requestAnimationFrame(()=>focusable()[0]?.focus({preventScroll:true}))};
 m?.addEventListener("click",()=>s.classList.contains("open")?close(true):open());
 s.querySelectorAll(".side-nav a").forEach(link=>link.addEventListener("click",()=>{if(isMobile())close(false)}));
 shade?.addEventListener("click",()=>close(false));
 document.addEventListener("keydown",e=>{if(!isMobile()||!s.classList.contains("open"))return;if(e.key==="Escape"){e.preventDefault();close(false);return}if(e.key!=="Tab")return;const items=focusable();if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus({preventScroll:true})}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus({preventScroll:true})}});
 window.addEventListener("resize",()=>{if(!isMobile())close()});
}

function theme(){
 const root=document.documentElement,b=document.querySelector("#theme"),saved=localStorage.getItem("pulse-theme");
 if(saved)root.dataset.theme=saved;
 const paint=()=>{if(b){const dark=root.dataset.theme==="dark";b.textContent=dark?"☀":"☾";b.setAttribute("aria-label",dark?"Switch to light theme":"Switch to dark theme")}};
 paint();
 b?.addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";localStorage.setItem("pulse-theme",root.dataset.theme);paint();window.pulseCharts?.forEach(c=>c.update())});
}

function dashboardDate(){
 const dateEl=document.querySelector("#dashboardDate"),greetingEl=document.querySelector("#dashboardGreeting");
 if(!dateEl&&!greetingEl)return;
 const update=()=>{
   const now=new Date();
   if(dateEl)dateEl.textContent=new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(now);
   if(greetingEl){const hour=now.getHours();const greeting=hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";greetingEl.firstChild.textContent=`${greeting}, Alex `;}
 };
 update();
 const delay=60000-(Date.now()%60000);
 window.setTimeout(()=>{update();window.setInterval(update,60000)},delay);
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
 const input=document.querySelector("#userSearch"),table=document.querySelector("#usersTable"),filter=document.querySelector("#userStatusFilter");
 if(!input||!table)return;
 const apply=()=>{const q=input.value.toLowerCase().trim();const status=filter?.value.toLowerCase()||"all status";table.querySelectorAll("tbody tr").forEach(row=>{const matchesText=row.textContent.toLowerCase().includes(q);const rowStatus=row.querySelector(".status")?.textContent.toLowerCase()||"";const matchesStatus=status==="all status"||rowStatus===status;row.style.display=matchesText&&matchesStatus?"":"none"})};
 input.addEventListener("input",apply);filter?.addEventListener("change",apply);
}

function addUserDialog(){
 const modal=document.querySelector("#addUserModal"),openBtn=document.querySelector("#addUserBtn"),closeBtn=document.querySelector("#closeAddUser"),cancelBtn=document.querySelector("#cancelAddUser"),form=document.querySelector("#addUserForm"),message=document.querySelector("#addUserMessage");
 if(!modal||!openBtn||!form)return;
 let lastTrigger=null;
 const focusable=()=>[...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
 const close=()=>{modal.hidden=true;document.body.classList.remove("modal-open");message&&(message.textContent="");form.reset();lastTrigger?.focus()};
 const open=()=>{lastTrigger=document.activeElement;modal.hidden=false;document.body.classList.add("modal-open");requestAnimationFrame(()=>document.querySelector("#newUserName")?.focus())};
 openBtn.addEventListener("click",open);closeBtn?.addEventListener("click",close);cancelBtn?.addEventListener("click",close);
 modal.addEventListener("click",e=>{if(e.target===modal)close()});
 document.addEventListener("keydown",e=>{if(modal.hidden)return;if(e.key==="Escape"){e.preventDefault();close();return}if(e.key!=="Tab")return;const items=focusable();if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
 form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;message.textContent="User added successfully in this demo.";form.querySelector(".modal-submit")?.setAttribute("disabled","true");window.setTimeout(()=>{form.querySelector(".modal-submit")?.removeAttribute("disabled");close()},1200)});
}
