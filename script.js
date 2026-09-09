/* =====================================================
   KELLIE'S BIRTHDAY SITE — SCRIPT.JS
   Vanilla JS only. No frameworks.
   ===================================================== */

/* =========================================================
   EASY EDITS — change these and nothing else breaks
   ========================================================= */

// EDIT HERE: change the name used around the site
const FRIEND_NAME = "Kellie";

// EDIT HERE: change the birthday letter text.
// Keep the blank lines — they control the paragraph breaks in the typewriter effect.
const LETTER_TEXT = `Happy Birthday, ${FRIEND_NAME}! 🎂💕

I hope today reminds you how special you are and how much happiness you bring to the people around you.

Thank you for all the laughs, random conversations, memories, and moments that somehow become stories we'll never forget.

I hope this new year of your life brings you more happiness, peace, success, exciting adventures, and everything you've been hoping for.

Keep being funny, beautiful, chaotic, amazing, and completely yourself.

You deserve an absolutely beautiful year ahead.

Happy Birthday again! 💕✨`;

// EDIT HERE: change photo captions (file paths must match the /photos folder exactly)
const PHOTOS = [
  { src: "photos/fav.jpg",       caption: "One of my absolute favorites ✨" },
  { src: "photos/cute.jpg",      caption: "Okay but how are you this cute? 🥹" },
  { src: "photos/face.jpg",      caption: "That face deserves its own fan club 💕" },
  { src: "photos/hair.jpg",      caption: "Hair looks great in my POV 🔥" },
  { src: "photos/fit.jpg",       caption: "Serving looks without even trying " },
  { src: "photos/makeup.jpg",    caption: "The face card has never declined ✨" },
  { src: "photos/nails.jpg",     caption: "The nails deserved their own moment " },
  { src: "photos/nails2.jpg",    caption: "Because one nail photo wasn't enough " },
  { src: "photos/cowboy.jpg",    caption: "Cowgirl energy activated " },
  { src: "photos/justcute.jpg",  caption: "Just here being effortlessly adorable 💗" },
  { src: "photos/idk.jpg",       caption: "No caption needed" },
  { src: "photos/call.jpg",      caption: "We needed a photo together " },
  { src: "photos/call2.jpg",     caption: "We have 2 photos together and with a beautiful smile 💕" },
  { src: "photos/news.jpg",      caption: "Breaking news: still gorgeous " },
  { src: "photos/sleeping.jpg",  caption: "Peacefully unaware I was taking this" },
  { src: "photos/tbt.jpg",       caption: "A little throwback is necessary " },
];

// EDIT HERE: change video captions (file paths must match the /videos folder exactly)
const VIDEOS = [
  { src: "videos/dance.mp4",   caption: "Somebody should get you on stage immediately " },
  { src: "videos/sing.mp4",    caption: "Surprise concert " },
  { src: "videos/annoyed.mp4", caption: "Not amused… but still adorable " },
  { src: "videos/drunk.mp4",   caption: "Evidence that you drink like a tafyate " },
];

// EDIT HERE: number of candles on the cake
const CANDLE_COUNT = 5;

/* =========================================================
   THE PLAYLIST — the whole album, in order.
   EDIT HERE: filenames must match the /music folder exactly.
   ========================================================= */

const PLAYLIST = [
  { src: "musics/01 Body to Body.mp3",                     title: "Body to Body" },
  { src: "musics/02 Hooligan.mp3",                         title: "Hooligan" },
  { src: "musics/03 Aliens.mp3",                           title: "Aliens" },
  { src: "musics/04 FYA.mp3",                              title: "FYA" },
  { src: "musics/05 2.0.mp3",                              title: "2.0" },
  { src: "musics/06 No. 29.mp3",                           title: "No. 29" },
  { src: "musics/07 SWIM.mp3",                             title: "SWIM" },
  { src: "musics/08 Merry Go Round.mp3",                   title: "Merry Go Round" },
  { src: "musics/09 NORMAL.mp3",                           title: "NORMAL" },
  { src: "musics/10 Like Animals.mp3",                     title: "Like Animals" },
  { src: "musics/11 they don_t know _bout us.mp3",         title: "They Don't Know 'Bout Us" },
  { src: "musics/12 One More Night.mp3",                   title: "One More Night" },
  { src: "musics/13 Please.mp3",                           title: "Please" },
  { src: "musics/14 Into the Sun.mp3",                     title: "Into the Sun" },
];

