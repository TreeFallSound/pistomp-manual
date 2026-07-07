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

## Front panel

- **4 footswitches (A–D)** — select and bypass effects, tap tempo, scroll snapshots. Configurable via MIDI CC.
- **Navigation encoder (leftmost)** — scroll and click to navigate the LCD, long-press to enter deep edit mode on the highlighted plugin. (The system menu is opened from the wrench icon in the toolbar, not by long-press.)
- **Tweak 1** — sends MIDI CC 70 on rotation, click to confirm a setting, long-press for previous snapshot.
- **Tweak 2** — sends MIDI CC 71 on rotation, click to confirm a setting, long-press for next snapshot.
- **Volume (Tweak 3)** — adjusts output volume level.
- **2.8" color TFT LCD** — shows the current pedalboard, parameter values, and system info.

## Rear panel

- **1/4" instrument input** — plug in your guitar, bass, or keyboard
- **1/4" stereo output** — left/mono and right outputs
- **1/8" (3.5mm) headphone output** — silent practice (same audio as stereo outputs)
- **USB-C power** — 15W (5V / 3A) minimum; below that you risk undervoltage shutdowns. The factory 27W (5V / 5A) adapter is recommended, and is what supplies enough headroom to run full-power USB peripherals (up to 1.6A vs 600mA)
- **4x USB-A ports** — USB-MIDI controllers, flash drives, wireless adapters
- **1/8" (3.5mm) TRS MIDI in/out** — with the MIDI + Expression Add-On Kit
- **1/4" expression pedal input** — with the MIDI + Expression Add-On Kit. Connect a standard expression pedal. The input is disabled by default — enable it with `~/extras/expression-pedal.sh on` via SSH (see [Configuration]({{ '/using/configuration' | url }})).

## Inside

- **Raspberry Pi 5 (2GB)** — runs the MOD software suite
- **IQAudio Codec Zero** — high-definition audio, 48 kHz / 24-bit
- **pi-Stomp v3 PCB** — pre-soldered, connects all components
- **Active Cooler** — keeps the Pi cool under load
