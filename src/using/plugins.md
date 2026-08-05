---
title: Plugins & Effects
eleventyNavigation:
  parent: in-the-browser
  key: plugins
  title: Plugins & Effects
  order: 3
---

# Plugins & Effects

pi-Stomp ships with over 600 open-source LV2 plugins — effects, modeled amps and cabinets, loopers, synths, drum machines, and utilities. These plugins are built by talented musicians and developers across the open-source community.

## Plugin categories

Chasing a specific sound? Each category maps to one or more editorials — buying guides that pick the plugins worth loading, with settings and chain-position advice.

| Category | Editorials |
|----------|------------|
| Overdrive, Distortion, Fuzz | [Tube Screamer]({{ '/plugins/tube-screamer/' | url }}), [Blown-Out Overdrive]({{ '/plugins/blown-out-overdrive/' | url }}), [Vintage Fuzz]({{ '/plugins/vintage-fuzz/' | url }}) |
| Dynamics | [Compressors]({{ '/plugins/compressors/' | url }}) |
| Filter / EQ | [Equalizers]({{ '/plugins/eq/' | url }}), [Wah]({{ '/plugins/wah/' | url }}) |
| Modulation | [Chorus]({{ '/plugins/chorus/' | url }}), [Uni-Vibe and Phaser]({{ '/plugins/vibe-phaser/' | url }}), [Tremolo]({{ '/plugins/tremolo/' | url }}) |
| Delay | [Atmospheric Delay]({{ '/plugins/atmospheric-delay/' | url }}), [Digital Delay]({{ '/plugins/digital-delay/' | url }}), [Glitch Granular Delay]({{ '/plugins/glitch-granular-delay/' | url }}) |
| Reverb | [Everyday Reverb]({{ '/plugins/everyday-reverb/' | url }}), [Shimmer and Cloud Reverb]({{ '/plugins/shimmer-cloud-reverb/' | url }}) |
| Pitch / Spectral | [Pitch Shifter]({{ '/plugins/pitch-shifter/' | url }}) |
| Simulator (Amp/Cab) | [Amp, Cabinet, and Neural Capture]({{ '/plugins/amp-cab-sim/' | url }}) |
| Generator (Synth/Drum) | [MIDI Instruments]({{ '/plugins/midi-instruments/' | url }}), [Analog Polysynth]({{ '/plugins/analog-polysynth/' | url }}) |
| Utility | [Utility Staples]({{ '/plugins/utility-staples/' | url }}), [Loopers]({{ '/plugins/loopers/' | url }}) |

Want the whole catalog instead of picks? The [All Plugins]({{ '/plugins/all/' | url }}) index lists every LV2 plugin on the device — searchable by name, category, or maintainer, with a usage column showing how often each one turns up in shared pedalboards.

## Browsing and adding plugins

Use MOD-UI to browse, add, and remove plugins:

1. Open [http://pistomp.local](http://pistomp.local) in a browser
2. Open the plugin browser at the bottom of the screen
3. Search by name or browse by category
4. Drag the plugin onto the pedalboard canvas

You can also install additional plugins from the [Patch Storage](https://patchstorage.com) cloud directly from MOD-UI — look for the Patch Storage tab in the plugin browser.

## Editing on the device

You do not need MOD-UI to edit plugin parameters; rich, tactile parameter editing lives on the device itself. Long-press a plugin tile on the LCD and it opens a deep-edit panel for that effect: the main controls pinned up top as dials, and a scrollable list for the rest.

Controls carry small numbered badges (**1**, **2**, or **3**) telling you which physical tweak encoder will change them. Generally speaking, Tweak1 will edit the currently-selected parameter, chosen by rotating the Navigation encoder. 

Compressors draw a live gain-reduction meter and plot input/output against the transfer curve while audio plays, letting you see the compressor in action.

## CPU and XRUN monitoring

In MOD-UI, the top bar shows real-time CPU usage and XRUN (buffer underrun) count. If you see frequent XRUNs or CPU above 75%, try:

- Removing CPU-intensive plugins (generators, simulators, pitch shifters)
- Reducing the number of active plugins on the pedalboard
- Adjusting the JACK period size (see [Performance Tuning]({{ '/maintenance/performance' | url }}))
