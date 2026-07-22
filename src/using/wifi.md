---
title: WiFi Setup
eleventyNavigation:
  parent: using
  key: wifi
  title: WiFi Setup
  order: 13
---

# WiFi Setup

pi-Stomp needs WiFi for two things: opening MOD-UI from a browser on your phone or laptop, and pulling OS updates through the recovery system. You set it once — at build time, in the OS image wizard — and the device remembers it. This page is what to do when you're setting up at a new venue, a new router, or no router at all.

The WiFi status icon lives in the LCD toolbar. Orange means hotspot mode; blue (or the bars filling in) means it's on a router.

## Setting WiFi at build time

If you flashed your SD card with Raspberry Pi Imager v2.0.11 or newer, the customization wizard wrote your WiFi details to the card before first boot. See [Software Installation]({{ '/building/software-install/' | url }}) for that flow. On older Imager versions, the same fields live in `pistomp.conf` on the card's boot partition.

## Connecting to a new router

If you're at a gig venue, a friend's house, or anywhere the saved network isn't available:

1. Click the WiFi icon in the LCD toolbar
2. Choose **Configure WiFi**
3. Pick the network from the list and enter the password

The pi-Stomp connects and remembers the new network alongside any others you've previously saved. The password is case-sensitive.

## Hotspot mode

When no known network is in range, the pi-Stomp falls back to hotspot mode and broadcasts its own SSID. The WiFi icon turns orange.

| | |
|---|---|
| **SSID** | `pistomp` |
| **Password** | `pistompwifi` |

Connect your computer or phone to that network to reach MOD-UI at [http://pistomp.local](http://pistomp.local). You can do this anywhere — no router required.

The tradeoff: in hotspot mode your computer is talking only to the pi-Stomp, not the internet. Updates won't download, and you can't reach other devices on a real LAN. Switch back to router mode through **Configure WiFi** when one is available.

## Switching between hotspot and router

Click the WiFi icon → **Configure WiFi** → pick a router network, or choose **Start Hotspot** to go back to hotspot.

## mDNS doesn't work on every network

`pistomp.local` resolves through mDNS, which some networks (corporate, guest, hotel) block. If the name doesn't resolve but the device is connected, get the IP from the LCD: highlight the **wrench** icon → click → **System info** → read the `WiFi:` line. Browse to that IP directly.

See [Troubleshooting]({{ '/maintenance/troubleshooting/#device-is-on-the-network-but-unreachable-from-a-specific-computer' | url }}) for the longer version, including the macOS-specific cases that account for most "I can see it but I can't reach it" reports.

## WiFi drops

If the connection is unstable, two things to try:

- Switch the WiFi backend with `~/extras/wifi-backend-toggle.sh iwd` — see [Configuration → Factory-installed customization scripts]({{ '/using/configuration/#factory-installed-customization-scripts' | url }}). Switch over Ethernet first if you can, since changing backends restarts NetworkManager and drops WiFi for a few seconds.
- Check the power supply. The WiFi radio draws bursts of current during transmit, and a marginal PSU can cause firmware load failures or drops. `dmesg | grep -i brcm` shows firmware errors. The 27W factory adapter is recommended.