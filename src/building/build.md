---
title: Build Guide
eleventyNavigation:
  parent: building
  key: build
  title: Build Guide
  order: 2
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

## Next step

Once the hardware is assembled, [install the software]({{ '/building/software-install/' | url }}).
