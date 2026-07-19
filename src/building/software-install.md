---
title: Software Installation
eleventyNavigation:
  parent: building
  key: software-install
  title: Software Installation
  order: 3
---

# Software Installation

pi-Stomp runs on a pre-built OS image — no manual setup required. You flash the image to a microSD card, configure a few settings, and boot.

## What you need

- A completed pi-Stomp (v2 or v3)
- A computer with an SD card slot (or USB adapter)
- The [latest pi-Stomp OS image](https://github.com/TreeFallSound/pi-gen-pistomp/releases) — download the `.img.xz` file under "Assets"
- [Raspberry Pi Imager](https://www.raspberrypi.com/software/) v2.0.11 or newer (see below)

## Two ways to configure the image

The image accepts settings from either of two paths, applied on first boot by the `rpi-preseed` handler:

| Path | When to use |
|------|-------------|
| **Imager customization wizard** (WiFi, hostname, password, SSH keys in-app) | Imager v2.0.11 or newer. The wizard writes an `rpi-preseed.toml` to the boot partition; the pi-Stomp notices it and applies it before any audio services start. |
| **`pistomp.conf` on the boot partition** | Any Imager version, including v1.9.x and pre-v2.0.11 v2 builds. Edit the file after flashing and the pi-Stomp reads it on first boot. |

If your Imager is below v2.0.11 — including the v1.9.x line, which had a different customization engine that won't work with this image — use `pistomp.conf` exclusively. The wizard's settings will not be applied. Upgrade Imager to use the wizard path.

Both paths write different files on the boot partition (`rpi-preseed.toml` vs `pistomp.conf`); they don't conflict. If both are present, `rpi-preseed.toml` takes precedence and `pistomp.conf` is ignored for the keys it covers (WiFi, hostname, password, timezone).

## Step 1 — Flash the image

1. Open Raspberry Pi Imager.
2. Click **Choose OS** → **Use custom** → select the downloaded `.img.xz` file.
3. Click **Choose Storage** → select your microSD card.
4. If you're on Imager v2.0.11+, click **EDIT SETTINGS** and fill in WiFi, hostname, password, timezone, and (optionally) your SSH public key. If you're below v2.0.11 or prefer to edit a file, click **Write** and move on to Step 2.
5. Click **Write**.

![Raspberry Pi Imager]({{ '/assets/images/rpi-imager.png' | url }})

## Step 2 — Configure pistomp.conf (Imager below v2.0.11, or for advanced settings)

After flashing, the card's boot partition mounts as a small FAT volume named `BOOTFS`. Open `pistomp.conf` on it and edit the values for your network:

| Setting | What to put | Default |
|---------|-------------|---------|
| `WIFI_SSID` | Your WiFi network name | `""` |
| `WIFI_PASSWORD` | Your WiFi password | `""` |
| `WIFI_COUNTRY` | Your country code (e.g. `US`, `GB`, `DE`, `CA`) | `US` |
| `HOSTNAME` | Leave as `pistomp` | `pistomp` |
| `USER_PASSWORD` | A password for SSH access | `pistomp` |
| `TIMEZONE` | Your timezone (e.g. `America/Toronto`, `Europe/London`) | `US/Central` |

Save the file and eject the card.

If the wizard already wrote `rpi-preseed.toml` (Step 1 with Imager v2.0.11+), editing `pistomp.conf` here is optional — the wizard's values win for the keys it covers (WiFi, hostname, password, timezone). Leave `pistomp.conf` alone unless you want to override something the wizard doesn't expose, or you skipped the wizard.

## Step 3 — Boot

Insert the microSD into the pi-Stomp's mainboard (inside the enclosure) and connect power. The boot splash should appear on the LCD within a few seconds. First boot takes about a minute as the filesystem expands and services initialize.

Once booted, the LCD shows the home screen. Your pi-Stomp is connected to your WiFi network.

## Step 4 — Connect

Open a browser on any device on the same network and go to `http://pistomp.local/`. You should see the MOD-UI web interface — this is where you build pedalboards.

<a href="http://pistomp.local"><img src="{{ '/assets/images/mod-ui.png' | url }}" alt="MOD-UI web interface"></a>

If `pistomp.local` doesn't resolve, find the pi-Stomp's IP address from the System Menu on the LCD and use that instead.

## What's next

Your pi-Stomp is ready to use and has its first pedalboard loaded! You're ready to plug in and start playing music. Head to the [Quick Start]({{ '/using/quick-start/' | url }}) guide to continue exploring.

## Troubleshooting

- **Nothing shows up on the LCD after 1 minute** — check that the SD card is fully seated and the power supply is adequate (27W recommended).
- **Can't connect to `pistomp.local`** — make sure your computer is on the same WiFi network. If your router doesn't support mDNS, use the IP address from the System Menu.
- **WiFi not connecting** — double-check the SSID and password in `pistomp.conf` (or the Imager wizard, v2.0.11+). The SSID is case-sensitive.
- **Imager wizard settings were ignored** — the wizard needs Imager v2.0.11 or newer. The v1.9.x customization engine and pre-v2.0.11 v2 builds write a different format this image doesn't read. Either upgrade Imager or use `pistomp.conf` instead.
