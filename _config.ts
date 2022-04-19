import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";
import jsx from "lume/plugins/jsx.ts";
import sass from "lume/plugins/sass.ts";
import base_path from "lume/plugins/base_path.ts";

const site = lume();

site.use(base_path());
site.use(jsx({extensions: [".page.tsx"]}));
site.use(esbuild({extensions: [".ts", ".tsx"]}));
site.use(sass());

export default site;
