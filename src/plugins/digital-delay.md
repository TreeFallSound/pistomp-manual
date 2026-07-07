---
title: Digital Delay
eleventyNavigation:
  parent: plugins
  key: digital-delay
  title: Digital Delay
  order: 7
---

# Digital Delay

If you need a clean, full-bandwidth digital delay — just a transparent repeat of what you play — the Boss DD-3 is the classic. The closest LV2 match is the one whose signal path is uncoloured by default.

## Our pick: ZamDelay

<img src="{{ '/assets/images/plugin-dd3-zamdelay.png' | url }}" alt="ZamDelay" class="plugin-screenshot">

**ZamDelay** is mono in/out with a max delay of 8000 ms. Its delay line is integer-sample and the feedback path is a transparent scalar. The one catch: an RBJ low-pass filter on the wet output defaults to 6000 Hz, which colours the repeats. Set **LPF to 20000** to make it transparent.

It also has BPM sync and an invert toggle — extras the DD-3 lacks, but useful for tempo-locked delays.

| Control | Setting |
|---------|---------|
| Delay | 400 ms (or to taste) |
| Feedback | 0.3–0.5 |
| LPF | 20000 (critical) |
| Mix | 50% |
| Sync | Off |

Place it in the MOD-UI chain after your drive pedals and before reverb.

## Also great for stereo: TAP Stereo Echo

<img src="{{ '/assets/images/plugin-dd3-tap-echo.png' | url }}" alt="TAP Stereo Echo" class="plugin-screenshot">

**TAP Stereo Echo** is the same idea in stereo — separate L/R delay, feedback, and strength controls, with a pure integer-sample delay line and a transparent feedback path. Max delay is 2000 ms. For a mono pedalboard you feed both channels the same signal and link L/R.

**What you give up:** No BPM sync. The stereo controls add complexity if you only need mono.

| Control | Setting |
|---------|---------|
| Delay L | 400 ms (or to taste) |
| Delay R | Same as L (linked) |
| Feedback L | 0.3–0.5 |
| Feedback R | Same as L (linked) |
| Strength L | 0.5 |
| Strength R | Same as L (linked) |
| Dry L | 1.0 |
| Dry R | Same as L (linked) |

## Also considered

**DIE Delay** (distrho-a-delay) is architecturally near-identical to ZamDelay — mono, integer-sample, same RBJ LPF defaulting to 6000 Hz. Open LPF to 20000 and it's equally clean. Pick whichever UI you prefer.

**Gx_digital_delay_** has a feedback path that always runs through high-pass and low-pass filters (defaults HP=120 Hz, LP=12 kHz). You can widen these, but the filters are never bypassable. It also has tape modes one click away that add allpass chains for wow/flutter. Treat it as a delay Swiss-army knife, not a DD-3 stand-in.

**MDA Delay** maxes out at roughly 330 ms — well short of the DD-3's 800 ms mode — and its feedback path always passes through a one-pole filter with no flat setting. Wrong tool for pristine repeats.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| ZamDelay | Damien Zammit | GPL-2.0+ | [github.com/zamaudio/zam-plugins](https://github.com/zamaudio/zam-plugins) |
| TAP Stereo Echo | Tom Szilagyi | GPL-2.0 | [tap-plugins.sf.net](https://tap-plugins.sourceforge.net) |
| DIE Delay | Robin Gareus / Damien Zammit | GPL-2.0+ | [github.com/brummer10/DISTRHO-port-plugins](https://github.com/brummer10/DISTRHO-port-plugins) |
| Gx_digital_delay_ | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| MDA Delay | mda-vst / MOD team | GPL-2.0+ | [github.com/moddevices/mda-lv2](https://github.com/moddevices/mda-lv2) |
