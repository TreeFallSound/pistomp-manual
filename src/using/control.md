---
title: Control
eleventyNavigation:
  parent: using
  key: control
  title: Control
  order: 4
---

# Control

A footswitch, an encoder, an expression pedal and an external MIDI controller all end up in the same place: a MIDI CC arriving at mod-host. Once the CC exists, nothing cares where it came from.

That's the reason this section holds together. Learn the CC map and the config file once, and every physical control on and around the pedal works the same way.

- [Configuration]({{ '/using/configuration/' | url }}) — the YAML behind the footswitches, encoders, long-press chords and blend mode
- [Expression Pedals]({{ '/using/expression-pedals/' | url }}) — which pedals work, wiring a jack, assigning one to a parameter
- [MIDI Implementation]({{ '/using/midi-implementation/' | url }}) — the default CC map, and driving pi-Stomp from an external controller
- [Control Voltage]({{ '/using/control-voltage/' | url }}) — sending CV out to modular gear
