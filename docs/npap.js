var V=Object.defineProperty;var s=(r,t)=>V(r,"name",{value:t,configurable:!0});function P(){if(typeof Deno<"u")return null;if(typeof crypto>"u")return"crypto";let{subtle:r}=crypto;return r?r.generateKey?r.encrypt?r.decrypt?r.wrapKey?r.unwrapKey?r.importKey?r.exportKey?crypto.getRandomValues?null:"crypto.getRandomValues":"crypto.subtle.exportKey":"crypto.subtle.importKey":"crypto.subtle.unwrapKey":"crypto.subtle.wrapKey":"crypto.subtle.decrypt":"crypto.subtle.encrypt":"crypto.subtle.generateKey":"crypto.subtle"}s(P,"missingFeature");var y=window.crypto?.subtle,C={name:"RSA-OAEP",hash:{name:"SHA-256"}};async function B(){let r=await y.generateKey({modulusLength:4096,publicExponent:new Uint8Array([1,0,1]),...C},!0,["wrapKey","unwrapKey"]),t=await y.exportKey("jwk",r.publicKey),n=await y.exportKey("jwk",r.privateKey);return{publicKey:t,privateKey:n}}s(B,"generateJwkPair");function h(r){return y.importKey("jwk",r,C,!1,r.key_ops)}s(h,"importKey");async function S(r,t){let n=await y.generateKey({name:"AES-CBC",length:256},!0,["encrypt","decrypt"]),o=crypto.getRandomValues(new Uint8Array(16)),i=await M(n,o,t),a=await y.wrapKey("raw",n,r,"RSA-OAEP");return{key:new Uint8Array(a),iv:o,encrypted:new Uint8Array(i)}}s(S,"encryptByPublicKey");var c=class extends Error{};s(c,"UnwrapKeyError");async function v(r,t){let{key:n,iv:o,encrypted:i}=t,a=await y.unwrapKey("raw",n,r,"RSA-OAEP","AES-CBC",!1,["decrypt"]).catch(p=>{throw new c});return H(a,o,i)}s(v,"decryptByPrivateKey");async function J(r){let{e:t,kty:n,n:o}=r,i=JSON.stringify({e:t,kty:n,n:o}),a=new TextEncoder().encode(i).buffer,p=await y.digest("SHA-256",a);return[...new Uint8Array(p)].map(l=>("0"+l.toString(16)).slice(-2))}s(J,"thumbprint");function M(r,t,n){return y.encrypt({name:"AES-CBC",iv:t},r,n)}s(M,"aesEncrypt");function H(r,t,n){return y.decrypt({name:"AES-CBC",iv:t},r,n)}s(H,"aesDecrypt");var $={alg:"RSA-OAEP-256",e:"AQAB",ext:!1,kty:"RSA"},q=["d","dp","dq","n","p","q","qi"],G=s((r,t)=>{let n={};for(let o of t)r[o]&&(n[o]=r[o]);return n},"pick");function T(r){return G(r,q)}s(T,"minifyJwk");function K(r,t){return{key_ops:[t],...$,...r}}s(K,"fullifyToJwk");import{default as e}from"https://esm.sh/react@18";import{default as de}from"https://esm.sh/react-dom@18";import*as U from"https://esm.sh/@msgpack/msgpack@2.7.1";var{useRef:X}=e;function k(){let r=X(null);return e.createElement("main",{id:"instruction"},e.createElement("head",null,e.createElement("title",null,"NPAP \u9375\u751F\u6210\u30DA\u30FC\u30B8")),e.createElement("h1",null,"\u9375\u751F\u6210\u30DA\u30FC\u30B8"),e.createElement("p",null,"\u53D7\u4FE1\u8005\u306E\u304A\u540D\u524D",e.createElement("br",null),e.createElement("input",{type:"text",ref:r,required:!0}),e.createElement("br",null),e.createElement("button",{onClick:s(()=>{let n=r.current.value;n.length!=0&&B().then(o=>{let i={receive_by:n,...T(o.privateKey)},a=new URLSearchParams(i);location.hash=a.toString()})},"generate")},"\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u3092\u4F5C\u6210")),e.createElement("h2",null,"\u4F7F\u3044\u65B9"),e.createElement("p",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u53D7\u4FE1\u8005\u306F\u3001\u3042\u3089\u304B\u3058\u3081\u81EA\u5206\u5C02\u7528\u306E\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u3092\u4F5C\u6210\u3057\u3001\u304A\u624B\u5143\u306B\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u3092\u4FDD\u5B58\u3057\u3066\u3044\u3064\u3067\u3082\u958B\u3051\u308B\u3088\u3046\u306B\u3057\u3066\u304A\u304D\u307E\u3059\u3002"),e.createElement("p",null,"\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u304B\u3089\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u306EURL\u304C\u53D6\u5F97\u3067\u304D\u308B\u306E\u3067\u3001\u305D\u308C\u3092\u30E1\u30FC\u30EB\u3067\u76F8\u624B\u306B\u9001\u308A\u307E\u3059\u3002"),e.createElement("p",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u9001\u4FE1\u8005\u306F\u3001\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u3092\u958B\u304D\u3001\u9001\u308A\u305F\u3044\u30D5\u30A1\u30A4\u30EB\u3092\u6307\u5B9A\u3057\u307E\u3059\u3002\u30D5\u30A1\u30A4\u30EB\u306F\u3069\u3053\u3078\u3082\u9001\u4FE1\u3055\u308C\u308B\u3053\u3068\u306A\u304F\u3001\u30D6\u30E9\u30A6\u30B6\u5185\u3067\u6697\u53F7\u5316\u3055\u308C\u3001\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3067\u304D\u307E\u3059\u3002"),e.createElement("p",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u9001\u4FE1\u8005\u306F\u3001\u6697\u53F7\u5316\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u3092\u30E1\u30FC\u30EB\u306B\u6DFB\u4ED8\u3057\u3066\u9001\u308A\u307E\u3059\u3002"),e.createElement("p",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u53D7\u4FE1\u8005\u306F\u3001\u6697\u53F7\u5316\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u3092\u53D7\u3051\u53D6\u3063\u305F\u3089\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u304B\u3089\u5143\u306E\u30D5\u30A1\u30A4\u30EB\u3078\u5FA9\u53F7\u3067\u304D\u307E\u3059\u3002"),e.createElement("h2",null,"\u306A\u305C\u5B89\u5168\u306A\u306E\uFF1F"),e.createElement("p",null,"\u516C\u958B\u9375\u65B9\u5F0F\u3068\u3044\u3046\u6697\u53F7\u3092\u4F7F\u3063\u3066\u3044\u307E\u3059\u3002\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u3067\u6697\u53F7\u5316\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u306F\u3001\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u306E\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u3092\u77E5\u3063\u3066\u3044\u308B\u4EBA\u306E\u307F\u304C\u5FA9\u53F7\u3067\u304D\u307E\u3059\u3002"),e.createElement("p",null,"\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u306F\u53D7\u4FE1\u8005\u306E\u624B\u5143\u306B\u3042\u308C\u3070\u3088\u304F\u3001\u9001\u4FE1\u8005\u306B\u306F\u5FC5\u8981\u3042\u308A\u307E\u305B\u3093\u3002\u3064\u307E\u308A\u3001\u5FA9\u53F7\u306B\u5FC5\u8981\u306A\u60C5\u5831\u306F\u4E00\u5207\u30CD\u30C3\u30C8\u306B\u6D41\u51FA\u3057\u307E\u305B\u3093\u3002"),e.createElement("p",null,"NPAP \u306E\u79D8\u5BC6\u9375\u306FURL\u306E\u300C#\u300D\u4EE5\u964D\u306E\u30CF\u30C3\u30B7\u30E5\u6587\u5B57\u5217\u3068\u547C\u3070\u308C\u308B\u90E8\u5206\u306B\u683C\u7D0D\u3057\u3066\u3042\u308A\u307E\u3059\u3002 \u30D6\u30E9\u30A6\u30B6\u306F\u3053\u306E\u60C5\u5831\u3092\u3069\u3053\u306B\u3082\u9001\u308A\u307E\u305B\u3093\u306E\u3067\u3001NPAP \u306E\u30B5\u30FC\u30D0\u30FC\u306B\u3055\u3048\u79D8\u5BC6\u9375\u306F\u9001\u4FE1\u3055\u308C\u307E\u305B\u3093\u3002"),e.createElement("h2",null,"\u9375\u6307\u7D0B\u3068\u306F"),e.createElement("p",null,"\u300C\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u300D\u304B\u3089\u53D6\u5F97\u3067\u304D\u308B\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u306B\u306F\u3001\u540C\u3058\u9375\u6307\u7D0B\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002 \u4E21\u8005\u306E\u9375\u6307\u7D0B\u3092\u691C\u8A3C\u3059\u308B\u3053\u3068\u3067\u3001\u5BFE\u5FDC\u3057\u3066\u3044\u308B\u30DA\u30A2\u304B\u3069\u3046\u304B\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002"))}s(k,"Instruction");var{decode:Q,encode:Y}=U,m=class extends Error{};s(m,"CryptoPackError");function L(r,t){return S(r,t).then(Y).catch(n=>{let o;throw n instanceof DOMException&&n.message.startsWith('The JWK member "n"')?o="\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u306EURL\u304C\u7834\u640D\u3057\u3066\u3044\u307E\u3059\u3002":(console.error(n),o="\u4E0D\u660E\u306A\u6697\u53F7\u5316\u30A8\u30E9\u30FC\u304C\u767A\u751F: "+n.message),new m(o,n)})}s(L,"encryptBuffer");function N(r,t){let n=Q(t);return v(r,n).catch(o=>{let i;throw o instanceof RangeError&&(i="\u6697\u53F7\u5316\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093"),o instanceof c?i="\u9375\u304C\u6574\u5408\u3057\u307E\u305B\u3093\u3002\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u3068\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8\u304C\u5BFE\u5FDC\u3057\u3066\u3044\u308B\u304B\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002":(console.error(o),i="\u4E0D\u660E\u306A\u5FA9\u53F7\u30A8\u30E9\u30FC\u304C\u767A\u751F: "+o.message),new m(i,o)})}s(N,"decryptBuffer");var{useEffect:Z,useState:z}=e;function g({jwk:r}){let[t,n]=z("");return Z(()=>{R(r).then(n)}),e.createElement(e.Fragment,null,e.createElement("p",null,"\u9375\u6307\u7D0B:"),e.createElement("div",{className:"thumbprint"},t))}s(g,"Thumbprint");async function j(r,t,n){let o=await _(t);return L(r,o).then(i=>{let a=D(i,n);return b(a)}).catch(i=>{let a=t.name+": "+i.message;return b(a)})}s(j,"encryptFileAndGetResultNode");async function W(r,t){let n=await _(t);return N(r,n).then(o=>{let i=t.name.split(".").slice(0,-2).join("."),a=D(o,i);return b(a)}).catch(o=>{let i=t.name+": "+o.message;return b(i)})}s(W,"decryptFileAndGetResultNode");async function R(r){let t=await J(r),n=[];for(let o of re(t,8))n.push(o.join(":"));return n.join(":"+String.fromCharCode(8203))}s(R,"blockedThumbprint");function w({cryptoKey:r,children:t}){return r===!1?e.createElement("p",null,"URL \u304C\u7834\u640D\u3057\u3066\u3044\u307E\u3059\u3002\u4FDD\u5B58\u3055\u308C\u305FURL\u3092\u6B63\u3057\u304F\u958B\u3044\u3066\u3044\u308B\u304B\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002"):e.createElement(e.Fragment,null,t)}s(w,"KeyIsValid");var ee=0;function b(r){return e.createElement("p",{key:ee++},r)}s(b,"P");var re=s(function*(r,t){for(let n=0,o=r.length;n<o;n+=t)yield r.slice(n,n+t)},"eachSlice"),_=s(r=>new Promise((t,n)=>{let o=new FileReader;o.onload=()=>t(o.result),o.onerror=n,o.readAsArrayBuffer(r)}),"readAsArrayBuffer");function te(r){let t=new Blob([r],{type:"application/octet-stream"});return URL.createObjectURL(t)}s(te,"arrayBufferToObjectUrl");function D(r,t){let n=te(r);return e.createElement("a",{href:n,download:t,target:"_blank"},t)}s(D,"arrayBufferToDownloadAnchor");var{useCallback:ne,useEffect:oe,useState:O}=e;function x({sendTo:r,pub:t}){let n=K(t,"wrapKey"),[o,i]=O([]),[a,p]=O();oe(()=>{h(n).then(p).catch(()=>p(!1))},[t]);let f=ne(async l=>{if(!(a instanceof CryptoKey))return;let u=l.target.files[0];if(!u)return;let d=u.name+`.${r}.encrypt`,A=await j(a,u,d);i([A,...o])},[a,o]);return e.createElement("main",{id:"send"},e.createElement("head",null,e.createElement("title",null,r,"\u5B9B\u6697\u53F7\u5316\u30DA\u30FC\u30B8:NPAP")),e.createElement("h1",null,"\u6697\u53F7\u5316\u30DA\u30FC\u30B8"),e.createElement(w,{cryptoKey:a},e.createElement("p",null,"\u79D8\u5BC6\u9375\u6240\u6709\u8005: ",r),e.createElement("p",null,"\u3053\u306E\u30DA\u30FC\u30B8\u304B\u3089\u6697\u53F7\u5316\u3057\u305F\u30D5\u30A1\u30A4\u30EB\u306F\u3001\u79D8\u5BC6\u9375\u6240\u6709\u8005\u3060\u3051\u304C\u958B\u3051\u307E\u3059\u3002"),e.createElement(g,{jwk:n}),e.createElement("h2",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u6697\u53F7\u5316"),e.createElement("input",{type:"file",onChange:f}),o))}s(x,"Send");var{useCallback:se,useEffect:ie,useState:I}=e;function E({receiveBy:r,secrets:t}){let n=K(t,"unwrapKey"),o=`${location.origin}${location.pathname}#send_to=${encodeURI(r)}&n=${n.n}`,[i,a]=I([]),[p,f]=I();ie(()=>{h(n).then(u=>f(u)).catch(()=>f(!1))},[t]);let l=se(async u=>{if(!(p instanceof CryptoKey))return;let d=u.target.files[0];if(!d)return;let A=await W(p,d);a([A,...i])},[p,i]);return e.createElement("main",{id:"receive"},e.createElement("head",null,e.createElement("title",null,r,"\u306E\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8:NPAP")),e.createElement("h1",null,"\u79D8\u5BC6\u9375\u30DA\u30FC\u30B8"),e.createElement(w,{cryptoKey:p},e.createElement("p",null,"\u6240\u6709\u8005: ",r),e.createElement(g,{jwk:n}),e.createElement("p",null,"\u3053\u306E\u30DA\u30FC\u30B8\u306F\u3042\u306A\u305F\u5C02\u7528\u306E\u3082\u306E\u3067\u3059\u3002",e.createElement("br",null),"\u518D\u751F\u6210\u306F\u51FA\u6765\u307E\u305B\u3093\u306E\u3067\u3001 URL \u3092\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u7B49\u306B\u4FDD\u5B58\u3057\u3066\u304A\u3044\u3066\u304F\u3060\u3055\u3044\u3002",e.createElement("br",null),"URL \u306B\u306F\u79D8\u5BC6\u9375\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002\u5927\u5207\u306B\u4FDD\u7BA1\u3057\u3001\u8AB0\u304B\u306B\u30E1\u30FC\u30EB\u7B49\u3067\u9001\u308B\u3053\u3068\u306F\u3057\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002"),e.createElement("h2",null,"\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u3092\u9001\u308B"),e.createElement("p",null,"\u4EE5\u4E0B\u306EURL\u3092\u30E1\u30FC\u30EB\u7B49\u3067\u9001\u4FE1\u8005\u306B\u9001\u4ED8\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),e.createElement("input",{type:"text",value:o,readOnly:!0,style:{width:"100%"},onClick:u=>u.target.select()}),e.createElement("br",null),e.createElement("a",{href:o,target:"_blank"},"\u958B\u3044\u3066\u307F\u308B"),e.createElement("h2",null,"\u30D5\u30A1\u30A4\u30EB\u306E\u5FA9\u53F7"),e.createElement("p",null,"\u300C\u6697\u53F7\u5316\u30DA\u30FC\u30B8\u300D\u3067\u6697\u53F7\u5316\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u3092\u53D7\u3051\u53D6\u308A\u307E\u3057\u305F\u3089\u3001\u4EE5\u4E0B\u304B\u3089\u5FA9\u53F7\u3067\u304D\u307E\u3059\u3002"),e.createElement("p",null,"\u51E6\u7406\u306F\u30CD\u30C3\u30C8\u3092\u4ECB\u3055\u305A\u3001\u3042\u306A\u305F\u306E\u30DE\u30B7\u30F3\u4E0A\u3067\u51E6\u7406\u3055\u308C\u307E\u3059\u3002"),e.createElement("input",{type:"file",onChange:l}),i))}s(E,"Receive");var F=P();function ae(){return F?e.createElement("p",null,"\u304A\u4F7F\u3044\u306E\u30D6\u30E9\u30A6\u30B6\u306FNPAP\u306B\u5BFE\u5FDC\u3057\u3066\u304A\u308A\u307E\u305B\u3093\u3002 \u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u78BA\u4FDD\u306E\u305F\u3081\u306B\u3082\u6700\u65B0\u306E\u30D6\u30E9\u30A6\u30B6\u3092\u3054\u5229\u7528\u304F\u3060\u3055\u3044\u3002",e.createElement("br",null),"\u4E0D\u8DB3\u6A5F\u80FD: ",F):e.createElement("div",{id:"npap"},e.createElement(pe,{urlString:""}),e.createElement("footer",null,e.createElement("a",{href:"#",target:"_blank"},"\u9375\u751F\u6210\u30DA\u30FC\u30B8"),e.createElement("a",{href:"https://npap.kbn.one",target:"_blank"},"NPAP Top"),e.createElement("span",null,"Version ","1.1")))}s(ae,"Npap");function pe({urlString:r}){let t=Object.fromEntries(new URLSearchParams(r));if(t.send_to){let{send_to:n,...o}=t;return e.createElement(x,{sendTo:n,pub:o})}if(t.receive_by){let{receive_by:n,...o}=t;return e.createElement(E,{receiveBy:n,secrets:o})}return e.createElement(k,null)}s(pe,"Pages");export{ae as default};
