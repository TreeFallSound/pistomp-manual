---
title: Shimmer and Cloud Reverb
eleventyNavigation:
  parent: plugins
  key: shimmer-cloud-reverb
  title: Shimmer & Cloud Reverb
  order: 3
---

# Shimmer and Cloud Reverb

If you need shimmer and cloud reverbs for shoegaze or ambient, pi-Stomp has you covered. **Shimmizita** nails the shimmer algorithm, **TheCloud** handles granular ambient textures, and Dragonfly covers the traditional hall and plate sounds.

## Our pick: Shimmizita

<img src="/assets/images/plugin-strymon-shimmizita.png" alt="Shimmizita" class="plugin-screenshot">

**Shimmizita** is the only plugin on the device with a pitch shifter embedded *inside* an FDN reverb feedback loop — the same architecture as Valhalla Shimmer. Each of the 8 delay lines has its own pitch shifter, so the tail climbs exponentially into an ethereal ascending shimmer cloud. Controls for shift (±6 semitones), speed, depth, decay (1–8 s), and HF damping.

| Control | Setting |
|---------|---------|
| SHIFT | +12 (octave up) |
| PSDRYWET | 0.7 |
| T60M | 6 s |
| HF damping | 0.5 |

This is the single best shimmer reverb replacement on the device.

## Runner-up: TheCloud

<img src="/assets/images/plugin-strymon-thecloud.png" alt="TheCloud" class="plugin-screenshot">

**TheCloud** is a granular delay engine — 20 grain voices reading from a 2-second delay line with randomized position, duration, detune, and panning. It is not a reverb in the strict sense (no FDN, no allpass tail), but the dense cloud of recirculating grains produces the same atmospheric bloom as a cloud reverb algorithm.

Chain it after Shimmizita for the full shimmer+cloud wall-of-sound. High grain counts are CPU-heavy on a Pi.

## Plain reverb: Dragonfly Hall Reverb / Dragonfly Plate Reverb

<img src="/assets/images/plugin-strymon-dragonflyhall.png" alt="Dragonfly Hall Reverb" class="plugin-screenshot">

**Dragonfly Hall Reverb** uses the fv3 zrev2 FDN — a proper 8-delay-line reverb with modulated delay lines and band-split decay, based on Fons Adriaensen's zita-rev1 design. Decay up to ~10 s, dense and smooth. This is the best hall/chorale equivalent when you don't need shimmer.

<img src="/assets/images/plugin-strymon-dragonflyplate.png" alt="Dragonfly Plate Reverb" class="plugin-screenshot">

**Dragonfly Plate Reverb** uses the Stanford NRev plate algorithm (comb-bank → multi-stage allpass cascade) — a genuine plate simulation, not a cheap Schroeder. Best plate reverb replacement.

## What to avoid

**gx_zita_rev1** is the same clean FDN that Shimmizita builds on, but without the pitch shifter. Beautiful transparent hall reverb — useless for shimmer.

**Airwindows-PocketVerbs** are long allpass-chain Schroeder reverbs. Metallic and lo-fi next to Dragonfly or zita. Useful only as a special-effect color.

**Airwindows-Galactic** has modulated delay lines and a nice atmospheric wash, but no pitch shifter or granular engine. Closer to a chorale reverb than shimmer or cloud.
