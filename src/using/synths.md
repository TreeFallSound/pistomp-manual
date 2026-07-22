---
title: Hosting Synths & Samplers
eleventyNavigation:
  parent: using
  key: synths
  title: Hosting Synths & Samplers
  order: 14
---

# Hosting Synths & Samplers

The same plugin host that runs your guitar effects also runs over 60 synths, samplers, and drum machines — and a USB MIDI keyboard plugged into any of the pi-Stomp's USB-A ports works out of the box. You can build a pedalboard that's an instrument, not just an effects chain, and play it from the floor with no computer on stage.

## Plugging in a keyboard

1. Connect a USB-MIDI keyboard to any USB-A port on the pi-Stomp
2. Open MOD-UI at [http://pistomp.local](http://pistomp.local)
3. Your keyboard appears under **Hardware Capture** in the plugin browser's MIDI section, usually as an ALSA client name like `USB MIDI Keyboard`

USB-MIDI class-compliant keyboards work without any driver install. DIN MIDI needs the [MIDI + Expression Add-On Kit]({{ '/building/ordering-parts/#optional-midi--expression-add-on-kit' | url }}).

## Adding a synth

Drag a generator plugin onto the canvas — same as an effect. The plugin browser groups them under **Generator**. A few worth knowing:

| Plugin | What it is |
|--------|-----------|
| **setBfree** | Hammond B3 tonewheel organ emulator with drawbar control |
| **AMSynth** | Analog-modelling synth, single voice |
| **Calf Mono Synth** | Subtractive synth with built-in envelope and filter |
| **Hexter** | Yamaha DX7-style FM synth |
| **Qsynth / FluidSynth** | General MIDI soundfont player — point it at a `.sf2` file |
| **SooperLooper** | Looping sampler |
| **drum machines** | Several beat and drum plugins under Generator |

The full list is on the [All Plugins]({{ '/plugins/all/' | url }}) page — filter by Generator.

## Wiring MIDI to audio

A generator plugin takes MIDI in and produces audio out:

1. Drag a cable from your keyboard's MIDI output to the synth's MIDI input
2. Drag a cable from the synth's audio output to the pedalboard's hardware playback (or to another effect, then to playback)

MIDI cables in MOD-UI are the same orange as audio cables — the ports are typed, so you can only connect MIDI to MIDI and audio to audio.

## Mapping hardware to it

Footswitches and expression pedals work the same way on a synth as on an effect. Common bindings:

- **Expression pedal → organ drawbar** (or any continuous parameter)
- **Footswitch → preset change** for patch switching
- **Tweak encoder → filter cutoff** for wah-style sweeps

See [MOD-UI]({{ '/using/mod-ui/#assigning-a-hardware-control' | url }}) for the assignment flow.

## MIDI to CV

If you'd rather drive a modular synth, the [MIDI to CV]({{ '/using/control-voltage/' | url }}) plugin converts note pitch to control voltage (1/12 V per semitone, plus a gate) — internal only, since the pi-Stomp has no CV jacks on the enclosure. The full CV toolkit is on that page.

## CPU cost

Generators are the heaviest CPU category on the device. A single polyphonic synth can eat more headroom than a full guitar chain. Watch the CPU meter in MOD-UI's top bar; if you're hitting XRUNs, see [Performance Tuning]({{ '/maintenance/performance/' | url }}).