---
title: Tremolo
eleventyNavigation:
  parent: editorials
  key: tremolo
  title: Tremolo
  order: 13
---

# Tremolo

> **Outline only.** The pick below is provisional, based on reading rkr OpticalTrem's source (`research/17-rakarrack-effects.md`). The other ten candidates have not been introspected. Do not treat this page as finished.

Tremolo modulates amplitude. That is the whole effect, which is why the difference between a good one and a bad one is entirely in the shape of the modulation — how it rises, how it falls, and whether it does so symmetrically.

## Provisional pick: rkr OpticalTrem

Ryan Billing models the optical cell rather than the waveform. The LFO drives a lamp with an `lfo^1.9` turn-on curve, the lamp illuminates a Cds photocell (1 MΩ dark, 300 Ω lit, 100 kΩ parallel, 2.7 kΩ series), and the photocell's resistance sets the gain. A photocell does not respond instantly and does not respond the same way rising as falling, so the tremolo has lag and asymmetry that a raw LFO multiply cannot produce. That's the sound.

**To verify before publishing:** measure the actual duty-cycle asymmetry across the depth and rate ranges; confirm the component values against a real optical trem circuit; check the wet/dry default (the suite has a habit of shipping at 0).

## Candidates to investigate

Every plugin on the device that plausibly does amplitude modulation. None of these has been read except OpticalTrem.

| Plugin | Bundle | Why it's a candidate |
|--------|--------|----------------------|
| rkr OpticalTrem | `rkr-labs.lv2` | Optical-cell model. The provisional pick. |
| GxTremolo | `gx_tremolo.lv2` | Guitarix; guitarix's other models have been SPICE-derived, so check whether this one is |
| GxTubeTremelo | `gxtubetremelo.lv2` | Presumably a bias-tremolo model (tube tremolo modulates bias, not amplitude — if so it belongs here, and it's a different circuit) |
| Gxswitched_tremolo | `gx_switched_tremolo.lv2` | Name suggests a hard-switching / square-wave trem. Establish what "switched" means in the DSP |
| GxRedeye Vibro Chump | `gx_redeye.lv2` | Categorized as Simulator, not Modulator. Find out what it actually is — the name suggests an amp's vibrato channel |
| TAP Tremolo | `tap-tremolo.lv2` | Tom Szilagyi. TAP plugins are usually clean and cheap; check the LFO shape options |
| Calf Pulsator | `calf.lv2` | Multi-shape LFO amplitude modulator with stereo phase offset |
| dRowAudio Tremolo | `drowaudio-tremolo.lv2` | Miscategorized as Dynamics. Probably a plain LFO multiply |
| rkr Pan | `rkr-labs.lv2` | Auto-pan is stereo tremolo. Belongs in the discussion, maybe not the ranking |
| rkr VaryBand | `rkr-labs.lv2` | Per-band tremolo across a 4-band split. Note the crossovers null (see research/17) |
| rkr Ring | `rkr-labs.lv2` | A ring modulator at sub-audio carrier frequencies *is* a tremolo. Worth a sentence on where the boundary lies |

## Questions the real article must answer

- **Bias tremolo vs. amplitude tremolo.** A tube amp's tremolo modulates the bias of a gain stage, so it changes distortion character as it changes volume. An optical trem modulates a resistance in the signal path. These sound different. Which of the candidates does which?
- **LFO shape.** Sine, triangle, and square are not interchangeable. Which plugins let you choose, and which have a fixed shape worth having?
- **Duty cycle and asymmetry.** The character of a vintage trem lives here. Measure it.
- **Tempo sync.** Which of these can sync, and does pi-Stomp expose a tempo source to them?
- **CPU.** All of these should be nearly free. Confirm, and note any that aren't.

## Credits

To be completed. Attribution is required for every plugin that appears in the final article — author, license, and homepage.
