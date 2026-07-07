---
title: Plugins & Effects
eleventyNavigation:
  parent: using
  key: plugins
  title: Plugins & Effects
  order: 5
---

# Plugins & Effects

pi-Stomp ships with over 600 open-source LV2 plugins — effects, modeled amps and cabinets, loopers, synths, drum machines, and utilities. These plugins are built by talented musicians and developers across the open-source community.

## Plugin categories

| Category | Examples |
|----------|----------|
| Overdrive, Distortion, Fuzz | GxTubeScreamer, Fuzz Face FM, GxSupersonic, GxKnightFuzz |
| Dynamics | Calf Mono Compressor, DISTRHO Compressor, MDA Dynamics, SC2 |
| Filter / EQ | x42 fil4 parametric EQ, C* EQ, GxCrybaby, CAPS EQ10 |
| Modulation | String machine stereo chorus, TAP Chorus/Flanger, GxPhaser |
| Delay | ZamDelay, Tal-Dub-3, Bollie Delay XT, bentdelay |
| Reverb | Shimmizita, Dragonfly Hall/Plate, TheCloud, gx_zita_rev1 |
| Pitch / Spectral | Super Whammy, Drop, MaPitchshift |
| Simulator (Amp/Cab) | GxFenderizer, GxCabinet, NAM (Neural Amp Modeler) |
| Generator (Synth/Drum) | 60+ synth, sampler, drum machine, and General MIDI modules |
| Utility | Noisegate, Tuner, Gain, MIDI tools, Phrase Looper, Sequencer |

## Browsing and adding plugins

Use MOD-UI to browse, add, and remove plugins:

1. Open [http://pistomp.local](http://pistomp.local) in a browser
2. Open the plugin browser at the bottom of the screen
3. Search by name or browse by category
4. Drag the plugin onto the pedalboard canvas

You can also install additional plugins from the [Patch Storage](https://patchstorage.com) cloud directly from MOD-UI — look for the Patch Storage tab in the plugin browser.

## Plugin panels

Many plugins have custom LCD panels that show controls and visual feedback specific to that effect. These panels appear when you long-press a plugin tile on the LCD. Supported panels include:

- x42 parametric EQ (fil4) — live frequency-response graph
- Graphic EQ — 10-band sliders
- GX Cabinet — cab selection and mic placement
- CAPS Noisegate — threshold and reduction meter
- DISTRHO Compressor — gain reduction metering
- NAM — capture status and model loading
- Tap Reverb — decay and tone controls
- ZAM Compressor, Compressor, EQ — dedicated layouts

## CPU and XRUN monitoring

In MOD-UI, the top bar shows real-time CPU usage and XRUN (buffer underrun) count. If you see frequent XRUNs or CPU above 75%, try:

- Removing CPU-intensive plugins (generators, simulators, pitch shifters)
- Reducing the number of active plugins on the pedalboard
- Adjusting the JACK period size (see [Performance Tuning]({{ '/using/performance' | url }}))

## Plugin reference

For detailed editorial reviews of specific plugins — our picks for each effect type, settings, and chain position advice — see the [Plugin Reference]({{ '/plugins/' | url }}).
