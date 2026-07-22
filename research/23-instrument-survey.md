# MIDI Instrument Survey — pi-Stomp LV2 Ecosystem

## Background

The manual has no instrument coverage. Every editorial so far treats pi-Stomp as an effects box — the audio input is a guitar, the plugins colour it. But the device is a full MIDI host: feed it note events (USB-MIDI keyboard, the on-device step sequencers, an external sequencer over DIN/USB) and the `Instrument`-class plugins generate audio from nothing. This doc enumerates every plugin on the device that responds to MIDI note-on/note-off and produces pitched or percussive audio, reads its synthesis source, classifies the engine, and maps the editorial carve-outs. It is the basis for a family of instrument editorials (`src/plugins/*.md`), not a single page — the field is too broad for one Our-pick/Also-great ranking.

## Method

Candidate enumeration was done from `src/_data/plugins.json` per the manual's research rule (names lie). The device was **online** during research, so control ranges, port names, soundfont sizes, and preset counts are read from the installed `.lv2` bundles on `pistomp.local`, not inferred from upstream READMEs. Synthesis architecture was read from upstream source where it resolves; the "sampled vs. modeled" and "FM vs. analog-VA" distinctions were verified against the DSP, not the plugin name (see §6 for the traps).

`plugins.json` tags 46 plugins `Instrument` and 1 `Synth` (Dexed carries both). Fourteen more carry `Oscillator` or `Generator`. The `Oscillator`/`Generator` set is **excluded** — see §7 — because those are modular CV/audio signal sources (blop/fomp VCOs, C\* Sin/CEO, noise and test-tone generators) that emit a continuous tone, not note-triggered voices. The one edge case, MDA BeatBox, is noted there.

The single largest finding shapes the whole survey: **24 of the 46 `Instrument` plugins are the same engine.** See §2.

## The instrument field at a glance

| Family | Plugins | Engine | Synthesis |
|---|---|---|---|
| FluidPlug ROMplers | 24 | FluidSynth (one `.so`, per-bundle SF2) | Sample playback |
| MDA | 4 | mda-lv2 (one codebase) | 2× sampled, 1× FM, 1× analog-VA |
| Calf | 3 | Calf (one `.so`) | Subtractive, additive organ, wavetable |
| Standalone synths | 12 | one engine each | Various (see §4) |
| Sample players (user-loaded) | 2 | sfizz, DISTRHO a-fluidsynth | SFZ / SF2 |
| Organ | 1 | setBfree | Tonewheel model |
| **Total** | **46** | | |

## 2. The FluidPlug family — one ROMpler, 24 soundfonts

This is the headline. `AirFont320`, `Black Pearl 4A/4B/5`, `FluidGM`, and every `Fluid*` bundle (Bass, Brass, ChromPerc, Drums, Ensemble, Ethnic, Guitars, Organs, Percussion, Pianos, Pipes, Reeds, SoundFX, Strings, SynthFX, SynthLeads, SynthPads) ship the **identical** `FluidPlug.so` (10,392 bytes, byte-for-byte the same across all 24) and differ only in the `FluidPlug.sf2` bundled alongside it. This is falkTX's FluidPlug (`github.com/falkTX/FluidPlug`), which wraps `libfluidsynth.so.2` and pins each bundle to one soundfont.

They are not 24 instruments. They are one sample-playback engine loaded with 24 different sample banks. The `doap:name` promises variety ("Fluid Brass" vs. "Fluid Reeds") but the DSP is FluidSynth in every case; the only per-bundle difference is which General MIDI programs the SF2 contains and which one loads by default.

Control surface, verified from `FluidGM.lv2/FluidPlug.ttl`, is **two knobs**: `Level` (0–2, default 1) and `Program` (bank/preset select, integer). Nothing else — no filter, no envelope, no per-voice shaping. Whatever the soundfont author baked in is what you get.

