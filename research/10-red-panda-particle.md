# Red Panda Particle Replacement Report

## Summary of findings

I have all the source code in `/tmp/research-particle/`:

| Plugin | Source repo | Location |
|---|---|---|
| Granulator (Mayank) | `e7mac/faust-code` | `granulator.dsp` (Faust, 56 lines) |
| Modulay | `ninodewit/SHIRO-Plugins` | `plugins/modulay/gen_exported.cpp` (Max Gen, 377 lines) |
| bentdelay | `ssj71/infamousPlugins` | `src/bentdelay/falter.c` (130 lines) |
| deteriorate (granulator + downsampler) | `blablack/deteriorate-lv2` | `src/granulator_mono.cpp`, `src/downsampler_mono.cpp` |
| MaBitcrush | `DISTRHO/DPF-Max-Gen` | `plugins/bitcrush/gen_exported.cpp` (184 lines) |
| CycleShifter | `DISTRHO/ndc-Plugs` | `plugins/CycleShifter/DistrhoPluginCycleShifter.cpp` (200 lines) |
| mrfreeze | `romi1502/MrFreeze` | `src/Freeze.cpp`, `src/freeze_engine/freeze_engine.cpp` (FFT-based) |

## Ranking (closeness to Particle's granular + glitchy character)

1. **`Granulator.lv2`** — best granular match (scatter + density + grain size), but **missing per-grain pitch, reverse, freeze, bitcrush**. **6/10** for the core "scattered grains" signature; **~50%** of the Particle's character.
2. **`deteriorate.lv2` granulator** — second granular engine; has spread/density/AR-envelope grains but is a live-recording slicer, not delay-based, and also lacks pitch/reverse. **5/10** as a complementary granulator.
3. **`mrfreeze.lv2`** — best **freeze** match (true phase-vocoder FFT freeze, not sample-and-hold). Covers the Particle freeze mode faithfully. **4/10** overall (single mode).
4. **`Modulay.lv2`** — pitch-modulated multi-tap delay (sine-LFO vibrato/chorus on taps). Covers the **pitch-wobble** flavour of the Particle's pitch mode but NOT per-grain randomised pitch. **3/10**.
5. **`bentdelay.lv2`** — bitcrush/decimation delay (subtract a downsampled delayed copy). Covers the **bitcrush mode**; gritty, warm, lo-fi. **3/10**.
6. **`deteriorate.lv2` downsampler / `MaBitcrush.lv2`** — pure bitcrush/sample-rate reduction. Covers the **bitcrush mode** cleanly but no granular/delay context. **2/10**.
7. **`CycleShifter.lv2`** — zero-crossing cycle recorder/overdubber. Not granular, not scattered; a gentle cyclic distortion. **1/10** — does not scatter grains like the Particle.

The clear primary is `Granulator.lv2` for the scattered-grain signature, but **no single installed plugin reproduces the Particle's per-grain pitch shifting** — its defining feature. To fully cover a Particle you'd chain `Granulator` (scatter/density) + `Modulay` (pitch wobble) + `mrfreeze` (freeze) + `bentdelay` (bitcrush), and even then the per-grain randomised pitch is missing.

## Per-plugin analysis

### 1. Granulator.lv2 (Mayank Sanganeria) — `granulator.dsp` (Faust)
The closest thing to a Particle core on the device. The Faust source (`faust-code/granulator.dsp:43-56`) is a textbook scatter-granular delay: 64 parallel grain voices (`maxN=64`) each read from a 480k-sample delay buffer at a **random offset** (`grainOffset(i) = int(SH(1-1', int(delayLength*noise(i))))`), with a sine window applied per grain (`window(i) = sin(2π*grainCounter(i)/(grainLength-1))`). The `grain_density` slider (1–64) gates how many of the 64 voices are active, and `grain_length` (0.01–0.5 s) is **exactly the Particle's 10–500 ms grain range** — almost certainly not a coincidence. The `delay_length` (0.5–10 s) sets the buffer the grains scatter within. This nails the Particle's **scattered/randomised grain playback** and **density** modes.

What it **lacks**: there is **no per-grain pitch shifting** (no rate/resample multiplier per voice — `grainPosition` advances at native rate), **no reverse** (no negative grainCounter step), **no freeze** (no held-grain loop), and **no bitcrush**. The only four ports are `delay_length`, `grain_density`, `grain_length`, `mix` (`Granulator.ttl:27-63`). The random-number generator is a cheap LCG (`random = +(12345):*(1103515245)`, line 26) shared across all voices via a multi-channel noise router — functional but low-quality; you may hear correlation between grain positions. Code is elegant Faust (56 lines), DSP is cheap, but it's a single-algorithm granular scatter, not the multi-mode Particle. **Rate as primary: 6/10 — it is the only true granular scatter on the device, but it covers only ~half the Particle's feature set.**

