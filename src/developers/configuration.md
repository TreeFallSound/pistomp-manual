---
title: Configuration Guide
eleventyNavigation:
  parent: developers
  key: configuration
  title: Configuration Guide
  order: 4
---

# Configuration Guide

pi-Stomp uses YAML configuration files to define hardware layout, MIDI bindings, and pedalboard-specific overrides. There are two classes of config:

- **Global config** — `/home/pistomp/data/config/default_config.yml`, applies to all pedalboards
- **Per-pedalboard config** — `{bundle}/config.yml`, overrides specific settings for one pedalboard

At pedalboard load time, the per-pedalboard config merges into the global config field-by-field. Unspecified fields keep their defaults.

## Config templates

The OS ships with templates for each hardware variant:

| File | Hardware |
|------|----------|
| `default_config_pistomptre.yml` | v3 Tre — copied for version >= 3.0 |
| `default_config_3fs_2knob_exp.yml` | v2 with 3 footswitches + 2 knobs + expression — copied for version >= 2.0 |
| `default_config_pistompcore.yml` | v2 Core — shipped, but not what `modify_version.sh` copies |
| `default_config_3fs_2knob.yml` | v2 with 3 footswitches + 2 knobs |
| `default_config.yml` | Base template |

On first boot, `firstboot.sh` calls `util/modify_version.sh <version>`, which copies the matching template to `~/data/config/default_config.yml` and checks out the corresponding branch of `~/.pedalboards`.

Two traps here. The v2 path copies `default_config_3fs_2knob_exp.yml`, not the similarly-named `default_config_pistompcore.yml`. And `modify_version.sh` still has a v1 branch referencing `default_config_pistomp.yml`, a file that no longer exists in `setup/config_templates/` — that branch is dead, since firstboot never passes a version below 2.0.

## Hardware version

```yaml
hardware:
  version: 3.0
```

Determines which hardware and handler classes are instantiated. `firstboot.sh` greps `/proc/device-tree/model` and passes 3.0 for a Pi 5, 2.0 for everything else — so Pi 3 and Pi 4 both land on 2.0.

`Hardwarefactory.create()` maps the version to a class: `[2.0, 3.0)` → `Pistompcore`, `[3.0, 4.0)` → `Pistomptre`. There is no v1 class; anything below 2.0 returns `None` and the app exits. firstboot says as much in a comment: v1 is no longer supported.

## Footswitches

```yaml
footswitches:
  - id: 0
    adc_input: 0
    midi_CC: 60
    midi_port: ~              # optional, external MIDI device name
    midi_channel: ~           # optional, per-switch channel override
    longpress: next_snapshot  # optional, handler callback name
    tap_tempo: ~              # optional, for tap tempo footswitches
    ledstrip_position: 0      # optional, v3 LED strip index
```

Each footswitch has an `id` (physical position), `adc_input` (analog pin), and `midi_CC` (MIDI CC to send on press). The `longpress` field can reference handler callbacks like `next_snapshot`, `previous_snapshot`, `toggle_tuner_enable`, etc.

## Encoders

```yaml
encoders:
  - id: 0
    type: navigation           # navigation, tweak, or volume
  - id: 1
    type: tweak
    midi_CC: 70
    midi_port: ~
    midi_channel: ~
  - id: 2
    type: tweak
    midi_CC: 71
  - id: 3
    type: volume
```

The navigation encoder drives the LCD menu. Tweak encoders send MIDI CC on rotation. The volume encoder adjusts the audio card output level directly.

## Analog controls

```yaml
analog_controllers:
  - adc_input: 5
    id: 0
    type: EXPRESSION           # KNOB or EXPRESSION
    midi_CC: 75
    midi_port: ~
    autosync: true             # send position on pedalboard load
```

Analog controls read the 10-bit ADC (MCP3008) and convert to MIDI CC (0–127). `type: EXPRESSION` renders as an expression pedal graphic on the LCD. `autosync: true` sends the current position on pedalboard load so the value doesn't jump.

The expression pedal input is commented out in the default config. Enable it with:

```bash
~/extras/expression-pedal.sh on
```

## External MIDI routing

Controls can be routed to an external hardware MIDI device instead of the internal virtual port:

```yaml
hardware:
  external_midi:
    enabled: true
    send_delay_ms: 10
    messages:
      "Source Audio C4":       # ALSA client name from `aconnect -l`
        - [0xB0, 0x66, 0x00]  # hex MIDI bytes
```

Individual controls can also specify `midi_port:` to route to a specific device.

## Blend mode

```yaml
blend_snapshots:
  - name: "Clean to Fuzz"
    input_id: 0                # expression pedal (0) or encoder (1, 2)
    interpolation: smooth      # linear, smooth, build, drop, snap, bloom
    stops:
      "0.0": "Clean"           # snapshot name at heel position
      "0.5": "Crunch"
      "1.0": "Fuzz"
```

See [Configuration]({{ '/using/configuration/#blend-mode' | url }}) for details on blend mode.

## Configuring JACK

