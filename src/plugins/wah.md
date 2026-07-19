---
title: Wah
eleventyNavigation:
  parent: editorials
  key: wah
  title: Wah
  order: 7
---

# Wah

A wah is a resonant peak you move through the midrange. The question is what moves it. Put your foot on it and you get the classic vocal sweep — **GxCrybaby** is the most accurate model on the device for that. Let your picking hand move it and you get something squishier and more reactive: **rkr MuTroMojo** is the envelope wah, and it's a genuinely different pedal, not a Cry Baby on autopilot.

## Our pick: GxCrybaby

<img src="{{ '/assets/images/plugin-wah-crybaby.png' | url }}" alt="GxCrybaby" class="plugin-screenshot">

**GxCrybaby** is a circuit-accurate model of the Dunlop GCB-95 Cry Baby. The developers ran a SPICE simulation of the real pedal's inductor-capacitor network at multiple pedal positions, then fit a 4th-order filter to each one — the same approach used in high-end amp modelling. The result is a sweep that goes from a deep, resonant low-end at heel to a bright, cutting peak at toe, with the correct inverted-log taper that makes it feel just right.

## Also great: rkr MuTroMojo

<img src="{{ '/assets/images/plugin-wah-mutromojo.png' | url }}" alt="rkr MuTroMojo" class="plugin-screenshot">

**rkr MuTroMojo** is the envelope wah. The filter is a resonant state-variable band, and the envelope that sweeps it listens through a 630 Hz sidechain highpass — so a low open string doesn't drag the filter open the way it does on a follower that hears the full spectrum. Your picking hand runs the sweep. Dig in and it blooms open; back off and it settles. An LFO can run underneath if you want the filter moving even when you aren't.

Where the Cry Baby models are vocal and precise, this is vocal and squishy. It answers to touch instead of a treadle, which makes it the one to reach for on funk rhythm parts and anywhere you want your hands on the strings.

**What you give up:** The treadle. You cannot park the filter — the envelope decides where the peak sits, and it always comes back. Turn Wet/Dry up before you judge it: this plugin ships at 0, so it sounds bypassed on load.

## Also considered

**Wah** uses the same Cry Baby circuit model as GxCrybaby — a different curve fit from the same SPICE data, audibly near-identical. It's the manual pedal sibling of the autowah bundle, and it has no volume trim. Choose whichever UI you prefer.

**Switchless Wah** uses the same filter as Wah, driven by an envelope follower instead of a pedal. It's the guitarix answer to the same job MuTroMojo does, built on the Cry Baby filter rather than a state-variable band, and its detector hears the full spectrum. Worth trying if you want the envelope treatment with the GCB-95 voice.

**Wahwah** is a 7-model switcher of other vintage wahs (Colorsound, Dallas, Foxx, Jen, Maestro, Selmer, Vox V847). Each is its own SPICE-derived filter model. None of them is a Cry Baby, but model 6 (Vox V847) is the closest. A flexible wah, but not a GCB-95 stand-in.

## On expression pedals

To use an expression pedal with a wah, first enable it by running the appropriate `~/extras` script on the pi-Stomp, then reboot the device. In MOD-UI, click the Gear icon to open the effect details menu, then the Controls icon at the bottom right of the WAH parameter. Assign it to "MIDI", click "Save," then move your expression pedal.

MOD-UI will now map the incoming MIDI CC to that port automatically. Remember to save your pedalboard at the top of the screen after you're done so the binding survives pedalboard changes and reboots.

<img src="{{ '/assets/images/plugin-wah-expr-pedal.png' | url }}" alt="Expression pedal setup">

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| GxCrybaby | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Wah | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Switchless Wah | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Wahwah | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| rkr MuTroMojo | Ryan Billing | GPL-2.0 | [github.com/ssj71/rkrlv2](https://github.com/ssj71/rkrlv2) |
