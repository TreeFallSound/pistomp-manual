# pistomp-manual

The official manual for the [pi-Stomp](https://treefallsound.com) ecosystem: building, using, and developing for pi-Stomp v2/v3.

Built with [Eleventy](https://www.11ty.dev/), deployed to GitHub Pages.

## Structure

```
src/
  building/       — Part I: Obtaining hardware, assembly, software install
  using/          — Part II: Navigation, pedalboards, plugins, advanced features
  developers/     — Part III: Architecture, code structure, contributing
  assets/         — Images, CSS
  _includes/      — Layout templates
```

## Develop

```sh
npm run serve
```

Opens a local server at `http://localhost:8080` with live reload.

## Build

```sh
npm run build
```

Output goes to `_site/`.

## Deploy

Pushing to `main` triggers a GitHub Actions workflow that builds and deploys to GitHub Pages. No manual steps required.

## Contributing

See the [Developer Guide](https://sastraxi.github.io/pistomp-manual/developers/).
