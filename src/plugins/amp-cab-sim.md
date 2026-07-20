---
title: Amp, Cabinet, and Neural Capture
eleventyNavigation:
  parent: editorials
  key: amp-cab-sim
  title: Amp, Cabinet, and Neural Capture
  order: 17
---

# Amp, Cabinet, and Neural Capture

If you need an amp and cabinet on the pi-Stomp, the choice is between a modeled plugin with knob-per-control and a neural capture that is one amp at one setting. **GxAmplifier-X** is the modeled all-in-one (18 tube preamps × 28 tonestacks × 18 cabs in one plugin) and **GxCabinet** is the standalone cab IR convolver with a 3-knob IR former. **Neural Amp Modeler** is the only NAM player on the device — it loads `.nam` captures (A1 Standard/Lite/Feather/Nano, A2 Lite/Full) plus RTNeural keras JSON for AIDA-X / GuitarML models:

## Our pick (modeled): GxAmplifier-X

<img src="{{ '/assets/images/plugin-amp-gxamplifier-x.png' | url }}" alt="GxAmplifier-X" class="plugin-screenshot">

GxAmplifier-X (guitarix team) chains three guitarix blocks in one LV2 instance: 18 tube preamp models (selected by `Model`, Faust-generated DSPs from `gxamp.dsp` to `gxamp18.dsp`), 28 tonestacks (`Tonestack Model` — Bassman, Twin, Princeton, JCM-800, JCM-2000, M-Lead, M2199, AC-30, SOL 100, Mesa, JTM-45, AC-15, Peavey, Ibanez, Roland, Ampeg, Rev.Rocket, MIG 100 H, Triple Giant, Trio, H&K, Fender Junior, Fender, Fender Deville, Gibsen, Off, Engl), and the same 18-IR cabinet table as GxCabinet. The tube stage is not a waveshaper — each tube type (12AX7, 12AU7, 12AT7, 6V6, 6DJ8, 6C16, 6L6CG, EL34, 12AY7, JJECC83S, JJECC99, EL84, EF86, SVEL34) has two precomputed 1-D lookup tables derived from SPICE simulation of the characteristic curves, indexed by grid-to-cathode voltage and linearly interpolated.

PreGain, Drive, Distortion, Master, Bass, Middle, Treble, Presence, Cabinet, plus Model and Tonestack selections — all live, all RT-safe, no model reload. The integrated plugin resamples the 96 kHz Faust design rate to the host rate via `gx_resample::FixedRateResampler`. `GxAmplifier-Stereo-X` (`gx_amp_stereo.lv2`) is the stereo build — same engine, two channels.

| Model | Tonestack | Cab Model | PreGain | Master | Presence |
|-------|-----------|-----------|--------|--------|----------|
| 12ax7 | Bassman | 4x12 | 0.5 | 0.5 | 0.5 |

Use it when you want to turn knobs and hear the amp respond. The 18 tube models include combinations (pre 12ax7 / push-pull 6V6, etc.) that do not correspond to any production amp — NAM can only capture amps that exist; the modeled amp can be a sound no real amp makes.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Our pick (cabinet only): GxCabinet

<img src="{{ '/assets/images/plugin-amp-gxcabinet.png' | url }}" alt="GxCabinet" class="plugin-screenshot">

GxCabinet is not a static cabinet model — it is a partitioned-block convolution reverb running on 18 embedded cabinet IRs (68 to 1000 taps at 48 kHz, sourced from `cab_data_table.cc`). The three tone knobs (`Cabinet` level 0.5–5, `Bass` −10…+10, `Treble` −10…+10) do not post-EQ the convolver output — they pre-shape the IR itself, via `Impf::compute()` in `cabinet_impulse_former.h`, a Faust-generated two-band shelving filter applied to the IR coefficients before the convolution kernel is loaded. When you tweak a knob, a worker thread recomputes the shaped IR and swaps it into the convolver. There is no per-sample tone filter in the audio path; the tone controls cost nothing at runtime.

The bass shelf corner is ~300 Hz, the treble shelf corner ~2400 Hz, Q = 1.414 (Butterworth). The 18 embedded cabs: 4x12, 2x12, 1x12, 4x10, 2x10, HighGain, Twin, Bassman, Marshall, AC30, Princeton, A2, 1x15, Mesa, Briliant, Vitalize, Charisma, 1x8. Most are stylized; the named ones are guitarix's own captures of those styles, not licensed IR packs.

| Cab Model | Cabinet | Bass | Treble |
|-----------|---------|------|--------|
| 4x12 | 1.0 | 0 | 0 |

Use it after a NAM amp-only capture, after a preamp plugin, or anywhere you want a cabinet without managing IR files. The 8-occurrence count in shared pedalboards says this is what most builders do.

