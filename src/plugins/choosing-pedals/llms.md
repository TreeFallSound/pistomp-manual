---
title: LLMs and Pedalboards
eleventyNavigation:
  parent: choosing-pedals
  key: choosing-pedals-llms
  title: LLMs and Pedalboards
  order: 5
---

# LLMs and Pedalboards

A coding agent with a shell and an SSH key on the device can run the same four steps faster: reading twenty editorial pages, wiring fifteen connections, checking that every symlink in a saved bundle resolves. Claude Code, Codex CLI, Aider — anything that can run `curl` and `ssh`.

## Give it the manual, not just the device

`/effect/list` is a phone book: a name, a URI, a brand and a category. A model picking a delay out of it picks on the name. The [editorials]({{ '/plugins/' | url }}) are where the ranking, the starting settings and the gotchas live. Either let the agent read the site, or `git clone` the [manual repo](https://github.com/sastraxi/pistomp-manual) so it can grep the source.

## Ask for a design document first

Have it write down its reasoning before it patches anything.

> Research the guitar rig on [record/era/player]. Work out what each piece is doing musically, then propose a signal chain using only plugins from `curl -s pistomp.local/effect/list`, cross-referenced against the editorials at pistomp.local docs. Say which choices you verified and which you inferred. Give me a CPU estimate. Don't build anything yet.

Four things to insist on, on top of what [Research a rig]({{ '/plugins/choosing-pedals/research/' | url }}) already asks of any design:

**Make it enumerate before it ranks.** A model working from what it remembers about a genre will skip a plugin named after the exact pedal you asked about. Filter by category, list every candidate, then argue.

**Point it at your own files, and say they may be zipped.** Captures and IRs live wherever you put them. Tell the agent which directory to look in and that the file it wants may be inside an archive — one asked to find a capture globbed `*.nam`, found nothing matching, and proposed a substitute while the capture sat in a `.zip` in the same folder.

That matters most at the [staging step]({{ '/plugins/choosing-pedals/stage/' | url }}), where an agent that concludes a file is missing will quietly redesign the amp slot around it.

**Ask about CPU up front.** [Neural Amp Modeler]({{ '/using/nam/' | url }}) has the instance counts and the model won't raise them unless you ask. How to spend the budget is a judgement call — see [spend the CPU budget in one place]({{ '/plugins/choosing-pedals/research/#spend-the-cpu-budget-in-one-place' | url }}).

**Ask what it made up.** You only get "this capture has no training metadata so I can't verify what it was captured from" if you ask for it.

The governing rule for everything after the design: anything the model didn't read off the device is a suggestion.

## Where it runs out of steam

**Loading a capture or an IR.** This is where agents go off the rails most often. A `.nam` is a patch property, not a control port; a control-port call is syntactically valid, returns no error, and leaves every NAM instance empty. Make it pull the real property URI from `/effect/get` first — see [Verify against the device]({{ '/plugins/choosing-pedals/verify/#captures-and-irs-are-patch-properties-not-controls' | url }}).

**Port symbols.** Same problem, quieter. Every `param_set` line needs an exact symbol, models guess them, and a wrong symbol fails silently. They come from `/effect/get` and nowhere else.

**Judging a capture or an IR.** Finding one usually works; choosing between them doesn't. A model can't hear, so it can't tell you whether a capture is good, whether it's really the amp it claims to be, or whether the mic position in `8x10 57 A107.wav` is the one you want. Search results for "[amp] NAM capture" are mostly marketing pages, which is why a model declares nothing exists. Browse [Tone3000](https://www.tone3000.com/) yourself, pull down several candidates, listen through the speakers you'll play through, then hand the winner over to be [staged]({{ '/plugins/choosing-pedals/stage/#where-the-files-go' | url }}) and wired.

**Anything you'd catch with your ears.** Sum two amp paths to mono and the low end cancels if the captures are opposite polarity. A model can flag that it might be happening; there's no correlation meter installed by default to settle it. Gain staging is the same. A summing master at −6 dB is a guess.

**Circuit claims.** "This models a Tube Screamer" is a statement about what's in the DSP, and a model will assert it from the plugin's name.

**Knowing what's on your board right now.** If you've been tweaking in MOD-UI, the live graph has moved on from whatever the agent last saw. Make it re-read the current graph before splicing anything in — and note that the build script in [Build the pedalboard]({{ '/plugins/choosing-pedals/build/' | url }}) opens with `GET /reset`, which throws away everything currently patched.

## Where it's better than you'd think

Arguing about routing. Hand it the [two routing questions]({{ '/plugins/choosing-pedals/research/#decide-the-routing-questions-out-loud' | url }}) — where the boost goes, which amps the EQ drives — and you get the case for both options rather than a verdict, which is what you want at that stage.

It's also good at the plumbing: wiring a fifteen-connection graph, walking a saved bundle to check that every symlink resolves, diffing the live graph against the design.

## Build in one pass

Have it write a single script — reset, add, `patch_set` the files, `param_set` the values, connect everything, save — and run it once. Built up over thirty separate shell calls, a failure halfway leaves you with a half-wired graph and no clean way back. The API is on [Build the pedalboard]({{ '/plugins/choosing-pedals/build/' | url }}), including the MOD-UI venv you need for a WebSocket client.

Then check it yourself: every symlink in the saved bundle resolves, `journalctl` is quiet, and it sounds right.
