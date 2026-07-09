# rakarrack LV2 Suite — 43 Plugins, and Whether Any Beat gxts9 for the Stacked-Boost Role

This doc characterises the `rkr` / `rkr-labs` bundle (43 plugins, upstream `ssj71/rkrlv2`) at the source level, with the same question docs 03/12/13 answer: does anything here displace `gxts9.lv2` as the low-drive midrange boost stacked in front of a fuzz on a Pi? The short answer is no, and the architecture says why. The longer answer characterises the whole suite.

### Methodology

Cloned the upstream at `github.com/ssj71/rkrlv2` (verified live with `git ls-remote`; HEAD `0e6d6e0`, "fix-msse-on-aarch64", a shallow single-commit checkout — so per-commit history is not available to me). Read the actual DSP `.C`/`.h`, not the descriptions:

- `src/StompBox.C` (all 948 lines) and `src/Waveshaper.C` (575 lines) — the two files that define StompBox and Fuzz. Every mode's filter table is in `StompBox::init_mode` (lines 373–773); every transfer function is the `switch(type+1)` in `Waveshaper::waveshapesmps` (lines 141–565).
- `src/Distorsion.C` (433 lines), `src/NewDist.C`, `src/MBDist.C`, `src/Valve.C` (transfer at lines 127–230), `src/Exciter.C` — the rest of the distortion family.
- `src/AnalogFilter.*` (the biquad class every "tone" stage uses), `src/Resample.*` (the sinc oversampler), and the effect sources for the standouts: `Echotron.C`, `Reverbtron.C`, `DynamicFilter.C` (MuTroMojo), `Vocoder.C`, `Infinity.C`, `Sequence.C`, `Shuffle.C`, `Vibe.C`, `CoilCrafter.C`, `Sustainer.C`, `Convolotron.C`.
- `lv2/rkrlv2.C` — the LV2 wrapper, to map each `doap:name` to its C++ class and confirm what each URI actually instantiates. This is where the central finding surfaced (line 2977).
- The installed bundles `~/lv2/rkr.lv2` and `~/lv2/rkr-labs.lv2` (43 `.ttl` each), diffed against the clone.
- `README`, which states the fork point: rakarrack "version 6.1 (git commit `7dba0c4`)".

Cross-checked against `src/_data/plugins.json` (43 entries, all bundle `rkr-labs.lv2`, all `category: null`, all `uri` pointing at `rakarrack.sourceforge.net/effects.html#…` anchors) and docs 03/12/13. Where a fact is inferred rather than read from source, it is labelled.

**Provenance, established up front.** rakarrack's effects descend from two lineages, and the file headers name them: the ZynAddSubFX synthesizer (`Waveshaper.C`, `Distorsion.C`, `Shuffle.C` all carry "ZynAddSubFX … Copyright Nasca Octavian Paul") and Steve Harris's swh-plugins LADSPA set (`Valve.C` "based Steve Harris valve LADSPA", `CoilCrafter.C` "Based in Steve Harris LADSPA Plugin harmonic_gen"). These are **synth and utility DSP adapted for guitar**, not circuit models. That is the frame for everything below.

---

## 1. StompBox — what it actually is

### The 8 modes

Read from `StompBox::setpreset` (line 853) and the `switch(Pmode)` in `init_mode` (line 410) and `out` (line 150):

| # | Mode | Modelled after | Clipper type used (Waveshaper case) |
|---|---|---|---|
| 0 | Odie | generic tube pedal | Valve 2 ×2 (case 29) |
| 1 | Grunge | a "grunge pedal" schematic | Op-amp limit (25) + Hard comp (24) |
| 2 | Rat | ProCo RAT | Op-amp limit (25) + Hard comp (24) |
| 3 | Fat Cat | Fat Cat distortion | Op-amp limit (25) + Hard comp (24) |
| 4 | Dist+ | MXR Distortion+ | Op-amp limit (25) + Diode clipper (30) |
| 5 | Death Metal | a death-metal pedal | Op-amp limit (25) + Hard comp (24) |
| 6 | Metal Zone | Boss Metal Zone | Op-amp limit (25) + Hard comp (24) |
| 7 | Classic Fuzz | Big Muff-ish fuzz | Compression (20) + JFET (26) |

**None of the 8 is a Tube Screamer or TS-adjacent.** There is no op-amp-feedback soft-clip mode, no SD/TS/Klon voicing. The closest overdrive is "Odie" (a generic dual-valve voice). So StompBox cannot fill doc 03's role by mode selection — the role's circuit is simply not one of the eight.

