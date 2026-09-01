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

## What's included

The backup includes everything under `/home/pistomp/data/`:

- Pedalboards (`.pedalboards/`)
- Configuration files (`config/`)
- Settings (`config/settings.yml`)
- Banks (`banks.json`)
- Current pedalboard state (`last.json`)

## Backup to USB drive

1. Insert a USB drive (500 MB or more) into the pi-Stomp
2. On the LCD, navigate to **System Menu** → **Pedalboard Management** → **Backup data**
3. Wait for the backup to complete (a minute or two)

The backup is written to `backups/pistomp_backup.zip` on the USB drive. Once it finishes, you can remove the drive.

**Backup data** is greyed out until you connect a writable USB drive. If you select it with no such drive, pi-Stomp shows "No writable USB drive".

The `.lv2/` directory holds **user-installed** plugins downloaded through MOD-UI (PatchStorage). It's excluded to keep the backup small; re-download those plugins from PatchStorage on the target system. Factory plugins live in `/usr/lib/lv2` and come from the OS image, not this directory.

## Restore from USB drive

1. Insert the USB drive containing the backup
2. On the LCD, navigate to **System Menu** → **Pedalboard Management** → **Restore Backup data**
3. Wait for the restore to complete (this can take a few minutes)

The restore runs `unzip -o -u` on the backup file, overwriting and updating files in `/home/pistomp/data`. After the restore completes, the sound engine restarts automatically.

**Restore Backup data** is greyed out until a connected drive holds `backups/pistomp_backup.zip`. If you select it with no such drive, pi-Stomp shows "No backup found on USB". A read-only drive is a correct source, because the restore only reads the archive.

## Backup via SCP

For a quick backup over the network:

```bash
scp -r --exclude='.lv2' pistomp@pistomp.local:/home/pistomp/data ./pistomp-backup/
```

## Restore from SCP

To restore from a local backup over the network:

```bash
scp -r ./pistomp-backup/data/* pistomp@pistomp.local:/home/pistomp/data/
```

After the restore completes, restart the sound engine from the System Menu or reboot the pi-Stomp.

## Transferring to a new pi-Stomp OS

1. Back up the old pi-Stomp state to a USB drive
2. Flash the latest OS image on the new pi-Stomp's SD card
3. Boot the new pi-Stomp OS and insert the USB drive
4. Choose "Restore" on the welcome screen. The button becomes available about a second after you connect the drive
