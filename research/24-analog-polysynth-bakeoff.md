# Analog Polysynth Bake-off — Verified Source Ledger

This doc closes the Tier-D rows from doc 23 (§4, §6, §9). Every claim below is **verified from source** (Tier B) unless marked "inferred." The candidates are the analog-polysynth editorial carve-out from doc 23 §8: Obxd, Helm, amsynth (contenders), TAL Noise Maker ME, Triceratops (second tier), Wolpertinger, Calf Monosynth, MDA JX10 (already Tier B from doc 23).

## 1. Source reads — core contenders

### amsynth — `amsynth/amsynth` (Nick Dowell, GPL)

| Property | Value | Source |
|---|---|---|
| Oscillators/voice | 2 (osc1, osc2) | `VoiceBoard.h:81` |
| Oscillator waveforms | sine, pulse, saw, noise, random | `Oscillator.h:36-42` |
| LFOs | 1 (lfo1) | `VoiceBoard.h:76` |
| LFO waveforms | sine, square, triangle, noise, randomize, saw up, saw down | `VoiceBoard.cpp:34-42` |
| Filter type | SynthFilter: lowpass, highpass, bandpass, bandstop, bypass | `LowPassFilter.h:29-35` |
| Filter slope | 12 dB, 24 dB | `LowPassFilter.h:37-40` |
| ADSRs | 2 (amp, filter) | `VoiceBoard.h:103,109` |
| Max polyphony | Unlimited (configurable via `max_polyphony` property) | `VoiceAllocationUnit.h:61-62`, `Synthesizer.cpp:78-79` |
| Default polyphony | 10 (standalone) | doc 23 §4 |
| Ring mod | Yes (osc1 × osc2) | `VoiceBoard.cpp:188-196` |
| Osc sync | Yes (osc2 sync to osc1) | `VoiceBoard.cpp:176-179` |
| Portamento | Yes | `VoiceAllocationUnit.h:81` |
| Per-voice cost (est.) | ~35 mul/add: 2 osc (8) + filter (8) + 2 ADSR (10) + LFO (4) + mix (5) | |

The filter is a standard SVF/biquad cascade (4 state variables in `LowPassFilter.h:52-55`). No diode modeling, no zero-delay feedback — it is a clean digital filter. The synth is CPU-light and mature.

### Obxd — `2DaT/Obxd` (Filatov Vadim, GPL)

| Property | Value | Source |
|---|---|---|
| Oscillators/voice | 2 (saw/pulse/triangle per osc, plus noise mix) | `ObxdOscillatorB.h:60-62, 250` |
| Oscillator waveforms | saw, pulse, triangle (per osc, independently selectable) | `ObxdOscillatorB.h:176-204` |
| LFOs | 1 main + 1 vibrato | `Motherboard.h:45` |
| LFO waveforms | sine, square, sample-and-hold (bitmask: bit0=sine, bit1=square, bit2=SH) | `SynthEngine.h:243-275` |
| Filter | Zero-delay feedback with diode-pair nonlinearity (Taylor-approximated) | `Filter.h:82-106` |
| Filter modes | 12 dB (Apply), 24 dB (Apply4Pole), multimode (low/band/high blend), bandpass switch | `Filter.h:107-184` |
| ADSRs | 2 (amp, filter) | `ObxdVoice.h:50-51` |
| Max polyphony | 8 (`MAX_VOICES`) | `Motherboard.h:50` |
| Unison | Yes (all voices play same note) | `Motherboard.h:53, 145-197` |
| Voice detune | Per-voice random detune factors (env, filter, portamento, level) | `ObxdVoice.h:159-163` |
| Oversampling | Optional 2x | `Motherboard.h:54, 309-329` |
| Economy mode | Skips silent voices | `Motherboard.h:56, 331-341` |
| Per-voice cost (est.) | ~35 mul/add: 2 osc BLEP (12) + ZDF filter (10) + 2 ADSR (8) + LFO (5) | |

