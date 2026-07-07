# TimeLine delay-side replacement: LV2 plugin ranking

Research complete. All four sources downloaded to `/tmp/research-timeline/`:

- `DISTRHO-Ports/ports-juce5/tal-dub-3/` — TAL-Dub-3 (Patrick Kunz source, DISTRHO LV2 port)
- `bolliedelayxt.lv2/` — MrBollie/bolliedelayxt.lv2
- `SHIRO-Plugins/plugins/modulay/` — ninodewit/SHIRO-Plugins (Modulay)
- `infamousPlugins/src/bentdelay/` — ssj71/infamousPlugins (bentdelay)

## Ranking

| # | Plugin | TimeLine coverage | Best role |
|---|--------|-------------------|-----------|
| 1 | **TAL-Dub-3** | ~6/12 machines | Atmospheric ambient flagship |
| 2 | **bolliedelayxt** | ~5/12 machines | Versatile stereo workhorse |
| 3 | **Modulay** | ~2/12 machines | Modulation specialist |
| 4 | **bentdelay** | 1/12 machines | Lofi/Bitcrush only |

**Winner: TAL-Dub-3** — best-sounding AND most versatile, and confirmed as the best single pick for atmospheric ambient. bolliedelayxt is the most *feature-flag-complete* on paper but lacks sonic character; TAL-Dub-3 has the engineering depth and the warm, evolving texture that D'Agostino-style ambient demands.

## Per-plugin analysis

### 1. TAL-Dub-3 — TAL Software (Patrick Kunz), DISTRHO LV2 port
`Engine/Delay.h`, `Engine/DelayHandler.h`, `Engine/TapeSlider.h`

