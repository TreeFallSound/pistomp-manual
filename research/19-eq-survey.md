# EQ Survey — pi-Stomp LV2 Ecosystem

## Background

EQ is a blind spot. We have 13 research docs covering fuzz, overdrive, delay, reverb, modulation, pitch, wah and compressors — never an equalizer. Yet `rkr Parametric EQ` is the 7th most-seen plugin in user pedalboards (7 occurrences), `C* Eq10` is the 4th (4), and the editorial doc `EFFECTS-EDITORIAL.md` calls CAPS a "shoulders of giants" upstream without ever having surveyed the CAPS EQs.

This doc enumerates every EQ/ParaEQ plugin on the device, reads its DSP, classifies its topology, and identifies editorial candidates. It is the basis for `src/plugins/eq.md`.

## Method

Every plugin tagged `EQ` or `ParaEQ` in `src/_data/plugins.json` is covered. Source was read from upstream where it resolves; the device was offline during research so `modgui:label` and screenshot fetches are deferred to the editorial step. Frequencies and control ranges are taken from the DSP/TTL, not the README.

Candidate enumeration was done from `plugins.json` (per the manual's research rule — names lie). 18 plugins: 9 EQ, 6 ParaEQ, plus the 3 rakarrack EQ-shaped plugins (`rkr Parametric EQ`, `rkr EQ`, `rkr Cabinet`) already covered in doc 17. Only `rkr Parametric EQ` is revisited here as a candidate. Doc 17 established the underlying filter class (`AnalogFilter`, an RBJ biquad) is shared with `rkr EQ`; what it did not establish — and what the TTL makes clear — is that the parametric variant exposes only **3 bands** (low/mid/high) with per-band `freq`, `gain`, and `Q`, not the 16 bands of `rkr EQ`. The LV2 port layout (`eqp.ttl`) is the authority, not the shared `EQ.C` engine, which supports up to `MAX_EQ_BANDS`.

## EQs used in pedalboards

| Plugin | Seen | Bundle | Topology | One-line |
|---|---:|---|---|---|
| rkr Parametric EQ | 7 | rkr-labs.lv2 | 3-band RBJ `AnalogFilter` parametric, per-band freq/gain/Q | Low 20–1k, Mid 80–8k, High 6k–26k Hz; Q 0.03–29.5; ±30 dB; stereo |
| C\* Eq10 | 4 | mod-caps-Eq10.lv2 | Fixed-octave IIR graphic, Motorola-paper | 31 Hz–16 kHz, 1-octave bands, ±24 dB, mono |
| Kuiza | 2 | artyfx.lv2 | 4-band parametric, Fons `Paramsect`, **fixed freqs** | 55/220/1760/7040 Hz, gain-only knobs |
| TAP Equalizer | 1 | tap-eq.lv2 | 8-band RBJ peaking, fixed BW 1.0 oct | 100 Hz–15 kHz, per-band freq+gain |
| x42-eq (mono) | 1 | fil4.lv2 | 4-band parametric + HP/LS/HS/LP, Fons `Paramsect` | Sweepable freq/bw, spectrum GUI, automation-smoothed |

## The rest (not seen in user pedalboards)

| Plugin | Bundle | Topology | One-line |
|---|---|---|---|
| 3 Band EQ | 3BandEQ.lv2 | 3-band Linkwitz-Riley crossover, ±12 dB | DISTRHO mini-port, **source no longer on GitHub** (retired `distrho.sf.net` legacy set) |
| 3 Band Splitter | 3BandSplitter.lv2 | Same, 3-band split-out | As above |
| 4-Band Parametric Filter | fomp-labs.lv2 | Fons `Pareq`, 4 bands | `drobilla.net/plugins/fomp/parametric1` — freq/bw/gain per band, master gain |
| Baxandall | Airwindows-Baxandall.lv2 | 2-knob Baxandall bass/treble shelves | Frequencies move with gain (real Baxandall), `sin()` Console encode — Airwindows MIT |
| C\* Eq10X2 | mod-caps-Eq10X2.lv2 | Same as Eq10, stereo | 2× the channels, same DSP |
| Calf Equalizer 5 Band | calf.lv2 | 2 shelves + 3 peaking, full parametric, stereo | Freq/level/Q per band + analyser; the serious Calf EQ |
| GxBarkGraphicEQ | gx_barkgraphiceq.lv2 | 24-band Orfanidis Butterworth on Bark scale | 50 Hz–13.5 kHz, per-band VU; guitarix's deepest EQ |
| GxBooster | gxbooster.lv2 | 2-slider bass/treble boost | Trivial — `fslider0_`, `fslider1_`, that's it |
| GxGraphicEQ | gx_graphiceq.lv2 | 11-band graphic + 11 VU meters | `G1`–`G11`, `V1`–`V11`; older guitarix graphic |
| GxToneMender | gx_tonemender.lv2 | "Clean boost with 3-knob tonestack" | Source not in the current guitarix LV2 tree — likely a faust tonestack wrapper |
| Luftikus | Luftikus.lv2 | Fixed half-octave analog-modelled, 4 bands + shelf | 10/40/160/640 Hz + selectable 2.5/5/10/20/40 kHz shelf; lkjb, DISTRHO port |
| TAP Equalizer/BW | tap-eqbw.lv2 | TAP Equalizer + per-band bandwidth | The full version of TAP Equalizer |
| x42-eq (stereo) | fil4.lv2 | Same as mono, stereo | 2 channels |

## Topology, established from source

### 1. CAPS Eq10 / Eq10X2 — fixed-octave graphic

`mod-audio/caps-lv2` → `Eq.cc`, `Eq.h`, `dsp/Eq.h`. Tim Goetze, GPL-3.0. The DSP header credits "Filter prototypes from a motorola paper implementing a similar circuit on a DSP56k."

`DSP::Eq<10>` is a 10-band parallel-form IIR. Each band is a 2nd-order peaking filter with fixed center and Q. From `init()`:

```
double f = 31.25;
for (i = 0; i < Bands && f < .48*fs; ++i, f *= 2)
    init_band (i, 2*f*M_PI/fs, Q);
```

So the centers are **31.25, 62.5, 125, 250, 500, 1k, 2k, 4k, 8k, 16 kHz** (1-octave spacing, ISO octave centers). Q is fixed at `Eq10Q = .707` (Butterworth, ~1.41 effective). Per-band gain range is **−48 to +24 dB** (port_info). The `adjust_gain[]` table trims each band's internal gain to keep the response optimally flat at 0 dB. A per-sample `gf[i]` recursion factor ramps band gains logarithmically across the block to prevent zipper noise — this is a graphic EQ built to be ridden live.

`Eq10X2` is the same engine, two channels. Mono `Eq10` is the one to use in a guitar chain; the CPU cost is one 2nd-order IIR per band per sample, ~10 biquad-equivalents — cheap.

The Eq4p and EqFA4p parametric variants (Tim Goetze, same author, same `dsp/` tree) are **not shipped** on the device — only `Eq10` and `Eq10X2` are. Worth noting for the editorial: CAPS has a 4-band parametric in its source tree that pi-Stomp does not load. Do not confuse the two.

### 2. ArtyFX Kuiza — fixed-frequency parametric (the catch)

`openAVproductions/openAV-ArtyFX` → `kuiza.cxx`, `dsp_parameteric.hxx`, `eq/filters.h`. Harry van Haaren, GPL-2.0. The filter is **Fons Adriaensen's `Paramsect`** (`eq/filters.h` carries Fons's 2004–2009 copyright, GPL-2.0) — the same second-order allpass-based parametric section that powers x42 fil4 and fomp `parametric1`.

