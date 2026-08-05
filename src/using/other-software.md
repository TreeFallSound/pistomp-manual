---
title: Other Software
eleventyNavigation:
  parent: going-further
  key: other-software
  title: Other Software
  order: 4
---

# Other Software

pi-Stomp is intended to be a platform. MOD is the recommended software for audio processing and configuration, and it's what ships.

But...

There is a good chance that other audio software which uses JACK will "just work". You can install it on top of the pi-Stomp image and switch between them.

## Reaching the JACK server

JACK runs as the `jack` user, promiscuous and restricted to the `jack` group. `pistomp` is in that group. Clients must be told where to look:

```bash
export JACK_PROMISCUOUS_SERVER=jack
```

Without it, every JACK tool reports "jack server is not running" while it is running. With it, `jack_lsp` lists all 66 ports. The stock services set the variable themselves; see `systemctl cat mod-host`.

## Getting a display

Most JACK applications render to an application window. The image is headless. Use one of the following; neither requires a desktop environment.

X11 forwarding, if you have an X server (XQuartz on macOS, built in on Linux). `sshd` already permits it:

```bash
ssh -X pistomp@pistomp.local
```

A virtual display plus VNC, which survives a dropped SSH session:

```bash
sudo apt install xvfb x11vnc
Xvfb :99 -screen 0 1024x768x24 &
DISPLAY=:99 x11vnc -localhost -nopw -bg
```

`x11vnc` is bound to localhost. Tunnel it:

```bash
ssh -L 5900:localhost:5900 pistomp@pistomp.local
```

Point a VNC viewer at `localhost:5900`.

## Guitarix — worked example

[Guitarix](https://guitarix.org/) is a JACK-native amp simulator, and the project behind the `Gx*` plugins already on your device.

```bash
sudo apt install guitarix
export JACK_PROMISCUOUS_SERVER=jack
DISPLAY=:99 guitarix &
```

It registers two clients, `gx_head_amp` and `gx_head_fx`. Connect them to the hardware:

```bash
jack_connect system:capture_1 gx_head_amp:in_0
jack_connect gx_head_fx:out_0 system:playback_1
```

Verified on the current image with `jack`, `mod-host`, `mod-ui` and the pi-Stomp controller running.

## Freeing the machine

MOD consumes CPU and holds the connections to the hardware playback ports. Release them:

```bash
sudo systemctl stop mod-host mod-ui
```

`disable` makes it persist across reboots; `sudo systemctl enable --now mod-host mod-ui` reverses it. Leave `jack` running.

To keep the footswitches and knobs, restart the controller in generic mode. It reads the controls and sends their MIDI CCs without requiring MOD:

```bash
ps-stop
ps-run --host generic
```

Add `--host generic` to `ExecStart` in the service file to persist. The encoders and LCD have no assigned function in this mode. Stop `mod-ala-pi-stomp` entirely if the hardware controls are not needed.

## Known not to work

| Package | Status |
|---------|--------|
| Carla | No arm64 candidate in Debian trixie. The KXStudio `.deb` links on the old wiki are armhf, for a Raspbian release this image is generations past. Source build untested |
| Rakarrack | Installs (`0.6.1-9+b1`) and starts, but registers no JACK ports and reports no error |

The wiki's [older page on this](https://www.treefallsound.com/wiki/doku.php?id=other_software_running_on_pi-stomp_hardware) is written for Patchbox OS — `patchbox boot environment desktop`, the `modep-` service prefix, armhf packages. None of it applies to the current image.

## Reverting

Nothing above modifies the pi-Stomp software:

```bash
sudo apt remove --purge guitarix xvfb x11vnc
sudo apt autoremove
sudo systemctl enable --now mod-host mod-ui
ps-restart
```
