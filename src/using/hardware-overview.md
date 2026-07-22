---
title: Hardware Overview
eleventyNavigation:
  parent: using
  key: hardware-overview
  title: Hardware Overview
  order: 2
---

# Hardware Overview

The pi-Stomp v3 is a self-contained multi-effects pedal built around a Raspberry Pi 5. Everything you need is in the enclosure — no computer required on stage.

> **v2** (Pi 3/4) has up to 5 footswitches, 1 encoder (Navigation only — no tweak encoders or Volume knob), and a 320×240 color TFT. The rear panel is similar but check the [v2 Core wiki](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_core) for the exact jack layout. In 2/Out 2 below are v3; v2 audio card options differ.

## Front panel

- **4 footswitches (A–D)** — select and bypass effects, tap tempo, scroll snapshots. Each sends a configurable MIDI CC; see the [default CC map]({{ '/using/midi-implementation/#default-cc-map' | url }}).
- **Navigation encoder (bottom-left)** — scroll and click to navigate the LCD, long-press to enter deep edit mode on the highlighted plugin. (The system menu is opened from the wrench icon in the toolbar, not by long-press.)
- **Tweak 1** — sends a configurable MIDI CC on rotation, click to confirm a setting, long-press for previous snapshot.
- **Tweak 2** — sends a configurable MIDI CC on rotation, click to confirm a setting, long-press for next snapshot.
- **Volume (Tweak 3)** — adjusts output volume level.
- **2.8" color TFT LCD** — shows the current pedalboard, parameter values, and system info.

## Rear panel

The pi-Stomp v3 features a low-noise 2-in / 2-out audio interface.

- **1/4" instrument input (In 1)** — plug in your guitar, bass, or keyboard
- **1/4" output (Out 1)** — left/mono: your main output
- **1/4" input (In 2)** — second/right input; also used for NAM capture
- **1/4" output (Out 2)** — second/right output; also used as a send for NAM capture (driving the amp or pedal being captured)
- **1/8" (3.5mm) headphone output** — silent practice (same audio as the Out 1/2 stereo pair)
- **USB-C power** — 15W (5V / 3A) minimum; below that you risk undervoltage shutdowns. The factory 27W (5V / 5A) adapter is recommended, and is what supplies enough headroom to run full-power USB peripherals (up to 1.6A vs 600mA)
- **4x USB-A ports** — USB-MIDI controllers, flash drives, wireless adapters
- **1/8" (3.5mm) TRS MIDI in/out** — with the MIDI + Expression Add-On Kit
- **1/4" expression pedal input** — with the MIDI + Expression Add-On Kit. Connect a standard expression pedal. The input is disabled by default; see [Configuration]({{ '/using/configuration/#enabling-the-expression-pedal' | url }}) to enable it.

## Inside

- **Raspberry Pi 5 (2GB)** — runs the MOD software suite
- **IQAudio Codec Zero** — high-definition audio, 48+ kHz / 24-bit
- **pi-Stomp v3 PCB** — pre-soldered, connects all components
- **Active Cooler** — keeps the Pi cool under load
