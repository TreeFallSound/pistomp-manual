---
title: Resources
eleventyNavigation:
  parent: using
  key: resources
  title: Resources
  order: 13
---

# Resources

## How pi-Stomp compares

pi-Stomp is a DIY platform, not a commercial product. If you want a polished, warranty-backed unit, buy a MOD Dwarf, HX Stomp, or Headrush. If you want to build something yourself and hack on it, pi-Stomp is the only open-source option at this level.

| | pi-Stomp v3 | MOD Dwarf | HX Stomp | Headrush MX5 |
|---|---|---|---|---|
| Audio | 24-bit 48–96 kHz | 24-bit 48 kHz | 24-bit 96 kHz | 24-bit 96 kHz |
| Plugins | 600+ (upgradeable) | 330+ (upgradeable) | 200 (fixed) | 107 (fixed) |
| Simultaneous | 12+ (CPU-dependent) | 12+ | 6 | 12 |
| Routing | Fully flexible | Fully flexible | Serial or 2 parallel | Serial or 2 parallel |
| MIDI | Optional DIN + USB | DIN in/out + USB | DIN in/out/thru | DIN in/out |
| Expression | Optional (up to 8 analog) | Yes | Yes | Yes |
| Footswitches | 4 (assignable) | 2 (assignable) | 3 (multi-mode) | 4 (multi-mode) |
| True bypass | Yes (ch 1) | Yes (relay) | Yes (relay) | No |
| LCD | 2.8" color TFT | 2x monochrome | Color | Color touch |
| WiFi | Built-in | Built-in | None | None |
| Software | Open source | Open source | Proprietary | Proprietary |
| Hardware | Hackable/upgradeable | Expandable via port | Fixed | Fixed |
| Cost (kit) | USD 299 | USD 550 | USD 650 | USD 599 |

## Community

- **[pi-Stomp Forum](https://treefallsound.com/forum/)** — discussions, builds, troubleshooting
- **[GitHub](https://github.com/TreeFallSound)** — source code, issues, feature requests
- **[Facebook](https://www.facebook.com/treefallsound)** — project updates and community builds
- **[Instagram](https://www.instagram.com/treefallsound/)** — build photos and videos
- **[Hackaday](https://hackaday.io/project/175863-pi-stomp-a-hi-def-multi-fx-platform-for-guitar)** — project documentation and history
- **[Pedal Haven](http://www.pedalhaven.com/pi-stomp-multi-effect-pedal)** — user review and build guide

## Video tutorials

- **[Cam Gorrie](https://www.youtube.com/@cswithcam)** — pi-Stomp build and use videos
- **[Hearthaven Studios](https://www.youtube.com/@HeartHavenStudios)** — pi-Stomp tutorials and demos

## Free NAM models and IRs

- **[Tone3000](https://www.tone3000.com/)** — thousands of free NAM amp, cab, and pedal models
- **[Tone Junkie](https://tonejunkie.com/)** — free and commercial NAM packs
- **[Studio Nord Bremen](https://stnrd.de/)** — free impulse responses
- **[Bricasti M7 IRs](https://www.yohng.com/software/bricasti.html)** — free reverb impulse responses
- **[Openair](https://www.openair.hosted.york.ac.uk/)** — open-source impulse response library
- **[Archaeoacoustics Scotland](https://www.archaeoacoustics.scot/)** — unique space impulse responses

## Plugin development

- **[MOD SDK](https://wiki.moddevices.com/wiki/MOD_SDK)** — build LV2 plugins for the MOD platform
- **[LV2 Plugin Format](https://lv2plug.in/)** — the open plugin standard used by pi-Stomp
- **[How to build and deploy an LV2 plugin](https://wiki.moddevices.com/wiki/How_To_Build_and_Deploy_LV2_Plugin_to_MOD_Duo)** — tutorial with Docker

## GitHub repositories

- **[pi-stomp](https://github.com/TreeFallSound/pi-stomp)** — main controller software and firmware
- **[pi-gen-pistomp](https://github.com/TreeFallSound/pi-gen-pistomp)** — OS image builder
- **[pistomp-recovery](https://github.com/TreeFallSound/pistomp-recovery)** — recovery and update service
- **[pi-stomp-pedalboards](https://github.com/TreeFallSound/pi-stomp-pedalboards)** — starter pedalboards
- **[mod-host](https://github.com/moddevices/mod-host)** — LV2 plugin host (by MOD Devices)
- **[mod-ui](https://github.com/moddevices/mod-ui)** — web interface (by MOD Devices)

## About Tree Fall Sound

Tree Fall Sound exists to bring multi-effects projects to DIY musicians.

### Randall Reichenbach

My day jobs have been in electrical and software engineering, but my main passion has always been music. I've been building effects pedals and other musical gadgets since the 1980s. I've always been obsessed with tone, usability, and clever features.

How cool would it be to create a do-everything open expandable effects platform, easily modifiable by anyone not too afraid of Linux and Python? That's the idea that got me rolling on this project. Raspberry Pi and high-def sound cards along with open-source software like LV2 and MOD have finally made such an endeavor possible.

I created this project because I know there are others like me that would be way more excited playing with a piece of gear they built and can modify by getting under the hood of the hardware and software. I spend well over 20 hours on it every week and will continue to as long as there is new functionality and features to explore. I'm hoping others will join us in this endeavor and take their creations to places we've not even imagined.

Stream some of my original music: [artists.landr.com/055120649103](https://artists.landr.com/055120649103)

An extensive interview and more pi-Stomp background: [Blokas Reads](https://blokas.io/reads/interview-pi-stomp/)

### Cam Gorrie

I'm a software developer based out of Canada and play a lot of bass guitar. Open-source pedals like the pi-Stomp have a special place in my heart; they make it possible to dial in incredible, reproducible sounds without paying a heavy cost (in time) whenever you want to change something structural.

## The environment

We love the Earth and hope you do too. Electronics are inherently not good for our planet. Our hope is that by building something yourself that can be upgraded, you'll be able to make use of it longer than you would have a commercial product, and that you might be able to reuse or recycle many of the components when its life is truly over.

- All pi-Stomp PCBs are Lead Free HASL RoHS compliant
- Any presoldered parts were soldered with Lead Free RoHS solder
- All board components are RoHS compliant

The only non-RoHS compliant components in the current design are the TFT color LCD and the audio card.

When you are done with your pi-Stomp, please consider using the Raspberry Pi, LCD, and other components for other projects or donating them to your local Makerspace. If you eventually dispose of your pi-Stomp components, please do so according to your local guidelines. Removing the non-RoHS parts to deal with them appropriately is encouraged.

treefallsound.com is hosted by [GreenGeeks](https://my.greengeeks.com/seal/). The carbon footprint is reduced (not offset) by matching every amp they pull from the grid with 3 times that in the form of renewable energy via Bonneville Environmental Foundation. They also plant one tree for every hosting account they provision.
