---
title: Coding with LLMs
eleventyNavigation:
  parent: developers
  key: coding-with-llms
  title: Coding with LLMs
  order: 3
---

# Coding with LLMs

Parts of the pi-Stomp codebase were written with an LLM in the loop, and parts of this manual were too. The [AI Declaration]({{ '/ai-declaration/' | url }}) covers why we use these tools, and the conflict between what's good for humanity and what drives the project forward.

## Rules

**TL;DR:** We do not reject PRs for being written with a model. We reject PRs the author can't explain.

You are the author of your diff. If a reviewer asks why a line is there, "the model wrote it" is not an answer. You own and are responsible for every line you push, including the ones you didn't type.

In your PR description, always provide the _why_ (and link to any relevant issues). If you used an LLM, we encourage you to mention that LLM assistance was used. This will not be points against your PR; on the contrary, it will help us review it more quickly and help provide alternative solutions that will help you reach your creative vision while maintaining the stability of the pi-Stomp codebase.

## Where models help

| Task | Why it works |
|------|--------------|
| Tracing a call path across `modalapi/`, `uilib/`, and `pistomp/` | The code is Python and the dependencies form a DAG, so the graph is followable |
| Writing tests for existing behaviour | `tests/` is organized by hardware version (`v1`, `v2`, `v3`) and subsystem; the pattern is easy to copy |
| Mechanical refactors | Renames, extracting a base-class method, deleting a dead branch |
| Explaining vendored MOD code | `mod-ui` and `mod-host` are large, third-party, and sparsely documented |

## Where they don't

Anything whose failure mode is physical. A model can't hear a click in the audio, feel an encoder that's one detent off, or notice the LCD redrawing at the wrong moment.

- **Hardware I/O** — GPIO, the MCP3xxx ADC, WS281x LEDs. Models confidently invent register semantics.
- **Timing** — JACK period sizes, ALSA buffer settings, anything that only misbehaves under real audio load.
- **MOD-UI and mod-host APIs** — the command set is real, small, and specific. Check it against the vendored repos rather than accepting a plausible-looking endpoint.

Test on a real pi-Stomp (using `./deploy.sh`) or on the emulator (using `./run_emulator.sh`).

## Avoid

- **Blind `--snapshot-update`s.** The LCD snapshot tests compare against baseline PNGs. Updating baselines to make a test pass, without opening the image, discards the only check we have on the rendering. Look at the PNG.
- **`getattr` / `hasattr`.** Models reach for these to paper over a type they didn't check. We don't allow them; fix the type instead.
- **Comments that narrate the code or document the journey.** Code should almost always be self-explanatory. However, we do encourage UNIX-style, small, reusable methods: docstrings on these are useful for intellisense and to guide developers on how to compose these primitives.
- **Speculative abstraction.** A base class with one subclass, an options dict nothing passes. If the PR is bigger than the problem, cut it back.
- **Fixes without new tests.** These new tests act as reproduction scenarios and help us understand rationale.
- **Type errors.** Pyright must report zero errors, and `# type: ignore` added to satisfy that is a regression, not a fix.

## Before you push

```bash
uv run pytest          # includes LCD snapshot comparison
uv run ruff check
```

Plus Pyright at zero errors. These are the same requirements as any other PR — see [Contributing]({{ '/developers/contributing/' | url }}).

## Licensing

pi-Stomp is AGPL-3.0-or-later. By opening a PR you're asserting you have the right to contribute that code under it. That doesn't change because a model produced the first draft — you are still the one making the assertion.

## Changelog and commit messages

Write these yourself. `CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and lists user-visible changes only, one line each, in the words a player would use. Use the _unreleased_ section at the top. Model-generated entries describe the diff instead of the effect, which is the opposite of what the file is for (entries are end-user-facing!).
