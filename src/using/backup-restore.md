---
title: Backup & Restore
eleventyNavigation:
  parent: using
  key: backup-restore
  title: Backup & Restore
  order: 9
---

# Backup & Restore

Back up your pedalboards and user data for safekeeping or to transfer to a different pi-Stomp. Restoring adds pedalboards that don't already exist on the target system — it won't clobber existing data.

## Backup via USB drive

1. Insert a USB drive (500 MB or more) into the pi-Stomp
2. SSH into the pi-Stomp:

```bash
ssh pistomp@pistomp.local
sudo mount /dev/sda1 /media/usb0
[ ! "$(mount | grep /media/usb0)" ] && echo "Mount failed!" && exit
sudo mkdir -p /media/usb0/backups
sudo zip -rq /media/usb0/backups/pistomp_backup.zip /home/pistomp/data -x "/home/pistomp/data/.lv2/*"
sudo umount /media/usb0
```

This takes a minute or two. Once the USB drive is unmounted, you can remove it.

The `.lv2/` directory is excluded because those are system-installed plugins — they're restored by reinstalling the OS image or running system updates.

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
