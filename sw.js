"use strict";

function escapeHTML(x) {
 return x.replace(/[<&]/g,x=>x==="&"?"&amp;":"&lt;")
}

function escapeHTML2(x) {
 return x.replace(/["&]/g,x=>x==="&"?"&amp;":"&quot;")
}

function arrayBuffer(s) {
 s=unescape(encodeURIComponent(s));
 const x=new Uint8Array(s.length);
 for (let i=0;i<s.length;i++) x[i]=s.charCodeAt(i);
 return x.buffer
}

function stringPartition(a,b) {
 const n=a.indexOf(b)
 if (n>=0) return [a.slice(0,n),a.slice(n,n+b.length),a.slice(n+b.length)]
 else return [a,null,null]
}

function hasDefalteRaw() {
 try { new CompressionStream("deflate-raw") }
 catch (e) { return false }
 return true;
}

class S {
 static r2(...a) {
  const r=String.raw(...a).split('\n');
  if (r.length>=2) {
   r.shift();
   let n=0;
   while (r[0][n]===' ') n++;
   r.forEach((_,i)=>{ r[i]=r[i].slice(n) });
  }
  return r.join('\n');
 }
}



const HAS_DEFLATE_RAW=hasDefalteRaw();
const DB_NAME=location.href.slice(0,location.href.lastIndexOf("/")).replace(/:/g,"_")+":0";

function dbReq(r) {return new Promise((rs,rj)=>{
 r.onsuccess=()=>rs(r.result);
 r.onerror=()=>rj(r.error);
})}

function openDB(n) {return new Promise((rs,rj)=>{
 const r=indexedDB.open(n);
 r.onupgradeneeded=e=>{r.transaction.abort();rj(e.type)}
 r.onsuccess=()=>rs(r.result);
 r.onerror=()=>rj(r.error);
})}

function emptyResponse(n) {
 if (n!==void 0)
  return new Response(null,{status:n});
 else
  return new Response(null)
}

function php(s,req,name,path1,path2,password) {
 const base0=new URL(registration.scope).pathname;
 const xs_saves=`${base0}s/${encodeURI(name)}/saves.js`;
 const xs_pw=`${base0}s/${encodeURI(name)}/pw.js`;
 return s.replace("<?=INJECT?>",`<script>window.__p=${JSON.stringify(password)};document.currentScript.remove()</script><script src="${xs_pw}"></script><script src="${xs_saves}"></script>`)
}

async function getCache(x) {
 return await caches.match(x) || emptyResponse(404)
}

async function getResponseA_y(cid,req,db,apath,use_default,list_dir,name) {
 if (cid==="") {
   console.assert(req.mode==="navigate");
   const t=db.transaction(["a","b"]);
   const aid=await dbReq(t.objectStore("a").index("n").getKey(name));
   const bl=await dbReq(t.objectStore("b").index("a").getAll(aid));
   const bl2=[];
   const bl1=[];
   bl.forEach(x=>{
    const r=pwCacheB.has(x.i);
    if (r)
     bl2.push([x.i,pwCacheB.get(x.i)]);
    else
     bl1.push([x.i,x.n])
   });
   const xx=bl2.map(([k,v])=>`<input type=hidden name=password${k} value="${escapeHTML2(v)}" />`).join("");
   if (1) {
    return new Response(S.r2`
      <!DOCTYPE html><title>Password required</title><body><form method=post>${xx}</form><script>
      ${JSON.stringify(bl1)}.forEach(([i,n])=>{
       let v=prompt("Password required"+"\n"+n);
       if (v==null) return;
       let x=document.createElement("input");
       x.type="hidden";
       x.name="password"+i;
       document.querySelector('form').appendChild(x);
       x.value=v;
      });
      document.querySelector('form').submit();
      </script>`,{status:403,headers:{"content-type":"text/html;charset=utf-8"}});
   }
 } else {
  const c=await clients.get(cid);
  if (c==null) return emptyResponse(403);
  const r=await new Promise(rs=>{
   clientCall(c,"pw").then(x=>rs(x.data.r));
   setTimeout(()=>rs({}),200)
  });
  return await getResponseA_x(cid,req,db,apath,r,use_default,list_dir)
 }
}
async function getResponseA_x(cid,req,db,apath,password,use_default=true,list_dir=true) {
 const [name,,path]=stringPartition(stringPartition(stringPartition(apath,"#")[0],"?")[0],"/");
 const path1=path.split("/").map(x=>{try{return decodeURIComponent(x)}catch{return x}});
 const path2=path1.pop();
 if (req.method==="POST") {
  let xx;
  if (cid!=="") return emptyResponse(405);
  console.assert(req.mode==="navigate");
  try {
   xx=[...(await req.formData()).entries()].filter(([k,v])=>k.startsWith('password')&&k.length>8&&(k.slice(8)|0)==k.slice(8)).map(([k,v])=>[k.slice(8)|0,v]);
  } catch {
  }
  if (xx) {
   const t=db.transaction(["a","b"]);
   const aid=await dbReq(t.objectStore("a").index("n").getKey(name));
   if (aid!=null) {
    const bl=await dbReq(t.objectStore("b").index("a").getAll(aid));
    const pp=Object.fromEntries(xx);
    if (bl.every(x=>pp.hasOwnProperty(x.i))) {
     pwCacheA.set(aid,pp);
     xx.forEach(([k,v])=>pwCacheB.set(k|0,v));
    }
   }
  }
  return new Response(null,{status:303,headers:{"location":req.url}});
 }
 if (password==null && cid==="") {
  const xx=await dbReq(db.transaction(["a"]).objectStore("a").index("n").get(name));
  if (xx && xx.e && !pwCacheA.has(xx.i)) {
   return await getResponseA_y(cid,req,db,apath,use_default,list_dir,name);
  }
 }
 const t=db.transaction(["a","b","d","f"]);
 const ta=t.objectStore("a");
 const tb=t.objectStore("b");
 const td=t.objectStore("d");
 const tf=t.objectStore("f");
 let r;
 let x0;
 let xa;
 x0=await dbReq(ta.index("n").get(name));
 xxxx:
 if (x0!=null) {
  xa=x0.i;
  x0=x0.r;
  for (const p of path1) {
   x0=await dbReq(td.index("p").getKey([x0,p]));
   if (x0==null) break xxxx;
  }
  if (!path2) {
   let x1;
   if (use_default) {
    x1=await dbReq(td.index("p").get([x0,"index.html"]));
    if (x1!=null && x1.x!=null) {
     x1=await dbReq(tf.get(x1.x));
     if (x1==null) { console.warn("f",name,path) }
     else { r=x1 }
     break xxxx;
    }
   }
   if (!list_dir) break xxxx;
   x1=await dbReq(td.index("p").getAll(IDBKeyRange.bound([x0],[x0,[]])));
   {
    const r0=`Directory listing for ${escapeHTML(path)}`;
    const r1=x1.map(x=>{
      const isdir=x.x==null?"/":"";
      return `<li><a href="${encodeURIComponent(x.n)}${isdir}">${escapeHTML(x.n)}${isdir}</a></li>\n`
    }).join("");
    t.commit();
    return new Response(S.r2`
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
      <html>
      <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>${r0}</title>
      </head>
      <body>
      <h1>${r0}</h1>
      <hr>
      <ul>
      ${r1}</ul>
      <hr>
      </body>
      </html>
      `,{headers:{"content-type":"text/html;charset=utf-8"}});
   }
  } else {
   let x1=await dbReq(td.index("p").get([x0,path2]))
   if (x1==null)
    break xxxx;
   if (x1.x==null) {
    t.commit();
    return new Response(null,{status:308,headers:{"location":encodeURI(path2+"/")}});
   } else {
    x1=await dbReq(tf.get(x1.x));
    if (x1==null) { console.warn("f",name,path) }
    else { r=x1 }
    break xxxx;
   }
  }
 }
 if (r===void 0) {
  t.commit();
  return emptyResponse(404)
 }
 let r1=r.b;
 let kk;
 if (typeof r1==="number") {
  const xx=await dbReq(tb.get(r1));
  t.commit();
  if (xx.e) {
   let pw=password!=null?password[r1]:void 0;
   if (pw==null && pwCacheB.has(r1)) { pw=pwCacheB.get(r1) }
   if (pw==null) {
    if (password==null)
     return await getResponseA_y(cid,req,db,apath,use_default,list_dir,name);
    else
     return emptyResponse(403);
   }
   const x1=`${xx.e.iterations}:${Array.prototype.join.call(xx.e.salt,",")}:${pw}`;
   if (!kkCache.has(x1)) {
    try {
     const pw1=Uint8Array.from(unescape(encodeURIComponent(pw)),x=>x.charCodeAt(0));
     const kk0=await crypto.subtle.importKey('raw',pw1,'PBKDF2',false,['deriveKey']);
     kk=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:xx.e.salt,iterations:xx.e.iterations},kk0,{name:'AES-GCM',length:256},true,['decrypt']);
    } catch (e) {
     console.error(e);
     return emptyResponse(403);
    }
    try {
     kkCache.set(x1,await crypto.subtle.exportKey('raw',kk))
    } catch (e) {
     console.error(e);
    }
   } else {
    try {
     kk=await crypto.subtle.importKey('raw',kkCache.get(x1),{name:'AES-GCM',length:256},false,['decrypt']);
    } catch (e) {
     console.error(e);
     return emptyResponse(500);
    }
   }
  }
  r1=xx.x;
 } else {
  t.commit();
 }
 if (typeof FileSystemFileHandle!=="undefined" && r1 instanceof FileSystemFileHandle)
  r1=r1.getFile();
 if (r.e0!=null) {
  if (!(r1 instanceof Blob)) {
   console.warn("b,e",name,path,Object.prototype.toString.call(r1));
   return emptyResponse(500);
  }
  if (r.o==null) {
   console.warn("f.o",name,path);
   return emptyResponse(500);
  }
  if (r.e0!=="AES-GCM") {
   console.warn("f.e0",name,path,r.e0);
   return emptyResponse(500);
  }
  if (!kk) {
   console.warn("b.e",name,path);
   return emptyResponse(500);
  }
  const xx=await r1.slice(r.o,r.o+r.e1+r.s+r.e2).arrayBuffer();
  const xx0=xx.slice(0,r.e1);
  const xx1=xx.slice(r.e1);
  try {
   r1=await crypto.subtle.decrypt({name:'AES-GCM',iv:xx0,additionalData:Uint8Array.of(0xaf,0xb4,0xfe,0xfd),tagLength:r.e2*8},kk,xx1);
  } catch (e) {
   console.error(e);
   pwCacheB.clear();
   pwCacheA.clear();
   kkCache.clear();
   return emptyResponse(403);
  }
  if (r.c0==null) {
   void 0;
  } else if (r.c0==="deflate-raw") {
   const xx=r1;
   if (HAS_DEFLATE_RAW)
    r1=new ReadableStream({start(x){x.enqueue(xx);x.close()}}).pipeThrough(new DecompressionStream("deflate-raw"));
   else {
    const xx1=Uint32Array.of(r.c2,r.c1);
    r1=new ReadableStream({start(x){x.enqueue(Uint8Array.of(0x1f,0x8b,8,0,0,0,0,0,0,0));x.enqueue(xx);x.enqueue(xx1);x.close()}}).pipeThrough(new DecompressionStream("gzip"));
   }
  } else if (r.c0==="gzip") {
   const xx=r1;
   r1=new ReadableStream({start(x){x.enqueue(xx);x.close()}}).pipeThrough(new DecompressionStream("gzip"));
  } else {
   console.warn("f.c0",name,path,r.c0);
   return emptyResponse(500);
  }
  return new Response(r1);
 } else if (r1 instanceof Blob) {
  if (r.o!=null) r1=r1.slice(r.o,r.o+r.s);
  if (r.c0==null) {
   void 0;
  } else if (r.c0==="deflate-raw") {
   if (HAS_DEFLATE_RAW)
    r1=r1.stream().pipeThrough(new DecompressionStream("deflate-raw"));
   else
    r1=new Blob([Uint8Array.of(0x1f,0x8b,8,0,0,0,0,0,0,0),r1,Uint32Array.of(r.c2,r.c1)]).stream().pipeThrough(new DecompressionStream("gzip"));
  } else if (r.c0==="gzip") {
   r1=r1.stream().pipeThrough(new DecompressionStream("gzip"));
  } else {
   console.warn("f.c0",name,path,r.c0);
   return emptyResponse(500);
  }
  return new Response(r1);
 } else if (r1==="") {
  return emptyResponse();
 } else if (typeof r1==="string") {
  return new Response(arrayBuffer(php(r1,req,name,path1,path2,cid===""?pwCacheA.get(xa):null)));
 } else {
  console.warn("b",name,path,Object.prototype.toString.call(r1));
  return emptyResponse(500);
 }
}

