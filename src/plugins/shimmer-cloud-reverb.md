---
title: Shimmer and Cloud Reverb
eleventyNavigation:
  parent: plugins
  key: shimmer-cloud-reverb
  title: Shimmer and Cloud Reverb
  order: 3
---

# Shimmer and Cloud Reverb

If you need shimmer and/or cloud reverbs for shoegaze or ambient genres, these pedals have you covered. **Shimmizita** nails the shimmer algorithm, **TheCloud** handles granular ambient textures, and Dragonfly covers traditional hall and plate sounds.

## Our pick: Shimmizita

<img src="/assets/images/plugin-strymon-shimmizita.png" alt="Shimmizita" class="plugin-screenshot">

**Shimmizita** is the only plugin on the device with a pitch shifter embedded *inside* an FDN reverb feedback loop — the same architecture as Valhalla Shimmer. Each of the 8 delay lines has its own pitch shifter, so the tail climbs exponentially into an ethereal ascending shimmer cloud. Controls for shift (±6 semitones), speed, depth, decay (1–8 s), and HF damping.

| Control | Setting |
|---------|---------|
| SHIFT | +12 (octave up) |
| PSDRYWET | 0.7 |
| T60M | 6 s |
| HF damping | 0.5 |

This is the single most capable shimmer reverb on the device, hands-down.

## Runner-up: TheCloud

<img src="/assets/images/plugin-strymon-thecloud.png" alt="TheCloud" class="plugin-screenshot">

**TheCloud** is a granular delay engine — 20 grain voices reading from a 2-second delay line with randomized position, duration, detune, and panning. It is not a reverb in the strict sense, but the dense cloud of recirculating grains produces the same atmospheric bloom as a cloud reverb algorithm.

Chain it after Shimmizita for the full shimmer+cloud wall-of-sound. Note that these plugins use high grain counts which can be heavy on the Pi's CPU; check your XRUNs and CPU usage in MOD-UI.

## Plain reverb: Dragonfly Hall Reverb / Dragonfly Plate Reverb

<img src="/assets/images/plugin-strymon-dragonflyhall.png" alt="Dragonfly Hall Reverb" class="plugin-screenshot">

**Dragonfly Hall Reverb** uses the fv3 zrev2 FDN, a proper 8-delay-line reverb with modulated delay lines and band-split decay, based on [Fons Adriaensen's zita-rev1](https://github.com/PelleJuul/zita-rev1) design. Decay up to ~10 s, dense and smooth. This is the best hall/chorale equivalent when you don't need shimmer.

<img src="/assets/images/plugin-strymon-dragonflyplate.png" alt="Dragonfly Plate Reverb" class="plugin-screenshot">

**Dragonfly Plate Reverb** uses the Stanford NRev plate algorithm (comb-bank → multi-stage allpass cascade). It's a very capable plate reverb.

## Also considered

**gx_zita_rev1** is the same clean FDN that Shimmizita builds on, but without the pitch shifter. Beautiful transparent hall reverb without the shimmer.

**Airwindows-PocketVerbs** are long allpass-chain Schroeder reverbs. To our ears, these sound quite metallic and lo-fi next to Dragonfly or zita. Useful mostly as a special-effect colour.

**Airwindows-Galactic** has modulated delay lines and a nice atmospheric wash, but no pitch shifter or granular engine. It's closer to a chorale reverb than shimmer or cloud: great if that's what you want!

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| Shimmizita | Guitarix team | GPL | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| TheCloud | sensorium | GPL-3.0 | [github.com/sensorium/sensorium-plugins](https://github.com/sensorium/sensorium-plugins) |
| Dragonfly Hall Reverb | Michael Willis, Rob vd Berg | GPL-3.0 | [michaelwillis.github.io/dragonfly-reverb](https://michaelwillis.github.io/dragonfly-reverb) |
| Dragonfly Plate Reverb | Michael Willis | GPL-3.0 | [michaelwillis.github.io/dragonfly-reverb](https://michaelwillis.github.io/dragonfly-reverb) |
| GxZita_rev1-Stereo | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Galactic | Chris Johnson (Airwindows), port by Hannes Braun | MIT | [hannesbraun.net](https://hannesbraun.net) |
| PocketVerbs | Chris Johnson (Airwindows), port by Hannes Braun | MIT | [hannesbraun.net](https://hannesbraun.net) |
