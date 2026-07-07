# Peachfuzz Replacement Research — LV2 Plugin Ranking

I cloned the sources: `guitarix` (brummer10) for `gx_fuzzface`, `gx_fuzzfacefm`, `gx_muff`; `brummer10/GxKnightFuzz.lv2` for `gx_KnightFuzz`; `brummer10/GxFz1s.lv2` for `gx_maestro_fz1s`; `pjotrompet/Freaked` for `Freakclip`; `moddevices/mod-distortion` for `mod-bigmuff`. The `gx_*` plugins are Faust-generated C++ from `trany.lib` (transistor transfer tables); `mod-bigmuff` is hand-written C++ SPICE-style circuit sim.

### Ranking (best Peachfuzz match → worst)

**1. `gx_fuzzfacefm.lv2` — Gx Fuzz Face Fuller Mod (BEST MATCH)**
Topology: two `tranystage(TB_KT88_68k,…)` blocks — a true transistor-pair Fuzz Face simulation using precomputed transfer/resistance tables (`Ftrany`/`Rtrany` in `trany.h`) with Newton-style feedback (`tranyVp = x <: +(VkC - vplus) ~ …`). This is genuine analog circuit modelling, not a cheap waveshaper. Clipping is the cascaded transistor pair (symmetric-ish, both halves identical), giving thick even+odd harmonics. Controls: DRIVE, FUZZ, INPUT, LEVEL — the Fuller mod adds an input gain stage that fattens the front end. No bias-gate splat; the saturation is controlled and warm. Tone is mid-present (no scooping). Of all candidates this is the closest to the Peachfuzz's germanium-pair, fat-but-controlled solo character.

**2. `gx_fuzzface.lv2` — Gx Fuzz Face (JH-2)**
Same `tranystage` transistor-pair engine, but with `TB_7199P_68k` tables and **three** cascaded stages (vs two in the FM). Same circuit-modelling quality. Slightly rounder and less compressed than the FM because there's no extra input gain stage; controls are just FUZZ + LEVEL. Still a real Fuzz Face — fat, vintage, warm, no gating splat. A close second; A/B it against the FM.

**3. `gx_KnightFuzz.lv2` — Gx KnightFuzz**
`dsp/KnightFuzz.cc` uses an `asymclip()` with **two separate lookup tables** (`clip1` for positive half, `clip2` for negative) — i.e. deliberately **asymmetric** clipping, which generates strong even harmonics = fatness. This is the right harmonic signature for a Peachfuzz. However it's a sampled-waveshaper approach (precomputed 100-point transfer table) rather than a full transistor circuit sim, so it's a notch below the Fuzz Face plugins in analog fidelity. A high-order IIR pre/post filter shapes the tone. Only INPUT + VOLUME controls — no bias tweak. Good fat solo tone, but less "vintage germanium" and more "modern asymmetric fuzz."

**4. `gx_maestro_fz1s.lv2` — Gx Maestro FZ-1S**
`dsp/maestro_fz1s.cc` uses `symclip()` — a **single** table for both halves → **symmetric** clipping → more odd harmonics, buzzier than Peachfuzz. It does have bias-gating behaviour: piecewise quadratic terms (`fTemp7`/`fTemp8`) kick in near -0.72 and +0.8, creating a mild gate/cleanup. A FILTER toggle (iSlow2) switches filter paths. It's a credible "fat solo" voice but the FZ-1S is mid-forward and harder/clippier than the Peachfuzz's warm controlled saturation; the gating can lean toward splat at extreme settings. A workable alternative, not a Peachfuzz twin.

**5. `mod-bigmuff.lv2` — Open Big Muff (MOD)**
The highest-quality **circuit simulation** of the set: `bigmuff/src/Distortion_BigMuff.cpp` implements the full BMP schematic with real component values (R1=56k, C1=150n, …), bilinear-transform IIR filters for each stage, 2×/4× oversampling, and a true anti-parallel **diode** clipper using `SINH`/`COSH` with one-step Newton iteration (`Clip()`). But it is a Big Muff: **symmetric** diode clipping (odd harmonics), **scooped-mid** tone stack (Filter4 is the real BMP tilt EQ), and violin-like sustain. That is explicitly *not* the Peachfuzz character — it's the scooped, sustaining sound the brief says to avoid. Use it when you want Gilmour/Smokey; not a Peachfuzz stand-in.

**6. `gx_muff.lv2` — Gx Muff**
Surprise: `muff.dsp` is **only the Big Muff tone stack** — a parallel 1856 Hz highpass × 408 Hz lowpass mixer controlled by TONE. There is **no clipping stage at all**; the ttl even declares it `lv2:EQPlugin`. It's a filter, not a fuzz. Useless as a Peachfuzz replacement on its own (you'd need to pair it with a separate distortion).

**7. `Freakclip.lv2` — Freaked/Freakclip**
`Faustsrc/FreakClip.dsp` is a cheap waveshaper: `Distort = _/Drive:((_*Delay:_@1:_)-_~_)` — a one-sample feedback delay inside the drive path (resonant/oscillating distortion), followed by a symmetric hard-clip `Thresh = max(clip:_*-1):min(clip*1)` and a DC blocker. No circuit modelling, no transistor character, **symmetric** hard clipping = buzzy/odd, and the internal feedback delay gives a weird resonant edge rather than fat warmth. Furthest from the Peachfuzz's vintage germanium fatness.

### Summary
For a fat, thick, traditional solo tone matching the Frantone Peachfuzz, start with **`gx_fuzzfacefm.lv2`** and A/B against **`gx_fuzzface.lv2`** — both are genuine transistor-pair Fuzz Face simulations with warm, controlled (non-splatty) saturation and no mid scoop. **`gx_KnightFuzz.lv2`** is a good third choice if you want a fatter even-harmonic asymmetry. Avoid `mod-bigmuff` (scooped) and `gx_muff` (no clipping). `Freakclip` and `maestro_fz1s` are buzzier/gated rather than fat-vintage.