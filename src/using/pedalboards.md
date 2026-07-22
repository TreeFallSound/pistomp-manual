---
title: Pedalboards
eleventyNavigation:
  parent: using
  key: pedalboards
  title: Pedalboards
  order: 2
---

# Pedalboards

A pedalboard is the whole rig: which plugins are loaded, how they're wired into a chain, where every knob sits, and what each footswitch, encoder, and expression pedal does. It's the thing you play. Everything else in this manual — the build, the menus, MOD-UI, the plugins — exists to get a pedalboard under your feet.

Load a pedalboard and the device *becomes* that rig. A clean amp into a spring reverb for one song, a fuzz into a tape delay into a shimmer for the next — each is a pedalboard, and switching is a click on the Navigation encoder. You're not rebuilding anything on stage. The work happened once, in a browser; on the floor you just pick the rig you already made.

## What's inside a pedalboard

Four things travel together in every pedalboard:

| Part | What it is |
|------|------------|
| **The chain** | The plugins you loaded and the order signal flows through them, left to right — instrument into the first plugin, last plugin into the output. |
| **The settings** | Every plugin's current parameter values — the exact position of each knob and switch. |
| **The snapshots** | Named sets of those settings you switch between *instantly*, with the same plugins and wiring. A verse tone and a solo tone on one board. |
| **The bindings** | Which hardware control moves which parameter: footswitches A–D, Tweak 1 and 2, and an expression pedal if fitted. |

The chain and the bindings are the instrument. The snapshots are the presets *within* that instrument. This split is the whole reason pi-Stomp works on stage, and it's worth getting straight now because the rest of the Using section leans on it.

## One board per rig, not per song part

Loading a new pedalboard takes a few seconds, and audio drops while it happens — the device tears down one audio graph and builds another. Recalling a snapshot is instant: the graph never changes, so reverb tails and delay repeats ring straight through the switch.

So the shape that works is one pedalboard per *sound world*, with the moment-to-moment changes saved as snapshots inside it. Keep a song's tones on one board and you switch between them mid-phrase. Spread them across three boards and you get a silent gap every time.

**Snapshots within a song. Pedalboards between songs.** [Playing Live]({{ '/using/playing-live/' | url }}) turns that rule into stagecraft — holding levels steady, fixing the room, and ordering boards into a setlist. For now, just hold the idea: the pedalboard is the rig, the snapshot is the moment.

## Where pedalboards come from

You build and edit them in [MOD-UI]({{ '/using/mod-ui/' | url }}), the drag-and-drop editor at `pistomp.local` — drop plugins on the canvas, wire them, save snapshots, group boards into banks. A fresh device already has a default pedalboard loaded so you can play the moment it boots, and you can pull ready-made boards from Patchstorage from inside MOD-UI.

You load and play them from the device itself. Highlight the pedalboard name with the Navigation encoder and click to open the list — see [Navigation & Controls]({{ '/using/navigation/#selecting-a-pedalboard' | url }}) for every device-side control.

## Saving

Changes you make — swapping plugins, re-wiring, tweaking parameters, toggling bypass, on the LCD or in MOD-UI — are **not** saved automatically. To keep them:

- **System Menu** → **Pedalboard Management** → **Save current pedalboard**
- Or **Save** in MOD-UI

Each pedalboard is a bundle under `/home/pistomp/data/.pedalboards/`. Snapshots and per-pedalboard config overrides live inside that bundle, so saving the pedalboard is also what saves your snapshots. Back the directory up and you've backed up every rig you've made.
