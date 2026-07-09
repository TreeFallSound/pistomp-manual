# rakarrack LV2 Suite — the Non-Dynamics Effects at the Source Level

Docs 14 and 16 covered the dirt (StompBox, Fuzz, Distorsion, Derelict, DistBand, Valve, Exciter) and the dynamics (Compressor, Sustainer, Expander, CompBand). This doc reads everything else in `rkr-labs.lv2` (upstream `github.com/ssj71/rkrlv2`): delays, reverbs, pitch, filters/wah, modulation, EQ/utility, and the two special effects (Vocoder, Arpie). It establishes what each plugin's DSP actually is, corrects several doc-14 leads, and flags three more plugins that ship dry-by-default.

## Methodology

Read the DSP from the upstream clone (HEAD `0e6d6e0`, shallow, verified live with `git ls-remote`), not the names or `rdfs:comment`:

- The LV2 wrapper `lv2/rkrlv2.C` (URI → C++ class map, per-plugin construction args, preset locks) and `lv2/rkrlv2.h` (the 48 `*_URI` `#define`s).
- The shared primitives: `AnalogFilter.C` (RBJ biquad type table), `EffectLFO.C` (11 LFO shapes), `delayline.C/.h` (Ryan Billing interpolated delay), `Resample.*` / libsamplerate, `smbPitchShift.C` (Stephan Bernsee phase vocoder), `FilterParams.C`/`Filter.C`, `RBFilter.*`, `FormantFilter.*`.
- Each effect's `.C`/`.h`: Echo, MusicDelay, Echotron, RBEcho, Reverb, Reverbtron, Infinity, Harmonizer, StereoHarm, Shifter, Sequence, DynamicFilter, RyanWah, Synthfilter, MBVvol, Opticaltrem, Vibe, Ring, Pan, Alienwah, Chorus, Dual_Flange, APhaser, EQ, Cabinet, CoilCrafter, ShelfBoost, Shuffle, Vocoder, Arpie.
- Cross-checked construction args and defaults against the installed TTL in `~/lv2/rkr-labs.lv2/*.ttl` and the wet/dry crossfader `wetdry_mix` (`rkrlv2.C:177`).
- Names/URIs/bundle checked against `src/_data/plugins.json` (queried with python, never read whole). All 43 `rkr` `uri`s already resolve to `github.com/ssj71/rkrlv2` in `plugins-source.json`; asserted each appears exactly once with the correct `source_url`. I did not touch that file, and I did not disassemble `rkrlv2.so` — class identities come from the `new <Class>` calls in the wrapper.

Where a fact is inferred rather than read from source, it is labelled.

### The class map (verified from `rkrlv2.C`)

Every URI's init function calls exactly one effect `new`. Several plugins are the same C++ class wired differently — that is the point of this table:

| Plugin (doap:name) | URI frag | C++ class | Note |
|---|---|---|---|
| rkr EQ | `eql` | `EQ` | 16-band AnalogFilter bank |
| rkr Parametric EQ | `eqp` | **`EQ`** | same class as EQ, fewer bands exposed |
| rkr Cabinet | `cabe` | **`Cabinet` → owns an `EQ`** | cab voicing = EQ presets, not convolution |
| rkr WahWah | `wha` | **`DynamicFilter`** | ZynAddSubFX filter, selectable type |
| rkr MuTroMojo | `MuTroMojo` | **`RyanWah`** | Ryan Billing dedicated auto-wah |
| rkr Echoverse | `Echoverse` | `RBEcho` | Ryan Billing reverse/subdiv echo |
| rkr VaryBand | `VaryBand` | `MBVvol` | 4-band, two LFOs on band volume |
| rkr Analog Phaser | `aphas` | `Analog_Phaser` (`APhaser.C`) | FET-modelled, up to 12 stages |
| rkr Flanger/Chorus | `chor` | `Chorus` | Zyn chorus/flanger |
| rkr Dual Flange | `Dual_Flange` | `Dflange` | two 55 ms flangers |

