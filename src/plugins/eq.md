---
title: Equalizers
eleventyNavigation:
  parent: cat-amp-tone
  key: equalizers
  title: Equalizers
  order: 3
---

# Equalizers

The pi-Stomp ships with over a dozen EQ and parametric-EQ plugins. This guide through walks every one we could read the source for, grouped by the job you actually want an EQ to do.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

---

## If you want to cut or boost a specific frequency

You have a problem frequency — a fizz, a honk, a boom — and you want it gone, or you want to lift a band to bring a quiet string forward. You need a parametric EQ with a sweepable center, adjustable bandwidth, and gain. The good ones are smoothed so you can ride them live without clicks.

### Our pick: x42-eq

<img src="{{ '/assets/images/plugin-eq-fil4.png' | url }}" alt="x42-eq" class="plugin-screenshot">

**x42-eq** (shown as "x42-eq - Parametric Equalizer Mono" in MOD-UI) is Robin Gareus's 4-band parametric, and it is the only EQ on the device that exposes every control a parametric should have. Four peaking bands, each with `freq` (20 Hz to just under Nyquist, log-scaled), `bandwidth` (1/3-octave granularity, fine to 1/24), and `gain` (±24 dB), plus low-shelf, high-shelf, high-pass, and low-pass sections on top. All controls are internally smoothed — the per-block ramp limiter limits frequency, gain, and bandwidth changes to 2:1 per block — so you can automate it, ride it from a footswitch, or sweep it by hand without a single click or zipper noise. The spectrum/spectrogram UI (driven from mod-ui) shows you what you are doing.

The filter itself is **Fons Adriaensen's `Paramsect`** second-order allpass-based parametric section, the same one fil4 shares with fomp `parametric1` and — notably — with ArtyFX Kuiza, where it is shipped with the control surface amputated. fil4 is the full version. CPU is one biquad-equivalent per active band, ~8 sections max — modest.

| HP | LS | Peak 1 | Peak 2 | Peak 3 | Peak 4 | HS | LP |
|----|-----|--------|--------|--------|--------|-----|-----|
| off | 80 Hz, +2 dB | 250 Hz, −3 dB | 800 Hz, 0 dB | 2.5 kHz, −4 dB | 5 kHz, +1 dB | 10 kHz, +2 dB | off |

Place it wherever the problem lives — before dirt to shape what the clipper sees, after dirt to clean up what the clipper made, or at the end of the chain as a final tone trim. The smoothing means you can move a band live to find the offending frequency and the EQ won't pop while you sweep.

### Also great: rkr Parametric EQ

<img src="{{ '/assets/images/plugin-eq-rkrparametric.png' | url }}" alt="rkr Parametric EQ" class="plugin-screenshot">

**rkr Parametric EQ** (shown as "rkr Parametric EQ" in MOD-UI) is the rakarrack 3-band parametric, and it is the EQ the community actually uses — 7 occurrences in shared pedalboards, more than any other EQ on the device. Three bands — Low, Mid, High — each with `Frequency`, `Gain`, and `Width` (Q). The frequency ranges overlap: Low sweeps 20–1000 Hz, Mid 80–8000 Hz, High 6000–26000 Hz, so you can park two bands near the same spot for a sharper cut, or spread them across the spectrum. The Q control maps exponentially from 0.03 (nearly flat) through 1.0 (at center) to 29.5 (notch-narrow), giving you everything from a broad tilt to a surgical notch. Gain is ±30 dB per band. Stereo in/out, bypass, and a master gain.

The filter is the rakarrack `AnalogFilter` (RBJ biquad) — the same class `rkr EQ` uses for its 16-band graphic, but here wired for three parametric bands rather than sixteen fixed ones. The controls are integer-quantised (the rakarrack house style) rather than fil4's log-scaled floats, so the steps are coarser, and there are no shelf, high-pass, or low-pass sections. What you get is three honest parametric bands that cover most surgical cuts, cheap, in stereo, with a Q range wider than anything else on this page.

**What you give up:** No shelves, no HP/LP, no spectrum analyser, and the integer-quantised controls mean you cannot fine-tune a frequency to the nearest Hz the way fil4's log scaling lets you. The Q mapping is exponential, so the useful musical range (0.5–4) sits in a narrow band of the knob's travel — you will spend time finding it. But for a three-band cut-and-boost that the community has already validated, this is the one.

### Also great: 4-Band Parametric Filter

<img src="{{ '/assets/images/plugin-eq-fomp.png' | url }}" alt="4-Band Parametric Filter" class="plugin-screenshot">

**4-Band Parametric Filter** (fomp `parametric1`) is Fons Adriaensen's own 4-band parametric — the canonical version, predating fil4. Same `Pareq` section (the state-variable allpass parametric that `Paramsect` descends from), four bands in series, each with `freq`, `bw`, `gain`, and a per-section bypass, plus a master `gain`. State is smoothed per-block.

