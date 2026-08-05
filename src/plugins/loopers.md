---
title: Loopers
eleventyNavigation:
  parent: cat-instruments-looping
  key: loopers
  title: Loopers
  order: 3
---

# Loopers

If you want a live looper on the pi-Stomp, the LV2 catalogue has three real choices. **SooperLooper** is the LV2 port of Jesse Chappell's LADSPA single-loop engine — the Echoplex DNA, record/overdub/undo/redo. **ALO** is a six-loop rig with BPM sync and MIDI control. **Loopor** is a single-loop alternative with a stack-based undo history:

## Our pick: SooperLooper

<img src="{{ '/assets/images/plugin-looper-sooperlooper.png' | url }}" alt="SooperLooper" class="plugin-screenshot">

SooperLooper is the LV2 port of Jesse Chappell's LADSPA looper, packaged by the MOD team. Single loop, 400 s sample memory, 512-sample crossfade ramps at loop boundaries. The LV2 surface exposes 6 control ports: input, output, `play_pause`, `record`, `reset`, `undo`, `redo`, `dryLevel`. Undo pops a linked-list chunk; redo pushes one back. The underlying LADSPA plugin has ~20 control ports (multiply, insert, replace, scratch, rate, tap-tempo, quantize, round, multi-control, feedback, wet) — all unwired in the LV2 wrapper, all defaulted to graceful values. What you get is a clean record/overdub/undo/redo looper, not the full Echoplex feature set.

For a live guitar rig that is the right amount of feature. `dryLevel` follows the same log law as the mod-audio Mixer's volume (0 = −45 dB, 1 = 0 dB). CPU is one input multiply, one wet multiply, one output add, one buffer write per sample — ~5 ops/sample, cheap.

| Record | Play/Pause | Undo | Redo | DryLevel |
|--------|------------|------|------|----------|
| (momentary) | (momentary) | (momentary) | (momentary) | 1.0 |

Map `Record` and `Play/Pause` to footswitches; `Undo`/`Redo` to expression-pedal or second footswitch. The `sooperlooper-2x2` variant is the stereo build — same DSP, 10 ports (inL/inR/outL/outR + same 6 controls).

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Also great: ALO

<img src="{{ '/assets/images/plugin-looper-alo.png' | url }}" alt="ALO" class="plugin-screenshot">

ALO (Paul Sherwood) is a different shape of looper. Six fixed-length loops of 2.88 M samples (60 s at 48 kHz), always recording into a rolling buffer in the background. Pressing a loop button arms it; the loop's start point snaps to the next phrase boundary. In sync mode (Global BPM) the loop length is set by the `Bars` parameter; in free-running mode the first loop's recorded length sets the length for all six. Threshold detection triggers the actual record start. MIDI control: `MIDI Base` sets the lowest note; loops 1–6 are notes Base..Base+5.

Loop 6 is the special one: it outputs the loop while replacing it with the input signal, so if you feed the output back through an effect, that effect is applied each pass — the classic Frippertronics feedback path. Reset modes (0–3) control how and when loops are wiped. Click track at 880 Hz (downbeat) / 440 Hz (other beats). `Instant Loops` (0/3/6) makes loops stop/resume on button press rather than waiting for the loop boundary.

| Bars | MIDI Base | Reset Mode | Instant Loops | Click |
|------|-----------|------------|---------------|-------|
| 4 | 48 (C3) | 1 | 0 | off |

**What you give up:** ALO's reset is double-press, not an undo stack. There is no `Undo`/`Redo` — once a loop is overdubbed, the previous state is gone (modulo reset). You give up the Echoplex vocabulary and Jesse Chappell's specific DSP for a six-loop, BPM-synced, MIDI-driven rig with a click. Different use case, not a strict runner-up.

## Also considered

**Loopor** (Stevie, `stevie67/loopor`) is a single-loop live looper with threshold-triggered record, a stack-based undo/redo history, dub-on-dub continuous overdub, and double-press reset. Same single-loop territory as SooperLooper with a stack instead of a linked list under the undo. Zero occurrences in shared pedalboards — less usage data than SooperLooper — but a competent alternative if you prefer a stack semantics or want to hack the source (ISC license, small codebase).

**Audio File** (Carla, falkTX) is a sample player, not a looper. It will loop a file but does not record and does not tempo-match. Use it for backing tracks, not live looping.

**Record-Mono / Stereo / Quad** (brummer10's `screcord`) are file recorders that save wav/ogg to disk — capture only, with no looping or overdub facility.

**Neural Record** (brummer10) is a round-trip latency-measured capture plugin for AIDA-X / NAM training — plays `input.wav` and records `target.wav` in sync. Not a looper; a model-capture utility dressed as a recorder.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| SooperLooper | Jesse Chappell (DSP), MOD team (LV2 port) | GPL-2.0 | [essej.net/sooperlooper](http://essej.net/sooperlooper/oldplugin.html) |
| SooperLooper 2x2 | Jesse Chappell, MOD team | GPL-2.0 | [github.com/mod-audio/sooperlooper-lv2-plugin](https://github.com/mod-audio/sooperlooper-lv2-plugin) |
| ALO | Paul Sherwood | ISC | [github.com/devcurmudgeon/alo](https://github.com/devcurmudgeon/alo) |
| Loopor | Stevie | ISC | [github.com/stevie67/loopor](https://github.com/stevie67/loopor) |
| Audio File | falkTX | GPL-2.0+ | [github.com/falkTX/Carla](https://github.com/falkTX/Carla) |
| Record-Mono/Stereo/Quad | brummer10 | GPL | [github.com/brummer10/screcord](https://github.com/brummer10/screcord) |
| Neural Record | brummer10 | GPL | [github.com/brummer10/neuralrecord](https://github.com/brummer10/neuralrecord) |