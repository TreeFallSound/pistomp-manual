---
title: Performance Tuning
eleventyNavigation:
  parent: using
  key: performance
  title: Performance Tuning
  order: 7
---

# Performance Tuning

## Buffer size and sample rate

The JACK audio server runs at 48 kHz with 128 frames per period by default. JACK uses two periods (`-n 2`), so the figures below are per-period (frames ÷ 48000); the actual round-trip I/O latency is roughly double. The period size controls the trade-off between latency and CPU load:

| Frames | Per-period latency at 48 kHz | CPU load |
|--------|-------------------|----------|
| 128 | 2.67 ms | Higher |
| 256 | 5.33 ms | Lower |
| 512 | 10.67 ms | Lowest |

Larger buffers reduce CPU load and XRUNs at the cost of higher latency. Start with 128 frames. If you hear glitches, try 256.

### Changing the period size

The period is set at boot time by `firstboot.sh` based on the `JACK_PERIOD` value in `/boot/firmware/pistomp.conf`. There are two ways to change it:

**Via SSH (takes effect after reboot):**

```bash
# Edit pistomp.conf on the boot partition
sudo sed -i 's/JACK_PERIOD="128"/JACK_PERIOD="256"/' /boot/firmware/pistomp.conf
```

Then reboot. The change persists across updates.

**Via firstboot re-run (for testing):**

If you want firstboot to re-apply settings, edit `pistomp.conf`, then:

```bash
sudo mv /boot/firmware/firstboot.done /boot/firmware/firstboot.sh
sudo reboot
```

Firstboot will run again and apply the new period.

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

## Reducing boot time

First boot takes about a minute. Subsequent boots are about 20 seconds. You can reduce boot time by disabling unnecessary services (WiFi, MIDI, etc.) if you don't need them.