### Is it "physically informed"? No — it is a filter bank around static waveshapers.

The architecture, identical for every mode, is: a bank of **biquad tone filters** (`AnalogFilter`, an RBJ-style analog-modelled biquad — LPF/HPF/peak/notch selected by an integer `type`) arranged pre- and post- a **static, memoryless waveshaper** run with 1–12× sinc oversampling. Each mode is nothing but a different table of filter corners, Q's and gain constants poured into that fixed structure by `init_mode`. Concretely, mode 2 "Rat" (line 500):

- `linput` LPF 5000 Hz → two parallel gain-boost HPFs (`pre1` 60 Hz ×268, `pre2` 1539 Hz ×3000) summed back in — this is a feed-**forward** pre-emphasis, not a feedback network;
- `rwshape` case 25 "Op-amp limiting" (a dynamic-threshold compressor, `dthresh` chases the envelope — soft limiting, not a diode);
- 6 kHz anti-alias LPF;
- `rwshape2` case 24 "Hard compression" (same compressor, harder ratio);
- a three-band tone mixer (low/mid/high peaking biquads summed with user gains).

Against the four things doc 03 asked me to look for:

| Test | StompBox |
|---|---|
| Pre-clip high-pass near 720 Hz (TS mid-hump) | **No.** 720 Hz appears only as a *post*-clip LPF (`lpost`, line 44) and a mid *peak* tone band — tone shaping, not the TS pre-clip HPF. Pre-clip HPFs are per-mode and elsewhere (60 Hz, 630 Hz, 708 Hz…). |
| Feedback-loop vs feed-forward clipping | **Feed-forward everywhere.** Every mode filters, then waveshapes, then filters. No mode subtracts a nonlinear function of the output from the input (the `x - f(x)` op-amp-feedback form `gxts9` uses). |
| Symmetric vs asymmetric transfer | Mode-dependent. Most clippers are symmetric; the "Valve"/"JFET"/"Diode" cases carry a fixed bias so they are mildly asymmetric; Classic Fuzz adds explicit asymmetry via `fabs()` (line 330). Not a diode-pair asymmetry — a bias offset. |
| Any diode equation solved | **No.** The "Diode clipper" (case 30) is the closed form `1 − 4^(−ws·x)` per half — a static exponential curve, evaluated once per sample. No `Is·(exp(D/mUt)−…)`, no `brentq`, no iteration. The "Valve" cases (28/29) are closed-form 3/2-power-law plate-current curves (Child-Langmuir-flavoured), again static per sample with a one-pole `dyno` envelope for bias drift — not a circuit solve. |

So "physically informed" is **loose**: the *transfer curves* are physics-motivated closed forms (a tube's 3/2 power law, a diode's exponential), and the *filter corners* are hand-fitted to real schematics per the code comments. But nothing solves a circuit. It is a static waveshaper with per-mode coefficient tables — exactly the class doc 12 built itself around. It is a good-sounding multi-mode dirt box; it is not a model in the `gxts9`/ChowCentaur sense.

### Fuzz IS StompBox

`rkr StompBox:Fuzz` is not a separate DSP. `init_stomp_fuzzlv2` (`lv2/rkrlv2.C:2977`) instantiates the **same `StompBox` class** and calls `changepar(5, 7)` — it is StompBox permanently locked to mode 7, Classic Fuzz, with the mode selector removed. The description's "several popular Fuzz pedal schematics … the sound of an era" describes one preset of one plugin. Everything in §1 applies to it verbatim; its clipper is Compression (case 20) into JFET (case 26), tone-stacked through a Big-Muff-style low/high blend (line 353).

---

## 2. The rest of the distortion family

All share the `Waveshaper` engine and/or `AnalogFilter` biquads. None is a circuit model.

| Plugin | Class | What it is |
|---|---|---|
| **rkr Distorsion** | `Distorsion.C` | The straight ZynAddSubFX distortion: pick one of ~30 static waveshaper types (`Ptype`), pre/post LPF+HPF, optional octave-up (sign-flip on zero-crossing, line 187), DC block. User-facing waveshaper zoo — no fixed voice. |
| **rkr Derelict** | `NewDist.C` | Same ZynAddSubFX waveshaper set (`waveshapesmps(…, Ptype, …, 2)`), same octave trick. A second flavour of the selectable static distortion, tuned differently. Not a specific pedal. |
| **rkr DistBand** | `MBDist.C` | Three-band crossover, an **independent** selectable waveshaper per band (`PtypeL/M/H`, three `Waveshaper` objects per channel). Multi-band distortion — six oversampled waveshapers in stereo. The most CPU-hungry of the group. |
| **rkr Valve** | `Valve.C` | Steve Harris's swh valve function `x / (1 − 2^(−dist·x))` with a bias offset `q` (asymmetric) and a leaky-integrator DC block (line 189), fed by a `HarmEnhancer` front end. Closed-form valve saturation, not a triode solve. Genuinely asymmetric via bias. |
| **rkr Exciter** | `Exciter.C` | Not a distortion at all — a `HarmonicEnhancer` (highpass → harmonic generation → mix). An aural exciter / presence booster. |

