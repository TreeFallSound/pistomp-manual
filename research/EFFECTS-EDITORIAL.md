# Effects Editorial — A Cymbals Eat Guitars / Joseph D'Agostino Starter Kit

A guide to recreating elements of Joseph D'Agostino's (Cymbals Eat Guitars)
shoegazey indie rock tone using the LV2 plugins shipped on pistompOS. This is
front-line research: every candidate below has had its DSP source code read,
its topology classified, and its sound character inferred from the
implementation — not just from the plugin's name. Where multiple candidates
exist for one reference pedal, they're ranked, and the also-rans are explained
so you can make your own call.

This is a starting point for your own write-up and pedalboard, not the final
word. Where I couldn't find a true match on the device, I say so.

---

## Gain & Fuzz

### Frantone Peachfuzz — fat, thick traditional fuzz solo tone

The Peachfuzz is a vintage-style fuzz with germanium-transistor character,
bias gating, and a warm, controlled (not splatty/collapsing) saturation. It
is NOT a scooped Big Muff, NOT a splatty gated fuzz. Fatness comes from
cascaded transistor-pair clipping with strong even harmonics; the gating is
subtle cleanup, not the violent splat of a bias-collapsed op-amp drive.

**Use: `gx_fuzzfacefm.lv2` (Gx FuzzFace Fuller Mod).** This is the clear
winner. Its DSP is a genuine transistor-pair Fuzz Face simulation — two
cascaded `tranystage` blocks using precomputed transfer/resistance tables
derived from SPICE-level transistor modelling, with Newton-style feedback.
The Fuller mod adds an input gain stage that fattens the front end. Clipping
is cascaded-transistor (symmetric-ish, both halves identical) giving thick
even+odd harmonics. No bias-gate splat — the saturation is controlled and
warm. Tone is mid-present, no scooping. Of all the candidates this is the
closest to the Peachfuzz's germanium-pair, fat-but-controlled solo character.

**A/B against `gx_fuzzface.lv2` (Gx FuzzFace, JH-2).** Same
`tranystage` transistor-pair engine, but with `TB_7199P_68k` tables and three
cascaded stages (vs two in the FM). Same circuit-modelling quality. Slightly
rounder and less compressed than the FM because there's no extra input gain
stage; controls are just FUZZ + LEVEL. Still a real Fuzz Face — fat,
vintage, warm, no gating splat. A close second.

**Third choice: `gx_KnightFuzz.lv2`.** Uses `asymclip()` with two separate
lookup tables — one for the positive half, one for the negative — so the
clipping is deliberately **asymmetric**, which generates strong even
harmonics = fatness. This is the right harmonic signature for a Peachfuzz.
However it's a sampled-waveshaper approach (precomputed 100-point transfer
table) rather than a full transistor circuit sim, so it's a notch below the
Fuzz Face plugins in analog fidelity. A high-order IIR pre/post filter shapes
the tone. Only INPUT + VOLUME controls — no bias tweak. Good fat solo tone,
but less "vintage germanium" and more "modern asymmetric fuzz."

**Avoid for this slot:** `mod-bigmuff.lv2` is the highest-quality circuit
simulation of the set — full BMP schematic with real component values,
bilinear-transform IIR filters, 2×/4× oversampling, true anti-parallel
diode clipper — but it's a Big Muff: symmetric diode clipping (odd
harmonics), scooped-mid tone stack, violin-like sustain. That is explicitly
*not* the Peachfuzz character. `gx_muff.lv2` is a surprise dud: it's only
the Big Muff **tone stack** (a parallel 1856 Hz highpass × 408 Hz lowpass
mixer controlled by TONE) with **no clipping stage at all** — it's declared
as an `lv2:EQPlugin`. Useless as a fuzz on its own. `Freakclip.lv2` is a
cheap waveshaper (one-sample feedback delay inside the drive path, then
symmetric hard-clip) with no circuit modelling and no transistor character —
buzzy/odd, furthest from the Peachfuzz's vintage germanium fatness.
`gx_maestro_fz1s.lv2` uses `symclip()` (symmetric → more odd harmonics,
buzzier) with a piecewise-quadratic gate that can lean toward splat at
extreme settings — mid-forward and harder than the Peachfuzz's warm
controlled saturation. A workable alternative voice, not a Peachfuzz twin.

### Smallsound/Bigsound Fuck Overdrive — gnarly, blown-out, great with chords

The SS/BS Fuck is a modified op-amp drive with a **bias control** that, at
extreme settings, causes a characteristic "collapsing" / splatty / gating
artefact. It is NOT a clean Tube Screamer, NOT a Big Muff. Key sonic
signature: op-amp saturation + adjustable bias-collapse + retains note
separation under heavy gain (good for chords).

**Use: `gx_supersonic.lv2`.** Ironically the closest match is a power-amp
model, not a dirt pedal. The DSP is a "Push Pull 6L6" power-amp clipper: the
signal hits a 5th-order IIR prefilter then a piecewise-linear clipper with
**two distinct lookup tables** — `supersonic_table` (positive half,
saturates at +0.474) and `supersonic_neg_table` (negative half, saturates at
−0.467) — and the positive/negative tables are **not mirror images**, so the
clipping is **asymmetrical → rich even harmonics → that "gnarly, blown-out
but chord-articulate" character** the Fuck is loved for. Op-amp-style
saturation, not transistor fuzz. Ports are `GAIN` (exponential drive into the
clipper, `0.0011·(exp(2·g)−1)`), `BASS`/`TREBLE` (tone-stack IIR coefficient
drivers), and `VOLUME` (post-clip gain) — all 0–1, slew-limited via one-pole
smoothers. The standalone `GxSupersonic.lv2` build dropped the ±30 dB
`Pregain`/`Gain` pair from guitarix main tree's `poweramp_ctrl` wrapper and
added the BASS/TREBLE tone stack the main-tree module doesn't have; the two
builds share only the clipper tables. GAIN stays articulate under heavy drive
— chords don't turn to mush.

**The one missing Fuck feature: the bias-collapse control.** None of the
candidates has a parameter that shifts the waveshaper's operating point or
duty-cycle modulates the output. You can approximate the Fuck's collapsing
artefact by automating `gx_supersonic`'s `GAIN` (exponential drive into the
clipper) with a slow envelope, but you won't get the real thing from any
installed plugin.

