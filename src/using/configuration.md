---
title: Configuration
eleventyNavigation:
  parent: control
  key: configuration
  title: Configuration
  order: 1
---

# Configuration

pi-Stomp uses YAML configuration files to control how footswitches, encoders, knobs, and expression pedals behave. There are two levels:

- **Global config** — applies to all pedalboards. Lives at `/home/pistomp/data/config/default_config.yml`.
- **Per-pedalboard config** — overrides settings for a specific pedalboard. Lives at `{pedalboard_bundle}/config.yml`.

Per-pedalboard configs merge into the global config field-by-field. Unspecified fields keep their global defaults. This lets you have different footswitch assignments for different pedalboards without touching the global file.

Merging between configs is keyed by `id`: a per-pedalboard entry for `id: 2` finds footswitch 2 wherever it appears, and an `id` that does not exist in `default_config.yml` is skipped with a warning. Anything a pedalboard does not mention returns to the global default when that pedalboard loads — nothing carries over from the pedalboard before it.

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

## When a config file is wrong

Both files are checked as they are read. An unknown key, a value of the wrong type, a MIDI CC above 127, a footswitch entry with no `id` — each of these is an error, and each names the exact place it went wrong:

```
Config file error in /home/pistomp/.pedalboards/MySound.pedalboard/config.yml:
Object contains unknown field `colour` - at `$.hardware.footswitches[0]`
```

**A bad pedalboard `config.yml` is not fatal.** pi-Stomp logs the error, ignores that one file, and loads the pedalboard on the global defaults alone. The pedalboard still works; it just does not get its overrides. Look for it with:

```bash
journalctl -u mod-ala-pi-stomp | grep "config:"
```

**A bad `default_config.yml` stops startup.** There is no safe fallback for the file that describes your hardware, so you will need to read the traceback that is on the recovery screen (blue background) or via SSH:

```bash
journalctl -u mod-ala-pi-stomp -n 50
```

Fix the file, or copy a fresh one from `/home/pistomp/pi-stomp/setup/config_templates/`.

## Hardware version

```yaml
hardware:
  version: 3.0
```

Set automatically by `firstboot.sh` based on Pi model. Don't change this unless you know what you're doing.

## Footswitches

```yaml
hardware:
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

| Field | What it does | Per-pedalboard? |
|-------|-------------|:-:|
| `id` | Physical position (0 = leftmost) | — |
| `adc_input` | Analog input pin on the MCP3008 ADC | — |
| `gpio_input` | GPIO pin (v1/v2 hardware) | — |
| `debounce_input` | Debounce pin (v1/v2 hardware) | — |
| `ledstrip_position` | v3 LED strip pixel index for this switch | — |
| `gpio_output` | GPIO pin for the switch LED (v1/v2 hardware) | — |
| `midi_CC` | MIDI CC number sent on press | ✓ |
| `midi_port` | Route MIDI to an external device by ALSA name | ✓ |
| `midi_channel` | Override MIDI channel for this switch, 0–15 (required with `midi_port`) | ✓ |
| `longpress` | Long-press action — see below | ✓ |
| `preset` | Bind to a snapshot index or step up/down | ✓ |
| `bypass` | Relay bypass control (`LEFT`, `RIGHT`, `LEFT_RIGHT`) | ✓ |
| `disable` | Disable this footswitch entirely | ✓ |
| `color` | LCD label color | ✓ |
| `tap_tempo` | Action for tap tempo mode (`set_mod_tap_tempo`) | — |

Fields marked ✓ do something when you put them in a per-pedalboard `config.yml`. Fields marked — describe how the switch is wired, so they are read once at startup; a pedalboard config may carry them, but changing one there has no effect. Keep them in `default_config.yml`. See [Per-pedalboard overrides](#per-pedalboard-overrides) below.

Note the two different channel conventions. `hardware.midi.channel` sets the base channel and is numbered 1–16, the way a MIDI device's front panel numbers it. A per-control `midi_channel` is a raw channel number, 0–15.

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

`set_mod_tap_tempo` is not in this list. It taps a tempo in, so it needs the timing of the press itself and is reachable only through the separate `tap_tempo:` key.

Remember that a pedalboard change drops audio for a few seconds while a snapshot change does not, so `next_pedalboard` belongs between songs rather than inside one.

**A single-key mapping**, for actions that need an argument:

```yaml
longpress: {midi_CC: 80}          # send a raw CC on the switch's channel
longpress: {preset: UP}           # UP | DOWN | <index>
longpress: {pedalboard: UP}       # UP | DOWN
```

Give exactly one key. `UP` and `DOWN` are upper case.

**A list**, which is how you build chords:

```yaml
hardware:
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

