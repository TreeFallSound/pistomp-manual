---
title: Pedalboards
eleventyNavigation:
  parent: in-the-browser
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

## Deciding what goes on one

Knowing how to wire the canvas doesn't tell you which of the 663 plugins to wire. [Choosing Pedals]({{ '/plugins/choosing-pedals/' | url }}) is the workflow for that: design the chain against the [editorials]({{ '/plugins/' | url }}), find and stage any captures or impulse responses it needs, confirm the plugins exist on your device, then build and save.

Start there if you have a sound in your head and no idea which plugin makes it.

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

Six files travel with it, plus one directory per plugin that stores LV2 state:

| File | What it holds |
|------|---------------|
| `manifest.ttl` | Bundle declaration — what the host reads first |
| `<name>.ttl` | The graph: plugins by URI, their port values, and the connections between them |
| `snapshots.json` | Every snapshot's parameter values |
| `addressings.json` | Footswitch, encoder, and MIDI bindings |
| `config.yml` | Per-pedalboard controller overrides |
| `screenshot.png` | The board as MOD-UI drew it |
| `effect-<n>/` | LV2 state for the plugin at position `<n>` |

### Impulse responses and NAM models

An `effect-<n>/` directory does not contain the IR or NAM model its plugin uses. It contains a **symlink** into `/home/pistomp/data/user-files/`:

```
effect-21/Clean (G1 L0 B1 T1).nam -> ../../../user-files/NAM Models/Clean (G1 L0 B1 T1).nam
```

`scp -r` dereferences symlinks and copies the file contents. `git` and `tar` do not — they preserve the link, which then dangles on the recipient's device. The plugin instantiates and the board loads; the model is silently absent.

List what a bundle depends on:

```bash
find MyBoard.pedalboard -type l -exec readlink -f {} \;
```

Each of those files must be copied to the recipient's device, into the same subdirectory of `/home/pistomp/data/user-files/` it came from — `NAM Models`, `Speaker Cabinets IRs`, or `Reverb IRs`. Names must match, including spaces and case.

**Redistribution.** Commercial IR packs and NAM captures are frequently licensed to a single purchaser, and a captured amp may carry restrictions of its own. Free downloads are not exempt: Tone3000's terms bar bundling or redistributing tones from the site through third-party platforms — see [the licensing note]({{ '/plugins/choosing-pedals/stage/#licensing' | url }}). Verify the licence before sending these files to anyone. The pedalboard repository does not accept them.

To contribute one, fork [TreeFallSound/pi-stomp-pedalboards](https://github.com/TreeFallSound/pi-stomp-pedalboards), commit the bundle directory whole, and open a pull request. Before you do, check the three things that make a board work on someone else's device: every plugin URI in the `.ttl` must be one that ships with the stock image (a board that needs a Patchstorage plugin should say so in the PR), `screenshot.png` should be present, since it's how people browse, and `find . -type l` should come back empty — a board that depends on a file in `user-files` cannot be distributed as a bundle alone. Include the snapshots — a board with a verse and a solo tone teaches more than a board with one.

Going the other way, `swap-pedalboards.sh <git-url>` replaces your whole collection from any git remote. See [Configuration]({{ '/using/configuration/#factory-installed-customization-scripts' | url }}).
