---
title: Performance Tuning
eleventyNavigation:
  parent: maintenance
  key: performance
  title: Performance Tuning
  order: 2
---

# Performance Tuning

## Buffer size and sample rate

The JACK audio server runs at 48 kHz. The period defaults to 128 frames on a Pi 5 and 256 frames on older hardware. JACK uses two periods by default (`-n 2`), so actual round-trip I/O latency is roughly double:

| Frames | Per-period latency at 48 kHz | CPU load |
|--------|-------------------|----------|
| 64  | 1.33 ms | Highest |
| 128 | 2.67 ms | Higher |
| 256 | 5.33 ms | Lower |
| 512 | 10.67 ms | Lowest |

Larger buffers reduce CPU load and XRUNs at the cost of higher latency. If you hear glitches, go up one step.

### Changing the period size

You can find the current period in the bottom-right of the MOD-UI pedalboard application at [http://pistomp.local](http://pistomp.local).

Edit `JACK_PERIOD` in `/etc/default/jack` and reboot:

```bash
sudo sed -i 's/JACK_PERIOD="128"/JACK_PERIOD="256"/' /etc/default/jack
sudo reboot
```

The change persists across updates. `firstboot.sh` only writes this file once; after that, `/etc/default/jack` is the source of truth.

## Monitoring XRUNs

XRUNs (buffer underruns) happen when the CPU can't deliver audio data in time. A few XRUNs during pedalboard loading are normal. If you see more than 100 during normal play, the CPU is overworked.

In MOD-UI, the top bar shows the XRUN count. Click it to reset the counter.

## CPU-intensive plugins

Some plugin types demand more CPU than others:

- **Generators** (synths, samplers, drum machines) — heaviest
- **Simulators** (amp models, cabinet IRs) — heavy
- **Pitch shifters** — moderate to heavy
- **Reverbs** — moderate
- **Delays, modulations, EQs** — light to moderate

If you're hitting CPU limits, replace heavy plugins with lighter alternatives or reduce the number of active plugins on the pedalboard.

## Very large pedalboards

Every plugin is a JACK client and registers its own ports — roughly three per plugin, more for stereo plugins with MIDI.

You would need something like 100 plugins on a v2 to reach the cap. If you do hit it, the plugin loads but its audio connections don't, so the pedalboard goes partly silent rather than failing outright. Check the log:

```bash
sudo journalctl -u jack -b | grep -i "cannot register"
```

Raise `JACK_PORT_MAX` in `/etc/default/jack` and reboot. It defaults to 512 on a Pi 5 and 256 elsewhere. Each additional port costs RAM that JACK locks and never releases — JACK's own 2048-port default would reserve 102 MB, so budget roughly 50 KB per port and raise the cap only as far as you need:

```bash
sudo sed -i '/^JACK_PORT_MAX=/d' /etc/default/jack
echo 'JACK_PORT_MAX="512"' | sudo tee -a /etc/default/jack
sudo reboot
```

See [Configuration Guide]({{ '/developers/configuration/#configuring-jack' | url }}) for how the allocation works.

## Thermal management

The Raspberry Pi 5 throttles at 85°C. The pi-Stomp v3 includes an Active Cooler. To check your temperature:

```bash
vcgencmd measure_temp
```

To check if throttling has occurred:

```bash
vcgencmd get_throttled
```

- `0x0` — no throttling
- `50000` — has throttled since boot
- `50005` — currently throttling

If you see throttling, improve ventilation or reduce CPU load. Typical operating temperature is 45–60°C.

## Power supply

The pi-Stomp v3 needs at least 15W (5V / 3A); the factory 27W (5V / 5A) adapter is recommended and required for full-power USB peripherals. Insufficient power can cause throttling and sudden shutdowns. Check for undervoltage warnings:

```bash
dmesg | grep -i voltage
```

To suppress voltage warnings (not recommended if you actually have a power problem):

```bash
echo avoid_warnings=2 | sudo tee -a /boot/config.txt
```
