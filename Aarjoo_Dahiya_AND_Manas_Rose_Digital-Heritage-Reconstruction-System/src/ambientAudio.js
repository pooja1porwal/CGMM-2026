/**
 * Web Audio API Ambient Heritage Soundscape Generator
 * Generates an organic, meditative ambient soundscape inspired by classical Indian tanpura drones
 * and temple reverberations without external audio assets.
 */

class AmbientSoundscape {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.masterGain = null;
        this.filter = null;
        this.droneOscs = [];
        this.chimeTimer = null;
    }

    init() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Lowpass filter for warm acoustic character
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = "lowpass";
        this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
        this.filter.connect(this.masterGain);
    }

    start() {
        this.init();
        if (!this.ctx) return false;

        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }

        if (this.isPlaying) return true;
        this.isPlaying = true;

        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(0.18, now + 3);

        // Tanpura-inspired fundamental frequencies (Sa - Pa - Sa' : D3 fundamental ~ 146.83 Hz)
        const freqs = [
            { f: 146.83, type: "sawtooth", gain: 0.08 }, // D3 (Tonic)
            { f: 220.00, type: "sine", gain: 0.12 },     // A3 (Pancham / 5th)
            { f: 293.66, type: "triangle", gain: 0.07 }, // D4 (Upper Tonic)
            { f: 73.42,  type: "sine", gain: 0.14 }      // D2 (Sub-bass warmth)
        ];

        this.droneOscs = freqs.map(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = item.type;
            osc.frequency.setValueAtTime(item.f, now);

            // Subtle gentle detune chorus
            osc.detune.setValueAtTime((Math.random() - 0.5) * 6, now);

            gain.gain.setValueAtTime(item.gain, now);
            osc.connect(gain);
            gain.connect(this.filter);
            osc.start(now);
            return { osc, gain };
        });

        // Filter breathing modulation
        this.scheduleBreathing();

        // Ambient temple bell / chime generator
        this.scheduleChimes();

        return true;
    }

    scheduleBreathing() {
        if (!this.isPlaying || !this.filter) return;
        const now = this.ctx.currentTime;
        const duration = 6;
        this.filter.frequency.linearRampToValueAtTime(650, now + duration / 2);
        this.filter.frequency.linearRampToValueAtTime(380, now + duration);
        setTimeout(() => this.scheduleBreathing(), duration * 1000);
    }

    scheduleChimes() {
        if (!this.isPlaying) return;
        const nextTime = 9000 + Math.random() * 8000;
        this.chimeTimer = setTimeout(() => {
            if (this.isPlaying) {
                this.playTempleChime();
                this.scheduleChimes();
            }
        }, nextTime);
    }

    playTempleChime() {
        if (!this.ctx || !this.isPlaying) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Pentatonic chime note
        const chimePitches = [587.33, 659.25, 783.99, 880.00, 1046.50];
        const pitch = chimePitches[Math.floor(Math.random() * chimePitches.length)];

        osc.type = "sine";
        osc.frequency.setValueAtTime(pitch, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 3.6);
    }

    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;

        if (this.chimeTimer) {
            clearTimeout(this.chimeTimer);
            this.chimeTimer = null;
        }

        if (this.ctx && this.masterGain) {
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

            setTimeout(() => {
                this.droneOscs.forEach(({ osc }) => {
                    try { osc.stop(); osc.disconnect(); } catch (e) {}
                });
                this.droneOscs = [];
            }, 1300);
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
            return false;
        } else {
            return this.start();
        }
    }
}

export const ambientSoundscape = new AmbientSoundscape();
