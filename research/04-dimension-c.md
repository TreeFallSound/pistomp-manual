# LV2 Plugin Ranking for Boss DC-2W Dimension C Replacement

## Ranking (best → worst for "wide, not chorused")

1. **`string-machine-chorus-stereo.lv2`** — Solina-style 3-phase ensemble chorus
2. **`mod-caps-Wider.lv2`** — C* Wider stereo image synthesizer
3. **`tap-chorusflanger.lv2`** — TAP Chorus/Flanger
4. **`gx_chorus.lv2`** — Guitarix stereo chorus
5. **`mod-caps-ChorusI.lv2`** — C* ChorusI (mono)
6. **`multivoice_chorus-swh.lv2`** — SWH Multivoice Chorus (mono)

## Per-plugin analysis

### 1. `string-machine-chorus-stereo.lv2` — **Best match. Architecturally a Dimension C.**

Source: `jpcima/string-machine` (`sources/SolinaChorusStereo.*`, `sources/dsp/LFO3PhaseDual.dsp`, `sources/dsp/Delay3PhaseStereo.cpp`).

This is a literal Solina String Ensemble chorus — the *same architectural family* as the Boss DC-2 (both descend from the BBD-based "ensemble" tradition: multiple LFOs at slow, mutually offset phases, summed through a stereo sign matrix to cancel pitch wobble while reinforcing width).

- **LFO voices**: 3 phases per "row" (0°, 120°, 240°), **two independent LFO rows**: Rate 1 default **6 Hz** (3–9), Rate 2 default **0.6 Hz** (0.3–0.9). The slow row at 0.6 Hz is *exactly* in the Dimension C's sub-1 Hz territory; the fast row adds the gentle motion D'Agostino's tone has. `LFO3PhaseDual.dsp:7-10`.
- **Delay modulation depth**: 5 ms base ± **1 ms** in analog BBD mode (`Delay3PhaseStereo.cpp:82-83`: `avgDelay=5e-3, varDelay=1e-3`). Digital mode: `5e-3 + 1e-3*mod` (`Delay3PhaseDigital.dsp:17`). Single-digit-ms — exactly the DC-2's "barely there" detune.
- **Stereo width trick — YES, and it's the critical one**: the three delay lines per side are summed through a sign matrix: `L = line1 + line2 − line3`, `R = line1 − line2 − line3` (`Delay3PhaseStereo.cpp:41-46`). This is the classic ensemble trick — the phase-offset LFOs partially cancel in the side domain, so you get width *without* the obvious pitch swim of a standard chorus.
- **Analog BBD model**: uses a 185-stage TCA-350-Y bucket-brigade model with clock-rate modulation (`Delay3PhaseStereo.cpp:59,88-99`), giving authentic BBD coloration/motion. There's also a digital mode toggle.
- **Controls**: continuously variable (Rate 1, Depth 1, Rate 2, Depth 2, Global Depth, analog/digital toggle) — *not* the DC-2W's 4 switched presets, but the dual-rate/3-phase architecture is the thing that actually matters. Set Rate 2 low, Depth low, and it *is* a Dimension C in spirit.
- **Code quality**: excellent. Faust-generated LFO + hand-written BBD model with proper anti-aliasing LPF stages. Real stereo, real matrix, real analog emulation.

**Verdict**: This is the only plugin on the list that implements the actual Dimension-C recipe — multi-LFO, sub-1Hz rate, sub-ms-to-ms depth, 3-phase sign-matrix stereo. Use this.

### 2. `mod-caps-Wider.lv2` — Transparent width, but no motion

Source: `mod-audio/caps-lv2` (`Pan.cc`, `Wider` class). Inspired by the Orban 245F Stereo Synthesizer.

- **LFO voices**: **Zero.** No modulation at all.
- **Delay modulation**: None.
- **Stereo width trick — YES, but purely static**: takes a mono input, runs it through **three allpass filters** (150, 900, 5000 Hz, Q=0.707) to synthesize a "side" signal `s`, then M/S matrixes: `L = m + s`, `R = m − s` (`Pan.cc:81-95`). The allpasses create complementary phase responses so L+R sums flat.
- **Controls**: Pan (−1…+1), Width (0…1). Width is squared and limited by pan to avoid cancellation (`Pan.cc:74-75`). Continuous, not switched.
- **Code quality**: clean, minimal, correct. Tim Goetze's DSP is always well-engineered.

