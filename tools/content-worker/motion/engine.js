// Motor de motion EDevsHub. A página monta as cenas a partir do timeline.json e window.seek(t) desenha
// o quadro do instante t de forma determinística (o render tira um print por quadro).
// window.__cues lista os pontos de efeito sonoro, para a mixagem bater com a imagem.
(()=>{
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=t=>1-Math.pow(1-clamp(t),3);
const inout=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
const back=t=>{t=clamp(t);const c=1.6;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rich=s=>esc(s).replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`(.+?)`/g,'<code>$1</code>');
const el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const MARK='<svg viewBox="0 0 30 30"><rect x="3" y="3" width="5" height="24" rx="2.5" fill="#F3EDE0"/><rect x="22" y="3" width="5" height="24" rx="2.5" fill="#F3EDE0"/><rect x="8" y="13.5" width="3" height="3" fill="#F3EDE0"/><rect x="19" y="13.5" width="3" height="3" fill="#F3EDE0"/><circle cx="15" cy="15" r="2.6" fill="#F5B935"/></svg>';
const CURSOR='<svg viewBox="0 0 44 58"><path d="M2 2v44l11-10 8 19 8-4-8-18h15z" fill="#F3EDE0" stroke="#06110B" stroke-width="3" stroke-linejoin="round"/></svg>';
const BOOKMARK='<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>';

let D,S=[],ANIM=[],TICK=[],CUES=[],LAYOUT=[],CAP=null,GROUPS=[];
const cue=(t,sfx,gain=0)=>CUES.push({t:+t.toFixed(3),sfx,gain});
// anima um elemento: entra em `at` segundos depois do início da cena
function anim(e,scene,at,fx='rise',dur=.55){ANIM.push({e,scene,at,fx,dur});return e;}

function noise(){
  let s=0x2f6b1d;const r=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),im=x.createImageData(256,256);
  for(let i=0;i<im.data.length;i+=4){const v=r()*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}
  x.putImageData(im,0,0);return c.toDataURL();
}

// ---------- construtores de cena ----------
function head(sc,s,{eyebrow=true}={}){
  const h=el('div','head');
  if(s.eyebrow&&eyebrow)h.append(anim(el('div','eyebrow',rich(s.eyebrow)),sc,0,'fade',.4));
  h.append(anim(el('h1','title'+(s.small?' s':''),rich(s.title)),sc,s.titleAt??.05,'rise',.5));
  if(s.sub)h.append(anim(el('p','sub',rich(s.sub)),sc,s.subAt??.3,'rise',.5));
  return h;
}
const B={
  hook(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body');root.append(b);
    if(s.number){
      const n=anim(el('div','big',esc(s.number)),sc,0,'pop',.6);n.style.fontSize=(s.numberSize||330)+'px';
      const lab=anim(el('div','eyebrow',esc(s.numberLabel||'')),sc,.1,'fade');lab.style.margin='26px 0 30px';
      const ch=el('div','chips');(s.chips||[]).forEach((c,i)=>ch.append(anim(el('span','chip'+(i<3?' hot':''),'<span class="dot"></span>'+esc(c)),sc,.2+i*.12,'pop',.4)));
      b.append(n,lab,ch);
      (s.chips||[]).forEach((c,i)=>{if(sc.start+.2+i*.12>.05)cue(sc.start+.2+i*.12,i%2?'pop':'device',-6);});
      TICK.push({scene:sc,f:lt=>{n.style.textShadow=`0 0 ${70+30*Math.sin(lt*2.4)}px rgba(245,185,53,${.32+.08*Math.sin(lt*2.4)})`;
        [...ch.children].forEach((c,i)=>{c.style.translate=`0 ${Math.sin(lt*1.6+i*.9)*5}px`;});}});
    }
    if(s.morph){
      const m=el('div','morph');
      const gen=anim(el('div','mock card gen','<small>'+esc(s.morph[0])+'</small><div class="l" style="width:70%"></div><div class="l"></div><div class="l" style="width:55%"></div><div class="bt"></div>'),sc,0,'left');
      const arr=anim(el('div','arrow','→'),sc,.15,'fade');
      const mine=anim(el('div','mock card mine','<small>'+esc(s.morph[1])+'</small><div class="l a"></div><div class="l"></div><div class="l" style="width:62%"></div><div class="bt"></div>'),sc,0,'pop');
      m.append(gen,arr,mine);b.append(m);
      TICK.push({scene:sc,f:lt=>{mine.style.boxShadow=`0 30px 80px rgba(0,0,0,.45),0 0 ${40+25*Math.sin(lt*2.2)}px rgba(245,185,53,.25)`;arr.style.translate=`${Math.sin(lt*3)*8}px 0`;}});
    }
  },
  evidence(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body');root.append(b);
    const br=anim(el('div','browser'),sc,.1,'pop',.55);
    br.innerHTML=`<div class="bar"><span></span><span></span><span></span><div class="url">🔒 <b>${esc(s.url||'')}</b></div></div>`;
    const vp=el('div','vp');const img=el('img');img.src=s.image;vp.append(img);br.append(vp);b.append(br);
    let mk=null;if(s.mark){mk=el('div','mark');vp.append(mk);cue(sc.start+(s.mark.at||1.4),'select',-8);}
    if(s.credit)b.append(anim(el('div','credit',esc(s.credit)),sc,.4,'fade'));
    const W=936;
    TICK.push({scene:sc,f:lt=>{
      const k=s.frames;let a=k[0],z=k[0];for(let i=0;i<k.length;i++){if(lt>=k[i].t)a=k[i];if(lt<k[i].t){z=k[i];break;}z=k[i];}
      const p=a===z?1:inout((lt-a.t)/(z.t-a.t));
      const x=a.x+(z.x-a.x)*p,y=a.y+(z.y-a.y)*p,w=a.w+(z.w-a.w)*p,sca=W/w;
      img.style.transform=`translate(${-x*sca}px,${-y*sca}px) scale(${sca})`;
      if(mk){const m=s.mark,q=ease((lt-(m.at||1.4))/.35);mk.style.opacity=q;
        mk.style.left=((m.x-x)*sca-10)+'px';mk.style.top=((m.y-y)*sca-10)+'px';mk.style.width=(m.w*sca+20)+'px';mk.style.height=(m.h*sca+20)+'px';mk.style.transform=`scale(${1.08-.08*q})`;}
    }});
  },
  hub(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body');root.append(b);const hub=el('div','hub');b.append(hub);
    const n=s.targets.length;
    const src=anim(el('div','src card','<small>'+esc(s.sourceLabel||'CONECTE UMA VEZ')+'</small><b></b>'),sc,.1,'pop');hub.append(src);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');hub.append(svg);
    const dst=s.targets.map((t,i)=>{const d=anim(el('div','dst',esc(t)+'<span class="ck"></span>'),sc,.25+i*.1,'left',.4);hub.append(d);
      const p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('fill','none');p.setAttribute('stroke-width','4');p.setAttribute('stroke-linecap','round');svg.append(p);return {d,p,at:1+i*.32};});
    LAYOUT.push(()=>{const H=hub.clientHeight,rowH=H/n;src.style.top=(H/2-95)+'px';dst.forEach((x,i)=>{const y=i*rowH+rowH/2;x.d.style.top=(y-38)+'px';x.p.setAttribute('d',`M340 ${H/2} C 420 ${H/2}, 420 ${y}, 516 ${y}`);});});
    dst.forEach(x=>cue(sc.start+x.at,'click',-7));
    const name=src.querySelector('b');
    TICK.push({scene:sc,f:lt=>{
      name.textContent=s.sources[Math.floor(Math.max(0,lt)/1.1)%s.sources.length];
      dst.forEach(x=>{const on=lt>=x.at;x.d.classList.toggle('on',on);const q=ease((lt-x.at+.3)/.3);
        x.p.setAttribute('stroke',on?'#7BE3A4':'#30453C');x.p.style.strokeDasharray='300';x.p.style.strokeDashoffset=String(300*(1-q));});
    }});
  },
  terminal(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body');root.append(b);
    const t=anim(el('div','term'),sc,.05,'pop',.45);t.style.position='relative';
    t.innerHTML=`<div class="bar"><span></span><span></span><span></span><em>${esc(s.app||'copilot')}</em></div><div class="in"><span class="p">❯</span><span class="cmd"></span><span class="caret"></span></div>`;
    const tabs=el('div','tabs',(s.tabs||[]).map(x=>`<span>${esc(x)}</span>`).join(''));const rows=el('div','rows');
    (s.rows||[]).forEach(r=>rows.append(el('div','row',`<span class="ic">${esc(r.slice(0,1))}</span>${esc(r)}<span class="btn">Connect</span>`)));
    t.append(tabs,rows);b.append(t);
    if(s.note)b.append(anim(el('div','credit',esc(s.note)),sc,.6,'fade'));
    const cur=el('div','cursor',CURSOR);t.append(cur);
    const t0=.45,cps=.075,typed=t0+s.command.length*cps,tabAt=typed+.45,rowAt=tabAt+.35,moveAt=rowAt+(s.rows.length)*.12+.25,clickAt=moveAt+.75;
    for(let i=0;i<s.command.length;i++)cue(sc.start+t0+i*cps,'key',-4);
    cue(sc.start+typed+.1,'device',-6);cue(sc.start+tabAt,'click',-6);cue(sc.start+clickAt,'select',-3);
    const cmd=t.querySelector('.cmd'),caret=t.querySelector('.caret');
    TICK.push({scene:sc,f:lt=>{
      cmd.textContent=s.command.slice(0,clamp(Math.floor((lt-t0)/cps)+1,0,s.command.length));
      caret.style.opacity=(lt<typed+.3||Math.floor(lt*2.2)%2)?1:0;
      tabs.style.opacity=ease((lt-typed-.1)/.3);
      [...tabs.children].forEach((x,i)=>x.classList.toggle('on',i===(lt>=tabAt?s.active:0)));
      [...rows.children].forEach((r,i)=>{const q=ease((lt-rowAt-i*.12)/.35);r.style.opacity=q;r.style.transform=`translateY(${(1-q)*24}px)`;
        const btn=r.querySelector('.btn'),done=i===s.click&&lt>=clickAt;btn.classList.toggle('ok',done);btn.textContent=done?'Connected ✓':'Connect';
        btn.style.transform=i===s.click&&lt>=clickAt&&lt<clickAt+.15?'scale(.92)':'none';});
      const target=rows.children[s.click];
      if(target&&lt>=moveAt-.3){const tr=t.getBoundingClientRect(),br=target.querySelector('.btn').getBoundingClientRect();
        const ex=br.left-tr.left+br.width*.5,ey=br.top-tr.top+br.height*.55,sx=tr.width*.45,sy=tr.height*.3,q=inout((lt-moveAt)/.7);
        cur.style.opacity=ease((lt-moveAt+.3)/.3);cur.style.left=(sx+(ex-sx)*q)+'px';cur.style.top=(sy+(ey-sy)*q)+'px';cur.style.transform=lt>=clickAt&&lt<clickAt+.15?'scale(.85)':'none';}
      else cur.style.opacity=0;
    }});
  },
  badges(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body');root.append(b);
    s.items.forEach((it,i)=>{const at=.35+i*.4;b.append(anim(el('div','badge card '+(it.tone||'info'),`<span class="ic">${it.tone==='ok'?'✓':it.tone==='warn'?'!':'i'}</span><div><b>${rich(it.label)}</b>${it.text?'<p>'+rich(it.text)+'</p>':''}</div>`),sc,at,'left',.45));cue(sc.start+at,i%2?'pop':'device',-7);});
  },
  compare(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body');root.append(b);const g=el('div','cmp');b.append(g);
    s.cards.forEach((c,i)=>{const at=.35+i*.45;g.append(anim(el('div','card '+(c.tone||''),`<small>${esc(c.label)}</small><b>${rich(c.value)}</b>${c.note?'<p>'+rich(c.note)+'</p>':''}`),sc,at,'pop',.5));cue(sc.start+at,i?'select':'pop',-6);});
  },
  list(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body list');root.append(b);
    s.items.forEach((it,i)=>{const at=.3+i*.22;b.append(anim(el('div','item',`<span class="k">${esc(it.k)}</span><span class="v">${rich(it.v)}${it.note?'<small>'+rich(it.note)+'</small>':''}</span>`),sc,at,'left',.45));cue(sc.start+at,'click',-9);});
  },
  steps(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body steps');root.append(b);
    s.groups.forEach((g,i)=>{const at=.3+i*.35;b.append(anim(el('div','grp card',`<small>${esc(g.name)}</small><div class="chain">${g.steps.map(x=>'<span>'+esc(x)+'</span>').join('<i>→</i>')}</div>`),sc,at,'rise',.45));cue(sc.start+at,'pop',-8);});
  },
  chips(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body');root.append(b);const ch=el('div','chips');ch.style.gap='20px';b.append(ch);
    s.items.forEach((c,i)=>{const at=.3+i*.25;const x=anim(el('span','chip'+(c.hot?' hot':''),(c.dot===false?'':'<span class="dot"></span>')+rich(c.label||c)),sc,at,'pop',.4);x.style.fontSize='40px';x.style.padding='22px 32px';ch.append(x);cue(sc.start+at,i%2?'pop':'device',-7);});
    if(s.note)b.append(anim(el('p','sub',rich(s.note)),sc,.5+s.items.length*.25,'fade'));
  },
  prompt(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body');root.append(b);
    const pr=anim(el('div','prompt card','<span class="txt"></span><span class="caret"></span><span class="send">↑</span>'),sc,.05,'pop',.45);
    const pro=anim(el('div','proto card','<div class="side"></div><div class="main"><div class="blk a"></div><div class="blk"></div><div class="blk"></div></div>'),sc,.2,'rise');
    b.append(pr,pro);const blks=[...pro.querySelectorAll('.blk')];
    const t0=.35,cps=.03,typed=t0+s.prompt.length*cps,sendAt=typed+.25;
    for(let i=0;i<s.prompt.length;i+=2)cue(sc.start+t0+i*cps,'key',-6);
    cue(sc.start+sendAt,'select',-4);blks.forEach((_,i)=>cue(sc.start+sendAt+.35+i*.3,'pop',-7));
    const txt=pr.querySelector('.txt'),caret=pr.querySelector('.caret');
    TICK.push({scene:sc,f:lt=>{
      txt.textContent=s.prompt.slice(0,clamp(Math.floor((lt-t0)/cps)+1,0,s.prompt.length));caret.style.opacity=lt<sendAt?(Math.floor(lt*2.4)%2?1:.2):0;
      blks.forEach((x,i)=>{const q=back((lt-sendAt-.35-i*.3)/.45);x.style.opacity=clamp(q*1.4);x.style.transform=`scale(${.85+.15*q})`;x.textContent=lt>=sendAt+.35+i*.3?(s.parts[i]||''):'';});
    }});
  },
  cta(sc,s,root){
    root.append(head(sc,s));
    const b=el('div','body cta');root.append(b);const o=el('div','opts');b.append(o);
    const opts=s.options.map((x,i)=>{const at=.35+i*.18;cue(sc.start+at,'pop',-8);return o.appendChild(anim(el('div','opt','<i>'+String.fromCharCode(65+i)+'</i>'+esc(x)),sc,at,'left',.4));});
    if(s.text)b.append(anim(el('p','sub',rich(s.text)),sc,.3,'fade'));
    if(s.save)b.append(anim(el('div','save',BOOKMARK+rich(s.save)),sc,.4+opts.length*.18,'fade'));
    TICK.push({scene:sc,f:lt=>{const k=Math.floor(Math.max(0,lt-1.2)/.9)%opts.length;opts.forEach((x,i)=>x.classList.toggle('on',lt>1.2&&i===k));}});
  },
};
// cena genérica para roteiros sem estrutura (vindos do painel): número grande vazado + pontos opcionais
B.statement=(sc,s,root)=>{
  root.append(head(sc,s));
  const b=el('div','body');root.append(b);
  // no carrossel cada slide é uma cena só: o número vem da posição do slide (capa = 0)
  const n=D.format==='carousel'?D.slide-1:sc.i+1;
  const k=s.mark?anim(el('div','idx-mark',(D.theme&&D.theme.mark)||MARK),sc,.05,'pop',.6):anim(el('div','idx',esc(s.index||String(n).padStart(2,'0'))),sc,.05,'pop',.6);b.append(k);
  if(s.points){const ch=el('div','chips');s.points.forEach((p,i)=>{ch.append(anim(el('span','chip','<span class="dot"></span>'+rich(p)),sc,.4+i*.2,'pop',.4));cue(sc.start+.4+i*.2,'pop',-8);});b.append(ch);}
  TICK.push({scene:sc,f:lt=>{k.style.translate=`${Math.sin(lt*1.3)*10}px 0`;}});
};
const _hook=B.hook;
B.hook=(sc,s,root)=>{if(s.number||s.morph)return _hook(sc,s,root);B.statement(sc,{...s,mark:true},root);};
B.cover=B.hook;

// ---------- montagem ----------
function build(){
  const st=document.querySelector('.stage');st.classList.add(D.format);
  st.style.height=D.height+'px';
  st.insertAdjacentHTML('afterbegin',`<div class="bg-grid"></div><div class="bg-glow"></div><div class="bg-glow b"></div><div class="vignette"></div><div class="bg-noise" style="background-image:url(${noise()})"></div>`);
  // tema da marca: cores viram variáveis CSS; logo e nome substituem os da EDevsHub
  const th=D.theme||{};for(const [k,v] of Object.entries(th.colors||{}))st.style.setProperty('--'+k,v);
  if(th.font)st.style.setProperty('--sans',th.font+',Geist,system-ui,sans-serif');
  const br=el('div','brand',(th.mark||MARK)+'<b>'+esc(th.name||'EDevsHub')+'</b><i>'+esc(D.series||'RADAR IA')+'</i>'+(D.when?'<span class="when">'+esc(D.when)+'</span>':''));st.append(br);
  D.scenes.forEach((s,i)=>{const root=el('section','scene');const sc={i,start:s.start,end:s.end,root,s};S.push(sc);st.append(root);
    (B[s.kind]||(()=>{throw Error('cena desconhecida: '+s.kind);}))(sc,s,root);
    if(i>0&&D.format==='reel')cue(s.start,i%2?'whoosh':'back',-5);});
  if(D.source){st.append(el('div','source',esc(D.source)));}
  if(D.format==='reel'&&D.words?.length){
    CAP=el('div','cap','<div></div>');st.append(CAP);
    let g=[];const flush=()=>{if(g.length)GROUPS.push(g);g=[];};
    D.words.forEach(w=>{g.push(w);const chars=g.map(x=>x.text).join(' ').length;if(/[.,?!:;]$/.test(w.text)||g.length>=3||chars>=17)flush();});flush();
  }
  if(D.format==='carousel'){
    const f=el('div','foot',`<span class="pg">${String(D.slide).padStart(2,'0')}/${String(D.total).padStart(2,'0')}</span><span class="bars">${Array.from({length:D.total},(_,i)=>'<span'+(i<D.slide?' class="on"':'')+'></span>').join('')}</span><span class="sw">${D.slide===1?'ARRASTE →':D.slide===D.total?'@'+esc((th.handle||'edevshub').toUpperCase()):esc((th.name||'EDevsHub').toUpperCase())}</span>`);
    st.append(f);
  }
  window.__cues=CUES.sort((a,b)=>a.t-b.t);
}

function seek(t){
  const st=document.querySelector('.stage');
  st.querySelector('.bg-grid').style.transform=`translate(${(t*14)%72}px,${(t*9)%72}px)`;
  st.querySelector('.bg-glow').style.transform=`translate(${Math.sin(t*.35)*120}px,${Math.cos(t*.28)*80}px)`;
  st.querySelector('.bg-glow.b').style.transform=`translate(${Math.cos(t*.3)*140}px,${Math.sin(t*.25)*90}px)`;
  let cur=S[0];for(const sc of S)if(t>=sc.start)cur=sc;
  S.forEach(sc=>sc.root.classList.toggle('on',sc===cur));
  const lt=t-cur.start,first=cur.i===0;
  // a capa (1ª cena do Reel, 1º slide do carrossel) precisa estar completa no quadro 0: é a miniatura no feed
  const hold=first&&(D.format==='reel'||D.slide===1)?1.5:.35;
  // entrada da cena: leve aproximação (a primeira já nasce pronta, é a capa)
  const q=first?1:ease(lt/.32);cur.root.style.opacity=first?1:clamp(.2+q);cur.root.style.transform=`scale(${1.035-.035*q})`;
  for(const a of ANIM){if(a.scene!==cur)continue;
    const p=first&&a.at<=hold?1:ease((lt-a.at)/a.dur),e=a.e;
    if(a.fx==='fade'){e.style.opacity=p;}
    else if(a.fx==='pop'){const b=first&&a.at<=hold?1:back((lt-a.at)/a.dur);e.style.opacity=clamp(p*1.6);e.style.transform=`scale(${.86+.14*b})`;}
    else if(a.fx==='left'){e.style.opacity=p;e.style.transform=`translateX(${(1-p)*-60}px)`;}
    else{e.style.opacity=p;e.style.transform=`translateY(${(1-p)*42}px)`;}
  }
  for(const k of TICK)if(k.scene===cur)k.f(lt);
  if(CAP){
    const box=CAP.firstChild;let g=null;
    for(let i=0;i<GROUPS.length;i++){const a=GROUPS[i][0].start-.06,z=i+1<GROUPS.length?GROUPS[i+1][0].start-.06:GROUPS[i].at(-1).end+.5;if(t>=a&&t<z){g=GROUPS[i];break;}}
    if(!g){box.style.opacity=0;}
    else{box.style.opacity=1;const k=ease((t-g[0].start+.06)/.12);box.style.transform=`scale(${.92+.08*k})`;
      box.innerHTML=g.map(w=>`<span class="${t>=w.start&&t<w.end+.05?'now':t>=w.start?'said':''}">${esc(w.text)}</span>`).join(' ');}
  }
}

async function boot(){
  const q=new URLSearchParams(location.search);
  D=await (await fetch(q.get('data'))).json();
  if(D.format==='carousel'){const i=+q.get('slide');const s=D.slides[i-1];D={...D,slide:i,total:D.slides.length,scenes:[{...s,start:0,end:D.slideSeconds}],duration:D.slideSeconds};}
  build();
  await document.fonts.ready;
  await Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;})));
  LAYOUT.forEach(f=>f());
  window.seek=seek;window.__comp={width:1080,height:D.height,duration:D.duration,fps:D.fps||30};
  seek(0);window.__ready=true;
}
boot().catch(e=>{window.__error=String(e&&e.stack||e);});
})();
