# Reverb Survey — pi-Stomp LV2 Ecosystem

## Background

Reverb coverage in the manual is lopsided. The `shimmer-cloud-reverb.md` editorial handles the ambient/shimmer tail of the field — Shimmizita, TheCloud, Dragonfly Hall/Plate, gx_zita_rev1, Airwindows-Galactic, Airwindows-PocketVerbs — and the rakarrack survey (doc 17) walks through `rkr Reverb` as part of the broader rakarrack-effects pass. What is missing is the everyday-reverb survey: the plugins a player reaches for when they want a hall, a plate, a room, or an ambience — not a shimmer cloud and not a special-effect colour. This doc enumerates every `Reverb`-tagged plugin on the device, reads its DSP, classifies the algorithm (FDN order, Schroeder comb/allpass, Dattorro plate, Gardner room, convolution), and identifies editorial candidates. It is the basis for `src/plugins/reverb.md`.

## Method

Every plugin tagged `Reverb` in `src/_data/plugins.json` is covered. Source was read from upstream where it resolves; the device was offline during research so `modgui:label`s and screenshot fetches are deferred to the editorial step. Decay ranges, predelay ranges, and port names are taken from the DSP/TTL, not from the README.

Candidate enumeration was done from `plugins.json` (per the manual's research rule — names lie). 50 plugins ship under `Reverb`. Of these, 9 appear in user pedalboards (counts from `plugins-seen.json`): TAP Reverberator (3), MVerb (3), DIE Reverb (2), C\* PlateX2 (2), Roomy (1), rkr Reverb (1, already covered in doc 17 — cross-referenced here, not re-derived), MDA Ambience (1), C\* Plate (1). The remaining 41 long-tail plugins are tabled in §5 with one-line descriptions; the editorial ranks in §6 consider only the seen-in-pedalboards set plus a few long-tail standouts (TAL-Reverb-III, Aether, Dragonfly Hall) that the DSP makes editorial-grade.

The bundle-pair rule from `CLAUDE.md` applies to three bundle pairs: `fomp.lv2`/`fomp-labs.lv2`, `rkr.lv2`/`rkr-labs.lv2`, `invada.lv2`/`invada-labs.lv2`. The device loads the `-labs` build. Verified: the fomp `reverb`/`reverb-amb` plugins ship in `fomp-labs.lv2`, the rkr Reverb ships in `rkr-labs.lv2`, and the Invada ErReverb ships in `invada-labs.lv2`. Source was pulled from the labs-fork repositories (`drobilla/fomp`, `ssj71/rkrlv2`, the Invada 1.2.0 tarball from Launchpad), not from any mainline LADSPA source.

## Reverbs used in pedalboards

| Plugin | Seen | Bundle | Algorithm | One-line |
|---|---:|---|---|---|
| TAP Reverberator | 3 | tap-reverb.lv2 | Schroeder-Moorer, 43 modes, per-comb biquad HF-comp | Decay 0–10000 ms, dry/wet −70…+10 dB, mode 0–42 (default 0 = AfterBurn); stereo enhanced toggle decorrelates L/R by 0.998 ratio |
| MVerb | 3 | MVerb.lv2 | Dattorro figure-of-eight plate | Bandwidth 100–18500 Hz, damping 100–18500 Hz, decay 0.005–0.8045, predelay 0–200 ms, size 5–100%, density 0–1; full Dattorro tank with modulated 4-tap allpasses + cross-fed LPF-damped delay pairs |
| DIE Reverb | 2 | distrho-a-reverb.lv2 | Schroeder (4 comb + 3 allpass), setBfree organ reverb | Blend 0–1 (default 0.3), Room Size 0.5–1.0 (default 0.5); fixed character, no damping/predelay/early-late knobs; comb feedback gains scaled by roomsz |
| C\* PlateX2 | 2 | mod-caps-PlateX2.lv2 | Dattorro plate, stereo in (sums L+R pre-tank) | Bandwidth 0–1, tail 0–1 (×0.749 = decay), damping 0–1 (mapped to `exp(−π·(0.0005+0.9995·x))`), blend 0–1 (pow 1.53); modulated tank lattices (1.2 Hz quadrature LFO) |
| Roomy | 1 | artyfx.lv2 | Faust FDN, 8 lines + 8×8 feedback matrix (JOS STK lib) | RT60 1–6 s, damping 1500–18500 Hz (inverted), dry/wet 0–1; per-line input diffusion allpass + one-pole damping LPF |
| rkr Reverb | 1 | rkr-labs.lv2 | ZynAddSubFX Freeverb (8 comb + 4 allpass per channel) | Time 0–127, room size 0–127 (exp-scaled), HF damping 64–127, LPF 20–26000 Hz, HPF 20–20000 Hz, initial delay 0–127 with feedback; type 0 = random tunings, type 1 = Freeverb (Jezar at Dreampoint) comb lengths |
| MDA Ambience | 1 | mod-mda-Ambience.lv2 | 4-stage series allpass with shared 1024-sample delay memory | Size 0–10 m, HF damp 0–100 %, mix 0–100 %, output −20…+20 dB; not a true reverb — max delay 379·2.69 ≈ 23 ms at 44.1 k, designed for short "small space" ambience only |
| C\* Plate | 1 | mod-caps-Plate.lv2 | Dattorro plate, mono in → stereo out | Same DSP and controls as PlateX2, but mono input (one channel) |

## Topology, established from source

### 1. MVerb — Dattorro figure-of-eight plate

`DISTRHO/MVerb` → `plugins/MVerb/MVerb.h`, `plugins/MVerb/DistrhoPluginMVerb.cpp`. Martin Eastwood, GPL-3.0. DPF'ied by falkTX. The `README.md` states the lineage explicitly: "Its release was intended to provide a practical demonstration of Dattorro's figure-of-eight reverb structure."

The signal path (`MVerb.h:84–178`):

```
input → bandwidthFilter (SVF, 4× oversampled) → 4 series "smear" allpasses
      → predelay (single delay line)
      → split into two tanks (L/R):
            tank = 4-tap allpass → delay → damping LPF (SVF) → 4-tap allpass → delay
      → cross-feed: PreviousRightTank feeds left tank input, vice versa
      → 7-tap early-reflection delay lines (parallel to tank)
      → accumulatorL/R mixes tank taps and early reflections via EarlyMix
      → out = dry + Mix · (accumulator − dry), scaled by Gain
```

The tank allpasses are four-tap (`StaticAllpassFourTap`) — the multiple taps feed the output accumulator with weighted sums (`0.6·GetIndex(1)` etc.), which is what gives the Dattorro plate its density without resorting to a high comb count. Tank delay lengths scale with `Size` (5–100 %), so the room actually grows; this is the one knob that affects the tank's modal structure, not just its decay. The two `StateVariable` SVFs (bandwidth pre-tank, damping per-tank) are oversampled 4× (`StateVariable<T,4>`) — a deliberate cost paid for cleaner high-frequency response at high damping.

Parameter mapping is in `process()` (`MVerb.h:84–93`): the UI 0–100 % is divided by 100 and then mapped internally. Bandwidth/damping 0.0–1.0 → 100–18500 Hz (`freq·18400+100`). Decay 0.0–1.0 → 0.005–0.8045 (`0.7995·Decay+0.005`). Predelay 0.0–1.0 → 0–200 ms (`PreDelayTime·200·(sr/1000)`). The 5 factory presets (Halves, Dark, Cupboard, Stadium, Subtle) are static `setParameter` calls in `DistrhoPluginMVerb.cpp:146–210`.

CPU cost per sample: 4 input allpasses + 2 SVFs (4× oversampled = 8 SVF ticks/sample) + 4 four-tap tank allpasses + 4 delays + 2 damping SVFs (4× = 8 ticks) + 2 eight-tap early-reflection delays + accumulator. Roughly **30–40 mul/sample per channel** at 48 k. Moderate — heavier than C\* Plate (which has no early-reflection stage and no oversampled SVF), lighter than TAP Reverberator's per-comb biquad HF-comp. DISTRHO marks it `DISTRHO_PLUGIN_IS_RT_SAFE 1`.

Stereo in/out. This is the only true Dattorro plate on the device that exposes the full Dattorro control surface (bandwidth, density, decay, predelay, size, damping, early/late mix, gain, mix). C\* Plate is a more minimal Dattorro (no predelay, no early/late, no density); MVerb is the full-fat version.

### 2. TAP Reverberator — Schroeder-Moorer with 43 fixed modes

`moddevices/tap-lv2` → `reverb/tap_reverb.c`, `reverb/tap_reverb.h`, `reverb/tap_reverb_presets.h`. Tom Szilagyi, GPL-2.0. The `rdfs:comment` in the TTL calls it "based on the comb/allpass filter model. Comb filters create early reflections and allpass filters add to this by creating a dense reverberation effect." This is the classic Schroeder-Moorer architecture with two extensions: per-comb HF compensation (a biquad LPF inside each comb's feedback loop, `tap_reverb.c:104–111`) and an optional stereo-enhance toggle that scales one side's comb/allpass lengths by `ENH_STEREO_RATIO = 0.998` (`tap_reverb.c:213–227`, `247–261`) to decorrelate L/R.

Signal path (`tap_reverb.c:463–519`):

```
in_L/R → 4–10 parallel combs (per mode) with biquad-HF-comp'd feedback → sum
       → 4–11 series allpasses
       → [optional] LPF + HPF bandpass stage (BANDPASS_EN)
       → wet · combs_out + dry · in
```

Feedback gain is computed per-comb from decay (`comp_coeffs`, `tap_reverb.c:201–228`): `fb_gain = 0.001^(1000·buflen·(1+0.75·freq_resp) / (feedback/100)^0.89 / decay / sr)` — a -60 dB/decay-time formula with a per-comb frequency-response compensation factor. The allpass feedback uses a similar formula with exponent 0.88. Mode changes trigger `load_plugin_data()` which reallocates comb/allpass lengths from `reverb_data[m]` (`tap_reverb_presets.h`); 43 modes total — AfterBurn, AfterBurn (Long), Ambience, Ambience (Thick) + HD, Cathedral + HD, Drum Chamber, Garage, Garage (Bright), Gymnasium (Bright) + HD, Hall (Small/Medium/Large + HD), Plate (Small/Medium/Large + HD), Pulse Chamber (+ Reverse), Resonator (96/152/208 ms), Room (Large + HD), Slap Chamber (+ Bright + HD), Smooth Hall (Small/Medium/Large + HD), Vocal Plate + HD, Warble Chamber, Warehouse + HD.

The TTL (`tap_reverb.ttl:45–155`) confirms ports: Decay 0–10000 ms (default 2800), Dry Level −70…+10 dB (default −4), Wet Level −70…+10 dB (default −12), Combs On/Off, Allpasses On/Off, Bandpass On/Off, Enhanced Stereo On/Off (default On), Reverb Type 0–42 (default 0). The `REVERB_CALC_FLOAT` toggle in the source (`tap_reverb.c:39`) is commented out by default — the device build uses **fixed-point** arithmetic with `F2S = 2147483` (≈ 60 dB headroom above 0 dB, 120 dB dynamics below), which is unusual for a reverb and is the reason TAP Reverberator has historically been CPU-cheap on ARM.

CPU: mode 0 (AfterBurn) = 5 combs + 5 allpasses per side → 10 combs + 10 allpasses total, each comb with a biquad in feedback. Roughly **80–120 mul/sample** per channel at 48 k. Heavier than MVerb per-sample, but the fixed-point path keeps it predictable. Mode 4 (Ambience Thick HD) jumps to 8 combs + 11 allpasses per side — the heaviest mode.

### 3. C\* Plate and C\* PlateX2 — Dattorro plate with modulated tank lattices

`mod-audio/caps-lv2` → `Reverb.cc`, `Reverb.h`. Tim Goetze, GPL-3.0. The header comment is explicit: "the Plate reverb is based on the circuit discussed in Jon Dattorro's september 1997 JAES paper on effect design (part 1: reverb & filters)."

Signal path (`Reverb.cc:236–286`):

```
in → input.bandwidth (LP1)
   → 4 input lattice allpasses (indiff1 = 0.742, indiff2 = 0.712)
   → summation: xl = x + decay·delay[3].get(); xr = x + decay·delay[1].get()
   → per-tank (L/R):
        modulated lattice (ModLattice, 1.2 Hz sine LFO, 0.4 ms width) → delay → damping LP1 → × decay → lattice → delay.put
   → 12-tap output accumulator (0.6-weighted, sign-mixed taps from tank delays/lattices)
   → out = dry · in + blend · (xl, xr)
```

The two `ModLattice` objects (`Reverb.h:116–144`) are the Dattorro modulated allpass — a `DSP::Sine` LFO at 1.2 Hz, with the second one phased 90° (`M_PI/2`) from the first (`Reverb.cc:186–187`). The modulation width is fixed at `0.000403221·fs` samples (~4 ms at 44.1 k, scaled by sample rate), and `delay.get_linear()` does **linear interpolation** on the modulated read — this is the chorus-style smearing that breaks the Dattorro plate's otherwise-static resonant modes. The `FPTruncateMode` guard (`Reverb.cc:312, 377`) is set per cycle because linear interpolation on a modulated lattice requires truncated-float addressing.

Delay lengths are scaled by `fs` from fixed constants in seconds (`Reverb.cc:185–191, 217–222`): input lattices 4.77/3.60/12.73/9.31 ms, tank modulated lattices 22.58/30.51 ms, tank delays 149.62/124.99/141.69/89.24 ms, taps 8.94/99.93/64.28/67.07/66.87/6.28/11.86/121.87/41.26/89.82/70.93/11.26 ms — all Dattorro's published values, sample-rate-scaled. The tank feedback is `decay = 0.749·getport(1)` (`Reverb.cc:296`); damping is mapped `exp(−π·(0.0005+0.9995·x))` (`Reverb.cc:298`), so the knob's 0–1 sweeps the LPF cutoff from very-low (~1 Hz state-variable equivalent) up to Nyquist/2.

Controls (`Reverb.cc:332–343, 394–405`): bandwidth 0–1 (default 0.5), tail 0–1 (default 1.0 for Plate, 0.5 for PlateX2), damping 0–1 (default 0.5 / 0.0005), blend 0–1 (default 0 / 0). `blend` is `pow(blend, 1.6)` for Plate and `pow(blend, 1.53)` for PlateX2 — non-linear because "linear is not a good choice for this pot" (`Reverb.cc:303`).

`Plate::cycle` (`Reverb.cc:291–328`) is mono-in stereo-out: `x = s[i] + normal` (one input). `PlateX2::cycle` (`Reverb.cc:355–390`) is true stereo in but **sums L+R to mono before the tank**: `x = (sl[i] + sr[i] + normal) * .5`. The tank itself is stereo (L and R tanks run in parallel with cross-feed via the summation point), but the input is mono-summed first — true stereo in, but the tank sees mono. This is a quirk worth flagging in the editorial: for a stereo guitar chain, PlateX2's stereo input does not buy you true-stereo reverb; it buys you a summed-mono-into-stereo-tank. Plate (mono in) is the cheaper variant and produces the same result if your chain is mono anyway.

CPU: 4 input lattices + 2 modulated lattices (with interpolated read) + 2 tank lattices + 4 delays + 2 LP1 damping + 12-tap accumulator per sample. Roughly **20–25 mul/sample** per channel — lighter than MVerb (no early-reflection stage, no oversampled SVF, no four-tap allpasses). The modulated lattices are the most expensive element due to linear interpolation.

### 4. DIE Reverb — setBfree's Schroeder organ reverb

`DISTRHO/DIE-Plugins` → `plugins/a-reverb.lv2/a-reverb.c`. Fredrik Kilander, Robin Gareus, Will Panther, Damien Zammit, GPL-2.0. The `rdfs:comment` in `a-reverb.ttl.in` is "A Schroeder Reverberator." This is the reverb from setBfree (the Hammond emulator), extracted and packaged as a standalone LV2 by Damien Zammit. The DSP is unchanged from setBfree's `b_reverb` module.

Signal path (`a-reverb.c:144–246`):

```
in_L/R → inputGain (−20 dB fixed)
       → per-side feedback sum: x = y_1 + inputGain·in
       → 4 parallel feedback combs (lengths 1687, 1601, 2053, 2251 samples @ 25 k base rate)
       → 3 series allpasses (lengths 347, 113, 37)
       → one-sample LPF: y = 0.5·(xa + yy1); yy1 = y
       → feedback to input: y_1 = fbk · xa (fbk = −0.015 fixed)
       → out = wet·y + dry·in (wet/dry set by Blend port)
```

Right-channel comb/allpass lengths are offset by `stereowidth = 7` samples (`a-reverb.c:116–124`) — a fixed, primitive stereo decorrelation. Lengths are sample-rate-scaled: `e = (end[c][i] · rate / 25000.0) | 1` (`a-reverb.c:67–68`), where 25000 is the base rate the algorithm was designed at; the `| 1` forces odd lengths (an old trick to avoid 0 Hz DC modes). Feedback gains are fixed: 0.773/0.802/0.753/0.733 for the combs, √0.5 for the allpasses. Room Size scales only the comb feedback gains (`a-reverb.c:407–410`): `gain[0..3] = base·v_roomsz`. It does **not** scale the delay lengths — the room stays the same size, only the decay changes.

The TTL (`a-reverb.ttl.in`) exposes only three real controls: Blend 0–1 (default 0.3), Room Size 0.5–1.0 (default 0.5 — note the floor at 0.5, the comb gains would be too low below that), and Enable (bypass toggle). No predelay, no HF damping knob, no early/late split, no HPF/LPF. The fixed `inputGain = −20 dB` and `fbk = −0.015` mean the reverb has a fixed character that the user can only make wetter or longer — not darker or shorter-predelay'd. This was designed for an organ — a sustained, tonally complex source — and it shows: the character is dense and slightly dark, with no early-reflection detail.

CPU: 4 combs + 3 allpasses + 1 LPF per channel per sample. Roughly **15–20 mul/sample** per channel — cheap. The `tau` smoothing (`a-reverb.c:300, 401–411`) ramps blend and roomsz at 15 Hz/64-frame to avoid zipper noise.

### 5. Roomy — Faust FDN from the JOS STK library

`openAVproductions/openAV-ArtyFX` → `src/dsp/roomy.cxx`, `src/dsp/dsp_reverb.hxx`. Harry van Haaren, GPL-2.0. The DSP header carries an explicit Faust-generation notice (`dsp_reverb.hxx:21–50`) attributing `effect.lib` and `filter.lib` to Julius O. Smith (STK-4.3 license) and `music.lib`/`math.lib` to GRAME (LGPL). This is a Faust-generated FDN, not a hand-written one.

Signal path (`dsp_reverb.hxx:125–336`):

```
in_L/R → per-side predelay comb (MAX_PRE_DELAY_MS = 1000)
       → 4 parallel feedback delay lines per channel (lengths 0.174713, 0.153129,
         0.127837, 0.125, 0.210389, 0.192303, 0.256891, 0.219991 · sr — sample-rate-scaled)
       → each delay line has its own one-pole damping LPF inside the feedback loop
       → 8×8 feedback mixing matrix (the `fRec0..fRec7` equations at dsp_reverb.hxx:268–280)
       → stereo out: reverb0 = 0.37·(fRec1 + fRec2); reverb1 = 0.37·(fRec1 − fRec2)
       → smoothed dry/wet crossfade (2-pole LPF on the wet gain, dsp_reverb.hxx:288–292)
```

The 8×8 feedback matrix is the dense FDN structure — each delay line's input is a signed sum of all 8 delay line outputs, which is what makes the tail smooth and free of distinct comb modes. The matrix coefficients are baked into the Faust-generated code (the `0` and `0 −` signs in the `fRec0..fRec7` equations); they are not user-adjustable.

Parameter mapping (`dsp_reverb.hxx:102–116`): `rt60 = 1 + rt·5` → 1–6 s. `damping = (1−d)·18500 + 1500` → 1500–18500 Hz, **inverted** (higher knob = lower cutoff = darker). `dryWet` 0–1. The inversion on damping is unusual and worth flagging in the editorial.

CPU: 8 delay lines × (read + 1-pole LPF + 8-input matrix sum) + 8-tap predelay comb + 2-pole dry/wet smoother. Roughly **40–50 mul/sample** per channel at 48 k. Moderate.

### 6. MDA Ambience — not a reverb, a short allpass-chain "space" effect

`moddevices/mda-lv2` → `src/mdaAmbience.cpp`, `src/mdaAmbience.h`. Paul Kellett (Maxim Digital Audio), David Robillard (LV2 port), GPL-3.0. The class is declared `mdaAmbience`, program name "Small Space Ambience" (`mdaAmbience.cpp:53`).

Signal path (`mdaAmbience.cpp:173–239`):

```
in_L/R → 0.3·(a + b) → HF damping 1-pole LPF: f += dmp·(w·(a+b) − f)
       → 4 series "allpasses" with shared 1024-sample circular buffer:
            for each stage k (k = 107, 142, 277, 379 · size):
              r = f − fb·buf[p]; buf[d_k] = r; r += buf[p]; output stage
       → out_L = dry·a + (r − f); out_R = dry·b + (r − f)
```

The four "allpasses" share a single 1024-sample buffer (`buf1..buf4`, each 1024 floats), each with its own write index `d_k = (p + k·size) & 1023` and read index `p`. The feedback gain `fb = 0.8` is fixed. The size parameter (`size = 0.025 + 2.665·fParam0`) scales the delay increments, so at max size the longest stage is 379·2.69 ≈ 1020 samples ≈ 23 ms at 44.1 k. **There is no long tail** — the algorithm produces a dense, decaying ambience splash on the order of tens of milliseconds, not seconds. The TTL display labels Size in metres (0–10 m), but the underlying computation is in samples and the relationship to physical metres is loose.

This is the plugin's intentional design — it is in the "Ambience" category, not the "Reverb" category in the original mda VST set, and the source comment makes no claim of being a full reverb. The `suspend()` call (`mdaAmbience.cpp:94–101`) is invoked when the size changes (`rdy=0`), which flushes the buffers — there is no crossfade, so changing size mid-signal causes a brief click. The denormal-protection `if(fabs(f)>1.0e-10)` block (`mdaAmbience.cpp:237–238`) will **suspend the buffer entirely** if the feedback decays below ~1e-10, which can happen during quiet passages — a quirk to note.

CPU: 4 allpass stages with shared buffer + 1 LPF + 2 outputs per sample. Roughly **10–15 mul/sample** per channel. Cheap. The 1024-sample buffer fits in L1 cache.

### 7. rkr Reverb — ZynAddSubFX Freeverb (cross-reference doc 17)

`ssj71/rkrlv2` → `src/Reverb.C`, `src/Reverb.h`, `lv2/ttl/reve.ttl`. Josep Andreu after Nasca Octavian Paul, GPL-2.0. Doc 17 already covered this plugin's role in the rakarrack set; this section adds the algorithmic detail doc 17 omitted.

The engine is the ZynAddSubFX Reverb (`Reverb.h:1–9` carries the ZynAddSubFX copyright and attribution). 8 combs + 4 allpasses per channel (so 16 + 8 total). Two types (`Reverb.C:328–382`): type 0 = random comb lengths (800 + RND·1400) and random allpass lengths (500 + RND·500); type 1 = Freeverb by Jezar at Dreampoint, with comb tunings `{1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617}` and allpass tunings `{225, 341, 441, 556}`. The right channel gets a `+23` sample offset (`Reverb.C:356, 373`) for stereo decorrelation. Room size is exponentially mapped: `roomsize = 10^((P-64)/64 · 2)` (`Reverb.C:390–393`), so the knob's 0–127 spans 0.1× to 10× the base delay lengths. Each comb has a one-pole LPF in feedback (`lpcomb[i]`, the Freeverb-style damped comb).

TTL ports (`reve.ttl`): Wet/Dry 0–127, Panning −64…+63, Time 0–127, Initial Delay 0–127, Initial Delay Feedback 0–127, LPF 20–26000 Hz, HPF 20–20000 Hz, Damping 64–127, Type 0/1, Room Size 0–127. The LPF/HPF are `AnalogFilter` (RBJ biquad) instances, same family as the EQ plugins in doc 19.

CPU: 8 combs + 4 allpasses + 1 LPF + 1 HPF per channel per sample. Roughly **40–60 mul/sample** per channel — moderate. Same algorithm is shared with `ZynReverb` (ZynAddSubFX mainline), which is also on the device as a separate plugin — see long-tail table.

### 8. fomp reverb / reverb-amb — Fons's zita-rev1 FDN (cross-reference shimmer-cloud editorial)

`drobilla/fomp` → `src/reverbs.cc`, `src/reverbs.h`, `src/zreverb.cc`, `src/zreverb.h`. Fons Adriaensen, GPL-2.0+. Two URIs ship in `fomp-labs.lv2`: `http://drobilla.net/plugins/fomp/reverb` (stereo) and `http://drobilla.net/plugins/fomp/reverb_amb` (ambisonic). The engine is `Zreverb` (`zreverb.h:180–237`): 8 `Diff1` allpass diffusers in series on the input, then 8 parallel modulated delay lines with per-line damping and a feedback matrix, plus 2 parametric EQs on the output. This is the canonical zita-rev1 algorithm — the same FDN that `gx_zita_rev1` (guitarix) and `Dragonfly Hall Reverb` (fv3 zrev2) build on. The shimmer-cloud editorial already covers zita-rev1; we cross-reference rather than re-derive. fomp's version is Fons's own reference implementation.

## The rest (not seen in user pedalboards)

Grouped by family. The Airwindows family (Chris Johnson, MIT, ported to LV2 by Hannes Braun) and the Dragonfly family (Michael Willis, GPL-3.0) are already partially documented in `src/plugins/shimmer-cloud-reverb.md` — flagged below rather than re-described.

### TAL family (Patrick Kunz, GPL-2.0+, DISTRHO JUCE port)

| Plugin | Bundle | Algorithm | One-line |
|---|---|---|---|
| Tal-Reverb | TAL-Reverb.lv2 | Schroeder, 5 combs + 6 allpasses, noise-modulated damp/delay | The original TAL-Reverb; mono in, stereo out, JUCE port of Patrick Kunz's 2005 VST |
| TAL-Reverb-II | mod-tal-Reverb-2.lv2 | Same as Tal-Reverb + stereo preDelay comb + TalEq shelving EQ | Stereo in/out version of the original with preDelay and EQ; the "TAL-Reverb II" everyone knows |
| Tal-Reverb-III | TAL-Reverb-3.lv2 | 4 noise-modulated combs + 5 allpasses, pre/post allpass, TalEq | The lush one — filtered-noise diffusion on each comb delay time gives a dense, chorused tail; stereo, with stereo spread via 0.008× comb length offset alternating L/R |

All three live in `DISTRHO/Ports/ports-juce5/tal-reverb{,-2,-3}/source/Engine/Reverb.h`. Source: `https://github.com/DISTRHO/DISTRHO-Ports`. TAL-Reverb-III is the editorial-grade one — its noise-modulated diffusion (`Reverb.h:269–273`, `tickFilteredNoiseFast` injected into both comb delay time and feedback diffusion) is the trick that gives the tail its soft, uncomb-filtered character, and is the same family of trick Dattorro specified with the modulated lattice; TAL just does it with filtered noise instead of an LFO.

### Airwindows family (Chris Johnson, MIT, Hannes Braun LV2 wrapper)

Already covered for shimmer/cloud in `shimmer-cloud-reverb.md`. Cross-reference:

| Plugin | Bundle | Algorithm | Status |
|---|---|---|---|
| Galactic | Airwindows-Galactic.lv2 | 8 modulated delay lines (I/J/K/L + A/B/C/D/E/F/G/H) with feedback matrix and per-line IIR LPF | Covered in shimmer-cloud editorial as "chorale-style atmospheric wash" |
| PocketVerbs | Airwindows-PocketVerbs.lv2 | 6 verb types, allpass-chain Schroeder with golden-ratio (0.618) feedback | Covered in shimmer-cloud editorial as "metallic and lo-fi next to Dragonfly" |
| StarChild | Airwindows-StarChild.lv2 | Pitch-shifted tap delay with 10-stage moving-average groove wear | Special-effect pitch-shifting reverb, not a traditional reverb |
| MV | Airwindows-MV.lv2 | 27-stage allpass chain (Midiverb-style) with sin() feedback folding | Midiverb-inspired lo-fi reverb with quantised feedback levels (−24/−18/−12/−6/0 dB) |

### Dragonfly family (Michael Willis, GPL-3.0)

Already covered for shimmer/cloud in `shimmer-cloud-reverb.md`. Cross-reference:

| Plugin | Bundle | Algorithm | Status |
|---|---|---|---|
| Dragonfly Hall Reverb | DragonflyHallReverb.lv2 | fv3 `zrev2_f` 8-line FDN + `earlyref_f` early reflections | Covered — "best hall/chorale equivalent when you don't need shimmer" |
| Dragonfly Plate Reverb | DragonflyPlateReverb.lv2 | Stanford NRev plate (comb bank → multi-stage allpass cascade) | Covered |
| Dragonfly Room Reverb | DragonflyRoomReverb.lv2 | fv3 `zrev2_f` + early reflections, room-tuned defaults | Not in editorial; same engine as Hall with room-flavoured defaults |
| Dragonfly Early Reflections | DragonflyEarlyReflections.lv2 | fv3 `earlyref_f` standalone | Not in editorial; early-reflections only, no late tail |

### IR / Convolution reverbs

| Plugin | Bundle | Algorithm | One-line |
|---|---|---|---|
| ZamVerb | ZamVerb.lv2 | Partitioned convolution with bundled IRs (zamaudio LV2convolv) | Damien Zammit; ships 8 IR presets (`ZamVerbImpulses.cpp`), FFT-based partitioned convolution; `from_dB(-16)` on the wet path |
| LSP IR Mono | lsp-plugins-impulsantworten.lv2 | Partitioned convolution IR loader | LSP project, `lsp-plugins/lsp-plugins-impulse-responses` repo; loads external IR files, with pitch and IR-length controls |
| LSP IR Stereo | lsp-plugins-impulsantworten.lv2 | Same, stereo | As above, stereo variant |
| x42 IR Convolver Mono | zeroconvo.lv2 | Partitioned convolution | Robin Gareus x42 IR convolver (`gareus.org/oss/lv2/zeroconvolv`), configurable partition size |
| x42 IR Convolver Stereo | zeroconvo.lv2 | Same, stereo | As above |
| Convolution Loader | MOD-ConvolutionLoader.lv2 | Convolution IR loader | `mod-audio/mod-convolution-loader`; MOD Team's IR loader for arbitrary impulse responses |

### Algorithmic long tail

| Plugin | Bundle | Algorithm | One-line |
|---|---|---|---|
| Aether | aether.lv2 | Cloudseed-style late reverb: up to 12 parallel modulated delay lines, each with own Schroeder diffuser + damping (low/high shelf + high cut) + feedback matrix; configurable order | Dougal Sanderson; LV2 port of CloudSeed (`ValdemarOrn/CloudSeed`); mono in, stereo out; the deepest-configurable reverb on the device, also the heaviest |
| Shiroverb | Shiroverb.lv2 | Cycling74 Max/MSP gen~ exported reverb (`shiroverb.gendsp`, `shiroverb.maxpat`) | Nino de Wit; the only Max-gen~ plugin on the device; algorithm is opaque (binary gen export), sounds characterised by long modulated tails |
| ZynReverb | ZynReverb.lv2 | ZynAddSubFX Reverb — same engine as rkr Reverb (8 comb + 4 allpass per channel, Freeverb/Random/Bandwidth types) | Same `Reverb.cpp` lineage as rkr Reverb (`zynaddsubfx/src/Effects/Reverb.cpp`); exposed through the ZynAddSubFX LV2 wrapper with the full Zyn preset system |
| dRowAudio: Reverb | drowaudio-reverb.lv2 | Schroeder/Moorer with 8 LBCF (lowpassed-feedback comb) + 4 allpass for late reverb, TappedDelayLine for early reflections | David Rowland (`dRowAudioFilter.h:69–70` "Schoeder/Moorer model with adjustable pre-delay, early reflections and reverb tail"); DISTRHO JUCE port; 0.1–200 ms predelay, 3–7 roomshape, 0–20 s early/late decay, 0.15–100 delay time, 20–20000 Hz filter CF, 0–100 % diffusion |
| GVerb | gverb-swh.lv2 | 4th-order FDN with Hadamard feedback matrix + early-reflection diffusers | Juhana Sadeharju (`gverb.h`), SWH LV2 port; FDNORDER=4, fdnlens `{1.0, 0.816, 0.707, 0.632}·largestdelay`, roomsize scaled to `rate·roomsize·0.00294`; the original Linux FDN reverb |
| Calf Reverb | calf.lv2 | Calf's own reverb (8-comb Schroeder with modulation, built-in EQ) | Markus Schmidt / Calf team; stereo with full Calf UI (analyser, room size, width, pre-delay, time, damping, bass cut, treble cut, wet, dry) |
| reverb / reverb-amb | fomp-labs.lv2 | Fons zita-rev1 (8 Diff1 diffusers → 8 parallel modulated delays + matrix + 2 EQs) | Cross-ref §3.8 above; ambisonic variant for AmbX format |
| Invada Early Reflection Reverb (mono/sum) | invada-labs.lv2 | Geometric early-reflection simulator (room L/W/H, source/listener position, HPF, warmth, diffusion) | Fraser Stuart, Launchpad `lp:invada-studio`; not a tail reverb — computes early reflections from room geometry via delay taps; useful as a preverb or for natural space, no feedback |
| GxReverb-Stereo | gx_reverb.lv2 | Faust-generated Freeverb (Grame's `freeverb` lib, same tunings as rkr Reverb type=1) | brummer, guitarix; 8 combs + 4 allpasses per channel, Faust source at `trunk/src/LV2/faust/stereoverb.dsp` |
| Gxroom_simulator | gx_room_simulator.lv2 | Gardner room reverberator models (small/medium/large room, nested allpass structures) | brummer, guitarix; Faust source at `trunk/src/LV2/faust/room_simulator.dsp`, cites Gardner's room reverberator models; nested allpass (sn_allpass, dn_allpass) |
| GxMultiBandReverb | gx_mbreverb.lv2 | 5-band multiband Freeverb (filterbank → 5 parallel Freeverbs → sum) | brummer, guitarix; Faust source at `trunk/src/LV2/faust/mbreverb.dsp`; each band has its own RoomSize/damp/wet-dry, with 4 crossover frequencies (default 80/210/1700/5000 Hz) |
| GxZita_rev1-Stereo | gx_zita_rev1.lv2 | zita-rev1 FDN (same as fomp reverb, with guitarix UI) | Cross-ref shimmer-cloud editorial |
| Gxshimmizita | gx_shimmizita.lv2 | zita-rev1 FDN with per-delay-line pitch shifter in feedback | Cross-ref shimmer-cloud editorial (the shimmer pick) |
| MaFreeverb | MaFreeverb.lv2 | Freeverb port (Magix/MA Media Audio) | Source retired — `distrho.sf.net/plugins/MaFreeverb` namespace is falkTX's retired mini-ports set, not in `DISTRHO/DISTRHO-Ports` master/legacy/juce7 branches; we cannot verify the algorithm from source. Treated as closed. |
| MaGigaverb | MaGigaverb.lv2 | Gigaverb port (Magix/MA Media Audio) | As above — source retired, cannot verify. |
| Freaktail | Freaktail.lv2 | 10 parallel feedback-comb delay lines (Faust, lengths 301/461/1025/1317/1723/2317/2913/506/2600/3137 samples) with distortion in feedback | pjotrompet/Freaked; Faust source at `Freaked/Faustsrc/Freaktail.dsp`; reverb-with-drive, the feedback path is distorted per the `Distort` block |
| Prefreak | Prefreak.lv2 | 19-tap multitap delay (early reflections only, no feedback, no tail) | pjotrompet/Freaked; Faust source at `Freaked/Faustsrc/PreFreak.dsp`; the early-reflection companion to Freaktail |
| setBfree Organ Reverb | b_reverb.lv2 | The setBfree organ reverb (same DSP as DIE Reverb, exposed through the setBfree LV2) | Robin Gareus; cross-ref §4 — DIE Reverb is this same code as a standalone plugin |

## Ranking by use case

### Plate reverb (the guitar-player default)

1. **MVerb** — the full Dattorro figure-of-eight with every Dattorro control surface exposed (bandwidth, density, decay, predelay, size, damping, early/late mix, gain, mix). The 4-tap tank allpasses and the cross-fed LPF-damped delay pairs give the dense, slightly-warm plate character the Dattorro structure is known for. The oversampled SVFs keep the damping clean at high settings. This is the pick: it does the plate sound the guitar community recognises, with the controls to dial it in.
2. **C\* Plate** — same Dattorro structure, sample-rate-scaled, with modulated tank lattices (1.2 Hz quadrature LFO) for chorus-smearing the resonant modes. Fewer controls (bandwidth, tail, damping, blend — no predelay, no early/late, no density), but the modulation gives it a subtly chorused, breathing character MVerb does not have. Also great. Mono-in / stereo-out, lighter on CPU.
3. **C\* PlateX2** — same as Plate with stereo inputs, but the tank input is mono-summed (`(sl[i]+sr[i]+normal)*.5`), so the stereo input does not buy true-stereo reverb. Use the mono Plate unless your chain is already stereo and you want the convenience.
4. **Dragonfly Plate Reverb** — Stanford NRev plate (comb bank → allpass cascade). Cross-ref shimmer-cloud editorial. A capable plate, but the NRev structure is less "Dattorro-plate" and more "vintage-digital-plate" — a different character, more coloured.

### Hall / room reverb

1. **TAP Reverberator** — 43 modes covering halls, rooms, plates, cathedrals, warehouses, resonators, slap chambers. The fixed-point DSP is predictable on ARM, the per-comb biquad HF-comp is the right detail for guitar (high frequencies attenuate more in real rooms, so the reverb should mirror that), and the stereo-enhance toggle decorrelates L/R sensibly. Decay 0–10000 ms covers everything from room to cathedral. The pick for variety: 43 modes is more sonic ground than any other reverb on the device.
2. **Roomy** — Faust FDN with an 8×8 feedback matrix, RT60 1–6 s, damping 1500–18500 Hz (inverted knob). Cleaner, less characterful than TAP but more "correct" — the dense feedback matrix produces a smooth, mode-free tail. Also great if you want one hall sound, not 43.
3. **Dragonfly Hall Reverb** — fv3 zrev2 8-line FDN. Cross-ref shimmer-cloud editorial. The hall sound everyone praises; smooth, dense, modulated.
4. **fomp reverb** — Fons's reference zita-rev1. Same engine as Dragonfly Hall, fewer controls, Fons's own implementation. Also great if you want the zita sound without Dragonfly's UI.

### Spring / character reverb

1. **DIE Reverb** — setBfree's Schroeder organ reverb. Two knobs (Blend, Room Size), fixed character. Slightly dark, dense, no early-reflection detail — designed for organ, works as a guitar "always-on room" colour. Cheap on CPU. The pick if you want a fixed-character reverb you don't have to think about.
2. **rkr Reverb** — Freeverb (Jezar at Dreampoint), with the rakarrack control surface (Time, Room Size, LPF, HPF, Damping, Initial Delay + feedback, Type, Panning). Cross-ref doc 17. More knobs than DIE, same Schroeder character, integer-quantised controls.
3. **GxReverb-Stereo** — same Freeverb algorithm, Faust-generated, with the guitarix control surface. Lighter on CPU than rkr Reverb, no integer quantisation, but no initial-delay or panning controls.
4. **ZynReverb** — the ZynAddSubFX engine behind rkr Reverb, exposed with the full Zyn preset system. Same algorithm; the difference is the UI/preset surface, not the DSP.

### Ambience / short space (not a true reverb)

1. **MDA Ambience** — a 4-stage series allpass with shared 1024-sample buffer, max delay ~23 ms at 44.1 k. Not a reverb in the strict sense — it produces a short dense ambience splash, not a tail. The pick for "thicken without washing out" on a dry guitar — exactly the use case Paul Kellett designed it for.
2. **Invada Early Reflection Reverb** — geometric early-reflection simulator (room L/W/H, source/listener position). Also not a tail reverb. Useful as a preverb or for natural-space placement. More configurable than MDA Ambience (room geometry, not just size), but heavier on CPU and harder to dial in.
3. **fomp reverb-amb** — zita-rev1 ambisonic variant. Same as fomp reverb but in AmbX format — not relevant for a stereo guitar chain.

### Shimmer / cloud / ambient

Cross-reference `src/plugins/shimmer-cloud-reverb.md`. The pick there is **Shimmizita** (zita-rev1 FDN with per-delay-line pitch shifter), runner-up **TheCloud** (granular), with Dragonfly Hall/Plate for plain hall/plate when shimmer is not needed.

### "Also considered" — high-quality but not the everyday pick

- **TAL-Reverb-III** — noise-modulated Schroeder with the densest chorusing of any non-FDN reverb on the device. Worth an editorial mention as the lush Schroeder alternative for players who want the TAL character. CPU moderate.
- **Aether** — Cloudseed-style late reverb with up to 12 modulated delay lines and full damping EQ per line. The most configurable reverb on the device, also the heaviest — easily saturates a Pi core at high order. Use with care.
- **GVerb** — Juhana Sadeharju's 4th-order FDN. Historically important (the original Linux FDN), but zita-rev1 and Dragonfly Hall have superseded it. CPU-cheap, but the tail is less smooth than the modern FDNs.

### Skip for the editorial

- **MaFreeverb / MaGigaverb** — source retired (`distrho.sf.net` mini-ports namespace), cannot verify algorithm from source, zero pedalboard usage. Footnote only.
- **x42 IR Convolver Mono/Stereo / LSP IR Mono/Stereo / Convolution Loader / ZamVerb** — convolution reverbs. Not algorithmic; the editorial question is "which algorithmic reverb?", not "which IR loader?". Cover separately if a convolution-reverb editorial is ever commissioned.
- **StarChild / MV / PocketVerbs** — Airwindows special-effect reverbs. Already covered or alluded to in shimmer-cloud editorial; not everyday-reverb material.
- **Freaktail / Prefreak** — niche Faust reverbs from the Freaked collection. Freaktail has distortion in the feedback path; Prefreak is multitap early reflections only. Both are character effects, not everyday reverbs.
- **Shiroverb** — Max-gen~ export, opaque algorithm. Too idiosyncratic to rank against the algorithmic reverbs; the editorial can mention it as "worth a listen, algorithm opaque".

## What this doc did not verify

- **On-device `modgui:label`s and screenshots** — the pi-Stomp was offline during research. The editorial step must fetch these via `ssh pistomp@pistomp.local` and `http://pistomp.local/effect/image/screenshot.png?uri=<encoded>`.
- **TAP Reverberator per-mode CPU** — the per-sample cost varies 2× across modes (mode 0 = 5 combs, mode 4 = 8 combs + 11 allpasses). The editorial should pick a couple of modes (AfterBurn default, Ambience, Hall Medium, Vocal Plate) and report measured CPU on a Pi core, not the worst-case mode.
- **MVerb control surface on-device** — the UI exposes parameters as 0–100 %, but the DSP works in 0–1; the editorial should confirm the on-device `modgui` shows the labels users expect ("Damping", "Decay" etc.) and not the internal parameter indices.
- **DIE Reverb authorship** — the `a-reverb.ttl.in` developer is `http://ardour.org/credits.html` ("Ardour Community"), but the source header credits Fredrik Kilander, Robin Gareus, Will Panther, Damien Zammit. Damien Zammit is the DISTRHO/DIE-Plugins packager; the DSP is setBfree's. The editorial should credit the DSP authors, not the LV2 packager.
- **C\* PlateX2 stereo behaviour** — verified from source that the tank input is mono-summed (`(sl[i]+sr[i]+normal)*.5`); the editorial should explicitly call this out, because a user reading "Stereo in/out" in the plugin name would reasonably expect true-stereo processing.
- **MaFreeverb / MaGigaverb DSP** — source retired. If a reader finds the source (the `distrho.sf.net` mini-ports were falkTX's early JUCE-less ports; they may exist in a tarball somewhere), the "Freeverb port" and "Gigaverb port" descriptions can be verified; until then they are plugin-name-only.
- **Airwindows StarChild / MV algorithm details** — the descriptions in §5.2 are from reading `StarChildProc.cpp` and `MVProc.cpp` headers; the full signal path was not traced line-by-line. The editorial should not make stronger claims than the source supports.

## Source URLs to cache

31 entries verified to resolve (`git ls-remote`) and added to `src/_data/plugins-source.json`. The full table:

| uri | bundle | source_url |
|---|---|---|
| `http://distrho.sf.net/plugins/MVerb` | `MVerb.lv2` | `https://github.com/DISTRHO/MVerb` |
| `urn:distrho:a-reverb` | `distrho-a-reverb.lv2` | `https://github.com/DISTRHO/DIE-Plugins` |
| `http://moddevices.com/plugins/tap/reverb` | `tap-reverb.lv2` | `https://github.com/moddevices/tap-lv2` |
| `http://moddevices.com/plugins/caps/Plate` | `mod-caps-Plate.lv2` | `https://github.com/mod-audio/caps-lv2` |
| `http://moddevices.com/plugins/caps/PlateX2` | `mod-caps-PlateX2.lv2` | `https://github.com/mod-audio/caps-lv2` |
| `http://www.openavproductions.com/artyfx#roomy` | `artyfx.lv2` | `https://github.com/openAVproductions/openAV-ArtyFX` |
| `http://moddevices.com/plugins/mda/Ambience` | `mod-mda-Ambience.lv2` | `https://github.com/moddevices/mda-lv2` |
| `http://github.com/Dougal-s/Aether` | `aether.lv2` | `https://github.com/Dougal-s/Aether` |
| `urn:juce:TalReverb` | `TAL-Reverb.lv2` | `https://github.com/DISTRHO/DISTRHO-Ports` |
| `http://moddevices.com/plugins/tal-reverb-2` | `mod-tal-Reverb-2.lv2` | `https://github.com/DISTRHO/DISTRHO-Ports` |
| `urn:juce:TalReverb3` | `TAL-Reverb-3.lv2` | `https://github.com/DISTRHO/DISTRHO-Ports` |
| `http://www.drowaudio.co.uk/audio/audio_plugins/reverb` | `drowaudio-reverb.lv2` | `https://github.com/DISTRHO/DISTRHO-Ports` |
| `urn:zamaudio:ZamVerb` | `ZamVerb.lv2` | `https://github.com/zamaudio/zam-plugins` |
| `http://zynaddsubfx.sourceforge.net/fx#Reverb` | `ZynReverb.lv2` | `https://github.com/zynaddsubfx/zynaddsubfx` |
| `http://plugin.org.uk/swh-plugins/gverb` | `gverb-swh.lv2` | `https://github.com/swh/lv2` |
| `https://github.com/ninodewit/SHIRO-Plugins/plugins/shiroverb` | `Shiroverb.lv2` | `https://github.com/ninodewit/SHIRO-Plugins` |
| `https://hannesbraun.net/ns/lv2/airwindows/galactic` | `Airwindows-Galactic.lv2` | `https://github.com/airwindows/Airwindows` |
| `https://hannesbraun.net/ns/lv2/airwindows/pocketverbs` | `Airwindows-PocketVerbs.lv2` | `https://github.com/airwindows/Airwindows` |
| `https://hannesbraun.net/ns/lv2/airwindows/starchild` | `Airwindows-StarChild.lv2` | `https://github.com/airwindows/Airwindows` |
| `https://hannesbraun.net/ns/lv2/airwindows/mv` | `Airwindows-MV.lv2` | `https://github.com/airwindows/Airwindows` |
| `http://faust-lv2.googlecode.com/Freaktail` | `Freaktail.lv2` | `https://github.com/pjotrompet/Freaked` |
| `http://faust-lv2.googlecode.com/Prefreak` | `Prefreak.lv2` | `https://github.com/pjotrompet/Freaked` |
| `http://lsp-plug.in/plugins/lv2/impulse_responses_mono` | `lsp-plugins-impulsantworten.lv2` | `https://github.com/lsp-plugins/lsp-plugins-impulse-responses` |
| `http://lsp-plug.in/plugins/lv2/impulse_responses_stereo` | `lsp-plugins-impulsantworten.lv2` | `https://github.com/lsp-plugins/lsp-plugins-impulse-responses` |
| `https://mod.audio/plugins/ConvolutionLoader` | `MOD-ConvolutionLoader.lv2` | `https://github.com/mod-audio/mod-convolution-loader` |
| `http://calf.sourceforge.net/plugins/Reverb` | `calf.lv2` | `https://github.com/calf-studio-gear/calf` |
| `http://drobilla.net/plugins/fomp/reverb` | `fomp-labs.lv2` | `https://gitlab.com/drobilla/fomp` |
| `http://drobilla.net/plugins/fomp/reverb_amb` | `fomp-labs.lv2` | `https://gitlab.com/drobilla/fomp` |
| `http://guitarix.sourceforge.net/plugins/gx_reverb_stereo#_reverb_stereo` | `gx_reverb.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_room_simulator_#_room_simulator_` | `gx_room_simulator.lv2` | `https://github.com/brummer10/guitarix` |
| `http://guitarix.sourceforge.net/plugins/gx_mbreverb_#_mbreverb_` | `gx_mbreverb.lv2` | `https://github.com/brummer10/guitarix` |

Already cached (no change needed): `rkr Reverb` (`https://github.com/ssj71/rkrlv2`), `DragonflyHallReverb`/`PlateReverb`/`RoomReverb`/`EarlyReflections` (`https://github.com/michaelwillis/dragonfly-reverb`), `gx_zita_rev1_stereo` and `gx_shimmizita` (`https://github.com/brummer10/guitarix` — already cached via other guitarix plugins).

Not cached, source not reachable via `git ls-remote`:

- `http://invadarecords.com/plugins/lv2/erreverb/mono` and `/sum` — Invada Studio is hosted on Launchpad as a Bazaar branch (`lp:invada-studio`), not git. Source tarball `invada-studio-plugins-lv2_1.2.0-0.tar.gz` is downloadable from `https://launchpad.net/invada-studio/lv2/1.2/+download` and was used for this research, but the canonical source URL is a Launchpad Bazaar branch, which `plugins-source.json` (git-oriented) does not accommodate. Left uncached; the editorial can link the Launchpad homepage.
- `http://distrho.sf.net/plugins/MaFreeverb` and `MaGigaverb` — the `distrho.sf.net` mini-ports namespace is falkTX's retired set, not in `DISTRHO/DISTRHO-Ports` master/legacy/juce7 branches as of 2026. Same situation as `3BandEQ` (doc 19). Left uncached; treated as closed source.

## Audit findings

- **MVerb is its own DPF repo, not in DISTRHO-Ports.** The `distrho.sf.net/plugins/MVerb` URI initially suggests the retired mini-ports set (like MaFreeverb), but `DISTRHO/MVerb` is a live, maintained DPF-Plugins-style repo (like DIE-Plugins). The algorithm is the full Dattorro figure-of-eight, not a stripped port. The editorial should not confuse the `distrho.sf.net` URI prefix with retirement.
- **DIE Reverb is setBfree's organ reverb.** The `doap:developer` is `http://ardour.org/credits.html` ("Ardour Community"), but the source credits Fredrik Kilander / Robin Gareus / Will Panther / Damien Zammit. Damien Zammit is the DISTRHO packager; the DSP is setBfree's `b_reverb`. The editorial should credit the DSP authors. The same DSP also ships as `setBfree Organ Reverb` (`b_reverb.lv2`) — the two plugins are the same algorithm through different LV2 wrappers.
- **C\* PlateX2 is not true-stereo.** Despite "Stereo in/out" in the plugin name, the tank input is mono-summed (`Reverb.cc:382`: `x = (sl[i] + sr[i] + normal) * .5`). The tank itself is stereo (parallel L/R tanks with cross-feed), but the input is mono. For a mono guitar chain this does not matter; for a stereo chain it means PlateX2 does not give you true-stereo reverb — it gives you summed-mono-into-stereo-tank. The editorial should call this out.
- **rkr-labs bundle situation.** The `rkr Reverb` ships in `rkr-labs.lv2`, and per `CLAUDE.md`'s bundle-pair rule the device loads the `-labs` build. The `ssj71/rkrlv2` repo *is* the labs source — it is the LV2-wrapper fork of rakarrack's effects, not a separate "labs" fork of rkrlv2. There is no "rkr-labs" repo to track; `rkrlv2` is the correct source URL and is already cached.
- **rkr Reverb / ZynReverb / GxReverb-Stereo are the same algorithm.** All three are Freeverb (Jezar at Dreampoint) with the same comb tunings `{1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617}` and allpass tunings `{225, 341, 441, 556}`, derived from ZynAddSubFX's Reverb.cpp. The differences are the LV2 wrapper (rkrlv2 / ZynAddSubFX-LV2 / guitarix-Faust) and the control surface. The editorial can mention this — a user picking "the Freeverb sound" has three interchangeable options differing mainly in UI.
- **TAP Reverberator uses fixed-point arithmetic.** `REVERB_CALC_FLOAT` is commented out by default (`tap_reverb.c:39`), so the device build runs the fixed-point path with `F2S = 2147483` (~60 dB headroom above 0 dB). This is unusual for a reverb and is the reason TAP Reverberator has been CPU-cheap and stable on ARM historically. The editorial can note this for the "why is this old plugin still good?" question.
- **Airwindows StarChild and MV are not in the same family as Galactic / PocketVerbs.** The shimmer-cloud editorial groups all Airwindows reverbs together, but StarChild (pitch-shifted tap delay) and MV (Midiverb-style 27-stage allpass chain with sin() feedback folding) are structurally different from Galactic (modulated delay matrix) and PocketVerbs (golden-ratio allpass chain). The shimmer-cloud editorial already lists them in the "Also considered" section as special-effect colours; this doc does not re-rank them.
- **MaFreeverb / MaGigaverb source is genuinely gone.** Verified across `DISTRHO/DISTRHO-Ports` master, legacy, and juce7 branches — the `distrho.sf.net` mini-ports set (which also included `3BandEQ`, `3BandSplitter`, `MaFreeverb`, `MaGigaverb`) was retired. The TTL on the device declares the plugins but the source is not reachable. Same treatment as doc 19's `3BandEQ` — footnote only, do not editorialise.
- **Invada ErReverb source is Bazaar-on-Launchpad, not git.** `git ls-remote` cannot verify it. The Launchpad homepage `https://launchpad.net/invada-studio` and the 1.2.0 source tarball were used for this research. `plugins-source.json` (git-oriented) does not have a place for it; the editorial can link the Launchpad page directly.