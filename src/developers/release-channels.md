---
title: Release Channels
eleventyNavigation:
  parent: developers
  key: release-channels
  title: Release Channels
  order: 8
---

# Release Channels

pi-Stomp packages are delivered over apt from a GitHub Pages-hosted repository. Two suites run side by side on the same host:

| Suite | Channel | Who receives it |
|-------|---------|-----------------|
| `trixie` | Production | Every device by default |
| `trixie-testing` | Pre-release | Devices that opt in |

A package version containing `~` (set with `bump-version.sh --pre`) publishes to `trixie-testing`. A plain version publishes to `trixie`. Debian sorts `~` below the release it precedes, so a testing device converges back to production automatically on the next plain-version bump.

## Switching channels

Every device ships with `~/extras/set-release-channel.sh`, which handles adding and removing the apt source, upgrading, and downgrading:

```bash
sudo ~/extras/set-release-channel.sh testing    # switch to pre-release
sudo ~/extras/set-release-channel.sh stable     # switch back to production
~/extras/set-release-channel.sh status          # show current channel
```

If your device does not have the script, download it:

```bash
curl -sL https://raw.githubusercontent.com/TreeFallSound/pi-gen-pistomp/main/stage3/01-pistomp/files/extras/set-release-channel.sh \
  -o ~/extras/set-release-channel.sh
chmod +x ~/extras/set-release-channel.sh
```

Switching to testing adds the `trixie-testing` apt source and runs `apt-get upgrade`. The stable source stays in place; with both present, apt sees both suites and picks the highest version of each package.

Switching to stable removes the testing source and downgrades any pi-Stomp packages with a `~` version back to the stable candidate. System packages are not touched.

## No warranty

Testing packages are pre-releases. They can contain bugs that break audio, hang the UI, or prevent boot. Do not run testing on a device you rely on for performance. If a testing package breaks your device, re-flash the production image or switch back to stable.