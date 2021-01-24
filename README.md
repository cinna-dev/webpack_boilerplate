# Webpack Boilerplate

## Directory

- [Installation](#installation)

- [list of Dependincies](#list-of-dependencies)

- [Scripts](#scripts)

- [Environment Variables](#environment-variables)

- [Useful Cli's](#useful-clis)

- [Features](#features)

## Installation

```bash
npm i
```

### List of Dependencies

```bash
webpack webpack-cli html-loader style-loader css-loader csv-loader xml-loader toml yamljs json5 html-webpack-plugin clean-webpack-plugin  webpack-dev-server mini-css-extract-plugin css-minimizer-webpack-plugin sass-loader node-sass  babel-loader @babel/core @babel/preset-env
```

## Scripts

```json
  "start": "webpack serve --env development sourcemap",
  "build": "webpack --progress=profile --env production babel",
```

## Environment Variables

- `production` : bundles for production

- `development` : bundles for development

- `babel` : converts to ES5

- `sourcemap` : adds sourcemaps

## Useful Cli's

`--progress` : displays progress while compiling

`--progress=profile` : advanced progress display

## Features

- generates html file

- cleans up dist folder

- ~~loads css and parses it into js~~

- loads css and creates a style sheet for each js file

- sass ,scss

- babel

- loads and bundles images

- loads and bundles fonts

- lazy loading :

  - `import` a default module

- bundles js files

- supports multiple entry points

- loads data types like JSON, JSON5 , XML, TSV, CSV, YAML, TOML and parses it into js

- cache busting

- dynamic code-splitting

- use runtimeChunk

- extract third party libraries to separate vendors

- scripts:

  -`run watch` : observes the src folder for changes. If so rebuilds the bundle

  -`start` : runs dev-server and watches src folder for changes

  -`run build` : builds bundle

> No need for specific file loaders in webpack 5 as it comes with its own called `asset modules`

## Instruction

### Sass

Since Sass implementations don't provide url rewriting, all linked assets must be relative to the output.

sass : import from node_modules via ~

```js
@import "~bootstrap";
```
