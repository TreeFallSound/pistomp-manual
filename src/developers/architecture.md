---
title: Architecture Overview
eleventyNavigation:
  parent: developers
  key: architecture
  title: Architecture Overview
  order: 1
---

# Architecture Overview

pi-Stomp is Python software that runs on a Raspberry Pi and acts as a hardware controller for MOD-UI. MOD-UI wraps mod-host, which hosts LV2 plugins on top of JACK.

## pi-Stomp is a controller, not an audio processor

Audio processing happens in mod-host. pi-Stomp reads footswitches, encoders, knobs, and expression pedals, then sends MIDI CC messages to mod-host. It reads state back from MOD-UI and draws it on the LCD.

pi-Stomp can crash and restart without dropping audio. The audio chain is standard JACK + LV2 — replace pi-Stomp with any other MIDI controller and the pedalboard keeps working.

## The polling loop

Everything runs on a fixed 10ms heartbeat:

| Every | What happens |
|-------|-------------|
| 10ms | Read footswitches, encoders, knobs, expression pedals |
| 10ms | Drain incoming WebSocket messages from MOD-UI |
| 20ms | Update LEDs and VU meters |
| ~80ms | Redraw the LCD |
| 1s | Check if the pedalboard changed in MOD-UI |
| 2s | Check WiFi and Ethernet status |
| 60s | Check CPU temperature and throttling |

Fixed-frequency loops avoid surprise latency from interrupt handlers. The 10ms tick is fast enough for instant-feeling controls, slow enough to leave CPU for audio.

## Hardware versions

Three variants share a common base class, selected by `hardware.version` in the YAML config:

| Version | Product | Processor | Controls | LCD |
|---------|---------|-----------|----------|-----|
| < 2.0 | pi-Stomp v1 | Pi 3 | 3 footswitches, 2 encoders, 1 pot | Monochrome 128x64 |
| 2.0–2.9 | pi-Stomp Core (v2) | Pi 3/4 | Up to 5 footswitches, 1 encoder | Color 320x240 |
| ≥ 3.0 | pi-Stomp Tre (v3) | Pi 5 | 4 footswitches, 4 encoders, LED strip | Color 320x240 |

Each version has its own hardware class (`Pistomp`, `Pistompcore`, `Pistomptre`). A factory creates the right one from the config. v2 and v3 share the same handler logic (`Modhandler`); only the hardware layer changes.

## How controls become sound

1. You press a footswitch
2. The polling loop reads the GPIO pin and creates a `SwitchEvent`
3. The handler decides what the press means — toggle bypass, change snapshot, open tuner
4. For a bypass toggle, it flips local state and sends an absolute MIDI CC (127 or 0)
5. The MIDI CC travels through ALSA Midi Through → JACK → mod-host
6. mod-host applies the bypass and echoes the new state via WebSocket
7. pi-Stomp receives the echo and updates the LCD

pi-Stomp updates the LCD before the echo comes back so the UI feels instant. The echo is absolute, not a delta, so a wrong prediction is overwritten rather than compounded.

## How pi-Stomp talks to MOD-UI

Two channels:

- **REST** (port 80) — load pedalboards, switch snapshots, read BPM. Request-response.
- **WebSocket** (port 80/websocket) — live state. MOD-UI broadcasts parameter changes, bypass toggles, and snapshot loads. pi-Stomp listens and updates the LCD.

The WebSocket bridge runs in a background thread with automatic reconnection.

## Configuration

At runtime, two files are involved:

1. **User config** — `/home/pistomp/data/config/default_config.yml`. At first boot, `firstboot.sh` *copies* the OS template for the detected hardware into this file; from then on it's the single global config.
2. **Per-pedalboard config** — `{bundle}/config.yml`, merged field-by-field over the user config on load. Overrides controls and MIDI bindings for a specific pedalboard.

Only the per-pedalboard layer is a runtime merge. This lets you have different footswitch assignments for different pedalboards without touching the global config.

## Design principles

- **Polling over events** — predictable timing, no surprise latency
- **Explicit version routing** — factory pattern, not capability detection
- **Overlay, don't replace** — per-pedalboard config merges field-by-field
- **Single writer** — MOD-UI owns the truth; pi-Stomp paints optimistically and reconciles
- **Trust MOD for audio** — pi-Stomp is a controller, not an audio processor
