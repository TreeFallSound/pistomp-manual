# Manual audit remediation plan

Written 2026-07-19 from a five-perspective audit of the manual (newcomer cold-read, gigging musician, developer/contributor, code-coverage cross-check, plugins-data audit). Findings were verified against the sibling repos checked out at `..` (`pi-stomp`, `mod-ui`, `mod-host`, `pi-gen-pistomp`, `pistomp-recovery`). **Re-verify any code reference before editing — the repos move.**

Scope: this repo only. Sibling-repo bugs found during the audit are listed in the appendix as a handoff, not as work items here.

Follow the writing rules in `CLAUDE.md` throughout. Phases are ordered by (value ÷ effort); each is independently shippable.

---

## Phase 0 — Mechanical fixes (wrong facts, placeholders, nav metadata)

### 0.1 Factual corrections

| File | Wrong | Correct (code reference) |
|---|---|---|
| `src/using/recovery.md:84-92` | Four recovery domains; Config covers `/boot/config.txt`, `cmdline.txt`, `/etc/jackdrc`, ALSA state | Six facets: config, boot, audio, pedalboards, plugins, packages (`pistomp-recovery/src/pistomp_recovery/facet.py:128-133`). Config = `default_config.yml`/`settings.yml`/`config.py` only. Audio facet tracks `/etc/default/jack` + ALSA state (`audio.py:23-24` — jackdrc is deprecated). Boot = `config.txt`, `cmdline.txt`, `pistomp.conf` (`boot.py:8-12`) |
| `src/developers/pistomp-recovery.md:39,49` | "Five facets"; jackdrc/ALSA under Boot | Same six-facet correction as above |
| `src/using/recovery.md:14`, `src/developers/pistomp-recovery.md:21` | "System Menu → Recovery mode" | Menu row reads "Updates and Recovery >" and only appears when recovery is available (`pi-stomp/pistomp/lcd320x240.py:1026`) |
| `src/using/configuration.md:227-228` | Input gain / headphone volume "set from the System Menu" | Both live in the Audio & MIDI panel (`pi-stomp/plugins/audio_midi/panel.py:22`). Quick Start already routes correctly; make these lines agree with it |
| `src/developers/getting-started.md:16`, `src/developers/contributing.md:127` area | "Python 3.12+" | pi-stomp requires >=3.11 (`pi-stomp/pyproject.toml`); 3.12 is pistomp-recovery's requirement |
| `src/developers/configuration.md:40` | "Pi 4/5 → 3.0" | firstboot maps only Pi 5 → 3.0; Pi 3 and Pi 4 → 2.0 (`pi-gen-pistomp .../firstboot.sh:194-198`) |
| `src/developers/configuration.md:27` | Lists `default_config_pistomp.yml` (v1 template) | File does not exist in `pi-stomp/setup/config_templates/` |
| `src/developers/configuration.md:23-31` | Implies `default_config_pistompcore.yml` is copied on first boot for v2 | `modify_version.sh:32,53` copies `default_config_3fs_2knob_exp.yml` for v2 |
| `src/developers/configuration.md:168-173` | Re-run firstboot = rename file + reboot | firstboot disables its own service (`firstboot.sh:210`); recipe also needs `systemctl enable firstboot.service` |
| `src/developers/configuration.md:156` | firstboot "reads pistomp.conf and…" as the main path | Preseed-first now: firstboot detects `/var/lib/rpi-preseed/applied` and skips OS-level settings; pistomp.conf is the fallback. Also omits the SSH-lockout guard (`firstboot.sh:120-167`) |
| `src/developers/getting-started.md:95` | `run_emulator.sh [v1\|v2\|v3]` | Only v2/v3 valid; anything else silently launches v3 (`run_emulator.sh:6-9`) |
| `src/developers/getting-started.md:50-55` | `ps-run -l info` / `-l debug` | The `ps-run` wrapper has no `"$@"`; flags are dropped. Document direct invocation of `modalapistomp.py -l` or `ps-journal` instead (see 3.5) |
| `src/developers/architecture.md:41,46` | Three hardware classes incl. `Pistomp`; v1 as a supported row | Only `Pistompcore` and `Pistomptre` exist; factory returns nothing below version 2.0 and the app exits. Mark v1 unsupported (firstboot says so explicitly) |
| `src/developers/websocket-bridge.md:54` | `lcd.refresh_plugin()` | Method is `_refresh_plugin`, invoked via subscription callback (`lcd320x240.py:667,718`) |

Note: the crash-loop "3 times within 60 seconds" in the manual is **correct** (matches shipping systemd units); do not "fix" it to match pistomp-recovery's README, which is the stale one.

