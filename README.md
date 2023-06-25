# ReactJS with Webpack Infrastructure

## Initial Setup of a ReactJS project

1. Start a git repository
   - `git init`
   - create `.gitignore` and add `node_modules` and `.vscode` to it.

2. Start an NPM project
   - `npm init -y` the -y option means that we accept the default config options.

3. Install web based ReactJS
   - `npm i react react-dom`

4. Install Typescript and the ReactJS type definitions
   - `npm i --save-dev typescript @types/react @types/react-dom`


## Install Webpack

1. Install Webpack along with some plugins related to the development webserver and the creation of html files:
   - `npm i --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin`

2. Install the typesctipt loader for Webpack:
   - `npm i --save-dev ts-loader`


## Install the Testing infrastructure

1. Install the Testing infrastructure - "Jest" and the "React Testing Library":
   - `npm i --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event`
   - `npm i --save-dev jest-environment-jsdom` - for running jest as web environment (no longer installed along `jest` package)
   - `npm i --save-dev identity-obj-proxy` - for being able to deal with `.module.scss` imports:
   For more on `identity-obj-proxy` check this out: https://jestjs.io/docs/29.1/webpack#mocking-css-modules

2. Add the "Jest" and the "React Testing Library" dependencies related to Typescript:
   - `npm i --save-dev ts-jest @types/jest`
   Check out more for `ts-jest` on this address: https://kulshekhar.github.io/ts-jest/docs/processing
   and on Jest code transformers: https://jestjs.io/docs/next/code-transformation

3. Add `jest.config.js` file in the project root directory:
```js
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {// https://jestjs.io/docs/29.1/configuration/#modulenamemapper-objectstring-string--arraystring
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    /** 
     * "setupFilesAfterEnv" will make available all the "matchers" from https://github.com/testing-library/jest-dom
     * available in all our test files.
     * "setupFilesAfterEnv" docs at: https://jestjs.io/docs/configuration#setupfilesafterenv-array
     */
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  };
```

1. Add npm script in the `package.json` file:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```


## Initial project structure

1. Create `public/index.html`:
   
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ReactJS Project</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

2. Create `src/App.tsx`:
   
```typescript
import React from 'react'

const App = () => (
  <>
    <h1>ReactJS Project</h1>
  </>
);

export default App;
```

3. Create `src/index.tsx`
```typescript
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if(container) {
    const root = createRoot(container);
    root.render(<App />);
}
```


## Create a tsconfig.json

1. Create a file called `tsconfig.json` in the root directory:

```json
{
  "compilerOptions": {
      "target": "es6",
      "lib": ["dom", "dom.iterable", "esnext"],
      "outDir": "./dist",
      "sourceMap": true,
      "allowJs": true,
      "strict": false,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "jsx": "react-jsx",
      "jsxImportSource": "react"
  },
  "include": ["src"]
}
```

- `target`: `es6` will target the most of the modern browsers (the most prominent reason to use `es5` is to support Internet Explorer 11)

- `outDir`: Specifies the output directory for the generated JavaScript and declaration files.

- `sourceMap`: Generates source map files to enable easier debugging in the browser.

- `module`: Which module system to use. Values like `esnext`, `es6` for newer browsers, `commonjs` for older browsers and NodeJS.

- `jsx`: When set to `react-jsx` we don't need to include React in every `.tsx` or `.jsx` file.

- `esModuleInterop`: Ensures compatibility between `es6` modules and packages in `node_modules` that use `CommonJS/AMD/UMD`.


## Create webpack.config.js

1. Create `webpack.config.js` in the project root with the following content:
   
```javascript

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// https://webpack.js.org/configuration/
module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"] // enables the imports of those files without extension
  },
  module: {
    rules:[
      {
        test: /\.(ts|js)x?$/, // matches .ts and .tsx files
        use: 'ts-loader', // applies ts-loader to the matched files
        exclude: /node_modules/, // excludes files in the node_modules directory
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html")
    })
  ],
  devServer: {
    port: 3000,
    open: true,
    /**
     * Enables the fallback to index.html
     * https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
     */
    historyApiFallback: true,
  }
};
1
```

2. Add `dist` to `.gitignore`
3. Add `scripts` commands in `package.json`:
   
```json
{
  //... other options
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
  }
}

```


## Configure Hot Module Replacement (HMR) in Webpack

https://webpack.js.org/guides/hot-module-replacement/
https://webpack.js.org/configuration/dev-server/#devserverhot

1. Install dependencies: 
   - `npm i -D @pmmmwh/react-refresh-webpack-plugin react-refresh-typescript`

2. Detect environment in `webpack.config.js`: 
   - add this line: `const isDevelopment = process.env.NODE_ENV !== 'production';`

3. Import the modules: 
```javascript
// webpack.config.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
```


3. Add `ReactRefreshWebpackPlugin` to the configured webpack plugins array:

```Javascript
// webpack.config.js
{
  plugins: [
    // ... opther plugins
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
}

```

4. Add custom transformer to `ts-loader`:
   
```javascript
// webpack.config.js
{
  // ...
  module: {
    // ...
    rules: [
      {
        // ...
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({
            before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
          })
        },
      }
    ]
  }
}

