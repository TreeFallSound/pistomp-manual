---
title: Utility Staples
eleventyNavigation:
  parent: cat-amp-tone
  key: utility-staples
  title: Utility Staples
  order: 4
---

# Utility Staples

If you need the plugins that hold a chain together — input trim, noise gate, parallel mix, level metering — these are the ones pi-Stomp users actually load. **TinyGain** is the gain knob the community runs by a wide margin, **C\* Noisegate** is the gate with a real detector, **Mixer** is the parallel-path primitive, and **Level Meter** is the meter that reads the same peak code as TinyGain's side port:

## Our pick: TinyGain Mono / TinyGain Stereo

<img src="{{ '/assets/images/plugin-utility-tinygain-mono.png' | url }}" alt="TinyGain Mono" class="plugin-screenshot">

TinyGain is the most-loaded utility on the device (16 mono + 16 stereo occurrences in shared pedalboards — the highest of any utility). One knob, ±20 dB, mute, and a peak meter with 15 dB/s falloff. Robin Gareus wrote it; the gain port runs through a 20 Hz one-pole lowpass before the multiply, so fader moves never zip. The meter is a digital-peak hold with `fast_log10f` bit-twiddle math and output throttled to 0.2 dB steps — you see transients, not loudness.

The mono and stereo variants share one gain state; for a stereo source the two channels move together. CPU is one multiply, one add, one `fabs` per sample per channel. Negligible.

| Gain (dB) | Mute | Enable |
|-----------|------|--------|
| 0 | off | on |

Place it at the input edge for input trim, between pedals for level matching, or before a recorder for output gain. If you only add one utility to a pedalboard, this is the one.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Also great: C\* Noisegate

<img src="{{ '/assets/images/plugin-utility-noisegate.png' | url }}" alt="C* Noisegate" class="plugin-screenshot">

For the gate slot, C\* Noisegate (Tim Goetze) is the only gate on the device with a real detector: 60 ms sliding-window RMS, 180 ms open hysteresis, switchable 50/60 Hz mains notch in the detector path, fixed 20 ms close ramp, −60 dB attenuation when closed. The detector's RMS class (`dsp/RMS.h`) is named "RMS" but the call site passes linear samples, so the measurement is actually `sqrt(mean(|x|))` — a known caps quirk that is consistent across the threshold comparisons and does not affect behaviour. Set `mains` to your local line frequency and the close threshold can sit lower without hum holding the gate open.

| Open (dB) | Close (dB) | Attack (ms) | Mains (Hz) |
|-----------|------------|-------------|------------|
| −35 | −55 | 2 | 50 (or 60) |

**What you give up:** the system-level **Noise Gate** (`moddevices.com/plugins/mod-devel/System-NoiseGate`) is a one-knob gate — it lacks hysteresis, mains filter, and open/close thresholds. Reach for it if you want the chain to gate itself without thinking; reach for C\* when the chain has a hum that needs notching out of the detector.

## Also great: Mixer

<img src="{{ '/assets/images/plugin-utility-mixer.png' | url }}" alt="Mixer" class="plugin-screenshot">

For parallel paths, the mod-audio Mixer (4 mono channels → main L/R + alt L/R) is the trick that makes a single pi-Stomp split a signal. Each channel has Volume (log taper to −45 dB at 0), Panning (equal-power sin/cos, center = −3 dB), Mute, Solo, and Alt. The alt bus carries whichever channels have `Alt` on — route a channel to alt for a parallel send (e.g. one channel to a delay-only output) without repatching. Volume and pan coefficients each run through a 10 Hz one-pole LPF to suppress zipper noise from MOD-UI fader moves.

Channel-strip meters are byte-for-byte Robin Gareus's TinyGain peak-detect code (`levelMeter.cpp` credits him in the header). CPU is ~30 multiplies per sample for the full 4-channel strip.

| Ch1 Vol | Ch1 Pan | Ch1 Alt | Master |
|---------|---------|---------|--------|
| 0.8 | 0 (center) | off | 0.9 |

