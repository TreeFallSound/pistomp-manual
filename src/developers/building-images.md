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

OTA updates flow through the `pi-gen-pistomp` repo's apt repo. One push lands the new code; one push bumps the package version that gates the rebuild.

1. Land code changes on `pi-stomp#main` (Stage 3 of the image build clones this branch at build time, so any merged commit becomes part of the next `.deb`).
2. In `pi-gen-pistomp`, bump the pi-stomp package version:

   ```bash
   cd ../pi-gen-pistomp
   ./scripts/bump-version.sh pi-stomp "Description of change."
   git add debpkgs/pi-stomp/debian/changelog
   git commit -m "Bump pi-stomp: <description>"
   git push origin main
   ```

   The changelog version is the gate — `build-deb.yml` refuses to re-publish an existing version, so nothing else needs editing.
3. The `build-pi-stomp.yml` workflow fires on the push to `main` (its `paths:` filter sees `debpkgs/pi-stomp/**` changed). It calls `build-deb.yml`, publishes `debpkg/pi-stomp/<ver>` GitHub Release, and `publish-apt-repo.yml` routes the `.deb` into the appropriate apt suite on `gh-pages`.
4. Existing devices pick up the update on their next `apt upgrade` (or through the recovery UI's "Update packages" menu).

Pre-release flow is the same with `--pre`:

```bash
./scripts/bump-version.sh --pre pi-stomp "Pre-release: description."
```

This routes the `.deb` to `trixie-testing` instead of `trixie`; production devices never see the `~` version. See the "Release channels" section below for the full channel-routing picture.

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

## Release channels

Two apt suites are served from the `gh-pages` branch of `pi-gen-pistomp`:

| Suite | Channel | Who gets it |
|-------|---------|-------------|
| `trixie` | Production | Every device, by default |
| `trixie-testing` | Pre-release | Devices that opt in by adding `pistomp-testing.list` |

A package version containing `~` (e.g. `3.2.1-0~pre4`, set with `./scripts/bump-version.sh --pre <pkg> "..."`) publishes to `trixie-testing` and the GitHub Release is flagged as prerelease. A plain version (no `~`) publishes to `trixie`. Production devices never see `~` versions; testing devices converge back to production automatically on the next plain-version bump because Debian's `~` sorts below the release it precedes.

Images are cut by pushing a `release/<version>` git tag. The tag suffix encodes the channel:

| Tag | Channel | GitHub Release |
|-----|---------|----------------|
| `release/3.3.0` | Stable | Production |
| `release/3.3.0-rc1` (or `-pre1`, `-beta1`, `-alpha1`) | Testing | Prerelease (excluded from `releases/latest`) |

Image releases also update two Imager manifests on `gh-pages`:

- `imager/pistomp-stable.json` — latest production image
- `imager/pistomp-testing.json` — latest pre-release image
- `imager/pistomp-<version>.json` — per-version archival snapshot

Users enter the stable or testing URL in Imager's custom-URL field. There is no merged `imager/pistomp.json`; you pick a channel at install time.

## Recipes

### Ship a new version of an existing package to production OTA

```bash
cd ../pi-gen-pistomp
./scripts/bump-version.sh <pkg> "What changed."          # production channel (trixie)
git add debpkgs/<pkg>/debian/changelog
git commit -m "Bump <pkg>: what changed"
git push origin main
```

Two workflows fire on the push: `build-<pkg>.yml` (builds the `.deb`, publishes `debpkg/<pkg>/<ver>` GitHub Release) and `publish-apt-repo.yml` (routes the `.deb` into `trixie` on `gh-pages`). Wait for both to go green in the Actions tab before expecting existing devices to see the update on `apt upgrade`.

### Ship a pre-release package to test devices

```bash
./scripts/bump-version.sh --pre <pkg> "Pre-release: what changed."   # trixie-testing
git add debpkgs/<pkg>/debian/changelog
git commit -m "Bump <pkg>: pre-release"
git push origin main
```

The package routes to `trixie-testing`; only devices that have opted into the testing channel (via `pistomp-testing.list` on `/etc/apt/sources.list.d/`) see it. Promote to production with a plain bump — `~` sorts below the release it precedes, so test devices converge back automatically:

```bash
./scripts/bump-version.sh <pkg> "Promote to production: <description>."
```

### Cut a new image

After all `build-<pkg>.yml` and `publish-apt-repo.yml` runs from your last merge to `main` are green:

```bash
# Pre-release image (testing channel — installs from + ships trixie-testing apt suite):
git tag release/3.3.0-rc1
git push origin release/3.3.0-rc1

# Production image:
git tag release/3.3.0
git push origin release/3.3.0
```

`build-image.yml` runs the full image build, publishes a GitHub Release with the `.img.xz` and Imager manifest attached, and deploys the manifest to `gh-pages` as the appropriate channel file plus a per-version archival snapshot.

Don't include a `v` prefix in the tag — `release/3.3.0`, not `release/v3.3.0`. The image filename, manifest URL and GitHub Release name are all built verbatim from the part after `release/`.

### Never re-tag a pre-release image as production

A pre-release image's rootfs contains `~` packages and the `trixie-testing` sources line. To promote to production:

1. Promote every `~` package on the image to a plain version (the "Promote to production" recipe above) and wait for `publish-apt-repo.yml` to land them in `trixie` on `gh-pages`.
2. Cut a fresh `release/3.3.0` tag — never re-tag `release/3.3.0-rc1` as `release/3.3.0`.

### Add a new package to OTA

All four steps land in one PR — `scripts/validate-packages.sh` (the PR check) enforces this:

1. Create `debpkgs/<pkg>/` with `build.sh` and a `debian/` directory (control, rules, postinst as needed).
2. Add the package to `stage2/05-pistomp/02-run.sh`'s `apt-get install` list (factory baseline).
3. Copy `docs/package-template/build.yml` → `.github/workflows/build-<pkg>.yml`, changing the name, `paths:` filter, and `pkg:` input.
4. Bump `debian/changelog` — this is what creates the initial entry and sets the version:

   ```bash
   ./scripts/bump-version.sh <pkg> "Initial package: <one-line description>."     # production
   ./scripts/bump-version.sh --pre <pkg> "Initial pre-release: <description>."  # trixie-testing
   ```

Push, watch the `validate / validate` check go green, merge.

### Check for upstream drift before cutting an image

The image build runs `scripts/check-upstream-staleness.sh` as a gate. Run it locally first to catch a stale package before it fails the build:

```bash
cd ../pi-gen-pistomp
./scripts/check-upstream-staleness.sh
```

A `STALE` result means a branch-pinned package's upstream has moved past the commit its last release was built from — bump and rebuild before tagging. `WARN` (no release, or no `.built-sha` sidecar) and `SKIP` (commit-pinned) are non-fatal.

### Validate a PR locally

```bash
cd ../pi-gen-pistomp
./scripts/validate-packages.sh
```

Runs the same four checks the PR-status workflow does: every apt-installed package has a `build-<pkg>.yml`; every touched `debpkgs/<pkg>/` has a bumped changelog; new packages ship a workflow in the same PR; every workflow's `paths:` names a real `debpkgs/<pkg>/` directory. Defaults the base ref to `origin/main`; set `GITHUB_BASE_REF` to compare against another branch.
