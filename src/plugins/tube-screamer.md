---
title: Tube Screamer
eleventyNavigation:
  parent: plugins
  key: tube-screamer
  title: Tube Screamer
  order: 1
---

# Tube Screamer

If you need a midrange boost to push a fuzz or tighten up a high-gain amp, the Tube Screamer is the classic choice. On pi-Stomp, we tend to reach for **GxTubeScreamer**.

## Our pick: GxTubeScreamer

<img src="/assets/images/plugin-ts-gxts9.png" alt="GxTubeScreamer" class="plugin-screenshot">

**GxTubeScreamer** is a faithful SPICE-derived model of the Ibanez TS-9. It reproduces the exact circuit topology: a 720 Hz pre-clip high-pass filter (the mid-hump), an op-amp feedback-loop soft clipper with the correct diode equation, and a post-clip tone control. This is not a generic waveshaper — it solves the actual diode pair equation using the same math as the real pedal.

Set it up as a stacked boost:

| Control | Setting |
|---------|---------|
| Drive | 0.2–0.3 (low) |
| Tone | 400 Hz |
| Level | Unity (adjust to taste) |

Place it before your fuzz or amp in the MOD-UI chain. The 720 Hz mid-hump tightens the low end and pushes the fuzz into the frequency pocket; a classic shoegaze trick.

## Runner-up: GxSD1

<img src="/assets/images/plugin-ts-sd1sim.png" alt="GxSD1" class="plugin-screenshot">

**GxSD1** shares the same DSP architecture as GxTubeScreamer (same 720 Hz HPF, same diode equation solver). Two differences: the drive taper is exponential (faster sweep) and there's an extra input coupling filter. It's effectively a TS-9 with a more aggressive gain sweep.

**What you give up:** Despite the name, this plugin does NOT model the Boss SD-1's asymmetric diode clipping. The clipper is symmetric (odd-symmetric table via `copysign`), same as the TS-9. If you want the SD-1's even-harmonic character, this still isn't it.

## What to avoid

**GxOverDriver** is a generic two-band waveshaper with no mid-hump, no feedback-loop clipper, and no drive control. It won't tighten a fuzz the way a TS does.

**GxClubDrive** is an EF86 pentode preamp model — a tube preamp, not a diode overdrive. It has no mid-hump and no tone control and it won't get you the sound you're looking for.