async function getResponseA(req,cid,cid2,path) {
 if (req.method!=="GET"&&req.method!=="POST") return emptyResponse(405);
 if (path.indexOf("/")<0) return emptyResponse(404);
 const db=await openDB(DB_NAME);
 try {
  return await getResponseA_x(cid,req,db,path,null);
 } finally {
  db.close();
 }
}

async function getResponseC(req,cid,cid2,path) {
 if (req.method!="GET") return emptyResponse(405);
 return new Response("document.currentScript.remove()",{headers:{"content-type":"text/javascript;charset=utf-8"}});
}

async function getResponseH(req,cid,cid2,path) {
 if (req.method!="GET") return emptyResponse(405);
 return new Response("document.currentScript.remove()",{headers:{"content-type":"text/javascript;charset=utf-8"}});
}

async function getResponseS_saves(req,name) {
 let x0,x1;
 {
  const db=await openDB(DB_NAME);
  try {
   const t=db.transaction(["a","s"]);
   t.onabort=t.onerror=()=>{ x0=x1=void 0; };
   const ta=t.objectStore("a");
   const ts=t.objectStore("s");
   x0=await dbReq(ta.index("n").getKey(name));
   if (x0!=null) {
    x1=await dbReq(ts.get(x0));
    if (x1==null)
     x1={a:x0,x:[]};
   }
   t.commit();
  } catch (e) {
   console.warn(e);
  }
  db.close()
 }
 if (x0==void 0 || x1==void 0) return;
 let x2;
 if (x1.t===1) {
  console.assert(x1.x instanceof Array);
  const xx=["[",];
  for (let [k,v] of x1.x) {
   if (v instanceof ArrayBuffer) v=new Uint8Array(v);
   if (v instanceof Uint8Array) {
    v=`new Uint8Array([${v}])`;
   } else {
    v='""';
    console.warn("s",name,x0);
   }
   xx.push("[");
   xx.push(JSON.stringify(k));
   xx.push(",");
   xx.push(v);
   xx.push("]");
   xx.push(",");
  }
  xx.push("]");
  x2=xx.join("");
 } else if (x1.x instanceof Array) {
  try { x2=JSON.stringify(x1.x) }
  catch { console.warn("s",name,x0); x2="[]" };
 } else {
  try { x2=JSON.stringify(Object.entries(x1.x)) }
  catch { console.warn("s",name,x0); x2="[]" };
 }
 return new Response(S.r2`
   (function(){"use strict";
   document.currentScript.remove();

   let failed=false;

   const Storage_prototype=Object.getOwnPropertyDescriptors(Storage.prototype);

   function download() {
    const xx=${x2};
    Storage_prototype.clear.value.call(localStorage);
    for (let [k,v] of xx) {
     if (v instanceof Uint8Array)
      v=btoa(Array.prototype.map.call(v,x=>String.fromCharCode(x)).join(""));
     Storage_prototype.setItem.value.call(localStorage,k,v);
    }
   }

   function uploadFailed() {
    if (!failed) {
     failed=true;
     alert("failed to save");
     {
      const b=new Blob([JSON.stringify(localStorage)],{type:"application/json"});
      const u=URL.createObjectURL(b);
      const a=document.createElement('a');
      a.download="saves.json";
      a.target="_blank";
      a.href=u;
      a.click();
     }
    }
   }

   function getStorage() {
    const r=[];
    for (let i=0;i<Storage_prototype.length.get.call(localStorage);i++) {
     const k=Storage_prototype.key.value.call(localStorage,i);
     const v=Storage_prototype.getItem.value.call(localStorage,k);
     r.push([k,v]);
    }
    return r
   }

   function tryDecode(x) {
    const r=[];
    try {
     for (const [k,v] of x) {
      const s=atob(v);
      const x=new Uint8Array(s.length);
      for (let i=0;i<s.length;i++) x[i]=s.charCodeAt(i);
      r.push([k,x.buffer])
     }
     return r
    } catch {
     return void 0
    }
   }

   function upload() {
    const x=getStorage();
    const x1=tryDecode(x);
    const xx={a:${x0},t:(x1===void 0?null:1),x:(x1==void 0?x:x1)};
    const r=indexedDB.open(${JSON.stringify(DB_NAME)});
    r.onupgradeneeded=()=>r.transaction.abort();
    r.onerror=()=>uploadFailed();
    r.onsuccess=()=>{
     let t,s;
     try {
      t=r.result.transaction("s","readwrite");
      s=t.objectStore("s");
     } catch (e) {
      uploadFailed();
      return;
     }
     t.onabort=t.onerror=()=>{uploadFailed()};
     s.put(xx);
     t.commit();
    };
   }

   download();

   window.addEventListener('unload',e=>{
    if (!failed) {
     Storage_prototype.clear.value.call(localStorage);
    }
   });

   Storage.prototype.setItem=new Proxy(Storage.prototype.setItem,{apply(f,x,a) {
    Reflect.apply(f,x,a);
    if (x===localStorage) upload();
   }});

   Storage.prototype.removeItem=new Proxy(Storage.prototype.removeItem,{apply(f,x,a) {
    Reflect.apply(f,x,a);
    if (x===localStorage) upload();
   }});

   Storage.prototype.clear=new Proxy(Storage.prototype.clear,{apply(f,x,a) {
    Reflect.apply(f,x,a);
    if (x===localStorage) upload();
   }});
   })()
   `,{headers:{"content-type":"text/javascript;charset=utf-8"}});
}

