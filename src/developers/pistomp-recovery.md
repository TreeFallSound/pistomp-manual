---
title: pistomp-recovery
eleventyNavigation:
  parent: developers
  key: pistomp-recovery
  title: pistomp-recovery
  order: 8
---

# pistomp-recovery

`pistomp-recovery` is a Python application that provides package update and recovery services for pi-Stomp. It activates automatically when critical services crash repeatedly, or can be launched manually from the System Menu.

## Source

The code lives at [github.com/TreeFallSound/pistomp-recovery](https://github.com/TreeFallSound/pistomp-recovery).

## Activation

- **Automatic**: systemd `OnFailure` — the recovery screen triggers when `mod-ala-pi-stomp` or `mod-ui` fails 3 times within 60 seconds (`StartLimitBurst=3`, `StartLimitIntervalSec=60` in the service units)
- **Manual**: System Menu → Recovery mode

## Features

- **Crash recovery** — detects failed services and shows diagnostic information
- **Action inbox** — badge counts for available updates
- **Per-pedalboard operations** — reset individual pedalboards to checkpoint
- **Per-package operations** — update individual system packages
- **Factory reset** — wipes user data and restores factory defaults
- **Install-failure rollback** — if a package fails to install, the cached previous version is restored automatically; after a successful install, only the services tied to the updated packages are restarted
- **Navigation stack** — back/forward through screens

## Developer note: git-expanded source blocks updates

If you've run `util/expand-git.sh` to turn the installed `/opt/pistomp/pi-stomp` tree into a full git checkout (marker file `.git/EXPANDED`), recovery **skips pi-stomp in "Update All"**, shows a red badge, and displays *"Cannot update pi-stomp: using git. Run util/contract-git.sh to re-enable updates."* This prevents an apt update from clobbering your working tree. Run `util/contract-git.sh` to restore normal OTA updates.

## Architecture

The application uses a **Facet** pattern — each subsystem is a self-contained facet with git-backed versioning. The five facets (config, pedalboards, plugins, packages, boot) are grouped into the four user-facing **domains** the recovery UI exposes: Pedalboards, Plugins, Config (config + boot facets), and System (packages facet).

### Facets

| Facet | File | Purpose |
|-------|------|---------|
| Config | `config.py` | Manages `default_config.yml` and `settings.yml` |
| Pedalboards | `pedalboards.py` | Git-backed pedalboard versioning |
| Plugins | `plugins.py` | LV2 plugin management, factory reset |
| Packages | `packages/packages.py` | System package management |
| Boot | `boot.py` | `/boot/config.txt`, `/boot/cmdline.txt`, `/boot/pistomp.conf`, `jackdrc`, ALSA state |

Service and crash management (`service.py`) sits alongside the facets but is not itself a facet.

### Backends

- **Real**: SPI LCD, systemd, apt — used on the device
- **Emulated**: Pygame LCD, fake data — used for development and testing

### UI

The LCD UI is built with pygame (320x240, QBASIC-inspired EGA color palette). Screens include:

- **CrashScreen** — service states with log textarea
- **LogViewScreen** — fullscreen scrollable log viewer
- **MenuScreen** — universal menu with rows, confirm dialogs, progress bars

## Development

```bash
# Clone and set up
git clone https://github.com/TreeFallSound/pistomp-recovery.git
cd pistomp-recovery
uv sync --group dev

# Run tests
uv run pytest
uv run pytest --snapshot-update  # accept changed LCD snapshots
uv run ruff check
uv run pyright

# Run the emulator
uv run pistomp-recovery-emulator
# Or with forced crash screen:
uv run pistomp-recovery-emulator --force-crash
```

### Emulator controls

| Key | Action |
|-----|--------|
| Arrow keys | Navigate |
| Enter / Space | Select |
| L | Long press (back / cancel) |
| Esc | Quit the emulator |

## CLI

```bash
pistomp-recovery          # Launch the recovery UI
pistomp-stamp stamp       # Stamp the current state as a checkpoint
pistomp-stamp status      # Show checkpoint status
```

## Packaging

The source is deployment-agnostic. `.deb` build and OTA tooling live in `pi-gen-pistomp`.
