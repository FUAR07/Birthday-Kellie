# Kellie's Birthday Site

A cute, interactive birthday website. Plain HTML/CSS/JS — no frameworks, works on GitHub Pages.

## 1. Add your files

Drop your real files into these folders (names must match exactly):

```
photos/  → call.jpg, call2.jpg, cowboy.jpg, cute.jpg, face.jpg, fav.jpg, fit.jpg,
           hair.jpg, idk.jpg, justcute.jpg, makeup.jpg, nails.jpg, nails2.jpg,
           news.jpg, sleeping.jpg, tbt.jpg   (16 photos)

videos/  → annoyed.mp4, dance.mp4, drunk.mp4, sing.mp4   (4 videos)

music/   → the whole album, one file per track, e.g.:
           01 Body to Body.mp3
           02 Hooligan.mp3
           03 Aliens.mp3
           04 FYA.mp3
           05 2.0.mp3
           06 No. 29.mp3
           07 SWIM.mp3
           08 Merry Go Round.mp3
           09 NORMAL.mp3
           10 Like Animals.mp3
           11 they don_t know _bout us.mp3
           12 One More Night.mp3
           13 Please.mp3
           14 Into the Sun.mp3
           (the exact list + track titles live in script.js under PLAYLIST —
           edit that array if you rename files or want a different album)
```

The `.gitkeep` files are just placeholders so the empty folders upload to GitHub — delete them once your real files are in place.

## 2. Customize the text

Open **script.js** and edit the block at the very top labeled `EASY EDITS`:

- `FRIEND_NAME` — change the name used on the site
- `LETTER_TEXT` — the birthday letter (keep blank lines for paragraph breaks)
- `PHOTOS` — captions for each photo
- `VIDEOS` — captions for each video
- `CANDLE_COUNT` — how many candles on the cake

To change the intro headline/subtitle, edit the text directly in **index.html** near the top (marked with `EDIT HERE` comments).

## 3. Try it locally

Just open `index.html` in a browser. Everything works from the local file system.

## 4. Publish on GitHub Pages

1. Push this whole folder to a GitHub repo.
2. In the repo settings, enable **GitHub Pages** for the branch (usually `main`, root folder).
3. Visit the URL GitHub gives you.

## How the music works

`script.js` contains a small reusable `AlbumPlayer` class that plays the whole album as one continuous playlist:
- Only starts playing after the "Open Your Surprise" button is tapped (required by Safari/iOS autoplay rules).
- A floating player bar (bottom of the screen) shows the current track name with controls to play/pause, skip to the next or previous song, and jump back or forward 10 seconds.
- Automatically advances to the next song when one finishes, looping back to track 1 after the last one.
- Automatically lowers ("ducks") the album volume when you play one of the personal videos, and restores it when the video pauses or ends.
- Keeps playing across sections and even through the finale — it's the soundtrack for the whole visit.