async function getResponseS_pw(req,name) {
 return new Response(S.r2`
   (function(){"use strict";
   document.currentScript.remove();
   const PW=window.__p||{}; delete window.__p;
   const CONTROLLER=navigator.serviceWorker.controller;
   navigator.serviceWorker.addEventListener('message',e=>{
    if (e.source===CONTROLLER) {
     if (e.data.m==="pw") {
      CONTROLLER.postMessage({q:false,i:e.data.i,r:PW});
     }
    }
   });
   navigator.serviceWorker.startMessages();
   })()
   `,{headers:{"content-type":"text/javascript;charset=utf-8"}});
}

async function getResponseS(req,cid,cid2,url) {
 if (req.method!="GET") return emptyResponse(405);
 let r;
 if (url.indexOf('/')>=0) {
  const [name,,path]=stringPartition(url,"/");
  if (path==="saves.js")
   r=await getResponseS_saves(req,name);
  else if (path==="pw.js")
   r=await getResponseS_pw(req,name);
 }
 if (r===void 0) return new Response("document.currentScript.remove()",{headers:{"content-type":"text/javascript;charset=utf-8"}});
 else return r;
}

function genRandomStr() {
 let x=new Uint8Array(16);
 crypto.getRandomValues(x);
 const hex=x=>x>15?x.toString(16):"0"+x.toString(16);
 return `${hex(x[3])}${hex(x[2])}${hex(x[1])}${hex(x[0])}-${hex(x[5])}${hex(x[4])}-${hex(x[7])}${hex(x[6])}-${hex(x[8])}${hex(x[9])}-${hex(x[10])}${hex(x[11])}${hex(x[12])}${hex(x[13])}${hex(x[14])}${hex(x[15])}`;
}

