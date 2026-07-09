# 18 — Uni-Vibe and Phaser

Scope: every plugin on the device that sweeps an allpass chain. Fourteen URIs, twelve distinct DSP implementations. Read from source except where noted.

Sources read (all added to `plugins-source.json` except the two below):

| Project | Repo | Read |
|---|---|---|
| rakarrack-lv2 | `github.com/ssj71/rkrlv2` | `Vibe.C`, `APhaser.C`, `Alienwah.C`, `Synthfilter.C`, `EffectLFO.C`, `global.h` |
| caps | `github.com/moddevices/caps-lv2` | `Phaser.cc`, `Phaser.h`, `dsp/Roessler.h` |
| fomp | `gitlab.com/drobilla/fomp` | `cs_phaser.cc`, `cs_phaser.h`, `fomp.lv2/*.ttl` |
| guitarix | `github.com/brummer10/guitarix` | `LV2/faust/phaser.dsp`, `faust-generated/phaser.cc` |
| calf | `github.com/calf-studio-gear/calf` | `audio_fx.cpp`, `calf/audio_fx.h`, `metadata.cpp` |
| ZynAddSubFX 3.0.5 | `github.com/zynaddsubfx/zynaddsubfx` | `Effects/Phaser.cpp`, `Effects/Alienwah.cpp` |

**Not readable.** Invada Stereo Phaser: upstream is a Bazaar branch on Launchpad, no git remote resolves; introspected from `inv_phaser.ttl` on the device only. The Pilgrim: closed-source binary, **declares no license anywhere in its bundle** (`grep -c license` returns 0 across all three `.ttl` files) and carries no source pointer; introspected from ports and `strings` only.

---

## The fork in the road

Both effects sum a swept allpass chain against the dry signal, so both move notches through the harmonics rather than through the volume. What separates a uni-vibe from a phaser is not LFO speed. It is **whether the stages are identical**.

A phaser stages identical allpass sections and sweeps them from one control voltage. The notches stay in a fixed ratio and glide together. Every phaser on this device does this, and they differ only in how the ratio is set: fixed at 1.0 (Calf), geometric with a knob (caps `spread`, guitarix `fratio`), or perturbed by modelled component tolerance (rkr, Zyn `offset[]`).

A uni-vibe stages **four different capacitors**. `Vibe.C:345` names them in a comment — `0.015 µF, 0.22 µF, 470 pF, 0.0047 µF` — and these are the real Univibe values. Because each stage sees the same swept resistance across a different capacitor, the four notches sit at frequencies spanning nearly three decades and move at different rates through the sweep. The spacing is not merely uneven; it *changes shape* as the sweep travels. That is the throb.

### Correction to the draft page

The draft claims the vibe's stages "fall out of step" because "each stage is driven from its own photocell, and photocells lag." **This is wrong on the mechanism.** `Vibe::modulate()` (`Vibe.C:416`) sets one resistance `Rv = 4700 + ldrl` for stages 0–3 and one `Rv = 4700 + ldrr` for stages 4–7 — and stages 0–3 are the *left channel*, 4–7 the *right*. There is one lamp and one cell per channel, shared by that channel's four stages. `emitterfb = 25.0f/fxl` is likewise computed once per channel per sample.

The photocell lag is real, and it is what makes the sweep breathe rather than glide. But it lags all four stages **together**. The non-uniform notch motion comes from the four capacitor values, not from independent per-stage lag. Fix the page before publishing.

---

## The lamp and the cell (rkr Vibe)

Two cascaded lags stand between the LFO and the filter, and they are the plugin.

| Element | Code | Value |
|---|---|---|
| Lamp turn-on curve | `lfol = 2 − 2/(lfol+1)` | compressive; fast rise, slow tail |
| Lamp thermal lag | `lampTC = 1/(0.012·SR + 1)` | ≈ 12 ms one-pole |
| Cell dark resistance | `Ra = 500 kΩ` | `Vibe.C:42` |
| Cell lit resistance | `Rb = 600 Ω` | `Vibe.C:44` |
| Cell time constant | `dTC = 0.045` | 45 ms, **signal-dependent** |
| Cell attack ≠ release | `dalpha` uses `0.5·dRC` | release runs at half the attack constant |

