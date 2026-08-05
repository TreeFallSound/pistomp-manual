---
title: Amp, Cabinet, and Neural Capture
eleventyNavigation:
  parent: editorials
  key: amp-cab-sim
  title: Amp, Cabinet, and Neural Capture
  order: 17
---

# Amp, Cabinet, and Neural Capture

Three different things live on this page, and they are not substitutes for each other.

| | What it is | What you do with it |
|---|---|---|
| **Neural capture** | A trained network that reproduces one real signal chain | Load a capture of the rig you actually want |
| **Modeled amp** | Tube stages, tonestack and cab as live DSP | Turn knobs and hear the amp respond |
| **Cabinet** | Speaker and mic, on its own | Put one after a preamp, or after a capture that has none |

Start with the neural capture. It is the thing the pi-Stomp does that a pedal at this price has no business doing.

## Our pick (neural capture): Neural Amp Modeler

<img src="{{ '/assets/images/plugin-amp-nam.png' | url }}" alt="Neural Amp Modeler" class="plugin-screenshot">

Load a capture of a cranked Twin and it breathes the way the real thing does — the bloom as you dig in, the tightening as you roll the volume back. A modeled amp is somebody's stylized take on a 12AX7 front end. A capture is the specific amp, in the specific room.

A capture is of a *signal chain*, not of an amp. People capture pedals, preamps, heads, head-and-cab together, a fuzz into an amp, or a whole rig with a mic in front of it. Whatever was on the far end of the sweep is what you load, which is why the first question about any capture is what it already includes — a head-only capture sounds thin and buzzy until you put a cabinet after it, and a full-rig capture sounds smothered if you do.

NAM (Mike Oliphant) is the only NAM player on the device. Architecture decides CPU cost:

| Format | Sizes |
|--------|-------|
| A1 `.nam` | Standard 16×8, Lite 12×6, Feather 8×4, Nano 4×2 — dilations 1…512 over two layers |
| A2 `.nam` | Lite 1×3, Full 1×8 — 23 dilations up to ~1000 |
| RTNeural keras JSON | AIDA-X / GuitarML LSTM and GRU, seven sizes from 1×8 to 2×16 |

Four controls: `Input` and `Output` gain in dB, `Quality`, and `Model`. Mono in and out. Loading and quality switching both happen off the audio thread, so neither drops audio.

`Quality` looks like a continuous 0–1 knob and is really a two-position switch. At 0.5 and below you get Lite; above 0.5 you get Full. Nothing happens in between, and nothing happens at all unless the loaded file is an A2 slimmable one — those pack both sub-models into a single `.nam`. Set it to 0 or 1 so it's obvious which one is running.

| Input (dB) | Output (dB) | Quality | Model |
|------------|-------------|---------|-------|
| 0 | 0 | 1 (Full) | (path to .nam) |

Models carry their training rate and the plugin does not resample, so a mismatch runs the model at the wrong effective rate. pi-Stomp runs at 48 kHz, where community models are trained, and the on-device capture refuses any other rate. See [Using NAM]({{ '/using/nam/' | url }}).

**What you give up:** knobs. A capture is one rig at one setting — you don't dial in more break-up, you load a different capture. And CPU is a budget you plan against: roughly 10 lighter-architecture instances on v3, 4 on v2. A2 Lite is cheaper than A1 Standard by construction, 1 layer against 2 and 3 channels against 16.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Our pick (modeled): GxAmplifier-X

<img src="{{ '/assets/images/plugin-amp-gxamplifier-x.png' | url }}" alt="GxAmplifier-X" class="plugin-screenshot">

Where a capture is fixed, this one moves. Wind the Drive up and the amp gets meaner under your hands — the thing you give up the moment you commit to a capture.

GxAmplifier-X (guitarix team) is a whole rig in one instance: preamp, tonestack, cabinet. The tube stage is not a waveshaper — each tube type carries two lookup tables derived from SPICE simulation of its characteristic curves, indexed by grid-to-cathode voltage. That is why it answers to how hard you play rather than just clipping harder.

