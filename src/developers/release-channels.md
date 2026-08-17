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

## Switch a device to testing

On the device, add the testing apt source and upgrade:

```bash
echo "deb [arch=arm64 trusted=yes] https://treefallsound.github.io/pi-gen-pistomp trixie-testing main" \
  | sudo tee /etc/apt/sources.list.d/pistomp-testing.list
sudo apt-get update
sudo apt-get upgrade
```

The stable source (`/etc/apt/sources.list.d/pistomp.list`) stays in place. With both sources present, apt sees both suites and picks the highest version of each package.

## Switch a device back to stable

Remove the testing source and update:

```bash
sudo rm /etc/apt/sources.list.d/pistomp-testing.list
sudo apt-get update
```

If the device holds `~` versions, apt does not downgrade them automatically. Reinstall the affected packages:

```bash
sudo apt-get install --allow-downgrades \
  $(grep -h "^Package:" /var/lib/apt/lists/*treefallsound*Packages \
  | awk '{print $2}' | sort -u \
  | while read pkg; do \
      dpkg-query -W -f='${Version}' "$pkg" 2>/dev/null \
      | grep -q '~' && echo "$pkg"; \
    done)
```

This finds every package from the pi-Stomp apt repository with a `~` in its installed version and reinstalls it from `trixie` at the stable version. System packages are not touched.

## No warranty

Testing packages are pre-releases. They can contain bugs that break audio, hang the UI, or prevent boot. Do not run testing on a device you rely on for performance. If a testing package breaks your device, re-flash the production image or switch back to stable using the commands above.