```

## Add Prettier (code formatter)
Documentation at: https://prettier.io/docs/en/index.html

1. Add prettier as npm dev dependency:
   - `npm i -D prettier`

2. Add configuration file:
   - create a file in the project's root folder called `.prettierrc` with content:
  
```json
{
  "printWidth": 140,
  "singleQuote": true
}
```
3. Add an "ignore" file to exclude some folders from formatting:
   - create a file in the project's root folder called `.prettierignore` with the following content:

```
dist
node_modules
```

4. Update the `package.json` 'scripts' section with new commands:

```json
{
  // ...
  "scripts": {
    // ...
    "prettier": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\"",
    "prettier:write": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\"",
  }
}
```
Now, when we run `prettier` it will write the format changes. If we only want to see the changes
to be written, then we can run `prettier:check` which will only print the changes.


## Add ESLint

Documentation: https://eslint.org/docs/latest/use/getting-started
"ESLint is a configurable JavaScript linter. It helps you find and fix problems in your JavaScript code."

1. Add development dependencies via NPM:
   - `npm i -D eslint eslint-plugin-react` to use it with ReactJS
   - `npm i -D @typescript-eslint/parser @typescript-eslint/eslint-plugin` to use with TypeScript
   - `npm i -D eslint-plugin-prettier eslint-config-prettier` to integrate prettier with eslint. `eslint-plugin-prettier` will
   enable the usage of prettier as eslint rule, `eslint-config-prettier` will disable eslint rules that will conflict with prettier.
   - `npm i -D eslint-webpack-plugin` integrate with Webpack

2. Create a file in the project's root directory called `.eslintrc` with the following content:
```json
{
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint", "react", "prettier"],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:prettier/recommended",
      "prettier"
    ],
    "rules": {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "react/react-in-jsx-scope": "off",
    "react/no-unescaped-entities": "off"
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "env": {
      "browser": true,
      "node": true,
      "es2021": true
    }
  }
```

3. Add `eslint` plugin to `webpack.config.js`:

```javascript
//...
const ESLintPlugin = require('eslint-webpack-plugin');
//...
module.exports = (_, argv) => {
  //...
  plugins: [
    new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        context: 'src', // the folder where your source files are located
        failOnError: false, // set to true if you want the build to fail on any ES##Lint error
        emitWarning: true, // set to true if you want ESLint errors to be treated as warnings
      }),
  ],
  devServer: {
    // ...
    client: {
      overlay: {
        errors: false, // Disable the overlay for errors
        warnings: false, // Disable the overlay for warnings
      },
    },
  }
}
```

4. Update `package.json` with handy new terminal commands:

```json
{
  ...
  "scripts": {
    ...
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "lint:fix": "eslint \"src/**/*.{ts,tsx}\" --fix"
  }
}
```


## Install SCSS

In case you're not going to use a package like `Styled Components`, you may want to install SASS  
and configure [CSS modules](https://github.com/css-modules/css-modules) isolation.

1. Install dev dependencies:
  - `npm i -D sass sass-loader css-loader style-loader`
  - `npm i -D @types/css-modules`

2. Update `webpack.config.js` file to add a rule for handling SCSS files:
```js
module.exports = {
  ...
  module: {
    ...
    rules: {
      ...
      {
        // For .css files
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        // for .module.scss and .module.sass files
        test: /\.module\.s[ac]ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              importLoaders: 1,
              sourceMap: true,
            },
          },
          'sass-loader',
        ],
      },
      ...
    }
  }
}
```
The string `localIdentName: '[name]__[local]__[hash:base64:5]'` describes how the style names will be formed.  
We can tweek this to achieve formatting we would like to have.  
Here is a link to the [css-loader](https://github.com/webpack-contrib/css-loader#modules) docs.  


## Add Webpack plugin to copy static content from "/public" to "/dist"
  
Documentation at: https://webpack.js.org/plugins/copy-webpack-plugin/  
  
1. Add development dependency:
  - `npm i -D copy-webpack-plugin`

2. Configure the new plugin in `webpack.config.js`:

```js
// Your other imports...

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // Other code ...

  return {
    // Your other configurations...

    plugins: [
      new CopyWebpackPlugin({ // Add this block
        patterns: [
          {
            from: path.join(__dirname, 'public'),
            to: path.join(__dirname, 'dist'),
            globOptions: {
              ignore: ['**/index.html'], // Exclude index.html as it's already handled by HtmlWebpackPlugin
            },
          },
        ],
      }),
      // Your other plugins...
    ]
  };
```

## Clean the 'dist' folder on every new build

Documentation at: https://webpack.js.org/guides/output-management/#cleaning-up-the-dist-folder

1. Add the following to `webpack.config.js`:
```js

module.exports = (_, argv) => {
  // Other code ...

  return {
    // Your other configurations...

    output: {
      // path: ...
      clean: true // Remove the content of the `path` above on every new build
    },

    // Your other configurations...
  }
}

```