The filter is the headline feature. `Filter.h:82-106` implements a zero-delay feedback structure with a Taylor-approximated diode pair nonlinearity (`diodePairResistanceApprox`). The 12 dB mode is a 2-pole SVF-derived structure; the 24 dB mode is a 4-pole cascade with tanh damping. This is the only filter in the bake-off that models analog nonlinearity at the circuit level.

### Helm — `mtytel/helm` (Matt Tytel, GPL3)

| Property | Value | Source |
|---|---|---|
| Oscillators/voice | 2, each with up to 15 unison voices | `HelmOscillators.h:28, 48-49` |
| Oscillator waveforms | sin, triangle, square, saw up, saw down, 3/4/8 step, 3/5/9 pyramid, S&H, S&G | `helm_common.h:139-153` |
| LFOs | 2 (lfo_1_, lfo_2_) + step sequencer | `helm_engine.h:79-82` |
| Filter | LadderFilter (4-pole ladder) + FormantManager (4-formant vowel) | `helm_voice_handler.cpp:469-474, 541-550` |
| Filter types | lowpass, highpass, bandpass, low shelf, high shelf, band shelf, allpass | `helm_common.h:129-137` |
| Filter slopes | 12 dB, 24 dB, Shelf | `helm_common.h:75-79` |
| ADSRs | 2 (amplitude, filter) + extra envelope | `helm_voice_handler.h:89, 94, 99` |
| Max polyphony | 33 (`MAX_POLYPHONY`) | `mopo/src/common.h:50` |
| Modulation matrix | Full polyphonic + monophonic modulation routing | `helm_module.h:40-48` |
| Sub oscillator | Yes | `helm_voice_handler.cpp` |
| Cross-modulation | Yes (osc1 ↔ osc2) | `HelmOscillators.h:44, 70, 74-85` |
| Per-voice cost (est.) | ~40 base + 10 per unison voice: 2 osc (10) + unison scaling (10/voice) + ladder filter (10) + 2 ADSR (8) + 2 LFO (6) + mod matrix (6) | |

The CPU story: at 8 voices with 7 unison each, total cost ~8 × (40 + 7×10) = ~880. At 33 voices with no unison, ~33 × 40 = ~1320. The unison cost is the decision axis — Helm is the heaviest of the three contenders when used with high unison counts.

## 2. Source reads — second tier

### Triceratops — `thunderox/triceratops` (Nick S. Bailey, ISC)

| Property | Value | Source |
|---|---|---|
| Oscillators/voice | 3 (saw or square with BLEP anti-aliasing) | `synth.h:172-195, 263-264` |
| Oscillator waveforms | saw, square | `synth.h:172-176` |
| LFOs | 3 (saw, square, sine, noise, S&H) | `triceratopsPlugin.cpp:58-60, 833-900` |
| Filter | 4-pole resonant (state-variable topology, 5 biquad buffers) | `synth.h:284-308` |
| Filter modes | lowpass, highpass, bandpass (mode 0-5, 1=LP, 2=HP, 3=BP) | `synth.cpp:1425-1451` |
| ADSRs | 3 (amp, filter, LFO) with 2 routable destinations each | `synth.h:74-98` |
| Max polyphony | 18 (thunderox), 12 (BlokasLabs modep branch) | `triceratopsPlugin.cpp:20`, `triceratops-blokas/triceratops.cpp:20` |
| Unison | Per-oscillator, 0-4 voices | `triceratopsPlugin.cpp:337-345` |
| Built-in FX | Echo (with 3-band EQ), reverb (JCRev) | `triceratopsPlugin.cpp:112, 130-133` |
| FM | Yes (cross-modulation) | `synth.h:44` |
| Warmth | Yes (brightness/saturation control) | `synth.h:43` |
| Per-voice cost (est.) | ~50 mul/add: 3 osc BLEP (18) + 4-pole filter (10) + 3 ADSR (12) + 3 LFO (6) + mix (4) | |