**Bottom line for the family:** every dirt plugin here is a static waveshaper (optionally selectable, optionally multi-band, optionally oversampled) wrapped in biquad EQ. That is a legitimate and often good-sounding approach — but it is the same class doc 12 catalogued as "not the real pedal," and none of them carries the op-amp-feedback + 720 Hz pre-clip topology that defines the Tube Screamer role.

---

## 3. Verdict against doc 03's role

**`gxts9.lv2` stays the pick. Nothing in the rakarrack suite displaces it, and StompBox/Fuzz is not close.** Three findings drive it:

1. **StompBox has no Tube Screamer.** Its eight modes are Odie, Grunge, Rat, Fat Cat, Dist+, Death Metal, Metal Zone, Classic Fuzz (§1). The role's circuit — an op-amp-feedback soft clipper with a 720 Hz pre-clip mid-hump — is not among them. You cannot dial the role in; it isn't there.

2. **The architecture rules out the mechanism, not just the preset.** `gxts9` earns the role by *being* the TS topology: `x − ts9nonlin(HPF(x))`, a feedback-loop clipper behind a computed 720.5 Hz high-pass, valid at any level because it solves the diode equation. StompBox is feed-forward filter → static waveshaper → filter, with its one 720 Hz filter sitting *after* the clipper as tone shaping. Even the "Diode" and "Valve" cases are static closed-form curves, not a solved circuit — so the level-dependent feedback-clip character that lets a Tube Screamer *tighten* a fuzz is architecturally absent. This is the same distinction doc 03 used to reject `gx_overdriver` (feed-forward waveshaper, no mid-hump).

3. **Cost is wrong-way-round.** StompBox runs **stereo dual chains** (separate L/R filter banks and four `Waveshaper` objects) with sinc oversampling on every waveshaper, for a voice that isn't the one you want. `gxts9` is a handful of biquads plus one table lookup, mono, no oversampling. On a Pi core shared with a fuzz, a delay and a reverb, you would pay more CPU than `gxts9` to get *further* from the target tone.

If someone specifically wants a rakarrack dirt in the chain, `rkr Valve` (genuine bias asymmetry, harmonic front end) or StompBox "Odie" are the most overdrive-like voices — but as *colour*, not as the TS mid-push. For the front-of-fuzz role, keep `gxts9`: Drive ~0.25, Level near unity, Tone ~400 Hz, before the fuzz.

---

## 4. The other 36 plugins — suite-level survey

rakarrack is a full multi-FX rack; the dirt is a small slice. Characterisation by family, with what's worth attention and what's already beaten on the image.