**What you give up:** No high-pass, low-pass, or shelf sections — just the four peaks. No spectrum analyser UI. fil4 is this same filter family with the full surface restored; fomp is the leaner, older sibling. Reach for it when you want Fons's parametric sound with fewer moving parts, or when you want per-band bypass to A/B a cut.

### Also great: Calf Equalizer 5 Band

<img src="{{ '/assets/images/plugin-eq-calf5.png' | url }}" alt="Calf Equalizer 5 Band" class="plugin-screenshot">

**Calf Equalizer 5 Band** is the Calf studio EQ — stereo, with two shelves (low + high) and three peaking bands, every band carrying `active`, `level`, `freq`, and `Q`. Plus input/output level, stereo VU metering, a zoomable transfer-function graph, and a real-time analyser with a mode toggle. This is the EQ you reach for at the end of a chain or on a stereo bus.

**What you give up:** Stereo costs CPU — two channels plus the analyser — and most guitar chains are mono, which makes the stereo irrelevant and the CPU wasteful. If you are running a full chain on a Pi core and you don't need the analyser, fil4 does the same job in mono for half the cost. Calf is the pick when you want the analyser and the shelves in one plugin and you have the headroom.

### Also considered

**Kuiza** is Harry van Haaren's ArtyFX parametric, and it is a warning. The DSP is Fons's `Paramsect` — the same filter fil4 uses — but the LV2 port exposes only `Gain`, `S1..S4 Gain`, and `Active`. The four band centers (55, 220, 1760, 7040 Hz), the bandwidths, and the master gain are hardcoded in the constructor. You get five gain knobs and an on/off. The 220→1760 Hz gap is almost three octaves with no band — if your problem frequency is 600 Hz, Kuiza cannot help you. This is a fixed 4-band EQ wearing a parametric name tag. Reach for fil4 instead; it is the same filter with the full control surface.

**TAP Equalizer/BW** is Tom Szilagyi's 8-band parametric, descended from Steve Harris's DJ EQ. Per-band `freq` + `gain` + `bandwidth` (1/3 octave to several octaves), RBJ peaking biquad. The plain **TAP Equalizer** is the same plugin with the bandwidth control removed and a fixed 1.0-octave BW — use the `/BW` variant. Solid and predictable, but eight bands of fixed-topology peaking is more knobs than most surgical cuts need, and fil4's four sweepable bands plus shelves cover the same ground with less twiddling.

---

## If you want broadstroke tone shaping

You don't have a specific problem frequency. You want to push the lows up, pull the presence down, and reshape the overall voicing of the chain in one move. A graphic EQ with set bands is the tool — reach for a slider, pull it, listen.

### Our pick: GxBarkGraphicEQ

<img src="{{ '/assets/images/plugin-eq-gxbark.png' | url }}" alt="GxBarkGraphicEQ" class="plugin-screenshot">

**GxBarkGraphicEQ** (shown as "Bark Graphic EQ" in MOD-UI) is the guitarix graphic EQ, and it is the only EQ on the device tuned to the ear's actual critical bands. Twenty-four bands on the **Bark scale** — centers 50, 150, 250, 350, 450, 570, 700, 840, 1k, 1.17, 1.37, 1.6, 1.85, 2.15, 2.5, 2.9, 3.4, 4, 4.8, 5.8, 7, 8.5, 10.5, 13.5 kHz — with per-band VU meters (`V1..V24`) showing you where your signal energy sits. The filters are Sophocles Orfanidis's second-order Butterworth EQ sections, not generic RBJ peaking — the band spacing and widths follow the critical-band geometry, so a cut at 1 kHz and a cut at 4 kHz actually correspond to what your ear hears as "presence" and "brilliance" rather than to arbitrary octave math.

The result is a graphic EQ where pulling a slider does what your ear expects the first time. On a 1/3-octave graphic you find yourself pulling two adjacent bands to fix one perceived problem; on the Bark grid one band usually covers it. Mono, CPU-modest (24 second-order sections — heavier than CAPS Eq10 but still cheap on a Pi core).

| 50 Hz | 150 Hz | 250 Hz | 500 Hz | 1 kHz | 2.5 kHz | 5 kHz | 8 kHz | 13 kHz |
|-------|--------|--------|--------|-------|---------|-------|-------|--------|
| +2 dB | +1 dB | 0 dB | −2 dB | −3 dB | −2 dB | 0 dB | +1 dB | +2 dB |

Place it after dirt, before delay/reverb — it is a voicing tool, and you want it to see the shaped signal. The per-band VUs make it a diagnostic too: if you see 800 Hz piling up in the meter, pull the 700 or 840 Hz band and the problem moves.

### Also great: C\* Eq10

