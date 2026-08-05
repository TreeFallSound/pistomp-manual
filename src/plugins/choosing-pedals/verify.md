---
title: Verify Against the Device
eleventyNavigation:
  parent: choosing-pedals
  key: choosing-pedals-verify
  title: Verify Against the Device
  order: 3
---

# Verify Against the Device

The design names plugins and the files are staged. Before anything gets patched, confirm every one of those plugins is actually installed, and collect the port symbols and property URIs you'll need to set values. The device is the authority from here on.

## Confirm the plugin is installed

`/effect/list` returns every plugin the device has, with its URI:

```bash
curl -s pistomp.local/effect/list | python3 -c \
  'import json,sys; [print(p["uri"], "\t", p["name"]) for p in json.load(sys.stdin)]' \
  | grep -i delay
```

That URI is what everything downstream keys off. [All Plugins]({{ '/plugins/all/' | url }}) is built from a stock image, so it tells you what a plugin is; only `/effect/list` tells you what you have.

## Pull the plugin descriptor

```bash
curl -s -G pistomp.local/effect/get \
  --data-urlencode "uri=http://github.com/mikeoliphant/neural-amp-modeler-lv2" \
  | python3 -m json.tool
```

You get the audio ports, the control ports with their symbols and ranges, and, if you're loading captures, a `parameters` array:

```json
{
  "uri": "http://github.com/mikeoliphant/neural-amp-modeler-lv2#model",
  "label": "Neural Model",
  "type": "http://lv2plug.in/ns/ext/atom#Path",
  "writable": true,
  "fileTypes": ["nam", "nammodel", "json", "aidax", "aidadspmodel"]
}
```

Symbols are not guessable — `GxCrybabyGCB95`'s wah control is not called `wah` — and you need the exact string for every value you set later.

## Captures and IRs are patch properties, not controls

A `.nam` model is a writable LV2 **patch property**. In MOD-UI you load it from the file browser inside the plugin's own panel — a good moment to confirm the files you staged actually show up, since the browser only lists the [one directory the plugin asks for]({{ '/plugins/choosing-pedals/stage/#where-the-files-go' | url }}).

If you're setting it programmatically, it goes over the WebSocket as a `patch_set` with the property URI above, never as a control port. A control-port call returns no error — it's syntactically valid — and leaves the plugin empty. Each plugin has its own property URI; `IR loader cabsim` uses a different one.

## Check the circuit claim, not the name

Bundle name, `doap:name`, and the circuit actually modeled are three separate things. `GxSD1` does not model the SD-1's asymmetric clipping. If the design leans on a plugin modeling a particular circuit, confirm that from the editorial or the source before you build around it.

Next: [build the pedalboard]({{ '/plugins/choosing-pedals/build/' | url }}).