**Which build ships on-device:** The BlokasLabs `modep` branch (`BlokasLabs/triceratops.lv2`, `refs/heads/modep`) is the one that ships. It has `max_notes = 12` vs. thunderox's 18. The architecture is identical; the difference is voice count.

### TAL Noise Maker — ME (`mod-audio/mod-tal-noisemaker`, Patrick Kunz / TAL, GPL)

| Property | Value | Source |
|---|---|---|
| Oscillators/voice | 3 (osc1, osc2, osc3) | `Vco.h:36-38` |
| Osc1 waveforms | saw, pulse, noise | `SynthEngine.h:98-110` |
| Osc2 waveforms | saw, pulse, triangle, sin, noise | `SynthEngine.h:112-126` |
| Osc3 | Always pulse (master sync oscillator) | `Vco.h:92` |
| LFOs | 2 (LFO1, LFO2) with cross-modulation | `SynthEngine.h:50-51` |
| Filter | 12 types: LP24, LP18, LP12, LP06, HP24, BP24, Notch24, SVF LP12, SVF HP12, SVF BP12, Moog24 | `FilterHandler.h:136-210` |
| ADSRs | 2 (amp, filter) + 1 free AD envelope | `SynthVoice.h:60-62` |
| Max polyphony | 4 (`PMAX_VOICES = 4`) | `AudioUtils.h:29`, `VoiceManager.h:28` |
| Filter oversampling | 4x (upsample-interpolate-filter-decimate) | `FilterHandler.h:72-75, 150-214` |
| Ring modulation | Yes | `Vco.h:180-183, 217-225` |
| Osc sync | Yes (osc1/osc2 sync to osc3) | `Vco.h:88-90` |
| Portamento | Yes, 3 modes | `SynthVoice.h:63, 211-237` |
| Bitcrusher | Yes | `Vco.h:185-196, 228-231` |
| Per-voice cost (est.) | ~45 mul/add: 3 osc (12) + 4x oversampled filter (16) + 2 ADSR (8) + 2 LFO (6) + mix (3) | |

**Hedge:** This is the `mod-audio/mod-tal-noisemaker` repo, which is the MOD Edition port. The DSP matches upstream TAL-NoiseMaker. The ME port differences are in the UI/ports layer, not the engine. The 4-voice polyphony limit is confirmed from source.

### Wolpertinger — `kroll-j/wolpertinger` (Johannes Kroll, GPL)

| Property | Value | Source |
|---|---|---|
| Oscillators/voice | 1 (saw/rect/tri blend) | `wavegenerator.h:259-267` |
| Oscillator waveforms | saw, rectangle, triangle (blended) | `wavegenerator.h:259-267` |
| Filter | Bandpass: series of lowpass + highpass RBJ biquads | `filters.h:396-422` |
| Filter behavior | Center frequency tracks note: `cutoff = param_cutoff * freq` | `synth.cpp:79` |
| Filter passes | 1-8 (configurable) | `synth.h:395` |
| ADSR | 1 (amp) | `synth.h:397-400` |
| Max polyphony | 16 (`nVoicesMax = 16`) | `synth.cpp:280` |
| Oversampling | 1x, 8x, or 16x (per-voice Chebyshev downsampling) | `synth.cpp:278-310` |
| Per-voice cost (est.) | ~30 mul/add: 1 osc (4) + bandpass × N passes (8-16) + ADSR (4) + oversampling filter (4) | |

**Correction to doc 23 §4:** Wolpertinger is not a conventional subtractive VA. Its filter is a resonant bandpass that tracks the played note (`cutoff = param_cutoff * freq`), giving it a "bouncing" spectral character — the filter follows the pitch. This is closer to a fixed-ratio bandpass resonator than a traditional VCF. The doc 23 description was wrong.

### Calf Monosynth — `calf-studio-gear/calf` (Krzysztof Foltman, LGPL)

