---
title: Compressors
eleventyNavigation:
  parent: editorials
  key: compressors
  title: Compressors
  order: 11
---

# Compressors

A compressor is the least exciting pedal you'll ever buy and the one you'll leave on the longest. It evens out your picking, fattens single-note lines, and makes chords sit in the mix without you riding the volume knob. The wrong one squashes your transients, pumps your low end, and raises the noise floor until your quiet parts hiss. The right one you forget about within five minutes.

The pi-Stomp ships with over a dozen compressor and dynamics plugins. Most have never appeared in a single shared pedalboard. This guide walks every one we could read the source for, grouped by the job you actually want a compressor to do. There is no single best compressor here — there's the best one _for what you're playing_.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

---

## If you want transparent, always-on compression

You want a compressor that adds sustain and evens out your picking without sounding like it's doing anything. No pumping, no low-end loss, no noise floor boost. Set the threshold, forget it, play.

### Our pick: C\* Compress

<img src="{{ '/assets/images/plugin-comp-capscompress.png' | url }}" alt="Mono Compress" class="plugin-screenshot">

**C\* Compress** (shown as "Mono Compress" in MOD-UI) is a VCA compressor from Tim Goetze's CAPS plugin suite, written specifically with guitar sustain in mind. The envelope is fast and the top end stays present — to our ears it has a bright, percussive character that flatters clean picking rather than dulling it the way a softer optical-style detector can. It does one job, does it cleanly, and costs little CPU.

| Attack | Release | Threshold | Ratio | Makeup |
|--------|---------|-----------|-------|-------|
| 0.005 s | 0.05 s | −20 dB | 4 | Unity |

Place it first in your chain, before any drive. The bright top end helps it sit ahead of a fuzz or amp without getting muddy. If you find it edgy, follow it with a gentle tone cut rather than reaching for a darker compressor — the percussive envelope is the point.

### Also great: SC1

<img src="{{ '/assets/images/plugin-comp-sc1.png' | url }}" alt="SC1" class="plugin-screenshot">

**SC1** is Steve Harris's soft-knee RMS compressor — about 80 lines of clean, well-documented C. The soft knee is a genuine quadratic curve, not a hand-drawn approximation, and the RMS detector gives it a smoother, less grabby action than the peak-detecting alternatives. Attack ranges 2–400 ms, release 2–800 ms, ratio 1–10, knee 1–10 dB. Low CPU.

**What you give up:** No sidechain input and no wet/dry blend. The threshold tops out at 0 dB, so you can't push it with a hot signal to trigger gain reduction without first attenuating — fine on a guitar input, less convenient on a mix bus. If you want parallel compression or external EQ in the detector, look to Calf instead.

### Also great: TAP Mono Dynamics

<img src="{{ '/assets/images/plugin-comp-tapmono.png' | url }}" alt="TAP Mono Dynamics" class="plugin-screenshot">

**TAP Mono Dynamics** (Tom Szilagyi) is the odd one out: instead of ratio, threshold, and knee, it gives you 15 pre-defined curves covering 2:1 through 20:1 compression, plus limiting, expanding, and noise gating. The detector is RMS, attack 4–500 ms, release 4–1000 ms. It's a table-driven dynamics Swiss-army knife.

The table approach is less precise than dials — you pick a curve, not a ratio — but it's also less fiddly, and the inclusion of limiter and gate modes means one plugin covers three jobs. We'd reach for SC1 when we want one clean compressor and TAP when we want one plugin to do three things in a minimal chain.

### Also great: Invada Compressor

<img src="{{ '/assets/images/plugin-comp-invada.png' | url }}" alt="Invada Compressor" class="plugin-screenshot">

**Invada Compressor** is the most-used compressor in shared pedalboards — 5 occurrences, more than every other compressor on the device combined — and now that we've read the source, we can see why. It's a textbook RMS feed-forward VCA compressor by Fraser Stuart (2009), and its defining feature is what it _doesn't_ do: there is no tone shaping anywhere in the signal path. The detector is a running RMS over an adjustable window, the gain cell is a clean multiplier, and that's it. Flat frequency response, no low-end rolloff, no coloration. For bass, where the OTA/Ross/Dynacomp family famously eats your lows, that flat response is the whole game.

