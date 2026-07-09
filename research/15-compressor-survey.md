# Compressor Survey — pi-Stomp LV2 Ecosystem

## Background

Compressors on pi-Stomp are a blind spot. We've written 13 research docs covering fuzz, overdrive, delay, reverb, modulation, and pitch effects — but never a compressor. This doc surveys every compressor/dynamics plugin available on the device, classifies its topology, and identifies the most interesting candidates for Wirecutter-style editorial articles.

## How to evaluate a compressor

From Ovnilab.com (the definitive compressor review site) and our own source-code analysis:

### The evaluation checklist
1. **Noise floor** — compression raises the noise floor; a good comp adds minimal hiss
2. **Frequency response** — does it roll off lows? The Ross/Dynacomp OTA family famously loses low end
3. **Attack/release range** — wide enough for different jobs: ~1ms for limiting, ~50ms+ for transient preservation
4. **Envelope character** — the "action": smooth/fluid vs hard/surgical
5. **Transparency vs character** — invisible (optical) vs colored (FET 1176-style)
6. **Metering** — can you see gain reduction?
7. **Blend/mix** — parallel compression built in
8. **Sidechain** — for external EQ in the detection path
9. **Headroom** — can it handle hot input without distorting?

### Compressor topology buckets
- **VCA** — fast, clean, precise, surgical (THAT chips, dbx, Boss CS-3)
- **FET** — colored, 1176-style, harmonic enhancement (Cali76, UREI 1176)
- **OTA** — Ross/Dynacomp family, ~90% of pedal comps, guitar-friendly envelope
- **Optical** — smooth, slow, organic, "invisible" (Diamond, Demeter)
- **Tube/Vari-mu** — creamy, smooth, expensive (Manley, Markbass Compressore)
- **Feed-forward vs feed-back** — subtle architectural distinction

### Bass vs guitar
Bass is much harder to compress than guitar. Wider dynamic range, extended lows, and slap-to-fingerstyle transitions make bass the torture test. Guitar is easy — even a cheap MXR DynaComp works fine.

**Bass-specific failure modes:**
- Low-end rolloff (OTA/Ross/Dynacomp family)
- Low-frequency pumping (a low note triggers compression and swallows the highs)
- Noise floor (bassists expect one consistent low noise level)
- Transient preservation (slap needs slow attack)

**What to look for in DSP for bass-friendliness:**
- Sidechain HPF in the detector
- Multi-band compression
- Blend/mix (parallel compression)
- Flat frequency response
- Wide attack range

### Genre goals
- **Country / chicken-pickin'** — OTA, fast attack, high ratio, obvious squash
- **Funk / slap bass** — slow attack, fast release, blend, multi-band
- **Rock** — moderate ratio, medium attack, transparent VCA or FET
- **Metal** — fast attack, high ratio, tight limiting, gate
- **Shoegaze / ambient** — high sustain, squashy, often dirty/colored
- **Jazz** — transparent, gentle ratio (2:1–4:1), low noise
- **Blues** — gentle compression, preserve dynamics, slow attack, low ratio
- **Pop / mix bus** — transparent leveling, optical-style smoothness, blend

## Compressors used in pedalboards

These 8 plugins appear in pedalboards from TreeFallSound/pi-stomp-pedalboards and sastraxi/dot-pedalboards:

| Plugin | Seen | Bundle | Topology | Key features |
|--------|------|--------|----------|-------------|
| C\* Noisegate | 11x | mod-caps-Noisegate.lv2 | Gate | Simple noise gate, threshold + attack + release |
| Invada Compressor | 5x | invada-labs.lv2 | ? | No source code available (Launchpad, timed out) |
| C\* Compress | 1x | mod-caps-Compress.lv2 | VCA | Guitar-focused sustain, bright percussive character |
| MOD System-Compressor | 1x | system-compressor.lv2 | VCA | End-of-chain, streamlined, from mod-host |
| MOD Advanced-Compressor | 1x | advanced-compressor.lv2 | VCA | Same algorithm, more controls |
| DIE Compressor (a-comp) | 1x | distrho-a-comp.lv2 | ? | "A powerful mono compressor" — source not in DPF-Plugins |
| MDA Dynamics | 1x | mod-mda-Dynamics.lv2 | VCA | Compressor / Limiter / Gate in one |
| ZamComp | 1x | ZamComp.lv2 | VCA | Soft-knee, slew control, sidechain |

## Compressors NOT yet seen in pedalboards (47 plugins)

### The most interesting unseen compressors

#### 1. Molot Lite Mono — The dark horse
- **Source**: `https://github.com/bernhardrusch/molot-lite-mono-lv2`
- **Topology**: VCA with diode-modeled envelope follower
- **Lines**: ~185 (plugin) + ~272 (engine)
- **Features**: Attack (0.1-200ms) with Smooth/Sharp mode, Release (5-2000ms), Threshold (-60 to 0 dB), Knee (0-10 dB), Ratio (1:1 to 100:1), Makeup (0-24 dB), Input gain, Dry/Wet mix, Sidechain HPF (40-260 Hz or Off), ISO226:2003 phon80 low-shelf filter for sidechain
- **Why it's exciting**: Port of a commercial-quality VST compressor. The original Molot was a paid plugin. The diode-modeled envelope follower gives it analog character. Ratio goes to 100:1 (brickwall). Sidechain HPF is rare and useful for bass. The "Sharp" attack mode changes the envelope follower's response.

