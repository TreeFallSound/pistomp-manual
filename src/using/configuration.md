---
title: Configuration
eleventyNavigation:
  parent: using
  key: configuration
  title: Configuration
  order: 7
---

# Configuration

pi-Stomp uses YAML configuration files to control how footswitches, encoders, knobs, and expression pedals behave. There are two levels:

- **Global config** — applies to all pedalboards. Lives at `/home/pistomp/data/config/default_config.yml`.
- **Per-pedalboard config** — overrides settings for a specific pedalboard. Lives at `{pedalboard_bundle}/config.yml`.

Per-pedalboard configs merge into the global config field-by-field. Unspecified fields keep their global defaults. This lets you have different footswitch assignments for different pedalboards without touching the global file.

## Editing config files

Config files live on the pi-Stomp. SSH in to edit them:

```bash
ssh pistomp@pistomp.local
nano /home/pistomp/data/config/default_config.yml
```

After editing, restart the pi-Stomp service:

```bash
ps-restart
```

## Hardware version

```yaml
hardware:
  version: 3.0
```

Set automatically by `firstboot.sh` based on Pi model. Don't change this unless you know what you're doing.

## Footswitches

```yaml
footswitches:
  - id: 0
    adc_input: 0
    midi_CC: 60
    longpress: next_snapshot
  - id: 1
    adc_input: 1
    midi_CC: 61
    longpress: previous_snapshot
  - id: 2
    adc_input: 2
    midi_CC: 62
    longpress: toggle_tuner_enable
  - id: 3
    adc_input: 3
    midi_CC: 63
    tap_tempo: toggle_tap_tempo
```

| Field | What it does |
|-------|-------------|
| `id` | Physical position (0 = leftmost) |
| `adc_input` | Analog input pin on the MCP3008 ADC |
| `midi_CC` | MIDI CC number sent on press |
| `longpress` | Action on long-press (`next_snapshot`, `previous_snapshot`, `toggle_tuner_enable`) |
| `tap_tempo` | Action for tap tempo mode (`toggle_tap_tempo`) |

## Encoders

```yaml
encoders:
  - id: 0
    type: navigation
  - id: 1
    type: tweak
    midi_CC: 70
  - id: 2
    type: tweak
    midi_CC: 71
  - id: 3
    type: volume
```

| Field | What it does |
|-------|-------------|
| `id` | Physical position (0 = leftmost) |
| `type` | `navigation`, `tweak`, or `volume` |
| `midi_CC` | MIDI CC sent on rotation (not used with `volume`) |

## Analog controls (knobs and expression pedal)

```yaml
analog_controllers:
  - adc_input: 5
    id: 0
    type: EXPRESSION
    midi_CC: 75
    autosync: true
```

| Field | What it does |
|-------|-------------|
| `adc_input` | Analog input pin on the MCP3008 ADC |
| `id` | Position on screen (0 = leftmost) |
| `type` | `KNOB` or `EXPRESSION` — changes the LCD icon |
| `midi_CC` | MIDI CC sent on movement |
| `autosync` | Send current position on pedalboard load (prevents value jumps) |

### Enabling the expression pedal

The expression pedal input is commented out in the default config. Enable it with the included script:

```bash
ssh pistomp@pistomp.local
~/extras/expression-pedal.sh on
```

This uncomments the `analog_controllers:` block. Restart the service or reboot for the change to take effect. To disable:

```bash
~/extras/expression-pedal.sh off
```

## Per-pedalboard overrides

To give a specific pedalboard different footswitch or encoder assignments, create a `config.yml` inside that pedalboard's bundle directory. For example, to make footswitch A send CC 64 instead of 60 on the "MySound" pedalboard:

```yaml
footswitches:
  - id: 0
    midi_CC: 64
```

Only the fields you specify are overridden. The rest keep their global defaults.

## External MIDI routing

Route a control to an external MIDI device instead of the internal virtual port:

```yaml
hardware:
  external_midi:
    enabled: true
```

Or per-control by adding `midi_port:` to a footswitch, encoder, or analog control entry. The value is the ALSA client name from `aconnect -l`.

## Blend mode

Blend mode interpolates between snapshots based on an analog input position. When active, moving the assigned control blends smoothly between two or more snapshots — useful for morphing between sounds mid-song without stepping through discrete presets.

### How it works

A blend definition specifies:

- **Snapshots to blend between** — up to 4 stops, each at a position on the 0.0–1.0 range
- **Input control** — which physical control drives the blend (expression pedal, tweak encoder)
- **Interpolation curve** — how the blend feels as you move through the range

### Configuration

```yaml
blend_snapshots:
  - name: "Clean to Fuzz"
    input_id: 0           # expression pedal (0) or encoder (1, 2)
    interpolation: smooth  # linear, smooth, build, drop, snap, bloom
    stops:
      "0.0": "Clean"      # snapshot name at heel position
      "0.5": "Crunch"     # snapshot name at halfway
      "1.0": "Fuzz"       # snapshot name at toe position
```

### Interpolation curves

| Curve | Feel |
|-------|------|
| `linear` | Direct 1:1 — what you see is what you get |
| `smooth` | Slow at both ends, expressive in the middle |
| `build` | Gradual start, rushes at the far end |
| `drop` | Grabs immediately, fine-tunes at the far end |
| `snap` | Stays near the start, sudden jump at the far end |
| `bloom` | Immediate big shift, then plateaus |

### What happens at runtime

When a blend-enabled pedalboard loads, pi-Stomp pre-computes which parameters differ between each pair of adjacent snapshots. As you move the control, only the parameters that actually change between stops are interpolated — everything else stays put. Parameters controlled by footswitch MIDI CCs are excluded from interpolation to prevent conflicts.

The result is seamless: no audible glitches, no MIDI storm, just smooth morphing between your sounds.

### Editing blend snapshots

If you edit the snapshots in MOD-UI, pi-Stomp detects the change and re-preps the blend automatically.

## Settings that persist automatically

Some settings are saved without needing to save a pedalboard:

- **Input gain** — set from the Audio menu or System Menu
- **Headphone volume** — set from the System Menu

These live in `/home/pistomp/data/config/settings.yml`.
