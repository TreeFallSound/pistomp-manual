---
title: Recovery
eleventyNavigation:
  parent: using
  key: recovery
  title: Recovery
  order: 8
---

# Recovery

pi-Stomp includes a recovery system that activates automatically when critical services crash. You can also launch it manually from the System Menu.

## What triggers recovery

The recovery system monitors four services via systemd `OnFailure`:

- **jack** — the JACK audio backend
- **mod-host** — the LV2 plugin host
- **mod-ui** — the web interface
- **mod-ala-pi-stomp** — the pi-Stomp controller software

When `mod-ala-pi-stomp` or `mod-ui` crashes 3 times within 60 seconds, systemd gives up and fires `pistomp-recovery.service`. The recovery screen takes over the LCD.

You can also launch recovery manually: **System Menu** → **Recovery mode**.

## Crash screen

When recovery activates, the LCD shows the crash screen with:

- **Service states** — each service in the chain (`jack`, `mod-host`, `mod-ui`, `mod-ala-pi-stomp`) with its current status. The failed service is marked with a `<--` indicator
- **Log textarea** — the last 6 lines of the crash log, shown below the service list
- **RESUME** — returns to normal operation
- **RECOVERY** — opens the recovery menu

### Navigating the crash screen

- **Navigation encoder** — move between the header, service rows, log textarea, and action buttons
- **Tweak 1** — when the log textarea is selected, scrolls the log text horizontally (long log lines that don't fit the screen)
- **Click on the log textarea** — opens the fullscreen log viewer
- **Click RESUME** — releases the LCD and restarts the main app
- **Click RECOVERY** — opens the recovery menu

### Fullscreen log viewer

The log viewer shows the complete journalctl output for the crashed service. Use the Navigation encoder to scroll through lines vertically. Use Tweak 1 to scroll long lines horizontally. Long-press or click the back icon to return to the crash screen.

## Recovery menu

| Action | What it does |
|--------|-------------|
| **Restart Jack** | Restarts the JACK audio server |
| **Restart MOD** | Restarts mod-host and mod-ui |
| **Updates** | Check for and install system updates |
| **Reset to Checkpoint** | Reverts pedalboards and config to last known-good state |
| **Factory Reset** | Wipes user data and restores factory defaults |
| **Reboot** | Reboots the system |
| **Power Off** | Shuts down cleanly |

## Getting help

If you encounter a crash that you can't resolve:

1. SSH into the pi-Stomp and get the full traceback:

```bash
sudo journalctl -u mod-ala-pi-stomp -n 100 --no-pager
```

2. Open an issue on the relevant repository:

- [pi-stomp issues](https://github.com/TreeFallSound/pi-stomp/issues) — for crashes in the main controller software
- [pistomp-recovery issues](https://github.com/TreeFallSound/pistomp-recovery/issues) — for crashes in the recovery system itself
- [pi-gen-pistomp issues](https://github.com/TreeFallSound/pi-gen-pistomp/issues) — for OS image and package issues

Include the full log output and a description of what you were doing when the crash occurred.

## Manual recovery

You can also recover without the LCD by SSHing in:

```bash
sudo systemctl restart jack
sudo systemctl restart mod-host
sudo systemctl restart mod-ui
sudo systemctl restart mod-ala-pi-stomp
```

Check service status:

```bash
sudo systemctl status mod-ala-pi-stomp
sudo journalctl -u mod-ala-pi-stomp -f
```
