function missingFeature() {
    if (typeof Deno != 'undefined') return null;
    if (typeof crypto == "undefined") return "crypto";
    const { subtle  } = crypto;
    if (!subtle) return "crypto.subtle";
    if (!subtle.generateKey) return "crypto.subtle.generateKey";
    if (!subtle.encrypt) return "crypto.subtle.encrypt";
    if (!subtle.decrypt) return "crypto.subtle.decrypt";
    if (!subtle.wrapKey) return "crypto.subtle.wrapKey";
    if (!subtle.unwrapKey) return "crypto.subtle.unwrapKey";
    if (!subtle.importKey) return "crypto.subtle.importKey";
    if (!subtle.exportKey) return "crypto.subtle.exportKey";
    if (!crypto.getRandomValues) return "crypto.getRandomValues";
    return null;
}
const subtle = window.crypto?.subtle;
const RSAalgorithm = {
    name: "RSA-OAEP",
    hash: {
        name: "SHA-256"
    }
};
async function generateJwkPair() {
    const keyPair = await subtle.generateKey({
        modulusLength: 4096,
        publicExponent: new Uint8Array([
            1,
            0,
            1
        ]),
        ...RSAalgorithm
    }, true, [
        "wrapKey",
        "unwrapKey"
    ]);
    const publicKey = await subtle.exportKey("jwk", keyPair.publicKey);
    const privateKey = await subtle.exportKey("jwk", keyPair.privateKey);
    return {
        publicKey,
        privateKey
    };
}
async function encryptByPublicJwk(jwk, plain) {
    const wrapperKey = await subtle.importKey("jwk", jwk, RSAalgorithm, false, [
        "wrapKey"
    ]);
    const aeskey = await subtle.generateKey({
        name: "AES-CBC",
        length: 256
    }, true, [
        "encrypt",
        "decrypt"
    ]);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encrypted = await aesEncrypt(aeskey, iv, plain);
    const key = await subtle.wrapKey("raw", aeskey, wrapperKey, "RSA-OAEP");
    return {
        key: new Uint8Array(key),
        iv,
        encrypted
    };
}
class UnwrapKeyError extends Error {
}
async function decryptByPrivateJwk(privKey, data) {
    const unwrapperKey = await subtle.importKey("jwk", privKey, RSAalgorithm, false, [
        "unwrapKey"
    ]);
    const { key , iv , encrypted  } = data;
    const aeskey = await subtle.unwrapKey("raw", key, unwrapperKey, "RSA-OAEP", "AES-CBC", false, [
        "decrypt"
    ]).catch((e)=>{
        throw new UnwrapKeyError();
    });
    return aesDecrypt(aeskey, iv, encrypted);
}
async function thumbprint(jwk) {
    const { e , kty , n  } = jwk;
    const json = JSON.stringify({
        e,
        kty,
        n
    });
    const ab = new TextEncoder().encode(json).buffer;
    const hash = await subtle.digest("SHA-256", ab);
    const hexArray = [
        ...new Uint8Array(hash)
    ].map((x)=>("0" + x.toString(16)).slice(-2)
    );
    return hexArray;
}
async function aesEncrypt(key, iv, plain) {
    return subtle.encrypt({
        name: "AES-CBC",
        iv
    }, key, plain);
}
async function aesDecrypt(key, iv, encrypted) {
    return await subtle.decrypt({
        name: "AES-CBC",
        iv
    }, key, encrypted);
}
const jwkBase = {
    alg: "RSA-OAEP-256",
    e: "AQAB",
    ext: false,
    kty: "RSA"
};
const KeyEssence = [
    "d",
    "dp",
    "dq",
    "n",
    "p",
    "q",
    "qi"
];
function minifyJwk(jwk) {
    return Object.entries(jwk).filter(([k])=>KeyEssence.includes(k)
    );
}
function fullifyToJwk(obj, ops) {
    return {
        key_ops: [
            ops
        ],
        ...jwkBase,
        ...obj
    };
}
var b = Object.create;
var s = Object.defineProperty;
var p = Object.getOwnPropertyDescriptor;
var O = Object.getOwnPropertyNames;
var j = Object.getPrototypeOf, g = Object.prototype.hasOwnProperty;
var m = (r)=>s(r, "__esModule", {
        value: !0
    })
;
var v = (r, e)=>()=>(e || r((e = {
            exports: {
            }
        }).exports, e), e.exports)
;
var y = (r, e, t)=>{
    if (e && typeof e == "object" || typeof e == "function") for (let n of O(e))!g.call(r, n) && n !== "default" && s(r, n, {
        get: ()=>e[n]
        ,
        enumerable: !(t = p(e, n)) || t.enumerable
    });
    return r;
}, h = (r)=>y(m(s(r != null ? b(j(r)) : {
    }, "default", r && r.__esModule && "default" in r ? {
        get: ()=>r.default
        ,
        enumerable: !0
    } : {
        value: r,
        enumerable: !0
    })), r)
;
var l = v((q, i)=>{
    "use strict";
    var u = Object.getOwnPropertySymbols, d = Object.prototype.hasOwnProperty, w = Object.prototype.propertyIsEnumerable;
    function P(r) {
        if (r == null) throw new TypeError("Object.assign cannot be called with null or undefined");
        return Object(r);
    }
    function E() {
        try {
            if (!Object.assign) return !1;
            var r = new String("abc");
            if (r[5] = "de", Object.getOwnPropertyNames(r)[0] === "5") return !1;
            for(var e = {
            }, t = 0; t < 10; t++)e["_" + String.fromCharCode(t)] = t;
            var n = Object.getOwnPropertyNames(e).map(function(o) {
                return e[o];
            });
            if (n.join("") !== "0123456789") return !1;
            var a = {
            };
            return "abcdefghijklmnopqrst".split("").forEach(function(o) {
                a[o] = o;
            }), Object.keys(Object.assign({
            }, a)).join("") === "abcdefghijklmnopqrst";
        } catch (o) {
            return !1;
        }
    }
    i.exports = E() ? Object.assign : function(r, e) {
        for(var t, n = P(r), a, o = 1; o < arguments.length; o++){
            t = Object(arguments[o]);
            for(var f in t)d.call(t, f) && (n[f] = t[f]);
            if (u) {
                a = u(t);
                for(var c = 0; c < a.length; c++)w.call(t, a[c]) && (n[a[c]] = t[a[c]]);
            }
        }
        return n;
    };
});
var S = h(l());
var export_default = S.default;
var W = Object.create;
var h1 = Object.defineProperty;
var Y = Object.getOwnPropertyDescriptor;
var G = Object.getOwnPropertyNames;
var J = Object.getPrototypeOf, K = Object.prototype.hasOwnProperty;
var Q = (e)=>h1(e, "__esModule", {
        value: !0
    })
;
var j1 = (e, t)=>()=>(t || e((t = {
            exports: {
            }
        }).exports, t), t.exports)
;
var Z = (e, t, r)=>{
    if (t && typeof t == "object" || typeof t == "function") for (let o of G(t))!K.call(e, o) && o !== "default" && h1(e, o, {
        get: ()=>t[o]
        ,
        enumerable: !(r = Y(t, o)) || r.enumerable
    });
    return e;
}, O1 = (e)=>Z(Q(h1(e != null ? W(J(e)) : {
    }, "default", e && e.__esModule && "default" in e ? {
        get: ()=>e.default
        ,
        enumerable: !0
    } : {
        value: e,
        enumerable: !0
    })), e)