The control set is honest: RMS window size, attack (10 µs–750 ms), release (1 ms–5 s), threshold, ratio, output gain, and a NoClip toggle that engages an output soft-clipper. The soft clipper is a piecewise linear-to-exponential curve — linear below ±0.7, exponential above — that catches peaks without hard clipping. It's the same InoClip routine used across the Invada suite. Gain reduction is capped at −36 dB and metered. There's no sidechain, no blend, no lookahead, no knee control — hard-knee only. What you get is clean, flat, dependable leveling.

**What you give up:** No soft knee, so the compression onset is more abrupt than SC1's quadratic curve or ZamComp's adjustable knee. No blend — if you want parallel compression you'll need to route it yourself. The 2009 code is clean but old-school LV2 (no modern DPF/Faust polish), and the parameter conversion math is non-obvious (attack/release are scaled by the 10 dB time-constant formula). None of that affects the sound; it just means the knobs behave a little differently than a modern plugin's.

| RMS | Attack | Release | Threshold | Ratio | Gain | NoClip |
|-----|--------|---------|-----------|-------|------|--------|
| 0.5 | 15 ms | 50 ms | −12 dB | 4 | Unity | On |

This is the one to reach for when you want compression you can't hear — especially on bass, where the flat response preserves your low end and the NoClip soft clipper keeps transients from spiking your converter. The community's pedalboard choices were right.

### Also considered

**DIE Compressor** (Damien Zammit, Robin Gareus) is a near-twin of ZamComp — same soft-knee quadratic curve, same peak-detect VCA, same sidechain input. Differences: the Slew control is gone, release extends to 2 s, and makeup gain is smoothed with a 25 Hz one-pole to prevent clicks. Pick whichever UI you like looking at; ZamComp keeps the Slew.

**Compressor** (MOD System) and **Compressor Advanced** (MOD Advanced) are the end-of-chain compressors bundled into mod-host, developed by Jan Janssen for MOD Devices. The DSP is Sean Connelly's [sndfilter](https://github.com/velipso/sndfilter), implemented to the [WebAudio DynamicsCompressor spec](https://webaudio.github.io/web-audio-api/#the-dynamicscompressornode-interface). Two unusual details: the soft knee uses an exponential curve fit by a 15-iteration binary search, and the release is adaptive (a cubic polynomial that's slower for small gain reductions, faster for large ones). **Compressor** collapses this to three preset modes — Light/Mild/Heavy — plus release and master volume; **Compressor Advanced** exposes the full parameter set. No sidechain, no blend, no lookahead, no oversampling — the WebAudio spec wasn't designed for those. Worth trying on a full mix or end-of-chain slot, where the smooth gain transitions prevent pumping; for instrument-level compression the analog-modelled picks above are more predictable.

---

## If you want obvious, squashy compression

You want your compressor to _sound like a compressor_. Country chicken-pickin', funk rhythm, that squished sustain that makes notes bloom and pop. You want color and action, not transparency.

### Our pick: ZamComp

<img src="{{ '/assets/images/plugin-comp-zamcomp.png' | url }}" alt="ZamComp" class="plugin-screenshot">

**ZamComp** is Damien Zammit's mono VCA compressor — clean DPF C++, soft-knee, and the standout feature: a Slew control that adds extra attack time on rapid signal changes, reducing distortion on transients. That sounds technical, but the musical result is what matters: it lets you set a fast attack for obvious squash without the crackly, distorted envelope you get from a brute-force fast detector. Attack 0.1–100 ms, release 1–500 ms, knee 0–8 dB, ratio 1–20, threshold −80 to 0 dB, makeup 0–30 dB. Sidechain input. GR and output metering.

| Attack | Release | Knee | Ratio | Threshold | Makeup | Slew |
|--------|---------|------|-------|-----------|--------|------|
| 10 ms | 100 ms | 4 dB | 8 | −18 dB | To taste | 1 |

For country squash, set a fast attack and a high ratio; for funk sustain, slow the attack to let the transient through and shorten the release so the next note doesn't get swallowed. The Slew control is the secret — leave it on and the envelope stays clean even at aggressive settings.

### Also great: rkr Sustainer

