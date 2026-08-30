# Virtual Shopping Mall

## Abstract
The **Virtual Shopping Mall** is an interactive, 3D web-based environment designed to demonstrate fundamental Computer Graphics principles. Built using HTML5, CSS3, JavaScript, and the Three.js library, the project allows users to navigate a 3D space from a first-person perspective, explore four distinct retail stores, interact with procedurally generated 3D products, and use a functional shopping cart system. The focus of the project is to visibly demonstrate 3D modeling, transformations, perspective projection, lighting, and raycasting.

## Objectives
- To develop a fully immersive 3D environment representing a shopping mall.
- To demonstrate core Computer Graphics concepts (lighting, shading, perspective projection).
- To implement Raycasting for 3D object interaction.
- To provide a functional user interface integrated seamlessly with WebGL rendering.
- To maintain high performance without relying on heavy external assets.

## Technologies
- **HTML5**: UI structure and overlays.
- **CSS3**: HUD styling, responsive design.
- **JavaScript (ES6+)**: Core application logic.
- **Three.js**: 3D graphics rendering engine.
- **WebGL**: Underlying graphics API.
- **Vite**: Modern front-end build tool.

## Features
1. **First-Person Navigation**: Walk around the mall using W, A, S, D keys and mouse look.
2. **Four Unique Stores**: Explore Fashion, Electronics, Sports, and Home & Living stores.
3. **Interactive 3D Products**: 12 distinct products built using geometric primitives.
4. **Dynamic Raycasting**: Point at products to highlight them, and click to view details.
5. **Shopping Cart System**: Add items, adjust quantities, and calculate totals dynamically.
6. **Live Minimap**: A 2D HUD map that tracks the player's 3D coordinates in real-time.
7. **Multimedia Audio**: Procedurally generated ambient mall audio.
8. **Animations**: Rotating product displays and proximity-based sliding glass doors.

## Computer Graphics Concepts
- **3D Coordinates**: Placement of all walls, floors, and objects in (X, Y, Z) Cartesian space.
- **Geometric Primitives**: Use of Box, Sphere, Cylinder, Plane, and Torus geometries.
- **Transformations**: Translation, Rotation, and Scaling applied heavily (e.g., rotating stores to face the center, scaling products on hover).
- **Camera & Perspective Projection**: Use of a `PerspectiveCamera` to simulate human depth perception.
- **Lighting & Shadows**: Use of `AmbientLight`, `DirectionalLight`, `HemisphereLight`, and `PointLight`. Shadow maps are generated to simulate realism.
- **Materials**: Physically Based Rendering (PBR) using `MeshStandardMaterial` to simulate roughness and metalness.
- **Animation**: Utilizing the `requestAnimationFrame` API tied to a `Clock` delta for frame-independent animations.
- **Raycasting**: Shooting a mathematical ray from the camera center into the scene to detect mouse-to-object intersections.

## System Architecture
```text
User Input (Mouse/Keyboard)
         ↓
UI Layer / Controls
         ↓
Three.js Application Logic
         ↓
Scene Graph (Camera + Lighting + Meshes)
         ↓
Raycasting / Interaction System
         ↓
WebGL Renderer
         ↓
Browser Display Canvas
```

## Folder Structure
- `public/`: Static assets (audio).
- `src/`: Main source code.
  - `interaction/`: Controls and Raycasting logic.
  - `products/`: Data models and 3D object generation for products.
  - `scene/`: Core structural geometry and audio.
  - `shops/`: Code for the 4 distinct stores.
  - `ui/`: Cart, Minimap, and Product Panel logic.
  - `styles/`: CSS files.
- `index.html`: Main HTML entry point.
- `package.json`: Project dependencies.

## Installation & Running
1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Open a terminal in the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the URL provided (usually `http://localhost:3000` or `http://localhost:5173`).

## Controls
- **ENTER MALL**: Click the start button on the welcome screen.
- **W, A, S, D**: Move Forward, Left, Backward, Right.
- **Mouse**: Look around.
- **Left Click**: Select highlighted products.
- **ESC**: Release mouse lock to interact with the UI.

## Future Scope
- Integration with external 3D modeling software (e.g., Blender) to load complex GLTF/GLB models.
- Backend integration (Node.js/MongoDB) for saving user cart data and fetching live product prices.
- Multiplayer capabilities using WebSockets so multiple users can explore the mall together.
