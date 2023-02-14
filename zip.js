(function(){"use strict"
const SIZE_SIGNATURE=4;
const SIZE_ECD_MIN=18;
const SIG_ECD='PK\x05\x06';
const SIZE_CD_MIN=42;
const MAGIC_CD=0x02014b50;
const SIZE_LH_MIN=26;
const MAGIC_LH=0x04034b50;
const OFFSET_CD_X=6;
const LENGTH_CD_X=24;
const OFFSET_LH_X0=24;

function readAsBinaryString(file) { return new Promise((rs,rj)=>{
 const x=new FileReader();
 x.onload=e=>rs(e.target.result);
 x.onerror=x.onabort=e=>rj(e.target.error);
 x.readAsBinaryString(file);
}) }

function binaryString(x) {
 if (x.length<256) {
  return String.fromCodePoint.apply(null,x);
 } else {
  const r=[];
  for (let i=0;i<x.length;i+=256) {
   r.push(String.fromCodePoint.apply(null,x.slice(i,i+256)))
  }
  return r.join("")
 }
}

const ENCODING_LABELS=[
 "unicode-1-1-utf-8","unicode11utf8","unicode20utf8","utf-8","utf8","x-unicode20utf8",
 "866","cp866","csibm866","ibm866",
 "csisolatin2","iso-8859-2","iso-ir-101","iso8859-2","iso88592","iso_8859-2","iso_8859-2:1987","l2","latin2",
 "csisolatin3","iso-8859-3","iso-ir-109","iso8859-3","iso88593","iso_8859-3","iso_8859-3:1988","l3","latin3",
 "csisolatin4","iso-8859-4","iso-ir-110","iso8859-4","iso88594","iso_8859-4","iso_8859-4:1988","l4","latin4",
 "csisolatincyrillic","cyrillic","iso-8859-5","iso-ir-144","iso8859-5","iso88595","iso_8859-5","iso_8859-5:1988",
 "arabic","asmo-708","csiso88596e","csiso88596i","csisolatinarabic","ecma-114","iso-8859-6","iso-8859-6-e","iso-8859-6-i","iso-ir-127","iso8859-6","iso88596","iso_8859-6","iso_8859-6:1987",
 "csisolatingreek","ecma-118","elot_928","greek","greek8","iso-8859-7","iso-ir-126","iso8859-7","iso88597","iso_8859-7","iso_8859-7:1987","sun_eu_greek",
 "csiso88598e","csisolatinhebrew","hebrew","iso-8859-8","iso-8859-8-e","iso-ir-138","iso8859-8","iso88598","iso_8859-8","iso_8859-8:1988","visual",
 "csiso88598i","iso-8859-8-i","logical",
 "csisolatin6","iso-8859-10","iso-ir-157","iso8859-10","iso885910","l6","latin6",
 "iso-8859-13","iso8859-13","iso885913",
 "iso-8859-14","iso8859-14","iso885914",
 "csisolatin9","iso-8859-15","iso8859-15","iso885915","iso_8859-15","l9",
 "iso-8859-16",
 "cskoi8r","koi","koi8","koi8-r","koi8_r",
 "koi8-ru","koi8-u",
 "csmacintosh","mac","macintosh","x-mac-roman",
 "dos-874","iso-8859-11","iso8859-11","iso885911","tis-620","windows-874",
 "cp1250","windows-1250","x-cp1250",
 "cp1251","windows-1251","x-cp1251",
 "ansi_x3.4-1968","ascii","cp1252","cp819","csisolatin1","ibm819","iso-8859-1","iso-ir-100","iso8859-1","iso88591","iso_8859-1","iso_8859-1:1987","l1","latin1","us-ascii","windows-1252","x-cp1252",
 "cp1253","windows-1253","x-cp1253",
 "cp1254","csisolatin5","iso-8859-9","iso-ir-148","iso8859-9","iso88599","iso_8859-9","iso_8859-9:1989","l5","latin5","windows-1254","x-cp1254",
 "cp1255","windows-1255","x-cp1255",
 "cp1256","windows-1256","x-cp1256",
 "cp1257","windows-1257","x-cp1257",
 "cp1258","windows-1258","x-cp1258",
 "x-mac-cyrillic","x-mac-ukrainian",
 "chinese","csgb2312","csiso58gb231280","gb2312","gb_2312","gb_2312-80","gbk","iso-ir-58","x-gbk","gb18030",
 "big5","big5-hkscs","cn-big5","csbig5","x-x-big5",
 "cseucpkdfmtjapanese","euc-jp","x-euc-jp",
 "csiso2022jp","iso-2022-jp",
 "csshiftjis","ms932","ms_kanji","shift-jis","shift_jis","sjis","windows-31j","x-sjis",
 "cseuckr","csksc56011987","euc-kr","iso-ir-149","korean","ks_c_5601-1987","ks_c_5601-1989","ksc5601","ksc_5601","windows-949",
 //"csiso2022kr","hz-gb-2312","iso-2022-cn","iso-2022-cn-ext","iso-2022-kr","replacement",
 "unicodefffe","utf-16be",
 "csunicode","iso-10646-ucs-2","ucs-2","unicode","unicodefeff","utf-16","utf-16le",
 //"x-user-defined"
];
function decode(x,c) {
 if (c==="ibm437") {
  return new TextDecoder("ibm866").decode(x).replace(
    /[\u0410\u043f\u0440-\u044f\u0401\u0451\u0404\u0454\u0407\u0457\u040e\u045e\u2116\xa4]/g,
    x=>({
      "\u0410":"\u00c7","\u0411":"\u00fc","\u0412":"\u00e9","\u0413":"\u00e2",
      "\u0414":"\u00e4","\u0415":"\u00e0","\u0416":"\u00e5","\u0417":"\u00e7",
      "\u0418":"\u00ea","\u0419":"\u00eb","\u041a":"\u00e8","\u041b":"\u00ef",
      "\u041c":"\u00ee","\u041d":"\u00ec","\u041e":"\u00c4","\u041f":"\u00c5",
      "\u0420":"\u00c9","\u0421":"\u00e6","\u0422":"\u00c6","\u0423":"\u00f4",
      "\u0424":"\u00f6","\u0425":"\u00f2","\u0426":"\u00fb","\u0427":"\u00f9",
      "\u0428":"\u00ff","\u0429":"\u00d6","\u042a":"\u00dc","\u042b":"\u00a2",
      "\u042c":"\u00a3","\u042d":"\u00a5","\u042e":"\u20a7","\u042f":"\u0192",
      "\u0430":"\u00e1","\u0431":"\u00ed","\u0432":"\u00f3","\u0433":"\u00fa",
      "\u0434":"\u00f1","\u0435":"\u00d1","\u0436":"\u00aa","\u0437":"\u00ba",
      "\u0438":"\u00bf","\u0439":"\u2310","\u043a":"\u00ac","\u043b":"\u00bd",
      "\u043c":"\u00bc","\u043d":"\u00a1","\u043e":"\u00ab","\u043f":"\u00bb",
      "\u0440":"\u03b1","\u0441":"\u00df","\u0442":"\u0393","\u0443":"\u03c0",
      "\u0444":"\u03a3","\u0445":"\u03c3","\u0446":"\u00b5","\u0447":"\u03c4",
      "\u0448":"\u03a6","\u0449":"\u0398","\u044a":"\u03a9","\u044b":"\u03b4",
      "\u044c":"\u221e","\u044d":"\u03c6","\u044e":"\u03b5","\u044f":"\u2229",
      "\u0401":"\u2261","\u0451":"\u00b1","\u0404":"\u2265","\u0454":"\u2264",
      "\u0407":"\u2320","\u0457":"\u2321","\u040e":"\u00f7","\u045e":"\u2248",
      "\u2116":"\u207f","\u00a4":"\u00b2"
    })[x])
 } else {
  return new TextDecoder(c).decode(x)
 }
}


async function findECD(file) {
 const o=Math.max(0,file.size-(65536+4096)); // 65536+(SIZE_SIGNATURE+SIZE_ECD_MIN) +16
 const x=await readAsBinaryString(file.slice(o));
 const n=x.lastIndexOf(SIG_ECD);
 if (n<0) return n;
 else if (o+n+(SIZE_SIGNATURE+SIZE_ECD_MIN)>file.size) return -1;
 else return o+n;
}

async function readECD(file,offset) {
 const b=new Uint8Array(await file.slice(offset+4).arrayBuffer());
 const index_self=b[0]|b[1]<<8;
 const index_cdir=b[2]|b[3]<<8;
 const count_self=b[4]|b[5]<<8;
 const count_total=b[6]|b[7]<<8;
 const size_cdir=b[8]|b[9]<<8|b[10]<<16|b[11]<<24;
 const offset_cdir=b[12]|b[13]<<8|b[14]<<16|b[15]<<24;
 const size_comment=b[16]|b[17]<<8;
 if (index_self==0xffff||index_cdir==0xffff||count_self==0xffff||count_total==0xffff||size_cdir==0xffffffff||offset_cdir==0xffffffff) {
  if (index_self!=0xffff||index_cdir!=0xffff||count_self!=0xffff||count_total!=0xffff||size_cdir!=0xffffffff||offset_cdir!=0xffffffff) {
   throw 'format';
  }
  throw 'noimpl';
 }
 if (index_self!=0||index_cdir!=0) throw 'noimpl';
 if (count_self!=count_total) throw 'format';
 return {s:size_cdir,o:offset_cdir,c:count_total}
}

async function readCD(file,ecd) {
 const b=new Uint8Array(await file.slice(ecd.o,ecd.o+ecd.s).arrayBuffer());
 const l=b.length;
 let o=0;
 const r=Array(ecd.c);
 for (let i=0;i<ecd.c;i++) {
  if (o+(SIZE_SIGNATURE+SIZE_CD_MIN)>l) throw 'format';
  if (((b[o+0]|b[o+1]<<8|b[o+2]<<16|b[o+3]<<24)>>>0)!=MAGIC_CD) throw 'format';
  const x0=b.slice(o+OFFSET_CD_X,o+(OFFSET_CD_X+LENGTH_CD_X));
  const version_needed=b[o+6]|b[o+7]<<8;
  const flags=b[o+8]|b[o+9]<<8;
  const compress_method=b[o+10]|b[o+11]<<8;
  const file_name_length=b[o+28]|b[o+29]<<8;
  const extra_field_length=b[o+30]|b[o+31]<<8;
  const file_comment_length=b[o+32]|b[o+33]<<8;
  const index_disk=b[o+34]|b[o+35]<<8;
  const offset=(b[o+42]|b[o+43]<<8|b[o+44]<<16|b[o+45]<<24)>>>0;
  o+=(SIZE_SIGNATURE+SIZE_CD_MIN);
  if (file_name_length+extra_field_length+file_comment_length>65535) throw 'format';
  if (o+file_name_length+extra_field_length+file_comment_length>l) throw 'format';
  if (compress_method!=0 && compress_method!=8) console.warn("compress_method!=0 && compress_method!=8");
  if ((version_needed &255) > 20) console.warn("version_needed > 20");
  if (flags&0x2061) console.warn("flags&0x2061");
  if (compress_method==0 && (flags & 0x0006)) console.warn("compress_method==0 && (flags & 0x0006)");
  if (flags&0xd790) throw 'format';
  if (index_disk > 0) throw 'format';
  const x1=b.slice(o,o+file_name_length);
  o+=file_name_length;
  const x2=b.slice(o,o+extra_field_length);
  o+=extra_field_length;
  o+=file_comment_length;
  r[i]={o:offset,x0,x1,x2};
 }
 if (o!=b.length) throw 'format';
 return r;
}

async function readLH(file,ze,ne='ibm437') {
 const s=SIZE_SIGNATURE+SIZE_LH_MIN+65536*2;
 const b=new Uint8Array(await file.slice(ze.o,ze.o+s).arrayBuffer());
 if (((b[0]|b[1]<<8|b[2]<<16|b[3]<<24)>>>0)!=MAGIC_LH) throw 'format';
 for (let i=0;i<LENGTH_CD_X-2;i++) {
  if (b[SIZE_SIGNATURE+i]!=ze.x0[i]) throw 'format';
 }
 const version_needed=b[4]|b[5]<<8;
 const flags=b[6]|b[7]<<8;
 const compress_method=b[8]|b[9]<<8;
 const file_modify_time=b[10]|b[11]<<8;
 const file_modify_data=b[12]|b[13]<<8;
 const file_crc32=(b[14]|b[15]<<8|b[16]<<16|b[17]<<24)>>>0;
 const compressed_size=(b[18]|b[19]<<8|b[20]<<16|b[21]<<24)>>>0;
 const file_size=(b[22]|b[23]<<8|b[24]<<16|b[25]<<24)>>>0;
 const file_name_length=b[26]|b[27]<<8;
 const extra_field_length=b[28]|b[29]<<8;
 let o=30;
 if (file_name_length!=ze.x1.length) throw 'format';
 for (let i=0,i1=o;i<file_name_length;i++,i1++) {
  if (b[i1]!=ze.x1[i]) throw 'format';
 }
 const file_name_=b.slice(o,o+file_name_length)
 const file_name=flags&0x0800?decode(file_name_,'utf-8'):decode(file_name_,ne);
 o+=file_name_length;
 if (b[SIZE_SIGNATURE+OFFSET_LH_X0]!=0 && b[SIZE_SIGNATURE+OFFSET_LH_X0+1]!=0 && ze.extra.length) {
  if (b[SIZE_SIGNATURE+OFFSET_LH_X0]!=ze.x[OFFSET_LH_X0] || b[SIZE_SIGNATURE+OFFSET_LH_X0+1]!=ze.x[OFFSET_LH_X0+1]) throw 'format';
  for (let i=0,i1=o;i<extra_field_length;i++,i1++) {
   if (b[i1]!=ze.x2[i]) throw 'format';
  }
 }
 o+=extra_field_length;
 if (compress_method!=0 && compress_method!=8) throw 'noimpl';
 if ((version_needed &255) > 20) throw 'noimpl';
 if (flags&0x2061) throw 'noimpl';
 if (compress_method==0 && flags & 0x0006) throw 'format';
 if (flags&0xd790) throw 'format';
 return {o:ze.o+o,s:compressed_size,name:file_name,size:file_size,crc32:file_crc32,m:(compress_method===8)|0,e:0,e1:null,e2:null}
}

class Zip {
 #f;
 #v;
 #ecd;
 #cd;
 constructor(f) {
  this.#f=f;
  this.#v=null;
  this.#ecd=null;
  this.#cd=null;
 }
 async #tryOpen() {
  this.#v=false;
  const n=await findECD(this.#f);
  if (n<0) return;
  try {
   this.#ecd=await readECD(this.#f,n);
   this.#v=true;
  } catch {}
 }
 async mayOpen() {
  if (!(this.#f instanceof Blob)) return false;
  if (this.#v===null) await this.#tryOpen();
  return this.#v
 }
 async getKI() {
  return null;
 }
 async setPW(password) {
  return;
 }
 async getCD() {
  if (this.#cd) return this.#cd
  const x=await readCD(this.#f,this.#ecd);
  //this.#cd=await Promise.all(x.map(x=>readLH(this.#f,x)));
  this.#cd=[];
  for (const xx of x) {
   this.#cd.push(await readLH(this.#f,xx))
  }
  return this.#cd;
 }
}

window.AP=(window.AP||[]);AP.push(Zip);
})()