The cell constant is not fixed: `dRCl = dTC·exp(stepl·minTC)` recomputes the time constant every sample from the cell's own current state, so a bright part of the sweep tracks faster than a dark part. This is the asymmetric, slightly late, slightly sticky quality of a real LDR, and it is why the vibe never sounds like a triangle wave.

Each of the four stages is a first-order allpass built from four one-pole IIRs (`ecvc`, `vc`, `vcvo`, `vevo`) derived by bilinear transform from the transistor's collector, emitter, and passive network. Between stages the signal passes `bjt_shape()` — an emitter-follower turn-on nonlinearity, `vbe = 0.8 − 0.8/(vin+1)`. **The rkr Vibe is a nonlinear phaser**: four saturations per channel per sample, in series, inside the sweep. That, and not the LFO, is where the "expensive" thickness comes from.

The shaper is **asymmetric**, and worth tabulating because two chain-position claims depend on it:

| in | −1.00 | −0.90 | −0.50 | 0 | +0.50 | +0.90 | +1.00 | +1.50 |
|---|---|---|---|---|---|---|---|---|
| out | −0.9059 | −0.8516 | −0.4901 | 0 | +0.4962 | +0.8944 | +0.9941 | +0.9941 |

It passes more on the positive half than the negative (`+0.894` vs `−0.852` at `|x| = 0.9`), so it produces even-order harmonics and a small level-dependent DC offset — like the real single-transistor stage. And it is **hard-clipped outside `|x| = 1.0`**, which is full scale for an LV2 float buffer.

Feedback is bipolar, `fb = (Pfb − 64)/65`, taken from the last stage's output.

**No chorus/vibrato switch.** The original circuit's switch selects dry+wet (chorus) versus wet-only (vibrato). `Vibe.C` has no mix stage at all; the LV2 wrapper's `Wet/Dry` port (default 64 of 128, so 50/50) is that switch. Set it to 128 for vibrato, leave it at 64 for chorus. The stock presets named "Classic Chorus" and "Vibe Chorus" simply move other parameters.

`Tempo` on every rakarrack plugin is **BPM, not Hz** — `EffectLFO.C:85`, `incx = Pfreq·PERIOD/(SR·60)`, so LFO Hz = Tempo/60. Vibe's default Tempo 14 is 0.233 Hz. The 1..600 range is 0.017 Hz to 10 Hz.

---

## The phasers

### rkr Analog Phaser and ZynPhaser are the same DSP

`zyn/src/Effects/Phaser.cpp:127` carries the identical twelve `offset[]` constants, the identical `Rmin = 625.0f` (2N5457 JFET on-resistance at Vgs=0), `Rmax = 22000.0f`, and `C = 50 nF` as `rkrlv2/src/APhaser.C:60`. Both are Ryan Billing's (Transmogrifox) JFET model; rakarrack took it from ZynAddSubFX and ZynAddSubFX kept it. The draft's suspicion is confirmed.

They are not interchangeable, and the differences run the other way from what you'd guess:

| | rkr Analog Phaser | ZynPhaser |
|---|---|---|
| JFET analog model | always | only when `analog` toggle is on |
| Plain digital phaser | no | yes, `Panalog = 0` path, with a `phase` control |
| Barber-pole mode | **yes** — LFO type 2 wraps the sweep with `fmodf`, an endless rise | no |
| Stage change | `cleanup()` — flushes state | `devalloc`/`valloc` **and** `cleanup()` |

rkr's barber-pole mode is not documented in its own port list; it is a side effect of `changepar` case 4 setting `barber = 1` when the LFO type equals 2 (`APhaser.C:349`). Nothing else on the device does an infinite-rise phaser.

Both interpolate the LFO linearly across the buffer and recompute the allpass coefficient **per stage per sample** (two divides each), so the sweep is smooth at any depth. The `distortion` port feeds the highpass part of each stage back into that stage's coefficient (`d = (1 + 2(0.25+g)·hpf²·distortion)·mis`), making the notch position depend on signal level. The comment at `APhaser.C:163` is candid: "This is symmetrical. FET is not, so this deviates slightly, however sym dist. is better sounding than a real FET."

