import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.wireit', 'dist/']
  },

  eslint.configs.recommended,

  {
    files: ['*.astro'],
    languageOptions: {
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        project: './tsconfig.lint.json'
      }
    },
    plugins: {
      eslintPluginAstro
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    rules: {
      ...eslintPluginAstro.configs.recommended.rules
    }
  },

  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json', // target the base config file, not the build one
        tsconfigRootDir: import.meta.dirname
      }
    }
  },

  prettierConfig
);
