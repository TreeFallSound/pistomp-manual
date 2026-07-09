# The rakarrack Dynamics Plugins — Source-Level Analysis

Four dynamics plugins ship from the `rkr-labs.lv2` bundle: **rkr Compressor**, **rkr Sustainer**, **rkr Expander**, **rkr CompBand**. This doc reads each one's DSP and checks the claims made about them in `src/plugins/compressors.md`, several of which turn out to be wrong.

### Methodology

Read the upstream `ssj71/rkrlv2` sources (HEAD `0e6d6e0`, shallow checkout, verified with `git ls-remote`): `src/Compressor.C` (400 lines), `src/Sustainer.C` (183), `src/Expander.C` (247), `src/CompBand.C` (429), `src/AnalogFilter.C` (filter type table at lines 115–200), and the LV2 wrapper `lv2/rkrlv2.C` for port wiring and the wet/dry helper at line 178. Cross-checked port ranges and defaults against the installed TTL in `~/lv2/rkr-labs.lv2/{comp,sustain,expander,compband}.ttl`, and names/URIs against `src/_data/plugins.json`.

**Correction to doc 14.** Doc 14's suite survey lists "NoiseGate" among the rakarrack dynamics. `src/Gate.C` exists and `lv2/rkrlv2.C:4029` defines `init_gatelv2`, but no `Gate` plugin appears in `~/lv2/rkr-labs.lv2/manifest.ttl` and no gate URI appears in `plugins.json`. **It does not ship.** The Expander is the gate.

**Provenance.** `Compressor.C` and `CompBand.C` descend from `artscompressor.cc` (Matthias Kretz, Stefan Westerfeld), reworked by Ryan Billing in 2009 to fix a gain discontinuity at threshold and add a user knee; CompBand additionally carries the ZynAddSubFX header (Nasca Octavian Paul). `Expander.C` is adapted from Steve Harris's swh-plugins noise gate. `Sustainer.C` is Ryan Billing's own, 2010. Every file is GPL-2.0 except `Sustainer.C`, whose header claims GPL-3.0 in one sentence and GPL-2.0 in the next.

---

## 1. rkr Compressor — the engine everything else is built on

Feed-forward, peak-detecting, mono-linked by default. `Compressor::out` (line 251):

1. **Detector.** With `Peak` off, the detector is the instantaneous sample, full-wave rectified one line later. With `Peak` on, it's a leaky peak-hold: 12.5 ms hold (`hold = SR·0.0125`), then decay by `×0.9998` per sample (≈0.1 s), clamped at 20.0 to stop the limiter locking up on absurd input. **There is no RMS detector anywhere in this plugin.** The `Peak` toggle is peak-hold vs. raw sample, not peak vs. RMS.
2. **Envelope.** One-pole with separate attack/release coefficients, `att = (1/SR)/(t + 1/SR)`. Above `volume` 0.9 the coefficients change: attack shortens toward 1.0 and release lengthens (lines 296–301, 339–344). Above 1.0 it's `attr = 1.0`, `rel×0.1` — instant attack, slow release. That's a limiter mode that engages by level, not by a switch.
3. **Gain.** Three regions against `thres_db` and `thres_mx = thres_db + knee`.
4. **Output.** `gain_t = 0.4·gain + 0.6·gain_old` — a two-tap smoother. With `Peak` on, a hard clip at ±0.999 and a clipping flag.

**Stereo:** the `Stereo` toggle means *unlinked*. Off (the default), the detector is `0.5·(|L| + |R|)` and one gain applies to both channels. On, each channel gets its own detector and gain — so a hard-panned transient pulls one side down alone. Guitar into a mono chain: leave it off.

### The knee is not what the label says

`kratio = log₂(ratio)`. Inside the knee the effective ratio ramps `1 → kratio`, not `1 → ratio`:

```c
eratio = 1.0f + (kratio-1.0f)*(rvolume_db-thres_db)*coeff_knee;
```

Two consequences I verified algebraically from lines 317–320:

- **Gain is continuous at `thres_mx`** (both branches evaluate to `thres_db + knee/kratio − thres_mx`). Billing's 2009 fix holds.
- **Slope is not.** Below the corner the slope is `1/kratio − 1`; above it, `1/ratio − 1`. They agree only when `ratio = kratio`, i.e. ratio 2. So the "soft knee" bends toward a gentler ratio than the one you dialed, then snaps to the real one. The knee softens the *onset* and leaves a kink at the top.
- **At ratio 2, the knee does nothing at all.** `kratio = log₂(2) = 1`, so `(kratio − 1) = 0` and `eratio ≡ 1` across the whole knee region — no compression until `thres_mx`, where it jumps straight to 2:1.

Also: **`Ratio` has a minimum of 2** (`comp.ttl`, index 6, range 2–42, integer). There is no 1:1. Above threshold this plugin always compresses.

