---
title: Navigation & Controls
eleventyNavigation:
  parent: using
  key: navigation
  title: Navigation & Controls
  order: 3
---

# Navigation & Controls

The pi-Stomp v3 can be controlled entirely from the device: no computer needed once your pedalboards are set up. Simply use the Navigation encoder, the footswitches, and the tweak encoders.

## The LCD screen

The home screen shows the current pedalboard, active snapshot, and all plugins in the chain. The Navigation encoder moves a yellow highlight between elements; clicking takes action on whatever is highlighted.

<img src="{{ '/assets/images/lcd-homescreen-beths.png' | url }}" alt="Home screen with pedalboard loaded" class="figure-narrow">

- **Pedalboard name** (top) — click to open the pedalboard menu
- **Snapshot name** (below pedalboard) — click to open the snapshot menu
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

<img src="{{ '/assets/images/lcd-pedalboard-select.png' | url }}" alt="Pedalboard selection" class="figure-narrow">

1. Rotate the Navigation encoder until the pedalboard name is highlighted (yellow)
2. Click to open the pedalboard menu
3. Rotate to scroll through available pedalboards
4. Click a pedalboard to load it

Loading a new pedalboard takes a few seconds, during which time audio can drop momentarily.

## Selecting a snapshot

Snapshots store the state of all plugin parameters on a pedalboard, allowing different gain staging and effect blending/bypass. Verse, chorus, bridge, even different songs: all from the same pedalboard.

<img src="{{ '/assets/images/lcd-preset-select.png' | url }}" alt="Snapshot selection" class="figure-narrow">

1. Rotate the Navigation encoder until the snapshot name is highlighted
2. Click to enter snapshot selection mode
3. Rotate to scroll through available snapshots
4. Click to load the selected snapshot

You can also switch snapshots by long-pressing footswitches A and B (previous and next).

## Bypassing and enabling plugins

1. Rotate the Navigation encoder until a plugin tile is highlighted (yellow border)
2. Click to toggle between enabled and bypassed

An enabled plugin shows as a filled block:

<img src="{{ '/assets/images/lcd-plugin-active.png' | url }}" alt="Plugin enabled — filled block" class="figure-narrow">

A bypassed plugin shows as an unfilled (outline) block:

<img src="{{ '/assets/images/lcd-plugin-bypassed.png' | url }}" alt="Plugin bypassed — outline block" class="figure-narrow">

Plugins assigned to footswitches can also be toggled from the floor — the footswitch label on the LCD updates to reflect the current state. When it's bound to a plugin, pressing the footswitch will toggle it on and off (bypass/enable).

## Editing plugin parameters

1. Highlight a plugin tile and long-press the Navigation encoder

<img src="{{ '/assets/images/lcd-param-menu.png' | url }}" alt="Parameter menu" class="figure-narrow">

2. Rotate to select a parameter, then click

<img src="{{ '/assets/images/lcd-param-dialog.png' | url }}" alt="Parameter edit dialog" class="figure-narrow">

3. Rotate to adjust the value — changes take effect immediately

<img src="{{ '/assets/images/lcd-param-tweaked.png' | url }}" alt="Parameter adjusted" class="figure-narrow">

4. Click to close the dialog

<img src="{{ '/assets/images/lcd-param-closed.png' | url }}" alt="Back to home screen" class="figure-narrow">

## Footswitches

The four footswitches (A–D, left to right) are user-configurable via MIDI CC. Default behaviour:

| Footswitch | Click | Long-press |
|------------|-------|------------|
| A | Toggle MIDI CC 60 (plugin bypass) | Previous snapshot |
| B | Toggle MIDI CC 61 (plugin bypass) | Next snapshot |
| C | Toggle MIDI CC 62 (plugin bypass) | Open tuner |
| D | Toggle MIDI CC 63 (plugin bypass) or tap tempo | Toggle tap tempo mode |

When a footswitch is assigned to a plugin, its label and color appear on the LCD:

<img src="{{ '/assets/images/lcd-footswitches.png' | url }}" alt="Footswitch labels on LCD" class="figure-narrow">

## Tweak encoders

Tweak 1 and Tweak 2 send MIDI CC messages (default 70 and 71) and can be assigned to any plugin parameter via MOD-UI. Long-pressing them also changes snapshots by default — Tweak 1 previous, Tweak 2 next. The Volume encoder (Tweak 3) adjusts the master output level.

## Global bypass

The bypass toolbar button (power icon) toggles audio processing on and off. When the icon is green, processing is active. When grey, the signal passes through unprocessed.

Click the button to toggle. Long-press to change which channels are bypassed — most users will prefer **Left & Right** bypass.

## Tap tempo

Long-press footswitch D to enter tap tempo mode. The footswitch label changes to show the current BPM. The tempo is set from the second tap onward; keep tapping (it averages the last four intervals) to home in on a steady value. Tempos below 40 BPM are ignored. Long-press again to return to normal mode.

To save the tempo for a pedalboard: System Menu → **Pedalboard Management** → **Save current pedalboard**.

Not all plugins use the host tap tempo. Bollie Delay is one that does — set its Tempo Mode to **MOD/Host**.

## Notes panel

v3.2.0 adds a notes panel for pedalboard and plugin annotations. Notes appear with a `✎` prefix on the pedalboard grid. Access them from the system menu or plugin long-press menu.

## System menu

Navigate to the wrench icon in the toolbar and click to open the system menu.

<img src="{{ '/assets/images/lcd-system-menu.png' | url }}" alt="System menu" class="figure-narrow">

From here you can manage pedalboards, configure Wi-Fi, adjust audio settings, and access system utilities.

## Tuner

From the system menu, select **Tuner**. You can also open and close the tuner by long-pressing footswitch C.

<img src="{{ '/assets/images/lcd-tuner.png' | url }}" alt="Tuner — no signal" class="figure-narrow">

Play a string and the tuner shows the note and a visual indicator.

<img src="{{ '/assets/images/lcd-tuner-signal.png' | url }}" alt="Tuner — with signal" class="figure-narrow">

Use the navigation encoder to toggle mute while tuning, if desired.