`Mismatch` (0–100) scales the twelve `offset[]` tolerances into the per-stage coefficient. At 0 all twelve stages are identical and a 12-stage sweep is glassy and sterile. This is the control the draft was right about.

### C\* PhaserII is modulated by a Rössler attractor, not a Lorenz one

`Phaser.h:32` includes `dsp/Roessler.h`; the member is `lfo.roessler`; `Phaser.cc:57` calls `lfo.roessler.set_rate(.05*rate)`. A `dsp/Lorenz.h` exists in the caps tree and **this plugin does not include it**. Tim Goetze's own descriptor names the plugin `C* PhaserII - Mono phaser` (`Phaser.cc`, `Descriptor<PhaserII>::setup`). The "modulated by a Lorenz fractal" text is MOD's repackaging, present only in `mod-caps-PhaserII.lv2/PhaserII.ttl`.

The chaotic LFO is real, though. `lfo` port 0 selects sine (`|sin|²`) or fractal; the fractal path is `min(.99, |lp(4.3 · roessler.get())|)` — a Rössler attractor's output, lowpass-filtered at `5(1+rate)` Hz to keep it from stepping. Rössler is a single-scroll attractor: the sweep wanders quasi-periodically and never repeats, but stays in one lobe, so it drifts rather than lurching the way a Lorenz two-lobe attractor would. In use it is a phaser whose rate breathes irregularly.

Twelve one-pole allpass sections. The `spread` port geometrically scales the delay per stage (`d *= spread` inside the stage loop, `spread = 1 + 0.5π·param`, so 1.0 to ~2.57), which spaces the notches logarithmically — the closest thing on the device to the vibe's uneven spacing, arrived at deliberately rather than from a parts bin. `resonance` scales feedback to a maximum of 0.9. The input is padded 6 dB (`x = .5 * s[i]`) and the output is `x + y·depth`, so `depth` is a wet mix, not a sweep depth.

Control rate is one update per `blocksize` samples: 16 at ≤32 kHz, 32 above, 64 above 64 kHz. At 48 kHz that is 32.

### CS Phaser 1 — thirty sections, and a tanh in the feedback loop

Fons Adriaensen, ported by David Robillard. `NSECT = 30`. This is not a guitar phaser; it is the phaser section of a large analog polysynth ensemble, and the `CS` refers to that instrument.

- `z = 4·tanhf(0.25·z)` sits **inside the feedback path**, before the allpass chain (`cs_phaser.cc`). It is the only phaser here that saturates its own feedback, which is what lets `fb_gain` run high without the resonance screaming.
- `Sections` is read per block as `floor(port + 0.5)` and used directly as a loop bound. No allocation, and the `_c[]` state persists.
- `Output mix` is bipolar: `gi = 1 − |gm|`, so negative values invert the wet path and swap notches for peaks.
- The allpass coefficient is computed once per 16 samples and then **linearly ramped per sample** (`dw = (t − w)/k`). Fons interpolates properly. Nobody else in this group ramps the coefficient itself.

**Practical caveat that disqualifies it.** `CS Phaser 1` has no LFO. Its three modulation inputs — `FM`, `Exp FM`, `Lin FM` — are `lv2:CVPort`s, not control ports. Without CV routing there is nothing to sweep it, and the plugin sits as a fixed comb. `CS Phaser 1 with LFO` is the same 30-section engine with an internal LFO (`LFO frequency`, `LFO waveform`, `Modulation gain`) and no CV ports. **Use the LFO variant.** The non-LFO variant is a modular building block that landed on a guitar pedal by accident.

### GxPhaser is Julius O. Smith's textbook phaser, with three knobs