**Doc-14 correction #1 (class swap):** doc 14 wrote "MuTroMojo (DynamicFilter)". It is backwards. **WahWah is `DynamicFilter`; MuTroMojo is `RyanWah`.** They are different files with different topologies (below).

**Doc-14 correction #2 (FFT backend):** doc 14 said the pitch shifters run "`smbPitchShift` over `mayer_fft`". The LV2 build does not. `lv2/CMakeLists.txt:43` compiles `smbPitchShift.C`, which is the **FFTW3** implementation (`fftw_plan_dft_1d`, `FFTW_MEASURE` at construction). `smbPitchShift_mayerfft.C` exists but is only for the fftw-less standalone. Cost still applies; the backend claim was wrong.

### Ghosts: three URIs in the code that do not ship, and one shipping URI with no code

- **`#har` "rkr Harmonizer" (with MIDI) is a phantom.** `HARMLV2_URI` is `#define`d (`rkrlv2.h:42`) but **never used** — there is no `harmlv2_descriptor`, no `init_harmlv2`, and no `case` returning it in `lv2_descriptor()`. The binary cannot instantiate it. Yet `plugins.json` lists `rkr Harmonizer | #har`. The only harmonizers the binary can load are `#har_no_mid` (`Harmonizer` class) and `#StereoHarm_no_mid` (`StereoHarm`). Treat the `#har` row as dead. (The `Harmonizer` class *does* read MIDI internally via `PMIDI`; nobody wired a descriptor to expose it.)
- **`Phaser` (`#phas`), `Gate` (`#gate`), `Convolotron` all compile but are not in `plugins.json`.** `#phas` and `#gate` even have descriptors returned by `lv2_descriptor()`, but no manifest entry advertises them; `Convolotron` has no URI at all. So the suite ships **one** phaser (Analog Phaser), no gate (doc 16 already established the Expander is the gate), and no Convolotron. Doc 14's reverb family listed "Convolotron" — it does not ship. Its convolution engine survives only inside Reverbtron.
- **Local-manifest vs image note.** The Mac's `~/lv2/rkr-labs.lv2/manifest.ttl` advertises only 38 of the 43, omitting `#dist`, `#eqp`, `#reve`, `#StompBox_fuzz`, and the phantom `#har` — even though their per-plugin `.ttl` files sit in the same directory and the binary has descriptors for the first four. That is a stale/trimmed local install; `plugins.json` (built from the device image) is authoritative for the shipping set. The only genuinely un-loadable entry is `#har`.

---

## Shared DSP primitives

Almost every effect below is assembled from six building blocks. Describe them once:

| Primitive | What it is | Used by |
|---|---|---|
| `AnalogFilter` | RBJ "Audio EQ Cookbook" biquad. Integer `type`: 0/1 = 1-pole LP/HP, 2/3 = 2-pole LP/HP, 4 = BPF, 5 = notch, 6 = peaking, 7 = low-shelf (and higher = high-shelf). `stages` cascades biquads. | EQ, Cabinet, CoilCrafter, ShelfBoost, Shuffle, Vocoder, crossovers everywhere |
| `RBFilter` | Ryan Billing's state-variable filter (interpolated cutoff, resonance). | MuTroMojo, Infinity, Echotron, Sequence |
| `EffectLFO` | 11 shapes (`getlfoshape`): sine, triangle, ramp±, zigzag, mod-square, mod-saw, two Lorenz-fractal chaos modes, sample/hold random, tri-top. Freq in BPM-ish units (`incx = Pfreq·PERIOD/(SR·60)`). Stereo phase spread. | every modulation effect |
| `delayline` | Interpolated fractional delay, multi-tap, with reverse playback + wrap-envelope and a built-in `get_phaser`. Ryan Billing. | Echo, Echoverse, Chorus, Dual Flange, Sequence, Echotron |
| `Resample` | libsamplerate (SRC) up/down sampler. | Waveshapers (dirt) and the pitch shifters' pre/post rate change |
| `PitchShifter` | Bernsee STFT phase vocoder over **FFTW3**. Frame ≤ 2048, `osamp = 4` (hop = frame/4). Pre-downsampled by SRC (`DS = 5`) before the FFT, upsampled after. | Harmonizer, StereoHarm, Shifter, Sequence |

