---
title: Navigation & Controls
eleventyNavigation:
  parent: using
  key: navigation
  title: Navigation & Controls
  order: 3
---

# Navigation & Controls

The pi-Stomp v3 is controlled entirely from the front panel — no computer needed once your pedalboards are loaded. Everything flows through the Navigation encoder, the LCD, the footswitches, and the tweak encoders.

## The LCD screen

The home screen shows the current pedalboard, active snapshot, and all plugins in the chain. The Navigation encoder moves a yellow highlight between elements; clicking takes action on whatever is highlighted.

<img src="{{ '/assets/images/lcd-homescreen-beths.png' | url }}" alt="Home screen with pedalboard loaded" style="display:block;width:80%;margin:0 auto 1rem auto">

- **Pedalboard name** (top) — click to enter pedalboard selection mode
- **Snapshot name** (below pedalboard) — click to enter snapshot selection mode
- **Plugin tiles** — each block represents a plugin in the chain. Filled = enabled, unfilled = bypassed
- **Toolbar icons** (top right) — Wi-Fi status, audio settings, bypass, system menu

## Navigation encoder

The leftmost encoder is the primary interface to the LCD.

| Action | Result |
|--------|--------|
| Rotate | Moves the yellow highlight between elements |
| Click | Selects the highlighted element |
| Long-press | Enters deep edit mode on a plugin |

## Selecting a pedalboard

<img src="{{ '/assets/images/lcd-pedalboard-select.png' | url }}" alt="Pedalboard selection" style="display:block;width:80%;margin:0 auto 1rem auto">

1. Rotate the Navigation encoder until the pedalboard name is highlighted (yellow)
2. Click to enter pedalboard selection mode
3. Rotate to scroll through available pedalboards
4. Click to load the selected pedalboard

Loading a new pedalboard takes a few seconds.

## Selecting a snapshot

Snapshots store the state of all plugin parameters on a pedalboard — verse, chorus, bridge, all from the same pedalboard.

<img src="{{ '/assets/images/lcd-preset-select.png' | url }}" alt="Snapshot selection" style="display:block;width:80%;margin:0 auto 1rem auto">

1. Rotate the Navigation encoder until the snapshot name is highlighted
2. Click to enter snapshot selection mode
3. Rotate to scroll through available snapshots
4. Click to load the selected snapshot

You can also switch snapshots by long-pressing footswitches A and B (previous and next).

## Bypassing and enabling plugins

1. Rotate the Navigation encoder until a plugin tile is highlighted
2. Click to toggle between enabled (filled) and bypassed (unfilled)

Plugins assigned to footswitches can also be toggled from the floor.

## Editing plugin parameters

1. Highlight a plugin tile and long-press the Navigation encoder

<img src="{{ '/assets/images/lcd-param-menu.png' | url }}" alt="Parameter menu" style="display:block;width:80%;margin:0 auto 1rem auto">

2. Rotate to select a parameter, then click

<img src="{{ '/assets/images/lcd-param-dialog.png' | url }}" alt="Parameter edit dialog" style="display:block;width:80%;margin:0 auto 1rem auto">

3. Rotate to adjust the value — changes take effect immediately

<img src="{{ '/assets/images/lcd-param-tweaked.png' | url }}" alt="Parameter adjusted" style="display:block;width:80%;margin:0 auto 1rem auto">

4. Click to close the dialog

<img src="{{ '/assets/images/lcd-param-closed.png' | url }}" alt="Back to home screen" style="display:block;width:80%;margin:0 auto 1rem auto">

## Footswitches

The four footswitches (A–D, left to right) are user-configurable via MIDI CC. Default behaviour:

| Footswitch | Click | Long-press |
|------------|-------|------------|
| A | Toggle MIDI CC 60 (plugin bypass) | Previous snapshot |
| B | Toggle MIDI CC 61 (plugin bypass) | Next snapshot |
| C | Toggle MIDI CC 62 (plugin bypass) | Open tuner |
| D | Toggle MIDI CC 63 (plugin bypass) or tap tempo | Toggle tap tempo mode |

In tap tempo mode, footswitch D shows the current BPM. Tap at least four times to set the tempo, then long-press to return to normal mode.

## Tweak encoders

Tweak 1 and Tweak 2 send MIDI CC messages (default 70 and 71) and can be assigned to any plugin parameter via MOD-UI. The Volume encoder (Tweak 3) adjusts the master output level.

## System menu

Navigate to the wrench icon in the toolbar and click to open the system menu.

<img src="{{ '/assets/images/lcd-system-menu.png' | url }}" alt="System menu" style="display:block;width:80%;margin:0 auto 1rem auto">

From here you can manage pedalboards, configure Wi-Fi, adjust audio settings, and access system utilities.

## Tuner

From the system menu, select **Tuner**. You can also open and close the tuner by long-pressing footswitch C.

<img src="{{ '/assets/images/lcd-tuner.png' | url }}" alt="Tuner — no signal" style="display:block;width:80%;margin:0 auto 1rem auto">

Play a string and the tuner shows the note and a visual indicator.

<img src="{{ '/assets/images/lcd-tuner-signal.png' | url }}" alt="Tuner — with signal" style="display:block;width:80%;margin:0 auto 1rem auto">

Use the navigation encoder to toggle mute while tuning, if desired.