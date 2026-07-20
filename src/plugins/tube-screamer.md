---
title: Tube Screamer
eleventyNavigation:
  parent: editorials
  key: tube-screamer
  title: Tube Screamer
  order: 1
---

# Tube Screamer

If you need a midrange boost to push a fuzz or tighten up a high-gain amp, a Tube Screamer style circuit is the classic choice.

## Our pick: GxTubeScreamer

<img src="{{ '/assets/images/plugin-ts-gxts9.png' | url }}" alt="GxTubeScreamer" class="plugin-screenshot">

**GxTubeScreamer** is a faithful SPICE-derived model of the Ibanez TS-9. It reproduces the exact circuit topology: a 720 Hz pre-clip high-pass filter (the mid-hump), an op-amp feedback-loop soft clipper with the correct diode equation, and a post-clip tone control. This is not a generic waveshaper: it solves the actual diode pair equation _using the same math as the real pedal_.

Set it up as a stacked boost:

| Drive | Tone | Level |
|-------|------|-------|
| 0.2–0.3 (low) | 400 Hz | Unity (adjust to taste) |

Place it before your fuzz or amp in the MOD-UI chain. The 720 Hz mid-hump tightens the low end and helps the fuzz cut through the mix; a classic shoegaze trick.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Also great: GxSD1

<img src="{{ '/assets/images/plugin-ts-sd1sim.png' | url }}" alt="GxSD1" class="plugin-screenshot">

**GxSD1** shares the same DSP architecture as GxTubeScreamer (same 720 Hz HPF, same diode equation solver). Two differences: the drive taper is exponential (faster sweep) and there's an extra input coupling filter. It's effectively a TS-9 with a more aggressive gain sweep.

**What you give up:** Despite the name, this plugin does NOT model the Boss SD-1's asymmetric diode clipping. The clipper is symmetric (odd-symmetric table via `copysign`), same as the TS-9. If you want the SD-1's even-harmonic character, this isn't it.

## Also considered

**TS-M1N3** is the other real Tube Screamer here, trained using GuitarML against a 5x5 capture of grid and tone positions on an actual TS-9. It sounds like the pedal because it learned the pedal; it's also way more computationally expensive than GxTubeScreamer (by one or two orders of magnitude!).

**TAP Sigmoid Booster** is a saturator, not a Tube Screamer. The entire signal path is `2/(1 + e^(-5x)) - 1`, a memoryless sigmoid with input and output gain in dB. Nothing filters anything. There's no mid-hump, and the drive is just how hard you hit it. Fine for softening a peak, not so much for sharpening a later fuzz pedal.

**GxOverDriver** is a generic two-band waveshaper — it lacks the mid-hump, feedback-loop clipper, and drive control that make a TS work. It won't tighten a fuzz the way a TS does.

**GxClubDrive** is an EF86 pentode preamp model — a tube preamp, not a diode overdrive. It has no mid-hump and no tone control and it won't get you the sound you're looking for.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| GxTubeScreamer | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| GxSD1 | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| TS-M1N3 | GuitarML | GPL-3.0 | [github.com/GuitarML/TS-M1N3](https://github.com/GuitarML/TS-M1N3) |
| TAP Sigmoid Booster | Tom Szilagyi | GPL-2.0 | [tap-plugins.sf.net](https://tap-plugins.sourceforge.net) |
| GxOverDriver | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| GxClubDrive | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
