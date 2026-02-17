import js from "@eslint/js";

export default [
  {
    ignores: ["container-claude/", "eslint/"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        process: "readonly",
      },
    },
  },
];
