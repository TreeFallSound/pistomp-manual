---
title: Pedalboards
eleventyNavigation:
  parent: using
  key: pedalboards
  title: Pedalboards
  order: 4
---

# Pedalboards

A pedalboard is a collection of plugins (effects, modelers, generators) wired together with virtual cables. You can build as many as you like — one for each song, each tuning, each mood. Only one pedalboard is active at a time.

## What's in a pedalboard

- **Plugins** — the LV2 effects, amps, synths, and utilities that process or generate audio
- **Routing** — how audio flows between plugins (serial, parallel, split/merge)
- **Snapshots** — saved states of every plugin parameter on the board
- **Controller bindings** — which footswitches, tweak knobs, and expression pedals control which parameters

## Creating and editing pedalboards

Pedalboards are built in MOD-UI, the drag-and-drop web interface. Point a browser to [http://pistomp.local](http://pistomp.local) from any device on the same network.

1. Open the plugin browser at the bottom of the screen and drag a plugin onto the canvas
2. Wire effects together by dragging from an output port to an input port. Signal flows left to right — the leftmost plugin in the chain receives your dry signal first
3. Assign footswitches and tweak knobs via the plugin settings dialog
4. Save the pedalboard when you're done

Changes made in MOD-UI sync to the LCD automatically. The LCD reflects the current pedalboard state in real time.

## Loading a pedalboard from the LCD

1. Rotate the Navigation encoder until the pedalboard name is highlighted (yellow)
2. Click to open the pedalboard menu
3. Rotate to scroll through available pedalboards
4. Click to load the selected pedalboard

Loading a new pedalboard takes a few seconds. Audio may drop momentarily.

## Banks

A bank is a subset of pedalboards organized for easy access. Banks are useful for setlists — you can order pedalboards in a specific sequence and scroll through only the ones you need.

To select a bank, open the System Menu and choose **Bank Select**. The default mode shows all pedalboards on the device. A single pedalboard can belong to multiple banks. Deleting a bank does not delete the pedalboards inside it.

Banks are created and edited in MOD-UI, which writes `banks.json`. The pi-Stomp detects changes and reloads automatically.

## Snapshots

A snapshot stores the state of all plugin parameters on a pedalboard. Verse, chorus, bridge, even different songs — all from the same pedalboard, just different snapshots.

See [Navigation & Controls]({{ '/using/navigation' | url }}) for how to select snapshots from the LCD.

## Saving changes

Changes made to a pedalboard on the LCD or MOD-UI (effects/routing changes, parameter tweaks, bypass toggles) are not automatically saved. To persist them:

- **System Menu** → **Pedalboard Management** → **Save current pedalboard**
- Or save from MOD-UI
