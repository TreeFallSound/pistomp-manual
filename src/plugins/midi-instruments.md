---
title: MIDI Instruments
eleventyNavigation:
  parent: cat-instruments-looping
  key: midi-instruments
  title: MIDI Instruments
  order: 1
---

# MIDI Instruments

Your pi-Stomp is also a synthesizer. Plug a USB-MIDI keyboard into a spare USB port (or point a sequencer at it), connect the keyboard to a plugin's MIDI input in MOD-UI, and the `Instrument`-class plugins generate audio from nothing — no guitar required, and the rest of your pedalboard sits right there to color the result. No other pedalboard runs a full synth voice through your own effects chain on the same box. Forty-six instrument plugins ship on the device; these are the ones worth loading first:

## Our pick: Dexed

<img src="{{ '/assets/images/plugin-synth-dexed.png' | url }}" alt="Dexed" class="plugin-screenshot">

**Dexed** is glassy, bell-like, percussive FM — the electric-piano tines, brass stabs, and crystalline pads that defined a decade of records. It is a full six-operator FM engine with all 32 algorithms (`fm_core.cc:29-61`), patch-compatible with the Yamaha DX7: it reads original SysEx cartridges, so forty years of patch libraries load directly. 256 presets ship on the device, and three engine modes change the character — *MSFA* (clean), *Mark I* (models the original hardware's quirks), and *OPL* (crunchier, sound-chip-grade resolution).

| Engine | Num of Voices | Cutoff | Resonance | Gain |
|--------|---------------|--------|-----------|------|
| Mark I | 8 | 1.0 (open) | 0.0 | 1.0 |

The 155 operator parameters are all exposed if you want to program FM from scratch, but start from the presets — that's how the original was played too. One caveat: the plugin defaults to 16 voices and allows 32, and six operators per voice adds up (we estimate ~60 multiply-adds per voice per sample from the operator structure — estimated, not measured). Drop *Num of Voices* to 8 if you run it alongside a guitar chain.

Place it at the head of its own chain — instrument plugins take MIDI in, not audio, so they start a parallel path that merges with your guitar signal wherever you like. Running FM keys into your own overdrive and delay is the point of doing this on a pedalboard.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Also great: setBfree

<img src="{{ '/assets/images/plugin-synth-setbfree.png' | url }}" alt="setBfree" class="plugin-screenshot">

**setBfree** is the tonewheel organ: breathy, clicky, and alive in a way sampled organs aren't. Robin Gareus's model generates every note additively from 91 modeled tonewheels (`tonegen.h:75`), with drawbars, percussion, and the vibrato/chorus scanner all behaving like the electromechanical original — moving a drawbar reshapes notes already sounding. Pair it with **setBfree Whirl Speaker**, the companion rotary-speaker plugin, for the full growl-to-shimmer swell.

**What you give up:** knob access. The plugin exposes no LV2 control ports — drawbars and switches live in its plugin GUI in MOD-UI or arrive over MIDI CC, so you can't assign them to pi-Stomp's encoders directly. Set your registration in the GUI and play; use the Whirl Speaker's slow/fast switch (which *does* have ports) as your performance control.

## Also great: FluidGM

<img src="{{ '/assets/images/plugin-synth-fluidgm.png' | url }}" alt="FluidGM" class="plugin-screenshot">

**FluidGM** is the practical pick: one plugin, 189 General MIDI programs — pianos, strings, brass, drums, everything. It is FluidSynth wrapped as LV2 (falkTX's FluidPlug) with Frank Wen's Fluid GM soundfont baked in, and exactly two controls: *Level* (0–2) and *Program*. When you need "a string pad under the looper" or "any piano at all," this is thirty seconds of setup.

**What you give up:** shaping and RAM. There is no filter or envelope — whatever the soundfont author baked in is what you get — and the 148 MB soundfont loads resident, which is a real cost on a Pi. If that's too much, **AirFont320** is the same engine with a compact 9.7 MB GM bank and 325 presets.

## Also considered

**Nekobi** nails one sound: squelchy acid bass. It models the classic silver bassline box — one pulse/saw oscillator into a four-pole filter (`nekobee_voice_render.c:159-264`) with the *Env Mod*, *Decay*, and *Accent* controls that make the filter bite and bark. Monophonic by design and nearly free CPU-wise. If you want acid lines under a live loop, load it; if you want chords, look elsewhere.

**MDA ePiano** is the tine electric piano — barky when you dig in, glassy when you don't. Despite the name suggesting FM, it plays back sampled tines across 31 velocity-split keygroups, with *Hardness*, *Treble Boost*, and *Overdrive* to move it from mellow to mean. Light on CPU at 32 voices. A strong second chain behind Dexed's FM keys when you want the real sampled thing.

**Crypt** does exactly one thing: enormous, cold, detuned pads. Up to 64 unison oscillators per voice (`SuperSawVoice.hpp:42`) with built-in phaser, delay, and reverb. Gorgeous for ambient beds, heavy at full *Unison* — treat it as a texture generator, not a workhorse.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| Dexed | dcoredump, after Pascal Gauthier's Dexed | Apache 2.0 | [github.com/dcoredump/dexed.lv2](https://github.com/dcoredump/dexed.lv2) |
| setBfree | Robin Gareus | GPL | [github.com/pantherb/setBfree](https://github.com/pantherb/setBfree) |
| setBfree Whirl Speaker | Robin Gareus | GPL | [github.com/pantherb/setBfree](https://github.com/pantherb/setBfree) |
| FluidGM | falkTX (soundfont by Frank Wen) | LGPL | [github.com/falkTX/FluidPlug](https://github.com/falkTX/FluidPlug) |
| AirFont320 | falkTX | LGPL | [github.com/falkTX/FluidPlug](https://github.com/falkTX/FluidPlug) |
| Nekobi | Sean Bolton, falkTX | GPL v2+ | [github.com/DISTRHO/DPF-Plugins](https://github.com/DISTRHO/DPF-Plugins) |
| MDA ePiano | Paul Kellett (MDA), MOD port | GPL | [github.com/moddevices/mda-lv2](https://github.com/moddevices/mda-lv2) |
| Crypt | Vitling (David Whiting) | GPL-3.0 | [github.com/vitling/crypt](https://github.com/vitling/crypt) |
