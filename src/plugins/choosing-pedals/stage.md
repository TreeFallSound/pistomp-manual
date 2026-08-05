---
title: Stage Captures and IRs
eleventyNavigation:
  parent: choosing-pedals
  key: choosing-pedals-stage
  title: Stage Captures and IRs
  order: 2
---

# Stage Captures and IRs

The design names the captures and impulse responses the rig needs. This is where you go get them and put them where MOD-UI can see them.

## Find and audition

[Tone3000](https://www.tone3000.com/) is where most captures come from. Search the exact amp model before you settle for a stand-in.

Nothing on a capture site is reliable provenance. Filenames are whatever the uploader typed, and a `.nam` file carries no training metadata, so you can't check what it was really captured from. Pull down several candidates of the amp that matters, and listen through the speakers you'll actually play through — this is the one step nothing else in the workflow can do for you.

If the search comes up empty, go back to the design and fill that slot with a [role rather than a model name]({{ '/plugins/choosing-pedals/research/#name-the-role-not-the-pedal' | url }}).

## Where the files go

User files live under `/home/pistomp/data/user-files/`, and MOD-UI only shows a plugin the one subdirectory it asks for. Put a `.nam` anywhere else and it won't appear in the browser.

| What it is | Where it goes |
|------------|---------------|
| NAM captures | `NAM Models/` |
| Cabinet impulse responses | `Speaker Cabinets IRs/` |
| Reverb impulse responses | `Reverb IRs/` |
| Aida DSP models | `Aida DSP Models/` |

```bash
scp "my-amp.nam" "pistomp@pistomp.local:/home/pistomp/data/user-files/NAM Models/"
```

Subdirectories inside those are fine — the browser walks them, so organizing by pack works.

## Licensing

Captures and IRs are somebody's work, and the download terms usually restrict what you can do with them afterwards.

Tone3000 is explicit: you may not package, bundle, or redistribute tones obtained there through third-party platforms, and you may not sell or commercially distribute them without written permission from both the creator and Tone3000. Creators keep ownership of what they upload.

That rules out putting captures inside a pedalboard bundle you share. [Sharing a pedalboard]({{ '/using/pedalboards/#impulse-responses-and-nam-models' | url }}) covers how the files sit outside the bundle as symlinks anyway — share the board, and let the other player download the captures themselves.

Next: [verify against the device]({{ '/plugins/choosing-pedals/verify/' | url }}).
