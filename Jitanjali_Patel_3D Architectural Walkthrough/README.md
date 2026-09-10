# Maison: 3D Architectural Walkthrough

An interactive, browser-based 3D architectural walkthrough of a furnished house. The experience lets visitors explore a complete home layout, look around freely, and move between rooms with real-time lighting, shadows, materials, and a live minimap.

## Live Experience

The walkthrough presents an 8-room residential floor plan:

- Entry Hall
- Living Room
- Dining Room
- Kitchen
- Study
- Master Bedroom
- Bedroom 2
- Bathroom

The house is arranged around a central hallway. Each space has its own floor finish, furniture, lighting details, windows, and architectural boundaries so that the walkthrough feels like a connected home rather than a collection of isolated scenes.

## Features

- Real-time 3D rendering in the browser with Three.js
- First-person architectural walkthrough camera
- Mouse and touch drag interaction for looking around
- Keyboard movement with `W`, `A`, `S`, `D` and arrow keys
- On-screen movement pad for desktop and mobile users
- Collision detection against walls and architectural boundaries
- Automatic room detection and room-name HUD
- Live minimap showing the visitor position and viewing direction
- Intro screen with project overview and room list
- Built-in tutorial for first-time visitors
- Procedurally generated wood, tile, wall, rug, and carpet textures
- Realistic material response using roughness, metalness, transparency, and emissive values
- Directional sunlight, hemisphere lighting, fill lighting, and room lamps
- Soft shadows and tone mapping for a more natural rendered result
- Responsive full-screen layout for desktop, tablet, and mobile screens

## Technology Used

- HTML5
- CSS3
- Vanilla JavaScript
- [Three.js](https://threejs.org/) `r128`
- WebGL
- HTML Canvas API for procedural textures and the minimap

Three.js is loaded from the cdnjs CDN in `walkthrough.html`, so an internet connection is required when opening the project unless the library is downloaded and served locally.

## Project Structure

```text
.
├── walkthrough.html   # Complete 3D walkthrough application
└── README.md          # Project documentation
```

The project is intentionally kept in a single HTML file, making it easy to share, preview, and deploy as a static web experience.

## How to Run

### Option 1: Open Directly

1. Download or clone this repository.
2. Open `walkthrough.html` in a modern web browser.
3. Click **Enter the walkthrough**.
4. Read the short tutorial and click **Got it, let's go**.

### Option 2: Use a Local Server

Serving the file locally is recommended for a consistent browser experience:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/walkthrough.html
```

You can also use the VS Code Live Server extension or any other static file server.

## Controls

### Look Around

- **Desktop:** Click and drag on the 3D view.
- **Mobile/tablet:** Touch and drag on the 3D view.

### Move

- `W` or `Arrow Up`: Move forward
- `S` or `Arrow Down`: Move backward
- `A` or `Arrow Left`: Move left
- `D` or `Arrow Right`: Move right
- **Touch/mouse:** Press and hold the directional buttons in the bottom-left corner

Movement is limited by the house boundaries and wall collision volumes, so the visitor cannot walk through the main architectural solids.

## How It Works

### Architectural Model

The house is built procedurally with Three.js box, plane, sphere, cone, and other geometry primitives. Helper functions such as `addBox`, `addWallSolid`, `wallAlongX`, `wallAlongZ`, and `floorSlab` keep the floor plan consistent and make the model easier to extend.

### Materials and Textures

The project uses `CanvasTexture` to generate several textures at runtime:

- Wood plank flooring with grain variation
- Kitchen and bathroom tile grids
- Wall texture with subtle surface noise
- Patterned rugs
- Carpet with randomized texture variation

These textures are combined with `MeshStandardMaterial`, `MeshPhysicalMaterial`, and other Three.js materials to create different surface responses.

### Lighting and Rendering

The scene combines:

- Hemisphere light for ambient sky and ground illumination
- Directional light for daylight and cast shadows
- Point lights for lamps, dining light, bedside light, kitchen lights, and study light
- ACES filmic tone mapping
- sRGB output encoding
- Soft shadow mapping

The renderer also adapts to window resizing and caps the pixel ratio to help maintain performance on high-density displays.

### Navigation and Room Detection

The camera moves at eye level and uses a small player radius for collision checks. Every animation frame updates movement, camera rotation, room detection, the minimap, and the WebGL render. The room label changes automatically as the visitor crosses into a new space.

## Customization Guide

Most changes can be made directly in `walkthrough.html`:

- **Add or move furniture:** edit the room sections and `addBox` calls.
- **Change room dimensions:** update the floor slabs, wall ranges, and collision solids together.
- **Change materials:** edit the `M` material collection or the procedural texture functions.
- **Adjust daylight:** change the `sun` position, color, or intensity.
- **Adjust lamp lighting:** edit the individual `PointLight` values in each room.
- **Change movement speed:** update the `speed` value inside `updatePlayer`.
- **Change the starting position:** update `camera.position`, `yaw`, and `pitch`.
- **Update room names:** keep `currentRoom()` and the intro room chips in sync.

When changing the floor plan, update the minimap rectangles in `drawMinimap()` as well so the map continues to match the model.

## Browser Requirements

Use a current version of Chrome, Edge, Firefox, or Safari with WebGL enabled. Performance depends on the device, browser, screen resolution, and graphics hardware. A desktop or laptop provides the smoothest experience, while mobile devices can use the on-screen movement pad.

## Deployment

Because this is a static HTML project, it can be deployed on services such as GitHub Pages, Netlify, Vercel static hosting, or any web server that serves HTML files. Upload `walkthrough.html` and `README.md`, then make sure the browser can access the Three.js CDN URL.

## Future Improvements

Possible extensions for a larger architectural visualization project include:

- GLTF/GLB model import from Blender
- Interactive doors, furniture, and material hotspots
- Room selection and guided camera tours
- First-person pointer-lock controls
- Preloading and locally hosting Three.js and texture assets
- Day/night lighting controls
- Screenshot and walkthrough recording support
- VR or WebXR support

## Credits

This project demonstrates procedural architectural modeling, texture mapping, lighting, rendering, and interactive navigation using HTML, JavaScript, WebGL, and Three.js.
