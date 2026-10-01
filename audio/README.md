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


## Spoken rewards

Four complete phrase clips come from **Whos a good dog you are.wav** by
**balloonhead**, using different takes from the same recording:

| Clip | Spoken phrase | Source seconds |
| --- | --- | --- |
| `good-dog.mp3` | “Good dog.” | 0.43–1.24 |
| `whos-a-good-dog.mp3` | “Who's a good dog?” | 3.30–4.72 |
| `you-are.mp3` | “You are!” | 4.72–6.08 |
| `good-dog-you-are.mp3` | “Who's a good dog? You are!” | 6.75–9.58 |

- Source: https://freesound.org/people/balloonhead/sounds/367156/
- MP3: https://cdn.freesound.org/previews/367/367156_2188-hq.mp3
- License: **Creative Commons Attribution 4.0 International**
- License text: https://creativecommons.org/licenses/by/4.0/

Changes: trimmed at complete phrase boundaries, converted to mono, applied an
80 Hz high-pass and 6 kHz low-pass filter, slowed with `atempo=0.95`, normalized
to -20 LUFS / -4 dB true peak, and applied short entry/exit fades. Saved as
44.1 kHz mono MP3 at 96 kbps. Clips last approximately 0.84–2.97 seconds.

## Additional AI-generated rewards

Twelve custom phrases use OpenAI's `cedar` voice with the
`gpt-4o-mini-tts-2025-12-15` model, at 95% speed. Delivery is warm, low, affectionate,
and lightly teasing, with relaxed pacing and clear phrase endings.

| Clip | Spoken phrase |
| --- | --- |
| `good-boy.mp3` | Good boy. |
| `my-good-boy.mp3` | Yes, you are my good boy. |
| `clever-pup.mp3` | Wow, what a clever pup. |
| `good-pup.mp3` | Good pup. |
| `such-a-good-boy.mp3` | You're such a good boy. |
| `thats-my-good-boy.mp3` | That's my good boy. Just like that. |
| `doing-so-well-pup.mp3` | You're doing so well, pup. |
| `love-that-focus.mp3` | I love how focused you are, good boy. |
| `eager-pup.mp3` | Such an eager pup. You make me smile. |
| `clever-little-pup.mp3` | My clever little pup. Very nicely done. |
| `earned-your-praise.mp3` | You've earned your praise, good boy. |
| `proud-of-you-pup.mp3` | I'm proud of you, pup. Good boy. |

Changes: trimmed leading/trailing silence without removing internal pauses,
converted to mono, filtered at 80 Hz and 6 kHz, normalized toward -20 LUFS with
-4 dB true-peak limiting, and given short entry/exit fades. Saved as 44.1 kHz
mono MP3 at 96 kbps. Clips last approximately 0.74–3.80 seconds. The local
project retains the generation recipe in `scripts/generate-praise.py` and
`scripts/praise-lines.json`.

Each completed five-bone row plays the next clip once, at 55% gain, starting
280 ms after the fifth successful cue's clicker. The playlist interleaves the
four original clips with the first four custom phrases, then plays the other
eight custom phrases. After all 16 clips, it returns to the first. All clips
preload at Begin and share a single AudioContext. The start screen includes
original recording attribution and identifies the AI-generated voice.
