# Amp / Cab / Simulator Survey — pi-Stomp LV2 Ecosystem

## Background

Phase 4.2 of the audit plan calls for an editorial `src/plugins/` page on amp/cab/drive-via-NAM, framed against the modeled plugins it would replace (`GxAmplifier-X`, `GxCabinet` — 4 and 8 occurrences, the highest Simulator-category usage in shared pedalboards). That editorial needs a research doc first. This is it.

The scope is every plugin tagged `Amplifier` or `Simulator` in `src/_data/plugins.json`, with the deep dives reserved for the high-usage candidates and for NAM itself. Drive pedals tagged `Distortion` are out of scope (already covered in docs 01–13) — the only exception is `Valve saturation`, which carries a `Simulator` tag and is included on that ground.

## Method

Every `Amplifier`/`Simulator` plugin on the device was enumerated from `plugins.json` (53 plugins — names lie, per the research rule). Source was read from upstream where it resolves; the pi-Stomp was offline during research so `modgui:label`s and screenshot fetches are deferred to the editorial step. Architecture counts, control ranges, and circuit topology are taken from the DSP/TTL, not the README.

Per CLAUDE.md, the bundle-pair rule (`rkr.lv2`/`rkr-labs.lv2`, `invada.lv2`/`invada-labs.lv2`, `fomp.lv2`/`fomp-labs.lv2`) was checked against the amp/cab set. **No amp/cab plugin has a `-labs` duplicate.** The three known pairs are all in other categories (delay/reverb/filter/mod). The device loads the same single build for every amp/cab plugin.

`src/_data/plugins-seen.json` occurrence counts:

| Plugin | Seen | Bundle | Category | One-line |
|---|---:|---|---|---|
| GxCabinet | 8 | gx_cabinet.lv2 | Simulator | 18 embedded cabinet IRs + convolver + 3-knob IR former |
| TAP Tubewarmth | 5 | tap-tubewarmth.lv2 | Simulator | Asymmetric waveshaper + DC blocker; 2 knobs |
| Valve saturation | 5 | valve-swh.lv2 | Distortion, Simulator | Bendiksen valve model; 2 knobs, no tone |
| GxAmplifier-X | 4 | gx_amp.lv2 | Simulator | 18 tube preamp models + 28 tonestacks + 18 cabs in one plugin |
| C\* AmpVTS | 2 | mod-caps-AmpVTS.lv2 | Simulator | Idealised amp: 2 poly waveshapers + 9 tonestacks, 2/4/8× oversampled |
| Neural Amp Modeler | 2 | neural_amp_modeler.lv2 | Simulator | NAM/RTNeural player; A1 Standard/Lite/Feather/Nano + A2 Lite/Full |
| Cabinet (VeJa) | 2 | cabsim.lv2 | Simulator | VeJa cabsim — single IR loader, source not located |

## The rest (not seen in user pedalboards)

Grouped by upstream; counts are zero unless noted.

### brummer10 family (guitarix lineage)

| Plugin | Bundle | One-line |
|---|---|---|
| Ratatouille | Ratatouille.lv2 | brummer10 standalone amp sim (separate from guitarix). Repo `brummer10/Ratatouille.lv2` |
| FatFrog | FatFrog.lv2 | brummer10 standalone amp sim. Repo `brummer10/FatFrog` |
| VintageAC30 | VintageAC30.lv2 | brummer10 standalone AC30 sim. Repo `brummer10/VintageAC30.lv2` |
| PreAmpTubes | PreAmps.lv2 | `urn:brummer:PreAmps` — tube preamp collection. Source repo not located |
| PowerAmpTubes | poweramps.lv2 | `urn:brummer:poweramps` — power amp collection. Source repo not located |
| PreAmpImpulses | PreAmpImpulses.lv2 | `urn:brummer:PreAmpImpulses` — preamp IR loader. Source repo not located |
| PowerAmpImpulses | PowerAmpImpulses.lv2 | `urn:brummer:PowerAmpImpulses` — power amp IR loader. Source repo not located |

