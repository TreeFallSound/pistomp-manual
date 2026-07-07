# pistomp-manual

The official manual for the pi-Stomp ecosystem — building, using, and developing for pi-Stomp v3 and v2. Built with Eleventy, deployed to GitHub Pages.

# Writing rules

- Be direct, concise, no fluff.
- No LLM-ese: avoid "delve," "elevate," "unlock," "seamless," "robust," "realm," "journey," "landscape," "it's worth noting," "let's dive in," "game-changer," "versatile" (as filler), "craft" (as verb for making music), "tap into," "empower," "quietly," "load-bearing," "genuinely." No "no X, no Y" constructions. No false profundity of any kind.
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
- Do not use real musician names in plugin editorial pages — allude instead.
- The build page links to wiki steps by anchor, doesn't reproduce them.
- The software install page uses the `pistomp.conf` workflow (not the old Imager settings dialog).
- Research docs live in `../pi-gen-pistomp/research/`. Plugin screenshots are fetched from `http://pistomp.local/effect/image/screenshot.png?uri=<encoded-URI>`.
