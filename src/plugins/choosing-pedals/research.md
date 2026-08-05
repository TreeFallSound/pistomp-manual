---
title: Research a Rig
eleventyNavigation:
  parent: choosing-pedals
  key: choosing-pedals-research
  title: Research a Rig
  order: 1
---

# Research a Rig

Work out what each piece of the rig is doing musically, name a plugin for each job, and write it down. Nothing here needs the device switched on.

## Write the design down

You want an ordered list before you patch anything: what each box is doing musically, which plugin fills that job, roughly where it sits in the chain, and starting values. A written design is something you can argue with — and, later, something you can check the board against.

It's also your shopping list. Any slot the design fills with a capture or an impulse response is a file you don't have yet, and the design is what tells you which one to go find. Finish the design first, then go [collect the files]({{ '/plugins/choosing-pedals/stage/' | url }}).

## Start from the editorials, not the plugin list

`curl -s pistomp.local/effect/list` gets you 663 plugins with a name, a URI, a brand and a category each. Nothing in that list says a plugin ships at zero mix and sounds bypassed on load, or that two of the four compressors are the same DSP built twice.

The editorials carry that: twenty pages across [Gain & Drive]({{ '/plugins/gain-drive/' | url }}), [Amp & Tone]({{ '/plugins/amp-tone/' | url }}), [Delay & Reverb]({{ '/plugins/delay-reverb/' | url }}), [Modulation & Filter]({{ '/plugins/modulation-filter/' | url }}) and [Instruments & Looping]({{ '/plugins/instruments-looping/' | url }}), each ranked, with starting settings and chain position. "I want a warm analog delay" comes out of those as a named plugin with a mix and feedback value to start from. Use the [All Plugins]({{ '/plugins/all/' | url }}) table afterwards to confirm the plugin exists on your device and to see how often it turns up in real pedalboards.

## Name the role, not the pedal

"A loud, bright-to-brittle solid-state workhorse run clean as the top-and-mid voice" is a job three different plugins can fill. "An Acoustic 450B" is a dead end unless somebody captured one.

This works in reverse. If a chain says "use GxPlexi", ask what job GxPlexi is doing there; if there isn't an answer, that slot hasn't been designed yet.

**List every candidate before ranking any.** Filter [All Plugins]({{ '/plugins/all/' | url }}) by category and write the whole list down, then argue. Working from memory of a genre, it's easy to skip past a plugin named after the exact pedal you're chasing.

**Separate what you verified from what you assumed.** Bundle name, `doap:name`, and the circuit actually modeled are three different things — `GxSD1` does not model the SD-1's asymmetric clipping. If the design leans on a plugin modeling a particular circuit, that claim needs to come from the editorial or the source, not the name on the box.

## Decide whether the rig hinges on one specific amp

Two different designs come out of this, so settle it before you write the amp slot down.

If it does, the design says so by name — "a capture of an Acoustic 450B" — and finding one becomes a task in its own right. Oddball 70s solid-state heads have often been captured, so search before you assume otherwise.

If it doesn't, or if the search comes up empty, write the role instead and fill it with a conventional plugin. That's the substitution the section above buys you.

## Spend the CPU budget in one place

[Neural Amp Modeler]({{ '/using/nam/' | url }}) has the numbers: eight light-architecture instances on v3, up to four on v2; high-quality architectures drop that to three or four on v3 and none on v2.

One A2 Full capture of the amp the rig is built around beats four Lite ones scattered across the chain. Lite architectures give up the top end and the edge of break-up — how the amp responds when you dig in. Work out which box the sound lives in, put the good capture there, and cover the rest with conventional plugins.

The `Quality` control on the NAM plugin looks like a 0–1 knob but is a two-position switch: 0.5 and below is Lite, above is Full. It does nothing unless the loaded file is an A2 slimmable one carrying both sub-models. Set it to 0 or 1 so you can see which is running. [Amp, Cabinet, and Neural Capture]({{ '/plugins/amp-cab-sim/' | url }}) covers the architectures.

## Decide the routing questions out loud

Two questions come up in every two-amp design, and both are easy to get backwards while patching.

**Where does the boost go?** Before the split, a boost stands in for hot pickups — a property of the source, hitting everything downstream. After the split, on one path, it's a different pedal doing a different job: pushing one amp harder. Both are valid, and they give you different rigs.

**Which amps is that EQ driving?** Pre-split it's a global voicing move. Post-split it's per-amp.

Neither has a right answer. Record which one you picked in the design so you don't rewire the board later trying to remember.

With the design written, go [collect and stage the captures and IRs it calls for]({{ '/plugins/choosing-pedals/stage/' | url }}).