Provenance up front, from the file headers: the ZynAddSubFX lineage (Nasca Octavian Paul) supplies EQ, Chorus, Alienwah, Reverb, Echo, MusicDelay, DynamicFilter, RyanWah, Shuffle, Synthfilter, MBVvol; Ryan Billing (aka Transmogrifox) wrote or reworked delayline, Echotron, Reverbtron, Infinity, Vibe, Opticaltrem, Dual Flange, Analog Phaser, Sequence, Vocoder; Josep Andreu wrote Pan, Harmonizer, StereoHarm, Shifter; Ring and CoilCrafter are adapted from Steve Harris swh-plugins; Cabinet is Spencer Jackson's. All GPL-2.0 except Sequence (GPL-3.0 header). **pi-Stomp ships these; it did not write them.**

---

## Delays

| Plugin | Class | Structure | Standout mechanism |
|---|---|---|---|
| rkr Echo | `Echo` | 2 s stereo `delayline`, single tap | `Preverse` plays the buffer backward via `delayline(…,reverse=1)`; one-pole `Phidamp` treble loss in the feedback path |
| rkr Musical Delay | `MusicDelay` | Two independent delay lines (`delay1/delay2`) with L/R offset (`Plrdelay`) and per-line feedback | tempo-set (`Ptempo`, BPM), two-tap "musical" subdivisions; ping-pong via the L/R offset |
| rkr Echoverse | `RBEcho` | 2 s `delayline` with **3 taps** + `Psubdiv` note subdivision + reverse | subdivided multi-tap reverse echo — the "verse" is the reverse/subdiv trick, not reverb |
| rkr Echotron | `Echotron` | Up to **128 taps** loaded from a `.dly` text file, each tap with pan/level/time and its **own RBFilter** (LP/BP/HP), plus two `EffectLFO`s (one modulates tap times, one modulates filter cutoffs) | file-driven rhythmic multi-tap with per-tap filtering and modulation. `changepar(4,1)` in the wrapper locks it to user-loaded files |

Echotron is the one that earns attention. `ECHOTRON_F_SIZE = 128` taps (`Echotron.h:33`), 6-second buffer, each tap is a resonant RBFilter you can sweep with `dlfo`. Nothing else in the suite does patterned, filtered, modulated multi-tap; a plain delay cannot reproduce it. The `.dly` file format is the catch — you configure it by editing a text table, not from the MOD-UI.

Echoverse (`RBEcho`) and Musical Delay are competent but ordinary; Echo is a plain reverse-capable single delay.

---

## Reverbs

| Plugin | Class | Structure |
|---|---|---|
| rkr Reverb | `Reverb` | ZynAddSubFX / Freeverb-style: **8 comb filters + 4 allpass per channel** (`REV_COMBS 8`, `REV_APS 4`, `global.h:83`), comb feedback ≈ −0.97, comb lengths randomised 800…2200 samples, LP/HP band limiting (22 kHz / 20 Hz). |
| rkr Reverbtron | `Reverbtron` | **Block convolution** against an impulse loaded from a `.rvb` file: up to 10 s (`convlength = 10`), taps stretched/decayed by `convert_time()` (`Pstretch`, `Plength`, `Pfade`). `changepar(4,1)` locks it to user files. |
| rkr Infinity | `Infinity` | Not a reverb — a **barber-pole / Shepard filter sweep**: 8 `RBFilter` bands (`NUM_INF_BANDS 8`) whose cutoffs ramp continuously (`ramp *= rampconst`, wrap-around) while a per-band quadrature oscillator (`sinp/cosp`) modulates band level. The infinitely rising/falling filter effect. |