<img src="{{ '/assets/images/plugin-comp-rkrsustainer.png' | url }}" alt="Sustainer" class="plugin-screenshot">

**rkr Sustainer** is Ryan Billing's two-knob compressor from rakarrack, and it is a different animal from the rkr Compressor engine, not a preset of it. A note struck through it hangs. The pick attack lands where you played it, and then, instead of the note falling away, the tail comes up underneath it and keeps coming — the long, blooming decay of a note held under a slide, without the pumping you'd get from a normal compressor chasing a dying string.

The trick is that its threshold isn't fixed. Each sample the threshold climbs toward the level of the compressed output, then relaxes back down, so the compressor gets out of the way as the note decays rather than clamping harder. Hit it hard and the threshold walks up with the attack; as the string dies, the threshold falls back and the gain rises into the tail.

The Sustain knob does three things at once. At maximum it drives the input **36 dB** hotter, raises the resting threshold, and tightens the feedback ratio, so "more sustain" is literally more gain into a harder-working detector. Timing is fixed and fast — a 10 ms peak decay behind a 12.5 ms hold, 50 ms envelope in both directions — and nothing filters anything, which is where the brightness comes from.

| Gain | Sustain |
|------|---------|
| 40 (trim to taste) | 85–100 |

Place it early, before dirt, and let the pedal after it hear a signal that already has the sustain baked in. Past about 110 the input drive turns audibly aggressive — a fine place to be, if that's what you want.

**What you give up:** No sidechain, no blend, no timing controls at all — attack and release are fixed. It's tuned for sustain, not surgical control. If you want to duck the detector with an external EQ, use ZamComp.

### Also great: GxCompressor

<img src="{{ '/assets/images/plugin-comp-gxcompressor.png' | url }}" alt="Compressor" class="plugin-screenshot">

**Compressor** (shown as "Compressor" in MOD-UI; GxCompressor) is Albert Graef's Faust compressor — 83 lines of clean DSP. Standard controls: attack 0–1 s, release 0–10 s, ratio 1–20, threshold −96 to 10 dB, knee 0–20 dB, makeup, with a gain-reduction meter. Lightweight, well-behaved, and costs almost nothing on CPU. The wide attack and release ranges let you dial in slow, smooth squash or fast, obvious pumping.

**What you give up:** No sidechain, no blend. It's a straight-ahead guitar compressor — which is exactly the point. Reach for it when you want something simple and dependable and ZamComp's control set is more than you need.

### Also considered

**rkr Compressor** is the conventional one of the rakarrack four, with a limiter hiding inside it — once the envelope crosses 0.9 the attack walks toward instantaneous and the release stretches out, and above 1.0 it becomes a hard limiter by level, no switch to flip. Turn on **Peak** for a leaky peak-hold with a hard ceiling at ±0.999. Leave **Stereo** off — it means *unlinked*, not "stereo mode," and off is the mono-summed detector you want. Two things keep it out of the picks: the Knee control ramps the effective ratio toward `log₂(ratio)` inside the knee (so at 4:1 the knee softens to 2:1, then snaps to 4:1 at the top of the bend — at ratio 2 the knee does nothing at all), and ratio bottoms out at 2, so above threshold this plugin is always compressing.

**MDA Dynamics** is Paul Kellett's 1999-era compressor/limiter/gate-in-one. It works, but the picks above are more musical for this use case.

---

## If you play bass (or need to preserve low end)

Single-band compressors eat your lows. A low note triggers compression, the whole signal drops, and the highs get swallowed along with the bass — that's the classic pumping artifact. Multi-band compressors split the signal into frequency bands and compress each one independently, so a thumping low E doesn't suck down your G string. If you slap, tap, play extended range, or just want your low end to survive compression, this is your bucket.

### Our pick: ZaMultiComp

<img src="{{ '/assets/images/plugin-comp-zamulticomp.png' | url }}" alt="ZaMultiComp" class="plugin-screenshot">

**ZaMultiComp** is Damien Zammit's 3-band compressor, and its crossovers are the standout detail: they use Andrew Simper's (Cytomic) state-variable filter design, which is higher quality than the simple one-pole filters in most multi-band plugins. Per-band attack, release, knee, ratio, threshold, and makeup — plus per-band bypass and per-band listen/solo, so you can hear exactly what each band is doing. Master trim and per-band output meters.