**What you give up:** the Mixer is mono. For a stereo chain use **Mixer Stereo** (`moddevices.com/plugins/mod-devel/mixer-stereo`) — same engine, 4 stereo channels. For A/B routing between two paths (no summing) use **Switchbox 1-2** or **Switchbox 2-1** from the mod-utilities set; for footswitch-driven 4-way selection use **SwitchTrigger4** (momentary) or **ToggleSwitch4** (latching).

## Also great: Level Meter

<img src="{{ '/assets/images/plugin-utility-level-meter.png' | url }}" alt="Level Meter" class="plugin-screenshot">

For metering, x42 Level Meter (Robin Gareus) exposes three output ports: `level` (digital peak with 15 dB/s falloff — the same code as TinyGain's meter), `peak` (peak-hold, reset by a trigger), and `rms` (one-pole integrator, ω = 9.72/SR, ~0.16 s time constant). One mono input, three control outputs. Place one at the input, one after the dirt, one before the recorder, and you can see what each pedal is doing to the level.

This is a numeric meter, not a standards-compliant one — no VU ballistics, no IEC 60268 integration time. The full x42 `meters.lv2` bundle (not shipped on the device) carries IEC VU, K12/K14/K20, EBU R128, BBC PPM. `modmeter.lv2` is the stripped-down MOD variant.

**What you give up:** if you want frequency inspection rather than level, use **Spectrum Analyzer** (x42 modspectre) — crude FFT, configurable response time. If you want a free meter already in the chain, TinyGain's `level` port is the same peak/falloff and costs nothing extra.

## Also considered

**Gain** (`moddevices.com/plugins/mod-devel/Gain`) covers ±40 dB with a linear ramp across the block to suppress zipper. Wider range than TinyGain, no meter. Reach for it at the pedalboard edge when ±20 dB is not enough; inside a guitar chain ±20 dB is plenty.

**Audio Gain (Mono / Stereo)** (Carla, falkTX) takes gain as a linear multiplication factor rather than dB — useful for precise ×0.5 or ×2 trims where a musical taper gets in the way.

**Invada Input Module** is an input trim from a dead Launchpad Bazaar branch; source is gone. Skip it editorially.

**Peak To CC** converts an audio peak to a MIDI CC — a control-rate tool, not a meter. Useful if you want to drive a MIDI parameter from audio level.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| TinyGain Mono / Stereo | Robin Gareus | GPL-2.0+ | [gareus.org](http://gareus.org/) |
| C\* Noisegate | Tim Goetze | GPL-3.0 | [quitte.de/dsp/caps.html](http://quitte.de/dsp/caps.html) |
| Noise Gate (system) | MOD Devices | GPL | [moddevices.com](https://www.moddevices.com) |
| Mixer / Mixer Stereo | mod-audio | GPLv3.0 | [github.com/mod-audio/mod-audio-mixer-lv2](https://github.com/mod-audio/mod-audio-mixer-lv2) |
| Level Meter | Robin Gareus | GPL-2.0+ | [gareus.org](http://gareus.org/) |
| Gain | MOD Devices | GPL | [github.com/mod-audio/mod-utilities](https://github.com/mod-audio/mod-utilities) |
| Audio Gain (Mono / Stereo) | falkTX | GPL-2.0+ | [github.com/falkTX/Carla](https://github.com/falkTX/Carla) |
| Switchbox / ToggleSwitch / SwitchTrigger4 | MOD Devices | GPL | [github.com/mod-audio/mod-utilities](https://github.com/mod-audio/mod-utilities) |
| Spectrum Analyzer | Robin Gareus | GPL-2.0+ | [github.com/x42/modspectre.lv2](https://github.com/x42/modspectre.lv2) |
| Peak To CC | MOD Devices | GPL | [github.com/mod-audio/mod-utilities](https://github.com/mod-audio/mod-utilities) |
| Invada Input Module | Fraser Stuart | GPL | [launchpad.net/invada-studio](https://launchpad.net/invada-studio) |