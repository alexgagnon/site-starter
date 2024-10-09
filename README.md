# Site Starter

A template used to quickly create high-performance websites using (Astro)[https://astro.build] and (Ferment UI)[https://github.com/ferment-ui].

## Setup

In order for things to work correctly, you must setup the project with the following rules:

- raw files like favicons, non-optimized svgs and non-subsetted/compressed font files fo into `./raw/favicon/`, `./raw/svg/` and `./raw/fonts/`, respectively
  - `npm run favicon` will generate multiple versions of the favicon for different platforms
  - `npm run svg:optimize` will optimize SVGs and create new files in `./public/svg/`
  - `npm run svg:spritemap` will convert items in folders under `./public/svg/sprites/{name}/*` into single sprite maps in `./public/sprites/{name}.svg`
  - `npm run fonts:subset` will optimize/compress them and create new files in `./public/fonts/`

## GOTCHAS!!

- due to the CSS Cascade and the way Astro injects CSS, ALWAYS import 'Layout' (which imports global styles) before any components (which imports component specific styles). Otherwise your global CSS might override your component CSS.

## Usage

Scripts are controlled using Wireit, which includes features like script dependencies, automatic cleaning of output folders, caching, and a watch mode. If you make substantial changes to the project structure, you may need to update the `files` and/or `outputs` properties of the wireit tasks, otherwise the caching won't work as expected. See [the wireit docs](https://github.com/google/wireit/blob/main/README.md) for more details.

Prettier is used for formatting (note that it can fallback to using .editorconfig if the file is present and a matching rule in prettier is not defined).

ESLint has been augmented with typescript-eslint with Type Information mode activated for extra linting powers.

When you commit, Husky runs Lint-Staged, which will run Prettier (with --write option) and ESLint in that order. If it fails, you need to correct the errors in the staged files.

Deploy using Wrangler. The only files that should be needed are those in `dist`.
