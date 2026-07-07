---
title: Getting Started
eleventyNavigation:
  parent: developers
  key: getting-started
  title: Getting Started
  order: 2
---

# Getting Started

## Prerequisites

- A pi-Stomp (v2 or v3) with the OS installed and network access
- SSH access to the device
- Git and Python 3.12+ on your development machine
- [uv](https://docs.astral.sh/uv/) for Python package management

## Clone the repo

```bash
git clone https://github.com/TreeFallSound/pi-stomp.git
cd pi-stomp
```

## Development workflow

Most developers find it easiest to code in-place by SSHing to the pi-Stomp and editing files directly.

### Connect to the device

```bash
ssh pistomp@pistomp.local
```

### Stop the service

The `mod-ala-pi-stomp` service runs the pi-Stomp software. Stop it so your code doesn't conflict:

```bash
ps-stop
```

### Run your code

```bash
ps-run
```

With optional logging:

```bash
ps-run -l info
ps-run -l debug
```

Stop with Ctrl-C.

### Restart the service

When you're done with iterative edits:

```bash
ps-restart
```

### Deploy local changes

From your development machine, use `deploy.sh` to copy files to the device:

```bash
./deploy.sh
```

Or copy individual files via SCP:

```bash
scp modalapi/*.py pistomp@pistomp.local:/home/pistomp/pi-stomp/modalapi/
ssh pistomp@pistomp.local "ps-restart"
```

## Running tests

```bash
uv run pytest                    # all tests
uv run pytest --snapshot-update  # accept changed LCD snapshots
uv run pytest --cov=pistomp --cov=modalapi --cov=common --cov=uilib --cov-report=term-missing
```

## Running the emulator

The emulator lets you develop and test the LCD UI on your desktop without a pi-Stomp:

```bash
./run_emulator.sh [v1|v2|v3]
```

Requires [MOD Desktop](https://mod.audio/desktop/). Default is v3.

Emulator controls:

| Key | Action |
|-----|--------|
| Arrow keys | Rotate encoder |
| Enter / Space | Click encoder |
| L | Long press |
| Esc | Back / exit |
