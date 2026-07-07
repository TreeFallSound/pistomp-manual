# LV2 Reverb Plugin Research: BigSky Replacements for pi-Stomp

**Target sound:** Joseph D'Agostino (Cymbals Eat Guitars) shoegaze/atmospheric textures — BigSky **Shimmer** (octave-up reverb tail) and **Cloud** (granular ambient) modes are the priority.

## Sources downloaded to `/tmp/research-bigsky/`

| Plugin | Source repo | Key file |
|---|---|---|
| DragonflyHall/Plate | `michaelwillis/dragonfly-reverb` | `common/freeverb/zrev2_t.hpp`, `plugins/dragonfly-{hall,plate}-reverb/DSP.{hpp,cpp}` |
| gx_zita_rev1, gx_shimmizita | `brummer10/guitarix` | `trunk/src/Plugins/zita_rev1.dsp`, `trunk/src/LV2/gx_shimmizita.lv2/shimmizita.cc`, `trunk/src/LV2/faust/shimmizita.inc` |
| TheCloud | `sensorium/sensorium-plugins` | `Pd/TheCloud.pd`, `Pd/vgrain.pd` |
| Shiroverb | `ninodewit/SHIRO-Plugins` | `plugins/shiroverb/gen_exported.cpp`, `DistrhoPluginInfo.h` |
| Airwindows (Galactic, PocketVerbs) | `airwindows/Airwindows` + `hannesbraun/airwindows-lv2` port | `src/Galactic/Galactic.c`, `src/PocketVerbs/PocketVerbs.c` |

(Discovered via the mod-plugin-builder `shiro-plugins` and `sensorium-plugins` package manifests; TheCloud is a Pure Data patch compiled to C via hvcc/Heavy, Shiroverb is a Max/MSP Gen~ export compiled via DPF.)

## Ranking (best → worst for D'Agostino's shoegaze/ambient use)

### 🥇 **1. gx_shimmizita — THE shimmer winner**

Faust-generated C (`shimmizita.cc`, 784 lines) wrapping the **zita-rev1 8×8 FDN** (8 delay lines, Hadamard feedback matrix, per-line low-pass + high-shelf damping absorption filters, 4 Schroeder allpass diffusers on the input) with a **parametric pitch-shifter bank embedded inside the FDN feedback loop** (`shimmizita.inc`: `shimmizita_rev_fdn = ... ~ (delayfilters : pitchshifters : fbdelaylines)`). Each of the 8 delay lines has its own `par_ps` pitch shifter — a 2-tap crossfading variable-delay (2048-sample window, 1024-sample crossfade) transposer driven by an envelope-followed LFO. `SHIFT` is ±6 semitones, `MODE` controls inter-line correlation, `SPEED`/`DEPTH`/`CONTROL` drive the envelope-modulated pitch wobble.

This is the **classic Valhalla Shimmer / Eventide Blacktail architecture**: pitch shifting *inside* the recirculating loop means each iteration shifts again, so the tail climbs/octave-cascades exponentially into an ethereal ascending shimmer cloud — exactly the BigSky Shimmer behavior. Decay 1–8 s, HF damping 1.5–23 kHz, crossover 50–1000 Hz — full proper FDN, not a cheap Schroeder chain. Code quality is dense but correct Faust output. **This is the single best BigSky-Shimmer replacement on the device.**

### 🥈 **2. Shiroverb — strong shimmer runner-up**

Max/MSP Gen~ export (`gen_exported.cpp`, 656 lines). Self-described (`DistrhoPluginInfo.h`) as "Gigaverb-genpatch + Pitch-Shift-genpatch," ported from Juhana Sadeharju's Gigaverb. It is a **proper FDN** (12 delay lines: 4 recirculating `m_delay_20-23` with exponential-decay feedback, plus allpass-diffuser chain `m_delay_11-16` and a Schroeder-style tone filter) preceded by a **4-voice granular pitch shifter**: 4 cos²-windowed (`cos²(sub*π)` = Hann²) overlap-add grain taps reading from a 96,000-sample (2 s @ 48 kHz) delay line, advanced by a `Phasor` at `(1-ratio)*10` Hz with `Sah` sample-and-hold gate triggering. `RATIO` ranges 0.5–2.0 → **full octave-up shimmer available**.

The critical difference vs. shimmizita: the pitch shifter sits **before** the FDN, not inside the feedback loop (`mix_225` = bandwidth-filtered pitch-shifted signal → `m_delay_14` allpass → FDN writes). So the octave-up is applied once on the input; the reverb tail then decays naturally rather than cascading upward indefinitely. You still get a gorgeous octave-up reverb tail, but it's a "single-shift shimmer" (closer to BigSky Shimmer at low mix) rather than an infinite ascending cascade. Gigaverb is also a touch sparser/denser-sounding than zita. Still excellent — and its granular grain engine is the same primitive BigSky Cloud is built on, so it has a grainy texture shimmizita lacks.

### 🥉 **3. TheCloud — THE cloud winner (granular ambient)**

