---
title: Audio & MIDI Menu
eleventyNavigation:
  parent: on-the-pedal
  key: audio-midi
  title: Audio & MIDI Menu
  order: 2
---

# Audio & MIDI Menu

Everything that applies to the whole device rather than to one plugin lives here: input gain, output volume, the global EQ, the clock source, and VU calibration. These settings sit outside your pedalboards, so they persist when you load a different board.

Open it from the **Audio & MIDI** icon in the LCD toolbar.

<img src="{{ '/assets/images/lcd-audio-midi.png' | url }}" alt="Audio & MIDI dialog" class="figure-narrow">


## Input gain and output volume

While in the menu, Tweak2/3 control your pi-Stomp's input gain and output volume, respectively.

* Input Gain sets how hot your instrument hits the converter. Set it by playing your loudest passage and backing off until the clipping LEDs stay out of the red.

* Output Volume is the level going to the amp or front-of-house, and is almost always available via the Tweak3/Vol control on your pi-Stomp.

These values are stored in `settings.yml`.

> pi-Stomp v2: Instead of exposing a software volume control, your hardware has a dual-gang rotary pot connected directly to the output jacks.

## Global EQ

The iQAudioCodec's DAC has a built-in 5 band graphic equalizer you can use to affect all sound leaving your pi-Stomp's analog outputs. It costs no CPU whether it's switched on or off.

| Band | Type | Centre / cut-off at 48 kHz |
|------|------|---------------------------|
| Low | Low shelf | 87 Hz |
| L-Mid | Band-pass | 143 Hz |
| Mid | Band-pass | 628 Hz |
| H-Mid | Band-pass | 2596 Hz |
| High | High shelf | 9560 Hz |

Gain runs from −10.5 dB to +12 dB in 1.5 dB steps. Note that the frequencies are not user-editable and move with the sample rate; the table above is for 48 kHz. At 88.2 and 96 kHz, the EQ is unavailable due to hardware limitations.

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
