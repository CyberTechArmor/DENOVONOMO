/* A dependency-free, illustrative practice blueprint. No workspace data is used. */
(() => {
  'use strict';
  const root = document.documentElement;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const blueprint = document.querySelector('.blueprint');
  const drawing = document.getElementById('practice-drawing');
  const motionToggle = document.getElementById('motion-toggle');
  if (!blueprint || !drawing || !motionToggle) return;
  // Project floor coordinates into an isometric illustration.
  const p = (x, y, z = 0) => [380 + (x - y) * .76, 123 + (x + y) * .37 - z];
  const points = list => list.map(v => p(...v).join(',')).join(' ');
  const polygon = (list, cls) => `<polygon points="${points(list)}" class="${cls}"/>`;
  const path = (list, cls) => `<polyline points="${points(list)}" class="${cls}"/>`;
  const label = (x,y,text) => { const [sx,sy] = p(x,y); return `<text x="${sx}" y="${sy}" class="plan-label">${text}</text>`; };
  const box = (x,y,w,d,h,top='device-body',side='device-side') => polygon([[x,y,h],[x+w,y,h],[x+w,y+d,h],[x,y+d,h]],top) + polygon([[x,y+d,h],[x+w,y+d,h],[x+w,y+d,0],[x,y+d,0]],side) + polygon([[x+w,y,h],[x+w,y+d,h],[x+w,y+d,0],[x+w,y,0]],side);
  const monitor = (x,y) => box(x-8,y-2,68,35,20) + polygon([[x,y+4,25],[x+47,y+4,25],[x+47,y+4,63],[x,y+4,63]],'device-screen') + path([[x+7,y+4,52],[x+31,y+4,52]],'screen-line') + path([[x+7,y+4,44],[x+23,y+4,44]],'screen-line') + path([[x+23,y+4,25],[x+23,y+4,20]],'plan-outline');
  let grid = '';
  for(let n=-40;n<=440;n+=40){grid += path([[n,-40],[n,400]],'plan-grid') + path([[-40,n],[440,n]],'plan-grid');}
  let base = polygon([[0,0,-10],[400,0,-10],[400,340,-10],[0,340,-10]],'wall-front') + polygon([[0,0],[400,0],[400,340],[0,340]],'plan-room');
  base += polygon([[10,10],[180,10],[180,145],[10,145]],'plan-room') + polygon([[210,10],[390,10],[390,145],[210,145]],'plan-room') + polygon([[10,195],[180,195],[180,330],[10,330]],'plan-room') + polygon([[210,195],[390,195],[390,330],[210,330]],'plan-room');
  base += box(0,0,400,8,50,'wall-top','wall-front') + box(0,8,8,332,50,'wall-top','wall-front');
  base += box(185,8,7,108,30,'wall-top','wall-front') + box(8,153,135,7,30,'wall-top','wall-front') + box(230,153,170,7,30,'wall-top','wall-front') + box(185,219,7,121,30,'wall-top','wall-front');
  base += label(30,120,'EXAM 01') + label(240,120,'EXAM 02') + label(30,305,'OPERATIONS') + label(253,308,'RECEPTION');
  base += box(35,35,55,60,19) + polygon([[38,38,23],[87,38,23],[87,94,23],[38,94,23]],'device-body') + box(245,35,55,60,19) + polygon([[248,38,23],[297,38,23],[297,94,23],[248,94,23]],'device-body');
  base += box(255,235,110,30,28) + box(295,280,22,22,13) + box(335,280,22,22,13);
  let network = path([[82,206,20],[82,175,3],[370,175,3]],'network-line');
  [[110,90],[320,90],[100,260],[305,235]].forEach(([x,y])=>{network += path([[x,175,3],[x,y,3]],'network-line');const [sx,sy]=p(x,y,4);network+=`<circle cx="${sx}" cy="${sy}" r="5" class="signal-dot connection-node"/>`;});
  network += box(35,207,40,45,60,'device-screen','device-side');
  [15,28,41,52].forEach(z=>{network+=path([[40,253,z],[68,253,z]],'screen-line');});
  let systems = monitor(115,60) + monitor(320,60) + monitor(100,240) + monitor(305,235);
  const [wx,wy]=p(192,153,65);
  systems += `<g fill="none" stroke="#52733b" stroke-width="1.8"><path d="M${wx-17},${wy}q17,-18 34,0M${wx-11},${wy+6}q11,-12 22,0M${wx-5},${wy+12}q5,-6 10,0"/><circle cx="${wx}" cy="${wy+17}" r="1.5" fill="#52733b"/></g>`;
  let ready='';
  [[85,65,87],[280,65,87],[315,242,89]].forEach(([x,y,z])=>{const [sx,sy]=p(x,y,z);ready+=`<g class="ready-check"><circle cx="${sx}" cy="${sy}" r="14" fill="#d9fa65" stroke="#52733b"/><path d="M${sx-6},${sy}l4,4 8,-9" fill="none" stroke="#243c31" stroke-width="2"/><path d="M${sx},${sy+17}v18" stroke="#72933b" stroke-dasharray="2 3"/></g>`;});
  const illustration = document.createElementNS('http://www.w3.org/2000/svg','g');
  illustration.innerHTML = `<g opacity=".8">${grid}</g><g class="diagram-float">${base}<g class="network-layer">${network}</g><g class="system-layer">${systems}</g><g class="ready-layer">${ready}</g></g><path d="M100 429l-20 10 20 10m-20-10h43M630 160v35m-8-27 8-8 8 8" class="plan-cross"/><text x="66" y="469" class="plan-label" style="font-size:7px">DN / PRACTICE BLUEPRINT</text>`;
  drawing.appendChild(illustration);
  const stages = [ ['Lay the foundation.','A network your whole practice can build on.'], ['Connect the care.','Bring workstations and clinical systems into the plan.'], ['Make opening day tangible.','Turn the technology plan into a launch checklist.'] ];
  let currentStage=0, paused=motionQuery.matches, autoAdvance=true, heroVisible=true;
  const layerButtons = [...document.querySelectorAll('[data-layer]')];
  const caption=document.querySelector('.layer-caption');
  function setStage(index){
    currentStage=index;blueprint.dataset.stage=String(index);
    layerButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.layer)===index)));
    document.getElementById('stage-number').textContent=String(index+1).padStart(2,'0');
    document.getElementById('stage-title').textContent=stages[index][0];
    document.getElementById('stage-description').textContent=stages[index][1];
  }
  // Autonomous motion should not interrupt screen readers; manual exploration is announced.
  layerButtons.forEach(button=>button.addEventListener('click',()=>{autoAdvance=false;caption.setAttribute('aria-live','polite');setStage(Number(button.dataset.layer));}));
  function setPaused(value){
    paused=value;root.classList.toggle('motion-paused',value);motionToggle.setAttribute('aria-pressed',String(value));
    motionToggle.replaceChildren(document.createTextNode(value?'Resume motion ':'Pause motion '));
    const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.textContent=value?'▷':'Ⅱ';motionToggle.appendChild(icon);
  }
  setPaused(paused);
  motionToggle.addEventListener('click',()=>setPaused(!paused));
  motionQuery.addEventListener('change',event=>setPaused(event.matches));
  const stageTimer=setInterval(()=>{if(!paused&&autoAdvance&&heroVisible&&!document.hidden)setStage((currentStage+1)%stages.length);},6500);
  window.addEventListener('pagehide',()=>clearInterval(stageTimer),{once:true});
  const domains=[
    ['Network infrastructure','Start with the backbone: internet, network design, firewalls, wireless, cabling, servers, and power.'],
    ['Endpoints & workstations','Plan the devices at every point of care, from front-office computers to clinical workstations, mobile devices, and peripherals.'],
    ['EHR & practice management','Explore EHR selection, practice management, prescribing, patient portals, clinical decision support, and lab interfaces.'],
    ['Clinical devices','Bring vitals, ECG, imaging, point-of-care testing, and other connected clinical equipment into the technology plan.'],
    ['Telephony & communications','Work through VoIP, fax, unified communications, paging, and after-hours coverage.'],
    ['Security & resilience','Explore identity, endpoint protection, backups, incident response, risk assessment, and security and privacy planning.'],
    ['Data & analytics','Plan for clinical dashboards, quality measures, population health, financial analytics, and data exchange.'],
    ['Patient experience','Connect the patient journey across digital intake, check-in, communications, telehealth, payments, and patient Wi-Fi.'],
    ['Administration & operations','Coordinate scheduling, staffing systems, credentialing, inventory, contracts, training, and back-office technology.'],
    ['Integration & interoperability','Understand FHIR, interface engines, health information exchange, referrals, care coordination, and third-party connections.'],
    ['Remote access & continuity','Explore VPNs, virtual desktops, cloud and on-premises choices, and downtime planning.'],
    ['AI & emerging technology','Explore ambient documentation, conversational AI, coding and billing tools, predictive analytics, and AI governance.']
  ];
  document.querySelectorAll('[data-domain]').forEach(button=>button.addEventListener('click',()=>{
    const index=Number(button.dataset.domain);
    document.querySelectorAll('[data-domain]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    document.getElementById('domain-code').textContent=`LAYER ${String(index+1).padStart(2,'0')} / 12`;
    document.getElementById('domain-title').textContent=domains[index][0];
    document.getElementById('domain-description').textContent=domains[index][1];
  }));
  const previews=[
    `<div class="preview-content"><span class="preview-kicker">IMPLEMENTATION GUIDE / NETWORK</span><h3>A stronger foundation.</h3><div class="preview-meta"><span>Network architecture</span><span>•</span><span>Versioned documentation</span></div><p>Start with the connections that every other system depends on.</p><div class="preview-guide-row"><span>01 &nbsp; Internet & redundancy</span><span>↗</span></div><div class="preview-guide-row"><span>02 &nbsp; Network segmentation</span><span>↗</span></div><div class="preview-guide-row"><span>03 &nbsp; Wireless coverage</span><span>↗</span></div><div class="preview-highlight"><span>↳</span><span>Carry the context into your technology decisions.</span></div></div>`,
    `<div class="preview-content"><span class="preview-kicker">DECISIONS & COST PLANNING</span><h3>See the bigger picture.</h3><p>A sample network scenario, with upfront and recurring costs shown together.</p><div class="cost-line"><span>Network equipment · one-time</span><strong>$5,000</strong></div><div class="cost-bar"><span style="width:74%"></span></div><div class="cost-line"><span>Licensing · $150 / month × 12</span><strong>$1,800</strong></div><div class="cost-bar"><span style="width:26%"></span></div><div class="cost-total"><span>ILLUSTRATIVE FIRST-YEAR TOTAL</span><strong>$6,800</strong></div><div class="preview-fine">Example figures only. Not a quote or a practice budget.</div></div>`,
    `<div class="preview-content"><span class="preview-kicker">IMPLEMENTATION / SAMPLE LOCATION</span><h3>One step closer to care.</h3><p>Turn a shared plan into work with clear ownership.</p><div class="kanban"><div><div class="kanban-heading">IN PROGRESS / 02</div><div class="kanban-card">Configure clinical Wi-Fi<small>IT TEAM · NETWORK</small></div><div class="kanban-card">Review EHR setup<small>PRACTICE MANAGER</small></div></div><div><div class="kanban-heading">COMPLETE / 01</div><div class="kanban-card done">✓ &nbsp; Map workstation locations<small>IT TEAM · ENDPOINTS</small></div></div></div><div class="preview-fine">Illustrative tasks. Your workspace starts with your plan.</div></div>`
  ];
  const workflowPanel=document.getElementById('workflow-panel');workflowPanel.innerHTML=previews[0];
  document.querySelectorAll('[data-workflow]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-workflow]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    workflowPanel.innerHTML=previews[Number(button.dataset.workflow)];
  }));
  if('IntersectionObserver' in window){
    const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveals.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(element=>reveals.observe(element));root.classList.add('js-ready');
    new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;}).observe(blueprint);
  }
})();
