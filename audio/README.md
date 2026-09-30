# Game audio

`dog-clicker.wav` is a single press-and-release from **clicker_training.wav** by
**EricsSoundschmiede**, downloaded from Freesound's public high-quality MP3 preview.

- Source: https://freesound.org/people/EricsSoundschmiede/sounds/513862/
- MP3: https://cdn.freesound.org/previews/513/513862_1106446-hq.mp3
- License: **CC0 1.0 Universal** (public-domain dedication)
- License text: https://creativecommons.org/publicdomain/zero/1.0/

Changes: trimmed to source seconds 0.282–0.522, increased gain by 10 dB,
added a 15 ms fade at the end, and saved as mono 44.1 kHz / 16-bit PCM WAV.
WAV avoids MP3 encoder padding, so the first click lands about 4 ms after playback
starts. The application preloads it when Begin is pressed and plays it at 40% gain.
No synthetic oscillator or bell tone is mixed in.


## Spoken reward

`good-dog.mp3` is a real human voice excerpt saying **“good dog”** once, taken from
**Whos a good dog you are.wav** by **balloonhead**.

- Source: https://freesound.org/people/balloonhead/sounds/367156/
- MP3: https://cdn.freesound.org/previews/367/367156_2188-hq.mp3
- License: **Creative Commons Attribution 4.0 International**
- License text: https://creativecommons.org/licenses/by/4.0/

Changes: excerpted source seconds 0.43–1.24 (the first take's “good dog”),
converted to mono, applied an 80 Hz high-pass and 6 kHz low-pass filter, slowed
with `atempo=0.95`, normalized to -20 LUFS / -4 dB true peak, and applied short
entry/exit fades. Saved as 44.1 kHz mono MP3 at 96 kbps. The recording plays once
at 55% gain, starting 280 ms after the fifth successful cue click.
Attribution is also included on the game's start screen and in MP3 metadata.
