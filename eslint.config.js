import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "playwright-report",
      "test-results",
      "coverage",
      "src/components/ui/**",
      ".reference-kratea/**",
      ".previous-landing/**",
      ".playwright-cli/**",
      "docs/**",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    // A provider and its useX hook belong in one file — splitting them to keep
    // fast refresh happy trades a real API for a dev-server nicety.
    files: ["src/context/**/*.tsx", "src/hooks/**/*.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    files: ["**/*.test.{ts,tsx}", "e2e/**/*.ts", "scripts/**/*.ts"],
    languageOptions: { globals: { ...globals.node } },
  },
);