## Also great: Neural Amp Modeler (NAM)

<img src="{{ '/assets/images/plugin-amp-nam.png' | url }}" alt="Neural Amp Modeler" class="plugin-screenshot">

NAM (Mike Oliphant) is the only NAM player on the device. It loads A1 `.nam` files in four sizes (Standard 16×8, Lite 12×6, Feather 8×4, Nano 4×2 — all with dilations 1…512 over two layers) and A2 files in two channel widths (Lite 1×3, Full 1×8, both with 23 dilations up to ~1000). It also loads RTNeural keras JSON for AIDA-X / GuitarML LSTM and GRU models (seven static LSTM sizes: 1×8, 1×12, 1×16, 1×24, 2×8, 2×12, 2×16). A2 slimmable composite files pack multiple sub-models into one `.nam` and the `Quality` port (0.0–1.0) selects which runs; the loader prewarms all sub-models so quality switching is RT-safe.

Four controls: `Input` (pre-model gain, dB), `Output` (post-model volume, dB), `Quality` (sub-model selector for A2), `Model` (atom:Path — the `.nam` file). Mono audio in/out. The plugin implements LV2 State and Worker — model loads happen off the audio thread. NAM models embed their training sample rate in the JSON; if the host rate differs and is an integer multiple, the loader scales dilation sizes to match. If the host rate is not an integer multiple of the model rate, the model loads but runs at the wrong effective rate — the plugin does not resample. pi-Stomp runs JACK at 48 kHz, so community models load at their training rate. The capture workflow enforces it (see [Using NAM]({{ '/using/nam/' | url }})).

A NAM amp-only capture needs an IR after it (the README is explicit). Pair with GxCabinet, with a generic IR loader (`IR loader cabsim` from mod-audio, `Cabinet Loader` from mod.audio), or with a custom IR file.

| Input (dB) | Output (dB) | Quality | Model |
|------------|-------------|---------|-------|
| 0 | 0 | 0.5 (A2 lite) | (path to .nam) |

