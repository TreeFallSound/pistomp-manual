---
title: Ethernet Audio Interface
eleventyNavigation:
  parent: using
  key: ethernet-audio
  title: Ethernet Audio Interface
  order: 11
---

# Ethernet Audio Interface

The pi-Stomp can act as an audio interface for a DAW over an Ethernet cable, sending its audio to your computer and receiving audio back. No USB audio interface, no re-amping, no second sound card. You record the exact signal your pedalboard is producing.

This runs on netJACK2, JACK's own network transport. The pi-Stomp keeps running its normal audio stack and JackBridge attaches as one more client, so your pedalboard doesn't change or reload when you turn it on.

## What you need

- An Ethernet cable from the pi-Stomp to your computer, or to a switch both are on
- JACK on the computer side, joined to the same netJACK2 group

A direct cable between the two works and is the lowest-latency option; the service prefers a direct-cable `169.254.x` link when it finds one.

## Turning it on

1. Highlight the **network** icon in the toolbar and click
2. Choose **Wired Connection** — the row only appears when a cable is actually plugged in and the link is up
3. Click **Enable**

The screen is titled **Ethernet Audio Interface** and shows:

| Row | What it tells you |
|-----|-------------------|
| **IP** | The wired address. Shown whether or not the bridge is running |
| **Sample Rate** | The negotiated rate, once running |
| **Period** | Frames per period, once running |
| **xruns 1m / 5m / 15m** | Dropout counts over the last minute, five minutes, and fifteen |

The three XRUN buckets are the reason to keep this screen open during a take. Network audio is less forgiving than a local card, and a rising 1-minute count tells you the link is struggling while there's still time to do something about it. If they climb, raise the period on the DAW side before blaming the cable.

**Mute MOD** silences the pi-Stomp's own outputs while the bridge keeps streaming. Use it when the DAW is already monitoring and you don't want the sound twice.

## Notes

The bridge is enabled on demand from the LCD and is not started at boot, so it costs nothing when you aren't recording.

If **Wired Connection** never appears, the pi-Stomp sees no wired carrier — check the cable and that the far end is powered. If it appears but enabling fails, the service could not find a wired interface to pin the netJACK2 multicast group to; that failure is deliberate and loud, because the alternative is discovery leaking out over WiFi and appearing to work while sounding terrible.

To pin the bridge to a particular NIC, set `JACKBRIDGE_IFACE` in `/etc/default/jackbridge`. Leaving it unset auto-detects.
