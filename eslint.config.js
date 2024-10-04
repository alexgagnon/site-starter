import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.astro/', '.husky/', '.wireit', 'dist/', 'node_modules/'],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json', // target the base config file, not the build one
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "no-unsafe-assignment": "off",
      "no-unsafe-call": "off",
      "no-unsafe-member-access": "off",
      "no-unsafe-return": "off",
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ...eslintPluginAstro.configs.recommended,
  prettierConfig
);
