var V=Object.defineProperty;var s=(r,t)=>V(r,"name",{value:t,configurable:!0});function P(){if(typeof Deno<"u")return null;if(typeof crypto>"u")return"crypto";let{subtle:r}=crypto;return r?r.generateKey?r.encrypt?r.decrypt?r.wrapKey?r.unwrapKey?r.importKey?r.exportKey?crypto.getRandomValues?null:"crypto.getRandomValues":"crypto.subtle.exportKey":"crypto.subtle.importKey":"crypto.subtle.unwrapKey":"crypto.subtle.wrapKey":"crypto.subtle.decrypt":"crypto.subtle.encrypt":"crypto.subtle.generateKey":"crypto.subtle"}s(P,"missingFeature");var y=window.crypto?.subtle,C={name:"RSA-OAEP",hash:{name:"SHA-256"}};async function B(){let r=await y.generateKey({modulusLength:4096,publicExponent:new Uint8Array([1,0,1]),...C},!0,["wrapKey","unwrapKey"]),t=await y.exportKey("jwk",r.publicKey),n=await y.exportKey("jwk",r.privateKey);return{publicKey:t,privateKey:n}}s(B,"generateJwkPair");function h(r){return y.importKey("jwk",r,C,!1,r.key_ops)}s(h,"importKey");async function S(r,t){let n=await y.generateKey({name:"AES-CBC",length:256},!0,["encrypt","decrypt"]),o=crypto.getRandomValues(new Uint8Array(16)),i=await H(n,o,t),a=await y.wrapKey("raw",n,r,"RSA-OAEP");return{key:new Uint8Array(a),iv:o,encrypted:new Uint8Array(i)}}s(S,"encryptByPublicKey");var c=class extends Error{};s(c,"UnwrapKeyError");async function v(r,t){let{key:n,iv:o,encrypted:i}=t,a=await y.unwrapKey("raw",n,r,"RSA-OAEP","AES-CBC",!1,["decrypt"]).catch(p=>{throw new c});return $(a,o,i)}s(v,"decryptByPrivateKey");async function J(r){let{e:t,kty:n,n:o}=r,i=JSON.stringify({e:t,kty:n,n:o}),a=new TextEncoder().encode(i).buffer,p=await y.digest("SHA-256",a);return[...new Uint8Array(p)].map(l=>("0"+l.toString(16)).slice(-2))}s(J,"thumbprint");function H(r,t,n){return y.encrypt({name:"AES-CBC",iv:t},r,n)}s(H,"aesEncrypt");function $(r,t,n){return y.decrypt({name:"AES-CBC",iv:t},r,n)}s($,"aesDecrypt");var q={alg:"RSA-OAEP-256",e:"AQAB",ext:!1,kty:"RSA"},G=["d","dp","dq","n","p","q","qi"],X=s((r,t)=>{let n={};for(let o of t)r[o]&&(n[o]=r[o]);return n},"pick");function T(r){return X(r,G)}s(T,"minifyJwk");function K(r,t){return{key_ops:[t],...q,...r}}s(K,"fullifyToJwk");import{default as e}from"https://esm.sh/react@18";import{default as U}from"https://esm.sh/react-dom@18";import*as L from"https://esm.sh/@msgpack/msgpack@2.7.1";var{useRef:Q}=e;function g(){let r=Q(null);return e.createElement("main",{id:"instruction"},e.createElement("head",null,e.createElement("title",null,"NPAP 鍵生成ページ")),e.createElement("h1",null,"鍵生成ページ"),e.createElement("p",null,"受信者のお名前",e.createElement("br",null),e.createElement("input",{type:"text",ref:r,required:!0}),e.createElement("br",null),e.createElement("button",{onClick:s(()=>{let n=r.current.value;n.length!=0&&B().then(o=>{let i={receive_by:n,...T(o.privateKey)},a=new URLSearchParams(i);location.hash=a.toString()})},"generate")},"「秘密鍵ページ」を作成")),e.createElement("h2",null,"使い方"),e.createElement("p",null,"ファイルの受信者は、あらかじめ自分専用の「秘密鍵ページ」を作成し、お手元にブックマークを保存していつでも開けるようにしておきます。"),e.createElement("p",null,"「秘密鍵ページ」から「暗号化ページ」のURLが取得できるので、それをメールで相手に送ります。"),e.createElement("p",null,"ファイルの送信者は、「暗号化ページ」を開き、送りたいファイルを指定します。ファイルはどこへも送信されることなく、ブラウザ内で暗号化され、ダウンロードできます。"),e.createElement("p",null,"ファイルの送信者は、暗号化されたファイルをメールに添付して送ります。"),e.createElement("p",null,"ファイルの受信者は、暗号化されたファイルを受け取ったら「秘密鍵ページ」から元のファイルへ復号できます。"),e.createElement("h2",null,"なぜ安全なの？"),e.createElement("p",null,"公開鍵方式という暗号を使っています。「暗号化ページ」で暗号化されたファイルは、「秘密鍵ページ」のブックマークを知っている人のみが復号できます。"),e.createElement("p",null,"「秘密鍵ページ」は受信者の手元にあればよく、送信者には必要ありません。つまり、復号に必要な情報は一切ネットに流出しません。"),e.createElement("p",null,"NPAP の秘密鍵はURLの「#」以降のハッシュ文字列と呼ばれる部分に格納してあります。 ブラウザはこの情報をどこにも送りませんので、NPAP のサーバーにさえ秘密鍵は送信されません。"),e.createElement("h2",null,"鍵指紋とは"),e.createElement("p",null,"「秘密鍵ページ」から取得できる「暗号化ページ」には、同じ鍵指紋が表示されます。 両者の鍵指紋を検証することで、対応しているペアかどうかを確認できます。"))}s(g,"Instruction");var{decode:Y,encode:Z}=L,m=class extends Error{};s(m,"CryptoPackError");function N(r,t){return S(r,t).then(Z).catch(n=>{let o;throw n instanceof DOMException&&n.message.startsWith('The JWK member "n"')?o="暗号化ページのURLが破損しています。":(console.error(n),o="不明な暗号化エラーが発生: "+n.message),new m(o,n)})}s(N,"encryptBuffer");function j(r,t){let n=Y(t);return v(r,n).catch(o=>{let i;throw o instanceof RangeError&&(i="暗号化ファイルではありません"),o instanceof c?i="鍵が整合しません。暗号化ページと秘密鍵ページが対応しているかご確認ください。":(console.error(o),i="不明な復号エラーが発生: "+o.message),new m(i,o)})}s(j,"decryptBuffer");var{useEffect:z,useState:R}=e;function w({jwk:r}){let[t,n]=R("");return z(()=>{ee(r).then(n)}),e.createElement(e.Fragment,null,e.createElement("p",null,"鍵指紋:"),e.createElement("div",{className:"thumbprint"},t))}s(w,"Thumbprint");async function I(r,t,n){let o=await O(t);return N(r,o).then(i=>{let a=W(i,n);return b(a)}).catch(i=>{let a=t.name+": "+i.message;return b(a)})}s(I,"encryptFileAndGetResultNode");async function D(r,t){let n=await O(t);return j(r,n).then(o=>{let i=t.name.split(".").slice(0,-2).join("."),a=W(o,i);return b(a)}).catch(o=>{let i=t.name+": "+o.message;return b(i)})}s(D,"decryptFileAndGetResultNode");async function ee(r){let t=await J(r),n=[];for(let o of te(t,8))n.push(o.join(":"));return n.join(":"+String.fromCharCode(8203))}s(ee,"blockedThumbprint");function A({cryptoKey:r,children:t}){return r===!1?e.createElement("p",null,"URL が破損しています。保存されたURLを正しく開いているかご確認ください。"):e.createElement(e.Fragment,null,t)}s(A,"KeyIsValid");var re=0;function b(r){return e.createElement("p",{key:re++},r)}s(b,"P");var te=s(function*(r,t){for(let n=0,o=r.length;n<o;n+=t)yield r.slice(n,n+t)},"eachSlice"),O=s(r=>new Promise((t,n)=>{let o=new FileReader;o.onload=()=>t(o.result),o.onerror=n,o.readAsArrayBuffer(r)}),"readAsArrayBuffer");function ne(r){let t=new Blob([r],{type:"application/octet-stream"});return URL.createObjectURL(t)}s(ne,"arrayBufferToObjectUrl");function W(r,t){let n=ne(r);return e.createElement("a",{href:n,download:t,target:"_blank"},t)}s(W,"arrayBufferToDownloadAnchor");var{useCallback:oe,useEffect:se,useState:_}=e;function k({sendTo:r,pub:t}){let n=K(t,"wrapKey"),[o,i]=_([]),[a,p]=_();se(()=>{h(n).then(p).catch(()=>p(!1))},[t]);let f=oe(async l=>{if(!(a instanceof CryptoKey))return;let u=l.target.files?.[0];if(!u)return;let d=u.name+`.${r}.encrypt`,E=await I(a,u,d);i([E,...o])},[a,o]);return e.createElement("main",{id:"send"},e.createElement("head",null,e.createElement("title",null,r,"宛暗号化ページ:NPAP")),e.createElement("h1",null,"暗号化ページ"),e.createElement(A,{cryptoKey:a},e.createElement("p",null,"秘密鍵所有者: ",r),e.createElement("p",null,"このページから暗号化したファイルは、秘密鍵所有者だけが開けます。"),e.createElement(w,{jwk:n}),e.createElement("h2",null,"ファイルの暗号化"),e.createElement("input",{type:"file",onChange:f}),o))}s(k,"Send");var{useCallback:ie,useEffect:ae,useState:F}=e;function x({receiveBy:r,secrets:t}){let n=K(t,"unwrapKey"),o=`${location.origin}${location.pathname}#send_to=${encodeURI(r)}&n=${n.n}`,[i,a]=F([]),[p,f]=F();ae(()=>{h(n).then(u=>f(u)).catch(()=>f(!1))},[t]);let l=ie(async u=>{if(!(p instanceof CryptoKey))return;let d=u.target.files[0];if(!d)return;let E=await D(p,d);a([E,...i])},[p,i]);return e.createElement("main",{id:"receive"},e.createElement("head",null,e.createElement("title",null,r,"の秘密鍵ページ:NPAP")),e.createElement("h1",null,"秘密鍵ページ"),e.createElement(A,{cryptoKey:p},e.createElement("p",null,"所有者: ",r),e.createElement(w,{jwk:n}),e.createElement("p",null,"このページはあなた専用のものです。",e.createElement("br",null),"再生成は出来ませんので、 URL をブックマーク等に保存しておいてください。",e.createElement("br",null),"URL には秘密鍵が含まれています。大切に保管し、誰かにメール等で送ることはしないでください。"),e.createElement("h2",null,"「暗号化ページ」を送る"),e.createElement("p",null,"以下のURLをメール等で送信者に送付してください。"),e.createElement("input",{type:"text",value:o,readOnly:!0,style:{width:"100%"},onClick:u=>u.target.select()}),e.createElement("br",null),e.createElement("a",{href:o,target:"_blank"},"開いてみる"),e.createElement("h2",null,"ファイルの復号"),e.createElement("p",null,"「暗号化ページ」で暗号化されたファイルを受け取りましたら、以下から復号できます。"),e.createElement("p",null,"処理はネットを介さず、あなたのマシン上で処理されます。"),e.createElement("input",{type:"file",onChange:l}),i))}s(x,"Receive");var M=P();function pe(){if(M)return e.createElement("p",null,"お使いのブラウザはNPAPに対応しておりません。 セキュリティ確保のためにも最新のブラウザをご利用ください。",e.createElement("br",null),"不足機能: ",M);let r="1.1",[t,n]=e.useState(location.hash.slice(1));return addEventListener("hashchange",()=>n(location.hash.slice(1))),e.createElement("div",{id:"npap"},e.createElement(ye,{urlString:t}),e.createElement("footer",null,e.createElement("a",{href:"#",target:"_blank"},"鍵生成ページ"),e.createElement("a",{href:"https://npap.kbn.one",target:"_blank"},"NPAP Top"),e.createElement("span",null,"Version ",r)))}s(pe,"Npap");function ye({urlString:r}){let t=Object.fromEntries(new URLSearchParams(r));if(t.send_to){let{send_to:n,...o}=t;return e.createElement(k,{sendTo:n,pub:o})}if(t.receive_by){let{receive_by:n,...o}=t;return e.createElement(x,{receiveBy:n,secrets:o})}return e.createElement(g,null)}s(ye,"Pages");U.render(e.createElement(pe,null),document.getElementById("app"));