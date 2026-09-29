import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  /*
   * Accessibility is a launch requirement, so we lint at jsx-a11y's *strict*
   * level rather than the lighter set eslint-config-next ships. The plugin is
   * already registered by next's config, so we layer only its strict *rules* on
   * top — spreading the whole flat config would re-register the plugin and error.
   */
  { rules: { ...jsxA11y.flatConfigs.strict.rules } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
