---
title: Uni-Vibe and Phaser
eleventyNavigation:
  parent: editorials
  key: vibe-phaser
  title: Uni-Vibe and Phaser
  order: 14
---

# Uni-Vibe and Phaser

Both effects sweep a chain of allpass filters and sum it against the dry signal, so both move notches through your harmonics rather than through your volume. Neither one is a faster or slower version of the other. What separates them is whether the stages are the same as each other.

A phaser stacks identical stages and sweeps them from one control voltage. The notches hold a fixed ratio and glide together — even, jet-like, clean. A uni-vibe stacks four *different* stages, because the circuit it comes from used four different capacitors, and drives them through a light bulb shining on a photocell. The bulb lags. The cell lags differently on the way up than on the way down. The four notches spread and bunch as the sweep travels, and the whole thing throbs instead of gliding.

Two plugins here model those circuits down to the component values, and they are the two to reach for:

## Our pick: rkr Vibe

<img src="{{ '/assets/images/plugin-vibe-rkrvibe.png' | url }}" alt="rkr Vibe" class="plugin-screenshot">

**rkr Vibe** is the only true uni-vibe on the device. Four phase stages per channel, built around the four capacitor values from the original circuit — 0.015 µF, 0.22 µF, 470 pF, 0.0047 µF — named as such in Ryan Billing's source. Because one swept resistance passes through four different capacitors, the notches sit almost three decades apart and move at different rates. That uneven, wandering spacing is the sound. A phaser cannot do it at any rate setting.

The lamp and the photocell are modelled, not approximated with an LFO. The bulb has a turn-on curve and a 12 ms thermal lag. The cell swings between 500 kΩ dark and 600 Ω lit, and its time constant is recomputed every sample from its own current state, so the bright part of the sweep tracks faster than the dark part, and the release runs at half the attack. Between every stage the signal passes through a transistor turn-on curve — and that curve is asymmetric, passing +0.89 where it passes −0.85, so each stage adds a little even-order harmonic content. Four of them per channel, per sample, inside the sweep.

The result is a throb that breathes and thickens rather than swooshing. It sounds warm, slightly late, and expensive.

| Depth | Rate | Feedback | Mix | LFO Type | LFO L/R Delay | Width | Panning |
|-------|------|----------|-----|----------|---------------|-------|---------|
| 110 | 20 | 0 | 64 | Sine | 32 | 64 | 0 |

Two things the knobs don't tell you. **Rate is in BPM, not Hz** — every rakarrack plugin divides it by 60, so 20 means one cycle every three seconds. And **Mix is the chorus/vibrato switch** from the original circuit: 64 is a 50/50 blend and gives you chorus, 128 is wet-only and gives you the pitch-bending vibrato. There is no separate toggle; sweeping Mix between the two is musical.

Place it **after your fuzz**. This is the famous pairing, and the reason it works is that a fuzz hands the vibe a harmonically dense signal for the notches to carve. A clean guitar has sparse partials, and a notch that lands between two of them does nothing you can hear.

Watch your levels, though. The transistor curve between each stage runs out of road at ±1.0 — full scale — and the plugin applies no input trim. A fuzz pinned near full scale drives all four stages into the flat part of that curve, where you get hard clipping instead of throb. Back the fuzz's output off until peaks sit around half scale and the sweep opens up. Feedback adds to the input ahead of the same curve, so turning Feedback up moves that ceiling down.

## Also great: rkr Analog Phaser

<img src="{{ '/assets/images/plugin-vibe-aphaser.png' | url }}" alt="rkr Analog Phaser" class="plugin-screenshot">

**rkr Analog Phaser** models a JFET phase stage — a 2N5457 at 625 Ω on-resistance, a 22 kΩ resistor across it, a 50 nF cap — and gives you up to twelve of them. The stage coefficient is recomputed every sample rather than once per buffer, so the sweep stays smooth even wide open.

The control that matters is **Random**, which is component mismatch. Real JFETs don't match, and the model carries twelve measured tolerance offsets. At zero, all twelve stages are identical and a 12-stage sweep is glassy and lifeless. Open it up and the stages disagree slightly, the notches stop being perfectly harmonic, and the phaser starts to sound like hardware.

Behind the gear icon, past the eight knobs on the faceplate, sit four more: `Distort` feeds each stage's highpass output back into its own coefficient, so the notch position shifts with how hard you play. `Subtract` inverts the output for peaks instead of notches. `Hyper` squares the sweep into an exponential curve. And setting `LFO Type` to 2 arms an undocumented barber-pole mode — an endlessly rising sweep that wraps instead of turning around. Nothing else on the device does that.

| Depth | Rate | Feedback | Mix | LFO Type | Width | Stages | Random |
|-------|------|----------|-----|----------|-------|--------|--------|
| 64 | 40 | 40 | 64 | Sine | 110 | 6 | 30 |