function clientCall(c,m) {return new Promise(rs=>{
 let i=MESSAGE_PREFIX+(++MESSAGE_ID);
 msgMap.set(i,rs);
 c.postMessage({q:true,i,m})
})}

const pwCacheA=new Map();
const pwCacheB=new Map();
const kkCache=new Map();
const msgMap=new Map();
const MESSAGE_PREFIX=genRandomStr()+":";
let MESSAGE_ID=0;

self.oninstall=e=>{
 const FILES=['.','index.html','zip.js','notzip.js'];
 e.waitUntil(Promise.all([
   skipWaiting(),
   Promise.all(FILES.map(x=>fetch(new Request(x,{cache:"no-cache"})))).then(()=>caches.open('0').then(x=>x.addAll(FILES)))]));
};

self.onactivate=e=>{
 e.waitUntil(clients.claim());
};

self.onmessage=e=>{
 if ((e.data!=null?e.data.q:void 0)===false && msgMap.has(e.data!=null?e.data.i:void 0)) {
  let p=msgMap.get(e.data.i);
  msgMap.delete(e.data.i);
  p(e);
 }
};

self.onfetch=e=>{
 const req=e.request;
 const base0=registration.scope;
 if (new URL(req.url).origin!==location.origin || !req.url.startsWith(base0)) e.respondWith(emptyResponse(403));
 else {
  const url=req.url.slice(base0.length);
  if (url.indexOf("/")<0) {
   e.respondWith(getCache(req));
  } else {
   const [fn,,rurl]=stringPartition(url,"/");
   switch (fn) {
   case "a":
    e.respondWith(getResponseA(req,e.clientId,e.resultingClientId,rurl));
    break;
   case "s":
    e.respondWith(getResponseS(req,e.clientId,e.resultingClientId,rurl));
    break;
   default:
    e.respondWith(emptyResponse(404));
    break;
   }
  }
 }
};


