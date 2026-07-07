# TimeLine Replacement Research — Remaining Four Machines

Source examined: `swh-lv2` (Steve Harris LV2, DSP embedded in `plugin.xml`), `guitarix` (Faust `.dsp` + generated `.cc`), `x42/stepseq.lv2`. All cloned to `/tmp/research-timeline-remaining/`.

## Pattern (rhythmic multi-tap delay)

**Ranking:**

1. **`gxechocat.lv2` (GxEchoCat) — best single-plugin match.** Faust source: `trunk/src/LV2/faust/gxechocat.dsp`. It is a 3-playback-head tape echo (modeled on a Selmer Copicat) with each head on a **tempo-synced musical subdivision**: `dtime1 = SR*(30/bpm)`, `dtime2 = SR*(60/bpm)`, `dtime3 = SR*(90/bpm)`, `dtime4 = SR*(240/bpm)` — i.e. 1/8, 1/4, dotted-1/8, 1/1 at the BPM. Each head has an on/off checkbox (`Head1/2/3`) so you can gate which taps sound, plus global `Swell` (head level) and `Sustain` (feedback). Wow/flutter modeled via a 4 Hz sine. This is the closest thing to a "rhythmic pattern" out of the box: three taps at fixed musical offsets, per-tap enable, tempo-synced. Limitation: tap spacing is fixed (30/60/90/240 bpm fractions) and there's no per-tap *level* control beyond a single global swell — and only 3 heads, not a true pattern sequencer. Code quality is good (Faust, well-commented, modeled on real hardware).
2. **`delayorama-swh.lv2` (Delayorama) — powerful but not rhythmic.** `swh-lv2/plugins/delayorama-swh.lv2/plugin.xml`. Up to **128 taps** (`N_TAPS=128`, `tap_count` 2–128). Taps are placed by `first_delay` + `delay_range` with a geometric `delay_scale` factor and optional randomization (`delay_rand_pc`, `gain_rand_pc`, `seed`). Per-tap gain scales geometrically (`gain_scale`). It has feedback and a wet/dry crossfade with smooth tap-set crossfading on recalc. **Not tempo-synced** (all times in seconds) and there is **no pattern/step sequencer** — tap spacing is geometric/random, not a rhythmic grid. You could *approximate* a pattern by hand-tuning `first_delay`/`delay_range`/`delay_scale` to land on subdivisions, but it's a stretch. Code quality is solid SWH C, but the design is for diffused multi-tap clouds, not rhythmic patterns.
3. **`gx_mbecho.lv2` (GxMultiBandEcho) — tempo-synced but frequency-split, not multi-tap.** `trunk/src/LV2/faust/mbe.dsp`. 5 independent tempo-synced echoes (`ba.tempo(BPM)`, 24–360 BPM each) with per-band `percent` (feedback) — but the input is split by a 5-band **crossover filterbank** first, so each echo acts on a different frequency band, not on the full signal as separate taps. Not a rhythmic multi-tap; it's a multiband echo. Useful if you want tempo-synced echoes but doesn't model the Pattern machine.
4. **`gx_echo.lv2` (GxEcho-Stereo) — 2-tap L/R echo, no rhythm.** `trunk/src/LV2/faust/stereoecho.dsp`. Two delay lines (L/R, ms not BPM), LFO modulation, mode = linear/pingpong. No reverse, no pattern, not tempo-synced.
5. **`stepseq_s*` (x42 stepseq) — NOT usable for Pattern.** Cloned `x42/stepseq.lv2`. It is a **MIDI note step sequencer**: its only output is `atom:Sequence` of `midi:MidiEvent` (`lv2ttl/stepseq.ttl.in`, `src/stepseq.c` forges MIDI note on/off). It has no audio/CV/control-rate output port. MOD-Host cannot route MIDI note velocity to a delay's tap-level control port. **Skip entirely** — these cannot drive a delay's parameters on this device.

**Recommendation:** Use **`gxechocat.lv2`** as the Pattern machine (3 tempo-synced heads at 1/8, 1/4, dotted-1/8, 1/1, per-head enable). It's the only candidate with musical-subdivision taps built in. If a denser/arbitrary pattern is required, there is no good single-plugin fit — `delayorama` gives many taps but no rhythm grid, and the step sequencers can't modulate audio plugins on this device.