/* =========================================================
   ALBUM PLAYER — play/pause, next/previous, ±10s seek
   ========================================================= */

class AlbumPlayer {
  constructor(audioEl, playlist, maxVolume = 0.45) {
    this.audio = audioEl;
    this.playlist = playlist;
    this.maxVolume = maxVolume;
    this.index = 0;
    this._duckTimer = null;

    this.audio.volume = maxVolume;
    // Auto-advance to the next song when one finishes.
    this.audio.addEventListener("ended", () => this.next());
  }

  _load(index, autoplay) {
    this.index = ((index % this.playlist.length) + this.playlist.length) % this.playlist.length;
    const track = this.playlist[this.index];
    this.audio.src = encodeURI(track.src);
    if (autoplay) {
      const p = this.audio.play();
      if (p && p.catch) p.catch(() => {});
    }
    return track;
  }

  start() {
    return this._load(0, true);
  }

  play() {
    const p = this.audio.play();
    if (p && p.catch) p.catch(() => {});
  }

  pause() {
    this.audio.pause();
  }

  togglePlayPause() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  next() {
    return this._load(this.index + 1, true);
  }

  prev() {
    return this._load(this.index - 1, true);
  }

  // Jump forward/back within the current song (seconds can be negative).
  seek(deltaSeconds) {
    if (!isFinite(this.audio.duration)) return;
    this.audio.currentTime = Math.min(
      Math.max(0, this.audio.currentTime + deltaSeconds),
      this.audio.duration
    );
  }

  // Temporarily lower the volume (e.g. while a personal video plays).
  duck(targetVolume = 0.08, durationMs = 350) {
    this._fadeTo(targetVolume, durationMs);
  }

  // Restore the volume.
  unduck(durationMs = 500) {
    this._fadeTo(this.maxVolume, durationMs);
  }

  _fadeTo(target, durationMs) {
    clearInterval(this._duckTimer);
    const steps = 16;
    let i = 0;
    const start = this.audio.volume;
    this._duckTimer = setInterval(() => {
      i++;
      const t = i / steps;
      this.audio.volume = start + (target - start) * t;
      if (i >= steps) clearInterval(this._duckTimer);
    }, durationMs / steps);
  }
}

/* =========================================================
   SETUP
   ========================================================= */

const album = new AlbumPlayer(document.getElementById("album-audio"), PLAYLIST);

const musicPlayer = document.getElementById("music-player");
const musicTrackName = document.getElementById("music-track-name");
const musicPlayPauseBtn = document.getElementById("music-playpause");
const musicPrevBtn = document.getElementById("music-prev");
const musicNextBtn = document.getElementById("music-next");
const musicBack10Btn = document.getElementById("music-back10");
const musicFwd10Btn = document.getElementById("music-fwd10");

function updateTrackName() {
  musicTrackName.textContent = PLAYLIST[album.index].title;
}

function updatePlayPauseIcon() {
  const isPaused = album.audio.paused;
  musicPlayPauseBtn.textContent = isPaused ? "▶" : "⏸";
  musicPlayPauseBtn.setAttribute("aria-label", isPaused ? "Play" : "Pause");
}

album.audio.addEventListener("play", updatePlayPauseIcon);
album.audio.addEventListener("pause", updatePlayPauseIcon);

musicPlayPauseBtn.addEventListener("click", () => album.togglePlayPause());
musicPrevBtn.addEventListener("click", () => {
  album.prev();
  updateTrackName();
});
musicNextBtn.addEventListener("click", () => {
  album.next();
  updateTrackName();
});
musicBack10Btn.addEventListener("click", () => album.seek(-10));
musicFwd10Btn.addEventListener("click", () => album.seek(10));

const progressBar = document.getElementById("progress-bar");
const introScreen = document.getElementById("intro-screen");
const openSurpriseBtn = document.getElementById("open-surprise-btn");
const journey = document.getElementById("journey");
const finalScreen = document.getElementById("final-screen");
const restartBtn = document.getElementById("restart-btn");