`Auto Output` adds `makeup = −thres_db − knee/kratio + thres_mx/ratio` on top of the `Output` gain, which is capped at 0 dB (range −40…0) — so all makeup comes from the auto term.

**Ports:** Threshold −60…−3 dB · Ratio 2…42 · Output −40…0 dB · Attack 10…250 ms · Release 10…500 ms · Auto Output · Knee 0…100 % · Stereo · Peak. All integers. No sidechain, no blend, no lookahead, no metering.

---

## 2. rkr Sustainer — a compressor with a moving threshold

183 lines, two knobs, and one idea worth the page. `Sustainer::out` (line 77):

```c
compenv = cbeta*oldcompenv + calpha*compeak;
if (compenv > cpthresh) {
    compg     = cpthresh + cpthresh*(compenv - cpthresh)/compenv;
    cpthresh  = cthresh + cratio*(compg - cpthresh);   // threshold chases the gain
    tmpgain   = compg/compenv;
}
if (compenv < cpthresh) cpthresh = compenv;
if (cpthresh < cthresh) cpthresh = cthresh;
```

The threshold is **state**, not a parameter. Each sample it slides toward the compressed output level and relaxes back to `cthresh`. That feedback loop is what makes a note bloom rather than duck: the harder the note hits, the further the threshold walks up, and the gain recovers under the decaying tail instead of gating it.

Fixed timing, not exposed: 10 ms peak-detector decay after a 12.5 ms hold; 50 ms one-pole envelope both ways.

The **Sustain** knob (1–127) drives three things at once (line 159):

| `fsustain` | Input gain `dB2rap(42·f − 6)` | `cthresh = 0.25 + f` | `cratio = 1.25 − f` |
|---|---|---|---|
| 0.0 | −6 dB | 0.25 | 1.25 |
| 0.5 (default) | +15 dB | 0.75 | 0.75 |
| 1.0 | **+36 dB** | 1.25 | 0.25 |

So turning up Sustain slams the input by up to 36 dB while raising the threshold and *tightening* the feedback ratio. That's the whole design. There is no output limiter and no filtering — the "brighter than the full rakarrack Compressor" line in the TTL comment is a consequence of the raw drive and the fast fixed timing, not of any EQ. **Gain** (0–127) is a −30…0 dB output trim.

`Sustainer` does **not** share the `Compressor` class. Doc entries claiming "same engine as rkr Compressor" are wrong — it's a separate 183-line file with a different topology.

---

## 3. rkr Expander — an exponential downward expander (and a tone control you didn't ask for)

Adapted from Steve Harris's swh noise gate. The gain curve is the interesting part (line 230):

```c
if (env > tlevel) env = tlevel;
expenv = sgain * (expf(env*sfactor*tfactor) - 1.0f);   // sgain = exp(-sfactor)
```

with `tfactor = dB2rap(−threshold)`, `tlevel = 1/tfactor`, `sfactor = dB2rap(shape/2) = 10^(shape/40)`.

Since `env` is clamped at `tlevel`, the exponent runs over `[0, sfactor]`, giving `expenv ≈ 1` at threshold and `0` at silence. Substituting `u = env/tlevel`:

```
gain(u) = (e^(sfactor·u) − 1) / e^sfactor,   u ∈ [0,1]
```

An exponential — the diode/BJT `I = I₀(e^(V/Vt) − 1)` law, which is what the TTL comment means by "analog BJT modeled." It is a genuine **downward expander**, not a gate: below threshold the signal fades on a curve whose steepness is set by `Shape` (1–50 → `sfactor` 1.06…17.8), rather than slamming shut. At `Shape` 20 (`sfactor` = 3.16) a signal 6 dB under threshold still passes about −9 dB. Turn `Shape` up for gate behavior, down for a swell.

Gain smoothing uses `d_rate` in **both** directions (`gain = (1 − d_rate)·oldgain + d_rate·expenv`), so `Release` sets how fast the gain opens as well as closes; `Attack` only affects the envelope follower's rise.

### The trap: LPF and HPF are in the audio path

```c
lpfl->filterout(efxoutl, period);   // efxoutl IS the output buffer
hpfl->filterout(efxoutl, period);
```

The wrapper (`run_expandlv2`, line 2119) copies input to output and runs in place. These are not sidechain filters — they are 2-pole Butterworth filters on your signal. The factory default is **LPF 3134 Hz, HPF 76 Hz**, so an Expander dropped in at defaults audibly darkens the tone before it does anything dynamic. For a transparent gate, open them to 26 kHz / 20 Hz.

**Ports:** Threshold −80…0 dB · Shape 1…50 · Attack 1…5000 ms · Release 10…1000 ms · LPF 20…26000 Hz · HPF 20…20000 Hz · Output 1…127.

---

## 4. rkr CompBand — four bands, and a null at every crossover