| Family | Plugins | DSP class | Verdict on a pi-Stomp |
|---|---|---|---|
| Reverb | Reverb, **Reverbtron**, Infinity, Echoverse | Reverb: comb/allpass network. Reverbtron: block **convolution** against loaded `.rvb` impulse tables. | Reverbtron is a genuine convolution reverb (real IRs, CPU-heavy). Interesting but heavy; a dedicated convolution/algorithmic reverb on the image likely wins on tuning. |
| Delay | Echo, Musical Delay, **Echotron**, Echoverse | Fractional `delayline` taps; Echotron adds LFO-modulated multi-tap driven by loadable `.dly` pattern files. | Echotron is the standout: rhythmic multi-tap patterns with modulation, hard to reproduce with a plain delay. Worth attention. |
| Pitch | Harmonizer, Harmonizer(no-midi), Shifter, StereoHarmonizer, **Sequence** | **FFT phase-vocoder** (`smbPitchShift`, `mayer_fft`) — see CPU note. Sequence layers a pitch-stepped arpeggiator over a delay. | Functional but FFT-expensive and artefact-prone on transients. Sequence is the novel one (a pitch/step sequencer) if you want that trick and have headroom. |
| Filter / Wah | WahWah, **MuTroMojo** (DynamicFilter), Synthfilter, VaryBand | Envelope- and LFO-driven state-variable filters. | MuTroMojo is a proper envelope-following auto-wah (Mu-Tron voice) — genuinely useful and cheap. Recommend. |
| Modulator / Trem | OpticalTrem, **Vibe**, Ring, Pan | Vibe: photocell-modelled uni-vibe (LFO drives a variable "resistance", `Vibe.C`). Ring: ring mod. | Vibe is a credible uni-vibe and worth a look; the rest are standard. |
| Chorus / Flange | Flanger/Chorus, Dual Flange, AlienWah, Analog Phaser, Phaser | LFO-modulated delay / allpass chains. AlienWah is the Zyn "alienwah". | Fine, unremarkable; competitive equivalents exist on the image. |
| Filter-EQ util | EQ, Parametric EQ, Shelf Boost, **Coil Crafter**, Cabinet | Biquad EQ. Coil Crafter: fixed peaking filters at guitar pickup formant freqs (4000/4400/4200/2900 Hz…) — a pickup-voicing EQ, from Steve Harris `harmonic_gen`. | Coil Crafter is a neat single-purpose tool (fake a different pickup); the EQs are ordinary. |
| Dynamics | Compressor, CompBand, Expander, NoiseGate, **Sustainer** | Envelope compressors; Sustainer is a fixed-ratio "one-knob" sustain comp. | Sustainer is convenient (one control), but any full-featured compressor on the image beats it. |
| Spatial | **Shuffle**, Pan | Shuffle: Blumlein stereo "shuffler" — band-split then width-shape (despite a copy-pasted "Distorsion" header). | Niche stereo-width tool; mono guitar rig rarely needs it. |
| Special | **Vocoder**, Arpie | Vocoder: analysis/synthesis **filterbank vocoder**, needs a carrier via the aux input. Arpie: MIDI arpeggiator. | Vocoder works but requires routing a carrier — awkward on pi-Stomp, and CPU scales with band count. |

### CPU flags (from source, part of the verdict)

- **FFT pitch shifting** — Harmonizer, StereoHarmonizer, Shifter, Sequence all call `smbPitchShift` over `mayer_fft`. An FFT + overlap-add per block, per voice: the heaviest class in the suite. Budget carefully on a shared Pi core.
- **Convolution** — Reverbtron and Convolotron convolve against loaded impulse tables; cost scales with IR length.
- **Oversampling** — every `Waveshaper` runs 1–12× sinc up/down-sampling (`Resample`, `Waveshaper.C:97`). StompBox instantiates four per instance; DistBand six; and all distortion runs stereo dual chains. The dirt plugins are pricier than their simplicity suggests.
- Vocoder cost scales linearly with band count (`VOC_BANDS`).

**Genuinely worth a musician's attention:** Echotron (pattern multi-tap delay), MuTroMojo (envelope auto-wah), Vibe (uni-vibe), Reverbtron (convolution reverb, if CPU allows), Coil Crafter (pickup voicing), Sequence (pitch step-sequencer, novelty). **Superseded / skip on the image:** the plain reverbs, EQs, choruses, compressors, and the FFT harmonizers — better-tuned or cheaper equivalents already ship.

---

## 5. Two builds: `rkr.lv2` vs `rkr-labs.lv2`

Both installed bundles ship the same 43 URIs and identical port layouts. Differences found:

| | `rkr.lv2` | `rkr-labs.lv2` |
|---|---|---|
| `rkrlv2.so` size | 429,696 B (May 2022) | 649,368 B (Aug 2022) |
| Distortion `doap:name` | "rkr Distortion" | "rkr Distorsion" |
| In `plugins.json` | — | this bundle (wins the version tie) |

Both are builds of the **same upstream** (`ssj71/rkrlv2`). The clone's current HEAD spells it "rkr Distorsion" — matching `rkr-labs`. I could not pin either build to an exact commit: the checkout is shallow (one commit, no history), so I cannot diff revisions or date the "Distortion"→"Distorsion" TTL change. **What I can say from source:** the DSP `.C`/`.h` are one codebase; the two builds differ in the TTL metadata spelling and in binary size (the larger Aug build is consistent with more symbols/less stripping, or a newer compile — not a different DSP). I found **no evidence of a DSP difference** between them, and I did not disassemble the `.so` to prove byte-level equivalence. If it matters, diff a decompiled `.so` on-device; from the source tree they are the same effects.

---

### Data note

Added all 43 rkr entries to `src/_data/plugins-source.json`, keyed off the `uri`/`bundle` (`rkr-labs.lv2`) in `plugins.json`, `source_url: https://github.com/ssj71/rkrlv2` — verified live with `git ls-remote` (HEAD `0e6d6e0`). No entries existed before.
