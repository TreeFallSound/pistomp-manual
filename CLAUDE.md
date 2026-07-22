# pistomp-manual

The official manual for the pi-Stomp ecosystem — building, using, and developing for pi-Stomp v3 and v2. Built with Eleventy, deployed to GitHub Pages.

# Writing rules

- Be direct, concise, no fluff.
- No LLM-ese: avoid "delve," "elevate," "unlock," "seamless," "robust," "realm," "journey," "landscape," "it's worth noting," "let's dive in," "game-changer," "versatile" (as filler), "craft" (as verb for making music), "tap into," "empower," "quietly," "load-bearing," "genuinely." No "no X, no Y" constructions. No false profundity of any kind.
  - I'm dead serious about this. Adding an adjective or adverb where one isn't necessary to understanding reads as an advertisement, and _hinders_ understanding, because the mind is trying to find meaning where there is none.
- Good writing isn't the writer convincing the reader they're right; it's the reader convincing *themselves* the content is useful. Unearned profundity is the failure mode to watch for. Before shipping a sentence, ask what the reader can verify in it — if nothing, cut it or replace it with the number, path, or mechanism behind it.
  - Cut: flattering analogies that inform nothing ("If you can build Lego, you can build this"); superlatives beyond what's defensible ("the only professionally-engineered delay plugin" → "the most polished delay plugin"); hedge ranges where a number exists ("1-2 hours" → "90 minutes"); structure narration ("The build breaks down into 10 steps"); asserted definiteness ("the warm character that covers" → "a warm character, covering" — the definite article presumes the reader already agrees).
  - Add: verifiable specifics ("630 Hz sidechain highpass", "StartLimitBurst=3"); mechanism over adjective (not "sounds warm" but "a lamp turn-on curve of 2 − 2/(lfo+1)"); exact code paths on corrections, including the caller; the decision axis instead of the verdict ("A wah is a resonant peak you move through the midrange. The question is what moves it."); five-second-checkable gotchas ("this plugin ships at 0, so it sounds bypassed on load"); disambiguation of confusable things ("this is a separate port from the `touchosc` thru port").
  - Prefer admitting non-verification ("Outline only. Do not treat this page as finished.") over confident filler.
- When applicable, highlight things pi-Stomp can do that no other platform can — this is what makes the hardware worth building. Don't force it where it doesn't apply.
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
- The software install page uses the `pistomp.conf` workflow (Imager below v2.0.11) and the Imager v2.0.11+ customization wizard (which writes `rpi-preseed.toml`, handled on first boot by the `rpi-preseed` package). The cutoff is specifically **v2.0.11** — earlier v2.0.x builds had a different customization engine that does not produce a `rpi-preseed.toml` this image recognises, and v1.9.x is a different format entirely. Both paths are valid; the page tells the user which path their Imager version supports.

# Contents of the manual

1. Welcome: getting to know the ecosystem. Meta- things go here: provide framing that will help users understand the rest of the manual quickly. Consider introducing concepts if they are foundational to _understanding_ multiple other concepts.
2. Building: sourcing / ordering part, building your kit, and installing the software.
3. Using: the bulk of the series. pi-Stomp is an instrument: how do you use it creatively?
4. Maintenance: troubleshooting, performance tuning, backups, and recovery.
5. Developers: how developers can contribute features and bugfixes, extend the ecosystem, write their own plugins, and deeply customize their device to be their best friend on stage.
6. Plugins: a data table of all plugins, as well as plugin editorials

# Data (plugins)

These files are **LARGE**, so never read them directly: it will interfere with your ability to process the information. Instead, form questions and ask them using jq or python. The data we have:

- a list of all plugins that ship with the pi-Stomp enosystem is in `src/_data/plugins.json`
  - `scripts/build_plugin_index.py` re-builds `src/_data/plugins.json`
- `src/_data/pluginsSeen.json` maps plugin URI to pedalboard occurrence count (from TreeFallSound/pi-stomp-pedalboards and sastraxi/dot-pedalboards)
- `src/_data/plugins-source.json` caches upstream source repos, keyed by the same `uri` as `plugins.json`. Add an entry whenever research turns one up and you have verified it resolves (`git ls-remote`).A plugin's homepage (e.g. guitarix.sourceforge.net) is not its source repo.
  - Copy `uri`, `bundle`, and `name` verbatim out of `plugins.json`; never retype or reconstruct them. URIs differ from what you would guess (`gx_compressor#_compressor`, not `#compressor`; `System-NoiseGate`, not `NoiseGate`; `http://` where you would expect `https://`). A mistyped `uri` silently fails to join and is worse than a missing entry.
  - After writing, assert every `uri` exists in `plugins.json` and that no `uri` repeats.
- Three bundle pairs ship the same plugin URIs from two different builds: `rkr.lv2`/`rkr-labs.lv2`, `invada.lv2`/`invada-labs.lv2`, `fomp.lv2`/`fomp-labs.lv2`. **The device loads the `-labs` build.** Research those sources; pull screenshots and control ranges from them. lilv resolves duplicate URIs by highest `lv2:minorVersion.microVersion`, these pairs tie, so it falls through to scan order; the index script mirrors that and agrees, since `-` sorts before `.`.
- Research docs live in `research/` and are the basis for our editorials (we edit them down)
- Plugin screenshots are fetched from `http://pistomp.local/effect/image/screenshot.png?uri=<encoded-URI>`.

# Researching pedals

Pedal research should go in a numbered research markdown in `research/`. Remember to update `plugins-source.json` if necessary.

- **Enumerate candidates from `plugins.json` before ranking any.** Research docs have missed plugins that were named after the very pedal under study. Filter by category, then diff the candidate list against what the doc actually introspected.
- **Read the source; don't trust the name.** `GxSD1` does not model the SD-1's asymmetric clipping. Bundle names, `doap:name`, and the pedal being modeled are three different things, and guitarix's internal module names (`gx_mxrdist`) differ from its shipped bundle names (`gx_DistortionPlus.lv2`).
- **Establish which circuit is modeled, and how.** The useful distinctions: diode-equation/SPICE-derived vs. hand-drawn static waveshaper vs. neural capture; feedback-loop soft clip vs. feed-forward shunt; symmetric vs. genuinely asymmetric (check for one table or two). Compute filter corners from the component values declared in the DSP rather than repeating what the README claims.
- **CPU cost is part of the verdict, not a footnote.** Plugins run on a Pi core alongside a full chain. Derive the per-sample cost from real dimensions.
- **Say what you verified and what you inferred.** "The model JSON has no training metadata, so the capture source is unverifiable" beats a confident guess.

# Sister repositories

All repositories are hosted on Github and are checked out to `..` (i.e. they are siblings):

* TreeFallSound/pi-stomp is the main software that runs on the hardware (LCD, encoders, footswitches, controls mod-ui/mod-host)
* TreeFallSound/mod-ui (by MOD Devices) that hosts the webapp and interacts with mod-host. Vendored (bugfixes and new features)
* TreeFallSound/mod-host is the actual plugin host that renders audio, also by MOD Devices and vendored (bugfixes)
* TreeFallSound/pi-gen-pistomp generates the debian image that we run on as well as hosts the OTA apt repository (rerere / github pages)
* TreeFallSound/pistomp-recovery takes over the LCD when something goes wrong, showing crash information ("BSOD"), allowing system recovery, as well as OTA updates