const sectionOrder = ["section-wish", "section-memories", "section-videos", "section-letter"];

/* =========================================================
   FLOATING HEARTS + SPARKLES BACKGROUND
   ========================================================= */

const floatingBg = document.getElementById("floating-bg");
const FLOAT_EMOJIS = ["💕", "✨", "💖", "🌸", "💫"];

function spawnFloatItem() {
  const el = document.createElement("span");
  el.className = "float-item";
  el.textContent = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];
  const left = Math.random() * 100;
  const duration = 9 + Math.random() * 8;
  const drift = (Math.random() * 80 - 40) + "px";
  const size = 1 + Math.random() * 1.1;

  el.style.left = left + "vw";
  el.style.fontSize = size + "rem";
  el.style.setProperty("--drift", drift);
  el.style.animationDuration = duration + "s";

  floatingBg.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000 + 500);
}

// Keep a gentle, non-overwhelming stream of hearts/sparkles going at all times.
setInterval(spawnFloatItem, 900);
for (let i = 0; i < 4; i++) setTimeout(spawnFloatItem, i * 300);

/* =========================================================
   CONFETTI (lightweight canvas particle burst)
   ========================================================= */

const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");
let confettiParticles = [];
let confettiAnimating = false;

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const CONFETTI_COLORS = ["#ffb6c9", "#ff85a2", "#c9a7f2", "#a374e8", "#ffd9b0", "#f3c969"];

function burstConfetti(count = 90) {
  const originX = confettiCanvas.width / 2;
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: originX + (Math.random() * 200 - 100),
      y: confettiCanvas.height * 0.3 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 9,
      vy: -(Math.random() * 9 + 4),
      size: 5 + Math.random() * 5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.22 + Math.random() * 0.08,
      life: 0,
      maxLife: 100 + Math.random() * 60,
    });
  }
  if (!confettiAnimating) {
    confettiAnimating = true;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles.forEach((p) => {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.life++;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });

  confettiParticles = confettiParticles.filter((p) => p.life < p.maxLife && p.y < confettiCanvas.height + 40);

  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimating = false;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

/* =========================================================
   INTRO -> START THE JOURNEY
   ========================================================= */

openSurpriseBtn.addEventListener("click", () => {
  introScreen.classList.remove("active");
  journey.classList.remove("hidden");
  progressBar.classList.remove("hidden");
  musicPlayer.classList.remove("hidden");

  goToSection(0);
  burstConfetti(70);

  // First user interaction — safe to start audio now (Safari autoplay rules satisfied).
  album.start();
  updateTrackName();
}, { once: true });

/* =========================================================
   SECTION NAVIGATION + PROGRESS BAR
   ========================================================= */

let currentSectionIndex = 0;

function updateProgressBar(index) {
  const steps = progressBar.querySelectorAll(".progress-step");
  steps.forEach((step, i) => {
    step.classList.remove("active", "done");
    if (i < index) step.classList.add("done");
    if (i === index) step.classList.add("active");
  });
}

function goToSection(index) {
  currentSectionIndex = index;
  sectionOrder.forEach((id, i) => {
    document.getElementById(id).classList.toggle("active-section", i === index);
  });
  updateProgressBar(index);
  window.scrollTo(0, 0);
}

function goToFinalScreen() {
  journey.classList.add("hidden");
  progressBar.classList.add("hidden");
  finalScreen.classList.add("active");
  burstConfetti(160);
  setTimeout(() => burstConfetti(90), 500);
}

/* =========================================================
   SECTION 1 — CANDLES
   ========================================================= */

const candlesRow = document.getElementById("candles-row");
const wishMessage = document.getElementById("wish-message");
const wishContinueBtn = document.getElementById("wish-continue-btn");
let candlesLit = CANDLE_COUNT;

for (let i = 0; i < CANDLE_COUNT; i++) {
  const candle = document.createElement("div");
  candle.className = "candle";
  candle.innerHTML = '<div class="flame"></div>';
  candle.addEventListener("click", () => blowOutCandle(candle));
  candlesRow.appendChild(candle);
}

function blowOutCandle(candle) {
  if (candle.classList.contains("out")) return;
  candle.classList.add("out");
  candlesLit--;

  if (candlesLit === 0) {
    wishMessage.classList.remove("hidden");
    wishContinueBtn.classList.remove("hidden");
    burstConfetti(110);
  }
}

wishContinueBtn.addEventListener("click", () => {
  goToSection(1);
});

/* =========================================================
   SECTION 2 — PHOTO GALLERY + LIGHTBOX
   ========================================================= */

const photoGallery = document.getElementById("photo-gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");

PHOTOS.forEach((photo, i) => {
  const card = document.createElement("figure");
  card.className = "polaroid";
  card.style.setProperty("--rot", (Math.random() * 6 - 3).toFixed(2) + "deg");

  const frame = document.createElement("div");
  frame.className = "photo-frame";
  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = photo.caption;
  img.loading = "lazy";
  frame.appendChild(img);

  const caption = document.createElement("figcaption");
  caption.textContent = photo.caption;

  card.appendChild(frame);
  card.appendChild(caption);
  card.addEventListener("click", () => openLightbox(photo.src, photo.caption));

  photoGallery.appendChild(card);
});

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.remove("hidden");
}

