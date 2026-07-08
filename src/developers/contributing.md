---
title: Contributing
eleventyNavigation:
  parent: developers
  key: contributing
  title: Contributing
  order: 0
---

# Contributing

pi-Stomp is open source, top to bottom: a Python controller that drives MOD-UI, the OS image that ships it, and a recovery / OTA updates ecosystem. Whether you're fixing a bug, adding a plugin panel, or improving the docs — you're welcome here.

Start with [Architecture]({{ '/developers/architecture/' | url }}) for the mental model, then [Getting Started]({{ '/developers/getting-started/' | url }}) to set up a dev loop.

## This isn't scary

The codebase is Python, not C. You don't need to build a kernel or cross-compile anything. Most development happens over SSH: edit a file, restart the service, test your change. The emulator lets you develop the LCD UI on your desktop without even owning a pi-Stomp.

If you can write a Python script that reads a button and prints to a terminal, you can contribute to pi-Stomp. The LCD is just a pygame surface. The footswitches are just GPIO pins. The MOD integration is just HTTP and WebSocket.

## Where to start

- **Bug reports** — found something broken? Open an [issue](https://github.com/TreeFallSound/pi-stomp/issues). Include what you were doing, what you expected, and what happened. Logs help.
- **Plugin panels** — many plugins don't have custom LCD panels yet. The [plugin panel tutorial](https://github.com/TreeFallSound/pi-stomp/blob/main/docs/plugin-panel-tutorial.md) walks you through building one.
- **Documentation** — this manual, the wiki, the READMEs. If something was confusing, fix it so the next person isn't confused.
- **Feature requests** — post in the [forum](https://treefallsound.com/forum/) or open an issue. Better yet, build it and open a PR.

## Editing this manual

This manual is its own repo: [pistomp-manual](https://github.com/sastraxi/pistomp-manual), built with Eleventy and deployed to GitHub Pages. Pages are plain Markdown under `src/`.

The fastest way to fix something: select any text on a page and click the **Suggest edit** button that appears in the right margin. It opens GitHub's editor scrolled to that exact line — edit, commit, and open a PR straight from the browser, no local setup needed.

For bigger changes (new pages, restructuring), clone the repo and follow the same fork/branch/PR workflow described above.

## Workflow

### 1. Fork the repo

Click the **Fork** button on the [pi-stomp project page](https://github.com/TreeFallSound/pi-stomp). This creates a copy under your own GitHub account.

### 2. Clone your fork

```bash
git clone https://github.com/<your-username>/pi-stomp.git
cd pi-stomp
```

### 3. Add the original repo as upstream

```bash
git remote add upstream https://github.com/TreeFallSound/pi-stomp.git
```

### 4. Create a branch

```bash
git checkout -b my-cool-feature
```

### 5. Make changes

Edit files, test on your pi-Stomp or emulator, commit:

```bash
git add .
git commit -m "Add cool feature"
```

### 6. Push and open a PR

```bash
git push origin my-cool-feature
```

Then open a Pull Request on GitHub targeting the `main` branch. Describe what your change does and why.

### 7. Keep your fork in sync

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

Then rebase your feature branch:

```bash
git checkout my-cool-feature
git rebase main
git push -f origin my-cool-feature
```

## What we look for in a PR

- **It works** — test your change on real hardware or the emulator
- **It's typed** — we use pyright and expect zero type errors
- **It has tests** — new features should include tests; bug fixes should add a test that would have caught the bug
- **It follows the style** — we use ruff for linting. Run `uv run ruff check` before pushing

If you're not sure about any of this, open a draft PR and ask. We'd rather help you through it than have you not contribute at all.

## Testing

```bash
uv run pytest                    # run all tests
uv run pytest --snapshot-update  # accept changed LCD snapshots
```

The `snapshot` fixture compares the rendered LCD image to a baseline PNG. If your change intentionally alters the UI, run with `--snapshot-update` to update the baselines.

## Code style

- Python 3.12+
- Ruff for linting
- Pyright for type checking (zero errors)
- No `getattr` or `hasattr`
- Dependencies must form a DAG

## Other ways to help

- **Test new releases** — flash the latest OS image and report issues
- **Build pedalboards** — create and share great-sounding pedalboards for the community
- **Answer questions** — help others in the [forum](https://treefallsound.com/forum/)
- **Create plugins** — the [MOD SDK](https://wiki.moddevices.com/wiki/MOD_SDK) lets you build LV2 plugins that run on pi-Stomp
