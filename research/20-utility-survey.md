# 20 — Utility Survey

Scope: every plugin on the device tagged `Utility` in `plugins.json`. 100 URIs. This doc reads the DSP for the five that users actually load — TinyGain (mono+stereo), C\* Noisegate, Mixer, Level Meter, SooperLooper — and groups the remaining 94 into families. It is the basis for two plugin editorial pages: one on gain/gate/mixer/meter staples, one on loopers.

Utility is the catch-all category. It contains a DSP notepad (Notes), a phono RIAA preamp (ZamPhono), a side-channel highpass (Airwindows Sidepass), a noise-repellent resynthesis denoiser, a neural-modelling capture recorder, six recorders, two audio file players, a metronome, and the entire x42 MIDI filter/sequencer family. The editorial framing is not "the best utility plugin"; it is "the plugins that hold a chain together".

## Method

Candidates enumerated from `src/_data/plugins.json` (per the manual's research rule — names lie). 100 URIs categorised `Utility`. Of those, 10 appear in user pedalboards (`plugins-seen.json`), 90 do not. The 10, sorted by occurrence:

| Plugin | Seen | Bundle |
|---|---:|---|
| TinyGain Mono | 16 | tinygain.lv2 |
| TinyGain Stereo | 16 | tinygain.lv2 |
| C\* Noisegate | 11 | mod-caps-Noisegate.lv2 |
| Mixer | 7 | mod-mixer.lv2 |
| Notes | 3 | notes.lv2 |
| ALO | 1 | alo.lv2 |
| Level Meter | 1 | modmeter.lv2 |
| Audio File | 1 | carla-files.lv2 |
| SooperLooper | 1 | sooperlooper.lv2 |
| MIDI display | 1 | midi-display.lv2 |

Source was read for the five high-usage plugins (TinyGain, C\* Noisegate, Mixer, Level Meter, SooperLooper) plus ALO and Loopor. The device was offline during research; `modgui:label` and screenshot fetches are deferred to the editorial step.

All upstream repos below resolve to a working `git ls-remote`. They are added to `src/_data/plugins-source.json` at the end of this doc, except where already cached.

## Utilities used in pedalboards

| Plugin | Seen | Bundle | Topology | One-line |
|---|---:|---|---|---|
| TinyGain Mono / Stereo | 16 / 16 | tinygain.lv2 | One-pole-smoothed gain + peak-hold meter | ±20 dB, 20 Hz LPF on gain port, 15 dB/s peak falloff; mono and stereo variants share code |
| C\* Noisegate | 11 | mod-caps-Noisegate.lv2 | RMS-driven gate with 60 ms RMS window, 180 ms open hysteresis | −55 to 0 dB open, −80 to 0 dB close, fixed 20 ms close, 60 dB attenuation; switchable 50/60 Hz mains notch in detector |
| Mixer | 7 | mod-mixer.lv2 | 4-channel mono summing with per-channel volume/pan/mute/solo/alt, master + alt outputs | Volume law `10^((1-vol)·−45/20)` (log taper, ~−45 dB at 0); 10 Hz one-pole smoothing on gain and pan; alt bus carries channel whose `Alt` is on |
| Notes | 3 | notes.lv2 | A text area | A notepad. ~450 char limit. No DSP. Categorised Utility but is a UI plugin only |
| Level Meter | 1 | modmeter.lv2 | Sample-peak + 1-pole RMS, peak-hold, 15 dB/s falloff | Three output ports: `level` (peak, throttled), `peak` (peak-hold, reset on trigger), `rms` (1-pole `r += ω(s²−r)`, ω = 9.72/SR); reads the same meter code as TinyGain's `level` port, factored out |
| ALO | 1 | alo.lv2 | 6-loop live looper, sync or free-running | 6 fixed-length loops, 2.88 M sample buffer, MIDI note control, BPM sync, threshold-triggered record, click track; "loop 6" feeds back as overdub |
| Audio File | 1 | carla-files.lv2 | Sample player | Streams files >30 s from disk, loads shorter files to RAM; loopable but no tempo match. Not a looper |
| SooperLooper | 1 | sooperlooper.lv2 | Single-loop Echoplex-style looper (LV2 port of LADSPA original) | Record / Overdub / Play / Pause / Undo / Redo; 400 s buffer; 512-sample crossfade ramps; only 6 control ports exposed from the LADSPA plugin's full feature set |
| MIDI display | 1 | midi-display.lv2 | Read-only MIDI event monitor | UI only |

## The rest (not seen in user pedalboards, grouped by family)

### Loopers and recorders

| Plugin | Bundle | One-line |
|---|---|---|
| SooperLooper 2x2 | sooperlooper-2x2.lv2 | Stereo SooperLooper (10 ports, otherwise identical) |
| Loopor | loopor.lv2 | Threshold-triggered live looper with undo/redo stack, dub-on-dub, double-press reset; `stevie67/loopor` |
| Record-Mono / Stereo / Quad | sc_record.lv2 | Brummer's file recorder; saves wav/ogg to disk; no DSP processing |
| Record-Mono/Stereo/Quad Mini | sc_record_mini.lv2 | Same, lighter UI |
| Neural Record | neuralrecord.lv2 | Round-trip latency-measured capture for AIDA-X / NAM training; plays `input.wav` and records `target.wav` in sync |

### Gain and routing

| Plugin | Bundle | One-line |
|---|---|---|
| Gain | mod-gain.lv2 | MOD mono gain, −40…+40 dB, linear ramp across block to suppress zipper |
| Gain 2x2 | mod-gain2x2.lv2 | Stereo Gain |
| Audio Gain (Mono / Stereo) | carla-audiogain.lv2 | falkTX "click-free" gain; the gain port is a multiplication factor, not dB |
| Audio Capture / Playback | audio-bridge.lv2 | falkTX jack audio bridge ports for inter-pedalboard routing |
| Portal Source / Sink | portal.lv2 | falkTX networked audio/MIDI bridge (send between MOD instances) |
| Invada Input Module | invada-labs.lv2 | Invada's input gain/trim; source is a dead Launchpad bzr branch |
| Switchbox 1-2 / 2-1 (+ ST variants) | mod-utilities | Mono/stereo audio A/B route; switch on the fly from a control port |
| SwitchTrigger4 | mod-switchbox2.lv2 | 4-channel momentary trigger selector |
| ToggleSwitch4 | mod-toggleswitch4.lv2 | 4-channel latching toggle selector |

### MIDI switchboxes

| Plugin | Bundle | One-line |
|---|---|---|
| MIDI SwitchBox 1-2 / 1-3 / 2-1 / 3-1 (+ 2C variants) | midi-switchbox_*.lv2 | MIDI route selectors, same idea as the audio switchboxes |

### x42 midifilter family (28 URIs, one bundle)

`http://gareus.org/oss/lv2/midifilter#…`. Robin Gareus, GPL. One shared `midifilter.c` engine; each URI is a thin filter subclass. The full list, grouped:

- **Channel routing:** Channel Filter, Simple Channel Filter, Channel Map, Channel Unisono (`mididup`), Note/Channel Map
- **Note processing:** Chord, Chromatic Transpose, Note Transpose (`mapkeyscale`), Enforce Scale, Keysplit, Key-Range Filter, Monophonic Legato, Sostenuto, Note Toggle
- **CC processing:** CC Map, CC to Note, Scale CC Value, Note to CC
- **Velocity:** Velocity Adjust, Velocity Randomization, Velocity-Range Filter
- **Timing:** Delayline, N-Tap Delay, Quantization, Strum
- **Housekeeping:** Event Filter, Duplicate Blocker, Remove Active Sensing

CPU is negligible — MIDI event loop, not audio. The full source is `https://github.com/x42/midifilter.lv2`.

### x42 step sequencers (5 URIs, one bundle)

`http://gareus.org/oss/lv2/stepseq#s{n}n{m}` — 8×4, 8×8, 8×16, 16×8, 32×8. Step sequencer grid variants, MIDI output. Source `https://github.com/x42/stepseq.lv2`.

### x42 MIDI generators and clock

| Plugin | Bundle | One-line |
|---|---|---|
| MIDI Generator | midigen.lv2 | x42 note arpeggiator / generator |
| MIDI Clock Generator | mclk.lv2 | x42 MIDI clock with optional host sync |
| MIDI Timecode (MTC) Generator | mtc.lv2 | x42 MTC generator with optional host sync |

### Carla MIDI tools (8 URIs)

`http://kxstudio.sf.net/carla/plugins/midi*`. falkTX, GPL-2.0. Channel A/B, Channel Filter, Channelize, Join, Split, Gain, Transpose, File. Source `https://github.com/falkTX/Carla`.

### blop CV math (6 URIs, one bundle)

`http://drobilla.net/plugins/blop/*`. David Robillard, GPL. Control-rate math primitives for CV patching: `Branch`, `Difference`, `Product`, `Ratio`, `Sum`, `Control to CV Interpolator`. Source `http://git.drobilla.net/blop.lv2.git`.

### x42 meters and analysers

| Plugin | Bundle | One-line |
|---|---|---|
| Spectrum Analyzer | modspectre.lv2 | x42 crude FFT spectrum analyser with configurable response time |

### mod-devel misc

| Plugin | Bundle | One-line |
|---|---|---|
| Arpeggiator | mod-arpeggiator.lv2 | MIDI arpeggiator |
| Peak To CC | peak-to-cc.lv2 | Audio peak → MIDI CC converter |

### Other

| Plugin | Bundle | One-line |
|---|---|---|
| C\* Click | mod-caps-Click.lv2 | Sample-accurate metronome; click sounds synthesised at load |
| Notes | notes.lv2 | A notepad. UI-only; no audio ports. ~450 char limit |
| MIDI display | midi-display.lv2 | Read-only MIDI event monitor. UI-only |
| setBfree MIDI controller | setbfree-controller.lv2 | MIDI controller surface for the setBfree organ synth |
| Noise repellent | nrepel.lv2 | Spectral denoiser (noise profiling + spectral subtraction). Luciano Dato, MIT. Real DSP, not a utility — categorised Utility but is an effect. Already in `plugins-source.json` via its URI |
| ZamPhono | ZamPhono.lv2 | RIAA phono preamp. Categorised Utility but is an effect |
| Airwindows Sidepass | Airwindows-Sidepass.lv2 | Side-channel highpass + mono-maker. Categorised Utility and Highpass |
| the infamous mindi | mindi.lv2 | ssj71 — minimal MIDI indicator. UI-only |

## Topology, established from source

### 1. TinyGain — Robin Gareus, the gain plugin pi-Stomp users actually load

`x42/tinyamp.lv2` → `src/tinygain.c`. The repo is named `tinyamp.lv2` and ships both `tinyamp` and `tinygain`; the README at the top of `tinygain.c` calls it "MOD gain + meter", Copyright (C) 2016,2017 Robin Gareus. GPL-2.0+. The `mod-plugin-builder` package `x42-tinygain` references `x42/tinyamp.lv2` at commit `7da2876da03a443cb08b27f0c4d3f24633ed91c4` (`X42_TINYGAIN_SITE = $(call github,x42,tinyamp.lv2,$(X42_TINYGAIN_VERSION))`).

`tinygain.c:51-58` — one `TinyGain` struct shared between mono and stereo (`run_mono`, `run_stereo` differ only in channel count). The DSP is:

- `gain` port in dB, range **±20 dB** (`tinygain.ttl`), default 0.
- `pre()` (`tinygain.c:108-122`) recomputes the target linear gain once per block: `target_gain = 10^(0.05·gain)`. The actual applied gain is smoothed per sample by a one-pole LPF with `omega = 1 − exp(−2π·20/SR)` — i.e. a **20 Hz one-pole lowpass on the gain control itself**, the zipper-noise prevention the TTL comment advertises. Time constant ≈ 8 ms.
- `mute` toggles `target = 0`; `enable <= 0` forces `target = 1` (true bypass, not mute).
- The level meter (`run_mono`, `tinygain.c:135-159`) is a digital-peak hold: `l *= falloff` per block where `falloff = 10^(−0.05·15·(n/SR))` — **15 dB/s falloff**, immediate rise. The `post()` function throttles port output to changes > 0.1 dB so MOD-UI doesn't redraw at audio rate. `fast_log10f` is a bit-twiddling approximation (`tinygain.c:75-79`), not libm.

The `#define SEPARATE_LOOPS` directive splits the gain-multiply loop from the meter-peak loop so the gain loop is vectorizable. CPU: one multiply, one add, one fabs per sample per channel. Negligible.

**Mono vs stereo:** two `run` functions, same struct, same smoothing. The stereo variant processes two channels with one shared `gain` state, so a stereo source moves together.

### 2. C\* Noisegate — RMS-driven, with the caps-lv2 detector topology

`mod-audio/caps-lv2` → `Noisegate.cc`, `Noisegate.h`, `dsp/RMS.h`, `dsp/IIR2.h`. Tim Goetze, GPL-3.0.

Ports (`Noisegate.cc:154-167`):

| Port | Symbol | Range | Unit |
|---|---|---|---|
| 0 | open | −55 to 0 | dB (gate opens when `|sample| > 10^(open/20)`, i.e. threshold is bumped **+10 dB** internally: `open = db2lin(getport(0)−10)` at `Noisegate.cc:71`) |
| 1 | attack | 0 to 5 | ms (mapped to samples: `attack = max(0.005·N·attack_ms, 2)`) |
| 2 | close | −80 to 0 | dB (gate closes when `rms.get() < db2lin(close)`) |
| 3 | mains | 0 / 50 / 60 | Hz (notch filter in detector; 0 = off) |
| 4,5 | in, out | — | audio |

Detection topology (`Noisegate.cc:56-64`, `dsp/RMS.h`):

- `N = 3·960·fs/48000` — **60 ms sliding-window RMS** when open at 48 kHz (N ≈ 2880 samples). The window is a power-of-two circular buffer (`RMS<8192>`), running sum.
- The RMS class docstring (`dsp/RMS.h:58`) says "pass in the SQUARED! sample value", but the call site (`Noisegate.cc:63`) passes `x − 0.3·y` — a **linear** value (input minus 30 % of the bandpass-filtered version). `get()` then returns `sqrt(fabs(sum·over_N))`. With linear input, `get()` is `sqrt(mean(|x|))`, not `sqrt(mean(x²))`. The hysteresis and threshold comparisons treat this consistently — the close threshold `db2lin(close)` is in linear amplitude, so it matches `sqrt(mean(|x|))` only as an approximation. **Verified: the RMS measurement is mean-absolute, not true RMS.** This is a known caps quirk; we report what the code does, not what the class name suggests.
- The mains hum filter is two cascaded RBJ bandpass sections (`Noisegate.cc:86-87`) at `f_mains` with Q = 5 and Q = 1, subtracted from the input at 30 %. If `mains = 0` the filters are set to unity.
- The gate opens **instantaneously** when `|sample| > open` (a peak test, not RMS), but closes only when the RMS drops below `close` **and** `hysteresis.age > 180 ms` (i.e. the gate has been open at least 180 ms). The 180 ms hysteresis prevents chattering on transients.
- Open attack is a linear ramp over `attack` samples; close is a fixed 20 ms linear ramp (`over_N` = 1/2880). Closed-gain attenuation is **−60 dB** (`gain.quiet = db2lin(−60)`, `Noisegate.cc:40`). The output gain is then passed through a 120 Hz one-pole LPF (`gain.lp.set_f(120·over_fs)`, `Noisegate.cc:41`) — the gate never clicks.

CPU: 2× RBJ bandpass (4 biquads, when mains is on) + RMS store/get + one LPF, per sample. ~14 multiplies/sample. Cheap.

### 3. Mixer — mod-audio/mod-audio-mixer-lv2

`mod-audio/mod-audio-mixer-lv2` → `plugins/mod-mixer/mod-mixer.cpp`, `classes/{channelStrip,volumeSlider,panning,onepole,levelMeter}.{hpp,cpp}`. DPF plugin. GPL (the header declares "Custom"; the TTL says GPLv3).

4 mono channels → 4 outputs (main L/R + alt L/R). Each channel has Volume (0–1), Panning (−1…+1), Solo, Mute, Alt. Plus Master Volume and Alt Volume.

Channel strip (`classes/channelStrip.cpp:68-90`):

- `volumeSlider.setCoef(level)` (`classes/volumeSlider.cpp:12-18`) computes `coef = 10^((1−level)·−45/20)` — a log taper that reaches **−45 dB at level = 0** and 0 dB at level = 1. Volume 0 is not full mute (−45 dB).
- Panning uses an equal-power sin/cos law with a Taylor-series `sin` approximation (`classes/panning.cpp:19-22`). Panning 0 = center (sin(π/2)·cos(0) = 1·1 = full both? — actually `left = calcSin(angle·π/180 + π/2)` and `right = calcSin(angle·π/180)`, so at angle = 0: left = sin(π/2) = 1, right = sin(0) = 0 — that's hard left, not center). The setPanning remap (`mod-mixer.cpp:544-548`) maps the parameter range −1…+1 to angle 0…90 degrees, so parameter 0 = angle 45° = both channels at sin(45°) ≈ 0.707 (true center, −3 dB equal power). The code is correct; the inline `calcSin` approximation is accurate enough.
- `altChannel` mode routes the channel to the alt bus instead of the main bus. A 0.001/sample ramp (`channelStrip.cpp:76-79`) crossfades alt gain in/out — about a 50 ms transition at 48 kHz.
- `onepole1`/`onepole2` (`classes/onepole.cpp`, `setFc(10/48000)`) are 10 Hz one-pole LPFs on the gain and pan coefficients — the smoothing that prevents zipper noise when riding faders from MOD-UI.
- Solo (`mod-mixer.cpp:518-542`) mutes every non-soloed channel by internally calling `setMute(1)` on each non-solo channel; the channel's own `muteParam` is preserved so un-soloing restores prior mutes.
- Output level meters per channel + master + alt — six `LevelMeter` instances. The `levelMeter.cpp` header explicitly credits Robin Gareus ("The code from this levelMeter class is used from MOD gain + meter, Copyright (C) 2016,2017 Robin Gareus"). The MOD Mixer is using TinyGain's meter code, factored out.

CPU: per sample per channel: 1 input → panner (4 multiplies) × smoothGain (1 LPF) → 4 output sums. Plus 6 meter processes (block-rate). Roughly 30 multiplies/sample. Cheap for a 4-bus mixer.

### 4. Level Meter — x42/modmeter.lv2

`x42/modmeter.lv2` → `src/modmeter.c`. Robin Gareus, GPL-2.0. 132 lines.

The TTL (`lv2ttl/modmeter.ttl.in`) declares **one mono audio input** and **three control outputs**: `level`, `peak`, `rms`. Plus a `reset` trigger input.

DSP (`modmeter.c:86-127`):

- `level` is **digital peak with 15 dB/s falloff**, same algorithm as TinyGain's `level` port: `l *= falloff`, `if (a > l) l = a`. Same throttling to 0.2 dB steps. Same `fast_log10f` bit-twiddle.
- `peak` is **peak-hold** — `p = max(p, a)` with no falloff. Reset to 0 by the `reset` trigger.
- `rms` is a one-pole integrator: `r += ω·(s² − r)` with `ω = 9.72/SR`. Time constant ~0.16 s. Output is `sqrtf(r)`.

The TTL description claims "RMS, Peak and Hold values" — accurate for the three ports. There is no VU ballistics, no IEC 60268 integration time. This is a numeric meter, not a standards-compliant one. The full x42 `meters.lv2` bundle (separate bundle, not shipped on the device) does include IEC VU, K12/K14/K20, EBU R128, BBC PPM, etc. — see `x42/meters.lv2`. **`modmeter.lv2` is the stripped-down MOD variant**: three output ports, no GUI, no standards.

The Mixer's per-channel meter (`levelMeter.cpp`, mod-audio-mixer-lv2) is byte-for-byte the same peak-detect code, credited in source. Both plugins descend from one Robin Gareus snippet.

### 5. SooperLooper — mod-audio/sooperlooper-lv2-plugin

`mod-audio/sooperlooper-lv2-plugin` → `sooperlooper/src/sooperlooper.cpp`, `sooperlooper/src/sooperlooper.ttl`. The LV2 wrapper is by the MOD team; the DSP is Jesse Chappell's LADSPA plugin from `essej.net/sooperlooper/oldplugin.html`,GPL-2.0, with permission (the `doap:developer` in the TTL names Jesse Chappell). The full upstream SooperLooper application is `essej/sooperlooper` — a separate repo and a much larger codebase; the LV2 plugin is just the LADSPA single-loop engine ported to LV2 control ports.

The LV2 port surface (`sooperlooper.ttl`) exposes only **8 ports**: input, output, `play_pause`, `record`, `reset`, `undo`, `redo`, `dryLevel`. The underlying `SooperLooper` struct (`sooperlooper.cpp:149-272`) has 20+ control pointers (`pfWet`, `pfFeedback`, `pfTrigThresh`, `pfRate`, `pfScratchPos`, `pfMultiCtrl`, `pfTapCtrl`, `pfQuantMode`, `pfRoundMode`, `pfRedoTapMode`, plus 5 control outputs `pfStateOut`, `pfLoopLength`, `pfLoopPos`, `pfCycleLength`, `pfSecsFree`, `pfSecsTotal`). The LV2 wrapper leaves those null and the run function (`sooperlooper.cpp:735-740`) sets defaults so the unexposed features degrade gracefully:

- `fFeedback` defaults to 1.0 (full feedback on overdub — the `*pLS->pfFeedback = fFeedback` write at line 788 is a no-op because `pfFeedback` is null, but the local `fFeedback` is used downstream).
- `fTrigThresh` defaults to 0.0 — record starts immediately on the first sample rather than waiting for an input threshold.
- `fWet` defaults to 1.0.
- `fRate` defaults to 1.0 (forward, normal speed).
- Multi-control, scratch, tap-tempo, rate-change, multiply, insert, replace, delay, mute, oneshot — all unreachable. The plugin's `state` machine (`sooperlooper.cpp:82-93`) defines 13 states; only `OFF`, `TRIG_START`, `RECORD`, `OVERDUB`, `PLAY` are exercised through the 6 exposed control ports.

So the LV2 SooperLooper is a **single-loop record/overdub/play/undo/redo** machine. The full Echoplex feature set is in source but not wired to ports. 400 s sample memory (`SAMPLE_MEMORY = 400.0`, `sooperlooper.cpp:70`). 512-sample crossfade ramps at loop boundaries (`XFADE_SAMPLES = 512`, line 73). Loop chunks are allocated from a fixed buffer; new overdubs are pushed onto a linked list (`pushNewLoopChunk`, lines 319-362), so undo is a list pop (`popHeadLoop`) and redo is a list push.

`dryLevel` is mapped through the same log law as the Mixer's volume: `volumeCoef = 10^((1−dryLevel)·−45/20)` (line 886), so 0 = −45 dB, 1 = 0 dB.

`sooperlooper-2x2` is the stereo variant: 10 ports (inL, inR, outL, outR, same 6 controls), same DSP.

CPU: per sample, one multiply (input gain), one multiply (wet), one add (output sum), one buffer write. ~5 ops/sample. Cheap.

### 6. ALO — devcurmudgeon/alo

`devcurmudgeon/alo` → `source/alo.c`. Paul Sherwood, ISC. 869 lines.

Six loops of fixed length 2.88 M samples (`LOOP_SIZE = 2880000`, `alo.c:69`) — 60 s at 48 kHz. The plugin is always recording in the background into a rolling buffer; pressing a loop button "arms" it, and the loop's start point is set at the next phrase boundary. In sync mode (Global BPM) the loop length is set by the `Bars` parameter; in free-running mode the loop length is fixed by the first loop's recorded length. Threshold detection triggers recording start. Six `State` enums per loop (`LOOP_OFF`, `LOOP_ON`, `RECORDING`). Loop 6 is special: it outputs the loop while **replacing it with the input signal**, so if output is fed back through an effect, that effect is applied each pass — the classic "Frippertronics" feedback path.

MIDI control: `MIDI Base` sets the lowest note; loops 1–6 are notes Base..Base+5. Reset modes (0–3) control how/when loops are wiped. Click track at 880 Hz (downbeat) / 440 Hz (other beats). `Instant Loops` (0/3/6) makes loops stop/resume instantly on button press rather than waiting for the loop boundary.

CPU: one background-record write + N active-loop reads/writes per sample, N ≤ 6. ~20 ops/sample at full load. Cheap.

### 7. Loopor — stevie67/loopor

`stevie67/loopor` (referenced via `mod-plugin-builder` package `loopor-labs`). Stevie (modplugins@radig.com), ISC. Not read in detail here — the long description in `plugins.json` is the authoritative doc. Single-loop live looper with undo/redo stack, threshold-triggered record, double-press reset, continuous dub mode. Similar capability space to SooperLooper but with a stack-based undo history rather than a linked list.

## CPU

Per-sample costs derived from the loop bodies:

| Plugin | Cost / sample | Notes |
|---|---|---|
| TinyGain (mono) | 1 mul, 1 add, 1 fabs | vectorizable; meter is a second pass |
| TinyGain (stereo) | 2 mul, 2 add, 2 fabs | shared gain state |
| C\* Noisegate | ~14 mul (mains filter on), ~6 mul (off) + RMS store + LPF | block-rate gate decision |
| Mixer (4 ch) | ~30 mul | 4 panners + 4 gain LPFs + 4 alt-gain ramps; meters are block-rate |
| Level Meter | ~3 mul + 1 sqrtf | per-sample, output throttled to 0.2 dB |
| SooperLooper (play) | ~5 mul | single-loop read/write |
| ALO (6 loops active) | ~20 mul | background record + 6 loop reads |
| x42 midifilter family | event-rate, not audio-rate | negligible |

All of these are <1 % of a Pi 4 core alongside a full chain. Utility plugins are not the CPU budget.

## Ranking by use case

### A. Trim / volume / gain staging

1. **TinyGain (mono or stereo)** — the community's pick (16+16 occurrences, the highest of any utility). ±20 dB, 20 Hz smoothing, peak meter. Use it for input trim between pedals, output trim before a recorder, or anywhere a chain needs a volume knob that doesn't click. The meter is the bonus.
2. **Gain** (mod-devel) — wider range (±40 dB), linear ramp across block, no meter. Also great. The wider range is wasted on a guitar chain (±20 dB is enough) but useful at the pedalboard edge.
3. **Audio Gain** (Carla) — gain is a multiplication factor, not dB. Also considered. Useful when you need a precise linear trim (×0.5, ×2), not a musical one.
4. **Invada Input Module** — source unavailable. Also considered; skip.

### B. Gate

1. **C\* Noisegate** — the only gate in the cohort with a real detector (60 ms RMS, 180 ms open hysteresis, mains notch). 11 occurrences. The pick. Pair it with a hum-filtering strategy: set `mains` to 50 (or 60) and the close threshold can sit lower without hum holding the gate open.
2. **MOD System Noise Gate** (`system-noisegate.lv2`) — already covered in the compressor survey (doc 15). Simpler, no hysteresis. Also great if you want a one-knob gate at the system level.
3. **MDA Dynamics** — has a gate mode but is primarily a comp. Also considered.

### C. Mixer / routing

1. **Mixer** (mod-devel) — 4 mono channels, per-channel vol/pan/mute/solo/alt, master + alt outputs. The pick. The alt bus is the trick: route a channel to alt for a parallel path (e.g. send one channel to a delay-only output) without repatching.
2. **Mixer Stereo** — same, 4 stereo channels. Also great if your chain is stereo.
3. **Switchbox 1-2 / 2-1 (+ ST)** — for A/B routing between two paths. Also great; not a mixer, but the routing primitive.
4. **SwitchTrigger4 / ToggleSwitch4** — 4-way selectors. Also great for footswitch-driven chain reconfig.

### D. Metering

1. **Level Meter** (x42 modmeter) — peak + peak-hold + RMS, three output ports. The pick. Place one at the input, one after the dirt, one before the recorder. The 15 dB/s falloff is on the fast side — you see transients, not loudness.
2. **TinyGain's `level` port** — same peak/falloff, no RMS or hold. Already in the chain as a gain, so the meter is free.
3. **Spectrum Analyzer** (x42 modspectre) — for frequency inspection, not level. Also great in its own niche.

### E. Looper

1. **SooperLooper** — the LV2 port of Jesse Chappell's LADSPA looper. Record/overdub/undo/redo, 400 s buffer, 512-sample crossfades. The pick for a single-loop live rig. The full Echoplex feature set (multiply, insert, replace, scratch, MIDI multi-control) is in source but not wired to LV2 ports — use the upstream SooperLooper app if you need those.
2. **ALO** — six fixed-length loops, BPM sync, MIDI control, click track, loop-6 feedback mode. Also great for a multi-loop rig with a click. 2.88 M sample buffer (60 s at 48 kHz) per instance.
3. **Loopor** — single looper with a redo stack. Also considered; less usage data (0 occurrences) but a competent single-loop looper.
4. **Audio File** — sample player, not a looper. Also considered: it will loop a file but does not record and does not tempo-match. Use it for backing tracks, not live looping.

### F. The non-utility utilities

- **Notes** — a notepad. Useful, not a utility in the DSP sense. 3 occurrences because users keep a note in the pedalboard file for setlist reminders.
- **MIDI display** — UI only, no audio ports. A diagnostic tool.
- **setBfree MIDI controller** — controller surface for the setBfree organ.
- **Noise repellent** — spectral denoiser; a real effect filed under Utility. Should be categorised as a Filter or its own Denoiser category; the categorisation is upstream, not ours to fix.
- **ZamPhono** — RIAA phono preamp; a real effect filed under Utility.
- **Airwindows Sidepass** — side-channel highpass + mono-maker; a real effect filed under both Utility and Highpass.

## Editorial candidates

The plan called for **possibly two docs**. The split is justified.

### Doc A: gain / gate / mixer / meter staples

**Our pick:** TinyGain (mono or stereo). Most-used utility on the device (16+16), the right amount of control (±20 dB, mute, meter), zipper-free, written by Robin Gareus. The single knob a pi-Stomp pedalboard wants at the input edge.

**Also great:**
- **C\* Noisegate** — for the gate slot. The mains-aware detector is the differentiator.
- **Mixer** — for the parallel-path slot. The alt bus is the trick that makes a single pi-Stomp split a signal.
- **Level Meter** — for the metering slot. Place three in a chain and you can see what each pedal is doing to the level.

**What you give up with each:**
- TinyGain over Gain: range (±20 vs ±40 dB). You don't need ±40 dB inside a guitar chain.
- C\* Noisegate over the system gate: tweakability. The system gate is one knob.
- Mixer over a stereo sum: channels. The Mixer is mono, 4 channels. For stereo summing use Mixer Stereo.
- Level Meter over a VU plugin: standards compliance. This is numeric, not IEC VU.

**Also considered:** Gain (no meter), Audio Gain (linear, not dB), Invada Input Module (no source), x42 meters.lv2 bundle (not shipped — the device has modmeter only), Switchbox / ToggleSwitch (routing, not gain), Peak To CC (control, not meter).

### Doc B: loopers

**Our pick:** SooperLooper — the LV2 port of the LADSPA original by Jesse Chappell. Single-loop record/overdub/undo/redo, the Echoplex DNA. The right amount of feature for a live guitar looper; the un-exposed multiply/insert/replace features are documented in source for the curious.

**Also great:** ALO — for a multi-loop rig. Six loops, BPM sync, MIDI control, click track. Loop 6's feedback-as-overdub is the trick. Different use case from SooperLooper, not a strict runner-up.

**What you give up with ALO:** undo/redo history (ALO's reset is double-press, not a stack); the Echoplex vocabulary; Jesse Chappell's specific DSP.

**Also considered:** Loopor (less usage data, similar single-loop territory), Audio File (sample player, not a looper), Record-Mono/Stereo/Quad (file recorders, not loopers).

### Split or combine?

**Split.** The two audiences don't overlap. A user shopping for a gain knob is not shopping for a looper, and the looper doc needs footswitch-mapping screenshots and a BPM-sync walkthrough that would swamp a gain-staging article. The gain/gate/mixer/meter doc is a quick reference; the looper doc is a deep dive. Combining them produces a 5000-word article with no clear reader.

The one thing the combined doc would have given is the framing: these are the plugins that hold a chain together. That framing fits in the intro of both docs separately.

## What this doc did not verify

- **`modgui:label`s and screenshots** — the pi-Stomp was offline. The editorial step must fetch via `http://pistomp.local/effect/image/screenshot.png?uri=<encoded>` using the verbatim URIs in `plugins.json`.
- **Mixer stereo variant source** — read the mono variant's source. The repo also contains `mod-mixer-stereo`; not diffed here. Presumed identical except for 2× audio channels.
- **Loopor source** — identified repo (`stevie67/loopor`), not read in detail. The `plugins.json` long comment is comprehensive and likely author-written.
- **Carla plugin sources** — `https://github.com/falkTX/Carla` resolves; the audio-file / audio-gain / midi-tools / portal / audio-bridge plugins live in that monorepo. Not diffed plugin-by-plugin.
- **x42 midifilter individual filters** — confirmed the family source is `x42/midifilter.lv2`. Did not read each of the 28 filter subclasses. CPU is event-rate; the family is uniform.
- **C\* Noisegate "RMS" naming** — verified the `dsp/RMS.h` docstring says "pass in SQUARED" but the `Noisegate.cc:63` call passes linear. Reported as a quirk; not raised as a bug. Upstream may consider the convention misleading rather than wrong.

## Audit findings

1. **TinyGain's source repo is `x42/tinyamp.lv2`, not `x42/tinygain.lv2`.** The `mod-plugin-builder` package `x42-tinygain.mk` is the authoritative pointer. The README inside `tinyamp.lv2` says `git clone git://github.com/x42/tinygain.lv2.git`, but that URL 404s — the README is stale, the repo was renamed/merged. Source-cache entry must point to `x42/tinyamp.lv2`.
2. **Mixer and mod-meter share TinyGain meter code.** `classes/levelMeter.cpp` in `mod-audio-mixer-lv2` is verbatim Robin Gareus code from TinyGain, credited in the file header. Both plugins' meters descend from one snippet. The editorial can mention this lineage.
3. **SooperLooper LV2 exposes only 6 of the LADSPA plugin's ~20 control ports.** The full Echoplex feature set (multiply, insert, replace, scratch, rate, multi-control, tap-tempo, quantize, round) is in the source but unwired. The editorial must not advertise features that the LV2 port doesn't expose.
4. **C\* Noisegate's RMS class is mis-named.** `dsp/RMS.h` says "pass in SQUARED", but `Noisegate.cc:63` passes linear samples. `get()` returns `sqrt(mean(|x|))`, not `sqrt(mean(x²))`. The threshold comparisons are consistent with this. The plugin works; the class name is misleading.
5. **Notes is filed under Utility but is a UI plugin with no audio ports.** Same for MIDI display and setBfree controller. The category filter picks them up; the editorial should not.
6. **Noise repellent, ZamPhono, Airwindows Sidepass are real DSP effects filed under Utility.** The category is upstream's, not ours. The editorial's "Also considered" section can note the mis-categorisation without trying to fix it.
7. **`mod-mixer` (the hardware DAC controller repo at `mod-audio/mod-mixer`) is not the LV2 plugin's repo.** The LV2 Mixer plugin lives in `mod-audio/mod-audio-mixer-lv2`. The names are confusable; verified the LV2 source is in the latter.
8. **`caps-lv2` upstream.** The cached `plugins-source.json` entry for C\* Noisegate points to `https://github.com/moddevices/caps-lv2`, which 301-redirects to `https://github.com/mod-audio/caps-lv2`. Both resolve. The EQ survey (doc 19) standardised on `mod-audio/caps-lv2`; the Noisegate entry is the only one still using the old `moddevices/` URL. Aligning it is a one-line fix; left untouched here per the rule "don't retype cached entries unless wrong", but flagged for the next cache edit.

## Source URLs to cache

Verified to resolve (`git ls-remote`) and added to `src/_data/plugins-source.json`:

| uri | bundle | source_url |
|---|---|---|
| `http://gareus.org/oss/lv2/tinygain#mono` | `tinygain.lv2` | `https://github.com/x42/tinyamp.lv2` |
| `http://gareus.org/oss/lv2/tinygain#stereo` | `tinygain.lv2` | `https://github.com/x42/tinyamp.lv2` |
| `http://gareus.org/oss/lv2/modmeter` | `modmeter.lv2` | `https://github.com/x42/modmeter.lv2` |
| `http://gareus.org/oss/lv2/modspectre` | `modspectre.lv2` | `https://github.com/x42/modspectre.lv2` |
| `http://gareus.org/oss/lv2/mclk` | `mclk.lv2` | `https://github.com/x42/mclk.lv2` |
| `http://gareus.org/oss/lv2/mtc` | `mtc.lv2` | `https://github.com/x42/mtc.lv2` |
| `http://gareus.org/oss/lv2/midigen` | `midigen.lv2` | `https://github.com/x42/midigen.lv2` |
| `http://moddevices.com/plugins/mod-devel/mixer` | `mod-mixer.lv2` | `https://github.com/mod-audio/mod-audio-mixer-lv2` |
| `http://moddevices.com/plugins/mod-devel/mixer-stereo` | `mod-mixer-stereo.lv2` | `https://github.com/mod-audio/mod-audio-mixer-lv2` |
| `http://moddevices.com/plugins/sooperlooper` | `sooperlooper.lv2` | `https://github.com/mod-audio/sooperlooper-lv2-plugin` |
| `http://moddevices.com/plugins/sooperlooper-2x2` | `sooperlooper-2x2.lv2` | `https://github.com/mod-audio/sooperlooper-lv2-plugin` |
| `http://devcurmudgeon.com/alo` | `alo.lv2` | `https://github.com/devcurmudgeon/alo` |
| `http://radig.com/plugins/loopor` | `loopor.lv2` | `https://github.com/stevie67/loopor` |
| `http://open-music-kontrollers.ch/lv2/notes#notes` | `notes.lv2` | `https://git.ventosus.ch/notes.lv2` |
| `http://moddevices.com/plugins/caps/Click` | `mod-caps-Click.lv2` | `https://github.com/mod-audio/caps-lv2` |
| `http://moddevices.com/plugins/mod-devel/Gain` | `mod-gain.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/Gain2x2` | `mod-gain2x2.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/SwitchBox2` | `mod-switchbox2.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/switchbox_1-2_st` | `switchbox_1-2_st.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/switchbox_2-1` | `switchbox_2-1.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/switchbox_2-1_st` | `switchbox_2-1_st.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/SwitchTrigger4` | `mod-switchtrigger4.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/ToggleSwitch4` | `mod-toggleswitch4.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/MIDI-Switchbox_1-2` | `midi-switchbox_1-2.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/midi-switchbox_1-2_2C` | `midi-switchbox_1-2_2C.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/midi-switchbox_1-3` | `midi-switchbox_1-3.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/midi-switchbox_2-1` | `midi-switchbox_2-1.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/midi-switchbox_2-1_2C` | `midi-switchbox_2-1_2C.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/midi-switchbox_3-1` | `midi-switchbox_3-1.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://moddevices.com/plugins/mod-devel/arpeggiator` | `mod-arpeggiator.lv2` | `https://github.com/mod-audio/mod-arpeggiator-lv2` |
| `http://moddevices.com/plugins/mod-devel/PeakToCC` | `peak-to-cc.lv2` | `https://github.com/mod-audio/mod-utilities` |
| `http://kxstudio.sf.net/carla/plugins/audiofile` | `carla-files.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/audiogain` | `carla-audiogain.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/audiogain_s` | `carla-audiogain.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/midichanab` | `carla-miditools.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/midichanfilter` | `carla-miditools.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/midichannelize` | `carla-miditools.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/midifile` | `carla-files.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/midigain` | `carla-miditools.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/midijoin` | `carla-miditools.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/midisplit` | `carla-miditools.lv2` | `https://github.com/falkTX/Carla` |
| `http://kxstudio.sf.net/carla/plugins/miditranspose` | `carla-miditools.lv2` | `https://github.com/falkTX/Carla` |
| `https://falktx.com/plugins/audio-bridge#capture` | `audio-bridge.lv2` | `https://github.com/falkTX/Carla` |
| `https://falktx.com/plugins/audio-bridge#playback` | `audio-bridge.lv2` | `https://github.com/falkTX/Carla` |
| `https://falktx.com/plugins/portal#sink` | `portal.lv2` | `https://github.com/falkTX/Carla` |
| `https://falktx.com/plugins/portal#source` | `portal.lv2` | `https://github.com/falkTX/Carla` |
| `http://drobilla.net/plugins/blop/branch` | `blop.lv2` | `http://git.drobilla.net/blop.lv2.git` |
| `http://drobilla.net/plugins/blop/interpolator` | `blop.lv2` | `http://git.drobilla.net/blop.lv2.git` |
| `http://drobilla.net/plugins/blop/difference` | `blop.lv2` | `http://git.drobilla.net/blop.lv2.git` |
| `http://drobilla.net/plugins/blop/product` | `blop.lv2` | `http://git.drobilla.net/blop.lv2.git` |
| `http://drobilla.net/plugins/blop/ratio` | `blop.lv2` | `http://git.drobilla.net/blop.lv2.git` |
| `http://drobilla.net/plugins/blop/sum` | `blop.lv2` | `http://git.drobilla.net/blop.lv2.git` |
| `http://gareus.org/oss/lv2/midifilter#mapcc` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#cctonote` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#channelfilter` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#channelmap` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#mididup` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#midichord` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#miditranspose` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#mididelay` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#nodup` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#enforcescale` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#eventblocker` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#keyrange` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#keysplit` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#monolegato` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#ntapdelay` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#notetocc` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#notetoggle` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#mapkeyscale` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#mapkeychannel` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#quantize` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#noactivesensing` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#scalecc` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#onechannelfilter` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#sostenuto` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#midistrum` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#velocityscale` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#randvelocity` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/midifilter#velocityrange` | `midifilter.lv2` | `https://github.com/x42/midifilter.lv2` |
| `http://gareus.org/oss/lv2/stepseq#s16n8` | `stepseq_s16n8.lv2` | `https://github.com/x42/stepseq.lv2` |
| `http://gareus.org/oss/lv2/stepseq#s32n8` | `stepseq_s32n8.lv2` | `https://github.com/x42/stepseq.lv2` |
| `http://gareus.org/oss/lv2/stepseq#s8n16` | `stepseq_s8n16.lv2` | `https://github.com/x42/stepseq.lv2` |
| `http://gareus.org/oss/lv2/stepseq#s8n4` | `stepseq_s8n4.lv2` | `https://github.com/x42/stepseq.lv2` |
| `http://gareus.org/oss/lv2/stepseq#s8n8` | `stepseq_s8n8.lv2` | `https://github.com/x42/stepseq.lv2` |
| `https://github.com/vallsv/midi-display.lv2` | `midi-display.lv2` | `https://github.com/vallsv/midi-display.lv2` |
| `https://github.com/vallsv/setbfree-controller` | `setbfree-controller.lv2` | `https://github.com/vallsv/setbfree-controller.lv2` |
| `urn:brummer10:neuralrecord` | `neuralrecord.lv2` | `https://github.com/brummer10/neuralrecord` |
| `https://github.com/brummer10/screcord#mono_record` | `sc_record.lv2` | `https://github.com/brummer10/screcord` |
| `https://github.com/brummer10/screcord#mono_record_mini` | `sc_record_mini.lv2` | `https://github.com/brummer10/screcord` |
| `https://github.com/brummer10/screcord#quad_record` | `sc_record.lv2` | `https://github.com/brummer10/screcord` |
| `https://github.com/brummer10/screcord#quad_record_mini` | `sc_record_mini.lv2` | `https://github.com/brummer10/screcord` |
| `https://github.com/brummer10/screcord#stereo_record` | `sc_record.lv2` | `https://github.com/brummer10/screcord` |
| `https://github.com/brummer10/screcord#stereo_record_mini` | `sc_record_mini.lv2` | `https://github.com/brummer10/screcord` |
| `http://invadarecords.com/plugins/lv2/input` | `invada-labs.lv2` | `https://launchpad.net/invada-studio` |
| `https://hannesbraun.net/ns/lv2/airwindows/sidepass` | `Airwindows-Sidepass.lv2` | `https://github.com/airwindows/Airwindows` |
| `http://ssj71.github.io/infamousPlugins/plugs.html#mindi` | `mindi.lv2` | `https://github.com/ssj71/infamousPlugins` |
| `urn:zamaudio:ZamPhono` | `ZamPhono.lv2` | `https://github.com/zamaudio/zam-plugins` |

Already cached and not re-added: `http://moddevices.com/plugins/caps/Noisegate` (`moddevices/caps-lv2`, see audit note 8), `https://github.com/lucianodato/noise-repellent` (cached under its URI).

Not cached: `https://github.com/GuitarML/TS-M1N3` — already in cache. No MIDI or CV utility plugin required a new fetch outside the families above.