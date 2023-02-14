class NotZip {
 #f;
 #cd;
 #k;
 #k_x;
 async _readH() {
  const o=0;
  const h=new Uint8Array(await this.#f.slice(o+0,o+28+544).arrayBuffer());
  const size=(h[8]|h[9]<<8|h[10]<<16|h[11]<<24)>>>0;
  const compression=h[12];
  const salt_size=h[16];
  const iterations=1 << h[17]+16;
  const iv_size=h[18];
  const tag_size=h[19];
  const crc=h.slice(20,28);
  let p=28;
  const salt=h.slice(p,p+salt_size);
  p+=salt_size;
  const iv=h.slice(p,p+iv_size);
  p+=iv_size;
  if (salt_size<16||iv_size<12||tag_size<4||tag_size>16) throw 'format';
  let x=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:Uint8Array.of(0xaf,0xb4,0xfe,0xfd),tagLength:128},this.#k,h.slice(p,p+32)).catch(()=>Promise.reject('password')));
  p+=32;
  if (x[8]!=0xaf||x[9]!=0xb4||x[10]!=0x4e||x[11]!=0x4f||x[12]!=0x54||x[13]!=0x5a||x[14]!=0x49||x[15]!=0x50) throw 'format';
  x=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:Uint8Array.of(0xaf,0xb4,0xfe,0xfd),tagLength:tag_size*8},this.#k,await this.#f.slice(o+p,o+p+size+tag_size).arrayBuffer());
  p+=size+tag_size;
  if (compression) {
   const xx=x;
   const xx1=crc;
   x=await new Response(new ReadableStream({start(x){x.enqueue(Uint8Array.of(0x1f,0x8b,8,0,0,0,0,0,0,0));x.enqueue(xx);x.enqueue(xx1);x.close()}}).pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
  }
  return {x,s:p};
 }
 async _readCD(x,o0) {
  let o=0;
  let p=0;
  const xx=new Uint8Array(x);
  while (p<xx.length) {
   const size=(xx[p+0]|xx[p+1]<<8|xx[p+2]<<16|xx[p+3]<<24)>>>0;
   const compress=xx[p+4];
   const r0=xx[p+5];
   const r1=xx[p+6];
   const r2=xx[p+7];
   const iv_size=xx[p+8];
   const tag_size=xx[p+9];
   const name_size=xx[p+10]|xx[p+11]<<8;
   const file_crc=xx[p+12]|xx[p+13]<<8|xx[p+14]<<16|xx[p+15]<<24;
   const file_size=xx[p+16]|xx[p+17]<<8|xx[p+18]<<16|xx[p+19]<<24;
   p+=20;
   const name=new TextDecoder("utf-8").decode(xx.slice(p,p+name_size));
   p+=name_size;
   if (compress!==0&&compress!==1) throw 'format';
   if (r0|r1|r2) throw 'format';
   if (iv_size<12) throw 'format';
   if (tag_size<4 || tag_size>16) throw 'format';
   if (!name_size) throw 'format';
   if (p>xx.length) throw 'format';
   this.#cd.push({o:o0+o,s:size,name,size:file_size,crc32:file_crc,m:compress,e:1,e1:iv_size,e2:tag_size})
   o+=iv_size+size+tag_size;
  }
  return o
 }
 constructor(f) {
  this.#f=f;
  this.#cd=null;
  this.#k=null;
  this.#k_x=null;
 }
 async mayOpen() {
  if (!(this.#f instanceof Blob)) return false;
  if (this.#f.size<28) return false;
  const h=new Uint8Array(await this.#f.slice(0,28+544).arrayBuffer());
  if (String.fromCodePoint.apply(null,h.slice(0,8))!=="\xaf\xb4\xfe\xfd\x00\x00\x00\x01") return false;
  if (h.length<28) return false;
  if (h[12]!==0&&h[12]!==1||h[13]!==0||h[14]!==0||h[15]!==0||h[17]&0xf0) return false;
  const size=(h[8]|h[9]<<8|h[10]<<16|h[11]<<24)>>>0;
  const salt_size=h[16];
  const iterations=1 << h[17]+16;
  const iv_size=h[18];
  const tag_size=h[19];
  if (h.length<28+salt_size+32) return false;
  let p=28;
  const salt=h.slice(p,p+salt_size);
  p+=salt_size;
  if (salt_size<16||iv_size<12||tag_size<4||tag_size>16) throw 'format';
  this.#k_x={salt,iterations};
  return true;
 }
 async getKI() {
  return this.#k_x;
 }
 async setPW(password) {
  if (typeof password==="string") password=Uint8Array.from(unescape(encodeURIComponent(password)),x=>x.charCodeAt(0));
  else if (password===null) throw new Error('Password required');
  let pw=await crypto.subtle.importKey('raw',password,'PBKDF2',false,['deriveKey']);
  this.#k=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:this.#k_x.salt,iterations:this.#k_x.iterations},pw,{name:'AES-GCM',length:256},false,['decrypt']);
 }
 async getCD() {
  if (this.#cd!==null) return this.#cd;
  this.#cd=[];
  let {x,s:o}=await this._readH();
  await this._readCD(x,o);
  return this.#cd;
 }
}

window.AP=(window.AP||[]);AP.push(NotZip);

