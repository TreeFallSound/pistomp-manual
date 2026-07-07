---
title: Wah
eleventyNavigation:
  parent: plugins
  key: wah
  title: Wah
  order: 7
---

# Wah

If you need a wah pedal for classic vocal-style filter sweeps, **GxCrybaby** is the most accurate model on the device. **Wah** sounds nearly identical if you prefer a different UI. For hands-free operation, **Switchless Wah** opens and closes the filter based on how hard you play.

## Our pick: GxCrybaby

<img src="/assets/images/plugin-wah-crybaby.png" alt="GxCrybaby" class="plugin-screenshot">

**GxCrybaby** is a circuit-accurate model of the Dunlop GCB-95 Cry Baby. The developers ran a SPICE simulation of the real pedal's inductor-capacitor network at multiple pedal positions, then fit a 4th-order filter to each one — the same approach used in high-end amp modelling. The result is a sweep that goes from a deep, resonant low-end at heel to a bright, cutting peak at toe, with the correct inverted-log taper that makes it feel just right.

## Runner-up: Wah

<img src="/assets/images/plugin-wah-wah.png" alt="Wah" class="plugin-screenshot">

**Wah** uses the same Cry Baby circuit model — a different curve fit from the same SPICE data, but audibly near-identical. It's the manual pedal sibling of the autowah bundle.

**What you give up:** No volume trim. Functionally the same sound; choose whichever UI you prefer.

## Also considered

**Switchless Wah** uses the same filter as Wah, but the sweep is driven by an envelope follower — a tiny circuit that tracks how hard you play and sweeps the filter automatically. Play harder and the wah opens; stop and it closes. No expression pedal needed. Great for hands-free wah textures.

**Wahwah** is a 7-model switcher of other vintage wahs (Colorsound, Dallas, Foxx, Jen, Maestro, Selmer, Vox V847). Each is its own SPICE-derived filter model. None of them is a Cry Baby, but model 6 (Vox V847) is the closest. A flexible wah, but not a GCB-95 stand-in.

## On expression pedals

To use an expression pedal with a wah, first enable it by running the appropriate `~/extras` script on the pi-Stomp, then reboot the device. In MOD-UI, click the Gear icon to open the effect details menu, then the Controls icon at the bottom right of the WAH parameter. Assign it to "MIDI", click "Save," then move your expression pedal.

MOD-UI will now map the incoming MIDI CC to that port automatically. Remember to save your pedalboard at the top of the screen after you're done so the binding survives pedalboard changes and reboots.

<img src="/assets/images/plugin-wah-expr-pedal.png" alt="Expression pedal setup" style="display:block;width:80%;margin:0 auto 1rem auto">

## Credits

| Plugin | Author | License | Homepage |
|--------|--------|---------|----------|
| GxCrybaby | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Wah | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Switchless Wah | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
| Wahwah | Guitarix team | ISC | [guitarix.sourceforge.net](http://guitarix.sourceforge.net) |