**Avoid for this slot:** `CollisionDrive.lv2` is the best *engineered*
plugin of the set — an honest Horizon Devices Precision Drive clone with a
real noise gate — but it is openly a **Tube Screamer derivative** (the
README says "slightly modified Tube Screamer"; `ts9nonlin.cc` is generated
by `tools/ts9sim.py`). Symmetric-ish op-amp soft clip, no bias/offset
parameter, no collapse. It's the "metal tightener" — the **opposite** of
the Fuck's open, blown-out, splatty character. High-quality code, faithful
analog modelling, but an impostor for this use case. `gx_AxisFace.lv2` is a
silicon Fuzz Face derivative (single-ended NPN transistor fuzz, not op-amp)
with symmetric `symclip()` → mostly odd harmonics, less chord articulation
than the Fuck's asymmetric op-amp clip. The `ATTACK`/`SMOOTH` sliders only
retune the tone filter's IIR coefficients — they shape EQ, not the clipper's
operating point. No bias control, no collapsing artifact. Gnarly and
aggressive in the right register but it's a vintage fuzz voice, not
Fuck-voiced. `gx_fenderizer.lv2` is a clean-to-crunch Fender solid-state amp
sim — tube-style symmetric soft clip, polite, no bias control, no gating, no
gnarl. Wrong category entirely — it's what you'd put *after* the Fuck, not
in its place. `Freakclip.lv2` is a ~15-line waveshaper with `min/max`
brickwall clipping and no analog modelling — buzzy, static,
intermodulation-heavy, destroys chord clarity. Avoid.

### Ibanez TS9 / TS10 Tube Screamer — midrange boost, often stacked with fuzz

The Tube Screamer signature: op-amp with symmetric soft clip in the feedback
loop, a characteristic mid-hump (~720 Hz peak) active tone stack, and a
low-cut before the clipper that tightens low end. D'Agostino uses it as a
stacked boost before his fuzz pedals.

**Use: `gxts9.lv2` (GxTubeScreamer).** This is a faithful, SPICE-derived
model of the actual TS-9. The Faust source is explicitly "based on a circuit
diagram of the Ibanez TS-9 and a mathematical analysis published by Tamás
Kenéz." The pre-clip high-pass `tf1` uses `R1=4700 Ω`, `C=0.047 µF` → **fc =
720.5 Hz** — computed from the declared values, this is *exactly* the Tube
Screamer mid-hump frequency, the whole reason the pedal cuts bass and boosts
mids before the clipper. The clipper is the op-amp feedback-loop nonlinearity
(`_ <: _ - ts9nonlin(X2-_) :> _`), and the `ts9nonlin` table is generated by
`tools/ts9sim.py`, which solves the actual diode equation `Is·(exp(D/mUt) −
exp(−D/mUt))` with `Is=10 pA`, `mUt=30 mV` via `scipy.optimize.brentq` against
`R2 = 51 kΩ + 500 kΩ·drive` — the TS-9's gain pot with the real diode pair in
the feedback path. Tone control is a 1-pole low-pass (default 400 Hz, range
100–1000 Hz) — the active tone stack's high-cut. This plugin hits every Tube
Screamer signature. Set Drive low (~0.2–0.3), Level near unity, Tone ~400 Hz,
place it *before* the fuzz in the MOD-Host chain.

**Fallback: `gx_sd1sim.lv2` (GxSD1 / "Super Overdrive").** The Boss SD-1 is
a TS-9 derivative, and the code reflects that — same architecture, same 720
Hz pre-clip HPF, same feedback-clipper structure. Two real differences: the
drive taper is exponential (`4.75e-5·(exp(5·drive)−1)`) vs TS-9's linear — the
SD-1 pot sweep feels faster; and there's an extra second-order pre-clip
filter section modelling the SD-1's extra input coupling network. **The
critical caveat:** a real Boss SD-1's defining feature is *asymmetric*
clipping (one extra diode → even harmonics, "harder" feel). This model's
`sd1nonlin` uses `copysign(f, -x)` — the same odd-symmetric table form as
TS-9. **The diode asymmetry is NOT modeled.** So it's effectively a TS-9
with a different drive taper. Fine as a stacked boost, but it's mis-named:
you won't get the real SD-1's asymmetric even-harmonic character.

**Avoid for this slot:** `gx_overdriver.lv2` is not TS-family — no op-amp
feedback loop, no 720 Hz pre-clip HPF, no Kenéz/TS-9 lineage. It's a two-band
split filter followed by a fixed lookup-table waveshaper (a hand-set static
curve, not solved from a diode equation), feed-forward clipping (waveshaper
after the filter, not feedback-loop). No mid-hump, no active tone stack, no
DRIVE pot. A cheap-ish "overdrive flavour" DSP, not an analog-circuit
model. `gx_clubdrive.lv2` is an **EF86 pentode preamp model**, not a Tube
Screamer and not a Blues Driver/Klon derivative — the README states it
outright. It upsamples to 96 kHz, runs a 5th-order preamp filter into a pair
of asymmetric pentode transfer tables (genuinely asymmetric, but modelling a
pentode's grid, not silicon diodes), and has no 720 Hz mid-hump, no
TS-style active tone stack, no feedback-loop diode clipper, and **no TONE
control at all**. It'll colour the fuzz differently (pentode compression +
asymmetric soft clip) and has no mid-hump to push the fuzz into the
D'Agostino frequency pocket. Reject for this use case.

---

## Modulation

### Boss DC-2W Dimension C — lush, wide, almost-not-chorus stereo widening

The Dimension C is a **stereo width** effect more than a traditional chorus.
It has *no depth knob*, uses a fixed/switched set of two LFOs (one per
channel) with carefully chosen rates (~0.5 Hz and ~0.8 Hz) and phase offsets,
and a *single very small delay modulation* producing subtle detune that
widens the stereo image without sounding "chorused". The DC-2W adds manual
mode. Crucially: it must sound wide and lush, NOT warbly/obvious like a
standard chorus.

**Use: `string-machine-chorus-stereo.lv2`.** This is the surprise winner —
architecturally a Dimension C. It's a literal Solina String Ensemble chorus,
the *same architectural family* as the Boss DC-2 (both descend from the
BBD-based "ensemble" tradition: multiple LFOs at slow, mutually offset
phases, summed through a stereo sign matrix to cancel pitch wobble while
reinforcing width). It has 3 phases per "row" (0°, 120°, 240°), **two
independent LFO rows**: Rate 1 default **6 Hz** (3–9), Rate 2 default **0.6
Hz** (0.3–0.9). The slow row at 0.6 Hz is *exactly* in the Dimension C's sub-1
Hz territory. Delay modulation depth is 5 ms base ± **1 ms** —
single-digit-ms, exactly the DC-2's "barely there" detune. And the three
delay lines per side are summed through a sign matrix: `L = line1 + line2 −
line3`, `R = line1 − line2 − line3` — the classic ensemble trick where
phase-offset LFOs partially cancel in the side domain, so you get width
*without* the obvious pitch swim of a standard chorus. It also has a real
185-stage TCA-350-Y bucket-brigade model with clock-rate modulation for
authentic BBD coloration. Start with Rate 1 ≈ 6 Hz / Depth 1 ≈ 30%, Rate 2 ≈
0.6 Hz / Depth 2 ≈ 40%, Global Depth to taste, analog mode on.

