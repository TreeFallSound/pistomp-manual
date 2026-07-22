---
title: Pedalboards
eleventyNavigation:
  parent: using
  key: pedalboards
  title: Pedalboards
  order: 5
---

# Pedalboards

A pedalboard is a saved audio graph: which plugins are loaded, how they're wired, every plugin's current knob settings, and the controller bindings (footswitches, encoders, expression pedals). See [Product Overview]({{ '/product-overview/' | url }}) for where the term sits alongside *snapshot* and *bank*.

## Building one

Pedalboards are built in MOD-UI. The [MOD-UI]({{ '/using/mod-ui/' | url }}) page covers the canvas, wiring, plugin settings dialog, snapshots, banks, the file manager, and saving. This page covers only the things that live at the pedalboard level on the device itself.

## Loading a pedalboard from the LCD

Highlight the pedalboard name with the Navigation encoder and click to open the menu — see [Navigation & Controls]({{ '/using/navigation/#selecting-a-pedalboard' | url }}) for the steps.

Loading a new pedalboard takes a few seconds, and audio drops while it happens. This is the reason to keep a song's sounds on one board as snapshots rather than spread across several boards: snapshot changes are instant, pedalboard changes are not. See [Playing Live]({{ '/using/playing-live/' | url }}) for the setlist judgement.

## Saving changes

Changes made to a pedalboard on the LCD or in MOD-UI (effects/routing changes, parameter tweaks, bypass toggles) are not automatically saved. To persist them:

- **System Menu** → **Pedalboard Management** → **Save current pedalboard**
- Or **Save** from MOD-UI

The pedalboard bundle lives under `/home/pistomp/data/.pedalboards/`. Snapshots and per-pedalboard config overrides are stored inside the bundle, so saving the pedalboard is also what saves your snapshots.