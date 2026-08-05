---
title: Amp & Tone
eleventyNavigation:
  key: cat-amp-tone
  parent: plugins-section
  title: Amp & Tone
  order: 3
---

# Amp & Tone

What the drive lands in, and what keeps the rest of the chain in line.

The amp and cabinet stage decides most of what an audience hears — a speaker's response shapes the signal more than any pedal in front of it. The other three pages are the unglamorous half of a pedalboard: the compressor that evens out the picking hand, the EQ that fixes what the cab left behind, and the gain, gate and metering plugins that keep levels sane between everything else.

## How we got here

Every one of these started as a studio problem. Optical compression (the LA-2A, 1965) and FET compression (the 1176, 1967) were built to stop a signal overloading tape, and only later became something engineers reached for because of how they sounded. The pedal version arrived when the OTA chip made it cheap — the Ross and Dyna Comp circuits of the mid-1970s are essentially one chip and a rectifier, and guitarists liked them for a side effect the studio boxes were designed to avoid: audible pumping and a longer apparent sustain. EQ has an even longer lineage, from the Pultec program equalizer of the early 1950s to the Baxandall tone stack that ended up inside a great many guitar amp designs built since.

Cabinet emulation is the recent one, and it moved in three jumps. Analog speaker simulators in the 1980s were a filter network approximating a 4×12 — good enough for a silent stage, never mistaken for the real thing. Convolution replaced them in the 2000s: capture the cabinet's impulse response once, convolve with it forever, and the result is genuinely the measured cabinet rather than a curve that resembles it. Neural capture arrived around 2021 and extends that to the parts convolution cannot represent, because a distorting amp is nonlinear and an impulse response is by definition linear. NAM is the open-source strand of that work, and it runs on your pi-Stomp.

## Editorials

- [Amp, Cabinet, and Neural Capture]({{ '/plugins/amp-cab-sim/' | url }}) — GxAmplifier-X, GxCabinet, NAM, and when to pick which
- [Compressors]({{ '/plugins/compressors/' | url }}) — Every compressor on the device, by the job you want it to do
- [Equalizers]({{ '/plugins/eq/' | url }}) — Every EQ on the device, by the job you want it to do
- [Utility Staples]({{ '/plugins/utility-staples/' | url }}) — Gain, gate, mixer, meter: the plugins that hold a chain together
