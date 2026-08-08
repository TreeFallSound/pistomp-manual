---
title: pi-Stomp Manual
eleventyNavigation:
  key: home-page
  parent: home
  title: Home
  order: 0
---

# pi-Stomp Manual

The complete guide to the pi-Stomp ecosystem: from building your first kit to building your own pedalboards, customizing your device, and contributing to the open-source project.

<img src="{{ '/assets/images/pi-stomp-v3-hero.png' | url }}" alt="pi-Stomp v3">

## In this manual

- **[About]({{ '/about/' | url }})** — The people and mission behind pi-Stomp
- **[AI Declaration]({{ '/ai-declaration/' | url }})** — How large language models were used to write this manual, and what that costs
- **[Product Overview]({{ '/product-overview/' | url }})** — The software stack and the three terms the rest of the manual uses
- **[Building]({{ '/building/' | url }})** — Obtaining hardware, assembly, and software installation
- **[Using]({{ '/using/' | url }})** — Navigation, pedalboards, plugins, MIDI, and configuration
- **[Maintenance]({{ '/maintenance/' | url }})** — Troubleshooting, performance tuning, backups, and recovery
- **[Developers]({{ '/developers/' | url }})** — Architecture, code structure, and contributing
- **[Plugins]({{ '/plugins/' | url }})** — Editorial reviews of the best open-source effects

<blockquote class="desktop-only"><p><strong>Spot a mistake?</strong> Select any text on a page and click <strong>Suggest edit</strong> to fix it straight on GitHub. See <a href="{{ '/developers/contributing/#editing-this-manual' | url }}">Editing this manual</a> for details.</p></blockquote>

## What is pi-Stomp?

pi-Stomp is a DIY high-definition multi-effects platform for guitar, bass, and keyboards.

Built on top of the Raspberry Pi, it runs 600+ open-source LV2 effects, Neural Amp Models (NAM), and 60+ synth/drum machine/sampler plugins, all controllable from the hardware front panel or a web browser. LV2 is the open plugin format the Linux audio world standardized on — the same role VST plays elsewhere — which is why there are so many effects to draw on and why anyone can write another.

You build pedalboards in a browser and play them from the floor. Setup needs a computer once; after that, none on stage.

| Version | Status | Pi | Build | Controls | LCD |
|---------|--------|----|-------|----------|-----|
| **v3** | [Current](https://treefallsound.com/opencart/index.php?route=product/product&product_id=64&search=kit) | Pi 5 | Solderless kit | 4 footswitches, 3 tweak encoders | 2.8" color TFT |
| **v2** | Supported | Pi 3/4 | Through-hole | Up to 5 footswitches, 1 encoder | Color TFT |
| **v1** | Unsupported | Pi 3 | Through-hole | 3 footswitches | Monochrome |

The current OS image does not run on v1 hardware — the software has no v1 class and exits on startup.

All pi-Stomp software is free open source (AGPL-3.0). Join us on [GitHub](https://github.com/TreeFallSound): we'd love to hear your feature requests / bug reports and welcome code contributions.

## About Tree Fall Sound

[Tree Fall Sound](https://treefallsound.com) exists to bring multi-effects projects to DIY musicians.

Founded by Randall Reichenbach, the pi-Stomp project is our passion: a high-quality, open, affordable multi-effects platform for the music community. Every kit is assembled, tested, and shipped by hand. Over 300 kits have been built in 25+ countries.

Learn more about the people behind pi-Stomp on the [About]({{ '/about/' | url }}) page.
