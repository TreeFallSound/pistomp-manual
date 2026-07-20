---
title: Configuration
eleventyNavigation:
  parent: using
  key: configuration
  title: Configuration
  order: 9
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
    ledstrip_position: 0
    midi_CC: 60
    longpress: previous_snapshot
  - id: 1
    adc_input: 1
    ledstrip_position: 1
    midi_CC: 61
    longpress: next_snapshot
  - id: 2
    adc_input: 2
    ledstrip_position: 2
    midi_CC: 62
    longpress: toggle_tuner_enable
  - id: 3
    adc_input: 3
    ledstrip_position: 3
    midi_CC: 63
    longpress: toggle_tap_tempo_enable
    tap_tempo: set_mod_tap_tempo
```

| Field | What it does |
|-------|-------------|
| `id` | Physical position (0 = leftmost) |
| `adc_input` | Analog input pin on the MCP3008 ADC |
| `ledstrip_position` | v3 LED strip pixel index for this switch |
| `midi_CC` | MIDI CC number sent on press |
| `longpress` | Long-press action — see below |
| `tap_tempo` | Action for tap tempo mode (`set_mod_tap_tempo`) |

### Long-press actions

`longpress` accepts three forms.

**A handler name.** The full set:

| Name | What it does |
|------|-------------|
| `next_snapshot` | Next snapshot on the current pedalboard |
| `previous_snapshot` | Previous snapshot |
| `next_pedalboard` | Load the next pedalboard |
| `previous_pedalboard` | Load the previous pedalboard |
| `toggle_bypass` | Global bypass on/off |
| `toggle_tuner_enable` | Open or close the tuner |
| `toggle_tap_tempo_enable` | Enter or leave tap tempo mode |
| `set_mod_tap_tempo` | Set the host tempo directly |

Remember that a pedalboard change drops audio for a few seconds while a snapshot change does not, so `next_pedalboard` belongs between songs rather than inside one.

**A single-key mapping**, for actions that need an argument:

```yaml
longpress: {midi_CC: 80}          # send a raw CC on the switch's channel
longpress: {preset: next}         # next | previous | <index>
longpress: {pedalboard: next}     # next | previous
```

**A list**, which is how you build chords:

```yaml
footswitches:
  - id: 0
    midi_CC: 60
    longpress: [previous_snapshot, toggle_tuner_enable]
  - id: 1
    midi_CC: 61
    longpress: [next_snapshot, toggle_tuner_enable]
```

Each name in the list is a group the switch joins. A name held by exactly one switch fires on its own. A name held by two switches becomes a chord: it fires only when both are long-pressed within 0.4 seconds of each other, and the individual actions are suppressed.

In the example above, long-pressing A alone gives you the previous snapshot, B alone gives you the next, and A and B together open the tuner. That frees footswitch C's long-press for something else. The chord window is also why a lone member waits 0.4 s before acting — it's giving you time to press the other switch.

Only names with a matching handler callback participate, so a typo in a group name silently drops that switch out of the chord rather than erroring.

## Encoders

```yaml
encoders:
  - id: 1
    midi_CC: 70
    longpress: previous_snapshot
  - id: 2
    midi_CC: 71
    longpress: next_snapshot
  - id: 3
    type: VOLUME
```

The navigation encoder (id 0) is wired in hardware, not defined here — don't add it to the config. Only the tweak and volume encoders are configurable.

| Field | What it does |
|-------|-------------|
| `id` | Physical position (1, 2, 3 — id 0 is the fixed navigation encoder) |
| `type` | `KNOB` (default, sends MIDI CC) or `VOLUME` (controls output level) |
| `midi_CC` | MIDI CC sent on rotation (cannot be used with `type: VOLUME`) |
| `longpress` | Long-press action, e.g. `previous_snapshot` / `next_snapshot` |

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

## Factory-installed customization scripts

In `~/extras` you'll find these scripts:

| Script | What it does |
|--------|-------------|
| `expression-pedal.sh on\|off` | Enables the expression pedal input, as above |
| `swap-pedalboards.sh <git-url> [branch]` | Repoints your pedalboard collection at a different git remote and resyncs both MOD and pi-Stomp |
| `journal-toggle.sh on\|off` | Persists logs across reboots (capped at 50 MB) instead of keeping them in RAM. Turn this on before trying to catch an intermittent fault |
| `wifi-backend-toggle.sh iwd\|wpa_supplicant\|status` | Switches NetworkManager's WiFi backend |

Importantly, `swap-pedalboards.sh` will _remove all of your current pedalboards_. It stops pi-Stomp, replaces the `.pedalboards` git tree, and clears MOD's cached state before restarting. It backs up first, but it is a wholesale replacement of your boards, not a merge.

If you are experiencing WiFi drops, you can try out the experiment `wifi-backend-toggle.sh iwd`. Switch over Ethernet before running, if possible, since changing backends restarts NetworkManager and your WiFi will likely drop for a few seconds.

## Per-pedalboard overrides

To give a specific pedalboard different footswitch or encoder assignments, create a `config.yml` inside that pedalboard's bundle directory. For example, to make footswitch A send CC 64 instead of 60 on the "MySound" pedalboard:

```yaml
footswitches:
  - id: 0
    midi_CC: 64
```

Only the fields you specify are overridden. The rest keep their global defaults.

## External MIDI routing

Two mechanisms:

**Per-control routing** — add `midi_port:` (and optionally `midi_channel:`) to a footswitch, encoder, or analog control entry. The value is the exact ALSA client name from `aconnect -l`. That control's MIDI then goes to the external device instead of the internal virtual port, falling back to the virtual port only if the device is unavailable.

**On-load messages** — send fixed MIDI messages to external devices whenever a pedalboard loads (e.g. to recall a preset on an external pedal):

```yaml
external_midi:
  enabled: true
  send_delay_ms: 10          # delay between consecutive messages
  messages:
    Source Audio C4 Synth:   # exact ALSA client name from `aconnect -l`
      - [0xB0, 0x66, 0x00]   # CC 102 = 0
    HX Stomp:
      - [0xC0, 0x00]         # Program Change 0
```

Both can be overridden per-pedalboard in the pedalboard's `config.yml`.

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

`stops` accepts two forms. The dict form above maps a position (0.0–1.0) to a snapshot, referenced either **by name** (case-insensitive prefix match) or **by 0-based index**. The list form spaces snapshots evenly for you:

```yaml
    stops: ["Quiet", "Loud"]   # auto-placed at 0.0 and 1.0
```

Up to four stops are allowed.

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

- **Input gain** — set from the Audio & MIDI panel
- **Headphone volume** — set from the Audio & MIDI panel

These live in `/home/pistomp/data/config/settings.yml`.
