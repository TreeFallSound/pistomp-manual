---
title: Dimension C
eleventyNavigation:
  parent: plugins
  key: dimension-c
  title: Dimension C
  order: 8
---

# Dimension C

If you want wide, lush stereo without the obvious pitch wobble of a standard chorus — the Boss DC-2 Dimension C is the classic. The trick is multi-phase LFOs summed through a sign matrix that cancels the warble while reinforcing width. The closest LV2 match shares that same architecture.

## Our pick: String machine stereo chorus

<img src="{{ '/assets/images/plugin-dc-string-machine.png' | url }}" alt="String machine stereo chorus" class="plugin-screenshot" style="position: relative; left: 25px;">

**String machine stereo chorus** is a literal Solina String Ensemble chorus — the same architectural family as the DC-2. It uses two independent LFO rows (three phases each) summed through a sign matrix: `L = line1 + line2 − line3`, `R = line1 − line2 − line3`. This is the Dimension C's defining trick — width without the swim.

Rate 2 defaults to 0.6 Hz, right in the DC-2's sub-1 Hz territory. The delay modulation is razor-thin (5 ms base ±1 ms), and there's an analog BBD mode with authentic bucket-brigade coloration.

| Rate 1 | Depth 1 | Rate 2 | Depth 2 | Global Depth | Mode |
|--------|---------|--------|---------|--------------|------|
| 6 Hz | 30% | 0.6 Hz | 40% | 50% | Analog |

Place it after your drives and before delay/reverb in the MOD-UI chain.

## Also great: C* Wider - Stereo image Synthesis

<img src="{{ '/assets/images/plugin-dc-wider.png' | url }}" alt="C* Wider" class="plugin-screenshot">

**C\* Wider** takes a mono input and synthesizes a side signal through three allpass filters (150, 900, 5000 Hz), then M/S matrixes to stereo. It gives instant width with zero chorusing artifact.

**What you give up:** No motion — it's purely static. Try stacking it before String machine for extreme widening.

## Also considered

**TAP Chorus/Flanger** has a single LFO with adjustable L/R phase shift (0–180°). Dial Freq to 0.5–1 Hz, Depth low, Phase to 90–180°, and it's passable — but one LFO against six-phase dual-LFO matrix means it will always sound more obviously "chorused."

**Gx chorus** is a generic stereo chorus with two voices 90° apart. No width matrix — it sounds chorused before it sounds wide.

**C\* Chorus I** is mono. A mono chorus is fundamentally not a Dimension C.

**SWH Multivoice Chorus** is mono with a minimum LFO rate of 2 Hz — an order of magnitude faster than the DC-2's ~0.5 Hz. Wrong tool.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| String machine stereo chorus | Jean Pierre Cimalando | GPL-2.0+ | [github.com/jpcima/string-machine](https://github.com/jpcima/string-machine) |
| C* Wider - Stereo image Synthesis | Tim Goetze / MOD team | GPL-2.0+ | [github.com/moddevices/caps-lv2](https://github.com/moddevices/caps-lv2) |
| TAP Chorus/Flanger | Tom Szilagyi | GPL-2.0 | [tap-plugins.sf.net](https://tap-plugins.sourceforge.net) |
| Gx chorus | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| C* ChorusI | Tim Goetze / MOD team | GPL-2.0+ | [github.com/moddevices/caps-lv2](https://github.com/moddevices/caps-lv2) |
| SWH Multivoice Chorus | Steve Harris | GPL-2.0+ | [github.com/swh/lv2](https://github.com/swh/lv2) |