function closeLightbox() {
  lightbox.classList.add("hidden");
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.getElementById("memories-continue-btn").addEventListener("click", () => {
  goToSection(2);
});

/* =========================================================
   SECTION 3 — VIDEO GALLERY (ducks music while playing)
   ========================================================= */

const videoGallery = document.getElementById("video-gallery");

VIDEOS.forEach((videoData) => {
  const card = document.createElement("figure");
  card.className = "video-card";

  const video = document.createElement("video");
  video.src = videoData.src;
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";

  video.addEventListener("play", () => album.duck());
  video.addEventListener("pause", () => album.unduck());
  video.addEventListener("ended", () => album.unduck());

  const caption = document.createElement("figcaption");
  caption.textContent = videoData.caption;

  card.appendChild(video);
  card.appendChild(caption);
  videoGallery.appendChild(card);
});

document.getElementById("videos-continue-btn").addEventListener("click", () => {
  goToSection(3);
});

/* =========================================================
   SECTION 4 — ENVELOPE + TYPEWRITER LETTER
   ========================================================= */

const envelope = document.getElementById("envelope");
const envelopeHint = document.getElementById("envelope-hint");
const letterTextEl = document.getElementById("letter-text");
const letterContinueBtn = document.getElementById("letter-continue-btn");
let envelopeOpened = false;
let typewriterTimer = null;

envelope.addEventListener("click", () => {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelope.classList.add("open");
  envelopeHint.classList.add("hidden");

  setTimeout(() => startTypewriter(LETTER_TEXT), 500);
});

function startTypewriter(text) {
  let i = 0;
  letterTextEl.textContent = "";
  clearInterval(typewriterTimer);

  typewriterTimer = setInterval(() => {
    letterTextEl.textContent += text.charAt(i);
    i++;
    letterTextEl.parentElement.scrollTop = letterTextEl.parentElement.scrollHeight;

    if (i >= text.length) {
      clearInterval(typewriterTimer);
      letterContinueBtn.classList.remove("hidden");
    }
  }, 28);
}

letterContinueBtn.addEventListener("click", () => {
  goToFinalScreen();
});

/* =========================================================
   RESTART — "One More Time"
   ========================================================= */

restartBtn.addEventListener("click", () => {
  // Reset candles
  candlesLit = CANDLE_COUNT;
  candlesRow.querySelectorAll(".candle").forEach((c) => c.classList.remove("out"));
  wishMessage.classList.add("hidden");
  wishContinueBtn.classList.add("hidden");

  // Reset envelope + letter
  envelopeOpened = false;
  envelope.classList.remove("open");
  envelopeHint.classList.remove("hidden");
  letterTextEl.textContent = "";
  letterContinueBtn.classList.add("hidden");
  clearInterval(typewriterTimer);

  // Reset screens
  finalScreen.classList.remove("active");
  introScreen.classList.add("active");
  journey.classList.add("hidden");
  progressBar.classList.add("hidden");

  // The album keeps playing in the background — no need to restart it.
});
