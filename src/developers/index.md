---
title: Developer Guide
eleventyNavigation:
  key: developers
  title: Developers
  order: 4
---

# Developer Guide

pi-Stomp is open source, top to bottom: a Python controller that drives MOD-UI, the OS image that ships it, and a recovery / OTA updates ecosystem. This section is for hacking on pi-Stomp: adding a feature, fixing a bug, building a custom image, or just understanding how the pieces fit.

Start with [Architecture]({{ '/developers/architecture/' | url }}) for the mental model, then [Getting Started]({{ '/developers/getting-started/' | url }}) to set up a dev loop. The rest go deep on specific subsystems.

- [Architecture]({{ '/developers/architecture/' | url }}) — How pi-Stomp, MOD-UI, mod-host, and JACK fit together
- [Getting Started]({{ '/developers/getting-started/' | url }}) — Dev environment, running in-place, tests, emulator
- [Configuration]({{ '/developers/configuration/' | url }}) — YAML schema, templates, first boot
- [MIDI & Control System]({{ '/developers/midi-control/' | url }}) — Input dispatch, routing, footswitches, encoders
- [WebSocket Bridge]({{ '/developers/websocket-bridge/' | url }}) — Live state sync with MOD-UI
- [Building Custom Images]({{ '/developers/building-images/' | url }}) — The pi-gen-pistomp image and OTA package flow
- [pistomp-recovery]({{ '/developers/pistomp-recovery/' | url }}) — Update, rollback, and crash recovery
- [Contributing]({{ '/developers/contributing/' | url }}) — How to get changes merged