### 2. deteriorate.lv2 granulator (Aurelien Leblond) — `granulator_mono.cpp`
A second, independent granular engine. Unlike Mayank's, this one **records live input into discrete grain buffers** (`m_recordingGrain`), applies an attack/release envelope (`gen_full_envelope`), pushes each finished grain onto a `std::vector<float*> m_grains` stack, and on playback **picks a random grain from the bank** (`m_grainIndex = rand() % m_grains.size()`, line 129) with a silence gap controlled by `grainDensity` (spacing) and a circular bank depth controlled by `grainSpread` (lines 114-118). So it has **scatter (random grain selection) + density (gap) + spread (bank depth) + AR envelope shaping** — actually a more feature-rich grain engine than Mayank's in some respects.

But it is **not a delay granulator** — it slices the live input, not a delay buffer, so there is no `delay_length` parameter and no sense of "grains scattered within a delay tail." It also has **no per-grain pitch, no reverse, no freeze**. `grainSize` range is 6 ms–10 s (wider than Particle). Memory management is sloppy: `m_recordingGrain = new float[...]` is reallocated on every grain-size change (line 108) and old grains are popped off the back of `m_grains` but **never `delete`d** — a slow leak every time `grainSpread` is reduced or grains cycle out (the bank is bounded by `grainSpread` so it's capped, but the popped pointers are leaked). `rand()` is used unseeded. Code quality: C++ but amateurish (lvtk-1, raw pointers, no smart pointers, `puts("UNKNOWN PORT YO!!")` in port connect). **5/10 as a granular alternative — useful as a second scatter voice alongside Granulator, but not a closer Particle match.**

The same `deteriorate.lv2` bundle ships a **`downsampler_mono/stereo`** (`downsampler_mono.cpp`) — a trivial sample-and-hold decimator (`if(p_loop >= ratio){p_lastInput = input}`) covering the Particle's **bitcrush/sample-rate-reduction** mode. It's 40 lines, crude (zero-order-hold, no anti-alias filter), and has one parameter (`ratio`). Lo-fi but harsh/noisy rather than musical.

### 3. Modulay.lv2 (SHIRO / Nino de Wit) — `gen_exported.cpp` (Max Gen)
**Not** a granular plugin. It is a **multi-tap modulated delay**: two delay lines (`m_delay_4`, `m_delay_5`) where the read position is modulated by a **sine LFO** (`SineCycle m_cycle_14`, `m_cycle_14.freq(m_rate_8)`, line 127-128) with `rate` (0.1–5 Hz), `depth` (0.1–3 ms), and a `morph` (0–100%) crossfader between two tap-path weightings (`mul_169`/`mul_139`/`mul_170` driven by `m_morph_11`). The `repeats` (0–110%) controls feedback gain into `m_delay_4`, `time` (20–1000 ms) is the base delay, and `tone` (500–6000 Hz) is a one-pole lowpass in the feedback path (`expr_185 = (m_tone*2π)/48000; sin_148`).

This is essentially a **chorus/vibrato-flavoured multi-tap echo** — the sine LFO modulates delay time, which causes Doppler pitch wobble on the taps. That **overlaps with the Particle's pitch mode** in the sense that you get pitch-shifted repeats, but the shift is a **smooth, periodic, global sine wobble**, not the **random per-grain pitch** that defines the Particle. The `morph` knob gives some timbral variation between tap weightings (it computes `abs(morph*0.8 ± 40)` and `rsub_135 = 80 - abs` to crossfade, lines 101-113), which can sound "unprecedented" per the TTL comment, but it's still continuous modulation, not granular. Mono in/out. Max-Gen-generated C++ is clean (Cycling '74 boilerplate, well-structured). **3/10 — use as a pitch-wobble colouring delay, not a granular replacement.**

### 4. bentdelay.lv2 (Spencer Jackson, infamousPlugins) — `falter.c`
The "infamous bent delay" is a **circuit-bent-style bitcrush/decimation delay**. The DSP is 30 lines of real logic (`falter.c:42-49`): it writes input into a 64k float ring buffer, then outputs `buf[w] - buf[(w-delay)&downmask]` where `downmask = (mask << decimate) & mask` — i.e. the **delayed read is masked to a coarser address resolution**, causing the delayed tap to alias/decimate. The `DECIMATE` ("Bend") port is an enumeration 1×–32× (shifts the mask 0–5 bits, `bentdelay.ttl:46-55`), `DELAY` 0–1400 ms, `FEEDBACK` 0–100%. Output is the **difference** between current and bent-delayed sample, so it's a gritty subtractive slapback/texture.

This **covers the Particle's bitcrush/lo-fi mode** convincingly: at high decimation the delayed tap becomes a stair-stepped, aliasing mess subtracted from the clean signal — exactly the kind of "bent" lo-fi character the Particle's bitcrush produces. It's monaural, no pitch, no granular scatter, no freeze. Code is C, minimal, `puts("UNKNOWN PORT YO!!")` debug string, hand-rolled ring buffer — crude but correct and lightweight. **3/10 for Particle coverage (bitcrush mode only), but a good-quality lo-fi character delay.**

### 5. MaBitcrush.lv2 (DISTRHO/DPF-Max-Gen) — `gen_exported.cpp`
A pure **bit-depth reduction** plugin (Max Gen example). The DSP is five lines (`gen_exported.cpp:64-72`): `out1 = ceil(in * res) / res` and `out2 = (floor(in*res + 0.5) - 0.5) / res` — i.e. quantise the amplitude to `resolution` steps (1–16 bits), with two outputs giving two quantisation centres. **No sample-rate reduction**, no delay, no granular context. Single parameter `resolution` (1–16 bits). Clean Cycling '74 boilerplate. It is the **cleanest pure bitcrush** of the bitcrush candidates (proper amplitude quantisation, unlike `deteriorate`'s zero-order-hold downsampler which is sample-rate reduction mislabeled as bitcrush), but it is a **one-trick amplitude quantiser**, not the Particle's bitcrush+granular combination. **2/10 — pair with `bentdelay` or `deteriorate/downsampler` if you want both bit-depth and sample-rate reduction.**

### 6. CycleShifter.lv2 (Niall Moody, DPF port) — `DistrhoPluginCycleShifter.cpp`
**Does not scatter grains.** It is a **zero-crossing cycle recorder/overdubber**: it waits for the input to cross zero upwards (`EnvOld < 0 && tempval >= 0`, line 154), records one "cycle" into `CycleBuffer[BUFFER_SIZE]` until the next upward zero crossing, then switches to write mode and **adds the stored cycle on top of the live input** on a loop (`a = a*fInputVolume + CycleBuffer[OutIndex]*fNewCycleVolume`, line 177) until `OutIndex` reaches `InCount`, then re-records. The TTL comment calls it "a weird kind of gentle distortion" — accurate. It is a **cyclic buffer mangler**, but the mangling is a single sustained cycle overdub, not randomised grain scatter. No pitch, no density, no freeze (the cycle loops but you can't freeze an arbitrary grain). Two params: `New Cycle Vol`, `Input Vol`. Code is clean DPF C++ (falkTX port), well-structured, but the algorithm itself is niche. **1/10 — not a Particle substitute; a one-off zero-crossing looper.**

### 7. mrfreeze.lv2 (Romain Hennequin) — `Freeze.cpp` + `freeze_engine.cpp`
The best **freeze** match on the device, and notably more sophisticated than a sample-and-hold. It is a **true phase-vocoder freeze**: `freeze_engine.cpp` does a 1024-point FFT (`nfft=1024`, `Freeze.cpp:34`), on enable captures the current magnitude spectrum (`freeze_ft_magnitude = Abs(fourier_transform)`, line 211) and the per-bin phase delta (`dphi = total_dphi - Angle(previous_fourier_transform)`, line 210), then on each hop **advances the phase by the locked delta and re-synthesises** with the frozen magnitude (`modified_fft = freeze_ft_magnitude.array() * Exp(j(total_dphi)).array()`, lines 221-222), overlapped-add with a sqrt-Hann window (`MakeSqrtHanningWindow`, line 51). This is the **standard "freeze the spectrum" PV technique** — it sustains the timbre indefinitely without the click/granular artefacts of a naive grain loop.

Compared to the Particle's freeze (which loops a grain): mrfreeze is a **spectral freeze**, not a **grain freeze** — it gives an infinitely sustained, smoothly evolving drone of the captured instant rather than a choppy looping grain. Different aesthetic, but covers the "hold a moment in time" intent of the Particle freeze mode **better than a simple sample-and-hold would**. Ports: `FREEZE` (toggle), `FREEZEGAIN` (dB), `DRYGAIN` (dB), `FADEINDURATION`, `FADEOUTDURATION` (ms). Uses Eigen + a bundled FFT (`fft.cpp`) and reads a FFTW "wisdom" file (`mrfreeze.wisdom`) from the bundle. The `Read()`/`Write()` queue architecture (`std::queue<float> input_queue`) is a bit awkward (heap allocations per buffer, `Freeze.cpp:186-243`) and has fixed `n_samples=128` at instantiate (line 103, ignores actual buffer size) — a latent bug if the host uses a different block size, but MOD-Host uses 128 so it works in practice. **4/10 for Particle coverage (freeze mode only), but a high-quality spectral freeze — the strongest single-mode fallback.**

## Bottom line

- **For the scattered-grain granular delay signature**: `Granulator.lv2` is the only real choice and it nails scatter/density/grain-size but **misses the Particle's per-grain pitch shift** — the single most identifiable Particle feature. You will not get D'Agostino's pitch-scattered glitch from any installed plugin alone.
- **For freeze**: `mrfreeze.lv2` (spectral PV freeze, excellent).
- **For pitch wobble**: `Modulay.lv2` (smooth sine-LFO pitch modulation on taps, not random per-grain).
- **For bitcrush/lo-fi**: `bentdelay.lv2` (grittiest, delay-contextured) or `MaBitcrush` + `deteriorate/downsampler` (clean bit-depth + sample-rate reduction).
- **Skip**: `CycleShifter.lv2` (unrelated zero-crossing looper).

To approximate a Particle on this device, chain `Granulator` → `Modulay` (for pitch colour) → `mrfreeze` (freeze toggle) → `bentdelay` (bitcrush), accept that randomised per-grain pitch is unavailable, and consider building/installing a richer granular plugin (e.g. a Faust port with per-grain resample) if the user needs the true Particle pitch-scatter signature.