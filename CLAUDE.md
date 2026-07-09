# pistomp-manual

The official manual for the pi-Stomp ecosystem — building, using, and developing for pi-Stomp v3 and v2. Built with Eleventy, deployed to GitHub Pages.

# Writing rules

- Be direct, concise, no fluff.
- No LLM-ese: avoid "delve," "elevate," "unlock," "seamless," "robust," "realm," "journey," "landscape," "it's worth noting," "let's dive in," "game-changer," "versatile" (as filler), "craft" (as verb for making music), "tap into," "empower," "quietly," "load-bearing," "genuinely." No "no X, no Y" constructions. No false profundity of any kind.
  - I'm dead serious about this. Adding an adjective or adverb where one isn't necessary to understanding reads as an advertisement, and _hinders_ understanding, because the mind is trying to find meaning where there is none.
- Structure first, prose second.
- Correct imprecision immediately.
- Prefer tables over lists for structured data.
- Use active voice. No computer required on stage.
- One sentence per idea unless grouping is clearer.
- Version callouts inline (v3 vs v2) rather than separate pages.
- Use "USD" instead of "$" for currency.
- **pi-Stomp builds on the shoulders of giants.** The plugins are open-source software built by talented musicians and developers. Never let pi-Stomp take credit for their work. Attribute every plugin by author, license, and homepage. Use "these plugins" or "these pedals" rather than "pi-Stomp" when describing what the software does.
- **Plugin editorial voice:** Lead with musical feel words (fat, warm, vocal, open, tight, squishy, blooming, expensive, breathes). Keep the technical anchors for the nerds (sample rates, LFO phases, filter topologies) but lead with the sound. Tighter and more confident — a colon after the opening paragraph leads into the pick. Do not strip out SPICE, IIR, circuit topology, or any other technical detail — this is a DIY pedal community and that depth is the point. Feel words are the hook; circuit nerdery is the substance. The goal is to push people into action — to make them want to load the plugin and try it.
- **Settings tables:** Rotated (horizontal) — control names as column headers, values in a single row. No "Control | Setting" header.
- **Editorial structure:** Our pick → Also great (instead of "Runner-up") → Also considered (instead of "What to avoid"). Use "What you give up:" as a subheading under Also great.
- **Prose patterns:** Conditional lead ("If you need a [sound/function], [plugin] is..."). Colon after opening paragraph leads into the pick. "The result is..." for sound outcomes. "Place it..." for chain position advice.

# Site conventions

- All image paths must be absolute (start with `/`), not relative.
- Images default to 80% width, centered, display: block.
- Plugin screenshots use class `plugin-screenshot`: float right, 25% width.
- All h2/h3 headers have `clear: both`.
- Plugin names in articles must match what appears in MOD-UI (the `doap:name` from the .ttl file), not the directory name.
- Plugin editorial pages follow Wirecutter style: Our pick → Also great → Also considered, with screenshots and settings tables.
- Avoid using real musician names or pedal names in plugin editorial pages — allude instead.
- The build page links to wiki steps by anchor, doesn't reproduce them.
- The software install page uses the `pistomp.conf` workflow (not the old Imager settings dialog).

# Contents of the manual

1. Welcome: getting to know the ecosystem. Meta- things go here: provide framing that will help users understand the rest of the manual quickly. Consider introducing concepts if they are foundational to _understanding_ multiple other concepts.
2. Building: sourcing / ordering part, building your kit, and installing the software.
3. Using: the bulk of the series. pi-Stomp is an instrument: how do you use it creatively? Also includes maintenance and bugfixing.
4. Developers: how developers can contribute features and bugfixes, extend the ecosystem, write their own plugins, and deeply customize their device to be their best friend on stage.
5. Plugins: a data table of all plugins, as well as plugin editorials

# Data (plugins)

- a list of all plugins that ship with the pi-Stomp enosystem is in `src/_data/plugins.json`
  - `scripts/build_plugin_index.py` re-builds `src/_data/plugins.json`
- Research docs live in `../pi-gen-pistomp/research/`
- Plugin screenshots are fetched from `http://pistomp.local/effect/image/screenshot.png?uri=<encoded-URI>`.

# Sister repositories

All repositories are hosted on Github and are checked out to `..` (i.e. they are siblings):

* TreeFallSound/pi-stomp is the main software that runs on the hardware (LCD, encoders, footswitches, controls mod-ui/mod-host)
* TreeFallSound/mod-ui (by MOD Devices) that hosts the webapp and interacts with mod-host. Vendored (bugfixes and new features)
* TreeFallSound/mod-host is the actual plugin host that renders audio, also by MOD Devices and vendored (bugfixes)
* TreeFallSound/pi-gen-pistomp generates the debian image that we run on as well as hosts the OTA apt repository (rerere / github pages)
* TreeFallSound/pistomp-recovery takes over the LCD when something goes wrong, showing crash information ("BSOD"), allowing system recovery, as well as OTA updates