The draft guesses guitarix modelled a circuit here as they did for the wahs. They did not. `LV2/faust/phaser.dsp` says so in the header: "phaser taken from effect.lib by Julius O. Smith III." It is four **second-order** resonant allpass sections (`ap2p`, pole radius `R = exp(−π·width/SR)`), notches at `th(i) = fratio^(i+1)·th1` — geometric spacing again — with quadrature LFOs (`oscrc`/`oscrs`) giving the two channels a fixed 90° offset.

The Faust source exposes `width`, `fratio`, `frqmin`, `frqmax`, `depth`, `feedback`, `invert`, and a vibrato-mode checkbox. **The LV2 build exposes none of them.** `gx_phaser.ttl` has exactly three control ports: `Dry/Wet`, `LEVEL`, `SPEED` (0–10 Hz, default 0.5). Everything interesting is compiled in at `Notches=4, fratio=1.5, width=1000 Hz, fb=0, frqmin=100, frqmax=800`. Feedback is hard-wired to zero, which is why it sounds polite.

### Calf Phaser is the controllable one, and the only one safe to re-stage live

`simple_phaser`, `audio_fx.h:108` — one `onepole` allpass coefficient shared by every stage, so the notches are uniformly spaced and stay that way. Mono internally; the stereo plugin runs two instances with a `Stereo phase` offset (0–360°, default 180°).

What it has that nothing else does:

- `Center Freq` 20 Hz–20 kHz, logarithmic — a direct manual notch position.
- `Mod depth` in **cents**, 0–10800. That is nine octaves of sweep.
- `Feedback` bipolar, −0.99 to +0.99.
- `set_stages()` (`audio_fx.cpp:47`) **copies the last stage's state into the new stages when the count grows** and never frees. It is the only implementation in this group that changes stage count without flushing.

Control rate is every 32 samples (`cnt == 32`).

### rkr Synthfilter — the phaser the draft's candidate table omitted

Categorized `Filter`, so a category filter for `Phaser` skips it. It is an allpass bank: `MAX_SFILTER_STAGES = 12`, with **separate lowpass and highpass stage counts** (`Lowpass Stages` default 4, `Highpass Stages` default 2) and an `HPF/LPF Offset` between the two banks. Same JFET lineage, different device: `Rmin = 185.0f`, not 625.

It is swept by `lmod = lfol·width + depth + env·sns` — LFO **plus** envelope, with `Attack Time` and `Release Time` on the follower. So it is the only plugin here that is simultaneously an LFO phaser and an envelope phaser, and `Subtract Output` flips notches to peaks. If MuTroMojo is the envelope wah (doc 05), this is the envelope phaser.

It ships `Wet/Dry = 0`. It sounds bypassed on load. Doc 17 flagged this; it is still true.

### AlienWah is not a phaser

Both `rkr AlienWah` and `ZynAlienWah` are Nasca Octavian Paul's complex-coefficient feedback delay: a ring buffer of `complex<float>` multiplied each sample by `clfo = fb·(cos(θ), sin(θ))` with θ swept by the LFO (`Alienwah.cpp`). It is a rotating comb, not an allpass cascade. The output takes the real part, scaled `10·(fb + 0.1)`. Mention it to explain why it is filed under Phaser and doesn't belong.

`ZynAlienWah` is the same DPF build of 3.0.5. Its `delay` control calls `setdelay()` → `devalloc`/`valloc` → `cleanup()`.

### Invada Stereo Phaser (ports only)

No source. From `inv_phaser.ttl`: `Period` is in **seconds**, 0.5–20 s, logarithmic, and carries `mod:tapTempo` — so 0.05 Hz to 2 Hz, far slower than anything else here, which matches its own description ("a very long oscillation"). `Phase Offset` −180°..180° (default 45°). `Width` 1–15 (default 8). `Depth` 0–100. `Soft Clip` toggle, on by default. Plus three output-only meter ports (`Drive Lamp`, `LFO L Lamp`, `LFO R Lamp`) that MOD-UI renders as indicators.

No feedback control. Three port variants (mono in / stereo in / sum L+R) are the same plugin. GPL, but the source is a dead Launchpad bzr branch; the `-labs` build is what loads.

### The Pilgrim (ports only)

