---
title: Ethernet Audio (alpha)
eleventyNavigation:
  parent: using
  key: ethernet-audio
  title: Ethernet Audio (alpha)
  order: 14
---

# Ethernet Audio (alpha)

The pi-Stomp can act as an audio interface for a DAW over an Ethernet cable — sending its audio to your computer and receiving audio back. Jackbridge shows up as 4-in / 2-out interface: you can record the exact signal your pedalboard is producing, as well as the unaltered input.

This runs on netJACK2, JACK's own network transport. The pi-Stomp keeps running its normal audio stack and JackBridge attaches as one more client, so your pedalboard doesn't change or reload when you turn it on.

**Alpha status:** This feature often fails to start, the Mac side requires manual package installation, and there are a few known bugs, mostly with startup racing. Only Apple Silicon Macs are supported.

## The one thing to understand first

The Pi's audio codec ticks off one crystal. The Mac's CoreAudio device ticks off another. These are two independent physical oscillators on two separate boards. Even with perfect crystals (~±20 ppm), they drift relative to each other — at 48 kHz, 20 ppm is roughly one sample per second of relative skew. Over any session longer than `buffer_size / drift_rate` seconds, the faster clock produces more samples than the slower one consumes.

To bridge them, the Pi-side **netadapter** resamples — interpolating between samples to match the Mac's clock rate. The result is not bit-exact and never can be under this hardware topology. For DAW recording of guitar or vocal signals the artifacts are inaudible at default settings. For null tests or archival capture, this is the wrong tool.

The resampler lives in one place:

```
Pi codec (clock A) → jackd → netadapter ──UDP──> netmanager → jackd → daemon → shm → HAL → Mac CoreAudio (clock B)
                              ▲
                    resampler here (only SRC in path)
```

The Mac side is a single clock domain end-to-end. All clock-domain crossing happens on the Pi.

## What you need

- An Ethernet cable from the pi-Stomp to your Mac, or to a switch both are on
- An Apple Silicon Mac (arm64) — Intel Macs are not supported
- The JackBridge packages installed on the Mac

A direct cable between the two works and is the lowest-latency option; the service prefers a direct-cable `169.254.x` link when it finds one.

## Mac setup

### Install

