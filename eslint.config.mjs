import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "script" },
    rules: {
        quotes: ["error", "double", {
            avoidEscape: false,
        }],
        "sort-keys": ["error", "asc", {
          caseSensitive: true,
          natural: false, // alphanumeric string sorting, not numeric
          minKeys: 2
        }]
    },
  },
  {
    files: ["writeJson.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },
]);
