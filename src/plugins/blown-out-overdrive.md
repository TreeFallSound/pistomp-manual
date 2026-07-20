---
title: Blown-Out Overdrive
eleventyNavigation:
  parent: editorials
  key: blown-out-overdrive
  title: Blown-Out Overdrive
  order: 10
---

# Blown-Out Overdrive

Some overdrives are polite. This is the opposite — an op-amp circuit that stays articulate under heavy gain, with asymmetric clipping that gives rich even harmonics and a gnarly, blown-out character that somehow keeps chords clear. The closest LV2 match is a power-amp model that shares the same core voice.

## Our pick: GxSupersonic

<img src="{{ '/assets/images/plugin-fuck-supersonic.png' | url }}" alt="GxSupersonic" class="plugin-screenshot">

**GxSupersonic** models the push-pull 6L6 output stage of a Fender SuperSonic amp — an op-amp-driven clipper with two distinct lookup tables for the positive and negative halves. Because the tables aren't mirror images, the clipping is asymmetrical, producing the same rich even-harmonic saturation that makes this style of overdrive so distinctive. Crank the gain and it stays articulate — chords don't turn to mush.

The plugin's four ports are GAIN (exponential drive into the clipper, mapped `0.0011·(exp(2·g)−1)`), BASS and TREBLE (tone-stack IIR coefficients, defaults 0.5), and VOLUME (post-clip gain, default 0.25). GAIN is the only one that touches the clipper's drive — the blown-out voice lives at the top of its range.

| GAIN |
|------|
| 0.95 |

GAIN 0.95 puts the linear drive at ≈0.0073 into the asymmetric tables; the default 0.15 is ≈0.0003 and reads as nearly clean. BASS/TREBLE at 0.5 and VOLUME to taste. Pair it with a gentle high-pass ahead of it in the chain (the original circuit rolls the low end before the clipper) and a touch of post-EQ to shape the midrange. No plugin on the device gives you the bias-collapse gating artefact directly, but you can build it: an inverted envelope driving GAIN makes the note eat its own gain as it decays. See [Control Voltage]({{ '/using/control-voltage/#worked-example-bias-collapse' | url }}) for the patch.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Also great: GxAxisFace

<img src="{{ '/assets/images/plugin-fuck-axisface.png' | url }}" alt="GxAxisFace" class="plugin-screenshot">

**GxAxisFace** is a silicon Fuzz Face derivative — single-ended NPN transistor fuzz, not op-amp. Its symmetric clipping produces mostly odd harmonics, so it's less articulate on chords than GxSupersonic, but it's gnarly and aggressive in the right register.

**What you give up:** Less chord clarity under heavy gain. The ATTACK and SMOOTH controls shape the tone filter, not the clipper's operating point — so you can't dial in the same blown-out-but-clear character. Use it when you want vintage fuzz aggression rather than op-amp saturation.

## Also considered

**CollisionDrive** is a well-engineered Tube Screamer derivative — tight, middy, articulate, a "metal tightener." It's the opposite of what you want here: it's the pedal this style was deliberately designed *not* to sound like.

**GxFenderizer** is a Fender solid-state amp sim — clean-to-crunch, polite, tube-style symmetric soft clip. It's what you'd put *after* this overdrive, not in its place.

**Freakclip** is a hard clipper with a one-pole high-pass difference and brickwall threshold. It lacks analog modelling, op-amp topology, or transistor character — just buzzy, static intermodulation that destroys chord clarity. Avoid.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| GxSupersonic | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| GxAxisFace | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| CollisionDrive | Guitarix team | ISC | [github.com/brummer10/CollisionDrive](https://github.com/brummer10/CollisionDrive) |
| GxFenderizer | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Freakclip | Pjotrompet | GPL-2.0+ | [github.com/pjotrompet/Freaked](https://github.com/pjotrompet/Freaked) |