Reverbtron is the genuinely interesting one: a real convolution reverb driven by loadable impulses, which no algorithmic reverb reproduces exactly. It is also the most expensive plugin in the suite (see CPU flags). The plain `Reverb` is a stock 8×4 Schroeder/Freeverb network — fine, but a dedicated image reverb tuned for the Pi will usually sound better and cost less. Infinity is a special-effect texture generator (barber-pole flanger), not a room.

---

## Pitch

All four share `PitchShifter` (FFTW3 STFT, frame ≤ 2048, `osamp = 4`), pre/post SRC resampling by `DS = 5`.

| Plugin | Class | Structure |
|---|---|---|
| rkr Harmonizer (no midi) | `Harmonizer` | One pitch shifter. `Pinterval` sets ratio `2^((interval−12)/12)`. Window size scales with interval (2048 for small shifts down to 256 for large, `Harmonizer.C:257–321`) to trade latency for artefacts. Bundles a `Recognize` note tracker + `RecChord` so it can follow the input without MIDI. |
| rkr StereoHarmonizer (no midi) | `StereoHarm` | **Two** pitch shifters (`PSl`, `PSr`), independent L/R intervals plus a `chrome` detune — so double the FFT cost. |
| rkr Shifter | `Shifter` | Single pitch shifter, continuous fine/coarse shift, no note tracking. The plain transposer. |
| rkr Sequence | `Sequence` | A pitch **step-sequencer**: one pitch shifter fed a stepped ratio, driven by a `beattracker` and a `delayline`, gated through several RBFilters (RMS/peak envelope). Steps a melodic/pitch pattern in time with the input. |

Functional but artefact-prone on transients (phase-vocoder smear), and the heaviest CPU class in the suite. Sequence is the novel one — a rhythmic pitch stepper you cannot get elsewhere — if you have the headroom. StereoHarm costs two FFT pipelines; budget accordingly.

---

## Filters and wah

| Plugin | Class | Structure |
|---|---|---|
| rkr WahWah | `DynamicFilter` | ZynAddSubFX `FilterParams` (selectable filter type/stages), swept by `EffectLFO` **and** an envelope follower (`ms1…ms4` smoothed RMS × `ampsns`). "WahWah and others" — a general LFO/envelope filter, not a fixed wah voice. |
| rkr MuTroMojo | `RyanWah` | Dedicated auto-wah: `RBFilter` state-variable band + a **630 Hz sidechain highpass** feeding the envelope, LFO with a ×5 depth "mode", three-pole `fbias` smoothing. Ryan Billing's Mu-Tron-style follower. This is the real envelope wah. |
| rkr Synthfilter | `Synthfilter` | Analog-modelled **phaser/allpass** bank (`MAX_SFILTER_STAGES`), swept by LFO `width` + `depth` + envelope `sns`, with a "Subtract Output" toggle (notch vs. peak phasing). Transmogrifox analog modelling over the Zyn structure. |
| rkr VaryBand | `MBVvol` | 4-band split at **500 / 2500 / 5000 Hz**, each band's volume modulated by one of **two** `EffectLFO`s → rotating multiband tremolo / auto-panning-across-frequency. |

**Doc-16 consistency (crossover null):** VaryBand's crossovers are built exactly like CompBand's — `AnalogFilter` type 2/3, Q = 0.7071, single biquad (`MBVvol.C:51–62`). These are **2nd-order Butterworth pairs, not Linkwitz-Riley**, so `LP+HP` nulls at each corner (200 Hz analysis in doc 16 applies here at 500/2500/5000 Hz). With bands at unity you get notches; the effect only "fills in" as the LFOs push bands to different gains. It is a tremolo texture, not a transparent multiband.

MuTroMojo is the pick here: a proper, cheap envelope wah. WahWah and Synthfilter are useful LFO/envelope filters; both are more general and less immediately "wah" than their names imply.

