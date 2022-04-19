#!/usr/bin/env -S deno run --allow-read=docs --allow-write=docs
import { DOMParser, Element, DocumentType } from "https://deno.land/x/deno_dom@v0.1.15-alpha/deno-dom-wasm.ts";
const html = await Deno.readTextFile('docs/NPAP/index.html');
const doc = new DOMParser().parseFromString(html, "text/html")!;
for(const el of doc.querySelectorAll("link[rel='preload']")){
  el.remove()
}
for(const el of doc.querySelectorAll("script")){
  el.remove()
}
const scriptTag = doc.createElement('script')
const js = await Deno.readTextFile('docs/npap.js');
scriptTag.innerText = js
scriptTag.attributes.type = 'module'
doc.body.appendChild(scriptTag)
const output = '<!DOCTYPE html>' + (doc.childNodes[1] as Element).outerHTML
await Deno.writeTextFile('docs/NPAP.html', output)