Every name in the list must be one of the handler names in the table above. A misspelled name is rejected when the file is read, so a typo shows up as a config error rather than as a chord that quietly never fires.

## Encoders

```yaml
hardware:
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
| `type` | `KNOB` (default, sends MIDI CC) or `VOLUME` (controls output level). Upper case |
| `midi_CC` | MIDI CC sent on rotation (cannot be used with `type: VOLUME`) |
| `longpress` | Long-press action, e.g. `previous_snapshot` / `next_snapshot` |

## Analog controls (knobs and expression pedal)

```yaml
hardware:
  analog_controllers:
    - id: 0
      adc_input: 5
      type: EXPRESSION
      midi_CC: 75
      autosync: true
```

| Field | What it does |
|-------|-------------|
| `id` | Position on screen (0 = leftmost). Required |
| `adc_input` | Analog input pin on the MCP3008 ADC |
| `type` | `KNOB` or `EXPRESSION` — changes the LCD icon |
| `midi_CC` | MIDI CC sent on movement |
| `threshold` | Movement needed before a new value is sent, 0–127 (default 16) |
| `autosync` | Send current position on pedalboard load (prevents value jumps) |

### Enabling the expression pedal

The expression pedal input is commented out in the default config. Enable it with the included script:

```bash
ssh pistomp@pistomp.local
~/extras/expression-pedal.sh on
```

This uncomments the `analog_controllers:` block. Restart the service or reboot for the change to take effect. `~/extras/expression-pedal.sh off` reverses it.

Which pedals are compatible, how to wire your own jack, and how to assign one to a parameter are on [Expression Pedals]({{ '/using/expression-pedals/' | url }}).

## Factory-installed customization scripts

In `~/extras` you'll find these scripts:

| Script | What it does |
|--------|-------------|
| `expression-pedal.sh on\|off` | Enables the expression pedal input, as above |
| `swap-pedalboards.sh <git-url> [branch]` | Repoints your pedalboard collection at a different git remote and resyncs both MOD and pi-Stomp |
| `journal-toggle.sh on\|off` | Persists logs across reboots (capped at 50 MB) instead of keeping them in RAM. Turn this on before trying to catch an intermittent fault |

Importantly, `swap-pedalboards.sh` will _remove all of your current pedalboards_. It stops pi-Stomp, replaces the `.pedalboards` git tree, and clears MOD's cached state before restarting. It backs up first, but it is a wholesale replacement of your boards, not a merge.

## Per-pedalboard overrides

To give a specific pedalboard different footswitch or encoder assignments, create a `config.yml` inside that pedalboard's bundle directory. For example, to make footswitch A send CC 64 instead of 60 on the "MySound" pedalboard:

```yaml
hardware:
  footswitches:
    - id: 0
      midi_CC: 64
```

Only the fields you specify are overridden. The rest keep their global defaults, and they go back to those defaults as soon as you load a different pedalboard.

To remove something the global config sets, rather than change it, give the field an explicit `null`:

```yaml
hardware:
  footswitches:
    - id: 0
      longpress: null      # this pedalboard wants no long-press on switch A
```

Leaving the field out is not the same thing: an absent field means "use the global default", while `null` means "nothing here".

## External MIDI routing

Two mechanisms:

**Per-control routing** — add `midi_port:` (and optionally `midi_channel:`) to a footswitch, encoder, or analog control entry. The value is the exact ALSA client name from `aconnect -l`. That control's MIDI then goes to the external device instead of the internal virtual port, falling back to the virtual port only if the device is unavailable.

**On-load messages** — send fixed MIDI messages to external devices whenever a pedalboard loads (e.g. to recall a preset on an external pedal):

```yaml
hardware:
  external_midi:
    enabled: true
    send_delay_ms: 10          # delay between consecutive messages
    messages:
      Source Audio C4 Synth:   # exact ALSA client name from `aconnect -l`
        - [0xB0, 0x66, 0x00]   # CC 102 = 0
      HX Stomp:
        - [0xC0, 0x00]         # Program Change 0
```

A pedalboard's `config.yml` can change both. pi-Stomp merges `messages` by device name: if a pedalboard names a device that the global config also names, the pedalboard entry replaces the global entry. The other global devices stay active. To send no external MIDI at all for one pedalboard, write `external_midi: null` in its `config.yml`.

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

Because the diff is computed once at load rather than per movement, the treadle sends no MIDI and touches only the handful of parameters that actually differ.

### Editing blend snapshots

If you edit the snapshots in MOD-UI, pi-Stomp detects the change and re-preps the blend automatically.

## Settings that persist automatically

Some settings are saved without needing to save a pedalboard:

- **Input gain** — set from the Audio & MIDI panel
- **Headphone volume** — set from the Audio & MIDI panel

These live in `/home/pistomp/data/config/settings.yml`.