The catch is in `kuiza.cxx::run()`: only `KUIZA_GAIN`, `KUIZA_GAIN_S1..S4` and `KUIZA_ACTIVE` are exposed as LV2 ports. The section frequencies (55, 220, 1760, 7040 Hz), bandwidths (1.2, 1.0, 1.0, 1.6), and master gain are **hardcoded in the `Parameteric` constructor** (`dsp_parameteric.hxx:93–110`). The user gets five gain knobs and an on/off. The center frequencies are non-standard (note the 220→1760 Hz gap — almost three octaves with no band) and cannot be moved. This is a fixed 4-band EQ wearing a parametric name tag.

Master gain scales 0–1 to −10…+10 dB; band gains scale 0–1 to −20…+20 dB.

### 3. x42 fil4 — the real parametric

`x42/fil4.lv2` → `src/filters.h`, `src/iir.h`. Robin Gareus, GPL-2.0+. `filters.h` is **Fons's `Paramsect` again**, this time with the full port surface: 4 peaking bands, each with `freq` (20 Hz–~0.47·fs, log), `band` (bandwidth, 1/3-octave granularity, fine 1/24), `gain` (±24 dB), plus low-shelf, high-shelf, HPF and LPF. All controls are internally smoothed (the `proc()` ramp limiter limits freq/gain/bw to 2:1 per block) so it is built for live automation and footswitch riding — exactly the pi-Stomp use case.