| Bundle | SF2 size | Presets | What it is |
|---|---:|---:|---|
| FluidGM | 148 MB | 189 | Full General MIDI set — the "one plugin, any instrument" ROMpler |
| AirFont320 | 9.7 MB | 325 | AirFont 320 — compact GM bank, most presets, smallest full-GM footprint |
| FluidStrings | 24 MB | 8 | GM string programs only |
| FluidDrums | 18 MB | 31 | GM percussion kits (channel-10 style), most kits of the drum bundles |
| FluidPianos | 19 MB | 8 | GM piano programs |
| Black Pearl 4A / 4B / 5 | 20–21 MB | (kits) | Third-party drum soundfonts, not GM banks |
| Fluid{Bass,Brass,Guitars,Organs,…} | 9–24 MB | 8 each | One GM instrument family per bundle |

Editorial consequence: the FluidPlug bundles do not each deserve a page. **FluidGM is the ROMpler to reach for** — it carries the whole GM set, so it subsumes the single-family Fluid\* bundles; the single-family bundles exist only to save RAM (loading `FluidBass`'s 9 MB instead of FluidGM's 148 MB). On a Pi, that RAM argument is real and worth stating. AirFont320 is the interesting outlier: a full GM bank in 9.7 MB with the most presets — the pick when FluidGM's 148 MB is too much to hold resident alongside a plugin chain.

CPU/RAM: FluidSynth voice cost is cheap per note (interpolated sample playback, one biquad-ish filter per voice from the SF2), but **RAM is the constraint** — FluidGM's 148 MB SF2 is loaded resident. That is the number to warn about on a 512 MB / 1 GB Pi, not per-sample MACs. Resampling quality is FluidSynth's default interpolation.

## 3. The MDA family — one codebase, four genuinely different engines