;
var z = j1((n)=>{
    "use strict";
    var E = export_default, y = 60103, P = 60106;
    n.Fragment = 60107;
    n.StrictMode = 60108;
    n.Profiler = 60114;
    var x = 60109, I = 60110, w = 60112;
    n.Suspense = 60113;
    var A = 60115, F = 60116;
    typeof Symbol == "function" && Symbol.for && (l = Symbol.for, y = l("react.element"), P = l("react.portal"), n.Fragment = l("react.fragment"), n.StrictMode = l("react.strict_mode"), n.Profiler = l("react.profiler"), x = l("react.provider"), I = l("react.context"), w = l("react.forward_ref"), n.Suspense = l("react.suspense"), A = l("react.memo"), F = l("react.lazy"));
    var l, L = typeof Symbol == "function" && Symbol.iterator;
    function b(e) {
        return e === null || typeof e != "object" ? null : (e = L && e[L] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    function _(e) {
        for(var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++)t += "&args[]=" + encodeURIComponent(arguments[r]);
        return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    var q = {
        isMounted: function() {
            return !1;
        },
        enqueueForceUpdate: function() {
        },
        enqueueReplaceState: function() {
        },
        enqueueSetState: function() {
        }
    }, D = {
    };
    function d(e, t, r) {
        this.props = e, this.context = t, this.refs = D, this.updater = r || q;
    }
    d.prototype.isReactComponent = {
    };
    d.prototype.setState = function(e, t) {
        if (typeof e != "object" && typeof e != "function" && e != null) throw Error(_(85));
        this.updater.enqueueSetState(this, e, t, "setState");
    };
    d.prototype.forceUpdate = function(e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
    };
    function M() {
    }
    M.prototype = d.prototype;
    function S(e, t, r) {
        this.props = e, this.context = t, this.refs = D, this.updater = r || q;
    }
    var C = S.prototype = new M;
    C.constructor = S;
    E(C, d.prototype);
    C.isPureReactComponent = !0;
    var R = {
        current: null
    }, N = Object.prototype.hasOwnProperty, U = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };
    function T(e, t, r) {
        var o, u = {
        }, c = null, f = null;
        if (t != null) for(o in t.ref !== void 0 && (f = t.ref), t.key !== void 0 && (c = "" + t.key), t)N.call(t, o) && !U.hasOwnProperty(o) && (u[o] = t[o]);
        var s = arguments.length - 2;
        if (s === 1) u.children = r;
        else if (1 < s) {
            for(var i = Array(s), p = 0; p < s; p++)i[p] = arguments[p + 2];
            u.children = i;
        }
        if (e && e.defaultProps) for(o in s = e.defaultProps, s)u[o] === void 0 && (u[o] = s[o]);
        return {
            $$typeof: y,
            type: e,
            key: c,
            ref: f,
            props: u,
            _owner: R.current
        };
    }
    function ee(e, t) {
        return {
            $$typeof: y,
            type: e.type,
            key: t,
            ref: e.ref,
            props: e.props,
            _owner: e._owner
        };
    }
    function k(e) {
        return typeof e == "object" && e !== null && e.$$typeof === y;
    }
    function te(e) {
        var t = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + e.replace(/[=:]/g, function(r) {
            return t[r];
        });
    }
    var V = /\/+/g;
    function $(e, t) {
        return typeof e == "object" && e !== null && e.key != null ? te("" + e.key) : t.toString(36);
    }
    function v(e, t, r, o, u) {
        var c = typeof e;
        (c === "undefined" || c === "boolean") && (e = null);
        var f = !1;
        if (e === null) f = !0;
        else switch(c){
            case "string":
            case "number":
                f = !0;
                break;
            case "object":
                switch(e.$$typeof){
                    case y:
                    case P:
                        f = !0;
                }
        }
        if (f) return f = e, u = u(f), e = o === "" ? "." + $(f, 0) : o, Array.isArray(u) ? (r = "", e != null && (r = e.replace(V, "$&/") + "/"), v(u, t, r, "", function(p) {
            return p;
        })) : u != null && (k(u) && (u = ee(u, r + (!u.key || f && f.key === u.key ? "" : ("" + u.key).replace(V, "$&/") + "/") + e)), t.push(u)), 1;
        if (f = 0, o = o === "" ? "." : o + ":", Array.isArray(e)) for(var s = 0; s < e.length; s++){
            c = e[s];
            var i = o + $(c, s);
            f += v(c, t, r, i, u);
        }
        else if (i = b(e), typeof i == "function") for(e = i.call(e), s = 0; !(c = e.next()).done;)c = c.value, i = o + $(c, s++), f += v(c, t, r, i, u);
        else if (c === "object") throw t = "" + e, Error(_(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t));
        return f;
    }
    function m(e, t, r) {
        if (e == null) return e;
        var o = [], u = 0;
        return v(e, o, "", "", function(c) {
            return t.call(r, c, u++);
        }), o;
    }
    function re(e) {
        if (e._status === -1) {
            var t = e._result;
            t = t(), e._status = 0, e._result = t, t.then(function(r) {
                e._status === 0 && (r = r.default, e._status = 1, e._result = r);
            }, function(r) {
                e._status === 0 && (e._status = 2, e._result = r);
            });
        }
        if (e._status === 1) return e._result;
        throw e._result;
    }
    var B = {
        current: null
    };
    function a() {
        var e = B.current;
        if (e === null) throw Error(_(321));
        return e;
    }
    var ne = {
        ReactCurrentDispatcher: B,
        ReactCurrentBatchConfig: {
            transition: 0
        },
        ReactCurrentOwner: R,
        IsSomeRendererActing: {
            current: !1
        },
        assign: E
    };
    n.Children = {
        map: m,
        forEach: function(e, t, r) {
            m(e, function() {
                t.apply(this, arguments);
            }, r);
        },
        count: function(e) {
            var t = 0;
            return m(e, function() {
                t++;
            }), t;
        },
        toArray: function(e) {
            return m(e, function(t) {
                return t;
            }) || [];
        },
        only: function(e) {
            if (!k(e)) throw Error(_(143));
            return e;
        }
    };
    n.Component = d;
    n.PureComponent = S;
    n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ne;
    n.cloneElement = function(e, t, r) {
        if (e == null) throw Error(_(267, e));
        var o = E({
        }, e.props), u = e.key, c = e.ref, f = e._owner;
        if (t != null) {
            if (t.ref !== void 0 && (c = t.ref, f = R.current), t.key !== void 0 && (u = "" + t.key), e.type && e.type.defaultProps) var s = e.type.defaultProps;
            for(i in t)N.call(t, i) && !U.hasOwnProperty(i) && (o[i] = t[i] === void 0 && s !== void 0 ? s[i] : t[i]);
        }
        var i = arguments.length - 2;
        if (i === 1) o.children = r;
        else if (1 < i) {
            s = Array(i);
            for(var p = 0; p < i; p++)s[p] = arguments[p + 2];
            o.children = s;
        }
        return {
            $$typeof: y,
            type: e.type,
            key: u,
            ref: c,
            props: o,
            _owner: f
        };
    };
    n.createContext = function(e, t) {
        return t === void 0 && (t = null), e = {
            $$typeof: I,
            _calculateChangedBits: t,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null
        }, e.Provider = {
            $$typeof: x,
            _context: e
        }, e.Consumer = e;
    };
    n.createElement = T;
    n.createFactory = function(e) {
        var t = T.bind(null, e);
        return t.type = e, t;
    };
    n.createRef = function() {
        return {
            current: null
        };
    };
    n.forwardRef = function(e) {
        return {
            $$typeof: w,
            render: e
        };
    };
    n.isValidElement = k;
    n.lazy = function(e) {
        return {
            $$typeof: F,
            _payload: {
                _status: -1,
                _result: e
            },
            _init: re
        };
    };
    n.memo = function(e, t) {
        return {
            $$typeof: A,
            type: e,
            compare: t === void 0 ? null : t
        };
    };
    n.useCallback = function(e, t) {
        return a().useCallback(e, t);
    };
    n.useContext = function(e, t) {
        return a().useContext(e, t);
    };
    n.useDebugValue = function() {
    };
    n.useEffect = function(e, t) {
        return a().useEffect(e, t);
    };
    n.useImperativeHandle = function(e, t, r) {
        return a().useImperativeHandle(e, t, r);
    };
    n.useLayoutEffect = function(e, t) {
        return a().useLayoutEffect(e, t);
    };
    n.useMemo = function(e, t) {
        return a().useMemo(e, t);
    };
    n.useReducer = function(e, t, r) {
        return a().useReducer(e, t, r);
    };
    n.useRef = function(e) {
        return a().useRef(e);
    };
    n.useState = function(e) {
        return a().useState(e);
    };
    n.version = "17.0.2";
});
var g1 = j1((se, H)=>{
    "use strict";
    H.exports = z();
});
var oe = O1(g1()), ue = O1(g1()), { Fragment: fe , StrictMode: le , Profiler: pe , Suspense: ae , Children: ye , Component: de , PureComponent: _e , __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ve , cloneElement: me , createContext: he , createElement: Ee , createFactory: Se , createRef: Ce , forwardRef: Re , isValidElement: ke , lazy: $e , memo: ge , useCallback: je , useContext: Oe , useDebugValue: Pe , useEffect: xe , useImperativeHandle: Ie , useLayoutEffect: we , useMemo: Ae , useReducer: Fe , useRef: Le , useState: qe , version: De  } = oe;
var export_default1 = ue.default;
function Instruction() {
    const inputRef = Le(null);
    const generate = ()=>{
        const name = inputRef.current.value;
        if (name.length == 0) return;
        generateJwkPair().then((keyPair)=>{
            const obj = {
                receive_by: name,
                ...minifyJwk(keyPair.privateKey)
            };
            const urlParam = new URLSearchParams(obj);
            location.hash = urlParam.toString();
        });
    };
    return export_default1.createElement("main", {
        id: "instruction"
    }, export_default1.createElement("head", null, export_default1.createElement("title", null, "NPAP 鍵生成ページ")), export_default1.createElement("h1", null, "鍵生成ページ"), export_default1.createElement("p", null, "受信者のお名前", export_default1.createElement("br", null), export_default1.createElement("input", {
        type: "text",
        ref: inputRef,
        required: true
    }), export_default1.createElement("br", null), export_default1.createElement("button", {
        onClick: generate
    }, "「秘密鍵ページ」を作成")), export_default1.createElement("h2", null, "使い方"), export_default1.createElement("p", null, "ファイルの受信者は、あらかじめ自分専用の「秘密鍵ページ」を作成し、お手元にブックマークを保存していつでも開けるようにしておきます。"), export_default1.createElement("p", null, "「秘密鍵ページ」から「暗号化ページ」のURLが取得できるので、それをメールで相手に送ります。"), export_default1.createElement("p", null, "ファイルの送信者は、「暗号化ページ」を開き、送りたいファイルを指定します。ファイルはどこへも送信されることなく、ブラウザ内で暗号化され、ダウンロードできます。"), export_default1.createElement("p", null, "ファイルの送信者は、暗号化されたファイルをメールに添付して送ります。"), export_default1.createElement("p", null, "ファイルの受信者は、暗号化されたファイルを受け取ったら「秘密鍵ページ」から元のファイルへ復号できます。"), export_default1.createElement("h2", null, "なぜ安全なの？"), export_default1.createElement("p", null, "公開鍵方式という暗号を使っています。「暗号化ページ」で暗号化されたファイルは、「秘密鍵ページ」のブックマークを知っている人のみが復号できます。"), export_default1.createElement("p", null, "「秘密鍵ページ」は受信者の手元にあればよく、送信者には必要ありません。つまり、復号に必要な情報は一切ネットに流出しません。"), export_default1.createElement("p", null, "NPAP の秘密鍵はURLの「#」以降のハッシュ文字列と呼ばれる部分に格納してあります。 ブラウザはこの情報をどこにも送りませんので、NPAP のサーバーにさえ秘密鍵は送信されません。"), export_default1.createElement("h2", null, "鍵指紋とは"), export_default1.createElement("p", null, "「秘密鍵ページ」から取得できる「暗号化ページ」には、同じ鍵指紋が表示されます。 両者の鍵指紋を検証することで、対応しているペアかどうかを確認できます。"));
}
var process = window.process = {
};
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimeout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function() {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimeout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimeout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e1) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }
    if ((cachedSetTimeout === defaultSetTimeout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}
function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while(++queueIndex < len){
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for(var i = 1; i < arguments.length; i++){
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {
};
process.argv = [];
process.version = '';
process.versions = {
};
function noop() {
}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(name) {
    return [];
};
process.binding = function(name) {
    throw new Error('process.binding is not supported');
};
process.cwd = function() {
    return '/';
};
process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() {
    return 0;
};
process.env.NODE_ENV = "production";
var v1 = 4294967295;
function P(i, e, t) {
    var r = t / 4294967296, s1 = t;
    i.setUint32(e, r), i.setUint32(e + 4, s1);
}
function I(i, e, t) {
    var r = Math.floor(t / 4294967296), s1 = t;
    i.setUint32(e, r), i.setUint32(e + 4, s1);
}
function _(i, e) {
    var t = i.getInt32(e), r = i.getUint32(e + 4);
    return t * 4294967296 + r;
}
function V(i, e) {
    var t = i.getUint32(e), r = i.getUint32(e + 4);
    return t * 4294967296 + r;
}
var M = (typeof process == "undefined" || process.env.TEXT_ENCODING !== "never") && typeof TextEncoder != "undefined" && typeof TextDecoder != "undefined";
function k(i) {
    for(var e = i.length, t = 0, r = 0; r < e;){
        var s = i.charCodeAt(r++);
        if ((s & 4294967168) == 0) {
            t++;
            continue;
        } else if ((s & 4294965248) == 0) t += 2;
        else {
            if (s >= 55296 && s <= 56319 && r < e) {
                var n = i.charCodeAt(r);
                (n & 64512) == 56320 && (++r, s = ((s & 1023) << 10) + (n & 1023) + 65536);
            }
            (s & 4294901760) == 0 ? t += 3 : t += 4;
        }
    }
    return t;
}
function N(i, e, t) {
    for(var r = i.length, s = t, n = 0; n < r;){
        var o = i.charCodeAt(n++);
        if ((o & 4294967168) == 0) {
            e[s++] = o;
            continue;
        } else if ((o & 4294965248) == 0) e[s++] = o >> 6 & 31 | 192;
        else {
            if (o >= 55296 && o <= 56319 && n < r) {
                var f = i.charCodeAt(n);
                (f & 64512) == 56320 && (++n, o = ((o & 1023) << 10) + (f & 1023) + 65536);
            }
            (o & 4294901760) == 0 ? (e[s++] = o >> 12 & 15 | 224, e[s++] = o >> 6 & 63 | 128) : (e[s++] = o >> 18 & 7 | 240, e[s++] = o >> 12 & 63 | 128, e[s++] = o >> 6 & 63 | 128);
        }
        e[s++] = o & 63 | 128;
    }
}
var S1 = M ? new TextEncoder : void 0, H = M ? typeof process != "undefined" && process.env.TEXT_ENCODING !== "force" ? 200 : 0 : v1;
function ie(i, e, t) {
    e.set(S1.encode(i), t);
}
function ne(i, e, t) {
    S1.encodeInto(i, e.subarray(t));
}
var X = (S1 == null ? void 0 : S1.encodeInto) ? ne : ie, se = 4096;
function C(i, e, t) {
    for(var r = e, s1 = r + t, n = [], o = ""; r < s1;){
        var f = i[r++];
        if ((f & 128) == 0) n.push(f);
        else if ((f & 224) == 192) {
            var c = i[r++] & 63;
            n.push((f & 31) << 6 | c);
        } else if ((f & 240) == 224) {
            var c = i[r++] & 63, a = i[r++] & 63;
            n.push((f & 31) << 12 | c << 6 | a);
        } else if ((f & 248) == 240) {
            var c = i[r++] & 63, a = i[r++] & 63, h = i[r++] & 63, d = (f & 7) << 18 | c << 12 | a << 6 | h;
            d > 65535 && (d -= 65536, n.push(d >>> 10 & 1023 | 55296), d = 56320 | d & 1023), n.push(d);
        } else n.push(f);
        n.length >= se && (o += String.fromCharCode.apply(String, n), n.length = 0);
    }
    return n.length > 0 && (o += String.fromCharCode.apply(String, n)), o;
}
var oe1 = M ? new TextDecoder : null, W1 = M ? typeof process != "undefined" && process.env.TEXT_DECODER !== "force" ? 200 : 0 : v1;
function b1(i, e, t) {
    var r = i.subarray(e, e + t);
    return oe1.decode(r);
}
var E = function() {
    function i(e, t) {
        this.type = e, this.data = t;
    }
    return i;
}();
var ae1 = function() {
    var i = function(e, t) {
        return i = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(r, s) {
            r.__proto__ = s;
        } || function(r, s) {
            for(var n in s)Object.prototype.hasOwnProperty.call(s, n) && (r[n] = s[n]);
        }, i(e, t);
    };
    return function(e, t) {
        if (typeof t != "function" && t !== null) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
        i(e, t);
        function r() {
            this.constructor = e;
        }
        e.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r);
    };
}(), x = function(i) {
    ae1(e, i);
    function e(t) {
        var r = i.call(this, t) || this, s = Object.create(e.prototype);
        return Object.setPrototypeOf(r, s), Object.defineProperty(r, "name", {
            configurable: !0,
            enumerable: !1,
            value: e.name
        }), r;
    }
    return e;
}(Error);
var K1 = -1, fe1 = 4294967296 - 1, ce = 17179869184 - 1;
function G1(i) {
    var e = i.sec, t = i.nsec;
    if (e >= 0 && t >= 0 && e <= ce) if (t === 0 && e <= fe1) {
        var r = new Uint8Array(4), s = new DataView(r.buffer);
        return s.setUint32(0, e), r;
    } else {
        var n = e / 4294967296, o = e & 4294967295, r = new Uint8Array(8), s = new DataView(r.buffer);
        return s.setUint32(0, t << 2 | n & 3), s.setUint32(4, o), r;
    }
    else {
        var r = new Uint8Array(12), s = new DataView(r.buffer);
        return s.setUint32(0, t), I(s, 4, e), r;
    }
}
function Y1(i) {
    var e = i.getTime(), t = Math.floor(e / 1000), r = (e - t * 1000) * 1000000, s1 = Math.floor(r / 1000000000);
    return {
        sec: t + s1,
        nsec: r - s1 * 1000000000
    };
}
function J1(i) {
    if (i instanceof Date) {
        var e = Y1(i);
        return G1(e);
    } else return null;
}
function q(i) {
    var e = new DataView(i.buffer, i.byteOffset, i.byteLength);
    switch(i.byteLength){
        case 4:
            {
                var t = e.getUint32(0), r = 0;
                return {
                    sec: t,
                    nsec: r
                };
            }
        case 8:
            {
                var s = e.getUint32(0), n = e.getUint32(4), t = (s & 3) * 4294967296 + n, r = s >>> 2;
                return {
                    sec: t,
                    nsec: r
                };
            }
        case 12:
            {
                var t = _(e, 4), r = e.getUint32(0);
                return {
                    sec: t,
                    nsec: r
                };
            }
        default:
            throw new x("Unrecognized data size for timestamp (expected 4, 8, or 12): " + i.length);
    }
}
function Z1(i) {
    var e = q(i);
    return new Date(e.sec * 1000 + e.nsec / 1000000);
}
var Q1 = {
    type: K1,
    encode: J1,
    decode: Z1
};
var A = function() {
    function i() {
        this.builtInEncoders = [], this.builtInDecoders = [], this.encoders = [], this.decoders = [], this.register(Q1);
    }
    return i.prototype.register = function(e) {
        var t = e.type, r = e.encode, s = e.decode;
        if (t >= 0) this.encoders[t] = r, this.decoders[t] = s;
        else {
            var n = 1 + t;
            this.builtInEncoders[n] = r, this.builtInDecoders[n] = s;
        }
    }, i.prototype.tryToEncode = function(e, t) {
        for(var r = 0; r < this.builtInEncoders.length; r++){
            var s = this.builtInEncoders[r];
            if (s != null) {
                var n = s(e, t);
                if (n != null) {
                    var o = -1 - r;
                    return new E(o, n);
                }
            }
        }
        for(var r = 0; r < this.encoders.length; r++){
            var s = this.encoders[r];
            if (s != null) {
                var n = s(e, t);
                if (n != null) {
                    var o = r;
                    return new E(o, n);
                }
            }
        }
        return e instanceof E ? e : null;
    }, i.prototype.decode = function(e, t, r) {
        var s = t < 0 ? this.builtInDecoders[-1 - t] : this.decoders[t];
        return s ? s(e, t, r) : new E(t, e);
    }, i.defaultCodec = new i, i;
}();
function g2(i) {
    return i instanceof Uint8Array ? i : ArrayBuffer.isView(i) ? new Uint8Array(i.buffer, i.byteOffset, i.byteLength) : i instanceof ArrayBuffer ? new Uint8Array(i) : Uint8Array.from(i);
}
function $(i) {
    if (i instanceof ArrayBuffer) return new DataView(i);
    var e = g2(i);
    return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
var he1 = 100, ue1 = 2048, O2 = function() {
    function i(e, t, r, s, n, o, f, c) {
        e === void 0 && (e = A.defaultCodec), t === void 0 && (t = void 0), r === void 0 && (r = he1), s === void 0 && (s = ue1), n === void 0 && (n = !1), o === void 0 && (o = !1), f === void 0 && (f = !1), c === void 0 && (c = !1), this.extensionCodec = e, this.context = t, this.maxDepth = r, this.initialBufferSize = s, this.sortKeys = n, this.forceFloat32 = o, this.ignoreUndefined = f, this.forceIntegerToFloat = c, this.pos = 0, this.view = new DataView(new ArrayBuffer(this.initialBufferSize)), this.bytes = new Uint8Array(this.view.buffer);
    }
    return i.prototype.getUint8Array = function() {
        return this.bytes.subarray(0, this.pos);
    }, i.prototype.reinitializeState = function() {
        this.pos = 0;
    }, i.prototype.encode = function(e) {
        return this.reinitializeState(), this.doEncode(e, 1), this.getUint8Array();
    }, i.prototype.doEncode = function(e, t) {
        if (t > this.maxDepth) throw new Error("Too deep objects in depth " + t);
        e == null ? this.encodeNil() : typeof e == "boolean" ? this.encodeBoolean(e) : typeof e == "number" ? this.encodeNumber(e) : typeof e == "string" ? this.encodeString(e) : this.encodeObject(e, t);
    }, i.prototype.ensureBufferSizeToWrite = function(e) {
        var t = this.pos + e;
        this.view.byteLength < t && this.resizeBuffer(t * 2);
    }, i.prototype.resizeBuffer = function(e) {
        var t = new ArrayBuffer(e), r = new Uint8Array(t), s = new DataView(t);
        r.set(this.bytes), this.view = s, this.bytes = r;
    }, i.prototype.encodeNil = function() {
        this.writeU8(192);
    }, i.prototype.encodeBoolean = function(e) {
        e === !1 ? this.writeU8(194) : this.writeU8(195);
    }, i.prototype.encodeNumber = function(e) {
        Number.isSafeInteger(e) && !this.forceIntegerToFloat ? e >= 0 ? e < 128 ? this.writeU8(e) : e < 256 ? (this.writeU8(204), this.writeU8(e)) : e < 65536 ? (this.writeU8(205), this.writeU16(e)) : e < 4294967296 ? (this.writeU8(206), this.writeU32(e)) : (this.writeU8(207), this.writeU64(e)) : e >= -32 ? this.writeU8(224 | e + 32) : e >= -128 ? (this.writeU8(208), this.writeI8(e)) : e >= -32768 ? (this.writeU8(209), this.writeI16(e)) : e >= -2147483648 ? (this.writeU8(210), this.writeI32(e)) : (this.writeU8(211), this.writeI64(e)) : this.forceFloat32 ? (this.writeU8(202), this.writeF32(e)) : (this.writeU8(203), this.writeF64(e));
    }, i.prototype.writeStringHeader = function(e) {
        if (e < 32) this.writeU8(160 + e);
        else if (e < 256) this.writeU8(217), this.writeU8(e);
        else if (e < 65536) this.writeU8(218), this.writeU16(e);
        else if (e < 4294967296) this.writeU8(219), this.writeU32(e);
        else throw new Error("Too long string: " + e + " bytes in UTF-8");
    }, i.prototype.encodeString = function(e) {
        var t = 1 + 4, r = e.length;
        if (r > H) {
            var s = k(e);
            this.ensureBufferSizeToWrite(t + s), this.writeStringHeader(s), X(e, this.bytes, this.pos), this.pos += s;
        } else {
            var s = k(e);
            this.ensureBufferSizeToWrite(t + s), this.writeStringHeader(s), N(e, this.bytes, this.pos), this.pos += s;
        }
    }, i.prototype.encodeObject = function(e, t) {
        var r = this.extensionCodec.tryToEncode(e, this.context);
        if (r != null) this.encodeExtension(r);
        else if (Array.isArray(e)) this.encodeArray(e, t);
        else if (ArrayBuffer.isView(e)) this.encodeBinary(e);
        else if (typeof e == "object") this.encodeMap(e, t);
        else throw new Error("Unrecognized object: " + Object.prototype.toString.apply(e));
    }, i.prototype.encodeBinary = function(e) {
        var t = e.byteLength;
        if (t < 256) this.writeU8(196), this.writeU8(t);
        else if (t < 65536) this.writeU8(197), this.writeU16(t);
        else if (t < 4294967296) this.writeU8(198), this.writeU32(t);
        else throw new Error("Too large binary: " + t);
        var r = g2(e);
        this.writeU8a(r);
    }, i.prototype.encodeArray = function(e, t) {
        var r = e.length;
        if (r < 16) this.writeU8(144 + r);
        else if (r < 65536) this.writeU8(220), this.writeU16(r);
        else if (r < 4294967296) this.writeU8(221), this.writeU32(r);
        else throw new Error("Too large array: " + r);
        for(var s = 0, n = e; s < n.length; s++){
            var o = n[s];
            this.doEncode(o, t + 1);
        }
    }, i.prototype.countWithoutUndefined = function(e, t) {
        for(var r = 0, s = 0, n = t; s < n.length; s++){
            var o = n[s];
            e[o] !== void 0 && r++;
        }
        return r;
    }, i.prototype.encodeMap = function(e, t) {
        var r = Object.keys(e);
        this.sortKeys && r.sort();
        var s = this.ignoreUndefined ? this.countWithoutUndefined(e, r) : r.length;
        if (s < 16) this.writeU8(128 + s);
        else if (s < 65536) this.writeU8(222), this.writeU16(s);
        else if (s < 4294967296) this.writeU8(223), this.writeU32(s);
        else throw new Error("Too large map object: " + s);
        for(var n = 0, o = r; n < o.length; n++){
            var f = o[n], c = e[f];
            this.ignoreUndefined && c === void 0 || (this.encodeString(f), this.doEncode(c, t + 1));
        }
    }, i.prototype.encodeExtension = function(e) {
        var t = e.data.length;
        if (t === 1) this.writeU8(212);
        else if (t === 2) this.writeU8(213);
        else if (t === 4) this.writeU8(214);
        else if (t === 8) this.writeU8(215);
        else if (t === 16) this.writeU8(216);
        else if (t < 256) this.writeU8(199), this.writeU8(t);
        else if (t < 65536) this.writeU8(200), this.writeU16(t);
        else if (t < 4294967296) this.writeU8(201), this.writeU32(t);
        else throw new Error("Too large extension object: " + t);
        this.writeI8(e.type), this.writeU8a(e.data);
    }, i.prototype.writeU8 = function(e) {
        this.ensureBufferSizeToWrite(1), this.view.setUint8(this.pos, e), this.pos++;
    }, i.prototype.writeU8a = function(e) {
        var t = e.length;
        this.ensureBufferSizeToWrite(t), this.bytes.set(e, this.pos), this.pos += t;
    }, i.prototype.writeI8 = function(e) {
        this.ensureBufferSizeToWrite(1), this.view.setInt8(this.pos, e), this.pos++;
    }, i.prototype.writeU16 = function(e) {
        this.ensureBufferSizeToWrite(2), this.view.setUint16(this.pos, e), this.pos += 2;
    }, i.prototype.writeI16 = function(e) {
        this.ensureBufferSizeToWrite(2), this.view.setInt16(this.pos, e), this.pos += 2;
    }, i.prototype.writeU32 = function(e) {
        this.ensureBufferSizeToWrite(4), this.view.setUint32(this.pos, e), this.pos += 4;
    }, i.prototype.writeI32 = function(e) {
        this.ensureBufferSizeToWrite(4), this.view.setInt32(this.pos, e), this.pos += 4;
    }, i.prototype.writeF32 = function(e) {
        this.ensureBufferSizeToWrite(4), this.view.setFloat32(this.pos, e), this.pos += 4;
    }, i.prototype.writeF64 = function(e) {
        this.ensureBufferSizeToWrite(8), this.view.setFloat64(this.pos, e), this.pos += 8;
    }, i.prototype.writeU64 = function(e) {
        this.ensureBufferSizeToWrite(8), P(this.view, this.pos, e), this.pos += 8;
    }, i.prototype.writeI64 = function(e) {
        this.ensureBufferSizeToWrite(8), I(this.view, this.pos, e), this.pos += 8;
    }, i;
}();
var le1 = {
};
function de1(i, e) {
    e === void 0 && (e = le1);
    var t = new O2(e.extensionCodec, e.context, e.maxDepth, e.initialBufferSize, e.sortKeys, e.forceFloat32, e.ignoreUndefined, e.forceIntegerToFloat);
    return t.encode(i);
}
function z1(i) {
    return (i < 0 ? "-" : "") + "0x" + Math.abs(i).toString(16).padStart(2, "0");
}
var pe1 = 16, xe1 = 16, j2 = function() {
    function i(e, t) {
        e === void 0 && (e = pe1), t === void 0 && (t = xe1), this.maxKeyLength = e, this.maxLengthPerKey = t, this.hit = 0, this.miss = 0, this.caches = [];
        for(var r = 0; r < this.maxKeyLength; r++)this.caches.push([]);
    }
    return i.prototype.canBeCached = function(e) {
        return e > 0 && e <= this.maxKeyLength;
    }, i.prototype.find = function(e, t, r) {
        var s = this.caches[r - 1];
        e: for(var n = 0, o = s; n < o.length; n++){
            for(var f = o[n], c = f.bytes, a = 0; a < r; a++)if (c[a] !== e[t + a]) continue e;
            return f.str;
        }
        return null;
    }, i.prototype.store = function(e, t) {
        var r = this.caches[e.length - 1], s = {
            bytes: e,
            str: t
        };
        r.length >= this.maxLengthPerKey ? r[Math.random() * r.length | 0] = s : r.push(s);
    }, i.prototype.decode = function(e, t, r) {
        var s = this.find(e, t, r);
        if (s != null) return this.hit++, s;
        this.miss++;
        var n = C(e, t, r), o = Uint8Array.prototype.slice.call(e, t, t + r);
        return this.store(o, n), n;
    }, i;
}();
var ve1 = function(i, e, t, r) {
    function s(n) {
        return n instanceof t ? n : new t(function(o) {
            o(n);
        });
    }
    return new (t || (t = Promise))(function(n, o) {
        function f(h) {
            try {
                a(r.next(h));
            } catch (d) {
                o(d);
            }
        }
        function c(h) {
            try {
                a(r.throw(h));
            } catch (d) {
                o(d);
            }
        }
        function a(h) {
            h.done ? n(h.value) : s(h.value).then(f, c);
        }
        a((r = r.apply(i, e || [])).next());
    });
}, F = function(i, e) {
    var t = {
        label: 0,
        sent: function() {
            if (n[0] & 1) throw n[1];
            return n[1];
        },
        trys: [],
        ops: []
    }, r, s, n, o;
    return o = {
        next: f(0),
        throw: f(1),
        return: f(2)
    }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
        return this;
    }), o;
    function f(a) {
        return function(h) {
            return c([
                a,
                h
            ]);
        };
    }
    function c(a) {
        if (r) throw new TypeError("Generator is already executing.");
        for(; t;)try {
            if (r = 1, s && (n = a[0] & 2 ? s.return : a[0] ? s.throw || ((n = s.return) && n.call(s), 0) : s.next) && !(n = n.call(s, a[1])).done) return n;
            switch(s = 0, n && (a = [
                a[0] & 2,
                n.value
            ]), a[0]){
                case 0:
                case 1:
                    n = a;
                    break;
                case 4:
                    return t.label++, {
                        value: a[1],
                        done: !1
                    };
                case 5:
                    t.label++, s = a[1], a = [
                        0
                    ];
                    continue;
                case 7:
                    a = t.ops.pop(), t.trys.pop();
                    continue;
                default:
                    if (n = t.trys, !(n = n.length > 0 && n[n.length - 1]) && (a[0] === 6 || a[0] === 2)) {
                        t = 0;
                        continue;
                    }
                    if (a[0] === 3 && (!n || a[1] > n[0] && a[1] < n[3])) {
                        t.label = a[1];
                        break;
                    }
                    if (a[0] === 6 && t.label < n[1]) {
                        t.label = n[1], n = a;
                        break;
                    }
                    if (n && t.label < n[2]) {
                        t.label = n[2], t.ops.push(a);
                        break;
                    }
                    n[2] && t.ops.pop(), t.trys.pop();
                    continue;
            }
            a = e.call(i, t);
        } catch (h) {
            a = [
                6,
                h
            ], s = 0;
        } finally{
            r = n = 0;
        }
        if (a[0] & 5) throw a[1];
        return {
            value: a[0] ? a[1] : void 0,
            done: !0
        };
    }
}, ee = function(i) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var e = i[Symbol.asyncIterator], t;
    return e ? e.call(i) : (i = typeof __values == "function" ? __values(i) : i[Symbol.iterator](), t = {
    }, r("next"), r("throw"), r("return"), t[Symbol.asyncIterator] = function() {
        return this;
    }, t);
    function r(n) {
        t[n] = i[n] && function(o) {
            return new Promise(function(f, c) {
                o = i[n](o), s(f, c, o.done, o.value);
            });
        };
    }
    function s(n, o, f, c) {
        Promise.resolve(c).then(function(a) {
            n({
                value: a,
                done: f
            });
        }, o);
    }
}, U = function(i) {
    return this instanceof U ? (this.v = i, this) : new U(i);
}, ye1 = function(i, e, t) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = t.apply(i, e || []), s1, n = [];
    return s1 = {
    }, o("next"), o("throw"), o("return"), s1[Symbol.asyncIterator] = function() {
        return this;
    }, s1;
    function o(u) {
        r[u] && (s1[u] = function(l) {
            return new Promise(function(p, m) {
                n.push([
                    u,
                    l,
                    p,
                    m
                ]) > 1 || f(u, l);
            });
        });
    }
    function f(u, l) {
        try {
            c(r[u](l));
        } catch (p) {
            d(n[0][3], p);
        }
    }
    function c(u) {
        u.value instanceof U ? Promise.resolve(u.value.v).then(a, h) : d(n[0][2], u);
    }
    function a(u) {
        f("next", u);
    }
    function h(u) {
        f("throw", u);
    }
    function d(u, l) {
        u(l), n.shift(), n.length && f(n[0][0], n[0][1]);
    }
}, we1 = function(i) {
    var e = typeof i;
    return e === "string" || e === "number";
}, D = -1, R = new DataView(new ArrayBuffer(0)), me1 = new Uint8Array(R.buffer), L = function() {
    try {
        R.getInt8(0);
    } catch (i) {
        return i.constructor;
    }
    throw new Error("never reached");
}(), te = new L("Insufficient data"), Ee1 = new j2, y1 = function() {
    function i(e, t, r, s, n, o, f, c) {
        e === void 0 && (e = A.defaultCodec), t === void 0 && (t = void 0), r === void 0 && (r = v1), s === void 0 && (s = v1), n === void 0 && (n = v1), o === void 0 && (o = v1), f === void 0 && (f = v1), c === void 0 && (c = Ee1), this.extensionCodec = e, this.context = t, this.maxStrLength = r, this.maxBinLength = s, this.maxArrayLength = n, this.maxMapLength = o, this.maxExtLength = f, this.keyDecoder = c, this.totalPos = 0, this.pos = 0, this.view = R, this.bytes = me1, this.headByte = D, this.stack = [];
    }
    return i.prototype.reinitializeState = function() {
        this.totalPos = 0, this.headByte = D, this.stack.length = 0;
    }, i.prototype.setBuffer = function(e) {
        this.bytes = g2(e), this.view = $(this.bytes), this.pos = 0;
    }, i.prototype.appendBuffer = function(e) {
        if (this.headByte === D && !this.hasRemaining(1)) this.setBuffer(e);
        else {
            var t = this.bytes.subarray(this.pos), r = g2(e), s = new Uint8Array(t.length + r.length);
            s.set(t), s.set(r, t.length), this.setBuffer(s);
        }
    }, i.prototype.hasRemaining = function(e) {
        return this.view.byteLength - this.pos >= e;
    }, i.prototype.createExtraByteError = function(e) {
        var t = this, r = t.view, s = t.pos;
        return new RangeError("Extra " + (r.byteLength - s) + " of " + r.byteLength + " byte(s) found at buffer[" + e + "]");
    }, i.prototype.decode = function(e) {
        this.reinitializeState(), this.setBuffer(e);
        var t = this.doDecodeSync();
        if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
        return t;
    }, i.prototype.decodeMulti = function(e) {
        return F(this, function(t) {
            switch(t.label){
                case 0:
                    this.reinitializeState(), this.setBuffer(e), t.label = 1;
                case 1:
                    return this.hasRemaining(1) ? [
                        4,
                        this.doDecodeSync()
                    ] : [
                        3,
                        3
                    ];
                case 2:
                    return t.sent(), [
                        3,
                        1
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    }, i.prototype.decodeAsync = function(e) {
        var t, r, s, n;
        return ve1(this, void 0, void 0, function() {
            var o, f, c, a, h, d, u, l;
            return F(this, function(p) {
                switch(p.label){
                    case 0:
                        o = !1, p.label = 1;
                    case 1:
                        p.trys.push([
                            1,
                            6,
                            7,
                            12
                        ]), t = ee(e), p.label = 2;
                    case 2:
                        return [
                            4,
                            t.next()
                        ];
                    case 3:
                        if (r = p.sent(), !!r.done) return [
                            3,
                            5
                        ];
                        if (c = r.value, o) throw this.createExtraByteError(this.totalPos);
                        this.appendBuffer(c);
                        try {
                            f = this.doDecodeSync(), o = !0;
                        } catch (m) {
                            if (!(m instanceof L)) throw m;
                        }
                        this.totalPos += this.pos, p.label = 4;
                    case 4:
                        return [
                            3,
                            2
                        ];
                    case 5:
                        return [
                            3,
                            12
                        ];
                    case 6:
                        return a = p.sent(), s = {
                            error: a
                        }, [
                            3,
                            12
                        ];
                    case 7:
                        return p.trys.push([
                            7,
                            ,
                            10,
                            11
                        ]), r && !r.done && (n = t.return) ? [
                            4,
                            n.call(t)
                        ] : [
                            3,
                            9
                        ];
                    case 8:
                        p.sent(), p.label = 9;
                    case 9:
                        return [
                            3,
                            11
                        ];
                    case 10:
                        if (s) throw s.error;
                        return [
                            7
                        ];
                    case 11:
                        return [
                            7
                        ];
                    case 12:
                        if (o) {
                            if (this.hasRemaining(1)) throw this.createExtraByteError(this.totalPos);
                            return [
                                2,
                                f
                            ];
                        }
                        throw h = this, d = h.headByte, u = h.pos, l = h.totalPos, new RangeError("Insufficient data in parsing " + z1(d) + " at " + l + " (" + u + " in the current buffer)");
                }
            });
        });
    }, i.prototype.decodeArrayStream = function(e) {
        return this.decodeMultiAsync(e, !0);
    }, i.prototype.decodeStream = function(e) {
        return this.decodeMultiAsync(e, !1);
    }, i.prototype.decodeMultiAsync = function(e, t) {
        return ye1(this, arguments, function() {
            var s, n, o, f, c, a, h, d, u;
            return F(this, function(l) {
                switch(l.label){
                    case 0:
                        s = t, n = -1, l.label = 1;
                    case 1:
                        l.trys.push([
                            1,
                            13,
                            14,
                            19
                        ]), o = ee(e), l.label = 2;
                    case 2:
                        return [
                            4,
                            U(o.next())
                        ];
                    case 3:
                        if (f = l.sent(), !!f.done) return [
                            3,
                            12
                        ];
                        if (c = f.value, t && n === 0) throw this.createExtraByteError(this.totalPos);
                        this.appendBuffer(c), s && (n = this.readArraySize(), s = !1, this.complete()), l.label = 4;
                    case 4:
                        l.trys.push([
                            4,
                            9,
                            ,
                            10
                        ]), l.label = 5;
                    case 5:
                        return [
                            4,
                            U(this.doDecodeSync())
                        ];
                    case 6:
                        return [
                            4,
                            l.sent()
                        ];
                    case 7:
                        return l.sent(), --n == 0 ? [
                            3,
                            8
                        ] : [
                            3,
                            5
                        ];
                    case 8:
                        return [
                            3,
                            10
                        ];
                    case 9:
                        if (a = l.sent(), !(a instanceof L)) throw a;
                        return [
                            3,
                            10
                        ];
                    case 10:
                        this.totalPos += this.pos, l.label = 11;
                    case 11:
                        return [
                            3,
                            2
                        ];
                    case 12:
                        return [
                            3,
                            19
                        ];
                    case 13:
                        return h = l.sent(), d = {
                            error: h
                        }, [
                            3,
                            19
                        ];
                    case 14:
                        return l.trys.push([
                            14,
                            ,
                            17,
                            18
                        ]), f && !f.done && (u = o.return) ? [
                            4,
                            U(u.call(o))
                        ] : [
                            3,
                            16
                        ];
                    case 15:
                        l.sent(), l.label = 16;
                    case 16:
                        return [
                            3,
                            18
                        ];
                    case 17:
                        if (d) throw d.error;
                        return [
                            7
                        ];
                    case 18:
                        return [
                            7
                        ];
                    case 19:
                        return [
                            2
                        ];
                }
            });
        });
    }, i.prototype.doDecodeSync = function() {
        e: for(;;){
            var e = this.readHeadByte(), t = void 0;
            if (e >= 224) t = e - 256;
            else if (e < 192) if (e < 128) t = e;
            else if (e < 144) {
                var r = e - 128;
                if (r !== 0) {
                    this.pushMapState(r), this.complete();
                    continue e;
                } else t = {
                };
            } else if (e < 160) {
                var r = e - 144;
                if (r !== 0) {
                    this.pushArrayState(r), this.complete();
                    continue e;
                } else t = [];
            } else {
                var s = e - 160;
                t = this.decodeUtf8String(s, 0);
            }
            else if (e === 192) t = null;
            else if (e === 194) t = !1;
            else if (e === 195) t = !0;
            else if (e === 202) t = this.readF32();
            else if (e === 203) t = this.readF64();
            else if (e === 204) t = this.readU8();
            else if (e === 205) t = this.readU16();
            else if (e === 206) t = this.readU32();
            else if (e === 207) t = this.readU64();
            else if (e === 208) t = this.readI8();
            else if (e === 209) t = this.readI16();
            else if (e === 210) t = this.readI32();
            else if (e === 211) t = this.readI64();
            else if (e === 217) {
                var s = this.lookU8();
                t = this.decodeUtf8String(s, 1);
            } else if (e === 218) {
                var s = this.lookU16();
                t = this.decodeUtf8String(s, 2);
            } else if (e === 219) {
                var s = this.lookU32();
                t = this.decodeUtf8String(s, 4);
            } else if (e === 220) {
                var r = this.readU16();
                if (r !== 0) {
                    this.pushArrayState(r), this.complete();
                    continue e;
                } else t = [];
            } else if (e === 221) {
                var r = this.readU32();
                if (r !== 0) {
                    this.pushArrayState(r), this.complete();
                    continue e;
                } else t = [];
            } else if (e === 222) {
                var r = this.readU16();
                if (r !== 0) {
                    this.pushMapState(r), this.complete();
                    continue e;
                } else t = {
                };
            } else if (e === 223) {
                var r = this.readU32();
                if (r !== 0) {
                    this.pushMapState(r), this.complete();
                    continue e;
                } else t = {
                };
            } else if (e === 196) {
                var r = this.lookU8();
                t = this.decodeBinary(r, 1);
            } else if (e === 197) {
                var r = this.lookU16();
                t = this.decodeBinary(r, 2);
            } else if (e === 198) {
                var r = this.lookU32();
                t = this.decodeBinary(r, 4);
            } else if (e === 212) t = this.decodeExtension(1, 0);
            else if (e === 213) t = this.decodeExtension(2, 0);
            else if (e === 214) t = this.decodeExtension(4, 0);
            else if (e === 215) t = this.decodeExtension(8, 0);
            else if (e === 216) t = this.decodeExtension(16, 0);
            else if (e === 199) {
                var r = this.lookU8();
                t = this.decodeExtension(r, 1);
            } else if (e === 200) {
                var r = this.lookU16();
                t = this.decodeExtension(r, 2);
            } else if (e === 201) {
                var r = this.lookU32();
                t = this.decodeExtension(r, 4);
            } else throw new x("Unrecognized type byte: " + z1(e));
            this.complete();
            for(var n = this.stack; n.length > 0;){
                var o = n[n.length - 1];
                if (o.type === 0) if (o.array[o.position] = t, o.position++, o.position === o.size) n.pop(), t = o.array;
                else continue e;
                else if (o.type === 1) {
                    if (!we1(t)) throw new x("The type of key must be string or number but " + typeof t);
                    if (t === "__proto__") throw new x("The key __proto__ is not allowed");
                    o.key = t, o.type = 2;
                    continue e;
                } else if (o.map[o.key] = t, o.readCount++, o.readCount === o.size) n.pop(), t = o.map;
                else {
                    o.key = null, o.type = 1;
                    continue e;
                }
            }
            return t;
        }
    }, i.prototype.readHeadByte = function() {
        return this.headByte === D && (this.headByte = this.readU8()), this.headByte;
    }, i.prototype.complete = function() {
        this.headByte = D;
    }, i.prototype.readArraySize = function() {
        var e = this.readHeadByte();
        switch(e){
            case 220:
                return this.readU16();
            case 221:
                return this.readU32();
            default:
                {
                    if (e < 160) return e - 144;
                    throw new x("Unrecognized array type byte: " + z1(e));
                }
        }
    }, i.prototype.pushMapState = function(e) {
        if (e > this.maxMapLength) throw new x("Max length exceeded: map length (" + e + ") > maxMapLengthLength (" + this.maxMapLength + ")");
        this.stack.push({
            type: 1,
            size: e,
            key: null,
            readCount: 0,
            map: {
            }
        });
    }, i.prototype.pushArrayState = function(e) {
        if (e > this.maxArrayLength) throw new x("Max length exceeded: array length (" + e + ") > maxArrayLength (" + this.maxArrayLength + ")");
        this.stack.push({
            type: 0,
            size: e,
            array: new Array(e),
            position: 0
        });
    }, i.prototype.decodeUtf8String = function(e, t) {
        var r;
        if (e > this.maxStrLength) throw new x("Max length exceeded: UTF-8 byte length (" + e + ") > maxStrLength (" + this.maxStrLength + ")");
        if (this.bytes.byteLength < this.pos + t + e) throw te;
        var s = this.pos + t, n;
        return this.stateIsMapKey() && ((r = this.keyDecoder) === null || r === void 0 ? void 0 : r.canBeCached(e)) ? n = this.keyDecoder.decode(this.bytes, s, e) : e > W1 ? n = b1(this.bytes, s, e) : n = C(this.bytes, s, e), this.pos += t + e, n;
    }, i.prototype.stateIsMapKey = function() {
        if (this.stack.length > 0) {
            var e = this.stack[this.stack.length - 1];
            return e.type === 1;
        }
        return !1;
    }, i.prototype.decodeBinary = function(e, t) {
        if (e > this.maxBinLength) throw new x("Max length exceeded: bin length (" + e + ") > maxBinLength (" + this.maxBinLength + ")");
        if (!this.hasRemaining(e + t)) throw te;
        var r = this.pos + t, s = this.bytes.subarray(r, r + e);
        return this.pos += t + e, s;
    }, i.prototype.decodeExtension = function(e, t) {
        if (e > this.maxExtLength) throw new x("Max length exceeded: ext length (" + e + ") > maxExtLength (" + this.maxExtLength + ")");
        var r = this.view.getInt8(this.pos + t), s = this.decodeBinary(e, t + 1);
        return this.extensionCodec.decode(s, r, this.context);
    }, i.prototype.lookU8 = function() {
        return this.view.getUint8(this.pos);
    }, i.prototype.lookU16 = function() {
        return this.view.getUint16(this.pos);
    }, i.prototype.lookU32 = function() {
        return this.view.getUint32(this.pos);
    }, i.prototype.readU8 = function() {
        var e = this.view.getUint8(this.pos);
        return this.pos++, e;
    }, i.prototype.readI8 = function() {
        var e = this.view.getInt8(this.pos);
        return this.pos++, e;
    }, i.prototype.readU16 = function() {
        var e = this.view.getUint16(this.pos);
        return this.pos += 2, e;
    }, i.prototype.readI16 = function() {
        var e = this.view.getInt16(this.pos);
        return this.pos += 2, e;
    }, i.prototype.readU32 = function() {
        var e = this.view.getUint32(this.pos);
        return this.pos += 4, e;
    }, i.prototype.readI32 = function() {
        var e = this.view.getInt32(this.pos);
        return this.pos += 4, e;
    }, i.prototype.readU64 = function() {
        var e = V(this.view, this.pos);
        return this.pos += 8, e;
    }, i.prototype.readI64 = function() {
        var e = _(this.view, this.pos);
        return this.pos += 8, e;
    }, i.prototype.readF32 = function() {
        var e = this.view.getFloat32(this.pos);
        return this.pos += 4, e;
    }, i.prototype.readF64 = function() {
        var e = this.view.getFloat64(this.pos);
        return this.pos += 8, e;
    }, i;
}();
var w = {
};
function ge1(i, e) {
    e === void 0 && (e = w);
    var t = new y1(e.extensionCodec, e.context, e.maxStrLength, e.maxBinLength, e.maxArrayLength, e.maxMapLength, e.maxExtLength);
    return t.decode(i);
}
var T = function(i) {
    return this instanceof T ? (this.v = i, this) : new T(i);
};
class CryptoPackError extends Error {
}
async function encryptBuffer(jwk, plain) {
    return encryptByPublicJwk(jwk, plain).then(de1).catch((e)=>{
        console.error(e);
        const msg = "不明な復号エラーが発生: " + e.message;
        throw new CryptoPackError(msg, e);
    });
}
async function decryptBuffer(jwk, encoded) {
    const data = ge1(encoded);
    return decryptByPrivateJwk(jwk, data).catch((e)=>{
        let msg;
        if (e instanceof RangeError) {
            msg = "暗号化ファイルではありません";
        }
        if (e instanceof UnwrapKeyError) {
            msg = "鍵が整合しません。暗号化ページと秘密鍵ページが対応しているかご確認ください。";
        } else {
            console.error(e);
            msg = "不明な復号エラーが発生: " + e.message;
        }
        throw new CryptoPackError(msg, e);
    });
}
function Thumbprint({ jwk  }) {
    const [thumbp, setThumbp] = qe('');
    xe(()=>{
        blockedThumbprint(jwk).then(setThumbp);
    });
    return export_default1.createElement(export_default1.Fragment, null, export_default1.createElement("p", null, "鍵指紋:"), export_default1.createElement("div", {
        className: "thumbprint"
    }, thumbp));
}
async function encryptFileAndGetResultNode(jwk, file, filename) {
    const plain = await readAsArrayBuffer(file);
    return encryptBuffer(jwk, plain).then((encoded)=>{
        const a = arrayBufferToDownloadAnchor(encoded, filename);
        return export_default1.createElement("p", null, a);
    }).catch((err)=>{
        let msg = file.name + ': ' + err.message;
        return export_default1.createElement("p", null, msg);
    });
}
async function decryptFileAndGetResultNode(jwk, file) {
    const encoded = await readAsArrayBuffer(file);
    return decryptBuffer(jwk, encoded).then((plain)=>{
        const filename = file.name.split('.').slice(0, -2).join('.');
        const a = arrayBufferToDownloadAnchor(plain, filename);
        return export_default1.createElement("p", null, a);
    }).catch((err)=>{
        let msg = file.name + ': ' + err.message;
        return export_default1.createElement("p", null, msg);
    });
}
async function blockedThumbprint(privKey) {
    const a = await thumbprint(privKey);
    let ret = [];
    for (const slice of eachSlice(a, 8)){
        ret.push(slice.join(':'));
    }
    return ret.join(':' + String.fromCharCode(8203));
}
const eachSlice = function*(array, size) {
    for(let i = 0, l = array.length; i < l; i += size){
        yield array.slice(i, i + size);
    }
};
const readAsArrayBuffer = async (file)=>new Promise((ok, ng)=>{
        const reader = new FileReader();
        reader.onload = ()=>ok(reader.result)
        ;
        reader.onerror = ng;
        reader.readAsArrayBuffer(file);
    })
;
function arrayBufferToObjectUrl(buf) {
    const blob = new Blob([
        buf
    ], {
        type: 'application/octet-stream'
    });
    return URL.createObjectURL(blob);
}
function arrayBufferToDownloadAnchor(buf, filename) {
    const href = arrayBufferToObjectUrl(buf);
    const download = filename;
    return export_default1.createElement("a", {
        href: href,
        download: download
    }, filename);
}
function Send({ sendTo , pub  }) {
    const pubKey = fullifyToJwk(pub, 'wrapKey');
    const [messages, setMessages] = qe([]);
    const fileEnc = je(async (e)=>{
        const file = e.target.files[0];
        if (!file) return;
        const filename = file.name + `.${sendTo}.encrypt`;
        const msgElem = await encryptFileAndGetResultNode(pubKey, file, filename);
        setMessages([
            msgElem,
            ...messages
        ]);
    }, [
        messages
    ]);
    return export_default1.createElement("main", {
        id: "send"
    }, export_default1.createElement("head", null, export_default1.createElement("title", null, sendTo, "宛暗号化ページ:NPAP")), export_default1.createElement("h1", null, "暗号化ページ"), export_default1.createElement("p", null, "秘密鍵所有者: ", sendTo), export_default1.createElement("p", null, "このページから暗号化したファイルは、秘密鍵所有者だけが開けます。"), export_default1.createElement(Thumbprint, {
        jwk: pubKey
    }), export_default1.createElement("h2", null, "ファイルの暗号化"), export_default1.createElement("input", {
        type: "file",
        onChange: fileEnc
    }), messages);
}
function Receive({ receiveBy , secrets  }) {
    const privKey = fullifyToJwk(secrets, 'unwrapKey');
    const [messages, setMessages] = qe([]);
    const sendPath = `${location.origin}${location.pathname}#send_to=${encodeURI(receiveBy)}&n=${privKey.n}`;
    const fileDec = je(async (e)=>{
        const file = e.target.files[0];
        if (!file) return;
        const msgElem = await decryptFileAndGetResultNode(privKey, file);
        setMessages([
            msgElem,
            ...messages
        ]);
    }, [
        messages
    ]);
    return export_default1.createElement("main", {
        id: "receive"
    }, export_default1.createElement("head", null, export_default1.createElement("title", null, receiveBy, "の秘密鍵ページ:NPAP")), export_default1.createElement("h1", null, "秘密鍵ページ"), export_default1.createElement("p", null, "所有者: ", receiveBy), export_default1.createElement(Thumbprint, {
        jwk: privKey
    }), export_default1.createElement("p", null, "このページはあなた専用のものです。", export_default1.createElement("br", null), "再生成は出来ませんので、 URL をブックマーク等に保存しておいてください。", export_default1.createElement("br", null), "URL には秘密鍵が含まれています。大切に保管し、誰かにメール等で送ることはしないでください。"), export_default1.createElement("h2", null, "「暗号化ページ」を送る"), export_default1.createElement("p", null, "以下のURLをメール等で送信者に送付してください。"), export_default1.createElement("input", {
        type: "text",
        value: sendPath,
        readOnly: true,
        style: {
            width: '100%'
        },
        onClick: (e)=>e.target.select()
    }), export_default1.createElement("br", null), export_default1.createElement("a", {
        href: sendPath,
        target: "_blank"
    }, "開いてみる"), export_default1.createElement("h2", null, "ファイルの復号"), export_default1.createElement("p", null, "「暗号化ページ」で暗号化されたファイルを受け取りましたら、以下から復号できます。"), export_default1.createElement("p", null, "処理はネットを介さず、あなたのマシン上で処理されます。"), export_default1.createElement("input", {
        type: "file",
        onChange: fileDec
    }), messages);
}
const missing = missingFeature();
function Npap() {
    if (missing) {
        return export_default1.createElement("p", null, "お使いのブラウザはNPAPに対応しておりません。 セキュリティ確保のためにも最新のブラウザをご利用ください。", export_default1.createElement("br", null), "不足機能: ", missing);
    }
    const [hash, setHash] = qe(location.hash.substr(1));
    window.addEventListener('hashchange', ()=>setHash(location.hash.substr(1))
    , false);
    const version = '1.1';
    return export_default1.createElement("div", {
        id: "npap"
    }, export_default1.createElement(Pages, {
        urlString: hash
    }), export_default1.createElement("footer", null, export_default1.createElement("a", {
        href: "#",
        target: "_blank"
    }, "鍵生成ページ"), export_default1.createElement("a", {
        href: "https://npap.kbn.one",
        target: "_blank"
    }, "NPAP Top"), export_default1.createElement("span", null, "Version ", version)));
}
function Pages({ urlString  }) {
    const params = Object.fromEntries(new URLSearchParams(urlString));
    if (params.send_to) {
        const { send_to , ...pub } = params;
        return export_default1.createElement(Send, {
            sendTo: send_to,
            pub: pub
        });
    }
    if (params.receive_by) {
        const { receive_by , ...secrets } = params;
        return export_default1.createElement(Receive, {
            receiveBy: receive_by,
            secrets: secrets
        });
    }
    return export_default1.createElement(Instruction, null);
}
var D1 = Object.create;
var j3 = Object.defineProperty;
var z2 = Object.getOwnPropertyDescriptor;
var B = Object.getOwnPropertyNames;
var G2 = Object.getPrototypeOf, ee1 = Object.prototype.hasOwnProperty;
var ne1 = (e)=>j3(e, "__esModule", {
        value: !0
    })
;
var H1 = (e, n)=>()=>(n || e((n = {
            exports: {
            }
        }).exports, n), n.exports)
;
var te1 = (e, n, t)=>{
    if (n && typeof n == "object" || typeof n == "function") for (let l of B(n))!ee1.call(e, l) && l !== "default" && j3(e, l, {
        get: ()=>n[l]
        ,
        enumerable: !(t = z2(n, l)) || t.enumerable
    });
    return e;
}, J2 = (e)=>te1(ne1(j3(e != null ? D1(G2(e)) : {
    }, "default", e && e.__esModule && "default" in e ? {
        get: ()=>e.default
        ,
        enumerable: !0
    } : {
        value: e,
        enumerable: !0
    })), e)
;
var $1 = H1((r)=>{
    "use strict";
    var _, v, g, C;
    typeof performance == "object" && typeof performance.now == "function" ? (K = performance, r.unstable_now = function() {
        return K.now();
    }) : (F = Date, Q = F.now(), r.unstable_now = function() {
        return F.now() - Q;
    });
    var K, F, Q;
    typeof window == "undefined" || typeof MessageChannel != "function" ? (y = null, L = null, N = function() {
        if (y !== null) try {
            var e = r.unstable_now();
            y(!0, e), y = null;
        } catch (n) {
            throw setTimeout(N, 0), n;
        }
    }, _ = function(e) {
        y !== null ? setTimeout(_, 0, e) : (y = e, setTimeout(N, 0));
    }, v = function(e, n) {
        L = setTimeout(e, n);
    }, g = function() {
        clearTimeout(L);
    }, r.unstable_shouldYield = function() {
        return !1;
    }, C = r.unstable_forceFrameRate = function() {
    }) : (S = window.setTimeout, X = window.clearTimeout, typeof console != "undefined" && (Z = window.cancelAnimationFrame, typeof window.requestAnimationFrame != "function" && console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), typeof Z != "function" && console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")), h = !1, w = null, P = -1, E = 5, R = 0, r.unstable_shouldYield = function() {
        return r.unstable_now() >= R;
    }, C = function() {
    }, r.unstable_forceFrameRate = function(e) {
        0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : E = 0 < e ? Math.floor(1000 / e) : 5;
    }, q = new MessageChannel, x = q.port2, q.port1.onmessage = function() {
        if (w !== null) {
            var e = r.unstable_now();
            R = e + E;
            try {
                w(!0, e) ? x.postMessage(null) : (h = !1, w = null);
            } catch (n) {
                throw x.postMessage(null), n;
            }
        } else h = !1;
    }, _ = function(e) {
        w = e, h || (h = !0, x.postMessage(null));
    }, v = function(e, n) {
        P = S(function() {
            e(r.unstable_now());
        }, n);
    }, g = function() {
        X(P), P = -1;
    });
    var y, L, N, S, X, Z, h, w, P, E, R, q, x;
    function Y(e, n) {
        var t = e.length;
        e.push(n);
        e: for(;;){
            var l = t - 1 >>> 1, o = e[l];
            if (o !== void 0 && 0 < I(o, n)) e[l] = n, e[t] = o, t = l;
            else break e;
        }
    }
    function a(e) {
        return e = e[0], e === void 0 ? null : e;
    }
    function T(e) {
        var n = e[0];
        if (n !== void 0) {
            var t = e.pop();
            if (t !== n) {
                e[0] = t;
                e: for(var l = 0, o = e.length; l < o;){
                    var f = 2 * (l + 1) - 1, b = e[f], m = f + 1, d = e[m];
                    if (b !== void 0 && 0 > I(b, t)) d !== void 0 && 0 > I(d, b) ? (e[l] = d, e[m] = t, l = m) : (e[l] = b, e[f] = t, l = f);
                    else if (d !== void 0 && 0 > I(d, t)) e[l] = d, e[m] = t, l = m;
                    else break e;
                }
            }
            return n;
        }
        return null;
    }
    function I(e, n) {
        var t = e.sortIndex - n.sortIndex;
        return t !== 0 ? t : e.id - n.id;
    }
    var s = [], c = [], re = 1, u = null, i = 3, M = !1, p = !1, k = !1;
    function U(e) {
        for(var n = a(c); n !== null;){
            if (n.callback === null) T(c);
            else if (n.startTime <= e) T(c), n.sortIndex = n.expirationTime, Y(s, n);
            else break;
            n = a(c);
        }
    }
    function W(e) {
        if (k = !1, U(e), !p) if (a(s) !== null) p = !0, _(O);
        else {
            var n = a(c);
            n !== null && v(W, n.startTime - e);
        }
    }
    function O(e, n) {
        p = !1, k && (k = !1, g()), M = !0;
        var t = i;
        try {
            for(U(n), u = a(s); u !== null && (!(u.expirationTime > n) || e && !r.unstable_shouldYield());){
                var l = u.callback;
                if (typeof l == "function") {
                    u.callback = null, i = u.priorityLevel;
                    var o = l(u.expirationTime <= n);
                    n = r.unstable_now(), typeof o == "function" ? u.callback = o : u === a(s) && T(s), U(n);
                } else T(s);
                u = a(s);
            }
            if (u !== null) var f = !0;
            else {
                var b = a(c);
                b !== null && v(W, b.startTime - n), f = !1;
            }
            return f;
        } finally{
            u = null, i = t, M = !1;
        }
    }
    var le = C;
    r.unstable_IdlePriority = 5;
    r.unstable_ImmediatePriority = 1;
    r.unstable_LowPriority = 4;
    r.unstable_NormalPriority = 3;
    r.unstable_Profiling = null;
    r.unstable_UserBlockingPriority = 2;
    r.unstable_cancelCallback = function(e) {
        e.callback = null;
    };
    r.unstable_continueExecution = function() {
        p || M || (p = !0, _(O));
    };
    r.unstable_getCurrentPriorityLevel = function() {
        return i;
    };
    r.unstable_getFirstCallbackNode = function() {
        return a(s);
    };
    r.unstable_next = function(e) {
        switch(i){
            case 1:
            case 2:
            case 3:
                var n = 3;
                break;
            default:
                n = i;
        }
        var t = i;
        i = n;
        try {
            return e();
        } finally{
            i = t;
        }
    };
    r.unstable_pauseExecution = function() {
    };
    r.unstable_requestPaint = le;
    r.unstable_runWithPriority = function(e, n) {
        switch(e){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            default:
                e = 3;
        }
        var t = i;
        i = e;
        try {
            return n();
        } finally{
            i = t;
        }
    };
    r.unstable_scheduleCallback = function(e, n, t) {
        var l = r.unstable_now();
        switch(typeof t == "object" && t !== null ? (t = t.delay, t = typeof t == "number" && 0 < t ? l + t : l) : t = l, e){
            case 1:
                var o = -1;
                break;
            case 2:
                o = 250;
                break;
            case 5:
                o = 1073741823;
                break;
            case 4:
                o = 10000;
                break;
            default:
                o = 5000;
        }
        return o = t + o, e = {
            id: re++,
            callback: n,
            priorityLevel: e,
            startTime: t,
            expirationTime: o,
            sortIndex: -1
        }, t > l ? (e.sortIndex = t, Y(c, e), a(s) === null && e === a(c) && (k ? g() : k = !0, v(W, t - l))) : (e.sortIndex = o, Y(s, e), p || M || (p = !0, _(O))), e;
    };
    r.unstable_wrapCallback = function(e) {
        var n = i;
        return function() {
            var t = i;
            i = n;
            try {
                return e.apply(this, arguments);
            } finally{
                i = t;
            }
        };
    };
});
var V1 = H1((se, A)=>{
    "use strict";
    A.exports = $1();
});
var oe3 = J2(V1()), ie1 = J2(V1()), { unstable_now: ce1 , unstable_shouldYield: fe3 , unstable_forceFrameRate: be , unstable_IdlePriority: pe2 , unstable_ImmediatePriority: de2 , unstable_LowPriority: _e1 , unstable_NormalPriority: ye2 , unstable_Profiling: me2 , unstable_UserBlockingPriority: ve2 , unstable_cancelCallback: he2 , unstable_continueExecution: we2 , unstable_getCurrentPriorityLevel: ke1 , unstable_getFirstCallbackNode: ge2 , unstable_next: Pe1 , unstable_pauseExecution: xe2 , unstable_requestPaint: Te , unstable_runWithPriority: Ie1 , unstable_scheduleCallback: Me , unstable_wrapCallback: je1  } = oe3;
var export_default9 = ie1.default;
var _s = Object.create;
var Or = Object.defineProperty;
var Ns = Object.getOwnPropertyDescriptor;
var Ps = Object.getOwnPropertyNames;
var Ts = Object.getPrototypeOf, Ls = Object.prototype.hasOwnProperty;
var zs = (e)=>Or(e, "__esModule", {
        value: !0
    })
;
var Ri = (e, n)=>()=>(n || e((n = {
            exports: {
            }
        }).exports, n), n.exports)
;
var Os = (e, n, t)=>{
    if (n && typeof n == "object" || typeof n == "function") for (let r of Ps(n))!Ls.call(e, r) && r !== "default" && Or(e, r, {
        get: ()=>n[r]
        ,
        enumerable: !(t = Ns(n, r)) || t.enumerable
    });
    return e;
}, Di = (e)=>Os(zs(Or(e != null ? _s(Ts(e)) : {
    }, "default", e && e.__esModule && "default" in e ? {
        get: ()=>e.default
        ,
        enumerable: !0
    } : {
        value: e,
        enumerable: !0
    })), e)
;
var Es = Ri((ie)=>{
    "use strict";
    var _t = export_default1, M = export_default, U = export_default9;
    function v(e) {
        for(var n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, t = 1; t < arguments.length; t++)n += "&args[]=" + encodeURIComponent(arguments[t]);
        return "Minified React error #" + e + "; visit " + n + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    if (!_t) throw Error(v(227));
    var Ii = new Set, On = {
    };
    function He(e, n) {
        nn(e, n), nn(e + "Capture", n);
    }
    function nn(e, n) {
        for(On[e] = n, e = 0; e < n.length; e++)Ii.add(n[e]);
    }
    var me = !(typeof window == "undefined" || typeof window.document == "undefined" || typeof window.document.createElement == "undefined"), Ms = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Fi = Object.prototype.hasOwnProperty, ji = {
    }, Ui = {
    };
    function Rs(e) {
        return Fi.call(Ui, e) ? !0 : Fi.call(ji, e) ? !1 : Ms.test(e) ? Ui[e] = !0 : (ji[e] = !0, !1);
    }
    function Ds(e, n, t, r) {
        if (t !== null && t.type === 0) return !1;
        switch(typeof n){
            case "function":
            case "symbol":
                return !0;
            case "boolean":
                return r ? !1 : t !== null ? !t.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
            default:
                return !1;
        }
    }
    function Is(e, n, t, r) {
        if (n === null || typeof n == "undefined" || Ds(e, n, t, r)) return !0;
        if (r) return !1;
        if (t !== null) switch(t.type){
            case 3:
                return !n;
            case 4:
                return n === !1;
            case 5:
                return isNaN(n);
            case 6:
                return isNaN(n) || 1 > n;
        }
        return !1;
    }
    function Y(e, n, t, r, l, i, o) {
        this.acceptsBooleans = n === 2 || n === 3 || n === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = t, this.propertyName = e, this.type = n, this.sanitizeURL = i, this.removeEmptyString = o;
    }
    var V = {
    };
    "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
        V[e] = new Y(e, 0, !1, e, null, !1, !1);
    });
    [
        [
            "acceptCharset",
            "accept-charset"
        ],
        [
            "className",
            "class"
        ],
        [
            "htmlFor",
            "for"
        ],
        [
            "httpEquiv",
            "http-equiv"
        ]
    ].forEach(function(e) {
        var n = e[0];
        V[n] = new Y(n, 1, !1, e[1], null, !1, !1);
    });
    [
        "contentEditable",
        "draggable",
        "spellCheck",
        "value"
    ].forEach(function(e) {
        V[e] = new Y(e, 2, !1, e.toLowerCase(), null, !1, !1);
    });
    [
        "autoReverse",
        "externalResourcesRequired",
        "focusable",
        "preserveAlpha"
    ].forEach(function(e) {
        V[e] = new Y(e, 2, !1, e, null, !1, !1);
    });
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
        V[e] = new Y(e, 3, !1, e.toLowerCase(), null, !1, !1);
    });
    [
        "checked",
        "multiple",
        "muted",
        "selected"
    ].forEach(function(e) {
        V[e] = new Y(e, 3, !0, e, null, !1, !1);
    });
    [
        "capture",
        "download"
    ].forEach(function(e) {
        V[e] = new Y(e, 4, !1, e, null, !1, !1);
    });
    [
        "cols",
        "rows",
        "size",
        "span"
    ].forEach(function(e) {
        V[e] = new Y(e, 6, !1, e, null, !1, !1);
    });
    [
        "rowSpan",
        "start"
    ].forEach(function(e) {
        V[e] = new Y(e, 5, !1, e.toLowerCase(), null, !1, !1);
    });
    var Rr = /[\-:]([a-z])/g;
    function Dr(e) {
        return e[1].toUpperCase();
    }
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
        var n = e.replace(Rr, Dr);
        V[n] = new Y(n, 1, !1, e, null, !1, !1);
    });
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
        var n = e.replace(Rr, Dr);
        V[n] = new Y(n, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
    });
    [
        "xml:base",
        "xml:lang",
        "xml:space"
    ].forEach(function(e) {
        var n = e.replace(Rr, Dr);
        V[n] = new Y(n, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
    });
    [
        "tabIndex",
        "crossOrigin"
    ].forEach(function(e) {
        V[e] = new Y(e, 1, !1, e.toLowerCase(), null, !1, !1);
    });
    V.xlinkHref = new Y("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
    [
        "src",
        "href",
        "action",
        "formAction"
    ].forEach(function(e) {
        V[e] = new Y(e, 1, !1, e.toLowerCase(), null, !0, !0);
    });
    function Ir(e, n, t, r) {
        var l = V.hasOwnProperty(n) ? V[n] : null, i = l !== null ? l.type === 0 : r ? !1 : !(!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N");
        i || (Is(n, t, l, r) && (t = null), r || l === null ? Rs(n) && (t === null ? e.removeAttribute(n) : e.setAttribute(n, "" + t)) : l.mustUseProperty ? e[l.propertyName] = t === null ? l.type === 3 ? !1 : "" : t : (n = l.attributeName, r = l.attributeNamespace, t === null ? e.removeAttribute(n) : (l = l.type, t = l === 3 || l === 4 && t === !0 ? "" : "" + t, r ? e.setAttributeNS(r, n, t) : e.setAttribute(n, t))));
    }
    var We = _t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Mn = 60103, Ae = 60106, Ee = 60107, Fr = 60108, Rn = 60114, jr = 60109, Ur = 60110, Nt = 60112, Dn = 60113, Pt = 60120, Tt = 60115, Vr = 60116, Br = 60121, Hr = 60128, Vi = 60129, Wr = 60130, Ar = 60131;
    typeof Symbol == "function" && Symbol.for && (F = Symbol.for, Mn = F("react.element"), Ae = F("react.portal"), Ee = F("react.fragment"), Fr = F("react.strict_mode"), Rn = F("react.profiler"), jr = F("react.provider"), Ur = F("react.context"), Nt = F("react.forward_ref"), Dn = F("react.suspense"), Pt = F("react.suspense_list"), Tt = F("react.memo"), Vr = F("react.lazy"), Br = F("react.block"), F("react.scope"), Hr = F("react.opaque.id"), Vi = F("react.debug_trace_mode"), Wr = F("react.offscreen"), Ar = F("react.legacy_hidden"));
    var F, Bi = typeof Symbol == "function" && Symbol.iterator;
    function In(e) {
        return e === null || typeof e != "object" ? null : (e = Bi && e[Bi] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var Qr;
    function Fn(e) {
        if (Qr === void 0) try {
            throw Error();
        } catch (t) {
            var n = t.stack.trim().match(/\n( *(at )?)/);
            Qr = n && n[1] || "";
        }
        return `
` + Qr + e;
    }
    var $r = !1;
    function Lt(e, n) {
        if (!e || $r) return "";
        $r = !0;
        var t = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
            if (n) if (n = function() {
                throw Error();
            }, Object.defineProperty(n.prototype, "props", {
                set: function() {
                    throw Error();
                }
            }), typeof Reflect == "object" && Reflect.construct) {
                try {
                    Reflect.construct(n, []);
                } catch (s) {
                    var r = s;
                }
                Reflect.construct(e, [], n);
            } else {
                try {
                    n.call();
                } catch (s) {
                    r = s;
                }
                e.call(n.prototype);
            }
            else {
                try {
                    throw Error();
                } catch (s) {
                    r = s;
                }
                e();
            }
        } catch (s) {
            if (s && r && typeof s.stack == "string") {
                for(var l = s.stack.split(`
`), i = r.stack.split(`
`), o = l.length - 1, u = i.length - 1; 1 <= o && 0 <= u && l[o] !== i[u];)u--;
                for(; 1 <= o && 0 <= u; o--, u--)if (l[o] !== i[u]) {
                    if (o !== 1 || u !== 1) do if (o--, u--, 0 > u || l[o] !== i[u]) return `
` + l[o].replace(" at new ", " at ");
                    while (1 <= o && 0 <= u)
                    break;
                }
            }
        } finally{
            $r = !1, Error.prepareStackTrace = t;
        }
        return (e = e ? e.displayName || e.name : "") ? Fn(e) : "";
    }
    function Fs(e) {
        switch(e.tag){
            case 5:
                return Fn(e.type);
            case 16:
                return Fn("Lazy");
            case 13:
                return Fn("Suspense");
            case 19:
                return Fn("SuspenseList");
            case 0:
            case 2:
            case 15:
                return e = Lt(e.type, !1), e;
            case 11:
                return e = Lt(e.type.render, !1), e;
            case 22:
                return e = Lt(e.type._render, !1), e;
            case 1:
                return e = Lt(e.type, !0), e;
            default:
                return "";
        }
    }
    function tn(e) {
        if (e == null) return null;
        if (typeof e == "function") return e.displayName || e.name || null;
        if (typeof e == "string") return e;
        switch(e){
            case Ee:
                return "Fragment";
            case Ae:
                return "Portal";
            case Rn:
                return "Profiler";
            case Fr:
                return "StrictMode";
            case Dn:
                return "Suspense";
            case Pt:
                return "SuspenseList";
        }
        if (typeof e == "object") switch(e.$$typeof){
            case Ur:
                return (e.displayName || "Context") + ".Consumer";
            case jr:
                return (e._context.displayName || "Context") + ".Provider";
            case Nt:
                var n = e.render;
                return n = n.displayName || n.name || "", e.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
            case Tt:
                return tn(e.type);
            case Br:
                return tn(e._render);
            case Vr:
                n = e._payload, e = e._init;
                try {
                    return tn(e(n));
                } catch (t) {
                }
        }
        return null;
    }
    function ke(e) {
        switch(typeof e){
            case "boolean":
            case "number":
            case "object":
            case "string":
            case "undefined":
                return e;
            default:
                return "";
        }
    }
    function Hi(e) {
        var n = e.type;
        return (e = e.nodeName) && e.toLowerCase() === "input" && (n === "checkbox" || n === "radio");
    }
    function js(e) {
        var n = Hi(e) ? "checked" : "value", t = Object.getOwnPropertyDescriptor(e.constructor.prototype, n), r = "" + e[n];
        if (!e.hasOwnProperty(n) && typeof t != "undefined" && typeof t.get == "function" && typeof t.set == "function") {
            var l = t.get, i = t.set;
            return Object.defineProperty(e, n, {
                configurable: !0,
                get: function() {
                    return l.call(this);
                },
                set: function(o) {
                    r = "" + o, i.call(this, o);
                }
            }), Object.defineProperty(e, n, {
                enumerable: t.enumerable
            }), {
                getValue: function() {
                    return r;
                },
                setValue: function(o) {
                    r = "" + o;
                },
                stopTracking: function() {
                    e._valueTracker = null, delete e[n];
                }
            };
        }
    }
    function zt(e) {
        e._valueTracker || (e._valueTracker = js(e));
    }
    function Wi(e) {
        if (!e) return !1;
        var n = e._valueTracker;
        if (!n) return !0;
        var t = n.getValue(), r = "";
        return e && (r = Hi(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== t ? (n.setValue(e), !0) : !1;
    }
    function Ot(e) {
        if (e = e || (typeof document != "undefined" ? document : void 0), typeof e == "undefined") return null;
        try {
            return e.activeElement || e.body;
        } catch (n) {
            return e.body;
        }
    }
    function Yr(e, n) {
        var t = n.checked;
        return M({
        }, n, {
            defaultChecked: void 0,
            defaultValue: void 0,
            value: void 0,
            checked: t ?? e._wrapperState.initialChecked
        });
    }
    function Ai(e, n) {
        var t = n.defaultValue == null ? "" : n.defaultValue, r = n.checked != null ? n.checked : n.defaultChecked;
        t = ke(n.value != null ? n.value : t), e._wrapperState = {
            initialChecked: r,
            initialValue: t,
            controlled: n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null
        };
    }
    function Qi(e, n) {
        n = n.checked, n != null && Ir(e, "checked", n, !1);
    }
    function Xr(e, n) {
        Qi(e, n);
        var t = ke(n.value), r = n.type;
        if (t != null) r === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + t) : e.value !== "" + t && (e.value = "" + t);
        else if (r === "submit" || r === "reset") {
            e.removeAttribute("value");
            return;
        }
        n.hasOwnProperty("value") ? Kr(e, n.type, t) : n.hasOwnProperty("defaultValue") && Kr(e, n.type, ke(n.defaultValue)), n.checked == null && n.defaultChecked != null && (e.defaultChecked = !!n.defaultChecked);
    }
    function $i(e, n, t) {
        if (n.hasOwnProperty("value") || n.hasOwnProperty("defaultValue")) {
            var r = n.type;
            if (!(r !== "submit" && r !== "reset" || n.value !== void 0 && n.value !== null)) return;
            n = "" + e._wrapperState.initialValue, t || n === e.value || (e.value = n), e.defaultValue = n;
        }
        t = e.name, t !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, t !== "" && (e.name = t);
    }
    function Kr(e, n, t) {
        (n !== "number" || Ot(e.ownerDocument) !== e) && (t == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + t && (e.defaultValue = "" + t));
    }
    function Us(e) {
        var n = "";
        return _t.Children.forEach(e, function(t) {
            t != null && (n += t);
        }), n;
    }
    function Gr(e, n) {
        return e = M({
            children: void 0
        }, n), (n = Us(n.children)) && (e.children = n), e;
    }
    function rn(e, n, t, r) {
        if (e = e.options, n) {
            n = {
            };
            for(var l = 0; l < t.length; l++)n["$" + t[l]] = !0;
            for(t = 0; t < e.length; t++)l = n.hasOwnProperty("$" + e[t].value), e[t].selected !== l && (e[t].selected = l), l && r && (e[t].defaultSelected = !0);
        } else {
            for(t = "" + ke(t), n = null, l = 0; l < e.length; l++){
                if (e[l].value === t) {
                    e[l].selected = !0, r && (e[l].defaultSelected = !0);
                    return;
                }
                n !== null || e[l].disabled || (n = e[l]);
            }
            n !== null && (n.selected = !0);
        }
    }
    function Zr(e, n) {
        if (n.dangerouslySetInnerHTML != null) throw Error(v(91));
        return M({
        }, n, {
            value: void 0,
            defaultValue: void 0,
            children: "" + e._wrapperState.initialValue
        });
    }
    function Yi(e, n) {
        var t = n.value;
        if (t == null) {
            if (t = n.children, n = n.defaultValue, t != null) {
                if (n != null) throw Error(v(92));
                if (Array.isArray(t)) {
                    if (!(1 >= t.length)) throw Error(v(93));
                    t = t[0];
                }
                n = t;
            }
            n == null && (n = ""), t = n;
        }
        e._wrapperState = {
            initialValue: ke(t)
        };
    }
    function Xi(e, n) {
        var t = ke(n.value), r = ke(n.defaultValue);
        t != null && (t = "" + t, t !== e.value && (e.value = t), n.defaultValue == null && e.defaultValue !== t && (e.defaultValue = t)), r != null && (e.defaultValue = "" + r);
    }
    function Ki(e) {
        var n = e.textContent;
        n === e._wrapperState.initialValue && n !== "" && n !== null && (e.value = n);
    }
    var Jr = {
        html: "http://www.w3.org/1999/xhtml",
        mathml: "http://www.w3.org/1998/Math/MathML",
        svg: "http://www.w3.org/2000/svg"
    };
    function Gi(e) {
        switch(e){
            case "svg":
                return "http://www.w3.org/2000/svg";
            case "math":
                return "http://www.w3.org/1998/Math/MathML";
            default:
                return "http://www.w3.org/1999/xhtml";
        }
    }
    function qr(e, n) {
        return e == null || e === "http://www.w3.org/1999/xhtml" ? Gi(n) : e === "http://www.w3.org/2000/svg" && n === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
    }
    var Mt, Zi = function(e) {
        return typeof MSApp != "undefined" && MSApp.execUnsafeLocalFunction ? function(n, t, r, l) {
            MSApp.execUnsafeLocalFunction(function() {
                return e(n, t, r, l);
            });
        } : e;
    }(function(e, n) {
        if (e.namespaceURI !== Jr.svg || "innerHTML" in e) e.innerHTML = n;
        else {
            for(Mt = Mt || document.createElement("div"), Mt.innerHTML = "<svg>" + n.valueOf().toString() + "</svg>", n = Mt.firstChild; e.firstChild;)e.removeChild(e.firstChild);
            for(; n.firstChild;)e.appendChild(n.firstChild);
        }
    });
    function jn(e, n) {
        if (n) {
            var t = e.firstChild;
            if (t && t === e.lastChild && t.nodeType === 3) {
                t.nodeValue = n;
                return;
            }
        }
        e.textContent = n;
    }
    var Un = {
        animationIterationCount: !0,
        borderImageOutset: !0,
        borderImageSlice: !0,
        borderImageWidth: !0,
        boxFlex: !0,
        boxFlexGroup: !0,
        boxOrdinalGroup: !0,
        columnCount: !0,
        columns: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        flexOrder: !0,
        gridArea: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowSpan: !0,
        gridRowStart: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnSpan: !0,
        gridColumnStart: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        floodOpacity: !0,
        stopOpacity: !0,
        strokeDasharray: !0,
        strokeDashoffset: !0,
        strokeMiterlimit: !0,
        strokeOpacity: !0,
        strokeWidth: !0
    }, Vs = [
        "Webkit",
        "ms",
        "Moz",
        "O"
    ];
    Object.keys(Un).forEach(function(e) {
        Vs.forEach(function(n) {
            n = n + e.charAt(0).toUpperCase() + e.substring(1), Un[n] = Un[e];
        });
    });
    function Ji(e, n, t) {
        return n == null || typeof n == "boolean" || n === "" ? "" : t || typeof n != "number" || n === 0 || Un.hasOwnProperty(e) && Un[e] ? ("" + n).trim() : n + "px";
    }
    function qi(e, n) {
        e = e.style;
        for(var t in n)if (n.hasOwnProperty(t)) {
            var r = t.indexOf("--") === 0, l = Ji(t, n[t], r);
            t === "float" && (t = "cssFloat"), r ? e.setProperty(t, l) : e[t] = l;
        }
    }
    var Bs = M({
        menuitem: !0
    }, {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
    });
    function br(e, n) {
        if (n) {
            if (Bs[e] && (n.children != null || n.dangerouslySetInnerHTML != null)) throw Error(v(137, e));
            if (n.dangerouslySetInnerHTML != null) {
                if (n.children != null) throw Error(v(60));
                if (!(typeof n.dangerouslySetInnerHTML == "object" && "__html" in n.dangerouslySetInnerHTML)) throw Error(v(61));
            }
            if (n.style != null && typeof n.style != "object") throw Error(v(62));
        }
    }
    function el(e, n) {
        if (e.indexOf("-") === -1) return typeof n.is == "string";
        switch(e){
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
                return !1;
            default:
                return !0;
        }
    }
    function nl(e) {
        return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
    }
    var tl = null, ln = null, on = null;
    function bi(e) {
        if (e = tt(e)) {
            if (typeof tl != "function") throw Error(v(280));
            var n = e.stateNode;
            n && (n = bt(n), tl(e.stateNode, e.type, n));
        }
    }
    function eo(e) {
        ln ? on ? on.push(e) : on = [
            e
        ] : ln = e;
    }
    function no() {
        if (ln) {
            var e = ln, n = on;
            if (on = ln = null, bi(e), n) for(e = 0; e < n.length; e++)bi(n[e]);
        }
    }
    function rl(e, n) {
        return e(n);
    }
    function to(e, n, t, r, l) {
        return e(n, t, r, l);
    }
    function ll() {
    }
    var ro = rl, Qe = !1, il = !1;
    function ol() {
        (ln !== null || on !== null) && (ll(), no());
    }
    function Hs(e, n, t) {
        if (il) return e(n, t);
        il = !0;
        try {
            return ro(e, n, t);
        } finally{
            il = !1, ol();
        }
    }
    function Vn(e, n) {
        var t = e.stateNode;
        if (t === null) return null;
        var r = bt(t);
        if (r === null) return null;
        t = r[n];
        e: switch(n){
            case "onClick":
            case "onClickCapture":
            case "onDoubleClick":
            case "onDoubleClickCapture":
            case "onMouseDown":
            case "onMouseDownCapture":
            case "onMouseMove":
            case "onMouseMoveCapture":
            case "onMouseUp":
            case "onMouseUpCapture":
            case "onMouseEnter":
                (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
                break e;
            default:
                e = !1;
        }
        if (e) return null;
        if (t && typeof t != "function") throw Error(v(231, n, typeof t));
        return t;
    }
    var ul = !1;
    if (me) try {
        un = {
        }, Object.defineProperty(un, "passive", {
            get: function() {
                ul = !0;
            }
        }), window.addEventListener("test", un, un), window.removeEventListener("test", un, un);
    } catch (e) {
        ul = !1;
    }
    var un;
    function Ws(e, n, t, r, l, i, o, u, s) {
        var d = Array.prototype.slice.call(arguments, 3);
        try {
            n.apply(t, d);
        } catch (y) {
            this.onError(y);
        }
    }
    var Bn = !1, Rt = null, Dt = !1, sl = null, As = {
        onError: function(e) {
            Bn = !0, Rt = e;
        }
    };
    function Qs(e, n, t, r, l, i, o, u, s) {
        Bn = !1, Rt = null, Ws.apply(As, arguments);
    }
    function $s(e, n, t, r, l, i, o, u, s) {
        if (Qs.apply(this, arguments), Bn) {
            if (Bn) {
                var d = Rt;
                Bn = !1, Rt = null;
            } else throw Error(v(198));
            Dt || (Dt = !0, sl = d);
        }
    }
    function $e(e) {
        var n = e, t = e;
        if (e.alternate) for(; n.return;)n = n.return;
        else {
            e = n;
            do n = e, (n.flags & 1026) != 0 && (t = n.return), e = n.return;
            while (e)
        }
        return n.tag === 3 ? t : null;
    }
    function lo(e) {
        if (e.tag === 13) {
            var n = e.memoizedState;
            if (n === null && (e = e.alternate, e !== null && (n = e.memoizedState)), n !== null) return n.dehydrated;
        }
        return null;
    }
    function io(e) {
        if ($e(e) !== e) throw Error(v(188));
    }
    function Ys(e) {
        var n = e.alternate;
        if (!n) {
            if (n = $e(e), n === null) throw Error(v(188));
            return n !== e ? null : e;
        }
        for(var t = e, r = n;;){
            var l = t.return;
            if (l === null) break;
            var i = l.alternate;
            if (i === null) {
                if (r = l.return, r !== null) {
                    t = r;
                    continue;
                }
                break;
            }
            if (l.child === i.child) {
                for(i = l.child; i;){
                    if (i === t) return io(l), e;
                    if (i === r) return io(l), n;
                    i = i.sibling;
                }
                throw Error(v(188));
            }
            if (t.return !== r.return) t = l, r = i;
            else {
                for(var o = !1, u = l.child; u;){
                    if (u === t) {
                        o = !0, t = l, r = i;
                        break;
                    }
                    if (u === r) {
                        o = !0, r = l, t = i;
                        break;
                    }
                    u = u.sibling;
                }
                if (!o) {
                    for(u = i.child; u;){
                        if (u === t) {
                            o = !0, t = i, r = l;
                            break;
                        }
                        if (u === r) {
                            o = !0, r = i, t = l;
                            break;
                        }
                        u = u.sibling;
                    }
                    if (!o) throw Error(v(189));
                }
            }
            if (t.alternate !== r) throw Error(v(190));
        }
        if (t.tag !== 3) throw Error(v(188));
        return t.stateNode.current === t ? e : n;
    }
    function oo(e) {
        if (e = Ys(e), !e) return null;
        for(var n = e;;){
            if (n.tag === 5 || n.tag === 6) return n;
            if (n.child) n.child.return = n, n = n.child;
            else {
                if (n === e) break;
                for(; !n.sibling;){
                    if (!n.return || n.return === e) return null;
                    n = n.return;
                }
                n.sibling.return = n.return, n = n.sibling;
            }
        }
        return null;
    }
    function uo(e, n) {
        for(var t = e.alternate; n !== null;){
            if (n === e || n === t) return !0;
            n = n.return;
        }
        return !1;
    }
    var so, al, ao, fo, fl = !1, se = [], xe = null, Ce = null, _e = null, Hn = new Map, Wn = new Map, An = [], co = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
    function cl(e, n, t, r, l) {
        return {
            blockedOn: e,
            domEventName: n,
            eventSystemFlags: t | 16,
            nativeEvent: l,
            targetContainers: [
                r
            ]
        };
    }
    function po(e, n) {
        switch(e){
            case "focusin":
            case "focusout":
                xe = null;
                break;
            case "dragenter":
            case "dragleave":
                Ce = null;
                break;
            case "mouseover":
            case "mouseout":
                _e = null;
                break;
            case "pointerover":
            case "pointerout":
                Hn.delete(n.pointerId);
                break;
            case "gotpointercapture":
            case "lostpointercapture":
                Wn.delete(n.pointerId);
        }
    }
    function Qn(e, n, t, r, l, i) {
        return e === null || e.nativeEvent !== i ? (e = cl(n, t, r, l, i), n !== null && (n = tt(n), n !== null && al(n)), e) : (e.eventSystemFlags |= r, n = e.targetContainers, l !== null && n.indexOf(l) === -1 && n.push(l), e);
    }
    function Xs(e, n, t, r, l) {
        switch(n){
            case "focusin":
                return xe = Qn(xe, e, n, t, r, l), !0;
            case "dragenter":
                return Ce = Qn(Ce, e, n, t, r, l), !0;
            case "mouseover":
                return _e = Qn(_e, e, n, t, r, l), !0;
            case "pointerover":
                var i = l.pointerId;
                return Hn.set(i, Qn(Hn.get(i) || null, e, n, t, r, l)), !0;
            case "gotpointercapture":
                return i = l.pointerId, Wn.set(i, Qn(Wn.get(i) || null, e, n, t, r, l)), !0;
        }
        return !1;
    }
    function Ks(e) {
        var n = Ye(e.target);
        if (n !== null) {
            var t = $e(n);
            if (t !== null) {
                if (n = t.tag, n === 13) {
                    if (n = lo(t), n !== null) {
                        e.blockedOn = n, fo(e.lanePriority, function() {
                            U.unstable_runWithPriority(e.priority, function() {
                                ao(t);
                            });
                        });
                        return;
                    }
                } else if (n === 3 && t.stateNode.hydrate) {
                    e.blockedOn = t.tag === 3 ? t.stateNode.containerInfo : null;
                    return;
                }
            }
        }
        e.blockedOn = null;
    }
    function It(e) {
        if (e.blockedOn !== null) return !1;
        for(var n = e.targetContainers; 0 < n.length;){
            var t = yl(e.domEventName, e.eventSystemFlags, n[0], e.nativeEvent);
            if (t !== null) return n = tt(t), n !== null && al(n), e.blockedOn = t, !1;
            n.shift();
        }
        return !0;
    }
    function mo(e, n, t) {
        It(e) && t.delete(n);
    }
    function Gs() {
        for(fl = !1; 0 < se.length;){
            var e = se[0];
            if (e.blockedOn !== null) {
                e = tt(e.blockedOn), e !== null && so(e);
                break;
            }
            for(var n = e.targetContainers; 0 < n.length;){
                var t = yl(e.domEventName, e.eventSystemFlags, n[0], e.nativeEvent);
                if (t !== null) {
                    e.blockedOn = t;
                    break;
                }
                n.shift();
            }
            e.blockedOn === null && se.shift();
        }
        xe !== null && It(xe) && (xe = null), Ce !== null && It(Ce) && (Ce = null), _e !== null && It(_e) && (_e = null), Hn.forEach(mo), Wn.forEach(mo);
    }
    function $n(e, n) {
        e.blockedOn === n && (e.blockedOn = null, fl || (fl = !0, U.unstable_scheduleCallback(U.unstable_NormalPriority, Gs)));
    }
    function ho(e) {
        function n(l) {
            return $n(l, e);
        }
        if (0 < se.length) {
            $n(se[0], e);
            for(var t = 1; t < se.length; t++){
                var r = se[t];
                r.blockedOn === e && (r.blockedOn = null);
            }
        }
        for(xe !== null && $n(xe, e), Ce !== null && $n(Ce, e), _e !== null && $n(_e, e), Hn.forEach(n), Wn.forEach(n), t = 0; t < An.length; t++)r = An[t], r.blockedOn === e && (r.blockedOn = null);
        for(; 0 < An.length && (t = An[0], t.blockedOn === null);)Ks(t), t.blockedOn === null && An.shift();
    }
    function Ft(e, n) {
        var t = {
        };
        return t[e.toLowerCase()] = n.toLowerCase(), t["Webkit" + e] = "webkit" + n, t["Moz" + e] = "moz" + n, t;
    }
    var sn = {
        animationend: Ft("Animation", "AnimationEnd"),
        animationiteration: Ft("Animation", "AnimationIteration"),
        animationstart: Ft("Animation", "AnimationStart"),
        transitionend: Ft("Transition", "TransitionEnd")
    }, dl = {
    }, vo = {
    };
    me && (vo = document.createElement("div").style, "AnimationEvent" in window || (delete sn.animationend.animation, delete sn.animationiteration.animation, delete sn.animationstart.animation), "TransitionEvent" in window || delete sn.transitionend.transition);
    function jt(e) {
        if (dl[e]) return dl[e];
        if (!sn[e]) return e;
        var n = sn[e], t;
        for(t in n)if (n.hasOwnProperty(t) && t in vo) return dl[e] = n[t];
        return e;
    }
    var yo = jt("animationend"), go = jt("animationiteration"), wo = jt("animationstart"), So = jt("transitionend"), Eo = new Map, pl = new Map, Zs = [
        "abort",
        "abort",
        yo,
        "animationEnd",
        go,
        "animationIteration",
        wo,
        "animationStart",
        "canplay",
        "canPlay",
        "canplaythrough",
        "canPlayThrough",
        "durationchange",
        "durationChange",
        "emptied",
        "emptied",
        "encrypted",
        "encrypted",
        "ended",
        "ended",
        "error",
        "error",
        "gotpointercapture",
        "gotPointerCapture",
        "load",
        "load",
        "loadeddata",
        "loadedData",
        "loadedmetadata",
        "loadedMetadata",
        "loadstart",
        "loadStart",
        "lostpointercapture",
        "lostPointerCapture",
        "playing",
        "playing",
        "progress",
        "progress",
        "seeking",
        "seeking",
        "stalled",
        "stalled",
        "suspend",
        "suspend",
        "timeupdate",
        "timeUpdate",
        So,
        "transitionEnd",
        "waiting",
        "waiting"
    ];
    function ml(e, n) {
        for(var t = 0; t < e.length; t += 2){
            var r = e[t], l = e[t + 1];
            l = "on" + (l[0].toUpperCase() + l.slice(1)), pl.set(r, n), Eo.set(r, l), He(l, [
                r
            ]);
        }
    }
    var Js = U.unstable_now;
    Js();
    var L = 8;
    function an(e) {
        if ((1 & e) != 0) return L = 15, 1;
        if ((2 & e) != 0) return L = 14, 2;
        if ((4 & e) != 0) return L = 13, 4;
        var n = 24 & e;
        return n !== 0 ? (L = 12, n) : (e & 32) != 0 ? (L = 11, 32) : (n = 192 & e, n !== 0 ? (L = 10, n) : (e & 256) != 0 ? (L = 9, 256) : (n = 3584 & e, n !== 0 ? (L = 8, n) : (e & 4096) != 0 ? (L = 7, 4096) : (n = 4186112 & e, n !== 0 ? (L = 6, n) : (n = 62914560 & e, n !== 0 ? (L = 5, n) : e & 67108864 ? (L = 4, 67108864) : (e & 134217728) != 0 ? (L = 3, 134217728) : (n = 805306368 & e, n !== 0 ? (L = 2, n) : (1073741824 & e) != 0 ? (L = 1, 1073741824) : (L = 8, e))))));
    }
    function qs(e) {
        switch(e){
            case 99:
                return 15;
            case 98:
                return 10;
            case 97:
            case 96:
                return 8;
            case 95:
                return 2;
            default:
                return 0;
        }
    }
    function bs(e) {
        switch(e){
            case 15:
            case 14:
                return 99;
            case 13:
            case 12:
            case 11:
            case 10:
                return 98;
            case 9:
            case 8:
            case 7:
            case 6:
            case 4:
            case 5:
                return 97;
            case 3:
            case 2:
            case 1:
                return 95;
            case 0:
                return 90;
            default:
                throw Error(v(358, e));
        }
    }
    function Yn(e, n) {
        var t = e.pendingLanes;
        if (t === 0) return L = 0;
        var r = 0, l1 = 0, i = e.expiredLanes, o = e.suspendedLanes, u = e.pingedLanes;
        if (i !== 0) r = i, l1 = L = 15;
        else if (i = t & 134217727, i !== 0) {
            var s = i & ~o;
            s !== 0 ? (r = an(s), l1 = L) : (u &= i, u !== 0 && (r = an(u), l1 = L));
        } else i = t & ~o, i !== 0 ? (r = an(i), l1 = L) : u !== 0 && (r = an(u), l1 = L);
        if (r === 0) return 0;
        if (r = 31 - Ne(r), r = t & ((0 > r ? 0 : 1 << r) << 1) - 1, n !== 0 && n !== r && (n & o) == 0) {
            if (an(n), l1 <= L) return n;
            L = l1;
        }
        if (n = e.entangledLanes, n !== 0) for(e = e.entanglements, n &= r; 0 < n;)t = 31 - Ne(n), l1 = 1 << t, r |= e[t], n &= ~l1;
        return r;
    }
    function ko(e) {
        return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
    }
    function Ut(e, n) {
        switch(e){
            case 15:
                return 1;
            case 14:
                return 2;
            case 12:
                return e = fn(24 & ~n), e === 0 ? Ut(10, n) : e;
            case 10:
                return e = fn(192 & ~n), e === 0 ? Ut(8, n) : e;
            case 8:
                return e = fn(3584 & ~n), e === 0 && (e = fn(4186112 & ~n), e === 0 && (e = 512)), e;
            case 2:
                return n = fn(805306368 & ~n), n === 0 && (n = 268435456), n;
        }
        throw Error(v(358, e));
    }
    function fn(e) {
        return e & -e;
    }
    function hl(e) {
        for(var n = [], t = 0; 31 > t; t++)n.push(e);
        return n;
    }
    function Vt(e, n, t) {
        e.pendingLanes |= n;
        var r = n - 1;
        e.suspendedLanes &= r, e.pingedLanes &= r, e = e.eventTimes, n = 31 - Ne(n), e[n] = t;
    }
    var Ne = Math.clz32 ? Math.clz32 : ta, ea = Math.log, na = Math.LN2;
    function ta(e) {
        return e === 0 ? 32 : 31 - (ea(e) / na | 0) | 0;
    }
    var ra = U.unstable_UserBlockingPriority, la = U.unstable_runWithPriority, Bt = !0;
    function ia(e, n, t, r) {
        Qe || ll();
        var l1 = vl, i = Qe;
        Qe = !0;
        try {
            to(l1, e, n, t, r);
        } finally{
            (Qe = i) || ol();
        }
    }
    function oa(e, n, t, r) {
        la(ra, vl.bind(null, e, n, t, r));
    }
    function vl(e, n, t, r) {
        if (Bt) {
            var l;
            if ((l = (n & 4) == 0) && 0 < se.length && -1 < co.indexOf(e)) e = cl(null, e, n, t, r), se.push(e);
            else {
                var i = yl(e, n, t, r);
                if (i === null) l && po(e, r);
                else {
                    if (l) {
                        if (-1 < co.indexOf(e)) {
                            e = cl(i, e, n, t, r), se.push(e);
                            return;
                        }
                        if (Xs(i, e, n, t, r)) return;
                        po(e, r);
                    }
                    Zo(e, n, r, null, t);
                }
            }
        }
    }
    function yl(e, n, t, r) {
        var l1 = nl(r);
        if (l1 = Ye(l1), l1 !== null) {
            var i = $e(l1);
            if (i === null) l1 = null;
            else {
                var o = i.tag;
                if (o === 13) {
                    if (l1 = lo(i), l1 !== null) return l1;
                    l1 = null;
                } else if (o === 3) {
                    if (i.stateNode.hydrate) return i.tag === 3 ? i.stateNode.containerInfo : null;
                    l1 = null;
                } else i !== l1 && (l1 = null);
            }
        }
        return Zo(e, n, r, l1, t), null;
    }
    var Pe = null, gl = null, Ht = null;
    function xo() {
        if (Ht) return Ht;
        var e1, n = gl, t = n.length, r, l1 = "value" in Pe ? Pe.value : Pe.textContent, i = l1.length;
        for(e1 = 0; e1 < t && n[e1] === l1[e1]; e1++);
        var o = t - e1;
        for(r = 1; r <= o && n[t - r] === l1[i - r]; r++);
        return Ht = l1.slice(e1, 1 < r ? 1 - r : void 0);
    }
    function Wt(e) {
        var n = e.keyCode;
        return "charCode" in e ? (e = e.charCode, e === 0 && n === 13 && (e = 13)) : e = n, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
    }
    function At() {
        return !0;
    }
    function Co() {
        return !1;
    }
    function q(e) {
        function n(t, r, l, i, o) {
            this._reactName = t, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
            for(var u in e)e.hasOwnProperty(u) && (t = e[u], this[u] = t ? t(i) : i[u]);
            return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? At : Co, this.isPropagationStopped = Co, this;
        }
        return M(n.prototype, {
            preventDefault: function() {
                this.defaultPrevented = !0;
                var t = this.nativeEvent;
                t && (t.preventDefault ? t.preventDefault() : typeof t.returnValue != "unknown" && (t.returnValue = !1), this.isDefaultPrevented = At);
            },
            stopPropagation: function() {
                var t = this.nativeEvent;
                t && (t.stopPropagation ? t.stopPropagation() : typeof t.cancelBubble != "unknown" && (t.cancelBubble = !0), this.isPropagationStopped = At);
            },
            persist: function() {
            },
            isPersistent: At
        }), n;
    }
    var cn = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function(e) {
            return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0
    }, wl = q(cn), Xn = M({
    }, cn, {
        view: 0,
        detail: 0
    }), ua = q(Xn), Sl, El, Kn, Qt = M({
    }, Xn, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: xl,
        button: 0,
        buttons: 0,
        relatedTarget: function(e) {
            return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
        },
        movementX: function(e) {
            return "movementX" in e ? e.movementX : (e !== Kn && (Kn && e.type === "mousemove" ? (Sl = e.screenX - Kn.screenX, El = e.screenY - Kn.screenY) : El = Sl = 0, Kn = e), Sl);
        },
        movementY: function(e) {
            return "movementY" in e ? e.movementY : El;
        }
    }), _o = q(Qt), sa = M({
    }, Qt, {
        dataTransfer: 0
    }), aa = q(sa), fa = M({
    }, Xn, {
        relatedTarget: 0
    }), kl = q(fa), ca = M({
    }, cn, {
        animationName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }), da = q(ca), pa = M({
    }, cn, {
        clipboardData: function(e) {
            return "clipboardData" in e ? e.clipboardData : window.clipboardData;
        }
    }), ma = q(pa), ha = M({
    }, cn, {
        data: 0
    }), No = q(ha), va = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    }, ya = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    }, ga = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
    };
    function wa(e) {
        var n = this.nativeEvent;
        return n.getModifierState ? n.getModifierState(e) : (e = ga[e]) ? !!n[e] : !1;
    }
    function xl() {
        return wa;
    }
    var Sa = M({
    }, Xn, {
        key: function(e) {
            if (e.key) {
                var n = va[e.key] || e.key;
                if (n !== "Unidentified") return n;
            }
            return e.type === "keypress" ? (e = Wt(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? ya[e.keyCode] || "Unidentified" : "";
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: xl,
        charCode: function(e) {
            return e.type === "keypress" ? Wt(e) : 0;
        },
        keyCode: function(e) {
            return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
        },
        which: function(e) {
            return e.type === "keypress" ? Wt(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
        }
    }), Ea = q(Sa), ka = M({
    }, Qt, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
    }), Po = q(ka), xa = M({
    }, Xn, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: xl
    }), Ca = q(xa), _a = M({
    }, cn, {
        propertyName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }), Na = q(_a), Pa = M({
    }, Qt, {
        deltaX: function(e) {
            return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
        },
        deltaY: function(e) {
            return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
        },
        deltaZ: 0,
        deltaMode: 0
    }), Ta = q(Pa), La = [
        9,
        13,
        27,
        32
    ], Cl = me && "CompositionEvent" in window, Gn = null;
    me && "documentMode" in document && (Gn = document.documentMode);
    var za = me && "TextEvent" in window && !Gn, To = me && (!Cl || Gn && 8 < Gn && 11 >= Gn), Lo = String.fromCharCode(32), zo = !1;
    function Oo(e, n) {
        switch(e){
            case "keyup":
                return La.indexOf(n.keyCode) !== -1;
            case "keydown":
                return n.keyCode !== 229;
            case "keypress":
            case "mousedown":
            case "focusout":
                return !0;
            default:
                return !1;
        }
    }
    function Mo(e) {
        return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
    }
    var dn = !1;
    function Oa(e, n) {
        switch(e){
            case "compositionend":
                return Mo(n);
            case "keypress":
                return n.which !== 32 ? null : (zo = !0, Lo);
            case "textInput":
                return e = n.data, e === Lo && zo ? null : e;
            default:
                return null;
        }
    }
    function Ma(e, n) {
        if (dn) return e === "compositionend" || !Cl && Oo(e, n) ? (e = xo(), Ht = gl = Pe = null, dn = !1, e) : null;
        switch(e){
            case "paste":
                return null;
            case "keypress":
                if (!(n.ctrlKey || n.altKey || n.metaKey) || n.ctrlKey && n.altKey) {
                    if (n.char && 1 < n.char.length) return n.char;
                    if (n.which) return String.fromCharCode(n.which);
                }
                return null;
            case "compositionend":
                return To && n.locale !== "ko" ? null : n.data;
            default:
                return null;
        }
    }
    var Ra = {
        color: !0,
        date: !0,
        datetime: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0
    };
    function Ro(e) {
        var n = e && e.nodeName && e.nodeName.toLowerCase();
        return n === "input" ? !!Ra[e.type] : n === "textarea";
    }
    function Do(e, n, t, r) {
        eo(r), n = Gt(n, "onChange"), 0 < n.length && (t = new wl("onChange", "change", null, t, r), e.push({
            event: t,
            listeners: n
        }));
    }
    var Zn = null, Jn = null;
    function Da(e) {
        $o(e, 0);
    }
    function $t(e) {
        var n = yn(e);
        if (Wi(n)) return e;
    }
    function Ia(e, n) {
        if (e === "change") return n;
    }
    var Io = !1;
    me && (me ? (Xt = "oninput" in document, Xt || (_l = document.createElement("div"), _l.setAttribute("oninput", "return;"), Xt = typeof _l.oninput == "function"), Yt = Xt) : Yt = !1, Io = Yt && (!document.documentMode || 9 < document.documentMode));
    var Yt, Xt, _l;
    function Fo() {
        Zn && (Zn.detachEvent("onpropertychange", jo), Jn = Zn = null);
    }
    function jo(e) {
        if (e.propertyName === "value" && $t(Jn)) {
            var n = [];
            if (Do(n, Jn, e, nl(e)), e = Da, Qe) e(n);
            else {
                Qe = !0;
                try {
                    rl(e, n);
                } finally{
                    Qe = !1, ol();
                }
            }
        }
    }
    function Fa(e, n, t) {
        e === "focusin" ? (Fo(), Zn = n, Jn = t, Zn.attachEvent("onpropertychange", jo)) : e === "focusout" && Fo();
    }
    function ja(e) {
        if (e === "selectionchange" || e === "keyup" || e === "keydown") return $t(Jn);
    }
    function Ua(e, n) {
        if (e === "click") return $t(n);
    }
    function Va(e, n) {
        if (e === "input" || e === "change") return $t(n);
    }
    function Ba(e, n) {
        return e === n && (e !== 0 || 1 / e == 1 / n) || e !== e && n !== n;
    }
    var ee = typeof Object.is == "function" ? Object.is : Ba, Ha = Object.prototype.hasOwnProperty;
    function qn(e, n) {
        if (ee(e, n)) return !0;
        if (typeof e != "object" || e === null || typeof n != "object" || n === null) return !1;
        var t = Object.keys(e), r = Object.keys(n);
        if (t.length !== r.length) return !1;
        for(r = 0; r < t.length; r++)if (!Ha.call(n, t[r]) || !ee(e[t[r]], n[t[r]])) return !1;
        return !0;
    }
    function Uo(e) {
        for(; e && e.firstChild;)e = e.firstChild;
        return e;
    }
    function Vo(e, n) {
        var t = Uo(e);
        e = 0;
        for(var r; t;){
            if (t.nodeType === 3) {
                if (r = e + t.textContent.length, e <= n && r >= n) return {
                    node: t,
                    offset: n - e
                };
                e = r;
            }
            e: {
                for(; t;){
                    if (t.nextSibling) {
                        t = t.nextSibling;
                        break e;
                    }
                    t = t.parentNode;
                }
                t = void 0;
            }
            t = Uo(t);
        }
    }
    function Bo(e, n) {
        return e && n ? e === n ? !0 : e && e.nodeType === 3 ? !1 : n && n.nodeType === 3 ? Bo(e, n.parentNode) : "contains" in e ? e.contains(n) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(n) & 16) : !1 : !1;
    }
    function Ho() {
        for(var e1 = window, n = Ot(); n instanceof e1.HTMLIFrameElement;){
            try {
                var t = typeof n.contentWindow.location.href == "string";
            } catch (r) {
                t = !1;
            }
            if (t) e1 = n.contentWindow;
            else break;
            n = Ot(e1.document);
        }
        return n;
    }
    function Nl(e) {
        var n = e && e.nodeName && e.nodeName.toLowerCase();
        return n && (n === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || n === "textarea" || e.contentEditable === "true");
    }
    var Wa = me && "documentMode" in document && 11 >= document.documentMode, pn = null, Pl = null, bn = null, Tl = !1;
    function Wo(e, n, t) {
        var r = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
        Tl || pn == null || pn !== Ot(r) || (r = pn, "selectionStart" in r && Nl(r) ? r = {
            start: r.selectionStart,
            end: r.selectionEnd
        } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
            anchorNode: r.anchorNode,
            anchorOffset: r.anchorOffset,
            focusNode: r.focusNode,
            focusOffset: r.focusOffset
        }), bn && qn(bn, r) || (bn = r, r = Gt(Pl, "onSelect"), 0 < r.length && (n = new wl("onSelect", "select", null, n, t), e.push({
            event: n,
            listeners: r
        }), n.target = pn)));
    }
    ml("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "), 0);
    ml("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "), 1);
    ml(Zs, 2);
    for(Ll = "change selectionchange textInput compositionstart compositionend compositionupdate".split(" "), Kt = 0; Kt < Ll.length; Kt++)pl.set(Ll[Kt], 0);
    var Ll, Kt;
    nn("onMouseEnter", [
        "mouseout",
        "mouseover"
    ]);
    nn("onMouseLeave", [
        "mouseout",
        "mouseover"
    ]);
    nn("onPointerEnter", [
        "pointerout",
        "pointerover"
    ]);
    nn("onPointerLeave", [
        "pointerout",
        "pointerover"
    ]);
    He("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
    He("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
    He("onBeforeInput", [
        "compositionend",
        "keypress",
        "textInput",
        "paste"
    ]);
    He("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
    He("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
    He("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var et = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Ao = new Set("cancel close invalid load scroll toggle".split(" ").concat(et));
    function Qo(e, n, t) {
        var r = e.type || "unknown-event";
        e.currentTarget = t, $s(r, n, void 0, e), e.currentTarget = null;
    }
    function $o(e, n) {
        n = (n & 4) != 0;
        for(var t = 0; t < e.length; t++){
            var r = e[t], l = r.event;
            r = r.listeners;
            e: {
                var i = void 0;
                if (n) for(var o = r.length - 1; 0 <= o; o--){
                    var u = r[o], s = u.instance, d = u.currentTarget;
                    if (u = u.listener, s !== i && l.isPropagationStopped()) break e;
                    Qo(l, u, d), i = s;
                }
                else for(o = 0; o < r.length; o++){
                    if (u = r[o], s = u.instance, d = u.currentTarget, u = u.listener, s !== i && l.isPropagationStopped()) break e;
                    Qo(l, u, d), i = s;
                }
            }
        }
        if (Dt) throw e = sl, Dt = !1, sl = null, e;
    }
    function z(e, n) {
        var t = tu(n), r = e + "__bubble";
        t.has(r) || (Go(n, e, 2, !1), t.add(r));
    }
    var Yo = "_reactListening" + Math.random().toString(36).slice(2);
    function Xo(e) {
        e[Yo] || (e[Yo] = !0, Ii.forEach(function(n) {
            Ao.has(n) || Ko(n, !1, e, null), Ko(n, !0, e, null);
        }));
    }
    function Ko(e, n, t, r) {
        var l1 = 4 < arguments.length && arguments[4] !== void 0 ? arguments[4] : 0, i = t;
        if (e === "selectionchange" && t.nodeType !== 9 && (i = t.ownerDocument), r !== null && !n && Ao.has(e)) {
            if (e !== "scroll") return;
            l1 |= 2, i = r;
        }
        var o = tu(i), u = e + "__" + (n ? "capture" : "bubble");
        o.has(u) || (n && (l1 |= 4), Go(i, e, l1, n), o.add(u));
    }
    function Go(e, n, t, r) {
        var l1 = pl.get(n);
        switch(l1 === void 0 ? 2 : l1){
            case 0:
                l1 = ia;
                break;
            case 1:
                l1 = oa;
                break;
            default:
                l1 = vl;
        }
        t = l1.bind(null, n, t, e), l1 = void 0, !ul || n !== "touchstart" && n !== "touchmove" && n !== "wheel" || (l1 = !0), r ? l1 !== void 0 ? e.addEventListener(n, t, {
            capture: !0,
            passive: l1
        }) : e.addEventListener(n, t, !0) : l1 !== void 0 ? e.addEventListener(n, t, {
            passive: l1
        }) : e.addEventListener(n, t, !1);
    }
    function Zo(e, n, t, r, l) {
        var i = r;
        if ((n & 1) == 0 && (n & 2) == 0 && r !== null) e: for(;;){
            if (r === null) return;
            var o = r.tag;
            if (o === 3 || o === 4) {
                var u = r.stateNode.containerInfo;
                if (u === l || u.nodeType === 8 && u.parentNode === l) break;
                if (o === 4) for(o = r.return; o !== null;){
                    var s = o.tag;
                    if ((s === 3 || s === 4) && (s = o.stateNode.containerInfo, s === l || s.nodeType === 8 && s.parentNode === l)) return;
                    o = o.return;
                }
                for(; u !== null;){
                    if (o = Ye(u), o === null) return;
                    if (s = o.tag, s === 5 || s === 6) {
                        r = i = o;
                        continue e;
                    }
                    u = u.parentNode;
                }
            }
            r = r.return;
        }
        Hs(function() {
            var d = i, y = nl(t), C = [];
            e: {
                var h = Eo.get(e);
                if (h !== void 0) {
                    var S = wl, k = e;
                    switch(e){
                        case "keypress":
                            if (Wt(t) === 0) break e;
                        case "keydown":
                        case "keyup":
                            S = Ea;
                            break;
                        case "focusin":
                            k = "focus", S = kl;
                            break;
                        case "focusout":
                            k = "blur", S = kl;
                            break;
                        case "beforeblur":
                        case "afterblur":
                            S = kl;
                            break;
                        case "click":
                            if (t.button === 2) break e;
                        case "auxclick":
                        case "dblclick":
                        case "mousedown":
                        case "mousemove":
                        case "mouseup":
                        case "mouseout":
                        case "mouseover":
                        case "contextmenu":
                            S = _o;
                            break;
                        case "drag":
                        case "dragend":
                        case "dragenter":
                        case "dragexit":
                        case "dragleave":
                        case "dragover":
                        case "dragstart":
                        case "drop":
                            S = aa;
                            break;
                        case "touchcancel":
                        case "touchend":
                        case "touchmove":
                        case "touchstart":
                            S = Ca;
                            break;
                        case yo:
                        case go:
                        case wo:
                            S = da;
                            break;
                        case So:
                            S = Na;
                            break;
                        case "scroll":
                            S = ua;
                            break;
                        case "wheel":
                            S = Ta;
                            break;
                        case "copy":
                        case "cut":
                        case "paste":
                            S = ma;
                            break;
                        case "gotpointercapture":
                        case "lostpointercapture":
                        case "pointercancel":
                        case "pointerdown":
                        case "pointermove":
                        case "pointerout":
                        case "pointerover":
                        case "pointerup":
                            S = Po;
                    }
                    var E = (n & 4) != 0, c = !E && e === "scroll", a = E ? h !== null ? h + "Capture" : null : h;
                    E = [];
                    for(var f = d, p; f !== null;){
                        p = f;
                        var m = p.stateNode;
                        if (p.tag === 5 && m !== null && (p = m, a !== null && (m = Vn(f, a), m != null && E.push(nt(f, m, p)))), c) break;
                        f = f.return;
                    }
                    0 < E.length && (h = new S(h, k, null, t, y), C.push({
                        event: h,
                        listeners: E
                    }));
                }
            }
            if ((n & 7) == 0) {
                e: {
                    if (h = e === "mouseover" || e === "pointerover", S = e === "mouseout" || e === "pointerout", h && (n & 16) == 0 && (k = t.relatedTarget || t.fromElement) && (Ye(k) || k[vn])) break e;
                    if ((S || h) && (h = y.window === y ? y : (h = y.ownerDocument) ? h.defaultView || h.parentWindow : window, S ? (k = t.relatedTarget || t.toElement, S = d, k = k ? Ye(k) : null, k !== null && (c = $e(k), k !== c || k.tag !== 5 && k.tag !== 6) && (k = null)) : (S = null, k = d), S !== k)) {
                        if (E = _o, m = "onMouseLeave", a = "onMouseEnter", f = "mouse", (e === "pointerout" || e === "pointerover") && (E = Po, m = "onPointerLeave", a = "onPointerEnter", f = "pointer"), c = S == null ? h : yn(S), p = k == null ? h : yn(k), h = new E(m, f + "leave", S, t, y), h.target = c, h.relatedTarget = p, m = null, Ye(y) === d && (E = new E(a, f + "enter", k, t, y), E.target = p, E.relatedTarget = c, m = E), c = m, S && k) n: {
                            for(E = S, a = k, f = 0, p = E; p; p = mn(p))f++;
                            for(p = 0, m = a; m; m = mn(m))p++;
                            for(; 0 < f - p;)E = mn(E), f--;
                            for(; 0 < p - f;)a = mn(a), p--;
                            for(; f--;){
                                if (E === a || a !== null && E === a.alternate) break n;
                                E = mn(E), a = mn(a);
                            }
                            E = null;
                        }
                        else E = null;
                        S !== null && Jo(C, h, S, E, !1), k !== null && c !== null && Jo(C, c, k, E, !0);
                    }
                }
                e: {
                    if (h = d ? yn(d) : window, S = h.nodeName && h.nodeName.toLowerCase(), S === "select" || S === "input" && h.type === "file") var _ = Ia;
                    else if (Ro(h)) if (Io) _ = Va;
                    else {
                        _ = ja;
                        var w = Fa;
                    }
                    else (S = h.nodeName) && S.toLowerCase() === "input" && (h.type === "checkbox" || h.type === "radio") && (_ = Ua);
                    if (_ && (_ = _(e, d))) {
                        Do(C, _, t, y);
                        break e;
                    }
                    w && w(e, h, d), e === "focusout" && (w = h._wrapperState) && w.controlled && h.type === "number" && Kr(h, "number", h.value);
                }
                switch(w = d ? yn(d) : window, e){
                    case "focusin":
                        (Ro(w) || w.contentEditable === "true") && (pn = w, Pl = d, bn = null);
                        break;
                    case "focusout":
                        bn = Pl = pn = null;
                        break;
                    case "mousedown":
                        Tl = !0;
                        break;
                    case "contextmenu":
                    case "mouseup":
                    case "dragend":
                        Tl = !1, Wo(C, t, y);
                        break;
                    case "selectionchange":
                        if (Wa) break;
                    case "keydown":
                    case "keyup":
                        Wo(C, t, y);
                }
                var N;
                if (Cl) e: {
                    switch(e){
                        case "compositionstart":
                            var T = "onCompositionStart";
                            break e;
                        case "compositionend":
                            T = "onCompositionEnd";
                            break e;
                        case "compositionupdate":
                            T = "onCompositionUpdate";
                            break e;
                    }
                    T = void 0;
                }
                else dn ? Oo(e, t) && (T = "onCompositionEnd") : e === "keydown" && t.keyCode === 229 && (T = "onCompositionStart");
                T && (To && t.locale !== "ko" && (dn || T !== "onCompositionStart" ? T === "onCompositionEnd" && dn && (N = xo()) : (Pe = y, gl = "value" in Pe ? Pe.value : Pe.textContent, dn = !0)), w = Gt(d, T), 0 < w.length && (T = new No(T, e, null, t, y), C.push({
                    event: T,
                    listeners: w
                }), N ? T.data = N : (N = Mo(t), N !== null && (T.data = N)))), (N = za ? Oa(e, t) : Ma(e, t)) && (d = Gt(d, "onBeforeInput"), 0 < d.length && (y = new No("onBeforeInput", "beforeinput", null, t, y), C.push({
                    event: y,
                    listeners: d
                }), y.data = N));
            }
            $o(C, n);
        });
    }
    function nt(e, n, t) {
        return {
            instance: e,
            listener: n,
            currentTarget: t
        };
    }
    function Gt(e, n) {
        for(var t = n + "Capture", r = []; e !== null;){
            var l = e, i = l.stateNode;
            l.tag === 5 && i !== null && (l = i, i = Vn(e, t), i != null && r.unshift(nt(e, i, l)), i = Vn(e, n), i != null && r.push(nt(e, i, l))), e = e.return;
        }
        return r;
    }
    function mn(e) {
        if (e === null) return null;
        do e = e.return;
        while (e && e.tag !== 5)
        return e || null;
    }
    function Jo(e, n, t, r, l) {
        for(var i = n._reactName, o = []; t !== null && t !== r;){
            var u = t, s = u.alternate, d = u.stateNode;
            if (s !== null && s === r) break;
            u.tag === 5 && d !== null && (u = d, l ? (s = Vn(t, i), s != null && o.unshift(nt(t, s, u))) : l || (s = Vn(t, i), s != null && o.push(nt(t, s, u)))), t = t.return;
        }
        o.length !== 0 && e.push({
            event: n,
            listeners: o
        });
    }
    function Zt() {
    }
    var zl = null, Ol = null;
    function qo(e, n) {
        switch(e){
            case "button":
            case "input":
            case "select":
            case "textarea":
                return !!n.autoFocus;
        }
        return !1;
    }
    function Ml(e, n) {
        return e === "textarea" || e === "option" || e === "noscript" || typeof n.children == "string" || typeof n.children == "number" || typeof n.dangerouslySetInnerHTML == "object" && n.dangerouslySetInnerHTML !== null && n.dangerouslySetInnerHTML.__html != null;
    }
    var bo = typeof setTimeout == "function" ? setTimeout : void 0, Aa = typeof clearTimeout == "function" ? clearTimeout : void 0;
    function Rl(e) {
        e.nodeType === 1 ? e.textContent = "" : e.nodeType === 9 && (e = e.body, e != null && (e.textContent = ""));
    }
    function hn(e) {
        for(; e != null; e = e.nextSibling){
            var n = e.nodeType;
            if (n === 1 || n === 3) break;
        }
        return e;
    }
    function eu(e) {
        e = e.previousSibling;
        for(var n = 0; e;){
            if (e.nodeType === 8) {
                var t = e.data;
                if (t === "$" || t === "$!" || t === "$?") {
                    if (n === 0) return e;
                    n--;
                } else t === "/$" && n++;
            }
            e = e.previousSibling;
        }
        return null;
    }
    var Dl = 0;
    function Qa(e) {
        return {
            $$typeof: Hr,
            toString: e,
            valueOf: e
        };
    }
    var Jt = Math.random().toString(36).slice(2), Te = "__reactFiber$" + Jt, qt = "__reactProps$" + Jt, vn = "__reactContainer$" + Jt, nu = "__reactEvents$" + Jt;
    function Ye(e) {
        var n = e[Te];
        if (n) return n;
        for(var t = e.parentNode; t;){
            if (n = t[vn] || t[Te]) {
                if (t = n.alternate, n.child !== null || t !== null && t.child !== null) for(e = eu(e); e !== null;){
                    if (t = e[Te]) return t;
                    e = eu(e);
                }
                return n;
            }
            e = t, t = e.parentNode;
        }
        return null;
    }
    function tt(e) {
        return e = e[Te] || e[vn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
    }
    function yn(e) {
        if (e.tag === 5 || e.tag === 6) return e.stateNode;
        throw Error(v(33));
    }
    function bt(e) {
        return e[qt] || null;
    }
    function tu(e) {
        var n = e[nu];
        return n === void 0 && (n = e[nu] = new Set), n;
    }
    var Il = [], gn = -1;
    function Le(e) {
        return {
            current: e
        };
    }
    function O(e) {
        0 > gn || (e.current = Il[gn], Il[gn] = null, gn--);
    }
    function R(e, n) {
        gn++, Il[gn] = e.current, e.current = n;
    }
    var ze = {
    }, W = Le(ze), K = Le(!1), Xe = ze;
    function wn(e, n) {
        var t = e.type.contextTypes;
        if (!t) return ze;
        var r = e.stateNode;
        if (r && r.__reactInternalMemoizedUnmaskedChildContext === n) return r.__reactInternalMemoizedMaskedChildContext;
        var l1 = {
        }, i;
        for(i in t)l1[i] = n[i];
        return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = n, e.__reactInternalMemoizedMaskedChildContext = l1), l1;
    }
    function G(e) {
        return e = e.childContextTypes, e != null;
    }
    function er() {
        O(K), O(W);
    }
    function ru(e, n, t) {
        if (W.current !== ze) throw Error(v(168));
        R(W, n), R(K, t);
    }
    function lu(e, n, t) {
        var r = e.stateNode;
        if (e = n.childContextTypes, typeof r.getChildContext != "function") return t;
        r = r.getChildContext();
        for(var l1 in r)if (!(l1 in e)) throw Error(v(108, tn(n) || "Unknown", l1));
        return M({
        }, t, r);
    }
    function nr(e) {
        return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || ze, Xe = W.current, R(W, e), R(K, K.current), !0;
    }
    function iu(e, n, t) {
        var r = e.stateNode;
        if (!r) throw Error(v(169));
        t ? (e = lu(e, n, Xe), r.__reactInternalMemoizedMergedChildContext = e, O(K), O(W), R(W, e)) : O(K), R(K, t);
    }
    var Fl = null, Ke = null, $a = U.unstable_runWithPriority, jl = U.unstable_scheduleCallback, Ul = U.unstable_cancelCallback, Ya = U.unstable_shouldYield, ou = U.unstable_requestPaint, Vl = U.unstable_now, Xa = U.unstable_getCurrentPriorityLevel, tr = U.unstable_ImmediatePriority, uu = U.unstable_UserBlockingPriority, su = U.unstable_NormalPriority, au = U.unstable_LowPriority, fu = U.unstable_IdlePriority, Bl = {
    }, Ka = ou !== void 0 ? ou : function() {
    }, he = null, rr = null, Hl = !1, cu = Vl(), A = 10000 > cu ? Vl : function() {
        return Vl() - cu;
    };
    function Sn() {
        switch(Xa()){
            case tr:
                return 99;
            case uu:
                return 98;
            case su:
                return 97;
            case au:
                return 96;
            case fu:
                return 95;
            default:
                throw Error(v(332));
        }
    }
    function du(e) {
        switch(e){
            case 99:
                return tr;
            case 98:
                return uu;
            case 97:
                return su;
            case 96:
                return au;
            case 95:
                return fu;
            default:
                throw Error(v(332));
        }
    }
    function Ge(e, n) {
        return e = du(e), $a(e, n);
    }
    function rt(e, n, t) {
        return e = du(e), jl(e, n, t);
    }
    function ae() {
        if (rr !== null) {
            var e = rr;
            rr = null, Ul(e);
        }
        pu();
    }
    function pu() {
        if (!Hl && he !== null) {
            Hl = !0;
            var e = 0;
            try {
                var n = he;
                Ge(99, function() {
                    for(; e < n.length; e++){
                        var t = n[e];
                        do t = t(!0);
                        while (t !== null)
                    }
                }), he = null;
            } catch (t) {
                throw he !== null && (he = he.slice(e + 1)), jl(tr, ae), t;
            } finally{
                Hl = !1;
            }
        }
    }
    var Ga = We.ReactCurrentBatchConfig;
    function oe(e, n) {
        if (e && e.defaultProps) {
            n = M({
            }, n), e = e.defaultProps;
            for(var t in e)n[t] === void 0 && (n[t] = e[t]);
            return n;
        }
        return n;
    }
    var lr = Le(null), ir = null, En = null, or = null;
    function Wl() {
        or = En = ir = null;
    }
    function Al(e) {
        var n = lr.current;
        O(lr), e.type._context._currentValue = n;
    }
    function mu(e, n) {
        for(; e !== null;){
            var t = e.alternate;
            if ((e.childLanes & n) === n) {
                if (t === null || (t.childLanes & n) === n) break;
                t.childLanes |= n;
            } else e.childLanes |= n, t !== null && (t.childLanes |= n);
            e = e.return;
        }
    }
    function kn(e, n) {
        ir = e, or = En = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & n) != 0 && (ue = !0), e.firstContext = null);
    }
    function ne(e, n) {
        if (or !== e && n !== !1 && n !== 0) if ((typeof n != "number" || n === 1073741823) && (or = e, n = 1073741823), n = {
            context: e,
            observedBits: n,
            next: null
        }, En === null) {
            if (ir === null) throw Error(v(308));
            En = n, ir.dependencies = {
                lanes: 0,
                firstContext: n,
                responders: null
            };
        } else En = En.next = n;
        return e._currentValue;
    }
    var Oe = !1;
    function Ql(e) {
        e.updateQueue = {
            baseState: e.memoizedState,
            firstBaseUpdate: null,
            lastBaseUpdate: null,
            shared: {
                pending: null
            },
            effects: null
        };
    }
    function hu(e, n) {
        e = e.updateQueue, n.updateQueue === e && (n.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            effects: e.effects
        });
    }
    function Me(e, n) {
        return {
            eventTime: e,
            lane: n,
            tag: 0,
            payload: null,
            callback: null,
            next: null
        };
    }
    function Re(e, n) {
        if (e = e.updateQueue, e !== null) {
            e = e.shared;
            var t = e.pending;
            t === null ? n.next = n : (n.next = t.next, t.next = n), e.pending = n;
        }
    }
    function vu(e, n) {
        var t = e.updateQueue, r = e.alternate;
        if (r !== null && (r = r.updateQueue, t === r)) {
            var l = null, i = null;
            if (t = t.firstBaseUpdate, t !== null) {
                do {
                    var o = {
                        eventTime: t.eventTime,
                        lane: t.lane,
                        tag: t.tag,
                        payload: t.payload,
                        callback: t.callback,
                        next: null
                    };
                    i === null ? l = i = o : i = i.next = o, t = t.next;
                }while (t !== null)
                i === null ? l = i = n : i = i.next = n;
            } else l = i = n;
            t = {
                baseState: r.baseState,
                firstBaseUpdate: l,
                lastBaseUpdate: i,
                shared: r.shared,
                effects: r.effects
            }, e.updateQueue = t;
            return;
        }
        e = t.lastBaseUpdate, e === null ? t.firstBaseUpdate = n : e.next = n, t.lastBaseUpdate = n;
    }
    function lt(e, n, t, r) {
        var l1 = e.updateQueue;
        Oe = !1;
        var i = l1.firstBaseUpdate, o = l1.lastBaseUpdate, u = l1.shared.pending;
        if (u !== null) {
            l1.shared.pending = null;
            var s = u, d = s.next;
            s.next = null, o === null ? i = d : o.next = d, o = s;
            var y = e.alternate;
            if (y !== null) {
                y = y.updateQueue;
                var C = y.lastBaseUpdate;
                C !== o && (C === null ? y.firstBaseUpdate = d : C.next = d, y.lastBaseUpdate = s);
            }
        }
        if (i !== null) {
            C = l1.baseState, o = 0, y = d = s = null;
            do {
                u = i.lane;
                var h = i.eventTime;
                if ((r & u) === u) {
                    y !== null && (y = y.next = {
                        eventTime: h,
                        lane: 0,
                        tag: i.tag,
                        payload: i.payload,
                        callback: i.callback,
                        next: null
                    });
                    e: {
                        var S = e, k = i;
                        switch(u = n, h = t, k.tag){
                            case 1:
                                if (S = k.payload, typeof S == "function") {
                                    C = S.call(h, C, u);
                                    break e;
                                }
                                C = S;
                                break e;
                            case 3:
                                S.flags = S.flags & -4097 | 64;
                            case 0:
                                if (S = k.payload, u = typeof S == "function" ? S.call(h, C, u) : S, u == null) break e;
                                C = M({
                                }, C, u);
                                break e;
                            case 2:
                                Oe = !0;
                        }
                    }
                    i.callback !== null && (e.flags |= 32, u = l1.effects, u === null ? l1.effects = [
                        i
                    ] : u.push(i));
                } else h = {
                    eventTime: h,
                    lane: u,
                    tag: i.tag,
                    payload: i.payload,
                    callback: i.callback,
                    next: null
                }, y === null ? (d = y = h, s = C) : y = y.next = h, o |= u;
                if (i = i.next, i === null) {
                    if (u = l1.shared.pending, u === null) break;
                    i = u.next, u.next = null, l1.lastBaseUpdate = u, l1.shared.pending = null;
                }
            }while (1)
            y === null && (s = C), l1.baseState = s, l1.firstBaseUpdate = d, l1.lastBaseUpdate = y, vt |= o, e.lanes = o, e.memoizedState = C;
        }
    }
    function yu(e, n, t) {
        if (e = n.effects, n.effects = null, e !== null) for(n = 0; n < e.length; n++){
            var r = e[n], l = r.callback;
            if (l !== null) {
                if (r.callback = null, r = t, typeof l != "function") throw Error(v(191, l));
                l.call(r);
            }
        }
    }
    var gu = new _t.Component().refs;
    function ur(e, n, t, r) {
        n = e.memoizedState, t = t(r, n), t = t == null ? n : M({
        }, n, t), e.memoizedState = t, e.lanes === 0 && (e.updateQueue.baseState = t);
    }
    var sr = {
        isMounted: function(e) {
            return (e = e._reactInternals) ? $e(e) === e : !1;
        },
        enqueueSetState: function(e, n, t) {
            e = e._reactInternals;
            var r = b(), l1 = Fe(e), i = Me(r, l1);
            i.payload = n, t != null && (i.callback = t), Re(e, i), je(e, l1, r);
        },
        enqueueReplaceState: function(e, n, t) {
            e = e._reactInternals;
            var r = b(), l1 = Fe(e), i = Me(r, l1);
            i.tag = 1, i.payload = n, t != null && (i.callback = t), Re(e, i), je(e, l1, r);
        },
        enqueueForceUpdate: function(e, n) {
            e = e._reactInternals;
            var t = b(), r = Fe(e), l1 = Me(t, r);
            l1.tag = 2, n != null && (l1.callback = n), Re(e, l1), je(e, r, t);
        }
    };
    function wu(e, n, t, r, l, i, o) {
        return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : n.prototype && n.prototype.isPureReactComponent ? !qn(t, r) || !qn(l, i) : !0;
    }
    function Su(e, n, t) {
        var r = !1, l1 = ze, i = n.contextType;
        return typeof i == "object" && i !== null ? i = ne(i) : (l1 = G(n) ? Xe : W.current, r = n.contextTypes, i = (r = r != null) ? wn(e, l1) : ze), n = new n(t, i), e.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = sr, e.stateNode = n, n._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l1, e.__reactInternalMemoizedMaskedChildContext = i), n;
    }
    function Eu(e, n, t, r) {
        e = n.state, typeof n.componentWillReceiveProps == "function" && n.componentWillReceiveProps(t, r), typeof n.UNSAFE_componentWillReceiveProps == "function" && n.UNSAFE_componentWillReceiveProps(t, r), n.state !== e && sr.enqueueReplaceState(n, n.state, null);
    }
    function $l(e, n, t, r) {
        var l1 = e.stateNode;
        l1.props = t, l1.state = e.memoizedState, l1.refs = gu, Ql(e);
        var i = n.contextType;
        typeof i == "object" && i !== null ? l1.context = ne(i) : (i = G(n) ? Xe : W.current, l1.context = wn(e, i)), lt(e, t, l1, r), l1.state = e.memoizedState, i = n.getDerivedStateFromProps, typeof i == "function" && (ur(e, n, i, t), l1.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof l1.getSnapshotBeforeUpdate == "function" || typeof l1.UNSAFE_componentWillMount != "function" && typeof l1.componentWillMount != "function" || (n = l1.state, typeof l1.componentWillMount == "function" && l1.componentWillMount(), typeof l1.UNSAFE_componentWillMount == "function" && l1.UNSAFE_componentWillMount(), n !== l1.state && sr.enqueueReplaceState(l1, l1.state, null), lt(e, t, l1, r), l1.state = e.memoizedState), typeof l1.componentDidMount == "function" && (e.flags |= 4);
    }
    var ar = Array.isArray;
    function it(e, n, t) {
        if (e = t.ref, e !== null && typeof e != "function" && typeof e != "object") {
            if (t._owner) {
                if (t = t._owner, t) {
                    if (t.tag !== 1) throw Error(v(309));
                    var r = t.stateNode;
                }
                if (!r) throw Error(v(147, e));
                var l = "" + e;
                return n !== null && n.ref !== null && typeof n.ref == "function" && n.ref._stringRef === l ? n.ref : (n = function(i) {
                    var o = r.refs;
                    o === gu && (o = r.refs = {
                    }), i === null ? delete o[l] : o[l] = i;
                }, n._stringRef = l, n);
            }
            if (typeof e != "string") throw Error(v(284));
            if (!t._owner) throw Error(v(290, e));
        }
        return e;
    }
    function fr(e, n) {
        if (e.type !== "textarea") throw Error(v(31, Object.prototype.toString.call(n) === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : n));
    }
    function ku(e) {
        function n(c, a) {
            if (e) {
                var f = c.lastEffect;
                f !== null ? (f.nextEffect = a, c.lastEffect = a) : c.firstEffect = c.lastEffect = a, a.nextEffect = null, a.flags = 8;
            }
        }
        function t(c, a) {
            if (!e) return null;
            for(; a !== null;)n(c, a), a = a.sibling;
            return null;
        }
        function r(c, a) {
            for(c = new Map; a !== null;)a.key !== null ? c.set(a.key, a) : c.set(a.index, a), a = a.sibling;
            return c;
        }
        function l(c, a) {
            return c = Be(c, a), c.index = 0, c.sibling = null, c;
        }
        function i(c, a, f) {
            return c.index = f, e ? (f = c.alternate, f !== null ? (f = f.index, f < a ? (c.flags = 2, a) : f) : (c.flags = 2, a)) : a;
        }
        function o(c) {
            return e && c.alternate === null && (c.flags = 2), c;
        }
        function u(c, a, f, p) {
            return a === null || a.tag !== 6 ? (a = Pi(f, c.mode, p), a.return = c, a) : (a = l(a, f), a.return = c, a);
        }
        function s(c, a, f, p) {
            return a !== null && a.elementType === f.type ? (p = l(a, f.props), p.ref = it(c, a, f), p.return = c, p) : (p = Tr(f.type, f.key, f.props, null, c.mode, p), p.ref = it(c, a, f), p.return = c, p);
        }
        function d(c, a, f, p) {
            return a === null || a.tag !== 4 || a.stateNode.containerInfo !== f.containerInfo || a.stateNode.implementation !== f.implementation ? (a = Ti(f, c.mode, p), a.return = c, a) : (a = l(a, f.children || []), a.return = c, a);
        }
        function y(c, a, f, p, m) {
            return a === null || a.tag !== 7 ? (a = zn(f, c.mode, p, m), a.return = c, a) : (a = l(a, f), a.return = c, a);
        }
        function C(c, a, f) {
            if (typeof a == "string" || typeof a == "number") return a = Pi("" + a, c.mode, f), a.return = c, a;
            if (typeof a == "object" && a !== null) {
                switch(a.$$typeof){
                    case Mn:
                        return f = Tr(a.type, a.key, a.props, null, c.mode, f), f.ref = it(c, null, a), f.return = c, f;
                    case Ae:
                        return a = Ti(a, c.mode, f), a.return = c, a;
                }
                if (ar(a) || In(a)) return a = zn(a, c.mode, f, null), a.return = c, a;
                fr(c, a);
            }
            return null;
        }
        function h(c, a, f, p) {
            var m = a !== null ? a.key : null;
            if (typeof f == "string" || typeof f == "number") return m !== null ? null : u(c, a, "" + f, p);
            if (typeof f == "object" && f !== null) {
                switch(f.$$typeof){
                    case Mn:
                        return f.key === m ? f.type === Ee ? y(c, a, f.props.children, p, m) : s(c, a, f, p) : null;
                    case Ae:
                        return f.key === m ? d(c, a, f, p) : null;
                }
                if (ar(f) || In(f)) return m !== null ? null : y(c, a, f, p, null);
                fr(c, f);
            }
            return null;
        }
        function S(c, a, f, p, m) {
            if (typeof p == "string" || typeof p == "number") return c = c.get(f) || null, u(a, c, "" + p, m);
            if (typeof p == "object" && p !== null) {
                switch(p.$$typeof){
                    case Mn:
                        return c = c.get(p.key === null ? f : p.key) || null, p.type === Ee ? y(a, c, p.props.children, m, p.key) : s(a, c, p, m);
                    case Ae:
                        return c = c.get(p.key === null ? f : p.key) || null, d(a, c, p, m);
                }
                if (ar(p) || In(p)) return c = c.get(f) || null, y(a, c, p, m, null);
                fr(a, p);
            }
            return null;
        }
        function k(c, a, f, p) {
            for(var m = null, _ = null, w = a, N = a = 0, T = null; w !== null && N < f.length; N++){
                w.index > N ? (T = w, w = null) : T = w.sibling;
                var P = h(c, w, f[N], p);
                if (P === null) {
                    w === null && (w = T);
                    break;
                }
                e && w && P.alternate === null && n(c, w), a = i(P, a, N), _ === null ? m = P : _.sibling = P, _ = P, w = T;
            }
            if (N === f.length) return t(c, w), m;
            if (w === null) {
                for(; N < f.length; N++)w = C(c, f[N], p), w !== null && (a = i(w, a, N), _ === null ? m = w : _.sibling = w, _ = w);
                return m;
            }
            for(w = r(c, w); N < f.length; N++)T = S(w, c, N, f[N], p), T !== null && (e && T.alternate !== null && w.delete(T.key === null ? N : T.key), a = i(T, a, N), _ === null ? m = T : _.sibling = T, _ = T);
            return e && w.forEach(function(Se) {
                return n(c, Se);
            }), m;
        }
        function E(c, a, f, p) {
            var m = In(f);
            if (typeof m != "function") throw Error(v(150));
            if (f = m.call(f), f == null) throw Error(v(151));
            for(var _ = m = null, w = a, N = a = 0, T = null, P = f.next(); w !== null && !P.done; N++, P = f.next()){
                w.index > N ? (T = w, w = null) : T = w.sibling;
                var Se = h(c, w, P.value, p);
                if (Se === null) {
                    w === null && (w = T);
                    break;
                }
                e && w && Se.alternate === null && n(c, w), a = i(Se, a, N), _ === null ? m = Se : _.sibling = Se, _ = Se, w = T;
            }
            if (P.done) return t(c, w), m;
            if (w === null) {
                for(; !P.done; N++, P = f.next())P = C(c, P.value, p), P !== null && (a = i(P, a, N), _ === null ? m = P : _.sibling = P, _ = P);
                return m;
            }
            for(w = r(c, w); !P.done; N++, P = f.next())P = S(w, c, N, P.value, p), P !== null && (e && P.alternate !== null && w.delete(P.key === null ? N : P.key), a = i(P, a, N), _ === null ? m = P : _.sibling = P, _ = P);
            return e && w.forEach(function(Cs) {
                return n(c, Cs);
            }), m;
        }
        return function(c, a, f, p) {
            var m = typeof f == "object" && f !== null && f.type === Ee && f.key === null;
            m && (f = f.props.children);
            var _ = typeof f == "object" && f !== null;
            if (_) switch(f.$$typeof){
                case Mn:
                    e: {
                        for(_ = f.key, m = a; m !== null;){
                            if (m.key === _) {
                                switch(m.tag){
                                    case 7:
                                        if (f.type === Ee) {
                                            t(c, m.sibling), a = l(m, f.props.children), a.return = c, c = a;
                                            break e;
                                        }
                                        break;
                                    default:
                                        if (m.elementType === f.type) {
                                            t(c, m.sibling), a = l(m, f.props), a.ref = it(c, m, f), a.return = c, c = a;
                                            break e;
                                        }
                                }
                                t(c, m);
                                break;
                            } else n(c, m);
                            m = m.sibling;
                        }
                        f.type === Ee ? (a = zn(f.props.children, c.mode, p, f.key), a.return = c, c = a) : (p = Tr(f.type, f.key, f.props, null, c.mode, p), p.ref = it(c, a, f), p.return = c, c = p);
                    }
                    return o(c);
                case Ae:
                    e: {
                        for(m = f.key; a !== null;){
                            if (a.key === m) if (a.tag === 4 && a.stateNode.containerInfo === f.containerInfo && a.stateNode.implementation === f.implementation) {
                                t(c, a.sibling), a = l(a, f.children || []), a.return = c, c = a;
                                break e;
                            } else {
                                t(c, a);
                                break;
                            }
                            else n(c, a);
                            a = a.sibling;
                        }
                        a = Ti(f, c.mode, p), a.return = c, c = a;
                    }
                    return o(c);
            }
            if (typeof f == "string" || typeof f == "number") return f = "" + f, a !== null && a.tag === 6 ? (t(c, a.sibling), a = l(a, f), a.return = c, c = a) : (t(c, a), a = Pi(f, c.mode, p), a.return = c, c = a), o(c);
            if (ar(f)) return k(c, a, f, p);
            if (In(f)) return E(c, a, f, p);
            if (_ && fr(c, f), typeof f == "undefined" && !m) switch(c.tag){
                case 1:
                case 22:
                case 0:
                case 11:
                case 15:
                    throw Error(v(152, tn(c.type) || "Component"));
            }
            return t(c, a);
        };
    }
    var cr = ku(!0), xu = ku(!1), ot = {
    }, fe = Le(ot), ut = Le(ot), st = Le(ot);
    function Ze(e) {
        if (e === ot) throw Error(v(174));
        return e;
    }
    function Yl(e, n) {
        switch(R(st, n), R(ut, e), R(fe, ot), e = n.nodeType, e){
            case 9:
            case 11:
                n = (n = n.documentElement) ? n.namespaceURI : qr(null, "");
                break;
            default:
                e = e === 8 ? n.parentNode : n, n = e.namespaceURI || null, e = e.tagName, n = qr(n, e);
        }
        O(fe), R(fe, n);
    }
    function xn() {
        O(fe), O(ut), O(st);
    }
    function Cu(e) {
        Ze(st.current);
        var n = Ze(fe.current), t = qr(n, e.type);
        n !== t && (R(ut, e), R(fe, t));
    }
    function Xl(e) {
        ut.current === e && (O(fe), O(ut));
    }
    var D = Le(0);
    function dr(e) {
        for(var n = e; n !== null;){
            if (n.tag === 13) {
                var t = n.memoizedState;
                if (t !== null && (t = t.dehydrated, t === null || t.data === "$?" || t.data === "$!")) return n;
            } else if (n.tag === 19 && n.memoizedProps.revealOrder !== void 0) {
                if ((n.flags & 64) != 0) return n;
            } else if (n.child !== null) {
                n.child.return = n, n = n.child;
                continue;
            }
            if (n === e) break;
            for(; n.sibling === null;){
                if (n.return === null || n.return === e) return null;
                n = n.return;
            }
            n.sibling.return = n.return, n = n.sibling;
        }
        return null;
    }
    var ve = null, De = null, ce = !1;
    function _u(e, n) {
        var t = le(5, null, null, 0);
        t.elementType = "DELETED", t.type = "DELETED", t.stateNode = n, t.return = e, t.flags = 8, e.lastEffect !== null ? (e.lastEffect.nextEffect = t, e.lastEffect = t) : e.firstEffect = e.lastEffect = t;
    }
    function Nu(e, n) {
        switch(e.tag){
            case 5:
                var t = e.type;
                return n = n.nodeType !== 1 || t.toLowerCase() !== n.nodeName.toLowerCase() ? null : n, n !== null ? (e.stateNode = n, !0) : !1;
            case 6:
                return n = e.pendingProps === "" || n.nodeType !== 3 ? null : n, n !== null ? (e.stateNode = n, !0) : !1;
            case 13:
                return !1;
            default:
                return !1;
        }
    }
    function Kl(e) {
        if (ce) {
            var n = De;
            if (n) {
                var t = n;
                if (!Nu(e, n)) {
                    if (n = hn(t.nextSibling), !n || !Nu(e, n)) {
                        e.flags = e.flags & -1025 | 2, ce = !1, ve = e;
                        return;
                    }
                    _u(ve, t);
                }
                ve = e, De = hn(n.firstChild);
            } else e.flags = e.flags & -1025 | 2, ce = !1, ve = e;
        }
    }
    function Pu(e) {
        for(e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;)e = e.return;
        ve = e;
    }
    function pr(e) {
        if (e !== ve) return !1;
        if (!ce) return Pu(e), ce = !0, !1;
        var n = e.type;
        if (e.tag !== 5 || n !== "head" && n !== "body" && !Ml(n, e.memoizedProps)) for(n = De; n;)_u(e, n), n = hn(n.nextSibling);
        if (Pu(e), e.tag === 13) {
            if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(v(317));
            e: {
                for(e = e.nextSibling, n = 0; e;){
                    if (e.nodeType === 8) {
                        var t = e.data;
                        if (t === "/$") {
                            if (n === 0) {
                                De = hn(e.nextSibling);
                                break e;
                            }
                            n--;
                        } else t !== "$" && t !== "$!" && t !== "$?" || n++;
                    }
                    e = e.nextSibling;
                }
                De = null;
            }
        } else De = ve ? hn(e.stateNode.nextSibling) : null;
        return !0;
    }
    function Gl() {
        De = ve = null, ce = !1;
    }
    var Cn = [];
    function Zl() {
        for(var e1 = 0; e1 < Cn.length; e1++)Cn[e1]._workInProgressVersionPrimary = null;
        Cn.length = 0;
    }
    var at = We.ReactCurrentDispatcher, te = We.ReactCurrentBatchConfig, ft = 0, I = null, Q = null, B = null, mr = !1, ct = !1;
    function Z() {
        throw Error(v(321));
    }
    function Jl(e, n) {
        if (n === null) return !1;
        for(var t = 0; t < n.length && t < e.length; t++)if (!ee(e[t], n[t])) return !1;
        return !0;
    }
    function ql(e, n, t, r, l, i) {
        if (ft = i, I = n, n.memoizedState = null, n.updateQueue = null, n.lanes = 0, at.current = e === null || e.memoizedState === null ? Ja : qa, e = t(r, l), ct) {
            i = 0;
            do {
                if (ct = !1, !(25 > i)) throw Error(v(301));
                i += 1, B = Q = null, n.updateQueue = null, at.current = ba, e = t(r, l);
            }while (ct)
        }
        if (at.current = gr, n = Q !== null && Q.next !== null, ft = 0, B = Q = I = null, mr = !1, n) throw Error(v(300));
        return e;
    }
    function Je() {
        var e1 = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null
        };
        return B === null ? I.memoizedState = B = e1 : B = B.next = e1, B;
    }
    function qe() {
        if (Q === null) {
            var e = I.alternate;
            e = e !== null ? e.memoizedState : null;
        } else e = Q.next;
        var n = B === null ? I.memoizedState : B.next;
        if (n !== null) B = n, Q = e;
        else {
            if (e === null) throw Error(v(310));
            Q = e, e = {
                memoizedState: Q.memoizedState,
                baseState: Q.baseState,
                baseQueue: Q.baseQueue,
                queue: Q.queue,
                next: null
            }, B === null ? I.memoizedState = B = e : B = B.next = e;
        }
        return B;
    }
    function de(e, n) {
        return typeof n == "function" ? n(e) : n;
    }
    function dt(e) {
        var n = qe(), t = n.queue;
        if (t === null) throw Error(v(311));
        t.lastRenderedReducer = e;
        var r = Q, l1 = r.baseQueue, i = t.pending;
        if (i !== null) {
            if (l1 !== null) {
                var o = l1.next;
                l1.next = i.next, i.next = o;
            }
            r.baseQueue = l1 = i, t.pending = null;
        }
        if (l1 !== null) {
            l1 = l1.next, r = r.baseState;
            var u = o = i = null, s = l1;
            do {
                var d = s.lane;
                if ((ft & d) === d) u !== null && (u = u.next = {
                    lane: 0,
                    action: s.action,
                    eagerReducer: s.eagerReducer,
                    eagerState: s.eagerState,
                    next: null
                }), r = s.eagerReducer === e ? s.eagerState : e(r, s.action);
                else {
                    var y = {
                        lane: d,
                        action: s.action,
                        eagerReducer: s.eagerReducer,
                        eagerState: s.eagerState,
                        next: null
                    };
                    u === null ? (o = u = y, i = r) : u = u.next = y, I.lanes |= d, vt |= d;
                }
                s = s.next;
            }while (s !== null && s !== l1)
            u === null ? i = r : u.next = o, ee(r, n.memoizedState) || (ue = !0), n.memoizedState = r, n.baseState = i, n.baseQueue = u, t.lastRenderedState = r;
        }
        return [
            n.memoizedState,
            t.dispatch
        ];
    }
    function pt(e) {
        var n = qe(), t = n.queue;
        if (t === null) throw Error(v(311));
        t.lastRenderedReducer = e;
        var r = t.dispatch, l1 = t.pending, i = n.memoizedState;
        if (l1 !== null) {
            t.pending = null;
            var o = l1 = l1.next;
            do i = e(i, o.action), o = o.next;
            while (o !== l1)
            ee(i, n.memoizedState) || (ue = !0), n.memoizedState = i, n.baseQueue === null && (n.baseState = i), t.lastRenderedState = i;
        }
        return [
            i,
            r
        ];
    }
    function Tu(e, n, t) {
        var r = n._getVersion;
        r = r(n._source);
        var l1 = n._workInProgressVersionPrimary;
        if (l1 !== null ? e = l1 === r : (e = e.mutableReadLanes, (e = (ft & e) === e) && (n._workInProgressVersionPrimary = r, Cn.push(n))), e) return t(n._source);
        throw Cn.push(n), Error(v(350));
    }
    function Lu(e, n, t, r) {
        var l1 = X;
        if (l1 === null) throw Error(v(349));
        var i = n._getVersion, o = i(n._source), u = at.current, s1 = u.useState(function() {
            return Tu(l1, n, t);
        }), d = s1[1], y3 = s1[0];
        s1 = B;
        var C1 = e.memoizedState, h4 = C1.refs, S4 = h4.getSnapshot, k1 = C1.source;
        C1 = C1.subscribe;
        var E = I;
        return e.memoizedState = {
            refs: h4,
            source: n,
            subscribe: r
        }, u.useEffect(function() {
            h4.getSnapshot = t, h4.setSnapshot = d;
            var c = i(n._source);
            if (!ee(o, c)) {
                c = t(n._source), ee(y3, c) || (d(c), c = Fe(E), l1.mutableReadLanes |= c & l1.pendingLanes), c = l1.mutableReadLanes, l1.entangledLanes |= c;
                for(var a = l1.entanglements, f = c; 0 < f;){
                    var p = 31 - Ne(f), m = 1 << p;
                    a[p] |= c, f &= ~m;
                }
            }
        }, [
            t,
            n,
            r
        ]), u.useEffect(function() {
            return r(n._source, function() {
                var c = h4.getSnapshot, a = h4.setSnapshot;
                try {
                    a(c(n._source));
                    var f = Fe(E);
                    l1.mutableReadLanes |= f & l1.pendingLanes;
                } catch (p) {
                    a(function() {
                        throw p;
                    });
                }
            });
        }, [
            n,
            r
        ]), ee(S4, t) && ee(k1, n) && ee(C1, r) || (e = {
            pending: null,
            dispatch: null,
            lastRenderedReducer: de,
            lastRenderedState: y3
        }, e.dispatch = d = ti.bind(null, I, e), s1.queue = e, s1.baseQueue = null, y3 = Tu(l1, n, t), s1.memoizedState = s1.baseState = y3), y3;
    }
    function zu(e, n, t) {
        var r = qe();
        return Lu(r, e, n, t);
    }
    function mt(e) {
        var n = Je();
        return typeof e == "function" && (e = e()), n.memoizedState = n.baseState = e, e = n.queue = {
            pending: null,
            dispatch: null,
            lastRenderedReducer: de,
            lastRenderedState: e
        }, e = e.dispatch = ti.bind(null, I, e), [
            n.memoizedState,
            e
        ];
    }
    function hr(e, n, t, r) {
        return e = {
            tag: e,
            create: n,
            destroy: t,
            deps: r,
            next: null
        }, n = I.updateQueue, n === null ? (n = {
            lastEffect: null
        }, I.updateQueue = n, n.lastEffect = e.next = e) : (t = n.lastEffect, t === null ? n.lastEffect = e.next = e : (r = t.next, t.next = e, e.next = r, n.lastEffect = e)), e;
    }
    function Ou(e) {
        var n = Je();
        return e = {
            current: e
        }, n.memoizedState = e;
    }
    function vr() {
        return qe().memoizedState;
    }
    function bl(e, n, t, r) {
        var l1 = Je();
        I.flags |= e, l1.memoizedState = hr(1 | n, t, void 0, r === void 0 ? null : r);
    }
    function ei(e, n, t, r) {
        var l1 = qe();
        r = r === void 0 ? null : r;
        var i = void 0;
        if (Q !== null) {
            var o = Q.memoizedState;
            if (i = o.destroy, r !== null && Jl(r, o.deps)) {
                hr(n, t, i, r);
                return;
            }
        }
        I.flags |= e, l1.memoizedState = hr(1 | n, t, i, r);
    }
    function Mu(e, n) {
        return bl(516, 4, e, n);
    }
    function yr(e, n) {
        return ei(516, 4, e, n);
    }
    function Ru(e, n) {
        return ei(4, 2, e, n);
    }
    function Du(e, n) {
        if (typeof n == "function") return e = e(), n(e), function() {
            n(null);
        };
        if (n != null) return e = e(), n.current = e, function() {
            n.current = null;
        };
    }
    function Iu(e, n, t) {
        return t = t != null ? t.concat([
            e
        ]) : null, ei(4, 2, Du.bind(null, n, e), t);
    }
    function ni() {
    }
    function Fu(e, n) {
        var t = qe();
        n = n === void 0 ? null : n;
        var r = t.memoizedState;
        return r !== null && n !== null && Jl(n, r[1]) ? r[0] : (t.memoizedState = [
            e,
            n
        ], e);
    }
    function ju(e, n) {
        var t = qe();
        n = n === void 0 ? null : n;
        var r = t.memoizedState;
        return r !== null && n !== null && Jl(n, r[1]) ? r[0] : (e = e(), t.memoizedState = [
            e,
            n
        ], e);
    }
    function Za(e, n) {
        var t = Sn();
        Ge(98 > t ? 98 : t, function() {
            e(!0);
        }), Ge(97 < t ? 97 : t, function() {
            var r = te.transition;
            te.transition = 1;
            try {
                e(!1), n();
            } finally{
                te.transition = r;
            }
        });
    }
    function ti(e, n, t) {
        var r = b(), l1 = Fe(e), i = {
            lane: l1,
            action: t,
            eagerReducer: null,
            eagerState: null,
            next: null
        }, o = n.pending;
        if (o === null ? i.next = i : (i.next = o.next, o.next = i), n.pending = i, o = e.alternate, e === I || o !== null && o === I) ct = mr = !0;
        else {
            if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = n.lastRenderedReducer, o !== null)) try {
                var u = n.lastRenderedState, s = o(u, t);
                if (i.eagerReducer = o, i.eagerState = s, ee(s, u)) return;
            } catch (d) {
            } finally{
            }
            je(e, l1, r);
        }
    }
    var gr = {
        readContext: ne,
        useCallback: Z,
        useContext: Z,
        useEffect: Z,
        useImperativeHandle: Z,
        useLayoutEffect: Z,
        useMemo: Z,
        useReducer: Z,
        useRef: Z,
        useState: Z,
        useDebugValue: Z,
        useDeferredValue: Z,
        useTransition: Z,
        useMutableSource: Z,
        useOpaqueIdentifier: Z,
        unstable_isNewReconciler: !1
    }, Ja = {
        readContext: ne,
        useCallback: function(e, n) {
            return Je().memoizedState = [
                e,
                n === void 0 ? null : n
            ], e;
        },
        useContext: ne,
        useEffect: Mu,
        useImperativeHandle: function(e, n, t) {
            return t = t != null ? t.concat([
                e
            ]) : null, bl(4, 2, Du.bind(null, n, e), t);
        },
        useLayoutEffect: function(e, n) {
            return bl(4, 2, e, n);
        },
        useMemo: function(e, n) {
            var t = Je();
            return n = n === void 0 ? null : n, e = e(), t.memoizedState = [
                e,
                n
            ], e;
        },
        useReducer: function(e, n, t) {
            var r = Je();
            return n = t !== void 0 ? t(n) : n, r.memoizedState = r.baseState = n, e = r.queue = {
                pending: null,
                dispatch: null,
                lastRenderedReducer: e,
                lastRenderedState: n
            }, e = e.dispatch = ti.bind(null, I, e), [
                r.memoizedState,
                e
            ];
        },
        useRef: Ou,
        useState: mt,
        useDebugValue: ni,
        useDeferredValue: function(e) {
            var n = mt(e), t = n[0], r = n[1];
            return Mu(function() {
                var l = te.transition;
                te.transition = 1;
                try {
                    r(e);
                } finally{
                    te.transition = l;
                }
            }, [
                e
            ]), t;
        },
        useTransition: function() {
            var e1 = mt(!1), n = e1[0];
            return e1 = Za.bind(null, e1[1]), Ou(e1), [
                e1,
                n
            ];
        },
        useMutableSource: function(e, n, t) {
            var r = Je();
            return r.memoizedState = {
                refs: {
                    getSnapshot: n,
                    setSnapshot: null
                },
                source: e,
                subscribe: t
            }, Lu(r, e, n, t);
        },
        useOpaqueIdentifier: function() {
            if (ce) {
                var e = !1, n = Qa(function() {
                    throw e || (e = !0, t("r:" + (Dl++).toString(36))), Error(v(355));
                }), t = mt(n)[1];
                return (I.mode & 2) == 0 && (I.flags |= 516, hr(5, function() {
                    t("r:" + (Dl++).toString(36));
                }, void 0, null)), n;
            }
            return n = "r:" + (Dl++).toString(36), mt(n), n;
        },
        unstable_isNewReconciler: !1
    }, qa = {
        readContext: ne,
        useCallback: Fu,
        useContext: ne,
        useEffect: yr,
        useImperativeHandle: Iu,
        useLayoutEffect: Ru,
        useMemo: ju,
        useReducer: dt,
        useRef: vr,
        useState: function() {
            return dt(de);
        },
        useDebugValue: ni,
        useDeferredValue: function(e) {
            var n = dt(de), t = n[0], r = n[1];
            return yr(function() {
                var l = te.transition;
                te.transition = 1;
                try {
                    r(e);
                } finally{
                    te.transition = l;
                }
            }, [
                e
            ]), t;
        },
        useTransition: function() {
            var e1 = dt(de)[0];
            return [
                vr().current,
                e1
            ];
        },
        useMutableSource: zu,
        useOpaqueIdentifier: function() {
            return dt(de)[0];
        },
        unstable_isNewReconciler: !1
    }, ba = {
        readContext: ne,
        useCallback: Fu,
        useContext: ne,
        useEffect: yr,
        useImperativeHandle: Iu,
        useLayoutEffect: Ru,
        useMemo: ju,
        useReducer: pt,
        useRef: vr,
        useState: function() {
            return pt(de);
        },
        useDebugValue: ni,
        useDeferredValue: function(e) {
            var n = pt(de), t = n[0], r = n[1];
            return yr(function() {
                var l = te.transition;
                te.transition = 1;
                try {
                    r(e);
                } finally{
                    te.transition = l;
                }
            }, [
                e
            ]), t;
        },
        useTransition: function() {
            var e1 = pt(de)[0];
            return [
                vr().current,
                e1
            ];
        },
        useMutableSource: zu,
        useOpaqueIdentifier: function() {
            return pt(de)[0];
        },
        unstable_isNewReconciler: !1
    }, ef = We.ReactCurrentOwner, ue = !1;
    function J(e, n, t, r) {
        n.child = e === null ? xu(n, null, t, r) : cr(n, e.child, t, r);
    }
    function Uu(e, n, t, r, l) {
        t = t.render;
        var i = n.ref;
        return kn(n, l), r = ql(e, n, t, r, i, l), e !== null && !ue ? (n.updateQueue = e.updateQueue, n.flags &= -517, e.lanes &= ~l, ye(e, n, l)) : (n.flags |= 1, J(e, n, r, l), n.child);
    }
    function Vu(e, n, t, r, l, i) {
        if (e === null) {
            var o = t.type;
            return typeof o == "function" && !_i(o) && o.defaultProps === void 0 && t.compare === null && t.defaultProps === void 0 ? (n.tag = 15, n.type = o, Bu(e, n, o, r, l, i)) : (e = Tr(t.type, null, r, n, n.mode, i), e.ref = n.ref, e.return = n, n.child = e);
        }
        return o = e.child, (l & i) == 0 && (l = o.memoizedProps, t = t.compare, t = t !== null ? t : qn, t(l, r) && e.ref === n.ref) ? ye(e, n, i) : (n.flags |= 1, e = Be(o, r), e.ref = n.ref, e.return = n, n.child = e);
    }
    function Bu(e, n, t, r, l, i) {
        if (e !== null && qn(e.memoizedProps, r) && e.ref === n.ref) if (ue = !1, (i & l) != 0) (e.flags & 16384) != 0 && (ue = !0);
        else return n.lanes = e.lanes, ye(e, n, i);
        return li(e, n, t, r, i);
    }
    function ri(e, n, t) {
        var r = n.pendingProps, l1 = r.children, i = e !== null ? e.memoizedState : null;
        if (r.mode === "hidden" || r.mode === "unstable-defer-without-hiding") if ((n.mode & 4) == 0) n.memoizedState = {
            baseLanes: 0
        }, Pr(n, t);
        else if ((t & 1073741824) != 0) n.memoizedState = {
            baseLanes: 0
        }, Pr(n, i !== null ? i.baseLanes : t);
        else return e = i !== null ? i.baseLanes | t : t, n.lanes = n.childLanes = 1073741824, n.memoizedState = {
            baseLanes: e
        }, Pr(n, e), null;
        else i !== null ? (r = i.baseLanes | t, n.memoizedState = null) : r = t, Pr(n, r);
        return J(e, n, l1, t), n.child;
    }
    function Hu(e, n) {
        var t = n.ref;
        (e === null && t !== null || e !== null && e.ref !== t) && (n.flags |= 128);
    }
    function li(e, n, t, r, l) {
        var i = G(t) ? Xe : W.current;
        return i = wn(n, i), kn(n, l), t = ql(e, n, t, r, i, l), e !== null && !ue ? (n.updateQueue = e.updateQueue, n.flags &= -517, e.lanes &= ~l, ye(e, n, l)) : (n.flags |= 1, J(e, n, t, l), n.child);
    }
    function Wu(e, n, t, r, l) {
        if (G(t)) {
            var i = !0;
            nr(n);
        } else i = !1;
        if (kn(n, l), n.stateNode === null) e !== null && (e.alternate = null, n.alternate = null, n.flags |= 2), Su(n, t, r), $l(n, t, r, l), r = !0;
        else if (e === null) {
            var o = n.stateNode, u = n.memoizedProps;
            o.props = u;
            var s = o.context, d = t.contextType;
            typeof d == "object" && d !== null ? d = ne(d) : (d = G(t) ? Xe : W.current, d = wn(n, d));
            var y = t.getDerivedStateFromProps, C = typeof y == "function" || typeof o.getSnapshotBeforeUpdate == "function";
            C || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || s !== d) && Eu(n, o, r, d), Oe = !1;
            var h = n.memoizedState;
            o.state = h, lt(n, r, o, l), s = n.memoizedState, u !== r || h !== s || K.current || Oe ? (typeof y == "function" && (ur(n, t, y, r), s = n.memoizedState), (u = Oe || wu(n, t, u, r, h, s, d)) ? (C || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (n.flags |= 4)) : (typeof o.componentDidMount == "function" && (n.flags |= 4), n.memoizedProps = r, n.memoizedState = s), o.props = r, o.state = s, o.context = d, r = u) : (typeof o.componentDidMount == "function" && (n.flags |= 4), r = !1);
        } else {
            o = n.stateNode, hu(e, n), u = n.memoizedProps, d = n.type === n.elementType ? u : oe(n.type, u), o.props = d, C = n.pendingProps, h = o.context, s = t.contextType, typeof s == "object" && s !== null ? s = ne(s) : (s = G(t) ? Xe : W.current, s = wn(n, s));
            var S = t.getDerivedStateFromProps;
            (y = typeof S == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== C || h !== s) && Eu(n, o, r, s), Oe = !1, h = n.memoizedState, o.state = h, lt(n, r, o, l);
            var k = n.memoizedState;
            u !== C || h !== k || K.current || Oe ? (typeof S == "function" && (ur(n, t, S, r), k = n.memoizedState), (d = Oe || wu(n, t, d, r, h, k, s)) ? (y || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, k, s), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, k, s)), typeof o.componentDidUpdate == "function" && (n.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (n.flags |= 256)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (n.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (n.flags |= 256), n.memoizedProps = r, n.memoizedState = k), o.props = r, o.state = k, o.context = s, r = d) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (n.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (n.flags |= 256), r = !1);
        }
        return ii(e, n, t, r, i, l);
    }
    function ii(e, n, t, r, l, i) {
        Hu(e, n);
        var o = (n.flags & 64) != 0;
        if (!r && !o) return l && iu(n, t, !1), ye(e, n, i);
        r = n.stateNode, ef.current = n;
        var u = o && typeof t.getDerivedStateFromError != "function" ? null : r.render();
        return n.flags |= 1, e !== null && o ? (n.child = cr(n, e.child, null, i), n.child = cr(n, null, u, i)) : J(e, n, u, i), n.memoizedState = r.state, l && iu(n, t, !0), n.child;
    }
    function Au(e) {
        var n = e.stateNode;
        n.pendingContext ? ru(e, n.pendingContext, n.pendingContext !== n.context) : n.context && ru(e, n.context, !1), Yl(e, n.containerInfo);
    }
    var wr = {
        dehydrated: null,
        retryLane: 0
    };
    function Qu(e, n, t) {
        var r = n.pendingProps, l1 = D.current, i = !1, o;
        return (o = (n.flags & 64) != 0) || (o = e !== null && e.memoizedState === null ? !1 : (l1 & 2) != 0), o ? (i = !0, n.flags &= -65) : e !== null && e.memoizedState === null || r.fallback === void 0 || r.unstable_avoidThisFallback === !0 || (l1 |= 1), R(D, l1 & 1), e === null ? (r.fallback !== void 0 && Kl(n), e = r.children, l1 = r.fallback, i ? (e = $u(n, e, l1, t), n.child.memoizedState = {
            baseLanes: t
        }, n.memoizedState = wr, e) : typeof r.unstable_expectedLoadTime == "number" ? (e = $u(n, e, l1, t), n.child.memoizedState = {
            baseLanes: t
        }, n.memoizedState = wr, n.lanes = 33554432, e) : (t = Ni({
            mode: "visible",
            children: e
        }, n.mode, t, null), t.return = n, n.child = t)) : e.memoizedState !== null ? i ? (r = Xu(e, n, r.children, r.fallback, t), i = n.child, l1 = e.child.memoizedState, i.memoizedState = l1 === null ? {
            baseLanes: t
        } : {
            baseLanes: l1.baseLanes | t
        }, i.childLanes = e.childLanes & ~t, n.memoizedState = wr, r) : (t = Yu(e, n, r.children, t), n.memoizedState = null, t) : i ? (r = Xu(e, n, r.children, r.fallback, t), i = n.child, l1 = e.child.memoizedState, i.memoizedState = l1 === null ? {
            baseLanes: t
        } : {
            baseLanes: l1.baseLanes | t
        }, i.childLanes = e.childLanes & ~t, n.memoizedState = wr, r) : (t = Yu(e, n, r.children, t), n.memoizedState = null, t);
    }
    function $u(e, n, t, r) {
        var l1 = e.mode, i = e.child;
        return n = {
            mode: "hidden",
            children: n
        }, (l1 & 2) == 0 && i !== null ? (i.childLanes = 0, i.pendingProps = n) : i = Ni(n, l1, 0, null), t = zn(t, l1, r, null), i.return = e, t.return = e, i.sibling = t, e.child = i, t;
    }
    function Yu(e, n, t, r) {
        var l1 = e.child;
        return e = l1.sibling, t = Be(l1, {
            mode: "visible",
            children: t
        }), (n.mode & 2) == 0 && (t.lanes = r), t.return = n, t.sibling = null, e !== null && (e.nextEffect = null, e.flags = 8, n.firstEffect = n.lastEffect = e), n.child = t;
    }
    function Xu(e, n, t, r, l) {
        var i = n.mode, o = e.child;
        e = o.sibling;
        var u = {
            mode: "hidden",
            children: t
        };
        return (i & 2) == 0 && n.child !== o ? (t = n.child, t.childLanes = 0, t.pendingProps = u, o = t.lastEffect, o !== null ? (n.firstEffect = t.firstEffect, n.lastEffect = o, o.nextEffect = null) : n.firstEffect = n.lastEffect = null) : t = Be(o, u), e !== null ? r = Be(e, r) : (r = zn(r, i, l, null), r.flags |= 2), r.return = n, t.return = n, t.sibling = r, n.child = t, r;
    }
    function Ku(e, n) {
        e.lanes |= n;
        var t = e.alternate;
        t !== null && (t.lanes |= n), mu(e.return, n);
    }
    function oi(e, n, t, r, l, i) {
        var o = e.memoizedState;
        o === null ? e.memoizedState = {
            isBackwards: n,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: t,
            tailMode: l,
            lastEffect: i
        } : (o.isBackwards = n, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = t, o.tailMode = l, o.lastEffect = i);
    }
    function Gu(e, n, t) {
        var r = n.pendingProps, l1 = r.revealOrder, i = r.tail;
        if (J(e, n, r.children, t), r = D.current, (r & 2) != 0) r = r & 1 | 2, n.flags |= 64;
        else {
            if (e !== null && (e.flags & 64) != 0) e: for(e = n.child; e !== null;){
                if (e.tag === 13) e.memoizedState !== null && Ku(e, t);
                else if (e.tag === 19) Ku(e, t);
                else if (e.child !== null) {
                    e.child.return = e, e = e.child;
                    continue;
                }
                if (e === n) break e;
                for(; e.sibling === null;){
                    if (e.return === null || e.return === n) break e;
                    e = e.return;
                }
                e.sibling.return = e.return, e = e.sibling;
            }
            r &= 1;
        }
        if (R(D, r), (n.mode & 2) == 0) n.memoizedState = null;
        else switch(l1){
            case "forwards":
                for(t = n.child, l1 = null; t !== null;)e = t.alternate, e !== null && dr(e) === null && (l1 = t), t = t.sibling;
                t = l1, t === null ? (l1 = n.child, n.child = null) : (l1 = t.sibling, t.sibling = null), oi(n, !1, l1, t, i, n.lastEffect);
                break;
            case "backwards":
                for(t = null, l1 = n.child, n.child = null; l1 !== null;){
                    if (e = l1.alternate, e !== null && dr(e) === null) {
                        n.child = l1;
                        break;
                    }
                    e = l1.sibling, l1.sibling = t, t = l1, l1 = e;
                }
                oi(n, !0, t, null, i, n.lastEffect);
                break;
            case "together":
                oi(n, !1, null, null, void 0, n.lastEffect);
                break;
            default:
                n.memoizedState = null;
        }
        return n.child;
    }
    function ye(e, n, t) {
        if (e !== null && (n.dependencies = e.dependencies), vt |= n.lanes, (t & n.childLanes) != 0) {
            if (e !== null && n.child !== e.child) throw Error(v(153));
            if (n.child !== null) {
                for(e = n.child, t = Be(e, e.pendingProps), n.child = t, t.return = n; e.sibling !== null;)e = e.sibling, t = t.sibling = Be(e, e.pendingProps), t.return = n;
                t.sibling = null;
            }
            return n.child;
        }
        return null;
    }
    var Zu, ui, Ju, qu;
    Zu = function(e, n) {
        for(var t = n.child; t !== null;){
            if (t.tag === 5 || t.tag === 6) e.appendChild(t.stateNode);
            else if (t.tag !== 4 && t.child !== null) {
                t.child.return = t, t = t.child;
                continue;
            }
            if (t === n) break;
            for(; t.sibling === null;){
                if (t.return === null || t.return === n) return;
                t = t.return;
            }
            t.sibling.return = t.return, t = t.sibling;
        }
    };
    ui = function() {
    };
    Ju = function(e, n, t, r) {
        var l1 = e.memoizedProps;
        if (l1 !== r) {
            e = n.stateNode, Ze(fe.current);
            var i = null;
            switch(t){
                case "input":
                    l1 = Yr(e, l1), r = Yr(e, r), i = [];
                    break;
                case "option":
                    l1 = Gr(e, l1), r = Gr(e, r), i = [];
                    break;
                case "select":
                    l1 = M({
                    }, l1, {
                        value: void 0
                    }), r = M({
                    }, r, {
                        value: void 0
                    }), i = [];
                    break;
                case "textarea":
                    l1 = Zr(e, l1), r = Zr(e, r), i = [];
                    break;
                default:
                    typeof l1.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Zt);
            }
            br(t, r);
            var o;
            t = null;
            for(d in l1)if (!r.hasOwnProperty(d) && l1.hasOwnProperty(d) && l1[d] != null) if (d === "style") {
                var u = l1[d];
                for(o in u)u.hasOwnProperty(o) && (t || (t = {
                }), t[o] = "");
            } else d !== "dangerouslySetInnerHTML" && d !== "children" && d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (On.hasOwnProperty(d) ? i || (i = []) : (i = i || []).push(d, null));
            for(d in r){
                var s = r[d];
                if (u = l1 != null ? l1[d] : void 0, r.hasOwnProperty(d) && s !== u && (s != null || u != null)) if (d === "style") if (u) {
                    for(o in u)!u.hasOwnProperty(o) || s && s.hasOwnProperty(o) || (t || (t = {
                    }), t[o] = "");
                    for(o in s)s.hasOwnProperty(o) && u[o] !== s[o] && (t || (t = {
                    }), t[o] = s[o]);
                } else t || (i || (i = []), i.push(d, t)), t = s;
                else d === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, u = u ? u.__html : void 0, s != null && u !== s && (i = i || []).push(d, s)) : d === "children" ? typeof s != "string" && typeof s != "number" || (i = i || []).push(d, "" + s) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && (On.hasOwnProperty(d) ? (s != null && d === "onScroll" && z("scroll", e), i || u === s || (i = [])) : typeof s == "object" && s !== null && s.$$typeof === Hr ? s.toString() : (i = i || []).push(d, s));
            }
            t && (i = i || []).push("style", t);
            var d = i;
            (n.updateQueue = d) && (n.flags |= 4);
        }
    };
    qu = function(e, n, t, r) {
        t !== r && (n.flags |= 4);
    };
    function ht(e, n) {
        if (!ce) switch(e.tailMode){
            case "hidden":
                n = e.tail;
                for(var t = null; n !== null;)n.alternate !== null && (t = n), n = n.sibling;
                t === null ? e.tail = null : t.sibling = null;
                break;
            case "collapsed":
                t = e.tail;
                for(var r = null; t !== null;)t.alternate !== null && (r = t), t = t.sibling;
                r === null ? n || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
        }
    }
    function nf(e, n, t) {
        var r = n.pendingProps;
        switch(n.tag){
            case 2:
            case 16:
            case 15:
            case 0:
            case 11:
            case 7:
            case 8:
            case 12:
            case 9:
            case 14:
                return null;
            case 1:
                return G(n.type) && er(), null;
            case 3:
                return xn(), O(K), O(W), Zl(), r = n.stateNode, r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (pr(n) ? n.flags |= 4 : r.hydrate || (n.flags |= 256)), ui(n), null;
            case 5:
                Xl(n);
                var l1 = Ze(st.current);
                if (t = n.type, e !== null && n.stateNode != null) Ju(e, n, t, r, l1), e.ref !== n.ref && (n.flags |= 128);
                else {
                    if (!r) {
                        if (n.stateNode === null) throw Error(v(166));
                        return null;
                    }
                    if (e = Ze(fe.current), pr(n)) {
                        r = n.stateNode, t = n.type;
                        var i = n.memoizedProps;
                        switch(r[Te] = n, r[qt] = i, t){
                            case "dialog":
                                z("cancel", r), z("close", r);
                                break;
                            case "iframe":
                            case "object":
                            case "embed":
                                z("load", r);
                                break;
                            case "video":
                            case "audio":
                                for(e = 0; e < et.length; e++)z(et[e], r);
                                break;
                            case "source":
                                z("error", r);
                                break;
                            case "img":
                            case "image":
                            case "link":
                                z("error", r), z("load", r);
                                break;
                            case "details":
                                z("toggle", r);
                                break;
                            case "input":
                                Ai(r, i), z("invalid", r);
                                break;
                            case "select":
                                r._wrapperState = {
                                    wasMultiple: !!i.multiple
                                }, z("invalid", r);
                                break;
                            case "textarea":
                                Yi(r, i), z("invalid", r);
                        }
                        br(t, i), e = null;
                        for(var o in i)i.hasOwnProperty(o) && (l1 = i[o], o === "children" ? typeof l1 == "string" ? r.textContent !== l1 && (e = [
                            "children",
                            l1
                        ]) : typeof l1 == "number" && r.textContent !== "" + l1 && (e = [
                            "children",
                            "" + l1
                        ]) : On.hasOwnProperty(o) && l1 != null && o === "onScroll" && z("scroll", r));
                        switch(t){
                            case "input":
                                zt(r), $i(r, i, !0);
                                break;
                            case "textarea":
                                zt(r), Ki(r);
                                break;
                            case "select":
                            case "option":
                                break;
                            default:
                                typeof i.onClick == "function" && (r.onclick = Zt);
                        }
                        r = e, n.updateQueue = r, r !== null && (n.flags |= 4);
                    } else {
                        switch(o = l1.nodeType === 9 ? l1 : l1.ownerDocument, e === Jr.html && (e = Gi(t)), e === Jr.html ? t === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(t, {
                            is: r.is
                        }) : (e = o.createElement(t), t === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, t), e[Te] = n, e[qt] = r, Zu(e, n, !1, !1), n.stateNode = e, o = el(t, r), t){
                            case "dialog":
                                z("cancel", e), z("close", e), l1 = r;
                                break;
                            case "iframe":
                            case "object":
                            case "embed":
                                z("load", e), l1 = r;
                                break;
                            case "video":
                            case "audio":
                                for(l1 = 0; l1 < et.length; l1++)z(et[l1], e);
                                l1 = r;
                                break;
                            case "source":
                                z("error", e), l1 = r;
                                break;
                            case "img":
                            case "image":
                            case "link":
                                z("error", e), z("load", e), l1 = r;
                                break;
                            case "details":
                                z("toggle", e), l1 = r;
                                break;
                            case "input":
                                Ai(e, r), l1 = Yr(e, r), z("invalid", e);
                                break;
                            case "option":
                                l1 = Gr(e, r);
                                break;
                            case "select":
                                e._wrapperState = {
                                    wasMultiple: !!r.multiple
                                }, l1 = M({
                                }, r, {
                                    value: void 0
                                }), z("invalid", e);
                                break;
                            case "textarea":
                                Yi(e, r), l1 = Zr(e, r), z("invalid", e);
                                break;
                            default:
                                l1 = r;
                        }
                        br(t, l1);
                        var u = l1;
                        for(i in u)if (u.hasOwnProperty(i)) {
                            var s = u[i];
                            i === "style" ? qi(e, s) : i === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && Zi(e, s)) : i === "children" ? typeof s == "string" ? (t !== "textarea" || s !== "") && jn(e, s) : typeof s == "number" && jn(e, "" + s) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (On.hasOwnProperty(i) ? s != null && i === "onScroll" && z("scroll", e) : s != null && Ir(e, i, s, o));
                        }
                        switch(t){
                            case "input":
                                zt(e), $i(e, r, !1);
                                break;
                            case "textarea":
                                zt(e), Ki(e);
                                break;
                            case "option":
                                r.value != null && e.setAttribute("value", "" + ke(r.value));
                                break;
                            case "select":
                                e.multiple = !!r.multiple, i = r.value, i != null ? rn(e, !!r.multiple, i, !1) : r.defaultValue != null && rn(e, !!r.multiple, r.defaultValue, !0);
                                break;
                            default:
                                typeof l1.onClick == "function" && (e.onclick = Zt);
                        }
                        qo(t, r) && (n.flags |= 4);
                    }
                    n.ref !== null && (n.flags |= 128);
                }
                return null;
            case 6:
                if (e && n.stateNode != null) qu(e, n, e.memoizedProps, r);
                else {
                    if (typeof r != "string" && n.stateNode === null) throw Error(v(166));
                    t = Ze(st.current), Ze(fe.current), pr(n) ? (r = n.stateNode, t = n.memoizedProps, r[Te] = n, r.nodeValue !== t && (n.flags |= 4)) : (r = (t.nodeType === 9 ? t : t.ownerDocument).createTextNode(r), r[Te] = n, n.stateNode = r);
                }
                return null;
            case 13:
                return O(D), r = n.memoizedState, (n.flags & 64) != 0 ? (n.lanes = t, n) : (r = r !== null, t = !1, e === null ? n.memoizedProps.fallback !== void 0 && pr(n) : t = e.memoizedState !== null, r && !t && (n.mode & 2) != 0 && (e === null && n.memoizedProps.unstable_avoidThisFallback !== !0 || (D.current & 1) != 0 ? H === 0 && (H = 3) : ((H === 0 || H === 3) && (H = 4), X === null || (vt & 134217727) == 0 && (Nn & 134217727) == 0 || Tn(X, $))), (r || t) && (n.flags |= 4), null);
            case 4:
                return xn(), ui(n), e === null && Xo(n.stateNode.containerInfo), null;
            case 10:
                return Al(n), null;
            case 17:
                return G(n.type) && er(), null;
            case 19:
                if (O(D), r = n.memoizedState, r === null) return null;
                if (i = (n.flags & 64) != 0, o = r.rendering, o === null) if (i) ht(r, !1);
                else {
                    if (H !== 0 || e !== null && (e.flags & 64) != 0) for(e = n.child; e !== null;){
                        if (o = dr(e), o !== null) {
                            for(n.flags |= 64, ht(r, !1), i = o.updateQueue, i !== null && (n.updateQueue = i, n.flags |= 4), r.lastEffect === null && (n.firstEffect = null), n.lastEffect = r.lastEffect, r = t, t = n.child; t !== null;)i = t, e = r, i.flags &= 2, i.nextEffect = null, i.firstEffect = null, i.lastEffect = null, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : {
                                lanes: e.lanes,
                                firstContext: e.firstContext
                            }), t = t.sibling;
                            return R(D, D.current & 1 | 2), n.child;
                        }
                        e = e.sibling;
                    }
                    r.tail !== null && A() > gi && (n.flags |= 64, i = !0, ht(r, !1), n.lanes = 33554432);
                }
                else {
                    if (!i) if (e = dr(o), e !== null) {
                        if (n.flags |= 64, i = !0, t = e.updateQueue, t !== null && (n.updateQueue = t, n.flags |= 4), ht(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !ce) return n = n.lastEffect = r.lastEffect, n !== null && (n.nextEffect = null), null;
                    } else 2 * A() - r.renderingStartTime > gi && t !== 1073741824 && (n.flags |= 64, i = !0, ht(r, !1), n.lanes = 33554432);
                    r.isBackwards ? (o.sibling = n.child, n.child = o) : (t = r.last, t !== null ? t.sibling = o : n.child = o, r.last = o);
                }
                return r.tail !== null ? (t = r.tail, r.rendering = t, r.tail = t.sibling, r.lastEffect = n.lastEffect, r.renderingStartTime = A(), t.sibling = null, n = D.current, R(D, i ? n & 1 | 2 : n & 1), t) : null;
            case 23:
            case 24:
                return Ci(), e !== null && e.memoizedState !== null != (n.memoizedState !== null) && r.mode !== "unstable-defer-without-hiding" && (n.flags |= 4), null;
        }
        throw Error(v(156, n.tag));
    }
    function tf(e) {
        switch(e.tag){
            case 1:
                G(e.type) && er();
                var n = e.flags;
                return n & 4096 ? (e.flags = n & -4097 | 64, e) : null;
            case 3:
                if (xn(), O(K), O(W), Zl(), n = e.flags, (n & 64) != 0) throw Error(v(285));
                return e.flags = n & -4097 | 64, e;
            case 5:
                return Xl(e), null;
            case 13:
                return O(D), n = e.flags, n & 4096 ? (e.flags = n & -4097 | 64, e) : null;
            case 19:
                return O(D), null;
            case 4:
                return xn(), null;
            case 10:
                return Al(e), null;
            case 23:
            case 24:
                return Ci(), null;
            default:
                return null;
        }
    }
    function si(e, n) {
        try {
            var t = "", r = n;
            do t += Fs(r), r = r.return;
            while (r)
            var l1 = t;
        } catch (i) {
            l1 = `
Error generating stack: ` + i.message + `
` + i.stack;
        }
        return {
            value: e,
            source: n,
            stack: l1
        };
    }
    function ai(e, n) {
        try {
            console.error(n.value);
        } catch (t) {
            setTimeout(function() {
                throw t;
            });
        }
    }
    var rf = typeof WeakMap == "function" ? WeakMap : Map;
    function bu(e, n, t) {
        t = Me(-1, t), t.tag = 3, t.payload = {
            element: null
        };
        var r = n.value;
        return t.callback = function() {
            kr || (kr = !0, wi = r), ai(e, n);
        }, t;
    }
    function es(e, n, t) {
        t = Me(-1, t), t.tag = 3;
        var r = e.type.getDerivedStateFromError;
        if (typeof r == "function") {
            var l = n.value;
            t.payload = function() {
                return ai(e, n), r(l);
            };
        }
        var i = e.stateNode;
        return i !== null && typeof i.componentDidCatch == "function" && (t.callback = function() {
            typeof r != "function" && (pe === null ? pe = new Set([
                this
            ]) : pe.add(this), ai(e, n));
            var o = n.stack;
            this.componentDidCatch(n.value, {
                componentStack: o !== null ? o : ""
            });
        }), t;
    }
    var lf = typeof WeakSet == "function" ? WeakSet : Set;
    function ns(e) {
        var n = e.ref;
        if (n !== null) if (typeof n == "function") try {
            n(null);
        } catch (t) {
            Ve(e, t);
        }
        else n.current = null;
    }
    function of(e, n) {
        switch(n.tag){
            case 0:
            case 11:
            case 15:
            case 22:
                return;
            case 1:
                if (n.flags & 256 && e !== null) {
                    var t = e.memoizedProps, r = e.memoizedState;
                    e = n.stateNode, n = e.getSnapshotBeforeUpdate(n.elementType === n.type ? t : oe(n.type, t), r), e.__reactInternalSnapshotBeforeUpdate = n;
                }
                return;
            case 3:
                n.flags & 256 && Rl(n.stateNode.containerInfo);
                return;
            case 5:
            case 6:
            case 4:
            case 17:
                return;
        }
        throw Error(v(163));
    }
    function uf(e, n, t) {
        switch(t.tag){
            case 0:
            case 11:
            case 15:
            case 22:
                if (n = t.updateQueue, n = n !== null ? n.lastEffect : null, n !== null) {
                    e = n = n.next;
                    do {
                        if ((e.tag & 3) == 3) {
                            var r = e.create;
                            e.destroy = r();
                        }
                        e = e.next;
                    }while (e !== n)
                }
                if (n = t.updateQueue, n = n !== null ? n.lastEffect : null, n !== null) {
                    e = n = n.next;
                    do {
                        var l = e;
                        r = l.next, l = l.tag, (l & 4) != 0 && (l & 1) != 0 && (vs(t, e), hf(t, e)), e = r;
                    }while (e !== n)
                }
                return;
            case 1:
                e = t.stateNode, t.flags & 4 && (n === null ? e.componentDidMount() : (r = t.elementType === t.type ? n.memoizedProps : oe(t.type, n.memoizedProps), e.componentDidUpdate(r, n.memoizedState, e.__reactInternalSnapshotBeforeUpdate))), n = t.updateQueue, n !== null && yu(t, n, e);
                return;
            case 3:
                if (n = t.updateQueue, n !== null) {
                    if (e = null, t.child !== null) switch(t.child.tag){
                        case 5:
                            e = t.child.stateNode;
                            break;
                        case 1:
                            e = t.child.stateNode;
                    }
                    yu(t, n, e);
                }
                return;
            case 5:
                e = t.stateNode, n === null && t.flags & 4 && qo(t.type, t.memoizedProps) && e.focus();
                return;
            case 6:
                return;
            case 4:
                return;
            case 12:
                return;
            case 13:
                t.memoizedState === null && (t = t.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null && ho(t))));
                return;
            case 19:
            case 17:
            case 20:
            case 21:
            case 23:
            case 24:
                return;
        }
        throw Error(v(163));
    }
    function ts(e, n) {
        for(var t = e;;){
            if (t.tag === 5) {
                var r = t.stateNode;
                if (n) r = r.style, typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
                else {
                    r = t.stateNode;
                    var l = t.memoizedProps.style;
                    l = l != null && l.hasOwnProperty("display") ? l.display : null, r.style.display = Ji("display", l);
                }
            } else if (t.tag === 6) t.stateNode.nodeValue = n ? "" : t.memoizedProps;
            else if ((t.tag !== 23 && t.tag !== 24 || t.memoizedState === null || t === e) && t.child !== null) {
                t.child.return = t, t = t.child;
                continue;
            }
            if (t === e) break;
            for(; t.sibling === null;){
                if (t.return === null || t.return === e) return;
                t = t.return;
            }
            t.sibling.return = t.return, t = t.sibling;
        }
    }
    function rs(e, n) {
        if (Ke && typeof Ke.onCommitFiberUnmount == "function") try {
            Ke.onCommitFiberUnmount(Fl, n);
        } catch (i) {
        }
        switch(n.tag){
            case 0:
            case 11:
            case 14:
            case 15:
            case 22:
                if (e = n.updateQueue, e !== null && (e = e.lastEffect, e !== null)) {
                    var t = e = e.next;
                    do {
                        var r = t, l = r.destroy;
                        if (r = r.tag, l !== void 0) if ((r & 4) != 0) vs(n, t);
                        else {
                            r = n;
                            try {
                                l();
                            } catch (i) {
                                Ve(r, i);
                            }
                        }
                        t = t.next;
                    }while (t !== e)
                }
                break;
            case 1:
                if (ns(n), e = n.stateNode, typeof e.componentWillUnmount == "function") try {
                    e.props = n.memoizedProps, e.state = n.memoizedState, e.componentWillUnmount();
                } catch (i1) {
                    Ve(n, i1);
                }
                break;
            case 5:
                ns(n);
                break;
            case 4:
                us(e, n);
        }
    }
    function ls(e) {
        e.alternate = null, e.child = null, e.dependencies = null, e.firstEffect = null, e.lastEffect = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.return = null, e.updateQueue = null;
    }
    function is(e) {
        return e.tag === 5 || e.tag === 3 || e.tag === 4;
    }
    function os(e) {
        e: {
            for(var n = e.return; n !== null;){
                if (is(n)) break e;
                n = n.return;
            }
            throw Error(v(160));
        }
        var t = n;
        switch(n = t.stateNode, t.tag){
            case 5:
                var r = !1;
                break;
            case 3:
                n = n.containerInfo, r = !0;
                break;
            case 4:
                n = n.containerInfo, r = !0;
                break;
            default:
                throw Error(v(161));
        }
        t.flags & 16 && (jn(n, ""), t.flags &= -17);
        e: n: for(t = e;;){
            for(; t.sibling === null;){
                if (t.return === null || is(t.return)) {
                    t = null;
                    break e;
                }
                t = t.return;
            }
            for(t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18;){
                if (t.flags & 2 || t.child === null || t.tag === 4) continue n;
                t.child.return = t, t = t.child;
            }
            if (!(t.flags & 2)) {
                t = t.stateNode;
                break e;
            }
        }
        r ? fi(e, t, n) : ci(e, t, n);
    }
    function fi(e, n, t) {
        var r = e.tag, l1 = r === 5 || r === 6;
        if (l1) e = l1 ? e.stateNode : e.stateNode.instance, n ? t.nodeType === 8 ? t.parentNode.insertBefore(e, n) : t.insertBefore(e, n) : (t.nodeType === 8 ? (n = t.parentNode, n.insertBefore(e, t)) : (n = t, n.appendChild(e)), t = t._reactRootContainer, t != null || n.onclick !== null || (n.onclick = Zt));
        else if (r !== 4 && (e = e.child, e !== null)) for(fi(e, n, t), e = e.sibling; e !== null;)fi(e, n, t), e = e.sibling;
    }
    function ci(e, n, t) {
        var r = e.tag, l1 = r === 5 || r === 6;
        if (l1) e = l1 ? e.stateNode : e.stateNode.instance, n ? t.insertBefore(e, n) : t.appendChild(e);
        else if (r !== 4 && (e = e.child, e !== null)) for(ci(e, n, t), e = e.sibling; e !== null;)ci(e, n, t), e = e.sibling;
    }
    function us(e, n) {
        for(var t = n, r = !1, l, i;;){
            if (!r) {
                r = t.return;
                e: for(;;){
                    if (r === null) throw Error(v(160));
                    switch(l = r.stateNode, r.tag){
                        case 5:
                            i = !1;
                            break e;
                        case 3:
                            l = l.containerInfo, i = !0;
                            break e;
                        case 4:
                            l = l.containerInfo, i = !0;
                            break e;
                    }
                    r = r.return;
                }
                r = !0;
            }
            if (t.tag === 5 || t.tag === 6) {
                e: for(var o = e, u = t, s = u;;)if (rs(o, s), s.child !== null && s.tag !== 4) s.child.return = s, s = s.child;
                else {
                    if (s === u) break e;
                    for(; s.sibling === null;){
                        if (s.return === null || s.return === u) break e;
                        s = s.return;
                    }
                    s.sibling.return = s.return, s = s.sibling;
                }
                i ? (o = l, u = t.stateNode, o.nodeType === 8 ? o.parentNode.removeChild(u) : o.removeChild(u)) : l.removeChild(t.stateNode);
            } else if (t.tag === 4) {
                if (t.child !== null) {
                    l = t.stateNode.containerInfo, i = !0, t.child.return = t, t = t.child;
                    continue;
                }
            } else if (rs(e, t), t.child !== null) {
                t.child.return = t, t = t.child;
                continue;
            }
            if (t === n) break;
            for(; t.sibling === null;){
                if (t.return === null || t.return === n) return;
                t = t.return, t.tag === 4 && (r = !1);
            }
            t.sibling.return = t.return, t = t.sibling;
        }
    }
    function di(e, n) {
        switch(n.tag){
            case 0:
            case 11:
            case 14:
            case 15:
            case 22:
                var t = n.updateQueue;
                if (t = t !== null ? t.lastEffect : null, t !== null) {
                    var r = t = t.next;
                    do (r.tag & 3) == 3 && (e = r.destroy, r.destroy = void 0, e !== void 0 && e()), r = r.next;
                    while (r !== t)
                }
                return;
            case 1:
                return;
            case 5:
                if (t = n.stateNode, t != null) {
                    r = n.memoizedProps;
                    var l = e !== null ? e.memoizedProps : r;
                    e = n.type;
                    var i = n.updateQueue;
                    if (n.updateQueue = null, i !== null) {
                        for(t[qt] = r, e === "input" && r.type === "radio" && r.name != null && Qi(t, r), el(e, l), n = el(e, r), l = 0; l < i.length; l += 2){
                            var o = i[l], u = i[l + 1];
                            o === "style" ? qi(t, u) : o === "dangerouslySetInnerHTML" ? Zi(t, u) : o === "children" ? jn(t, u) : Ir(t, o, u, n);
                        }
                        switch(e){
                            case "input":
                                Xr(t, r);
                                break;
                            case "textarea":
                                Xi(t, r);
                                break;
                            case "select":
                                e = t._wrapperState.wasMultiple, t._wrapperState.wasMultiple = !!r.multiple, i = r.value, i != null ? rn(t, !!r.multiple, i, !1) : e !== !!r.multiple && (r.defaultValue != null ? rn(t, !!r.multiple, r.defaultValue, !0) : rn(t, !!r.multiple, r.multiple ? [] : "", !1));
                        }
                    }
                }
                return;
            case 6:
                if (n.stateNode === null) throw Error(v(162));
                n.stateNode.nodeValue = n.memoizedProps;
                return;
            case 3:
                t = n.stateNode, t.hydrate && (t.hydrate = !1, ho(t.containerInfo));
                return;
            case 12:
                return;
            case 13:
                n.memoizedState !== null && (yi = A(), ts(n.child, !0)), ss(n);
                return;
            case 19:
                ss(n);
                return;
            case 17:
                return;
            case 23:
            case 24:
                ts(n, n.memoizedState !== null);
                return;
        }
        throw Error(v(163));
    }
    function ss(e) {
        var n = e.updateQueue;
        if (n !== null) {
            e.updateQueue = null;
            var t = e.stateNode;
            t === null && (t = e.stateNode = new lf), n.forEach(function(r) {
                var l = gf.bind(null, e, r);
                t.has(r) || (t.add(r), r.then(l, l));
            });
        }
    }
    function sf(e, n) {
        return e !== null && (e = e.memoizedState, e === null || e.dehydrated !== null) ? (n = n.memoizedState, n !== null && n.dehydrated === null) : !1;
    }
    var af = Math.ceil, Sr = We.ReactCurrentDispatcher, pi = We.ReactCurrentOwner, x = 0, X = null, j = null, $ = 0, be = 0, mi = Le(0), H = 0, Er = null, _n = 0, vt = 0, Nn = 0, hi = 0, vi = null, yi = 0, gi = 1 / 0;
    function Pn() {
        gi = A() + 500;
    }
    var g = null, kr = !1, wi = null, pe = null, Ie = !1, yt = null, gt = 90, Si = [], Ei = [], ge = null, wt = 0, ki = null, xr = -1, we = 0, Cr = 0, St = null, _r = !1;
    function b() {
        return (x & 48) != 0 ? A() : xr !== -1 ? xr : xr = A();
    }
    function Fe(e) {
        if (e = e.mode, (e & 2) == 0) return 1;
        if ((e & 4) == 0) return Sn() === 99 ? 1 : 2;
        if (we === 0 && (we = _n), Ga.transition !== 0) {
            Cr !== 0 && (Cr = vi !== null ? vi.pendingLanes : 0), e = we;
            var n = 4186112 & ~Cr;
            return n &= -n, n === 0 && (e = 4186112 & ~e, n = e & -e, n === 0 && (n = 8192)), n;
        }
        return e = Sn(), (x & 4) != 0 && e === 98 ? e = Ut(12, we) : (e = qs(e), e = Ut(e, we)), e;
    }
    function je(e, n, t) {
        if (50 < wt) throw wt = 0, ki = null, Error(v(185));
        if (e = Nr(e, n), e === null) return null;
        Vt(e, n, t), e === X && (Nn |= n, H === 4 && Tn(e, $));
        var r = Sn();
        n === 1 ? (x & 8) != 0 && (x & 48) == 0 ? xi(e) : (re(e, t), x === 0 && (Pn(), ae())) : ((x & 4) == 0 || r !== 98 && r !== 99 || (ge === null ? ge = new Set([
            e
        ]) : ge.add(e)), re(e, t)), vi = e;
    }
    function Nr(e, n) {
        e.lanes |= n;
        var t = e.alternate;
        for(t !== null && (t.lanes |= n), t = e, e = e.return; e !== null;)e.childLanes |= n, t = e.alternate, t !== null && (t.childLanes |= n), t = e, e = e.return;
        return t.tag === 3 ? t.stateNode : null;
    }
    function re(e, n) {
        for(var t = e.callbackNode, r = e.suspendedLanes, l = e.pingedLanes, i = e.expirationTimes, o = e.pendingLanes; 0 < o;){
            var u = 31 - Ne(o), s = 1 << u, d = i[u];
            if (d === -1) {
                if ((s & r) == 0 || (s & l) != 0) {
                    d = n, an(s);
                    var y = L;
                    i[u] = 10 <= y ? d + 250 : 6 <= y ? d + 5000 : -1;
                }
            } else d <= n && (e.expiredLanes |= s);
            o &= ~s;
        }
        if (r = Yn(e, e === X ? $ : 0), n = L, r === 0) t !== null && (t !== Bl && Ul(t), e.callbackNode = null, e.callbackPriority = 0);
        else {
            if (t !== null) {
                if (e.callbackPriority === n) return;
                t !== Bl && Ul(t);
            }
            n === 15 ? (t = xi.bind(null, e), he === null ? (he = [
                t
            ], rr = jl(tr, pu)) : he.push(t), t = Bl) : n === 14 ? t = rt(99, xi.bind(null, e)) : (t = bs(n), t = rt(t, as.bind(null, e))), e.callbackPriority = n, e.callbackNode = t;
        }
    }
    function as(e) {
        if (xr = -1, Cr = we = 0, (x & 48) != 0) throw Error(v(327));
        var n = e.callbackNode;
        if (Ue() && e.callbackNode !== n) return null;
        var t = Yn(e, e === X ? $ : 0);
        if (t === 0) return null;
        var r = t, l1 = x;
        x |= 16;
        var i = ps();
        (X !== e || $ !== r) && (Pn(), Ln(e, r));
        do try {
            df();
            break;
        } catch (u) {
            ds(e, u);
        }
        while (1)
        if (Wl(), Sr.current = i, x = l1, j !== null ? r = 0 : (X = null, $ = 0, r = H), (_n & Nn) != 0) Ln(e, 0);
        else if (r !== 0) {
            if (r === 2 && (x |= 64, e.hydrate && (e.hydrate = !1, Rl(e.containerInfo)), t = ko(e), t !== 0 && (r = Et(e, t))), r === 1) throw n = Er, Ln(e, 0), Tn(e, t), re(e, A()), n;
            switch(e.finishedWork = e.current.alternate, e.finishedLanes = t, r){
                case 0:
                case 1:
                    throw Error(v(345));
                case 2:
                    en(e);
                    break;
                case 3:
                    if (Tn(e, t), (t & 62914560) === t && (r = yi + 500 - A(), 10 < r)) {
                        if (Yn(e, 0) !== 0) break;
                        if (l1 = e.suspendedLanes, (l1 & t) !== t) {
                            b(), e.pingedLanes |= e.suspendedLanes & l1;
                            break;
                        }
                        e.timeoutHandle = bo(en.bind(null, e), r);
                        break;
                    }
                    en(e);
                    break;
                case 4:
                    if (Tn(e, t), (t & 4186112) === t) break;
                    for(r = e.eventTimes, l1 = -1; 0 < t;){
                        var o = 31 - Ne(t);
                        i = 1 << o, o = r[o], o > l1 && (l1 = o), t &= ~i;
                    }
                    if (t = l1, t = A() - t, t = (120 > t ? 120 : 480 > t ? 480 : 1080 > t ? 1080 : 1920 > t ? 1920 : 3000 > t ? 3000 : 4320 > t ? 4320 : 1960 * af(t / 1960)) - t, 10 < t) {
                        e.timeoutHandle = bo(en.bind(null, e), t);
                        break;
                    }
                    en(e);
                    break;
                case 5:
                    en(e);
                    break;
                default:
                    throw Error(v(329));
            }
        }
        return re(e, A()), e.callbackNode === n ? as.bind(null, e) : null;
    }
    function Tn(e, n) {
        for(n &= ~hi, n &= ~Nn, e.suspendedLanes |= n, e.pingedLanes &= ~n, e = e.expirationTimes; 0 < n;){
            var t = 31 - Ne(n), r = 1 << t;
            e[t] = -1, n &= ~r;
        }
    }
    function xi(e) {
        if ((x & 48) != 0) throw Error(v(327));
        if (Ue(), e === X && (e.expiredLanes & $) != 0) {
            var n = $, t = Et(e, n);
            (_n & Nn) != 0 && (n = Yn(e, n), t = Et(e, n));
        } else n = Yn(e, 0), t = Et(e, n);
        if (e.tag !== 0 && t === 2 && (x |= 64, e.hydrate && (e.hydrate = !1, Rl(e.containerInfo)), n = ko(e), n !== 0 && (t = Et(e, n))), t === 1) throw t = Er, Ln(e, 0), Tn(e, n), re(e, A()), t;
        return e.finishedWork = e.current.alternate, e.finishedLanes = n, en(e), re(e, A()), null;
    }
    function ff() {
        if (ge !== null) {
            var e = ge;
            ge = null, e.forEach(function(n) {
                n.expiredLanes |= 24 & n.pendingLanes, re(n, A());
            });
        }
        ae();
    }
    function fs(e, n) {
        var t = x;
        x |= 1;
        try {
            return e(n);
        } finally{
            x = t, x === 0 && (Pn(), ae());
        }
    }
    function cs(e, n) {
        var t = x;
        x &= -2, x |= 8;
        try {
            return e(n);
        } finally{
            x = t, x === 0 && (Pn(), ae());
        }
    }
    function Pr(e, n) {
        R(mi, be), be |= n, _n |= n;
    }
    function Ci() {
        be = mi.current, O(mi);
    }
    function Ln(e, n) {
        e.finishedWork = null, e.finishedLanes = 0;
        var t = e.timeoutHandle;
        if (t !== -1 && (e.timeoutHandle = -1, Aa(t)), j !== null) for(t = j.return; t !== null;){
            var r = t;
            switch(r.tag){
                case 1:
                    r = r.type.childContextTypes, r != null && er();
                    break;
                case 3:
                    xn(), O(K), O(W), Zl();
                    break;
                case 5:
                    Xl(r);
                    break;
                case 4:
                    xn();
                    break;
                case 13:
                    O(D);
                    break;
                case 19:
                    O(D);
                    break;
                case 10:
                    Al(r);
                    break;
                case 23:
                case 24:
                    Ci();
            }
            t = t.return;
        }
        X = e, j = Be(e.current, null), $ = be = _n = n, H = 0, Er = null, hi = Nn = vt = 0;
    }
    function ds(e, n) {
        do {
            var t = j;
            try {
                if (Wl(), at.current = gr, mr) {
                    for(var r = I.memoizedState; r !== null;){
                        var l = r.queue;
                        l !== null && (l.pending = null), r = r.next;
                    }
                    mr = !1;
                }
                if (ft = 0, B = Q = I = null, ct = !1, pi.current = null, t === null || t.return === null) {
                    H = 1, Er = n, j = null;
                    break;
                }
                e: {
                    var i = e, o = t.return, u = t, s = n;
                    if (n = $, u.flags |= 2048, u.firstEffect = u.lastEffect = null, s !== null && typeof s == "object" && typeof s.then == "function") {
                        var d = s;
                        if ((u.mode & 2) == 0) {
                            var y = u.alternate;
                            y ? (u.updateQueue = y.updateQueue, u.memoizedState = y.memoizedState, u.lanes = y.lanes) : (u.updateQueue = null, u.memoizedState = null);
                        }
                        var C = (D.current & 1) != 0, h = o;
                        do {
                            var S;
                            if (S = h.tag === 13) {
                                var k = h.memoizedState;
                                if (k !== null) S = k.dehydrated !== null;
                                else {
                                    var E = h.memoizedProps;
                                    S = E.fallback === void 0 ? !1 : E.unstable_avoidThisFallback !== !0 ? !0 : !C;
                                }
                            }
                            if (S) {
                                var c = h.updateQueue;
                                if (c === null) {
                                    var a = new Set;
                                    a.add(d), h.updateQueue = a;
                                } else c.add(d);
                                if ((h.mode & 2) == 0) {
                                    if (h.flags |= 64, u.flags |= 16384, u.flags &= -2981, u.tag === 1) if (u.alternate === null) u.tag = 17;
                                    else {
                                        var f = Me(-1, 1);
                                        f.tag = 2, Re(u, f);
                                    }
                                    u.lanes |= 1;
                                    break e;
                                }
                                s = void 0, u = n;
                                var p = i.pingCache;
                                if (p === null ? (p = i.pingCache = new rf, s = new Set, p.set(d, s)) : (s = p.get(d), s === void 0 && (s = new Set, p.set(d, s))), !s.has(u)) {
                                    s.add(u);
                                    var m = yf.bind(null, i, d, u);
                                    d.then(m, m);
                                }
                                h.flags |= 4096, h.lanes = n;
                                break e;
                            }
                            h = h.return;
                        }while (h !== null)
                        s = Error((tn(u.type) || "A React component") + ` suspended while rendering, but no fallback UI was specified.

Add a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.`);
                    }
                    H !== 5 && (H = 2), s = si(s, u), h = o;
                    do {
                        switch(h.tag){
                            case 3:
                                i = s, h.flags |= 4096, n &= -n, h.lanes |= n;
                                var _ = bu(h, i, n);
                                vu(h, _);
                                break e;
                            case 1:
                                i = s;
                                var w = h.type, N = h.stateNode;
                                if ((h.flags & 64) == 0 && (typeof w.getDerivedStateFromError == "function" || N !== null && typeof N.componentDidCatch == "function" && (pe === null || !pe.has(N)))) {
                                    h.flags |= 4096, n &= -n, h.lanes |= n;
                                    var T = es(h, i, n);
                                    vu(h, T);
                                    break e;
                                }
                        }
                        h = h.return;
                    }while (h !== null)
                }
                hs(t);
            } catch (P) {
                n = P, j === t && t !== null && (j = t = t.return);
                continue;
            }
            break;
        }while (1)
    }
    function ps() {
        var e1 = Sr.current;
        return Sr.current = gr, e1 === null ? gr : e1;
    }
    function Et(e, n) {
        var t = x;
        x |= 16;
        var r = ps();
        X === e && $ === n || Ln(e, n);
        do try {
            cf();
            break;
        } catch (l) {
            ds(e, l);
        }
        while (1)
        if (Wl(), x = t, Sr.current = r, j !== null) throw Error(v(261));
        return X = null, $ = 0, H;
    }
    function cf() {
        for(; j !== null;)ms(j);
    }
    function df() {
        for(; j !== null && !Ya();)ms(j);
    }
    function ms(e) {
        var n = gs(e.alternate, e, be);
        e.memoizedProps = e.pendingProps, n === null ? hs(e) : j = n, pi.current = null;
    }
    function hs(e) {
        var n = e;
        do {
            var t = n.alternate;
            if (e = n.return, (n.flags & 2048) == 0) {
                if (t = nf(t, n, be), t !== null) {
                    j = t;
                    return;
                }
                if (t = n, t.tag !== 24 && t.tag !== 23 || t.memoizedState === null || (be & 1073741824) != 0 || (t.mode & 4) == 0) {
                    for(var r = 0, l = t.child; l !== null;)r |= l.lanes | l.childLanes, l = l.sibling;
                    t.childLanes = r;
                }
                e !== null && (e.flags & 2048) == 0 && (e.firstEffect === null && (e.firstEffect = n.firstEffect), n.lastEffect !== null && (e.lastEffect !== null && (e.lastEffect.nextEffect = n.firstEffect), e.lastEffect = n.lastEffect), 1 < n.flags && (e.lastEffect !== null ? e.lastEffect.nextEffect = n : e.firstEffect = n, e.lastEffect = n));
            } else {
                if (t = tf(n), t !== null) {
                    t.flags &= 2047, j = t;
                    return;
                }
                e !== null && (e.firstEffect = e.lastEffect = null, e.flags |= 2048);
            }
            if (n = n.sibling, n !== null) {
                j = n;
                return;
            }
            j = n = e;
        }while (n !== null)
        H === 0 && (H = 5);
    }
    function en(e) {
        var n = Sn();
        return Ge(99, pf.bind(null, e, n)), null;
    }
    function pf(e, n) {
        do Ue();
        while (yt !== null)
        if ((x & 48) != 0) throw Error(v(327));
        var t = e.finishedWork;
        if (t === null) return null;
        if (e.finishedWork = null, e.finishedLanes = 0, t === e.current) throw Error(v(177));
        e.callbackNode = null;
        var r = t.lanes | t.childLanes, l1 = r, i = e.pendingLanes & ~l1;
        e.pendingLanes = l1, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= l1, e.mutableReadLanes &= l1, e.entangledLanes &= l1, l1 = e.entanglements;
        for(var o = e.eventTimes, u = e.expirationTimes; 0 < i;){
            var s = 31 - Ne(i), d = 1 << s;
            l1[s] = 0, o[s] = -1, u[s] = -1, i &= ~d;
        }
        if (ge !== null && (r & 24) == 0 && ge.has(e) && ge.delete(e), e === X && (j = X = null, $ = 0), 1 < t.flags ? t.lastEffect !== null ? (t.lastEffect.nextEffect = t, r = t.firstEffect) : r = t : r = t.firstEffect, r !== null) {
            if (l1 = x, x |= 32, pi.current = null, zl = Bt, o = Ho(), Nl(o)) {
                if ("selectionStart" in o) u = {
                    start: o.selectionStart,
                    end: o.selectionEnd
                };
                else e: if (u = (u = o.ownerDocument) && u.defaultView || window, (d = u.getSelection && u.getSelection()) && d.rangeCount !== 0) {
                    u = d.anchorNode, i = d.anchorOffset, s = d.focusNode, d = d.focusOffset;
                    try {
                        u.nodeType, s.nodeType;
                    } catch (P) {
                        u = null;
                        break e;
                    }
                    var y = 0, C = -1, h = -1, S = 0, k = 0, E = o, c = null;
                    n: for(;;){
                        for(var a; E !== u || i !== 0 && E.nodeType !== 3 || (C = y + i), E !== s || d !== 0 && E.nodeType !== 3 || (h = y + d), E.nodeType === 3 && (y += E.nodeValue.length), (a = E.firstChild) !== null;)c = E, E = a;
                        for(;;){
                            if (E === o) break n;
                            if (c === u && ++S === i && (C = y), c === s && ++k === d && (h = y), (a = E.nextSibling) !== null) break;
                            E = c, c = E.parentNode;
                        }
                        E = a;
                    }
                    u = C === -1 || h === -1 ? null : {
                        start: C,
                        end: h
                    };
                } else u = null;
                u = u || {
                    start: 0,
                    end: 0
                };
            } else u = null;
            Ol = {
                focusedElem: o,
                selectionRange: u
            }, Bt = !1, St = null, _r = !1, g = r;
            do try {
                mf();
            } catch (P) {
                if (g === null) throw Error(v(330));
                Ve(g, P), g = g.nextEffect;
            }
            while (g !== null)
            St = null, g = r;
            do try {
                for(o = e; g !== null;){
                    var f = g.flags;
                    if (f & 16 && jn(g.stateNode, ""), f & 128) {
                        var p = g.alternate;
                        if (p !== null) {
                            var m = p.ref;
                            m !== null && (typeof m == "function" ? m(null) : m.current = null);
                        }
                    }
                    switch(f & 1038){
                        case 2:
                            os(g), g.flags &= -3;
                            break;
                        case 6:
                            os(g), g.flags &= -3, di(g.alternate, g);
                            break;
                        case 1024:
                            g.flags &= -1025;
                            break;
                        case 1028:
                            g.flags &= -1025, di(g.alternate, g);
                            break;
                        case 4:
                            di(g.alternate, g);
                            break;
                        case 8:
                            u = g, us(o, u);
                            var _ = u.alternate;
                            ls(u), _ !== null && ls(_);
                    }
                    g = g.nextEffect;
                }
            } catch (P1) {
                if (g === null) throw Error(v(330));
                Ve(g, P1), g = g.nextEffect;
            }
            while (g !== null)
            if (m = Ol, p = Ho(), f = m.focusedElem, o = m.selectionRange, p !== f && f && f.ownerDocument && Bo(f.ownerDocument.documentElement, f)) {
                for(o !== null && Nl(f) && (p = o.start, m = o.end, m === void 0 && (m = p), ("selectionStart" in f) ? (f.selectionStart = p, f.selectionEnd = Math.min(m, f.value.length)) : (m = (p = f.ownerDocument || document) && p.defaultView || window, m.getSelection && (m = m.getSelection(), u = f.textContent.length, _ = Math.min(o.start, u), o = o.end === void 0 ? _ : Math.min(o.end, u), !m.extend && _ > o && (u = o, o = _, _ = u), u = Vo(f, _), i = Vo(f, o), u && i && (m.rangeCount !== 1 || m.anchorNode !== u.node || m.anchorOffset !== u.offset || m.focusNode !== i.node || m.focusOffset !== i.offset) && (p = p.createRange(), p.setStart(u.node, u.offset), m.removeAllRanges(), _ > o ? (m.addRange(p), m.extend(i.node, i.offset)) : (p.setEnd(i.node, i.offset), m.addRange(p)))))), p = [], m = f; m = m.parentNode;)m.nodeType === 1 && p.push({
                    element: m,
                    left: m.scrollLeft,
                    top: m.scrollTop
                });
                for(typeof f.focus == "function" && f.focus(), f = 0; f < p.length; f++)m = p[f], m.element.scrollLeft = m.left, m.element.scrollTop = m.top;
            }
            Bt = !!zl, Ol = zl = null, e.current = t, g = r;
            do try {
                for(f = e; g !== null;){
                    var w = g.flags;
                    if (w & 36 && uf(f, g.alternate, g), w & 128) {
                        p = void 0;
                        var N = g.ref;
                        if (N !== null) {
                            var T = g.stateNode;
                            switch(g.tag){
                                case 5:
                                    p = T;
                                    break;
                                default:
                                    p = T;
                            }
                            typeof N == "function" ? N(p) : N.current = p;
                        }
                    }
                    g = g.nextEffect;
                }
            } catch (P2) {
                if (g === null) throw Error(v(330));
                Ve(g, P2), g = g.nextEffect;
            }
            while (g !== null)
            g = null, Ka(), x = l1;
        } else e.current = t;
        if (Ie) Ie = !1, yt = e, gt = n;
        else for(g = r; g !== null;)n = g.nextEffect, g.nextEffect = null, g.flags & 8 && (w = g, w.sibling = null, w.stateNode = null), g = n;
        if (r = e.pendingLanes, r === 0 && (pe = null), r === 1 ? e === ki ? wt++ : (wt = 0, ki = e) : wt = 0, t = t.stateNode, Ke && typeof Ke.onCommitFiberRoot == "function") try {
            Ke.onCommitFiberRoot(Fl, t, void 0, (t.current.flags & 64) == 64);
        } catch (P) {
        }
        if (re(e, A()), kr) throw kr = !1, e = wi, wi = null, e;
        return (x & 8) != 0 || ae(), null;
    }
    function mf() {
        for(; g !== null;){
            var e = g.alternate;
            _r || St === null || ((g.flags & 8) != 0 ? uo(g, St) && (_r = !0) : g.tag === 13 && sf(e, g) && uo(g, St) && (_r = !0));
            var n = g.flags;
            (n & 256) != 0 && of(e, g), (n & 512) == 0 || Ie || (Ie = !0, rt(97, function() {
                return Ue(), null;
            })), g = g.nextEffect;
        }
    }
    function Ue() {
        if (gt !== 90) {
            var e = 97 < gt ? 97 : gt;
            return gt = 90, Ge(e, vf);
        }
        return !1;
    }
    function hf(e, n) {
        Si.push(n, e), Ie || (Ie = !0, rt(97, function() {
            return Ue(), null;
        }));
    }
    function vs(e, n) {
        Ei.push(n, e), Ie || (Ie = !0, rt(97, function() {
            return Ue(), null;
        }));
    }
    function vf() {
        if (yt === null) return !1;
        var e1 = yt;
        if (yt = null, (x & 48) != 0) throw Error(v(331));
        var n = x;
        x |= 32;
        var t = Ei;
        Ei = [];
        for(var r = 0; r < t.length; r += 2){
            var l = t[r], i = t[r + 1], o = l.destroy;
            if (l.destroy = void 0, typeof o == "function") try {
                o();
            } catch (s) {
                if (i === null) throw Error(v(330));
                Ve(i, s);
            }
        }
        for(t = Si, Si = [], r = 0; r < t.length; r += 2){
            l = t[r], i = t[r + 1];
            try {
                var u = l.create;
                l.destroy = u();
            } catch (s) {
                if (i === null) throw Error(v(330));
                Ve(i, s);
            }
        }
        for(u = e1.current.firstEffect; u !== null;)e1 = u.nextEffect, u.nextEffect = null, u.flags & 8 && (u.sibling = null, u.stateNode = null), u = e1;
        return x = n, ae(), !0;
    }
    function ys(e, n, t) {
        n = si(t, n), n = bu(e, n, 1), Re(e, n), n = b(), e = Nr(e, 1), e !== null && (Vt(e, 1, n), re(e, n));
    }
    function Ve(e, n) {
        if (e.tag === 3) ys(e, e, n);
        else for(var t = e.return; t !== null;){
            if (t.tag === 3) {
                ys(t, e, n);
                break;
            } else if (t.tag === 1) {
                var r = t.stateNode;
                if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (pe === null || !pe.has(r))) {
                    e = si(n, e);
                    var l = es(t, e, 1);
                    if (Re(t, l), l = b(), t = Nr(t, 1), t !== null) Vt(t, 1, l), re(t, l);
                    else if (typeof r.componentDidCatch == "function" && (pe === null || !pe.has(r))) try {
                        r.componentDidCatch(n, e);
                    } catch (i) {
                    }
                    break;
                }
            }
            t = t.return;
        }
    }
    function yf(e, n, t) {
        var r = e.pingCache;
        r !== null && r.delete(n), n = b(), e.pingedLanes |= e.suspendedLanes & t, X === e && ($ & t) === t && (H === 4 || H === 3 && ($ & 62914560) === $ && 500 > A() - yi ? Ln(e, 0) : hi |= t), re(e, n);
    }
    function gf(e, n) {
        var t = e.stateNode;
        t !== null && t.delete(n), n = 0, n === 0 && (n = e.mode, (n & 2) == 0 ? n = 1 : (n & 4) == 0 ? n = Sn() === 99 ? 1 : 2 : (we === 0 && (we = _n), n = fn(62914560 & ~we), n === 0 && (n = 4194304))), t = b(), e = Nr(e, n), e !== null && (Vt(e, n, t), re(e, t));
    }
    var gs;
    gs = function(e, n, t) {
        var r = n.lanes;
        if (e !== null) if (e.memoizedProps !== n.pendingProps || K.current) ue = !0;
        else if ((t & r) != 0) ue = (e.flags & 16384) != 0;
        else {
            switch(ue = !1, n.tag){
                case 3:
                    Au(n), Gl();
                    break;
                case 5:
                    Cu(n);
                    break;
                case 1:
                    G(n.type) && nr(n);
                    break;
                case 4:
                    Yl(n, n.stateNode.containerInfo);
                    break;
                case 10:
                    r = n.memoizedProps.value;
                    var l = n.type._context;
                    R(lr, l._currentValue), l._currentValue = r;
                    break;
                case 13:
                    if (n.memoizedState !== null) return (t & n.child.childLanes) != 0 ? Qu(e, n, t) : (R(D, D.current & 1), n = ye(e, n, t), n !== null ? n.sibling : null);
                    R(D, D.current & 1);
                    break;
                case 19:
                    if (r = (t & n.childLanes) != 0, (e.flags & 64) != 0) {
                        if (r) return Gu(e, n, t);
                        n.flags |= 64;
                    }
                    if (l = n.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), R(D, D.current), r) break;
                    return null;
                case 23:
                case 24:
                    return n.lanes = 0, ri(e, n, t);
            }
            return ye(e, n, t);
        }
        else ue = !1;
        switch(n.lanes = 0, n.tag){
            case 2:
                if (r = n.type, e !== null && (e.alternate = null, n.alternate = null, n.flags |= 2), e = n.pendingProps, l = wn(n, W.current), kn(n, t), l = ql(null, n, r, e, l, t), n.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0) {
                    if (n.tag = 1, n.memoizedState = null, n.updateQueue = null, G(r)) {
                        var i = !0;
                        nr(n);
                    } else i = !1;
                    n.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Ql(n);
                    var o = r.getDerivedStateFromProps;
                    typeof o == "function" && ur(n, r, o, e), l.updater = sr, n.stateNode = l, l._reactInternals = n, $l(n, r, e, t), n = ii(null, n, r, !0, i, t);
                } else n.tag = 0, J(null, n, l, t), n = n.child;
                return n;
            case 16:
                l = n.elementType;
                e: {
                    switch(e !== null && (e.alternate = null, n.alternate = null, n.flags |= 2), e = n.pendingProps, i = l._init, l = i(l._payload), n.type = l, i = n.tag = Sf(l), e = oe(l, e), i){
                        case 0:
                            n = li(null, n, l, e, t);
                            break e;
                        case 1:
                            n = Wu(null, n, l, e, t);
                            break e;
                        case 11:
                            n = Uu(null, n, l, e, t);
                            break e;
                        case 14:
                            n = Vu(null, n, l, oe(l.type, e), r, t);
                            break e;
                    }
                    throw Error(v(306, l, ""));
                }
                return n;
            case 0:
                return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : oe(r, l), li(e, n, r, l, t);
            case 1:
                return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : oe(r, l), Wu(e, n, r, l, t);
            case 3:
                if (Au(n), r = n.updateQueue, e === null || r === null) throw Error(v(282));
                if (r = n.pendingProps, l = n.memoizedState, l = l !== null ? l.element : null, hu(e, n), lt(n, r, null, t), r = n.memoizedState.element, r === l) Gl(), n = ye(e, n, t);
                else {
                    if (l = n.stateNode, (i = l.hydrate) && (De = hn(n.stateNode.containerInfo.firstChild), ve = n, i = ce = !0), i) {
                        if (e = l.mutableSourceEagerHydrationData, e != null) for(l = 0; l < e.length; l += 2)i = e[l], i._workInProgressVersionPrimary = e[l + 1], Cn.push(i);
                        for(t = xu(n, null, r, t), n.child = t; t;)t.flags = t.flags & -3 | 1024, t = t.sibling;
                    } else J(e, n, r, t), Gl();
                    n = n.child;
                }
                return n;
            case 5:
                return Cu(n), e === null && Kl(n), r = n.type, l = n.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, Ml(r, l) ? o = null : i !== null && Ml(r, i) && (n.flags |= 16), Hu(e, n), J(e, n, o, t), n.child;
            case 6:
                return e === null && Kl(n), null;
            case 13:
                return Qu(e, n, t);
            case 4:
                return Yl(n, n.stateNode.containerInfo), r = n.pendingProps, e === null ? n.child = cr(n, null, r, t) : J(e, n, r, t), n.child;
            case 11:
                return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : oe(r, l), Uu(e, n, r, l, t);
            case 7:
                return J(e, n, n.pendingProps, t), n.child;
            case 8:
                return J(e, n, n.pendingProps.children, t), n.child;
            case 12:
                return J(e, n, n.pendingProps.children, t), n.child;
            case 10:
                e: {
                    r = n.type._context, l = n.pendingProps, o = n.memoizedProps, i = l.value;
                    var u = n.type._context;
                    if (R(lr, u._currentValue), u._currentValue = i, o !== null) if (u = o.value, i = ee(u, i) ? 0 : (typeof r._calculateChangedBits == "function" ? r._calculateChangedBits(u, i) : 1073741823) | 0, i === 0) {
                        if (o.children === l.children && !K.current) {
                            n = ye(e, n, t);
                            break e;
                        }
                    } else for(u = n.child, u !== null && (u.return = n); u !== null;){
                        var s = u.dependencies;
                        if (s !== null) {
                            o = u.child;
                            for(var d = s.firstContext; d !== null;){
                                if (d.context === r && (d.observedBits & i) != 0) {
                                    u.tag === 1 && (d = Me(-1, t & -t), d.tag = 2, Re(u, d)), u.lanes |= t, d = u.alternate, d !== null && (d.lanes |= t), mu(u.return, t), s.lanes |= t;
                                    break;
                                }
                                d = d.next;
                            }
                        } else o = u.tag === 10 && u.type === n.type ? null : u.child;
                        if (o !== null) o.return = u;
                        else for(o = u; o !== null;){
                            if (o === n) {
                                o = null;
                                break;
                            }
                            if (u = o.sibling, u !== null) {
                                u.return = o.return, o = u;
                                break;
                            }
                            o = o.return;
                        }
                        u = o;
                    }
                    J(e, n, l.children, t), n = n.child;
                }
                return n;
            case 9:
                return l = n.type, i = n.pendingProps, r = i.children, kn(n, t), l = ne(l, i.unstable_observedBits), r = r(l), n.flags |= 1, J(e, n, r, t), n.child;
            case 14:
                return l = n.type, i = oe(l, n.pendingProps), i = oe(l.type, i), Vu(e, n, l, i, r, t);
            case 15:
                return Bu(e, n, n.type, n.pendingProps, r, t);
            case 17:
                return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : oe(r, l), e !== null && (e.alternate = null, n.alternate = null, n.flags |= 2), n.tag = 1, G(r) ? (e = !0, nr(n)) : e = !1, kn(n, t), Su(n, r, l), $l(n, r, l, t), ii(null, n, r, !0, e, t);
            case 19:
                return Gu(e, n, t);
            case 23:
                return ri(e, n, t);
            case 24:
                return ri(e, n, t);
        }
        throw Error(v(156, n.tag));
    };
    function wf(e, n, t, r) {
        this.tag = e, this.key = t, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = n, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.flags = 0, this.lastEffect = this.firstEffect = this.nextEffect = null, this.childLanes = this.lanes = 0, this.alternate = null;
    }
    function le(e, n, t, r) {
        return new wf(e, n, t, r);
    }
    function _i(e) {
        return e = e.prototype, !(!e || !e.isReactComponent);
    }
    function Sf(e) {
        if (typeof e == "function") return _i(e) ? 1 : 0;
        if (e != null) {
            if (e = e.$$typeof, e === Nt) return 11;
            if (e === Tt) return 14;
        }
        return 2;
    }
    function Be(e, n) {
        var t = e.alternate;
        return t === null ? (t = le(e.tag, n, e.key, e.mode), t.elementType = e.elementType, t.type = e.type, t.stateNode = e.stateNode, t.alternate = e, e.alternate = t) : (t.pendingProps = n, t.type = e.type, t.flags = 0, t.nextEffect = null, t.firstEffect = null, t.lastEffect = null), t.childLanes = e.childLanes, t.lanes = e.lanes, t.child = e.child, t.memoizedProps = e.memoizedProps, t.memoizedState = e.memoizedState, t.updateQueue = e.updateQueue, n = e.dependencies, t.dependencies = n === null ? null : {
            lanes: n.lanes,
            firstContext: n.firstContext
        }, t.sibling = e.sibling, t.index = e.index, t.ref = e.ref, t;
    }
    function Tr(e, n, t, r, l, i) {
        var o = 2;
        if (r = e, typeof e == "function") _i(e) && (o = 1);
        else if (typeof e == "string") o = 5;
        else e: switch(e){
            case Ee:
                return zn(t.children, l, i, n);
            case Vi:
                o = 8, l |= 16;
                break;
            case Fr:
                o = 8, l |= 1;
                break;
            case Rn:
                return e = le(12, t, n, l | 8), e.elementType = Rn, e.type = Rn, e.lanes = i, e;
            case Dn:
                return e = le(13, t, n, l), e.type = Dn, e.elementType = Dn, e.lanes = i, e;
            case Pt:
                return e = le(19, t, n, l), e.elementType = Pt, e.lanes = i, e;
            case Wr:
                return Ni(t, l, i, n);
            case Ar:
                return e = le(24, t, n, l), e.elementType = Ar, e.lanes = i, e;
            default:
                if (typeof e == "object" && e !== null) switch(e.$$typeof){
                    case jr:
                        o = 10;
                        break e;
                    case Ur:
                        o = 9;
                        break e;
                    case Nt:
                        o = 11;
                        break e;
                    case Tt:
                        o = 14;
                        break e;
                    case Vr:
                        o = 16, r = null;
                        break e;
                    case Br:
                        o = 22;
                        break e;
                }
                throw Error(v(130, e == null ? e : typeof e, ""));
        }
        return n = le(o, t, n, l), n.elementType = e, n.type = r, n.lanes = i, n;
    }
    function zn(e, n, t, r) {
        return e = le(7, e, r, n), e.lanes = t, e;
    }
    function Ni(e, n, t, r) {
        return e = le(23, e, r, n), e.elementType = Wr, e.lanes = t, e;
    }
    function Pi(e, n, t) {
        return e = le(6, e, null, n), e.lanes = t, e;
    }
    function Ti(e, n, t) {
        return n = le(4, e.children !== null ? e.children : [], e.key, n), n.lanes = t, n.stateNode = {
            containerInfo: e.containerInfo,
            pendingChildren: null,
            implementation: e.implementation
        }, n;
    }
    function Ef(e, n, t) {
        this.tag = n, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.pendingContext = this.context = null, this.hydrate = t, this.callbackNode = null, this.callbackPriority = 0, this.eventTimes = hl(0), this.expirationTimes = hl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = hl(0), this.mutableSourceEagerHydrationData = null;
    }
    function kf(e, n, t) {
        var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
        return {
            $$typeof: Ae,
            key: r == null ? null : "" + r,
            children: e,
            containerInfo: n,
            implementation: t
        };
    }
    function Lr(e, n, t, r) {
        var l1 = n.current, i = b(), o = Fe(l1);
        e: if (t) {
            t = t._reactInternals;
            n: {
                if ($e(t) !== t || t.tag !== 1) throw Error(v(170));
                var u = t;
                do {
                    switch(u.tag){
                        case 3:
                            u = u.stateNode.context;
                            break n;
                        case 1:
                            if (G(u.type)) {
                                u = u.stateNode.__reactInternalMemoizedMergedChildContext;
                                break n;
                            }
                    }
                    u = u.return;
                }while (u !== null)
                throw Error(v(171));
            }
            if (t.tag === 1) {
                var s = t.type;
                if (G(s)) {
                    t = lu(t, s, u);
                    break e;
                }
            }
            t = u;
        } else t = ze;
        return n.context === null ? n.context = t : n.pendingContext = t, n = Me(i, o), n.payload = {
            element: e
        }, r = r === void 0 ? null : r, r !== null && (n.callback = r), Re(l1, n), je(l1, o, i), o;
    }
    function Li(e) {
        if (e = e.current, !e.child) return null;
        switch(e.child.tag){
            case 5:
                return e.child.stateNode;
            default:
                return e.child.stateNode;
        }
    }
    function ws(e, n) {
        if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
            var t = e.retryLane;
            e.retryLane = t !== 0 && t < n ? t : n;
        }
    }
    function zi(e, n) {
        ws(e, n), (e = e.alternate) && ws(e, n);
    }
    function xf() {
        return null;
    }
    function Oi(e, n, t) {
        var r = t != null && t.hydrationOptions != null && t.hydrationOptions.mutableSources || null;
        if (t = new Ef(e, n, t != null && t.hydrate === !0), n = le(3, null, null, n === 2 ? 7 : n === 1 ? 3 : 0), t.current = n, n.stateNode = t, Ql(n), e[vn] = t.current, Xo(e.nodeType === 8 ? e.parentNode : e), r) for(e = 0; e < r.length; e++){
            n = r[e];
            var l = n._getVersion;
            l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [
                n,
                l
            ] : t.mutableSourceEagerHydrationData.push(n, l);
        }
        this._internalRoot = t;
    }
    Oi.prototype.render = function(e) {
        Lr(e, this._internalRoot, null, null);
    };
    Oi.prototype.unmount = function() {
        var e1 = this._internalRoot, n = e1.containerInfo;
        Lr(null, e1, null, function() {
            n[vn] = null;
        });
    };
    function kt(e) {
        return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
    }
    function Cf(e, n) {
        if (n || (n = e ? e.nodeType === 9 ? e.documentElement : e.firstChild : null, n = !(!n || n.nodeType !== 1 || !n.hasAttribute("data-reactroot"))), !n) for(var t; t = e.lastChild;)e.removeChild(t);
        return new Oi(e, 0, n ? {
            hydrate: !0
        } : void 0);
    }
    function zr(e, n, t, r, l) {
        var i = t._reactRootContainer;
        if (i) {
            var o = i._internalRoot;
            if (typeof l == "function") {
                var u = l;
                l = function() {
                    var d = Li(o);
                    u.call(d);
                };
            }
            Lr(n, o, e, l);
        } else {
            if (i = t._reactRootContainer = Cf(t, r), o = i._internalRoot, typeof l == "function") {
                var s = l;
                l = function() {
                    var d = Li(o);
                    s.call(d);
                };
            }
            cs(function() {
                Lr(n, o, e, l);
            });
        }
        return Li(o);
    }
    so = function(e) {
        if (e.tag === 13) {
            var n = b();
            je(e, 4, n), zi(e, 4);
        }
    };
    al = function(e) {
        if (e.tag === 13) {
            var n = b();
            je(e, 67108864, n), zi(e, 67108864);
        }
    };
    ao = function(e) {
        if (e.tag === 13) {
            var n = b(), t = Fe(e);
            je(e, t, n), zi(e, t);
        }
    };
    fo = function(e, n) {
        return n();
    };
    tl = function(e, n, t) {
        switch(n){
            case "input":
                if (Xr(e, t), n = t.name, t.type === "radio" && n != null) {
                    for(t = e; t.parentNode;)t = t.parentNode;
                    for(t = t.querySelectorAll("input[name=" + JSON.stringify("" + n) + '][type="radio"]'), n = 0; n < t.length; n++){
                        var r = t[n];
                        if (r !== e && r.form === e.form) {
                            var l = bt(r);
                            if (!l) throw Error(v(90));
                            Wi(r), Xr(r, l);
                        }
                    }
                }
                break;
            case "textarea":
                Xi(e, t);
                break;
            case "select":
                n = t.value, n != null && rn(e, !!t.multiple, n, !1);
        }
    };
    rl = fs;
    to = function(e, n, t, r, l) {
        var i = x;
        x |= 4;
        try {
            return Ge(98, e.bind(null, n, t, r, l));
        } finally{
            x = i, x === 0 && (Pn(), ae());
        }
    };
    ll = function() {
        (x & 49) == 0 && (ff(), Ue());
    };
    ro = function(e, n) {
        var t = x;
        x |= 2;
        try {
            return e(n);
        } finally{
            x = t, x === 0 && (Pn(), ae());
        }
    };
    function Ss(e, n) {
        var t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!kt(n)) throw Error(v(200));
        return kf(e, n, null, t);
    }
    var _f = {
        Events: [
            tt,
            yn,
            bt,
            eo,
            no,
            Ue,
            {
                current: !1
            }
        ]
    }, xt = {
        findFiberByHostInstance: Ye,
        bundleType: 0,
        version: "17.0.2",
        rendererPackageName: "react-dom"
    }, Nf = {
        bundleType: xt.bundleType,
        version: xt.version,
        rendererPackageName: xt.rendererPackageName,
        rendererConfig: xt.rendererConfig,
        overrideHookState: null,
        overrideHookStateDeletePath: null,
        overrideHookStateRenamePath: null,
        overrideProps: null,
        overridePropsDeletePath: null,
        overridePropsRenamePath: null,
        setSuspenseHandler: null,
        scheduleUpdate: null,
        currentDispatcherRef: We.ReactCurrentDispatcher,
        findHostInstanceByFiber: function(e) {
            return e = oo(e), e === null ? null : e.stateNode;
        },
        findFiberByHostInstance: xt.findFiberByHostInstance || xf,
        findHostInstancesForRefresh: null,
        scheduleRefresh: null,
        scheduleRoot: null,
        setRefreshHandler: null,
        getCurrentFiber: null
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ != "undefined" && (Ct = __REACT_DEVTOOLS_GLOBAL_HOOK__, !Ct.isDisabled && Ct.supportsFiber)) try {
        Fl = Ct.inject(Nf), Ke = Ct;
    } catch (e1) {
    }
    var Ct;
    ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _f;
    ie.createPortal = Ss;
    ie.findDOMNode = function(e) {
        if (e == null) return null;
        if (e.nodeType === 1) return e;
        var n = e._reactInternals;
        if (n === void 0) throw typeof e.render == "function" ? Error(v(188)) : Error(v(268, Object.keys(e)));
        return e = oo(n), e = e === null ? null : e.stateNode, e;
    };
    ie.flushSync = function(e, n) {
        var t = x;
        if ((t & 48) != 0) return e(n);
        x |= 1;
        try {
            if (e) return Ge(99, e.bind(null, n));
        } finally{
            x = t, ae();
        }
    };
    ie.hydrate = function(e, n, t) {
        if (!kt(n)) throw Error(v(200));
        return zr(null, e, n, !0, t);
    };
    ie.render = function(e, n, t) {
        if (!kt(n)) throw Error(v(200));
        return zr(null, e, n, !1, t);
    };
    ie.unmountComponentAtNode = function(e) {
        if (!kt(e)) throw Error(v(40));
        return e._reactRootContainer ? (cs(function() {
            zr(null, null, e, !1, function() {
                e._reactRootContainer = null, e[vn] = null;
            });
        }), !0) : !1;
    };
    ie.unstable_batchedUpdates = fs;
    ie.unstable_createPortal = function(e, n) {
        return Ss(e, n, 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null);
    };
    ie.unstable_renderSubtreeIntoContainer = function(e, n, t, r) {
        if (!kt(t)) throw Error(v(200));
        if (e == null || e._reactInternals === void 0) throw Error(v(38));
        return zr(e, n, t, !1, r);
    };
    ie.version = "17.0.2";
});
var Mi = Ri((Of, xs)=>{
    "use strict";
    function ks() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ks);
        } catch (e) {
            console.error(e);
        }
    }
    ks(), xs.exports = Es();
});
var Pf = Di(Mi()), Tf = Di(Mi()), { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Mf , createPortal: Rf , findDOMNode: Df , flushSync: If , hydrate: Ff , render: jf , unmountComponentAtNode: Uf , unstable_batchedUpdates: Vf , unstable_createPortal: Bf , unstable_renderSubtreeIntoContainer: Hf , version: Wf  } = Pf;
Tf.default;
jf(export_default1.createElement(Npap), document.querySelector('div#npap'));