The listen/solo feature is what makes this a mixing tool rather than just a bass utility — solo a band, find the frequency that's causing trouble, and dial it in without guessing. The Cytomic SVF crossovers are the technical reason it sounds cleaner than a naive split.

**What you give up:** Three bands, not four. No auto makeup — you set output level per band yourself.

### Also great: GxMultiBandCompressor

**GxMultiBandCompressor** is guitarix's 3-band Faust compressor, and its crossovers really are Linkwitz-Riley, so the bands sum back flat. Fewer features than ZaMultiComp: no per-band listen/solo, no per-band bypass.

**What you give up:** The solo buttons, which is most of what makes ZaMultiComp pleasant to dial in.

### Also considered

**rkr CompBand** is the only 4-band compressor on the device — four copies of rkr Compressor behind three filter pairs — and we no longer recommend it. The filters are 2nd-order Butterworth, one low-pass and one high-pass at the same corner, summed with the same sign. That sums to a null:

```
LP(s) + HP(s) = (1 + s²)/(s² + √2s + 1)   →   zero at the crossover
```

A Linkwitz-Riley crossover cascades two Butterworth sections precisely so the bands sum flat. This one doesn't, so at unity band gains you get a notch at each crossover, and the notches only fill in when the per-band compressors pull the bands to different levels — its frequency response is a function of how hard it is working. Per band you get ratio and threshold only; attack, release, and knee are frozen at construction. Wet/Dry defaults to 5/127, so out of the box it sounds like a bypass.

**MDA MultiBand** is Paul Kellet's 1999-era 3-band with simple one-pole crossovers (significant band overlap). Its one unique trick is an M/S processing mode for stereo-width control — the only option here if you need M/S compression on a stereo source; otherwise ZaMultiComp's Cytomic crossovers win.

---

## If you want studio-grade control

You want every parameter. Sidechain input. Lookahead. Oversampling. You're recording, mixing, or you just like having knobs to turn. These are the most feature-complete compressors on the device.

### Our pick: Calf Mono Compressor

<img src="{{ '/assets/images/plugin-comp-calfmono.png' | url }}" alt="Calf Mono Compressor" class="plugin-screenshot">

**Calf Mono Compressor** is the most feature-complete compressor on the pi-Stomp, full stop. Attack, release, ratio, threshold, knee, and makeup are all there, plus sidechain input, wet/dry blend for parallel compression, auto makeup, auto release, lookahead, an oversampling option, and a peak/RMS detection toggle. The Calf Studio Gear suite is the most polished open-source DSP collection shipping on the device, and it's actively maintained — last commit 2024.

If you've used a pro studio compressor plugin, this will feel familiar. The blend control alone changes the game: run the compressor hard and mix the uncompressed signal back in, and you get the sustain and leveling of heavy compression without the squashed transient. That's parallel compression, the mix-bus engineer's trick, and Calf does it in one knob.

| Attack | Release | Ratio | Threshold | Knee | Makeup | Blend | Detection | Lookahead |
|--------|---------|-------|-----------|------|--------|-------|-----------|-----------|
| 10 ms | 150 ms | 4 | −18 dB | 6 dB | Auto | 30% | RMS | 1 ms |

The oversampling option reduces aliasing on fast transients and is worth turning on for recording, though it costs CPU — watch your XRUNs in MOD-UI if your chain is already busy.

### Also great: Molot Lite Mono

<img src="{{ '/assets/images/plugin-comp-molot.png' | url }}" alt="Molot Lite Mono" class="plugin-screenshot">

**Molot Lite Mono** is a port of a commercial VST compressor by Vladislav Goncharov and Bernhard Rusch — the original Molot was a paid plugin, and this is the lite version released as open source. Its signature is a diode-modeled envelope follower that gives the detector an analog character — the release behaves the way a real circuit's release capacitor charges and discharges, not the way a digital RMS window averages. Attack 0.1–200 ms with a Smooth/Sharp mode toggle, release 5–2000 ms, threshold −60 to 0 dB, knee 0–10 dB, ratio 1:1 to 100:1, makeup 0–24 dB. Input gain, dry/wet mix, and a sidechain HPF (40–260 Hz or off) are all there. There's even an ISO226:2003 phon80 low-shelf filter in the sidechain path — an equal-loudness contour, the kind of detail you only see in carefully designed mastering tools.

