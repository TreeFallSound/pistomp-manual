---
title: Playing Live
eleventyNavigation:
  parent: using
  key: playing-live
  title: Playing Live
  order: 5
---

# Playing Live

Three things bite on stage that never bite at home: levels that jump when you switch, a room that isn't your room, and controls that countermand each other.

## Matching levels

Snapshots don't level-match themselves. A drive lifts output even at unity, so any snapshot that adds gain reads louder until you pull it back. Set every snapshot to the same output except where the jump is the point, and check by ear — same phrase, switch, listen for the step.

A gain plugin at the end of the chain gives you one number per snapshot to trim, faster than rebalancing three pedals. Match the whole board to the rest of the set the same way, so a clean or bypassed board lands where front-of-house left the fader.

## Output headroom

Input gain has a meter — you set it at soundcheck ([Quick Start]({{ '/using/quick-start/#adjust-input-gain' | url }})). The output doesn't. Stack a drive, a boost, and a wetter reverb in one snapshot and you can clip the output converter with nothing on the LCD to show it, and it reads as a brittle top end the room pins on the PA.

Set your loudest snapshot a few dB under the ceiling and bring the rest down to meet it. The end-of-chain gain you level-match with is where you take that headroom back — pull the board down, not each pedal.

## Use the global equalizer

Reflective rooms — tile, glass, concrete — throw mids and highs back at you and pile up the low end. The [global EQ]({{ '/using/audio-midi/#global-eq' | url }}) sits after every board and stays constant through pedalboard changes, so it's a good place to make tweaks.

## Footswitches and snapshots can disagree

A footswitch toggles a plugin; a snapshot also sets that plugin's bypass state. When both touch the same plugin, the switch's meaning depends on which snapshot you're in — hit it after a snapshot that already turned the plugin on and you turn it off.

Give each plugin one owner. Either it's footswitch territory and no snapshot touches it, or it's the snapshots' and no switch is bound to it. Blend mode already assumes this: parameters driven by footswitch MIDI CCs stay out of the interpolation, so a blend never fights a switch.

## Setlists and banks

| Approach | Works when |
|----------|-----------|
| One pedalboard per song, snapshots for sections | Songs need different rigs |
| One pedalboard for the set, snapshots per song | Songs share a core sound |

The second avoids load gaps entirely; reach for it when the songs let you. The first is unavoidable when two songs need different plugins. One fortunate note: if a snapshot bypasses a plugin, you don't have to pay for it in CPU usage, so cognitive overload is the biggest risk factor of creating a monolithic pedalboard.

A **bank** is an ordered subset of pedalboards — see [MOD-UI]({{ '/using/mod-ui/#banks' | url }}) to build one. Sequence it to the running order so advancing a pedalboard moves you to the next song instead of down an alphabetical list. Open the System Menu and choose **Bank Select** to load a bank on the LCD.

We recommend binding `next_pedalboard` to a footswitch's [long-press](../configuration#long-press-actions), or even as a chord.
