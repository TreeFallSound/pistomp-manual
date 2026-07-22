---
title: Playing Live
eleventyNavigation:
  parent: using
  key: playing-live
  title: Playing Live
  order: 5
---

# Playing Live

Everything on this page follows from one distinction.

## Snapshots change, pedalboards reload

A **pedalboard** is a saved audio graph; a **snapshot** is a saved set of parameter values within one pedalboard. See [Product Overview]({{ '/product-overview/' | url }}) for the terms. What matters on stage is the cost of switching between them.

Loading a pedalboard builds the audio graph: plugins are instantiated, ports are connected, buffers are allocated. That takes seconds, and the audio drops while it happens.

Changing a snapshot sets parameter values on plugins that are already running. Nothing is instantiated, nothing is reconnected, and the graph is never torn down. The change is immediate.

Because the graph survives, so does everything living inside it. Delay buffers keep their contents and reverb tails keep decaying straight through a snapshot change. A delay repeat that started in the verse will still be audible in the chorus, at the chorus's settings. There's no trails or spillover setting to enable — nothing is being destroyed, so nothing needs rescuing.

**Snapshots within a song. Pedalboards between songs.**

## When to make it a snapshot

A footswitch toggles one plugin. A snapshot sets every parameter at once.

If a change means one pedal on or off, use a footswitch. If it means two or more things move together — drive on *and* delay mix up *and* level boosted — that's a snapshot. Chasing three switches in the two beats before a chorus is how you arrive on the wrong sound.

The corollary matters as much: if you find yourself building a snapshot that differs from the last one by a single bypass, make it a footswitch instead and save the snapshot slot.

## A song in snapshots

One song, one pedalboard, three snapshots:

| Snapshot | Drive | Delay | Reverb | Level |
|----------|-------|-------|--------|-------|
| `VERSE` | bypassed | 1/8 dotted, low mix | small, low mix | reference |
| `CHORUS` | on, moderate | same time, mix up | mix up | matched to verse |
| `SOLO` | on, more gain | same time, feedback up | same | +3 dB |

Three things to notice.

The delay *time* never changes, only its mix. Keeping time constant across a song's snapshots means the repeats stay locked to the tempo through every transition, and the surviving tails from the previous section land in the right place.

Only `SOLO` changes level, deliberately. Verse and chorus sit at the same output so the chorus reads as bigger through arrangement and effects rather than volume.

The chain order is drive → modulation → delay → reverb. Put time-based effects after dirt: distorting a reverb tail smears it, while reverberating a distorted signal keeps the note definition and puts the space around it.

Name snapshots for what they are. `VERSE` and `BIG SOLO` are readable on a dark stage in a way `2` and `3` are not.

### Blending between them

If you want the transition itself to be musical rather than instant, `blend_snapshots` maps an expression pedal or tweak encoder across up to four snapshots and interpolates every parameter that differs between them. Six curves shape how the sweep feels — `smooth` for expressive middles, `snap` to hold near the start and jump late. See [Configuration]({{ '/using/configuration/#blend-mode' | url }}).

## Matching levels across snapshots

The most common way a snapshot change sounds wrong is a volume jump nobody intended.

Set every snapshot's output to the same level except where a change is the point. Play the same phrase, switch between snapshots, and listen for the step. Engaging a drive usually adds level even at unity settings, so pull its output down until bypassing it is inaudible except in character.

Do this before you tune anything else. Every judgement you make about how much reverb a chorus needs is a judgement about balance, and it's wrong if the two snapshots aren't level-matched.

A dedicated gain plugin at the end of the chain gives you one parameter per snapshot to trim, which is easier than rebalancing three pedals. The [global EQ]({{ '/using/audio-midi/#global-eq' | url }}) is the other half of this: it sits outside your pedalboards, so use it for the room, not for the song.

## Footswitches and snapshots can disagree

A footswitch toggles a plugin. A snapshot also sets that plugin's bypass state. When both control the same plugin, the switch's meaning depends on which snapshot you're in — press it after a snapshot that already enabled the plugin and you turn it off.

Decide per plugin which one owns it. Either a plugin is footswitch territory and no snapshot touches it, or it belongs to the snapshots and no switch is bound to it.

Blend mode already works this way: parameters driven by footswitch MIDI CCs are excluded from interpolation, so a blend never fights a switch.

## Setlists and banks

Two ways to organize a set:

| Approach | Works when |
|----------|-----------|
| One pedalboard per song, snapshots for sections | Songs need genuinely different rigs |
| One pedalboard for the set, snapshots per song | Songs share a core sound |

The second avoids load gaps entirely and is worth reaching for when you can. The first is unavoidable when two songs need different plugins.

A **bank** is an ordered subset of pedalboards — see [MOD-UI]({{ '/using/mod-ui/#banks' | url }}) for how to create one. Build one per set, sequenced to match the running order, so advancing a pedalboard moves you to the next song rather than into an alphabetical list. Open the System Menu and choose **Bank Select** to activate a bank on the LCD.

Bind `next_pedalboard` to a long-press so that a song change is one deliberate gesture. Keep it off short presses, where a mistake costs you seconds of silence.

## On stage

**Tuning.** Long-press footswitch C for the tuner, and click the Navigation encoder to mute while it's open. Muted tuning between songs is silent to the room.

**Tempo.** Long-press footswitch D for tap tempo. It sets from the second tap and averages the last four intervals, so four taps beats two. Taps under 40 BPM are ignored. Save the tempo with the pedalboard — System Menu → **Pedalboard Management** → **Save current pedalboard** — and every tempo-synced delay recalls it with the song.

If something else is keeping time, set the clock source to Ableton Link or MIDI Clock Slave in the [Audio & MIDI menu]({{ '/using/audio-midi/#clock-source' | url }}) and stop tapping.

**Expression.** One pedal covers wah, volume swells, and blend sweeps depending on what it's bound to. With `autosync: true` it transmits its physical position on every pedalboard load, so the sound matches where your foot actually is instead of jumping when you first move it.

**Seeing the stage.** Footswitch labels and colors on the LCD follow the current state, and the v3 LED strip carries the same information at floor level where you can see it without looking up.

## Latency

Latency comes from the JACK buffer: `period × nperiods ÷ sample rate`.

| Board | Period | Buffer latency | Equivalent air |
|-------|--------|---------------|----------------|
| Pi 5 (v3) | 128 frames | 5.3 ms | 1.8 m |
| Pi 3/4 (v2) | 256 frames | 10.7 ms | 3.7 m |

Both at the shipping default of 2 periods and 48 kHz. Sound travels about 34 cm per millisecond, so the right-hand column is how far from your cabinet the same delay would put you.

Halving the period halves the latency and doubles how often the CPU must deliver a buffer on time. Miss one and you get an XRUN — an audible click. The period is the only latency control worth touching; see [Performance]({{ '/maintenance/performance/' | url }}) for changing it and for reading XRUN counts.

Heavier chains need a longer period. Raise it when XRUNs appear under the chain you actually play, not preemptively.
