---
title: MIDI Implementation
eleventyNavigation:
  parent: using
  key: midi-implementation
  title: MIDI Implementation
  order: 8
---

# MIDI Implementation

## Default CC map

| Control | CC | Type | Value range |
|---------|----|------|-------------|
| Footswitch A | 60 | Toggle | 0 (off) / 127 (on) |
| Footswitch B | 61 | Toggle | 0 (off) / 127 (on) |
| Footswitch C | 62 | Toggle | 0 (off) / 127 (on) |
| Footswitch D | 63 | Toggle or tap tempo | 0 (off) / 127 (on) |
| Tweak 1 | 70 | Continuous | 0–127 |
| Tweak 2 | 71 | Continuous | 0–127 |
| Volume (Tweak 3) | — | Audio card | Hardware volume |
| Expression pedal | 75 | Continuous | 0–127 |

## MIDI routing

```
pi-Stomp controls → ALSA Midi Through (client 14:0)
  → JACK (-X seq)
    → mod-host:midi_in (MIDI Learn for parameter control)
    → MOD-UI (for wiring to LV2 MIDI plugins)
```

## MIDI learn

Any plugin parameter can be mapped to any MIDI CC:

1. In MOD-UI, open the plugin's settings dialog
2. Click the parameter modify button (next to the parameter you want to assign)
3. Select **MIDI**, then **Save**
4. Move the control (footswitch, knob, expression pedal, external controller)

The parameter is now mapped. Save the pedalboard to retain the assignment.

**MIDI mode must be set to Separated** (not Aggregated) for MIDI learn to work correctly.

### Un-assigning a control

A control cannot be assigned to a new parameter until it is un-assigned from the old one. Open the modify dialog for the parameter it's currently bound to, click **None**, then **Save**.

### Advanced mapping

For continuous controllers, you can set a custom range in the advanced mapping dialog. For example, if a Drive parameter ranges from 0 to 10 but you never want it below 5, set the low value to 5. The control will then sweep only the useful range with finer resolution.

## External MIDI

With the MIDI + Expression Add-On Kit, the 1/8" TRS jack provides MIDI in/out. External controllers connected via USB are also supported.

To route a pi-Stomp control to an external MIDI device instead of the internal virtual port, configure `midi_port:` in the pedalboard's `config.yml`. See the [Configuration]({{ '/using/configuration' | url }}) page.

## Tap tempo

Footswitch D sends tap tempo BPM via WebSocket (`transport-bpm`), not MIDI. The tempo is applied to plugins that support host tempo (e.g., Bollie Delay with Tempo Mode set to MOD/Host).

## Clock source

Tap tempo sets the tempo only when the pi-Stomp is its own clock. The clock source is a three-way choice — **Internal**, **Ableton Link**, or **MIDI Clock Slave** — set in the [Audio & MIDI menu]({{ '/using/audio-midi/#clock-source' | url }}).

Set it to match who's in charge of time. If the pi-Stomp is following a drummer's track or a DAW, put it in Link or MIDI Clock Slave and stop worrying about tapping. If it's leading, leave it Internal.

Whichever source is active, tempo-synced plugins follow it the same way — via host tempo — so the choice doesn't change how you set a delay up, only where its clock originates.

## Services

- `ttymidi.service` — serial MIDI bridge
- `mod-midi-merger.service` — MIDI merging
- `mod-amidithru.service` — creates the `touchosc` ALSA thru port
- `mod-touchosc2midi.service` — TouchOSC bridge
