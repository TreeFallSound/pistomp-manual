---
title: Build the Pedalboard
eleventyNavigation:
  parent: choosing-pedals
  key: choosing-pedals-build
  title: Build the Pedalboard
  order: 4
---

# Build the Pedalboard

Two ways to do this. Use the first one the first time.

## By hand, in MOD-UI

Open [pistomp.local](http://pistomp.local), drag each plugin from the sidebar onto the canvas in chain order, and drag from output port to input port to connect them. Set the values from your design as you go. Captures and IRs load from the file browser inside the plugin's own panel, not from a knob.

Slower than scripting it, but you spot a wrong plugin immediately and you end up knowing your own board.

## Script the API

Worth it when there are fifteen connections to wire, or when you want the same board reproducible. The API is split across two transports.

**HTTP handles the structure of the graph:**

| What you want | The call |
|---------------|----------|
| Clear the graph | `GET /reset` — discards whatever is currently patched |
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

The `p` is the value type: "path". `:bypass` is a special case inside `ws_parameter_set`, so bypassing goes over the socket like any other parameter rather than over HTTP.

Scripting the WebSocket needs a client, and the system Python has none. MOD-UI ships its own environment; use that.

```bash
/opt/pistomp/venvs/mod-ui/bin/python   # 3.11 with tornado 4.3
```

Write one script that does the whole build — reset, add, `patch_set` the files, `param_set` the values, connect everything, save — and run it once. Built up over thirty separate shell calls, a failure halfway leaves you with a half-wired graph and no clean way back.

## Check it before you believe it

**Did the files resolve?** Picking a capture writes a *symlink* into the pedalboard bundle. It does not copy the file.

```
effect-21/Roadmaster.nam -> ../../../user-files/NAM Models/Roadmaster.nam
```

Walk the saved bundle and confirm every symlink resolves. A dangling one loads without error and gives you a silent amp. It's also why a bundle moved with `git` or `tar` needs its `user-files` moved separately — see [Sharing a pedalboard]({{ '/using/pedalboards/#impulse-responses-and-nam-models' | url }}) and the [licensing note]({{ '/plugins/choosing-pedals/stage/#licensing' | url }}) on what you can redistribute.

**Is the host complaining?**

```bash
journalctl -u mod-ui -u mod-host --since "5 minutes ago"
```

**Does it sound right?** Plug in and play. Nothing above this line tells you that.

Then save, either from MOD-UI or **System Menu → Pedalboard Management → Save current pedalboard**.