**What you give up vs. a modeled amp:** no knob-per-control. A NAM capture is a fixed instance of one amp at one setting (or one knob sweep, for slimmable models) — you cannot turn a "Drive" knob and hear the amp break up further, you load a different capture. Fixed sample rate. No on-plugin tonestack; the tonestack is baked into the capture. No on-plugin cabinet; you supply the IR. CPU is the budget to plan against: the per-device ceiling in [Using NAM]({{ '/using/nam/' | url }}) is roughly 10 lighter-architecture instances on v3 (Pi 5) and 4 on v2 (Pi 4). The A2 Lite architecture is cheaper than A1 Standard by construction (1 layer vs 2, channels 3 vs 16); the CMake flag `MULTIFRAME_8X8_CONVOLUTION` (defaulting to 8 on Pi 5's 256-bit SIMD) is the meaningful lever for affordability on the Pi 5.

**When NAM wins:** when you want a specific real amp's sound, not a stylized one. GxAmplifier-X's 18 models are guitarix's stylized takes on 12AX7/6V6/etc. preamps — not captures of a specific Twin Reverb or JCM800. A NAM capture of an actual Twin Reverb tracks the real amp's edge of breakup and its cabinet interaction in a way a stylized model cannot. NAM also captures pedals — a drive pedal capture (Klon, Big Muff) replaces the modeled drives with the real thing.

## Also great: C\* AmpVTS

<img src="{{ '/assets/images/plugin-amp-ampvts.png' | url }}" alt="C* AmpVTS" class="plugin-screenshot">

C\* AmpVTS (Tim Goetze, after David Yeh for the tonestack) is what the descriptor calls "Idealised guitar amplification" — not a model of a specific amp. The signal path: input HPF → preamp gain → tonestack (9 real R/C network simulations: Bassman 5F6-A, Princeton AA1164, Mesa Dual Rectifier "Orange", Vox "top boost", JCM-800 Lead 100 2203, Twin Reverb AA270, H&K Tube 20, Roland Jazz Chorus, Pignose G40V) → bias offset → 2×/4×/8× oversample → 5th-order symmetric polynomial preamp waveshaper → DC blocker → lowpass → `atan()`-shaped symmetric power-amp waveshaper → downsample → DC blocker 2 → RMS compressor → makeup. Both waveshapers are symmetric (one polynomial per polarity, no separate up/down tables) — not a circuit simulation, a stylized amp model with real tonestack simulations.

**What you give up:** no cabinet. Use a separate cab plugin after it (GxCabinet, C\* CabinetIII, C\* CabinetIV, or an IR loader). The oversampling multiplies per-sample cost; at 8× on a Pi 5 it is audible but not catastrophic — still cheaper than any NAM architecture. The waveshapers are symmetric, so they produce only odd harmonics — a real tube amp's asymmetric transfer produces even harmonics too. For the same reason as Valve saturation below, this is a colour stage that reads as "amp-ish" rather than a model of a specific tube behaviour.

## Also considered

### Cabinet plugins

**C\* CabinetIII** — 17 cabs as 31st-order IIR filters, no convolver. Zero partitioned-convolution cost. Also great if CPU matters and you want a cab character without the IR fidelity.

**C\* CabinetIV** — newer cabs as IIR + FIR hybrid, oversampled for ≥96 kHz. Also great for more modern voicings than CabinetIII.

**IR loader cabsim** (mod-audio, `moddevices.com/plugins/mod-devel/cabsim-IR-loader`) and **Cabinet Loader** (mod.audio, `MOD-CabinetLoader.lv2`) — generic IR loaders if you have your own IR file. Useful but you supply the IR.

**Cabinet** (VeJa cabsim) — source not located; topology cannot be verified. Skip editorially until a repo surfaces.

### Saturation / colour (the "tube" tag used as a colour stage)

**TAP Tubewarmth** (Tom Szilagyi) — a piecewise waveshaper with separate positive and negative paths using different coefficients, so the saturation is asymmetric rather than symmetric. Two knobs (Drive 0.1–10, Blend −10…+10). The final stage is a ~1.6 Hz DC blocker. The "tape" half of the name is aspirational — no tape hysteresis or HF compression. Use it after a clean amp sim to add harmonics.

<img src="{{ '/assets/images/plugin-amp-tubewarmth.png' | url }}" alt="TAP Tubewarmth" class="plugin-screenshot">

| Drive | Blend |
|-------|-------|
| 2 | +3 |

**Valve saturation** (Steve Harris, after Ragnar Bendiksen's thesis) — a single-valve-style exponential saturator (`x / (1 - e^{-k x})`), symmetric, two knobs (Distortion level 0–1, Distortion character mapped to `dist = dist_p × 40 + 0.1`). The plugin's own description is honest about the limitation: "lacking some of the harmonics you would get in a real tube amp." A symmetric shaper produces only odd harmonics. Simpler voicing, lighter on the highs than TAP Tubewarmth. One-pole DC blocker on output.

<img src="{{ '/assets/images/plugin-amp-valve-saturation.png' | url }}" alt="Valve saturation" class="plugin-screenshot">

| Distortion level | Distortion character |
|------------------|----------------------|
| 0.5 | 0.4 |

### Other neural players

**AIDA-X** (`rt-neural-generic.lv2`) — alternative neural player using RTNeural. Loads `.aidax` / keras JSON models. Zero occurrences in shared pedalboards. NAM's plugin loads the same keras JSON format, so the editorial pick is NAM unless you specifically want the AIDA-X toolchain.

### Skip editorially

**brummer10 `urn:brummer:*` plugins** (PreAmpTubes, PowerAmpTubes, PreAmpImpulses, PowerAmpImpulses) — closed source, no public repo. Cannot verify DSP.

**Amp Profiler** (`faustlv2.bitbucket.io`) — source not located. Same status.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| GxAmplifier-X / GxAmplifier-Stereo-X / GxCabinet | Guitarix team | ISC | [guitarix.sourceforge.net](http://www.guitarix.org/) |
| Neural Amp Modeler | Mike Oliphant | MIT | [github.com/mikeoliphant/neural-amp-modeler-lv2](https://github.com/mikeoliphant/neural-amp-modeler-lv2) |
| C\* AmpVTS | Tim Goetze (tonestack after David Yeh) | GPL-3.0 | [quitte.de/dsp/caps.html](http://quitte.de/dsp/caps.html) |
| C\* CabinetIII / CabinetIV / ToneStack | Tim Goetze | GPL-3.0 | [quitte.de/dsp/caps.html](http://quitte.de/dsp/caps.html) |
| IR loader cabsim | mod-audio | GPL | [github.com/mod-audio/mod-cabsim-IR-loader](https://github.com/mod-audio/mod-cabsim-IR-loader) |
| Cabinet Loader | mod.audio | (proprietary) | [mod.audio](https://mod.audio) |
| TAP Tubewarmth | Tom Szilagyi | GPL-2.0 | [tap-plugins.sourceforge.net](http://tap-plugins.sourceforge.net/index.html) |
| Valve saturation | Steve Harris (after Ragnar Bendiksen) | GPL-2.0 | [plugin.org.uk](http://plugin.org.uk/) |
| AIDA-X | AidaDSP | GPL | [github.com/AidaDSP/AIDA-X](https://github.com/AidaDSP/AIDA-X) |