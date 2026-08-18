---
title: Software Installation
eleventyNavigation:
  parent: building
  key: software-install
  title: Software Installation
  order: 4
---

# Software Installation

pi-Stomp ships as a pre-built OS image. You point Raspberry Pi Imager at the pi-Stomp repository, pick the OS from the list, tell it your Wi-Fi details, and boot — there's nothing to download by hand, nothing to compile, and no packages to install.

## What you need

- A completed pi-Stomp (v2 or v3)
- A computer with an SD card slot (or USB adapter)
- [Raspberry Pi Imager](https://github.com/raspberrypi/rpi-imager/releases), **v2.0.11 or newer**.   Here are some direct links to the latest:

   [Mac](https://github.com/raspberrypi/rpi-imager/releases/download/v2.0.11/rpi-imager-v2.0.11.dmg)

   [Windows](https://github.com/raspberrypi/rpi-imager/releases/download/v2.0.11/imager-v2.0.11.exe)

## Step 1 — Add the pi-Stomp repository

1. Install Raspberry Pi Imager
2. Open Raspberry Pi Imager.
3. Click **App Options** → **Content Repository** → **EDIT**.

![App Options menu open, Content Repository highlighted]({{ '/assets/images/rpi-imager-app-options.png' | url }})

4. Click **Use custom URL** and enter (or copy/paste):
   ```
   https://treefallsound.github.io/pi-gen-pistomp/imager/pistomp.json
   ```

![Content Repository dialog with the pistomp.json URL entered]({{ '/assets/images/rpi-imager-custom-url.png' | url }})

5. Click **APPLY & RESTART**. Imager restarts with the pi-Stomp catalog loaded.

## Step 2 - Select Device

![Device dialog with Raspberry Pi 5 selected]({{ '/assets/images/rpi-imager-device.png' | url }})

1. Select your Raspberry Pi device model - typically Raspberry Pi 5 for pi-Stomp v3, Raspberry Pi 3 for pi-Stomp v2
2. Click **NEXT**

## Step 2 — Choose OS

![Choose OS list showing pi-Stomp OS with its icon]({{ '/assets/images/rpi-imager-choose-os.png' | url }})

1. Select **pi-Stomp OS** from the list. Imager downloads the image itself and verifies the checksum — no separate download step.
2. Click **NEXT**

## Step 3 - Select Storage device

![Storage dialog with Generic STORAGE DEVICE Media selected]({{ '/assets/images/rpi-imager-storage.png' | url }})

1. Select the device representing your mounted SD card.  If no storage device shows, make sure the SD card is properly inserted.
2. Click **NEXT**

## Step 4 - Customisation
Do not skip customisation

![Hostname dialog with pistomp entered]({{ '/assets/images/rpi-imager-hostname.png' | url }})

1. Enter your hostname.  Leave it as `pistomp` unless you have a reason to change it.  Click **NEXT**

![Localisation dialog with examples shown]({{ '/assets/images/rpi-imager-localisation.png' | url }})

2. Enter your location.  City, Timezone, Keyboard layout.  This is for clock syncronization and entries aren't critical.  Click **NEXT**

![Username dialog with examples shown]({{ '/assets/images/rpi-imager-username.png' | url }})

3. Username must be `pistomp`.  Password is your choice.  Remember it (or write it down) in case you ever need to ssh to the unit.  Click **NEXT**

![Wi-Fi dialog with examples shown]({{ '/assets/images/rpi-imager-wifi.png' | url }})

4. Enter the SSID (Network Name) and Password for your router.  Network name is case-sensitive.  Click **NEXT**

![SSH dialog with SSE enabled and password authentication]({{ '/assets/images/rpi-imager-ssh.png' | url }})

5. Choose to Enable SSH unless you know you don't want to allow it.  It is very useful for troubleshooting and customisation.

6. Password vs, Public key authentication is your choice.  The latter requires an SSH key.  Click **NEXT**

## Step 5 - Write the image to the SD card

![Write image dialog]({{ '/assets/images/rpi-imager-write.png' | url }})

1. Confirm the Summary
2. Click **WRITE**

![Write confirmation dialog]({{ '/assets/images/rpi-imager-write-confirm.png' | url }})

3. Click **I UNDERSTAND, ERASE AND WRITE**
4. Your computer opererating system may ask for access to the device (SD card).  If it requires a password, that would be the password you use for your computer, not the pi-Stomp.

The imager writes an `rpi-preseed.toml` to the card's boot partition. On first boot, the `rpi-preseed` service applies it before any audio service starts.

5. When Write and Verification are finished, eject the SD card.

## Step 6 — Boot

Insert the microSD into the pi-Stomp's mainboard (inside the enclosure) and connect power. The boot splash appears on the LCD within a few seconds. First boot takes about a minute while the filesystem expands and services initialize, then the device reboots once on its own.

When the home screen appears, the pi-Stomp is on your Wi-Fi network.

## Step 7 — Open the Pedalboard editor (MOD-UI)

Open a browser on any device on the same network and go to `http://pistomp.local/`. This is MOD-UI, where you build pedalboards.

MOD-UI comes from [MOD Devices](https://mod.audio), who make their own Linux-based pedals. pi-Stomp runs their editor and their plugin host (`mod-host`) rather than reinventing them, with pi-Stomp's own software driving the LCD, encoders, and footswitches on top. That's why the web editor looks like a MOD product: it is one.

<a href="http://pistomp.local"><img src="{{ '/assets/images/mod-ui.png' | url }}" alt="MOD-UI web interface"></a>

That address works through mDNS, a protocol that lets devices announce their own names on a local network with no router configuration. Not every network passes it through. If the name doesn't resolve, get the device's IP address from the LCD instead: highlight the **wrench** icon in the toolbar with the Navigation encoder, click it, choose **System info**, and read the address on the `Wi-Fi:` line. Browse to that address directly.

## What's next

The pi-Stomp boots with a pedalboard already loaded, so it's ready to make sound as soon as you plug in. [Quick Start]({{ '/using/quick-start/' | url }}) covers connecting your instrument and setting input gain.

## Pre-release images

To help test upcoming releases, use `https://treefallsound.github.io/pi-gen-pistomp/imager/pistomp-testing.json` as the repository URL instead. These builds can have (literal) show-stopper bugs; avoid taking them on stage.

## Alternative Install method - Configuring with pistomp.conf

This is the fallback path for Raspberry Pi Imager below v2.0.11-rc1, and the way to set options the wizard doesn't expose, like the JACK audio settings.

Older Imager builds do have customization screens, but they write a format this image doesn't read — the v1.9.x line used a different engine entirely. On those versions the wizard appears to work and its settings are silently ignored, so skip it and use `pistomp.conf` instead.

1. Download the latest `.img.xz` from [pi-gen-pistomp releases](https://github.com/TreeFallSound/pi-gen-pistomp/releases) (under "Assets").
2. In Imager: **Choose OS** → **Use custom** → select the downloaded file.
3. **Choose Storage** → select your microSD card → **Write**, skipping **EDIT SETTINGS**.

After flashing, the card's boot partition mounts as a small FAT volume named `BOOTFS`:

| Platform | Where to find it |
|----------|------------------|
| macOS | `/Volumes/BOOTFS`, and on the Finder sidebar under Locations |
| Windows | A removable drive letter labelled `BOOTFS` in File Explorer |
| Linux | Usually `/media/<user>/BOOTFS`; otherwise mount the card's first partition |

Open `pistomp.conf` on that volume and edit:

| Setting | What to put | Default |
|---------|-------------|---------|
| `WIFI_SSID` | Your Wi-Fi network name | `""` |
| `WIFI_PASSWORD` | Your Wi-Fi password | `""` |
| `WIFI_COUNTRY` | Your country code (e.g. `US`, `GB`, `DE`, `CA`) | `US` |
| `HOSTNAME` | Leave as `pistomp` | `pistomp` |
| `USER_PASSWORD` | A password for SSH access | `pistomp` |
| `TIMEZONE` | Your timezone (e.g. `America/Toronto`, `Europe/London`) | `US/Central` |

Save the file, eject the card, and continue from [Step 6](#step-6--boot).

The file also carries the `JACK_*` audio settings. Leave those alone for now; [Performance]({{ '/maintenance/performance/' | url }}) explains when to change them.

If both `rpi-preseed.toml` and `pistomp.conf` are present, they don't conflict: the preseed wins for the keys it covers (Wi-Fi, hostname, password, timezone), and `pistomp.conf` still supplies everything else.

## Troubleshooting

- **pi-Stomp OS doesn't appear in the Choose OS list** — recheck the repository URL for typos, then **APPLY & RESTART** again; the list only reloads on restart.
- **Nothing on the LCD after a minute** — check that the SD card is fully seated and the power supply is adequate (27W recommended).
- **`pistomp.local` doesn't resolve** — confirm your computer is on the same network, then use the IP address from **System info** as described in Step 4. Some routers and most corporate or guest networks block mDNS.
- **Wi-Fi not connecting** — recheck the network name and password; the name is case-sensitive. Check the country code too: a wrong one can disable the channels your network uses.
- **The Imager wizard settings were ignored** — the wizard needs Imager v2.0.11-rc1 or newer. Either upgrade Imager or use [`pistomp.conf`](#configuring-with-pistompconf).
- **The LCD said "Imager setup FAILED"** — the preseed file was present but didn't apply, which would otherwise leave the device with no Wi-Fi and no credentials. The pi-Stomp falls back to `pistomp.conf` and keeps booting. Configure it using the fallback path.
