export function updateMinimap(camera) {
  const playerDot = document.getElementById('minimap-player');
  if (!playerDot) return;

  const x = camera.position.x;
  const z = camera.position.z;

  // Mall Width: 60 (X: -30 to 30) -> Minimap Width: 150px
  // Mall Depth: 80 (Z: -40 to 40) -> Minimap Height: 200px
  // Scale = 2.5px per unit
  
  // Calculate left position (0px is X=-30, 150px is X=30)
  let leftPx = (x + 30) * 2.5;
  
  // Calculate top position (0px is Z=-40, 200px is Z=40)
  let topPx = (z + 40) * 2.5;

  // Clamp values so dot doesn't completely leave the map visually
  leftPx = Math.max(0, Math.min(150, leftPx));
  topPx = Math.max(0, Math.min(200, topPx));

  playerDot.style.left = `${leftPx}px`;
  playerDot.style.top = `${topPx}px`;
  
  const mapLabel = document.querySelector('.minimap-label');
  if (window.playerFloor !== undefined) {
    if (window.playerFloor === 1) {
      mapLabel.textContent = 'MALL MAP | FLOOR: 1';
    } else {
      mapLabel.textContent = 'MALL MAP | FLOOR: 2';
    }
  }
}
