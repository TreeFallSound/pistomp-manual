---
title: Build Guide
eleventyNavigation:
  parent: building
  key: build
  title: Build Guide
  order: 3
---

# Build Guide

The pi-Stomp v3 kit requires no soldering. Assembly takes about 90 minutes with just a small Phillips head screwdriver (and a little patience).

Watch a builder walk through the full process:

<iframe src="https://www.youtube.com/embed/37ok2Kd75kM?start=781" title="pi-Stomp v3 build video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:6px;margin:1rem 0;"></iframe>

## Overview

The linked wiki pages have detailed instructions and photos for each step.

| Step | What you do | Time |
|------|-------------|------|
| 1 | [Add nylon spacers to the PCB](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_1pi-stomp_board_nylon_spacers) | 5 min |
| 2 | [Attach Active Cooler to the Pi](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_2prepare_the_pi) | 5 min |
| 3 | [Prepare the LCD](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_3prepare_the_lcd) | 5 min |
| 4 | [Attach LCD, audio card, and Pi to the PCB](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_4attach_boards) | 10 min |
| 5 | [Prepare the enclosure](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_5prepare_enclosure) | 5 min |
| 6 | [Mount the PCB into the enclosure](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_6mount_pcb_into_enclosure) | 10 min |
| 7 | [Connect footswitches](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_7connect_footswitches) | 5 min |
| 8 | [Add knobs](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_8add_knobs) | 2 min |
| 9 | [Flash the OS image](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_9install_the_software) | 20-30 min |
| 10 | [Attach bottom plate](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v3_build_instructions#step_10attach_bottom_enclosure_plate) | 2 min |

## Hardware reference

Kit hardware comes in labelled bags — `S6` for a 6 mm screw, `H15` for the 15 mm Pi spacer, and so on. Each wiki step names the IDs it needs, so keep the bags sorted and work from the step rather than memorizing the list.

## Common gotchas

- **LCD ribbon orientation** — only connect the top 8 pins of the LCD header. Connecting the wrong pins can damage the Pi or LCD.
- **Audio card alignment** — make sure the 3-pin sockets on both ends engage with the corresponding pins on the PCB.
- **Pi pins** — all 40 GPIO pins must engage fully. Rock the Pi gently into place.
- **LCD ribbon clearance** — you may need to flatten the ribbon cable before the bottom plate fits.
- **Footswitch connectors** — the Molex connectors are keyed; they only go in one way.

## First power-up check

Apply power. The LCD will light up immediately in pure white; your CPU fan will spin up for a moment; second afterwards, the first-boot sequence appears on the LCD screen. Your pi-Stomp will restart once and then land on a pedalboard shortly after: this entire initial step should take about one minute (subsequent starts are around 15s, growing with the number of LV2 effects you have installed).

| Check | What should happen |
|-------|--------------------|
| Navigation encoder | Turning it moves the highlight around the LCD; clicking a plugin block toggles its fill between enabled and bypassed |
| Footswitches A–D | Each toggles a plugin, changes the footswitch icon on the LCD, and lights its LED |
| Tweak 1 and Tweak 2 | Turning either opens a parameter dialog and moves the value; clicking closes it |
| Output | Plug headphones into the 3.5 mm jack or an amp into Out 1, play something in, and you should hear it |
| Input LEDs | Plug a cable into In 1 and touch the other end's tip — the corresponding LED should flicker |

If a footswitch or encoder does nothing, `ps-run --host test` gives you a per-control readout over SSH; see [Troubleshooting]({{ '/maintenance/troubleshooting/#hardware-debug-utility' | url }}). If the LCD stays blank or stuck on the logo, the controller service failed to start — that's [also in Troubleshooting]({{ '/maintenance/troubleshooting/#lcd-is-white-or-stuck-on-the-logo' | url }}), not a wiring fault.

## Next step

Once the hardware is assembled, [install the software]({{ '/building/software-install/' | url }}).
