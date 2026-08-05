---
title: Expression Pedals
eleventyNavigation:
  parent: control
  key: expression-pedals
  title: Expression Pedals
  order: 2
---

# Expression Pedals

An expression pedal is a potentiometer on a treadle. The pi-Stomp reads its position on an analog input, converts it to a MIDI CC, and sends that CC into mod-host like any other control. Nothing about it is special once the CC exists — which is why an expression pedal can drive any plugin parameter, a blend between snapshots, or a control voltage line.

The v3 board has the input; the 1/4" jack comes with the [MIDI + Expression Add-On Kit]({{ '/building/ordering-parts/#optional-midi--expression-add-on-kit' | url }}).

## Which pedals work

There is no standard for expression pedal wiring. Most pedals — Moog EP-2, Roland EV-5, M-Audio EX-P — wire their internal pot as a voltage divider across a TRS plug: tip is the wiper, ring is the voltage reference, sleeve is ground. That is what the pi-Stomp input expects.

| Wiring | Example | Works |
|--------|---------|-------|
| TRS, tip = wiper | Moog EP-2, Roland EV-5, M-Audio EX-P | Yes |
| TRS, tip and ring reversed | Some Yamaha pedals | Rewire the plug, or use a TRS swap adapter |
| TS (mono) | Line 6 EX-1 | No |

If you can't find your pedal's wiring, put an ohm meter across tip/sleeve and sweep the treadle, then repeat for ring/sleeve. The pair with the wider resistance sweep contains the wiper.

The pot value matters less than the taper: anything from 1k to 100k works, and linear taper tracks far better across the treadle than log/audio taper.

If you wire your own jack rather than using the add-on kit, use a switched jack and tie the tip switch to ground. With nothing plugged in, an unswitched analog input floats, reads as constantly changing, and sends a stream of spurious MIDI CC messages that eat CPU and can move whatever parameter the pedal is mapped to.

## Enabling the input

The expression input is commented out in the default config, because an enabled-but-unconnected analog input is exactly the floating-input problem above. Enable it with the included script:

```bash
ssh pistomp@pistomp.local
~/extras/expression-pedal.sh on
```

That uncomments the `analog_controllers:` block in `default_config.yml`. Reboot, or restart the controller service, for it to take effect. `~/extras/expression-pedal.sh off` reverses it.

The block it writes, and what each field does, is in [Configuration]({{ '/using/configuration/#analog-controls-knobs-and-expression-pedal' | url }}). The one field worth knowing here is `autosync`: with it on, the pedal's current physical position is sent when a pedalboard loads, so the parameter matches the treadle instead of jumping the first time you move it.

## Assigning it to a parameter

Assignment happens in MOD-UI, using MIDI learn — the pedal is just a CC source.

1. Open the plugin's settings with the gear icon.
2. Click the modify button under the parameter you want to control.
3. Choose **MIDI**, then **Save**.
4. Move the treadle. A confirmation appears in the upper right.
5. Save the pedalboard, or the binding is lost on the next load.

If no confirmation appears, the control is probably already assigned to another parameter on this pedalboard — a control can only drive one parameter at a time. See [Un-assigning a control]({{ '/using/mod-ui/#un-assigning' | url }}).

### Restricting the range

The **Advanced** option on the modify dialog lets you set the range the pedal sweeps rather than using the parameter's full range. If a drive's Gain runs 0–10 and you never want it below 5, set the low value to 5 — heel-down now gives you 5, and the whole treadle covers the range you actually use. This is the difference between a usable wah sweep and one where the useful part is the last inch of travel.

## What else it can drive

| Use | Where it's documented |
|-----|----------------------|
| A wah, or any single plugin parameter | [Wah]({{ '/plugins/wah/#on-expression-pedals' | url }}) |
| Morphing between snapshots | [Blend mode]({{ '/using/configuration/#blend-mode' | url }}) |
| Modulating anything via CV | [Control Voltage]({{ '/using/control-voltage/' | url }}) |

## More than one

The MCP3008 ADC has 8 channels and v3 uses all of them: four footswitches, the navigation encoder's switch, the expression jack, and the two VU meters behind the input clipping LEDs. See [Pinouts]({{ '/building/pinouts/' | url }}) for the channel map.

So a second expression pedal means giving something up. Dropping a footswitch frees channel 3; dropping the right-channel clipping LED frees channel 7. Both mean getting inside the enclosure and wiring a jack to the analog header. The [customization guide](https://www.treefallsound.com/wiki/doku.php?id=customization_guide) on the old wiki covers that wiring — it is written for v2, so treat its pinout as v2-specific and its electrical guidance as general.

Give each controller its own `adc_input` and its own `midi_CC`, and only define inputs that actually have something connected to them.
