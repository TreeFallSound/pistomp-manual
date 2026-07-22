---
title: Audio & MIDI Menu
eleventyNavigation:
  parent: using
  key: audio-midi
  title: Audio & MIDI Menu
  order: 7
---

# Audio & MIDI Menu

Everything that applies to the whole device rather than to one plugin lives here: input gain, output volume, the global EQ, the clock source, and VU calibration. These settings sit outside your pedalboards, so they persist when you load a different board.

Open it from the **Audio & MIDI** icon in the LCD toolbar.

The Navigation encoder scans through the menu in this order:

**Equalizer → Low → L-Mid → Mid → H-Mid → High → Clock Source → VU Calibration → Input → Output → Back**

Two shortcuts work anywhere on the screen, so you don't have to scan to reach the levels you touch most:

| Control | Adjusts |
|---------|---------|
| Tweak 2 | Input Gain |
| Tweak 3 / Volume | Output Volume |

Tweak 1 adjusts whatever the Navigation encoder has selected — it's not a shortcut, just the normal behavior.

## Input gain and output volume

Input Gain sets how hot your instrument hits the converter. Set it by playing your loudest passage and backing off until the clipping LEDs stay out of the red. Everything downstream inherits this setting, so it's worth getting right before you tune a pedalboard.

Output Volume is the level going to the amp or the house.

Both persist to `settings.yml` without saving a pedalboard.

## Global EQ

The iQAudioCodec's DAC is 

Five bands of tone shaping across everything the device outputs. Switching the Equalizer row off drops the bands out of the Navigation cycle and dims them.

This EQ is not a plugin. It runs in the IQAudio Codec's DAC hardware (a Dialog DA7213), which is why it costs no CPU and why its controls are more limited than a plugin EQ:

| Band | Type | Centre / cut-off at 48 kHz |
|------|------|---------------------------|
| Low | Low shelf | 87 Hz |
| L-Mid | Band-pass | 143 Hz |
| Mid | Band-pass | 628 Hz |
| H-Mid | Band-pass | 2596 Hz |
| High | High shelf | 9560 Hz |

Gain runs from −10.5 dB to +12 dB in 1.5 dB steps. Q is fixed in silicon and isn't exposed at all, so gain is the only control — the on-screen bars show gain only because that's genuinely all there.

- **The frequencies move with the sample rate.** The table above is for 48 kHz, the device's normal rate. At other supported rates the whole set shifts.
- **At 88.2 and 96 kHz the EQ is unavailable.** The DAC's EQ block doesn't run at those rates, so the bands grey out. If you need tone shaping at high rates, use a plugin EQ instead.

For surgical work, or anything needing a specific Q, reach for a plugin — see the [EQ editorial]({{ '/plugins/eq/' | url }}). Use this EQ for the broad "this room is boomy" correction you make once you hear the space.

## Clock source

Sets what the device's tempo follows. See [MIDI Implementation]({{ '/using/midi-implementation/' | url }}) for the MIDI side.

| Source | Behaviour |
|--------|-----------|
| **Internal** | The pi-Stomp keeps its own tempo. Tap tempo sets it |
| **Ableton Link** | Tempo is shared with any Link-enabled software or device on the network |
| **MIDI Clock Slave** | The pi-Stomp follows incoming MIDI clock |

MOD-UI owns the authoritative transport state; the LCD mirrors it, so a change made in either place shows up in the other.

## VU calibration

Sets the reference the level meters are drawn against, so the on-screen metering matches what your converter is actually doing.