**Stack with `mod-caps-Wider.lv2` (C* Wider) for the "manual" mode.** Wider
is a static stereo image synthesizer inspired by the Orban 245F — it takes a
mono input, runs it through three allpass filters (150, 900, 5000 Hz, Q=0.707)
to synthesize a "side" signal, then M/S matrixes `L = m + s`, `R = m − s`.
Zero modulation, zero LFOs — instant stereo width with zero chorusing
artifact, but **static**. It won't breathe or move like a Dimension C. Pair
it with the string-machine chorus: Wider for the static image floor, the
Solina chorus breathes on top. Closest you'll get to D'Agostino's
Chambers/Jackson stereo image with the installed plugin set.

**Avoid for this slot:** `mod-caps-ChorusI.lv2` is mono in → mono out — a
single-voice C* chorus, excellent DSP but fundamentally not a Dimension C (no
stereo output). `multivoice_chorus-swh.lv2` is also mono, and its 2–30 Hz
LFO range is in obvious-chorus territory — an order of magnitude faster than
the DC-2's ~0.5 Hz. `gx_chorus.lv2` is two independent chorus voices 90°
apart with no sign matrix — it will sound chorused before it sounds wide.
`tap-chorusflanger.lv2` is a single-LFO chorus/flanger with adjustable L/R
phase shift (0–180°, default 90°) — workable if dialed to ~0.5–1 Hz, Depth
low, Phase 90–180°, but it's one LFO against the string-machine's six-phase
dual-LFO matrix; it will always be more obviously "chorused" than the
Solina.

### Dunlop Cry Baby Wah — sweeping filter

The Cry Baby is a **single inductor + capacitor resonant bandpass filter**
swept by a treadle potentiometer, with a characteristic vocal "wah" peak that
moves from ~400 Hz (heel) to ~2 kHz+ (toe). Slight peak resonance, fixed Q.
It is NOT a formant filter, NOT a phaser, NOT a synthesizer wah.

**Use: `gx_gcb_95.lv2`.** The most literal GCB-95 model on the device —
Faust-generated from `gcb_95.dsp`, produced by `build_GCB_95.py` from the
`holters-sim/crybaby-1.2` SPICE simulator, curve-fit to a 4th-order IIR. The
treadle is mapped through an inverted log pot (`LogPot(5)`, matching the Hot
Potz taper) with a 228 Hz DC-blocker pre-stage matching the Cry Baby's input
C-R coupling. Ports: `HOTPOTZ` (treadle, 0–1, default 0.5) + `VOLUME`. The
`.dsp` header literally says "Linear filter simulating the GCB 95 crybaby
circuit." Drive the `HOTPOTZ` port from an expression pedal and it behaves
like a Cry Baby.

**Tied: `gxwah.lv2` (GxWah, the manual-treadle sibling).** Shares the
SPICE-fit Cry Baby filter from `dunwahauto.cc` (sweep 413 Hz heel → 2184 Hz
toe, Q 22 heel → 3.0 toe — matches the real GCB-95: heavy low-end resonance
that thins out at the toe). Functionally a Cry Baby with a slightly different
coefficient fit (from `dunwah2.py` vs `build_GCB_95.py` — same simulator,
different fit order). Audibly near-identical to `gx_gcb_95`; rank it
essentially tied. Choose this if you want the GxAutoWah bundle's manual wah
and don't need the Hot Potz volume trim.

**For hands-free: `GxSwitchlessWah.lv2` (GxAutoWah).** Identical filter to
`gxwah.lv2`, but the treadle is driven by an envelope follower (attack/decay
pole ≈ `exp(-10/SR)`, a slow ~10 s envelope time constant) gated by a
sensitivity/depth control. Auto-engagement is confirmed in code: no
footswitch, sweep = envelope → polynomial coeffs → same 4th-order IIR. The
right pick if you want Cry Baby tone *without* an expression pedal — the wah
opens on dynamics and closes when you stop playing. For D'Agostino's
manually-swept parts, `gx_gcb_95` or `gxwah` is more authentic; for hands-free
wah textures this is ideal.

**Different pedal, not a Cry Baby: `gx_colwah.lv2` (GxWahwah).** A 7-model
wah switcher of *other* vintage wahs (Colorsound / Dallas Arbiter / Foxx /
Jen / Maestro / Selmer / Vox V847), all SPICE-fit 4th-order IIRs. None is a
Cry Baby/Dunlop — the Cry Baby inductor topology is absent. MODEL=6 (Vox
V847) is the closest tonal cousin since Vox and Dunlop share ancestry, and
you get manual/auto/LFO modes plus a wet/dry blend. A fine and flexible wah,
but not a faithful GCB-95 — it's a "different pedal" emulator. Use it when
you want wah *character* rather than Cry Baby specifically.

**Not a wah at all: `ZynAlienWah.lv2`.** Its own LV2 metadata declares
`lv2:PhaserPlugin`. The DSP is a complex-modulated feedback delay line: an
LFO generates a rotating complex coefficient that multiplies a delayed
sample. This is a sweepable comb/phase-shifter with feedback — a phaser, not
a resonant bandpass. No inductor, no bandpass peak, no treadle. It will sound
metallic/phasey, nothing like a Cry Baby's vocal peak. Excluded from Cry Baby
consideration.

**Unverified: `gx_quack.lv2`.** Not present in the Guitarix or ZynAddSubFX
source trees (verified via `rg -i quack` across the full repo and `git log -S
quack` — zero hits). It likely comes from a different LV2 set installed on
the device. I could not inspect its DSP; audition it manually and check its
TTL before trusting it. By name it *suggests* a sharper-Q/aggressive envelope
wah, but that is speculation — do not assume it is a Cry Baby model.

---

## Delay & Reverb

### DigiTech Whammy — dramatic pitch shifting, shoegaze dives

The Whammy is a **monophonic intelligent pitch shifter** with an expression
treadle that smoothly shifts pitch from unison up to +2 octaves (or down to
−2 octaves), tracking the input fundamental and resynthesizing a single
shifted voice. It has a characteristic slight glitchiness on complex input
(chords confuse it) but smooth glissando on single notes. It is NOT a
harmonizer, NOT a fixed-interval shifter without treadle control.

**Use: `mod-superwhammy.lv2` (Super Whammy).** The only installed plugin that
combines a **continuous expression treadle** (`Step` port, 0..1) with
configurable octave endpoints (`First`/`Last`, -12..+24 semitones), a dry
blend (`Clean`), and a real pitch-shift DSP. The algorithm is a textbook
**phase vocoder**: Hann-windowed FFT, phase unwrapping
(`d_phi_wrapped = d_phi_prime - 2π·floor((d_phi_prime+π)/2π)`), and
resynthesis with a time-stretched synthesis hop
(`hops = round(hopa·2^(s/12))`) then linear-interpolated back. The `Step`
value is low-pass smoothed (`alpha = 0.01^(bufdur/0.1)`) giving the ~100 ms
glide that mimics the treadle. Final pitch `s_ = First + current_s·(Last-First)`.
Set `First`=0, `Last`=+24 (or +12 for the more common +1-oct dive),
`Clean`=0 (full wet), `Fidelity`=1 or 2, and map your expression pedal MIDI
CC to `Step`. For the chord-confusion glitch passages, ride `Fidelity` down
to 0 (shorter window → more smear/glitch).

