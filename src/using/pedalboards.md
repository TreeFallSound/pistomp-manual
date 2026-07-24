---
title: Pedalboards
eleventyNavigation:
  parent: using
  key: pedalboards
  title: Pedalboards
  order: 2
---

# Pedalboards

Load a pedalboard and the device becomes that rig. A clean amp into a spring reverb for one song, a fuzz into a tape delay into a shimmer for the next — switching between them is a click on the Navigation encoder. The work happened once, in a browser; on the floor you pick the rig you already made.

[Product Overview]({{ '/product-overview/#vocabulary' | url }}) defines pedalboards, snapshots, and banks. This page is about living with them.

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

## Sharing a pedalboard

A bundle is a directory, so a pedalboard is a thing you can hand to someone. Copy one off the device:

```
scp -r pistomp@pistomp.local:/home/pistomp/data/.pedalboards/MyBoard.pedalboard .
```

Six files travel with it:

| File | What it holds |
|------|---------------|
| `manifest.ttl` | Bundle declaration — what the host reads first |
| `<name>.ttl` | The graph: plugins by URI, their port values, and the connections between them |
| `snapshots.json` | Every snapshot's parameter values |
| `addressings.json` | Footswitch, encoder, and MIDI bindings |
| `config.yml` | Per-pedalboard controller overrides |
| `screenshot.png` | The board as MOD-UI drew it |

To contribute one, fork [TreeFallSound/pi-stomp-pedalboards](https://github.com/TreeFallSound/pi-stomp-pedalboards), commit the bundle directory whole, and open a pull request. Before you do, check the two things that make a board work on someone else's device: every plugin URI in the `.ttl` must be one that ships with the stock image (a board that needs a Patchstorage plugin should say so in the PR), and `screenshot.png` should be present, since it's how people browse. Include the snapshots — a board with a verse and a solo tone teaches more than a board with one.

Going the other way, `swap-pedalboards.sh <git-url>` replaces your whole collection from any git remote. See [Configuration]({{ '/using/configuration/#factory-installed-customization-scripts' | url }}).
