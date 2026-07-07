---
title: Neural Amp Modeler (NAM)
eleventyNavigation:
  parent: using
  key: nam
  title: Neural Amp Modeler
  order: 8
---

# Neural Amp Modeler (NAM)

Neural Amp Modeler is a machine-learning-based amp and pedal profiler that captures the exact sound of a real amplifier or effects pedal. pi-Stomp includes full NAM support — you can load thousands of free community models or capture your own gear.

## Loading NAM models

pi-Stomp ships with the NAM LV2 plugin pre-installed. Models are `.nam` files placed in `/home/pistomp/data/user-files/`. Upload them via MOD-UI's file manager or SCP:

```bash
scp my-amp.nam pistomp@pistomp.local:/home/pistomp/data/user-files/
```

Once uploaded, the NAM plugin appears in MOD-UI's plugin browser. Drag it onto your pedalboard and select the model file from the plugin's parameter list.

The NAM plugin tile on the LCD uses a distinctive tri-color border (red, yellow, blue) and shows the model filename as a subtitle.

## Capturing your own models

pi-Stomp v3.2.0 adds a NAM Capture panel accessible from the System Menu. This lets you record a reamp sweep of your amplifier or pedal and train a NAM model.

### What you need

- A guitar or bass
- An amplifier or pedal you want to profile
- A reamp box (to connect your pi-Stomp output to the amp input)
- The standardized reamp signal file (`T3K-sweep-v3.wav`) — download from [tone3000.com/capture](https://tone3000.com/capture)

### Capture workflow

1. Connect your instrument to pi-Stomp **In 1**
2. Connect pi-Stomp **Out 1** to your amp input (via reamp box)
3. Connect a microphone or load box from your amp back to pi-Stomp **In 2**
4. Open the System Menu and select **NAM Capture**

The capture panel shows the setup view:

<img src="{{ '/assets/images/nam-idle.png' | url }}" alt="NAM Capture — idle/setup view" class="plugin-screenshot">

- **Name** — name your capture (appears as the filename)
- **Input Gain** — adjust the level of your instrument signal (Tweak 1)
- **Headphone Vol** — adjust monitoring volume (Tweak 2)
- **Start** — begins the capture

### During capture

The panel switches to the capture view with a progress bar, elapsed time, and live input/output meters:

<img src="{{ '/assets/images/nam-capturing.png' | url }}" alt="NAM Capture — in progress" class="plugin-screenshot">

The sweep takes about 3 minutes. Play nothing during the sweep — the reamp signal does the work. The meters show:

- **OUT** — the level being sent to your amp
- **IN** — the level coming back from your microphone or load box

If the input clips (red), the capture will fail. Reduce your amp's volume or adjust the microphone position.

### After capture

**Success:**

<img src="{{ '/assets/images/nam-done.png' | url }}" alt="NAM Capture — complete" class="plugin-screenshot">

The captured WAV file is saved to `/home/pistomp/data/user-files/Audio Recordings/`. Transfer it to a computer and train it using the [NAM trainer](https://github.com/mikeoliphant/neural-amp-modeler) or the [Tone3000 capture page](https://tone3000.com/capture).

**Failure:**

<img src="{{ '/assets/images/nam-failed.png' | url }}" alt="NAM Capture — failed" class="plugin-screenshot">

The panel shows the error message and freezes the meters for diagnosis. Common causes:

- Input signal too hot (clipping)
- No signal from the amp (check connections)
- Sweep file not found

**Aborted:**

<img src="{{ '/assets/images/nam-aborted.png' | url }}" alt="NAM Capture — aborted" class="plugin-screenshot">

You can abort at any time during capture.

## Free NAM resources

- **[Tone3000](https://www.tone3000.com/)** — thousands of free NAM models of amps, cabs, and pedals. Also provides the capture page for training your own models.
- **[Tone3000 Capture](https://tone3000.com/capture)** — upload your sweep WAV and train a NAM model in your browser (uses Google Colab).
- **[Neural Amp Modeler](https://github.com/mikeoliphant/neural-amp-modeler)** — the original NAM project by Mike Oliphant. Open-source model training and playback.
- **[Tone Junkie](https://tonejunkie.com/)** — commercial and free NAM model packs.
- **[NAM Discord](https://discord.gg/neuralampmodeler)** — community for sharing models and troubleshooting captures.
