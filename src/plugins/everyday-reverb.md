---
title: Everyday Reverb
eleventyNavigation:
  parent: cat-delay-reverb
  key: everyday-reverb
  title: Everyday Reverb
  order: 4
---

# Everyday Reverb

If you need a plate, hall, room, or ambience — not a shimmer cloud and not a special-effect colour — the everyday-reverb field on the pi-Stomp comes down to two picks. **MVerb** is the full Dattorro figure-of-eight plate with every Dattorro control surface exposed, and **C\* Plate** is the same Dattorro structure with modulated tank lattices and fewer controls. For variety, **TAP Reverberator** covers 43 modes:

## Our pick (plate): MVerb

<img src="{{ '/assets/images/plugin-reverb-mverb.png' | url }}" alt="MVerb" class="plugin-screenshot">

MVerb (Martin Eastwood, DPF'ied by falkTX) is the only true Dattorro plate on the device that exposes the full Dattorro control surface. Signal path: input → bandwidth SVF (4× oversampled) → 4 series "smear" allpasses → predelay → split into two tanks (L/R) with cross-feed → each tank runs 4-tap allpass → delay → damping SVF (4× oversampled) → 4-tap allpass → delay → 7-tap early-reflection delay lines parallel to the tank → accumulator mixes tank taps and early reflections via EarlyMix → out = dry + Mix·(accumulator − dry), scaled by Gain. The 4-tap tank allpasses give the Dattorro plate its density without resorting to a high comb count. Tank delay lengths scale with `Size`, so the room actually grows — the one knob that affects the tank's modal structure, not just its decay.

Parameter mapping: Bandwidth/Damping 0–1 → 100–18500 Hz, Decay 0–1 → 0.005–0.8045, Predelay 0–1 → 0–200 ms, Size 5–100 %. The two SVFs are oversampled 4× — a deliberate cost paid for cleaner high-frequency response at high damping. DISTRHO marks it `DISTRHO_PLUGIN_IS_RT_SAFE 1`. CPU is roughly 30–40 mul/sample per channel at 48 k.

| Bandwidth | Damping | Decay | Predelay | Size | Density | Mix | Gain |
|-----------|---------|-------|----------|------|---------|-----|------|
| 0.75 | 0.5 | 0.5 | 0.1 | 0.75 | 0.5 | 0.5 | 1.0 |

The 5 factory presets (Halves, Dark, Cupboard, Stadium, Subtle) are static `setParameter` calls — load them in MOD-UI and tweak from there. The result is the dense, slightly-warm plate character the Dattorro structure is known for.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Also great: C\* Plate (and PlateX2)

<img src="{{ '/assets/images/plugin-reverb-plate.png' | url }}" alt="C* Plate" class="plugin-screenshot">

C\* Plate (Tim Goetze) is the same Dattorro structure, sample-rate-scaled, with one differentiator: modulated tank lattices. Two `ModLattice` objects run a `DSP::Sine` LFO at 1.2 Hz, the second phased 90° from the first, with modulation width fixed at ~4 ms. The modulated read uses linear interpolation — this is the chorus-style smearing that breaks the Dattorro plate's otherwise-static resonant modes. The result is a subtly chorused, breathing character MVerb does not have. Delay lengths are Dattorro's published values (input lattices 4.77/3.60/12.73/9.31 ms, tank modulated lattices 22.58/30.51 ms, tank delays 149.62/124.99/141.69/89.24 ms), scaled by sample rate.

Fewer controls than MVerb: bandwidth 0–1, tail 0–1 (×0.749 = decay), damping 0–1 (mapped to `exp(−π·(0.0005+0.9995·x))` so the knob sweeps the LPF cutoff from very-low up to Nyquist/2), blend 0–1 (pow 1.6, non-linear because "linear is not a good choice for this pot"). No predelay, no early/late, no density. Mono-in / stereo-out. CPU is ~20–25 mul/sample per channel — lighter than MVerb (no early-reflection stage, no oversampled SVF, no four-tap allpasses). The modulated lattices are the most expensive element due to linear interpolation.

| Bandwidth | Tail | Damping | Blend |
|-----------|------|---------|-------|
| 0.5 | 1.0 | 0.5 | 0.4 |

**C\* PlateX2** is the stereo-input variant — same DSP, but the tank input is mono-summed (`x = (sl[i] + sr[i] + normal) * .5` in `Reverb.cc:382`). The tank itself is stereo (parallel L/R tanks with cross-feed), but the input is mono-summed first. For a mono guitar chain this does not matter; for a stereo chain PlateX2 does not buy you true-stereo reverb — it buys you summed-mono-into-stereo-tank. Use the mono Plate unless your chain is already stereo and you want the convenience.

**What you give up vs. MVerb:** predelay, early/late mix, density, the four-tap tank allpasses, the oversampled damping SVF. What you get back: the 1.2 Hz modulated lattices, lighter CPU, and a simpler control surface that is harder to dial in wrong.

## Also great (variety): TAP Reverberator

<img src="{{ '/assets/images/plugin-reverb-tap-reverberator.png' | url }}" alt="TAP Reverberator" class="plugin-screenshot">

TAP Reverberator (Tom Szilagyi) is the classic Schroeder-Moorer architecture with two extensions: per-comb HF compensation (a biquad LPF inside each comb's feedback loop) and an optional stereo-enhance toggle that scales one side's comb/allpass lengths by `ENH_STEREO_RATIO = 0.998` to decorrelate L/R. 43 modes — AfterBurn, Ambience (Thick + HD), Cathedral (+ HD), Drum Chamber, Garage (+ Bright), Gymnasium (+ Bright + HD), Hall (Small/Medium/Large + HD), Plate (Small/Medium/Large + HD), Pulse Chamber (+ Reverse), Resonator, Room (Large + HD), Slap Chamber (+ Bright + HD), Smooth Hall (Small/Medium/Large + HD), Vocal Plate (+ HD), Warble Chamber, Warehouse (+ HD). Decay 0–10000 ms covers everything from room to cathedral. Per-mode comb counts vary from 5 to 8, allpass counts from 5 to 11; mode 4 (Ambience Thick HD) is the heaviest.

The build uses fixed-point arithmetic (`REVERB_CALC_FLOAT` is commented out by default, `F2S = 2147483` ≈ 60 dB headroom above 0 dB, 120 dB dynamics below) — unusual for a reverb, and the reason TAP Reverberator has been CPU-cheap and stable on ARM historically. CPU is roughly 80–120 mul/sample per channel at 48 k — heavier than MVerb per-sample, but the fixed-point path keeps it predictable.

| Decay (ms) | Dry Level (dB) | Wet Level (dB) | Enhanced Stereo | Type |
|------------|-----------------|----------------|-----------------|------|
| 2800 | −4 | −12 | on | 0 (AfterBurn) |

Reach for it when you want 43 sonic choices in one plugin. The per-comb HF-comp is the right detail for guitar — high frequencies attenuate more in real rooms, so the reverb should mirror that.

## Also great (hall / room): Roomy

<img src="{{ '/assets/images/plugin-reverb-roomy.png' | url }}" alt="Roomy" class="plugin-screenshot">

Roomy (Harry van Haaren, openAV) is a Faust-generated FDN from the JOS STK library. 8 parallel feedback delay lines per channel, each with its own one-pole damping LPF inside the feedback loop, and an 8×8 feedback mixing matrix where each delay line's input is a signed sum of all 8 delay line outputs — the dense FDN structure that makes the tail smooth and free of distinct comb modes. The matrix coefficients are baked into the Faust-generated code; they are not user-adjustable. Per-side predelay comb up to 1000 ms. Two-pole LPF on the wet gain for zipper-free dry/wet crossfade.

Parameter mapping: RT60 1–6 s, damping 1500–18500 Hz **inverted** (higher knob = lower cutoff = darker), dryWet 0–1. The inversion on damping is unusual — turn the knob up to darken, not to brighten. CPU is ~40–50 mul/sample per channel at 48 k.

| Room (RT60) | Damping | Dry/Wet |
|-------------|---------|---------|
| 3.0 s | 0.5 (~10000 Hz) | 0.5 |

Cleaner, less characterful than TAP but more "correct" — the dense feedback matrix produces a smooth, mode-free tail. Reach for it when you want one hall sound, not 43.

## Also considered

### Short-space ambience (not a true reverb)

**MDA Ambience** (Paul Kellett) is a 4-stage series allpass with a shared 1024-sample buffer. The size parameter scales the delay increments; at max size the longest stage is ~1020 samples ≈ 23 ms at 44.1 k. There is no long tail — the algorithm produces a dense, decaying ambience splash on the order of tens of milliseconds, not seconds. This is the intentional design (the original mda VST put it in the "Ambience" category, not "Reverb"). Use it for "thicken without washing out" on a dry guitar. Note: changing `size` mid-signal calls `suspend()` which flushes the buffers with no crossfade — there will be a click. The denormal-protection block will suspend the buffer entirely if feedback decays below ~1e-10, which can happen during quiet passages.

| Size (m) | HF Damp | Mix | Output |
|----------|---------|-----|--------|
| 5 | 50 % | 50 % | 0 dB |

### Fixed-character "always-on" reverb

**DIE Reverb** (Fredrik Kilander, Robin Gareus, Will Panther, Damien Zammit — the setBfree organ reverb, packaged as a standalone LV2) is a Schroeder reverb: 4 parallel feedback combs + 3 series allpasses per side, with one-sample LPF in the loop. Two knobs (Blend 0–1, Room Size 0.5–1.0) and Enable. No predelay, no HF damping knob, no early/late split, no HPF/LPF. The fixed `inputGain = −20 dB` and `fbk = −0.015` mean the reverb has a fixed character that you can only make wetter or longer — not darker or shorter-predelay'd. Right-channel comb/allpass lengths are offset by 7 samples for primitive stereo decorrelation. Room Size scales only the comb feedback gains, not the delay lengths — the room stays the same size, only the decay changes.

CPU is ~15–20 mul/sample per channel — cheap. The DSP credits Fredrik Kilander / Robin Gareus / Will Panther / Damien Zammit, not the `doap:developer` "Ardour Community" the TTL declares. Reach for it when you want a fixed-character room colour you do not have to think about.

| Blend | Room Size | Enable |
|-------|-----------|--------|
| 0.3 | 0.5 | on |

### Freeverb family (same algorithm, three wrappers)

**rkr Reverb** (`ssj71/rkrlv2`, after Nasca Octavian Paul / ZynAddSubFX) — 8 combs + 4 allpasses per channel, two types: type 0 = random comb lengths, type 1 = Freeverb (Jezar at Dreampoint, comb tunings `{1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617}`, allpass tunings `{225, 341, 441, 556}`). Right channel +23 sample offset for stereo decorrelation. Room size is exponentially mapped (`10^((P-64)/64 · 2)`), so the knob's 0–127 spans 0.1× to 10× the base delay lengths. Each comb has a one-pole LPF in feedback (the Freeverb-style damped comb). Cross-reference the [vintage fuzz editorial]({{ '/plugins/vintage-fuzz/' | url }}) — same rakarrack control surface. LPF/HPF are `AnalogFilter` RBJ biquads.

**GxReverb-Stereo** (guitarix, Faust-generated from Grame's `freeverb` lib, `trunk/src/LV2/faust/stereoverb.dsp`) — same Freeverb algorithm, lighter on CPU, no integer quantisation, no initial-delay or panning controls.

**ZynReverb** (ZynAddSubFX LV2 wrapper) — same `Reverb.cpp` engine as rkr Reverb, exposed with the full Zyn preset system. The difference is the UI/preset surface, not the DSP.

A user picking "the Freeverb sound" has three interchangeable options differing mainly in UI.

### Convolution reverbs

**ZamVerb** (zamaudio) — partitioned convolution with 8 bundled IR presets, FFT-based. **LSP IR Mono / Stereo** (LSP project) — partitioned convolution IR loader, with pitch and IR-length controls. **x42 IR Convolver Mono / Stereo** (Robin Gareus) — configurable partition size. **Convolution Loader** (mod.audio) — MOD Team's IR loader for arbitrary impulse responses.

These are a different question ("which IR loader?") than the algorithmic-reverb question this editorial answers. Reach for them when you have a specific IR file you want to use.

### High-quality but not the everyday pick

**TAL-Reverb-III** (Patrick Kunz, DISTRHO JUCE port) — noise-modulated Schroeder (4 combs + 5 allpasses, pre/post allpass, TalEq). The noise-modulated diffusion (`tickFilteredNoiseFast` injected into both comb delay time and feedback diffusion) is the same family of trick Dattorro specified with the modulated lattice; TAL does it with filtered noise instead of an LFO. The densest chorusing of any non-FDN reverb on the device. Worth a listen if you want the TAL character.

**Aether** (Dougal Sanderson, LV2 port of CloudSeed) — up to 12 parallel modulated delay lines, each with its own Schroeder diffuser + damping (low/high shelf + high cut) + feedback matrix, configurable order. The most configurable reverb on the device, also the heaviest — easily saturates a Pi core at high order. Use with care.

**GVerb** (Juhana Sadeharju, SWH LV2 port) — 4th-order FDN with Hadamard feedback matrix + early-reflection diffusers. Historically important (the original Linux FDN), but zita-rev1 and Dragonfly Hall have superseded it. CPU-cheap, but the tail is less smooth than the modern FDNs.

### Cross-reference

For shimmer / cloud / ambient reverbs (Shimmizita, TheCloud, Dragonfly Hall/Plate, Airwindows Galactic/PocketVerbs, gx_zita_rev1) see the [Shimmer and Cloud Reverb]({{ '/plugins/shimmer-cloud-reverb/' | url }}) editorial.

### Skip editorially

**MaFreeverb / MaGigaverb** — `distrho.sf.net` mini-ports, source retired (verified across `DISTRHO/DISTRHO-Ports` master/legacy/juce7 branches). Cannot verify algorithm from source, zero pedalboard usage. Footnote only.

**Shiroverb** — Max/MSP gen~ export, opaque algorithm. Worth a listen but too idiosyncratic to rank against the algorithmic reverbs.

**Freaktail / Prefreak** — niche Faust reverbs from the Freaked collection. Freaktail has distortion in the feedback path; Prefreak is multitap early reflections only. Character effects, not everyday reverbs.

**Airwindows StarChild / MV** — special-effect reverbs (pitch-shifted tap delay; Midiverb-style 27-stage allpass chain with sin() feedback folding). Already listed in the shimmer-cloud editorial as colours, not everyday-reverb material.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| MVerb | Martin Eastwood (DPF port by falkTX) | GPL-3.0 | [github.com/DISTRHO/MVerb](https://github.com/DISTRHO/MVerb) |
| C\* Plate / PlateX2 | Tim Goetze | GPL-3.0 | [quitte.de/dsp/caps.html](http://quitte.de/dsp/caps.html) |
| TAP Reverberator | Tom Szilagyi | GPL-2.0 | [tap-plugins.sourceforge.net](http://tap-plugins.sourceforge.net/index.html) |
| Roomy | Harry van Haaren | GPL-2.0 | [openavproductions.com/artyfx](http://openavproductions.com/artyfx/) |
| MDA Ambience | Paul Kellett (LV2 port by David Robillard) | GPL-3.0 | [github.com/moddevices/mda-lv2](https://github.com/moddevices/mda-lv2) |
| DIE Reverb | Fredrik Kilander, Robin Gareus, Will Panther, Damien Zammit | GPL-2.0 | [github.com/DISTRHO/DIE-Plugins](https://github.com/DISTRHO/DIE-Plugins) |
| rkr Reverb | Josep Andreu after Nasca Octavian Paul | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| GxReverb-Stereo | Guitarix team | ISC | [guitarix.sourceforge.net](http://www.guitarix.org/) |
| ZynReverb | Nasca Octavian Paul (ZynAddSubFX) | GPL-2.0 | [zynaddsubfx.sourceforge.net](https://zynaddsubfx.sourceforge.net) |
| ZamVerb | Damien Zammit | GPL | [github.com/zamaudio/zam-plugins](https://github.com/zamaudio/zam-plugins) |
| LSP IR Mono / Stereo | LSP project | LGPL | [lsp-plug.in](https://lsp-plug.in) |
| x42 IR Convolver Mono / Stereo | Robin Gareus | GPL-2.0+ | [gareus.org](http://gareus.org/) |
| Convolution Loader | mod.audio | (proprietary) | [mod.audio](https://mod.audio) |
| TAL-Reverb-III | Patrick Kunz (DISTRHO port) | GPL-2.0+ | [github.com/DISTRHO/DISTRHO-Ports](https://github.com/DISTRHO/DISTRHO-Ports) |
| Aether | Dougal Sanderson (CloudSeed LV2 port) | GPL-3.0 | [github.com/Dougal-s/Aether](https://github.com/Dougal-s/Aether) |
| GVerb | Juhana Sadeharju (SWH LV2 port) | GPL-2.0 | [plugin.org.uk](http://plugin.org.uk/) |
| Shiroverb | Nino de Wit | GPL | [github.com/ninodewit/SHIRO-Plugins](https://github.com/ninodewit/SHIRO-Plugins) |
| Freaktail / Prefreak | pjotrompet (Freaked) | GPL | [github.com/pjotrompet/Freaked](https://github.com/pjotrompet/Freaked) |
| Airwindows StarChild / MV | Chris Johnson (Airwindows), port by Hannes Braun | MIT | [hannesbraun.net](https://hannesbraun.net) |