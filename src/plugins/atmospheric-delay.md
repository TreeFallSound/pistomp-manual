---
title: Atmospheric Delay
eleventyNavigation:
  parent: editorials
  key: atmospheric-delay
  title: Atmospheric Delay
  order: 2
---

# Atmospheric Delay

If you need a multi-machine delay for shoegaze or ambient, these pedals can get you most of the way there. No single plugin covers all 12 delay types, but **Tal-Dub-3** handles the core territory, while dedicated plugins are credible replacements for Reverse, Duck, and Ice modes.

## Our pick: Tal-Dub-3

<img src="{{ '/assets/images/plugin-strymon-taldub3.png' | url }}" alt="Tal-Dub-3" class="plugin-screenshot">

**Tal-Dub-3** is the most polished delay plugin on the device — TAL Software's original, ported via DISTRHO/JUCE. It runs at 2× oversampling with allpass-style fractional interpolation, a DC-blocked feedback path with Moog-ladder lowpass and tanh saturation, and a tape-style time-slew modulation layer. This gives it a warm, evolving character, covering Digital, Tape, Analog, Modern, and Tube delay types in a single plugin.

| Delay | Feedback | Tone | Tape mod |
|-------|----------|------|----------|
| Tempo-synced to taste | 0.4–0.6 | 0.5–0.7 (warm) | 0.3–0.5 |

Place it as your main delay send. The tape-style time modulation produces the same pitch-wobble character as a tape delay machine, while the filter+saturation path covers Analog and Tube textures.

New to loading plugins? See [Plugins & Effects]({{ '/using/plugins/' | url }}) for how to browse and add them in MOD-UI.

## Also great: Bollie Delay XT

<img src="{{ '/assets/images/plugin-strymon-bolliedelayxt.png' | url }}" alt="Bollie Delay XT" class="plugin-screenshot">

**Bollie Delay XT** is the most feature-complete delay on paper: true stereo with ping-pong and crossfeed, separate HPF+LPF biquads in both the pre-delay and feedback paths, a sine LFO for modulation, and per-channel tempo sync with dotted/triplet divisions. It covers Sweep and Modern delay types better than Tal-Dub-3 thanks to its dedicated filter section.

**What you give up:** The sonic character is a notch below Tal-Dub-3 — plain linear interpolation (no oversampling) with no analog-style saturation. Use it when you need ping-pong stereo width or aggressive filter sweeps.

## Per-machine guide

### Reverse: Reverse Delay

<img src="{{ '/assets/images/plugin-strymon-revdelay.png' | url }}" alt="Reverse Delay" class="plugin-screenshot nudge-left">

**Reverse Delay** is a purpose-built reverse delay: a circular buffer where the read head moves backward as the write head advances, with feedback and a configurable crossfade window to avoid clicks. Max delay is 5 seconds. It is continuous (no attack-triggered capture), so add a noise gate before it if you need threshold-gated reverse.

### Duck: Duck Delay Stereo

<img src="{{ '/assets/images/plugin-strymon-duckdelay.png' | url }}" alt="Duck Delay Stereo" class="plugin-screenshot">

**Duck Delay Stereo** has a built-in envelope-follower ducker: the delayed signal is attenuated while you play and swells back when you stop. Controls for attack, release, and duck amount make this a direct single-plugin equivalent of a duck delay. Stereo, with ping-pong and coloration controls.

### Ice: AM pitchshifter → GxEcho-Stereo (chain)

No single plugin does pitch-shifted delay taps. Chain **AM pitchshifter** (set to 2.0 for +1 octave) into **GxEcho-Stereo** with feedback. Each repeat is re-pitched because the shifter sits before the feedback loop, producing the ascending shimmer tail. For a less aggressive shimmer, lower the pitch shift ratio.

### Pattern: rkr Echotron

**rkr Echotron** is a pattern delay, and it goes further than the machine it replaces. Up to 128 taps, each with its own time, pan, level, and its own resonant state-variable filter, read from a `.dly` pattern file. Two LFOs run on top: one modulates the tap times, the other sweeps the tap filters. A rhythmic pattern where each repeat lands in a different place in the frequency spectrum, breathing as it decays. Nothing else on the device does this.

The catch is the interface: patterns are text files, not knobs. MOD-UI gives you a file chooser, and you author or edit the `.dly` table by hand.

If you'd rather stay in knob-land, **Bollie Delay XT** with tempo-synced ping-pong and short delay times approximates rhythmic repeats, or chain multiple delays at different subdivisions.

## Also considered

**bentdelay** is a deliberate one-trick lo-fi delay (bitcrush via ring-buffer mask). It covers the Lofi type with genuine character, but it's a one-trick pony — clean, modulated, or stereo delays it is not.

**Modulay** is a mono modulation delay (chorus/vibrato/flanger morph) with a narrow focus — pair it with Tal-Dub-3 if you want the modulated texture, but don't use it as your only delay.

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| Tal-Dub-3 | TAL-Togu Audio Line | GPL | [tal-software.com](https://tal-software.com) |
| Bollie Delay XT | Bollie | GPL | [ca9.eu/lv2](https://ca9.eu/lv2) |
| Reverse Delay | Steve Harris | GPL | [plugin.org.uk](http://plugin.org.uk) |
| rkr Echotron | Ryan Billing | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
| Duck Delay Stereo | Guitarix team | GPL | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| AM pitchshifter | Steve Harris | GPL | [plugin.org.uk](http://plugin.org.uk) |
| GxEcho-Stereo | Guitarix team | GPL | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| the infamous bent delay | Spencer Jackson | GPL-2.0 | [ssj71.github.io/infamousPlugins](http://ssj71.github.io/infamousPlugins) |
| Modulay | SHIRO (Nino de Wit) | ISC | [github.com/ninodewit/SHIRO-Plugins](https://github.com/ninodewit/SHIRO-Plugins) |