---

## Modulation and tremolo

| Plugin | Class | Structure |
|---|---|---|
| rkr OpticalTrem | `Opticaltrem` | Models an **optical tremolo cell**: lamp curve `lfo^1.9` driving a Cds photocell (`Ra` 1 MΩ dark, `Rb` 300 Ω lit, `Rp` 100 kΩ parallel, `R1` 2.7 kΩ series). Amplitude tremolo with the lag/asymmetry of a real LDR, not a raw LFO multiply. |
| rkr Vibe | `Vibe` | **Uni-Vibe**: photocell-modelled phase stages, `Ra = 500 kΩ` dark cell, lamp turn-on curve `2 − 2/(lfo+1)`, per-stage variable "resistance", lamp time-constant smoothing (`lampTC`). A credible uni-vibe, not a plain phaser. |
| rkr Ring | `Ring` | Ring modulator: internal oscillator (sine/tri/saw/square via phase accumulation, `Pfreq` 1–20000 Hz) multiplied with the input; optional `Recognize` note-tracking to tune the carrier to the played pitch. |
| rkr Pan | `Pan` | Auto-pan / stereo tremolo, `EffectLFO`-driven. Josep Andreu. Stock. |
| rkr AlienWah | `Alienwah` | ZynAddSubFX AlienWah: complex-coefficient feedback allpass (`COMPLEXTYPE` multiply, `clfol.a/.b` rotate with the LFO). The "vowel-y" between-phaser-and-wah timbre. |
| rkr Flanger/Chorus | `Chorus` | `delayline` modulated by `EffectLFO`, `Pflange` toggles the short-delay flange range. Stock Zyn chorus/flanger. |
| rkr Dual Flange | `Dflange` | Two flangers (four 55 ms `delayline`s, `set_averaging` de-zippering), Transmogrifox. Thicker, barber-pole-capable flange. |
| rkr Analog Phaser | `Analog_Phaser` | FET-modelled phaser, up to **12 stages** with per-stage component mismatch (`offset[0..11]`) and a nonlinear FET term (`distortion`). The best-voiced modulator of the group. |

Vibe (uni-vibe), OpticalTrem (real optical-cell trem), and Analog Phaser (FET phaser) are the three worth a look — each carries actual component modelling rather than a bare LFO. Ring is a capable ring-mod with pitch tracking. Chorus/Dual Flange/AlienWah/Pan are fine but have equivalents already on the image.

---

## EQ and utility

| Plugin | Class | Structure |
|---|---|---|
| rkr EQ | `EQ` | 16-band (`MAX_EQ_BANDS 16`) `AnalogFilter` bank; each band any RBJ type (peaking default), settable freq/gain/Q. The engine. |
| rkr Parametric EQ | `EQ` | **Same class**, wired for a few parametric bands. Not a different DSP — a different port layout over the 16-band engine. |
| rkr Cabinet | `Cabinet` → `EQ` | Cab emulation = **fixed EQ curves**, not IR convolution. `Cabinet` owns an `EQ` and pours per-model peaking bands into it (`Pmodel` selector). Do not expect a convolution cab. |
| rkr Coil Crafter | `CoilCrafter` | Pickup-voicing: two peaking bands sweepable to pickup formant presets (`tfreqs` = 4000/4400/4200/2900/3000/2700/3300/3300/2800 Hz) + a `HarmEnhancer` (2500/4400 Hz). "Fake a different pickup." Adapted from Steve Harris `harmonic_gen`. |
| rkr Shelf Boost | `ShelfBoost` | Single `AnalogFilter` type 7 low-shelf at 3200 Hz (freq/gain settable). A one-band shelf. |
| rkr Shuffle | `Shuffle` | Stereo-width "shuffler": 4 peaking `AnalogFilter`s (300/1200/2400/8000 Hz, Q 0.3) band-split then width-shaped. Despite a copy-pasted "Distorsion"/Zyn header, it is a Blumlein-style stereo widener, not distortion. Niche for a mono guitar rig. |