| Stage | Choices |
|-------|---------|
| Preamp | 12AX7, 12AU7, 12AT7, 6V6, 6DJ8, 6C16, 6L6CG, EL34, 12AY7, JJECC83S, JJECC99, EL84, EF86, SVEL34 — 18 models in all |
| Tonestack | 28: Bassman, Twin, Princeton, JCM-800, JCM-2000, M-Lead, M2199, AC-30, SOL 100, Mesa, JTM-45, AC-15, Peavey, Ibanez, Roland, Ampeg, Rev.Rocket, MIG 100 H, Triple Giant, Trio, H&K, Fender Junior, Fender, Fender Deville, Gibsen, Engl, Off |
| Cabinet | The same 18 IRs as GxCabinet |

Every control is live and RT-safe, including the model and tonestack selectors — no reload, so you can hunt for a voicing while playing. `GxAmplifier-Stereo-X` is the same engine in stereo.

| Model | Tonestack | Cab Model | PreGain | Master | Presence |
|-------|-----------|-----------|--------|--------|----------|
| 12ax7 | Bassman | 4x12 | 0.5 | 0.5 | 0.5 |

Some of the 18 tube models are combinations no production amp used — a 12ax7 front end into push-pull 6V6, and others. A capture can only reproduce an amp that exists; this can be a sound no amp ever made.

## Our pick (cabinet only): GxCabinet

<img src="{{ '/assets/images/plugin-amp-gxcabinet.png' | url }}" alt="GxCabinet" class="plugin-screenshot">

Reach for this the moment a head-only capture sounds thin and buzzy. It is missing its speaker, and this is the speaker.

A partitioned-block convolver running 18 embedded IRs (68 to 1000 taps at 48 kHz): 4x12, 2x12, 1x12, 4x10, 2x10, 1x15, 1x8, HighGain, Twin, Bassman, Marshall, AC30, Princeton, A2, Mesa, Briliant, Vitalize, Charisma. The named ones are guitarix's own captures of those styles, not licensed IR packs.

The three tone knobs — `Cabinet` level 0.5–5, `Bass` and `Treble` ±10 — don't EQ the output. A worker thread reshapes the IR itself before loading it into the kernel, with a two-band shelf at ~300 Hz and ~2400 Hz, Butterworth Q = 1.414. Nothing filters the audio path, so the tone controls cost nothing at runtime.

| Cab Model | Cabinet | Bass | Treble |
|-----------|---------|------|--------|
| 4x12 | 1.0 | 0 | 0 |

Put it after a capture with no cab, after a preamp plugin, or anywhere you want a cabinet without managing IR files. It appears in 8 shared pedalboards, more than any other cab plugin here.

## Also great: C\* AmpVTS

<img src="{{ '/assets/images/plugin-amp-ampvts.png' | url }}" alt="C* AmpVTS" class="plugin-screenshot">

Open and a little generic — an amp-shaped sound rather than a particular amp. Reach for it when you want the tonestack more than the character.

C\* AmpVTS (Tim Goetze, tonestack after David Yeh) calls itself "idealised guitar amplification" and means it. Its nine tonestacks are real R/C network simulations — Bassman 5F6-A, Princeton AA1164, Mesa Dual Rectifier, Vox top boost, JCM-800 2203, Twin Reverb AA270, H&K Tube 20, Jazz Chorus, Pignose G40V — but the gain stages either side of them are stylized: a 5th-order polynomial preamp shaper and an `atan()` power-amp shaper, at 2×, 4× or 8× oversampling.

**What you give up:** a cabinet, so put one after it. Both shapers are symmetric — odd harmonics only, where a real tube stage is asymmetric and gives you even harmonics too. That is the audible difference between this and the picks above, and why it reads as amp-ish rather than as an amp. Oversampling multiplies per-sample cost, though even 8× stays cheaper than any NAM architecture.

