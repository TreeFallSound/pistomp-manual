---
title: MOD-UI
eleventyNavigation:
  parent: using
  key: mod-ui
  title: MOD-UI
  order: 4
---

# MOD-UI

MOD-UI is the drag-and-drop editor where you build pedalboards, save snapshots, and organize banks. It runs in any browser on the same network as the pi-Stomp, at [http://pistomp.local](http://pistomp.local).

## The canvas

<a href="http://pistomp.local"><img src="{{ '/assets/images/mod-ui.png' | url }}" alt="MOD-UI web interface"></a>

The main area is the pedalboard canvas. Audio flows left to right: the leftmost plugin receives your dry signal first, the rightmost feeds the output. Plugins are rectangles with input ports on the left and output ports on the right. Coloured cables connect ports: purple for audio, cyan for MIDI.

The top bar shows the current pedalboard name and the snapshot selector. The bottom bar (under the plugin browser) contains CPU usage, and the XRUN counter, as well as links to your pedalboard library as well as Patch Storage ([see below](#downloading-new-lv2-plugins-from-patchstorage)).

<img src="{{ '/assets/images/mod-ui-footer.png' | url }}" alt="MOD-UI web interface">

## Adding plugins

1. Click the plugin browser at the bottom of the screen (or press the browser toggle)
2. Search by name, or filter by category
3. Drag a plugin onto the canvas

<img src="{{ '/assets/images/mod-ui-pedals.png' | url }}" alt="Bottom list of plugins in MOD-UI" class="figure-narrow">

A plugin dropped on the canvas is already running — you'll hear it immediately if your chain is wired through to an output. Browse the full catalogue on the [All Plugins]({{ '/plugins/all/' | url }}) page; curated picks live in the [Plugin Reference]({{ '/plugins/' | url }}).

## Wiring

Drag from an output port to an input port to make a cable. Signal can split (one output to many inputs) and merge (many outputs to one input, summed). Parallel chains are fine — that's how you keep a dry path alongside a wet one, or run two amps into separate cab IRs.

CV cables work the same way but carry control voltage rather than audio. See [Control Voltage]({{ '/using/control-voltage/' | url }}) for that whole world.

## The plugin settings dialog

Click a plugin's title bar to open its settings dialog. Here, you can assign hardware to plugin parameters (MIDI learn) as well as tweak parameters finely, including those that are not available via the skeumorphic pedal UI.

<img src="{{ '/assets/images/mod-ui-plugin-parameters.png' | url }}" alt="The settings pane for a plugin">

| Tab | What it's for |
|-----|---------------|
| **Parameters** | Every knob the plugin exposes, with its current value. Click a knob to assign a hardware control to it |
| **Ports** | Audio and CV ports — toggle which ones are visible on the canvas |
| **Information** | Plugin author, license, version, URI |

### Assigning a hardware control

A footswitch, tweak encoder, or expression pedal can drive any plugin parameter:

1. Click the parameter's **modify** button (next to its value):

<img src="{{ '/assets/images/mod-ui-assign-start.png' | url }}" alt="Clicking the parameter's modify button" class="figure-narrow">

2. Choose **MIDI** as the source:

<img src="{{ '/assets/images/mod-ui-assign-midi.png' | url }}" alt="Clicking the parameter's modify button">

3. Save
4. Move the physical control you want bound to it

The parameter is now mapped. Save the pedalboard to keep the assignment.

> **MIDI mode must be set to *Separated*** (not *Aggregated*) in the plugin's settings, or MIDI learn will not work correctly.

See [MIDI Implementation]({{ '/using/midi-implementation/' | url }}) for the default CC numbers each footswitch and encoder sends, and for advanced mapping — sweeping only part of a parameter's range, for example.

### Un-assigning

A control can't be bound to a new parameter until it's released from the old one. Open the modify dialog for the parameter it's currently bound to, click **None**, then **Save**.

## Pedalboards are not automatically saved

Changes made in MOD-UI sync to the LCD automatically, but they aren't *persisted* until you save. Closing the browser without saving loses unsaved changes — the device keeps running whatever was last saved.

| Action | What it does |
|--------|--------------|
| **Save** | Writes changes to the current pedalboard onto your SD card |
| **Save as** | Creates a new pedalboard bundle with the current state, leaving the original untouched |

You can also save from the LCD: navigate to System Menu → Pedalboard Management.

## Snapshots

While a footswitch or tweak encoder might toggle one plugin, a snapshot sets every parameter on your pedalboard at once: great for dialing in tones for different parts of a performance. Each snapshot stores the value of every plugin parameter on the pedalboard at the moment you save it. Effects and wiring stay common between snapshots; only knob positions change.

### Creating a snapshot

1. Set the plugin parameters the way you want them
2. Open the snapshot selector in the top bar:

<img src="{{ '/assets/images/mod-ui-snapshots-menu.png' | url }}" alt="Clicking the parameter's modify button" class="figure-narrow">

3. Click **Save as** and name it
4. **Save the pedalboard** to persist the new snapshot

Snapshots live inside the pedalboard bundle, so an unsaved pedalboard loses them. Save the pedalboard whenever you create or rename a snapshot.

### Renaming and deleting

<img src="{{ '/assets/images/mod-ui-snapshots-manager.png' | url }}" alt="Clicking the parameter's modify button" class="figure-narrow">

From the same snapshot selector: click a snapshot's name to rename it, or its trash icon to delete it. Both require saving the pedalboard to take effect.

### Recalling a snapshot

- **In MOD-UI** — click the snapshot in the selector
- **From the LCD** — highlight the snapshot name and click; see [Navigation & Controls]({{ '/using/navigation/#selecting-a-snapshot' | url }})
- **From a footswitch** — long-press A (previous) or B (next) by default; see [Configuration]({{ '/using/configuration/#footswitches' | url }}) to change this
- **Partially** — see [Blend mode]({{ '/using/configuration/#blend-mode' | url }})

## Banks

A bank is an ordered subset of your pedalboards — a way to lay out a setlist so that advancing moves you to the next song rather than scrolling an alphabetical list.

### Creating a bank

<img src="{{ '/assets/images/mod-ui-banks.png' | url }}" alt="Patchstorage tab" class="figure-narrow">

Banks are defined in MOD-UI's **Banks** panel, accessed from the top bar. You name a bank, then drag pedalboards into it in the order you want them to play. A single pedalboard can belong to several banks. Deleting a bank does not delete the pedalboards inside it.

MOD-UI writes `banks.json`; the pi-Stomp detects the change and reloads automatically.

### Selecting a bank on the LCD

System Menu → **Bank Select**. The default mode shows all pedalboards on the device. Once a bank is selected, the pedalboard menu only scrolls through the pedalboards in that bank.

See [Playing Live]({{ '/using/playing-live/#setlists-and-banks' | url }}) for the setlist judgement — when to use one pedalboard per song vs. one pedalboard for the set.

## The file manager

<img src="{{ '/assets/images/mod-ui-file-manager.png' | url }}" alt="Clicking the parameter's modify button" class="figure-narrow">

Plugin parameters sometimes need a file — a NAM model, an impulse response, a sample. MOD-UI's file manager (top bar) uploads files into `/home/pistomp/data/user-files/` and makes them available to any plugin that takes that file type. Drag a file in; it's stored on the device and appears in any plugin's file picker.

See [NAM]({{ '/using/nam/' | url }}) for the NAM model workflow, which uses this.

## Downloading new LV2 plugins from Patchstorage

<img src="{{ '/assets/images/mod-ui-patchstorage-tab.png' | url }}" alt="Patchstorage tab" class="figure-narrow">

The plugin browser has a Patchstorage tab near the bottom left, beside the file manager and the local catalogue. Patchstorage is a community plugin hosting site; anything you install from there lands in `/home/pistomp/data/.lv2/` and shows up in the local browser on next refresh. Factory plugins live in `/usr/lib/lv2/` and come from the OS image — they're separate from what you install yourself.

<img src="{{ '/assets/images/mod-ui-patchstorage-browse.png' | url }}" alt="Patchstorage tab">

## What you can't do from MOD-UI

... yet? Yet. Hopefully someday.

- Assigning footswitch long-press actions and other pi-Stomp `default_config.yml` concerns (see [Configuration]({{ '/using/configuration/#long-press-actions' | url }}))
- Modifying and/or creating `config.yml` *inside* a pedalboard bundle; see [Per-pedalboard overrides]({{ '/using/configuration/#per-pedalboard-overrides' | url }}) and [External MIDI routing]({{ '/using/configuration/#external-midi-routing' | url }})
- Configuring and assigning an expression pedal for [**Blend mode**]({{ '/using/configuration/#blend-mode' | url }})