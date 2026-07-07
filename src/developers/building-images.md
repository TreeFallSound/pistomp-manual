---
title: Building Custom Images
eleventyNavigation:
  parent: developers
  key: building-images
  title: Building Custom Images
  order: 7
---

# Building Custom Images

pi-Stomp runs on a custom Raspberry Pi OS Lite image (Debian Trixie, arm64, RT kernel) built by the [pi-gen-pistomp](https://github.com/TreeFallSound/pi-gen-pistomp) repository.

## Image contents

The image includes:

- JACK2 audio server
- mod-host (LV2 plugin host)
- MOD-UI (web interface)
- pi-stomp itself (shipped as an `arm64` Debian package)
- System dependencies and configuration

## Build workflow

The `pi-gen-pistomp` repo uses GitHub Actions to build the OS image. The workflow:

1. A push under `debpkgs/pi-stomp/**` triggers `build-pi-stomp.yml`, which calls the reusable `build-deb.yml` workflow with `pkg: pi-stomp` to build the `.deb`
2. Publishes a GitHub Release tagged `debpkg/pi-stomp/<ver>`
3. `publish-apt-repo.yml` updates the `gh-pages` apt index
4. Devices pick up the update on their next `apt upgrade`

## Shipping a new pi-stomp version

OTA updates flow through the `pi-gen-pistomp` repo's apt repo. Two pushes are required:

1. Land code changes on `pi-stomp#main`
2. In `pi-gen-pistomp`, bump the pi-stomp package version:

```bash
cd ../pi-gen-pistomp
./scripts/bump-version.sh pi-stomp "Description of change."
```

This edits `debpkgs/pi-stomp/debian/changelog`. The version is the gate that triggers a rebuild — no other files need editing.

3. Push `pi-gen-pistomp#main`. The `build-deb.yml` workflow builds the `.deb`, publishes a release, and `publish-apt-repo.yml` updates the apt index.

## OS paths

| Path | Purpose |
|------|---------|
| `/opt/pistomp/pi-stomp/` | Installed source tree (from the `.deb`) |
| `/home/pistomp/pi-stomp/` | Symlink to the above |
| `/opt/pistomp/venvs/pi-stomp/` | uv venv with `--system-site-packages` |
| `/home/pistomp/data/` | Runtime data |
| `/home/pistomp/data/config/` | Settings, default config |
| `/home/pistomp/data/.pedalboards/` | Pedalboard bundles |
| `/usr/lib/systemd/system/mod-ala-pi-stomp.service` | Service unit |

The service runs as the `pistomp` user (not root).

## Customizing the image

To add plugins or modify the base image, edit the `pi-gen-pistomp` build configuration. The LV2 plugin archive is cached at `../pi-gen-pistomp/cache/lv2plugins.tar.gz`. To inspect it:

```bash
# List plugin bundles
tar -tzf ../pi-gen-pistomp/cache/lv2plugins.tar.gz | grep '\.lv2/$' | head -20

# Read a specific plugin's manifest
tar -xzf ../pi-gen-pistomp/cache/lv2plugins.tar.gz --to-stdout "<name>.lv2/manifest.ttl"
```