JACK settings live in `/etc/default/jack`, which `firstboot.sh` writes from the `JACK_*` keys in `/boot/firmware/pistomp.conf`. The startup script that consumes them is `/usr/lib/pistomp/jackdrc`, shipped by the `jack2-pistomp` package.

Edit `/etc/default/jack` directly to change settings on a running device. Don't edit `jackdrc` — package upgrades overwrite it, and it deliberately lives under `/usr/lib` rather than `/etc` so dpkg never treats it as a conffile. To change the systemd unit, drop a file in `/etc/systemd/system/jack.service.d/`.

Unset keys are written empty by firstboot; `jackdrc` supplies the default at every boot, which lets OTA updates change defaults without touching anyone's `pistomp.conf`.

| Key | Default | Notes |
|-----|---------|-------|
| `JACK_SAMPLE_RATE` | `48000` (from `pistomp.conf`) | No fallback — `jackdrc` exits 2 if it's unset |
| `JACK_PERIOD` | 128 on Pi 5, 256 elsewhere | Frames per period. The latency knob |
| `JACK_NPERIODS` | `2` | Fewer periods means lower latency and more XRUNs |
| `JACK_PORT_MAX` | 512 on Pi 5, 256 elsewhere | See below |
| `JACK_RTPRIO` | `75` | Realtime priority |
| `JACK_DEVICE` | `hw:0` | Change for an external USB interface |
| `JACK_EXTRA_ARGS` | empty | Passed before `-d` |
| `JACK_DRIVER_ARGS` | empty | Passed after the ALSA driver args |

`jackd` splits its arguments at the first `-d`, which is why there are two separate argument keys rather than one.

### Ports and memory

The port cap matters more than it looks. JACK preallocates shared memory per port whether or not anything ever connects to it, and the allocation is independent of `JACK_PERIOD`. JACK's own default of 2048 ports reserves about 102 MB — 22% of RAM on a 512 MB Pi 3A+ — against the roughly 60 ports a large pedalboard actually uses, so pi-Stomp caps it per model:

| Board | `JACK_PORT_MAX` | `JACK_PERIOD` |
|-------|--------------|---------------|
| Pi 5 | 512 | 128 |
| Everything else | 256 | 256 |

A Pi 5 has both the CPU headroom for a shorter period and the RAM for more ports; everything else is a Pi 3 or 4, where a 512 MB Pi 3A+ sets the floor.

`jackdrc` derives both values from `/proc/device-tree/model` at every boot rather than baking them into the SD card, so a card stays swappable between machines. Each plugin is a JACK client using roughly three ports, so both caps leave several times the headroom a normal pedalboard needs.

If `/etc/default/jack` is missing, `jackdrc` exits 1 and systemd's `Restart=always` retries until firstboot has run.

## Settings store

Runtime settings like input gain and headphone volume are stored in `/home/pistomp/data/config/settings.yml`. These persist across reboots without needing to save a pedalboard.

## First boot

`firstboot.sh` runs once via `firstboot.service` and:

1. Expands the root partition to fill the SD card
2. Checks whether Raspberry Pi Imager already configured the OS (see below)
3. Applies `/boot/firmware/pistomp.conf`: Wi-Fi, hostname, user password, timezone, SSH key
4. Runs the SSH lockout guard
5. Writes `/etc/default/jack` from the `JACK_*` keys
6. Detects the Pi model and runs `modify_version.sh` to write `default_config.yml`
7. Disables Bluetooth and `hciuart`
8. Renames itself to `firstboot.done`, disables `firstboot.service`, and reboots

### Preseed takes precedence over pistomp.conf

`pistomp.conf` is the fallback path, not the main one. If the card was flashed with the Imager customization wizard, Imager writes `/boot/firmware/rpi-preseed.toml` and the `rpi-preseed` package applies it before firstboot runs. firstboot detects this and skips every OS-level setting (Wi-Fi, hostname, password, timezone, SSH key) so it doesn't overwrite the user's Imager choices. pi-Stomp-specific settings — JACK, hardware version — are applied either way.

The detection keys on the `/var/lib/rpi-preseed/applied` stamp, not on whether the TOML exists: `rpi-preseed` redacts the TOML's secrets in place and leaves the file on the boot partition, so its presence proves nothing. A TOML with no stamp means the apply failed, which would leave the device with no Wi-Fi and no credentials — firstboot reports that on the LCD and falls back to `pistomp.conf` rather than booting a silently unreachable system.

### SSH lockout guard

This is a headless appliance with no console, so an sshd that accepts neither passwords nor keys means re-flashing the card. Before finishing, firstboot runs `sshd -T` and checks whether UID 1000 has a non-empty file matching any `AuthorizedKeysFile` pattern. If password auth is off *and* no keys are installed, it writes `PasswordAuthentication yes` to `/etc/ssh/sshd_config.d/00-pistomp-lockout-guard.conf` — sorted first, so it wins over the main config and any other drop-in — restarts ssh, and says so on the LCD.

### Re-running firstboot

Restoring the script is not enough; firstboot disables its own unit on the way out, so you have to re-enable it:

```bash
sudo mv /boot/firmware/firstboot.done /boot/firmware/firstboot.sh
sudo systemctl enable firstboot.service
sudo reboot
```
