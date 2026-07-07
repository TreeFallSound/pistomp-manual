---
title: Troubleshooting
eleventyNavigation:
  parent: using
  key: troubleshooting
  title: Troubleshooting
  order: 10
---

# Troubleshooting

## No audio

| Possible cause | Try |
|----------------|-----|
| Incorrect routing | Check cabling: instrument → In1, Out1 → amp. In MOD-UI, connect a virtual cable straight from Hardware Capture 1 to Hardware Playback 1 |
| Volume is down | Turn the Volume knob (Tweak 3) up. Check Input Gain in the System Menu |
| Processing is bypassed | The power icon in the toolbar should be green. Click it to toggle |
| Audio card configuration | SSH in and run: `alsactl -f ~/pi-stomp/setup/audio/iqaudiocodec.state restore` |
| Services in bad state | System Menu → **Restart sound engine**, or SSH: `sudo systemctl restart jack` |
| Hardware | Add a TinyGain plugin to the pedalboard. If the meter shows -inf with signal, the problem is likely the audio card or input wiring |

## Audio glitching (pops, crackles)

| Possible cause | Try |
|----------------|-----|
| Overworked CPU | In MOD-UI, check CPU meter and XRUN count. Increase the JACK period size (see [Performance Tuning]({{ '/using/performance' | url }})) or remove plugins |
| Overheating | Run `vcgencmd get_throttled`. If throttling, improve ventilation. Normal temp is 45–60°C |
| Low power supply voltage | Run `dmesg \| grep -i voltage`. Use the 27W factory adapter |
| Unnecessary processes | Shut down any extra software you've installed |

## No audio from headphone jack

Turn up the output volume (Tweak 3). The headphone output follows the same audio as the main outputs. Low-impedance earbuds (< 50 ohms) may sound quiet — use higher-impedance headphones.

## Cannot connect via WiFi

| Possible cause | Try |
|----------------|-----|
| Hotspot mode | WiFi icon is orange. Connect your computer to the **pistomp** hotspot (password: **pistompwifi**), or click the WiFi icon and switch to router mode |
| Out of range | Move pi-Stomp closer to the router. Reboot by cycling power |
| Wrong config | Click WiFi icon → **Configure WiFi** and set the correct SSID and password |
| mDNS not working | Use the IP address from System Menu → **System Info** instead of [pistomp.local](http://pistomp.local) |

## Cannot SSH

If you see "The ECDSA host key for pistomp.local has changed":

```bash
ssh-keygen -R pistomp.local
```

## LCD is white or stuck on the logo

| Possible cause | Try |
|----------------|-----|
| Service error | SSH in and run: `sudo journalctl -fu mod-ala-pi-stomp` to see the error |
| Audio card config (v2) | Run `~/pi-stomp/util/change-audio-card.sh` and select your card |

## Footswitch or encoder not working

The surface-mount debounce components near the MCP3008 chip can have soldering defects. Each switch uses two 10k resistors and a capacitor:

| Switch | Pull-up | Debounce |
|--------|---------|----------|
| Encoder | R5 | R6 |
| Footswitch A | R7 | R8 |
| Footswitch B | R9 | R10 |
| Footswitch C | R11 | R12 |
| Footswitch D | R13 | R14 |

Check for misaligned or poorly soldered resistors. Reflow the joint if needed.

## Expression pedal not working

The expression pedal input is disabled by default. Run the enable script:

```bash
ssh pistomp@pistomp.local
~/extras/expression-pedal.sh on
```

Then restart the pi-Stomp service or reboot. See the [Configuration]({{ '/using/configuration' | url }}) page for details on the `analog_controllers` settings.

## General hardware troubleshooting

The `dmesg` command shows kernel logs which may contain useful information when debugging hardware failures:

```bash
dmesg | less
```

Enter `q` to exit. Look for lines mentioning `error`, `fail`, or specific hardware names (e.g. `spi`, `mcp3008`, `audio`).

## General software debugging

Check service status:

```bash
sudo systemctl list-units --failed
```

View live logs for a specific service:

```bash
sudo journalctl -fu mod-ala-pi-stomp
```

Search for errors:

```bash
sudo journalctl | grep 'error'
```

## Hardware debug utility

From an SSH session, run the hardware test UI:

```bash
ps-stop
ps-run --host test
```

This shows a curses interface where you can toggle footswitches, turn knobs, and rotate the encoder. If you see the corresponding change in the UI, the control is working. Press Ctrl-C and run `ps-restart` to return to normal operation.
