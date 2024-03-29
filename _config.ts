import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";
import inline from "lume/plugins/inline.ts";
import jsx from "lume/plugins/jsx.ts";
import sass from "lume/plugins/sass.ts";

const site = lume({
  src: './src'
});

site.copy("_assets", ".");
site.use(esbuild({extensions: [".ts", ".tsx"], options: {minify: true, charset: 'utf8', sourcemap: false}}));
site.use(jsx({extensions: [".page.tsx"]}));
site.use(sass());
site.use(inline());

export default site;