Closed source. **No license declared.** Two control ports, total: `Filter Freq` (0–1, default 0.5) and `Mix` (0–1, default 1.0). No rate, no depth, no feedback, no stage count. `strings` on the binary turns up `freq` and nothing resembling an LFO parameter. It is a manual phaser — a treadle position with no treadle — unless its GUI hides an internal sweep, which the port list gives no way to reach. Given no license and no source, recommending it is a liability. Note it and move on.

---

## Automation: which pots survive a performance

This is the part that matters on a pi-Stomp, where a knob or expression pedal is bound to a port and moved while audio runs. Three failure modes, in descending severity.

**1. Reallocates memory on the audio thread.** Hard-blocked. Do not bind these.

| Plugin | Port | What happens |
|---|---|---|
| ZynPhaser | `stages` | `devalloc` + `valloc` + `cleanup()` (`Phaser.cpp`, `setstages`) |
| ZynAlienWah | `delay` | `devalloc` + `valloc` + `cleanup()` (`Alienwah.cpp`, `setdelay`) |

An allocation inside `run()` can block on the allocator and produce an XRUN, and the `cleanup()` on top of it silences the chain. Set these once, save the pedalboard, never touch them.

**2. Flushes filter state — audible dropout and click.** Not a crash, but it stutters.

| Plugin | Port | Why |
|---|---|---|
| rkr Analog Phaser | `Stages` | `setstages()` calls `cleanup()` (`APhaser.C:280`), zeroing all 12 allpass states **and** the feedback accumulator |
| rkr Synthfilter | `Lowpass Stages`, `Highpass Stages` | both call `cleanup()`, which also zeroes the envelope follower (`env = 0`) |

Note the asymmetry: rkr Analog Phaser's `Stages` is a plain integer port with no `lv2:enumeration`, so nothing in the UI warns you. It is the single most tempting and most destructive automation target in this group — sweeping 4→12 stages mid-solo is exactly the gesture a player would try.

**3. Steps discontinuously — clicks, polarity flips, or a jumped sweep.**

| Plugin | Port | Why |
|---|---|---|
| rkr Analog Phaser | `Subtract` | inverts output polarity (`efxout *= -1`). A hard click at any nonzero signal. |
| rkr Analog Phaser | `Hyper` | squares the modulator. The sweep position jumps to `mod²`. |
| rkr Analog Phaser | `LFO Type` | value 2 silently arms barber-pole mode and wraps the sweep with `fmodf` |
| rkr Synthfilter | `Subtract Output` | same polarity inversion |
| rkr Vibe | `LFO Type` (0–11), `Stereo` | enumeration; mono↔stereo is a hard reconfigure |
| C\* PhaserII | `lfo` | integer sine↔fractal. The two modulators sit at unrelated positions; the sweep teleports. |
| Calf Phaser | `Reset` | it is a button. That is the point. |
| fomp CS Phaser | `Sections` | chain length changes instantly; stale `_c[]` state in the newly-active sections |
| Invada | `Soft Clip` | toggled |

**Safe and rewarding to automate.** These are continuous, and either interpolated per sample or recomputed at a control rate fast enough not to zipper.

| Plugin | Ports | Note |
|---|---|---|
| rkr Vibe | `Width`, `Depth`, `Tempo`, `Feedback`, `Wet/Dry`, `Pan`, `LFO L/R Delay` | the lamp+cell lag smooths everything downstream of the LFO; `Wet/Dry` is the chorus↔vibrato switch and sweeping it is musical |
| rkr Analog Phaser | `Width`, `Phase Depth`, `Tempo`, `Feedback`, `Distort`, `Mismatch`, `Wet/Dry` | coefficient is recomputed per sample; the LFO is linearly interpolated across the buffer |
| Calf Phaser | `Center Freq`, `Mod depth`, `Mod rate`, `Feedback`, `Stereo phase`, **`# Stages`** | the only stage count in the group that is safe — state is copied forward, nothing is freed |
| C\* PhaserII | `rate`, `depth`, `spread`, `resonance` | block-rate (32 samples), continuous |
| GxPhaser | `SPEED`, `Dry/Wet`, `LEVEL` | there is nothing else to automate |
| fomp CS Phaser w/ LFO | `Frequency`, `LFO frequency`, `Modulation gain`, `Feedback gain`, `Output mix` | coefficient is ramped per sample — the cleanest sweeps here |
| Invada | `Period`, `Phase Offset`, `Width`, `Depth` | `Period` accepts tap tempo |

