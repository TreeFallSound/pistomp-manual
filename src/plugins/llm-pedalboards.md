---
title: Pedalboards with an LLM
eleventyNavigation:
  key: llm-pedalboards
  parent: plugins-section
  title: Pedalboards with an LLM
  order: 1
---

# Pedalboards with an LLM

You've got a sound in your head and 663 plugins on the device. Closing that gap is mostly research, and research is the one thing these models are actually good at.

So here's a workflow that ends with a saved, loaded pedalboard. You describe a rig, the model reads this manual and figures out which plugins get you there, and then either hands you a build sheet or patches the thing itself over MOD-UI's API. It also covers where the whole idea falls apart, because it does fall apart, in one specific spot. Better to know that going in.

None of this is tied to a particular tool. You need a coding agent with a shell and an SSH key on the device — Claude Code, Codex CLI, Aider, whatever you already use. If it can run `curl` and `ssh`, it can do this. Why we talk about these tools at all is covered in the [AI Declaration]({{ '/ai-declaration/' | url }}), and [Coding with LLMs]({{ '/developers/coding-with-llms/' | url }}) covers the same question for the codebase.

## The editorials are what make this work

This deserves saying before anything else, because without it you're wasting your time.

`curl -s pistomp.local/effect/list` gets you 663 plugins with a name, a URI, a brand and a category each. That's a phone book. Ask a model to pick a delay out of it and you'll get whichever one has the most agreeable name, which is not the same thing as the one that sounds good. It has no way to know that a plugin ships at zero mix and sounds bypassed on load, or that two of the four compressors are the same DSP built twice.

The editorials are where that knowledge lives: twenty pages across [Gain & Drive]({{ '/plugins/gain-drive/' | url }}), [Amp & Tone]({{ '/plugins/amp-tone/' | url }}), [Delay & Reverb]({{ '/plugins/delay-reverb/' | url }}), [Modulation & Filter]({{ '/plugins/modulation-filter/' | url }}) and [Instruments & Looping]({{ '/plugins/instruments-looping/' | url }}), each one ranked, with settings to start from and advice on where in the chain the thing belongs. Somebody already sat down, loaded all the candidates, and wrote down which one won and why. Point a model at those pages and "I want a warm analog delay" comes back as a named plugin with a starting mix and feedback value. Point it at the plugin list alone and you get a guess.

