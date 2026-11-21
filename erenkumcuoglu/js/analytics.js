/* Google Analytics 4 with Consent Mode v2 and a small consent banner.
   Shared by the main site and the blog (same origin), so one choice covers both.
   Until a visitor accepts, Google receives only cookieless, anonymous pings. */
(function(){
  var GA_ID='G-LNJQ2T6365', KEY='ek-consent';
  var w=window, d=document;
  w.dataLayer=w.dataLayer||[];
  function gtag(){w.dataLayer.push(arguments);} w.gtag=gtag;

  var choice=null;
  try{choice=localStorage.getItem(KEY);}catch(e){}

  gtag('consent','default',{
    analytics_storage: choice==='granted'?'granted':'denied',
    ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied',
    wait_for_update: 500
  });
  gtag('set','ads_data_redaction',true);
  gtag('js',new Date());
  gtag('config',GA_ID,{anonymize_ip:true});

  var s=d.createElement('script'); s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
  (d.head||d.documentElement).appendChild(s);

  function store(v){try{localStorage.setItem(KEY,v);}catch(e){}}
  function decide(v){
    store(v);
    gtag('consent','update',{analytics_storage:v});
    var b=d.getElementById('ek-cc');
    if(b){b.classList.add('out');setTimeout(function(){b.remove();},400);}
  }
  w.ekConsent={reset:function(){try{localStorage.removeItem(KEY);}catch(e){} location.reload();}};

  /* Events the site cares about */
  d.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a,button'); if(!a) return;
    var href=a.getAttribute('href')||'';
    var where=(a.closest('header,nav')&&'nav')||(a.closest('.hero')&&'hero')||(a.closest('#contact,.contact')&&'contact')||(a.closest('.cj-end')&&'page_end')||(a.closest('footer')&&'footer')||'page';
    if(/cal\.com\/erenkumcuoglu/.test(href)) gtag('event','request_call',{location:where,page_path:location.pathname});
    else if(/^mailto:/.test(href)) gtag('event','email_click',{location:where});
    else if(a.id==='copy-email') gtag('event','email_copy',{location:where});
    else if(/career-journey/.test(href)) gtag('event','career_journey_click',{location:where});
    else if(/linkedin\.com\/in\/erenkumcuoglu/.test(href)) gtag('event','linkedin_click',{location:where});
    else if(/substack\.com/.test(href)) gtag('event','substack_click',{location:where});
  },true);

  if(choice==='granted'||choice==='denied') return;

  function banner(){
    if(d.getElementById('ek-cc')) return;
    var st=d.createElement('style');
    st.textContent='#ek-cc{position:fixed;z-index:90;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));max-width:360px;display:flex;flex-direction:column;gap:14px;padding:18px 20px;background:#10151A;color:#F4F5F2;border-radius:2px;box-shadow:0 10px 30px rgba(0,0,0,.25);font-family:"Archivo","Helvetica Neue",Arial,sans-serif;text-align:left;transition:transform .4s cubic-bezier(.2,.7,.1,1),opacity .4s}'+
      '#ek-cc.out{transform:translateY(16px);opacity:0}'+
      '#ek-cc .k{font:500 12px/1 "IBM Plex Mono",ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#9AA3AC}'+
      '#ek-cc p{margin:0;font-size:15px;line-height:1.5;color:#DADDE0}'+
      '#ek-cc p a{color:inherit;text-decoration:underline;text-underline-offset:2px}'+
      '#ek-cc .r{display:flex;gap:10px;flex-wrap:wrap}'+
      '#ek-cc button{flex:1 1 0;min-height:44px;padding:10px 16px;border-radius:2px;font:600 15px "Archivo","Helvetica Neue",Arial,sans-serif;cursor:pointer;transition:background .2s,color .2s,border-color .2s}'+
      '#ek-cc .y{background:#F4F5F2;color:#10151A;border:1px solid #F4F5F2}'+
      '#ek-cc .n{background:transparent;color:#F4F5F2;border:1px solid #6B7279}'+
      '#ek-cc button:hover,#ek-cc button:focus-visible{background:#2536B5;border-color:#2536B5;color:#fff}'+
      '@media (max-width:520px){#ek-cc{left:max(16px,env(safe-area-inset-left,0px));max-width:none}}'+
      '@media (prefers-reduced-motion:reduce){#ek-cc{transition:none}}';
    d.head.appendChild(st);
    var b=d.createElement('div'); b.id='ek-cc';
    b.setAttribute('role','dialog'); b.setAttribute('aria-label','Analytics cookies');
    b.innerHTML='<span class="k">Analytics</span><p>I use Google Analytics to see which pages people read. Nothing is used for advertising or sold. <a href="/privacy">Privacy note</a></p><div class="r"><button type="button" class="n">Decline</button><button type="button" class="y">Accept</button></div>';
    b.querySelector('.n').onclick=function(){decide('denied');};
    b.querySelector('.y').onclick=function(){decide('granted');};
    d.body.appendChild(b);
  }
  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded',banner); else banner();
})();
