#!/usr/bin/env -S deno run --allow-read=docs --allow-write=docs/NPAP/bundled.html
import { DOMParser, Element, DocumentType } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
const html = await Deno.readTextFile('docs/NPAP/index.html');
const doc = new DOMParser().parseFromString(html, "text/html")!;
const preloads = doc.querySelectorAll("link[rel='preload']")!;
for(const el of preloads){
  el.remove()
}
const scripts: string[] = [];
for(const el_ of doc.querySelectorAll("script[src]")){
  const el = el_ as Element
  const script = await Deno.readTextFile('docs/' + el.attributes.src);
  scripts.push(script)
  el.remove()
}
const scriptTag = doc.createElement('script')
scriptTag.innerText = scripts.join('')
doc.body.appendChild(scriptTag)
const output = '<!DOCTYPE html>' + (doc.childNodes[1] as Element).outerHTML
await Deno.writeTextFile('public/bundled.html', output)
// await Deno.writeTextFile('docs/NPAP/bundled.html', output)