<img src="{{ '/assets/images/plugin-eq-capseq10.png' | url }}" alt="C* Eq10" class="plugin-screenshot">

**C\* Eq10** (shown as "Eq10" in MOD-UI) is Tim Goetze's 10-band graphic, and it is the classic. Ten ISO-octave bands at 31, 63, 125, 250, 500, 1k, 2k, 4k, 8k, 16 kHz, each ±48 to +24 dB, Q fixed at 0.707 (Butterworth). The filter is a 2nd-order parallel-form IIR — the prototypes come from a Motorola DSP56k application note, and the DSP header credits it. Per-band gain is ramped logarithmically across each block to prevent zipper noise, which makes this a graphic EQ built to be ridden live — reach over and pull the 2 kHz slider mid-phrase and the band fades, it does not step. An `adjust_gain[]` table trims each band's internal gain to keep the response optimally flat at 0 dB.

Mono, and the cheapest EQ on this page per band — one 2nd-order IIR per band per sample, ~10 biquad-equivalents total. The **C\* Eq10X2** is the same engine in stereo; on a mono guitar chain use the mono version.

**What you give up:** The 1-octave spacing is coarser than the Bark grid — 250 Hz and 500 Hz are one slider apart, while GxBarkGraphicEQ has three bands in that span. The Q is fixed, so you cannot narrow a band to target a specific frequency. Eq10 is the broadstroke tool; GxBarkGraphicEQ is the broadstroke tool that also respects your ear.

### Also considered

**GxGraphicEQ** is guitarix's older 11-band graphic, faust-generated, with per-band VU meters (`G1..G11`, `V1..V11`). Superseded by GxBarkGraphicEQ — the band spacing is a generic 11-band layout rather than the Bark critical-band grid, and the faust DSP is less considered than Orfanidis's sections. Use the Bark version.

**GxBooster** is two sliders — `fslider0_` and `fslider1_` — labelled bass and treble boost. It is a toy, not an EQ. Skip it.

---

## If you want a voicing or colour EQ

You are not chasing a frequency. You want a specific piece of analog hardware's character, or you want a two-knob tone stack that does the obvious thing. These are fixed-frequency EQs that model a circuit rather than expose a surgical surface.

### Our pick: Luftikus

<img src="{{ '/assets/images/plugin-eq-luftikus.png' | url }}" alt="Luftikus" class="plugin-screenshot">

**Luftikus** is lkjb's digital adaptation of an analog EQ, ported to LV2 by DISTRHO. Four fixed half-octave bands at **10, 40, 160, 640 Hz**, a 2.5 kHz low shelf, and a selectable high shelf (2.5, 5, 10, 20, or 40 kHz — only one active at a time). The biquad coefficients come from a `CoeffCreator` that models the analog hardware's response, and there are three toggles that change the character: **Analog** adds a 1e-5-amplitude dithering noise per sample to mask digital harshness (a deliberate analog-flavoured noise floor), **Mastering** changes the band Q for a tighter surgical-ish feel, and **Keep Gain** compensates overall level so cuts don't drop your volume — a small but real quality-of-life feature the hardware didn't have.

The fixed bands at 10/40/160/640 Hz are low — this is a bass-and-low-mid voicing EQ, not a presence tool. That is the point. It does what the analog hardware does: shapes the bottom half of the spectrum where a graphic EQ's 31 and 63 Hz bands are too coarse and a parametric's sweepable bands are too fiddly for the broad curves you actually want.

| 10 Hz | 40 Hz | 160 Hz | 640 Hz | 2.5 kHz (shelf) | High shelf | Analog | Keep Gain |
|-------|-------|--------|--------|-----------------|------------|--------|-----------|
| +1 dB | +2 dB | 0 dB | −1 dB | +1 dB | 10 kHz, +1 dB | On | On |

Place it early — before dirt — if you want to shape what the clipper sees, or after dirt if you want to trim the result. The fixed bands mean you cannot retune it to a different problem; you are choosing lkjb's voicing, not your own. That is the trade.

### Also great: Baxandall

<img src="{{ '/assets/images/plugin-eq-baxandall.png' | url }}" alt="Baxandall" class="plugin-screenshot">

**Baxandall** is Chris Johnson's (Airwindows) two-knob tone stack, ported to LV2 by Hannes Braun. Two knobs: treble and bass, each ±15 dB. The architectural detail that makes it a real Baxandall and not two static shelves is that **the shelf corner moves with the gain**: `trebleFreq = 4410·trebleGain/sr`, `bassFreq = 8820·(1/bassGain)/sr`. As you boost treble the corner moves up; as you cut bass the corner moves down. That is how a real Baxandall feedback tone stage behaves — the pot position changes the effective corner — and it is why a Baxandall tone stack feels musical where two static shelves feel surgical. The signal passes through a `sin()` "Console5" encode before the shelves, Airwindows's console-modelling glue.

