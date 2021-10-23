// https://alephjs.org/docs/api-reference/config
import type { Config } from 'aleph/types.d.ts'

export default <Config>{
  build: {
    target: 'es2020',
    browsers: { chrome: 90, safari: 13 },
    outputDir: '/dist',
  },
  i18n: {
    defaultLocale: 'ja'
  }
}
