---
title: Ordering Parts
eleventyNavigation:
  parent: building
  key: ordering-parts
  title: Ordering Parts
  order: 1
---

# Ordering Parts

## How pi-Stomp compares

pi-Stomp is a DIY platform, not a commercial product. If you want a polished, warranty-backed unit, buy a MOD Dwarf, HX Stomp, or Headrush. If you want to build something yourself and hack on it, pi-Stomp is the only open-source option at this level.

| | pi-Stomp v3 | MOD Dwarf | HX Stomp | Headrush MX5 |
|---|---|---|---|---|
| Audio | 24-bit 48–96 kHz | 24-bit 48 kHz | 24-bit 96 kHz | 24-bit 96 kHz |
| Plugins | 600+ (upgradeable) | 330+ (upgradeable) | 200 (fixed) | 107 (fixed) |
| Simultaneous | 12+ (CPU-dependent) | 12+ | 6 | 12 |
| Routing | Fully flexible | Fully flexible | Serial or 2 parallel | Serial or 2 parallel |
| MIDI | Optional DIN + USB | DIN in/out + USB | DIN in/out/thru | DIN in/out |
| Expression | Optional (1 jack) | Yes | Yes | Yes |
| Footswitches | 4 (assignable) | 2 (assignable) | 3 (multi-mode) | 4 (multi-mode) |
| True bypass | No (codec routing) | Yes (relay) | Yes (relay) | No |
| LCD | 2.8" color TFT | 2x monochrome | Color | Color touch |
| WiFi | Built-in | Built-in | None | None |
| Software | Open source | Open source | Proprietary | Proprietary |
| Hardware | Hackable/upgradeable | Expandable via port | Fixed | Fixed |
| Cost (kit) | USD 299 | USD 550 | USD 650 | USD 599 |

## v3 Kit (recommended)

The [pi-Stomp v3 kit](https://treefallsound.com/opencart/index.php?route=product/product&product_id=64) costs USD 299 and includes everything needed to build a working unit:

- pi-Stomp v3 PCB (pre-soldered)
- Custom aluminum enclosure
- Raspberry Pi 5 (2GB) with Active Cooler
- IQAudio Codec Zero audio board
- 2.8" TFT LCD (240x320) with ribbon cable
- 4 footswitches with pre-wired connector
- 4 soft touch knobs
- Nylon and metal hardware
- 32GB micro SD card (Class 10)
- 27W USB-C power supply

No soldering required. A small Phillips screwdriver is the only tool needed.

### Optional: MIDI + Expression Add-On Kit

The [MIDI+Expression Add-On Kit](https://treefallsound.com/opencart/index.php?route=product/product&product_id=67) (USD 22) adds 1/8" (3.5mm) TRS MIDI input and output jacks plus a 1/4" expression pedal input. It connects to the pi-Stomp via a 5-wire ribbon cable.

This add-on is only available with a kit order. It requires soldering and drilling the enclosure (a drill template is included).

USB-MIDI works out of the box on all four Pi USB ports — this add-on is only needed for traditional DIN MIDI or expression pedal support.

### Optional deductions

You can order without certain components if you already have them:

| Deduction | Savings |
|-----------|---------|
| Without Raspberry Pi | -USD 50 |
| Without Active Cooler | -USD 8 |
| Without 27W power supply | -USD 11 |

### Shipping

Free shipping within the US. Kits typically ship the Thursday following the order. International customers are responsible for customs and import taxes.

## v2 Core / DIY

The pi-Stomp Core v2 board is no longer sold. If you already have one, the build requires through-hole soldering and sourcing your own components (Pi 3/4, enclosure, audio card, LCD, etc.). Those builds are documented on the old wiki, which this manual does not duplicate:

| Wiki page | What's on it |
|-----------|--------------|
| [pi-Stomp Core v2](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_core) | Landing page for everything v2 |
| [Core build instructions](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_core_build_instructions) | Full through-hole assembly, step by step |
| [Full bill of materials](https://www.treefallsound.com/wiki/doku.php?id=full_bill_of_materials) | Every part with supplier links |
| [Enclosure considerations](https://www.treefallsound.com/wiki/doku.php?id=enclosure_considerations) | Which Hammond 1590 sizes fit, LCD mounting options, drill template PDF |
| [Customization guide](https://www.treefallsound.com/wiki/doku.php?id=customization_guide) | Wiring the analog and switch expansion headers, direct GPIO, swapping the audio card, balanced I/O, GPIO pinouts for v2 and v3 |
| [pi-Stomp v1](https://www.treefallsound.com/wiki/doku.php?id=pi-stomp_v1) | The original build, unsupported by current software |

The MIDI + Expression add-on is a soldered kit for both v2 and v3; its assembly and the v3 drill template live on the [breakout board build page](https://www.treefallsound.com/wiki/doku.php?id=midi_expression_breakout_board_build_instructions).

### Using a different Raspberry Pi

The v3 board takes any "B" form-factor Pi 3, 4, or 5. A Pi 4 or a CM4 on a B-form carrier works; a Pi 3 will run out of CPU quickly. The Pi 5 is what the shipped JACK defaults are tuned for and what you want if you plan to run NAM or convolution.