**The honest caveat:** the Super Whammy has **no fundamental detector** —
it's pure spectral, so it does NOT track monophonic input the way the Whammy
does. On chords it smears (phase vocoder artifact: transient smearing,
"metallic" on polyphony) rather than the Whammy's characteristic
confusion-glitch. On single-note lines the glissando is clean and
continuous. It's the closest match in the installed set, but it's a phase
vocoder, not an intelligent PSOLA shifter.

**If you can install it: `dm-Whammy.lv2` (Dave Mollen, Rust).** Not in the
current candidate list but discovered during research in the
`mod-plugin-builder` package set. Its architecture is the **closest to a
real Whammy of anything I read**: a `PitchDetector` (zero-crossing on a 20 Hz
one-pole-filtered signal) feeds a 4-voice **PSOLA-like synchronous granular
shifter** where the grain frequency is derived from the detected
fundamental, grain windows are period-locked, and `pitch` (−24..+24
semitones) maps to grain read speed with 50 ms linear smoothing — i.e. real
monophonic tracking + treadle glissando, exactly the Whammy signature. The
pitch detector is admittedly crude (the code has a `TODO: replace this with a
better pitch detector`), but it's the right design. If `dm-Whammy.lv2` is or
can be installed on the pi-Stomp, it is the truest Whammy clone of the lot —
closer than `mod-superwhammy` on the "monophonic intelligent" criterion,
though SuperWhammy's phase vocoder is smoother on clean single notes.

**Fallbacks for specific use cases:** `mod-drop.lv2` uses the same phase
vocoder engine as SuperWhammy but is voiced as a drop-tuner (lower only by
default, no dry blend). `MaPitchshift.lv2` (DISTRHO/DPF, Max gen~ example)
is a granular delay-line shifter with 4 cosine-windowed grains, `ratio`
0.25..4.0 (±2 oct, **automatable**), `window` (0.1..1000 ms grain size),
`blur` (noise jitter on grain positions). Continuous control + ±2 oct, but
granular not PSOLA — chunky on chords, lacks the Whammy's "intelligent"
tracking. `am_pitchshift-swh.lv2` (Steve Harris) is a classic
dual-read-pointer delay-line granular shifter with sine crossfade — cheap
and glitchy-on-chords (coincidentally Whammy-like in character but not by
design), lowest latency of the set. Use as a low-CPU, intentionally lo-fi
dive effect.

**Not a pitch shifter: `tap-pitch.lv2`.** It's a 3-tap delay-line **phase
modulator**: a fixed 6 Hz cosine modulates three read-pointer offsets, each
tap amplitude-windowed by a 90°-shifted cosine, dry signal summed at the
"depth" point. `semitone` (-12..+12) sets the modulation *depth*, not a
static shift. This produces a vibrato/chorus/doubler, not a sustained pitch
shift — the pitch wobbles around the input at 6 Hz. There is no treadle-able
static shift. **Do not use this for the Whammy role.**

**Limited: `Pitchotto.lv2`** (SHIRO-Plugins, Nino de Wit). A dual-voice
granular shifter: two independent delay-line grain engines, each with its
own `ratio` (0.5..2 = **±1 octave only** — undershoots the Whammy's ±2-octave
range) and `delay`, plus `mix`, `cutoff`, `blur`. Designed for the shoegaze
"detuned double" shimmer (two slightly different shifts mixed), not for a
single dramatic dive. No pitch tracking. Pretty for ambient texturing; not
the Whammy sound.

### Boss DD-3 — straightforward, reliable digital delay

The DD-3 is a **clean, full-bandwidth digital delay** with up to ~800 ms
delay time, three modes (50/200/800 ms with hold on the long setting), no
modulation, no tone colouring — just pristine repeats. It is NOT a tape
echo, NOT a modulated delay, NOT a multi-tap.

