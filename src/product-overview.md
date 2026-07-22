---
title: Product Overview
eleventyNavigation:
  key: product-overview
  parent: home
  title: Product Overview
  order: 2
---

# Product Overview

pi-Stomp is a Raspberry Pi that runs your effects chain. You build the chain in a browser and play it from the floor — the computer is only needed to set it up, never on stage.

This page covers what the product is, the software stack that makes it work, and defines key terms we'll use throughout this manual.

## What you're building

| Version | Status | Pi | Build | Controls | LCD |
|---------|--------|----|-------|----------|-----|
| **v3** | [Current](https://treefallsound.com/opencart/index.php?route=product/product&product_id=64&search=kit) | Pi 5 | Solderless kit | 4 footswitches, 3 tweak encoders | 2.8" color TFT |
| v2 | Supported | Pi 3/4 | Through-hole | Up to 5 footswitches, 1 encoder | Color TFT |
| v1 | Unsupported | Pi 3 | Through-hole | 3 footswitches | Monochrome |

The hardware is a front panel — footswitches, encoders, expression jacks, and an LCD — wired to a Pi with an audio codec. The Pi runs 600+ open-source LV2 effects, Neural Amp Models, and 60+ synth, drum-machine, and sampler plugins. All pi-Stomp software is free open source (AGPL-3.0).

## The stack

pi-Stomp is four pieces of software stacked on top of each other. They are, starting with the foundations:  

| Layer | What it is | What it does |
|-------|-----------|---------------|
| **JACK** | The Linux audio server | Routes audio buffers between clients on a fixed schedule |
| **mod-host** | The plugin host, from [MOD Devices](https://mod.audio) | Loads LV2 plugins, wires their ports together, runs them each buffer |
| **MOD-UI** | The web app, also from MOD Devices | Drag-and-drop editor for the graph mod-host is running. Open it at [http://pistomp.local](http://pistomp.local) |
| **pi-Stomp controller** | Tree Fall Sound's Python app | Reads the footswitches, encoders, and expression pedals; sends MIDI CCs into mod-host; draws the LCD |

### Notes

pi-Stomp is a controller, not an audio processor. Audio lives in JACK + mod-host. The controller can crash and restart without any disruption to your audio chain. See [Architecture]({{ '/developers/architecture/' | url }}) for the full picture.

MOD-UI is a fork of MOD Devices' excellent pedalboard software, along with bugfixes for stability and feature enhancements, like the ability to download new LV2 effects plugins.

The controller and MOD-UI talk over HTTP and WebSocket on localhost to keep in sync: you can make changes on either one and they will immediately show up on the other. Any pedalboard you build or modifications you make in the browser take effect immediately, with no manual synchronization step.

## Vocabulary

| Term | What it is | When it changes |
|------|-----------|-----------------|
| **Pedalboard** | A saved audio graph: which plugins are loaded, how they're wired, every plugin's current knob settings, and the controller bindings (footswitches, encoders, expression pedals) | Loading a different pedalboard instantiates a new graph — takes a few seconds, audio drops while it happens |
| **Snapshot** | A saved set of parameter values *within one pedalboard*. Same plugins, same wiring, different knob positions | Changing a snapshot sets values on already-running plugins — instant, no audio drop, delay tails and reverb trails survive |
| **Bank** | An ordered subset of pedalboards, used to lay out a setlist |  Switching banks changes which pedalboards you scroll through, not which one is loaded |

Pedalboards and snapshots are built in MOD-UI and selected from the LCD. Banks are also defined in MOD-UI. Snapshot changes are instant; pedalboard changes are not. See [Playing Live]({{ '/using/playing-live/' | url }}) for tips on how to set up your rig.


## Where to go next

- **Building your kit** → [Building]({{ '/building/' | url }})
- **Plugging in and making sound** → [Quick Start]({{ '/using/quick-start/' | url }})
- **Building your first pedalboard** → [MOD-UI]({{ '/using/mod-ui/' | url }})
- **Organizing a setlist** → [Playing Live]({{ '/using/playing-live/' | url }})
