---
title: Tremolo
eleventyNavigation:
  parent: editorials
  key: tremolo
  title: Tremolo
  order: 13
---

# Tremolo

Tremolo modulates amplitude. That is the whole effect, which is why the difference between a good one and a bad one is entirely in the shape of the modulation — how it rises, how it falls, and whether it does so symmetrically.

Two circuits do this in a way worth hearing. An **optical** tremolo passes the signal through a photocell lit by a lamp, and the lamp's thermal lag and the cell's memory round the LFO into something that breathes. A **bias** tremolo modulates the operating point of a gain stage, so the volume dips come with a change in distortion character — the throb is coloured, not just quieter. Every other tremolo on the device is an LFO multiplied against the signal: clean, correct, and characterless by comparison. Two plugins here model the circuits:

## Our pick: rkr OpticalTrem

<img src="{{ '/assets/images/plugin-trem-rkropticaltrem.png' | url }}" alt="rkr OpticalTrem" class="plugin-screenshot">

**rkr OpticalTrem** models the optical cell rather than the waveform. In Ryan Billing's source the LFO drives a lamp with an `lfo^1.9` turn-on curve; the lamp illuminates a CdS photocell (1 MΩ dark, 300 Ω lit, 100 kΩ parallel, 2.7 kΩ series); and the photocell's resistance sets the gain. The cell does not respond instantly and does not respond the same way rising as falling — its time constant is recomputed every sample from its own current state (`dRC = dTC·exp(stepl·minTC)`, `minTC = log(0.005/0.06)`), so the bright part of the sweep tracks faster than the dark part. That lag and that asymmetry are the sound. A raw LFO multiply cannot produce them at any setting.

The LFO itself is the full rakarrack set: sine, triangle, ramp up/down, zigzag, modulated square and saw, two Lorenz-fractal chaos modes, sample-and-hold, and two sine-triangle hybrids. Tempo is in BPM (the wrapper divides by 60, so 33 means one cycle every 1.8 s). An **Invert** toggle swaps the cell's series/parallel topology — `R1` jumps from 2.7 kΩ to 68 kΩ and the dark resistance halves — for a thinner, harder-edged chop. Two L/R-delay and panning controls let you push it into stereo auto-pan if you want, but at 0 pan and 0 delay it is a clean mono optical trem.

| Depth | Tempo | LFO Type | L/R Delay | Panning | Invert |
|-------|-------|----------|-----------|---------|--------|
| 90 | 24 | Sine | 0 | 0 | Off |

Place it after your drives and before time effects. The wet signal *is* the gain cell, so there is no dry/wet control and no risk of loading it bypassed — a common rakarrack trap that this plugin sidesteps.

## Also great: Gx Tube Tremolo

<img src="{{ '/assets/images/plugin-trem-gxtubetremelo.png' | url }}" alt="Gx Tube Tremolo" class="plugin-screenshot">

**Gx Tube Tremolo** is the bias-tremolo counterpart. Its Faust DSP runs the tremolo *inside* a 12AX7 preamp model — `amp = input12ax7 : *(tremolo) : output12ax7`, split across a four-band filter bank — so as the LFO cuts gain it shifts the tube stage's operating point, and the dips come back with a change in colour, not just volume. That is the sound of a vintage amp's bias trem, and it is the one plugin here that gets it. It shares the same vactrol model as GxTremolo (the `pow(_,1.9) : cds` lamp-and-cell chain) for its LFO, with the same lag and asymmetry, so the modulation shape itself has the optical feel on top of the bias-shift character.

**What you give up:** There is no LFO-type choice (sine or triangle only), no stereo, and no tempo marking. Speed is a 0.1–14 Hz knob with no BPM scale, so syncing to a click is by ear. Depth defaults to **0.0** — turn it up before judging.

| Speed | Depth | Gain | SineWave |
|-------|-------|------|----------|
| 5.0 | 0.6 | 0 | Triangle |

## Also considered

**GxTremolo** is the same vactrol model as the tube trem above, run as a clean amplitude tremolo with no tube stage. It gives you the optical-cell lag and asymmetry in a simple three-knob mono plugin, plus a sine/triangle Mode switch and a 0.1–50 Hz frequency range. If you want the optical sound without the bias-shift colouration, this is it. Dry/Wet defaults to 50, not 0. Use it when Gx Tube Tremolo is too coloured.

**TAP Tremolo** is Tom Szilagyi's straight amplitude tremolo — sine LFO, Frequency/Depth/Gain, nothing else. The Frequency port carries `mod:tapTempo`, so pi-Stomp's tap-tempo footswitch can drive it directly; that is the one thing it does that the optical plugins can't. No circuit model, no shape control. Clean and nearly free.

