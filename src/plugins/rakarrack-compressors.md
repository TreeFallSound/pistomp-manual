---
title: "The rakarrack Compressors"
eleventyNavigation:
  parent: editorials
  key: rakarrack-compressors
  title: The rakarrack Compressors
  order: 12
---

# The rakarrack Compressors

Four dynamics plugins arrive together from the rakarrack suite. They were voiced by someone playing a guitar, not mixing a record: they squash early, recover slowly, and push notes forward. If you want a clean, transparent leveler, [the wider compressor guide]({{ '/plugins/compressors/' | url }}) has better options. If you want a note to hang in the air, start here.

## Our pick: rkr Sustainer

<img src="{{ '/assets/images/plugin-comp-rkrsustainer.png' | url }}" alt="rkr Sustainer" class="plugin-screenshot">

Two knobs, 183 lines of C, and a note that blooms instead of ducking.

Most compressors compare your signal against a fixed threshold. **rkr Sustainer** lets the threshold move. Each sample, it slides up toward the level of the compressed output, then relaxes back down:

```c
compg    = cpthresh + cpthresh*(compenv - cpthresh)/compenv;
cpthresh = cthresh + cratio*(compg - cpthresh);   // the threshold chases the gain
```

The result is a compressor that gets out of the way as the note decays. Hit it hard and the threshold walks up with the attack; as the string dies, the threshold falls back and the gain comes up underneath the tail. That is the feel — a swell into the sustain rather than a squash and a slow release back to noise.

The Sustain knob does three things at once. At maximum it drives the input **36 dB** hotter, raises the resting threshold, and tightens the feedback ratio. So "more sustain" is literally more gain into a harder-working detector. Timing is fixed and fast (a 10 ms peak decay behind a 12.5 ms hold, 50 ms envelope both directions) and nothing filters anything, which is where the brightness comes from: it is uncolored and hard-driven.

| Gain | Sustain |
|------|---------|
| 40 (trim to taste) | 85–100 |

Place it early, before dirt, and let the pedal after it hear a signal that already has the sustain baked in. Past about 110 the input drive turns audibly aggressive — which is a fine place to be if you want it.

## Also great: rkr Compressor

<img src="{{ '/assets/images/plugin-comp-rkrcomp.png' | url }}" alt="rkr Compressor" class="plugin-screenshot">

The conventional one, with a limiter hiding inside it.

**rkr Compressor** is a feed-forward peak compressor: threshold, ratio, attack, release, knee, auto makeup. What makes it interesting is that the timing changes with level. Once the envelope crosses 0.9, the attack coefficient walks toward instantaneous and the release stretches out; above 1.0 the attack is a hard 1.0 and the release drops to a tenth of what you dialed. It becomes a limiter on its own, by level, with no switch to flip. Turn on **Peak** and you also get a leaky peak-hold detector and a hard ceiling at ±0.999 with a clipping indicator.

Leave **Stereo** off. It means *unlinked*, not "stereo mode" — off is the mono-summed detector you want for guitar.

| Threshold | Ratio | Attack | Release | Knee | Auto Output | Peak |
|-----------|-------|--------|---------|------|-------------|------|
| −24 dB | 4 | 20 ms | 120 ms | 40 % | On | Off |

**What you give up:** the Knee control does not do what the label implies. Inside the knee the effective ratio ramps toward `log₂(ratio)`, not toward the ratio you set — so at 4:1 the knee softens to 2:1 and then snaps to 4:1 at the top of the bend. At ratio 2 the knee does nothing whatsoever, because `log₂(2) = 1`. Gain stays continuous; the slope does not. Ratio also bottoms out at 2, so there is no neutral setting: above threshold, this plugin is always compressing.

## Also great: rkr Expander

<img src="{{ '/assets/images/plugin-comp-rkrexpander.png' | url }}" alt="rkr Expander" class="plugin-screenshot">

A gate that fades instead of slamming, and it does swells.

Below the threshold, **rkr Expander** doesn't close — it rolls off along an exponential curve, the same `e^x − 1` shape a transistor junction gives you. The `Shape` control sets how steep that curve is. High Shape is a gate. Low Shape is something more useful: the signal fades in as it crosses threshold, so a chord swells up out of silence under your picking hand rather than snapping on.

| Threshold | Shape | Attack | Release | LPF | HPF | Output |
|-----------|-------|--------|---------|-----|-----|--------|
| −50 dB | 22 | 50 ms | 50 ms | 26000 Hz | 20 Hz | 10 |

**Open the LPF and HPF before you do anything else.** They are 2-pole Butterworth filters sitting in your signal path, not in a sidechain, and they ship defaulted to 3134 Hz and 76 Hz. Drop the Expander in at factory settings and it darkens your tone before it has expanded a thing. Set them to the extremes for transparency, or use them deliberately — a low LPF makes the detector-plus-tone pairing behave like a dark noise gate for high-gain work.

For swells, drop Shape to about 6 and stretch Attack out to 400–900 ms. Note that Release governs how fast the gain opens as well as how fast it closes; Attack only shapes the envelope follower's rise.

## Also considered

<img src="{{ '/assets/images/plugin-comp-rkrcompband.png' | url }}" alt="rkr CompBand" class="plugin-screenshot">

**rkr CompBand** is four copies of rkr Compressor behind three filter pairs. The filters are 2nd-order Butterworth, one low-pass and one high-pass at the same corner, and the four bands are summed with the same sign. That sums to a null:

```
LP(s) + HP(s) = (1 + s²)/(s² + √2s + 1)   →   zero at the crossover
```

A Linkwitz-Riley crossover cascades two Butterworth sections precisely so the bands sum flat. This one doesn't, so at unity band gains you get a notch at each crossover frequency, and the notches only fill in when the per-band compressors have pulled the bands to different levels. Its frequency response is a function of how hard it is working. Per band you get ratio and threshold and nothing else — attack, release and knee are frozen at construction. And its Wet/Dry defaults to 5 out of 127, so out of the box it is 94% dry and sounds like a bypass.

None of that makes it useless, but if you want multiband compression that leaves your tone alone, **ZaMultiComp** or **GxMultiBandCompressor** are the ones to load.

There is **no rakarrack noise gate** on the device, despite what the upstream source tree suggests. `Gate.C` is compiled but never registered in the bundle manifest. The Expander is the gate.

## Credits

These are ports of the rakarrack guitar effects rack, and the dynamics code has three generations of authorship behind it. rkr Compressor and rkr CompBand descend from `artscompressor.cc` by Matthias Kretz and Stefan Westerfeld, reworked by Ryan Billing in 2009. rkr Expander is adapted from Steve Harris's swh-plugins noise gate. rkr Sustainer is Ryan Billing's own.

| Plugin | Authors | License | Homepage |
|--------|---------|---------|----------|
| rkr Sustainer | Ryan Billing | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr Compressor | Josep Andreu, Ryan Billing, after Kretz & Westerfeld | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr Expander | Ryan Billing, Josep Andreu, after Steve Harris | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr CompBand | Ryan Billing, Josep Andreu, Nasca Octavian Paul | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |

LV2 port by Spencer Jackson.