So: give the agent the manual, not just the device. Either let it read the site, or `git clone` the [manual repo](https://github.com/sastraxi/pistomp-manual) so it can grep the source. The [All Plugins]({{ '/plugins/all/' | url }}) table then does the job it's good at — confirming a plugin actually exists and telling you how often it turns up in real pedalboards.

## Does the pi-Stomp need to be running?

Not for the first half. Definitely for the second.

| Phase | Device needed? | Why |
|-------|----------------|-----|
| Research a rig, pick plugins, design a chain | No | Runs off the editorials and [All Plugins]({{ '/plugins/all/' | url }}) |
| Confirm what you've actually got installed | Yes, ideally | `/effect/list` is the truth; `plugins.json` is a snapshot of a stock image |
| Get exact port symbols and property URIs | Yes | Only `/effect/get` knows them, and models guess them wrong |
| Stage your `.nam` and IR files | Yes | `scp` into `user-files` |
| Build and save the board | Yes | MOD-UI's HTTP and WebSocket API |

The line is roughly this: a model can design a chain out of documentation, but it can't invent a port symbol. `GxCrybabyGCB95` has a wah control and you're not going to guess what it's called. Once you cross over from designing into building, the device is the authority on everything, and anything the model tells you that it didn't read off the device should be treated as a suggestion.

## Step 1 — research first, don't patch anything

Ask for a design document. A model that jumps straight to building gives you a chain it can't defend. A model that writes down its reasoning first gives you something you can argue with, and the arguing is where the value actually is.

Something like…

> Research the guitar rig on [record/era/player]. Work out what each piece is doing musically, then propose a signal chain using only plugins from `curl -s pistomp.local/effect/list`, cross-referenced against the editorials at pistomp.local docs. Say which choices you verified and which you inferred. Give me a CPU estimate. Don't build anything yet.

Five things make the output worth reading:

**Go looking for the actual amp first.** People have captured a truly startling number of amps, and the odds an oddball 70s solid-state head has been done by somebody are better than you'd guess. Search [Tone3000](https://www.tone3000.com/) for the exact model before you settle for anything. In the session this page is based on, the model decided a Peavey Roadmaster capture didn't exist and proposed a stand-in — the capture was sitting in a zip in `~/Downloads` the whole time. Don't take "no capture found" at face value, from a model or from yourself.

**Then, if there really isn't one, ask for the role rather than the pedal.** This is the fallback, not the starting point. Have it research what the amp actually sounds like and what job it's doing — "a loud, bright-to-brittle solid-state workhorse being run clean as the top-and-mid voice" is a job three different plugins can fill, where "an Acoustic 450B" is a dead end. A role you can substitute. A model name you can't. Read the answer back the same way — if it says "use GxPlexi", ask what job GxPlexi is doing there.

**Make it list everything before it ranks anything.** Filter the plugin list by category first, write down every candidate, then argue. A model that starts from what it remembers about a genre will skip right past a plugin named after the exact pedal you asked about. I've watched it happen.

**Ask about CPU up front, then spend it deliberately.** [Neural Amp Modeler]({{ '/using/nam/' | url }}) has the numbers: eight light-architecture instances on v3, up to four on v2, and high-quality architectures knock that down to three or four on v3 and none at all on v2. It won't raise this unless you ask.

But the interesting part isn't the ceiling, it's how you spend up to it. One A2 Full capture of the amp the whole rig is built around beats four Lite ones scattered across the chain, every time. Lite architectures give up exactly the things that make a capture worth having — the top end and the edge of break-up, which is to say how it responds when you dig in. Work out which single box the sound actually lives in, put your good capture there, and cover everything else with conventional plugins. A cranked-amp tone with one great capture and a modeled clean voice alongside it will beat two mediocre captures.

Worth knowing: the `Quality` control on the NAM plugin looks like a 0–1 knob and is really a two-position switch — 0.5 and below gives you Lite, above gives you Full — and it does nothing at all unless the loaded file is an A2 slimmable one carrying both sub-models. Set it to 0 or 1 so you can see which one is running. [Amp, Cabinet, and Neural Capture]({{ '/plugins/amp-cab-sim/' | url }}) goes into the architectures properly.

**Ask what it made up.** "This capture has no training metadata so I can't verify what it was captured from" is worth ten times a confident attribution, and you only get that sentence if you ask for it.

### Some sounds are easy and some aren't

Worth knowing which one you're chasing before you start, because the difficulty varies a lot.

| Sound | What carries it | How hard |
|-------|-----------------|----------|
| Late-60s fuzz into a cranked stack | Germanium fuzz into an amp pushed way past clean — `GxFuzzFaceJH-2` into `GxPlexi` | Easy. The plugins model those exact circuits and are named after them |
| 70s dub | Delay feedback, filter sweeps, spring reverb. The tone's in your hands, not the chain | Easy chain, hard playing. Get the delay right and put feedback on a footswitch |
| 90s alt-rock wall | A Big Muff variant, chorus, a cabinet. `Open Big Muff` is a real circuit model | Easy |
| Shoegaze | Reverse delay, shimmer, stacked modulation. The order matters more than any one plugin | Medium. The [shimmer]({{ '/plugins/shimmer-cloud-reverb/' | url }}) and [glitch delay]({{ '/plugins/glitch-granular-delay/' | url }}) editorials do most of the work |
| One particular player's one particular amp | A NAM capture of that amp. Usually somebody's done it | Medium, and it's the one you have to do yourself |

The first four are documentation problems, which is exactly what you want a model for. The last one is a go-and-listen problem — the search is often successful, but you're the one who has to judge the result.

## Step 2 — check the design against the actual device

Before anything gets patched, have the agent confirm every plugin in the design doc is really there, and pull the port symbols and properties it's going to need.

```bash
curl -s -G pistomp.local/effect/get \
  --data-urlencode "uri=http://github.com/mikeoliphant/neural-amp-modeler-lv2" \
  | python3 -m json.tool
```

You get the audio ports, the control ports with their symbols and ranges, and — the important bit if you're loading captures — a `parameters` array:

```json
{
  "uri": "http://github.com/mikeoliphant/neural-amp-modeler-lv2#model",
  "label": "Neural Model",
  "type": "http://lv2plug.in/ns/ext/atom#Path",
  "writable": true,
  "fileTypes": ["nam", "nammodel", "json", "aidax", "aidadspmodel"]
}
```

A `.nam` model is a writable LV2 **patch property**, not a control port. This is the single most common place an agent goes off the rails. It'll try to load the model with a control-port call, get no error back — there's nothing to error, the call was syntactically fine — and hand you a finished board where every NAM instance is sitting there empty. Properties go over the WebSocket and nowhere else, and each plugin has its own URI for them. `IR loader cabsim` is different again.

While you're at it: bundle name, `doap:name`, and the circuit that's actually modeled are three separate things. `GxSD1` does not model the SD-1's asymmetric clipping. If the design doc's whole argument rests on a plugin modeling some particular circuit, that claim needs to come from the source code, not from the name on the box.

## Step 3 — get your captures and IRs onto the device

User files live under `/home/pistomp/data/user-files/`, and MOD-UI only shows a plugin the one subdirectory it asks for. Put a `.nam` anywhere else and it simply won't appear in the browser.

| What it is | Where it goes |
|------------|---------------|
| NAM captures | `NAM Models/` |
| Cabinet impulse responses | `Speaker Cabinets IRs/` |
| Reverb impulse responses | `Reverb IRs/` |
| Aida DSP models | `Aida DSP Models/` |

```bash
scp "my-amp.nam" "pistomp@pistomp.local:/home/pistomp/data/user-files/NAM Models/"
```

Subdirectories inside those are fine, the browser walks them, so organizing by pack works nicely.

**Tell it to look inside the zip files.** This isn't hypothetical. An agent asked to go find a capture globbed `~/Downloads/*.nam`, found five loose files, decided the one it wanted didn't exist and proposed a substitute instead. The capture was sitting right there in a `.zip` in the same folder, along with the exact 8x10 cabinet IRs the design called for. So: `ls ~/Downloads` and `unzip -l` anything that looks promising, before concluding you don't have something.

And check the licence on captures and IRs before you go sharing a bundle that contains them. Plenty are free to use and not free to republish.

## Step 4 — build it

Two ways to do this. Do it the first way the first time.

### By hand, off the build sheet

Ask for the design as an ordered patch list — plugin names as they appear in MOD-UI, what connects to what, and starting values. Then patch it yourself at `pistomp.local`. You watch the graph come together, you spot a wrong plugin immediately, and you end up knowing your own board. Not the fastest route but it's the one where you learn something.

### Let the agent drive the API

Faster once you trust the design, and much better when there are fifteen connections to wire. The API is split across two transports and getting that split right is most of the battle.

**HTTP handles the structure of the graph:**

| What you want | The call |
|---------------|----------|
| Clear the graph | `GET /reset` |
| Add a plugin | `GET /effect/add/graph/<instance>?uri=<uri>&x=<x>&y=<y>` |
| Remove a plugin | `GET /effect/remove/graph/<instance>` |
| Connect two ports | `GET /effect/connect/<from>,<to>` — both as full `/graph/…` paths |
| Save it | `POST /pedalboard/save` with `title` and `asNew` (`1` forks a copy) |

**The WebSocket at `ws://pistomp.local/websocket` handles values:**

| What you want | The message |
|---------------|-------------|
| Set a control | `param_set /graph/<instance>/<symbol> <value>` |
| Bypass a plugin | `param_set /graph/<instance>/:bypass 1.0` |
| Load a capture or IR | `patch_set <instance> <property-uri> p <absolute-path>` |

That `p` is the value type — it means "path". And `:bypass` is handled as a special case inside `ws_parameter_set`, so bypassing goes over the socket like any other parameter rather than over HTTP, which is not what you'd expect.

One gotcha: the system Python has no WebSocket client. MOD-UI ships its own environment and that's the one to use.

```bash
/opt/pistomp/venvs/mod-ui/bin/python   # 3.11 with tornado 4.3
```

Have the agent write one script that does the whole build — reset, add, `patch_set` the files, `param_set` the values, connect everything, save — and run it once. Building it up over thirty separate shell calls means that when something fails halfway you're left with a half-wired graph and no clean way back.

## Step 5 — check it before you believe it

Three things, in this order.

**Did the files actually resolve?** Picking a capture writes a *symlink* into the pedalboard bundle. It does not copy the file.

```
effect-21/Roadmaster.nam -> ../../../user-files/NAM Models/Roadmaster.nam
```

So walk the saved bundle and confirm every symlink resolves. A dangling one gives you a board that loads perfectly and produces a silent amp, with no error anywhere to tell you why. This is also why a bundle you move around with `git` or `tar` needs its `user-files` moved separately — see [Sharing a pedalboard]({{ '/using/pedalboards/#impulse-responses-and-nam-models' | url }}).

**Is the host complaining?**

```bash
journalctl -u mod-ui -u mod-host --since "5 minutes ago"
```

**Does it sound right?** Plug in and play. Nothing above this line has anything to say about whether it sounds good.

Then save it, either from MOD-UI or **System Menu → Pedalboard Management → Save current pedalboard**. Nothing saves itself.

## Where it runs out of steam

**Judging a capture or an IR.** Not finding one — the finding usually works out. It's the choosing. A model can't hear, so it can't tell you whether a capture is any good, whether it's really the amp it claims to be, or whether the mic position in `8x10 57 A107.wav` is the one you want. Filenames on the capture sites are whatever the uploader typed and are frequently wrong. A `.nam` file carries no reliable training metadata, so provenance can't be checked even in principle. And search results for "[amp] NAM capture" are mostly marketing pages, which is why the model gives up too early and declares nothing exists.

So plan on browsing [Tone3000](https://www.tone3000.com/) yourself, pulling down several candidates of the amp that matters, and listening to them through the same speakers you'll play through. Then hand the winner to the agent to stage and wire. That's the right division of labour anyway — it's better at the plumbing than you are, and you're the only one in the room with ears.

**Anything you'd catch with your ears.** Sum two amp paths to mono and the low end will cancel if the two captures are opposite polarity. The model can reason that this might be happening and that's about it — there's no correlation meter installed by default to settle the question. Gain staging is the same deal. A summing master at −6 dB is a guess with a nice-sounding justification stapled to it.

**Checking a claim about a circuit.** "This models a Tube Screamer" is a statement about what's in the DSP, and the model will happily assert it based on the plugin's name. Names, `doap:name` values and the circuit actually being modeled come apart constantly, especially across the guitarix bundles.

**Knowing what's on your board right now.** If you've been tweaking in MOD-UI, the live graph has moved on from whatever the agent last saw. Make it re-read the current graph before splicing anything in, rather than working from its own last build. Ask me how I know.

## Where it's better than you'd think

Arguing about routing. Hand it a chain and a question and you'll get sound reasoning back, because signal flow is structure and structure is the thing these models handle well.

Ask "should the boost go before or after the split?" and you get an argument you can check. A boost standing in for hot pickups is a property of the source, so it goes first and hits everything downstream. A boost sitting on one path after the split is a different pedal doing a different job — pushing one amp harder. Both are perfectly legitimate. They are not the same rig. That's a distinction you want stated out loud before you patch it, because it's obvious afterwards and easy to get backwards at the time.

Same goes for the other question worth asking of any two-amp design: which amps is that EQ actually driving? Pre-split it's a global voicing move. Post-split it's per-amp. The answer changes the board, and a model will give you the case for both instead of just picking one and moving on.