Four `Compressor` instances behind three filter pairs, summed. The crossovers are built like this (`CompBand.C:57–68`):

```c
lpf1l = new AnalogFilter (2, 500.0f, .7071f, 0, sample_rate, interpbuf);  // 2-pole LPF
hpf1l = new AnalogFilter (3, 500.0f, .7071f, 0, sample_rate, interpbuf);  // 2-pole HPF
```

`AnalogFilter` type 2 is "LPF 2 poles" and type 3 is "HPF 2 poles" (`AnalogFilter.C:139,160`); `stages = 0` means a single biquad. Q = 0.7071 is Butterworth.

**These are 2nd-order Butterworth pairs, not Linkwitz-Riley.** A Linkwitz-Riley crossover is two cascaded Butterworth sections (4th order, −6 dB at the corner) precisely so the bands sum flat. A 2nd-order Butterworth pair does not:

```
LP(s) + HP(s) = 1/(s²+√2s+1) + s²/(s²+√2s+1) = (1 + s²)/(s²+√2s+1)
```

At `s = jω_c` the numerator is `1 − 1 = 0`. **A complete null at the crossover frequency.** The classic fix is to invert one band; `CompBand::out` line 186 sums all four with the same sign:

```c
efxoutl[i] = (lowl[i] + midll[i] + midhl[i] + highl[i]) * level;
```

At unity band gains you get a deep notch at 200 Hz, 2 kHz, and 15 kHz (the defaults). The notches fill in only when the per-band compressors have pulled the bands to different gains — which is to say the plugin's frequency response depends on how hard it is compressing. Whether that reads as "broken" or as "the sound of the thing" is a judgment call; it is definitely not a transparent multiband.

### What the controls actually are

`changepar` (line 328) exposes **13** parameters: wet/dry, four ratios, four thresholds, three crossovers, output gain. Per band you get **ratio and threshold only**. Attack, release, knee, auto-output, stereo and peak are frozen at whatever the `Band CompBand` preset set them to at construction (`Compressor_Change_Preset(0, 5)` → `{-3, 2, 0, 5, 50, 1, 0, 1, 0}`): attack 5 ms, release 50 ms, knee 0, auto-output on, **stereo unlinked**, peak off. So: no per-band attack/release, no peak/RMS toggle, no output limiter, and the bands are *not* stereo-linked.

**Wet/dry is real and its default is nearly dry.** `run_mbcomplv2` (line 3708) calls `wetdry_mix(plug, plug->mbcomp->outvolume, …)`, and `outvolume = Pvolume/128`. The TTL default for `WETDRY` is **5**, giving `mix = 0.039` → dry at unity, wet at 0.078. Load rkr CompBand and it will sound like it is doing nothing, because it very nearly is. Turn `WETDRY` up.

**Ports:** Wet/Dry 0…127 · four Ratios 2…42 · four Thresholds −70…24 dB · Crossover 1 20…1000 Hz (default 200) · Crossover 2 1000…8000 Hz (default 2000) · Crossover 3 2000…26000 Hz (default 15000) · Gain 0…127 (default 88 ≈ +5.6 dB).

---

## 5. Verdict

| Plugin | What it really is | Use it for |
|---|---|---|
| **rkr Sustainer** | Feedback-threshold compressor, +36 dB of available input drive, two knobs | Bloom and sustain on single notes. The reason to look at this suite at all. |
| **rkr Compressor** | Feed-forward peak compressor, level-triggered limiter mode, quirky log₂ knee | A conventional squash with an honest limiter ceiling. Ratio can't go below 2. |
| **rkr Expander** | Exponential downward expander with filters in the signal path | Noise control that fades instead of chopping; envelope swells at low `Shape`. Open the LPF/HPF first. |
| **rkr CompBand** | Four peak compressors summed across non-complementary crossovers | Not a transparent multiband. Reach for ZaMultiComp or GxMultiBandCompressor instead. |

### Corrections to `src/plugins/compressors.md`

| Claim | Reality |
|---|---|
| "rkr CompBand … proper Linkwitz-Riley crossovers" | 2nd-order Butterworth, non-complementary, nulls at each corner |
| "Per-band ratio, threshold, attack, release" | Ratio and threshold only |
| "Stereo link, peak/RMS toggle, hard output limiter, auto makeup" | Stereo is *un*linked; no RMS mode exists in the codebase; limiter off; auto-makeup on but not exposed |
| "rkr Sustainer … same engine as rkr Compressor" | Separate file, different topology (dynamic threshold vs. static) |
| "Dynamic attack/release in limiting mode" (attributed to Sustainer) | That belongs to `Compressor.C`, not `Sustainer.C` |
| "rkr Compressor / Sustainer / CompBand" listed; NoiseGate listed in doc 14 | No gate ships. `rkr Expander` is the fourth plugin, and it is missing from the guide. |