**Calf Pulsator** is a stereo amplitude/pan modulator with five LFO shapes (sine, triangle, square, saw up, saw down), per-channel phase offsets, a pulse-width control that runs ½-period to 8-period, and a **Host BPM** port wired for tempo sync. It is the most controllable tremolo here and the only one built for stereo from the ground up. It is also a pure LFO multiply — no lamp, no cell, no bias — so it sounds correct and flat next to the optical plugins. Reach for it when you need a precise stereo chop at a known BPM and the optical character is not the point.

**dRowAudio Tremolo** is a stereo tremolo with rate, depth, shape, and inter-channel phase. Its source is not public — the github `drowaudio` repo ships the JUCE library, not the LV2 wrapper — so the DSP is unverifiable. The TTL marks it Dynamics, not Modulator. Treat it as a generic LFO multiply until somebody reads it.

**Gx Switched Tremolo** is a different effect entirely: four sine oscillators at independent frequencies (Freq 0–3), switched between in a stepped pattern set by a 1–4 **Steps** control and a **Switch Freq**. It does not throb; it chops and reconfigures. Fun for arpeggiated textures and unpredictable stereo motion, not a tremolo in the vintage sense.

**rkr VaryBand** modulates the volume of four frequency bands (crossovers at 500/2500/5000 Hz, 2nd-order Butterworth, so the bands null at the crossovers — see research/17) with two independent LFOs. It is a multiband tremolo texturiser, not a single-throb effect, and its Wet/Dry defaults to **0** — turn it up before judging. Worth a sentence for the rhythmic shimmer it can give a clean chord; not a tremolo replacement.

**rkr Pan** is auto-pan, which is stereo tremolo with the LFO driving a panner instead of a gain cell. Same rakarrack LFO library, BPM tempo, optional "Extra Stereo" widening. If your tremolo goal is actually image motion, reach here; for a mono throb it is the wrong tool.

**rkr Ring** is a ring modulator, and a ring modulator at sub-audio carrier frequencies *is* a tremolo — multiplying by a sine below 20 Hz is amplitude modulation with no carrier bleed. Frequency goes 1–20000 Hz, so you can dial it down. It is the wrong tool for a musical tremolo (no optical character, no shape control beyond the four carrier waveforms, and at audio rates it is unmistakably a ring mod), but the family relationship is worth knowing.

**the infamous power cut** is not a tremolo at all. Spencer Jackson's source (`powercut.c`) is a tape-stop: on trigger it reads from a circular buffer at a decaying sample rate for a set number of seconds, then silence. Listed here because it modulates amplitude; reach for it for a one-shot slow-down, not a sustained throb.

**GxRedeye Vibro Chump** is a Fender-style amp sim with a tremolo built into the preamp — the same vactrol model again, switchable on a **Vibe** toggle. If you want the trem living inside an amp rather than as a standalone effect, this is the one. The amp colouration is the point; a clean trem it is not.

## What you give up

None of these plugins will fool anyone who owns the original optical-bias Fender amp they descend from. The optical model is one photocell, not a matched pair with a real bulb's thermal mass; the bias model is one 12AX7 stage, not a power-tube output section. What they give you is the *character* of those circuits — the lag, the asymmetry, the colour-on-dip — at a price of zero and a CPU cost that is invisible next to a reverb. CPU is not the constraint on any of these. The constraint is taste.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| rkr OpticalTrem | Ryan Billing / Josep Andreu | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| Gx Tube Tremolo | Guitarix team | ISC | [github.com/brummer10/guitarix](https://github.com/brummer10/guitarix) |
| GxTremolo | Guitarix team (vactrol model by Transmogrifox) | ISC | [github.com/brummer10/guitarix](https://github.com/brummer10/guitarix) |
| TAP Tremolo | Tom Szilagyi | GPL-2.0 | [tap-plugins.sig7.se](https://tomscii.sig7.se/tap-plugins/) |
| Calf Pulsator | Markus Schmidt / Calf Studio Gear | LGPL-2.1+ | [calf-studio-gear.org](https://calf-studio-gear.org/) |
| dRowAudio Tremolo | dRowAudio | unspecified | [drowaudio.co.uk](http://www.drowaudio.co.uk/) |
| Gx Switched Tremolo | Guitarix team | ISC | [github.com/brummer10/guitarix](https://github.com/brummer10/guitarix) |
| rkr VaryBand | Nasca Octavian Paul / Josep Andreu | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr Pan | Josep Andreu | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr Ring | Josep Andreu (from Steve Harris swh-plugins) | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| the infamous power cut | Spencer Jackson | GPL-2.0 | [github.com/ssj71/infamousPlugins](https://github.com/ssj71/infamousPlugins) |
| GxRedeye Vibro Chump | Guitarix team | ISC | [github.com/brummer10/guitarix](https://github.com/brummer10/guitarix) |