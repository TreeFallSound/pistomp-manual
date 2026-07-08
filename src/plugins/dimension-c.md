---
title: Dimension C
eleventyNavigation:
  parent: editorials
  key: dimension-c
  title: Dimension C
  order: 8
---

# Dimension C

The Boss DC-2 Dimension C does something most choruses can't: it makes everything sound wider and more expensive without that seasick pitch wobble. The trick is multiple slow LFOs cancelling each other's warble while reinforcing the stereo spread — a technique borrowed from the Solina String Ensemble. Our closest LV2 match shares that same DNA:

## Our pick: String machine stereo chorus

<img src="{{ '/assets/images/plugin-dc-string-machine.png' | url }}" alt="String machine stereo chorus" class="plugin-screenshot" style="position: relative; left: 25px;">

**String machine stereo chorus** is a direct descendant of the Solina circuit. It runs two independent LFO rows (three phases each) and sums them through a sign matrix — the same trick that gives the DC-2 its signature effect. The result is wide, lush, and open, with a slow, organic motion.

The slow LFO row defaults to 0.6 Hz — right in the DC-2's sweet spot. The modulation is razor-thin (5 ms base, ±1 ms), so the pitch stays stable while the image opens up. An analog BBD mode adds the warm, slightly compressed coloration of real bucket-brigade hardware.

| Rate 1 | Depth 1 | Rate 2 | Depth 2 | Global Depth | Mode |
|--------|---------|--------|---------|--------------|------|
| 6 Hz | 30% | 0.6 Hz | 40% | 50% | Analog |

Place it after your drives and before delay/reverb, and listen as your riffs take up more sonic space.

## Also great: C* Wider - Stereo image Synthesis

<img src="{{ '/assets/images/plugin-dc-wider.png' | url }}" alt="C* Wider" class="plugin-screenshot">

**C\* Wider** is the opposite approach: pure static width, no motion at all. It synthesizes a side signal through three allpass filters and matrixes it into stereo. Instant width, zero warble, zero chorus.

**What you give up:** No movement — this is a photograph, not a film. Try stacking it before String machine stereo chorus: Wider at 0.6 for the image floor to get something resembling the DC-2's "wide and alive" sound.

## Also considered

**TAP Chorus/Flanger** can get close with some dialling — set Freq to 0.5–1 Hz, Depth low, Phase to 90–180°. But it's a single LFO, so the pitch wobble is always there. It sounds like a chorus, not like a Dimension C.

**Gx chorus** is a straightforward stereo chorus with two voices panned apart. It sounds chorused before it sounds wide — fine for obvious modulation, wrong for the DC-2's invisible spread.

**C\* Chorus I** is mono. A mono chorus can't do what a Dimension C does.

**SWH Multivoice Chorus** is mono and its LFO bottoms out at 2 Hz — four times faster than the DC-2's slow row. It shimmers rather than breathes.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| String machine stereo chorus | Jean Pierre Cimalando | GPL-2.0+ | [github.com/jpcima/string-machine](https://github.com/jpcima/string-machine) |
| C* Wider - Stereo image Synthesis | Tim Goetze / MOD team | GPL-2.0+ | [github.com/moddevices/caps-lv2](https://github.com/moddevices/caps-lv2) |
| TAP Chorus/Flanger | Tom Szilagyi | GPL-2.0 | [tap-plugins.sf.net](https://tap-plugins.sourceforge.net) |
| Gx chorus | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| C* ChorusI | Tim Goetze / MOD team | GPL-2.0+ | [github.com/moddevices/caps-lv2](https://github.com/moddevices/caps-lv2) |
| SWH Multivoice Chorus | Steve Harris | GPL-2.0+ | [github.com/swh/lv2](https://github.com/swh/lv2) |