| Property | Value | Source |
|---|---|---|
| Oscillators/voice | 2 wavetable-ish + detune osc + unison osc | `modules_synths.h:46-48` |
| Filter types | lp12, lp24, 2lp12, hp12, lpbr, hpbr, bp6, 2bp6 | `metadata.h:186` |
| Filter topology | 2 biquad filters in series (mono) or parallel (stereo) | `modules_synths.h:49, 160-164` |
| ADSRs | 2 | `modules_synths.h:101` |
| LFOs | 2 triangle LFOs | `modules_synths.h:47` |
| Mod matrix | Yes (8 slots) | `modules_synths.h:116` |
| Polyphony | 1 (monophonic by design) | doc 23 §4 |
| Per-voice cost (est.) | ~35 mul/add: 2 osc (8) + 2 biquad filters (12) + 2 ADSR (8) + 2 LFO (4) + mod matrix (3) | |

Already Tier B from doc 23. Included here for completeness.

### MDA JX10 — `moddevices/mda-lv2` (Paul Kellett / MOD, GPL)

Already Tier B from doc 23. 2 osc/voice, integrated-sinc saw, SVF, 8 voices. Not re-read here.

## 3. Derived per-voice cost estimates

At 48 kHz, mul/add per sample per voice. These are structural estimates, not cycle-accounted.

| Plugin | Per-voice | Max voices | Total at max | Safe alongside guitar chain? |
|---|---|---|---|---|
| amsynth | ~35 | unlimited (10 default) | ~350 (at 10) | Yes |
| Obxd | ~35 | 8 | ~280 | Yes |
| Helm (no unison) | ~40 | 33 | ~1320 | No — keep <8 voices |
| Helm (7 unison × 8 voices) | ~110 | 8 | ~880 | Marginal |
| Triceratops | ~50 | 12 (18 thunderox) | ~600 (900) | Marginal at 12 |
| TAL Noise Maker ME | ~45 | 4 | ~180 | Yes |
| Wolpertinger | ~30 | 16 | ~480 | Yes |
| Calf Monosynth | ~35 | 1 | ~35 | Yes |
| MDA JX10 | ~40 | 8 | ~320 | Yes |

**Safe zone:** <500 total per-sample cost alongside a guitar chain on Pi 3/4.

## 4. Tier reconciliation with doc 23

| Plugin | Doc 23 tier | Now | Source |
|---|---|---|---|
| amsynth | D | B | `VoiceBoard.h`, `Oscillator.h`, `LowPassFilter.h`, `VoiceBoard.cpp` |
| Obxd | D | B | `Motherboard.h`, `Filter.h`, `ObxdOscillatorB.h`, `ObxdVoice.h` |
| Helm | D | B | `HelmOscillators.h`, `helm_voice_handler.h`, `helm_common.h`, `mopo/src/common.h` |
| Triceratops | D | B | `thunderox/triceratops` cloned and read |
| Wolpertinger | D | B | `kroll-j/wolpertinger` cloned and read |
| TAL Noise Maker ME | D | B | `mod-audio/mod-tal-noisemaker` cloned and read |
| Calf Wavetable | D | D | Not read (not in bake-off scope) |
| ZynAddSubFX | D | D | Not read (not in bake-off scope) |

## 5. Sources added to plugins-source.json

- `http://nickbailey.co.nr/triceratops` → `thunderox/triceratops` (upstream) and `BlokasLabs/triceratops.lv2` (modep branch, what ships on-device)
- `http://tumbetoene.tuxfamily.org` → `kroll-j/wolpertinger`
- `http://www.moddevices.com/plugins/mod_editions/tal-noisemaker` → `mod-audio/mod-tal-noisemaker`

## 6. Device pulls — deferred to editorial step

Per the plugin-editorial skill, `modgui:label`s, control port names/ranges/defaults, and screenshots are pulled at editorial time from the live device. The device was online during doc 23 research; the editorial step will SSH into `pistomp.local` and fetch these. All eight candidates have assignable control ports (verified from TTLs in doc 23 for Obxd, Helm, amsynth; Triceratops and TAL confirmed from source parameter lists; Wolpertinger confirmed from `paraminfos` array in `synth.cpp:328-350`).
