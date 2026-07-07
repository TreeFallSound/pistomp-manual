---
name: plugin-editorial
description: Use when writing a Wirecutter-style plugin editorial page. Triggered by requests to create a "plugin editorial" or "wirecutter" article for a specific pedal/plugin. Reads research from ../pi-gen-pistomp/research/, fetches MOD-UI names and screenshots from a live pi-Stomp, and writes the page to src/plugins/.
---

# Plugin Editorial — Wirecutter-style article

Turn a research document from `../pi-gen-pistomp/research/` into a Wirecutter-style plugin editorial page.

## Process

### 1. Read the research document

Read the file at `../pi-gen-pistomp/research/<NN-name>.md`. Extract:
- The target commercial pedal
- The ranked list of LV2 replacements
- The winner, runner-up, and what to avoid
- The recommended settings

### 2. Get MOD-UI display names

SSH into the pi-Stomp to find the human-readable names:

```sh
ssh pistomp@pistomp.local "grep 'doap:name' ~/.lv2/<plugin>.lv2/*.ttl"
```

The `doap:name` value is what appears in MOD-UI. Use that throughout the article, not the directory name.

Also get the LV2 URI from `manifest.ttl`:

```sh
ssh pistomp@pistomp.local "grep 'a lv2:Plugin' ~/.lv2/<plugin>.lv2/manifest.ttl -B1"
```

### 3. Download plugin screenshots

The MOD-UI web interface serves plugin screenshots at:

```
http://pistomp.local/effect/image/screenshot.png?uri=<URL-encoded-LV2-URI>&v=0_0_2_0
```

URL-encode the LV2 URI and download each screenshot to `src/assets/images/plugin-<category>-<shortname>.png`.

### 4. Write the article

Create `src/plugins/<slug>.md` with frontmatter:

```yaml
---
title: <Commercial Pedal Name>
eleventyNavigation:
  parent: plugins
  key: <slug>
  title: <Short Title>
  order: <next-number>
---
```

Follow this structure:

- **Opening paragraph** — who this is for, what problem it solves, the winner
- **## Our pick: <MOD-UI name>** — screenshot (class="plugin-screenshot"), why it's the best, recommended settings table, chain placement
- **## Runner-up: <MOD-UI name>** — screenshot, when you'd pick this instead, what you give up
- **## What to avoid** — brief explanation of each rejected plugin and why it doesn't work for this use case

### 5. Update the index

Add a link to the new page in `src/plugins/index.md`.

### 6. Verify

```sh
npm run build
```

Check that the page renders, images load, and navigation works.
