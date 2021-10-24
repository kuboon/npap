#!/usr/bin/env -S deno run --allow-read=docs --allow-write=docs/NPAP/bundled.html
import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
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
const output = doc.head.outerHTML + doc.body.outerHTML + `<script>${scripts.join('')}</script>`
await Deno.writeTextFile('docs/NPAP/bundled.html', output)
