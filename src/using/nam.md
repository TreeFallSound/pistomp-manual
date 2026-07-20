---
title: Neural Amp Modeler (NAM)
eleventyNavigation:
  parent: using
  key: nam
  title: Neural Amp Modeler
  order: 10
---

# Neural Amp Modeler (NAM)

Neural Amp Modeler captures the behaviour of a real amplifier or pedal by training a neural network on how it responds to a known signal. The result is a `.nam` file that sounds like the thing it was trained on, including how it breaks up as you dig in. Thousands of community captures are free to download, and you can make your own on the device.

## What your hardware can run

NAM is the most CPU-hungry thing on the device.

NAM models are trained at a range of architecture sizes, and a lighter architecture costs a fraction of a heavier one to run while giving up some fidelity — especially in how the high end and the edge of breakup are reproduced.

| Hardware | Lighter architectures | Heavy architectures |
|----------|----------------------|---------------------|
| v3 (Pi 5) | About 10 at once | Runs, but fewer |
| v2 (Pi 3/4) | About 4 at once | Not successfully |

These are whole-device budgets, not per-chain ones. Ten NAM instances means ten and nothing else of consequence, so treat the numbers as a ceiling to stay well under rather than a target.

Two practical consequences:

- **On v3, NAM is a normal building block.** A capture for the amp, another for a drive pedal, and room left over is a reasonable board.
- **On v2, NAM is a feature you spend deliberately.** One amp capture plus conventional plugins for everything else will go further than four captures in a row.

If audio starts clicking, you've run out of CPU rather than doing something wrong. [Performance]({{ '/maintenance/performance/' | url }}) covers reading XRUN counts and raising the JACK period to buy headroom.

## Sample rate

NAM models are trained at a fixed sample rate, and 48 kHz is the standard. The pi-Stomp runs at 48 kHz, so community models load and run at the rate they were trained at with nothing to configure.

Capture enforces this. If JACK is running at any other rate, the capture refuses to start rather than producing a file that trains into a subtly wrong model.

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

- An amplifier or pedal you want to profile
- A cable from a pi-Stomp output to the amp or pedal input

You don't need to plug an instrument in — the capture drives the standardized reamp signal itself. That file (`T3K-sweep-v3.wav`) ships with the OS image, so there's nothing to download.

The pi-Stomp's output is capable enough to drive an amp or pedal front-end directly; use the **Input Gain** control to match the send level to what a guitar would deliver. A reamp box (which attenuates line level to instrument level and raises the source impedance) gives a cleaner, more standardized match, but it isn't required — full-rig and pedal captures work fine without one. You would only need to add preamp gain instead if you were capturing a bare power-amp / FX-return input, which expects line level.

### Capture workflow

1. Connect pi-Stomp **Out 2** to your amp or pedal input (directly, or through a reamp box)
2. Connect a microphone or load box from your amp back to pi-Stomp **In 2**
3. Open the System Menu and select **NAM Capture**

**Out 1** plays back the wet signal coming from the captured pedal or amp, so you can monitor the capture. If you don't want to hear it, leave Out 1 disconnected during the capture.

The capture panel shows the setup view:

<img src="{{ '/assets/images/nam-idle.png' | url }}" alt="NAM Capture — idle/setup view" class="plugin-screenshot">

- **Name** — name your capture (appears as the filename)
- **Input Gain** — adjust the level of the returning signal at In 2 (Tweak 1)
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
- Sweep file not found (old image?)

**Aborted:**

<img src="{{ '/assets/images/nam-aborted.png' | url }}" alt="NAM Capture — aborted" class="plugin-screenshot">

You can abort at any time during capture.

## Free NAM resources

- **[Tone3000](https://www.tone3000.com/)** — thousands of free NAM models of amps, cabs, and pedals. Also provides the capture page for training your own models.
- **[Tone3000 Capture](https://tone3000.com/capture)** — upload your sweep WAV and train a NAM model in your browser (uses Google Colab).
- **[Neural Amp Modeler](https://github.com/sdatkinson/neural-amp-modeler)** — the original NAM project by Steven Atkinson. Open-source model training. The LV2 plugin and much of the surrounding tooling are maintained by Mike Oliphant.
- **[Tone Junkie](https://tonejunkie.com/)** — commercial and free NAM model packs.
- **[NAM Discord](https://discord.gg/neuralampmodeler)** — community for sharing models and troubleshooting captures.

## Reamping references

Background on levels and impedance when driving an amp or pedal from a line output:

- **[Sound On Sound — Can I 're-amp' a line-level signal?](https://www.soundonsound.com/sound-advice/q-can-re-amp-line-level-signal)**
- **[DIY Recording Equipment — How the LINE2AMP reamping box works (and why)](https://www.diyrecordingequipment.com/blogs/news/15851828-exactly-how-the-line2amp-reamping-box-works-and-why)**
- **[admiralbumblebee — Do you need a reamp box, or is a passive DI enough?](https://www.admiralbumblebee.com/music/2018/11/24/Do-you-need-a-Reamp-or-is-a-Passive-DI-enough.html)**
- **[Radial Engineering — How to Reamp for a perfect tone](https://www.radialeng.com/blog/how-to-reamp-for-a-perfect-tone)**