`urn:brummer:*` URIs resolve to no GitHub repo I could verify (`git ls-remote` against every plausible name failed; `brummer10`'s public repo list contains no Pre/PowerAmp Tubes/Impulses project as of 2026-07). Treat the four as closed-source for editorial purposes — the DSP cannot be read.

### guitarix standalone amp variants

All `gx_*` plugins share the guitarix tree (`brummer10/guitarix`); they are individual Faust-generated amp sims using the same `tubestage()` block and `valve.h` tube tables as GxAmplifier-X's 18 amp models. The standalone plugins are single-model amps rather than model-switching plugins.

| Plugin | Bundle | Modeled circuit |
|---|---|---|
| GxAmplifier Stereo | gx_amp_stereo.lv2 | Stereo build of GxAmplifier-X (`doap:name "GxAmplifier-Stereo-X"`); same 18 amps / 28 tonestacks / 18 cabs |
| GxJCM800pre | gx_jcm800pre.lv2 | JCM800 preamp (single model) |
| GxJCM800pre ST | gx_jcm800pre_st.lv2 | stereo |
| GxSVT | gx_ampegsvt.lv2 | Ampeg SVT bass pre |
| GxBlueAmp | gx_blueamp.lv2 | blues-style preamp |
| GxCreamMachine | gx_CreamMachine.lv2 | high-gain preamp |
| GxFenderizer | gx_fenderizer.lv2 | Fender-style preamp |
| GxPlexi | gx_plexi.lv2 | Plexi-style preamp |
| GxSupersonic | gx_supersonic.lv2 | Fender Supersonic-style |
| GxUltraCab | gx_ultracab.lv2 | cabinet sim variant |
| GxUVox720k | gx_uvox.lv2 | UVox-style preamp |
| GxVBassPreAmp | gx_voxbass.lv2 | Vox-style bass preamp |
| GxVMK2 | gx_vmk2d.lv2 | Vox-style MK2 preamp |
| GxMicroAmp | gx_MicroAmp.lv2 | simple clean boost preamp |
| GxAlembic | gx_studiopre.lv2 | Alembic-style preamp (`doap:name "GxAlembic"`, URI `#studiopre`) |
| Gx Studio Preamp Stereo | gx_studiopre_st.lv2 | stereo Alembic-style |
| GxRedeye Vibro Chump | gx_redeye.lv2 | amp + cab combo |

### CAPS (Tim Goetze)

| Plugin | Bundle | One-line |
|---|---|---|
| C\* ToneStack | mod-caps-ToneStack.lv2 | 9 tonestacks, amp-stage bypassed — tone only |
| C\* CabinetIII | mod-caps-CabinetIII.lv2 | 17 cabs as 31st-order IIR filters (no IR, no convolver) |
| C\* CabinetIV | mod-caps-CabinetIV.lv2 | newer cabs as IIR + FIR hybrid, oversampled for ≥96 kHz |

### MDA (Paul Wernert / MAX plugins)

| Plugin | Bundle | One-line |
|---|---|---|
| MDA Combo | mod-mda-Combo.lv2 | simple combo amp sim |
| MDA Leslie | mod-mda-Leslie.lv2 | rotary speaker sim |

### setBfree / x42 (Robin Gareus, organ lineage)

| Plugin | Bundle | One-line |
|---|---|---|
| setBfree Whirl Speaker | b_whirl_mod | Leslie/whirl sim, the Leslie from setBfree |
| setBfree Whirl Speaker (Old) | b_whirl | older build |
| setBfree Whirl Speaker - Extended | b_whirl_xt | extended controls |

### Other

| Plugin | Bundle | One-line |
|---|---|---|
| AIDA-X | rt-neural-generic.lv2 | RTNeural-based player for AidaDSP/AIDA-X keras models — NAM-adjacent, loads `.aidax`/keras JSON |
| Amp Profiler | profiler.lv2 | faustlv2.bitbucket.io — source not located |
| Amplifier | blop.lv2 | blop signal amplifier (gain only, not a sim) |
| Amplitude Imposer | AmplitudeImposer.lv2 | ndcplugs — envelope-controlled amp effect |
| Bass Cabinets | veja-bass-cab.lv2 | VeJa bass cab IRs |
| British 1960A | veja-1960-cab.lv2 | VeJa 1960 cab IR (ships as its own debpkg in pi-gen-pistomp) |
| Cabinet Loader | MOD-CabinetLoader.lv2 | mod.audio generic IR loader |
| EveryTrim | Airwindows-EveryTrim.lv2 | Airwindows trim (cataloged under Amplifier by tag, not a sim) |
| Guitar Midi | guitarmidi.lv2 | geraldmwangi midi guitar plugin |
| IR loader cabsim | cabsim-IR-loader.lv2 | mod-audio generic IR loader (repo `mod-audio/mod-cabsim-IR-loader`) |
| Swanky Amp | SwankyAmp.lv2 | resonantdsp/SwankyAmp — Faust amp sim, DISTRHO-style build |
| Tape Delay Simulation | tape_delay-swh.lv2 | tape-style delay (delay, not amp) |
| XDarkTerror | XDarkTerror.lv2 | brummer10 Dark Terror-style preamp |
| XTinyTerror | XTinyTerror.lv2 | brummer10 Tiny Terror-style preamp |

## Topology, established from source

### 1. GxCabinet — IR convolver with a 3-knob IR former

`brummer10/guitarix` → `trunk/src/LV2/gx_cabinet.lv2/gxcabinet.cpp`, `gx_cabinet.ttl`, `cabinet_impulse_former.h`, `cab_data_table.cc`; data in `trunk/src/gx_head/engine/gx_cabinet_data.cc`. Guitarix team, ISC license.

GxCabinet is **not** a static cabinet model. It is a partitioned-block convolution reverb running on 18 embedded cabinet IRs (`cab_data_table.cc:19–37` enumerates `cab_data_4x12` through `cab_data_1x8` — IR lengths 68 to 1000 samples, all at 48 kHz). The `c_model` port (integer 0–18, default 0, enumeration in `gx_cabinet.ttl:103–126`) selects the IR; 18 is "Off".

The three tone knobs (`Cabinet` level 0.5–5, `Bass` −10…+10, `Treble` −10…+10) do not post-EQ the convolver output. They pre-shape the IR itself, via `Impf::compute()` in `cabinet_impulse_former.h:73` — a Faust-generated two-band shelving filter applied to the IR coefficients before the convolution kernel is loaded. When the user tweaks a knob, the worker thread (`GxCabinet::do_work_mono`, `gxcabinet.cpp:161`) recomputes the shaped IR (`impf.compute(cabconv.cab_count, cabconv.cab_data, cab_irdata_c, cbass_, ctreble_, clevel_)`) and swaps it into the convolver. There is no per-sample tone filter in the audio path; the tone controls cost nothing at runtime.

The bass shelf corner is `1884.96/sr` rad/sample (~300 Hz at 48 kHz), the treble shelf corner is `15079.6/sr` (~2400 Hz at 48 kHz) — `cabinet_impulse_former.h:38–46`. Q is fixed at 1.414 (`sqrt(2)`), so the shelves are Butterworth-shaped.

CPU is the cost of one partitioned convolution per sample, with the IR length varying from 68 to 1000 taps. At the longest IR (cab_data_4x12, 1000 taps) the convolver is the dominant cost; at the shortest (cab_data_charisma, 68 taps) it is negligible. Mono. Worker-thread IR swap is non-RT; the audio thread only calls `cabconv.run_static`.

The 18 embedded cabs are: 4x12, 2x12, 1x12, 4x10, 2x10, HighGain, Twin, Bassman, Marshall, AC30, Princeton, A2, 1x15, Mesa, Briliant, Vitalize, Charisma, 1x8. Most are stylized rather than named-after-a-specific-cab; the named ones (Twin, Bassman, Marshall, AC30, Princeton, Mesa) are guitarix's own captures of those styles, not licensed IR packs.

### 2. GxAmplifier-X — tube preamp + tonestack + cabinet in one plugin

`brummer10/guitarix` → `trunk/src/LV2/gx_amp.lv2/gx_amp.cc` (descriptor), `gx_amp.ttl`, `gxamp.cpp` (815-line implementation), `gxamp.h`; Faust sources in `trunk/src/faust/gxamp.dsp` through `gxamp18.dsp`; tube tables in `trunk/src/LV2/DSP/valve.h` and `12ax7.cc`–`SVEL34.cc`. Guitarix team, ISC license.

`doap:name "GxAmplifier-X"`, `mod:label "Gx Amp X"`. The plugin chains three guitarix blocks in one LV2 instance:

1. **Tube preamp.** 18 amp models selected by the `Model` port (integer 0–18, enumeration in `gx_amp.ttl:169–193`). Each model is a Faust-generated DSP (`gxamp.dsp` through `gxamp18.dsp`) compiled to `gxamp.cc` through `gxamp18.cc` and dispatched at runtime. The models vary by tube type (12AX7, 12AU7, 12AT7, 6DJ8, 6C16, 6V6) and topology (single-ended, push-pull, feedback, master-volume, 2- or 3-stage). The 18 scale points are the model names verbatim ("12ax7", "12AU7", "pre 12ax7/ master 6V6", etc.).
2. **Tonestack.** 28 models selected by the `Tonestack Model` port (0–27). The tonestacks are the same set used by the standalone `gx_tonestack` plugins — Bassman, Twin, Princeton, JCM-800, JCM-2000, M-Lead, M2199, AC-30, SOL 100, Mesa, JTM-45, AC-15, Peavey, Ibanez, Roland, Ampeg, Rev.Rocket, MIG 100 H, Triple Giant, Trio, H&K, Fender Junior, Fender, Fender Deville, Gibsen, Off, Engl.
3. **Cabinet.** Same 18-IR table as GxCabinet (`cab_data_table.cc`), driven from a `Cab Model` port (0–18) with the same scale points. The cab IR shaping (level/bass/treble) is the same `Impf` impulse-former; the integrated version uses the `Cabinet` knob as its level control.

The tube stage is **not** a waveshaper. Each tube type has two precomputed 1-D lookup tables (one per load: 68 kΩ and 250 kΩ anode resistor, `valve.h:108–137`), indexed by grid-to-cathode voltage `Vgk` and linearly interpolated (`Ftube()` in `valve.h:175`). The tables were derived from SPICE simulation of the tube characteristic curves; guitarix ships tables for 14 tube types (12AX7, 12AU7, 12AT7, 6V6, 6DJ8, 6C16, 6L6CG, EL34, 12AY7, JJECC83S, JJECC99, EL84, EF86, SVEL34). The Faust `tubestage()` block (visible in `gxamp.dsp:21`) wires the table lookup into a 2-stage (or 3-stage in gxamp15/16) preamp with inter-stage lowpass at 6531 Hz and per-stage gain.

CPU: per sample, two table lookups + two lowpasses per stage, plus the tonestack (3-band biquad) plus the cabinet convolution (partitioned, IR length 68–1000 taps depending on model). The integrated plugin is heavier than GxCabinet alone, but is still a small fraction of a NAM instance (see §4). The 96 kHz Faust declaration in the `.dsp` files is the design-time internal rate; the LV2 plugin resamples to the host rate via `gx_resample::FixedRateResampler` (`gxamp.cc:14`).

`GxAmplifier-Stereo-X` (`gx_amp_stereo.lv2`) is the stereo build of the same engine — same models, same tonestacks, same cabs, two channels.

### 3. C* AmpVTS — idealised amp, poly waveshapers + 9 tonestacks

`mod-audio/caps-lv2` → `Amp.cc`, `Amp.h`, `dsp/ToneStack.h`, `dsp/polynomials.h`, `dsp/Oversampler.h`, `ToneStack.cc`. Tim Goetze (and David Yeh for the tonestack), GPL-3.0.

`doap:name "C* AmpVTS - Tube amp + Tone stack"`. The plugin descriptor's own comment calls it "Idealised guitar amplification" (`Amp.cc:8`). It is **not** a model of a specific amp. The signal path (`Amp.cc:95–175`, `subcycle()`):

1. Input HPF (`hp1`) at `1.5 × lowcut × over_fs` — `lowcut` is `0.1 + 392 × port10` (~50 Hz to 7.8 Hz range as port sweeps 0–1).
2. Preamp gain into a tonestack (`tonestack.process(a + normal)`).
3. Bias offset (`.5 × b`), then oversample 2×/4×/8× (`over` port selects).
4. **Preamp waveshaper**: `DSP::Polynomial::one5` — a 5th-order polynomial, symmetric.
5. DC blocker (`dc1`, set to 72 Hz at the oversampled rate).
6. Lowpass (`lp` at `500 + 6500 × bright²` / over_fs — 500 Hz to 7000 Hz sweep).
7. **Power amp waveshaper**: `DSP::Polynomial::atan` — `atan()` shaped, symmetric.
8. Downsample.
9. DC blocker 2 (`dc2`, 25 Hz at oversampled rate).
10. RMS compressor (`compress`, attack `0.6 × (1-0.5×gain) × port8`, squash `0.8 × port9`).
11. Makeup gain.

Both waveshapers are **symmetric** — one polynomial per polarity, no separate up/down tables. This is not a circuit simulation; it is a stylized amp model. The 9 tonestacks (`ToneStack.cc:38–75` — Bassman 5F6-A, Princeton AA1164, Mesa Dual Rectifier "Orange", Vox "top boost", JCM-800 Lead 100 2203, Twin Reverb AA270, Hughes & Kettner Tube 20, Roland Jazz Chorus, Pignose G40V) are real R/C network simulations, each parameterized by the four resistors and three capacitors of the original tone stage (`TSParameters` = `R1 R2 R3 R4 C1 C2 C3`).

CPU: 2×/4×/8× oversampling multiplies per-sample cost; at 8× on a Pi 5 it is audible but not catastrophic — cheaper than any NAM architecture. Mono.

### 4. Neural Amp Modeler (NAM) — the LV2 player

`mikeoliphant/neural-amp-modeler-lv2` → `src/nam_plugin.{h,cpp}`, `src/nam_lv2.cpp`, `CMakeLists.txt`. The DSP engine lives in `mikeoliphant/NeuralAudio` → `NeuralAudio/NeuralModel.{h,cpp}`, `NeuralAudio/InternalModel.h`, `NeuralAudio/CompositeModel.h`, `NeuralAudio/NAMModel.h`, `NeuralAudio/WaveNet.h`. Mike Oliphant, MIT (NeuralAudio); the LV2 plugin is MIT-derived. NAM model format is from `sdatkinson/neural-amp-modeler` (Steven Atkinson).

The plugin exposes four controls (`nam_plugin.h:56–64`):

- **Input** (input pre-model gain, dB)
- **Output** (post-model volume, dB)
- **Quality** (float 0.0–1.0) — for A2 models, below 0.5 selects the "lite" sub-model, above 0.5 the "full" sub-model (`README.md`, `nam_plugin.cpp:269`)
- **Model** (atom:Path — the `.nam` file path)

Mono audio in/out. No on-plugin GUI; the host must support `atom:Path` parameters. pi-Stomp's MOD-UI host does, and ships its own brummer10 GUI fork separately. The plugin also implements LV2 State and Worker so model loads happen off the audio thread (`work()` in `nam_plugin.cpp:104` reads the file, `work_response()` at `:176` swaps the model pointer on the RT thread).

#### Architecture sizes (verified from `NeuralModel.cpp` and `InternalModel.h`)

The loader recognises four **A1** static WaveNet architectures and two **A2** static architectures:

| Family | Architecture | Channels × Head | Dilations | Source |
|---|---|---|---|---|
| A1 | Standard | 16 × 8 | 1,2,4,8,16,32,64,128,256,512 (×2 layers) | `NeuralModel.cpp:25` |
| A1 | Lite | 12 × 6 | same as Standard | `NeuralModel.cpp:26` |
| A1 | Feather | 8 × 4 | same as Standard | `NeuralModel.cpp:27` |
| A1 | Nano | 4 × 2 | same as Standard | `NeuralModel.cpp:28` |
| A2 | Lite (channels=3) | 1 × 3 | 1,3,7,17,41,101,239,… (23 dilations) | `NeuralModel.cpp:398`, `InternalModel.h:19–20` |
| A2 | Full (channels=8) | 1 × 8 | 1,3,7,17,41,101,239,… (23 dilations) | `NeuralModel.cpp:410`, `InternalModel.h:19–20` |

A1 WaveNet layers come in two flavours: 1-layer (LSTM-style) and 2-layer. The two A1 layers share the standard dilations in Standard (`stdDilations` at `NeuralModel.cpp:71`) and lite dilations in Lite (`liteDilations1`/`liteDilations2` at `:72–73`). The 1-layer A2 path uses kernel sizes `6,6,…,15,15,…,6` and 23 dilations — a different, larger receptive field than A1.

A2 models can also ship as **slimmable composite** files (`architecture == "SlimmableContainer"`, `NeuralModel.cpp:350`). These pack multiple sub-models (e.g. lite + full) into one `.nam`, and the `Quality` port selects which runs at any given moment (`CompositeModel.h:127–214`). The default load mode prewarms all sub-models (`CompositeModel.h:121`) so quality switching is RT-safe; `OnDemand` mode skips prewarm but is non-RT on first switch (`CompositeModel.h:55–72`).

The loader also accepts RTNeural keras JSON (`.json`/`.aidax`) for LSTM and GRU models — that's the AIDA-X / GuitarML path. Seven static LSTM sizes are supported (`NeuralModel.cpp:32–38`): 1×8, 1×12, 1×16, 1×24, 2×8, 2×12, 2×16.

A1 "Standard", "Lite", "Feather", "Nano" map to the four sizes of the original NAM project. A2 "Lite" and "Full" are the v2 architecture's two channel widths (3 and 8). The README and the loader do not surface a "Feather" or "Nano" A2 — those names apply only to A1.

#### Sample rate (verified from `NeuralModel.cpp`)

NAM models embed their training sample rate in the JSON. The loader reads it (`OversampleNAMConfig` at `NeuralModel.cpp:92–130`): if the host rate differs from the model rate and is an integer multiple of it, the loader scales all dilation sizes by `externalSampleRate / modelSampleRate` so the model behaves correctly at the higher rate. **If the host rate is not an integer multiple of the model rate, the model loads but runs at the wrong effective rate** — the loader does not resample.

The default model rate is 48 kHz (`NeuralModel.cpp:99`), and pi-Stomp runs JACK at 48 kHz, so community models load at their training rate. The plugin's README states this explicitly: "you must run your audio host at the same sample rate the model was trained at (usually 48kHz) — no resampling is done by the plugin." The capture workflow enforces it (per `src/using/nam.md`).

#### CPU cost and the 8-instance claim

The audit plan (Phase 4.1) claims "the A2 architecture lets v3 run 8+ concurrent instances at light settings." That figure is **not** verifiable from source — it depends on the Pi 5's CPU budget at the device's chosen JACK period, the build flags used (`MULTIFRAME_8X8_CONVOLUTION`, `BUILD_STATIC_INTERNAL_NAMA2`, `NAM_ENABLE_A2_FAST`, `-march=native`), and the model in play, none of which the source fixes.

What the source does establish:

- **A2 Lite is cheaper than A2 Full** by construction — channels 3 vs 8 reduces the matrix-multiply width in every WaveNet layer by ~2.7× (`NeuralModel.cpp:398` vs `:410`).
- **A2 Lite is cheaper than A1 Standard** because A2 has 1 layer vs A1 Standard's 2 (`NeuralModel.cpp:389` vs `:423`), and the A2 Lite channel count (3) is lower than Standard (16). The A2 dilations (23 of them, larger max) give a wider receptive field than A1 Lite (7+13 dilations), but the per-sample compute is dominated by channel width.
- **A1 Nano is the cheapest A1** — 4 channels, 2 head, 2 layers.
- The `MULTIFRAME_8X8_CONVOLUTION` CMake flag (per the NeuralAudio README) is the meaningful lever for Pi 5: it defaults to `4` on 128-bit SIMD (Pi 4) and `8` on 256-bit SIMD (Pi 5), and is "very impactful" — 4× or 8× multiframe convolution at 256-bit SIMD is what makes a single NAM instance affordable on the Pi 5. The flag is opt-in via cmake; whether the pi-Stomp image sets it is not visible in `pi-gen-pistomp`'s source (the NAM plugin is shipped as a binary apt dependency, not built from a debpkg in this repo as of 2026-07).

The figure in `src/using/nam.md` ("About 10 at once" on v3 lighter architectures, "About 4" on v2) is a sanity-checked whole-device ceiling, not a per-second cycle count. This doc does not contradict it. The editorial should not repeat the plan's "8+ A2 instances" claim without on-device measurement — it should cite the `using/nam.md` ceiling instead.

#### What NAM gives up vs. a modeled plugin

- **No knob-per-control.** A NAM capture is a fixed instance of one amp at one setting (or one knob sweep, for slimmable models). You cannot turn the "Drive" knob on a NAM amp model and hear the amp break up further — you can only load a different capture.
- **Fixed sample rate.** Capture refuses to start at any JACK rate other than 48 kHz; playback loads wrong if the host rate isn't a multiple of 48 kHz.
- **No cabinet.** A NAM amp-only capture needs an IR after it (the README: "For amp-only models (the most typical), you will need to run an impulse response after this plugin to model the cabinet"). This is the same shape as a real amp head. `GxAmplifier-X` and `C* AmpVTS` ship with the cab built in.
- **No tonestack.** The tonestack is baked into the capture. A/B-ing two amps means loading two captures; A/B-ing two tonestacks on the same amp in the modeled world means turning one knob.

### 5. TAP Tubewarmth — an asymmetric saturator wearing a tube name

`moddevices/tap-lv2` → `tubewarmth/tap_tubewarmth.c`, `tubewarmth/tap_tubewarmth.ttl`. Tom Szilagyi, GPL-2.0.

Two knobs: **Drive** (0.1–10) and **Tape-Tube Blend** (−10 to +10). The DSP (`run_TubeWarmth`, `tap_tubewarmth.c:174–265`) is a piecewise waveshaper with **separate positive and negative paths**:

```
med = (D(ap + in*(kpa - in)) + kpb) * pwrq              // in >= 0
med = (D(an - in*(kna + in)) + knb) * pwrq * -1         // in < 0
out = srct * (med - prev_med + prev_out)               // one-pole HPF (DC blocker)
```

`D()` is `sgn(x)·sqrt(|x|)`, so each path is a sqrt-of-quadratic. The positive and negative paths use different coefficients (`kpa/kpb/ap` vs `kna/knb/an`), so the saturation is **genuinely asymmetric** — this is what makes it sound tube-ish rather than just distorted. The Blend knob skews the bias between the two paths (it appears in `rbdr = rdrive / (10.5 - blend) × 780/33`).

The final stage (`out = srct × (med - prev_med + prev_out)` with `srct = 0.1·sr / (0.1·sr + 1)`) is a ~1.6 Hz DC blocker. The "tape" half of the name is aspirational — there is no tape hysteresis or HF compression; the blend just shifts the bias.

CPU: trivial — a few multiplies, a sqrt, and a one-pole per sample. Mono.

The plugin's editorial value is as a **colour stage** — the same role as a saturator — not as an amp replacement. The 5-occurrence count in shared pedalboards is consistent with users placing it after a clean amp sim to add harmonics.

### 6. Valve saturation — Ragnar Bendiksen's valve model

`swh/lv2` → `plugins/valve-swh.lv2/plugin.xml` (the SWH LV2 plugins are XML-generated C). Steve Harris, GPL-2.0. The plugin's own description credits Ragnar Bendiksen's thesis (`http://www.notam02.no/~rbendiks/Diplom/Innhold.html`).

Two knobs: **Distortion level** (`q_p`, 0–1) and **Distortion character** (`dist_p`, 0–1, mapped to `dist = dist_p × 40 + 0.1`). The DSP (`plugin.xml:31–58`):

```
q = q_p - 0.999
dist = dist_p * 40 + 0.1
fx = (input - q) / (1 - exp(-dist × (input - q))) + q / (1 - exp(dist × q))
out = 0.999 × prev_out + fx - prev_in                // one-pole DC blocker
```

The waveshaper is a single-valve-style exponential saturator (the standard `x / (1 - e^{-k x})` valve plate characteristic). When `q == 0` (Distortion level at 0.999) the second term vanishes and the shaper reduces to `input / (1 - exp(-dist × input))`. When `q != 0`, the curve is shifted — this is the "drive against the limit of the amplifier" control. The output stage is a one-pole DC blocker (`0.999 × prev_out + fx - prev_in`) — the same structural shape as TAP Tubewarmth, simpler.

It is **symmetric** — no separate positive/negative path. The "lacking some of the harmonics you would get in a real tube amp" warning in the plugin's own description is honest: a symmetric shaper produces only odd harmonics, where a real tube amp's asymmetric transfer produces even harmonics too.

CPU: trivial. Mono.

### 7. Cabinet (VeJa cabsim) — source not located

`VeJaPlugins.com/plugins/Release/cabsim`, bundle `cabsim.lv2`, `doap:name "Cabinet"`. 2 occurrences in shared pedalboards.

The `VeJaPlugins.com` upstream resolves to no public repo I could verify (`git ls-remote` against `github.com/VeJaPlugins/*` and several alternative hosts all failed; the broader github search returned no match). pi-gen-pistomp does ship separate `veja-1960-cab-lv2` and `veja-bass-cab-lv2` debpkgs (visible in `pi-gen-pistomp/debpkgs/`), but the `cabsim.lv2` plugin itself is not built from a debpkg in this repo and the upstream is unknown.

What can be inferred from the URI namespace and bundle layout: it is an IR-loader cabinet sim, distinct from `mod-audio/mod-cabsim-IR-loader` (which is the MOD team's generic IR loader, repo located at `mod-audio/mod-cabsim-IR-loader`). The editorial should not claim a topology for the VeJa plugin that source has not established. Treat as closed.

## Ranking by use case

### The full amp + cab chain (one plugin does everything)

1. **GxAmplifier-X** — 18 tube preamps × 28 tonestacks × 18 cabs in one LV2 instance. The highest-Simulator-usage modeled plugin on the device (4 occurrences). Knob-per-control. The pick if you want one plugin to be the whole front end.
2. **GxAmplifier-Stereo-X** — same engine, stereo. Also great if you need the second channel.
3. **C\* AmpVTS** — idealised amp + 9 tonestacks, 2/4/8× oversampled, no cabinet (use a separate cab plugin after). Also great, different feel — poly waveshapers rather than tube tables.

### Cabinet only (after a preamp or a NAM amp capture)

1. **GxCabinet** — 18 IRs, 3-knob IR former, cheap. The pick (8 occurrences in shared pedalboards is no accident).
2. **C\* CabinetIV** — IIR + FIR hybrid, oversampled, 17 cabs. Also great, more modern voicings.
3. **C\* CabinetIII** — 17 cabs as 31st-order IIR filters, no convolver. Also great if you want zero partitioned-convolution cost.
4. **IR loader cabsim** (mod-audio) or **Cabinet Loader** (mod.audio) — generic IR loaders if you have your own IR file. Also considered — useful but you supply the IR.
5. **Cabinet (VeJa)** — unknown topology, source not located. Skip editorially until verified.

### Saturation / colour (the "tube" tag used as a colour stage)

1. **TAP Tubewarmth** — asymmetric, two knobs, 5 occurrences in shared pedalboards. The pick for adding harmonic content without changing the rest of the chain.
2. **Valve saturation** — symmetric, two knobs, 5 occurrences. Also great, simpler voicing, lighter on the highs.
3. **rkr Valve** (already covered in doc 17) — rakarrack's take, in the same role.

### Neural capture (the editorial question)

1. **Neural Amp Modeler** — the only NAM player on the device. Loads both A1 (Standard/Lite/Feather/Nano) and A2 (Lite/Full) `.nam` files, plus RTNeural keras JSON for AIDA-X / GuitarML models. One capture = one amp at one setting; pair with `GxCabinet` or an IR loader for the cab.
2. **AIDA-X** — alternative neural player (RTNeural), 0 occurrences in shared pedalboards. Also considered.

## The editorial verdict — when NAM beats GxAmplifier-X, and when it doesn't

The question Phase 4.2 asks: when does a NAM capture beat the modeled plugins, and when does the opposite hold?

### NAM wins when

- **The user wants a specific real amp's sound, not a stylized one.** GxAmplifier-X's 18 models are guitarix's stylized takes on 12AX7/6V6/etc. preamps — they are not captures of a specific Twin Reverb or JCM800. A NAM capture of an actual Twin Reverb will track the real amp's edge of breakup, its specific clean-to-dirty transition, and its cabinet interaction in a way a stylized model cannot. The capture is the only path on this device to "this exact amp at this exact setting."
- **The user wants a drive pedal's exact sound, not a TS-style approximation.** NAM captures pedals as well as amps. A drive pedal capture (e.g. of a Klon or a Big Muff) replaces the modeled drives in docs 01–13 with the real thing.
- **CPU budget allows it on v3.** On a Pi 5, a single A2 Lite capture is comparable in cost to a heavy GxAmplifier-X instance, and the NAM player has no on-plugin tone controls to ride. The figure in `src/using/nam.md` (≈10 lighter-architecture instances as a whole-device ceiling on v3) is the budget to plan against. The plan's "8+ A2 instances" figure is not verifiable from source and should not be repeated in the editorial without an on-device benchmark.
- **The user has an IR they like for the cab.** A NAM amp-only capture + `GxCabinet` (or a custom IR loader) gives a separation that GxAmplifier-X's integrated cab doesn't.

### GxAmplifier-X wins when

- **The user wants to turn knobs and hear the amp respond.** PreGain, Drive, Distortion, Master, Bass, Middle, Treble, Presence, Cabinet, plus Model and Tonestack selections — all live, all RT-safe, no model reload. A NAM capture is a fixed snapshot; the modeled amp is an instrument.
- **CPU is constrained, especially on v2.** `src/using/nam.md` is explicit: on v2, NAM is a deliberate spend. GxAmplifier-X runs comfortably on v2 with room for the rest of the chain.
- **The user wants the cab in the same plugin.** No IR file to manage, no second plugin to load, no level-matching between the two.
- **The user wants a sound that isn't a real amp.** The 18 tube models include combinations (pre 12ax7 / push-pull 6V6, etc.) that don't correspond to any production amp. NAM can only capture amps that exist.

### GxCabinet wins when

- **The user wants a cab without an IR file.** 18 embedded IRs, no file management, no upload. The 8-occurrence count says this is what most pedalboard builders do.
- **CPU matters.** The IR former is cheap; the convolution cost scales with IR length (68–1000 taps).

### NAM + GxCabinet (the chain) wins when

- **The user has an amp capture they trust and a cab IR they trust, and wants both.** This is the v3 power-user configuration: one NAM amp + one GxCabinet (or a custom IR), with the modeled drives/mods/reverbs downstream. It is the configuration `src/using/nam.md` is built around.

## What this doc did not verify

- **On-device `modgui:label`s and screenshots.** The pi-Stomp was offline during research. The editorial step must fetch these via `http://pistomp.local/effect/image/screenshot.png?uri=<encoded>` and `ssh pistomp@pistomp.local`.
- **A2-instance CPU on a Pi 5.** The plan's "8+" figure is not verifiable from source; the editorial should cite the `using/nam.md` ceiling instead, or run an on-device benchmark (the `ModelTest` binary in `NeuralAudio` releases is the upstream-blessed measuring tool).
- **NAM plugin build flags on the device.** The plugin ships as a binary apt dependency, not built from a debpkg in `pi-gen-pistomp`. Whether `MULTIFRAME_8X8_CONVOLUTION=8`, `BUILD_STATIC_INTERNAL_NAMA2=ON`, and `NAM_ENABLE_A2_FAST=ON` are set in the build is not visible in this repo. If the editorial needs to claim a specific flag, it must be confirmed by querying the device or the build pipeline owner.
- **VeJa cabsim topology.** Source not located. Treat as closed until a repo surfaces.
- **brummer10 `urn:brummer:*` plugins' DSP.** PreAmpTubes, PowerAmpTubes, PreAmpImpulses, PowerAmpImpulses have no public repo. Same status.
- **Amp Profiler (`faustlv2.bitbucket.io`).** Source not located. Same status.
- **The 7th-slot Tonestack scalepoint "Gibsen"** in `gx_amp.ttl:230` is a typo for "Gibson" in the upstream source. Not a finding — the editorial should use the on-device `modgui:label`, which may have been corrected locally.

## Source URLs to cache

Verified to resolve (`git ls-remote`) and added to `src/_data/plugins-source.json`:

| uri | bundle | source_url |
|---|---|---|
| `http://guitarix.sourceforge.net/plugins/gx_cabinet#CABINET` | `gx_cabinet.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_amp#GUITARIX` | `gx_amp.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_amp_stereo#GUITARIX_ST` | `gx_amp_stereo.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_MicroAmp_#_MicroAmp_` | `gx_MicroAmp.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_studiopre#studiopre` | `gx_studiopre.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_studiopre_st#studiopre_st` | `gx_studiopre_st.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_jcm800pre_#_jcm800pre_` | `gx_jcm800pre.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_jcm800pre_st#_jcm800pre_st` | `gx_jcm800pre_st.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_plexi_#_plexi_` | `gx_plexi.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_supersonic_#_supersonic_` | `gx_supersonic.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_ampegsvt_#_ampegsvt_` | `gx_ampegsvt.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_ultracab_#_ultracab_` | `gx_ultracab.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_uvox_#_uvox_` | `gx_uvox.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_voxbass_#_voxbass_` | `gx_voxbass.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_vmk2d_#_vmk2d_` | `gx_vmk2d.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_blueamp_#_blueamp_` | `gx_blueamp.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_CreamMachine_#_CreamMachine_` | `gx_CreamMachine.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_fenderizer_#_fenderizer_` | `gx_fenderizer.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_redeye#vibrochump` | `gx_redeye.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/XDarkTerror_#_darkterror_` | `XDarkTerror.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/XTinyTerror_#_tinyterror_` | `XTinyTerror.lv2` | `https://github.com/brummer10/guitarix` |
| `http://moddevices.com/plugins/caps/CabinetIII` | `mod-caps-CabinetIII.lv2` | `https://github.com/mod-audio/caps-lv2` |
| `http://moddevices.com/plugins/caps/CabinetIV` | `mod-caps-CabinetIV.lv2` | `https://github.com/mod-audio/caps-lv2` |
| `http://moddevices.com/plugins/caps/ToneStack` | `mod-caps-ToneStack.lv2` | `https://github.com/mod-audio/caps-lv2` |
| `http://github.com/mikeoliphant/neural-amp-modeler-lv2` | `neural_amp_modeler.lv2` | `https://github.com/mikeoliphant/neural-amp-modeler-lv2` |
| `http://aidadsp.cc/plugins/aidadsp-bundle/rt-neural-generic` | `rt-neural-generic.lv2` | `https://github.com/AidaDSP/AIDA-X` |
| `https://github.com/brummer10/FatFrog#_FatFrog_` | `FatFrog.lv2` | `https://github.com/brummer10/FatFrog` |
| `urn:brummer:ratatouille` | `Ratatouille.lv2` | `https://github.com/brummer10/Ratatouille.lv2` |
| `https://github.com/brummer10/VintageAC30` | `VintageAC30.lv2` | `https://github.com/brummer10/VintageAC30.lv2` |
| `urn:distrho:SwankyAmp` | `SwankyAmp.lv2` | `https://github.com/resonantdsp/SwankyAmp` |
| `http://moddevices.com/plugins/mda/Combo` | `mod-mda-Combo.lv2` | `https://github.com/moddevices/mda-lv2` |
| `http://gareus.org/oss/lv2/b_whirl#mod` | `b_whirl_mod` | `https://github.com/pantherb/setbfree` |
| `http://gareus.org/oss/lv2/b_whirl#simple` | `b_whirl` | `https://github.com/pantherb/setbfree` |
| `http://gareus.org/oss/lv2/b_whirl#extended` | `b_whirl_xt` | `https://github.com/pantherb/setbfree` |
| `http://moddevices.com/plugins/mod-devel/cabsim-IR-loader` | `cabsim-IR-loader.lv2` | `https://github.com/mod-audio/mod-cabsim-IR-loader` |

Already cached: `C* AmpVTS`, `C* ToneStack` (via caps-lv2), `TAP Tubewarmth` (tap-lv2), `Valve saturation` and `Tape Delay Simulation` (swh/lv2), `MDA Leslie` (mda-lv2).

Not cached (source not located, despite `git ls-remote` against plausible hosts): `Cabinet` (VeJa cabsim, `VeJaPlugins.com/plugins/Release/cabsim`), `Bass Cabinets` (`VeJaPlugins.com/plugins/Release/BassCab`), `British 1960A` (`VeJaPlugins.com/plugins/Release/veja-1960-cab`), `Amp Profiler` (`faustlv2.bitbucket.io/profiler`), `Amplitude Imposer` (`ndcplugs`), `Guitar Midi` (`geraldmwangi/GuitarMidi-LV2` resolves but is MIDI-only, not amp), `urn:brummer:PreAmps`/`poweramps`/`PreAmpImpulses`/`PowerAmpImpulses`, `Amplifier` (`drobilla.net/plugins/blop/amp` — blop source is at `drobilla/blop` but it is a gain stage, not a sim, so not editorially worth caching), `EveryTrim` (already cached via airwindows), `Cabinet Loader` (`mod.audio/plugins/CabinetLoader` — mod.audio is the commercial MOD Audio namespace; no public repo).

## Audit findings (handed off, not blocking)

- `src/using/nam.md`'s "About 10 at once" / "About 4 at once" figures are presented as ceilings with explicit caveats. They are consistent with the source-level facts in this doc. The plan's "8+ A2 instances" figure is a stronger claim than the source supports; `using/nam.md` does not repeat it, and the editorial should not either.
- `plugins-source.json` had no entry for `GxAmplifier-X`, `GxCabinet`, `GxAmplifier Stereo`, or any of the standalone guitarix amp variants despite the guitarix repo being cached for other guitarix plugins. Fixed in this pass (21 new entries).
- `plugins-source.json` had no entry for the NAM LV2 plugin itself. Fixed.
- The CAPS EQ source URL pattern (`mod-audio/caps-lv2`, added in doc 19) is reused here for `CabinetIII`, `CabinetIV`, `ToneStack`, and `AmpVTS` (already present).