**What you give up:** The throb. This glides. It is even and harmonic where the vibe is uneven and organic, and no amount of slowing the rate turns one into the other.

Place it **after your dirt**. A phaser in front of a distortion has its notches filled back in by the harmonics the distortion generates downstream.

Leave `Stages` alone once you've set it — see below.

## Play it, don't cycle it: Calf Phaser

<img src="{{ '/assets/images/plugin-vibe-calf.png' | url }}" alt="Calf Phaser" class="plugin-screenshot">

Every other phaser here assumes an LFO is driving it. **Calf Phaser** is built to be driven by you. `Center Freq` parks the notch anywhere from 20 Hz to 20 kHz on a log taper. `Mod depth` is calibrated in cents and reaches 10800 of them — nine octaves of sweep. Feedback is bipolar. Stereo phase is a full 0–360°.

It is also the only phaser here whose stage count you can change while playing without a click, because Calf copies the existing filter state forward into the new stages instead of clearing everything. Bind `# Stages` to a footswitch and step 4 → 8 mid-phrase.

The tradeoff is that its stages are identical and its notches are evenly spaced, so it never sounds like a vibe, and it never quite sounds like hardware either. It sounds like a very good, very controllable phaser.

| Center Freq | Mod depth | Mod rate | Feedback | # Stages | Stereo phase |
|-------------|-----------|----------|----------|----------|--------------|
| 1000 Hz | 4000 cents | 0.3 Hz | 0.5 | 6 | 180° |

## The chaotic one: C\* PhaserII

<img src="{{ '/assets/images/plugin-vibe-phaserii.png' | url }}" alt="C* PhaserII" class="plugin-screenshot">

Tim Goetze's phaser runs twelve allpass sections, and its `lfo` control offers a choice: a sine, or a **strange attractor**. Set it to fractal and the sweep is driven by a chaotic system whose output never repeats. It wanders, hesitates, and drifts back, staying in roughly the same range without ever tracing the same path twice. On slow settings under a clean arpeggio it sounds like a phaser being played by someone else.

Its `spread` control geometrically scales the spacing between the twelve notches, from evenly stacked out to a ratio of about 2.6 — the one deliberate approach to uneven notch spacing on the device, arrived at by design rather than by the parts a 1960s circuit happened to use.

Two notes on the name. MOD-UI calls this plugin "C\* PhaserII - Mono phaser modulated by a Lorenz fractal." The attractor in the source is a **Rössler**, not a Lorenz, and the upstream author simply calls it "Mono phaser." The distinction is audible: a Rössler attractor circles one lobe, so the sweep drifts. A Lorenz has two lobes and would lurch between them.

| rate | lfo | depth | spread | resonance |
|------|-----|-------|--------|-----------|
| 0.3 | fractal | 0.8 | 0.7 | 0.4 |

## Automating these on stage

An encoder or expression pedal bound to the wrong port will interrupt your signal. These plugins differ enormously in what they tolerate, and nothing in MOD-UI warns you.

**Never bind these.** They allocate memory on the audio thread, which can drop out the whole chain:

| Plugin | Control |
|--------|---------|
| ZynPhaser | `stages` |
| ZynAlienWah | `delay` |

**Never bind these either.** They flush the filters, so you get a click and a momentary hole:

| Plugin | Control | What happens |
|--------|---------|--------------|
| rkr Analog Phaser | `Stages` | zeroes all twelve allpass stages and the feedback |
| rkr Synthfilter | `Lowpass Stages`, `Highpass Stages` | same, and resets the envelope follower |

`Stages` on rkr Analog Phaser deserves special warning: it looks like an ordinary knob, sweeping 4 → 12 is exactly the gesture you'd want mid-solo, and it will stutter every time.

**Expect a click.** These step discontinuously — fine on a footswitch between phrases, bad under your foot mid-note: `Subtract` and `Hyper` on rkr Analog Phaser (both flip polarity or jump the sweep), `LFO Type` on anything rakarrack, `lfo` on C\* PhaserII (sine and fractal sit at unrelated positions, so the sweep teleports), `Sections` on the CS Phasers, and `Soft Clip` on the Invada.

**Bind these freely.** Continuous, and either smoothed per sample or updated fast enough not to zipper:

| Plugin | Safe to automate |
|--------|------------------|
| rkr Vibe | Depth, Rate, Feedback, **Mix**, Width, Panning, LFO L/R Delay |
| rkr Analog Phaser | Depth, Rate, Feedback, Width, Mix, Distort, Random |
| Calf Phaser | Center Freq, Mod depth, Mod rate, Feedback, Stereo phase, **# Stages** |
| C\* PhaserII | rate, depth, spread, resonance |

Two caveats. Every rakarrack control is an integer over 0–127, so an expression pedal gets 128 steps. On sweep parameters you won't hear it; on `Mix` with the feedback up, you will. And feedback on rkr Analog Phaser reaches ±0.997 at the extremes, where the chain self-oscillates.