Download the latest release from the [JackRouter releases page](https://github.com/sastraxi/JackRouter/releases). Each release has two `.pkg` files — install both, in order:

1. **`jack2-<version>.pkg`** — the JACK2 fork with the multicast-interface pin. Stock JACK2 1.9.22 is missing this; without it, netJACK2 discovery times out on hosts with both Wi-Fi and a direct-cable NIC. Installs to `/usr/local` (separate from Homebrew's `/opt/homebrew`).
2. **`JackBridge-<version>.pkg`** — the HAL driver, daemon, LaunchAgents, route watcher, and `jackd-launch` wrapper. Right-click > Open to bypass Gatekeeper on first install.

Re-running the same `JackBridge-*.pkg` is safe — the postinstall preserves a hand-edited `config.plist`.

### Daily workflow

1. **Connect** the Ethernet cable directly from your Mac to the pi-Stomp
2. **Verify Mac services** are running:
   ```sh
   jackbridge-ctl status
   # If not running:
   jackbridge-ctl start
   ```
3. **Start the pi-Stomp side** — on the LCD, tap the network icon, choose **Wired Connection**, then tap **Enable**
4. **Confirm the connection** — on the Mac, run `jack_lsp | grep pistomp`. You should see several ports within ~10 seconds
5. **Select JackBridge in your DAW** as the audio device

### What you get in the DAW

| DAW input | Source |
|-----------|--------|
| In1, In2 | Raw HW capture from pi (guitar pre-pedalboard) |
| ModOut1/2 | Post-mod-host wet (the pedalboard tone) |
| **Out1/2** | Stereo monitor return back to the pi |

### System audio through the pi

Set **System Settings → Sound → Output → JackBridge** to route all system audio (Spotify, browser, video) through the pi's audio hardware. Latency is ~5–15 ms — fine for music, fine for video, edge-case for games or Zoom.

## pi-Stomp setup

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

## Configuration

`/Library/Application Support/JackBridge/config.plist` — saving it kicks the LaunchAgents (WatchPaths).

- **ClockDeviceUID** — CoreAudio UID for jackd's backend device. Empty = auto-detect built-in output. Headless Macs (Mac mini / Studio) must set this explicitly — enumerate UIDs with `system_profiler SPAudioDataType` or `jackd -d coreaudio -l`.
- **PeriodFrames** — The dominant latency knob; 64 or 128 is recommended. Must match the pi-Stomp's period or netJACK2's resampler chokes.
- **NetworkInterface** — Name of the NIC to use. Empty = auto-detect (prefers 169.254.x).

## Troubleshooting

### I lost internet on my Mac

macOS often prioritizes the Ethernet cable over Wi-Fi. Since the pi has no internet gateway, your Mac gets stuck trying to use it.

**Fix:** System Settings > Network > ... (three dots) > **Set Service Order...** > Drag **Wi-Fi** above your Ethernet device.

### Services aren't starting or I see the wrong ports

**Conflicts:** MOD Desktop, Jamulus, or SONOBUS may have started their own JACK server. JackBridge connects to theirs instead of its own managed one.

**Fix:** Quit those apps, then run `jackbridge-ctl restart`.

### Pi ports don't appear in `jack_lsp`

The multicast route is landing on Wi-Fi instead of Ethernet.

```sh
sudo launchctl kickstart -k system/com.jackbridge.route
```

### Audio is silent but ports are visible

1. **Check connections:** `jack_lsp -c` — ensure `pistomp` ports are connected to `JackBridge` ports
2. **Wait for sync:** netJACK2's resampler takes 5–10 seconds to stabilize on a fresh connection
3. **Pi-side check:** SSH into the pi (`ssh pistomp@pistomp.local`) and run `jack_lsp`. If the pi doesn't see its own `system` hardware ports, it has nothing to send
4. **Restart pi-Stomp:** Toggle Ethernet Audio off and on again from the LCD

### Audio is distorted or has clicks

**Fix:** Increase `PeriodFrames` in `config.plist` (try 128). Avoid raising `JitterFrames` — it defaults to 0 and the multicast-pin path means we no longer need a HAL-side safety lead.

### jackd won't start on Wi-Fi

This is intentional. The route daemon only enables jackd when a wired interface is up. No matter how fast your Wi-Fi is, there's no way to get package jitter low enough for the link to be useful. You would see this as no (or awful-sounding) audio and constant xruns. Plug in the Ethernet cable and jackd will start within ~2 seconds.

### JackBridge doesn't appear in Audio MIDI Setup

Codesigning issue or non-arm64 build. Check:

```sh
log show --predicate 'subsystem == "com.apple.audio.coreaudiod"' --last 10m
```

### Audio works for 10 seconds then silence

jackd crashed. The daemon doesn't notice (known issue — the shutdown handler is not yet registered). Check logs:

```sh
jackbridge-ctl logs
```

Manual recovery: `jackbridge-ctl restart`.

### Clicks/dropouts

In order of likelihood:

1. Mac jackd missing `-P 75` — the default priority is 10, which underflows constantly. The LaunchAgent should set this; verify with `ps aux | grep jackd`
2. Mac on Wi-Fi — netJACK2 needs wired gigabit on both ends
3. Pi-side buffer too small — bump period on the pi side
4. Almost never JackBridge itself

## Notes

The bridge is enabled on demand from the LCD and is not started at boot, so it costs nothing when you aren't recording.

If **Wired Connection** never appears, the pi-Stomp sees no wired carrier — check the cable and that the far end is powered. If it appears but enabling fails, the service could not find a wired interface to pin the netJACK2 multicast group to; that failure is deliberate and loud, because the alternative is discovery leaking out over WiFi and appearing to work while sounding terrible.

To pin the bridge to a particular NIC on the pi side, set `JACKBRIDGE_IFACE` in `/etc/default/jackbridge`. Leaving it unset auto-detects.

### Known issues

- **Stale master entries on reconnect:** When the pi-Stomp disconnects and reconnects quickly, the Mac's netmanager doesn't clean up the old `pistomp` client entry. JACK appends `-01`, creating a duplicate slave that fights the original. The pi side has a 3-second delay to mitigate this, but rapid toggling can still trigger it. If you see `WriteResample` or `ringbuffer failure` errors on the pi, wait 10 seconds and toggle again.
- **Proxy-ARP poisoning:** The Mac's kernel sends ARP requests for the pi's link-local IP out every interface matching 169.254/16. A wifi router may proxy-ARP a reply with its own MAC, poisoning the cache. The `jackbridge-route-watcher` daemon handles this by pinning a host route to the wired interface, but it takes a few seconds to establish.
- **jackd priority must be -P 75:** macOS jackd defaults to priority 10, which causes the netJACK2 master client to miss deadlines constantly. The LaunchAgent sets this, but if you're running jackd manually, you must pass `-P 75` explicitly.
