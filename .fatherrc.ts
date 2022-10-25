import { defineConfig } from 'father';

export default defineConfig({
  esm: {},
  cjs: {},
  umd: {
    entry: {
      'src/index': {},
    },
  },
});
