import lume from "lume/mod.ts";
import esbuild from "./esbuild_component.ts";
import jsx from "lume/plugins/jsx.ts";
import sass from "lume/plugins/sass.ts";

const site = lume({
  src: './src',
  dest: './docs',
});

site.use(esbuild({extensions: [".ts", ".tsx"]}));
site.use(jsx({extensions: [".page.tsx"]}));
site.use(sass());
site.copy("_assets", ".");

export default site;
