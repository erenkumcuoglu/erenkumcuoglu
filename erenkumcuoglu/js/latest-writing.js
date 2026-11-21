/* Homepage "Latest writing": pulls the newest posts from the blog's RSS feed
   (same origin via the /blog/* Netlify proxy), so new posts appear without
   redeploying this site. The static list in index.html stays as the
   no-JS / crawler / offline fallback. */
(function(){
  var list=document.getElementById('latest-posts');
  if(!list) return;
  var COUNT=5, MIN_YEAR=2015; /* the 2007-2011 archive is excluded */
  var FEED='/blog/index.xml', KEY='ek-latest-writing-v1', TTL=10*60*1000;

  /* "Now · November 2026" label stays current without edits */
  var lab=document.getElementById('now-label');
  if(lab){
    try{lab.textContent='Now · '+new Date().toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'Europe/Istanbul'})}catch(e){}
  }

  function lang(title){
    if(/[çğıöşüÇĞİÖŞÜ]/.test(title)) return 'tr';
    if(/\b(ve|bir|bu|mi|mı|için|ile|da|de|ne|nasıl|neden)\b/i.test(title)) return 'tr';
    return 'en';
  }
  function fmt(d){
    try{return d.toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Europe/Istanbul'})}catch(e){return ''}
  }
  function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  function parse(xml){
    var doc=new DOMParser().parseFromString(xml,'application/xml');
    if(doc.querySelector('parsererror')) return [];
    var out=[];
    doc.querySelectorAll('item').forEach(function(it){
      var t=(it.querySelector('title')||{}).textContent;
      var l=(it.querySelector('link')||{}).textContent;
      var p=(it.querySelector('pubDate')||{}).textContent;
      if(!t||!l||!p) return;
      var d=new Date(p);
      if(isNaN(d)||d.getFullYear()<MIN_YEAR) return;
      /* only ever link into our own blog */
      if(!/^https:\/\/(www\.)?erenkumcuoglu\.com\/blog\//.test(l)) return;
      out.push({t:t.trim(),u:l.trim(),d:d.getTime()});
    });
    out.sort(function(a,b){return b.d-a.d});
    return out.slice(0,COUNT);
  }

  function render(items){
    if(!items.length) return;
    list.innerHTML=items.map(function(p){
      var lg=lang(p.t);
      return '<li><a href="'+esc(p.u)+'" lang="'+lg+'"><span class="d">'+fmt(new Date(p.d))+'</span><span class="t">'+esc(p.t)+'</span><span class="l">'+lg.toUpperCase()+'</span></a></li>';
    }).join('');
  }

  var cached=null;
  try{
    var c=JSON.parse(sessionStorage.getItem(KEY)||'null');
    if(c&&Date.now()-c.at<TTL){cached=c.items}
  }catch(e){}
  if(cached){render(cached);return}

  fetch(FEED,{credentials:'same-origin'}).then(function(r){
    if(!r.ok) throw 0; return r.text();
  }).then(function(x){
    var items=parse(x);
    if(!items.length) return;
    render(items);
    try{sessionStorage.setItem(KEY,JSON.stringify({at:Date.now(),items:items}))}catch(e){}
  }).catch(function(){/* keep static fallback */});
})();
