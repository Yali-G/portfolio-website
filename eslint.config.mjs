import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Add this ignore block at the very beginning of your config array
  {
    ignores: [
      "node_modules/", // Standard ignore
      ".next/",        // Next.js build output
      "dist/",         // Common build output
      "build/",        // Another common build output
      "public/",       // Often contains static assets, not source code
      "*.json",        // Ignore JSON files if not needed for linting
      "*.md",          // Ignore Markdown files
      "*.css",         // Ignore CSS files if you don't have a CSS linter set up
      // Add any other directories or file patterns that should be ignored
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Your custom rules go here, if any
      // "@typescript-eslint/no-unused-expressions": "off", // Keep off for now if you need to debug
    },
  },
  prettierConfig,
];

export default eslintConfig;