**Use: `tap-echo.lv2` (TAP Echo, Tom Szilagyi).** The cleanest and most
DD-3-like of the five. Stereo (separate L/R delay, feedback, and strength
controls), max delay **2000 ms** (covers DD-3's 800 ms with headroom). The
delay line is a pure integer-sample ringbuffer — no interpolation, no
fractional reads. The feedback path is a single scalar, and the output is
`dry*drylevel + delayed*strength` — **no filtering in the feedback path and
no output tone control**. No modulation, no tape wow, no bitcrush. The only
extras are routing conveniences (Haas blank, mode cross-routing,
output-channel reverse) that are inert when left at defaults. This is the
only candidate whose default signal path is uncoloured end-to-end, exactly
like a DD-3. Downside: stereo-only, so for a mono pedalboard feed both
channels the same signal and link L/R.

**Equally clean with one knob to set: `ZamDelay.lv2` / `distrho-a-delay.lv2`.**
Both (same author lineage) are mono, integer-sample delay with a two-tap
crossfade on delay-time changes that makes edits glitch-free. Transparent
scalar feedback — no filtering in the loop. The one catch: an RBJ low-pass on
the **wet output** defaulting to 6000 Hz colours the repeats; set **LPF to
20000** to make it transparent and you have a clean digital delay that is
functionally DD-3-equivalent. Max delay 8000 ms. Has BPM sync. Pick whichever
UI/parameter set fits the pedalboard better.

**Avoid for this slot:** `gx_digital_delay.lv2` is the most featureful but
not neutral by default. Uses Faust's linear-interpolated smooth delay
(slightly softens HF on every repeat versus a pure integer read — a wash
for the DD-3 since the DD-3 never sweeps, but a minor colouration). The
decisive drawback: the feedback path **always** runs through
`fi.highpass(2, HIGHPASS) : fi.lowpass(2, HOWPASS)` with defaults HP=120 Hz /
LP=12 kHz. You can widen this to 20 Hz / 20 kHz to approach full bandwidth,
but the filters are never bypassable, and the LP at 20 kHz on a 48 kHz host
still rolls off the top octave of every repeat. The MODE enum offers plain /
presence / tape / tape2; only plain (0) is DD-3-appropriate — presence adds a
multi-peak guitar EQ, and tape/tape2 insert allpass chains that emulate tape
wow/flutter colouration. Treat it as a "delay Swiss-army knife" rather than a
DD-3 stand-in. `mod-mda-Delay.lv2` is clean but too short: max delay time is
only ~330 ms (well short of the DD-3's 800 ms mode) and the feedback path
**always** passes through a one-pole low-pass with a "Fb Tone" knob — there
is no flat-feedback setting. Fine for coloured tape-ish delay, wrong tool for
pristine DD-3 repeats.

### Strymon TimeLine — atmospheric, ambient delay textures

The TimeLine is a multi-mode digital delay with 12 machines including dBucket
(BBD), Digital (clean), Modern (filter mod), Tape (wow/flutter), Tube, Analog,
Pattern (rhythmic multi-tap), Sweep, Lofi (bitcrush), Ice (shimmer/octave),
Reverse, and Duck. D'Agostino leans on the Tape/Modern/Analog/Tube territory
for atmospheric ambient delay.

**Use: `TAL-Dub-3.lv2`.** The only professionally-engineered plugin of the
candidates — original source from TAL Software (Patrick Kunz), ported via
DISTRHO/JUCE. The delay runs at **2× oversampling** (linear-interp upsample
on write, 9-tap FIR decimator on read), and the read uses allpass-style
fractional interpolation (Dattorro's form) which is noticeably cleaner than
plain linear for modulated reads. The feedback path is genuinely
sophisticated: DC block + 6dB Moog-ladder lowpass with tanh saturation, plus
a `tanhApp` shaper on the feedback sum — this is what gives it the warm
"analog/BBD" character. The **`TapeSlider`** linearly slews the delay time
over ~0.5 s whenever the target changes — this *is* the tape wow/flutter
layer, producing pitch modulation as the read pointer glides. It's not a
free-running LFO chorus, it's tape-style time-mod, exactly the TimeLine
"Tape" machine's character. Stereo is two fully independent L/R delay lines
with a "twice" toggle (R = L/2). Tempo sync covers 18 musical divisions.
**Machines covered**: Digital (clean), Tape (TapeSlider), Analog
(filter+saturate), Modern (filter mod via cutoff), Tube (saturation). No
multi-tap, no bitcrush, no reverse, no ducking, no pattern. For pure
atmospheric-ambient delay — the TimeLine's Tape/Modern/Analog/Tube territory
that D'Agostino leans on — TAL-Dub-3 alone is the right answer.

**Stereo workhorse complement: `bolliedelayxt.lv2` (Bollie Delay XT).** The
most *feature-flag-complete* on paper but a notch below TAL-Dub-3 in sonic
engineering. ~880 lines of careful, well-commented C — enthusiast-grade but
genuinely well-built. Plain linear interpolation (functional but not
oversampled, so modulation artifacts are more audible than TAL). A sine LFO
modulates the delay read offset (depth 0–5 ms, rate 0.1–2 Hz) with a
per-channel phase switch — a proper chorus/flanger pitch-mod layer, arguably
more flexible than TAL's TapeSlider for "Modern" textures. Its real strength:
separate **HPF+LPF biquads in BOTH the pre-delay path AND the feedback
path**, each with freq+Q controls — you can dial in dark analog repeats or
bright filtered sweeps, covering TimeLine "Sweep" and "Analog" machines well.
True stereo with **ping-pong** and **crossfeed** — best stereo/width
coverage of the four. A feedback limiter prevents runaway (partial "Duck"
character). No multi-tap, no tape/BBD wow, no bitcrush, no reverse. Best used
as the versatile stereo workhorse alongside TAL-Dub-3 for character.

**Lofi specialist: `bentdelay.lv2`.** A deliberate one-trick lo-fi toy: 130
lines, mono, no modulation, no sync, no tempo, no multi-tap, no tape, no
reverse, no ping-pong. Its single idea is clever: a 16-bit ring buffer where
the read pointer is masked with a **bit-shifted downsample mask** — the
"Bend" control picks 1×/2×/4×/8×/16×/32× decimation, and the output is
**input minus the aliased delayed signal**, producing gritty subtractive
bitcrush. This is the *only* plugin here that covers the TimeLine **"Lofi"
machine**, and it does it with genuine character (the subtraction gives a
phase-inverted "circuit-bent" grit that bitcrush alone doesn't). Use it
*alongside* TAL-Dub-3 when you specifically want the Lofi machine.

**Narrow but good: `Modulay.lv2`.** Auto-generated from a Max/MSP Gen~ patch
— not hand-written DSP. A single mono delay line with feedback, one-pole
tone lowpass in the feedback path, and a **Morph knob** (0–100) that
crossfades the LFO depth and offset across regimes (confirmed by shipped
presets: `Modulay-chorus`, `-vibrato`, `-flanger`). The LFO is a sine
modulating delay time at 0.1–5 Hz, depth 0.1–3 ms. This is a **focused
modulation delay** — it does the TimeLine "Modern" machine and the
pitch-shimmery ambient wobble better than bolliedelayxt's generic LFO, but
it's mono, no tempo sync, no multi-tap, no tape wow, no bitcrush, no
reverse, no ping-pong. Pair with TAL-Dub-3 for ambient; don't use as the
only delay.

**Pattern (rhythmic multi-tap): `gxechocat.lv2` (GxEchoCat).** A 3-playback-head
tape echo modeled on a Selmer Copicat, with each head on a **tempo-synced
musical subdivision**: `dtime1 = SR*(30/bpm)`, `dtime2 = SR*(60/bpm)`,
`dtime3 = SR*(90/bpm)`, `dtime4 = SR*(240/bpm)` — i.e. 1/8, 1/4, dotted-1/8,
1/1 at the BPM. Each head has an on/off checkbox (`Head1/2/3`) so you can
gate which taps sound, plus global `Swell` (head level) and `Sustain`
(feedback). Wow/flutter modeled via a 4 Hz sine. This is the closest thing to
a "rhythmic pattern" out of the box: three taps at fixed musical offsets,
per-tap enable, tempo-synced. Limitation: tap spacing is fixed
(30/60/90/240 bpm fractions) and there's no per-tap *level* control beyond a
single global swell — and only 3 heads, not a true pattern sequencer. If a
denser/arbitrary pattern is required, there is no good single-plugin fit —
`delayorama-swh.lv2` gives up to 128 taps but no rhythm grid (geometric/random
spacing), and the `stepseq_s*` plugins output MIDI only and can't drive
delay parameters on this device.

**Ice (shimmer/octave delay): chain `am_pitchshift-swh.lv2` (×2.0) → delay.**
No installed single LV2 plugin does pitch-shifted *delay* taps natively.
`gx_shimmizita.lv2` is a shimmer *reverb* (pitch shifter inside the zita FDN
feedback loop), not a delay — it has no delay-only mode. The only viable path
is to chain a pitch shifter into a delay with feedback: dry →
`am_pitchshift-swh.lv2` (set to 2.0 = +1 octave; time-domain crossfade
shifter, low latency, real-time-safe) → `gxechocat.lv2` or `gx_echo.lv2` with
feedback. Each repeat is re-pitched because the pitch shifter sits before the
feedback loop, so the octave compounds on each regeneration (true shimmer
tail). This is practical on MOD-Host — both are standard audio-port LV2
plugins and serial chaining is the normal MOD patching model.

**Reverse: `revdelay-swh.lv2` (Reverse Delay, Jesse Chappell).** A purpose-built
**true reverse delay**: a circular buffer of `2 × delay_samples` where
`read_phase = delay2 - write_phase` — the read head moves backward through the
buffer as the write head advances forward. Output is
`wet * buffer[read_phase] + dry * insamp`, so you hear the buffer played in
reverse under/over the dry signal. Has feedback (the reverse read is fed back
into the write) and a crossfade window (`xfade_samp`, 0–5000) that ramps the
write amplitude at loop boundaries to avoid clicks. Max delay 5 s. Code is
clean, `HARD_RT_CAPABLE`. **Caveat:** it is **continuous** (no threshold/attack
trigger like the TimeLine's "only reverse loud notes" mode). If you need
threshold-triggered reverse capture, insert a noise gate (`gate-swh.lv2`
exists in the SWH set) before `revdelay` so only notes above a threshold
enter the reverse buffer — practical on MOD-Host. `gx_echo.lv2`,
`tape_delay-swh.lv2`, and the other SWH delays were checked and have no
reverse parameter.

**Duck (ducked delay): `gx_duck_delay_st.lv2` (stereo) or `gx_duck_delay.lv2`
(mono).** These have a proper built-in envelope-follower ducker:
`switcher(p_attack_time, p_release_time, p_amount) = an.amp_follower_ud(att,rel)
: *_amount : _>1:(1 - _) : si.smooth(...)`. The delayed signal is multiplied
by `(1 - envelope)`, so when you play (input high) the delay tail is
attenuated; when you stop, the envelope decays and the tail swells back up.
Controls: `Delay` (ms, 1–2000), `Feedback` (0–1), `Ping Pong` (cross-channel
feedback, stereo only), `Coloration` (±1, low-shelf + high-shelf tone, stereo
only), `Attack` (0.05–0.5 s), `Release` (0.05–2 s), `Amount` (0–56 dB, ducker
depth), `Effect` (−16…+4 dB output, stereo only). This is exactly a duck delay
— sidechain is the dry input envelope, applied to the wet return, all
internal. Modeled on GVST GClipDly and Axe-FX II. No chaining required. If
you need a different delay character (e.g. tape/BBD color), route the delay
output into a sidechain compressor (`ZamComp.lv2` / `ZamCompX2.lv2` have
sidechain inputs; `sc1–sc4-swh.lv2` are SC compressors) keyed by the dry
input — works on MOD-Host but is more wiring and CPU than the built-in
`gx_duck_delay_st`.

### Strymon BigSky — atmospheric, ambient reverb textures

The BigSky has 12 reverb algorithms: Hall, Plate, Spring, **Shimmer**
(pitch-shifted reverb tail — the signature one for shoegaze), **Cloud**
(granular reverb), Bloom, Chorale, Swarm, Magnet, Nonlinear, Reverse,
Interstellar. The key for D'Agostino's shoegaze sound is the **Shimmer** mode
(octave-up reverb tail) and the **Cloud** (granular/dense ambient) mode.

**Best Shimmer: `gx_shimmizita.lv2`.** This is the single best BigSky-Shimmer
replacement on the device, and the architecture is the classic
Valhalla Shimmer / Eventide Blacktail design: a pitch shifter **inside** the
zita-rev1 FDN feedback loop. The Faust source wraps the zita-rev1 8×8 FDN
(8 delay lines, Hadamard feedback matrix, per-line low-pass + high-shelf
damping absorption filters, 4 Schroeder allpass diffusers on the input) with
a **parametric pitch-shifter bank embedded inside the FDN feedback loop** —
each of the 8 delay lines has its own `par_ps` pitch shifter (a 2-tap
crossfading variable-delay transposer, 2048-sample window, 1024-sample
crossfade) driven by an envelope-followed LFO. `SHIFT` is ±6 semitones,
`MODE` controls inter-line correlation, `SPEED`/`DEPTH`/`CONTROL` drive the
envelope-modulated pitch wobble. Pitch shifting *inside* the recirculating
loop means each iteration shifts again, so the tail climbs/octave-cascades
exponentially into an ethereal ascending shimmer cloud — exactly the BigSky
Shimmer behavior. Set `SHIFT` to +12, `PSDRYWET` ~0.7, `T60M` ~6 s.

**Strong shimmer runner-up: `Shiroverb.lv2`.** A Max/MSP Gen~ export
self-described as "Gigaverb-genpatch + Pitch-Shift-genpatch." It's a proper
FDN (12 delay lines: 4 recirculating with exponential-decay feedback, plus
allpass-diffuser chain and Schroeder-style tone filter) preceded by a
4-voice granular pitch shifter (4 cos²-windowed overlap-add grain taps
reading from a 96,000-sample delay line, advanced by a Phasor at
`(1-ratio)*10` Hz with sample-and-hold gate triggering). `RATIO` ranges
0.5–2.0 → full octave-up shimmer available. The critical difference vs.
shimmizita: the pitch shifter sits **before** the FDN, not inside the
feedback loop. So the octave-up is applied once on the input; the reverb
tail then decays naturally rather than cascading upward indefinitely. You
still get a gorgeous octave-up reverb tail, but it's a "single-shift
shimmer" (closer to BigSky Shimmer at low mix) rather than an infinite
ascending cascade. Its granular grain engine is the same primitive BigSky
Cloud is built on, so it has a grainy texture shimmizita lacks.

**Best Cloud (granular ambient): `TheCloud.lv2`.** A Pure Data patch
compiled to C via hvcc/HeavyDPF. Architecture: a single 2-second delay line
fed by the input, then **20 instances of `vgrain`** reading from it with
4-point interpolated variable delay. Each `vgrain` triggers a grain: ramped
delay position, windowed by a cosine/Hann window, panned L/R via equal-power
`cos/sin`. Controls: `grainsPerSec` (1–80), `avgGrainDuration` (10–900 ms),
`detune`, `density`, `flow`, `mix`, `env_type`. This is a **textbook granular
delay / cloud synthesizer** — exactly the BigSky "Cloud" algorithm family.
It's *not* a reverb in the strict sense (no FDN, no allpass tail); the
"reverb" effect is the dense cloud of randomized grains recirculating
through the 2 s delay. But for atmospheric, ambient, bloom-like textures
it's the closest thing on the device to BigSky Cloud/Bloom. Pair it with
shimmizita in a chain for the full D'Agostino wall-of-sound. Note: heavy at
high grain counts on a Pi 4/5 (20 grain voices of interpolated delay per
sample).

**Best plain reverb foundation: `DragonflyHallReverb.lv2` /
`DragonflyPlateReverb.lv2`.** These are the only fully proper FDN/plate
engines with modulation on the device. Hall uses the freeverb3 `zrev2`
class (based on zita-rev1, extended with modulated delay lines for
chorale-like modulation and band-split decay) — a genuine BigSky
Hall/Chorale equivalent. Plate uses fv3's `nrev_f` + `nrevb_f` (the
Stanford/NRev plate algorithm: comb-bank → multi-stage allpass cascade →
tonal correction, with damping-LPF added in the Dragonfly wrapper) — a real
plate simulation, best BigSky **Plate** replacement. No pitch shifter, no
granular layer. Use these for the non-shimmer BigSky algorithms.

**Clean reference, no shimmer: `gx_zita_rev1.lv2`.** The raw zita-rev1 FDN
(8 delay lines, two-band T60 decay, HF damping, Regalia–Mitra peaking EQs on
the output). Identical core to what shimmizita builds on, minus the pitch
shifter. Beautiful, transparent, the canonical Linux hall reverb — but for
shoegaze-atmospheric use it's the *boring* option. Use it as a clean send
when you want space without texture.

**Idiosyncratic ambient: `Airwindows-Galactic.lv2`.** 12 delay lines in a
3-stage cross-subtracted mixing network with L/R cross-coupled feedback, a
vibrato-modulated 256-sample predelay, an IIR brightness filter, and a
"thunder" dither. Airwindows' idiosyncratic take on a modulated FDN —
chorale-style modulation is built in and the long decay gives a lush,
slightly wobbling ambient wash. No pitch shifter, no granular engine. Great
for atmospheric pads, closer in spirit to BigSky Chorale/Bloom than to
Shimmer/Cloud. CPU-light.

**Skip for this use case: `Airwindows-PocketVerbs.lv2`.** 6 algorithms
(Chamber, Spring, Tiled, Room, Stretch, Zarathustra), every one a long
allpass-chain Schroeder reverb — no FDN, no proper absorption filters, no
pitch shift, no granular. Sounds lo-fi and metallic next to Dragonfly or
zita; useful only as a special-effect color, not as a BigSky substitute.

### Red Panda Particle — experimental, glitchy, granular delay

The Particle chops the delay buffer into small grains (10–500 ms),
scatters/pitches/reverses them, and has modes including pitch shift
(per-grain), reverse, freeze (loop a grain), density (scattered grains),
stretch, and bitcrush. The signature is **per-grain pitch shifting** +
**scattered/randomised grain playback** = glitchy, granular, ambient chaos.

**Use: `Granulator.lv2` (Mayank Sanganeria).** The closest thing to a
Particle core on the device. A textbook scatter-granular delay in 56 lines
of Faust: 64 parallel grain voices each read from a 480k-sample delay
buffer at a **random offset**, with a sine window applied per grain. The
`grain_density` slider (1–64) gates how many voices are active, and
`grain_length` (0.01–0.5 s) is **exactly the Particle's 10–500 ms grain
range** — almost certainly not a coincidence. The `delay_length` (0.5–10 s)
sets the buffer the grains scatter within. This nails the Particle's
**scattered/randomised grain playback** and **density** modes.

**The honest caveat:** there is **no per-grain pitch shifting** (no
rate/resample multiplier per voice — `grainPosition` advances at native
rate), **no reverse** (no negative grainCounter step), **no freeze** (no
held-grain loop), and **no bitcrush**. The only four ports are `delay_length`,
`grain_density`, `grain_length`, `mix`. The random-number generator is a
cheap LCG shared across all voices — you may hear correlation between grain
positions. It's a single-algorithm granular scatter, not the multi-mode
Particle. It covers only ~half the Particle's feature set.

**No single installed plugin reproduces the Particle's per-grain pitch
shifting — its defining feature.** To approximate a Particle on this
device, chain the following and accept that randomised per-grain pitch is
unavailable:

- **`Granulator.lv2`** — scattered grains, density, grain size (the core
  granular scatter).
- **`Modulay.lv2`** — pitch wobble colour (smooth sine-LFO pitch modulation
  on taps, not random per-grain, but covers the "pitch-wobble" flavour of
  the Particle's pitch mode).
- **`mrfreeze.lv2`** — freeze (a true phase-vocoder FFT freeze, not
  sample-and-hold: on enable it captures the current magnitude spectrum and
  per-bin phase delta, then on each hop advances the phase by the locked
  delta and re-synthesizes with the frozen magnitude, overlapped-add with a
  sqrt-Hann window. This is the standard "freeze the spectrum" PV technique
  — it sustains the timbre indefinitely without the click/granular artefacts
  of a naive grain loop. Different aesthetic from the Particle's grain
  freeze, but covers the "hold a moment in time" intent **better** than a
  simple sample-and-hold would).
- **`bentdelay.lv2`** — bitcrush (grittiest, delay-contextured; the
  subtractive bit-shift mask gives a phase-inverted "circuit-bent" grit).
- Optionally **`MaBitcrush.lv2`** (clean amplitude quantisation, 1–16 bits)
  + **`deteriorate.lv2` downsampler** (sample-rate reduction, zero-order-hold
  decimator, no anti-alias filter — harsh/noisy rather than musical) if you
  want both bit-depth and sample-rate reduction.

**Skip:** `CycleShifter.lv2` is a zero-crossing cycle recorder/overdubber —
it waits for the input to cross zero upwards, records one "cycle" until the
next upward zero crossing, then adds the stored cycle on top of the live
input on a loop. A "weird kind of gentle distortion," not randomised grain
scatter. Not a Particle substitute. `deteriorate.lv2` granulator (the other
granular engine in the `deteriorate` bundle) records live input into
discrete grain buffers, applies an attack/release envelope, pushes each
finished grain onto a stack, and on playback picks a random grain from the
bank with a silence gap controlled by `grainDensity` and a circular bank
depth controlled by `grainSpread`. It has scatter + density + spread + AR
envelope shaping — actually more feature-rich than Mayank's in some
respects — but it is **not a delay granulator**: it slices the live input,
not a delay buffer, so there's no `delay_length` parameter and no sense of
"grains scattered within a delay tail." It also has no per-grain pitch, no
reverse, no freeze. Memory management is sloppy (leaked pointers when
`grainSpread` is reduced). Useful as a second scatter voice alongside
`Granulator`, but not a closer Particle match.

---

## Suggested pedalboard — "Chambers" / "Jackson"

For a patch inspired by the lush, wide, shoegaze-indie sound of those tracks:

1. **`gxts9.lv2`** → **`gx_fuzzfacefm.lv2`** (stacked TS-9 mid-boost into
   Fuzz Face Fuller Mod — D'Agostino's signature gain staging. Set TS9 Drive
   ~0.25, Level near unity, Tone ~400 Hz; place before the fuzz in the
   MOD-Host chain.)
2. **`gx_supersonic.lv2`** (for the SS/BS Fuck slot — op-amp-style asymmetric
   saturation that stays articulate under heavy gain. Automate `GAIN`
   (exponential drive into the clipper) with a slow envelope to approximate
   the bias-collapse gating artefact.)
3. **`gx_gcb_95.lv2`** (Cry Baby, treadle-controlled via expression pedal)
4. **`mod-superwhammy.lv2`** (set `First`=0, `Last`=+12 or +24, `Clean`=0,
   `Fidelity`=1; map expression pedal MIDI CC to `Step` for shoegaze dives)
5. **`mod-caps-Wider.lv2`** → **`string-machine-chorus-stereo.lv2`**
   (Dimension-C width: Wider for the static image floor at Width ≈ 0.6,
   Pan = 0; string-machine chorus for the motion — Rate 1 ≈ 6 Hz / Depth 1 ≈
   30%, Rate 2 ≈ 0.6 Hz / Depth 2 ≈ 40%, analog mode on.)
6. **`tap-echo.lv2`** (clean DD-3-style delay, if you want simple echo) **or**
   **`TAL-Dub-3.lv2`** (for the TimeLine atmospheric/Tape/Analog side)
7. **`gx_shimmizita.lv2`** (BigSky Shimmer — `SHIFT`=+12, `PSDRYWET`~0.7,
   `T60M`~6 s. The pitch shifter inside the FDN feedback loop gives the
   cascading octave-up tail.)
8. **`TheCloud.lv2`** on a parallel send (BigSky Cloud — granular ambient
   wash. `grainsPerSec`~40, `avgGrainDuration`~200 ms.)
9. **`Granulator.lv2`** on a parallel send (Particle-style scattered grains —
   `delay_length`~5 s, `grain_density`~32, `grain_length`~0.1 s. Add
   `mrfreeze.lv2` on a switchable send for freeze moments, and
   `bentdelay.lv2` for the lo-fi/bitcrush mode.)

If you want the TimeLine's stereo ping-pong and filter-sweep machines
alongside the TAL-Dub-3 character, add **`bolliedelayxt.lv2`** as a second
delay line with crossfeed and HPF/LPF in the feedback path.

For the remaining TimeLine machines, add these on switchable sends:

- **`gxechocat.lv2`** for the Pattern machine (3 tempo-synced tape heads at
  1/8, 1/4, dotted-1/8, 1/1; toggle heads on/off for rhythmic patterns).
- **`am_pitchshift-swh.lv2` (×2.0) → `gx_echo.lv2`** for the Ice machine
  (pitch shifter into delay with feedback — octave compounds on each repeat).
- **`revdelay-swh.lv2`** for the Reverse machine (continuous reverse buffer;
  add `gate-swh.lv2` before it if you want threshold-triggered capture).
- **`gx_duck_delay_st.lv2`** for the Duck machine (built-in envelope-follower
  ducker; set Attack ~0.1 s, Release ~0.5 s, Amount ~20 dB).

---

## What we can't replicate on this device

The honest gaps, where no installed plugin covers the reference pedal's
defining feature:

- **SS/BS Fuck bias-collapse.** No candidate has a parameter that shifts
  the waveshaper's operating point or duty-cycle modulates the output. The
  Fuck's signature collapsing/splatty artefact at extreme bias settings is
  unavailable. `gx_supersonic`'s asymmetric clipping gives the right *harmonic*
  character but not the *gating* behaviour. Approximate by automating
  `GAIN` with a slow envelope.
- **Red Panda Particle per-grain pitch shifting.** No installed plugin
  applies a rate/resample multiplier per grain voice. `Granulator` scatters
  grains but they all play at native rate. This is the Particle's single
  most identifiable feature and it's missing. Consider building/installing a
  Faust port with per-grain resample if you need the true Particle
  pitch-scatter signature.
- **DigiTech Whammy intelligent monophonic tracking.** `mod-superwhammy` is
  a phase vocoder, not a PSOLA shifter — it has no fundamental detector. On
  chords it smears rather than producing the Whammy's characteristic
  confusion-glitch. `dm-Whammy.lv2` (not currently installed) is the right
  design; install it if you can.
- **Strymon TimeLine Pattern machine — true pattern sequencer.** `gxechocat.lv2`
  gives 3 tempo-synced heads at fixed musical subdivisions with per-head
  enable, but there's no arbitrary pattern sequencer (no per-tap level, no
  step grid). If you need a dense custom rhythmic pattern, there is no
  single-plugin fit on this device. `delayorama-swh.lv2` has up to 128 taps
  but geometric/random spacing, not a rhythm grid.
- **Strymon TimeLine Ice machine — no single plugin.** No installed LV2
  plugin does pitch-shifted delay taps natively. The only path is chaining
  `am_pitchshift-swh.lv2` (×2.0) into a delay with feedback — practical on
  MOD-Host but requires two plugins and feedback routing.
- **Strymon TimeLine Reverse machine — no threshold trigger.** `revdelay-swh.lv2`
  is a true reverse delay but is continuous (always writing and reversing the
  buffer). The TimeLine's "only reverse loud notes" attack-triggered mode
  requires an external noise gate before `revdelay` — workable but an extra
  plugin.
- **Boss DC-2W switched presets.** The string-machine chorus gives the right
  *architecture* but exposes continuous controls, not the DC-2's four
  fixed buttons. You'd need to save four presets manually.

---

## DSP source references

All findings above are grounded in source code read from the following
repositories (cloned to `/tmp/research-*/` during analysis):

- **Guitarix** (`gx_*` plugins): https://github.com/brummer10/guitarix —
  Faust-generated C++ from `trany.lib` (transistor transfer tables) and
  SPICE-fit 4th-order IIR coefficients.
- **CAPS** (`mod-caps-*`): https://github.com/caps-plugins/caps — Tim
  Goetze's C++ DSP.
- **MOD Audio** (`mod-*`): https://github.com/moddevices/ — various repos
  including `mod-pitchshifter`, `mod-distortion`, `mda-lv2`, `tap-lv2`.
- **Dragonfly Reverb**: https://github.com/michaelwillis/dragonfly-reverb —
  freeverb3 `zrev2` / `nrev` engines.
- **Airwindows**: https://github.com/airwindows/Airwindows — Chris
  Johnson's idiosyncratic C DSP.
- **SHIRO-Plugins** (`Modulay`, `Shiroverb`, `Pitchotto`):
  https://github.com/ninodewit/SHIRO-Plugins — Max/MSP Gen~ exports.
- **infamousPlugins** (`bentdelay`): https://github.com/ssj71/infamousPlugins
- **Granulator**: https://github.com/e7mac/faust-code — Mayank Sanganeria's
  Faust source.
- **MrFreeze**: https://github.com/romi1502/MrFreeze — phase-vocoder freeze.
- **TAL-Dub-3**: TAL Software / DISTRHO port.
- **dm-Whammy** (not installed): https://github.com/davemollen/dm-Whammy —
  Rust PSOLA shifter with pitch detector.
- **SWH LV2** (`revdelay-swh`, `delayorama-swh`, `am_pitchshift-swh`,
  `tape_delay-swh`, `gate-swh`): https://github.com/swh/lv2 — Steve Harris's
  LADSPA/LV2 port, DSP embedded in `plugin.xml`.
- **x42 stepseq** (`stepseq_s*`): https://github.com/x42/stepseq.lv2 — MIDI
  note step sequencer (not usable for delay parameter modulation).