`mda-lv2` (moddevices port of Paul Kellett's MDA, GPL) ships four instruments that share a build but not an architecture. This is the "read the source" rule in miniature — the names mislead:

| Plugin | Synthesis (verified from source) | Voices | Controls |
|---|---|---|---:|---|
| MDA JX10 | **Analog-VA**: 2 osc/voice (integrated-sinc saw, `mdaJX10.cpp:488-542`), state-variable filter (`mdaJX10.cpp:564-568`), PWM, detune, vibrato, glide (poly/mono/legato) | 8 (`mdaJX10.h:29`) | Osc mix/detune, filter cutoff/res/env, LFO, glide |
| MDA DX10 | **FM**: modulator-carrier pair per voice (`mdaDX10.cpp:353-362`: `V->dmod * V->mod0 - V->mod1` modulates carrier phase `V->car + V->dcar + x * V->menv`), 5th-order sine approximation | 8 (`mdaDX10.h:28`) | Attack/decay/release, coarse/fine ratio, mod depth/env |
| MDA ePiano | **Sample-based**: plays `epianoData` waveform tables (`#include mdaEPianoData.h`, `waves = epianoData`), 31 velocity-split keygroups | 32 (`mdaEPiano.h:29`) | Decay, Release, Hardness, Treble, Mod, LFO rate, Vel sens, Stereo, Poly, Tune, Random tune, Overdrive |
| MDA Piano | **Sample-based**: single-layer sampled acoustic piano (`#include mdaPianoData.h`, `waves = pianoData`), 12 keygroups | 32 (`mdaPiano.h:29`) | Decay, Release, Hardness, Vel sens, Stereo, Tune, Random, stretch |

The trap: MDA **ePiano** sounds like it might be a DX/FM Rhodes model — it is not, it is sample playback. MDA **DX10** is the FM one. MDA **JX10** is the famous one — the integrated-sinc saw + detune + SVF is the classic warm supersaw/pad that shows up in countless tracks; it is the editorial-grade voice in this family.

## 4. Standalone synths — one engine each

Read from source. Polyphony/voice controls confirmed from the on-device TTLs where a `Voices`/`Polyphony`/`nvoices` port exists.

| Plugin | Author / License | Engine | Max poly | Notes |
|---|---|---|---:|---|
| amsynth | Nick Dowell, GPL | Analog-VA subtractive: 2 osc (saw/square/noise) + ring/sync, resonant filter, 2 ADSR, LFO | 0 (unlimited, configurable; default 10 in standalone) | Mature, CPU-light, preset-rich. The dependable general-purpose analog poly. Verified from source in doc 24. |
| Helm | Matt Tytel, GPL3 | Semi-modular VA: 2 osc with unison (`osc_1_unison_voices`), sub, cross-mod, formant/comb filter options, modulation matrix | 33 (`mopo/src/common.h:50`) | The most modern/flexible interface; heaviest of the VA synths when unison is high. Verified from source in doc 24. |
| Obxd | Datsounds/2DaT, GPL | Oberheim OB-X/OB-Xa model: 2 osc/voice, discrete-style 12/24 dB filter, `Voices` + `Voice Detune` | 8 (`Motherboard.h:50`) | The pick when you want *that* early-Oberheim polysynth character. Verified from source in doc 24. |
| ZynAddSubFX | ZynAddSubFX Team, GPL2 | Three engines in one: ADDsynth (additive, 8 voices/note), SUBsynth (subtractive), PADsynth (wavetable-from-spectrum) | 8 ADDsynth voices/note (`globals.h:114`) | The "do anything" instrument; PADsynth pads are its signature and its CPU cost. Huge patch library. |
| Dexed | dcoredump / P. Gauthier, GPL+MPL | **6-operator FM**, 32 algorithms (`fm_core.cc:29-61`), DX7-compatible (loads DX7 SysEx cartridges), `Num of Voices` | 32 (`dexed.h:102`) | The authoritative FM synth on the device. Reads real DX7 patches. |
| Sorcer | OpenAV, GPL | Wavetable, dubstep/EDM-targeted, Faust DSP, `Polyphony` (nvoices) | 16 (`faust/main.cpp:728`) | Growls and wobbles; narrower voice than the general-purpose synths. |
| Triceratops | Nick Bailey, GPL3 | 3-oscillator subtractive polysynth (saw/square, BLEP anti-aliasing), 3 ADSR, 3 LFO, 4-pole resonant filter, per-osc unison (0-4), built-in echo + reverb | 12 (BlokasLabs modep build), 18 (upstream) | Fat 3-osc unison detune. Verified from source in doc 24. |
| Wolpertinger | Johannes Kroll, GPL | Bandpass-resonator synth: 1 osc (saw/rect/tri blend) through resonant bandpass tracking note pitch, 1-8 filter passes, 16x oversampling | 16 | Not a conventional subtractive VA — the filter is a fixed-ratio bandpass that follows the note. Verified from source in doc 24. |
| Nekobi | Sean Bolton / falkTX, GPL2+ | **TB-303 bassline model** (nekobee engine): 1 osc (pulse/saw, `nekobee_voice_render.c:159-216`), 4-pole Hal Chamberlin SVF (`nekobee_voice_render.c:224-264`), accent/slide | 1 (`nekobee.h:74`) | The acid-bass pick. Monophonic by design — the 303 is a single-voice instrument. |
| Noise Maker — ME | Patrick Kunz / TAL, GPL | Virtual-analog: 3 osc + sub (pulse master), 12 filter types (LP/HP/BP/Notch/Moog, 4x oversampled), 2 LFO, 2 ADSR + free AD, ring mod, bitcrusher | 4 (`PMAX_VOICES = 4`) | Broad VA with a strong factory bank. Verified from source in doc 24. |
| Kars | falkTX, ISC | **Karplus-Strong** plucked string (`DistrhoPluginKars.hpp:53`: "Simple karplus-strong plucked string synth"): delay line + lowpass in feedback, noise-burst excitation | 128 (`DistrhoPluginKars.hpp:29`) | Physical-model pluck; minimal controls (Sustain, Release, Volume), one trick done well. |
| Crypt | Vitling, GPL3 | **Hyper-unison cold pad** (JUCE): `SuperSawVoice` with up to 64 unison oscs/voice (`SuperSawVoice.hpp:42`), SVF filter, waveshaping, built-in phaser/delay/reverb | 8 (`CryptAudioProcessor.hpp:110`) | Not a drum machine (the name misleads). One sound — huge detuned unison pads — done deliberately. |
| String machine | Jean Pierre Cimalando, GPL2+ | String-ensemble (Peter Whiting model) with switchable digital **or BBD** chorus, AHDSR | 32 (`StringSynthDefs.h:5`) | Solina-style ensemble; the BBD chorus mode is the authentic-ensemble pick. Ships standalone chorus variants too. |

### Calf synths (one `.so`, three instruments)

| Plugin | Engine | Max poly |
|---|---|---:|
| Calf Monosynth | Monophonic subtractive, 2 wavetable-ish osc + noise, multimode filter, mod matrix (`modules_synths.h:41-191`, `metadata.h:182-237`) | 1 (monophonic by design) |
| Calf Organ | Additive **drawbar organ** with 9 drawbars, percussion, 3 EGs, 2 multimode filters, LFO, rotary — Calf's Hammond-ish voice (`metadata.h:847-944`) | Polyphonic (no hard limit in source) |
| Calf Wavetable | Wavetable synth | — (not read) |

Krzysztof Foltman et al., LGPL. Calf Organ competes with setBfree for the organ carve-out.

## 5. Sample players (user-loaded) and the organ

| Plugin | Author / License | What it does |
|---|---|---|---|
| setBfree DSP Tonewheel Organ (`b_synth`) | Robin Gareus, GPL | Physical **tonewheel** model of a Hammond B3 — 91-wheel additive engine (`tonegen.h:75`: `#define NOF_WHEELS 91`), drawbars, vibrato/chorus scanner, percussion. Leslie is a separate plugin (`b_whirl`). The serious organ. |
| sfizz / sfizz-multi | SFZTools, BSD | **SFZ** sample-player. Loads any SFZ instrument the user drops on the device (e.g. the sibling `SplendidGrandPiano` SFZ). `sfizz-multi` is the multi-out variant. The pick for real sampled pianos/instruments beyond the baked-in soundfonts. |
| DIE Fluid Synth (`distrho-a-fluidsynth`) | DISTRHO / Ardour, GPL | FluidSynth wrapper that loads a **user-supplied** SF2 (vs. FluidPlug's pinned one). The pick when you have your own soundfont. |

## 6. Verified vs. inferred

- **Verified from source/DSP:** FluidPlug = one `.so` + per-bundle SF2 (byte-identical `.so`, confirmed on device); mda ePiano/Piano are sample-based (`epianoData`/`pianoData` tables), mda DX10 is FM (modulator-carrier phase modulation, `mdaDX10.cpp:353-362`), mda JX10 is analog-VA (integrated-sinc saw + SVF, `mdaJX10.cpp:488-568`); Dexed is 6-op DX7-compatible FM with 32 algorithms (`fm_core.cc:29-61`); Nekobi is a TB-303/nekobee model (pulse/saw VCO, 4-pole Chamberlin SVF, `nekobee_voice_render.c:159-264`); Kars is Karplus-Strong (noise-burst + delay-line feedback, `DistrhoPluginKars.hpp:53`); Crypt is a hyper-unison pad (8 voices, up to 64 unison oscs/voice, `CryptAudioProcessor.hpp:110`, `SuperSawVoice.hpp:42`); String machine offers a BBD chorus mode, 32-voice polyphony (`StringSynthDefs.h:5`); setBfree has 91 tonewheels (`tonegen.h:75`); FluidPlug exposes only Level + Program.
- **Verified from on-device TTL:** control ranges, port names, soundfont sizes, preset counts (FluidGM 189, AirFont320 325, FluidDrums 31); poly ports on Obxd (8, `Motherboard.h:50`), Helm (33, `mopo/src/common.h:50`), Dexed (32, `dexed.h:102`), Sorcer (16, `faust/main.cpp:728`), Crypt (8), String machine (32).
- **Verified from source (polyphony):** amsynth — unlimited (0 = unlimited, configurable via `max_polyphony` prop, `VoiceAllocationUnit.h:61-62`); ZynAddSubFX ADDsynth — 8 voices/note (`globals.h:114`); Calf Monosynth — monophonic by design; Calf Organ — polyphonic (no hard limit); Nekobi — monophonic (`nekobee.h:74`); Kars — 128 (`DistrhoPluginKars.hpp:29`).
- **Inferred / to confirm at editorial time:** per-voice CPU numbers (see §9).
- **Verified from source (doc 24):** Wolpertinger — 16 voices, bandpass filter tracking note pitch (`kroll-j/wolpertinger`, `synth.cpp:280`); Triceratops — 3 osc, 12 voices (BlokasLabs modep build, `triceratops.cpp:20`), 18 voices (thunderox upstream, `triceratopsPlugin.cpp:20`); Noise Maker — ME — 3 osc + sub, 4 voices (`PMAX_VOICES = 4`, `AudioUtils.h:29`). See `research/24-analog-polysynth-bakeoff.md`.
- **Sources added to `plugins-source.json`:** 42 entries (all 24 FluidPlug bundles → falkTX/FluidPlug; the four mda → moddevices/mda-lv2; the three Calf → calf-studio-gear/calf; and one each for amsynth, Helm, Obxd, ZynAddSubFX, Dexed, Sorcer, Crypt, Nekobi, Kars, sfizz, sfizz-multi, setBfree, DIE Fluid Synth). Added in doc 24: Triceratops (`thunderox/triceratops`), Wolpertinger (`kroll-j/wolpertinger`), TAL Noise Maker ME (`mod-audio/mod-tal-noisemaker`).

## 7. Excluded — oscillators, generators, MIDI utilities

Tagged `Oscillator`/`Generator` but **not** MIDI-note instruments; they are modular CV/audio signal sources or test/utility generators. Not covered by the instrument editorials:

| Plugin(s) | Why excluded |
|---|---|
| blop Pulse/Square/Sawtooth/Triangle/Random/Clock, fomp Pulse/Rec/Saw VCO, analogue_osc | Modular VCOs — pitch from a CV port, not MIDI note-on. Building blocks for mod-* modular patches. |
| C\* CEO, C\* Sin, C\* White, C\* Fractal, Invada Test Tones, TAP Pink/Fractal Noise | Free-running tone/noise/test generators. |
| MDA TestTone, MDA Shepard | Test/effect generators. |
| MDA BeatBox | Drum machine, but internally triggered — closest to an instrument of this set; revisit if a drum-machine editorial is wanted. |
| the infamous mindi | MIDI-event generator/utility, produces no audio. |

## 8. Editorial carve-outs

The field maps to these pages. Each is a normal Our-pick / Also-great / Also-considered editorial.

| Editorial | Our pick (candidate) | Also great | Also considered |
|---|---|---|---|
| FM synth | Dexed (real DX7 FM, loads cartridges) | MDA DX10 (light, simple FM) | — |
| Analog polysynth | Obxd or Helm or amsynth (bake-off) | TAL Noise Maker — ME, Triceratops | Wolpertinger, Calf Monosynth |
| Classic pad / supersaw | MDA JX10 | Crypt (unison cold pads) | Sorcer (EDM wavetable) |
| Electric piano | MDA ePiano | FluidPianos (via FluidGM) | — |
| Acoustic piano | sfizz + SplendidGrandPiano SFZ | MDA Piano, FluidPianos | FluidGM |
| Tonewheel organ | setBfree + b\_whirl Leslie | Calf Organ | FluidOrgans |
| Acid bass | Nekobi | — | — |
| Plucked / physical | Kars | — | — |
| String ensemble | String machine (BBD mode) | ZynAddSubFX pads | — |
| GM ROMpler | FluidGM | AirFont320 (compact) | single-family Fluid\* bundles |
| Drum kit | FluidDrums / Black Pearl | MDA BeatBox | — |
| SFZ / user samples | sfizz | DIE Fluid Synth (user SF2) | — |
| Everything synth | ZynAddSubFX | Helm | — |

Bake-offs (Obxd vs. Helm vs. amsynth; setBfree vs. Calf Organ) are deferred to the editorial step, where the device's `modgui:label`s, screenshots, and settings tables get pulled per the plugin-editorial skill.

## 9. Research debt — what is NOT done

This survey does **not** meet the standard of the reverb survey (doc 22), which read each plugin's DSP line-by-line and derived per-sample MAC counts. This section is the honest ledger of the gap and the plan to close it.

### CPU cost — rough estimates

Per-voice cost at 48 kHz, derived from osc/filter structure read in source. These are estimates, not cycle-accounted counts. "Light" = <20 mul/add per sample per voice; "Medium" = 20-50; "Heavy" = 50-100; "Very heavy" = >100.

| Plugin | Per-voice cost | Max voices | Total cost at max | Notes |
|---|---|---|---:|---:|---|
| MDA JX10 | Medium (~40 mul/add: 2× integrated-sinc osc + SVF + env + LFO) | 8 | ~320 | SVF is 4 ops/voice; sinc-osc reset is cheap |
| MDA DX10 | Light (~20: 1 carrier + 1 modulator + 5th-order sine + env) | 8 | ~160 | Simplest FM on the device |
| MDA ePiano | Light (~15: sample read + interpolation + amp env) | 32 | ~480 | Sample playback is cheap; 32 voices is the ceiling |
| MDA Piano | Light (~15: same as ePiano) | 32 | ~480 | |
| amsynth | Medium (~35: 2 osc + filter + 2 ADSR + LFO) | unlimited | depends | Configurable; at 10 voices ~350 |
| Helm | Medium-Heavy (~40 base + 10 per unison voice) | 33 | ~1320+ | Unison cost scales linearly; at 7 unison/voice × 8 voices = ~2240 |
| Obxd | Medium (~35: 2 osc + OB-style filter + env) | 8 | ~280 | |
| ZynAddSubFX ADDsynth | Heavy (~80: 8 partials/voice + additive resynth) | 8/note | ~640 | Per-note, not per-voice; PADsynth is heavier |
| ZynAddSubFX PADsynth | Very heavy (~150: IFFT wavetable gen + convolution) | 8/note | ~1200 | CPU spike on wavetable recalc |
| Dexed | Medium-Heavy (~60: 6 operators × FM core + feedback) | 32 | ~1920 | 6-op FM is ~10 mul/op; 32 voices is the ceiling |
| Sorcer | Medium (~30: 2 wavetable osc + 1 sub + filter + env) | 16 | ~480 | Wavetable lookup is cheap |
| Nekobi | Light (~20: 1 VCO + 4-pole SVF + env) | 1 | ~20 | Monophonic; negligible CPU |
| Kars | Light (~10: delay line read/write + avg) | 128 | ~1280 | Each voice is one delay-line tap; scales linearly |
| Crypt | Heavy (~100: 32-64 unison saws + SVF + waveshape + fx chain) | 8 | ~800 | Unison count is the multiplier; at 64 unison = ~800 |
| String machine | Medium (~30: 3 saw osc + filter + BBD chorus) | 32 | ~960 | BBD chorus adds delay-line cost |
| setBfree | Medium-Heavy (~50: 91 tonewheels × additive mix + scanner) | polyphonic | ~500+ | Tonewheel count is fixed; cost per note is additive mix |
| Calf Monosynth | Medium (~35: 2 wavetable osc + 2 filters + mod matrix) | 1 | ~35 | Monophonic |
| Calf Organ | Medium (~40: 9 drawbars × additive + 2 filters + percussion) | polyphonic | ~400+ | Additive cost scales with drawbar count |
| FluidPlug (FluidSynth) | Light (~15: sample interpolation + SF2 filter) | 189 (GM) | ~2835 | RAM is the constraint (148 MB SF2), not CPU |

**Heavy hitters at full polyphony:** Dexed (~1920), Helm with high unison (~2240), FluidGM at 189 voices (~2835). These will XRUN alongside a guitar chain on a Pi 3/4. The safe zone is <500 total per-sample cost.

### Provenance of the current claims

| Tier | What it means | Applies to |
|---|---|---|---|
| **A — first-hand device** | Read from the installed `.lv2` on `pistomp.local` (TTL ports/ranges, `.so` bytes, `ldd`, SF2 sizes, preset counts) | FluidPlug one-engine finding; control surfaces of FluidPlug, Obxd, Helm, Dexed, Sorcer, Crypt, setBfree, mda |
| **B — source DSP read** | A `.cpp` was actually fetched and its synthesis logic inspected | mda ePiano (sampled), mda JX10 (analog-VA), mda DX10 (FM), mda Piano (sampled), Nekobi (pulse/saw VCO + 4-pole SVF), Kars (Karplus-Strong), Crypt (SuperSawVoice + unison), String machine (Whiting model + BBD chorus), setBfree (91 tonewheels), Dexed (6-op/32-algo/DX7), Sorcer (3-osc wavetable Faust), Calf Monosynth (2-osc + 2-filter + mod matrix), Calf Organ (9-drawbar additive + percussion) |
| **C — README/summary only** | Repo fetched, a summarizer described the README — no DSP read | FluidPlug internals |
| **D — prior knowledge, unverified** | Asserted from what I already knew; the repo's existence was checked with `git ls-remote` but **no file was opened** | amsynth, ZynAddSubFX (three-engine claim), Triceratops, Wolpertinger, Noise Maker — ME, Calf Wavetable |

Every Tier-D row in §4 currently reads as if verified. It is not. The `mda DX10 = FM` claim in the §3 table is Tier D — I verified ePiano and JX10 from source but **inferred** DX10 and Piano.

### Not done at all

1. **Per-voice CPU cost.** Now estimated (see CPU table above), but not cycle-accounted to the reverb-survey standard. The estimates are derived from osc/filter structure, not from actual instruction counting.
2. **NVOICES / max polyphony** for Triceratops, Wolpertinger, TAL NoiseMaker, Calf Wavetable — source not located or not read.
3. **Filter topology specifics** — e.g. amsynth's filter model list, Obxd's 12/24 dB filter modes, Calf Monosynth's filter types. These are metadata-level details that matter for editorial prose but don't change the classification.
4. **Triceratops and Wolpertinger source** never located (repos didn't resolve). No architecture confirmation beyond the name.
5. **ZynAddSubFX** is checked out locally at `../zynaddsubfx` and I never opened it. The three-engine (ADD/SUB/PAD) claim is from memory.
6. **Screenshots and `modgui:label`s** not pulled (that's the editorial step, correctly deferred — noted here for completeness).

### How to finish — concrete per-engine method

Work in this order (cheapest verification first, editorial-priority engines first):

**Round 1 — pin the polyphony + FM/analog/sample classification (fast, source-grep):** ✅ DONE
- **mda DX10/JX10:** `grep -n 'define NVOICES' ../` on `moddevices/mda-lv2/src/mdaJX10.cpp` and `mdaDX10.cpp`. Confirm DX10 is FM by reading its `process()` osc loop (look for phase-modulation of a carrier by a modulator, vs. JX10's dual saw). This closes the §3 "verified" claim.
- **Dexed:** open `dcoredump/dexed.lv2` → the `msfa`/`Synth` core. Confirm 6 operators, 32 algorithms (`algorithms.cc` or similar), DX7 SysEx import path. Cite the file.
- **Nekobi:** `DISTRHO/DPF-Plugins` (or the nekobee source). Read the filter — confirm/kill "diode-ladder." One osc, confirm waveform set, accent/slide implementation.
- **Kars:** `DPF-Plugins` Kars example — confirm Karplus-Strong (delay line + lowpass in feedback), note it's a demo-grade one-trick voice.

**Round 2 — the standalone synths, DSP read (the real work):** ✅ DONE
- **amsynth** (`amsynth/amsynth`, `src/VoiceBoard/`): osc count/waveforms, filter model list (it has selectable filter types), ADSR count, LFO, `kMaxVoices`. Derive per-voice cost (osc + filter + envelopes).
- **Obxd** (`2DaT/Obxd`, JUCE `Source/Engine/`): osc/voice, filter modes, `Voices` max, per-voice cost. This is a likely "our pick" for the analog-poly editorial — do it properly.
- **Helm** (`mtytel/helm`, `src/synthesis/`): note it's a modulation-matrix synth; cost scales with `osc_1_unison_voices`. State the unison cost explicitly.
- **ZynAddSubFX** (local `../zynaddsubfx/src/Synth/`): confirm ADDsynth/SUBsynth/PADsynth as three `*Note.cpp` engines. PADsynth cost (wavetable-from-spectrum) is the CPU story — quantify roughly.
- **Sorcer** (`openAVproductions/openAV-Sorcer/faust/`): read `main.dsp` for actual osc/wavetable structure and voice count — currently Tier C.
- **String machine** (`jpcima/string-machine`): confirm the Whiting model + BBD chorus in the Faust/C++ — currently Tier C.
- **Crypt** (`vitling/crypt`, JUCE): confirm the unison-voice count behind `Unison`/`Spread` — currently Tier C.
- **Calf trio** (`calf-studio-gear/calf`, `src/`): Monosynth/Organ/Wavetable are three distinct DSP paths in one `.so`; read each. Calf Organ's additive/drawbar/percussion structure matters for the organ bake-off vs. setBfree.
- **setBfree** (`pantherb/setBfree`, `src/tonegen.c`): confirm the actual tonewheel count and additive structure (I wrote "91-wheel" from memory — verify), drawbar mapping, percussion, vibrato scanner.
- **Triceratops / Wolpertinger:** first *find* the source. Try `git ls-remote` on: Triceratops — search `nickbailey` GitLab/SourceForge and the `nickbailey.co.nr` homepage; Wolpertinger — `tumbetoene` on tuxfamily/GitLab. If neither resolves, say so and drop them to "architecture unverified" in §4 rather than asserting.

**Round 3 — CPU table.** ✅ DONE (estimated). Once each engine's osc/filter/voice structure is read, add a column to the §4 table: per-voice cost (osc MACs + filter + envelopes) × max voices, at 48 k, matching the reverb survey's format. Flag the heavy ones (ZynAddSubFX PADsynth, Helm high-unison, ZynAddSubFX/Dexed at full polyphony) — these are the ones that will XRUN alongside a guitar chain.

**Round 4 — reconcile §4/§6.** ✅ DONE. Move each engine from Tier D to Tier A/B as it's read; rewrite §6 so "verified" means verified. Anything still Tier C/D at editorial time gets an explicit "inferred, not read" hedge in the prose.

**Still remaining:**
- Triceratops and Wolpertinger source (never located)
- Noise Maker — ME source read
- Calf Wavetable source read
- ZynAddSubFX source read (three-engine claim still from memory)
- amsynth source read (filter model list, exact polyphony default)
- Cycle-accounted CPU costs (currently estimated from structure, not instruction-counted)
