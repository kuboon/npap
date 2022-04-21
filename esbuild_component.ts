import { merge } from "lume/core/utils.ts";
import * as esbuild from "lume/deps/esbuild.ts";
import type { Data, Engine, Helper, Site } from "lume/core.ts";

const loader = (site: Site, options: Partial<Options>) => async (path: string) => {
  const filename = path;
  site.logger.log("📦", filename);

  const buildOptions: esbuild.BuildOptions = {
    ...options.options,
    write: false,
    incremental: false,
    watch: false,
    metafile: false,
    entryPoints: [filename],
  };

  const { outputFiles, warnings, errors } = await esbuild.build(
    buildOptions,
  );

  if (errors.length) {
    site.logger.warn("esbuild errors", { errors });
  }

  if (warnings.length) {
    site.logger.warn("esbuild warnings", { warnings });
  }

  const data: Data = {};
  if (outputFiles?.length) {
    data.content = outputFiles[0].text;
  }

  return data;
}

export interface Options {
  /** The list of extensions this plugin applies to */
  extensions: string[];

  /** The options for esbuild */
  options: esbuild.BuildOptions;
}

// Default options
const defaults: Options = {
  extensions: [".ts", ".js"],
  options: {
    bundle: true,
    format: "esm",
    minify: true,
    keepNames: true,
    platform: "browser",
    target: "esnext",
    incremental: true,
    treeShaking: true,
  },
};

export class EsbuildEngine implements Engine {
  helpers: Record<string, Helper> = {};

  deleteCache() {}

  async render(content: unknown, data: Data = {}) {
    await console.log(content, data)
    return 'esbuilded';
  }

  renderSync(content: string, _data: Data = {}): string {
    return content;
  }

  addHelper(name: string, fn: Helper) {
    this.helpers[name] = fn;
  }
}
export default function (userOptions?: Partial<Options>) {
  const options = merge(defaults, userOptions);
  const extensions = Array.isArray(options.extensions)
  ? { pages: options.extensions, components: options.extensions }
  : options.extensions;

  return (site: Site) => {
    const engine = new EsbuildEngine();
    site.loadComponents(extensions.components, loader(site, options), engine);
    site.addEventListener("beforeSave", () => esbuild.stop());
  };
}
