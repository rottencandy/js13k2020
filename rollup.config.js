import { terser } from "rollup-plugin-terser";

export default {
  input: "src/main.js",
  output: {
    file: "app/main.js",
    format: "iife",
  },
  plugins: [
    terser({
      warnings: false,
    }),
  ],
};
