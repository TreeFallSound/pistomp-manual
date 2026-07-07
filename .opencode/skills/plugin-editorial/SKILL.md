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

### 2. Get MOD-UI display names and metadata

SSH into the pi-Stomp to find the human-readable names and attribution info:

```sh
# Display name (use modgui:label, not doap:name — doap:name is often the directory-style name)
ssh pistomp@pistomp.local "grep 'modgui:label' ~/.lv2/<plugin>.lv2/modgui.ttl"

# Fallback: doap:name
ssh pistomp@pistomp.local "grep 'doap:name' ~/.lv2/<plugin>.lv2/*.ttl"

# Author, license, homepage (from the plugin's main .ttl file)
ssh pistomp@pistomp.local "grep -E 'doap:|foaf:|spdx:|license' ~/.lv2/<plugin>.lv2/<plugin>.ttl"
```

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
title: <Descriptive Name — avoid copyrighted product names>
eleventyNavigation:
  parent: plugins
  key: <slug>
  title: <Short Title>
  order: <next-number>
---
```

Follow this structure:

- **Opening paragraph** — who this is for, what problem it solves, the winner. End with a colon leading into the pick.
- **## Our pick: <MOD-UI name>** — screenshot (class="plugin-screenshot"), why it's the best, recommended settings table (rotated — control names as column headers, values in a single row), chain placement
- **## Also great: <MOD-UI name>** — screenshot, when you'd pick this instead, what you give up
- **## Also considered** — brief explanation of each rejected plugin and why it doesn't work for this use case
- **## Credits** — table with Plugin, Author, License, Homepage columns for every plugin mentioned

### 5. Update the index

Add a link to the new page in `src/plugins/index.md`.

### 6. Verify

```sh
npm run build
```

Check that the page renders, images load, and navigation works.

## Conventions

- **No copyrighted product names** in titles, navigation, or H1s. Use descriptive names like "Atmospheric Delay" or "Shimmer and Cloud Reverb" instead of "Strymon TimeLine" or "Strymon BigSky".
- **Credits table** at the bottom of every article. Fetch `doap:maintainer` (author), `doap:license` (license), and `foaf:homepage` (homepage) from the plugin's `.ttl` file. Every plugin mentioned on the page — including "Also considered" entries — must have a row in the credits table.
- **Screenshot sizing** is handled by the `plugin-screenshot` CSS class (`max-width: 200px; max-height: 280px`). Use inline `style="position:relative;right:-35px"` for nudging if a screenshot needs visual adjustment.
- **Display names**: prefer `modgui:label` from `modgui.ttl` over `doap:name` from the plugin `.ttl` — the latter is often the directory/bundle name, not what appears in MOD-UI.
- **Voice**: use "these plugins" or "these pedals" rather than "pi-Stomp" when describing what the software does. The plugins are the work of their authors, not of pi-Stomp.
- **Subjective claims** should be softened with qualifiers ("to our ears", "great if that's what you want") rather than stated as fact.
- **Practical caveats** (CPU usage, XRUN monitoring, chain complexity) should be included where relevant.
- **Link to upstream projects** where possible (e.g. Fons Adriaensen's zita-rev1, the original plugin homepage).
- **Editorial voice:** Lead with musical feel words (fat, warm, vocal, open, tight, squishy, blooming, expensive, breathes). Keep the technical anchors for the nerds (sample rates, LFO phases, filter topologies) but lead with the sound. Tighter and more confident — a colon after the opening paragraph leads into the pick. Do not strip out SPICE, IIR, circuit topology, or any other technical detail — this is a DIY pedal community and that depth is the point. Feel words are the hook; circuit nerdery is the substance. The goal is to push people into action — to make them want to load the plugin and try it.
- **Settings tables:** Rotated (horizontal) — control names as column headers, values in a single row. No "Control | Setting" header.