**What you give up:** Two knobs is the whole control surface. There is no mid, no Q, no frequency selection — you are buying the Baxandall curve and the console glue, nothing else. Reach for it when you want the one-knob-treble, one-knob-bass role filled properly, not when you want to fix a specific frequency. MIT licence, unusual in this group.

### Also considered

**3 Band EQ** and **3 Band Splitter** are DISTRHO's retired legacy mini-ports (`distrho.sf.net` namespace). The source is no longer on GitHub — the `distrho.sf.net` legacy set was removed from DISTRHO-Ports and the filter topology cannot be verified from source. They have appeared in zero shared pedalboards. Treat as closed; skip.

**GxToneMender** is labelled "clean boost with a 3-knob tonestack" but the LV2 source directory is not in the current guitarix checkout, so the DSP cannot be verified from source. Until it resurfaces, treat the description as a comment string, not a read. Skip unless the source returns.

**MOD LowPassFilter** and **MOD HighPassFilter** are categorised `Filter`, not `EQ` — selectable-order LPF/HPF with `Freq` and `Order` controls. They are utility filters, and for simple tone-trimming they are cheaper than a full EQ. But they are not equalizers and do not belong in this guide beyond noting they exist. If all you need is to roll off the lows below 80 Hz, `HighPassFilter` at order 2 is the right tool and costs almost nothing.

---

## Quick comparison

| Category | Our pick | Also great | Also great |
|----------|----------|------------|------------|
| Surgical parametric | x42-eq | rkr Parametric EQ | 4-Band Parametric Filter |
| Fixed graphic | GxBarkGraphicEQ | C\* Eq10 | — |
| Voicing / colour | Luftikus | Baxandall | — |

---

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| x42-eq | Robin Gareus | GPL-2.0+ | [github.com/x42/fil4.lv2](https://github.com/x42/fil4.lv2) |
| 4-Band Parametric Filter | Fons Adriaensen | GPL-2.0+ | [gitlab.com/drobilla/fomp](https://gitlab.com/drobilla/fomp) |
| Calf Equalizer 5 Band | Calf Studio Gear | LGPL | [calf.sourceforge.net](http://calf.sourceforge.net) |
| Kuiza | Harry van Haaren, filter by Fons Adriaensen | GPL-2.0 | [github.com/openAVproductions/openAV-ArtyFX](https://github.com/openAVproductions/openAV-ArtyFX) |
| rkr Parametric EQ | Josep Andreu, Nasca Octavian Paul, Ryan Billing | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| TAP Equalizer/BW | Tom Szilagyi, after Steve Harris | GPL-2.0 | [tap-plugins.sf.net](https://tap-plugins.sourceforge.net) |
| TAP Equalizer | Tom Szilagyi, after Steve Harris | GPL-2.0 | [tap-plugins.sf.net](https://tap-plugins.sourceforge.net) |
| GxBarkGraphicEQ | guitarix team, DSP by Sophocles Orfanidis | GPL-2.0 | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| C\* Eq10 | Tim Goetze (CAPS) | GPL-3.0 | [github.com/mod-audio/caps-lv2](https://github.com/mod-audio/caps-lv2) |
| C\* Eq10X2 | Tim Goetze (CAPS) | GPL-3.0 | [github.com/mod-audio/caps-lv2](https://github.com/mod-audio/caps-lv2) |
| GxGraphicEQ | guitarix team | GPL-2.0 | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| GxBooster | guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| GxToneMender | guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Luftikus | lkjb, LV2 port by DISTRHO | GPL | [lkjbdsp.wordpress.com/luftikus](https://lkjbdsp.wordpress.com/luftikus) |
| Baxandall | Chris Johnson (Airwindows), port by Hannes Braun | MIT | [hannesbraun.net](https://hannesbraun.net/ns/lv2/airwindows/baxandall) |
| 3 Band EQ | DISTRHO | LGPL | (source retired) |
| 3 Band Splitter | DISTRHO | LGPL | (source retired) |
| LowPassFilter | MOD Team | GPL | [github.com/moddevices/mod-lv2-data](https://github.com/moddevices/mod-lv2-data) |
| HighPassFilter | MOD Team | GPL | [github.com/moddevices/mod-lv2-data](https://github.com/moddevices/mod-lv2-data) |

The CAPS EQs are Tim Goetze's C\* Audio Plugin Suite, LV2-ported by the MOD team. The guitarix EQs are the work of Hermann Meyer, Andreas Degert, Pete Shorthose, and Steve Poskitt, with Orfanidis's EQ sections doing the heavy lifting in the Bark graphic. fomp and fil4 share Fons Adriaensen's parametric filter lineage. The plugins are open-source software built by talented musicians and developers; pi-Stomp just ships them.