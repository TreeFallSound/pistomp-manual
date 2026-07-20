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
- Git and Python 3.11+ on your development machine (pi-stomp sets `requires-python = ">=3.11"`; pistomp-recovery needs 3.12)
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

Stop with Ctrl-C.

`ps-run` takes no arguments. It `exec`s the app with a fixed command line and no `"$@"`, so `ps-run -l debug` runs at the default log level and discards the flag without complaining. To set a log level, invoke the app directly:

```bash
sudo /opt/pistomp/venvs/pi-stomp/bin/python /home/pistomp/pi-stomp/modalapistomp.py -l debug
```

### Watch the logs

`ps-journal` follows the service journal, and unlike `ps-run` it does pass arguments through to `journalctl`:

```bash
ps-journal                # follow (-f)
ps-journal -n 100         # last 100 lines
ps-journal -b             # this boot only
```

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
./run_emulator.sh [v2|v3]
```

Requires [MOD Desktop](https://mod.audio/desktop/). Default is v3, and anything other than `v2` or `v3` silently becomes v3 rather than erroring — so a typo runs the wrong hardware profile without telling you.

Emulator controls:

| Key | Action |
|-----|--------|
| Arrow keys | Rotate encoder |
| Enter / Space | Click encoder |
| L | Long press |
| Esc | Back / exit |
