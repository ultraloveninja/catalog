import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "docs/build/**",
      "packages/*/dist/**",
      "packages/core/types/**",
      "packages/standalone/catalog.development.js",
      "packages/standalone/catalog.min.js",
      "**/*.tsbuildinfo"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    }
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^(React|_)",
          caughtErrorsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: ["packages/cli/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-object-type": "off"
    }
  },
  {
    files: ["packages/babel-preset/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    settings: {
      react: { version: "detect" }
    }
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"]
        },
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    }
  },
  {
    files: ["**/*.test.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      "react/no-unknown-property": "off"
    }
  },
  {
    files: ["packages/core/src/components/Frame/FrameComponent.js"],
    rules: {
      "react/no-deprecated": "off"
    }
  },
  {
    rules: {
      "no-prototype-builtins": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^(React|_)",
          caughtErrorsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: ["packages/core/**/*.{js,jsx}"],
    rules: {
      eqeqeq: ["warn", "always", { null: "ignore" }]
    }
  },
  eslintConfigPrettier
);