The Sharp/Smooth attack toggle changes the envelope follower's response shape. Sharp is faster and more aggressive; Smooth rounds the detector for a gentler, more analog feel.

**What you give up:** No lookahead and no oversampling, so it won't catch the very fastest transients as cleanly as Calf with lookahead engaged. The ratio range to 100:1 is effectively a brickwall limiter at the top, which is more range than most need — but it's there if you want it. This is the compressor to reach for when you want analog character and Calf sounds too clean.

### Also considered

**ZamCompX2** is the stereo version of ZamComp, with the same soft-knee and slew control plus a sidechain input. It's clean DPF C++ and a fine choice if you want ZamComp's character on a stereo source — but it doesn't add lookahead or oversampling, so it's not in the same "studio control" tier as Calf or Molot. Think of it as ZamComp in stereo, not a separate studio tool.

---

## If you want a gate or an expander

A compressor pulls loud things down. An expander pushes quiet things further down — hiss between phrases, amp buzz under a rest, the tail of a note you'd rather not hear. Crank the ratio and an expander becomes a gate.

### Our pick: rkr Expander

<img src="{{ '/assets/images/plugin-comp-rkrexpander.png' | url }}" alt="rkr Expander" class="plugin-screenshot">

Below the threshold, **rkr Expander** doesn't slam shut — it rolls off along an exponential curve, the same `e^x − 1` shape a transistor junction gives you. The `Shape` control sets how steep that curve is. High Shape is a gate: notes stop when you stop. Low Shape is the more interesting setting, because the signal fades in as it crosses the threshold, so a chord swells up out of silence under your picking hand instead of snapping on. For swells, drop Shape to about 6 and stretch Attack out to 400–900 ms. Release governs how fast the gain opens as well as how fast it closes; Attack only shapes the envelope follower's rise.

| Threshold | Shape | Attack | Release | LPF | HPF | Output |
|-----------|-------|--------|---------|-----|-----|--------|
| −50 dB | 22 | 50 ms | 50 ms | 26000 Hz | 20 Hz | 10 |

**Open the LPF and HPF before you do anything else.** They are 2-pole Butterworth filters sitting in your signal path, not in a sidechain, and they ship defaulted to 3134 Hz and 76 Hz. Drop the Expander in at factory settings and it darkens your tone before it has expanded a thing. Set them to the extremes for transparency, or use them deliberately — a low LPF makes the detector-plus-tone pairing behave like a dark noise gate for high-gain work.

### Also considered

**TAP Mono Dynamics** and **MDA Dynamics** both include gate and expander curves alongside their compression, and if one of them is already in your chain there's no reason to add a second plugin. Neither does swells.

There is **no rakarrack noise gate** on the device, despite what the upstream source tree suggests. `Gate.C` is compiled but never registered in the bundle manifest. The Expander is the gate.

---

## If you want something weird

### Pressure5

<img src="{{ '/assets/images/plugin-comp-pressure5.png' | url }}" alt="Pressure5" class="plugin-screenshot">

**Pressure5** is Chris Johnson's (Airwindows) vari-µ (variable-mu) compressor, ported to LV2 by Hannes Braun. A vari-µ compressor changes its gain ratio in response to the signal itself — the harder you drive it, the more it compresses — which is the topology behind the classic tube compressors (Manley, Fairchild). The envelope is adaptive: the release time varies with how hard the signal hit. There's a two-stage interleaved coefficient processing trick to keep the envelope smooth at low sample rates, and a built-in ClipOnly2 anti-aliased soft clipper catches peaks.

The genuinely novel control is "Mewiness," which blends between squared and sqrt coefficient response in the detector. That sounds like a joke name, and it might be — but it's a real DSP parameter that changes the curvature of the compression response, and no other compressor on the device does anything like it. Pressure (threshold), Speed (release), Mewiness, Output, and Wet/Dry are the whole control set. Five knobs, and one of them is unlike anything else here.

