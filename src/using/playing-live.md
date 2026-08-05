---
title: Playing Live
eleventyNavigation:
  parent: using
  key: playing-live
  title: Playing Live
  order: 6
---

# Playing Live

## Matching levels

Many pedals do not provide unity gain out of the box (e.g. drives, modellers). Proper gain staging is crucial to ensure that tones that work at home or in the practice space translate to the stage.

Consider adding limiters or compressors at the end of complex / parallel chains to, but watch that you don't compromise playing dynamics. Try to match each pedalboard's default gain, so pedalboard changes don't make front-of-house's job difficult.

## Output headroom

Input gain has the LED clipping meters, but your output channels don't. Stack a drive, a boost, and a wetter reverb in one snapshot and you can clip the output converter with nothing on the LCD to show it. Adding a TinyGain to the end of your board is a solid approach that helps you monitor your sound from the browser. 

## Use the global equalizer

The [global EQ]({{ '/using/audio-midi/#global-eq' | url }}) sits after every board and stays constant through pedalboard changes, so it's a good place to make tweaks to counteract bad room tone.

## Footswitches and snapshots can disagree

Nothing stops a snapshot change from changing a paramater that's already bound to a footswitch or analog control via MIDI Learn. This can make it very difficult to keep track of your plugins' state.

You should provide this rigour yoursef: give each plugin one owner. Either it's footswitch territory and no snapshot touches it, or it's the snapshots' and no switch is bound to it. Blend mode already assumes this: parameters driven by footswitch MIDI CCs stay out of the interpolation, so a blend never fights a switch.

Tempo has the same problem. Every snapshot stores the transport BPM alongside its parameter values, and recalling one restores that BPM — so a tempo you tap mid-set is overwritten at the next snapshot change. Either save the pedalboard after tapping, or keep the tempo identical across every snapshot on the board.

## Setlists and banks

| Approach | Works when |
|----------|-----------|
| One pedalboard per song, snapshots for sections | Songs need different rigs |
| One pedalboard for the set, snapshots per song | Songs share a core sound |

The second avoids load gaps entirely; reach for it when the songs let you. The first is unavoidable when two songs need different plugins. One fortunate note: if a snapshot bypasses a plugin, you don't have to pay for it in CPU usage, so cognitive overload is the biggest risk factor of creating a monolithic pedalboard.

A **bank** is an ordered subset of pedalboards — see [MOD-UI]({{ '/using/mod-ui/#banks' | url }}) to build one. Sequence it to the running order so advancing a pedalboard moves you to the next song instead of down an alphabetical list. Open the System Menu and choose **Bank Select** to load a bank on the LCD.

We recommend binding `next_pedalboard` to a footswitch's [long-press](../configuration#long-press-actions), or even as a chord.
