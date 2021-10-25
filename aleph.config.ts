// https://alephjs.org/docs/api-reference/config
import type { Config, Plugin } from "aleph/types.d.ts";

const bundleJs: Plugin = {
  name: "bundleJs",
  setup: async (aleph) => {
    aleph.onTransform('main', (args) => {
      console.log(args.code)
    })
    aleph.onRender(({ path, html }) => {
      if (path != "/NPAP") return;
      console.log(html.body);
    });
  },
};

export default <Config> {
  build: {
    target: "es2020",
    browsers: { chrome: 90, ios: 13 },
    outputDir: "/dist",
  },
  i18n: {
    defaultLocale: "ja",
  },
  plugins: [bundleJs],
};