EQ, Parametric EQ and Cabinet are one engine in three dresses. Coil Crafter is the single genuinely useful specialty tool here (pickup re-voicing + harmonic lift). Shelf Boost is trivial; Shuffle is a stereo tool with little use in a mono chain.

---

## Special

| Plugin | Class | Structure |
|---|---|---|
| rkr Vocoder | `Vocoder` | Analysis/synthesis filterbank vocoder: `VOC_BANDS` bandpass triples (signal / carrier-aux / output), centres spread `i·20000/VOC_BANDS`. Needs a **carrier routed into the aux input** (`VOCODER_AUX_IN`). |
| rkr Arpie | `Arpie` | Not a MIDI arpeggiator — a **delay-line arpeggio echo** (Transmogrifox): a `delayline` re-triggered on a semitone `pattern[]` table (`NUM_PATTERNS`), tempo/subdivision set, `delay = 60/(subdiv·Pdelay)·SR`. Steps a fixed interval pattern out of the delay buffer. |

Vocoder works but wants a second source into the aux input — awkward to route on pi-Stomp, and cost scales linearly with band count. Arpie is a self-contained rhythmic pitch-echo (no MIDI required), a fun novelty.

---

## Standouts worth a musician's attention

Ranked by "does something the image can't already do cheaply":

1. **Echotron** — 128-tap, per-tap-filtered, LFO-modulated pattern delay from `.dly` files. Nothing else reproduces it.
2. **MuTroMojo** — a real Mu-Tron-style envelope auto-wah (RyanWah), cheap and immediate.
3. **Vibe** — photocell-modelled uni-vibe, not a fake phaser.
4. **Reverbtron** — genuine convolution reverb from loadable `.rvb` impulses (CPU permitting).
5. **Analog Phaser** — 12-stage FET-modelled phaser with stage mismatch and nonlinearity.
6. **OpticalTrem** — optical-cell tremolo with the lag and asymmetry of a real LDR.
7. **Coil Crafter** — pickup re-voicing EQ + harmonic lift, a specific tool with no image equivalent.
8. **Sequence** — rhythmic pitch step-sequencer (novelty, but unique).

## Superseded / skip on the image

| Plugin | Why |
|---|---|
| rkr EQ / Parametric EQ / Cabinet | Same 16-band `AnalogFilter` engine; Cabinet is EQ presets, not an IR cab. Dedicated EQ/cab-sim plugins beat them. |
| rkr Reverb | Stock 8-comb/4-allpass Schroeder network; a tuned image reverb wins on sound and cost. |
| rkr Flanger/Chorus, Dual Flange, AlienWah, Pan | Ordinary LFO modulation; equivalents already ship. |
| rkr Shelf Boost | One low-shelf biquad. Trivial. |
| rkr Shuffle | Stereo widener; little use in a mono guitar rig. |
| rkr Echo, Musical Delay, Echoverse | Competent plain delays; nothing the image lacks. |
| rkr Shifter, Harmonizer (no midi), StereoHarmonizer | FFT-heavy, artefact-prone; StereoHarm doubles the cost. |
| rkr Harmonizer (`#har`) | **Phantom — cannot load** (no descriptor in the binary). |

## CPU flags (from source dimensions, on one shared Pi core)

- **Reverbtron / (Convolotron)** — direct convolution against up to a 10 s impulse. Cost scales with impulse length; the heaviest single plugin. Reverbtron ships; Convolotron does not.
- **FFT pitch (Harmonizer, StereoHarm, Shifter, Sequence)** — FFTW3 STFT, 2048-point frame, `osamp = 4` → an FFT+IFFT every 512 samples, per voice. **StereoHarm runs two pipelines.** Sequence adds a beat tracker and delay line. Pre/post SRC resampling softens but does not remove the cost.
- **Vocoder** — `3 × VOC_BANDS` biquads per sample; cost linear in band count.
- **VaryBand / (CompBand)** — four bands, six crossover biquads per channel plus two LFOs; moderate, and it nulls at crossovers (Butterworth, not L-R).
- **Echotron** — up to 128 interpolated taps each with an RBFilter, plus two LFOs; heavier than a plain delay, lighter than convolution.
- The modulation/EQ/single-delay effects (Vibe, OpticalTrem, Analog Phaser, MuTroMojo, Ring, Pan, Chorus, EQ, ShelfBoost, CoilCrafter, Echo) are cheap — a handful of biquads/delay taps.