Two caveats on "safe." Every rakarrack control port is `lv2:integer` over 0–127, so an expression pedal gets **128 discrete steps**, applied once per buffer. On sweep parameters this is inaudible. On `Wet/Dry` at high feedback it is not — you will hear the steps. And `Feedback` on rkr Analog Phaser (`fb = (Pfb−64)/64.2`) reaches ±0.997; the chain self-oscillates near the ends.

---

## CPU

Per-sample operation counts, derived from the loop bodies rather than from claims. "Divides" counts float division, which on a Cortex-A72 is ~10–14 cycles and not pipelined the way multiply-add is.

| Plugin | Allpass sections | Divides/sample | Transcendentals/sample | Coefficient update rate |
|---|---|---|---|---|
| C\* PhaserII | 12 (mono) | ~0.4 | 0 | 1 per 32 samples |
| Calf Phaser | ≤12 ×2 ch | ~0.4 | 0 | 1 per 32 samples |
| GxPhaser | 4 ×2 ch, 2nd-order | 0 | **8 × `std::cos`** | per sample |
| fomp CS Phaser | 30 (mono) | 0 | 1 × `tanhf` | 1 per 16, ramped |
| rkr Analog Phaser | `Stages` ×2 ch | 2 per stage per ch → **8 at default, 24 at 12 stages** | 0 | per sample |
| rkr Vibe | 4 ×2 ch | **~25** | 2 × `logf` (libm) + 4 × `f_exp` (approx) | **1 per 4 samples, all 8 stages** |

Three results worth carrying into the article.

**GxPhaser is the surprise.** Faust emits `std::cos(fSlow9 * fTemp0)` four times per channel per sample (`faust-generated/phaser.cc:143–146`), because the notch angles `th(i)` track the LFO continuously. Eight libm `cos` calls per sample at 48 kHz is 384,000 per second, from the plugin with the fewest notches and the fewest knobs on the page. It is not ruinous, but a 12-notch caps phaser is cheaper.

**rkr Vibe is the most expensive modulator on the device**, and doc 17's blanket claim that the modulation effects "are cheap — a handful of biquads/delay taps" does not hold for it. `modulate()` recomputes bilinear-transform coefficients for **all eight stages** every four samples: seven divides per stage, so ~56 divides per call, ~14 divides/sample amortized, on top of ~11 more in the per-sample lamp/cell path. Add a real `logf` per channel per sample. Amend doc 17.

The mitigating detail: rakarrack's `f_exp` is `f_pow2(x·LN2R)`, a bit-twiddling approximation (`global.h:95`), not libm. The `logf` calls are the real ones.

**rkr Analog Phaser scales linearly and steeply.** Two divides per stage per channel per sample means 12 stages costs three times what the default 4 stages costs. Budget for the setting you actually use.

---

## Verdict

**Swirl: rkr Vibe.** The only uni-vibe on the device, and not a phaser wearing a slow LFO. Four stages, four different real Univibe capacitors, one lamp and one photocell per channel with an asymmetric signal-dependent time constant, and a transistor shaper between every stage. It costs more CPU than anything else here and earns it. Set `Wet/Dry` to 64 for chorus, 128 for vibrato. Place it **after dirt** — see below.

**Sweep: rkr Analog Phaser.** JFET model with modelled component mismatch, per-sample coefficient recomputation, feedback tapped after the first stage, a signal-dependent notch shift on the `Distort` port, and an undocumented barber-pole mode on LFO type 2. Nothing else offers all four. Leave `Stages` alone once you have set it. Place it **after dirt** — a phaser in front of a distortion has its notches filled back in by the harmonics the distortion generates.