The only professionally-engineered plugin of the four — original source from TAL Software, ported via DISTRHO/JUCE. **Delay line cleanliness is excellent**: the delay runs at **2× oversampling** (linear-interp upsample on write, 9-tap FIR `Decimator9` on read — `interpolatorlinear.h`, `Decimator.h`), and the read uses **allpass-style fractional interpolation** (Dattorro's `*ptr2 + *ptr*(1-frac) - (1-frac)*z1` form, `Delay.h:246`) which is noticeably cleaner than plain linear for modulated reads. The feedback path is genuinely sophisticated: **DC block + 6dB Houvilainen/Moog-ladder lowpass** (`Filter6dB.h`) with tanh saturation, plus a `tanhApp` shaper on the feedback sum (`Delay.h:259`) — this is what gives it the warm "analog/BBD" character. **Modulation layer**: the `TapeSlider` (`TapeSlider.h`) linearly slews the delay time over ~0.5s whenever the target changes — this *is* the tape wow/flutter layer, producing pitch modulation as the read pointer glides. It's not a free-running LFO chorus, it's tape-style time-mod, which is exactly the TimeLine "Tape" machine's character. Stereo is two fully independent L/R delay lines with a "twice" toggle (R = L/2) — wide stereo textures possible but **no ping-pong, no crossfeed**. **No multi-tap**, no bitcrush, no reverse, no ducking, no pattern. Tempo sync covers 18 musical divisions (1/16–2/1, triplets, dotted — `Engine.h:41-60`). **Machines covered**: Digital (clean), Tape (TapeSlider), Analog (filter+saturate), Modern (filter mod via cutoff), Tube (saturation), and the oversampled base gives a quality floor for everything else. Code quality: production-grade, header-only DSP, ~1400 lines, the reference standard here.

### 2. Bollie Delay XT — Thomas Ebeling (MrBollie)
`src/bollie-delay-xt.c`, `src/bolliefilter.c`

The most *feature-flag-complete* on paper but a notch below TAL-Dub-3 in sonic engineering. **~880 lines of careful, well-commented C** — enthusiast/student-grade but genuinely well-built, not a toy. **Interpolation**: plain linear (`interpolate()`, `bollie-delay-xt.c:439`) — functional but not oversampled, so modulation artifacts are more audible than TAL. **Modulation layer**: a **sine LFO** modulates the delay read offset (depth 0–5 ms, rate 0.1–2 Hz, `lfo_curphase`/`lfo_offset`) with a **per-channel phase switch** (`cp_mod_phase` flips ch2 180°) — this is a proper chorus/flanger pitch-mod layer, arguably more flexible than TAL's TapeSlider for "Modern" machine textures, but smoother/less characterful than tape wow. **Filter modulation is its real strength**: separate **HPF+LPF biquads in BOTH the pre-delay path AND the feedback path**, each with freq+Q controls (`bolliefilter.c`) — you can dial in dark analog repeats or bright filtered sweeps, covering TimeLine "Sweep" and "Analog" machines well. **Stereo**: true stereo with **ping-pong** (sums L+R at -6dB and routes through alternating buffers, `bollie-delay-xt.c:771`) and a **crossfeed** control between channels — best stereo/width coverage of the four. Tempo sync per-channel with dotted/triplet divisions. A **feedback limiter** (`lim_envelope`) prevents runaway — partial "Duck" character. **No multi-tap, no tape/BBD wow, no bitcrush, no reverse**. Best used as the versatile stereo workhorse alongside TAL-Dub-3 for character.

### 3. Modulay — Nino de Wit (SHIRO-Plugins)
`plugins/modulay/gen_exported.cpp`

**Auto-generated C++ from a Max/MSP Gen~ patch** (`gen_exported.cpp`, the Cycling '74 header is literal) — not hand-written DSP. This is both its charm and its limit. The core is a **single mono delay line** (`m_delay_4`/`m_delay_5`, 44100-sample buffer) with feedback, **linear-interpolation reads** (`read_linear`), a **one-pole tone lowpass in the feedback path** (`mix_190 = m_y_2 + clamp_149*(tap - m_y_2)`, `gen_exported.cpp:121`), and a **DC blocker**. The standout is the **Morph knob** (0–100): it crossfades the LFO depth and offset across regimes, and the shipped presets (`Modulay-chorus`, `-vibrato`, `-flanger` in mod-lv2-data) confirm it morphs between chorus → vibrato → flanger delay-modulation types. **LFO is a sine** (`SineCycle m_cycle_14`) modulating delay time at 0.1–5 Hz, depth 0.1–3 ms. This is a **focused modulation delay** — it does the TimeLine "Modern" machine and the pitch-shimmery ambient wobble better than bolliedelayxt's generic LFO, but it's **mono, no tempo sync, no multi-tap, no tape wow, no bitcrush, no reverse, no ping-pong**, and the tone control is a single one-pole filter (vs Bollie's four biquads). Code quality: generated, unreadable as "design," but the underlying Max patch was clearly built with intent. Narrow but does its one thing (modulated ambient delay) well — pair with TAL-Dub-3 for ambient, don't use as the only delay.

### 4. bentdelay — Spencer Jackson (infamousPlugins)
`src/bentdelay/falter.c`

A deliberate **one-trick lo-fi toy**: 130 lines, mono, no modulation, no sync, no tempo, no multi-tap, no tape, no reverse, no ping-pong. Its single idea is clever: a 16-bit ring buffer (`mask = 0xFFFF`) where the read pointer is masked with a **bit-shifted downsample mask** (`downmask = (mask << decimate) & mask`, `falter.c:37`) — the "Bend" control picks 1×/2×/4×/8×/16×/32× decimation, and the output is **input minus the aliased delayed signal** (`out[i] = buf[w] - buf[(w-delay)&downmask]`, `falter.c:45`), producing gritty subtractive bitcrush. **No interpolation** — the aliasing is the point. This is the *only* plugin here that covers the TimeLine **"Lofi" machine**, and it does it with genuine character (the subtraction gives a phase-inverted "circuit-bent" grit that bitcrush alone doesn't). But it cannot serve as a general delay — no clean mode, no modulation, no stereo. Code quality: minimal-by-design, the mask trick is inventive, but it's a color box, not a workhorse. Use it *alongside* TAL-Dub-3 when you specifically want the Lofi machine.

## Coverage matrix vs TimeLine machines

| TimeLine machine | TAL-Dub-3 | bolliedelayxt | Modulay | bentdelay |
|---|---|---|---|---|
| Digital (clean) | ✅ oversampled | ✅ | ✅ | ❌ |
| Modern (filter mod) | ✅ cutoff | ✅ LFO+filters | ✅✅ morph | ❌ |
| Tape (wow/flutter) | ✅ TapeSlider | ⚠ smooth LFO only | ⚠ sine only | ❌ |
| Tube | ✅ tanh sat | ⚠ limiter | ❌ | ❌ |
| Analog (BBD) | ✅ filter+sat | ✅ fb filters | ⚠ | ❌ |
| dBucket/BBD alias | ⚠ via sat | ❌ | ❌ | ⚠ intentional |
| Sweep (filter) | ⚠ manual | ✅ filters | ❌ | ❌ |
| Lofi (bitcrush) | ❌ | ❌ | ❌ | ✅✅ |
| Pattern (multi-tap) | ❌ | ❌ | ❌ | ❌ |
| Ice (shimmer/oct) | ❌ | ❌ | ⚠ chorus-y | ❌ |
| Reverse | ❌ | ❌ | ❌ | ❌ |
| Duck (ducking) | ❌ | ⚠ limiter | ❌ | ❌ |

**No single plugin covers the multi-tap Pattern, Ice shimmer, Reverse, or Duck machines.** For those you'd need to chain: TAL-Dub-3 (base delay) + bentdelay (Lofi) + a reverse/pitch plugin (separate research). For pure atmospheric-ambient delay — the TimeLine's Tape/Modern/Analog/Tube territory that D'Agostino leans on — **TAL-Dub-3 alone is the right answer**, with bolliedelayxt as the stereo ping-pong complement when width matters.