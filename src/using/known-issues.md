---
title: Known Issues
eleventyNavigation:
  parent: using
  key: known-issues
  title: Known Issues
  order: 2
---

# Known Issues

## Occasional loss of network access from a Mac over Wi-Fi

### Symptom
All IP access from one Mac stops: `pistomp.local` does not load, and SSH to the device times out. Intermittent. The LCD, footswitches and audio are unaffected, and other devices on the same network may reach the pi-Stomp normally. Most often seen when the pi-Stomp is powered on while the Mac is asleep.

### Cause
Your access point (router) stops forwarding unicast frames to the Mac from other clients.

### Remedy
Toggle Wi-Fi off and on **on the Mac**. Do not reboot the pi-Stomp; no action on the device has any effect.

### Alternatives
Ethernet to the pi-Stomp as well as the device hotspot (via the Wi-Fi menu) do not seem to be affected.

### Contributing
A full analysis is available at [docs/wifi-unreachable-investigation.md in pi-gen-pistomp](https://github.com/TreeFallSound/pi-gen-pistomp/blob/main/docs/wifi-unreachable-investigation.md). If you know what's going on, we encourage you to contribute!