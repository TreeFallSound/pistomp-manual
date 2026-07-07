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
- [Raspberry Pi Imager](https://www.raspberrypi.com/software/) (any recent version)

## Step 1 — Flash the image

1. Open Raspberry Pi Imager.
2. Click **Choose OS** → **Use custom** → select the downloaded `.img.xz` file.
3. Click **Choose Storage** → select your microSD card.
4. Click **Write**.

![Raspberry Pi Imager]({{ '/assets/images/rpi-imager.png' | url }})

## Step 2 — Configure pistomp.conf

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

## Step 3 — Boot

Insert the microSD into the pi-Stomp's mainboard (inside the enclosure) and connect power. The boot splash should appear on the LCD within a few seconds. First boot takes about a minute as the filesystem expands and services initialize.

Once booted, the LCD shows the home screen. Your pi-Stomp is connected to your WiFi network.

## Step 4 — Connect

Open a browser on any device on the same network and go to `http://pistomp.local/`. You should see the MOD-UI web interface — this is where you build pedalboards.

<a href="http://pistomp.local"><img src="/assets/images/mod-ui.png" alt="MOD-UI web interface"></a>

If `pistomp.local` doesn't resolve, find the pi-Stomp's IP address from the System Menu on the LCD and use that instead.

## What's next

Your pi-Stomp is ready to use. Head to the [Quick Start]({{ '/using/quick-start/' | url }}) guide to load your first pedalboard and start playing.

## Troubleshooting

- **Nothing shows up on the LCD after 1 minute** — check that the SD card is fully seated and the power supply is adequate (27W recommended).
- **Can't connect to `pistomp.local`** — make sure your computer is on the same WiFi network. If your router doesn't support mDNS, use the IP address from the System Menu.
- **WiFi not connecting** — double-check the SSID and password in `pistomp.conf`. The SSID is case-sensitive.