#### 2. Calf Mono Compressor — The studio workhorse
- **Source**: `https://github.com/calf-studio-gear/calf`
- **Topology**: VCA with soft-knee, peak/RMS detection
- **Lines**: ~15,000+ (entire Calf codebase)
- **Features**: Attack, Release, Ratio, Threshold, Knee, Makeup, Sidechain input, Blend/mix, Auto makeup, Auto release, Lookahead, Oversampling option
- **Why it's exciting**: Most feature-complete compressor on the device. The Calf suite is the most polished open-source DSP collection available. Active maintenance (2024). Lookahead and oversampling are rare in this ecosystem.

#### 3. rkr CompBand — The bass specialist
- **Source**: `https://github.com/ssj71/rkrlv2`
- **Topology**: 4-band VCA with Linkwitz-Riley crossovers
- **Lines**: ~300 (CompBand) + ~200 (Compressor engine)
- **Features**: 4 independent bands, per-band ratio/threshold/attack/release, 3 crossover frequencies, stereo link, peak/RMS toggle, hard output limiter, auto makeup
- **Why it's exciting**: The only 4-band compressor on the device. Proper Linkwitz-Riley filters (not simple one-pole). Mature codebase from Rakarrack with refined knee/dynamic ratio improvements by Ryan Billing. Perfect for bass players who need low-end preservation.

#### 4. ZaMultiComp — The mixing tool
- **Source**: `https://github.com/zamaudio/zam-plugins`
- **Topology**: 3-band VCA with Cytomic SVF crossovers
- **Lines**: ~930
- **Features**: 3 bands with independent attack/release/knee/ratio/threshold/makeup, per-band bypass, per-band listen/solo, master trim, output meters per band
- **Why it's exciting**: Per-band listen/solo is a powerful mixing feature. Uses Andrew Simper's (Cytomic) SVF filter design — higher quality than simple crossovers. Full control set per band.

#### 5. Pressure5 (Airwindows) — The character piece
- **Source**: `https://github.com/airwindows/Airwindows`
- **Topology**: Vari-µ (variable-mu) with adaptive release
- **Lines**: ~460
- **Features**: Pressure (threshold), Speed (release), Mewiness (curve blend), Output gain, Wet/Dry mix, Built-in ClipOnly2 soft clipper, Fixed biquad LP at 24kHz
- **Why it's exciting**: Most sonically unique compressor in the set. Airwindows has a cult following for analog character. The vari-µ topology with adaptive release is unlike anything else available. The "mewiness" control (blending squared vs sqrt coefficient response) is genuinely novel DSP.

### Other notable unseen compressors

#### GxCompressor (guitarix)
- **Source**: `https://github.com/brummer10/guitarix` (trunk/src/faust/compressor.dsp)
- **Topology**: VCA with soft-knee, peak detecting
- **Lines**: 83 (Faust)
- **Features**: Attack (0-1s), Release (0-10s), Ratio (1-20), Threshold (-96 to 10 dB), Knee (0-20 dB), Makeup, GR meter
- **Verdict**: Clean Faust code by Albert Graef. Lightweight CPU. No sidechain, no blend, no oversampling. Good general-purpose compressor, nothing special.

#### GxMultiBandCompressor (guitarix)
- **Source**: `https://github.com/brummer10/guitarix` (trunk/src/LV2/gx_mbcompressor.lv2/)
- **Topology**: 3-band VCA with Linkwitz-Riley crossovers
- **Lines**: ~200 (Faust-generated)
- **Features**: 3 bands with per-band mode/ratio/threshold/knee/attack/release/makeup, crossover frequency controls
- **Verdict**: Functional multi-band. Less feature-rich than rkr CompBand or ZaMultiComp (no listen/solo, no bypass per band).

#### SC1 (SWH)
- **Source**: `https://github.com/swh/lv2` (plugins/sc1-swh.lv2/plugin.xml)
- **Topology**: Soft-knee RMS compressor
- **Lines**: ~80 (embedded in XML)
- **Features**: Attack (2-400ms), Release (2-800ms), Threshold (-30 to 0 dB), Ratio (1-10), Knee (1-10 dB), Makeup (0-24 dB)
- **Verdict**: Clean, well-documented C by Steve Harris. Elegant quadratic soft-knee implementation. Low CPU. No sidechain, no blend. A solid, no-frills compressor.

#### TAP Mono/Stereo Dynamics
- **Source**: `https://github.com/moddevices/tap-lv2` (dynamics/tap_dynamics.c)
- **Topology**: Table-driven dynamics processor, RMS detecting
- **Lines**: ~830
- **Features**: 15 modes (compressors 2:1–20:1, limiter, expanders, noise gates), Attack (4-500ms), Release (4-1000ms), Offset gain, Makeup gain
- **Verdict**: Unusual table-driven approach. No ratio/threshold/knee controls — uses pre-defined curves. Stereo version has 3 linking modes. Versatile but less precise than standard compressors.