## Ice (shimmer / octave-up delay)

**Ranking:**

1. **Chain: pitch shifter → delay (the only viable path).** No installed single LV2 plugin does pitch-shifted *delay* taps natively. `gx_shimmizita.lv2` (`trunk/src/LV2/faust/shimmizita.dsp` + `shimmizita.inc`) is a **Zita-style FDN reverb** (8 feedback delay lines in a matrix) with a bank of pitch shifters (`par_ps`, borrowed from Faust's `pitch_shifter.dsp`) inserted *inside* the reverb feedback network — confirmed by `shimmizita_rev_fdn` wiring: `delayfilters : pitchshifters : fbdelaylines`. That is a shimmer **reverb**, not a delay; the user already excluded it and the code agrees. It has no delay-only mode.
2. **Pitch shifter choices for the chain:**
   - **`am_pitchshift-swh.lv2`** — best for octave-up Ice. `plugin.xml`: pitch is a multiplier, `2.0 = +1 octave` (range 0.5–2.0). Time-domain crossfade pitch shifter (two read pointers, sine-weighted crossfade), low latency, real-time-safe (`HARD_RT_CAPABLE` per sibling plugins). Set to 2.0 for the classic ascending-octave shimmer tail.
   - `mod-superwhammy.lv2`, `MaPitchshift.lv2`, `Pitchotto.lv2` — already researched; semitone-based, can also do +12.
   - `pitch_scale-swh.lv2` — FFT-based "Higher Quality Pitch Scaler", pitch coefficient 0.5–2.0. Higher CPU, adds latency (reports a `latency` port); less ideal on a Pi than `am_pitchshift`.
3. **Delay choice for the chain:** any of the tempo-synced delays above — `gxechocat.lv2` (with feedback) or `gx_echo.lv2`. Feed: dry → `am_pitchshift` (×2) → delay with feedback. Each repeat is re-pitched because the pitch shifter sits before the feedback loop, so the octave compounds on each regeneration (true shimmer tail). For a less aggressive shimmer, place the pitch shifter *inside* the delay feedback path if MOD-Host allows feedback routing around two plugins — but the safe, simple version is shifter-then-delay.

**Recommendation:** No single plugin. Chain **`am_pitchshift-swh.lv2` (×2.0) → `gxechocat.lv2` or `gx_echo.lv2`** (shifter first, into a delay with feedback). This is practical on MOD-Host — both are standard audio-port LV2 plugins and serial chaining is the normal MOD patching model. Avoid `gx_shimmizita` for this machine (it's a reverb).

## Reverse (reverse delay)

**Ranking:**

1. **`revdelay-swh.lv2` (Reverse Delay) — exact match, single plugin.** `swh-lv2/plugins/revdelay-swh.lv2/plugin.xml`, authored by Jesse Chappell. It is a **true reverse delay**: a circular buffer of `2 × delay_samples`, where `read_phase = delay2 - write_phase` — i.e. the read head moves backward through the buffer as the write head advances forward. The output is `wet * buffer[read_phase] + dry * insamp`, so you hear the buffer played in reverse under/over the dry signal. It has feedback (the reverse read is fed back into the write: `buffer[write_phase] = fadescale * (insamp + feedback * read)`). A crossfade window (`xfade_samp`, 0–5000) ramps the write amplitude at the loop boundaries to avoid clicks. **No threshold/trigger gate** — it is continuous, not attack-triggered (the buffer is always being written and reversed). Max delay 5 s. Ports: `delay_time`, `dry_level` (dB), `wet_level` (dB), `feedback`, `xfade_samp`. Code is clean, `HARD_RT_CAPABLE`. This is the canonical reverse delay and the only true single-plugin reverse delay in the set.
2. **`gx_echo.lv2` — no reverse mode.** Mode port scale points are only `linear` / `pingpong` (`gx_echo.ttl`); Faust `stereoecho.dsp` confirms no reverse buffer read. Not a reverse delay.
3. **`tape_delay-swh.lv2` — no reverse mode.** Ports are 4 tape-head taps with distance/level only (`t1d`…`t4d`, `t1a_db`…`t4a_db`); no reverse/buffer-backwards parameter. Standard multi-tap tape delay.
4. **`fad_delay-swh.lv2`, `mod_delay-swh.lv2`, `delay-swh.lv2`** — checked; none have a reverse parameter.

**Recommendation:** Use **`revdelay-swh.lv2`** — it is a purpose-built reverse delay. Caveat: it is **continuous** (no threshold/attack trigger like the TimeLine's "only reverse loud notes" mode). If you need the threshold-triggered reverse capture, you'd have to gate the input externally (e.g. a noise gate before the delay) so only notes above a threshold enter the reverse buffer — practical on MOD-Host by inserting a gate (`gate-swh.lv2` exists in the SWH set) before `revdelay`.

## Duck (ducked delay)

**Ranking:**

1. **`gx_duck_delay_st.lv2` (Gxduck_delay_st) — best match, stereo, built-in ducker.** `trunk/src/LV2/faust/duck_delay_st.dsp`. Built-in envelope-follower ducker: `switcher(p_attack_time, p_release_time, p_amount) = an.amp_follower_ud(att,rel) : *_amount : _>1:(1 - _) : si.smooth(...)`. The delayed signal is multiplied by `(1 - envelope)`, so when you play (input high) the delay tail is attenuated; when you stop, the envelope decays and the tail swells back up. Controls: `Delay` (ms, 1–2000), `Feedback` (0–1), `Ping Pong` (cross-channel feedback), `Coloration` (±1, low-shelf + high-shelf tone), `Attack` (0.05–0.5 s), `Release` (0.05–2 s), `Amount` (0–56 dB, ducker depth), `Effect` (−16…+4 dB output). This is exactly a duck delay — sidechain is the dry input envelope, applied to the wet return, all internal. Stereo. Modeled on GVST GClipDly and Axe-FX II. Code quality good (Faust, clear comments). **Single plugin, no chaining needed.**
2. **`gx_duck_delay.lv2` (Gxduck_delay) — mono version of the above.** `trunk/src/LV2/faust/duck_delay.dsp`. Same algorithm (`an.amp_follower_ud` → `1 - env` × delay), same controls minus pingpong/coloration/effect level. Use this for a mono chain; identical ducker behavior. Ports per `gx_duck_delay.ttl`: TIME, FEEDBACK, DUCK (amount), ATTACK, RELEASE.
3. **Chain: delay → sidechain compressor (manual duck delay).** If a different delay character is desired, route the delay output into a sidechain compressor (`ZamComp.lv2` / `ZamCompX2.lv2` have sidechain inputs; `sc1–sc4-swh.lv2` are SC compressors) keyed by the dry input. This works on MOD-Host (sidechain CV/audio routing is standard MOD patching), but it's more wiring and CPU than the built-in `gx_duck_delay_st`, and the envelope shaping is split across two plugins' controls. Only worth it if you need a delay character the gx duck delays don't provide (e.g. tape/bucket-brigade color).

**Recommendation:** Use **`gx_duck_delay_st.lv2`** (stereo) or **`gx_duck_delay.lv2`** (mono). They have a proper built-in sidechain ducker (envelope follower on the dry input attenuating the wet return) with attack, release, and amount controls — a direct, single-plugin equivalent of the TimeLine Duck machine. No chaining required.

## Summary table

| Machine | Best choice | Type | Notes |
| :--- | :--- | :--- | :--- |
| **Pattern** | `gxechocat.lv2` | single | 3 tempo-synced tape heads (1/8, 1/4, dotted-1/8, 1/1), per-head enable. No true pattern sequencer exists in the set; `delayorama` has 128 taps but no rhythm grid; stepseq plugins output MIDI only and can't drive delay params on this device. |
| **Ice** | `am_pitchshift-swh.lv2` → delay | **chain required** | No single pitch-shifted-delay plugin. Shimmer reverb (`gx_shimmizita`) is a reverb, not a delay. Chain a pitch shifter (×2.0) into a delay with feedback; practical on MOD-Host. |
| **Reverse** | `revdelay-swh.lv2` | single | True reverse buffer delay, feedback, crossfade. Continuous (no threshold trigger) — add a gate before it if attack-triggered capture is needed. |
| **Duck** | `gx_duck_delay_st.lv2` (st) / `gx_duck_delay.lv2` (mono) | single | Built-in envelope-follower ducker with attack/release/amount. Exact match for the Duck machine; no chaining needed.
