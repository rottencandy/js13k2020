# Fourfold

A game created for the [js13kGames](https://js13kgames.com/) competition.  Play it [here](https://js13kgames.com/entries/fourfold).

Making of/analysis: [saud.gq/blog/fourfold](https://saud.gq/blog/fourfold/)

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

## Stuff used

[esbuild](https://github.com/evanw/esbuild) for minification & bundling.

[ZzFXM](https://github.com/keithclark/ZzFXM) for sound.

## License
MIT