Pure Data patch (`Pd/TheCloud.pd`, 273 KB) compiled to C via hvcc/HeavyDPF. Self-described in `thecloud.json` as "Granular delay ported from Pure Data." Architecture: a single 2-second `delwrite~ $0-delay` delay line fed by the input, then **20 instances of `vgrain`** (`Pd/vgrain.pd`) reading from it with `delread4~` (4-point interpolated variable delay). Each `vgrain` triggers a grain: ramped delay position (`line~`), windowed by `tabread~ cos` (cosine/Hann window), panned L/R via equal-power `cos/sin`, with a `grain-ready` spigot gate. Controls: `grainsPerSec` (1–80), `avgGrainDuration` (10–900 ms), `detune`, `density`, `flow`, `mix`, `env_type` (cos/quad).

This is a **textbook granular delay / cloud synthesizer** — exactly the BigSky "Cloud" algorithm family. It is *not* a reverb in the strict sense (no FDN, no allpass tail); the "reverb" effect is the dense cloud of randomized grains recirculating through the 2 s delay. But for atmospheric, ambient, bloom-like textures it's the closest thing on the device to BigSky Cloud/Bloom. Pair it with shimmizita in a chain for the full D'Agostino wall-of-sound. Note: heavy at high grain counts on a Pi 4/5 (20 grain voices of `delread4~` interpolation per sample).

### 4. DragonflyHallReverb — best pure hall (no shimmer/cloud)

Uses the **freeverb3 (fv3) `zrev2` class** (`common/freeverb/zrev2.hpp`: "Simple FDN Reverb based on zita-rev1," Fons Adriaensen's design, extended by Teru Kamogashira with `idiffusion1`, `wander`/modulated comb length, low/high crossover RT60 multipliers). Hall = `earlyref_f` (early reflections) + `zrev2_f` (late FDN). It's a **proper, well-engineered FDN** with modulated delay lines (gives chorale-like modulation) and band-split decay — a genuine BigSky Hall/Chorale equivalent. **No pitch shifter, no granular layer.** Decay up to ~10 s, dense and smooth. This is the most "professional-sounding plain reverb" on the device and the right choice for the Hall/Plate side of the BigSky if you're not chasing shimmer.

### 5. DragonflyPlateReverb — best plate

Uses fv3's `nrev_f` + `nrevb_f` (the Stanford/NRev plate algorithm: comb-bank → multi-stage allpass cascade → tonal correction LPF/HPF, with a damping-LPF added in the Dragonfly wrapper). Schroeder-style comb+allpass but at NRev scale (8 combs, 7 allpasses per channel, second allpass bank in NRevB) — a real plate simulation, not a toy. No pitch shift, no granular, no modulation. Best BigSky **Plate** replacement.

### 6. gx_zita_rev1 — clean reference FDN, no shimmer

The raw `re.zita_rev1_stereo` Faust lib function (`zita_rev1.dsp`, 99 lines): 8-delay-line FDN, two-band T60 decay (low/mid), HF damping, plus Regalia–Mitra peaking EQs on the output. Identical core to what shimmizita builds on, minus the pitch shifter. Beautiful, transparent, the canonical Linux hall reverb — but for shoegaze-atmospheric use it's the *boring* option. Use it as a clean send when you want space without texture.

### 7. Airwindows-Galactic — modulated "thunder" reverb, no pitch shift

12 delay lines in a **3-stage (4→4→4) cross-subtracted mixing network** with L/R cross-coupled feedback, a vibrato-modulated 256-sample predelay (`vibM` sine LFO with `detune`-driven rate), an IIR brightness filter, and a "thunder" dither. This is Airwindows' idiosyncratic take on a modulated FDN — chorale-style modulation is built in and the long decay (delays up to 15k samples, `bigness` scales all) gives a lush, slightly wobbling ambient wash. **No pitch shifter, no granular engine.** Great for atmospheric pads, closer in spirit to BigSky Chorale/Bloom than to Shimmer/Cloud. CPU-light.

### 8. Airwindows-PocketVerbs — 6 Schroeder-allpass verbs (weakest)

13,609-line C file implementing 6 algorithms via a `case` switch: **Chamber, Spring, Tiled, Room, Stretch, Zarathustra**. Every algorithm is a long **allpass-chain** Schroeder reverb (`constallpass` feedback, `dAL[1..3]` averaging taps) — no FDN, no proper absorption filters, no pitch shift, no granular. "Stretch" and "Zarathustra" add multi-tap averaging for metallic/atmospheric color but stay in the cheap-allpass family. Gating is envelope-driven wet/dry. Sounds lo-fi and metallic next to Dragonfly or zita; useful only as a special-effect color, not as a BigSky substitute.

## Verdict

- **Best Shimmer (D'Agostino's #1 need): `gx_shimmizita`** — only plugin on the device with a pitch shifter *inside* the FDN feedback loop, producing the cascading octave-up tail that defines the BigSky Shimmer. Set `SHIFT` to +12, `PSDRYWET` ~0.7, `T60M` ~6 s.
- **Best Cloud (ambient granular): `TheCloud`** — only true granular engine on the device (20-window grain cloud from a 2 s delay line). Chain it *after* shimmizita for the full BigSky Shimmer+Cloud shoegaze wall.
- **Best plain reverb foundation (Hall/Plate): `DragonflyHallReverb` / `DragonflyPlateReverb`** — fv3 zrev2 / NRev, the only fully proper FDN/plate engines with modulation; use these for the non-shimmer BigSky algorithms.
- **Skip for this use case:** PocketVerbs (cheap allpass), gx_zita_rev1 and Galactic (good but no shimmer/granular).