**Verdict**: Will give you *instant* stereo width with zero chorusing artifact — but it's **static**. It won't breathe or move like a Dimension C. Pair it with a very subtle chorus (#1 or #3) for the "wide + lush" combo: Wider for the static image, string-machine for the motion. Alone it's too sterile for the Chambers/Jackson sound.

### 3. `tap-chorusflanger.lv2` — Workable, but single-LFO and more "chorussy"

Source: `Rillke/tap-plugins` (`tap_chorusflanger.c`), Tom Szilagyi.

- **LFO voices**: **1 LFO**, shared between L and R with an adjustable **L/R phase shift** (0–180°, default 90°) (`tap_chorusflanger.c:265-269`). Single cosine-table oscillator, 0–5 Hz.
- **Delay modulation depth**: Depth control 0–100%, scaled to `100 * sr/44100` samples = **~2.3 ms max** at 44.1 kHz (`:210-211, 56`). Shallow by design but not as razor-thin as #1.
- **Stereo width trick — partial**: the L/R phase shift creates inter-channel decorrelation, which gives width. But it's a *single* LFO — no multi-phase cancellation matrix, so the pitch wobble is more audible than #1.
- **Controls**: Freq, Phase, Depth, Delay (0–100 ms), Contour (HP filter on wet, 20–20 kHz), Dry/Wet levels. All continuous. The Contour HPF is a nice touch for sitting the chorus in a mix.
- **Code quality**: straightforward C, linear-interpolation delay, biquad HPF. Functional, not sophisticated. No matrix, no BBD model.

**Verdict**: Dial Freq to ~0.5–1 Hz, Depth low, Phase to 90–180°, Delay ~5–10 ms, and you get a *passable* subtle widener. But it's one LFO against #1's six-phase dual-LFO matrix — it will always be more obviously "chorused" than the Solina. Third place because it's stereo and can be tamed.

### 4. `gx_chorus.lv2` — Generic stereo chorus, 90° offset

Source: `brummer10/guitarix` (`trunk/src/faust/chorus.dsp`, generated to `chorus.cc`).

- **LFO voices**: **1 per channel**, sine, with a **fixed 90° phase offset** (left phase=0, right phase=π/2) (`chorus.dsp:33-36`). Rate 0.1–10 Hz, default **3 Hz**.
- **Delay modulation depth**: base delay 0–200 ms (default 20 ms), depth 0–1 (default 0.02). Modulation = `dtime/2 × depth × LFO`, so default = **±0.2 ms** (very shallow), max = ±10 ms.
- **Stereo width trick — no**: it's two independent chorus voices 90° apart. No sign matrix, no cancellation. Width comes only from inter-channel decorrelation.
- **Controls**: Level, Delay, Depth, Freq, Bypass. Continuous.
- **Code quality**: clean Faust-generated code, table-lookup sine oscillator with linear interpolation. Simple but correct.

**Verdict**: A competent generic stereo chorus. At default settings it's almost inaudibly subtle (±0.2 ms), but it has no width matrix — it's a conventional "two choruses panned L/R" design. Will sound chorused before it sounds wide. Joseph's tone needs the matrix.

### 5. `mod-caps-ChorusI.lv2` — Mono, not a widener

Source: `mod-audio/caps-lv2` (`Chorus.cc`, `Chorus.h`). C* ChorusI.

- **LFO voices**: **1 sine LFO**, 0.02–5 Hz. Mono in → mono out.
- **Delay modulation depth**: time 2.5–40 ms, width 0.5–10 ms. Has blend, feedforward, feedback — can do flanger/chorus/slaphybrid.
- **Stereo width trick — none**: it's mono. You'd need two instances with different rate/phase to fake stereo.
- **Controls**: t, width, rate, blend, ff, fb. Continuous.
- **Code quality**: excellent single-voice chorus DSP (Tim Goetze), cubic-interpolated delay line, HPF pre-filter at 250 Hz. But it's the wrong tool — a mono chorus is fundamentally not a Dimension C.

**Verdict**: Not suitable. The DC-2W is a stereo effect; this has no stereo output. Disqualified on topology.

### 6. `multivoice_chorus-swh.lv2` — Mono, too fast, wrong character

Source: `swh/lv2` (`plugins/multivoice_chorus-swh.lv2/plugin.xml`, LADSPA ID 1201). Steve Harris.

- **LFO voices**: up to **8**, but with **randomized "laws"** (sinc-interpolated noise envelopes, not deterministic sine phases) — `next_peak_amp = rand()/RAND_MAX`, refreshed on a rolling schedule (`plugin.xml` run callback). Voices are staggered by `voice_spread` (0–2 ms).
- **LFO rate**: 2–30 Hz. **Minimum 2 Hz** — an order of magnitude faster than the DC-2's ~0.5 Hz. This is the dealbreaker.
- **Delay modulation depth**: derived from `detune` (0–5%) × law_period / π, base delay 10–40 ms. Can be subtle but the fast LFO makes it shimmer, not breathe.
- **Stereo width trick — none**: mono in, mono out. No matrix.
- **Controls**: voices (1–8), delay_base, voice_spread, detune, law_freq, attenuation. Continuous.
- **Code quality**: clever sinc-based noise interpolation to avoid metallic multi-voice artifacts. Honest effort. But it's a mono "thickener," not a widener, and its rate floor is too high.

**Verdict**: Worst fit. Mono, and its 2–30 Hz LFO range is in obvious-chorus territory, not Dimension-C territory. The randomized laws are interesting for a different purpose (ensemble thickening of a mono source).

## Recommendation

**Use `string-machine-chorus-stereo.lv2`** as the primary replacement. Start with Rate 1 ≈ 6 Hz / Depth 1 ≈ 30%, Rate 2 ≈ 0.6 Hz / Depth 2 ≈ 40%, Global Depth to taste, analog mode on. This gives you the dual-LFO, 3-phase-matrix, sub-ms-modulation architecture that is the Dimension C's defining trick — wide and lush without the warble.

If you want even more static width underneath (the DC-2W's "manual" mode is very wide but barely moving), **stack `mod-caps-Wider.lv2`** before it at Width ≈ 0.6, Pan = 0. That gives the Orban-style allpass width floor that the Solina chorus then breathes on top of — closest you'll get to D'Agostino's Chambers/Jackson stereo image with the installed plugin set.