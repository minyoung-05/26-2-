// Suspenseful detective mystery sound engine + bright cheerful success SFX (Web Audio API)

let audioCtx: AudioContext | null = null;
let ambienceTimer: number | null = null;
let ambienceGain: GainNode | null = null;
let droneOscA: OscillatorNode | null = null;
let droneOscB: OscillatorNode | null = null;
let droneOscC: OscillatorNode | null = null;
let pulseStep = 0;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Starts a clearly audible, tense detective mystery soundtrack
 * (D-minor atmospheric pad + rhythmic ticking + noir bass & high motif).
 */
export function startSuspenseAmbience(muted: boolean) {
  if (muted) {
    stopSuspenseAmbience();
    return;
  }
  const ctx = getContext();
  if (!ctx) return;

  if (ambienceTimer !== null) return; // already running

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.11, now + 0.7);
  master.connect(ctx.destination);
  ambienceGain = master;

  // Warm D-minor atmospheric pad audible on laptop & classroom speakers (D3, A3, F3)
  const oscA = ctx.createOscillator();
  const oscB = ctx.createOscillator();
  const oscC = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(480, now);

  oscA.type = 'sine';
  oscA.frequency.setValueAtTime(146.83, now); // D3
  oscB.type = 'triangle';
  oscB.frequency.setValueAtTime(220.0, now); // A3
  oscC.type = 'sine';
  oscC.frequency.setValueAtTime(174.61, now); // F3

  const subGainB = ctx.createGain();
  subGainB.gain.setValueAtTime(0.4, now);
  const subGainC = ctx.createGain();
  subGainC.gain.setValueAtTime(0.28, now);

  oscA.connect(filter);
  oscB.connect(subGainB);
  oscC.connect(subGainC);
  subGainB.connect(filter);
  subGainC.connect(filter);
  filter.connect(master);

  oscA.start(now);
  oscB.start(now);
  oscC.start(now);
  droneOscA = oscA;
  droneOscB = oscB;
  droneOscC = oscC;

  // Rhythmic detective tension loop: crisp ticking + noir bass ostinato + subtle high motif
  const minorBassPattern = [146.83, 146.83, 174.61, 164.81, 146.83, 155.56, 130.81, 138.59];
  const highMotif = [440.0, 0, 466.16, 0, 440.0, 0, 349.23, 0]; // A4, Bb4, A4, F4
  pulseStep = 0;

  ambienceTimer = window.setInterval(() => {
    const c = getContext();
    if (!c) return;
    if (c.state === 'suspended') {
      c.resume().catch(() => {});
      return;
    }
    const t = c.currentTime;

    // 1. Crisp suspense clock tick
    const tickOsc = c.createOscillator();
    const tickGain = c.createGain();
    tickOsc.type = 'triangle';
    tickOsc.frequency.setValueAtTime(pulseStep % 2 === 0 ? 1150 : 880, t);
    tickGain.gain.setValueAtTime(0.045, t);
    tickGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.045);
    tickOsc.connect(tickGain);
    tickGain.connect(c.destination);
    tickOsc.start(t);
    tickOsc.stop(t + 0.05);

    // 2. Noir mystery bass pluck every 2 beats
    if (pulseStep % 2 === 0) {
      const bassIndex = (pulseStep / 2) % minorBassPattern.length;
      const bassFreq = minorBassPattern[bassIndex];
      const bassOsc = c.createOscillator();
      const bassFilter = c.createBiquadFilter();
      const bassGain = c.createGain();

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, t);
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(560, t);

      bassGain.gain.setValueAtTime(0.11, t);
      bassGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.44);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(c.destination);
      bassOsc.start(t);
      bassOsc.stop(t + 0.46);

      // 3. Subtle detective mystery motif note
      const motifFreq = highMotif[bassIndex];
      if (motifFreq > 0) {
        const mOsc = c.createOscillator();
        const mGain = c.createGain();
        mOsc.type = 'sine';
        mOsc.frequency.setValueAtTime(motifFreq, t + 0.06);
        mGain.gain.setValueAtTime(0.042, t + 0.06);
        mGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.5);
        mOsc.connect(mGain);
        mGain.connect(c.destination);
        mOsc.start(t + 0.06);
        mOsc.stop(t + 0.52);
      }
    }

    pulseStep += 1;
  }, 620);
}

export function stopSuspenseAmbience() {
  if (ambienceTimer !== null) {
    window.clearInterval(ambienceTimer);
    ambienceTimer = null;
  }
  try {
    droneOscA?.stop();
  } catch {
    // ignore already stopped
  }
  try {
    droneOscB?.stop();
  } catch {
    // ignore already stopped
  }
  try {
    droneOscC?.stop();
  } catch {
    // ignore already stopped
  }
  droneOscA?.disconnect();
  droneOscB?.disconnect();
  droneOscC?.disconnect();
  ambienceGain?.disconnect();
  droneOscA = null;
  droneOscB = null;
  droneOscC = null;
  ambienceGain = null;
}

/** Crisp investigative click with subtle tense minor undertone */
export function playTileClick(muted: boolean) {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(360, now);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.045);
  gain.gain.setValueAtTime(0.095, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.055);
}

/** Tense mystery transition cue when opening a stage or advancing to a new clue */
export function playSuspenseCue(muted: boolean) {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const notes = [146.83, 174.61, 207.65];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now + i * 0.12);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(620, now + i * 0.12);
    gain.gain.setValueAtTime(0.09, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.42);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.45);
  });
}

/** Bright, cheerful rising major-chord bell sound when answering correctly */
export function playCorrectSound(muted: boolean) {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const startAt = now + i * 0.065;
    const osc = ctx.createOscillator();
    const shimmer = ctx.createOscillator();
    const gain = ctx.createGain();
    const shimmerGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startAt);

    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(freq * 2, startAt);

    gain.gain.setValueAtTime(0.18, startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.28);

    shimmerGain.gain.setValueAtTime(0.05, startAt);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.18);

    osc.connect(gain);
    shimmer.connect(shimmerGain);
    gain.connect(ctx.destination);
    shimmerGain.connect(ctx.destination);

    osc.start(startAt);
    osc.stop(startAt + 0.3);
    shimmer.start(startAt);
    shimmer.stop(startAt + 0.2);
  });
}

/** Tense, low detective warning sting on wrong attempt */
export function playWrongSound(muted: boolean) {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const notes = [155.56, 146.83];
  notes.forEach((freq, i) => {
    const startAt = now + i * 0.11;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startAt);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, startAt);
    gain.gain.setValueAtTime(0.11, startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.22);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + 0.24);
  });
}

/** Bright, cheerful stage-clear & culprit-caught fanfare */
export function playStageClearSound(muted: boolean) {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99, 880.0, 1046.5];
  notes.forEach((freq, i) => {
    const startAt = now + i * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startAt);
    gain.gain.setValueAtTime(0.18, startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.42);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + 0.44);
  });
}