For binding an expression pedal to any of these, the procedure is the same as for [wah](/plugins/wah/): run the appropriate `~/extras` script, reboot, then assign the port to MIDI from the Controls icon in MOD-UI.

## Also considered

**ZynPhaser** is the same JFET engine as rkr Analog Phaser — identical mismatch constants, identical transistor model, because rakarrack took the code from ZynAddSubFX and ZynAddSubFX kept it. It adds a plain digital phaser mode and a `phase` control, and it loses the barber-pole. Its `stages` port allocates memory while running. Prefer the rakarrack build.

**rkr Synthfilter** is the envelope phaser, and it hides under the `Filter` category where nobody looks for it. Twelve allpass stages, split into separate lowpass and highpass banks, swept by an LFO *and* your picking hand together, with attack and release on the follower and a toggle that turns the notches into peaks. It ships with Mix at 0, so it sounds bypassed when you load it. Turn Mix up before you judge it.

**GxPhaser** is not a circuit model, despite what guitarix's excellent wah plugins might lead you to expect — its own source credits Julius O. Smith's textbook phaser. Four stages, and the LV2 build exposes three controls out of the ten the underlying code has. Feedback is compiled in at zero, which is why it sounds so polite.

**CS Phaser 1 with LFO** is Fons Adriaensen's thirty-section phaser from a large analog polysynth, with a saturating stage inside the feedback loop and the smoothest coefficient interpolation of anything here. It sweeps beautifully and sounds nothing like a pedal. Its sibling **CS Phaser 1** has no LFO at all — its three modulation inputs are CV ports, so without a control voltage it sits there as a fixed comb filter. Use the LFO variant.

**Invada Stereo Phaser** oscillates far slower than anything else here: its `Period` is measured in seconds, 0.5 to 20 of them, and it accepts tap tempo. No feedback control. The three port variants (mono in, stereo in, sum L+R) are one plugin.

**Harmless** is a harmonic tremolo, not a phaser — it splits the signal into two bands and fades between them in antiphase. That is the other historical way to build a throb that isn't volume, and it is worth your time if the vibe is the sound you're chasing. It has a stereo phase control and a waveshaper.

**rkr AlienWah** and **ZynAlienWah** are filed under Phaser and are not phasers. They are a delay line whose feedback coefficient rotates through the complex plane — a spinning comb filter. Vowel-like and strange. Nothing wrong with them; they just don't belong on this page.

**mud** advertises "univibe-style modulation." It is a resonant bandpass swept by an LFO, which moves a peak rather than a set of notches. That makes it a wah, and a dirty, lo-fi, enjoyable one. It is not a vibe.

**The Pilgrim** has two controls, `Filter Freq` and `Mix`, no rate and no depth. It is closed source and **declares no license anywhere in its bundle**, so we can't tell you what you're allowed to do with it or read what it does.

**MDA ThruZero** is a flanger. A flanger sweeps a delay line, which puts its notches at whole-number multiples of one frequency; a phaser sweeps an allpass chain, whose notches sit wherever the filter puts them. That difference is why a flanger sounds metallic and a phaser sounds hollow.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| rkr Vibe | Ryan Billing, Josep Andreu | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr Analog Phaser | Ryan Billing | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr Synthfilter | Ryan Billing | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr AlienWah | Nasca Octavian Paul | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| Calf Phaser | Calf Studio Gear | LGPL | [calf-studio-gear.org](https://calf-studio-gear.org) |
| C\* PhaserII | Tim Goetze | GPL | [quitte.de/dsp/caps.html](http://quitte.de/dsp/caps.html) |
| GxPhaser | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| ZynPhaser | ZynAddSubFX team | GPL-2.0 | [zynaddsubfx.sourceforge.net](http://zynaddsubfx.sourceforge.net) |
| ZynAlienWah | ZynAddSubFX team | GPL-2.0 | [zynaddsubfx.sourceforge.net](http://zynaddsubfx.sourceforge.net) |
| CS Phaser 1 | Fons Adriaensen, ported by David Robillard | GPL-2.0 | [gitlab.com/drobilla/fomp](https://gitlab.com/drobilla/fomp) |
| CS Phaser 1 with LFO | Fons Adriaensen, ported by David Robillard | GPL-2.0 | [gitlab.com/drobilla/fomp](https://gitlab.com/drobilla/fomp) |
| Invada Stereo Phaser | Invada | GPL — source no longer reachable | [invadarecords.com](http://invadarecords.com) |
| Harmless | SHIRO | ISC | — |
| mud | remaincalm.org | LGPL-3.0 | [remaincalm.org](https://remaincalm.org) |
| MDA ThruZero | Paul Kellett | GPL | [mda.smartelectronix.com](http://mda.smartelectronix.com) |
| The Pilgrim | Artican | **none declared** | [arcticanaudio.com](http://arcticanaudio.com) |
