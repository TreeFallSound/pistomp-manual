---
title: Glitch Granular Delay
eleventyNavigation:
  parent: editorials
  key: glitch-granular-delay
  title: Glitch Granular Delay
  order: 9
---

# Glitch Granular Delay

A glitch pedal turns your guitar into a glitch machine — scattered grains, randomised pitch, frozen moments, and bit-crushed mayhem. No single LV2 plugin covers all of it, but one nails the core scatter sound, and a chain of three others gets you most of the way there.

## Our pick: Granulator

<img src="{{ '/assets/images/plugin-particle-granulator.png' | url }}" alt="Granulator" class="plugin-screenshot">

**Granulator** is a textbook scatter-granular delay: 64 parallel grain voices reading from a delay buffer at random offsets, each shaped by a sine window. The grain length range (10–500 ms) covers everything from subtle texture to full-on glitch. Crank the density to fill the space with scattered shards; dial it back for the occasional accent.

| delay_length | grain_density | grain_length | mix |
|--------------|---------------|--------------|-----|
| 2 s | 20 | 100 ms | 50% |

Place it after your drives and before reverb. It won't do per-grain pitch shifting (the signature trick of the glitch-pedal genre), but the scatter and density are dead on — glitchy, unpredictable, and addictive.

## Also great: Mr. Freeze

<img src="{{ '/assets/images/plugin-particle-mrfreeze.png' | url }}" alt="Mr. Freeze" class="plugin-screenshot">

**Mr. Freeze** is a true phase-vocoder spectral freeze — 1024-point FFT, locked magnitude and phase delta, re-synthesised with overlap-add. When you hit freeze, it sustains the timbre indefinitely without clicks or grain artefacts. This is the spectral freeze that glitch-pedal freeze modes wish they had (most loop a grain; Mr. Freeze holds the whole spectrum).

**What you give up:** It's a freeze, not a granular delay. Toggle it on for drone duty, off for scatter. Stack it after Granulator for the full glitch+drone combo.

## Also considered

**Modulay** is a multi-tap modulated delay with sine-LFO pitch wobble on the taps. It covers the pitch-wobble mode in spirit — smooth, periodic, chorus-like — but it's not per-grain randomised pitch. Use it when you want the pitch-wobble flavour without the scatter.

**the infamous bent delay** is a circuit-bent-style bitcrush/decimation delay: the delayed read is masked to a coarser address resolution, creating stair-stepped aliasing. Gritty, warm, lo-fi — covers the bitcrush mode convincingly. Stack it after Granulator for glitch + grit.

**deteriorate** bundles a live-recording grain slicer (not delay-based, but has spread/density/AR envelopes) and a crude sample-and-hold downsampler. Useful as a second scatter voice alongside Granulator, but the code is amateurish and the downsampler is harsh rather than musical.

**MaBitcrush** is a clean bit-depth reducer (1–16 bits, amplitude quantisation only). It does not do sample-rate reduction or have any time-based effect. Pairs well with the infamous bent delay.

**CycleShifter** is a zero-crossing cycle recorder/overdubber — a gentle cyclic distortion, not a granular scatter. Not what you're looking for here.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| Granulator | Mayank Sanganeria | GPL-2.0+ | [github.com/e7mac/faust-code](https://github.com/e7mac/faust-code) |
| Mr. Freeze | Romain Hennequin | GPL-2.0+ | [github.com/romi1502/MrFreeze](https://github.com/romi1502/MrFreeze) |
| Modulay | Nino de Wit | GPL-2.0+ | [github.com/ninodewit/SHIRO-Plugins](https://github.com/ninodewit/SHIRO-Plugins) |
| the infamous bent delay | Spencer Jackson | GPL-2.0+ | [github.com/ssj71/infamousPlugins](https://github.com/ssj71/infamousPlugins) |
| deteriorate | Aurelien Leblond | GPL-2.0+ | [github.com/blablack/deteriorate-lv2](https://github.com/blablack/deteriorate-lv2) |
| MaBitcrush | DISTRHO team | GPL-2.0+ | [github.com/DISTRHO/DPF-Max-Gen](https://github.com/DISTRHO/DPF-Max-Gen) |
| CycleShifter | Niall Moody / falkTX | GPL-2.0+ | [github.com/DISTRHO/ndc-Plugs](https://github.com/DISTRHO/ndc-Plugs) |
