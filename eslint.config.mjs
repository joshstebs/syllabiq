import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    rules: {
      // Existing UI code uses a few intentional hydration effects and legacy
      // untyped integration payloads. Keep them visible without blocking the
      // correctness lint gate while they are migrated incrementally.
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "@next/next/no-location-assign-relative-destination": "warn"
    }
  },
  {
    files: ["tests/**/*.test.cjs"],
    rules: {
      // These CommonJS fixtures compile isolated TypeScript modules.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
