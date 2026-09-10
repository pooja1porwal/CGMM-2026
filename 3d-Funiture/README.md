# Form & Space — 3D Furniture Visualization Lab

An interactive, frontend-only virtual room built as a Computer Graphics and Multimedia Systems (CGMS) project. It lets users add primitive-based furniture, select it through raycasting, apply transformations, alter PBR-style materials, control lighting, change projection modes, and save a scene locally.

## Run and deploy

```bash
npm install
npm run dev
npm run build
npm run preview
```

The `dist/` output is static and can be deployed directly to Vercel, Netlify, or GitHub Pages. No environment variables, server, database, or authentication are needed.

## Objectives and technology

The application demonstrates real-time interactive 3D graphics using **React**, **Vite**, **Three.js**, **React Three Fiber**, **Drei**, and browser **WebGL**. Furniture is intentionally composed from lightweight primitives, making geometric modelling clear during a demonstration: `BoxGeometry` makes upholstery/tabletops/cabinets, `CylinderGeometry` makes legs and lamp stems, `SphereGeometry` makes cabinet handles, and `PlaneGeometry` makes the room surfaces. The same component approach acts as a robust fallback if external GLTF/GLB assets are unavailable.

## CGMS concepts in this project

| Concept | How Form & Space demonstrates it |
| --- | --- |
| 3D coordinates | Every selected object exposes X, Y, Z position fields. Grid and RGB axis helper make the room coordinate space visible. |
| Translation, rotation, scaling | Inspector inputs and the Translate / Rotate / Scale gizmo modify `position`, Euler `rotation`, and `scale`. |
| Transformation matrix | Three.js composes the model matrix conceptually as **M = T × R × S** (translation × rotation × scaling) for each furniture group. |
| Scene graph | The room, lights, cameras, helpers, and furniture groups form a parent-child Three.js scene graph. |
| Perspective projection | The normal camera uses a `PerspectiveCamera` with a 48° field of view; objects farther away appear smaller. |
| Orthographic projection | Top, front, and side modes use `OrthographicCamera`, where parallel lines stay parallel and dimensions are easier to inspect. |
| Camera interaction | `OrbitControls` supports orbit, zoom, pan, and reset. Camera position and target determine the view. |
| Lighting and shading | Ambient, directional/key, and point lights illuminate `MeshStandardMaterial` surfaces using real-time physically based shading. |
| Materials | Wood, fabric, metal, plastic, and glass presets change color, roughness, metalness, and for glass transparency. |
| Texture mapping | The architecture reserves `public/textures/` for optional texture maps. The current clean primitive demo uses material colors to remain asset-light; a map can be assigned to the standard material `map` property. |
| Shadows | Directional and point lights, furniture `castShadow`, room `receiveShadow`, and a shadows toggle show real-time shadow mapping. |
| Depth testing | WebGL depth testing automatically retains the closest rasterized fragment, so furniture correctly occludes walls and other objects. |
| Raycasting | Clicking a mesh invokes React Three Fiber pointer events backed by Three.js raycasting, selecting that furniture item. |
| GLTF/GLB | GLTF/GLB is the web-friendly model format. Lightweight assets may be stored under `public/models/`; the primitive models guarantee a working visual fallback. |

## Rendering pipeline

```text
User interaction (click, inspector, orbit/gizmo)
                 ↓
React state + React Three Fiber components
                 ↓
Three.js scene graph (models, transforms, lights, camera)
                 ↓
WebGL renderer sends geometry/material data to GPU
                 ↓
Vertex processing → projection → rasterization → depth/light shading
                 ↓
Final pixels in the HTML canvas
```

React updates the compact scene state (`id`, `type`, `position`, `rotation`, `scale`, `color`, `material`). R3F reconciles it into Three.js objects. Three.js computes camera/view/model transformations and WebGL executes GPU rendering and rasterization.

## Multimedia Systems relevance

This is a real-time digital-media visualization: it represents 3D geometry, material color/transparency, interactive user input, camera output, and a raster image on screen. The Capture Preview feature serializes that rendered canvas as a PNG. The project focuses on relevant multimedia features rather than unrelated application services.

## Features

- Six furniture categories, virtual room, interactive selection highlight and transform gizmo
- XYZ transform controls, material/color customization, deletion and localStorage save/load/reset
- Perspective plus orthographic top/front/side views, OrbitControls, visible grid/axes
- Day, Warm Interior, and Night light presets with ambient, directional, point lights and switchable shadows
- Canvas screenshot capture and responsive academic-lab UI

## State and resilience

Only scene metadata is stored in `localStorage`, never model binaries. Loading checks for invalid or missing data and leaves the application usable. Empty scenes and deleted selections are handled safely. Primitive furniture keeps the view functional independently of network assets.
