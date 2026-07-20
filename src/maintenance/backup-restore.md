---
title: Backup & Restore
eleventyNavigation:
  parent: maintenance
  key: backup-restore
  title: Backup & Restore
  order: 3
---

# Backup & Restore

Back up your pedalboards and user data for safekeeping or to transfer to a different pi-Stomp. Restore merges the backup into the target system: it adds missing files and overwrites existing ones with the archived copy when the archived copy is newer (`unzip -o -u`).

## Backup via USB drive

1. Insert a USB drive (500 MB or more) into the pi-Stomp
2. On the LCD, navigate to **System Menu** → **Pedalboard Management** → **Backup data**
3. Wait for the backup to complete (a minute or two)

The backup is written to `backups/pistomp_backup.zip` on the USB drive. Once it finishes, you can remove the drive.

The `.lv2/` directory holds **user-installed** plugins downloaded through MOD-UI (PatchStorage). It's excluded to keep the backup small; re-download those plugins from PatchStorage on the target system. Factory plugins live in `/usr/lib/lv2` and come from the OS image, not this directory.

### Backup over SSH

You can also run the same backup manually over SSH — useful for scripting:

```bash
ssh pistomp@pistomp.local
sudo mount /dev/sda1 /media/usb0
[ ! "$(mount | grep /media/usb0)" ] && echo "Mount failed!" && exit
sudo mkdir -p /media/usb0/backups
cd /home/pistomp/data && sudo zip -rq /media/usb0/backups/pistomp_backup.zip . -x ".lv2/*"
sudo umount /media/usb0
```

This mirrors the device's own backup script (`util/data-backup.sh`): it `cd`s into `/home/pistomp/data` and zips `.` with a relative exclude, so the restore extracts to the right place. Zipping the absolute path or using a leading-slash exclude will not restore or exclude correctly.

## Restore from USB drive

1. Insert the USB drive containing the backup
2. On the LCD, navigate to **System Menu** → **Pedalboard Management** → **Restore Backup data**
3. Wait for the restore to complete (this can take a few minutes)

The restore runs `unzip -o -u` on the backup file, overwriting and updating files in `/home/pistomp/data`. After the restore completes, the sound engine restarts automatically.

## Backup via SCP

For a quick backup over the network:

```bash
scp -r pistomp@pistomp.local:/home/pistomp/data ./pistomp-backup/
```

## What's included

The backup includes everything under `/home/pistomp/data/`:

- Pedalboards (`.pedalboards/`)
- Configuration files (`config/`)
- Settings (`config/settings.yml`)
- Banks (`banks.json`)
- Current pedalboard state (`last.json`)

## Transferring to a new pi-Stomp

1. Back up the old pi-Stomp to a USB drive
2. Flash the latest OS image on the new pi-Stomp's SD card
3. Boot the new pi-Stomp and complete first-time setup
4. Insert the USB drive and restore via **System Menu** → **Pedalboard Management** → **Restore Backup data**
