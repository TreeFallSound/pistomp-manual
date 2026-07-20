---
title: Chorus
eleventyNavigation:
  parent: editorials
  key: chorus
  title: Chorus
  order: 8
---

# Chorus

Every chorus is a delay line whose length wobbles. The fork in the road is **how many delay lines, and whether they wobble together**.

One line, one LFO, and you hear the wobble as wobble: pitch swims up and down, and the effect announces itself. That's a chorus, and sometimes a chorus is what you want. But run three or six lines from LFOs at offset phases and sum them through a sign matrix, and the pitch modulation largely cancels in the middle while the differences pile up at the edges. The swim disappears. What's left is width — everything sounds bigger and more expensive, and you can't point at what's moving.

That second architecture is what the famous rack-mount string ensembles did, and what the celebrated 1980s Japanese four-button stereo chorus inherited from them. If that wide, unwobbling spread is what you're after, one plugin on the device is built the same way:

## Our pick: String machine stereo chorus

<img src="{{ '/assets/images/plugin-dc-string-machine.png' | url }}" alt="String machine stereo chorus" class="plugin-screenshot nudge-right">

**String machine stereo chorus** is a direct descendant of the string-ensemble circuit. It runs two independent LFO rows, three phases each (0°, 120°, 240°), and sums the six delay lines through a sign matrix — `L = line1 + line2 − line3`, `R = line1 − line2 − line3`. That matrix is the whole trick. The result is wide, lush, and open, with a slow, organic motion.

The slow LFO row defaults to 0.6 Hz, well under the 1 Hz that separates "breathing" from "wobbling." The modulation is razor-thin (5 ms base, ±1 ms), so the pitch stays stable while the image opens up. An analog mode runs a 185-stage bucket-brigade model with clock-rate modulation, adding the warm, slightly compressed coloration of real BBD hardware.

| Rate 1 | Depth 1 | Rate 2 | Depth 2 | Global Depth | Mode |
|--------|---------|--------|---------|--------------|------|
| 6 Hz | 30% | 0.6 Hz | 40% | 50% | Analog |

Place it after your drives and before delay and reverb, and listen as your riffs take up more space.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Also great: C* Wider - Stereo image Synthesis

<img src="{{ '/assets/images/plugin-dc-wider.png' | url }}" alt="C* Wider" class="plugin-screenshot">

**C\* Wider** is the opposite approach: pure static width, no motion at all. It synthesizes a side signal through three allpass filters and matrixes it into stereo. Instant width, zero warble, zero chorus.

**What you give up:** No movement — this is a photograph, not a film. Try stacking it before String machine stereo chorus: Wider at 0.6 for the image floor, with the ensemble breathing on top.

## If you want the wobble

Nothing above is a chorus in the sense most players mean. If you want the effect to be audible — the shimmer on a clean arpeggio, the thickening under a lead — reach for a single-LFO stereo chorus and turn the depth up. **TAP Chorus/Flanger** is the most controllable of these: one cosine LFO shared between channels with an adjustable 0–180° phase offset (default 90°), depth topping out near 2.3 ms, plus a highpass "Contour" on the wet path that keeps the low end from smearing. Set Freq to 1–2 Hz and Depth high and it does exactly what it says.

**Gx chorus** is the simpler version of the same idea: one sine LFO per channel at a fixed 90° offset, default rate 3 Hz. At its default depth (±0.2 ms) it's nearly inaudible; open it up and it chorusses cleanly. No matrix, so it sounds chorused before it sounds wide.

## Also considered

**C\* Chorus I** is mono, and a mono chorus cannot produce width — it can only produce wobble. Excellent single-voice DSP (cubic-interpolated delay, a 250 Hz highpass ahead of the line) with feedforward and feedback controls that take it into flanger and slapback territory. Use it as a mono thickener, not a widener.

**SWH Multivoice Chorus** is mono, and its LFO bottoms out at 2 Hz. It also does something unusual: up to eight voices modulated by sinc-interpolated random envelopes rather than deterministic sines, which avoids the metallic ring multi-voice choruses get. It shimmers rather than breathes. Interesting for thickening a mono source.

**rkr Flanger/Chorus** is the ZynAddSubFX chorus as wrapped by rakarrack: one delay line, one LFO, and a toggle that shortens the delay range into flanger territory. Nothing here that TAP or Gx chorus doesn't do, and no matrix.

## Not yet researched

We've read the source for seven of the fifteen chorus-family plugins on the device. The following have not been introspected, and any of them could displace a pick above:

| Plugin | Bundle | Why it might matter |
|--------|--------|---------------------|
| Calf Multi Chorus | `calf.lv2` | Multi-voice by name. If the voices are phase-offset it belongs in the width discussion |
| Triple chorus | `fomp-labs.lv2` | Three voices. Check for a sign matrix |
| CS Chorus 1, CS Chorus 2 | `fomp-labs.lv2` | Unknown topology; two variants implies a real difference |
| ZynChorus | `ZynChorus.lv2` | Standalone build of the ZynAddSubFX chorus |
| String machine chorus | `string-machine-chorus.lv2` | The mono sibling of our pick. Same matrix? Or just one line? |
| Airwindows Vibrato | `Airwindows-Vibrato.lv2` | Chris Johnson. Vibrato is chorus without the dry signal; worth knowing what it does |
| MDA Detune | `mod-mda-Detune.lv2` | Pitch-shift thickening rather than delay modulation — a third architecture entirely |

`fomp.lv2` and `fomp-labs.lv2` ship the same plugin URIs from two different builds. The device loads the `-labs` build; research those bundles, not their plain siblings.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| String machine stereo chorus | Jean Pierre Cimalando | GPL-2.0+ | [github.com/jpcima/string-machine](https://github.com/jpcima/string-machine) |
| C* Wider - Stereo image Synthesis | Tim Goetze / MOD team | GPL-2.0+ | [github.com/moddevices/caps-lv2](https://github.com/moddevices/caps-lv2) |
| TAP Chorus/Flanger | Tom Szilagyi | GPL-2.0 | [tap-plugins.sf.net](https://tap-plugins.sourceforge.net) |
| Gx chorus | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| C* ChorusI | Tim Goetze / MOD team | GPL-2.0+ | [github.com/moddevices/caps-lv2](https://github.com/moddevices/caps-lv2) |
| SWH Multivoice Chorus | Steve Harris | GPL-2.0+ | [github.com/swh/lv2](https://github.com/swh/lv2) |
| rkr Flanger/Chorus | Nasca Octavian Paul (ZynAddSubFX) | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
