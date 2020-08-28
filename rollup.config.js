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
      compress: { ecma: 2016, passes: 1, unsafe_arrows: true },
      mangle: { module: true, toplevel: true },
    }),
  ],
};
