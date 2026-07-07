# pistomp-manual

The official manual for the pi-Stomp ecosystem — building, using, and developing for pi-Stomp v3 and v2. Built with Eleventy, deployed to GitHub Pages.

# Writing rules

- Be direct, concise, no fluff.
- Structure first, prose second.
- Correct imprecision immediately.
- Prefer tables over lists for structured data.
- Use active voice. No computer required on stage.
- One sentence per idea unless grouping is clearer.
- Version callouts inline (v3 vs v2) rather than separate pages.
- Use "USD" instead of "$" for currency.
- **pi-Stomp builds on the shoulders of giants.** The plugins are open-source software built by talented musicians and developers. Never let pi-Stomp take credit for their work. Attribute every plugin by author, license, and homepage. Use "these plugins" or "these pedals" rather than "pi-Stomp" when describing what the software does.

# Site conventions

- All image paths must be absolute (start with `/`), not relative.
- Images default to 80% width, centered, display: block.
- Plugin screenshots use class `plugin-screenshot`: float right, 25% width.
- All h2/h3 headers have `clear: both`.
- Plugin names in articles must match what appears in MOD-UI (the `doap:name` from the .ttl file), not the directory name.
- Plugin editorial pages follow Wirecutter style: Our pick → Runner-up → What to avoid, with screenshots and settings tables.
- Do not use real musician names in plugin editorial pages — allude instead.
- The build page links to wiki steps by anchor, doesn't reproduce them.
- The software install page uses the `pistomp.conf` workflow (not the old Imager settings dialog).
- Research docs live in `../pi-gen-pistomp/research/`. Plugin screenshots are fetched from `http://pistomp.local/effect/image/screenshot.png?uri=<encoded-URI>`.
