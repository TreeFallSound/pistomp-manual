---
title: Quick Start
eleventyNavigation:
  parent: using
  key: quick-start
  title: Quick Start
  order: 1
---

# Quick Start

Your pi-Stomp is built and booted — now let's make it your best friend on stage (other than the drummer). Once your pedalboards are set up, you run the whole thing from the device itself: no other computer on stage, just you, your pedalboards, snapshots, and footswitches.

If the words *pedalboard*, *snapshot*, and *bank* aren't familiar yet, read [Product Overview]({{ '/product-overview/' | url }}) — the rest of this page uses them.

## The controls

<img src="{{ '/assets/images/pi-stomp-v3-hero.png' | url }}" alt="pi-Stomp v3">

Working clockwise:

| Control | What it does |
|---------|--------------|
| **Navigation encoder** (bottom-leftmost) | Rotate to move the highlight, click to select, long-press to deep-edit the highlighted plugin |
| **Tweak 1** and **Tweak 2** | Adjust the highlighted parameter; long-press for previous/next snapshot |
| **Volume** (Tweak 3) | Output level |
| **Footswitches A–D** | Toggle effects, tap tempo, change snapshots |
| **LCD** | Current pedalboard, parameter values, and the toolbar icons along the top |

[Hardware Overview]({{ '/building/hardware-overview/' | url }}) has the rear panel and the full spec.

## Connect

- Plug your instrument into the **In 1** jack
- Connect **Out 1** to your amp, interface, or headphones

In 2 and Out 2 are for re-amping and NAM capture — see [Hardware Overview]({{ '/building/hardware-overview/#rear-panel' | url }}).

## Boot

Plug in the 27W USB-C power supply. First boot takes a minute or two — subsequent boots are about 20 seconds. The LCD will show the home screen when ready.

## Adjust input gain

If the audio sounds distorted (in a bad way) or the input clipping LEDs turn yellow or red with normal playing:

1. Rotate the Navigation encoder to highlight the Audio toolbar icon (top right)
2. Click to open the Audio menu
3. Select **Input Gain** and turn it down until loud strums no longer clip

## Make music

The default pedalboard loads automatically. Use the footswitches to toggle effects, the Navigation encoder to browse and to bypass/enable plugins, and the tweak encoders to adjust parameters.

Learn more in [Navigation & Controls]({{ '/using/navigation' | url }}).

## Edit online

Point a browser on any device on the same network to [http://pistomp.local](http://pistomp.local) to open MOD-UI — the drag-and-drop pedalboard editor. The [MOD-UI]({{ '/using/mod-ui/' | url }}) page covers it in full.

<a href="http://pistomp.local"><img src="{{ '/assets/images/mod-ui.png' | url }}" alt="MOD-UI web interface"></a>
