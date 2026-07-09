---
title: Uni-Vibe and Phaser
eleventyNavigation:
  parent: editorials
  key: vibe-phaser
  title: Uni-Vibe and Phaser
  order: 14
---

# Uni-Vibe and Phaser

> **Outline only.** The two picks below are provisional, based on reading the rakarrack sources (`research/17-rakarrack-effects.md`). The other twelve candidates have not been introspected. Do not treat this page as finished.

Both effects sweep an allpass chain and mix it back against the dry signal, so both move the notches around in your harmonics rather than in your volume. They part ways on *how* the sweep happens, and that is the fork in the road:

- A **phaser** sweeps every stage together, from one LFO, and the notches stay in a fixed harmonic relationship. Clean, even, jet-like.
- A **uni-vibe** drives each stage from its own photocell, and photocells lag. The stages fall out of step, the notch spacing changes as the sweep moves, and the result throbs and wobbles instead of gliding. It is a phaser that can't keep time with itself, and that's the appeal.

## Provisional pick, swirl: rkr Vibe

Photocell-modelled phase stages: a 500 kΩ dark cell, a lamp turn-on curve of `2 − 2/(lfo+1)`, per-stage variable resistance, and a lamp time constant that smears the LFO before it reaches the cell. This is a uni-vibe model, not a phaser with a slow LFO.

**To verify before publishing:** how many stages; whether the stage lags are genuinely independent or share a smoothed control; whether there's a chorus/vibrato mode switch as on the original circuit.

## Provisional pick, sweep: rkr Analog Phaser

Up to 12 FET-modelled stages, each carrying a component-mismatch `offset`, plus a nonlinear FET term in the sweep. The mismatch is what keeps a 12-stage phaser from sounding sterile — real components don't match, and the model says so.

**To verify before publishing:** how the stage count maps to notch count; what the nonlinear term does to the sweep at high depth; the feedback path.

## Candidates to investigate

None of these has been read except rkr Vibe and rkr Analog Phaser.

| Plugin | Bundle | Why it's a candidate |
|--------|--------|----------------------|
| rkr Vibe | `rkr-labs.lv2` | Photocell uni-vibe. Provisional pick. |
| rkr Analog Phaser | `rkr-labs.lv2` | 12-stage FET phaser with stage mismatch. Provisional pick. |
| rkr AlienWah | `rkr-labs.lv2` | Complex-coefficient feedback allpass. Neither phaser nor wah — the weird cousin |
| GxPhaser | `gx_phaser.lv2` | Guitarix. Check whether it's circuit-derived like their wah models |
| C\* PhaserII | `mod-caps-PhaserII.lv2` | Tim Goetze. Its `rdfs:comment` says the LFO is a **Lorenz fractal** — chaotic, not periodic. That alone may earn it a section |
| Calf Phaser | `calf.lv2` | Well-maintained, many stages, likely the most controllable |
| Invada Stereo Phaser | `invada-labs.lv2` | Ships in three port variants (mono in / stereo in / sum L+R). Fraser Stuart's other plugins are clean and flat |
| CS Phaser 1 | `fomp-labs.lv2` | Two variants, one with LFO. Establish the difference |
| ZynPhaser | `ZynPhaser.lv2` | Standalone build of the ZynAddSubFX phaser — likely the same DSP rkr wraps |
| ZynAlienWah | `ZynAlienWah.lv2` | Same relationship to rkr AlienWah. Check whether either is a newer build |
| The Pilgrim | `ThePilgrim.lv2` | Unknown. Categorized Phaser; find out what it models |
| MDA ThruZero | `mod-mda-ThruZero.lv2` | A through-zero flanger, not a phaser. Mention only to explain why it isn't here |

**Bundle caveat:** `fomp-labs.lv2` and `invada-labs.lv2` are second builds of `fomp.lv2` and `invada.lv2`. The device's plugin host resolves the duplicate URIs by version and loads exactly one; verify which build the screenshots and control ranges come from before publishing.

## Questions the real article must answer

- **What actually distinguishes vibe from phaser in the DSP?** Stated above from the rakarrack sources, but confirm it generalizes. Do any of the other candidates model photocell lag at all, or is rkr Vibe the only real uni-vibe on the device?
- **Stage count and notch count.** How many notches does each plugin actually produce, and where do they sit?
- **Feedback.** A phaser with resonance sounds like a different pedal. Which of these have it?
- **The Lorenz LFO.** C\* PhaserII claims a chaotic modulator. Read it. If it's real, it has no equivalent anywhere else on the device.
- **Chain position.** Before or after dirt? These pages should say, and the answer differs for the two effects.
- **CPU.** Allpass chains are cheap; a 12-stage one with a nonlinearity per stage is less cheap. Derive the per-sample cost.

## Credits

To be completed. Attribution is required for every plugin that appears in the final article — author, license, and homepage.
