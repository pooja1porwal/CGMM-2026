import * as THREE from 'three';

let globalAudio = null;
let isMuted = false;
let audioContextStarted = false;

export function initAudio(camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  globalAudio = new THREE.Audio(listener);
  
  const audioLoader = new THREE.AudioLoader();
  
  // Attempt to load an ambient audio file.
  // Note: Place your audio file at public/audio/ambient.mp3
  audioLoader.load(
    './audio/ambient.mp3',
    function(buffer) {
      globalAudio.setBuffer(buffer);
      globalAudio.setLoop(true);
      globalAudio.setVolume(0.5);
    },
    function(xhr) {
      // Progress
    },
    function(err) {
      console.warn('Audio asset not found at ./audio/ambient.mp3. This is expected if the asset was not provided. Providing fallback synthetic hum.');
      
      // Fallback: Create a synthetic ambient hum using Web Audio API if asset is missing
      const ctx = listener.context;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 55; // Low hum
      
      gain.gain.value = 0.05; // Very quiet
      
      osc.connect(gain);
      gain.connect(listener.getInput());
      
      // Override play/pause to control the synthetic oscillator node
      globalAudio.play = () => {
        if (!audioContextStarted) {
          osc.start();
          audioContextStarted = true;
        }
        gain.gain.setTargetAtTime(0.05, ctx.currentTime, 0.1);
        globalAudio.isPlaying = true;
      };
      
      globalAudio.pause = () => {
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
        globalAudio.isPlaying = false;
      };
    }
  );

  const btnAudio = document.getElementById('btn-audio');
  
  // Start audio on first user interaction (Enter Mall)
  document.getElementById('enter-btn').addEventListener('click', () => {
    if (globalAudio && !globalAudio.isPlaying && !isMuted) {
      if (globalAudio.context.state === 'suspended') {
        globalAudio.context.resume();
      }
      try { globalAudio.play(); } catch(e) {}
    }
  });

  // Mute toggle button
  btnAudio.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
      btnAudio.textContent = '🔇 Unmute';
      if (globalAudio && globalAudio.isPlaying) {
        globalAudio.pause();
      }
    } else {
      btnAudio.textContent = '🔊 Mute';
      if (globalAudio && !globalAudio.isPlaying) {
        globalAudio.play();
      }
    }
  });
}
