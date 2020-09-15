# Fourfold

A game created for the [js13kGames](https://js13kgames.com/) competition.  Play it [here](https://js13kgames.com/entries/fourfold).

[Making of/analysis: WIP]

## Build

### Install dependencies:
```sh
yarn install
```

### Development build:
(no code minification, create sourcemap)
```sh
yarn devbuild
```

### Production build:
(minified, no sourcemap)
```sh
yarn build
```
Generated files will be stored in the `app` directory.

### Compress built files:
(requires the [zip](https://github.com/LuaDist/zip) command)
```sh
yarn bundle
```

## License
MIT