**Also great, and the article should say so: Calf Phaser.** If you want to *play* the phaser rather than let it cycle — park the notch with `Center Freq`, ride `# Stages` with a footswitch, sweep nine octaves — it is the only one built to survive that. Uniform notch spacing means it never sounds like a vibe, and its `Mod depth` in cents is the most honest control on the page.

**Its own section: C\* PhaserII.** The Rössler LFO is real and there is no equivalent anywhere on the device. Correct the "Lorenz" claim while using it; the plugin's own name is wrong.

**Also considered:** ZynPhaser (same engine as rkr's, minus barber-pole, plus a plain digital mode and an allocating `stages` port); rkr Synthfilter (the envelope phaser the draft's table missed; ships silent at `Wet/Dry = 0`); GxPhaser (JOS textbook phaser, three of its ten controls exposed, feedback hard-wired to zero); CS Phaser 1 with LFO (30 sections, tanh-saturated feedback, the smoothest sweep here, and a synth ensemble rather than a pedal); CS Phaser 1 (same, but sweepable only over CV — unusable standalone); Invada Stereo Phaser (0.05–2 Hz, tap tempo, no feedback, source unavailable); rkr AlienWah and ZynAlienWah (rotating complex-coefficient comb, filed under Phaser, not a phaser); The Pilgrim (closed source, no license, two knobs).

**Two plugins the category filter and the draft both missed**, found by grepping `rdfs:comment` rather than `categories`:

- **Harmless** (`Harmless.lv2`, categorized `Modulator`, SHIRO, ISC) — "a waveshapeable harmonic tremolo with a stereo phase control." Ports: `depth`, `rate`, `tone`, `shape`, `phase`. A harmonic tremolo splits the signal into two bands and fades between them in antiphase, which is the *other* historical way to get a throb that isn't volume. It is not an allpass phaser, but it is the closest thing on the device to the uni-vibe's feel by a different route, and a vibe page that ignores it is incomplete. No source repo resolves; ports only.
- **mud** (`mud.lv2`, categorized `Filter`, remaincalm.org, LGPL3) — its own description claims it is "capable of interesting univibe-style modulation." It is a mono bandpass filter with resonance swept by an LFO, collapsed onto three macro knobs (`Mix`, `Filter`, `LFO`). A swept resonant bandpass is a wah, not a vibe: it moves a peak, not a set of notches. The claim is marketing. Mention and dismiss. No source repo resolves; ports only.

**MDA ThruZero** is a through-zero flanger and is not in this cohort. It is worth one sentence explaining that a flanger sweeps a delay line and a phaser sweeps an allpass chain, and the two produce differently-spaced notches.

---

## Open items for the article

- Screenshots for: rkr Vibe, rkr Analog Phaser, Calf Phaser, C\* PhaserII. Fetch from `http://pistomp.local/effect/image/screenshot.png?uri=<encoded>` using the verbatim URIs in `plugins.json`.
- Settings tables for the two picks and Calf.
- Credits table. `The Pilgrim` has no license to cite; say so rather than leaving the cell blank. `Invada` is GPL per its `.ttl` but has no reachable source.
- Chain position: **both go after dirt**, for the same reason. Dirt upstream hands the allpass chain a dense spectrum, and a notch only announces itself when there is harmonic content sitting at the notch frequency. Dirt *downstream* of either effect regenerates content at the frequencies just notched out and compresses what is left, shallowing the sweep.

  An earlier draft of this doc said the vibe belongs before dirt, on the theory that its internal saturation "wants a clean input." That was wrong, and it contradicted the single best-known uni-vibe rig, which is a fuzz into a vibe. The correct caveat is about level, not order: `bjt_shape()` clamps at `|x| > 1.0` (`vin = 7.5(1+x)` limited to `[0,15]`), and `rkrlv2.C:3865` passes the input buffer to `Vibe::out()` with no trim. A fuzz at full scale pushes all four stages into the flat region and buries the notch motion under hard clipping. Feedback is summed into the input ahead of the shaper (`bjt_shape(fbl + smpsl[i])`), so raising `Feedback` lowers the level at which this happens.