#### MDA MultiBand
- **Source**: `https://github.com/moddevices/mda-lv2` (src/mdaMultiBand.cpp)
- **Topology**: 3-band VCA with simple one-pole crossovers, M/S processing
- **Lines**: ~390
- **Features**: 3 bands with per-band drive and output trim, global attack/release, crossover frequencies, listen mode, stereo width, M/S mode toggle
- **Verdict**: Older code (1999-2000) by Paul Kellett. Simple one-pole crossovers mean significant band overlap. M/S processing mode is unique and useful. The "drive" parameter (1/(1+drive*envelope)) is a soft-knee VCA response.

#### ZamCompX2
- **Source**: `https://github.com/zamaudio/zam-plugins` (plugins/ZamCompX2/)
- **Topology**: VCA with soft-knee and slew control
- **Lines**: ~380
- **Features**: Attack (0.1-100ms), Release (1-500ms), Knee (0-8 dB), Ratio (1-20), Threshold (-80 to 0 dB), Makeup (0-30 dB), Slew control, Sidechain input, GR meter, Output meter
- **Verdict**: Clean DPF C++ by Damien Zammit. The "Slew" parameter adds extra attack time on rapid signal changes, reducing distortion on transients. Proper sidechain input. Good all-around compressor.

#### rkr Compressor / rkr Sustainer
- **Source**: `https://github.com/ssj71/rkrlv2` (src/Compressor.C)
- **Topology**: VCA with soft-knee and dynamic attack/release in limiting mode
- **Lines**: ~300
- **Features**: Attack (1-100ms), Release (1-1000ms), Ratio (1-20), Threshold (-60 to 0 dB), Knee (0-100%), Output with auto makeup, Stereo link, Peak/RMS toggle, Hard output limiter, Hold timer
- **Verdict**: Well-commented C++ by Ryan Billing. Dynamic attack/release in limiting mode is sophisticated — attack shortens and release lengthens as signal approaches 0dB. The Sustainer variant is the same engine with sustain-oriented presets.

## Source repositories

All 44 compressor/dynamics bundles now have source URLs in `src/_data/plugins-source.json`. Key repos:

| Repo | Plugins |
|------|---------|
| `github.com/moddevices/caps-lv2` | C\* Compress, C\* CompressX2, C\* Noisegate, C\* Spice |
| `github.com/moddevices/mda-lv2` | MDA Dynamics, MDA MultiBand, MDA Limiter, MDA De-ess, MDA Loudness, MDA Splitter, MDA Transient |
| `github.com/moddevices/tap-lv2` | TAP Mono/Stereo Dynamics, TAP DeEsser, TAP Scaling Limiter |
| `github.com/zamaudio/zam-plugins` | ZamComp, ZamCompX2, ZaMultiComp, ZaMultiCompX2, ZamGate, ZamGateX2 |
| `github.com/brummer10/guitarix` | GxCompressor, GxMultiBandCompressor, GxExpander |
| `github.com/ssj71/rkrlv2` | rkr Compressor, rkr Sustainer, rkr CompBand, rkr Expander |
| `github.com/calf-studio-gear/calf` | Calf Compressor, Calf Mono Compressor, Calf Gate |
| `github.com/DISTRHO/DPF-Plugins` | DIE Compressor, DIE Expander |
| `github.com/bernhardrusch/molot-lite-mono-lv2` | Molot Lite Mono |
| `github.com/airwindows/Airwindows` | Pressure5, ClipOnly, ClipOnly2 |
| `github.com/swh/lv2` | SC1, SWH Gate |
| `github.com/antanasbruzas/abGate` | abGate |
| `github.com/brummer10/HarmonicExciter` | Harmonic Exciter |
| `launchpad.net/invada-studio` | Invada Compressor (source unavailable) |
| `github.com/moddevices/mod-host` | MOD System/Advanced Compressor, MOD System/Advanced Noise Gate, VeJa Compressor |

## Proposed article structure

1. **"The Bass Compressor"** — Invada (5x, most-used), C\* Compress, DIE Comp, SC1, TAP Dynamics. Flat response, low noise, blend control. For bassists who need transparent sustain without low-end loss.

2. **"The Guitar Compressor"** — GxCompressor, rkr Sustainer, ZamComp. OTA-style, colored, squashy. For country/funk obvious compression.

3. **"Multi-band / Bass Utility"** — rkr CompBand, ZaMultiComp, GxMultiBandCompressor, MDA MultiBand. For slappers, tappers, extended-range players who need low-end preservation.

4. **"The Studio Workhorse"** — Calf Mono Compressor, Molot Lite Mono, ZamCompX2. Feature-rich, sidechain-capable, pro-grade. For recording and mix bus.

5. **"The Character Compressor"** — Pressure5 (Airwindows), MDA Dynamics (dirty modes). For shoegaze, ambient, and anyone who wants their compression to sound like something.
