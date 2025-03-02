import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended, 
  pluginReact.configs.flat.recommended, 
  prettier,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    languageOptions: {
      globals: globals.browser, 
      ecmaVersion: "latest", 
      sourceType: "module", 
    },
    settings: {
      react: { version: "detect" }, 
    },
    plugins: {
      react: pluginReact, 
    },
    rules: {
      "react/react-in-jsx-scope": 0,
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "no-console": "warn", 
      "react/prop-types": "off", 
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
