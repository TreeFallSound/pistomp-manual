---
title: MIDI & Control System
eleventyNavigation:
  parent: developers
  key: midi-control
  title: MIDI & Control System
  order: 4
---

# MIDI & Control System

## Input dispatch

Every hardware input — footswitch, encoder, knob, expression pedal — flows through a single path. A `Controller` reads its detector, advances its own state, packages what happened into an immutable event, and hands it to the handler. The handler's cascade decides what the event means: emit a MIDI CC, send a WebSocket param, set audio-card volume, or drive UI navigation.

There is no router class. The "router" is the sink field plus the code each sink writes. See `pistomp/input/README.md` for the design doc.

## MIDI routing

Emitted CCs go to a single ALSA virtual port. On the deployed system, rtmidi port 0 resolves to the kernel "Midi Through Port-0" (ALSA client 14:0, created by `snd-seq-dummy`). Note this is a separate port from the `touchosc` thru port that `mod-amidithru.service` creates. JACK bridges the Midi Through port via `-X seq`:

```
Handler _emit_midi()  ← chosen by input dispatch
    ↓ MIDI CC via rtmidi
ALSA Midi Through Port-0 (client 14:0)
    ↓ JACK (-X seq)
    ├→ mod-host:midi_in (MIDI Learn for parameter control)
    └→ Available in MOD-UI for wiring to LV2 MIDI plugins
```

### Default CC assignments

| Control | CC | Notes |
|---------|----|-------|
| Footswitch A | 60 | Toggle (0/127) |
| Footswitch B | 61 | Toggle (0/127) |
| Footswitch C | 62 | Toggle (0/127) |
| Footswitch D | 63 | Toggle (0/127) or tap tempo |
| Tweak 1 | 70 | Continuous |
| Tweak 2 | 71 | Continuous |
| Expression pedal | 75 | Continuous, autosync |

### External MIDI routing

A control can be routed to an external hardware MIDI port instead of the virtual Through port. `hardware.external_routing` is the sole routing authority, configured per-pedalboard. `ExternalMidiManager` (`modalapi/external_midi.py`) resolves the rtmidi port at dispatch time.

## Footswitches

A footswitch is a `Controller` that emits a switch event. The handler decides what the press means:

- **Click** — toggle MIDI CC (plugin bypass) or relay bypass
- **Long-press** — previous/next snapshot, toggle tuner, toggle tap tempo mode
- **Chord** — two footswitches held together fire a shared action within a 400ms window

Config overlay per pedalboard can change MIDI CC, relay binding, preset, color, and longpress groups. The chord resolver is `FootswitchChords` (`pistomp/footswitch_chords.py`).

## Encoders

`Encoder` (`pistomp/encoder.py`) is the raw quadrature decoder. `EncoderController` (`pistomp/encoder_controller.py`) wraps it with quantizer, parameter, and push-button handling. The handler routes each encoder by its type: navigation, audio-card volume, or plugin parameter.

## Analog controls

`AnalogMidiControl` (`pistomp/analogmidicontrol.py`) reads the 10-bit ADC (0–1023) via MCP3008 SPI, converts to MIDI CC (0–127) using `as_midi_value()`. Threshold-based change detection prevents jitter. `_clamp_endpoints()` forces values near 0 or 1023 to exact endpoints.

Types: `KNOB` and `EXPRESSION` (config-driven). When `autosync: true`, `Hardware.sync_analog_controls()` (`pistomp/hardware.py`, called from `Modhandler.set_current_pedalboard()`) reads the ADC and sends the current position on pedalboard load, preventing stale state after switching.

## Optimistic MIDI

When a footswitch is pressed, pi-Stomp flips its local state and sends an absolute MIDI CC immediately. mod-host applies the change and echoes the new state via WebSocket. The echo is absolute (not a delta), so a wrong optimistic prediction is overwritten rather than compounded. This keeps the UI responsive even when mod-host's feedback is delayed (e.g., a backgrounded browser tab).