### 0.2 Shipped placeholders

- `src/using/performance.md:77` — literal `[FIXME:where?]`. Answer: `JACK_PORT_MAX` in `/boot/firmware/pistomp.conf` (defaults 512 on Pi 5, 256 elsewhere; applied by firstboot into `/etc/default/jack`).
- `src/developers/configuration.md:146-148` — literal "TODO read pi-gen-pistomp" under "Configuring JACK". Write the section or cut it.

### 0.3 Nav `order:` collisions and gaps

Assign unique, gapless orders per section. Current collisions: `using` 3/3 (navigation vs index), 7/7 (configuration vs performance), 8/8 (nam vs recovery), missing 1, jump 10→13; `developers` 4/4 (index vs websocket-bridge), gap at 3; `building` 2/2; `plugins` 1/1, 5/5. Index/redirect pages should not collide with content pages. Do this **after** Phase 1 decides the new page set, or you'll renumber twice.

### 0.4 WebSocket protocol table

`src/developers/websocket-bridge.md:33-40` lists 5 inbound message types; `pi-stomp/modalapi/ws_protocol.py:191-209` defines 17. Either document all (at least `MidiMap` and `PatchSet`, which matter to contributors) or state explicitly that the table is a subset. Also soften `architecture.md:83` "single writer — MOD-UI owns the truth" with the footswitch-less-bypass exception the bridge page itself describes.

---

## Phase 1 — Restructure: split Maintenance out of Using

**Decision made:** move ops content out of Using so it can honestly carry the instrument thesis.