This is the character piece. It won't replace a transparent compressor or a studio workhorse, and the controls are too abstract to dial in by the numbers — you set it by ear. But if you want a compressor that sounds like something rather than nothing, and you're willing to experiment, this is the one to load. Airwindows has a cult following for exactly this kind of analog-flavored, idiosyncratic DSP.

---

## Quick comparison

| Category | Our pick | Also great | Also great |
|----------|----------|------------|------------|
| Transparent / always-on | C\* Compress | SC1 | Invada Compressor |
| Squash / effect | ZamComp | rkr Sustainer | GxCompressor |
| Multi-band / bass | ZaMultiComp | GxMultiBandCompressor | — |
| Studio pro | Calf Mono Compressor | Molot Lite Mono | — |
| Gate / expander | rkr Expander | — | — |
| Weird / character | Pressure5 | — | — |

---

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| C\* Compress | Tim Goetze (CAPS) | GPL | [moddevices.com/plugins/caps](http://moddevices.com/plugins/caps/Compress) |
| SC1 | Steve Harris | GPL | [plugin.org.uk](http://plugin.org.uk/swh-plugins/sc1) |
| TAP Mono Dynamics | Tom Szilagyi | GPL-2.0 | [tap-plugins.sf.net](https://tap-plugins.sourceforge.net) |
| ZamComp | Damien Zammit | GPL-2.0+ | [github.com/zamaudio/zam-plugins](https://github.com/zamaudio/zam-plugins) |
| ZamCompX2 | Damien Zammit | GPL-2.0+ | [github.com/zamaudio/zam-plugins](https://github.com/zamaudio/zam-plugins) |
| ZaMultiComp | Damien Zammit | GPL-2.0+ | [github.com/zamaudio/zam-plugins](https://github.com/zamaudio/zam-plugins) |
| rkr Sustainer | Ryan Billing | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr Compressor | Josep Andreu, Ryan Billing, after Kretz & Westerfeld | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr Expander | Ryan Billing, Josep Andreu, after Steve Harris | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| rkr CompBand | Ryan Billing, Josep Andreu, Nasca Octavian Paul | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| GxCompressor | Albert Graef (guitarix) | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| GxMultiBandCompressor | Albert Graef (guitarix) | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Calf Mono Compressor | Calf Studio Gear | LGPL | [calf.sourceforge.net](http://calf.sourceforge.net) |
| Molot Lite Mono | Vladislav Goncharov, Bernhard Rusch | GPL | [github.com/bernhardrusch/molot-lite-mono-lv2](https://github.com/bernhardrusch/molot-lite-mono-lv2) |
| Pressure5 | Chris Johnson (Airwindows), port by Hannes Braun | MIT | [hannesbraun.net](https://hannesbraun.net/ns/lv2/airwindows/pressure5) |
| MDA Dynamics | Paul Kellett | GPL | [github.com/moddevices/mda-lv2](https://github.com/moddevices/mda-lv2) |
| MDA MultiBand | Paul Kellett | GPL | [github.com/moddevices/mda-lv2](https://github.com/moddevices/mda-lv2) |
| Compressor (MOD System) | Jan Janssen (VeJa / MOD Devices), DSP by Sean Connelly | ISC / MIT | [github.com/moddevices/mod-host](https://github.com/moddevices/mod-host) |
| Compressor Advanced (MOD) | Jan Janssen (VeJa / MOD Devices), DSP by Sean Connelly | ISC / MIT | [github.com/moddevices/mod-host](https://github.com/moddevices/mod-host) |
| DIE Compressor | Damien Zammit, Robin Gareus | GPL-2.0+ | [github.com/DISTRHO/DIE-Plugins](https://github.com/DISTRHO/DIE-Plugins) |
| Invada Compressor | Fraser Stuart (Invada) | GPL-2.0 | [launchpad.net/invada-studio](https://launchpad.net/invada-studio) |

The four rkr plugins are ports of the rakarrack guitar effects rack, and the dynamics code has three generations of authorship behind it. rkr Compressor and rkr CompBand descend from `artscompressor.cc` by Matthias Kretz and Stefan Westerfeld, reworked by Ryan Billing in 2009. rkr Expander is adapted from Steve Harris's swh-plugins noise gate. rkr Sustainer is Ryan Billing's own. LV2 port by Spencer Jackson.