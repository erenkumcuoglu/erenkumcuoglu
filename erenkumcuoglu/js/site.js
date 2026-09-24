(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bot=navigator.webdriver||/bot|crawl|spider|slurp|google|bing|yandex|baidu|duckduck|gpt|claude|anthropic|perplexity|facebookexternalhit|lighthouse/i.test(navigator.userAgent);
  if(reduce||bot||!('IntersectionObserver' in window)) return;

  /* 1. Smooth, weighted scrolling (desktop wheel/trackpad) */
  var lenis=null;
  try{
    if(window.Lenis){
      lenis=new Lenis({duration:1.15,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))},smoothWheel:true});
      (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());
      document.addEventListener('click',function(e){
        var a=e.target.closest&&e.target.closest('a[href^="#"]'); if(!a) return;
        var id=a.getAttribute('href'); if(id.length<2) return;
        var el=document.querySelector(id); if(!el) return;
        e.preventDefault(); lenis.scrollTo(el,{offset:-76});
      });
    }
  }catch(err){lenis=null}

  var vh=window.innerHeight;
  function below(el){return el.getBoundingClientRect().top>vh*0.92}
  var ease=function(t){return 1-Math.pow(1-t,3)};

  /* number helpers: animate the first number in an element's first text node */
  function countUp(el,dur,delay){
    var node=null; for(var i=0;i<el.childNodes.length;i++){if(el.childNodes[i].nodeType===3&&/\d/.test(el.childNodes[i].nodeValue)){node=el.childNodes[i];break}}
    if(!node) return;
    var txt=node.nodeValue, m=txt.match(/\d+(?:\.\d+)?/); if(!m) return;
    var end=parseFloat(m[0]), dec=(m[0].split('.')[1]||'').length, pre=txt.slice(0,m.index), post=txt.slice(m.index+m[0].length);
    node.nodeValue=pre+(0).toFixed(dec)+post;
    setTimeout(function(){
      var t0=null;
      (function step(ts){ if(!t0) t0=ts; var k=Math.min(1,(ts-t0)/dur);
        node.nodeValue=pre+(end*ease(k)).toFixed(dec)+post;
        if(k<1) requestAnimationFrame(step); else node.nodeValue=txt;
      })(performance.now());
    },delay||0);
  }

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      var el=en.target; io.unobserve(el);
      if(el.__run) el.__run(); else el.classList.add('in');
    });
  },{rootMargin:'0px 0px -12% 0px',threshold:0.12});

  /* 2. Section headlines rise in word by word */
  document.querySelectorAll('.sec-head h2, .contact h2, .act-head h3, .page-sec h2, .cj-name').forEach(function(h){
    if(!below(h)) return;
    var words=h.textContent.trim().split(/\s+/);
    h.innerHTML=words.map(function(w,i){return '<span class="w"><span style="--d:'+(i*55)+'ms">'+w.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span></span>'}).join(' ');
    h.classList.add('split-pre');
    h.__run=function(){h.classList.remove('split-pre')};
    io.observe(h);
  });

  /* 3. Blocks fade and rise, staggered within their group */
  var groups=['.cj-head','.case','.card','.pattern','.bl','.life-item','.about-copy p','.quote','.drawn p','.cj-end','.sec-head p','.thesis blockquote','.thesis .cols p','.act-head p','.tl-row','.full-story','.rec','.beliefs li','.now-list li','.posts li','.more','.tr-body p','.contact .lede','.channels > div','.offduty'];
  groups.forEach(function(sel){
    var last=null,idx=0;
    document.querySelectorAll(sel).forEach(function(el){
      if(!below(el)) return;
      if(el.parentElement!==last){last=el.parentElement;idx=0}
      el.style.setProperty('--d',Math.min(idx*70,350)+'ms'); idx++;
      el.classList.add('rv');
      var prev=el.__run;
      io.observe(el);
    });
  });

  /* 4. Career spine segments grow left to right */
  var bar=document.querySelector('.spine-bar');
  if(bar&&below(bar)){
    bar.querySelectorAll('a').forEach(function(a,i){a.style.setProperty('--d',(i*70)+'ms')});
    bar.classList.add('grow-pre');
    bar.__run=function(){bar.classList.remove('grow-pre')};
    io.observe(bar);
  }

  /* 5. Before/after rows: the bar travels from the old value to the new one, the delta counts up */
  document.querySelectorAll('.rec').forEach(function(row){
    if(!below(row)) return;
    var line=row.querySelector('.span'), dot=row.querySelector('.to'), labels=row.querySelectorAll('svg text.tl'), delta=row.querySelector('.delta');
    if(!line||!dot) return;
    var toLabel=labels[labels.length-1]; toLabel.classList.add('tl-to');
    var x1=parseFloat(line.getAttribute('x1')), x2=parseFloat(line.getAttribute('x2'));
    function set(x){line.setAttribute('x2',x+'%');dot.setAttribute('cx',x+'%');toLabel.setAttribute('x',x+'%')}
    set(x1); toLabel.style.opacity=0;
    var base=row.__run;
    row.__run=function(){
      row.classList.add('in');
      var t0=null, dur=1400, wait=250;
      setTimeout(function(){
        (function step(ts){ if(!t0) t0=ts; var k=Math.min(1,(ts-t0)/dur);
          set(x1+(x2-x1)*ease(k)); if(k>0.6) toLabel.style.opacity=1;
          if(k<1) requestAnimationFrame(step); else set(x2);
        })(performance.now());
      },wait);
      if(delta) countUp(delta,dur,wait);
    };
  });

  /* 6. Hero figures count up once on load */
  document.querySelectorAll('[data-count]').forEach(function(el,i){countUp(el,1600,500+i*150)});
})();