## Bad defaults — plugins that ship sounding bypassed

The wrapper's `wetdry_mix` (`rkrlv2.C:177`): with mix `< 0.5`, dry gain = 1.0 and wet gain = `2·mix`. So **Wet/Dry = 0 means fully dry (effect inaudible).** From the installed TTL defaults:

| Plugin | Wet/Dry default | Effect on load |
|---|---|---|
| rkr MuTroMojo | **0** | silent effect — sounds bypassed |
| rkr Vocoder | **0** | silent effect (and needs an aux carrier too) |
| rkr Synthfilter | **0** | silent effect — sounds bypassed |
| rkr CompBand | 5 (≈0.04) | nearly dry (doc 16) |

This is the same trap doc 16 found on CompBand, now confirmed on three more. Turn Wet/Dry up before judging MuTroMojo, Vocoder, or Synthfilter. (Echotron, Reverbtron, Vibe, Ring, Infinity all default Wet/Dry = 64 ≈ 50/50 and are fine.)

## Corrections to doc 14

| Doc 14 claim | Reality (source) |
|---|---|
| "MuTroMojo (DynamicFilter)" | Swapped. **WahWah = `DynamicFilter`; MuTroMojo = `RyanWah`.** Different files, different topologies. |
| Pitch shifters "call `smbPitchShift` over `mayer_fft`" | LV2 build compiles `smbPitchShift.C` = **FFTW3**. mayer_fft is standalone-only. |
| Reverb family "Reverb, Reverbtron, Infinity, Echoverse … Convolotron convolves" | **Convolotron does not ship** (no URI). Echoverse is a delay (`RBEcho`), not a reverb. Infinity is a barber-pole filter, not a room. |
| (implicit) 43 loadable plugins | **`#har` "rkr Harmonizer" cannot load** — defined URI, no descriptor. 42 are loadable from this binary; `#phas`, `#gate`, Convolotron compile but aren't advertised. |
| Cabinet as a cab (unstated as EQ) | Cabinet = fixed **EQ** curves (`Cabinet` owns an `EQ`), not IR convolution. |

## Coverage note — every `rkr` plugin and whether I introspected it

Introspected here (this doc), non-dynamics: EQ, Parametric EQ, Cabinet, WahWah, MuTroMojo, Synthfilter, VaryBand, Echo, Musical Delay, Echotron, Echoverse, Reverb, Reverbtron, Infinity, Harmonizer (no midi), StereoHarmonizer (no midi), Shifter, Sequence, OpticalTrem, Vibe, Ring, Pan, AlienWah, Flanger/Chorus, Dual Flange, Analog Phaser, Coil Crafter, Shelf Boost, Shuffle, Vocoder, Arpie — **31 plugins**. Plus the phantom **Harmonizer (`#har`)**, examined and found un-loadable — **32 URIs touched**.

Out of scope, already covered: dynamics (Compressor, Sustainer, Expander, CompBand — doc 16); distortion (StompBox, Fuzz, Distorsion, Derelict, DistBand, Valve, Exciter — doc 14, class identities re-confirmed against the wrapper but not re-analysed) — **11 plugins**.

32 + 11 = 43 = every `rkr` entry in `plugins.json`. Data file `plugins-source.json` verified: all 43 `uri`s present exactly once, `source_url = https://github.com/ssj71/rkrlv2`. Not modified.
