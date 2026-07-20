---
title: Control Voltage
eleventyNavigation:
  parent: using
  key: control-voltage
  title: Control Voltage
  order: 10
---

# Control Voltage

Control voltage is how modular synths move knobs without hands. A signal — an envelope, an LFO, a clock, a random walk — travels down a cable and becomes an input parameter for some other part of the pedalboard.  pi-Stomp ships MOD's full CV toolkit, so you can build modulation that no single plugin offers: gain that sags after a hard attack, a filter that opens on the third beat of every bar, a delay that ducks itself.

The CV here is entirely internal, as pi-Stomp has no CV jacks on the enclosure.

## How it works

CV routing is two separate steps, and this trips people up.

| Step | Where | What it does |
|------|-------|--------------|
| Patch | Pedalboard canvas | Drag a cable from one plugin's CV output to another's CV input. Orange cables, same as audio cables otherwise. |
| Address | Plugin control | Point a control knob at a CV port, so the voltage drives the knob. |

The second step needs the CV port registered first. Click **Manage CV Ports** in the top bar of the pedalboard constructor — a checkbox appears next to every CV output jack on the canvas. Tick the one you want and give it a name. That name now shows up in the addressing dialog.

To address a control: click the plugin's knob, choose **Control Voltage** as the addressing type, pick your named CV port, and save. Under **Advanced**, the Range min/max sets how far the knob travels.

### Voltage ranges

MOD's CV ports declare a −5 V to +5 V range. The addressing dialog offers three operational modes, and picking the wrong one wastes most of your travel:

| Mode | Range | Use when |
|------|-------|----------|
| − Unipolar | −10 to 0 V | Your source only goes negative |
| Bipolar | −5 to +5 V | Raw LFOs, raw audio, anything centred on zero |
| + Unipolar | 0 to +10 V | Rectified envelopes, gates, clocks |

## What's on the device

Every one of these ships in the image. They're all a few arithmetic operations per sample — you can stack a dozen without touching the audio budget.

| Plugin | Role |
|--------|------|
| Audio to CV | Audio in, CV out. Scales by Level, adds Offset. **Passes the raw waveform** — it is not an envelope follower. |
| CV ABS | Rectifies. `fabs()` on every sample. This is what turns a waveform into something envelope-shaped. |
| Slew Rate Limiter | One-pole smoothing with independent RiseTime and FallTime, 0.1–1000 ms each. This is your envelope's attack and decay. |
| Attenuverter Booster | Multiply (−10 to +10, so it inverts) and offset. Exponential mode squares the multiplier. |
| CV Parameter Modulation | Base value plus signed depth (−200 to +200), as an alternative to addressing with a min/max range. |
| CV Range Divider | Splits an incoming range across two outputs. |
| CV Round | Quantises to steps. |
| CV Gate, CV Clock | Threshold gate and tempo pulse. |
| Random Generator | Sample-and-hold randomness. |
| CV Switchbox 1-2, 1-3, 2-1, 3-1 | Route one source to several destinations, or pick between sources. |
| CV meter | Look at what your voltage is actually doing. Use this while patching. |
| Logic Operators | Boolean combination of two CV inputs. |
| Control to CV | Turn a static knob value into a voltage. |
| MIDI to CV mono/poly | Note pitch as 1/12 V per semitone, plus gate. |
| AudioToCV Pitch | Pitch tracking to CV. |
| AMS Envelope, AMS LFO2, AMS VCA, AMS VCF, AMS VCO3 | AlsaModularSynth modules — a full synth voice if you want one. |

Patch **CV meter** in parallel with anything you're building. Voltage that looks right on paper is often two orders of magnitude off in practice, and the meter turns twenty minutes of guessing into ten seconds of looking.

## Building an envelope

There is no envelope follower plugin. You build one, and it takes three blocks:

```
audio ─► Audio to CV ─► CV ABS ─► Slew Rate Limiter ─► (envelope)
```

Audio to CV hands you the waveform at CV rate. CV ABS folds the negative half up. The Slew Rate Limiter does the actual envelope work: RiseTime sets how fast the envelope chases an attack, FallTime sets how long it hangs on afterwards. Short rise and long fall gives you a classic follower — a few milliseconds up, a few hundred down.

Skipping CV ABS is the common mistake. Slew-limiting a bipolar waveform gives you a smeared waveform, not an envelope.

### Worked example: bias collapse

A starved or misbiased fuzz sags when you hit it hard. The transistor's operating point drops, the gain falls out from under the note, and the decay splutters and gates. No plugin on the device models this, but the envelope can fake it convincingly.

The trick is that the gain has to move *opposite* to the envelope, and recover slowly.

Six blocks on the canvas. The input splits: one audio cable carries the sound, the other feeds the sensing chain.

```
  AUDIO INPUT          ┌───────────────────────────┐         AUDIO OUTPUT
 ┌───────────┐         │       GxSupersonic        │        ┌────────────┐
 │           │         │                           │        │            │
 │ capture_1 ○────┬───►○ in                  out ○─┼───────►○ playback_1 │
 │           │    │    │                           │        │            │
 └───────────┘    │    │  VOL  BASS  TREBLE  GAIN  │        └────────────┘
                  │    └───────────────────────╥───┘
                  │                            ║
    ┌─────────────┘                            ║ 
    │                                          ║══════════════════════════════
    ▼                                                                         ║
 ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   ║
 │ Audio to CV  │  │   CV ABS     │  │  Slew Rate   │  │  Attenuverter    │   ║
 │              │  │              │  │   Limiter    │  │    Booster       │   ║
 │ ○ AudioIn    │  │ ○ CVin       │  │ ○ CVIn       │  │ ○ CVin           │   ║
 │              │  │              │  │              │  │                  │   ║
 │      CVout ○─┼─►┼─ CVout1 ○────┼─►┼─ CVout ○─────┼─►┼─ CVout1 ○ ═══════════╝
 │              │  │              │  │              │  │           ☑ Bias │
 │ Level  2.0   │  │              │  │ Rise    5 ms │  │ Mult        −2.0 │
 │ Offset 0.0   │  │              │  │ Fall  400 ms │  │ Offset     +10.0 │
 └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘

  ───►  audio cable      ─►  CV cable      ═══  addressing (no cable)
```

The Attenuverter's `CVout1` is the one you tick under **Manage CV Ports**; the diagram names it "Bias". Nothing plugs into GxSupersonic — the last hop is an addressing, which is why the drive has no CV input jack and doesn't need one.

| Plugin | Control | Value | Why |
|--------|---------|-------|-----|
| Audio to CV | Level | 2.0 | Enough swing to work with; check on the meter |
| Slew Rate Limiter | RiseTime | 5 ms | Envelope catches the pick attack |
| Slew Rate Limiter | FallTime | 400 ms | Gain stays collapsed through the decay |
| Attenuverter Booster | Multiplier | −2.0 | Inverts: loud in, low voltage out |
| Attenuverter Booster | Offset | +10.0 | Puts the resting voltage at the top of the range |

Address GxSupersonic's **GAIN** to the "Bias" port, + Unipolar, with the Advanced range set to 0.30–0.70. Silence leaves the Attenuverter at +10 V, which is the top of the range and GAIN 0.70. A hard attack drives it toward 0 V and GAIN 0.30. Hit a chord and the drive ducks, then crawls back as the note dies — the note eats its own gain.

FallTime is the control that matters. Under 200 ms it reads as a compressor. Past 600 ms it stops recovering between notes and just sounds quiet. The splutter lives in between.

## One writer principle

You cannot control a parameter both with CV and with an analog controller. Decide which you want to drive directly, and which you want driven by control voltage.