The mono variant is `http://gareus.org/oss/lv2/fil4#mono`, stereo is `#stereo`. The spectrum/spectrogram GUI is an LV2 UI; on pi-Stomp you drive it from mod-ui. CPU: one biquad-equivalent per active band, ~8 sections max — modest.

This is the same filter family Kuiza emasculated. fil4 is Kuiza with the full control surface restored.

### 4. fomp parametric1 — Fons's own 4-band

`drobilla.net/plugins/fomp/parametric1`, `gitlab.com/drobilla/fomp` → `src/pareq.{h,cc}`. Fons Adriaensen, GPL-2.0+. Four `Pareq` sections in series, each with `freq`, `bw`, `gain`, and a per-section bypass (`sec_N`), plus a master `gain`. `Pareq` is the same state-variable allpass parametric as `Paramsect` (the `calcpar1` math is Fons's — `_c1 = -cos(2π f)`, `_c2 = (1-b)/(1+b)` with `b = bw · 7·f/√g`). State is smoothed per-block.

This is the canonical Fons parametric, predating fil4. Same sound, no spectrum GUI, no HP/LP shelves. The fomp-labs build is the one the device loads (per CLAUDE.md's bundle-pair rule).

### 5. rkr Parametric EQ — the 3-band parametric the community actually uses

`ssj71/rkrlv2` → `lv2/ttl/eqp.ttl`, `src/EQ.{C,h}`. Josep Andreu after Nasca Octavian Paul (ZynAddSubFX lineage), GPL-2.0. The `doap:description` is "3 Band Parametric Eq" and the TTL port groups are `low`, `mid`, `hi` — three bands, each exposed as `freq`, `gain`, and `Q` (labelled "Width" in the port names).

The underlying `EQ.C` engine supports `MAX_EQ_BANDS` (16) of `AnalogFilter` (RBJ biquad) sections, the same class `rkr EQ` uses for its 16-band graphic. But the LV2 port layout in `eqp.ttl` only wires 3 bands to ports. Doc 17 called it "the same engine in a parametric port layout" — true at the `AnalogFilter` level, misleading at the plugin level. This is a 3-band parametric, not a 16-band parametric.

The per-band mapping from `EQ.C::changepar`:

- **Freq**: passed directly to `AnalogFilter::setfreq` as Hz. TTL ranges: Low 20–1000 Hz (default 200), Mid 80–8000 Hz (default 800), High 6000–26000 Hz (default 12000). The ranges **overlap** — Low reaches 1 kHz where Mid starts at 80 Hz, Mid reaches 8 kHz where High starts at 6 kHz — so two bands can be placed near the same frequency for a sharper cut or boost.
- **Gain**: `tmp = 30.0 * (value - 64) / 64`, so the integer range −64…+63 maps to approximately −30…+29.5 dB. Default 0 (= value 64).
- **Q** (labelled "Width"): `tmp = powf(30.0, (value - 64) / 64)`, so the integer range −64…+63 maps to Q = 30^(-1) ≈ 0.033 (very wide, near-flat) through 1.0 (at 0) to 30^(0.984) ≈ 29.5 (notch-narrow). The exponential mapping means the useful musical range (0.5–4) sits in roughly the −10…+10 integer band.

Filter type is fixed at peak (AnalogFilter type 6, RBJ peaking); the type and stages controls from the `EQ.C` engine are not exposed. Stereo in/out, bypass, and a master Gain (−64…+63, same dB mapping as band gain). The integer-quantised controls and the exponential Q mapping are less fine-grained than fil4's log-scaled floats, but they are the rakarrack house style and the 7-occurrence pedalboard count says they are usable.

This is the only 3-band parametric on the device with per-band freq/gain/Q. It is not the same plugin as `rkr EQ` (16-band graphic, same engine, different port layout) — a distinction doc 17 blurred and this doc corrects.

### 6. TAP Equalizer / TAP Equalizer/BW — Steve Harris lineage

`moddevices/tap-lv2` → `eq/tap_eq.c`, `eqbw/tap_eqbw.c`. Tom Szilagyi, GPL-2.0. The header notes the plugin is "inspired by and its code based upon Steve Harris's 'DJ EQ' plugin (no. 1901)." The filter is a standard RBJ peaking biquad (`eq_set_params` in `utils/tap_utils.h` computes `b0..a2` from `fc`, `gain`, `bw`, `fs` with `J = 10^(gain·0.025)`, `g = sw·sinh(LN_2_2 · bw · w / sw)` — textbook RBJ peaking with bandwidth in octaves).

8 bands, per-band **freq + gain** (`tap_eq`), or **freq + gain + bandwidth** (`tap_eqbw`). Default centers 100/200/400/1k/3k/6k/12k/15 kHz (non-uniform — note the 12k→15k spacing). Fixed 1.0-octave BW in the plain `tap_eq`. Range 70 Hz–15 kHz on freq, ±24 dB on gain (per the TTL — to confirm on-device). `tap_eqbw` is the one to use; the plain version is a constrained subset.

### 7. guitarix GxBarkGraphicEQ — the serious guitarix EQ

`brummer10/guitarix` → `src/LV2/gx_barkgraphiceq.lv2/`. The DSP is `barkgraphiceq.cc` over `orfanidis_eq.h` — Sophocles Orfanidis's second-order Butterworth EQ sections (`eq2` type). 24 bands on the **Bark critical-band scale**: centers 50/150/250/350/450/570/700/840/1k/1.17/1.37/1.6/1.85/2.15/2.5/2.9/3.4/4/4.8/5.8/7/8.5/10.5/13.5 kHz, widths 80…3500 Hz. Per-band gain slider + per-band VU meter (the `V1..V24` ports). Mono.

This is the only EQ on the device tuned to the ear's actual critical bands. It is the guitarix EQ worth a musician's attention. The plain `GxGraphicEQ` (11 bands, `G1..G11`) uses faust-generated DSP and is the older, less-considered sibling — skip it.

`GxBooster` is a 2-slider bass/treble boost — a toy. `GxToneMender` ("clean boost with 3-knob tonestack") has no LV2 source in the current tree; skip unless the source resurfaces.

### 8. Calf Equalizer 5 Band — the mix-bus EQ

`calf-studio-gear/calf` → `src/calf/metadata.h` (`equalizer5band_metadata`), DSP in `modules_filter.h` (`equalizerNband_audio_module`). Markus Schmidt, GPL-2.0+ (Calf). Stereo, 2 shelves (low + high) + 3 peaking, every band with `active`, `level`, `freq`, `Q`. Plus input/output level, stereo VU, individual/bypass graph, zoom, and an analyser with mode toggle. This is the Calf studio EQ, not the toy `Calf Equalizer 12/30` — 5 is the focused one.

CPU is higher than the mono guitar EQs (stereo, analyser), but it is the EQ you reach for at the end of a chain or for a stereo bus.

### 9. Luftikus — analog-modelled half-octave

`DISTRHO/distrho-ports` → `ports-juce5/luftikus/source/dsp/eqdsp.{h,cpp}`. lkjb (Lukas Brodaczky?), JUCE port by DISTRHO. 4 fixed half-octave bands at **10, 40, 160, 640 Hz** + a 2.5 kHz low shelf + a selectable high shelf (2.5/5/10/20/40 kHz — only one active at a time). Biquad (`SimpleBiquad`) with coefficient creation in `coeffcreator`. "Analog" mode adds 1e-5 dithering noise per sample to mask digital harshness; "Mastering" mode changes band Q; "Keep Gain" compensates overall level so cuts don't drop volume. Master volume.

This is a port of a commercial VST; the editorial should note it is the only EQ on the device that models a specific piece of analog hardware (the `lkjbdsp.wordpress.com/luftikus` page calls it "a digital adaptation of an analog EQ with fixed half-octave bands"). The fixed bands make it a colour/voicing EQ, not a surgical one.

### 10. Airwindows Baxandall — the tone stack

`airwindows/Airwindows` → `plugins/WinVST/Baxandall/BaxandallProc.cpp`. Chris Johnson, MIT. Two knobs: treble and bass, each ±15 dB. The DSP computes the shelf corner **from the gain itself** — `trebleFreq = 4410·trebleGain/sr`, `bassFreq = 8820·(1/bassGain)/sr` — so as you boost treble the corner moves up, as you cut bass the corner moves down. This is how a real Baxandall tone stage behaves (the feedback network's effective corner shifts with the pot), and it is the architectural detail that distinguishes a Baxandall from two static shelves. The signal passes through a `sin()` "Console5" encode before the shelves — Airwindows's console modelling glue.

Mono→stereo, lightweight. The URI is `https://hannesbraun.net/ns/lv2/airwindows/baxandall` (Hannes Braun's Airwindows LV2 wrapper, not the upstream Airwindows repo directly). MIT is unusual in this group.

### 11. 3 Band EQ / 3 Band Splitter — retired DISTRHO

`distrho.sf.net/plugins/3BandEQ`, `3BandSplitter`. DISTRHO, LGPL. The `distrho.sf.net` URI is falkTX's original mini-ports namespace, **retired** from `DISTRHO/DISTRHO-Ports` (not in `master`, `legacy`, or `juce7` branches as of 2026). The TTL on the device declares it (3-band, ±12 dB, crossover-based) but the source is no longer reachable. Treated as closed for editorial purposes — we cannot verify the filter topology from source. Seen in zero user pedalboards; footnote only.

### 12. MOD LowPassFilter / HighPassFilter — filters, not EQ

`moddevices.com/plugins/mod-devel/{Low,High}PassFilter`. MOD Team, GPL. Selectable-order LPF/HPF ("Freq" + "Order"). These are categorised `Filter`, not `EQ`/`ParaEQ`, and only appear in the candidate list because they share the `mod-devel` namespace. They are utility filters, not editorial material. The editorial's "Also considered" can note that for simple tone-trimming the basic MOD filters are cheaper than a full EQ, but they are not EQs.

## Ranking by use case

### Surgical parametric (cut/boost a specific frequency)

1. **x42 fil4 (mono)** — sweepable freq/bw/gain on 4 bands + HP/LS/HS/LP, smoothed for live control. The only EQ on the device that is a real parametric *and* exposes every control. CPU-modest. This is the pick.
2. **rkr Parametric EQ** — 3-band parametric with per-band freq/gain/Q, overlapping frequency ranges (Low 20–1k, Mid 80–8k, High 6k–26k), and a wide Q range (0.03–29.5). The community's pick — 7 occurrences in shared pedalboards, more than any other EQ. Integer-quantised controls and no shelves/HP/LP, but the three overlapping bands cover most surgical cuts. Also great.
3. **fomp parametric1** — Fons's own 4-band, same filter family as fil4, no shelves/HP/LP, no GUI analyser. Also great if you want the canonical Fons sound with fewer moving parts.
4. **Calf Equalizer 5 Band** — stereo, 2 shelves + 3 peaks, analyser. Also great, but heavier and the stereo bus use case is less common on a mono guitar rig.

### Fixed graphic (broadstroke tone shaping)

1. **GxBarkGraphicEQ** — 24 Bark bands, the only one mapped to the ear's critical bands. The guitarix pick.
2. **C\* Eq10** — 10 ISO octaves, ±24 dB, live-rideable, cheap, mono. The classic graphic. Also great.
3. **TAP Equalizer/BW** — 8 bands, per-band freq+bw. A parametric-leaning graphic. Also considered — useful but the fixed 1.0-octave BW (or fixed-BW defaults) is less flexible than fil4.

### Voicing / colour (fixed character, not surgical)

1. **Luftikus** — analog-modelled half-octave at 10/40/160/640 Hz + selectable shelf. The colour EQ.
2. **Airwindows Baxandall** — 2-knob tone stack with moving corners. Also great for the "one knob treble, one knob bass" role.
3. **Kuiza** — fixed 4-band with non-standard centers and gain-only knobs. Also considered — the fixed 220→1760 Hz gap is a real limitation, and fil4 is the same filter family with the full surface.

### Skip

- **GxBooster** — 2 sliders, not an EQ.
- **GxGraphicEQ** — superseded by GxBarkGraphicEQ.
- **GxToneMender** — source not in tree, "clean boost" not really an EQ.
- **3 Band EQ / 3 Band Splitter** — source retired, zero usage, closed.
- **C\* Eq10X2 / x42-eq stereo** — stereo versions of mono picks; use the mono on a guitar chain unless you are on a stereo bus.

## What this doc did not verify

- **On-device `modgui:label`s and screenshots** — the pi-Stomp was offline. The editorial step must fetch these via `ssh pistomp@pistomp.local` and `http://pistomp.local/effect/image/screenshot.png?uri=<encoded>`.
- **TAP Equalizer exact port ranges** — read from the TTL defaults via `plugins.json`, not from a live `lilv` query; the ±24 dB figure should be confirmed on-device.
- **GxToneMender DSP** — the LV2 dir is not in the guitarix checkout. If a reader finds it (likely `src/LV2/gx_tonemender.lv2/` in a different branch), the "clean boost with 3-knob tonestack" claim can be verified; until then it is a comment-string, not a read.
- **Luftikus authorship** — the DSP header has no author line; the `lkjbdsp.wordpress.com/luftikus` page attributes it to lkjb. The DISTRHO port is by falkTX. Confirm `doap:maintainer` on-device.

## Source URLs to cache

Verified to resolve (`git ls-remote`) and should be added to `src/_data/plugins-source.json`:

| uri | bundle | source_url |
|---|---|---|
| `http://moddevices.com/plugins/caps/Eq10` | `mod-caps-Eq10.lv2` | `https://github.com/mod-audio/caps-lv2` |
| `http://moddevices.com/plugins/caps/Eq10X2` | `mod-caps-Eq10X2.lv2` | `https://github.com/mod-audio/caps-lv2` |
| `http://www.openavproductions.com/artyfx#kuiza` | `artyfx.lv2` | `https://github.com/openAVproductions/openAV-ArtyFX` |
| `http://gareus.org/oss/lv2/fil4#mono` | `fil4.lv2` | `https://github.com/x42/fil4.lv2` |
| `http://gareus.org/oss/lv2/fil4#stereo` | `fil4.lv2` | `https://github.com/x42/fil4.lv2` |
| `http://drobilla.net/plugins/fomp/parametric1` | `fomp-labs.lv2` | `https://gitlab.com/drobilla/fomp` |
| `http://moddevices.com/plugins/tap/eq` | `tap-eq.lv2` | `https://github.com/moddevices/tap-lv2` |
| `http://moddevices.com/plugins/tap/eqbw` | `tap-eqbw.lv2` | `https://github.com/moddevices/tap-lv2` |
| `http://guitarix.sourceforge.net/plugins/gx_barkgraphiceq_#_barkgraphiceq_` | `gx_barkgraphiceq.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_graphiceq_#_graphiceq_` | `gx_graphiceq.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gxbooster#booster` | `gxbooster.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_tonemender_#_tonemender_` | `gx_tonemender.lv2` | `https://github.com/brummer10/guitarix` |
| `http://calf.sourceforge.net/plugins/Equalizer5Band` | `calf.lv2` | `https://github.com/calf-studio-gear/calf` |
| `https://code.google.com/p/lkjb-plugins/luftikus` | `Luftikus.lv2` | `https://github.com/DISTRHO/distrho-ports` |
| `https://hannesbraun.net/ns/lv2/airwindows/baxandall` | `Airwindows-Baxandall.lv2` | `https://github.com/airwindows/Airwindows` |

`rkr Parametric EQ` (`https://github.com/ssj71/rkrlv2`) is already cached. `3BandEQ` / `3BandSplitter` source does not resolve — leave uncached.

Note: `https://github.com/caps-plugins/caps` (cited in `EFFECTS-EDITORIAL.md`) no longer resolves — 404. The live CAPS upstream is `https://github.com/mod-audio/caps-lv2` (the LV2 port by the MOD team, which is what pi-Stomp ships). The editorial doc should be corrected when it is next edited.