## Also considered

### Cabinets

**C\* CabinetIII** — 17 cabs as 31st-order IIR filters, no convolver at all. Reach for it when CPU is tight and cab character matters more than IR fidelity.

**C\* CabinetIV** — IIR and FIR hybrid, oversampled for 96 kHz and up. More modern voicings than CabinetIII.

**IR loader cabsim** (mod-audio) and **Cabinet Loader** (mod.audio) — generic loaders for when you have your own IR file.

### Saturation and colour

Two "tube"-tagged plugins that are colour stages, not amps. Put either after a clean amp sim.

#### TAP Tubewarmth

<img src="{{ '/assets/images/plugin-amp-tubewarmth.png' | url }}" alt="TAP Tubewarmth" class="plugin-screenshot">

The better of the two, because it is genuinely asymmetric — separate positive and negative paths with different coefficients, so you get even harmonics as well as odd. Two knobs, Drive 0.1–10 and Blend ±10, and a ~1.6 Hz DC blocker on the way out. The "tape" half of the name is aspirational; there is no hysteresis and no HF compression.

| Drive | Blend |
|-------|-------|
| 2 | +3 |

#### Valve saturation

<img src="{{ '/assets/images/plugin-amp-valve-saturation.png' | url }}" alt="Valve saturation" class="plugin-screenshot">

A single exponential saturator, `x / (1 - e^{-k x})`, symmetric — odd harmonics only. The plugin's own description admits it, "lacking some of the harmonics you would get in a real tube amp." Simpler and lighter on the highs than TAP Tubewarmth, which is occasionally what you want.

| Distortion level | Distortion character |
|------------------|----------------------|
| 0.5 | 0.4 |

### Other neural players

**AIDA-X** (`rt-neural-generic.lv2`) — loads `.aidax` and keras JSON via RTNeural. Zero occurrences in shared pedalboards, and NAM's plugin reads the same keras JSON, so pick it only if you specifically want the AIDA-X toolchain.

### No public source

These ship on the device, but their DSP is closed, so we can't tell you what they do or rank them honestly. Try them if you like — we can't vouch for them.

**brummer10 `urn:brummer:*`** (PreAmpTubes, PowerAmpTubes, PreAmpImpulses, PowerAmpImpulses), **Amp Profiler** (`faustlv2.bitbucket.io`), and **Cabinet** (VeJa cabsim).

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| GxAmplifier-X / GxAmplifier-Stereo-X / GxCabinet | Guitarix team | ISC | [guitarix.org](http://www.guitarix.org/) |
| Neural Amp Modeler | Mike Oliphant | MIT | [github.com/mikeoliphant/neural-amp-modeler-lv2](https://github.com/mikeoliphant/neural-amp-modeler-lv2) |
| C\* AmpVTS | Tim Goetze (tonestack after David Yeh) | GPL-3.0 | [quitte.de/dsp/caps.html](http://quitte.de/dsp/caps.html) |
| C\* CabinetIII / CabinetIV / ToneStack | Tim Goetze | GPL-3.0 | [quitte.de/dsp/caps.html](http://quitte.de/dsp/caps.html) |
| IR loader cabsim | mod-audio | GPL | [github.com/mod-audio/mod-cabsim-IR-loader](https://github.com/mod-audio/mod-cabsim-IR-loader) |
| Cabinet Loader | mod.audio | (proprietary) | [mod.audio](https://mod.audio) |
| TAP Tubewarmth | Tom Szilagyi | GPL-2.0 | [tap-plugins.sourceforge.net](http://tap-plugins.sourceforge.net/index.html) |
| Valve saturation | Steve Harris (after Ragnar Bendiksen) | GPL-2.0 | [plugin.org.uk](http://plugin.org.uk/) |
| AIDA-X | AidaDSP | GPL | [github.com/AidaDSP/AIDA-X](https://github.com/AidaDSP/AIDA-X) |
