---
title: Configuration Guide
eleventyNavigation:
  parent: developers
  key: configuration
  title: Configuration Guide
  order: 5
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
| `default_config_pistomptre.yml` | v3 Tre |
| `default_config_pistompcore.yml` | v2 Core |
| `default_config_pistomp.yml` | v1 |
| `default_config_3fs_2knob_exp.yml` | v2 with 3 footswitches + 2 knobs + expression |
| `default_config_3fs_2knob.yml` | v2 with 3 footswitches + 2 knobs |

On first boot, the appropriate template is copied to `default_config.yml`.

## Hardware version

```yaml
hardware:
  version: 3.0
```

Determines which hardware and handler classes are instantiated. Set automatically by `firstboot.sh` based on Pi model (Pi 3 → 2.0, Pi 4/5 → 3.0).

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

## Settings store

Runtime settings like input gain and headphone volume are stored in `/home/pistomp/data/config/settings.yml`. These persist across reboots without needing to save a pedalboard.

## First boot

On first boot, `firstboot.sh` reads `/boot/firmware/pistomp.conf` and:

1. Expands the root partition to fill the SD card
2. Configures WiFi (SSID, password, country)
3. Sets the hostname and user password
4. Sets the timezone
5. Writes JACK config (`/etc/default/jack`) with sample rate and period
6. Detects Pi version and writes the appropriate `default_config.yml`
7. Disables Bluetooth
8. Renames itself to `firstboot.done` so it never runs again
9. Reboots

To re-run firstboot (e.g. after changing `pistomp.conf`):

```bash
sudo mv /boot/firmware/firstboot.done /boot/firmware/firstboot.sh
sudo reboot
```
