---
title: Pitch Shifter
eleventyNavigation:
  parent: editorials
  key: pitch-shifter
  title: Pitch Shifter
  order: 6
---

# Pitch Shifter

If you need a treadle-controlled pitch shifter for dive bombs, octave-up leads, or detuned textures, **Super Whammy** is the closest match on the device. It uses a phase vocoder for smooth glissando on single-note lines, with configurable endpoints and a dry blend.

## Our pick: Super Whammy

<img src="{{ '/assets/images/plugin-pitch-superwhammy.png' | url }}" alt="Super Whammy" class="plugin-screenshot">

**Super Whammy** is a phase vocoder pitch shifter with continuous expression control. Set `First` and `Last` to your endpoints (e.g. 0 to +12 for an octave up), map your expression pedal to `Step`, and sweep between them. A `Clean` blend lets you mix dry signal with the shifted signal. `Fidelity` trades latency for quality — lower values give more glitchy character, higher values are smoother.

| First | Last | Clean | Fidelity |
|-------|------|-------|----------|
| 0 | +12 | 0 (full wet) | 1–2 |

On single-note lines the glissando is clean and smooth. On chords the phase vocoder smears transients — a different character from the original pedal's pitch-tracking confusion, but usable for texture.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Also great: Drop

<img src="{{ '/assets/images/plugin-pitch-drop.png' | url }}" alt="Drop" class="plugin-screenshot">

**Drop** uses the same phase vocoder engine as Super Whammy, but voiced as a drop-tuner: `Step` goes from 0 to -12 semitones. No dry blend, no octave-up range. Use it if you only need a fixed downward shift and don't need the clean mix.

**What you give up:** No octave-up range, no dry blend, less flexible endpoint control.

## Also considered

**MaPitchshift** is a granular delay-line shifter with a continuous `ratio` control covering ±2 octaves. The grains are free-running (not period-locked), so on monophonic input it's smooth but lacks the "intelligent" tracking of a pitch detector. Good fallback if the phase vocoder's CPU cost is too high.

**AM pitchshifter** is a dual-read-pointer delay-line shifter — the cheapest and glitchiest of the set. On chords it stutters as the crossfade hits discontinuities. Low CPU, intentionally lo-fi. Use it for a deliberately broken dive effect.

**Pitchotto** is a dual-voice granular shifter limited to ±1 octave. Designed for shoegaze detuned-double textures, not dramatic dives. Pretty for ambient, not a Whammy stand-in.

**TAP Pitch Shifter** is not a pitch shifter at all — it's a 3-tap delay-line phase modulator producing vibrato/chorus at 6 Hz. No static pitch shift, no treadle control. Wrong effect entirely.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| Super Whammy | MOD Team | GPL | [moddevices.com](http://moddevices.com) |
| Drop | MOD Team | GPL | [moddevices.com](http://moddevices.com) |
| MaPitchshift | DISTRHO | GPL | [distrho.sf.net](http://distrho.sf.net) |
| AM pitchshifter | Steve Harris | GPL | [plugin.org.uk](http://plugin.org.uk) |
| Pitchotto | SHIRO (Nino de Wit) | ISC | [github.com/ninodewit/SHIRO-Plugins](https://github.com/ninodewit/SHIRO-Plugins) |
| TAP Pitch Shifter | Tom Szilagyi | GPL | [moddevices.com](http://moddevices.com) |
