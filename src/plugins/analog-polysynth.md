---
title: Analog Polysynth
eleventyNavigation:
  parent: cat-instruments-looping
  key: analog-polysynth
  title: Analog Polysynth
  order: 2
---

# Analog Polysynth

If you want warm, drifting, two-hands-on-the-keys analog pads and brass under your guitar rig, six virtual-analog polysynths ship on the device. We read the DSP source of all six (see `research/24-analog-polysynth-bakeoff.md`), and one of them models an analog filter at the circuit level while the rest stay clean and digital:

## Our pick: Obxd

<img src="{{ '/assets/images/plugin-polysynth-obxd.png' | url }}" alt="Obxd" class="plugin-screenshot">

**Obxd** is Filatov Vadim's model of a famous late-'70s American two-oscillator polysynth — the fat, blooming pads and brass stabs that sound expensive before you touch a knob. The filter is why: a zero-delay feedback structure with a Taylor-approximated diode-pair nonlinearity (`Filter.h:82-106`), switchable between a 12 dB multimode (with a low/band/high *Multimode* blend) and a 24 dB cascade with tanh damping. It is the only filter in this bake-off that models analog nonlinearity at the circuit level; every other contender runs a clean digital filter.

The drift is the other half of the character. Each of the 8 voices gets its own random detune factors — envelope, filter, portamento, and level all scatter slightly per voice (`ObxdVoice.h:159-163`), so held chords shimmer instead of sitting still. *Voice Detune* scales the effect. There is also a unison mode that stacks all 8 voices on one note, hard sync, cross-modulation, and optional 2× oversampling. 27 factory presets ship in MOD-UI — enough to hear the range, though you'll want to dial your own.

| VoiceCount | Osc1Saw | Osc2Saw | Oscillator2detune | VoiceDetune | Cutoff | Resonance | FilterEnvAmount |
|------------|---------|---------|-------------------|-------------|--------|-----------|-----------------|
| max (8) | on | on | 0.1–0.2 | 0.2–0.3 | 0.4–0.5 | 0.1–0.2 | 0.2–0.4 |

All Obxd ports are normalized 0–1. Start there for a pad, then lower *Cutoff* and raise *FilterEnvAmount* for brass. At 8 voices we estimate ~280 multiply-adds per sample — comfortably inside the safe zone alongside a guitar chain, and an economy mode skips silent voices.

Place it at the head of its own chain — instrument plugins take MIDI in, not audio. See [MIDI Instruments]({{ '/plugins/midi-instruments/' | url }}) for how to plug in a keyboard, and [Plugins & Effects]({{ '/using/plugins/' | url }}) for loading plugins in MOD-UI.

## Also great: amsynth

<img src="{{ '/assets/images/plugin-polysynth-amsynth.png' | url }}" alt="amsynth" class="plugin-screenshot">

**amsynth** is the dependable one: Nick Dowell's synth has been in continuous development since 2001, and it is the lightest real polysynth here (~35 multiply-adds per voice, ~350 at its default 10 voices — and polyphony is configurable, all the way to unlimited). Two oscillators with ring mod and hard sync, a multimode filter with 12/24 dB slopes, two ADSRs, one LFO. 27 factory presets ship in MOD-UI, and the control surface is the smallest of the three contenders — *Filter Cutoff*, *Filter Resonance*, *Osc2 Detune*, and *Osc Mix* map onto pi-Stomp encoders without a cheat sheet.

**What you give up:** the filter is a clean SVF/biquad cascade — no diode modeling, no zero-delay feedback. The result is tighter and more polite than Obxd; the character has to come from your playing and the ring mod. Pick it when you want a polysynth running all night next to a full guitar chain and never think about CPU.

## Also great: Helm

<img src="{{ '/assets/images/plugin-polysynth-helm.png' | url }}" alt="Helm" class="plugin-screenshot">

**Helm** is the deep one. Matt Tytel's semi-modular synth has a full polyphonic modulation matrix, two LFOs plus a step sequencer, a 4-pole ladder filter *and* a 4-formant vowel filter, cross-modulation, a sub oscillator, and up to 15 unison voices per oscillator. Nothing else on the device routes modulation like this — if your patch idea starts with "and then the step sequencer sweeps the formant," Helm is the only answer. And you don't have to program any of it yourself: 274 factory presets ship in MOD-UI, by far the largest bank in this bake-off.

**What you give up:** headroom. Unison cost scales linearly (~10 multiply-adds per unison voice on top of a ~40 base), so 8 voices with 7-voice unison lands around ~880 — nearly double the ~500 budget that coexists with a guitar chain on a Pi. Keep polyphony under 8 and unison low, or give Helm the whole board and mix your guitar in dry.

## Also considered

**Noise Maker - ME** is Patrick Kunz's synth in a MOD Devices port, and per voice it is arguably the best-equipped here: three oscillators with hard sync to a dedicated master oscillator, ring mod, a bitcrusher, 12 filter types (including a ladder-style 24 dB mode) running 4× oversampled, and 24 factory presets. But `PMAX_VOICES = 4` — four voices total, hard-capped in the build. That is a lead and duo-line synth; pads run out of fingers. If mono/duo is your use, it beats everything above.

**Triceratops** does fat three-oscillator unison — BLEP anti-aliased saws with per-oscillator unison, built-in echo and reverb, and a healthy 82 factory presets. The on-device build allows 12 voices, and at ~50 multiply-adds per voice that is ~600 total at full polyphony — past the budget next to a guitar chain. Usable if you cap your playing at 6–8 voices, but Obxd gives you more character for less CPU.

**Wolpertinger** is not a subtractive VA at all: its resonant bandpass filter tracks the played note (`cutoff = param_cutoff * freq`, `synth.cpp:79`), so the filter follows the pitch in a fixed ratio — a hollow, vocal, bouncing character closer to a tuned resonator than a VCF. Interesting, but it can't make the pads and brass this page is about — and it ships zero presets, so you start from a blank panel.

Two near-misses on scope: **Calf Monosynth** is monophonic by design, and **MDA JX10** — the classic warm supersaw — is a pad machine more than an analog-poly stand-in; it deserves its own write-up.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| Obxd | Filatov Vadim (2DaT / Datsounds) | GPL | [github.com/2DaT/Obxd](https://github.com/2DaT/Obxd) |
| amsynth | Nick Dowell | GPL | [amsynth.github.io](https://amsynth.github.io) |
| Helm | Matt Tytel | GPL-3.0 | [tytel.org/helm](https://tytel.org/helm) |
| Noise Maker - ME | Patrick Kunz (TAL), ported by MOD Devices | GPL | [tal-software.com](https://tal-software.com) |
| Triceratops | Nick Bailey | GPL-3.0 | [github.com/thunderox/triceratops](https://github.com/thunderox/triceratops) |
| Wolpertinger | Johannes Kroll | GPL | [github.com/kroll-j/wolpertinger](https://github.com/kroll-j/wolpertinger) |
| Calf Monosynth | Krzysztof Foltman | LGPL | [calf-studio-gear.org](https://calf-studio-gear.org) |
| MDA JX10 | Paul Kellett, ported by MOD Devices | GPL | [github.com/moddevices/mda-lv2](https://github.com/moddevices/mda-lv2) |
