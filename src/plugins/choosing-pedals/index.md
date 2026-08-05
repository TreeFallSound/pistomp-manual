---
title: Choosing Pedals
eleventyNavigation:
  key: choosing-pedals
  parent: plugins-section
  title: Choosing Pedals
  order: 1
---

# Choosing Pedals

You've got a sound in your head and 663 plugins on the device. Closing that gap is mostly research.

## Prerequisites

Four pages take you from a sound to a saved board, and all of it is `curl`, `scp` and MOD-UI. Designing the chain and picking captures needs only the [editorials]({{ '/plugins/' | url }}), the [All Plugins]({{ '/plugins/all/' | url }}) table and your ears; everything after that needs the device on the network and SSH access to it.

| Phase | Device needed? | Why |
|-------|----------------|-----|
| [Research a rig]({{ '/plugins/choosing-pedals/research/' | url }}) — pick plugins, design a chain | No | Runs off the editorials and [All Plugins]({{ '/plugins/all/' | url }}) |
| [Find and audition captures]({{ '/plugins/choosing-pedals/stage/#find-and-audition' | url }}) the design calls for | No | You do this with your ears, on whatever machine you download to |
| [Stage your `.nam` and IR files]({{ '/plugins/choosing-pedals/stage/#where-the-files-go' | url }}) | Yes | `scp` into `user-files` |
| [Confirm what you've got installed]({{ '/plugins/choosing-pedals/verify/#confirm-the-plugin-is-installed' | url }}) | Yes, ideally | `/effect/list` is the truth; `plugins.json` is a snapshot of a stock image |
| [Get exact port symbols and property URIs]({{ '/plugins/choosing-pedals/verify/#pull-the-plugin-descriptor' | url }}) | Yes | Only `/effect/get` knows them |
| [Build and save the board]({{ '/plugins/choosing-pedals/build/' | url }}) | Yes | MOD-UI's HTTP and WebSocket API |

You can design a chain out of documentation, but you can't guess a port symbol. `GxCrybabyGCB95` has a wah control and its symbol isn't `wah`. Once you cross from designing into building, the device is the authority.

[LLMs and Pedalboards]({{ '/plugins/choosing-pedals/llms/' | url }}) covers running the same four steps through a coding agent, and where a model gets each one wrong.

## What sounds can I make?

Some targets are a documentation problem and some are a listening problem. Worth knowing which you're chasing before you start.

| Sound | What carries it | How hard |
|-------|-----------------|----------|
| Late-60s fuzz into a cranked stack | Germanium fuzz into an amp pushed way past clean — `GxFuzzFaceJH-2` into `GxPlexi` | Easy. The plugins model those exact circuits and are named after them |
| 70s dub | Delay feedback, filter sweeps, spring reverb. The tone's in your hands, not the chain | Easy chain, hard playing. Get the delay right and put feedback on a footswitch |
| 90s alt-rock wall | A Big Muff variant, chorus, a cabinet. `Open Big Muff` is a real circuit model | Easy |
| Shoegaze | Reverse delay, shimmer, stacked modulation. The order matters more than any one plugin | Medium. The [shimmer]({{ '/plugins/shimmer-cloud-reverb/' | url }}) and [glitch delay]({{ '/plugins/glitch-granular-delay/' | url }}) editorials do most of the work |
| One particular player's one particular amp | A NAM capture of that amp. Usually somebody's done it | Medium, and you have to do it yourself |

The first four you can settle from the editorials. The last one you settle by listening: the search usually turns up captures, and you judge which is right.

Start with [Research a rig]({{ '/plugins/choosing-pedals/research/' | url }}).