1. Create a new section (working title: **Maintenance**, top-level, after Using) containing: `recovery.md`, `backup-restore.md`, `troubleshooting.md`, and the ops half of `performance.md` (SSH tuning, `pistomp.conf` editing, XRUN debugging). The playability half of performance (what latency feels like, buffer tradeoff as a musician's decision) stays in Using — see Phase 5.
2. `resources.md`'s competitor-comparison table (`src/using/resources.md:16-30`) is buying-guide content; move it to Welcome/Home or Building. The rest of resources.md can stay in Using or move to Maintenance — decide by content.
3. Update all internal links (grep for `/using/recovery`, `/using/backup-restore`, `/using/troubleshooting`, `/using/performance`). Add Eleventy redirects for the old URLs if the setup supports them.
4. Renumber nav (closes 0.3).

Success test: a reader opening "Using" should see only pages about operating and playing the device.

---

## Phase 2 — Concept ordering and trimming (no new sections)

### 2.1 Define before use

- **Pedalboard** and **snapshot** are used in `quick-start.md:12` and operated in `navigation.md:46-57` before `pedalboards.md` defines them. Fix: two-sentence definitions of both at first use in Quick Start (a pedalboard is a saved effect chain, not the physical device; a snapshot is a saved knob-state of that chain). Break the circular dependency between navigation.md and pedalboards.md: definitions live in pedalboards.md, mechanics live in navigation.md, and each points one way.
- **Physical controls before operation.** Quick Start tells the reader to rotate "the Navigation encoder" and watch "input clipping LEDs" with no layout shown. Either move `hardware-overview.md` before Quick Start (order 1) or embed a single labeled panel photo at the top of Quick Start.
- Terminology: pick one of "tweak encoders" / "tweak knobs" and use it everywhere.
- First-use definitions needed somewhere in the Welcome→Building path: LV2 (one sentence), MOD/MOD-UI relationship, mDNS (one clause where `pistomp.local` is introduced, plus what to do when it fails without assuming System Menu fluency).

### 2.2 software-install.md: restore the happy path

The Imager-version material (v1.9.x, pre-v2.0.11, `.toml`-over-`.conf` precedence) dominates the page. Restructure: happy path (current Imager wizard) first and uninterrupted; the legacy `pistomp.conf` path and version-cutoff explanation collapse into a clearly labeled fallback section. Keep the v2.0.11 cutoff facts exactly as stated in `CLAUDE.md` — both paths remain valid. Add: how to find the mounted `BOOTFS` volume on macOS/Windows, and one sentence on what SSH is for (the settings mention it; no step uses it).

### 2.3 Trim navigation.md

- Cut the per-micro-step screenshots of the parameter-edit flow (`navigation.md:74-90`) to one composite or two images.
- Bypass is explained twice (`:59-70`); once.
- The rotate/click/long-press table (`:29-33`) is restated in prose immediately after; keep the table.
- Pedalboard-selection steps are duplicated verbatim in `pedalboards.md:34-37`; keep in navigation.md, link from pedalboards.md.

### 2.4 Smaller trims

- `about.md:43-47`: compress the RoHS part list and GreenGeeks hosting detail to a short paragraph.
- `build.md:39-54`: the 13-ID hardware reference table duplicates the wiki the page links to; cut to a link plus the two or three IDs the page's own prose uses.
- Unearned-claim edits: `software-install.md:12` "no manual setup required" (it's followed by the setup); `software-install.md:77` declares success before the reader has plugged in; `home.md:30` "No computer required on stage" is fine but should not appear before the reader learns setup does need a computer once — reword to "after setup, no computer required."

---

## Phase 3 — Document shipping features with zero coverage

All verified in code; re-verify UI labels on a device or in source before writing.

1. **Ethernet Audio Interface** — netJACK2 streaming to a DAW, toolbar Wired Connection screen (`pi-stomp/modalapi/ethernet/manager.py`, `ui/ethernet_menu.py`, jackbridge service in pi-gen). New page in Using (it is a creative/recording feature, not maintenance).
2. **Clock sync** — Internal / Ableton Link / MIDI Clock Slave radio in the Audio & MIDI panel (`plugins/audio_midi/panel.py:596-600`). Add to `midi-implementation.md` (whose title currently over-promises) and cross-link from tap-tempo material.
3. **Global 5-band output EQ** — Audio & MIDI menu: Low/L-Mid/Mid/H-Mid/High plus gain arcs and VU calibration (`plugins/audio_midi/panel.py`). Document the whole Audio & MIDI menu once, properly; several pages gesture at it vaguely.
4. **Footswitch longpress, complete** — `using/configuration.md:76` documents 5 string actions. Missing: `next_pedalboard`/`previous_pedalboard`, `set_mod_tap_tempo` (`modalapi/modhandler.py:234-243`); mapping form `longpress: {midi_CC: N}`, `{preset: next|previous|<index>}`, `{pedalboard: next|previous}` (`pistomp/controller_manager.py:344-353`); list/chord form — two switches sharing a longpress name, pressed within 0.4 s (`pistomp/footswitch_chords.py:37-91`). The default config template documents the list syntax; mirror it.
5. **`extras/` scripts** — document `swap-pedalboards.sh` and `more-user-files.sh` alongside the already-covered `expression-pedal.sh` (`pi-gen-pistomp/stage3/01-pistomp/files/extras/`). Also surface `ps-journal` in developers/getting-started as the log-watching tool (fixes 0.1's ps-run item).

---

## Phase 4 — NAM: editorial + rework of using/nam.md

**Decision made:** both. Owner context: NAM is first-class on pi-Stomp; the efficient **A2 architecture** lets v3 hardware run **8+ instances at light settings**, which makes NAM a real answer for amp/cab/distortion and even light comp/EQ shaping. The manual currently says none of this.

1. **Rework `src/using/nam.md`.** Lead with the practical constraints, then the capture workflow (currently inverted):
   - Model architecture sizes (nano/feather/lite/standard, and A2) as the CPU lever; what v3 can run concurrently. Verify current numbers on hardware or with the owner before publishing figures.
   - Sample rate: models are trained at a fixed rate (typically 48 kHz); state the device's rate and what a mismatch does.
   - Link to the performance/XRUN material for budget debugging.
   - Keep the capture workflow and Tone3000 resources; move them after the constraints.
2. **New editorial `src/plugins/` page for amp/cab/drive-via-NAM.** Use the `plugin-editorial` skill. Frame: when to reach for a NAM capture vs. a modeled plugin (GxAmplifier-X, GxCabinet — 8 loads, highest Simulator usage). House style: feel first, tech anchors second, push the reader to load it. Requires a research doc first (see Phase 6 pipeline) covering the NAM LV2 plugin itself and the Gx competition.

---

## Phase 5 — The performance layer in Using (the instrument thesis, earned)

New writing. The single most important insight, currently never stated anywhere: **snapshot changes are instant and gapless; pedalboard loads drop audio for seconds — so use snapshots mid-song and load boards between songs.** Both halves already exist separately (`navigation.md:44` warns about the gap; `blend_snapshots` at `using/configuration.md:170` promises glitch-free morphing, buried in YAML reference).

One new page (working title: "Playing live") or a rework of pedalboards.md covering:

1. The snapshot-vs-board switching rule above, with `blend_snapshots` surfaced as a performance feature.
2. A worked example: one song, clean verse → driven chorus → lead, as three snapshots on one board. Signal-chain-order guidance (drive → mod → delay → reverb) currently lives only in the plugin editorials; state it here and link out.
3. Setlist organization: one board per song vs. one board with per-song snapshots; sequencing a bank to match the set (banks exist at `pedalboards.md:42` with one sentence).
4. Gain staging as a discipline: unity gain between snapshots so the lead boost is right, engaged-vs-bypassed level matching, output level for the house. The global EQ (Phase 3.3) and TinyGain (the most-loaded plugin on real devices) belong in this story.
5. Stage tools in context: silent tuning (mute), per-song tempo, which delays follow host tempo, expression pedal as wah/volume/swell.
6. Latency in playability terms (moved from ops performance.md): what the buffer settings feel like, what's acceptable, when to trade CPU headroom for feel.

Keep it concrete and short per the writing rules — recipes, not essays.

---

## Phase 6 — Plugins section: research, coverage, style

### 6.1 Commission research docs (prerequisite for new editorials)

**Decision made:** research first; editorials and screenshots are a later phase (screenshots need a reachable device at `pistomp.local`). Follow the house method in `CLAUDE.md` (enumerate candidates from `plugins.json` by category before ranking; read source; verify circuits; CPU cost in the verdict). Usage numbers below from `src/_data/plugins-seen.json`. Priority order:

1. **Utility** (58 loads — #1 category: TinyGain, C* Noisegate, Mixer, Level Meter, SooperLooper). Possibly two docs: gain/gate/mixer staples, and loopers.
2. **Amp/cab/simulator incl. NAM** (29 loads — #3: GxCabinet 8, GxAmplifier-X 4, TAP Tubewarmth 5, Valve 5, AmpVTS, NAM). Feeds Phase 4.2.
3. **Everyday reverb** (14 plain-reverb loads: MVerb, TAP Reverberator, C* PlateX2, DIE Reverb, MDA Ambience, Roomy). Current coverage is shimmer/cloud only.

Update `plugins-source.json` per its rules as research turns up repos. Note: the two most-loaded drives (CollisionDrive 8, Open Big Muff 6) are currently "Also considered" rejects in existing editorials — the drive research doc that ranked them may deserve a revisit rather than a new doc.

### 6.2 Style normalization of existing editorials

- Convert vertical `Control | Setting` tables to rotated format in: `atmospheric-delay.md:20`, `digital-delay.md:22,40`, `tube-screamer.md:22`, `shimmer-cloud-reverb.md:20`.
- Rename "Runner-up" → "Also great" in: `atmospheric-delay.md`, `pitch-shifter.md`, `vintage-fuzz.md`, `shimmer-cloud-reverb.md`.
- Trim "Also considered" bloat in `compressors.md` (`:82-94` — full DSP formula walkthroughs of rejects) and `eq.md` to a sentence or two each; keep circuit depth for picks. Cut the "How to read this guide" meta-sections and the duplicated attribution note (`compressors.md:28`).

### 6.3 Cross-linking and all.md

- Add a link to `using/plugins.md` (how to browse/load a plugin) from `editorials.md` and from each editorial's first load-it prompt. Currently zero cross-links from any of the 14 pages.
- `all.md`: surface the `comment` field out of the popover into the visible table, and consider a usage-count column from `plugins-seen.json`. Maintainer/License/Version are not decision axes; demote them.

---

## Verification (every phase)

- `npx @11ty/eleventy` (or the repo's build script) passes; no broken internal links.
- No duplicate `eleventyNavigation.order` within a section: check with a grep/awk pass over frontmatter.
- Grep for leftover `FIXME`/`TODO` in `src/`.
- Every code-derived claim edited or added: re-check the cited file in the sibling repo at `..` before writing it into prose.
- Writing rules in `CLAUDE.md` apply to all new prose; plugin names must match MOD-UI `doap:name`.

---

## Appendix — upstream handoff (not this repo's work)

| Repo | Issue |
|---|---|
| pi-gen-pistomp | `ps-run` wrapper drops arguments (no `"$@"`), so `-l debug` can't reach `modalapistomp.py` |
| pistomp-recovery | README/CLAUDE.md say crash-loop window is 180 s; shipping systemd units use `StartLimitBurst=3` / `StartLimitIntervalSec=60` |
| pi-stomp | `util/modify_version.sh:31` references deleted `default_config_pistomp.yml` in a dead v1 branch |
| pi-stomp | `expand-git.sh`/`contract-git.sh` workflow (required before in-place editing survives OTA) is undocumented in the repo's own GUIDE; manual will document it (Phase 0/3) but upstream docs should too |
| pi-stomp | Coverage command in docs omits the `ui` package (`--cov` list vs `pyproject.toml` packages) |
| TreeFallSound/mod-ui, mod-host | No public statement of fork relationship to mod-audio upstream or contribution routing; manual can only document what's decided — needs an owner decision on where fixes should land |
