# Metahub Next

Metahub is a web plugin wallet, we have completely rewritten the code, using typescript and vue3, supporting EOS and EVM blockchains.

Project website: https://metahub.cash  
Github link: https://github.com/metahubwallet/metahub-next  
Chrome extension link: https://chrome.google.com/webstore/detail/metahub-easy-to-use-eos-w/nglnaekfdaelelcaokeemlnopjhekdkj

## Usage

### Development

```sh
npm install
```

Hot Module Reloading is used to load changes inline without requiring extension rebuilds and extension/page reloads
Currently only works in Chromium based browsers.

```sh
npm run dev
```

### Build

Minifies and optimizes extension build

```sh
npm run build
```

### Load extension in browser

Loads the contents of the dist directory into the specified browser

```sh
npm run serve:chrome
```

```sh
npm run serve:firefox
```
