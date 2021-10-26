(()=>{var $=Object.defineProperty;var z=Object.getOwnPropertySymbols;var se=Object.prototype.hasOwnProperty,ae=Object.prototype.propertyIsEnumerable;var ce=(n,e,t)=>e in n?$(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,j=(n,e)=>{for(var t in e||(e={}))se.call(e,t)&&ce(n,t,e[t]);if(z)for(var t of z(e))ae.call(e,t)&&ce(n,t,e[t]);return n};var De=n=>$(n,"__esModule",{value:!0});var ue=(n,e)=>{var t={};for(var r in n)se.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&z)for(var r of z(n))e.indexOf(r)<0&&ae.call(n,r)&&(t[r]=n[r]);return t};var Re=(n,e)=>{De(n);for(var t in e)$(n,t,{get:e[t],enumerable:!0})};var oe={};Re(oe,{default:()=>je});var{subtle:M}=crypto,q={name:"RSA-OAEP",hash:{name:"SHA-256"}},he={alg:"RSA-OAEP-256",e:"AQAB",ext:!1,kty:"RSA"},ze=["d","dp","dq","n","p","q","qi"];async function le(){let n=await Ke();return Me(n.privateKey)}async function Me(n){let e=await M.exportKey("jwk",n);console.log(e.k,e.kty);let t=new URLSearchParams;return Object.entries(e).filter(([r])=>ze.includes(r)).forEach(([r,i])=>t.append(r,i)),t.toString()}async function fe(n){let e=j(j({key_ops:["unwrapKey"]},he),n);return M.importKey("jwk",e,q,!1,["unwrapKey"])}async function pe(n){let e=j({key_ops:["wrapKey"],n},he);return M.importKey("jwk",e,q,!1,["wrapKey"])}async function Ke(){return M.generateKey(j({modulusLength:4096,publicExponent:new Uint8Array([1,0,1])},q),!0,["wrapKey","unwrapKey"])}var{default:Oe}=__ALEPH__.pack["https://deno.land/x/aleph@v0.3.0-beta.19/framework/react/components/Head.ts"],{default:w,useRef:He}=__ALEPH__.pack["https://esm.sh/react@17.0.2"];function G(){let n=He(null),e=()=>{let t=n.current.value;t.length!=0&&le().then(r=>{location.hash=`receive_by=${t}&${r}`})};return w.createElement("main",{id:"instruction"},w.createElement(Oe,null,w.createElement("title",null,"NPAP \u9375\u751F\u6210\u30DA\u30FC\u30B8")),w.createElement("h1",null,"\u9375\u751F\u6210\u30DA\u30FC\u30B8"),w.createElement("p",null,"\u53D7\u4FE1\u8005\u306E\u304A\u540D\u524D",w.createElement("br",null),w.createElement("input",{type:"text",ref:n,required:!0}),w.createElement("br",null),w.createElement("button",{onClick:e},"\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u3092\u4F5C\u6210")),w.createElement("h2",null,"\u4F7F\u3044\u65B9"),w.createElement("p",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u53D7\u4FE1\u8005\u306F\u3001\u3042\u3089\u304B\u3058\u3081\u81EA\u5206\u5C02\u7528\u306E\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u3092\u4F5C\u6210\u3057\u3001\u304A\u624B\u5143\u306B\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u3092\u4FDD\u5B58\u3057\u3066\u3044\u3064\u3067\u3082\u958B\u3051\u308B\u3088\u3046\u306B\u3057\u3066\u304A\u304D\u307E\u3059\u3002"),w.createElement("p",null,"\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u304B\u3089\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u306EURL\u304C\u53D6\u5F97\u3067\u304D\u308B\u306E\u3067\u3001\u305D\u308C\u3092\u30E1\u30FC\u30EB\u3067\u76F8\u624B\u306B\u9001\u308A\u307E\u3059\u3002"),w.createElement("p",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u9001\u4FE1\u8005\u306F\u3001\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u3092\u958B\u304D\u3001\u9001\u308A\u305F\u3044\u30D5\u30A1\u30A4\u30EB\u3092\u6307\u5B9A\u3057\u307E\u3059\u3002\u30D5\u30A1\u30A4\u30EB\u306F\u3069\u3053\u3078\u3082\u9001\u4FE1\u3055\u308C\u308B\u3053\u3068\u306A\u304F\u3001\u30D6\u30E9\u30A6\u30B6\u5185\u3067\u6697\u53F7\u5316\u3055\u308C\u3001\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3067\u304D\u307E\u3059\u3002"),w.createElement("p",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u9001\u4FE1\u8005\u306F\u3001\u6697\u53F7\u5316\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u3092\u30E1\u30FC\u30EB\u306B\u6DFB\u4ED8\u3057\u3066\u9001\u308A\u307E\u3059\u3002"),w.createElement("p",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u53D7\u4FE1\u8005\u306F\u3001\u6697\u53F7\u5316\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u3092\u53D7\u3051\u53D6\u3063\u305F\u3089\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u304B\u3089\u5143\u306E\u30D5\u30A1\u30A4\u30EB\u3078\u5FA9\u53F7\u3067\u304D\u307E\u3059\u3002"),w.createElement("h2",null,"\u306A\u305C\u5B89\u5168\u306A\u306E\uFF1F"),w.createElement("p",null,"\u516C\u958B\u9375\u65B9\u5F0F\u3068\u3044\u3046\u6697\u53F7\u3092\u4F7F\u3063\u3066\u3044\u307E\u3059\u3002\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u3067\u6697\u53F7\u5316\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u306F\u3001\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u306E\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u3092\u77E5\u3063\u3066\u3044\u308B\u4EBA\u306E\u307F\u304C\u5FA9\u53F7\u3067\u304D\u307E\u3059\u3002"),w.createElement("p",null,"\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u306F\u53D7\u4FE1\u8005\u306E\u624B\u5143\u306B\u3042\u308C\u3070\u3088\u304F\u3001\u9001\u4FE1\u8005\u306B\u306F\u5FC5\u8981\u3042\u308A\u307E\u305B\u3093\u3002\u3064\u307E\u308A\u3001\u5FA9\u53F7\u306B\u5FC5\u8981\u306A\u60C5\u5831\u306F\u4E00\u5207\u30CD\u30C3\u30C8\u306B\u6D41\u51FA\u3057\u307E\u305B\u3093\u3002"),w.createElement("p",null,"NPAP \u306E\u79D8\u5BC6\u9375\u306FURL\u306E\u300C#\u300D\u4EE5\u964D\u306E\u30CF\u30C3\u30B7\u30E5\u6587\u5B57\u5217\u3068\u547C\u3070\u308C\u308B\u90E8\u5206\u306B\u683C\u7D0D\u3057\u3066\u3042\u308A\u307E\u3059\u3002\u30D6\u30E9\u30A6\u30B6\u306F\u3053\u306E\u60C5\u5831\u3092\u3069\u3053\u306B\u3082\u9001\u308A\u307E\u305B\u3093\u306E\u3067\u3001NPAP \u306E\u30B5\u30FC\u30D0\u30FC\u306B\u3055\u3048\u79D8\u5BC6\u9375\u306F\u9001\u4FE1\u3055\u308C\u307E\u305B\u3093\u3002"))}var{subtle:B}=crypto;async function Fe(n,e,t){return await B.encrypt({name:"AES-CBC",iv:e},n,t)}async function Ne(n,e,t){return B.decrypt({name:"AES-CBC",iv:e},n,t)}async function de(n,e){let t=await B.generateKey({name:"AES-CBC",length:256},!0,["encrypt","decrypt"]),r=crypto.getRandomValues(new Uint8Array(16)),i=await Fe(t,r,e);return{key:await B.wrapKey("raw",t,n,"RSA-OAEP"),iv:r,ciphered:i}}var K=class extends Error{};async function ye(n,e){let{key:t,iv:r,ciphered:i}=e,o=await B.unwrapKey("raw",t,n,"RSA-OAEP","AES-CBC",!1,["decrypt"]).catch(s=>{throw new K});return Ne(o,r,i)}async function O(n){let e=JSON.stringify({e:"AQAB",kty:"RSA",n}),t=new TextEncoder().encode(e).buffer,r=await B.digest("SHA-256",t);return[...new Uint8Array(r)].map(o=>("0"+o.toString(16)).slice(-2)).join(":")}var d=window.process={},b,E;function X(){throw new Error("setTimeout has not been defined")}function Q(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?b=setTimeout:b=X}catch(n){b=X}try{typeof clearTimeout=="function"?E=clearTimeout:E=Q}catch(n){E=Q}})();function we(n){if(b===setTimeout)return setTimeout(n,0);if((b===X||!b)&&setTimeout)return b=setTimeout,setTimeout(n,0);try{return b(n,0)}catch(e){try{return b.call(null,n,0)}catch(t){return b.call(this,n,0)}}}function We(n){if(E===clearTimeout)return clearTimeout(n);if((E===Q||!E)&&clearTimeout)return E=clearTimeout,clearTimeout(n);try{return E(n)}catch(e){try{return E.call(null,n)}catch(t){return E.call(this,n)}}}var S=[],P=!1,k,H=-1;function Ve(){!P||!k||(P=!1,k.length?S=k.concat(S):H=-1,S.length&&me())}function me(){if(!P){var n=we(Ve);P=!0;for(var e=S.length;e;){for(k=S,S=[];++H<e;)k&&k[H].run();H=-1,e=S.length}k=null,P=!1,We(n)}}d.nextTick=function(n){var e=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)e[t-1]=arguments[t];S.push(new ve(n,e)),S.length===1&&!P&&we(me)};function ve(n,e){this.fun=n,this.array=e}ve.prototype.run=function(){this.fun.apply(null,this.array)};d.title="browser";d.browser=!0;d.env={};d.argv=[];d.version="";d.versions={};function A(){}d.on=A;d.addListener=A;d.once=A;d.off=A;d.removeListener=A;d.removeAllListeners=A;d.emit=A;d.prependListener=A;d.prependOnceListener=A;d.listeners=function(n){return[]};d.binding=function(n){throw new Error("process.binding is not supported")};d.cwd=function(){return"/"};d.chdir=function(n){throw new Error("process.chdir is not supported")};d.umask=function(){return 0};var T=d;T.env.NODE_ENV="production";var L=4294967295;function $e(n,e,t){var r=t/4294967296,i=t;n.setUint32(e,r),n.setUint32(e+4,i)}function ge(n,e,t){var r=Math.floor(t/4294967296),i=t;n.setUint32(e,r),n.setUint32(e+4,i)}function be(n,e){var t=n.getInt32(e),r=n.getUint32(e+4);return t*4294967296+r}function qe(n,e){var t=n.getUint32(e),r=n.getUint32(e+4);return t*4294967296+r}var F=(typeof T=="undefined"||T.env.TEXT_ENCODING!=="never")&&typeof TextEncoder!="undefined"&&typeof TextDecoder!="undefined";function Ee(n){for(var e=n.length,t=0,r=0;r<e;){var i=n.charCodeAt(r++);if((i&4294967168)==0){t++;continue}else if((i&4294965248)==0)t+=2;else{if(i>=55296&&i<=56319&&r<e){var o=n.charCodeAt(r);(o&64512)==56320&&(++r,i=((i&1023)<<10)+(o&1023)+65536)}(i&4294901760)==0?t+=3:t+=4}}return t}function Ge(n,e,t){for(var r=n.length,i=t,o=0;o<r;){var s=n.charCodeAt(o++);if((s&4294967168)==0){e[i++]=s;continue}else if((s&4294965248)==0)e[i++]=s>>6&31|192;else{if(s>=55296&&s<=56319&&o<r){var c=n.charCodeAt(o);(c&64512)==56320&&(++o,s=((s&1023)<<10)+(c&1023)+65536)}(s&4294901760)==0?(e[i++]=s>>12&15|224,e[i++]=s>>6&63|128):(e[i++]=s>>18&7|240,e[i++]=s>>12&63|128,e[i++]=s>>6&63|128)}e[i++]=s&63|128}}var N=F?new TextEncoder:void 0,Xe=F?typeof T!="undefined"&&T.env.TEXT_ENCODING!=="force"?200:0:L;function Qe(n,e,t){e.set(N.encode(n),t)}function Je(n,e,t){N.encodeInto(n,e.subarray(t))}var Ye=(N==null?void 0:N.encodeInto)?Je:Qe,Ze=4096;function xe(n,e,t){for(var r=e,i=r+t,o=[],s="";r<i;){var c=n[r++];if((c&128)==0)o.push(c);else if((c&224)==192){var h=n[r++]&63;o.push((c&31)<<6|h)}else if((c&240)==224){var h=n[r++]&63,a=n[r++]&63;o.push((c&31)<<12|h<<6|a)}else if((c&248)==240){var h=n[r++]&63,a=n[r++]&63,l=n[r++]&63,f=(c&7)<<18|h<<12|a<<6|l;f>65535&&(f-=65536,o.push(f>>>10&1023|55296),f=56320|f&1023),o.push(f)}else o.push(c);o.length>=Ze&&(s+=String.fromCharCode.apply(String,o),o.length=0)}return o.length>0&&(s+=String.fromCharCode.apply(String,o)),s}var et=F?new TextDecoder:null,tt=F?typeof T!="undefined"&&T.env.TEXT_DECODER!=="force"?200:0:L;function nt(n,e,t){var r=n.subarray(e,e+t);return et.decode(r)}var D=function(){function n(e,t){this.type=e,this.data=t}return n}(),rt=function(){var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(r[o]=i[o])},n(e,t)};return function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");n(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}}(),v=function(n){rt(e,n);function e(t){var r=n.call(this,t)||this,i=Object.create(e.prototype);return Object.setPrototypeOf(r,i),Object.defineProperty(r,"name",{configurable:!0,enumerable:!1,value:e.name}),r}return e}(Error),Ue=-1,it=4294967296-1,ot=17179869184-1;function Se(n){var e=n.sec,t=n.nsec;if(e>=0&&t>=0&&e<=ot)if(t===0&&e<=it){var r=new Uint8Array(4),i=new DataView(r.buffer);return i.setUint32(0,e),r}else{var o=e/4294967296,s=e&4294967295,r=new Uint8Array(8),i=new DataView(r.buffer);return i.setUint32(0,t<<2|o&3),i.setUint32(4,s),r}else{var r=new Uint8Array(12),i=new DataView(r.buffer);return i.setUint32(0,t),ge(i,4,e),r}}function Ae(n){var e=n.getTime(),t=Math.floor(e/1e3),r=(e-t*1e3)*1e6,i=Math.floor(r/1e9);return{sec:t+i,nsec:r-i*1e9}}function Te(n){if(n instanceof Date){var e=Ae(n);return Se(e)}else return null}function ke(n){var e=new DataView(n.buffer,n.byteOffset,n.byteLength);switch(n.byteLength){case 4:{var t=e.getUint32(0),r=0;return{sec:t,nsec:r}}case 8:{var i=e.getUint32(0),o=e.getUint32(4),t=(i&3)*4294967296+o,r=i>>>2;return{sec:t,nsec:r}}case 12:{var t=be(e,4),r=e.getUint32(0);return{sec:t,nsec:r}}default:throw new v("Unrecognized data size for timestamp (expected 4, 8, or 12): "+n.length)}}function Le(n){var e=ke(n);return new Date(e.sec*1e3+e.nsec/1e6)}var st={type:Ue,encode:Te,decode:Le},J=function(){function n(){this.builtInEncoders=[],this.builtInDecoders=[],this.encoders=[],this.decoders=[],this.register(st)}return n.prototype.register=function(e){var t=e.type,r=e.encode,i=e.decode;if(t>=0)this.encoders[t]=r,this.decoders[t]=i;else{var o=1+t;this.builtInEncoders[o]=r,this.builtInDecoders[o]=i}},n.prototype.tryToEncode=function(e,t){for(var r=0;r<this.builtInEncoders.length;r++){var i=this.builtInEncoders[r];if(i!=null){var o=i(e,t);if(o!=null){var s=-1-r;return new D(s,o)}}}for(var r=0;r<this.encoders.length;r++){var i=this.encoders[r];if(i!=null){var o=i(e,t);if(o!=null){var s=r;return new D(s,o)}}}return e instanceof D?e:null},n.prototype.decode=function(e,t,r){var i=t<0?this.builtInDecoders[-1-t]:this.decoders[t];return i?i(e,t,r):new D(t,e)},n.defaultCodec=new n,n}();function W(n){return n instanceof Uint8Array?n:ArrayBuffer.isView(n)?new Uint8Array(n.buffer,n.byteOffset,n.byteLength):n instanceof ArrayBuffer?new Uint8Array(n):Uint8Array.from(n)}function at(n){if(n instanceof ArrayBuffer)return new DataView(n);var e=W(n);return new DataView(e.buffer,e.byteOffset,e.byteLength)}var ct=100,ut=2048,_e=function(){function n(e,t,r,i,o,s,c,h){e===void 0&&(e=J.defaultCodec),t===void 0&&(t=void 0),r===void 0&&(r=ct),i===void 0&&(i=ut),o===void 0&&(o=!1),s===void 0&&(s=!1),c===void 0&&(c=!1),h===void 0&&(h=!1),this.extensionCodec=e,this.context=t,this.maxDepth=r,this.initialBufferSize=i,this.sortKeys=o,this.forceFloat32=s,this.ignoreUndefined=c,this.forceIntegerToFloat=h,this.pos=0,this.view=new DataView(new ArrayBuffer(this.initialBufferSize)),this.bytes=new Uint8Array(this.view.buffer)}return n.prototype.getUint8Array=function(){return this.bytes.subarray(0,this.pos)},n.prototype.reinitializeState=function(){this.pos=0},n.prototype.encode=function(e){return this.reinitializeState(),this.doEncode(e,1),this.getUint8Array()},n.prototype.doEncode=function(e,t){if(t>this.maxDepth)throw new Error("Too deep objects in depth "+t);e==null?this.encodeNil():typeof e=="boolean"?this.encodeBoolean(e):typeof e=="number"?this.encodeNumber(e):typeof e=="string"?this.encodeString(e):this.encodeObject(e,t)},n.prototype.ensureBufferSizeToWrite=function(e){var t=this.pos+e;this.view.byteLength<t&&this.resizeBuffer(t*2)},n.prototype.resizeBuffer=function(e){var t=new ArrayBuffer(e),r=new Uint8Array(t),i=new DataView(t);r.set(this.bytes),this.view=i,this.bytes=r},n.prototype.encodeNil=function(){this.writeU8(192)},n.prototype.encodeBoolean=function(e){e===!1?this.writeU8(194):this.writeU8(195)},n.prototype.encodeNumber=function(e){Number.isSafeInteger(e)&&!this.forceIntegerToFloat?e>=0?e<128?this.writeU8(e):e<256?(this.writeU8(204),this.writeU8(e)):e<65536?(this.writeU8(205),this.writeU16(e)):e<4294967296?(this.writeU8(206),this.writeU32(e)):(this.writeU8(207),this.writeU64(e)):e>=-32?this.writeU8(224|e+32):e>=-128?(this.writeU8(208),this.writeI8(e)):e>=-32768?(this.writeU8(209),this.writeI16(e)):e>=-2147483648?(this.writeU8(210),this.writeI32(e)):(this.writeU8(211),this.writeI64(e)):this.forceFloat32?(this.writeU8(202),this.writeF32(e)):(this.writeU8(203),this.writeF64(e))},n.prototype.writeStringHeader=function(e){if(e<32)this.writeU8(160+e);else if(e<256)this.writeU8(217),this.writeU8(e);else if(e<65536)this.writeU8(218),this.writeU16(e);else if(e<4294967296)this.writeU8(219),this.writeU32(e);else throw new Error("Too long string: "+e+" bytes in UTF-8")},n.prototype.encodeString=function(e){var t=1+4,r=e.length;if(r>Xe){var i=Ee(e);this.ensureBufferSizeToWrite(t+i),this.writeStringHeader(i),Ye(e,this.bytes,this.pos),this.pos+=i}else{var i=Ee(e);this.ensureBufferSizeToWrite(t+i),this.writeStringHeader(i),Ge(e,this.bytes,this.pos),this.pos+=i}},n.prototype.encodeObject=function(e,t){var r=this.extensionCodec.tryToEncode(e,this.context);if(r!=null)this.encodeExtension(r);else if(Array.isArray(e))this.encodeArray(e,t);else if(ArrayBuffer.isView(e))this.encodeBinary(e);else if(typeof e=="object")this.encodeMap(e,t);else throw new Error("Unrecognized object: "+Object.prototype.toString.apply(e))},n.prototype.encodeBinary=function(e){var t=e.byteLength;if(t<256)this.writeU8(196),this.writeU8(t);else if(t<65536)this.writeU8(197),this.writeU16(t);else if(t<4294967296)this.writeU8(198),this.writeU32(t);else throw new Error("Too large binary: "+t);var r=W(e);this.writeU8a(r)},n.prototype.encodeArray=function(e,t){var r=e.length;if(r<16)this.writeU8(144+r);else if(r<65536)this.writeU8(220),this.writeU16(r);else if(r<4294967296)this.writeU8(221),this.writeU32(r);else throw new Error("Too large array: "+r);for(var i=0,o=e;i<o.length;i++){var s=o[i];this.doEncode(s,t+1)}},n.prototype.countWithoutUndefined=function(e,t){for(var r=0,i=0,o=t;i<o.length;i++){var s=o[i];e[s]!==void 0&&r++}return r},n.prototype.encodeMap=function(e,t){var r=Object.keys(e);this.sortKeys&&r.sort();var i=this.ignoreUndefined?this.countWithoutUndefined(e,r):r.length;if(i<16)this.writeU8(128+i);else if(i<65536)this.writeU8(222),this.writeU16(i);else if(i<4294967296)this.writeU8(223),this.writeU32(i);else throw new Error("Too large map object: "+i);for(var o=0,s=r;o<s.length;o++){var c=s[o],h=e[c];this.ignoreUndefined&&h===void 0||(this.encodeString(c),this.doEncode(h,t+1))}},n.prototype.encodeExtension=function(e){var t=e.data.length;if(t===1)this.writeU8(212);else if(t===2)this.writeU8(213);else if(t===4)this.writeU8(214);else if(t===8)this.writeU8(215);else if(t===16)this.writeU8(216);else if(t<256)this.writeU8(199),this.writeU8(t);else if(t<65536)this.writeU8(200),this.writeU16(t);else if(t<4294967296)this.writeU8(201),this.writeU32(t);else throw new Error("Too large extension object: "+t);this.writeI8(e.type),this.writeU8a(e.data)},n.prototype.writeU8=function(e){this.ensureBufferSizeToWrite(1),this.view.setUint8(this.pos,e),this.pos++},n.prototype.writeU8a=function(e){var t=e.length;this.ensureBufferSizeToWrite(t),this.bytes.set(e,this.pos),this.pos+=t},n.prototype.writeI8=function(e){this.ensureBufferSizeToWrite(1),this.view.setInt8(this.pos,e),this.pos++},n.prototype.writeU16=function(e){this.ensureBufferSizeToWrite(2),this.view.setUint16(this.pos,e),this.pos+=2},n.prototype.writeI16=function(e){this.ensureBufferSizeToWrite(2),this.view.setInt16(this.pos,e),this.pos+=2},n.prototype.writeU32=function(e){this.ensureBufferSizeToWrite(4),this.view.setUint32(this.pos,e),this.pos+=4},n.prototype.writeI32=function(e){this.ensureBufferSizeToWrite(4),this.view.setInt32(this.pos,e),this.pos+=4},n.prototype.writeF32=function(e){this.ensureBufferSizeToWrite(4),this.view.setFloat32(this.pos,e),this.pos+=4},n.prototype.writeF64=function(e){this.ensureBufferSizeToWrite(8),this.view.setFloat64(this.pos,e),this.pos+=8},n.prototype.writeU64=function(e){this.ensureBufferSizeToWrite(8),$e(this.view,this.pos,e),this.pos+=8},n.prototype.writeI64=function(e){this.ensureBufferSizeToWrite(8),ge(this.view,this.pos,e),this.pos+=8},n}(),ht={};function Y(n,e){e===void 0&&(e=ht);var t=new _e(e.extensionCodec,e.context,e.maxDepth,e.initialBufferSize,e.sortKeys,e.forceFloat32,e.ignoreUndefined,e.forceIntegerToFloat);return t.encode(n)}function Z(n){return(n<0?"-":"")+"0x"+Math.abs(n).toString(16).padStart(2,"0")}var lt=16,ft=16,pt=function(){function n(e,t){e===void 0&&(e=lt),t===void 0&&(t=ft),this.maxKeyLength=e,this.maxLengthPerKey=t,this.hit=0,this.miss=0,this.caches=[];for(var r=0;r<this.maxKeyLength;r++)this.caches.push([])}return n.prototype.canBeCached=function(e){return e>0&&e<=this.maxKeyLength},n.prototype.find=function(e,t,r){var i=this.caches[r-1];e:for(var o=0,s=i;o<s.length;o++){for(var c=s[o],h=c.bytes,a=0;a<r;a++)if(h[a]!==e[t+a])continue e;return c.str}return null},n.prototype.store=function(e,t){var r=this.caches[e.length-1],i={bytes:e,str:t};r.length>=this.maxLengthPerKey?r[Math.random()*r.length|0]=i:r.push(i)},n.prototype.decode=function(e,t,r){var i=this.find(e,t,r);if(i!=null)return this.hit++,i;this.miss++;var o=xe(e,t,r),s=Uint8Array.prototype.slice.call(e,t,t+r);return this.store(s,o),o},n}(),dt=function(n,e,t,r){function i(o){return o instanceof t?o:new t(function(s){s(o)})}return new(t||(t=Promise))(function(o,s){function c(l){try{a(r.next(l))}catch(f){s(f)}}function h(l){try{a(r.throw(l))}catch(f){s(f)}}function a(l){l.done?o(l.value):i(l.value).then(c,h)}a((r=r.apply(n,e||[])).next())})},ee=function(n,e){var t={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},r,i,o,s;return s={next:c(0),throw:c(1),return:c(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function c(a){return function(l){return h([a,l])}}function h(a){if(r)throw new TypeError("Generator is already executing.");for(;t;)try{if(r=1,i&&(o=a[0]&2?i.return:a[0]?i.throw||((o=i.return)&&o.call(i),0):i.next)&&!(o=o.call(i,a[1])).done)return o;switch(i=0,o&&(a=[a[0]&2,o.value]),a[0]){case 0:case 1:o=a;break;case 4:return t.label++,{value:a[1],done:!1};case 5:t.label++,i=a[1],a=[0];continue;case 7:a=t.ops.pop(),t.trys.pop();continue;default:if(o=t.trys,!(o=o.length>0&&o[o.length-1])&&(a[0]===6||a[0]===2)){t=0;continue}if(a[0]===3&&(!o||a[1]>o[0]&&a[1]<o[3])){t.label=a[1];break}if(a[0]===6&&t.label<o[1]){t.label=o[1],o=a;break}if(o&&t.label<o[2]){t.label=o[2],t.ops.push(a);break}o[2]&&t.ops.pop(),t.trys.pop();continue}a=e.call(n,t)}catch(l){a=[6,l],i=0}finally{r=o=0}if(a[0]&5)throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}},Be=function(n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=n[Symbol.asyncIterator],t;return e?e.call(n):(n=typeof __values=="function"?__values(n):n[Symbol.iterator](),t={},r("next"),r("throw"),r("return"),t[Symbol.asyncIterator]=function(){return this},t);function r(o){t[o]=n[o]&&function(s){return new Promise(function(c,h){s=n[o](s),i(c,h,s.done,s.value)})}}function i(o,s,c,h){Promise.resolve(h).then(function(a){o({value:a,done:c})},s)}},I=function(n){return this instanceof I?(this.v=n,this):new I(n)},yt=function(n,e,t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r=t.apply(n,e||[]),i,o=[];return i={},s("next"),s("throw"),s("return"),i[Symbol.asyncIterator]=function(){return this},i;function s(u){r[u]&&(i[u]=function(m){return new Promise(function(p,g){o.push([u,m,p,g])>1||c(u,m)})})}function c(u,m){try{h(r[u](m))}catch(p){f(o[0][3],p)}}function h(u){u.value instanceof I?Promise.resolve(u.value.v).then(a,l):f(o[0][2],u)}function a(u){c("next",u)}function l(u){c("throw",u)}function f(u,m){u(m),o.shift(),o.length&&c(o[0][0],o[0][1])}},wt=function(n){var e=typeof n;return e==="string"||e==="number"},R=-1,te=new DataView(new ArrayBuffer(0)),mt=new Uint8Array(te.buffer),V=function(){try{te.getInt8(0)}catch(n){return n.constructor}throw new Error("never reached")}(),Pe=new V("Insufficient data"),vt=new pt,Ie=function(){function n(e,t,r,i,o,s,c,h){e===void 0&&(e=J.defaultCodec),t===void 0&&(t=void 0),r===void 0&&(r=L),i===void 0&&(i=L),o===void 0&&(o=L),s===void 0&&(s=L),c===void 0&&(c=L),h===void 0&&(h=vt),this.extensionCodec=e,this.context=t,this.maxStrLength=r,this.maxBinLength=i,this.maxArrayLength=o,this.maxMapLength=s,this.maxExtLength=c,this.keyDecoder=h,this.totalPos=0,this.pos=0,this.view=te,this.bytes=mt,this.headByte=R,this.stack=[]}return n.prototype.reinitializeState=function(){this.totalPos=0,this.headByte=R,this.stack.length=0},n.prototype.setBuffer=function(e){this.bytes=W(e),this.view=at(this.bytes),this.pos=0},n.prototype.appendBuffer=function(e){if(this.headByte===R&&!this.hasRemaining(1))this.setBuffer(e);else{var t=this.bytes.subarray(this.pos),r=W(e),i=new Uint8Array(t.length+r.length);i.set(t),i.set(r,t.length),this.setBuffer(i)}},n.prototype.hasRemaining=function(e){return this.view.byteLength-this.pos>=e},n.prototype.createExtraByteError=function(e){var t=this,r=t.view,i=t.pos;return new RangeError("Extra "+(r.byteLength-i)+" of "+r.byteLength+" byte(s) found at buffer["+e+"]")},n.prototype.decode=function(e){this.reinitializeState(),this.setBuffer(e);var t=this.doDecodeSync();if(this.hasRemaining(1))throw this.createExtraByteError(this.pos);return t},n.prototype.decodeMulti=function(e){return ee(this,function(t){switch(t.label){case 0:this.reinitializeState(),this.setBuffer(e),t.label=1;case 1:return this.hasRemaining(1)?[4,this.doDecodeSync()]:[3,3];case 2:return t.sent(),[3,1];case 3:return[2]}})},n.prototype.decodeAsync=function(e){var t,r,i,o;return dt(this,void 0,void 0,function(){var s,c,h,a,l,f,u,m;return ee(this,function(p){switch(p.label){case 0:s=!1,p.label=1;case 1:p.trys.push([1,6,7,12]),t=Be(e),p.label=2;case 2:return[4,t.next()];case 3:if(r=p.sent(),!!r.done)return[3,5];if(h=r.value,s)throw this.createExtraByteError(this.totalPos);this.appendBuffer(h);try{c=this.doDecodeSync(),s=!0}catch(g){if(!(g instanceof V))throw g}this.totalPos+=this.pos,p.label=4;case 4:return[3,2];case 5:return[3,12];case 6:return a=p.sent(),i={error:a},[3,12];case 7:return p.trys.push([7,,10,11]),r&&!r.done&&(o=t.return)?[4,o.call(t)]:[3,9];case 8:p.sent(),p.label=9;case 9:return[3,11];case 10:if(i)throw i.error;return[7];case 11:return[7];case 12:if(s){if(this.hasRemaining(1))throw this.createExtraByteError(this.totalPos);return[2,c]}throw l=this,f=l.headByte,u=l.pos,m=l.totalPos,new RangeError("Insufficient data in parsing "+Z(f)+" at "+m+" ("+u+" in the current buffer)")}})})},n.prototype.decodeArrayStream=function(e){return this.decodeMultiAsync(e,!0)},n.prototype.decodeStream=function(e){return this.decodeMultiAsync(e,!1)},n.prototype.decodeMultiAsync=function(e,t){return yt(this,arguments,function(){var r,i,o,s,c,h,a,l,f;return ee(this,function(u){switch(u.label){case 0:r=t,i=-1,u.label=1;case 1:u.trys.push([1,13,14,19]),o=Be(e),u.label=2;case 2:return[4,I(o.next())];case 3:if(s=u.sent(),!!s.done)return[3,12];if(c=s.value,t&&i===0)throw this.createExtraByteError(this.totalPos);this.appendBuffer(c),r&&(i=this.readArraySize(),r=!1,this.complete()),u.label=4;case 4:u.trys.push([4,9,,10]),u.label=5;case 5:return[4,I(this.doDecodeSync())];case 6:return[4,u.sent()];case 7:return u.sent(),--i==0?[3,8]:[3,5];case 8:return[3,10];case 9:if(h=u.sent(),!(h instanceof V))throw h;return[3,10];case 10:this.totalPos+=this.pos,u.label=11;case 11:return[3,2];case 12:return[3,19];case 13:return a=u.sent(),l={error:a},[3,19];case 14:return u.trys.push([14,,17,18]),s&&!s.done&&(f=o.return)?[4,I(f.call(o))]:[3,16];case 15:u.sent(),u.label=16;case 16:return[3,18];case 17:if(l)throw l.error;return[7];case 18:return[7];case 19:return[2]}})})},n.prototype.doDecodeSync=function(){e:for(;;){var e=this.readHeadByte(),t=void 0;if(e>=224)t=e-256;else if(e<192)if(e<128)t=e;else if(e<144){var r=e-128;if(r!==0){this.pushMapState(r),this.complete();continue e}else t={}}else if(e<160){var r=e-144;if(r!==0){this.pushArrayState(r),this.complete();continue e}else t=[]}else{var i=e-160;t=this.decodeUtf8String(i,0)}else if(e===192)t=null;else if(e===194)t=!1;else if(e===195)t=!0;else if(e===202)t=this.readF32();else if(e===203)t=this.readF64();else if(e===204)t=this.readU8();else if(e===205)t=this.readU16();else if(e===206)t=this.readU32();else if(e===207)t=this.readU64();else if(e===208)t=this.readI8();else if(e===209)t=this.readI16();else if(e===210)t=this.readI32();else if(e===211)t=this.readI64();else if(e===217){var i=this.lookU8();t=this.decodeUtf8String(i,1)}else if(e===218){var i=this.lookU16();t=this.decodeUtf8String(i,2)}else if(e===219){var i=this.lookU32();t=this.decodeUtf8String(i,4)}else if(e===220){var r=this.readU16();if(r!==0){this.pushArrayState(r),this.complete();continue e}else t=[]}else if(e===221){var r=this.readU32();if(r!==0){this.pushArrayState(r),this.complete();continue e}else t=[]}else if(e===222){var r=this.readU16();if(r!==0){this.pushMapState(r),this.complete();continue e}else t={}}else if(e===223){var r=this.readU32();if(r!==0){this.pushMapState(r),this.complete();continue e}else t={}}else if(e===196){var r=this.lookU8();t=this.decodeBinary(r,1)}else if(e===197){var r=this.lookU16();t=this.decodeBinary(r,2)}else if(e===198){var r=this.lookU32();t=this.decodeBinary(r,4)}else if(e===212)t=this.decodeExtension(1,0);else if(e===213)t=this.decodeExtension(2,0);else if(e===214)t=this.decodeExtension(4,0);else if(e===215)t=this.decodeExtension(8,0);else if(e===216)t=this.decodeExtension(16,0);else if(e===199){var r=this.lookU8();t=this.decodeExtension(r,1)}else if(e===200){var r=this.lookU16();t=this.decodeExtension(r,2)}else if(e===201){var r=this.lookU32();t=this.decodeExtension(r,4)}else throw new v("Unrecognized type byte: "+Z(e));this.complete();for(var o=this.stack;o.length>0;){var s=o[o.length-1];if(s.type===0)if(s.array[s.position]=t,s.position++,s.position===s.size)o.pop(),t=s.array;else continue e;else if(s.type===1){if(!wt(t))throw new v("The type of key must be string or number but "+typeof t);if(t==="__proto__")throw new v("The key __proto__ is not allowed");s.key=t,s.type=2;continue e}else if(s.map[s.key]=t,s.readCount++,s.readCount===s.size)o.pop(),t=s.map;else{s.key=null,s.type=1;continue e}}return t}},n.prototype.readHeadByte=function(){return this.headByte===R&&(this.headByte=this.readU8()),this.headByte},n.prototype.complete=function(){this.headByte=R},n.prototype.readArraySize=function(){var e=this.readHeadByte();switch(e){case 220:return this.readU16();case 221:return this.readU32();default:{if(e<160)return e-144;throw new v("Unrecognized array type byte: "+Z(e))}}},n.prototype.pushMapState=function(e){if(e>this.maxMapLength)throw new v("Max length exceeded: map length ("+e+") > maxMapLengthLength ("+this.maxMapLength+")");this.stack.push({type:1,size:e,key:null,readCount:0,map:{}})},n.prototype.pushArrayState=function(e){if(e>this.maxArrayLength)throw new v("Max length exceeded: array length ("+e+") > maxArrayLength ("+this.maxArrayLength+")");this.stack.push({type:0,size:e,array:new Array(e),position:0})},n.prototype.decodeUtf8String=function(e,t){var r;if(e>this.maxStrLength)throw new v("Max length exceeded: UTF-8 byte length ("+e+") > maxStrLength ("+this.maxStrLength+")");if(this.bytes.byteLength<this.pos+t+e)throw Pe;var i=this.pos+t,o;return this.stateIsMapKey()&&((r=this.keyDecoder)===null||r===void 0?void 0:r.canBeCached(e))?o=this.keyDecoder.decode(this.bytes,i,e):e>tt?o=nt(this.bytes,i,e):o=xe(this.bytes,i,e),this.pos+=t+e,o},n.prototype.stateIsMapKey=function(){if(this.stack.length>0){var e=this.stack[this.stack.length-1];return e.type===1}return!1},n.prototype.decodeBinary=function(e,t){if(e>this.maxBinLength)throw new v("Max length exceeded: bin length ("+e+") > maxBinLength ("+this.maxBinLength+")");if(!this.hasRemaining(e+t))throw Pe;var r=this.pos+t,i=this.bytes.subarray(r,r+e);return this.pos+=t+e,i},n.prototype.decodeExtension=function(e,t){if(e>this.maxExtLength)throw new v("Max length exceeded: ext length ("+e+") > maxExtLength ("+this.maxExtLength+")");var r=this.view.getInt8(this.pos+t),i=this.decodeBinary(e,t+1);return this.extensionCodec.decode(i,r,this.context)},n.prototype.lookU8=function(){return this.view.getUint8(this.pos)},n.prototype.lookU16=function(){return this.view.getUint16(this.pos)},n.prototype.lookU32=function(){return this.view.getUint32(this.pos)},n.prototype.readU8=function(){var e=this.view.getUint8(this.pos);return this.pos++,e},n.prototype.readI8=function(){var e=this.view.getInt8(this.pos);return this.pos++,e},n.prototype.readU16=function(){var e=this.view.getUint16(this.pos);return this.pos+=2,e},n.prototype.readI16=function(){var e=this.view.getInt16(this.pos);return this.pos+=2,e},n.prototype.readU32=function(){var e=this.view.getUint32(this.pos);return this.pos+=4,e},n.prototype.readI32=function(){var e=this.view.getInt32(this.pos);return this.pos+=4,e},n.prototype.readU64=function(){var e=qe(this.view,this.pos);return this.pos+=8,e},n.prototype.readI64=function(){var e=be(this.view,this.pos);return this.pos+=8,e},n.prototype.readF32=function(){var e=this.view.getFloat32(this.pos);return this.pos+=4,e},n.prototype.readF64=function(){var e=this.view.getFloat64(this.pos);return this.pos+=8,e},n}(),gt={};function ne(n,e){e===void 0&&(e=gt);var t=new Ie(e.extensionCodec,e.context,e.maxStrLength,e.maxBinLength,e.maxArrayLength,e.maxMapLength,e.maxExtLength);return t.decode(n)}var{default:bt}=__ALEPH__.pack["https://deno.land/x/aleph@v0.3.0-beta.19/framework/react/components/Head.ts"],{default:Xt}=__ALEPH__.pack["/components/logo.tsx"],{default:x,useEffect:Et,useRef:xt,useState:Ut}=__ALEPH__.pack["https://esm.sh/react@17.0.2"];async function St(n,e){let t=await pe(n),{iv:r,key:i,ciphered:o}=await de(t,e);return Y({iv:r,key:new Uint8Array(i),ciphered:new Uint8Array(o)})}var Ce=[];function re(){let n=xt(null),e=typeof location=="object"&&location.hash.substring(1);if(!e)return x.createElement("p",null,"no hash");let[t,r]=Ut(""),i=new URLSearchParams(e),o=i.get("send_to"),s=i.get("n");Et(()=>{O(s).then(r)});async function c(h){let a=h.target.files[0];if(!a)return;let l=new FileReader;l.onload=async function(){let f=l.result;if(!f||typeof f=="string")return;let u=await St(s,f);if(!u)return;let m=new Blob([u],{type:"application/octet-stream"});Ce.push(m);let p=document.createElement("a");p.href=URL.createObjectURL(Ce[0]),p.download=a.name+`.${o}.encrypt`,p.style.display="inline",p.text=p.download,n.current.insertAdjacentHTML("afterbegin","<br />"),n.current.insertAdjacentElement("afterbegin",p)},l.readAsArrayBuffer(a)}return x.createElement("main",{id:"send"},x.createElement(bt,null,x.createElement("title",null,o,"\u5B9B\u6697\u53F7\u5316\u30DA\u30FC\u30B8:NPAP")),x.createElement("h1",null,"\u6697\u53F7\u5316\u30DA\u30FC\u30B8"),x.createElement("p",null,"thumbprint: ",t),x.createElement("p",null,"\u3053\u306E\u30DA\u30FC\u30B8\u304B\u3089\u6697\u53F7\u5316\u3057\u305F\u30D5\u30A1\u30A4\u30EB\u306F\u3001",o,"\u3055\u3093\u3060\u3051\u304C\u958B\u3051\u307E\u3059\u3002"),x.createElement("h2",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u6697\u53F7\u5316"),x.createElement("input",{type:"file",onChange:c}),x.createElement("div",{ref:n}))}var{default:At}=__ALEPH__.pack["https://deno.land/x/aleph@v0.3.0-beta.19/framework/react/components/Head.ts"],{default:y,useCallback:Tt,useEffect:kt,useRef:Lt,useState:_t}=__ALEPH__.pack["https://esm.sh/react@17.0.2"];async function Bt(n,e){let t=await fe(n),r=ne(e);return ye(t,r)}function ie(){let n=Lt(null),e=typeof location=="object"&&location.hash.substring(1);if(!e)return y.createElement("p",null,"no hash");let[t,r]=_t(""),l=Object.fromEntries(new URLSearchParams(e)),{receive_by:o}=l,s=ue(l,["receive_by"]),{n:c}=s,h=`${location.origin}${location.pathname}#send_to=${encodeURI(o)}&n=${c}`;kt(()=>{O(c).then(r)});let a=Tt(async f=>{let u=f.target.files[0];if(!u)return;let m=new FileReader;m.onload=async function(){let p=m.result;try{let g=await Bt(s,p),_=new Blob([g],{type:"application/octet-stream"}),C=document.createElement("a");C.href=URL.createObjectURL(_),C.download=u.name.split(".").slice(0,-2).join("."),C.text=C.download,n.current.insertAdjacentElement("afterbegin",C)}catch(g){let _=u.name+": ";g instanceof RangeError&&(_+="\u6697\u53F7\u5316\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093"),g instanceof K?_+="\u9375\u304C\u6574\u5408\u3057\u307E\u305B\u3093\u3002\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u3068\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u304C\u5BFE\u5FDC\u3057\u3066\u3044\u308B\u304B\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002":(console.error(g),_+="\u4E0D\u660E\u306A\u5FA9\u53F7\u30A8\u30E9\u30FC\u3067\u3059"),n.current.insertAdjacentHTML("afterbegin",`<p>${_}</p>`)}},m.readAsArrayBuffer(u)},[n.current]);return y.createElement("main",{id:"receive"},y.createElement(At,null,y.createElement("title",null,o,"\u306E\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8:NPAP")),y.createElement("h1",null,"\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8"),y.createElement("p",null,"\u6240\u6709\u8005: ",o),y.createElement("p",null,"thumbprint: ",t),y.createElement("p",null,"\u3053\u306E\u30DA\u30FC\u30B8\u306F\u3042\u306A\u305F\u5C02\u7528\u306E\u3082\u306E\u3067\u3059\u3002",y.createElement("br",null),"\u518D\u751F\u6210\u306F\u51FA\u6765\u307E\u305B\u3093\u306E\u3067\u3001 URL \u3092\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u7B49\u306B\u4FDD\u5B58\u3057\u3066\u304A\u3044\u3066\u304F\u3060\u3055\u3044\u3002",y.createElement("br",null),"URL \u306B\u306F\u79D8\u5BC6\u9375\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002\u5927\u5207\u306B\u4FDD\u7BA1\u3057\u3001\u8AB0\u304B\u306B\u30E1\u30FC\u30EB\u7B49\u3067\u9001\u308B\u3053\u3068\u306F\u3057\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002"),y.createElement("h2",null,"\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u3092\u9001\u308B"),y.createElement("p",null,"\u4EE5\u4E0B\u306EURL\u3092\u30E1\u30FC\u30EB\u7B49\u3067\u9001\u4FE1\u8005\u306B\u9001\u4ED8\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),y.createElement("input",{type:"text",value:h,readOnly:!0,style:{width:"100%"},onClick:f=>f.target.select()}),y.createElement("br",null),y.createElement("a",{href:h,target:"_blank"},"\u958B\u3044\u3066\u307F\u308B"),y.createElement("h2",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u5FA9\u53F7"),y.createElement("p",null,"\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u3067\u6697\u53F7\u5316\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u3092\u53D7\u3051\u53D6\u308A\u307E\u3057\u305F\u3089\u3001\u4EE5\u4E0B\u304B\u3089\u5FA9\u53F7\u3067\u304D\u307E\u3059\u3002"),y.createElement("p",null,"\u51E6\u7406\u306F\u30CD\u30C3\u30C8\u3092\u4ECB\u3055\u305A\u3001\u3042\u306A\u305F\u306E\u30DE\u30B7\u30F3\u4E0A\u3067\u51E6\u7406\u3055\u308C\u307E\u3059\u3002"),y.createElement("input",{type:"file",onChange:a}),y.createElement("div",{ref:n}))}var{default:U,useState:Pt}=__ALEPH__.pack["https://esm.sh/react@17.0.2"];function It(){return!(!crypto||!crypto.subtle||!crypto.subtle.generateKey||!crypto.subtle.encrypt||!crypto.subtle.decrypt||!crypto.subtle.wrapKey||!crypto.subtle.unwrapKey)}function je(){if(!It())return U.createElement("p",null,"\u304A\u4F7F\u3044\u306E\u30D6\u30E9\u30A6\u30B6\u306FNPAP\u306B\u5BFE\u5FDC\u3057\u3066\u304A\u308A\u307E\u305B\u3093\u3002\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u78BA\u4FDD\u306E\u305F\u3081\u306B\u3082\u6700\u65B0\u306E\u30D6\u30E9\u30A6\u30B6\u3092\u3054\u5229\u7528\u304F\u3060\u3055\u3044\u3002");let[n,e]=Pt(location.hash);window.addEventListener("hashchange",function(){e(location.hash)},!1);let t="1.0";return U.createElement("div",{id:"npap"},U.createElement(Ct,{cmd:n}),U.createElement("footer",null,U.createElement("a",{href:"#",target:"_blank"},"\u9375\u751F\u6210\u30DA\u30FC\u30B8"),U.createElement("a",{href:"https://npap.kbn.one",target:"_blank"},"NPAP Top"),U.createElement("span",null,"Version ",t)))}function Ct({cmd:n}){return n.startsWith("#send_to")?U.createElement(re,null):n.startsWith("#receive_by")?U.createElement(ie,null):U.createElement(G,null)}__ALEPH__.pack["/pages/NPAP.tsx"]=oe;})();
